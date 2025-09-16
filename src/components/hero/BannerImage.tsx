import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface BannerImageProps {
  src: string;
  alt: string;
  className?: string;
  type?: "image" | "video";
  isActive?: boolean;
  onVideoDurationChange?: (duration: number) => void;
}

const BannerImage: React.FC<BannerImageProps> = ({
  src,
  alt,
  className = "",
  type = "image",
  isActive = false,
  onVideoDurationChange,
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    if (videoRef.current && isActive && loaded) {
      videoRef.current.play().catch(console.error);
    } else if (videoRef.current && !isActive) {
      videoRef.current.pause();
    }
  }, [isActive, loaded]);

  const handleError = () => setError(true);
  const handleLoad = () => setLoaded(true);
  
  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setLoaded(true);
    if (onVideoDurationChange && video.duration && !isNaN(video.duration)) {
      // Convert to milliseconds and add a small buffer
      onVideoDurationChange(Math.floor(video.duration * 1000) + 500);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <div className="text-center p-4">
          <span className="text-gray-500 block">{type === "video" ? "Video" : "Image"} failed to load</span>
          <span className="text-xs text-gray-400 block mt-1">{src}</span>
        </div>
      </div>
    );
  }

  const baseClass = `w-full h-full object-cover ${className} ${
    !loaded ? "opacity-0" : "opacity-100 transition-opacity duration-300"
  }`;

  return type === "video" ? (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        className={baseClass}
        onLoadedMetadata={handleVideoLoadedMetadata}
        onError={handleError}
        autoPlay={isActive}
        muted
        loop={false}
        playsInline
        preload="metadata"
      />
      {loaded && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors z-10"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={baseClass}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default BannerImage;