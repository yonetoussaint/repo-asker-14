import React from 'react';
import { ArrowUpToLine } from 'lucide-react';
import ImageGalleryControls from '@/components/product/ImageGalleryControls';
import VideoControls from '@/components/product/VideoControls';
import { GalleryItem } from './types';

interface FullscreenGalleryProps {
  isVisible: boolean;
  currentItem: GalleryItem;
  currentIndex: number;
  totalItems: number;
  isRotated: number;
  isFlipped: boolean;
  zoomLevel: number;
  imageFilter: string;
  focusMode: boolean;
  autoScrollEnabled: boolean;
  seller?: any;
  // Video props
  isPlaying?: boolean;
  isMuted?: boolean;
  volume?: number;
  currentTime?: number;
  duration?: number;
  bufferedTime?: number;
  onToggleFullscreen: () => void;
  onRotate: () => void;
  onFlip: () => void;
  onToggleAutoScroll: () => void;
  onToggleFocusMode: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onDownload: (index: number) => void;
  onSellerClick?: () => void;
  // Video handlers
  onToggleVideo?: () => void;
  onMuteToggle?: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (time: number) => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  onFullscreenVideo?: () => void;
}

const FullscreenGallery: React.FC<FullscreenGalleryProps> = ({
  isVisible,
  currentItem,
  currentIndex,
  totalItems,
  isRotated,
  isFlipped,
  zoomLevel,
  imageFilter,
  focusMode,
  autoScrollEnabled,
  seller,
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  bufferedTime,
  onToggleFullscreen,
  onRotate,
  onFlip,
  onToggleAutoScroll,
  onToggleFocusMode,
  onPrevious,
  onNext,
  onDownload,
  onSellerClick,
  onToggleVideo,
  onMuteToggle,
  onVolumeChange,
  onSeek,
  onSkipForward,
  onSkipBackward,
  onFullscreenVideo
}) => {
  if (!isVisible) return null;

  const isCurrentVideo = currentItem?.type === 'video';

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-fade-in"
      onClick={onToggleFullscreen}
    >
      <button 
        className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
        onClick={onToggleFullscreen}
      >
        <ArrowUpToLine className="h-5 w-5" />
      </button>

      {isCurrentVideo ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            src={currentItem.src}
            className="max-w-[90%] max-h-[90%] object-contain"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVideo?.();
            }}
            playsInline
            loop
            muted={isMuted}
            autoPlay={false}
            style={{ background: "black" }}
            controls={false}
            onError={(e) => {
              console.error('Fullscreen video loading error:', e);
            }}
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 pointer-events-none">
            <div className="pointer-events-auto h-full w-full flex items-end">
              <VideoControls
                isPlaying={isPlaying || false}
                isMuted={isMuted || true}
                volume={volume || 1}
                onPlayPause={onToggleVideo}
                onMuteToggle={onMuteToggle}
                onVolumeChange={onVolumeChange}
                currentTime={currentTime || 0}
                duration={duration || 0}
                bufferedTime={bufferedTime || 0}
                onSeek={onSeek}
                onSkipForward={onSkipForward}
                onSkipBackward={onSkipBackward}
                onFullscreenToggle={onFullscreenVideo}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <img 
            src={currentItem.src} 
            alt={`Product fullscreen image ${currentIndex + 1}`} 
            className="max-w-[90%] max-h-[90%] object-contain"
            style={{
              transform: `
                rotate(${isRotated}deg)
                ${isFlipped ? 'scaleX(-1)' : ''}
                scale(${zoomLevel})
              `,
              filter: imageFilter !== "none"
                ? imageFilter === "grayscale" ? "grayscale(1)"
                  : imageFilter === "sepia" ? "sepia(0.7)"
                    : imageFilter === "brightness" ? "brightness(1.2)"
                      : imageFilter === "contrast" ? "contrast(1.2)"
                        : "none"
                : "none"
            }}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              console.error('Fullscreen image loading error:', e);
            }}
          />
          <ImageGalleryControls
            currentIndex={currentIndex}
            totalImages={totalItems}
            isRotated={isRotated}
            isFlipped={isFlipped}
            autoScrollEnabled={autoScrollEnabled}
            focusMode={focusMode}
            variant="fullscreen"
            seller={seller}
            onRotate={(e) => {
              if (e) e.stopPropagation();
              onRotate();
            }}
            onFlip={(e) => {
              if (e) e.stopPropagation();
              onFlip();
            }}
            onToggleAutoScroll={onToggleAutoScroll}
            onToggleFocusMode={onToggleFocusMode}
            onPrevious={(e) => {
              if (e) e.stopPropagation();
              onPrevious();
            }}
            onNext={(e) => {
              if (e) e.stopPropagation();
              onNext();
            }}
            onDownload={(e) => {
              if (e) e.stopPropagation();
              onDownload(currentIndex);
            }}
            onSellerClick={onSellerClick}
          />
        </>
      )}
    </div>
  );
};

export default FullscreenGallery;