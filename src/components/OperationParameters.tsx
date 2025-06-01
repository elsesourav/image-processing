import React, { useCallback, useState } from "react";
import { cn } from "../lib/utils";
import { type ProcessingOperation } from "../types";
import { ColorPicker } from "./ColorPicker";

interface OperationParametersProps {
   operation: ProcessingOperation;
   onParametersChange: (
      parameters: Record<string, number | string | boolean>
   ) => void;
   onExecute: () => void;
   className?: string;
}

export const OperationParameters: React.FC<OperationParametersProps> = ({
   operation,
   onParametersChange,
   onExecute,
   className,
}) => {
   const [parameters, setParameters] = useState<
      Record<string, number | string | boolean>
   >(operation.parameters || {});

   const handleParameterChange = useCallback(
      (key: string, value: number | string | boolean) => {
         const newParameters = { ...parameters, [key]: value };
         setParameters(newParameters);
         onParametersChange(newParameters);
      },
      [parameters, onParametersChange]
   );

   const handleColorChange = useCallback(
      (color: { r: number; g: number; b: number }) => {
         // Convert RGB to a single value for the customValue parameter
         // We'll use a packed RGB format: (r << 16) | (g << 8) | b
         const packedValue = (color.r << 16) | (color.g << 8) | color.b;
         handleParameterChange("customValue", packedValue);
      },
      [handleParameterChange]
   );

   const getColorFromPackedValue = (
      value: number
   ): { r: number; g: number; b: number } => {
      return {
         r: (value >> 16) & 0xff,
         g: (value >> 8) & 0xff,
         b: value & 0xff,
      };
   };

   const renderParameterInput = (
      key: string,
      value: number | string | boolean
   ) => {
      // Special handling for custom padding color
      if (operation.id === "custom-padding" && key === "customValue") {
         const currentValue = typeof value === "number" ? value : 128;
         const color = getColorFromPackedValue(currentValue);

         return (
            <div key={key} className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700">
                  Padding Color:
               </label>
               <ColorPicker
                  initialColor={color}
                  onColorChange={handleColorChange}
               />
            </div>
         );
      }

      // Numeric input for size parameters
      if (
         key === "paddingSize" ||
         key === "factor" ||
         typeof value === "number"
      ) {
         return (
            <div key={key} className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700 capitalize">
                  {key
                     .replace(/([A-Z])/g, " $1")
                     .replace(/^./, (str) => str.toUpperCase())}
                  :
               </label>
               <input
                  type="number"
                  value={value as number}
                  onChange={(e) =>
                     handleParameterChange(key, parseFloat(e.target.value) || 0)
                  }
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={key === "paddingSize" ? 1 : undefined}
                  max={key === "paddingSize" ? 100 : undefined}
                  step={key === "factor" ? 0.1 : 1}
               />
            </div>
         );
      }

      // Boolean input for toggle parameters
      if (typeof value === "boolean") {
         return (
            <div key={key} className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700 capitalize">
                  {key
                     .replace(/([A-Z])/g, " $1")
                     .replace(/^./, (str) => str.toUpperCase())}
                  :
               </label>
               <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleParameterChange(key, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
            </div>
         );
      }

      // String input for text parameters
      return (
         <div key={key} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 capitalize">
               {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
               :
            </label>
            <input
               type="text"
               value={value as string}
               onChange={(e) => handleParameterChange(key, e.target.value)}
               className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
         </div>
      );
   };

   const getDefaultParameters = () => {
      const defaults: Record<string, number | string | boolean> = {};

      // Set default parameters based on operation type
      if (operation.id.includes("padding")) {
         defaults.paddingSize = 10;
         if (operation.id === "custom-padding") {
            defaults.customValue = (128 << 16) | (128 << 8) | 128; // Default gray color
         }
      } else if (operation.id === "contrast") {
         defaults.factor = 1.5;
      }

      return defaults;
   };

   const currentParameters = { ...getDefaultParameters(), ...parameters };

   return (
      <div
         className={cn(
            "bg-white border border-gray-200 rounded-lg p-4 shadow-sm",
            className
         )}
      >
         <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
               {operation.name}
            </h3>
         </div>

         <p className="text-sm text-gray-600 mb-4">{operation.description}</p>

         {Object.keys(currentParameters).length > 0 && (
            <div className="space-y-3 mb-4">
               <h4 className="text-sm font-medium text-gray-700">
                  Parameters:
               </h4>
               {Object.entries(currentParameters).map(([key, value]) =>
                  renderParameterInput(key, value)
               )}
            </div>
         )}

         <button
            onClick={onExecute}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
         >
            Apply {operation.name}
         </button>
      </div>
   );
};
