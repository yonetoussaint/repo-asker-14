export interface BannerType {
  id: string;
  image: string; // This can be an image or video URL
  type: "image" | "video"; // NEW: explicitly define the media type
  alt?: string;
  position: number;
  created_at?: string;
  updated_at?: string;
  duration?: number; // Optional: time in ms to show this slide before transitioning
}