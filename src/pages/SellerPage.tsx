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
import StickyTabsNavigation from '@/components/product/StickyTabsNavigation';
import ProductScrollManager from '@/components/product/ProductScrollManager';
import { useScrollProgress } from '@/components/product/header/useScrollProgress';
import SellerStickyTabsNavigation from '@/components/seller/SellerStickyTabsNavigation';

const SellerPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Product detail style state management
  const [focusMode, setFocusMode] = useState(false);
  const [showHeaderInFocus, setShowHeaderInFocus] = useState(false);
  const [showStickyRecommendations, setShowStickyRecommendations] = useState(false);
  const [activeSection, setActiveSection] = useState('products');
  const [headerHeight, setHeaderHeight] = useState(0);

  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId!);
  const { data: products = [], isLoading: productsLoading } = useSellerProducts(sellerId!);

  // Refs for scroll management (similar to ProductDetail)
  const headerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const verticalRecommendationsRef = useRef<HTMLDivElement>(null);

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
      {/* Product-style Header */}
      <div ref={headerRef} className="relative z-50">
        <ProductHeader
          sellerMode={true} // Force scrolled state for seller pages
          activeSection={activeSection}
          onTabChange={(section) => setActiveSection(section)}
          focusMode={focusMode}
          showHeaderInFocus={showHeaderInFocus}
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

      {/* Overview/Gallery Section */}
      <div ref={overviewRef} className="p-4 space-y-4">
        {/* Seller Info Compact */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <img
              src={getSellerLogoUrl(seller.image_url)}
              alt={seller.name}
              className="w-full aspect-square rounded-lg object-cover"
            />
          </div>
          
          <div className="col-span-6 space-y-1">
            <h2 className="font-semibold text-lg">{seller.name}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="w-3 h-3 fill-current text-yellow-500" />
              <span>{(seller.rating || 4.8).toFixed(1)}</span>
              <Users className="w-3 h-3 ml-2" />
              <span>{formatNumber(seller.followers_count)}</span>
            </div>
            <div className="flex gap-1">
              {seller.verified && <CheckCircle className="w-4 h-4 text-primary" />}
              <Shield className="w-4 h-4 text-green-500" />
              <Truck className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          
          <div className="col-span-3 space-y-2">
            <Button onClick={handleFollow} size="sm" className="w-full" variant={isFollowing ? "outline" : "default"}>
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <Button onClick={handleMessage} size="sm" variant="outline" className="w-full">
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat
            </Button>
          </div>
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold">{formatNumber(seller.total_sales)}</div>
            <div className="text-xs text-muted-foreground">Sales</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold">{products.length}</div>
            <div className="text-xs text-muted-foreground">Products</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold">{seller.trust_score}%</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <div className="text-lg font-semibold">24h</div>
            <div className="text-xs text-muted-foreground">Response</div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs Navigation */}
      <SellerStickyTabsNavigation
        headerHeight={headerHeight}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <div className="p-4">

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Clean Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-between">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popular</SelectItem>
                  <SelectItem value="price-low">Low Price</SelectItem>
                  <SelectItem value="price-high">High Price</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
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

            {/* Products Grid */}
            <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">This seller hasn't added any products yet.</p>
                </div>
              ) : (
                products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <img 
                      src={product.product_images?.[0]?.src || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop"} 
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-3 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary">${product.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          <span className="text-xs">4.8</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Product Categories</h3>
              <p className="text-muted-foreground">Browse products by category.</p>
              {seller.category && (
                <Badge variant="secondary" className="mt-2">
                  {seller.category}
                </Badge>
              )}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">About {seller.name}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {seller.description || `${seller.name} is a trusted seller providing quality products with excellent customer service. Join thousands of satisfied customers who trust our products and service.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Verified Seller</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Secure Transactions</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{(seller.rating || 4.8).toFixed(1)} Rating</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                {seller.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-muted-foreground">{seller.email}</div>
                    </div>
                  </div>
                )}
                {seller.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">{seller.phone}</div>
                    </div>
                  </div>
                )}
                {seller.address && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-sm text-muted-foreground">{seller.address}</div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleMessage} className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll Management */}
      <ProductScrollManager
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        setShowHeaderInFocus={setShowHeaderInFocus}
        setShowStickyRecommendations={setShowStickyRecommendations}
        setActiveSection={setActiveSection}
        setActiveTab={setActiveTab}
        setHeaderHeight={setHeaderHeight}
        headerRef={headerRef}
        overviewRef={overviewRef}
        descriptionRef={descriptionRef}
        verticalRecommendationsRef={verticalRecommendationsRef}
      />
    </div>
  );
};

export default SellerPage;