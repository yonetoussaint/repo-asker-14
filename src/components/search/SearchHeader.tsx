import React, { useState, useRef } from 'react';
import { ChevronLeft, Search, X, ScanLine } from 'lucide-react';

// Mock Button component
const Button = ({ variant, size, className, onClick, children, ...props }: any) => (
  <button 
    className={`inline-flex items-center justify-center border-none bg-transparent cursor-pointer ${className || ''}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

// Mock Input component
const Input = React.forwardRef<HTMLInputElement, any>(({ className, ...props }, ref) => (
  <input 
    ref={ref}
    className={`w-full px-3 py-2 border rounded outline-none ${className || ''}`}
    {...props}
  />
));

const SearchHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const inputRef = useRef(null);

  const navigate = (direction) => {
    console.log('Navigate:', direction);
    // Mock navigation function
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Search for:', searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onVoiceSearch = () => {
    setIsVoiceActive(!isVoiceActive);
    console.log('Voice search toggled:', !isVoiceActive);
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="flex items-center pr-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0 m-0 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-6 w-6 text-gray-900 font-bold" strokeWidth={2.5} />
        </Button>

        <div className="flex-1 relative">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 pl-8 pr-8 rounded-2xl bg-gray-50 border border-black focus:bg-white focus:ring-2 focus:ring-red-500 focus:shadow-lg transition-all text-base sm:text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />

            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-full hover:bg-gray-200 active:scale-95 transition-all"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full hover:bg-gray-200 active:scale-95 transition-all"
            onClick={() => {}}
          >
            <ScanLine className="h-6 w-6 text-gray-900 font-bold" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;