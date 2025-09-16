import React, { useState } from "react";
import { LucideIcon } from "lucide-react";
import { HEADER_ICON_SIZE, HEADER_ICON_STROKE_WIDTH } from "./constants";

interface HeaderActionButtonProps {
  Icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  progress: number;
  activeColor?: string;
  badge?: number;
  fillWhenActive?: boolean;
  transform?: string;
  likeCount?: number;
  shareCount?: number;
}

const HeaderActionButton = ({ 
  Icon, 
  active = false, 
  onClick, 
  progress, 
  activeColor = '#f97316',
  badge,
  fillWhenActive = true,
  transform = '',
  likeCount,
  shareCount
}: HeaderActionButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    
    // Only trigger animation for heart icon (you might need to adjust this condition)
    if (Icon.name === "Heart" || Icon.displayName === "Heart") {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 700); // Match animation duration
    }
  };

  // Determine which count to show
  const count = likeCount ?? shareCount;

  // Improved transition thresholds for smoother animation
  const expandedThreshold = 0.2;
  const fadingThreshold = 0.4;

  // Show horizontal layout with count in non-scroll state
  if (count !== undefined && progress < expandedThreshold) {
    return (
      <div 
        className="flex items-center gap-1.5 px-2.5 h-7 rounded-full transition-all duration-500 ease-out hover-scale"
        style={{ 
          backgroundColor: `rgba(0, 0, 0, ${0.15 * (1 - progress)})`,
          transform: `scale(${1 - progress * 0.1})`,
        }}
      >
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 transition-all duration-500 ease-out relative"
        >
          <Icon
            size={HEADER_ICON_SIZE}
            strokeWidth={HEADER_ICON_STROKE_WIDTH}
            className={`transition-all duration-500 ease-out ${isAnimating ? 'heart-animation' : ''}`}
            style={{
              fill: active && fillWhenActive ? activeColor : 'transparent',
              color: active ? activeColor : `rgba(255, 255, 255, ${0.95 - (progress * 0.2)})`
            }}
          />
          <span 
            className="text-xs font-medium transition-all duration-500 ease-out animate-fade-in"
            style={{
              color: active ? activeColor : `rgba(255, 255, 255, ${0.95 - (progress * 0.2)})`,
              opacity: 1 - (progress / expandedThreshold),
            }}
          >
            {count}
          </span>
        </button>
      </div>
    );
  }

  // Transitional state - fading count while shrinking
  if (count !== undefined && progress < fadingThreshold) {
    const transitionProgress = (progress - expandedThreshold) / (fadingThreshold - expandedThreshold);

    return (
      <div 
        className="flex items-center rounded-full transition-all duration-500 ease-out"
        style={{ 
          backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})`,
          paddingLeft: `${12 - (transitionProgress * 8)}px`,
          paddingRight: `${12 - (transitionProgress * 8)}px`,
          paddingTop: `${6 - (transitionProgress * 2)}px`,
          paddingBottom: `${6 - (transitionProgress * 2)}px`,
          transform: `scale(${1 - progress * 0.05})`,
        }}
      >
        <button
          onClick={handleClick}
          className="flex items-center transition-all duration-500 ease-out relative"
          style={{
            gap: `${6 - (transitionProgress * 6)}px`,
          }}
        >
          <Icon
            size={HEADER_ICON_SIZE}
            strokeWidth={HEADER_ICON_STROKE_WIDTH}
            className={`transition-all duration-500 ease-out ${isAnimating ? 'heart-animation' : ''}`}
            style={{
              fill: active && fillWhenActive ? activeColor : 'transparent',
              color: active ? activeColor : progress > 0.5 
                ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
                : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`
            }}
          />
          <span 
            className="text-xs font-medium transition-all duration-500 ease-out"
            style={{
              color: active ? activeColor : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`,
              opacity: 1 - transitionProgress,
              transform: `scaleX(${1 - transitionProgress})`,
              transformOrigin: 'left center',
              width: `${20 * (1 - transitionProgress)}px`,
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            {count}
          </span>
        </button>
      </div>
    );
  }

  // Compact circular button state
  return (
    <div 
      className="rounded-full transition-all duration-500 ease-out hover-scale"
      style={{ 
        backgroundColor: transform ? 'transparent' : `rgba(0, 0, 0, ${0.1 * (1 - progress)})`,
      }}
    >
      <button
        onClick={handleClick}
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-500 ease-out relative"
        style={{
          transform: `scale(${0.9 + (progress * 0.1)})`,
        }}
      >
        <Icon
          size={HEADER_ICON_SIZE}
          strokeWidth={HEADER_ICON_STROKE_WIDTH}
          className={`transition-all duration-500 ease-out ${isAnimating ? 'heart-animation' : ''}`}
          style={{
            fill: active && fillWhenActive ? activeColor : 'transparent',
            color: active ? activeColor : progress > 0.5 
              ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
              : `rgba(255, 255, 255, ${0.9 - (progress * 0.3)})`
          }}
        />
        {badge && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] rounded-full h-3 w-3 flex items-center justify-center animate-scale-in">
            {badge}
          </span>
        )}
      </button>
    </div>
  );
};

export default HeaderActionButton;