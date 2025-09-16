
import React from "react";
import { Search } from "lucide-react";

interface HeroSearchProps {
  onSearchClick: () => void;
}

const HeroSearch: React.FC<HeroSearchProps> = ({ onSearchClick }) => {
  return (
    <div 
      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4"
      onClick={onSearchClick}
    >
      <div className="bg-white/90 backdrop-blur-sm flex items-center px-4 py-3 rounded-full shadow-lg border border-gray-100 cursor-pointer hover:bg-white transition-all duration-300">
        <Search className="text-gray-500 mr-3" size={20} />
        <span className="text-gray-500">Search products, brands and categories...</span>
      </div>
    </div>
  );
};

export default HeroSearch;
