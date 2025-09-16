
import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = 24, height = 24, className = '' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 3264 3264" 
      className={className}
      style={{ 
        shapeRendering: "geometricPrecision", 
        textRendering: "geometricPrecision", 
        imageRendering: "auto", 
        fillRule: "evenodd", 
        clipRule: "evenodd" 
      }}
    >
      <g>
        <path 
          style={{ opacity: 1 }} 
          fill="#ff4d4f" 
          d="M 1632,800 C 1800,800 1950,850 2050,950 C 2150,1050 2200,1200 2200,1400 C 2200,1600 2150,1750 2050,1850 C 1950,1950 1800,2000 1632,2000 C 1464,2000 1314,1950 1214,1850 C 1114,1750 1064,1600 1064,1400 C 1064,1200 1114,1050 1214,950 C 1314,850 1464,800 1632,800 Z"
        />
      </g>
    </svg>
  );
};

export default Logo;
