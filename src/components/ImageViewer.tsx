import { Move } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

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
   const [pixelInfo, setPixelInfo] = useState<{
      x: number;
      y: number;
      r: number;
      g: number;
      b: number;
      a: number;
   } | null>(null);
   const [imageData, setImageData] = useState<HTMLImageElement | null>(null);

   // Region selection state
   const [isSelecting, setIsSelecting] = useState(false);
   const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
   const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
   const [selectedRegion, setSelectedRegion] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
   } | null>(null);

   // Calculate optimal display size for the canvas
   const getDisplaySize = useCallback(() => {
      const container = containerRef.current;
      if (!container || !imageData) return { width: 0, height: 0 };

      // Get available container space (accounting for padding and other elements)
      const containerRect = container.getBoundingClientRect();
      const availableWidth = containerRect.width - 32; // Account for padding
      const availableHeight = containerRect.height - 80; // Account for header/footer

      if (availableWidth <= 0 || availableHeight <= 0) {
         return { width: 0, height: 0 };
      }

      const imageAspect = imageData.naturalWidth / imageData.naturalHeight;
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
   }, [imageData]);

   const drawImage = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const container = containerRef.current;
      if (!canvas || !ctx || !imageData || !container) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();

      // Canvas is now always at actual image size, so just apply maxPixelRatio scaling if not fitToContainer
      if (!fitToContainer) {
         // Apply scale from toolbar only when not fitting to container
         let scaleMultiplier = 1;
         if (maxPixelRatio !== "auto") {
            scaleMultiplier = maxPixelRatio / 100;
         }
         ctx.scale(scaleMultiplier, scaleMultiplier);
      }

      // Set image smoothing based on smooth edges setting
      ctx.imageSmoothingEnabled = smoothEdges;

      // Draw image at actual size (canvas is already sized correctly)
      const imgWidth = imageData.naturalWidth;
      const imgHeight = imageData.naturalHeight;
      ctx.drawImage(imageData, 0, 0, imgWidth, imgHeight);

      // Draw pixel outline if enabled
      if (
         showPixelOutline &&
         typeof maxPixelRatio === "number" &&
         maxPixelRatio < 500
      ) {
         ctx.save();

         // Calculate current display scale to determine if pixel outline should be visible
         let effectiveScale = 1;

         if (fitToContainer) {
            // Calculate how much the canvas is scaled when displayed
            const displaySize = getDisplaySize();
            const displayScaleX = displaySize.width / canvas.width;
            const displayScaleY = displaySize.height / canvas.height;
            effectiveScale = Math.min(displayScaleX, displayScaleY);
         } else {
            effectiveScale = maxPixelRatio / 100;
         }

         // Only draw pixel grid if pixels are large enough to be visible
         if (effectiveScale >= 2) {
            ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
            ctx.lineWidth = 0.5;
            ctx.setLineDash([]);

            // Draw vertical lines
            for (let x = 0; x <= imgWidth; x++) {
               ctx.beginPath();
               ctx.moveTo(x, 0);
               ctx.lineTo(x, imgHeight);
               ctx.stroke();
            }

            // Draw horizontal lines
            for (let y = 0; y <= imgHeight; y++) {
               ctx.beginPath();
               ctx.moveTo(0, y);
               ctx.lineTo(imgWidth, y);
               ctx.stroke();
            }
         }

         ctx.restore();
      }

      // Restore context state
      ctx.restore();

      // Draw region selection overlay if enabled and selecting
      if (enableRegionSelection && isSelecting) {
         ctx.save();

         // Calculate selection rectangle in canvas coordinates
         // Since canvas is now sized to exact display dimensions, coordinates should map directly
         const canvasRect = canvas.getBoundingClientRect();

         // Calculate the scale between display and canvas coordinates
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

         // Since canvas is now actual image size, region coordinates map directly
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
         // Start region selection
         const canvas = canvasRef.current;
         if (!canvas) return;

         const rect = canvas.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;

         setIsSelecting(true);
         setSelectionStart({ x, y });
         setSelectionEnd({ x, y });
      }
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (enableRegionSelection && isSelecting && fitToContainer) {
         // Update selection rectangle
         const canvas = canvasRef.current;
         if (!canvas) return;

         const rect = canvas.getBoundingClientRect();
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
         const container = containerRef.current;
         if (!canvas || !container || !imageData) return;

         const rect = canvas.getBoundingClientRect();
         const endX = e.clientX - rect.left;
         const endY = e.clientY - rect.top;

         // Calculate region in image coordinates
         // Since canvas is now at image resolution, convert display coordinates to image coordinates
         const scaleX = canvas.width / rect.width;
         const scaleY = canvas.height / rect.height;

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
         className={`flex flex-col h-full border rounded-lg bg-card ${className}`}
      >
         <div className="flex items-center justify-between p-3 border-b">
            <h3 className="text-sm font-medium">{title}</h3>
            <div className="flex items-center gap-1">
               {enableRegionSelection && selectedRegion && (
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => {
                        setSelectedRegion(null);
                        onRegionSelect?.(null);
                     }}
                  >
                     Clear Selection
                  </Button>
               )}
            </div>
         </div>

         <div
            ref={containerRef}
            className="flex-1 overflow-hidden relative bg-muted/20"
            style={{
               cursor:
                  enableRegionSelection && fitToContainer
                     ? isSelecting
                        ? "crosshair"
                        : "crosshair"
                     : "default",
            }}
         >
            {imageUrl ? (
               <canvas
                  ref={canvasRef}
                  className={`absolute z-0 ${
                     fitToContainer ? "inset-0 m-auto" : "top-0 left-0"
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
                  onMouseDown={
                     enableRegionSelection && fitToContainer
                        ? handleMouseDown
                        : undefined
                  }
                  onMouseMove={handleMouseMove}
                  onMouseUp={
                     enableRegionSelection && fitToContainer
                        ? handleMouseUp
                        : undefined
                  }
                  onMouseLeave={
                     enableRegionSelection && fitToContainer
                        ? handleMouseUp
                        : undefined
                  }
               />
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
            <div className="p-2 border-t bg-muted/50 text-xs">
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
            <div className="p-2 border-t bg-muted/50 text-xs">
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

         {enableRegionSelection && !selectedRegion && (
            <div className="p-2 border-t bg-muted/50 text-xs text-center text-muted-foreground">
               Drag to select a region for zoomed comparison
            </div>
         )}
      </div>
   );
};
