import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Heart, Share, Search, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductPageHeaderProps {
  isFavorite: boolean;
  toggleFavorite: () => void;
  handleShare: () => void;
  handleCartClick?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  handleSearch?: (e: React.FormEvent) => void;
  likeCount?: number;
}

const ProductPageHeader: React.FC<ProductPageHeaderProps> = ({
  isFavorite,
  toggleFavorite,
  handleShare,
  handleCartClick = () => {},
  searchQuery = "",
  setSearchQuery = () => {},
  handleSearch = () => {},
  likeCount = 0,
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const searchSuggestions = [
    "Smartphones",
    "Laptops",
    "Gaming consoles",
    "Headphones",
    "Smartwatches",
    "Cameras"
  ];
  
  const activateSearch = () => {
    setIsSearchActive(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };
  
  const deactivateSearch = () => {
    if (searchQuery === "") {
      setIsSearchActive(false);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };
  
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(e);
    setOpen(false);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchActive) {
        deactivateSearch();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isSearchActive]);

  return (
    <div className={`py-1.5 sm:py-2 px-1.5 sm:px-2 w-full sticky top-0 z-30 transition-colors duration-200 ${
      isScrolled ? 'bg-white' : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between gap-3">
        {!isSearchActive && (
          <Link to="/">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-700 hover:bg-black/10 h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0"
            >
              <ChevronLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
          </Link>
        )}
        
        <div className={`relative flex-1 ${isSearchActive ? 'mx-0' : 'mx-3'}`}>
          <form onSubmit={handleSearch} className="w-full">
            <div className={`relative w-full ${isSearchActive ? 'max-w-full' : 'max-w-full'} mx-auto`}>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <div className="relative w-full">
                    <Input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Search products..." 
                      className="h-6 sm:h-7 pl-7 sm:pl-8 pr-7 sm:pr-8 text-[10px] sm:text-xs rounded-full border-gray-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        activateSearch();
                        setOpen(true);
                      }}
                      onBlur={() => {
                        if (!open) {
                          deactivateSearch();
                        }
                      }}
                      onClick={() => setOpen(true)}
                    />
                    <Search className="absolute left-2 sm:left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500" />
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 sm:right-1.5 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 p-0 rounded-full hover:bg-black/10"
                        onClick={clearSearch}
                      >
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500" />
                      </Button>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[250px] sm:w-[300px] md:w-[350px]" align="start">
                  <Command>
                    <CommandInput placeholder="Search products..." value={searchQuery} onValueChange={setSearchQuery} />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Suggestions">
                        {searchSuggestions.map((suggestion) => (
                          <CommandItem
                            key={suggestion}
                            onSelect={() => {
                              setSearchQuery(suggestion);
                              setOpen(false);
                              submitSearch(new Event('submit') as unknown as React.FormEvent);
                            }}
                          >
                            <Search className="mr-2 h-4 w-4" />
                            {suggestion}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </div>
        
        {!isSearchActive ? (
          <div className="flex gap-2">
            <Button 
              variant="ghost"
              size="sm" 
              className="text-gray-700 hover:bg-black/10 h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0"
              onClick={activateSearch}
            >
              <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
            
            {!isScrolled ? (
              <div 
                className="flex items-center gap-1 text-gray-700 hover:bg-black/10 h-6 sm:h-7 px-1.5 sm:px-2 rounded-full cursor-pointer transition-colors"
                onClick={toggleFavorite}
              >
                <Heart className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                <span className="text-[10px] sm:text-xs font-medium">{likeCount}</span>
              </div>
            ) : (
              <Button 
                variant="ghost"
                size="sm" 
                className="text-gray-700 hover:bg-black/10 h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0"
                onClick={toggleFavorite}
              >
                <Heart className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            )}
            
            <Button 
              variant="ghost"
              size="sm" 
              className="text-gray-700 hover:bg-black/10 h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0"
              onClick={handleShare}
            >
              <Share className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
            
            <Button 
              variant="ghost"
              size="sm" 
              className="text-gray-700 hover:bg-black/10 h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost"
            size="sm" 
            className="text-gray-700 hover:bg-black/10 h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0"
            onClick={deactivateSearch}
          >
            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductPageHeader;
