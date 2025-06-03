import {
   Check,
   GitCompare,
   Image,
   Settings,
   ToggleLeft,
   ToggleRight,
} from "lucide-react";
import React, { useCallback, useState } from "react";
import { cn } from "../lib/utils";

interface TopToolbarProps {
   onSave: () => void;
   onScaleChange: (scale: number | "auto") => void;
   onSmoothEdgesToggle: (enabled: boolean) => void;
   onCompareToggle: (enabled: boolean) => void;
   maxPixelRatio: number | "auto";
   smoothEdges: boolean;
   compareMode: boolean;
   disabled?: boolean;
}

const SCALE_PRESETS = [
   { label: "50", value: 50 },
   { label: "100", value: 100 },
   { label: "200", value: 200 },
   { label: "500", value: 500 },
   { label: "Custom", value: "custom" },
] as const;

export const TopToolbar: React.FC<TopToolbarProps> = ({
   onSave,
   onScaleChange,
   onSmoothEdgesToggle,
   onCompareToggle,
   maxPixelRatio,
   smoothEdges,
   compareMode,
   disabled = false,
}) => {
   const [showCustomScale, setShowCustomScale] = useState(false);
   const [customScaleValue, setCustomScaleValue] = useState<number>(
      maxPixelRatio === "auto" ? 100 : maxPixelRatio
   );

   const handleScalePresetChange = useCallback(
      (value: string) => {
         if (value === "custom") {
            setShowCustomScale(true);
         } else {
            setShowCustomScale(false);
            const numValue = parseInt(value);
            onScaleChange(numValue);
         }
      },
      [onScaleChange]
   );

   const handleCustomScaleSubmit = useCallback(() => {
      onScaleChange(customScaleValue);
      setShowCustomScale(false);
   }, [customScaleValue, onScaleChange]);

   const handleCustomScaleCancel = useCallback(() => {
      setShowCustomScale(false);
      setCustomScaleValue(maxPixelRatio === "auto" ? 100 : maxPixelRatio);
   }, [maxPixelRatio]);

   return (
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
         {/* Left Section - Save Button */}
         <div className="flex items-center space-x-3">
            <button
               onClick={onSave}
               disabled={disabled}
               className={cn(
                  "flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors",
                  disabled
                     ? "opacity-50 cursor-not-allowed"
                     : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
               )}
               title="Apply processed result to original image"
            >
               <Check size={16} />
               <span className="font-medium">Apply</span>
            </button>
         </div>

         {/* Center Section - Scale Controls */}
         <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
               <Image size={16} className="text-gray-600" />
               <span className="text-sm font-medium text-gray-700">Max Pixel Ratio:</span>

               {!showCustomScale ? (
                  <select
                     value={maxPixelRatio === "auto" ? "auto" : maxPixelRatio}
                     onChange={(e) => handleScalePresetChange(e.target.value)}
                     disabled={disabled}
                     className={cn(
                        "px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                        disabled && "opacity-50 cursor-not-allowed"
                     )}
                  >
                     {SCALE_PRESETS.map((preset) => (
                        <option key={preset.label} value={preset.value}>
                           {preset.label}
                        </option>
                     ))}
                  </select>
               ) : (
                  <div className="flex items-center space-x-2">
                     <input
                        type="number"
                        value={customScaleValue}
                        onChange={(e) =>
                           setCustomScaleValue(parseInt(e.target.value) || 100)
                        }
                        min="10"
                        max="2000"
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="100"
                     />
                     <button
                        onClick={handleCustomScaleSubmit}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                     >
                        ✓
                     </button>
                     <button
                        onClick={handleCustomScaleCancel}
                        className="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors"
                     >
                        ✕
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* Right Section - Toggle Controls */}
         <div className="flex items-center space-x-4">
            {/* Smooth Edges Toggle */}
            <div className="flex items-center space-x-2">
               <Settings size={16} className="text-gray-600" />
               <span className="text-sm font-medium text-gray-700">
                  Smooth Edges:
               </span>
               <button
                  onClick={() => onSmoothEdgesToggle(!smoothEdges)}
                  disabled={disabled}
                  className={cn(
                     "flex items-center p-1 rounded-md transition-colors",
                     disabled && "opacity-50 cursor-not-allowed",
                     smoothEdges
                        ? "text-blue-600 hover:bg-blue-50"
                        : "text-gray-400 hover:bg-gray-50"
                  )}
                  title={`${smoothEdges ? "Disable" : "Enable"} smooth edges`}
               >
                  {smoothEdges ? (
                     <ToggleRight size={20} />
                  ) : (
                     <ToggleLeft size={20} />
                  )}
               </button>
            </div>

            {/* Compare Mode Toggle */}
            <div className="flex items-center space-x-2">
               <GitCompare size={16} className="text-gray-600" />
               <span className="text-sm font-medium text-gray-700">
                  Compare:
               </span>
               <button
                  onClick={() => onCompareToggle(!compareMode)}
                  disabled={disabled}
                  className={cn(
                     "flex items-center p-1 rounded-md transition-colors",
                     disabled && "opacity-50 cursor-not-allowed",
                     compareMode
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-50"
                  )}
                  title={`${
                     compareMode ? "Disable" : "Enable"
                  } input/output comparison`}
               >
                  {compareMode ? (
                     <ToggleRight size={20} />
                  ) : (
                     <ToggleLeft size={20} />
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};
