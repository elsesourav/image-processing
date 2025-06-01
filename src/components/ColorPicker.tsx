import React, { useCallback, useState } from "react";
import { cn } from "../lib/utils";

interface ColorPickerProps {
   initialColor?: { r: number; g: number; b: number };
   onColorChange: (color: { r: number; g: number; b: number }) => void;
   className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
   initialColor = { r: 128, g: 128, b: 128 },
   onColorChange,
   className,
}) => {
   const [color, setColor] = useState(initialColor);
   const [isOpen, setIsOpen] = useState(false);

   const handleColorChange = useCallback(
      (newColor: { r: number; g: number; b: number }) => {
         setColor(newColor);
         onColorChange(newColor);
      },
      [onColorChange]
   );

   const handleRgbChange = useCallback(
      (component: "r" | "g" | "b", value: string) => {
         const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
         const newColor = { ...color, [component]: numValue };
         handleColorChange(newColor);
      },
      [color, handleColorChange]
   );

   const handleHexChange = useCallback(
      (hex: string) => {
         // Remove # if present
         const cleanHex = hex.replace("#", "");
         if (cleanHex.length === 6) {
            const r = parseInt(cleanHex.substring(0, 2), 16);
            const g = parseInt(cleanHex.substring(2, 4), 16);
            const b = parseInt(cleanHex.substring(4, 6), 16);
            if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
               handleColorChange({ r, g, b });
            }
         }
      },
      [handleColorChange]
   );

   const rgbToHex = (r: number, g: number, b: number) => {
      return (
         "#" +
         [r, g, b]
            .map((x) => {
               const hex = x.toString(16);
               return hex.length === 1 ? "0" + hex : hex;
            })
            .join("")
      );
   };

   const colorStyle = {
      backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
   };

   return (
      <div className={cn("relative", className)}>
         {/* Color Display Button */}
         <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded border-2 border-gray-300 shadow-sm hover:shadow-md transition-shadow"
            style={colorStyle}
            title={`RGB(${color.r}, ${color.g}, ${color.b})`}
         />

         {/* Color Picker Dropdown */}
         {isOpen && (
            <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 min-w-64">
               {/* Color Preview */}
               <div className="mb-4">
                  <div
                     className="w-full h-12 rounded border border-gray-300"
                     style={colorStyle}
                  />
                  <p className="text-xs text-gray-600 mt-1 text-center">
                     RGB({color.r}, {color.g}, {color.b})
                  </p>
               </div>

               {/* RGB Input Fields */}
               <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                           R
                        </label>
                        <input
                           type="number"
                           min="0"
                           max="255"
                           value={color.r}
                           onChange={(e) =>
                              handleRgbChange("r", e.target.value)
                           }
                           className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                           G
                        </label>
                        <input
                           type="number"
                           min="0"
                           max="255"
                           value={color.g}
                           onChange={(e) =>
                              handleRgbChange("g", e.target.value)
                           }
                           className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                           B
                        </label>
                        <input
                           type="number"
                           min="0"
                           max="255"
                           value={color.b}
                           onChange={(e) =>
                              handleRgbChange("b", e.target.value)
                           }
                           className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                  </div>

                  {/* Hex Input */}
                  <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1">
                        Hex
                     </label>
                     <input
                        type="text"
                        value={rgbToHex(color.r, color.g, color.b)}
                        onChange={(e) => handleHexChange(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="#FFFFFF"
                     />
                  </div>

                  {/* Preset Colors */}
                  <div>
                     <label className="block text-xs font-medium text-gray-700 mb-2">
                        Presets
                     </label>
                     <div className="grid grid-cols-8 gap-1">
                        {[
                           { r: 0, g: 0, b: 0 }, // Black
                           { r: 255, g: 255, b: 255 }, // White
                           { r: 255, g: 0, b: 0 }, // Red
                           { r: 0, g: 255, b: 0 }, // Green
                           { r: 0, g: 0, b: 255 }, // Blue
                           { r: 255, g: 255, b: 0 }, // Yellow
                           { r: 255, g: 0, b: 255 }, // Magenta
                           { r: 0, g: 255, b: 255 }, // Cyan
                        ].map((presetColor, index) => (
                           <button
                              key={index}
                              type="button"
                              onClick={() => handleColorChange(presetColor)}
                              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                              style={{
                                 backgroundColor: `rgb(${presetColor.r}, ${presetColor.g}, ${presetColor.b})`,
                              }}
                              title={`RGB(${presetColor.r}, ${presetColor.g}, ${presetColor.b})`}
                           />
                        ))}
                     </div>
                  </div>
               </div>

               {/* Close Button */}
               <div className="mt-4 flex justify-end">
                  <button
                     type="button"
                     onClick={() => setIsOpen(false)}
                     className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                     Done
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};
