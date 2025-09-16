import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AliExpressSearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const AliExpressSearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search...",
  className = "",
  onFocus,
  onBlur
}: AliExpressSearchBarProps) => {
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <div className={cn("flex-1 relative max-w-md mx-auto", className)}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full px-3 py-1 text-sm border border-black rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-black transition-all duration-300"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </form>
    </div>
  );
};

export default AliExpressSearchBar;