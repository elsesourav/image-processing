import React from "react";
import type { GridData } from "../utils/grid-processor";

interface SelectionRegionPanelProps {
   selectedRegion: {
      x: number;
      y: number;
      width: number;
      height: number;
   } | null;
   originalGrid: GridData | null;
   processedGrid: GridData | null;
   className?: string;
}

export const SelectionRegionPanel: React.FC<SelectionRegionPanelProps> = ({
   selectedRegion,
   originalGrid,
   processedGrid,
   className = "",
}) => {
   if (!selectedRegion || !originalGrid || !processedGrid) {
      return (
         <div className={`border rounded-lg bg-card p-4 ${className}`}>
            <h3 className="text-sm font-medium mb-4">Selection Region</h3>
            <div className="text-center text-muted-foreground">
               <p>No region selected</p>
               <p className="text-xs mt-1">
                  Select a region on the input or output image to see pixel
                  values
               </p>
            </div>
         </div>
      );
   }

   // Extract pixel values for the selected region
   const getRegionValues = (grid: GridData) => {
      const values: number[][] = [];
      for (
         let y = selectedRegion.y;
         y < selectedRegion.y + selectedRegion.height;
         y++
      ) {
         const row: number[] = [];
         for (
            let x = selectedRegion.x;
            x < selectedRegion.x + selectedRegion.width;
            x++
         ) {
            if (y < grid.grid.length && x < grid.grid[0].length) {
               row.push(grid.grid[y][x]);
            } else {
               row.push(0); // Out of bounds
            }
         }
         values.push(row);
      }
      return values;
   };

   const originalValues = getRegionValues(originalGrid);
   const processedValues = getRegionValues(processedGrid);

   return (
      <div className={`border rounded-lg bg-card ${className}`}>
         <div className="p-3 border-b">
            <h3 className="text-sm font-medium">
               Selected Region ({selectedRegion.width}×{selectedRegion.height})
            </h3>
            <p className="text-xs text-muted-foreground">
               Position: ({selectedRegion.x}, {selectedRegion.y})
            </p>
         </div>

         <div className="p-4 overflow-auto max-h-96">
            {selectedRegion.width * selectedRegion.height > 200 ? (
               <div className="text-center text-muted-foreground">
                  <p>Region too large to display pixel values</p>
                  <p className="text-xs mt-1">
                     Select a smaller region (≤200 pixels) to see the 2D grid
                  </p>
               </div>
            ) : (
               <div className="space-y-4">
                  {/* Original Grid */}
                  <div>
                     <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                        Original Values
                     </h4>
                     <div className="overflow-auto border rounded">
                        <table className="text-xs">
                           <tbody>
                              {originalValues.map((row, y) => (
                                 <tr key={y}>
                                    {row.map((value, x) => (
                                       <td
                                          key={x}
                                          className="px-1 py-0.5 border-r border-b text-center min-w-[2rem] font-mono"
                                          style={{
                                             backgroundColor: `rgb(${value}, ${value}, ${value})`,
                                             color:
                                                value > 127 ? "#000" : "#fff",
                                          }}
                                       >
                                          {value}
                                       </td>
                                    ))}
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* Processed Grid */}
                  <div>
                     <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                        Processed Values
                     </h4>
                     <div className="overflow-auto border rounded">
                        <table className="text-xs">
                           <tbody>
                              {processedValues.map((row, y) => (
                                 <tr key={y}>
                                    {row.map((value, x) => (
                                       <td
                                          key={x}
                                          className="px-1 py-0.5 border-r border-b text-center min-w-[2rem] font-mono"
                                          style={{
                                             backgroundColor: `rgb(${value}, ${value}, ${value})`,
                                             color:
                                                value > 127 ? "#000" : "#fff",
                                          }}
                                       >
                                          {value}
                                       </td>
                                    ))}
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};
