import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeller, useSellerProducts } from '@/hooks/useSeller';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SellerHeader from '@/components/product/SellerHeader';
import TabsNavigation from '@/components/home/TabsNavigation';
import { Heart, MessageCircle, Star, Search, Package, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatNumber, formatDate } from '@/lib/utils';

// Types
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  created_at: string;
  saves?: number;
  views?: number;
}

interface Seller {
  id: string;
  name: string;
  description?: string;
  category?: string;
  created_at: string;
  verified?: boolean;
  trust_score: number;
  total_sales: number;
  rating?: number;
  followers_count?: number;
  profile_image?: string;
}

interface OnlineStatus {
  isOnline: boolean;
  lastSeen?: string;
}

// Profile Image Component
const ProfileImage: React.FC<{ 
  src?: string; 
  name: string; 
  size?: 'sm' | 'md' | 'lg';
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}> = ({ src, name, size = 'md', showOnlineStatus = false, isOnline = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-xl'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-background shadow-sm`}>
        {src ? (
          <img 
            src={src} 
            alt={`${name}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-semibold text-primary">
            {getInitials(name)}
          </div>
        )}
      </div>
      {showOnlineStatus && (
        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`} />
      )}
    </div>
  );
};
// Online Status Badge Component
const OnlineStatusBadge: React.FC<{ isOnline: boolean; lastSeen?: string }> = ({ isOnline, lastSeen }) => {
  const getStatusText = () => {
    if (isOnline) return "Online now";
    if (lastSeen) {
      const now = new Date();
      const lastSeenDate = new Date(lastSeen);
      const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
    return "Offline";
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
      <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-muted-foreground'}`}>
        {getStatusText()}
      </span>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

// Error Component
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center p-4">
      <div className="text-red-500 mb-2">⚠️</div>
      <p className="text-red-500">{message}</p>
    </div>
  </div>
);

// Seller Info Section Component
const SellerInfoSection: React.FC<{ 
  seller: Seller; 
  products: Product[];
  onlineStatus?: OnlineStatus;
}> = ({ seller, products, onlineStatus }) => {
  return (
    <section className="bg-white border-b">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area - no profile picture here */}
          <div className="flex-1 space-y-4">
            {/* Header with name and badges */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
              {seller.verified && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {seller.description || "No description available"}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-between gap-3 text-xs text-gray-500 py-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Since {formatDate(seller.created_at || new Date().toISOString()).split(' ')[1]}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{formatNumber(seller.followers_count || 0)} followers</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <span>{formatNumber(seller.total_sales)} sales</span>
              </div>
            </div>
          </div>

          {/* Right sidebar with profile picture and stats */}
          <div className="flex lg:flex-col gap-4 lg:w-48">
        {/* Profile Picture moved to sidebar */}
        <div className="flex justify-center lg:justify-center mb-2">
          <ProfileImage
            src={seller.profile_image}
            name={seller.name}
            size="lg"
            showOnlineStatus={true}
            isOnline={onlineStatus?.isOnline || false}
          />
        </div>
        
        <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center h-16 flex flex-col justify-center">
          <div className="text-lg font-bold text-gray-900">{seller.trust_score}/100</div>
          <div className="text-xs text-gray-500">Trust Score</div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center h-16 flex flex-col justify-center">
          <div className="text-lg font-bold text-gray-900">{products.length}</div>
          <div className="text-xs text-gray-500">Products</div>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
};

// Products Tab Component
const ProductsTab: React.FC<{
  products: Product[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigate: (path: string) => void;
}> = ({
  products,
  isLoading,
  searchQuery,
  setSearchQuery,
  navigate
}) => {
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-2">
            {searchQuery ? 'No matches found' : 'No products yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? `Try different keywords` : 'Check back later for new products'}
          </p>
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden border-0 shadow-sm"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-base">${product.price}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{((product.saves || 0) / 10 + 4).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// About Tab Component
const AboutTab: React.FC<{ seller: Seller }> = ({ seller }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Business Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span>{seller.category || 'General'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Since</span>
              <span>{formatDate(seller.created_at || new Date().toISOString()).split(' ')[1]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={seller.verified ? "default" : "secondary"} className="text-xs">
                {seller.verified ? "Verified" : "Pending"}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Performance</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trust Score</span>
              <span className="font-medium">{seller.trust_score}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sales</span>
              <span className="font-medium">{formatNumber(seller.total_sales)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{seller.rating?.toFixed(1) || '4.8'}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-sm">About</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {seller.description || "This seller hasn't provided additional details yet."}
        </p>
      </Card>
    </div>
  );
};

// Reviews Tab Component
const ReviewsTab: React.FC<{ seller: Seller }> = ({ seller }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center sm:col-span-1">
          <div className="text-2xl font-bold mb-1">{seller.rating?.toFixed(1) || '4.8'}</div>
          <div className="flex justify-center mb-2">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{formatNumber(seller.total_sales)} reviews</p>
        </Card>

        <div className="sm:col-span-2 space-y-2">
          {[5,4,3,2,1].map((rating) => (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-4">{rating}★</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                />
              </div>
              <span className="w-8 text-xs text-muted-foreground">
                {rating === 5 ? '70%' : rating === 4 ? '20%' : '5%'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Recent Reviews</h3>
        {[1,2,3].map((review) => (
          <Card key={review} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">U{review}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Customer {review}</span>
                  <span className="text-xs text-muted-foreground">2d ago</span>
                </div>
                <div className="flex mb-2">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Great products and fast shipping. Highly recommend!
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Main SellerPage Component
const SellerPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  
  // Online status state - you would get this from your real-time data source
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>({
    isOnline: true, // This would come from your WebSocket or polling
    lastSeen: "2025-09-17T10:30:00Z" // ISO string from your backend
  });

  // Handle case where sellerId is not provided
  if (!sellerId) {
    return <ErrorMessage message="Seller ID is required" />;
  }

  // Hooks with error handling
  const { data: seller, isLoading: sellerLoading, error: sellerError } = useSeller(sellerId);
  const { data: products = [], isLoading: productsLoading, error: productsError } = useSellerProducts(sellerId);

  // Error handling
  if (sellerError) {
    return <ErrorMessage message="Failed to load seller information" />;
  }

  if (productsError) {
    return <ErrorMessage message="Failed to load products" />;
  }

  // Scroll handling effect for sticky tabs
  useEffect(() => {
    let tabsOriginalOffsetTop = 0;
    let hasCalculatedOriginalPosition = false;

    const calculateOriginalPosition = () => {
      if (!headerRef.current || !tabsRef.current || hasCalculatedOriginalPosition) return;

      // Only calculate when tabs are in normal flow (not sticky)
      if (!isTabsSticky) {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        tabsOriginalOffsetTop = tabsRect.top + scrollY;
        hasCalculatedOriginalPosition = true;
      }
    };

    const handleScroll = () => {
      if (!headerRef.current || !tabsRef.current) return;

      const scrollY = window.scrollY;
      const headerHeight = headerRef.current.offsetHeight;

      // Calculate original position if not done yet
      calculateOriginalPosition();

      // Determine if tabs should be sticky
      const triggerPoint = tabsOriginalOffsetTop - headerHeight;
      const shouldBeSticky = scrollY > triggerPoint && hasCalculatedOriginalPosition;

      setIsTabsSticky(shouldBeSticky);
    };

    // Reset calculation when tab changes or data loads
    hasCalculatedOriginalPosition = false;
    tabsOriginalOffsetTop = 0;

    // Add a delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      calculateOriginalPosition();
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Call once to set initial state
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTab, seller]); // Removed isTabsSticky from dependencies to avoid circular updates

  // Example effect to simulate real-time online status updates
  useEffect(() => {
    // This is where you'd set up your WebSocket connection or polling
    // For demo purposes, we'll simulate status changes
    const interval = setInterval(() => {
      // Randomly toggle online status for demo
      setOnlineStatus(prev => ({
        isOnline: Math.random() > 0.3, // 70% chance of being online
        lastSeen: prev.isOnline ? new Date().toISOString() : prev.lastSeen
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Action handlers
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed" : "Following");
  };

  const handleMessage = () => {
    toast.info("Message feature coming soon");
  };

  // Loading state
  if (sellerLoading || !seller) {
    return <LoadingSpinner />;
  }

  const headerHeight = headerRef.current?.offsetHeight || 0;
  const tabs = [
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen bg-white">
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

      <main style={{ paddingTop: headerHeight }}>
        {activeTab === 'products' && (
          <SellerInfoSection 
            seller={seller} 
            products={products} 
            onlineStatus={onlineStatus}
          />
        )}

        <nav 
          ref={tabsRef}
          className={`bg-white border-b transition-all duration-300 ${
            isTabsSticky 
              ? 'fixed top-0 left-0 right-0 z-40 shadow-lg' 
              : 'relative'
          }`}
          style={isTabsSticky ? { top: `${headerHeight}px` } : undefined}
        >
          <div className="container mx-auto">
            <TabsNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </nav>

        {/* Spacer div when tabs are sticky to prevent content jumping */}
        {isTabsSticky && <div style={{ height: `${tabsRef.current?.offsetHeight || 50}px` }} />}

        <div className="container mx-auto px-4 py-6">
          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              isLoading={productsLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              navigate={navigate}
            />
          )}

          {activeTab === 'about' && (
            <AboutTab seller={seller} />
          )}

          {activeTab === 'reviews' && (
            <ReviewsTab seller={seller} />
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerPage;