import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ScanLine, Grid, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductHeader from '@/components/product/ProductHeader';
import SpaceSavingCategories from '@/components/home/SpaceSavingCategories';
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import SearchRecent from '@/components/search/SearchRecent';
import PopularSearches from '@/components/home/PopularSearches';
import SearchPopular from '@/components/search/SearchPopular';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import VoiceSearchOverlay from '@/components/search/VoiceSearchOverlay';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import RecentlyViewed from '@/components/home/RecentlyViewed';

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [recentSearches, setRecentSearches] = useState([
    'iPhone 15 Pro Max',
    'Wireless headphones',
    'Gaming laptop',
    'Smart watch',
    'Bluetooth speaker'
  ]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Calculate header height with ResizeObserver for better accuracy
  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        console.log('Header height calculated:', height);
        setHeaderHeight(height);
      }
    };

    // Initial measurement
    updateHeight();

    // Use ResizeObserver to track changes in header size
    if (headerRef.current) {
      resizeObserverRef.current = new ResizeObserver(updateHeight);
      resizeObserverRef.current.observe(headerRef.current);
    }

    // Also update on window resize to catch any layout changes
    window.addEventListener('resize', updateHeight);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Additional check after content loads
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        if (headerRef.current) {
          const height = headerRef.current.offsetHeight;
          setHeaderHeight(height);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newSearch = query.trim();
      setRecentSearches(prev => [
        newSearch,
        ...prev.filter(s => s !== newSearch)
      ].slice(0, 5));

      navigate(`/search?q=${encodeURIComponent(newSearch)}`);

      toast({
        title: "Searching...",
        description: `Looking for "${newSearch}"`,
      });
    }
  };

  const handleVoiceSearch = () => {
    setIsVoiceActive(true);
    // Simulate voice search
    setTimeout(() => {
      setIsVoiceActive(false);
      // You can integrate real speech recognition here
    }, 3000);
  };

  const handleFilterSelect = (filterId: string) => {
    if (filterId === 'filters') {
      // Open advanced filters modal
      toast({
        title: "Filters",
        description: "Advanced filters panel would open here",
      });
      return;
    }

    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const handleCategorySelect = (category: string) => {
    handleSearch(category);
  };

  const handleRecentSearchSelect = (search: string) => {
    handleSearch(search);
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    toast({
      title: "Cleared",
      description: "All recent searches cleared",
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleProductLike = (productId: string) => {
    toast({
      title: "Added to favorites",
      description: "Product saved to your wishlist",
    });
  };

  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "Product added to your shopping cart",
    });
  };

  const handleScanClick = () => {
    toast({
      title: "Scan",
      description: "Barcode scanner would open here",
    });
  };

  const searchActionButtons = [
    {
      Icon: ScanLine,
      onClick: handleScanClick
    }
  ];

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-30">
        <ProductHeader forceScrolledState={true} actionButtons={searchActionButtons} />
      </div>

      {/* Content with proper top spacing to account for fixed header */}
      <div style={{ paddingTop: `${headerHeight}px` }} className="relative">
        <SpaceSavingCategories
          onCategorySelect={handleCategorySelect}
          showHeader={true}
          headerTitle="Shop by Category"
          headerSubtitle="Browse popular categories"
          headerIcon={Grid}
          headerViewAllLink="/categories"
          headerViewAllText="View All"
          headerTitleTransform="uppercase"
        />

        <RecentlyViewed 
          showHeader={true}
          headerTitle="Recently Viewed"
          headerIcon={Clock}
          headerViewAllLink="/recently-viewed"
          headerViewAllText="View All"
          headerTitleTransform="uppercase"
          showClearButton={true}
          clearButtonText="× Clear"
          onClearClick={() => toast({ title: "Cleared", description: "Recently viewed items cleared" })}
        />

        <TopVendorsCompact/>

        <SearchRecent
          searches={recentSearches}
          onSearchSelect={handleRecentSearchSelect}
          onRemoveSearch={handleRemoveRecentSearch}
          onClearAll={handleClearAllRecent}
          headerTitleTransform="uppercase"
        />

        <PopularSearches />

        <BookGenreFlashDeals />

        <VoiceSearchOverlay
          isActive={isVoiceActive}
          onClose={() => setIsVoiceActive(false)}
        />
      </div>
    </div>
  );
};

export default SearchPage;