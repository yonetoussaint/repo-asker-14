import React from 'react';
import VideoControls from '@/components/product/VideoControls';

interface VideoPlayerProps {
  src: string;
  videoData?: any;
  isActive: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  bufferedTime: number;
  videoRef?: React.RefObject<HTMLVideoElement>;
  onToggleVideo?: () => void;
  onMuteToggle?: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (time: number) => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  onFullscreenToggle?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  videoData,
  isActive,
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  bufferedTime,
  videoRef,
  onToggleVideo,
  onMuteToggle,
  onVolumeChange,
  onSeek,
  onSkipForward,
  onSkipBackward,
  onFullscreenToggle
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <video
        ref={isActive ? videoRef : undefined}
        src={src}
        className="w-full h-full object-contain cursor-pointer"
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%', 
          aspectRatio: '1/1', 
          objectFit: 'cover' 
        }}
        onClick={onToggleVideo}
        playsInline
        loop
        muted={isMuted}
        autoPlay={false}
        poster={videoData?.thumbnail_url}
        preload="metadata"
        onError={(e) => {
          console.error('Video loading error:', e);
        }}
      >
        Your browser does not support the video tag.
      </video>
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto h-full w-full flex items-end">
            <VideoControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              onPlayPause={onToggleVideo}
              onMuteToggle={onMuteToggle}
              onVolumeChange={onVolumeChange}
              currentTime={currentTime}
              duration={duration}
              bufferedTime={bufferedTime}
              onSeek={onSeek}
              onSkipForward={onSkipForward}
              onSkipBackward={onSkipBackward}
              onFullscreenToggle={onFullscreenToggle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;