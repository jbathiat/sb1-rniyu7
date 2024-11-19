import { ImageOverlay } from '../types';

export const createThumbnail = async (
  imageUrl: string,
  maxWidth: number = 400,
  maxHeight: number = 600
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate thumbnail dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
};

export const processImage = async (
  originalImage: string,
  overlayImage: string,
  options = { preserveOriginal: true }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const overlay = new Image();

    img.onload = () => {
      overlay.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Set canvas size to match the overlay image dimensions
        canvas.width = overlay.width;
        canvas.height = overlay.height;

        // Calculate scaling and positioning to fit the photo within the overlay
        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );

        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        // Draw the original image scaled and centered
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        // Draw the overlay image on top
        ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a data URL
        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };

      overlay.onerror = () => {
        reject(new Error('Failed to load overlay image'));
      };

      overlay.src = overlayImage;
    };

    img.onerror = () => {
      reject(new Error('Failed to load original image'));
    };

    img.src = originalImage;
  });
};

export const processImageWithOverlays = async (
  originalImage: string,
  overlays: ImageOverlay[]
): Promise<string> => {
  try {
    let processedImage = originalImage;
    const enabledOverlays = overlays.filter(overlay => overlay.enabled);

    for (const overlay of enabledOverlays) {
      try {
        processedImage = await processImage(processedImage, overlay.url);
      } catch (error) {
        console.error(`Failed to apply overlay ${overlay.id}:`, error);
      }
    }

    return processedImage;
  } catch (error) {
    console.error('Failed to process image with overlays:', error);
    return originalImage;
  }
};