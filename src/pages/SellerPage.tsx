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
  const [headerHeight, setHeaderHeight] = useState(0);

  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId!);
  const { data: products = [], isLoading: productsLoading } = useSellerProducts(sellerId!);

  // Measure header height on mount and resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Product-style Header with ref for measurement */}
      <div ref={headerRef}>
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

      {/* Sticky Tabs Navigation - positioned just below header */}
      <SellerStickyTabsNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        headerHeight={headerHeight}
      />

      {/* Main Content Area */}
      <div className="relative">
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
            <div className="max-w-4xl">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Seller Info */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={getSellerLogoUrl(seller.logo)}
                      alt={seller.business_name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-border"
                    />
                    <div>
                      <h1 className="text-2xl font-bold">{seller.business_name}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <VerificationBadge isVerified={seller.is_verified} />
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">4.8</span>
                          <span className="text-muted-foreground">({formatNumber(1250)} reviews)</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Member since {new Date(seller.created_at).getFullYear()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        About Our Store
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {seller.description || "This seller hasn't provided a description yet."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <Users className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">{formatNumber(12500)}</p>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <Package className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">{products.length}</p>
                          <p className="text-xs text-muted-foreground">Products</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">4.8/5</p>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium">98%</p>
                          <p className="text-xs text-muted-foreground">Positive</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Policies */}
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      {seller.email && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{seller.email}</p>
                          </div>
                        </div>
                      )}
                      {seller.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <Phone className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{seller.phone}</p>
                          </div>
                        </div>
                      )}
                      {seller.address && (
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">Location</p>
                            <p className="text-sm text-muted-foreground">{seller.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Store Policies */}
                  <div>
                    <h3 className="font-semibold mb-3">Store Policies</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Buyer Protection</p>
                          <p className="text-xs text-muted-foreground">
                            30-day return policy on all items. Full refund or exchange guarantee.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <Truck className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Fast Shipping</p>
                          <p className="text-xs text-muted-foreground">
                            2-3 business days delivery. Free shipping on orders over $50.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Quality Guarantee</p>
                          <p className="text-xs text-muted-foreground">
                            100% authentic products. Quality checked before dispatch.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button onClick={handleFollow} variant={isFollowing ? "outline" : "default"} className="flex-1">
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button onClick={handleMessage} variant="outline" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              
              {/* Review Summary */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="md:col-span-1">
                  <div className="text-center p-6 rounded-lg border">
                    <div className="text-4xl font-bold mb-2">4.8</div>
                    <div className="flex justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on 1,250 reviews</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-8">{rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground w-12">
                          {rating === 5 ? '875' : rating === 4 ? '250' : rating === 3 ? '63' : rating === 2 ? '38' : '24'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Reviews</h3>
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Reviews coming soon</h3>
                  <p className="text-muted-foreground">
                    Individual customer reviews will be displayed here once the review system is implemented.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;