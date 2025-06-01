import { useCallback, useState } from "react";
import { ImageUpload } from "./components/ImageUpload";
import { ImageViewer } from "./components/ImageViewer";
import { OperationParameters } from "./components/OperationParameters";
import { Sidebar } from "./components/Sidebar";
import { type ImageData, type ProcessingOperation } from "./types";
import { ImageProcessor } from "./utils/image-processing";

// Operation function mapping for faster lookup - moved outside component for performance
const operationFunctions = {
   contrast: (imageData: ImageData, operation: ProcessingOperation) =>
      ImageProcessor.adjustContrast(
         imageData,
         typeof operation.parameters?.factor === "number"
            ? operation.parameters.factor
            : 1.5
      ),

   histogram: (imageData: ImageData) =>
      ImageProcessor.histogramEqualization(imageData),

   "noise-removal": (imageData: ImageData) =>
      ImageProcessor.gaussianBlur(imageData, 1),

   sharpening: (imageData: ImageData) => ImageProcessor.sharpen(imageData),

   "edge-detection": (imageData: ImageData) =>
      ImageProcessor.sobelEdgeDetection(imageData),

   thresholding: (imageData: ImageData) =>
      ImageProcessor.threshold(imageData, 128),

   "color-space": (imageData: ImageData) =>
      ImageProcessor.rgbToGrayscale(imageData),

   // Add more operations as they become available
   deblurring: (imageData: ImageData) => ImageProcessor.invert(imageData), // placeholder

   denoising: (imageData: ImageData) => ImageProcessor.invert(imageData), // placeholder

   inpainting: (imageData: ImageData) => ImageProcessor.invert(imageData), // placeholder

   // Padding operations
   "zero-padding": (imageData: ImageData, operation: ProcessingOperation) =>
      ImageProcessor.zeroPadding(
         imageData,
         typeof operation.parameters?.paddingSize === "number"
            ? operation.parameters.paddingSize
            : 10
      ),

   "replicate-padding": (
      imageData: ImageData,
      operation: ProcessingOperation
   ) =>
      ImageProcessor.replicatePadding(
         imageData,
         typeof operation.parameters?.paddingSize === "number"
            ? operation.parameters.paddingSize
            : 10
      ),

   "reflect-padding": (imageData: ImageData, operation: ProcessingOperation) =>
      ImageProcessor.reflectPadding(
         imageData,
         typeof operation.parameters?.paddingSize === "number"
            ? operation.parameters.paddingSize
            : 10
      ),

   "symmetric-padding": (
      imageData: ImageData,
      operation: ProcessingOperation
   ) =>
      ImageProcessor.symmetricPadding(
         imageData,
         typeof operation.parameters?.paddingSize === "number"
            ? operation.parameters.paddingSize
            : 10
      ),

   "wrap-padding": (imageData: ImageData, operation: ProcessingOperation) =>
      ImageProcessor.wrapPadding(
         imageData,
         typeof operation.parameters?.paddingSize === "number"
            ? operation.parameters.paddingSize
            : 10
      ),

   "custom-padding": (imageData: ImageData, operation: ProcessingOperation) =>
      ImageProcessor.customPadding(
         imageData,
         typeof operation.parameters?.paddingSize === "number"
            ? operation.parameters.paddingSize
            : 10,
         typeof operation.parameters?.customValue === "number"
            ? operation.parameters.customValue
            : 8421504 // Default gray: (128 << 16) | (128 << 8) | 128
      ),
};

function App() {
   const [originalImage, setOriginalImage] = useState<string | null>(null);
   const [processedImage, setProcessedImage] = useState<string | null>(null);
   const [lastOperation, setLastOperation] = useState<string>("");
   const [selectedOperation, setSelectedOperation] =
      useState<ProcessingOperation | null>(null);
   const [operationParameters, setOperationParameters] = useState<
      Record<string, number | string | boolean>
   >({});

   const handleImageLoad = useCallback((imageUrl: string) => {
      setOriginalImage(imageUrl);
      setProcessedImage(imageUrl); // Initially, processed image is same as original
      setLastOperation("Original Image");
   }, []);

   const handleLoadDemo = useCallback(() => {
      const demoImageUrl = "/demo-image.svg";
      setOriginalImage(demoImageUrl);
      setProcessedImage(demoImageUrl);
      setLastOperation("Demo Image Loaded");
   }, []);

   const handleResetImage = useCallback(() => {
      setOriginalImage(null);
      setProcessedImage(null);
      setLastOperation("");
      setSelectedOperation(null);
      setOperationParameters({});
   }, []);

   const handleOperationSelect = useCallback(
      (operation: ProcessingOperation) => {
         setSelectedOperation(operation);
         setOperationParameters(operation.parameters || {});
      },
      []
   );

   const handleParametersChange = useCallback(
      (parameters: Record<string, number | string | boolean>) => {
         setOperationParameters(parameters);
      },
      []
   );

   const processImage = useCallback(
      async (operation: ProcessingOperation) => {
         if (!originalImage) {
            alert("Please load an image first");
            return;
         }

         try {
            // Create a temporary canvas to load the original image
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext("2d")!;
            const img = new Image();

            img.onload = () => {
               tempCanvas.width = img.naturalWidth;
               tempCanvas.height = img.naturalHeight;
               tempCtx.drawImage(img, 0, 0);

               // Get image data
               const imageData = ImageProcessor.createImageData(tempCanvas);

               // Apply the selected operation using function lookup
               const operationFunction =
                  operationFunctions[
                     operation.id as keyof typeof operationFunctions
                  ];
               const processedData = operationFunction
                  ? operationFunction(imageData, operation)
                  : ImageProcessor.invert(imageData); // fallback for unimplemented operations

               // Create a new canvas for the processed image
               const processedCanvas = document.createElement("canvas");
               processedCanvas.width = processedData.width;
               processedCanvas.height = processedData.height;
               ImageProcessor.putImageData(processedCanvas, processedData);

               // Convert to blob and create URL
               processedCanvas.toBlob((blob) => {
                  if (blob) {
                     const processedUrl = URL.createObjectURL(blob);
                     setProcessedImage(processedUrl);
                     setLastOperation(operation.name);
                  }
               });
            };

            img.src = originalImage;
         } catch (error) {
            console.error("Error processing image:", error);
            alert("Error processing image. Please try again.");
         }
      },
      [originalImage]
   );

   const executeOperation = useCallback(() => {
      if (selectedOperation) {
         const operationWithParams = {
            ...selectedOperation,
            parameters: operationParameters,
         };
         processImage(operationWithParams);
         setSelectedOperation(null);
      }
   }, [selectedOperation, operationParameters, processImage]);

   return (
      <div className="min-h-screen bg-background flex relative">
         {/* Sidebar Navigation - Only show when image is loaded */}
         {originalImage && (
            <Sidebar onOperationSelect={handleOperationSelect} />
         )}

         {/* Operation Parameters Panel - Show when operation is selected */}
         {selectedOperation && (
            <div className="w-80 border-r bg-background p-4">
               <OperationParameters
                  operation={selectedOperation}
                  onParametersChange={handleParametersChange}
                  onExecute={executeOperation}
               />
               <button
                  onClick={() => setSelectedOperation(null)}
                  className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
               >
                  Cancel
               </button>
            </div>
         )}

         {/* Main Content */}
         <div className="flex-1 flex flex-col">
            {originalImage ? (
               // When image is loaded - show image viewers and status
               <>
                  {/* Status Bar with Change Image Button */}
                  <div className="px-4 py-2 bg-muted/50 border-b flex items-center justify-between">
                     <div>
                        {lastOperation && (
                           <p className="text-sm text-muted-foreground">
                              Last operation:{" "}
                              <span className="font-medium text-foreground">
                                 {lastOperation}
                              </span>
                           </p>
                        )}
                     </div>
                     <button
                        onClick={handleResetImage}
                        className="text-xs px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
                     >
                        Change Image
                     </button>
                  </div>

                  {/* Image Viewers */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-auto">
                     {/* Viewport 0: Zoomable viewer with pixel inspection */}
                     <ImageViewer
                        imageUrl={processedImage}
                        title="Zoomable Viewer (with pixel info)"
                        showPixelInfo={true}
                        className="lg:col-span-1"
                     />

                     {/* Viewport 1: Original image */}
                     <ImageViewer
                        imageUrl={originalImage}
                        title="Original Image"
                        className="lg:col-span-1"
                     />

                     {/* Viewport 2: Processed image */}
                     <ImageViewer
                        imageUrl={processedImage}
                        title="Processed Image"
                        className="lg:col-span-1"
                     />
                  </div>
               </>
            ) : (
               // When no image is loaded - show welcome screen with upload
               <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-2xl w-full">
                     <h1 className="text-4xl font-bold mb-6">
                        Image Processing Studio
                     </h1>
                     <p className="text-xl text-muted-foreground mb-8">
                        Upload an image or load the demo to start exploring
                        image processing operations
                     </p>
                     <div className="max-w-md mx-auto">
                        <ImageUpload
                           onImageLoad={handleImageLoad}
                           onLoadDemo={handleLoadDemo}
                        />
                     </div>
                     <p className="text-sm text-muted-foreground mt-6">
                        Once you load an image, the operations sidebar will
                        appear with various image processing tools
                     </p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

export default App;
