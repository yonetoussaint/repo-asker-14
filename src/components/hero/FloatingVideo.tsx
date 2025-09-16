import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingVideoProps {
  src: string;
  alt: string;
  isVisible: boolean;
  onClose: () => void;
  onExpand: () => void;
  currentTime?: number;
  headerOffset?: number;
}

const FloatingVideo: React.FC<FloatingVideoProps> = ({
  src,
  alt,
  isVisible,
  onClose,
  onExpand,
  currentTime = 0,
  headerOffset = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current && isVisible) {
      // Only set time once when floating video becomes visible
      videoRef.current.currentTime = currentTime;
      videoRef.current.muted = false; // Enable sound for floating video
      videoRef.current.volume = 0.7; // Set default volume
      videoRef.current.play().catch(console.error);
    }
  }, [isVisible]); // Remove currentTime from dependencies to prevent constant seeking

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed right-2 z-50 w-64 h-36 bg-black rounded-lg overflow-hidden shadow-2xl animate-scale-in"
      style={{ top: `${headerOffset + 16}px` }}
    >
      <div className="relative w-full h-full group">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          autoPlay
          loop={false}
          playsInline
        />
        
        {/* Controls overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
              onClick={onExpand}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Drag to reposition indicator */}
        <div className="absolute bottom-2 left-2 text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {alt}
        </div>
      </div>
    </div>
  );
};

export default FloatingVideo;