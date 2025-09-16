
import React from "react";
import { Eye } from "lucide-react";

interface LiveBadgeProps {
  progress: number;
  views: number;
}

const LiveBadge = ({ progress, views }: LiveBadgeProps) => {
  return (
    <div className="backdrop-blur-sm h-7 rounded-full px-2.5 flex items-center transition-all duration-700"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${0.1 + (progress * 0.85)})`,
        backdropFilter: `blur(${4 + (progress * 4)}px)`
      }}>
      <div className="flex items-center gap-1.5">
        <Eye size={12} className="transition-all duration-700"
          style={{
            color: progress > 0.5 
              ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
              : `rgba(255, 255, 255, ${0.8 - (progress * 0.2)})`
          }} />
        <span className="text-xs font-medium transition-all duration-700"
          style={{
            color: progress > 0.5 
              ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
              : `rgba(255, 255, 255, ${0.8 - (progress * 0.2)})`
          }}>{views} views</span>
      </div>
    </div>
  );
};

export default LiveBadge;
