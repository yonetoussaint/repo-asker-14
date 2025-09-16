import React from 'react';
import { Play } from 'lucide-react';

interface ReelsPlayPauseOverlayProps {
  isPlaying: boolean;
  onVideoClick: (event?: React.MouseEvent) => void;
}

export const ReelsPlayPauseOverlay: React.FC<ReelsPlayPauseOverlayProps> = ({
  isPlaying,
  onVideoClick,
}) => {
  if (isPlaying) return null;

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
      onClick={onVideoClick}
    >
      <div className="bg-black/50 rounded-full p-4">
        <Play className="h-12 w-12 text-white fill-white" />
      </div>
    </div>
  );
};