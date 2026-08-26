import path from 'path';
import fs from 'fs';

// Only import/initialize ImageKit when credentials are present
let imagekit: any = null;

const isImageKitConfigured = (): boolean => {
  return !!(
    process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT
  );
};

const getImageKit = () => {
  if (!imagekit && isImageKitConfigured()) {
    try {
      // Dynamic require to avoid initialization error when keys are missing
      const ImageKit = require('imagekit');
      imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
      });
      console.log('[ImageKit] Initialized successfully.');
    } catch (err: any) {
      console.warn('[ImageKit] Initialization failed:', err.message);
    }
  }
  return imagekit;
};

interface UploadResult {
  url: string;
  fileId: string;
  name: string;
  size: number;
}

/**
 * Upload a file to ImageKit from a local file path.
 * Falls back to local static URL if ImageKit is not configured.
 */
export const uploadToImageKit = async (
  filePath: string,
  folder: string = 'scaleup-media',
  fileName?: string
): Promise<UploadResult> => {
  const kit = getImageKit();

  if (!kit) {
    // Return local static path as fallback
    const localFileName = path.basename(filePath);
    const localUrl = `/uploads/${localFileName}`;
    console.log('[ImageKit] Not configured — using local fallback URL:', localUrl);
    return {
      url: localUrl,
      fileId: `local_${Date.now()}`,
      name: localFileName,
      size: 0,
    };
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const resolvedFileName = fileName || path.basename(filePath);

    const result = await kit.upload({
      file: fileBuffer,
      fileName: resolvedFileName,
      folder,
      useUniqueFileName: true,
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      size: result.size,
    };
  } catch (err: any) {
    console.error('[ImageKit] Upload failed:', err.message);
    throw new Error(`ImageKit upload failed: ${err.message}`);
  }
};

/**
 * Delete a file from ImageKit by fileId.
 */
export const deleteFromImageKit = async (fileId: string): Promise<void> => {
  const kit = getImageKit();

  if (!kit) {
    console.log('[ImageKit] Not configured — skipping delete for fileId:', fileId);
    return;
  }
  if (fileId.startsWith('local_')) {
    return; // Local fallback file, nothing to delete from ImageKit
  }
  try {
    await kit.deleteFile(fileId);
    console.log('[ImageKit] Deleted file:', fileId);
  } catch (err: any) {
    console.warn('[ImageKit] Delete warning:', err.message);
  }
};

/**
 * Upload a buffer directly (for stream/memory uploads).
 */
export const uploadBufferToImageKit = async (
  buffer: Buffer,
  fileName: string,
  folder: string = 'scaleup-media'
): Promise<UploadResult> => {
  const kit = getImageKit();

  if (!kit) {
    console.log('[ImageKit] Not configured — using placeholder for buffer upload');
    return {
      url: '',
      fileId: `local_${Date.now()}`,
      name: fileName,
      size: buffer.length,
    };
  }

  try {
    const result = await kit.upload({
      file: buffer,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      size: result.size,
    };
  } catch (err: any) {
    console.error('[ImageKit] Buffer upload failed:', err.message);
    throw new Error(`ImageKit buffer upload failed: ${err.message}`);
  }
};

export { isImageKitConfigured, getImageKit };
