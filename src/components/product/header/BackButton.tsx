import React from "react";
import { ChevronLeft, X } from "lucide-react";
import { BACK_BUTTON_ICON_SIZE, HEADER_ICON_STROKE_WIDTH } from "./constants";

interface BackButtonProps {
  progress: number;
  showCloseIcon?: boolean; // New prop to control icon type
  onClick?: () => void; // New prop for custom click handler
}

const BackButton = ({ progress, showCloseIcon = false, onClick }: BackButtonProps) => {
  const IconComponent = showCloseIcon ? X : ChevronLeft;
  
  return (
    <div className="rounded-full transition-all duration-700"
      style={{ backgroundColor: `rgba(0, 0, 0, ${0.1 * (1 - progress)})` }}>
      <button 
        className="h-8 w-8 rounded-full flex items-center justify-center p-1 transition-all duration-700"
        onClick={onClick}
      >
        <IconComponent
          size={BACK_BUTTON_ICON_SIZE} // Larger size for back button
          strokeWidth={HEADER_ICON_STROKE_WIDTH} // Changed to constant
          className="transition-all duration-700"
          style={{
            color: progress > 0.5 
              ? `rgba(75, 85, 99, ${0.7 + (progress * 0.3)})` 
              : `rgba(255, 255, 255, ${0.9 - (progress * 0.2)})`
          }}
        />
      </button>
    </div>
  );
};

export default BackButton;