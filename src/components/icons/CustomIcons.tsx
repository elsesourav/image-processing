import React from "react";

interface IconProps {
   size?: number;
   className?: string;
}

// Image Acquisition Icons
export const CaptureIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
   </svg>
);

// Preprocessing Icons
export const ContrastIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 0 20z" />
   </svg>
);

export const HistogramIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <path d="M3 3v18h18" />
      <path d="M7 16v-5" />
      <path d="M11 16v-8" />
      <path d="M15 16v-3" />
      <path d="M19 16v-7" />
   </svg>
);

export const NoiseRemovalIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M5 8h.01" />
      <path d="M9 8h.01" />
      <path d="M13 8h.01" />
      <path d="M17 8h.01" />
      <path d="M5 12h.01" />
      <path d="M9 12h.01" />
      <path d="M13 12h.01" />
      <path d="M17 12h.01" />
      <path d="M5 16h.01" />
      <path d="M9 16h.01" />
      <path d="M13 16h.01" />
      <path d="M17 16h.01" />
      <line x1="3" y1="3" x2="21" y2="21" />
   </svg>
);

export const SharpeningIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
   </svg>
);

export const DeblurringIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
   </svg>
);

export const DenoisingIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M9 5v14" />
      <path d="M15 5v14" />
      <path d="M5 9h14" />
      <path d="M5 15h14" />
   </svg>
);

export const InpaintingIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M8 8h8v8H8z" />
      <path d="M8 8l8 8" />
      <path d="M16 8l-8 8" />
   </svg>
);

// Color Processing Icons
export const ColorSpaceIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <circle cx="7" cy="12" r="5" />
      <circle cx="17" cy="12" r="5" />
      <path d="M12 7v10" />
   </svg>
);

export const WhiteBalanceIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M8 12h8" />
   </svg>
);

// Segmentation Icons
export const ThresholdingIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M3 12h18" />
      <path d="M12 3v18" />
      <path d="M3 3l9 9" />
      <path d="M21 21l-9-9" />
   </svg>
);

export const EdgeDetectionIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M4 12h16" />
      <path d="M12 4v16" />
      <path d="M4 4l16 16" />
   </svg>
);

// Morphological Icons
export const DilationIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9v-6" />
      <path d="M15 12h6" />
      <path d="M12 15v6" />
      <path d="M9 12h-6" />
   </svg>
);

export const ErosionIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <circle cx="12" cy="12" r="8" />
      <path d="M8 8l8 8" />
      <path d="M16 8l-8 8" />
   </svg>
);

// Feature Extraction Icons
export const FeatureExtractionIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <circle cx="15.5" cy="8.5" r="1.5" />
      <circle cx="15.5" cy="15.5" r="1.5" />
      <circle cx="8.5" cy="15.5" r="1.5" />
      <path d="M8.5 8.5l7 7" />
      <path d="M15.5 8.5l-7 7" />
   </svg>
);

// Analysis Icons
export const MeasurementsIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <path d="M2 12h20" />
      <path d="M6 4v16" />
      <path d="M18 4v16" />
      <path d="M8 9l8 6" />
      <path d="M16 9l-8 6" />
   </svg>
);

export const PatternRecognitionIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <path d="M9 6h6" />
      <path d="M6 9v6" />
      <path d="M18 9v6" />
      <path d="M9 18h6" />
   </svg>
);

// Default Icon
export const DefaultOperationIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
   </svg>
);

// Category Icons
export const AcquisitionIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
   </svg>
);

export const PreprocessingIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <path d="M12 3v18" />
      <rect x="4" y="8" width="16" height="8" rx="1" />
      <path d="M2 12h20" />
   </svg>
);

export const SegmentationIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
   </svg>
);

export const AnalysisIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <path d="M3 3v18h18" />
      <path d="M18 12l-6-9-6 9" />
      <path d="M6 12l6 2 6-2" />
   </svg>
);

// Padding Icon
export const PaddingIcon: React.FC<IconProps> = ({
   size = 24,
   className = "",
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
   >
      <rect x="6" y="6" width="12" height="12" fill="currentColor" fillOpacity="0.2" />
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M6 2v4M18 2v4M6 18v4M18 18v4" />
      <path d="M2 6h4M2 18h4M18 6h4M18 18h4" />
   </svg>
);
