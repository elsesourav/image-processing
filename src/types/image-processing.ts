export interface ImageData {
   data: Uint8ClampedArray;
   width: number;
   height: number;
}

// Grid-based image data structures
export type ImageGrid = number[][];

export interface GridData {
   grid: ImageGrid;
   width: number;
   height: number;
   originalImageUrl?: string;
}

export interface ProcessingOperation {
   id: string;
   name: string;
   category: string;
   subcategory?: string;
   description: string;
   parameters?: Record<string, number | string | boolean>;
}

export interface ProcessingCategory {
   id: string;
   name: string;
   subcategories?: ProcessingSubcategory[];
   operations?: ProcessingOperation[];
}

export interface ProcessingSubcategory {
   id: string;
   name: string;
   operations: ProcessingOperation[];
}

export const PROCESSING_CATEGORIES: ProcessingCategory[] = [
   {
      id: "acquisition",
      name: "Image Acquisition",
      operations: [
         {
            id: "capture",
            name: "Capture Image",
            category: "acquisition",
            description: "Capturing image via sensors or input devices",
         },
      ],
   },
   {
      id: "preprocessing",
      name: "Preprocessing",
      subcategories: [
         {
            id: "enhancement",
            name: "Image Enhancement",
            operations: [
               {
                  id: "contrast",
                  name: "Contrast Adjustment",
                  category: "preprocessing",
                  subcategory: "enhancement",
                  description: "Adjust image contrast",
                  parameters: { factor: 1.5 },
               },
               {
                  id: "histogram",
                  name: "Histogram Equalization",
                  category: "preprocessing",
                  subcategory: "enhancement",
                  description:
                     "Equalize histogram for better contrast distribution",
               },
               {
                  id: "noise-removal",
                  name: "Noise Removal",
                  category: "preprocessing",
                  subcategory: "enhancement",
                  description: "Remove noise using smoothing and filtering",
               },
               {
                  id: "sharpening",
                  name: "Sharpening",
                  category: "preprocessing",
                  subcategory: "enhancement",
                  description: "Enhance image sharpness",
               },
            ],
         },
         {
            id: "restoration",
            name: "Image Restoration",
            operations: [
               {
                  id: "deblurring",
                  name: "Deblurring",
                  category: "preprocessing",
                  subcategory: "restoration",
                  description: "Remove blur from images",
               },
               {
                  id: "denoising",
                  name: "Denoising",
                  category: "preprocessing",
                  subcategory: "restoration",
                  description: "Advanced noise removal",
               },
               {
                  id: "inpainting",
                  name: "Inpainting",
                  category: "preprocessing",
                  subcategory: "restoration",
                  description: "Fill missing parts of the image",
               },
            ],
         },
      ],
   },
   {
      id: "color-processing",
      name: "Color Image Processing",
      operations: [
         {
            id: "color-space",
            name: "Color Space Conversion",
            category: "color-processing",
            description: "Convert between RGB, HSV, YCbCr, etc.",
         },
         {
            id: "white-balance",
            name: "White Balancing",
            category: "color-processing",
            description: "Adjust white balance",
         },
         {
            id: "color-correction",
            name: "Color Correction",
            category: "color-processing",
            description: "Correct color distortions",
         },
         {
            id: "false-coloring",
            name: "False Coloring",
            category: "color-processing",
            description: "Apply false color mapping",
         },
      ],
   },
   {
      id: "morphological",
      name: "Morphological Processing",
      operations: [
         {
            id: "dilation",
            name: "Dilation",
            category: "morphological",
            description: "Morphological dilation operation",
         },
         {
            id: "erosion",
            name: "Erosion",
            category: "morphological",
            description: "Morphological erosion operation",
         },
         {
            id: "opening",
            name: "Opening",
            category: "morphological",
            description: "Morphological opening (erosion followed by dilation)",
         },
         {
            id: "closing",
            name: "Closing",
            category: "morphological",
            description: "Morphological closing (dilation followed by erosion)",
         },
      ],
   },
   {
      id: "segmentation",
      name: "Image Segmentation",
      operations: [
         {
            id: "thresholding",
            name: "Thresholding",
            category: "segmentation",
            description: "Binary and adaptive thresholding",
         },
         {
            id: "edge-detection",
            name: "Edge Detection",
            category: "segmentation",
            description: "Detect edges using Canny, Sobel, etc.",
         },
         {
            id: "region-segmentation",
            name: "Region-based Segmentation",
            category: "segmentation",
            description: "Segment image into regions",
         },
         {
            id: "clustering",
            name: "Clustering",
            category: "segmentation",
            description: "K-means and other clustering methods",
         },
      ],
   },
   {
      id: "representation",
      name: "Representation & Description",
      operations: [
         {
            id: "boundary-representation",
            name: "Boundary Representation",
            category: "representation",
            description: "Extract contours and boundaries",
         },
         {
            id: "region-representation",
            name: "Region Representation",
            category: "representation",
            description: "Analyze texture and shape",
         },
         {
            id: "feature-extraction",
            name: "Feature Extraction",
            category: "representation",
            description: "Extract key features from image",
         },
      ],
   },
   {
      id: "recognition",
      name: "Object Recognition",
      operations: [
         {
            id: "template-matching",
            name: "Template Matching",
            category: "recognition",
            description: "Match templates in image",
         },
         {
            id: "classification",
            name: "ML Classification",
            category: "recognition",
            description: "Machine learning-based classification",
         },
      ],
   },
   {
      id: "compression",
      name: "Image Compression",
      operations: [
         {
            id: "lossless",
            name: "Lossless Compression",
            category: "compression",
            description: "PNG, GIF style compression",
         },
         {
            id: "lossy",
            name: "Lossy Compression",
            category: "compression",
            description: "JPEG, WebP style compression",
         },
      ],
   },
   {
      id: "analysis",
      name: "Image Analysis",
      operations: [
         {
            id: "pattern-recognition",
            name: "Pattern Recognition",
            category: "analysis",
            description: "Recognize patterns in image",
         },
         {
            id: "measurements",
            name: "Quantitative Measurements",
            category: "analysis",
            description: "Measure area, perimeter, etc.",
         },
      ],
   },
   {
      id: "visualization",
      name: "Visualization",
      operations: [
         {
            id: "pseudocoloring",
            name: "Pseudocoloring",
            category: "visualization",
            description: "Apply false color mapping",
         },
         {
            id: "3d-visualization",
            name: "3D Visualization",
            category: "visualization",
            description: "Create 3D representations",
         },
      ],
   },
   {
      id: "padding",
      name: "Image Padding Operations",
      operations: [
         {
            id: "zero-padding",
            name: "Zero Padding",
            category: "padding",
            description:
               "Constant padding with value 0 - most common in deep learning",
            parameters: { paddingSize: 10 },
         },
         {
            id: "replicate-padding",
            name: "Replicate Padding",
            category: "padding",
            description: "Edge padding - extends edge values outward",
            parameters: { paddingSize: 10 },
         },
         {
            id: "reflect-padding",
            name: "Reflect Padding",
            category: "padding",
            description: "Mirrors image at border (excluding edge)",
            parameters: { paddingSize: 10 },
         },
         {
            id: "symmetric-padding",
            name: "Symmetric Padding",
            category: "padding",
            description: "Mirrors image including edge pixel (Reflect_101)",
            parameters: { paddingSize: 10 },
         },
         {
            id: "wrap-padding",
            name: "Wrap Padding",
            category: "padding",
            description:
               "Circular padding - wraps image values from opposite edge",
            parameters: { paddingSize: 10 },
         },
         {
            id: "custom-padding",
            name: "Custom Padding",
            category: "padding",
            description: "Custom value padding for specialized cases",
            parameters: { paddingSize: 10, customValue: 128 },
         },
      ],
   },
];
