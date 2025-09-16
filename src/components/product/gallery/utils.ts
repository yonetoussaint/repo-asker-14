import { GalleryItem } from './types';

// Helper function to combine images, videos, and 3D models into a unified gallery
export function createGalleryItems(images: string[], videos: any[] = [], model3dUrl?: string | any): GalleryItem[] {
  const items: GalleryItem[] = [];

  // Handle model3dUrl that might come as object from Supabase (can be string, object with value, or null)
  const processedModel3dUrl =
    typeof model3dUrl === 'string'
      ? model3dUrl
      : model3dUrl && typeof model3dUrl === 'object' && typeof (model3dUrl as any).value === 'string'
      ? (model3dUrl as any).value
      : null;

  // Add main image first if available
  if (images.length > 0) {
    items.push({
      type: 'image',
      src: images[0],
      index: items.length
    });
  }

  // Add 3D model second if available and valid
  if (typeof processedModel3dUrl === 'string' && processedModel3dUrl.trim() !== '') {
    items.push({
      type: 'model3d',
      src: processedModel3dUrl,
      index: items.length
    });
  }

  // Add remaining images (from index 1 onwards)
  images.slice(1).forEach((image) => {
    items.push({
      type: 'image',
      src: image,
      index: items.length
    });
  });

  // Add videos
  videos.forEach((video) => {
    items.push({
      type: 'video',
      src: video.video_url,
      videoData: video,
      index: items.length
    });
  });

  return items;
}