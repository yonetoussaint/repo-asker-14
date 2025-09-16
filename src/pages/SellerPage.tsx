import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeller, useSellerProducts } from '@/hooks/useSeller';
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Package,
  Search,
  Grid3X3,
  List,
  Store,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SellerHeader from '@/components/product/SellerHeader';
import TabsNavigation from '@/components/home/TabsNavigation';

const SellerPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isTabsSticky, setIsTabsSticky] = useState(false);

  // Data hooks
  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId!);
  const { data: products = [], isLoading: productsLoading } = useSellerProducts(sellerId!);

  // Scroll effect for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current || !tabsRef.current) return;
      
      const headerHeight = headerRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const tabsOffsetTop = tabsRef.current.offsetTop - headerHeight;
      
      setIsTabsSticky(scrollY > tabsOffsetTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Utility functions
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Event handlers
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed" : "Following");
  };

  const handleMessage = () => {
    toast.info("Message feature coming soon");
  };

  // Data processing
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

  const headerHeight = headerRef.current?.offsetHeight || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm"
      >
        <SellerHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
          forceScrolledState={true}
        />
      </header>

      {/* Main Content */}
      <main style={{ paddingTop: headerHeight }}>
        {/* Seller Info Section */}
        {activeTab === 'products' && (
          <section className="bg-white border-b">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Store Info */}
                <div className="lg:col-span-2 space-y-4">
                  <h1 className="text-3xl font-bold text-gray-900">{seller.store_name}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{seller.description}</p>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                    {seller.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{seller.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {formatDate(seller.created_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{formatNumber(seller.follower_count || 0)} followers</span>
                    </div>
                  </div>
                </div>

                {/* Store Stats */}
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Response Rate</span>
                    <span className="text-lg font-semibold text-gray-900">{seller.response_rate || 95}%</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Response Time</span>
                    <span className="text-lg font-semibold text-gray-900">{seller.response_time || 'Within hours'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tabs Navigation */}
        <nav 
          ref={tabsRef}
          className={`bg-white border-b transition-all duration-200 ${
            isTabsSticky 
              ? 'sticky shadow-lg z-40' 
              : ''
          }`}
          style={isTabsSticky ? { top: headerHeight } : undefined}
        >
          <div className="container mx-auto">
            <TabsNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </nav>

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product filters and search can go here */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Products grid/list */}
              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }>
                  {/* Products would be rendered here */}
                  <div className="text-center py-12 col-span-full">
                    <p className="text-gray-500">Product components would be rendered here</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <Store className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {seller.store_name}</h2>
                <p className="text-gray-600 mb-8">More detailed information about this seller would be displayed here.</p>
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-gray-500">About content will be implemented here.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
                <p className="text-gray-600 mb-8">See what customers are saying about {seller.store_name}.</p>
                <div className="bg-gray-50 rounded-lg p-8">
                  <p className="text-gray-500">Reviews content will be implemented here.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerPage;