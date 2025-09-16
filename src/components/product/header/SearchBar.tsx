
import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  progress: number;
  isGlowing?: boolean;
}

const SearchBar = ({ searchQuery, setSearchQuery, progress, isGlowing = false }: SearchBarProps) => {
  return (
    <div className="relative flex-1 max-w-xs">
      <div className="relative flex items-center h-7 rounded-full bg-gray-100">
        <div className="absolute left-2 flex items-center justify-center">
          <Search 
            size={14} 
            className="text-gray-500"
            strokeWidth={2}
          />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products"
          className="bg-transparent w-full h-full pl-7 pr-3 py-1 text-sm rounded-full outline-none text-gray-700"
        />
      </div>
    </div>
  );
};

export default SearchBar;
