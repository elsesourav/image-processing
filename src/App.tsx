import { useCallback, useState } from "react";
import { ComparisonViewer } from "./components/ComparisonViewer";
import { ImageUpload } from "./components/ImageUpload";
import { ImageViewer } from "./components/ImageViewer";
import { OperationParameters } from "./components/OperationParameters";
import { Sidebar } from "./components/Sidebar";
import { TopToolbar } from "./components/TopToolbar";
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
   const [currentInputImage, setCurrentInputImage] = useState<string | null>(
      null
   ); // Current working image
   const [processedImage, setProcessedImage] = useState<string | null>(null);
   const [lastOperation, setLastOperation] = useState<string>("");
   const [hasSidebarOperation, setHasSidebarOperation] = useState(false); // Track if processed image is from sidebar operation
   const [selectedOperation, setSelectedOperation] =
      useState<ProcessingOperation | null>(null);
   const [operationParameters, setOperationParameters] = useState<
      Record<string, number | string | boolean>
   >({});

   // Toolbar state
   const [maxPixelRatio, setMaxPixelRatio] = useState<number | "auto">(100);
   const [smoothEdges, setSmoothEdges] = useState(false);
   const [compareMode, setCompareMode] = useState(false);
   const [showPixelOutline, setShowPixelOutline] = useState(false);

   // Region selection state
   const [activeRegion, setActiveRegion] = useState<{
      x: number;
      y: number;
      width: number;
      height: number;
   } | null>(null);

   const handleImageLoad = useCallback((imageUrl: string) => {
      setCurrentInputImage(imageUrl); // Set as current working image
      setProcessedImage(imageUrl); // Initially, processed image is same as input
      setHasSidebarOperation(false); // No sidebar operation yet
      setLastOperation("Original Image");
   }, []);

   const handleLoadDemo = useCallback(() => {
      const demoImageUrl = "/demo-image.svg";
      setCurrentInputImage(demoImageUrl);
      setProcessedImage(demoImageUrl);
      setHasSidebarOperation(false);
      setLastOperation("Demo Image Loaded");
   }, []);

   const handleResetImage = useCallback(() => {
      setCurrentInputImage(null);
      setProcessedImage(null);
      setHasSidebarOperation(false);
      setLastOperation("");
      setSelectedOperation(null);
      setOperationParameters({});
   }, []);

   const handleParametersChange = useCallback(
      (parameters: Record<string, number | string | boolean>) => {
         setOperationParameters(parameters);
      },
      []
   );

   const processImage = useCallback(
      async (operation: ProcessingOperation) => {
         if (!currentInputImage) {
            alert("Please load an image first");
            return;
         }

         try {
            // Create a temporary canvas to load the current input image
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
                     setHasSidebarOperation(true); // Mark that we have a sidebar operation result
                     setLastOperation(operation.name);
                  }
               });
            };

            img.src = currentInputImage;
         } catch (error) {
            console.error("Error processing image:", error);
            alert("Error processing image. Please try again.");
         }
      },
      [currentInputImage]
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

   // Operation selection handler
   const handleOperationSelect = useCallback(
      (operation: ProcessingOperation) => {
         // Always close the current parameter section first
         setSelectedOperation(null);
         setOperationParameters({});

         // Check if the operation needs parameters by checking both predefined parameters
         // and operations that require default parameters
         const hasPreDefinedParameters =
            operation.parameters &&
            Object.keys(operation.parameters).length > 0;

         const needsDefaultParameters =
            operation.id.includes("padding") || operation.id === "contrast";

         const hasParameters =
            hasPreDefinedParameters || needsDefaultParameters;

         if (hasParameters) {
            // Show parameter inputs in main content area
            setSelectedOperation(operation);
         } else {
            // Execute immediately if no parameters needed
            processImage(operation);
         }
      },
      [processImage]
   );

   // Toolbar handlers
   const handleSave = useCallback(() => {
      if (!processedImage || !hasSidebarOperation) {
         alert("No sidebar operation result to apply");
         return;
      }

      // Apply the processed image as the new current input image (overwrite)
      setCurrentInputImage(processedImage);
      setHasSidebarOperation(false); // Reset since we've applied the result
      setLastOperation("Applied - Saved to Input");

      // Optionally show a success message
      console.log("Processed image applied to input image successfully");
   }, [processedImage, hasSidebarOperation]);

   const handleScaleChange = useCallback((scale: number | "auto") => {
      // Toolbar inputs auto-apply immediately - no need to reset to original
      setMaxPixelRatio(scale);
   }, []);

   const handleSmoothEdgesToggle = useCallback((enabled: boolean) => {
      setSmoothEdges(enabled);
   }, []);

   const handleCompareToggle = useCallback((enabled: boolean) => {
      setCompareMode(enabled);
      // Clear regions when toggling compare mode
      if (!enabled) {
         setActiveRegion(null);
      }
   }, []);

   const handlePixelOutlineToggle = useCallback((enabled: boolean) => {
      setShowPixelOutline(enabled);
   }, []);

   // Region selection handlers
   const handleInputRegionSelect = useCallback(
      (
         region: { x: number; y: number; width: number; height: number } | null
      ) => {
         setActiveRegion(region); // Use input region as active when selected
      },
      []
   );

   const handleOutputRegionSelect = useCallback(
      (
         region: { x: number; y: number; width: number; height: number } | null
      ) => {
         setActiveRegion(region); // Use output region as active when selected
      },
      []
   );

   return (
      <div className="min-h-screen bg-background flex flex-col relative">
         {/* Main Content Area */}
         <div className="flex-1 flex relative">
            {/* Sidebar Navigation - Only show when image is loaded */}
            {currentInputImage && (
               <Sidebar onOperationSelect={handleOperationSelect} />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
               {currentInputImage ? (
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
                     {/* Top Toolbar - Only show when image is loaded */}
                     {currentInputImage && (
                        <TopToolbar
                           onSave={handleSave}
                           onScaleChange={handleScaleChange}
                           onSmoothEdgesToggle={handleSmoothEdgesToggle}
                           onCompareToggle={handleCompareToggle}
                           onPixelOutlineToggle={handlePixelOutlineToggle}
                           maxPixelRatio={maxPixelRatio}
                           smoothEdges={smoothEdges}
                           compareMode={compareMode}
                           showPixelOutline={showPixelOutline}
                           disabled={!hasSidebarOperation}
                           showApplyButton={hasSidebarOperation}
                        />
                     )}
                     {/* Show operation parameters if operation is selected */}
                     {selectedOperation && (
                        <div className="p-4 bg-blue-50 border-b">
                           <OperationParameters
                              operation={selectedOperation}
                              onParametersChange={handleParametersChange}
                              onExecute={executeOperation}
                              onClose={() => setSelectedOperation(null)}
                           />
                        </div>
                     )}{" "}
                     {/* Image Viewers */}
                     <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
                        {/* Top Section: Input | Output (or merged comparison) */}
                        <div className="h-1/2">
                           {compareMode ? (
                              // Compare Mode - Merged view with comparison line
                              <ComparisonViewer
                                 originalImageUrl={currentInputImage}
                                 processedImageUrl={processedImage}
                                 maxPixelRatio={maxPixelRatio}
                                 smoothEdges={smoothEdges}
                                 showPixelOutline={showPixelOutline}
                                 className="h-full"
                              />
                           ) : (
                              // Normal Mode - Side by side input | output
                              <div className="flex gap-4 h-full">
                                 <ImageViewer
                                    imageUrl={currentInputImage}
                                    title="Current Input Image"
                                    maxPixelRatio={maxPixelRatio}
                                    smoothEdges={smoothEdges}
                                    showPixelOutline={showPixelOutline}
                                    fitToContainer={true}
                                    enableRegionSelection={true}
                                    onRegionSelect={handleInputRegionSelect}
                                    className="flex-1"
                                 />
                                 <ImageViewer
                                    imageUrl={processedImage}
                                    title="Processed Image (Output)"
                                    maxPixelRatio={maxPixelRatio}
                                    smoothEdges={smoothEdges}
                                    showPixelOutline={showPixelOutline}
                                    fitToContainer={true}
                                    enableRegionSelection={true}
                                    onRegionSelect={handleOutputRegionSelect}
                                    className="flex-1"
                                 />
                              </div>
                           )}
                        </div>

                        {/* Bottom Section: Selected Region View */}
                        {activeRegion && (
                           <div className="h-1/2">
                              <ComparisonViewer
                                 originalImageUrl={currentInputImage}
                                 processedImageUrl={processedImage}
                                 maxPixelRatio={maxPixelRatio}
                                 smoothEdges={smoothEdges}
                                 showPixelOutline={showPixelOutline}
                                 selectedRegion={activeRegion}
                                 showZoomControls={false}
                                 className="h-full"
                              />
                           </div>
                        )}
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
      </div>
   );
}

export default App;
