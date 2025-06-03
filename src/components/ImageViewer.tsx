import { Move } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface ImageViewerProps {
   imageUrl: string | null;
   title: string;
   showPixelInfo?: boolean;
   maxPixelRatio?: number | "auto";
   smoothEdges?: boolean;
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

   const drawImage = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const container = containerRef.current;
      if (!canvas || !ctx || !imageData || !container) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();

      if (fitToContainer) {
         // Calculate fit scale based on container size
         const containerRect = container.getBoundingClientRect();
         const containerWidth = containerRect.width - 32; // Padding
         const containerHeight = containerRect.height - 80; // Header + padding

         const scaleX = containerWidth / imageData.naturalWidth;
         const scaleY = containerHeight / imageData.naturalHeight;
         const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond original size

         // Center the image
         const scaledWidth = imageData.naturalWidth * scale;
         const scaledHeight = imageData.naturalHeight * scale;
         const offsetX = (containerWidth - scaledWidth) / 2;
         const offsetY = (containerHeight - scaledHeight) / 2;

         ctx.translate(offsetX, offsetY);
         ctx.scale(scale, scale);
      } else {
         // Apply scale from toolbar only
         let scaleMultiplier = 1;
         if (maxPixelRatio !== "auto") {
            scaleMultiplier = maxPixelRatio / 100;
         }
         ctx.scale(scaleMultiplier, scaleMultiplier);
      }

      // Set image smoothing based on smooth edges setting
      ctx.imageSmoothingEnabled = smoothEdges;

      // Draw image
      const imgWidth = imageData.naturalWidth;
      const imgHeight = imageData.naturalHeight;
      ctx.drawImage(imageData, 0, 0, imgWidth, imgHeight);

      // Restore context state
      ctx.restore();

      // Draw region selection overlay if enabled and selecting
      if (enableRegionSelection && isSelecting) {
         ctx.save();

         // Calculate selection rectangle in canvas coordinates
         const rect = Math.min(selectionStart.x, selectionEnd.x);
         const rectY = Math.min(selectionStart.y, selectionEnd.y);
         const rectWidth = Math.abs(selectionEnd.x - selectionStart.x);
         const rectHeight = Math.abs(selectionEnd.y - selectionStart.y);

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

         // Convert region coordinates to canvas coordinates
         const containerRect = container.getBoundingClientRect();
         const containerWidth = containerRect.width - 32;
         const containerHeight = containerRect.height - 80;

         const scaleX = containerWidth / imageData.naturalWidth;
         const scaleY = containerHeight / imageData.naturalHeight;
         const scale = Math.min(scaleX, scaleY, 1);

         const scaledWidth = imageData.naturalWidth * scale;
         const scaledHeight = imageData.naturalHeight * scale;
         const offsetX = (containerWidth - scaledWidth) / 2;
         const offsetY = (containerHeight - scaledHeight) / 2;

         const canvasX = offsetX + selectedRegion.x * scale;
         const canvasY = offsetY + selectedRegion.y * scale;
         const canvasWidth = selectedRegion.width * scale;
         const canvasHeight = selectedRegion.height * scale;

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
         const container = containerRef.current;
         if (canvas && container) {
            if (fitToContainer) {
               // Set canvas to container size for fitting
               const containerRect = container.getBoundingClientRect();
               canvas.width = containerRect.width - 32;
               canvas.height = containerRect.height - 80;
            } else {
               // Set canvas to image size for non-fit mode
               canvas.width = img.naturalWidth;
               canvas.height = img.naturalHeight;
            }
         }
      };
      img.src = imageUrl;
   }, [imageUrl, fitToContainer]);

   // Add resize observer for fit mode
   useEffect(() => {
      if (!fitToContainer || !containerRef.current) return;

      const resizeObserver = new ResizeObserver(() => {
         const canvas = canvasRef.current;
         const container = containerRef.current;
         if (canvas && container && imageData) {
            const containerRect = container.getBoundingClientRect();
            canvas.width = containerRect.width - 32;
            canvas.height = containerRect.height - 80;
            drawImage();
         }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
   }, [fitToContainer, imageData, drawImage]);

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

         // Calculate scale multiplier for fit mode
         let scaleMultiplier = 1;
         if (maxPixelRatio !== "auto") {
            scaleMultiplier = maxPixelRatio / 100;
         }

         const x = Math.floor((e.clientX - rect.left) / scaleMultiplier);
         const y = Math.floor((e.clientY - rect.top) / scaleMultiplier);

         if (
            x >= 0 &&
            x < imageData.naturalWidth &&
            y >= 0 &&
            y < imageData.naturalHeight
         ) {
            // Get pixel data
            const ctx = canvas.getContext("2d");
            if (ctx) {
               const imageData = ctx.getImageData(x, y, 1, 1);
               const data = imageData.data;
               setPixelInfo({
                  x,
                  y,
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
         const containerRect = container.getBoundingClientRect();
         const containerWidth = containerRect.width - 32;
         const containerHeight = containerRect.height - 80;

         const scaleX = containerWidth / imageData.naturalWidth;
         const scaleY = containerHeight / imageData.naturalHeight;
         const scale = Math.min(scaleX, scaleY, 1);

         const scaledWidth = imageData.naturalWidth * scale;
         const scaledHeight = imageData.naturalHeight * scale;
         const offsetX = (containerWidth - scaledWidth) / 2;
         const offsetY = (containerHeight - scaledHeight) / 2;

         // Convert selection to image coordinates
         const imageStartX = Math.max(
            0,
            (Math.min(selectionStart.x, endX) - offsetX) / scale
         );
         const imageStartY = Math.max(
            0,
            (Math.min(selectionStart.y, endY) - offsetY) / scale
         );
         const imageEndX = Math.min(
            imageData.naturalWidth,
            (Math.max(selectionStart.x, endX) - offsetX) / scale
         );
         const imageEndY = Math.min(
            imageData.naturalHeight,
            (Math.max(selectionStart.y, endY) - offsetY) / scale
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
                  className="absolute z-0"
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
