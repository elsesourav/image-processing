import { Move } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GridProcessor } from "../utils/grid-processor";

interface ImageViewerProps {
   imageUrl: string | null;
   title: string;
   showPixelInfo?: boolean;
   maxPixelRatio?: number | "auto";
   smoothEdges?: boolean;
   showPixelOutline?: boolean;
   className?: string;
   fitToContainer?: boolean; // New prop to control fitting behavior
   enableRegionSelection?: boolean; // New prop to enable region selection
   onRegionSelect?: (
      region: { x: number; y: number; width: number; height: number } | null
   ) => void; // Callback for region selection
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
   imageUrl,
   title,
   showPixelInfo = false,
   maxPixelRatio = 100,
   smoothEdges = false,
   showPixelOutline = false,
   className = "",
   fitToContainer = true, // Default to fitting
   enableRegionSelection = false,
   onRegionSelect,
}) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const imageContainerRef = useRef<HTMLDivElement>(null); // New ref for image container with selection overlay
   const [pixelInfo, setPixelInfo] = useState<{
      x: number;
      y: number;
      r: number;
      g: number;
      b: number;
      a: number;
   } | null>(null);
   const [imageData, setImageData] = useState<HTMLImageElement | null>(null);

   // HTML/CSS/JS-based region selection state
   const [isSelecting, setIsSelecting] = useState(false);
   const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
   const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
   const [selectedRegion, setSelectedRegion] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
   } | null>(null);
   const [selectedDisplayRegion, setSelectedDisplayRegion] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
   } | null>(null); // For display coordinates on overlay

   // Calculate optimal display size for the canvas - prioritize height and adjust width to eliminate extra space
   const getDisplaySize = useCallback(() => {
      const container = containerRef.current;
      if (!container || !imageData)
         return { width: 0, height: 0, containerWidth: 0 };

      // Get available container space
      const containerRect = container.getBoundingClientRect();
      const availableWidth = containerRect.width - 16; // Small padding
      const availableHeight = containerRect.height - 16; // Small padding

      if (availableWidth <= 0 || availableHeight <= 0) {
         return { width: 0, height: 0, containerWidth: availableWidth };
      }

      const imageAspect = imageData.naturalWidth / imageData.naturalHeight;

      // Always prioritize fitting to height and calculate width accordingly
      const displayHeight = availableHeight;
      const displayWidth = displayHeight * imageAspect;

      // If calculated width exceeds available width, then fit to width instead
      if (displayWidth > availableWidth) {
         return {
            width: availableWidth,
            height: availableWidth / imageAspect,
            containerWidth: availableWidth,
         };
      }

      // Return dimensions that fit the height and the actual container width for adjustment
      return {
         width: displayWidth,
         height: displayHeight,
         containerWidth: availableWidth,
      };
   }, [imageData]);

   const drawImage = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const container = containerRef.current;
      if (!canvas || !ctx || !imageData || !container) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // For grid-based rendering, we'll convert the image to grid and then render
      // This allows us to apply max pixel ratio scaling properly
      const gridData = GridProcessor.imageToGrid(imageData);

      // Draw the grid to canvas with proper scaling
      GridProcessor.drawGridToCanvas(
         canvas,
         gridData,
         typeof maxPixelRatio === "number" ? maxPixelRatio : "auto"
      );

      // Draw pixel outline if enabled
      if (
         showPixelOutline &&
         typeof maxPixelRatio === "number" &&
         maxPixelRatio < 500
      ) {
         const effectiveScale = maxPixelRatio / 100;

         // Only draw pixel grid if pixels are large enough to be visible
         if (effectiveScale >= 2) {
            ctx.save();
            ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
            ctx.lineWidth = 0.5;
            ctx.setLineDash([]);

            const gridWidth = gridData.grid[0].length;
            const gridHeight = gridData.grid.length;

            // Draw vertical lines
            for (let x = 0; x <= gridWidth; x++) {
               ctx.beginPath();
               ctx.moveTo(x * effectiveScale, 0);
               ctx.lineTo(x * effectiveScale, gridHeight * effectiveScale);
               ctx.stroke();
            }

            // Draw horizontal lines
            for (let y = 0; y <= gridHeight; y++) {
               ctx.beginPath();
               ctx.moveTo(0, y * effectiveScale);
               ctx.lineTo(gridWidth * effectiveScale, y * effectiveScale);
               ctx.stroke();
            }

            ctx.restore();
         }
      }

      // Draw region selection overlay if enabled and selecting
      if (enableRegionSelection && isSelecting) {
         ctx.save();

         // Calculate selection rectangle in canvas coordinates
         const canvasRect = canvas.getBoundingClientRect();
         const scaleX = canvas.width / canvasRect.width;
         const scaleY = canvas.height / canvasRect.height;

         const rect = Math.min(
            selectionStart.x * scaleX,
            selectionEnd.x * scaleX
         );
         const rectY = Math.min(
            selectionStart.y * scaleY,
            selectionEnd.y * scaleY
         );
         const rectWidth = Math.abs(
            (selectionEnd.x - selectionStart.x) * scaleX
         );
         const rectHeight = Math.abs(
            (selectionEnd.y - selectionStart.y) * scaleY
         );

         // Draw selection rectangle
         ctx.strokeStyle = "#0066ff";
         ctx.lineWidth = 2;
         ctx.setLineDash([5, 5]);
         ctx.strokeRect(rect, rectY, rectWidth, rectHeight);

         // Draw semi-transparent overlay
         ctx.fillStyle = "rgba(0, 102, 255, 0.1)";
         ctx.fillRect(rect, rectY, rectWidth, rectHeight);

         ctx.restore();
      }

      // Draw selected region highlight if there's a selection
      if (enableRegionSelection && selectedRegion && fitToContainer) {
         ctx.save();

         const canvasX = selectedRegion.x;
         const canvasY = selectedRegion.y;
         const canvasWidth = selectedRegion.width;
         const canvasHeight = selectedRegion.height;

         // Draw selection border
         ctx.strokeStyle = "#ff6600";
         ctx.lineWidth = 3;
         ctx.setLineDash([]);
         ctx.strokeRect(canvasX, canvasY, canvasWidth, canvasHeight);

         ctx.restore();
      }
   }, [
      imageData,
      maxPixelRatio,
      smoothEdges,
      showPixelOutline,
      fitToContainer,
      enableRegionSelection,
      isSelecting,
      selectionStart,
      selectionEnd,
      selectedRegion,
   ]);

   useEffect(() => {
      if (!imageUrl) return;

      const img = new Image();
      img.onload = () => {
         setImageData(img);
         const canvas = canvasRef.current;
         if (canvas) {
            // Always set canvas to actual image size for maximum quality
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
         }
      };
      img.src = imageUrl;
   }, [imageUrl]);

   // Remove the resize observer since we're not using container sizing anymore
   useEffect(() => {
      drawImage();
   }, [drawImage]);

   const handleMouseDown = (e: React.MouseEvent) => {
      if (enableRegionSelection && fitToContainer) {
         // Start region selection - use overlay div coordinates
         const target = e.currentTarget as HTMLElement;
         const rect = target.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;

         setIsSelecting(true);
         setSelectionStart({ x, y });
         setSelectionEnd({ x, y });
      }
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (enableRegionSelection && isSelecting && fitToContainer) {
         // Update selection rectangle - use overlay div coordinates
         const target = e.currentTarget as HTMLElement;
         const rect = target.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;

         setSelectionEnd({ x, y });
      }

      // Show pixel information if enabled
      if (
         showPixelInfo &&
         imageData &&
         canvasRef.current &&
         !enableRegionSelection
      ) {
         const canvas = canvasRef.current;
         const rect = canvas.getBoundingClientRect();

         // Calculate coordinates in the image space
         let imageX, imageY;

         if (fitToContainer) {
            // For fit mode, calculate image coordinates based on direct canvas dimensions
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            imageX = Math.floor((e.clientX - rect.left) * scaleX);
            imageY = Math.floor((e.clientY - rect.top) * scaleY);
         } else {
            // For non-fit mode, account for maxPixelRatio scaling
            const scaleMultiplier =
               maxPixelRatio === "auto" ? 1 : maxPixelRatio / 100;
            imageX = Math.floor((e.clientX - rect.left) / scaleMultiplier);
            imageY = Math.floor((e.clientY - rect.top) / scaleMultiplier);
         }

         if (
            imageX >= 0 &&
            imageX < imageData.naturalWidth &&
            imageY >= 0 &&
            imageY < imageData.naturalHeight
         ) {
            // Get pixel data from the canvas
            const ctx = canvas.getContext("2d");
            if (ctx) {
               const pixelData = ctx.getImageData(imageX, imageY, 1, 1);
               const data = pixelData.data;
               setPixelInfo({
                  x: imageX,
                  y: imageY,
                  r: data[0],
                  g: data[1],
                  b: data[2],
                  a: data[3],
               });
            }
         }
      }
   };

   const handleMouseUp = (e: React.MouseEvent) => {
      if (enableRegionSelection && isSelecting && fitToContainer) {
         // Complete region selection
         const canvas = canvasRef.current;
         if (!canvas || !imageData) return;

         const target = e.currentTarget as HTMLElement;
         const targetRect = target.getBoundingClientRect();
         const endX = e.clientX - targetRect.left;
         const endY = e.clientY - targetRect.top;

         // Get display size for scale calculation
         const displaySize = getDisplaySize();

         // Calculate the scale between overlay coordinates and image coordinates
         const scaleX = imageData.naturalWidth / displaySize.width;
         const scaleY = imageData.naturalHeight / displaySize.height;

         // Convert selection coordinates to image space
         const imageStartX = Math.max(
            0,
            Math.min(selectionStart.x * scaleX, endX * scaleX)
         );
         const imageStartY = Math.max(
            0,
            Math.min(selectionStart.y * scaleY, endY * scaleY)
         );
         const imageEndX = Math.min(
            imageData.naturalWidth,
            Math.max(selectionStart.x * scaleX, endX * scaleX)
         );
         const imageEndY = Math.min(
            imageData.naturalHeight,
            Math.max(selectionStart.y * scaleY, endY * scaleY)
         );

         const width = imageEndX - imageStartX;
         const height = imageEndY - imageStartY;

         // Only create region if it has meaningful size
         if (width > 10 && height > 10) {
            const region = {
               x: Math.round(imageStartX),
               y: Math.round(imageStartY),
               width: Math.round(width),
               height: Math.round(height),
            };
            setSelectedRegion(region);
            onRegionSelect?.(region);
         } else {
            // Clear selection if too small
            setSelectedRegion(null);
            onRegionSelect?.(null);
         }

         setIsSelecting(false);
      }
   };

   return (
      <div
         className={`flex flex-col h-full border rounded-lg bg-card overflow-hidden ${className}`}
      >
         <div className="flex items-center justify-between p-2 border-b flex-shrink-0">
            <h3 className="text-xs font-normal text-muted-foreground">
               {title}
            </h3>
         </div>

         <div
            ref={containerRef}
            className="flex-1 overflow-hidden relative bg-muted/20 min-h-0 flex items-center justify-center"
            style={{
               cursor:
                  enableRegionSelection && fitToContainer
                     ? isSelecting
                        ? "crosshair"
                        : "crosshair"
                     : "default",
               // Adjust container width to eliminate extra space
               ...(fitToContainer && imageData
                  ? (() => {
                       const displaySize = getDisplaySize();
                       // If image width is less than container width, adjust container width
                       if (displaySize.width < displaySize.containerWidth) {
                          return {
                             width: `${displaySize.width + 16}px`, // Add padding back
                             margin: "0 auto", // Center the adjusted container
                             minWidth: `${displaySize.width + 16}px`,
                          };
                       }
                       return {};
                    })()
                  : {}),
            }}
         >
            {imageUrl ? (
               <>
                  <canvas
                     ref={canvasRef}
                     className={`${
                        fitToContainer ? "block" : "absolute top-0 left-0"
                     }`}
                     style={{
                        imageRendering: smoothEdges ? "auto" : "pixelated",
                        ...(fitToContainer
                           ? (() => {
                                const displaySize = getDisplaySize();
                                return {
                                   width: `${displaySize.width}px`,
                                   height: `${displaySize.height}px`,
                                };
                             })()
                           : {
                                transform: `scale(${
                                   maxPixelRatio === "auto"
                                      ? 1
                                      : maxPixelRatio / 100
                                })`,
                                transformOrigin: "top left",
                             }),
                     }}
                  />

                  {/* HTML/CSS Selection Overlay */}
                  {enableRegionSelection && fitToContainer && (
                     <div
                        ref={imageContainerRef}
                        className="absolute inset-0 z-10 flex items-center justify-center"
                        style={{ pointerEvents: "auto" }}
                     >
                        <div
                           className="relative"
                           onMouseDown={handleMouseDown}
                           onMouseMove={handleMouseMove}
                           onMouseUp={handleMouseUp}
                           onMouseLeave={handleMouseUp}
                           style={{
                              width: `${getDisplaySize().width}px`,
                              height: `${getDisplaySize().height}px`,
                           }}
                        >
                           {/* Selection rectangle overlay */}
                           {isSelecting && (
                              <div
                                 className="absolute border-2 border-blue-500 bg-blue-500/20"
                                 style={{
                                    left: `${Math.min(
                                       selectionStart.x,
                                       selectionEnd.x
                                    )}px`,
                                    top: `${Math.min(
                                       selectionStart.y,
                                       selectionEnd.y
                                    )}px`,
                                    width: `${Math.abs(
                                       selectionEnd.x - selectionStart.x
                                    )}px`,
                                    height: `${Math.abs(
                                       selectionEnd.y - selectionStart.y
                                    )}px`,
                                    pointerEvents: "none",
                                 }}
                              />
                           )}

                           {/* Show completed selection */}
                           {selectedRegion && !isSelecting && (
                              <div
                                 className="absolute border-2 border-green-500 bg-green-500/10"
                                 style={{
                                    left: `${selectedRegion.x}px`,
                                    top: `${selectedRegion.y}px`,
                                    width: `${selectedRegion.width}px`,
                                    height: `${selectedRegion.height}px`,
                                    pointerEvents: "none",
                                 }}
                              />
                           )}
                        </div>
                     </div>
                  )}
               </>
            ) : (
               <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                     <Move className="h-8 w-8 mx-auto mb-2" />
                     <p>No image loaded</p>
                  </div>
               </div>
            )}
         </div>

         {showPixelInfo && pixelInfo && (
            <div className="p-2 border-t bg-muted/50 text-xs flex-shrink-0">
               <div className="grid grid-cols-2 gap-2">
                  <div>
                     Position: ({pixelInfo.x}, {pixelInfo.y})
                  </div>
                  <div>
                     RGBA: ({pixelInfo.r}, {pixelInfo.g}, {pixelInfo.b},{" "}
                     {pixelInfo.a})
                  </div>
               </div>
            </div>
         )}

         {enableRegionSelection && selectedRegion && (
            <div className="p-2 border-t bg-muted/50 text-xs flex-shrink-0">
               <div className="grid grid-cols-2 gap-2">
                  <div>
                     Region: ({selectedRegion.x}, {selectedRegion.y})
                  </div>
                  <div>
                     Size: {selectedRegion.width} × {selectedRegion.height}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
