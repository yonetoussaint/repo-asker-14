
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Maximize,
  Settings
} from "lucide-react";

interface VideoControlsProps {
  isPlaying?: boolean;
  isMuted?: boolean;
  volume?: number;
  onPlayPause?: () => void;
  onMuteToggle?: () => void;
  onVolumeChange?: (newVolume: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (newTime: number) => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  bufferedTime?: number;
  onFullscreenToggle?: () => void;
}

const AUTOHIDE_TIMEOUT = 5000;

const VideoControls = ({
  isPlaying = false,
  isMuted = false,
  volume = 0.7,
  onPlayPause = () => {},
  onMuteToggle = () => {},
  onVolumeChange = () => {},
  currentTime = 0,
  duration = 0,
  onSeek,
  onSkipForward,
  onSkipBackward,
  bufferedTime = 0,
  onFullscreenToggle = () => {},
}: VideoControlsProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

  // New: hide controls after inactivity
  const [isVisible, setIsVisible] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  const resetHideTimer = useCallback(() => {
    setIsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setIsVisible(false);
    }, AUTOHIDE_TIMEOUT);
  }, []);

  // Hides controls immediately (e.g. on backdrop click)
  const hideControlsNow = useCallback(() => {
    setIsVisible(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  // Show when mouse over controls, hide after mouse leaves (with delay)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleMouseMove = () => resetHideTimer();
    const handleTouch = () => resetHideTimer();
    const handleKeydown = () => resetHideTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouch);
    window.addEventListener("keydown", handleKeydown);

    // Enable initially
    resetHideTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("keydown", handleKeydown);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [resetHideTimer]);

  // Always show when relevant popups open (e.g., settings, slider), and pause autohide while interacting
  useEffect(() => {
    if (isSettingsOpen || isVolumeSliderVisible) {
      setIsVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    } else {
      resetHideTimer();
    }
  }, [isSettingsOpen, isVolumeSliderVisible, resetHideTimer]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, []);

  const getVolumeIcon = useCallback(() => {
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.3) return <Volume className="h-4 w-4" />;
    if (volume < 0.7) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  }, [isMuted, volume]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSeek) onSeek(Number(e.target.value));
    resetHideTimer();
  };

  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(Number(e.target.value));
    resetHideTimer();
  };

  // Make the container pointer events off only if hidden
  // The root overlay should *not* add any backdrop blur, only the bar and buttons.
  return (
    <div 
      ref={rootRef}
      className={`absolute inset-0 flex flex-col justify-end z-20 transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      // Now only handle pointer interactions for autohide, not styles
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      // Hide controls immediately if you click/tap on root wrapper but not on controls
      onClick={e => {
        // avoid closing if click is on controls/buttons (they stop propagation)
        if (e.target === rootRef.current) {
          hideControlsNow();
        }
      }}
      onMouseEnter={resetHideTimer}
      tabIndex={-1}
      style={{ background: "none" }} // Ensure: no root bg/blurring
    >
      {/* Dark overlay region (but no blur) for clickable area */}
      {/* Central controls */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="flex items-center gap-12 pointer-events-auto">
          <button
            className="h-10 w-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-white hover:bg-black/20"
            onClick={onSkipBackward}
            aria-label="Skip Backward"
            tabIndex={0}
            type="button"
            onClickCapture={resetHideTimer}
          >
            <SkipBack className="h-5 w-5" />
          </button>
          
          <button
            className="h-14 w-14 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white hover:bg-black/20"
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            tabIndex={0}
            type="button"
            onClickCapture={resetHideTimer}
          >
            {isPlaying ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="h-7 w-7" />
            )}
          </button>

          <button
            className="h-10 w-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-white hover:bg-black/20"
            onClick={onSkipForward}
            aria-label="Skip Forward"
            tabIndex={0}
            type="button"
            onClickCapture={resetHideTimer}
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Bar background is where we want the blur */}
      <div className="w-full bg-gradient-to-t from-black/90 to-transparent p-4 pointer-events-auto relative z-30 backdrop-blur-sm">
        <div className="w-full mb-4 px-1">
          <div className="relative h-1 bg-gray-600 rounded overflow-hidden group">
            <div 
              className="absolute top-0 left-0 h-full bg-gray-400 bg-opacity-50" 
              style={{ width: duration ? `${(bufferedTime / duration) * 100}%` : "0%" }}
            />
            <div 
              className="absolute top-0 left-0 h-full bg-white" 
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
            />
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Seek"
              onChange={handleSeek}
              tabIndex={0}
              onMouseDown={() => setIsVolumeSliderVisible(true)}
              onMouseUp={() => setIsVolumeSliderVisible(false)}
              onTouchStart={() => setIsVolumeSliderVisible(true)}
              onTouchEnd={() => setIsVolumeSliderVisible(false)}
              onClickCapture={resetHideTimer}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="h-10 w-10 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 text-white"
              onClick={onMuteToggle}
              aria-label={isMuted ? "Unmute" : "Mute"}
              tabIndex={0}
              type="button"
              onClickCapture={resetHideTimer}
            >
              {getVolumeIcon()}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeSlider}
              className="w-20 h-2 accent-purple-500"
              aria-label="Volume"
              onFocus={() => setIsVolumeSliderVisible(true)}
              onBlur={() => setIsVolumeSliderVisible(false)}
              onMouseDown={() => setIsVolumeSliderVisible(true)}
              onMouseUp={() => setIsVolumeSliderVisible(false)}
              onTouchStart={() => setIsVolumeSliderVisible(true)}
              onTouchEnd={() => setIsVolumeSliderVisible(false)}
              onClickCapture={resetHideTimer}
            />

            <div className="text-xs text-white">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="h-8 w-8 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 text-white"
              onClick={() => setIsSettingsOpen(x => !x)}
              aria-label="Settings"
              tabIndex={0}
              type="button"
              onClickCapture={resetHideTimer}
            >
              <Settings className="h-5 w-5" />
            </button>

            <button
              className="h-8 w-8 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center hover:bg-black/20 text-white"
              onClick={onFullscreenToggle}
              aria-label="Fullscreen"
              tabIndex={0}
              type="button"
              onClickCapture={resetHideTimer}
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;

