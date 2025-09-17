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
        return (b.saves || 0) - (a.saves || 0); // Using saves as proxy for rating
      case 'popularity':
      default:
        return (b.views || 0) - (a.views || 0);
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
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{seller.name}</h1>
                        {seller.verified && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Verified Seller
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{seller.rating?.toFixed(1) || '4.8'}</span>
                        <span className="text-muted-foreground">({formatNumber(seller.total_sales)} sales)</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{seller.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Member since {formatDate(seller.created_at || new Date().toISOString())}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{formatNumber(seller.followers_count || 0)} followers</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {seller.category && (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="outline">{seller.category}</Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${seller.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-muted-foreground capitalize">{seller.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Store Stats */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="p-4 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Trust Score</p>
                          <p className="text-2xl font-bold text-foreground">{seller.trust_score}/100</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Star className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                          <p className="text-2xl font-bold text-foreground">{formatNumber(seller.total_sales)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Package className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-4 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Products</p>
                          <p className="text-2xl font-bold text-foreground">{products.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Grid3X3 className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </Card>
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
              {/* Enhanced Product Filters */}
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Most Popular</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="flex items-center gap-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Grid</span>
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="flex items-center gap-2"
                    >
                      <List className="w-4 h-4" />
                      <span className="hidden sm:inline">List</span>
                    </Button>
                  </div>
                </div>
                
                {/* Products count and filter summary */}
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Showing {sortedProducts.length} of {products.length} products
                    {searchQuery && ` for "${searchQuery}"`}
                  </span>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery('')}
                      className="text-muted-foreground hover:text-foreground w-fit"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              </div>

              {/* Enhanced Products Display */}
              {productsLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-3">
                    {searchQuery ? 'No products match your search' : 'No products available'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? `We couldn't find any products matching "${searchQuery}". Try different keywords or clear your search.`
                      : 'This seller hasn\'t added any products yet. Check back later for updates.'
                    }
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery('')}
                      className="mx-auto"
                    >
                      Clear Search
                    </Button>
                  )}
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Products Grid/List */}
                  <div className={
                    viewMode === 'grid' 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6" 
                      : "space-y-4"
                  }>
                    {sortedProducts.map((product, index) => (
                      <Card 
                        key={product.id} 
                        className={`group cursor-pointer hover:shadow-lg transition-all duration-200 ${
                          viewMode === 'list' ? 'p-4' : 'overflow-hidden'
                        }`}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {viewMode === 'grid' ? (
                          <div className="space-y-4">
                            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                              <Package className="w-12 h-12 text-muted-foreground" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-4 space-y-2">
                              <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-primary">
                                  ${product.price.toFixed(2)}
                                </span>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{((product.saves || 0) / 10 + 4).toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-primary">
                                  ${product.price.toFixed(2)}
                                </span>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{((product.saves || 0) / 10 + 4).toFixed(1)}</span>
                                  <span>•</span>
                                  <span>{formatNumber(product.views || 0)} views</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                  
                  {/* Load More Button for large product lists */}
                  {sortedProducts.length >= 12 && (
                    <div className="text-center pt-8">
                      <Button variant="outline" size="lg">
                        Load More Products
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <Store className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-4">About {seller.name}</h2>
                <p className="text-muted-foreground mb-8">Discover more about this trusted seller and their business.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Business Type</span>
                      <span className="font-medium">{seller.category || 'General Retail'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">{formatDate(seller.created_at || new Date().toISOString())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verification Status</span>
                      <Badge variant={seller.verified ? "default" : "secondary"}>
                        {seller.verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trust Score</span>
                      <span className="font-medium">{seller.trust_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Sales</span>
                      <span className="font-medium">{formatNumber(seller.total_sales)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{seller.rating?.toFixed(1) || '4.8'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Store Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {seller.description || "This seller hasn't provided a detailed description yet."}
                </p>
              </Card>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Customer Reviews</h2>
                <p className="text-muted-foreground mb-8">See what customers are saying about {seller.name}.</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card className="p-6 text-center">
                    <div className="text-4xl font-bold text-foreground mb-2">{seller.rating?.toFixed(1) || '4.8'}</div>
                    <div className="flex justify-center mb-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {formatNumber(seller.total_sales)} reviews</p>
                  </Card>
                </div>
                
                <div className="lg:col-span-2 space-y-4">
                  {[5,4,3,2,1].map((rating) => (
                    <div key={rating} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-8">{rating} ★</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-10">{rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '5%' : rating === 2 ? '3%' : '2%'}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Recent Reviews</h3>
                <div className="space-y-4">
                  {[1,2,3].map((review) => (
                    <Card key={review} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">U{review}</span>
                          </div>
                          <div>
                            <p className="font-medium">Customer {review}</p>
                            <div className="flex items-center gap-1">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-muted-foreground">
                        Excellent service and high-quality products. Fast shipping and great customer support. 
                        Highly recommend this seller!
                      </p>
                    </Card>
                  ))}
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