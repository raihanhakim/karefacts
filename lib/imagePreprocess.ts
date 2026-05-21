export async function preprocessImageForOcr(fileOrCanvas: File | HTMLCanvasElement): Promise<HTMLCanvasElement> {
  const variants = await createOcrImageVariants(fileOrCanvas);
  return variants.threshold;
}

export async function createOcrImageVariants(fileOrCanvas: File | HTMLCanvasElement): Promise<{
  original: HTMLCanvasElement;
  grayscale: HTMLCanvasElement;
  threshold: HTMLCanvasElement;
}> {
  const sourceCanvas = fileOrCanvas instanceof HTMLCanvasElement ? fileOrCanvas : await fileToCanvas(fileOrCanvas);
  const original = upscaleCanvas(sourceCanvas);
  const grayscale = cloneCanvas(original);
  applyGrayscaleContrast(grayscale);
  const threshold = cloneCanvas(grayscale);
  applyThreshold(threshold);
  sharpenCanvas(threshold);
  return { original, grayscale, threshold };
}

function upscaleCanvas(sourceCanvas: HTMLCanvasElement) {
  const scale = sourceCanvas.width < 900 ? 3 : 2;
  const canvas = document.createElement("canvas");
  canvas.width = sourceCanvas.width * scale;
  canvas.height = sourceCanvas.height * scale;
  const context = canvas.getContext("2d");
  if (!context) return sourceCanvas;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function cloneCanvas(sourceCanvas: HTMLCanvasElement) {
  const canvas = document.createElement("canvas");
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  canvas.getContext("2d")?.drawImage(sourceCanvas, 0, 0);
  return canvas;
}

function applyGrayscaleContrast(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let index = 0; index < data.length; index += 4) {
    const gray = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
    const contrasted = Math.max(0, Math.min(255, (gray - 128) * 1.2 + 128));
    data[index] = contrasted;
    data[index + 1] = contrasted;
    data[index + 2] = contrasted;
  }
  context.putImageData(imageData, 0, 0);
}

function applyThreshold(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let index = 0; index < data.length; index += 4) {
    const value = data[index] > 170 ? 255 : 0;
    data[index] = value;
    data[index + 1] = value;
    data[index + 2] = value;
  }
  context.putImageData(imageData, 0, 0);
}

async function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const image = new Image();
  const url = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Gambar tidak dapat dibaca."));
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext("2d")?.drawImage(image, 0, 0);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function sharpenCanvas(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context || canvas.width < 3 || canvas.height < 3) return;
  const source = context.getImageData(0, 0, canvas.width, canvas.height);
  const output = context.createImageData(source);
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const width = canvas.width;
  const height = canvas.height;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      for (let channel = 0; channel < 3; channel += 1) {
        let value = 0;
        for (let ky = -1; ky <= 1; ky += 1) {
          for (let kx = -1; kx <= 1; kx += 1) {
            const sourceIndex = ((y + ky) * width + (x + kx)) * 4 + channel;
            value += source.data[sourceIndex] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        output.data[(y * width + x) * 4 + channel] = Math.max(0, Math.min(255, value));
      }
      output.data[(y * width + x) * 4 + 3] = 255;
    }
  }
  context.putImageData(output, 0, 0);
}
