/**
 * ImageKit Image Optimization Utility
 * Provides fast, modern responsive image delivery with automatic format conversion (WebP/AVIF),
 * intelligent compression, and dimension constraints.
 */

export interface ImageKitOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'maintain_ratio' | 'force' | 'at_max' | 'at_least';
  blur?: number;
  trim?: boolean | number;
}

/**
 * Optimizes an ImageKit URL with transformation query parameters.
 * Gracefully returns original URL for local files or external assets.
 */
export const getOptimizedImageUrl = (
  url?: string,
  options: ImageKitOptions = {}
): string => {
  if (!url || typeof url !== 'string') return '';

  // Check if this is an ImageKit URL
  const isImageKit =
    url.includes('ik.imagekit.io') ||
    (url.includes('imagekit') && url.startsWith('http'));

  if (!isImageKit) {
    return url;
  }

  const {
    width,
    height,
    quality = 85,
    format = 'auto',
    crop = 'maintain_ratio',
    blur,
    trim,
  } = options;

  const transforms: string[] = [];

  if (trim) {
    transforms.push(typeof trim === 'number' ? `t-${trim}` : 't-true');
  }
  if (width) transforms.push(`w-${width}`);
  if (height) transforms.push(`h-${height}`);
  if (quality) transforms.push(`q-${quality}`);
  if (format) transforms.push(`f-${format}`);
  if (crop && (width || height)) transforms.push(`cm-${crop}`);
  if (blur) transforms.push(`bl-${blur}`);

  if (transforms.length === 0) return url;

  const trString = `tr=${transforms.join(',')}`;

  if (url.includes('?')) {
    if (url.includes('tr=')) {
      return url;
    }
    return `${url}&${trString}`;
  }

  return `${url}?${trString}`;
};

/**
 * Common image sizing presets
 */
export const imagePresets = {
  thumbnail: (url?: string) => getOptimizedImageUrl(url, { width: 400, quality: 80 }),
  card: (url?: string) => getOptimizedImageUrl(url, { width: 800, quality: 85 }),
  hero: (url?: string) => getOptimizedImageUrl(url, { width: 1200, quality: 85 }),
  avatar: (url?: string) => getOptimizedImageUrl(url, { width: 200, height: 200, quality: 85 }),
  logo: (url?: string) => getOptimizedImageUrl(url, { width: 600, quality: 95 }),
  full: (url?: string) => getOptimizedImageUrl(url, { width: 1600, quality: 85 }),
};
