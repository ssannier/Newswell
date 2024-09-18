// cropimage.js

/**
 * Creates an image from a URL and returns a Promise that resolves with the Image object.
 */
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.crossOrigin = "anonymous"; // Handle cross-origin images
    image.src = url;
  });

/**
 * Converts degrees to radians.
 */
export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Calculates the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Crops an image based on provided crop area, rotation, and flip settings.
 * Returns a Promise that resolves with a Blob of the cropped image.
 */
export default async function getCroppedImg(imageFile, pixelCrop) {
  const imageUrl = URL.createObjectURL(imageFile);
  const image = await createImage(imageUrl);
  console.log("Original image dimensions:", image.width, image.height);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    URL.revokeObjectURL(imageUrl);
    return null;
  }

  // Set canvas size to match the image dimensions
  canvas.width = image.width;
  canvas.height = image.height;
  console.log("Canvas dimensions after setting to image dimensions:", canvas.width, canvas.height);

  // Draw the image on the canvas
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    URL.revokeObjectURL(imageUrl);
    return null;
  }

  // Calculate the cropped canvas dimensions based on the original image dimensions and the crop area
  const croppedWidth = Math.min(pixelCrop.width, image.width - pixelCrop.x);
  const croppedHeight = Math.min(pixelCrop.height, image.height - pixelCrop.y);

  // Set the size of the cropped canvas
  croppedCanvas.width = croppedWidth;
  croppedCanvas.height = croppedHeight;
  console.log("Cropped canvas dimensions:", croppedCanvas.width, croppedCanvas.height);

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(canvas, pixelCrop.x, pixelCrop.y, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
  console.log("Cropped image dimensions:", croppedWidth, croppedHeight);

  // Revoke the image URL to free up resources
  URL.revokeObjectURL(imageUrl);

  // Return the cropped image as a Blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to convert canvas to blob"));
      }
    }, "image/jpeg");
  });
}
