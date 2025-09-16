import React from 'react';
import { GalleryItem as GalleryItemType } from './types';
import VideoPlayer from './VideoPlayer';
import Model3DViewer from './Model3DViewer';

interface GalleryItemProps {
  item: GalleryItemType;
  index: number;
  currentIndex: number;
  isRotated: number;
  isFlipped: boolean;
  zoomLevel: number;
  imageFilter?: string;
  onImageClick: () => void;
  // Video props
  isPlaying?: boolean;
  isMuted?: boolean;
  volume?: number;
  currentTime?: number;
  duration?: number;
  bufferedTime?: number;
  videoRef?: React.RefObject<HTMLVideoElement>;
  imageRef?: React.RefObject<HTMLImageElement>;
  onToggleVideo?: () => void;
  onMuteToggle?: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (time: number) => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  onFullscreenToggle?: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  item,
  index,
  currentIndex,
  isRotated,
  isFlipped,
  zoomLevel,
  imageFilter = "none",
  onImageClick,
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  bufferedTime,
  videoRef,
  imageRef,
  onToggleVideo,
  onMuteToggle,
  onVolumeChange,
  onSeek,
  onSkipForward,
  onSkipBackward,
  onFullscreenToggle
}) => {
  if (item.type === 'model3d') {
    return <Model3DViewer src={item.src} />;
  }

  if (item.type === 'video') {
    return (
      <VideoPlayer
        src={item.src}
        videoData={item.videoData}
        isActive={index === currentIndex}
        isPlaying={isPlaying || false}
        isMuted={isMuted || true}
        volume={volume || 1}
        currentTime={currentTime || 0}
        duration={duration || 0}
        bufferedTime={bufferedTime || 0}
        videoRef={index === currentIndex ? videoRef : undefined}
        onToggleVideo={onToggleVideo}
        onMuteToggle={onMuteToggle}
        onVolumeChange={onVolumeChange}
        onSeek={onSeek}
        onSkipForward={onSkipForward}
        onSkipBackward={onSkipBackward}
        onFullscreenToggle={onFullscreenToggle}
      />
    );
  }

  // Regular image
  return (
    <img
      ref={index === currentIndex ? imageRef : undefined}
      src={item.src}
      alt={`Product image ${index + 1}`}
      className="w-full h-full object-contain transition-transform"
      style={{
        transform: `
          rotate(${isRotated}deg)
          ${isFlipped ? 'scaleX(-1)' : ''}
          scale(${zoomLevel})
        `,
        transition: "transform 0.2s ease-out",
        filter: imageFilter !== "none"
          ? imageFilter === "grayscale" ? "grayscale(1)"
            : imageFilter === "sepia" ? "sepia(0.7)"
              : imageFilter === "brightness" ? "brightness(1.2)"
                : imageFilter === "contrast" ? "contrast(1.2)"
                  : "none"
          : "none"
      }}
      draggable={false}
      onClick={onImageClick}
      onError={(e) => {
        console.error('Image loading error:', e);
      }}
    />
  );
};

export default GalleryItem;