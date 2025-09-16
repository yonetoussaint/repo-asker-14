
import React from "react";

interface HeroIndicatorsProps {
  slides: Array<any>;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const HeroIndicators: React.FC<HeroIndicatorsProps> = ({
  slides,
  activeIndex,
  setActiveIndex
}) => {
  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
      {slides.map((_, index) => (
        <button
          key={index}
          onClick={() => setActiveIndex(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            activeIndex === index
              ? "bg-white w-6"
              : "bg-white/50 hover:bg-white/80"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default HeroIndicators;
