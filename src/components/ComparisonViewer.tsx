import { Move } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ComparisonViewerProps {
   originalImageUrl: string | null;
   processedImageUrl: string | null;
   maxPixelRatio: number | "auto";
   smoothEdges: boolean;
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
      } else {
         // Show full comparison with divider
         const containerRect = container.getBoundingClientRect();
         const containerWidth = containerRect.width - 32;
         const containerHeight = containerRect.height - 80;

         const scaleX = containerWidth / originalImage.naturalWidth;
         const scaleY = containerHeight / originalImage.naturalHeight;
         const scale = Math.min(scaleX, scaleY, 1);

         const scaledWidth = originalImage.naturalWidth * scale;
         const scaledHeight = originalImage.naturalHeight * scale;
         const offsetX = (containerWidth - scaledWidth) / 2;
         const offsetY = (containerHeight - scaledHeight) / 2;

         // Calculate divider position in pixels
         const dividerX = (dividerPosition / 100) * scaledWidth + offsetX;

         // Draw original image (left side)
         ctx.save();
         ctx.beginPath();
         ctx.rect(offsetX, offsetY, dividerX - offsetX, scaledHeight);
         ctx.clip();
         ctx.drawImage(
            originalImage,
            0,
            0,
            originalImage.naturalWidth,
            originalImage.naturalHeight,
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight
         );
         ctx.restore();

         // Draw processed image (right side)
         ctx.save();
         ctx.beginPath();
         ctx.rect(
            dividerX,
            offsetY,
            offsetX + scaledWidth - dividerX,
            scaledHeight
         );
         ctx.clip();
         ctx.drawImage(
            processedImage,
            0,
            0,
            processedImage.naturalWidth,
            processedImage.naturalHeight,
            offsetX,
            offsetY,
            scaledWidth,
            scaledHeight
         );
         ctx.restore();

         // Draw divider line
         ctx.strokeStyle = "#ff0000";
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo(dividerX, offsetY);
         ctx.lineTo(dividerX, offsetY + scaledHeight);
         ctx.stroke();
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
         const container = containerRef.current;
         const containerRect = container.getBoundingClientRect();

         canvas.width = containerRect.width - 32;
         canvas.height = containerRect.height - 80;
      }
   }, [originalImage, processedImage]);

   useEffect(() => {
      drawRegionOrComparison();
   }, [drawRegionOrComparison]);

   const handleDividerMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDraggingDivider(true);
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (isDraggingDivider && !selectedRegion) {
         // Only allow divider dragging when not showing a selected region
         const container = containerRef.current;
         if (!container) return;

         const rect = container.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
         setDividerPosition(percentage);
      }
   };

   const handleMouseUp = () => {
      setIsDraggingDivider(false);
   };

   const getDividerStyle = () => {
      if (!originalImage || !containerRef.current || selectedRegion)
         return { display: "none" };

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const dividerX = (dividerPosition / 100) * rect.width;

      return {
         left: `${dividerX - 1}px`, // Center the 2px line
         height: `${rect.height - 80}px`, // Subtract header height
         top: "80px", // Header height
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
                  <canvas ref={canvasRef} className="absolute z-0 inset-0" />

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
