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
import VerificationBadge from '@/components/shared/VerificationBadge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProductHeader from '@/components/product/ProductHeader';
import SellerStickyTabsNavigation from '@/components/seller/SellerStickyTabsNavigation';

const SellerPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Header height measurement
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [tabsHeight, setTabsHeight] = useState(0);

  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId!);
  const { data: products = [], isLoading: productsLoading } = useSellerProducts(sellerId!);

  // Measure header heights
  useEffect(() => {
    const measureHeights = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      if (tabsRef.current) {
        setTabsHeight(tabsRef.current.offsetHeight);
      }
    };

    measureHeights();

    const timeouts = [
      setTimeout(measureHeights, 100),
      setTimeout(measureHeights, 500),
      setTimeout(measureHeights, 1000)
    ];

    const handleResize = () => measureHeights();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      timeouts.forEach(clearTimeout);
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

  if (sellerLoading || !seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalStickyHeight = headerHeight + tabsHeight;

  return (
    <div className="min-h-screen bg-background">
      {/* Product Header - Fixed */}
      <div ref={headerRef} className="top-0 left-0 right-0 z-50 bg-background border-b">
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
        />
      </div>

      {/* Sticky Tabs Navigation - Fixed below header */}
      <div 
        ref={tabsRef} 
        className="fixed left-0 right-0 z-40 bg-background border-b"
        style={{ top: `${headerHeight}px` }}
      >
        <SellerStickyTabsNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          headerHeight={0} // Not needed since we're handling positioning ourselves
        />
      </div>

      {/* Main Content - Offset by total sticky height */}
      <div style={{ paddingTop: `${totalStickyHeight + 20}px` }}>
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
            {/* Added extra content to test scrolling */}
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
            {/* Added extra content to test scrolling */}
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