import type { Area } from "react-easy-crop";

export async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<Blob> {
  const image = await createImage(imageSrc);
  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const boundingWidth = image.width * cos + image.height * sin;
  const boundingHeight = image.width * sin + image.height * cos;

  const rotatedCanvas = document.createElement("canvas");
  const rotatedContext = rotatedCanvas.getContext("2d");
  if (!rotatedContext) throw new Error("Canvas tidak tersedia.");
  rotatedCanvas.width = boundingWidth;
  rotatedCanvas.height = boundingHeight;
  rotatedContext.translate(boundingWidth / 2, boundingHeight / 2);
  rotatedContext.rotate(radians);
  rotatedContext.translate(-image.width / 2, -image.height / 2);
  rotatedContext.drawImage(image, 0, 0);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas tidak tersedia.");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  context.drawImage(rotatedCanvas, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Crop gagal dibuat."))), "image/jpeg", 0.92);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
