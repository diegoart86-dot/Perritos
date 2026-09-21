/**
 * Mobile-friendly image processor for pet memories
 * Supports:
 * - Direct camera uploads on iOS / Android
 * - Automatic HEIC/HEIF conversion for iPhone photos
 * - Memory-efficient decoding via ObjectURL (avoids RAM crashes on 12MP+ photos)
 * - Proportional canvas downscaling to lightweight JPEG (~25-35KB)
 */

export async function processPetPhoto(file: File): Promise<string> {
  if (!file) {
    throw new Error('No se seleccionó ningún archivo');
  }

  // Check if it is an image or potential photo
  const fileName = file.name || '';
  const fileType = (file.type || '').toLowerCase();
  const isImageMime = fileType.startsWith('image/');
  const isImageExt = /\.(jpe?g|png|webp|gif|bmp|heic|heif|jfif|svg)$/i.test(fileName);

  // If mobile doesn't provide mime type, allow if size > 0 and not clearly non-image
  if (!isImageMime && !isImageExt && fileType !== '' && fileType !== 'application/octet-stream') {
    throw new Error('Por favor selecciona un archivo de imagen válido (JPG, PNG, HEIC, WEBP).');
  }

  let blobToProcess: Blob = file;

  // 1. Check for HEIC/HEIF (common default on iPhone)
  const isHeic = 
    fileType.includes('heic') || 
    fileType.includes('heif') || 
    /\.(heic|heif)$/i.test(fileName);

  if (isHeic) {
    try {
      // Dynamically load heic2any
      const heicModule = await import('heic2any');
      const heic2any = heicModule.default || heicModule;
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.85,
      });

      blobToProcess = Array.isArray(converted) ? converted[0] : converted;
    } catch (err) {
      console.warn('heic2any conversion fallback or failed:', err);
      // Proceed with original blob in case the browser can decode it natively (e.g. Safari iOS 17+)
    }
  }

  // 2. Decode using ObjectURL (low memory footprint on mobile devices)
  const objectUrl = URL.createObjectURL(blobToProcess);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      // On mobile, crossOrigin is not needed for local blobs
      image.onload = () => resolve(image);
      image.onerror = () => {
        reject(new Error('No se pudo decodificar la imagen. Asegúrate de que no esté corrupta o intenta con otra foto.'));
      };
      image.src = objectUrl;
    });

    // 3. Scale down for optimal storage and rendering
    const maxDim = 500;
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;

    if (!width || !height) {
      throw new Error('Dimensiones de imagen no válidas');
    }

    if (width > height) {
      if (width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      }
    } else {
      if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) {
      throw new Error('Canvas 2D context no disponible');
    }

    // High quality interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, width, height);

    // Export as high quality, compact JPEG
    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
    return compressedDataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
