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
   onClose?: () => void;
   className?: string;
}

export const OperationParameters: React.FC<OperationParametersProps> = ({
   operation,
   onParametersChange,
   onExecute,
   onClose,
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
            <div key={key} className="flex items-center gap-1">
               <label className="text-xs font-medium text-gray-700">
                  Color:
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
            <div key={key} className="flex items-center gap-1">
               <label className="text-xs font-medium text-gray-700 capitalize">
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
                  className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <div key={key} className="flex items-center gap-1">
               <label className="text-xs font-medium text-gray-700 capitalize">
                  {key
                     .replace(/([A-Z])/g, " $1")
                     .replace(/^./, (str) => str.toUpperCase())}
                  :
               </label>
               <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleParameterChange(key, e.target.checked)}
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
            </div>
         );
      }

      // String input for text parameters
      return (
         <div key={key} className="flex items-center gap-1">
            <label className="text-xs font-medium text-gray-700 capitalize">
               {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
               :
            </label>
            <input
               type="text"
               value={value as string}
               onChange={(e) => handleParameterChange(key, e.target.value)}
               className="w-24 px-1 py-0.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            "bg-blue-50 border border-blue-200 rounded p-2",
            className
         )}
      >
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
               <h4 className="text-sm font-medium text-gray-900">
                  {operation.name}
               </h4>
               <button
                  onClick={onExecute}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none transition-colors"
               >
                  Apply
               </button>
            </div>
            <button
               onClick={onClose}
               className="text-gray-400 hover:text-gray-600 focus:outline-none"
               title="Close"
            >
               ✕
            </button>
         </div>

         {Object.keys(currentParameters).length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
               {Object.entries(currentParameters).map(([key, value]) =>
                  renderParameterInput(key, value)
               )}
            </div>
         )}
      </div>
   );
};
