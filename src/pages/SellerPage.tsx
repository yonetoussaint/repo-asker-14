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
      <div ref={headerRef} className="relative z-10">
        <ProductHeader 
          sellerMode={true} 
          activeSection={activeTab} 
          onTabChange={setActiveTab}
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

      {/* Sticky Tabs Navigation - positioned below header */}
      <div className="relative z-20">
        <SellerStickyTabsNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          headerHeight={headerHeight}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {/* Content based on active tab */}
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

            {/* Products Grid/List */}
            {productsLoading ? (
              <div className="text-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">This seller hasn't listed any products yet.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
                : "space-y-4"
              }>
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    {/* Product card content here */}
                    <div className="p-4">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">${product.price}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

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
                      className="w-16 h-16 rounded-full object-cover"
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
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About</h3>
                      <p className="text-muted-foreground">{seller.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatNumber(12500)} followers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{products.length} products</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Policies */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      {seller.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{seller.email}</span>
                        </div>
                      )}
                      {seller.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{seller.phone}</span>
                        </div>
                      )}
                      {seller.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{seller.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Policies</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Buyer Protection</p>
                          <p className="text-xs text-muted-foreground">30-day return policy</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Truck className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Fast Shipping</p>
                          <p className="text-xs text-muted-foreground">2-3 business days</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Quality Guarantee</p>
                          <p className="text-xs text-muted-foreground">100% authentic products</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Reviews coming soon</h3>
              <p className="text-muted-foreground">Customer reviews will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;