// Grid-based image processing for grayscale operations
export type ImageGrid = number[][]; // 2D array with values 0-255

export interface GridData {
   grid: ImageGrid;
   width: number;
   height: number;
}

export class GridProcessor {
   /**
    * Convert HTML Image to 2D grayscale grid (0-255)
    */
   static imageToGrid(image: HTMLImageElement): GridData {
      // Create temporary canvas to extract image data
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Draw image and get pixel data
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert to 2D grayscale grid
      const grid: ImageGrid = [];
      for (let y = 0; y < canvas.height; y++) {
         const row: number[] = [];
         for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            // Convert RGB to grayscale using luminance formula
            const gray = Math.round(
               0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
            );
            row.push(gray);
         }
         grid.push(row);
      }

      return {
         grid,
         width: canvas.width,
         height: canvas.height,
      };
   }

   /**
    * Convert 2D grid back to canvas ImageData for display
    */
   static gridToImageData(gridData: GridData): ImageData {
      const { grid, width, height } = gridData;
      const data = new Uint8ClampedArray(width * height * 4);

      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const gray = Math.max(0, Math.min(255, grid[y][x]));

            // Set RGB channels to same gray value
            data[idx] = gray; // R
            data[idx + 1] = gray; // G
            data[idx + 2] = gray; // B
            data[idx + 3] = 255; // A (fully opaque)
         }
      }

      return new ImageData(data, width, height);
   }

   /**
    * Draw grid to canvas with proper scaling based on max pixel ratio
    */
   static drawGridToCanvas(
      canvas: HTMLCanvasElement,
      gridData: GridData,
      maxPixelRatio: number | "auto"
   ): void {
      const ctx = canvas.getContext("2d")!;
      const { width, height } = gridData;

      // Calculate display dimensions based on maxPixelRatio
      let displayWidth = width;
      let displayHeight = height;

      if (maxPixelRatio !== "auto") {
         const maxDimension = Math.max(width, height);
         const scale = maxPixelRatio / maxDimension;
         displayWidth = Math.round(width * scale);
         displayHeight = Math.round(height * scale);
      }

      // Set canvas size to display dimensions
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      // Create ImageData for the grid
      const imageData = this.gridToImageData(gridData);

      // Create temporary canvas at original size
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d")!;
      tempCanvas.width = width;
      tempCanvas.height = height;
      tempCtx.putImageData(imageData, 0, 0);

      // Disable image smoothing for pixelated effect
      ctx.imageSmoothingEnabled = false;

      // Draw scaled image to main canvas
      ctx.drawImage(
         tempCanvas,
         0,
         0,
         width,
         height,
         0,
         0,
         displayWidth,
         displayHeight
      );
   }

   /**
    * Get pixel value at specific coordinates
    */
   static getPixelValue(gridData: GridData, x: number, y: number): number {
      const { grid, width, height } = gridData;
      if (x < 0 || x >= width || y < 0 || y >= height) {
         return 0; // Return black for out-of-bounds
      }
      return grid[y][x];
   }

   /**
    * Set pixel value at specific coordinates
    */
   static setPixelValue(
      gridData: GridData,
      x: number,
      y: number,
      value: number
   ): void {
      const { grid, width, height } = gridData;
      if (x >= 0 && x < width && y >= 0 && y < height) {
         grid[y][x] = Math.max(0, Math.min(255, Math.round(value)));
      }
   }

   /**
    * Create a copy of grid data
    */
   static cloneGrid(gridData: GridData): GridData {
      return {
         grid: gridData.grid.map((row) => [...row]),
         width: gridData.width,
         height: gridData.height,
      };
   }

   /**
    * Create a new empty grid
    */
   static createEmptyGrid(
      width: number,
      height: number,
      fillValue: number = 0
   ): GridData {
      const grid: ImageGrid = [];
      for (let y = 0; y < height; y++) {
         const row: number[] = new Array(width).fill(fillValue);
         grid.push(row);
      }
      return { grid, width, height };
   }

   // === IMAGE PROCESSING OPERATIONS ===

   /**
    * Adjust contrast of the grid
    */
   static adjustContrast(gridData: GridData, factor: number = 1.5): GridData {
      const result = this.cloneGrid(gridData);
      const { grid, width, height } = result;

      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            const value = grid[y][x];
            const newValue = (value - 128) * factor + 128;
            grid[y][x] = Math.max(0, Math.min(255, Math.round(newValue)));
         }
      }

      return result;
   }

   /**
    * Apply threshold to grid
    */
   static threshold(gridData: GridData, threshold: number = 128): GridData {
      const result = this.cloneGrid(gridData);
      const { grid, width, height } = result;

      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            grid[y][x] = grid[y][x] >= threshold ? 255 : 0;
         }
      }

      return result;
   }

   /**
    * Invert grid values
    */
   static invert(gridData: GridData): GridData {
      const result = this.cloneGrid(gridData);
      const { grid, width, height } = result;

      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            grid[y][x] = 255 - grid[y][x];
         }
      }

      return result;
   }

   /**
    * Gaussian blur
    */
   static gaussianBlur(gridData: GridData, radius: number = 1): GridData {
      const result = this.cloneGrid(gridData);
      const { grid, width, height } = result;

      // Simple box blur approximation
      const kernel = this.createGaussianKernel(radius);
      const kernelSize = kernel.length;
      const halfKernel = Math.floor(kernelSize / 2);

      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            let sum = 0;
            let weightSum = 0;

            for (let ky = 0; ky < kernelSize; ky++) {
               for (let kx = 0; kx < kernelSize; kx++) {
                  const px = x + kx - halfKernel;
                  const py = y + ky - halfKernel;

                  if (px >= 0 && px < width && py >= 0 && py < height) {
                     const weight = kernel[ky][kx];
                     sum += gridData.grid[py][px] * weight;
                     weightSum += weight;
                  }
               }
            }

            grid[y][x] = Math.max(
               0,
               Math.min(255, Math.round(sum / weightSum))
            );
         }
      }

      return result;
   }

   /**
    * Sobel edge detection
    */
   static sobelEdgeDetection(gridData: GridData): GridData {
      const result = this.cloneGrid(gridData);
      const { grid, width, height } = result;

      // Sobel operators
      const sobelX = [
         [-1, 0, 1],
         [-2, 0, 2],
         [-1, 0, 1],
      ];
      const sobelY = [
         [-1, -2, -1],
         [0, 0, 0],
         [1, 2, 1],
      ];

      for (let y = 1; y < height - 1; y++) {
         for (let x = 1; x < width - 1; x++) {
            let gx = 0,
               gy = 0;

            for (let ky = 0; ky < 3; ky++) {
               for (let kx = 0; kx < 3; kx++) {
                  const px = x + kx - 1;
                  const py = y + ky - 1;
                  const value = gridData.grid[py][px];

                  gx += value * sobelX[ky][kx];
                  gy += value * sobelY[ky][kx];
               }
            }

            const magnitude = Math.sqrt(gx * gx + gy * gy);
            grid[y][x] = Math.max(0, Math.min(255, Math.round(magnitude)));
         }
      }

      return result;
   }

   /**
    * Sharpen filter
    */
   static sharpen(gridData: GridData): GridData {
      const result = this.cloneGrid(gridData);
      const { grid, width, height } = result;

      // Sharpening kernel
      const kernel = [
         [0, -1, 0],
         [-1, 5, -1],
         [0, -1, 0],
      ];

      for (let y = 1; y < height - 1; y++) {
         for (let x = 1; x < width - 1; x++) {
            let sum = 0;

            for (let ky = 0; ky < 3; ky++) {
               for (let kx = 0; kx < 3; kx++) {
                  const px = x + kx - 1;
                  const py = y + ky - 1;
                  sum += gridData.grid[py][px] * kernel[ky][kx];
               }
            }

            grid[y][x] = Math.max(0, Math.min(255, Math.round(sum)));
         }
      }

      return result;
   }

   /**
    * Histogram equalization
    */
   static histogramEqualization(gridData: GridData): GridData {
      const result = this.cloneGrid(gridData);
      const { grid, width, height } = result;
      const totalPixels = width * height;

      // Calculate histogram
      const histogram = new Array(256).fill(0);
      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            histogram[grid[y][x]]++;
         }
      }

      // Calculate cumulative distribution
      const cdf = new Array(256);
      cdf[0] = histogram[0];
      for (let i = 1; i < 256; i++) {
         cdf[i] = cdf[i - 1] + histogram[i];
      }

      // Normalize CDF
      const cdfMin = cdf.find((val) => val > 0) || 0;
      for (let i = 0; i < 256; i++) {
         cdf[i] = Math.round(
            ((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255
         );
      }

      // Apply equalization
      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            grid[y][x] = cdf[grid[y][x]];
         }
      }

      return result;
   }

   /**
    * Zero padding
    */
   static zeroPadding(gridData: GridData, paddingSize: number = 10): GridData {
      const { width, height } = gridData;
      const newWidth = width + 2 * paddingSize;
      const newHeight = height + 2 * paddingSize;

      const result = this.createEmptyGrid(newWidth, newHeight, 0);

      // Copy original grid to center
      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            result.grid[y + paddingSize][x + paddingSize] = gridData.grid[y][x];
         }
      }

      return result;
   }

   /**
    * Edge padding (replicate border pixels)
    */
   static edgePadding(gridData: GridData, paddingSize: number = 10): GridData {
      const { grid, width, height } = gridData;
      const newWidth = width + 2 * paddingSize;
      const newHeight = height + 2 * paddingSize;

      const result = this.createEmptyGrid(newWidth, newHeight, 0);

      for (let y = 0; y < newHeight; y++) {
         for (let x = 0; x < newWidth; x++) {
            let srcX = x - paddingSize;
            let srcY = y - paddingSize;

            // Clamp coordinates to valid range
            srcX = Math.max(0, Math.min(width - 1, srcX));
            srcY = Math.max(0, Math.min(height - 1, srcY));

            result.grid[y][x] = grid[srcY][srcX];
         }
      }

      return result;
   }

   /**
    * Create Gaussian kernel for blur operations
    */
   private static createGaussianKernel(radius: number): number[][] {
      const size = radius * 2 + 1;
      const kernel: number[][] = [];
      const sigma = radius / 3;
      const twoSigmaSquare = 2 * sigma * sigma;
      let sum = 0;

      for (let y = 0; y < size; y++) {
         kernel[y] = [];
         for (let x = 0; x < size; x++) {
            const dx = x - radius;
            const dy = y - radius;
            const distance = dx * dx + dy * dy;
            const value = Math.exp(-distance / twoSigmaSquare);
            kernel[y][x] = value;
            sum += value;
         }
      }

      // Normalize kernel
      for (let y = 0; y < size; y++) {
         for (let x = 0; x < size; x++) {
            kernel[y][x] /= sum;
         }
      }

      return kernel;
   }
}
