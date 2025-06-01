import React from "react";

interface IconProps {
   size?: number;
   className?: string;
}

// Color Processing Icons
export const ColorCorrectionIcon: React.FC<IconProps> = ({
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
      <path d="M12 6v12" />
      <path d="M6 12h12" />
      <path d="M7 9a5 5 0 0 0 5 5" />
      <path d="M17 15a5 5 0 0 0-5-5" />
   </svg>
);

export const FalseColoringIcon: React.FC<IconProps> = ({
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
      <circle cx="9" cy="9" r="2" />
      <circle cx="15" cy="9" r="2" />
      <circle cx="9" cy="15" r="2" />
      <circle cx="15" cy="15" r="2" />
      <path d="M9 9l6 6" />
      <path d="M15 9l-6 6" />
   </svg>
);

// Morphological Processing Icons
export const OpeningIcon: React.FC<IconProps> = ({
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
      <path d="M12 8v8" />
      <path d="M8 12h8" />
      <path d="M8.5 8.5l7 7" />
      <path d="M15.5 8.5l-7 7" />
   </svg>
);

export const ClosingIcon: React.FC<IconProps> = ({
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
      <path d="M12 9v-4" />
      <path d="M12 19v-4" />
      <path d="M9 12h-4" />
      <path d="M19 12h-4" />
   </svg>
);

// Segmentation Icons
export const RegionSegmentationIcon: React.FC<IconProps> = ({
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
      <circle cx="6" cy="6" r="1" />
      <circle cx="18" cy="18" r="1" />
   </svg>
);

export const ClusteringIcon: React.FC<IconProps> = ({
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
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 9v6" />
      <path d="M18 9v6" />
      <path d="M9 6h6" />
      <path d="M9 18h6" />
   </svg>
);

// Representation & Description Icons
export const BoundaryRepresentationIcon: React.FC<IconProps> = ({
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
      <path d="M7 7h10v10H7z" strokeDasharray="4 4" />
      <circle cx="12" cy="12" r="6" strokeDasharray="4 4" />
   </svg>
);

export const RegionRepresentationIcon: React.FC<IconProps> = ({
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
      <path d="M8 8h8v8H8z" />
      <path d="M8 8l8 8" />
      <path d="M16 8l-8 8" />
      <circle cx="12" cy="12" r="2" />
   </svg>
);

// Object Recognition Icons
export const TemplateMatchingIcon: React.FC<IconProps> = ({
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
      <rect x="3" y="3" width="10" height="10" rx="1" />
      <rect x="11" y="11" width="10" height="10" rx="1" />
      <path d="M7 13v4h4" />
      <path d="M13 7h4v4" />
   </svg>
);

export const ClassificationIcon: React.FC<IconProps> = ({
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
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
      <path d="M5 6v12" />
      <path d="M12 6v12" />
      <path d="M19 6v12" />
      <circle cx="5" cy="9" r="1" />
      <circle cx="12" cy="9" r="1" />
      <circle cx="19" cy="15" r="1" />
   </svg>
);

// Compression Icons
export const LosslessCompressionIcon: React.FC<IconProps> = ({
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
      <path d="M8 3v18" />
      <path d="M16 3v18" />
      <path d="M3 12h18" />
      <path d="M3 8h5" />
      <path d="M16 8h5" />
      <path d="M3 16h5" />
      <path d="M16 16h5" />
   </svg>
);

export const LossyCompressionIcon: React.FC<IconProps> = ({
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
      <path d="M8 3v18" strokeDasharray="4 4" />
      <path d="M16 3v18" strokeDasharray="4 4" />
      <path d="M3 12h18" strokeDasharray="4 4" />
      <path d="M3 8h5" />
      <path d="M16 8h5" />
      <path d="M3 16h5" />
      <path d="M16 16h5" />
   </svg>
);

// Visualization Icons
export const PseudocoloringIcon: React.FC<IconProps> = ({
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
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="16" r="3" />
      <path d="M8 11v2" />
      <path d="M16 11v2" />
      <path d="M11 8h2" />
      <path d="M11 16h2" />
   </svg>
);

export const ThreeDVisualizationIcon: React.FC<IconProps> = ({
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
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 12l8-4.5" />
      <path d="M12 12v9" />
      <path d="M12 12L4 7.5" />
   </svg>
);

// Additional Category Icons
export const CompressionIcon: React.FC<IconProps> = ({
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
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 12h16" />
      <path d="M12 4v16" />
      <path d="M9 7h6" />
      <path d="M7 9h10" />
      <path d="M9 17h6" />
      <path d="M7 15h10" />
   </svg>
);

// Image Restoration Icons
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
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="6" strokeDasharray="2 2" strokeWidth="1" />
      <circle cx="12" cy="12" r="3" strokeWidth="3" />
      <path d="M8 8l8 8" strokeWidth="1" opacity="0.5" />
      <path d="M16 8l-8 8" strokeWidth="1" opacity="0.5" />
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
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 7h10v10H7z" stroke="none" fill="currentColor" opacity="0.1" />
      <circle cx="8" cy="8" r="1" opacity="0.3" />
      <circle cx="16" cy="8" r="1" opacity="0.3" />
      <circle cx="8" cy="16" r="1" opacity="0.3" />
      <circle cx="16" cy="16" r="1" opacity="0.3" />
      <circle cx="12" cy="10" r="1" opacity="0.3" />
      <circle cx="10" cy="14" r="1" opacity="0.3" />
      <circle cx="14" cy="14" r="1" opacity="0.3" />
      <path d="M12 12m-3 0a3 3 0 1 1 6 0a3 3 0 1 1 -6 0" strokeWidth="3" />
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
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect
         x="8"
         y="8"
         width="8"
         height="8"
         rx="1"
         strokeDasharray="3 3"
         strokeWidth="1"
         opacity="0.5"
      />
      <path
         d="M10 10h4v4h-4z"
         stroke="none"
         fill="currentColor"
         opacity="0.1"
      />
      <path d="M12 10v4" strokeWidth="3" />
      <path d="M10 12h4" strokeWidth="3" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
   </svg>
);

export const RecognitionIcon: React.FC<IconProps> = ({
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
      <path d="M8 9l2 2" />
      <path d="M14 9l2 2" />
      <path d="M9 16c.85.63 1.885 1 3 1s2.15-.37 3-1" />
   </svg>
);

export const RepresentationIcon: React.FC<IconProps> = ({
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
      <path d="M9 3v18" />
      <circle cx="6" cy="6" r="1" />
      <circle cx="14" cy="6" r="1" />
      <circle cx="6" cy="14" r="1" />
      <circle cx="14" cy="14" r="1" />
   </svg>
);

export const VisualizationIcon: React.FC<IconProps> = ({
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
      <path d="M7 16l4-8 4 4 6-6" />
      <circle cx="7" cy="16" r="1" />
      <circle cx="11" cy="8" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="21" cy="6" r="1" />
   </svg>
);

export const MorphologicalIcon: React.FC<IconProps> = ({
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
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="16" r="3" />
      <path d="M8 11v5" />
      <path d="M11 8h5" />
   </svg>
);

export const ColorProcessingIcon: React.FC<IconProps> = ({
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
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 9v6" />
      <path d="M18 9v6" />
      <path d="M9 6h6" />
      <path d="M9 18h6" />
   </svg>
);

// Padding Operations Icons
export const ZeroPaddingIcon: React.FC<IconProps> = ({
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
      <rect
         x="6"
         y="6"
         width="12"
         height="12"
         fill="currentColor"
         fillOpacity="0.2"
      />
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <text x="4" y="5" fontSize="3" fill="currentColor">
         0
      </text>
      <text x="19" y="5" fontSize="3" fill="currentColor">
         0
      </text>
      <text x="4" y="21" fontSize="3" fill="currentColor">
         0
      </text>
      <text x="19" y="21" fontSize="3" fill="currentColor">
         0
      </text>
   </svg>
);

export const ReplicatePaddingIcon: React.FC<IconProps> = ({
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
      <rect
         x="8"
         y="8"
         width="8"
         height="8"
         fill="currentColor"
         fillOpacity="0.3"
      />
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 2v6" strokeDasharray="2 2" />
      <path d="M16 2v6" strokeDasharray="2 2" />
      <path d="M8 16v6" strokeDasharray="2 2" />
      <path d="M16 16v6" strokeDasharray="2 2" />
      <path d="M2 8h6" strokeDasharray="2 2" />
      <path d="M16 8h6" strokeDasharray="2 2" />
      <path d="M2 16h6" strokeDasharray="2 2" />
      <path d="M16 16h6" strokeDasharray="2 2" />
   </svg>
);

export const ReflectPaddingIcon: React.FC<IconProps> = ({
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
      <rect
         x="8"
         y="8"
         width="8"
         height="8"
         fill="currentColor"
         fillOpacity="0.3"
      />
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 6l8 0" strokeWidth="1" opacity="0.6" />
      <path d="M8 18l8 0" strokeWidth="1" opacity="0.6" />
      <path d="M6 8l0 8" strokeWidth="1" opacity="0.6" />
      <path d="M18 8l0 8" strokeWidth="1" opacity="0.6" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="16" cy="8" r="1" fill="currentColor" />
      <circle cx="8" cy="16" r="1" fill="currentColor" />
      <circle cx="16" cy="16" r="1" fill="currentColor" />
   </svg>
);

export const SymmetricPaddingIcon: React.FC<IconProps> = ({
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
      <rect
         x="8"
         y="8"
         width="8"
         height="8"
         fill="currentColor"
         fillOpacity="0.3"
      />
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 2v6M16 2v6M8 16v6M16 16v6" strokeWidth="1" />
      <path d="M2 8h6M16 8h6M2 16h6M16 16h6" strokeWidth="1" />
      <path
         d="M4 4l4 4M16 4l4 4M4 16l4 4M16 16l4 4"
         strokeWidth="1"
         opacity="0.5"
      />
   </svg>
);

export const WrapPaddingIcon: React.FC<IconProps> = ({
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
      <rect
         x="8"
         y="8"
         width="8"
         height="8"
         fill="currentColor"
         fillOpacity="0.3"
      />
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M8 2a6 6 0 0 0 0 6" strokeWidth="1" />
      <path d="M16 2a6 6 0 0 1 0 6" strokeWidth="1" />
      <path d="M8 22a6 6 0 0 1 0-6" strokeWidth="1" />
      <path d="M16 22a6 6 0 0 0 0-6" strokeWidth="1" />
      <path d="M2 8a6 6 0 0 0 6 0" strokeWidth="1" />
      <path d="M2 16a6 6 0 0 1 6 0" strokeWidth="1" />
      <path d="M22 8a6 6 0 0 1-6 0" strokeWidth="1" />
      <path d="M22 16a6 6 0 0 0-6 0" strokeWidth="1" />
   </svg>
);

export const CustomPaddingIcon: React.FC<IconProps> = ({
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
      <rect
         x="8"
         y="8"
         width="8"
         height="8"
         fill="currentColor"
         fillOpacity="0.3"
      />
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="4" cy="4" r="1" fill="currentColor" />
      <circle cx="20" cy="4" r="1" fill="currentColor" />
      <circle cx="4" cy="20" r="1" fill="currentColor" />
      <circle cx="20" cy="20" r="1" fill="currentColor" />
      <path
         d="M8 4h8M8 20h8M4 8v8M20 8v8"
         strokeDasharray="3 1"
         strokeWidth="1"
      />
      <text x="11" y="5" fontSize="2" fill="currentColor">
         ?
      </text>
   </svg>
);

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
      <rect
         x="6"
         y="6"
         width="12"
         height="12"
         fill="currentColor"
         fillOpacity="0.2"
      />
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <path d="M6 2v4M18 2v4M6 18v4M18 18v4" />
      <path d="M2 6h4M2 18h4M18 6h4M18 18h4" />
   </svg>
);
