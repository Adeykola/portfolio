/**
 * Optimizes an image by resizing and compressing it.
 * @param file The image file to optimize.
 * @param maxWidth The maximum width for the optimized image. Defaults to 1200px.
 * @param maxHeight The maximum height for the optimized image. Defaults to 1200px.
 * @param quality The compression quality (0 to 1). Defaults to 0.8 (80%).
 * @returns A Promise that resolves with the optimized image as a Blob.
 */
export const optimizeImage = (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions to fit within maxWidth/maxHeight while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas content to Blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          file.type, // Use original file type for output
          quality
        );
      };

      img.onerror = (error) => {
        reject(new Error('Image loading failed: ' + error));
      };
    };

    reader.onerror = (error) => {
      reject(new Error('File reading failed: ' + error));
    };

    reader.readAsDataURL(file);
  });
};