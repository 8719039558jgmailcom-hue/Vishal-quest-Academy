export async function processCustomAvatarFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a valid image file (PNG, JPG, or WebP).');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image size must be under 8 MB.');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read selected image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to load selected image file.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Invalid or unsupported image format.'));
    image.src = dataUrl;
  });

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable.');
  }

  // Square center-crop so any portrait or landscape photo fits the RPG avatar frame
  const minSide = Math.min(img.width, img.height);
  const sx = Math.max(0, Math.floor((img.width - minSide) / 2));
  const sy = Math.max(0, Math.floor((img.height - minSide) / 2));

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

  const compressed = canvas.toDataURL('image/jpeg', 0.82);
  if (compressed.length > 320_000) {
    return canvas.toDataURL('image/jpeg', 0.65);
  }
  return compressed;
}
