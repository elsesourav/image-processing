import { type ImageData } from "../types";

export class ImageProcessor {
   static createImageData(canvas: HTMLCanvasElement): ImageData {
      const ctx = canvas.getContext("2d")!;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return {
         data: imageData.data,
         width: canvas.width,
         height: canvas.height,
      };
   }

   static putImageData(canvas: HTMLCanvasElement, imageData: ImageData): void {
      const ctx = canvas.getContext("2d")!;
      const canvasImageData = new window.ImageData(
         imageData.data,
         imageData.width,
         imageData.height
      );
      ctx.putImageData(canvasImageData, 0, 0);
   }

   // Image Enhancement Operations
   static adjustContrast(
      imageData: ImageData,
      factor: number = 1.5
   ): ImageData {
      const newData = new Uint8ClampedArray(imageData.data);

      for (let i = 0; i < newData.length; i += 4) {
         // Apply contrast to RGB channels
         newData[i] = Math.min(
            255,
            Math.max(0, (newData[i] - 128) * factor + 128)
         ); // R
         newData[i + 1] = Math.min(
            255,
            Math.max(0, (newData[i + 1] - 128) * factor + 128)
         ); // G
         newData[i + 2] = Math.min(
            255,
            Math.max(0, (newData[i + 2] - 128) * factor + 128)
         ); // B
         // Alpha channel remains unchanged
      }

      return {
         data: newData,
         width: imageData.width,
         height: imageData.height,
      };
   }

   static histogramEqualization(imageData: ImageData): ImageData {
      const newData = new Uint8ClampedArray(imageData.data);
      const histogram = new Array(256).fill(0);
      const totalPixels = imageData.width * imageData.height;

      // Calculate histogram for grayscale
      for (let i = 0; i < newData.length; i += 4) {
         const gray = Math.round(
            0.299 * newData[i] + 0.587 * newData[i + 1] + 0.114 * newData[i + 2]
         );
         histogram[gray]++;
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
      for (let i = 0; i < newData.length; i += 4) {
         const gray = Math.round(
            0.299 * newData[i] + 0.587 * newData[i + 1] + 0.114 * newData[i + 2]
         );
         const equalizedValue = cdf[gray];

         // Apply to all channels proportionally
         const factor = equalizedValue / gray || 1;
         newData[i] = Math.min(255, Math.max(0, newData[i] * factor));
         newData[i + 1] = Math.min(255, Math.max(0, newData[i + 1] * factor));
         newData[i + 2] = Math.min(255, Math.max(0, newData[i + 2] * factor));
      }

      return {
         data: newData,
         width: imageData.width,
         height: imageData.height,
      };
   }

   static gaussianBlur(imageData: ImageData, radius: number = 1): ImageData {
      const newData = new Uint8ClampedArray(imageData.data);
      const { width, height } = imageData;

      // Simple box blur approximation
      const size = radius * 2 + 1;

      for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            let r = 0,
               g = 0,
               b = 0,
               count = 0;

            for (let dy = -radius; dy <= radius; dy++) {
               for (let dx = -radius; dx <= radius; dx++) {
                  const ny = y + dy;
                  const nx = x + dx;

                  if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                     const idx = (ny * width + nx) * 4;
                     r += imageData.data[idx];
                     g += imageData.data[idx + 1];
                     b += imageData.data[idx + 2];
                     count++;
                  }
               }
            }

            const idx = (y * width + x) * 4;
            newData[idx] = r / count;
            newData[idx + 1] = g / count;
            newData[idx + 2] = b / count;
            newData[idx + 3] = imageData.data[idx + 3]; // Alpha
         }
      }

      return {
         data: newData,
         width: imageData.width,
         height: imageData.height,
      };
   }

   static sharpen(imageData: ImageData): ImageData {
      const newData = new Uint8ClampedArray(imageData.data);
      const { width, height } = imageData;

      // Sharpening kernel
      const kernel = [
         [0, -1, 0],
         [-1, 5, -1],
         [0, -1, 0],
      ];

      for (let y = 1; y < height - 1; y++) {
         for (let x = 1; x < width - 1; x++) {
            let r = 0,
               g = 0,
               b = 0;

            for (let ky = 0; ky < 3; ky++) {
               for (let kx = 0; kx < 3; kx++) {
                  const py = y + ky - 1;
                  const px = x + kx - 1;
                  const idx = (py * width + px) * 4;
                  const weight = kernel[ky][kx];

                  r += imageData.data[idx] * weight;
                  g += imageData.data[idx + 1] * weight;
                  b += imageData.data[idx + 2] * weight;
               }
            }

            const idx = (y * width + x) * 4;
            newData[idx] = Math.min(255, Math.max(0, r));
            newData[idx + 1] = Math.min(255, Math.max(0, g));
            newData[idx + 2] = Math.min(255, Math.max(0, b));
            newData[idx + 3] = imageData.data[idx + 3]; // Alpha
         }
      }

      return {
         data: newData,
         width: imageData.width,
         height: imageData.height,
      };
   }

   // Edge Detection
   static sobelEdgeDetection(imageData: ImageData): ImageData {
      const newData = new Uint8ClampedArray(imageData.data);
      const { width, height } = imageData;

      // Sobel kernels
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
                  const py = y + ky - 1;
                  const px = x + kx - 1;
                  const idx = (py * width + px) * 4;

                  // Convert to grayscale
                  const gray =
                     0.299 * imageData.data[idx] +
                     0.587 * imageData.data[idx + 1] +
                     0.114 * imageData.data[idx + 2];

                  gx += gray * sobelX[ky][kx];
                  gy += gray * sobelY[ky][kx];
               }
            }

            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const idx = (y * width + x) * 4;

            newData[idx] = magnitude; // R
            newData[idx + 1] = magnitude; // G
            newData[idx + 2] = magnitude; // B
            newData[idx + 3] = 255; // Alpha
         }
      }

      return {
         data: newData,
         width: imageData.width,
         height: imageData.height,
      };
   }

   // Thresholding
   static threshold(
      imageData: ImageData,
      thresholdValue: number = 128
   ): ImageData {
      const newData = new Uint8ClampedArray(imageData.data);

      for (let i = 0; i < newData.length; i += 4) {
         const gray =
            0.299 * newData[i] +
            0.587 * newData[i + 1] +
            0.114 * newData[i + 2];
         const value = gray > thresholdValue ? 255 : 0;

         newData[i] = value; // R
         newData[i + 1] = value; // G
         newData[i + 2] = value; // B
         // Alpha remains unchanged
      }

      return {
         data: newData,
         width: imageData.width,
         height: imageData.height,
      };
   }

   // Color space conversion
   static rgbToGrayscale(imageData: ImageData): ImageData {
      const newData = new Uint8ClampedArray(imageData.data);

      for (let i = 0; i < newData.length; i += 4) {
         const gray =
            0.299 * newData[i] +
            0.587 * newData[i + 1] +
            0.114 * newData[i + 2];
         newData[i] = gray; // R
         newData[i + 1] = gray; // G
         newData[i + 2] = gray; // B
         // Alpha remains unchanged
      }

      return {
         data: newData,
         width: imageData.width,
         height: imageData.height,
      };
   }

   // Invert colors
   static invert(imageData: ImageData): ImageData {
      const newData = new Uint8ClampedArray(imageData.data);

      for (let i = 0; i < newData.length; i += 4) {
         newData[i] = 255 - newData[i]; // R
         newData[i + 1] = 255 - newData[i + 1]; // G
         newData[i + 2] = 255 - newData[i + 2]; // B
         // Alpha remains unchanged
      }

      return {
         data: newData,
         width: imageData.width,
         height: imageData.height,
      };
   }
}
