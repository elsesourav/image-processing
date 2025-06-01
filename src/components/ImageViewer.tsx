import { Move, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface ImageViewerProps {
   imageUrl: string | null;
   title: string;
   showPixelInfo?: boolean;
   className?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
   imageUrl,
   title,
   showPixelInfo = false,
   className = "",
}) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const [zoom, setZoom] = useState(1);
   const [pan, setPan] = useState({ x: 0, y: 0 });
   const [isDragging, setIsDragging] = useState(false);
   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
   const [pixelInfo, setPixelInfo] = useState<{
      x: number;
      y: number;
      r: number;
      g: number;
      b: number;
      a: number;
   } | null>(null);
   const [imageData, setImageData] = useState<HTMLImageElement | null>(null);

   const drawImage = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx || !imageData) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();

      // Apply transformations
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw image
      const imgWidth = imageData.naturalWidth;
      const imgHeight = imageData.naturalHeight;
      ctx.drawImage(imageData, 0, 0, imgWidth, imgHeight);

      // Restore context state
      ctx.restore();
   }, [imageData, zoom, pan]);

   useEffect(() => {
      if (!imageUrl) return;

      const img = new Image();
      img.onload = () => {
         setImageData(img);
         const canvas = canvasRef.current;
         if (canvas) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
         }
         // Reset zoom and pan when new image loads
         setZoom(1);
         setPan({ x: 0, y: 0 });
      };
      img.src = imageUrl;
   }, [imageUrl]);

   useEffect(() => {
      drawImage();
   }, [drawImage]);

   const handleZoomIn = () => {
      setZoom((prev) => Math.min(prev * 1.2, 10));
   };

   const handleZoomOut = () => {
      setZoom((prev) => Math.max(prev / 1.2, 0.1));
   };

   const handleReset = () => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
   };

   const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
         setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
         });
      }

      // Show pixel information if enabled
      if (showPixelInfo && imageData && canvasRef.current) {
         const canvas = canvasRef.current;
         const rect = canvas.getBoundingClientRect();
         const x = Math.floor((e.clientX - rect.left - pan.x) / zoom);
         const y = Math.floor((e.clientY - rect.top - pan.y) / zoom);

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

   const handleMouseUp = () => {
      setIsDragging(false);
   };

   const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.min(Math.max(prev * delta, 0.1), 10));
   };

   return (
      <div
         className={`flex flex-col h-full border rounded-lg bg-card ${className}`}
      >
         <div className="flex items-center justify-between p-3 border-b">
            <h3 className="text-sm font-medium">{title}</h3>
            <div className="flex items-center gap-1">
               <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
               </Button>
               <span className="text-xs px-2">{Math.round(zoom * 100)}%</span>
               <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
               </Button>
               <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4" />
               </Button>
            </div>
         </div>

         <div
            ref={containerRef}
            className="flex-1 overflow-hidden relative bg-muted/20"
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
         >
            {imageUrl ? (
               <canvas
                  ref={canvasRef}
                  className="absolute z-0"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  style={{
                     transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                     transformOrigin: "0 0",
                  }}
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
      </div>
   );
};
