import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface ReelsMuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ReelsMuteButton: React.FC<ReelsMuteButtonProps> = ({
  isMuted,
  onToggleMute,
}) => {
  return (
    <button 
      className="fixed top-16 right-4 z-20 bg-black/30 rounded-full p-2 text-white"
      onClick={onToggleMute}
    >
      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  );
};