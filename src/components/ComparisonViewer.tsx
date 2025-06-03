import { Move } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ComparisonViewerProps {
   originalImageUrl: string | null;
   processedImageUrl: string | null;
   maxPixelRatio: number | "auto";
   smoothEdges: boolean;
   showPixelOutline: boolean;
   className?: string;
   selectedRegion?: {
      x: number;
      y: number;
      width: number;
      height: number;
   } | null;
   showZoomControls?: boolean; // Not used anymore but kept for compatibility
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
   originalImageUrl,
   processedImageUrl,
   maxPixelRatio,
   smoothEdges,
   showPixelOutline,
   className = "",
   selectedRegion,
}) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const dividerRef = useRef<HTMLDivElement>(null);

   const [dividerPosition, setDividerPosition] = useState(50); // Percentage from left
   const [isDraggingDivider, setIsDraggingDivider] = useState(false);

   const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
      null
   );
   const [processedImage, setProcessedImage] =
      useState<HTMLImageElement | null>(null);

   // Calculate optimal display size for the canvas
   const getDisplaySize = useCallback(() => {
      const container = containerRef.current;
      if (!container || !originalImage) return { width: 0, height: 0 };

      // Get available container space (accounting for padding and other elements)
      const containerRect = container.getBoundingClientRect();
      const availableWidth = containerRect.width - 32; // Account for padding
      const availableHeight = containerRect.height - 80; // Account for header/footer

      if (availableWidth <= 0 || availableHeight <= 0) {
         return { width: 0, height: 0 };
      }

      const imageAspect =
         originalImage.naturalWidth / originalImage.naturalHeight;
      const containerAspect = availableWidth / availableHeight;

      let displayWidth, displayHeight;

      if (imageAspect > containerAspect) {
         // Image is wider - fit to width
         displayWidth = availableWidth;
         displayHeight = availableWidth / imageAspect;
      } else {
         // Image is taller - fit to height
         displayHeight = availableHeight;
         displayWidth = availableHeight * imageAspect;
      }

      return { width: displayWidth, height: displayHeight };
   }, [originalImage]);

   const drawRegionOrComparison = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !container || !ctx || !originalImage || !processedImage)
         return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set image smoothing based on smooth edges setting
      ctx.imageSmoothingEnabled = smoothEdges;

      if (selectedRegion) {
         // Show only the selected region at actual pixel size (or scaled by maxPixelRatio)
         // Choose which image to show based on divider position
         const showOriginal = dividerPosition < 50;
         const imageToShow = showOriginal ? originalImage : processedImage;

         // Calculate pixel ratio scaling
         let pixelRatio = 1;
         if (maxPixelRatio !== "auto") {
            pixelRatio = maxPixelRatio / 100;
         }

         // Set canvas to match the scaled region size
         const scaledWidth = selectedRegion.width * pixelRatio;
         const scaledHeight = selectedRegion.height * pixelRatio;

         // Update canvas size to match the scaled region
         canvas.width = scaledWidth;
         canvas.height = scaledHeight;

         // Draw the selected region at actual size (scaled by pixel ratio)
         ctx.drawImage(
            imageToShow,
            selectedRegion.x,
            selectedRegion.y,
            selectedRegion.width,
            selectedRegion.height,
            0,
            0,
            scaledWidth,
            scaledHeight
         );

         // Draw pixel outline if enabled for selected region
         if (
            showPixelOutline &&
            typeof maxPixelRatio === "number" &&
            maxPixelRatio < 500
         ) {
            ctx.save();
            ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
            ctx.lineWidth = 0.5;
            ctx.setLineDash([]);

            // Only draw pixel grid if pixels are large enough to be visible
            if (pixelRatio >= 2) {
               // Draw vertical lines
               for (let x = 0; x <= selectedRegion.width; x++) {
                  const scaledX = x * pixelRatio;
                  ctx.beginPath();
                  ctx.moveTo(scaledX, 0);
                  ctx.lineTo(scaledX, scaledHeight);
                  ctx.stroke();
               }

               // Draw horizontal lines
               for (let y = 0; y <= selectedRegion.height; y++) {
                  const scaledY = y * pixelRatio;
                  ctx.beginPath();
                  ctx.moveTo(0, scaledY);
                  ctx.lineTo(scaledWidth, scaledY);
                  ctx.stroke();
               }
            }

            ctx.restore();
         }
      } else {
         // Show full comparison with divider
         // Set canvas to actual image size for maximum quality
         canvas.width = originalImage.naturalWidth;
         canvas.height = originalImage.naturalHeight;

         const canvasWidth = canvas.width;
         const canvasHeight = canvas.height;

         // Calculate divider position in pixels on the canvas
         const dividerX = (dividerPosition / 100) * canvasWidth;

         // Draw original image (left side)
         ctx.save();
         ctx.beginPath();
         ctx.rect(0, 0, dividerX, canvasHeight);
         ctx.clip();
         ctx.drawImage(
            originalImage,
            0,
            0,
            originalImage.naturalWidth,
            originalImage.naturalHeight,
            0,
            0,
            canvasWidth,
            canvasHeight
         );
         ctx.restore();

         // Draw processed image (right side)
         ctx.save();
         ctx.beginPath();
         ctx.rect(dividerX, 0, canvasWidth - dividerX, canvasHeight);
         ctx.clip();
         ctx.drawImage(
            processedImage,
            0,
            0,
            processedImage.naturalWidth,
            processedImage.naturalHeight,
            0,
            0,
            canvasWidth,
            canvasHeight
         );
         ctx.restore();

         // Draw divider line
         ctx.strokeStyle = "#ff0000";
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo(dividerX, 0);
         ctx.lineTo(dividerX, canvasHeight);
         ctx.stroke();

         // Draw pixel outline if enabled for full comparison
         if (
            showPixelOutline &&
            typeof maxPixelRatio === "number" &&
            maxPixelRatio < 500
         ) {
            ctx.save();
            ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
            ctx.lineWidth = 0.5;
            ctx.setLineDash([]);

            // Calculate current display scale to determine if pixel outline should be visible
            const displaySize = getDisplaySize();
            const displayScaleX = displaySize.width / canvasWidth;
            const displayScaleY = displaySize.height / canvasHeight;
            const displayScale = Math.min(displayScaleX, displayScaleY);

            // Only draw pixel grid if pixels are large enough to be visible when displayed
            if (displayScale >= 2) {
               // Draw vertical lines
               for (let x = 0; x <= originalImage.naturalWidth; x++) {
                  ctx.beginPath();
                  ctx.moveTo(x, 0);
                  ctx.lineTo(x, canvasHeight);
                  ctx.stroke();
               }

               // Draw horizontal lines
               for (let y = 0; y <= originalImage.naturalHeight; y++) {
                  ctx.beginPath();
                  ctx.moveTo(0, y);
                  ctx.lineTo(canvasWidth, y);
                  ctx.stroke();
               }
            }

            ctx.restore();
         }
      }
   }, [
      originalImage,
      processedImage,
      dividerPosition,
      smoothEdges,
      selectedRegion,
      maxPixelRatio,
   ]);

   // Load original image
   useEffect(() => {
      if (!originalImageUrl) return;

      const img = new Image();
      img.onload = () => {
         setOriginalImage(img);
      };
      img.src = originalImageUrl;
   }, [originalImageUrl]);

   // Load processed image
   useEffect(() => {
      if (!processedImageUrl) return;

      const img = new Image();
      img.onload = () => {
         setProcessedImage(img);
      };
      img.src = processedImageUrl;
   }, [processedImageUrl]);

   // Update canvas size when both images are loaded
   useEffect(() => {
      if (
         originalImage &&
         processedImage &&
         canvasRef.current &&
         containerRef.current
      ) {
         const canvas = canvasRef.current;

         if (selectedRegion) {
            // For selected region, set canvas to region size (scaled by maxPixelRatio)
            let pixelRatio = 1;
            if (maxPixelRatio !== "auto") {
               pixelRatio = maxPixelRatio / 100;
            }

            canvas.width = selectedRegion.width * pixelRatio;
            canvas.height = selectedRegion.height * pixelRatio;
         } else {
            // For full comparison, set canvas to actual image size for maximum quality
            canvas.width = originalImage.naturalWidth;
            canvas.height = originalImage.naturalHeight;
         }
      }
   }, [originalImage, processedImage, selectedRegion, maxPixelRatio]);

   useEffect(() => {
      drawRegionOrComparison();
   }, [drawRegionOrComparison]);

   const handleDividerMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDraggingDivider(true);
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (isDraggingDivider && !selectedRegion && containerRef.current) {
         const container = containerRef.current;
         const containerRect = container.getBoundingClientRect();

         // Calculate the actual displayed image bounds within the container
         const displaySize = getDisplaySize();
         const containerWidth = containerRect.width - 32; // Account for padding
         const containerHeight = containerRect.height - 80; // Account for header

         // Calculate image position within container (centered)
         const offsetX = 16 + (containerWidth - displaySize.width) / 2; // Padding + centering

         // Get mouse position relative to the displayed image
         const mouseX = e.clientX - containerRect.left;
         const imageMouseX = mouseX - offsetX;

         // Only update if mouse is within the displayed image bounds
         if (imageMouseX >= 0 && imageMouseX <= displaySize.width) {
            const percentage = Math.max(
               0,
               Math.min(100, (imageMouseX / displaySize.width) * 100)
            );
            setDividerPosition(percentage);
         }
      }
   };

   const handleMouseUp = () => {
      setIsDraggingDivider(false);
   };

   const getDividerStyle = () => {
      if (!originalImage || !containerRef.current || selectedRegion)
         return { display: "none" };

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      // Calculate the actual displayed image bounds within the container
      const displaySize = getDisplaySize();
      const containerWidth = containerRect.width - 32; // Account for padding
      const containerHeight = containerRect.height - 80; // Account for header

      // Calculate image position within container (centered)
      const offsetX = 16 + (containerWidth - displaySize.width) / 2; // Padding + centering
      const offsetY = 40 + (containerHeight - displaySize.height) / 2; // Header + centering

      // Calculate divider position within the displayed image
      const dividerX = offsetX + (dividerPosition / 100) * displaySize.width;

      return {
         left: `${dividerX - 1}px`, // Center the 2px line
         height: `${displaySize.height}px`, // Height of displayed image
         top: `${offsetY}px`, // Top position of displayed image
      };
   };

   return (
      <div
         className={`flex flex-col h-full border rounded-lg bg-card ${className}`}
      >
         <div className="flex items-center justify-between p-3 border-b">
            <h3 className="text-sm font-medium">
               {selectedRegion
                  ? `Selected Region (${selectedRegion.width}×${
                       selectedRegion.height
                    }) - ${dividerPosition < 50 ? "Original" : "Processed"}`
                  : "Comparison View (Drag red line to compare)"}
            </h3>
         </div>

         <div
            ref={containerRef}
            className="flex-1 overflow-hidden relative bg-muted/20"
            style={{
               cursor: isDraggingDivider ? "col-resize" : "default",
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
         >
            {originalImageUrl && processedImageUrl ? (
               <>
                  <canvas
                     ref={canvasRef}
                     className="absolute z-0 inset-0 m-auto"
                     style={{
                        imageRendering: smoothEdges ? "auto" : "pixelated",
                        ...(() => {
                           if (selectedRegion) {
                              // For selected regions, use the scaled region size
                              let pixelRatio = 1;
                              if (maxPixelRatio !== "auto") {
                                 pixelRatio = maxPixelRatio / 100;
                              }
                              return {
                                 width: `${
                                    selectedRegion.width * pixelRatio
                                 }px`,
                                 height: `${
                                    selectedRegion.height * pixelRatio
                                 }px`,
                              };
                           } else {
                              // For full comparison, use calculated display size
                              const displaySize = getDisplaySize();
                              return {
                                 width: `${displaySize.width}px`,
                                 height: `${displaySize.height}px`,
                              };
                           }
                        })(),
                     }}
                  />

                  {/* Draggable divider handle - only show when not displaying selected region */}
                  {!selectedRegion && (
                     <div
                        ref={dividerRef}
                        className="absolute z-10 w-1 bg-red-500 cursor-col-resize opacity-80 hover:opacity-100 transition-opacity"
                        style={getDividerStyle()}
                        onMouseDown={handleDividerMouseDown}
                     >
                        {/* Divider handle */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                           <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                     </div>
                  )}
               </>
            ) : (
               <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                     <Move className="h-8 w-8 mx-auto mb-2" />
                     <p>Loading images...</p>
                  </div>
               </div>
            )}
         </div>

         {/* Status bar */}
         <div className="p-2 border-t bg-muted/50 text-xs flex justify-between">
            <div>
               {selectedRegion
                  ? `Showing ${
                       dividerPosition < 50 ? "original" : "processed"
                    } region: (${selectedRegion.x}, ${selectedRegion.y}) ${
                       selectedRegion.width
                    }×${selectedRegion.height}`
                  : "Original Image (Left) | Processed Image (Right)"}
            </div>
            {!selectedRegion && (
               <div>Divider: {Math.round(dividerPosition)}%</div>
            )}
         </div>
      </div>
   );
};
