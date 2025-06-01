import { ChevronDown, ChevronRight, Menu, PanelLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils";
import {
   PROCESSING_CATEGORIES,
   type ProcessingCategory,
   type ProcessingOperation,
   type ProcessingSubcategory,
} from "../types";
import {
   AcquisitionIcon,
   AnalysisIcon,
   ColorSpaceIcon,
   ContrastIcon,
   DefaultOperationIcon,
   DenoisingIcon,
   DilationIcon,
   EdgeDetectionIcon,
   ErosionIcon,
   FeatureExtractionIcon,
   HistogramIcon,
   NoiseRemovalIcon,
   PaddingIcon,
   PatternRecognitionIcon,
   PreprocessingIcon,
   SegmentationIcon,
   SharpeningIcon,
   ThresholdingIcon,
} from "./icons/CustomIcons";
import {
   BoundaryRepresentationIcon,
   ClassificationIcon,
   ClosingIcon,
   ClusteringIcon,
   ColorCorrectionIcon,
   ColorProcessingIcon,
   CompressionIcon,
   CustomPaddingIcon,
   DeblurringIcon,
   DenoisingIcon as DenoisingWorkIcon,
   FalseColoringIcon,
   InpaintingIcon,
   LosslessCompressionIcon,
   LossyCompressionIcon,
   MorphologicalIcon,
   OpeningIcon,
   PseudocoloringIcon,
   RecognitionIcon,
   ReflectPaddingIcon,
   RegionRepresentationIcon,
   RegionSegmentationIcon,
   ReplicatePaddingIcon,
   RepresentationIcon,
   SymmetricPaddingIcon,
   TemplateMatchingIcon,
   ThreeDVisualizationIcon,
   VisualizationIcon,
   WrapPaddingIcon,
   ZeroPaddingIcon,
} from "./icons/WorkIcons";

interface SidebarProps {
   onOperationSelect: (operation: ProcessingOperation) => void;
}

interface SidebarItemProps {
   item: ProcessingCategory | ProcessingSubcategory;
   onOperationSelect: (operation: ProcessingOperation) => void;
   level?: number;
}

// Predefined mapping of category IDs to their respective icons
const categoryIconMap = {
   acquisition: AcquisitionIcon,
   preprocessing: PreprocessingIcon,
   enhancement: ContrastIcon,
   restoration: DenoisingIcon,
   segmentation: SegmentationIcon,
   "feature-extraction": FeatureExtractionIcon,
   analysis: AnalysisIcon,
   "color-processing": ColorProcessingIcon,
   morphological: MorphologicalIcon,
   representation: RepresentationIcon,
   recognition: RecognitionIcon,
   compression: CompressionIcon,
   visualization: VisualizationIcon,
   padding: PaddingIcon,
   default: DefaultOperationIcon,
};

// Helper function to get the appropriate icon for a category or subcategory
const getIconForItem = (id: string, size: number, className: string) => {
   const IconComponent =
      categoryIconMap[id as keyof typeof categoryIconMap] ||
      categoryIconMap.default;
   return <IconComponent size={size} className={className} />;
};

// Predefined mapping of operation IDs to their respective icons
const operationIconMap = {
   contrast: ContrastIcon,
   histogram: HistogramIcon,
   "noise-removal": NoiseRemovalIcon,
   sharpening: SharpeningIcon,
   deblurring: DeblurringIcon,
   denoising: DenoisingWorkIcon,
   inpainting: InpaintingIcon,
   "edge-detection": EdgeDetectionIcon,
   thresholding: ThresholdingIcon,
   "color-space": ColorSpaceIcon,
   "color-correction": ColorCorrectionIcon,
   "false-coloring": FalseColoringIcon,
   "white-balance": ColorSpaceIcon,
   dilation: DilationIcon,
   erosion: ErosionIcon,
   opening: OpeningIcon,
   closing: ClosingIcon,
   "region-segmentation": RegionSegmentationIcon,
   clustering: ClusteringIcon,
   "boundary-representation": BoundaryRepresentationIcon,
   "region-representation": RegionRepresentationIcon,
   "feature-extraction": FeatureExtractionIcon,
   "template-matching": TemplateMatchingIcon,
   classification: ClassificationIcon,
   lossless: LosslessCompressionIcon,
   lossy: LossyCompressionIcon,
   "pattern-recognition": PatternRecognitionIcon,
   measurements: PatternRecognitionIcon,
   pseudocoloring: PseudocoloringIcon,
   "3d-visualization": ThreeDVisualizationIcon,
   "zero-padding": ZeroPaddingIcon,
   "replicate-padding": ReplicatePaddingIcon,
   "reflect-padding": ReflectPaddingIcon,
   "symmetric-padding": SymmetricPaddingIcon,
   "wrap-padding": WrapPaddingIcon,
   "custom-padding": CustomPaddingIcon,
   default: DefaultOperationIcon,
};

// Portal Tooltip Component
interface TooltipPortalProps {
   children: React.ReactNode;
   text: string;
   isVisible: boolean;
   triggerRef: React.RefObject<HTMLDivElement | null>;
}

const TooltipPortal: React.FC<TooltipPortalProps> = ({
   children,
   text,
   isVisible,
   triggerRef,
}) => {
   const [position, setPosition] = useState({ top: 0, left: 0 });

   useEffect(() => {
      if (isVisible && triggerRef.current) {
         const rect = triggerRef.current.getBoundingClientRect();
         setPosition({
            top: rect.top + rect.height / 2 - 16, // Center vertically with the icon
            left: rect.right + 12, // Position to the right of the icon
         });
      }
   }, [isVisible, triggerRef]);

   const tooltip = isVisible ? (
      <div
         className="fixed z-[2147483647] bg-gray-900 text-white text-sm px-3 py-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap"
         style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
         }}
      >
         {text}
      </div>
   ) : null;

   return (
      <>
         {children}
         {createPortal(tooltip, document.body)}
      </>
   );
};

// Collapsed Icon Component
interface CollapsedIconProps {
   operation: ProcessingOperation;
   onOperationSelect: (operation: ProcessingOperation) => void;
}

const CollapsedIcon: React.FC<CollapsedIconProps> = ({
   operation,
   onOperationSelect,
}) => {
   const iconRef = useRef<HTMLDivElement>(null);
   const [isHovered, setIsHovered] = useState(false);

   return (
      <TooltipPortal
         text={operation.name}
         isVisible={isHovered}
         triggerRef={iconRef}
      >
         <div
            ref={iconRef}
            className="flex justify-center items-center p-1.5 hover:bg-accent/50 rounded-md cursor-pointer transition-colors"
            onClick={() => onOperationSelect(operation)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
         >
            {getIconForOperation(
               operation.id,
               16,
               "text-muted-foreground hover:text-foreground transition-colors"
            )}
         </div>
      </TooltipPortal>
   );
};

// Helper function to get the appropriate icon for an operation
const getIconForOperation = (id: string, size: number, className: string) => {
   const IconComponent =
      operationIconMap[id as keyof typeof operationIconMap] ||
      operationIconMap.default;
   return <IconComponent size={size} className={className} />;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
   item,
   onOperationSelect,
   level = 0,
}) => {
   const [isOpen, setIsOpen] = useState(false);
   const isCategory = "subcategories" in item;
   const operationLen = item.operations?.length || 0;
   const hasOperations = isCategory ? operationLen > 0 : operationLen > 0;
   const hasSubcategories = (isCategory && item.subcategories?.length) || 0 > 0;
   const hasContent = hasOperations || hasSubcategories;

   const toggleOpen = () => {
      if (hasContent) {
         setIsOpen(!isOpen);
      }
   };

   return (
      <div className="w-full">
         <div
            className={cn(
               "flex items-center px-2 py-1.5 text-sm hover:bg-accent/50 rounded-md cursor-pointer",
               level > 0 && "ml-4"
            )}
            onClick={toggleOpen}
         >
            {hasContent ? (
               <span className="mr-1">
                  {isOpen ? (
                     <ChevronDown size={16} />
                  ) : (
                     <ChevronRight size={16} />
                  )}
               </span>
            ) : (
               <span className="w-4 mr-1"></span>
            )}
            {getIconForItem(item.id, 16, "mr-2 text-muted-foreground")}
            <span>{item.name}</span>
         </div>

         {isOpen && (
            <div className="mt-1">
               {/* Render subcategories if this is a category with subcategories */}
               {isCategory &&
                  item.subcategories?.map((subcategory) => (
                     <SidebarItem
                        key={subcategory.id}
                        item={subcategory}
                        onOperationSelect={onOperationSelect}
                        level={level + 1}
                     />
                  ))}

               {/* Render operations */}
               {(isCategory ? item.operations : item.operations)?.map(
                  (operation) => (
                     <div
                        key={operation.id}
                        className={cn(
                           "flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-md cursor-pointer",
                           level > 0 && "ml-12",
                           level === 0 && "ml-8"
                        )}
                        onClick={() => onOperationSelect(operation)}
                     >
                        {getIconForOperation(
                           operation.id,
                           14,
                           "mr-2 text-muted-foreground"
                        )}
                        <span className="text-xs">{operation.name}</span>
                     </div>
                  )
               )}
            </div>
         )}
      </div>
   );
};

export const Sidebar: React.FC<SidebarProps> = ({ onOperationSelect }) => {
   const [isOpen, setIsOpen] = useState(false);

   const toggleSidebar = () => {
      setIsOpen(!isOpen);
   };

   // Helper function to collect all operations from categories and subcategories
   const getAllOperations = (): ProcessingOperation[] => {
      const allOperations: ProcessingOperation[] = [];

      PROCESSING_CATEGORIES.forEach((category) => {
         // Add operations directly in the category
         if (category.operations) {
            allOperations.push(...category.operations);
         }

         // Add operations from subcategories
         if (category.subcategories) {
            category.subcategories.forEach((subcategory) => {
               if (subcategory.operations) {
                  allOperations.push(...subcategory.operations);
               }
            });
         }
      });

      return allOperations;
   };

   return (
      <div
         className={cn(
            "h-screen transition-all duration-300 ease-in-out border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative",
            isOpen ? "w-72" : "w-20"
         )}
         style={{ overflow: "visible", zIndex: 1 }}
      >
         {/* Toggle Button */}
         <button
            onClick={toggleSidebar}
            className="absolute top-4 right-2 transform bg-primary text-primary-foreground rounded-full p-1.5 shadow-md hover:bg-primary/90 transition-colors z-10"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
         >
            {isOpen ? <PanelLeft size={16} /> : <Menu size={16} />}
         </button>

         <div
            className={cn(
               "overflow-y-auto h-full relative",
               isOpen ? "p-4" : "p-1"
            )}
            style={{ overflow: "visible" }}
         >
            {isOpen && (
               <h2 className="text-lg font-semibold mb-4">Image Processing</h2>
            )}

            <div className={cn("space-y-1", !isOpen && "mt-12")}>
               {isOpen ? (
                  // Full sidebar content
                  PROCESSING_CATEGORIES.map((category) => (
                     <SidebarItem
                        key={category.id}
                        item={category}
                        onOperationSelect={onOperationSelect}
                     />
                  ))
               ) : (
                  // Collapsed sidebar content - show all operation icons in 2 columns
                  <div className="grid grid-cols-2 gap-1">
                     {getAllOperations().map((operation) => (
                        <CollapsedIcon
                           key={operation.id}
                           operation={operation}
                           onOperationSelect={onOperationSelect}
                        />
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
