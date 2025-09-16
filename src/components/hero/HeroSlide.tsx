
import React from "react";

interface HeroSlideProps {
  image: string;
  isActive: boolean;
  alt?: string;
}

const HeroSlide: React.FC<HeroSlideProps> = ({
  image,
  isActive,
  alt = "Banner image"
}) => {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      } bg-cover bg-center`}
    >
      <img 
        src={image} 
        alt={alt}
        className="w-full h-full object-cover" 
      />
    </div>
  );
};

export default HeroSlide;
