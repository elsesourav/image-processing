import { Image as ImageIcon, Upload } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Button } from "./ui/button";

interface ImageUploadProps {
   onImageLoad: (imageUrl: string) => void;
   onLoadDemo: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
   onImageLoad,
   onLoadDemo,
}) => {
   const [isDragOver, setIsDragOver] = useState(false);

   const handleFileSelect = useCallback(
      (file: File) => {
         if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            onImageLoad(url);
         }
      },
      [onImageLoad]
   );

   const handleDrop = useCallback(
      (e: React.DragEvent) => {
         e.preventDefault();
         setIsDragOver(false);

         const files = Array.from(e.dataTransfer.files);
         const imageFile = files.find((file) => file.type.startsWith("image/"));

         if (imageFile) {
            handleFileSelect(imageFile);
         }
      },
      [handleFileSelect]
   );

   const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
   }, []);

   const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
   }, []);

   const handleFileInput = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (file) {
            handleFileSelect(file);
         }
      },
      [handleFileSelect]
   );

   return (
      <div className="p-4 border-2 border-dashed rounded-lg">
         <div className="flex items-center gap-4">
            <div
               className={`flex-1 border-2 border-dashed rounded-lg text-center transition-colors ${
                  isDragOver
                     ? "border-primary bg-primary/5"
                     : "border-muted-foreground/25 hover:border-muted-foreground/50"
               }`}
               onDrop={handleDrop}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
            >
               <div className="relative flex flex-col items-center gap-2 p-6">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div>
                     <p className="text-sm font-medium">
                        Drop an image here or click to browse
                     </p>
                     <p className="text-xs text-muted-foreground">
                        Supports JPG, PNG, GIF, WebP
                     </p>
                  </div>
                  <input
                     type="file"
                     accept="image/*"
                     onChange={handleFileInput}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
               </div>
            </div>

            <div className="flex flex-col gap-2">
               <Button
                  onClick={onLoadDemo}
                  variant="outline"
                  className="flex items-center gap-2"
               >
                  <ImageIcon className="h-4 w-4" />
                  Load Demo Image
               </Button>
            </div>
         </div>
      </div>
   );
};
