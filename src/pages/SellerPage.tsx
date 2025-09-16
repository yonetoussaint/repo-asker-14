import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeller, useSellerProducts } from '@/hooks/useSeller';
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Users, 
  Package,
  Search,
  Grid3X3,
  List,
  Shield,
  Truck,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProductHeader from '@/components/product/ProductHeader';

// Use the provided TabsNavigation component
const TabsNavigation = ({ tabs, activeTab, onTabChange, className = "", style = {}, edgeToEdge = false }) => {
  const tabRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Initialize underline width on mount
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      // If no activeTab is set, use the first tab
      const firstTab = tabs[0];
      if (firstTab) {
        onTabChange(firstTab.id);
      }
    }
  }, [tabs, activeTab, onTabChange]);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);
  }, [tabs]);

  // Function to update underline position and width
  const updateUnderline = () => {
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      // Get the text span element
      const textSpan = activeTabElement.querySelector('span:last-child'); // Target the label span specifically

      if (textSpan) {
        // Calculate underline width based on text content
        const textWidth = textSpan.offsetWidth;
        const newWidth = Math.max(textWidth * 0.8, 20); // Minimum 20px width, 80% of text width

        // Calculate position relative to the button center 
        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (activeTabElement.offsetWidth / 2);
        const underlineStart = buttonCenter - (newWidth / 2);

        setUnderlineWidth(newWidth);
        setUnderlineLeft(underlineStart);
      }
    }
  };

  // Update underline when active tab changes
  useEffect(() => {
    if (activeTab) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(updateUnderline, 0);
    }
  }, [activeTab, tabs]);

  // Handle tab scrolling - only auto-scroll when shouldAutoScroll is true
  useEffect(() => {
    if (!shouldAutoScroll) return;

    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      // Scroll to position the active tab at the left edge (with some padding)
      const paddingLeft = edgeToEdge ? 16 : 8; // Account for container padding
      const newScrollLeft = activeTabElement.offsetLeft - paddingLeft;

      containerElement.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }

    // Reset auto-scroll after a delay to allow manual scrolling
    const timer = setTimeout(() => setShouldAutoScroll(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab, tabs, edgeToEdge, shouldAutoScroll]);

  // Set initial underline when component mounts
  useEffect(() => {
    if (activeTab && tabs.length > 0) {
      setTimeout(updateUnderline, 100); // Small delay to ensure fonts are loaded
    }
  }, []);

  const handleTabClick = (id) => {
    setShouldAutoScroll(true); // Enable auto-scroll when tab is clicked
    onTabChange(id);
  };

  // Default style (original)
  const defaultStyle = {
    maxHeight: '40px',
    opacity: 1,
    backgroundColor: 'white',
  };

  // Merge styles - passed style overrides default
  const finalStyle = { ...defaultStyle, ...style };

  return (
  <div
    className={`relative w-full transition-all duration-700 overflow-hidden ${className}`}
    style={finalStyle}
  >
    {/* Tabs List */}
    <div className="h-full w-full">
      <div
        ref={scrollContainerRef}
        className={`flex items-center overflow-x-auto no-scrollbar h-full w-full relative ${edgeToEdge ? 'px-2' : 'px-2'}`}
        onScroll={() => setShouldAutoScroll(false)} // Disable auto-scroll when user manually scrolls
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex items-center space-x-7"> {/* Added gap container */}
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={el => (tabRefs.current[index] = el)}
              onClick={() => handleTabClick(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`relative flex items-center py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out outline-none flex-shrink-0 ${
                activeTab === tab.id
                  ? 'text-red-600'
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              {tab.icon && <span className="mr-1">{tab.icon}</span>}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Animated underline - positioned absolutely within the scroll container */}
        {activeTab && (
          <div
            className="absolute bottom-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: underlineWidth,
              left: underlineLeft,
              transform: 'translateZ(0)', // Hardware acceleration
            }}
          />
        )}
      </div>
    </div>
  </div>
);
};

const SellerPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [headerHeight, setHeaderHeight] = useState(0);
  const [tabsHeight, setTabsHeight] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId!);
  const { data: products = [], isLoading: productsLoading } = useSellerProducts(sellerId!);

  useEffect(() => {
    // Calculate header and tabs height for content positioning
    const updateHeights = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      if (tabsRef.current) {
        setTabsHeight(tabsRef.current.offsetHeight);
      }
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);

    return () => {
      window.removeEventListener('resize', updateHeights);
    };
  }, [seller]);

  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed" : "Following");
  };

  const handleMessage = () => {
    toast.info("Message feature coming soon");
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'popularity':
      default:
        return (b.sales_count || 0) - (a.sales_count || 0);
    }
  });

  // Define tabs for the TabsNavigation component
  const tabs = [
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews' },
  ];

  if (sellerLoading || !seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Product Header - Sticky at the top */}
      <div 
        ref={headerRef}
        className="sticky top-0 z-50 bg-white border-b"
      >
        <ProductHeader
          sellerMode={true}
          activeSection={activeTab}
          onTabChange={setActiveTab}
          seller={seller}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onMessage={handleMessage}
          actionButtons={[
            {
              Icon: Heart,
              active: isFollowing,
              onClick: handleFollow,
              activeColor: "#f43f5e"
            },
            {
              Icon: MessageCircle,
              onClick: handleMessage
            }
          ]}
          inPanel={false} // This makes header sticky
        />
      </div>

      {/* Tabs Navigation - Sticky below the header */}
      <div 
        ref={tabsRef}
        className="sticky z-40 bg-white border-b"
        style={{ top: headerHeight }}
      >
        <TabsNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Content - Offset by header and tabs height */}
      <div 
        className="pt-4 bg-white"
        style={{ paddingTop: headerHeight + tabsHeight + 16 }}
      >
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="container mx-auto px-4 py-6">
            {/* Search and Filter Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Count */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {sortedProducts.length} of {products.length} products
              </p>
            </div>

            {/* Products Grid/List */}
            {productsLoading ? (
              <div className="text-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchQuery ? 'No products found' : 'No products available'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search terms or filters.' 
                    : 'This seller hasn\'t listed any products yet.'
                  }
                </p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                    className="mt-4"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
                : "space-y-4"
              }>
                {sortedProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop"}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                      {product.discount_percentage > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                          -{product.discount_percentage}%
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {product.discount_percentage > 0 ? (
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-primary">
                                ${(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      {product.sales_count && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatNumber(product.sales_count)} sold
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">About Content</h3>
              <p className="text-muted-foreground">About tab content will be displayed here.</p>
            </div>
            <div className="h-screen bg-muted/20 flex items-center justify-center">
              <p className="text-lg">Scroll test area - About tab</p>
            </div>
            <div className="h-screen bg-muted/40 flex items-center justify-center">
              <p className="text-lg">More scroll test area - About tab</p>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Reviews Content</h3>
              <p className="text-muted-foreground">Reviews tab content will be displayed here.</p>
            </div>
            <div className="h-screen bg-muted/20 flex items-center justify-center">
              <p className="text-lg">Scroll test area - Reviews tab</p>
            </div>
            <div className="h-screen bg-muted/40 flex items-center justify-center">
              <p className="text-lg">More scroll test area - Reviews tab</p>
            </div>
            <div className="h-screen bg-muted/60 flex items-center justify-center">
              <p className="text-lg">Even more scroll test area - Reviews tab</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;