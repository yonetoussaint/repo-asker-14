import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerReviewsEnhanced from '@/components/product/CustomerReviewsEnhanced';
import ProductQA from '@/components/product/ProductQA';
import { useSeller, useSellerProducts, useSellerReels } from '@/hooks/useSeller';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SellerHeader from '@/components/product/SellerHeader';
import SellerHeroBanner from '@/components/seller/SellerHeroBanner';
import TabsNavigation from '@/components/home/TabsNavigation';
import { Heart, MessageCircle, Star, Search, Package, Calendar, Users, Play, Phone, Mail, MapPin, Share } from 'lucide-react';
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
  product_images?: Array<{
    id: string;
    src: string;
    alt?: string;
  }>;
}

interface Seller {
  id: string;
  name: string;
  description?: string;
  category?: string;
  created_at?: string;
  verified?: boolean;
  trust_score: number;
  total_sales: number;
  rating?: number;
  followers_count?: number;
  profile_image?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface OnlineStatus {
  isOnline: boolean;
  lastSeen?: string;
}

// Profile Image Component
const ProfileImage: React.FC<{ 
  src?: string; 
  name: string; 
  size?: 'sm' | 'md' | 'xl' | 'lg' | 'card';
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}> = ({ src, name, size = 'md', showOnlineStatus = false, isOnline = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl',
    lg: 'w-24 h-24 text-xl',
    card: 'flex-1 h-16 flex items-center justify-center relative'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (size === 'card') {
    return (
      <div className={sizeClasses[size]}>
        {src ? (
          <img src={src} alt={name} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {getInitials(name)}
          </div>
        )}
        {showOnlineStatus && (
          <div className={`absolute bottom-0 right-2 w-4 h-4 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
        )}
      </div>
    );
  }

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
            {/* Profile Picture - same height as cards */}
            <ProfileImage
              src={seller.profile_image}
              name={seller.name}
              size="card"
              showOnlineStatus={true}
              isOnline={onlineStatus?.isOnline || false}
            />

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
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
              <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                {product.product_images && product.product_images.length > 0 ? (
                  <img 
                    src={product.product_images[0].src} 
                    alt={product.product_images[0].alt || product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
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
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  const achievements = [
    { id: 1, title: "Top Seller", description: "Achieved over 1000 sales", icon: "🏆", earned: seller.total_sales > 1000 },
    { id: 2, title: "Quick Responder", description: "Responds within 2 hours", icon: "⚡", earned: true },
    { id: 3, title: "Quality Products", description: "4.8+ star rating", icon: "⭐", earned: (seller.rating || 4.8) >= 4.8 },
    { id: 4, title: "Verified Seller", description: "Identity verified", icon: "✅", earned: seller.verified },
    { id: 5, title: "Reliable Shipping", description: "On-time delivery rate >95%", icon: "📦", earned: true },
    { id: 6, title: "Customer Favorite", description: "500+ followers", icon: "❤️", earned: (seller.followers_count || 0) > 500 }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const timeline = [
    { date: "2024-01", event: "Joined the platform", icon: "🎉" },
    { date: "2024-03", event: "First 100 sales milestone", icon: "🎯" },
    { date: "2024-06", event: "Became verified seller", icon: "✅" },
    { date: "2024-09", event: "Reached 1000+ sales", icon: "🚀" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Enhanced Business Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <span className="text-blue-600">🏪</span>
            Business Info
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <Badge variant="outline" className="text-xs">{seller.category || 'General'}</Badge>
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Response Time</span>
              <span className="text-green-600 text-xs font-medium">~2 hours</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <span className="text-green-600">📊</span>
            Performance
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trust Score</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">{seller.trust_score}/100</span>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-500" 
                    style={{ width: `${seller.trust_score}%` }}
                  />
                </div>
              </div>
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Followers</span>
              <span className="font-medium">{formatNumber(seller.followers_count || 0)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <span className="text-purple-600">🎯</span>
            Quick Stats
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg. Rating</span>
              <span className="font-medium text-green-600">{seller.rating?.toFixed(1) || '4.8'}/5.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Completion</span>
              <span className="font-medium text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">On-time Delivery</span>
              <span className="font-medium text-green-600">96.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dispute Rate</span>
              <span className="font-medium text-green-600">0.1%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* About Description */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
          <span>📝</span>
          About {seller.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {seller.description || "This seller is passionate about providing quality products and excellent customer service. They have built a reputation for reliability and professionalism in their field."}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-xl mb-1">🚀</div>
            <div className="text-xs text-muted-foreground">Fast Shipping</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-xl mb-1">💎</div>
            <div className="text-xs text-muted-foreground">Premium Quality</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-xl mb-1">🛡️</div>
            <div className="text-xs text-muted-foreground">Secure Payments</div>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-xl mb-1">🎯</div>
            <div className="text-xs text-muted-foreground">Customer Focus</div>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span>🏆</span>
            Achievements ({earnedAchievements.length})
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAllAchievements(!showAllAchievements)}
          >
            {showAllAchievements ? 'Show Less' : 'View All'}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(showAllAchievements ? achievements : earnedAchievements).map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-3 rounded-lg border transition-all duration-200 ${
                achievement.earned 
                  ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <span className="text-green-600 text-xs">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
          <span>📅</span>
          Seller Journey
        </h3>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm">{item.icon}</span>
              </div>
              <div className="flex-1 pb-4 border-l border-muted-foreground/20 pl-4 ml-4 relative">
                {index < timeline.length - 1 && (
                  <div className="absolute left-0 top-8 w-px h-full bg-muted-foreground/20" />
                )}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{item.event}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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

// Reels Tab Component
const ReelsTab: React.FC<{ sellerId: string }> = ({ sellerId }) => {
  const { data: reels = [], isLoading } = useSellerReels(sellerId);

  // Function to format numbers to K/M/B
  const formatCount = (count: number) => {
    if (count >= 1000000000) {
      return (count / 1000000000).toFixed(1) + 'B';
    }
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg">
        <Play className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-medium mb-2">No reels yet</h3>
        <p className="text-sm text-muted-foreground">Check back later for new video content</p>
      </div>
    );
  }

  return (
    <div className="mx-[-1rem] sm:mx-[-1.5rem] mt-[-0.5rem]">
      <div className="grid grid-cols-3 gap-px">
        {reels.map((reel) => (
          <div key={reel.id} className="group cursor-pointer overflow-hidden">
            <div className="aspect-[3/4] bg-muted relative">
              {reel.video_url ? (
                <video 
                  src={reel.video_url} 
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute bottom-2 left-2">
                <div className="flex items-center gap-1 text-white text-xs">
                  <Play className="w-3 h-3" />
                  <span>{formatCount(reel.views || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Contact Tab Component
const ContactTab: React.FC<{ seller: Seller }> = ({ seller }) => {
  const [messageText, setMessageText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  const contactMethods = [
    { 
      icon: MessageCircle, 
      title: 'Send Message', 
      description: 'Get instant responses via our chat system',
      action: () => setShowContactForm(true),
      color: 'blue',
      available: true
    },
    { 
      icon: Phone, 
      title: 'Call Direct', 
      description: seller.phone || 'Phone number available during business hours',
      action: () => {
        if (seller.phone) {
          window.open(`tel:${seller.phone}`);
        } else {
          toast.info("Phone number will be available after initial contact");
        }
      },
      color: 'green',
      available: !!seller.phone
    },
    { 
      icon: Mail, 
      title: 'Email Support', 
      description: seller.email || 'Professional email response within 24h',
      action: () => {
        if (seller.email) {
          window.open(`mailto:${seller.email}`);
        } else {
          toast.info("Email will be provided after verification");
        }
      },
      color: 'purple',
      available: !!seller.email
    }
  ];

  const inquiryTopics = [
    'Product Information',
    'Bulk Orders',
    'Custom Requests',
    'Shipping & Delivery',
    'Returns & Exchanges',
    'Partnership Opportunities',
    'Technical Support',
    'Other'
  ];

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast.error("Please enter a message");
      return;
    }
    if (!selectedTopic) {
      toast.error("Please select a topic");
      return;
    }

    toast.success("Message sent successfully! You'll receive a response within 2 hours.");
    setMessageText('');
    setSelectedTopic('');
    setShowContactForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Contact Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method, index) => (
          <Card 
            key={index} 
            className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
              method.available 
                ? `hover:border-${method.color}-200 bg-gradient-to-br from-${method.color}-50 to-${method.color}-100` 
                : 'opacity-60 hover:border-gray-200 bg-gray-50'
            }`}
            onClick={method.action}
          >
            <div className="text-center space-y-3">
              <div className={`w-12 h-12 mx-auto rounded-full bg-${method.color}-100 flex items-center justify-center`}>
                <method.icon className={`w-6 h-6 text-${method.color}-600`} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{method.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {method.description}
                </p>
              </div>
              {method.available && (
                <Badge variant="outline" className={`text-xs border-${method.color}-200 text-${method.color}-700`}>
                  Available
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      {showContactForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Send Message to {seller.name}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowContactForm(false)}>
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Topic</label>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select inquiry topic" />
                </SelectTrigger>
                <SelectContent>
                  {inquiryTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-3 border border-input rounded-md resize-none min-h-[120px] text-sm"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {messageText.length}/500 characters
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSendMessage} className="flex-1">
                Send Message
              </Button>
              <Button variant="outline" onClick={() => setShowContactForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact Details
          </h3>
          <div className="space-y-4">
            {seller.email && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{seller.email}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => window.open(`mailto:${seller.email}`)}>
                  Send
                </Button>
              </div>
            )}
            {seller.phone && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{seller.phone}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => window.open(`tel:${seller.phone}`)}>
                  Call
                </Button>
              </div>
            )}
            {seller.address && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Business Address</p>
                  <p className="text-sm text-muted-foreground">{seller.address}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(seller.address || '')}`)}>
                  Map
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Business Hours & Response Times
          </h3>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Monday - Friday</span>
              <Badge variant="outline" className="text-xs">9:00 AM - 6:00 PM</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Saturday</span>
              <Badge variant="outline" className="text-xs">10:00 AM - 4:00 PM</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Sunday</span>
              <Badge variant="secondary" className="text-xs">Closed</Badge>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg. Response Time</span>
              <span className="font-medium text-green-600">~2 hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Message Response Rate</span>
              <span className="font-medium text-green-600">98%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Currently</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 text-xs">Online</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
          <span>❓</span>
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {[
            {
              q: "How long does shipping take?",
              a: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery."
            },
            {
              q: "Do you offer bulk discounts?",
              a: "Yes! We offer discounts for orders over 10 items. Contact us for custom pricing."
            },
            {
              q: "What's your return policy?",
              a: "We accept returns within 30 days of delivery. Items must be in original condition."
            },
            {
              q: "Can I track my order?",
              a: "Absolutely! You'll receive tracking information once your order ships."
            }
          ].map((faq, index) => (
            <div key={index} className="border border-muted rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">{faq.q}</h4>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Categories Tab Component  
const CategoriesTab: React.FC<{ sellerId: string }> = ({ sellerId }) => {
  // Mock categories data - in a real app this would come from your database
  const mockCategories = [
    {
      id: '1',
      name: 'Electronics',
      description: 'Phones, laptops, and gadgets',
      image_url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      product_count: 24,
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2', 
      name: 'Fashion',
      description: 'Clothing, shoes, and accessories',
      image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w-400&h=300&fit=crop',
      product_count: 15,
      created_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      name: 'Home & Garden',
      description: 'Furniture, decor, and outdoor items',
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      product_count: 18,
      created_at: '2024-01-05T00:00:00Z'
    },
    {
      id: '4',
      name: 'Sports & Fitness',
      description: 'Equipment, apparel, and accessories',
      image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      product_count: 12,
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Shop by Category</h2>
        <span className="text-sm text-muted-foreground">{mockCategories.length} categories</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCategories.map((category) => (
          <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden border-0 shadow-sm">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={category.image_url} 
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-base group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {category.product_count}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatDate(category.created_at)}
                </span>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                  View Products
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-muted/20">
        <div className="text-center">
          <Package className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-2">Custom Categories</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This seller has organized their products into custom categories for easier browsing.
          </p>
          <Button variant="outline" size="sm">
            Browse All Products
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Main SellerPage Component  
const SellerPage: React.FC = () => {  
  const { sellerId } = useParams<{ sellerId: string }>();  
  const navigate = useNavigate();  
  const headerRef = useRef<HTMLDivElement>(null);  
  const tabsRef = useRef<HTMLDivElement>(null);  
  const mainContentRef = useRef<HTMLDivElement>(null);  
  const sellerInfoRef = useRef<HTMLDivElement>(null);
  const heroBannerRef = useRef<HTMLDivElement>(null);

  const [isFollowing, setIsFollowing] = useState(false);  
  const [activeTab, setActiveTab] = useState('products');  
  const [searchQuery, setSearchQuery] = useState('');  
  const [isTabsSticky, setIsTabsSticky] = useState(false);  
  const [tabsHeight, setTabsHeight] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Improved scroll handling effect for sticky tabs  
  useEffect(() => {
    const handleScroll = () => {  
      if (!headerRef.current || !tabsRef.current || !heroBannerRef.current) return;  

      const scrollY = window.scrollY;  
      const headerHeight = headerRef.current.offsetHeight;  
      const heroBannerHeight = heroBannerRef.current.offsetHeight;

      // Calculate the original position of tabs based on current tab
      let originalTabsOffsetTop = heroBannerHeight;

      if (activeTab === 'products' && sellerInfoRef.current) {
        // For products tab, tabs come after header + hero banner + seller info
        const sellerInfoHeight = sellerInfoRef.current.offsetHeight;
        originalTabsOffsetTop += sellerInfoHeight;
      }

      // Store tabs height for spacer
      const currentTabsHeight = tabsRef.current.offsetHeight;
      if (currentTabsHeight !== tabsHeight) {
        setTabsHeight(currentTabsHeight);
      }

      // Determine if tabs should be sticky
      // They become sticky when they would scroll past the header
      const shouldBeSticky = scrollY >= (originalTabsOffsetTop - headerHeight);

      // Only update state if it changed to prevent unnecessary re-renders
      if (shouldBeSticky !== isTabsSticky) {
        setIsTabsSticky(shouldBeSticky);
      }
    };  

    // Use RAF for smoother scrolling performance
    let rafId: number;
    const throttledHandleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    // Initial setup with delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleScroll(); // Set initial state
      window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    }, 200);  

    return () => {  
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', throttledHandleScroll);  
    };  
  }, [activeTab, seller, isTabsSticky, tabsHeight]); // Include dependencies

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: seller?.name || 'Check out this seller',
        text: `Check out ${seller?.name || 'this seller'} on our platform!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleScrollProgress = (progress: number) => {
    setScrollProgress(progress);
  };  

  // Fixed tab change handler
  const handleTabChange = (newTab: string) => {  
    // If clicking on the currently active tab, scroll to top
    if (newTab === activeTab) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    // Otherwise, change to the new tab
    setActiveTab(newTab);  

    // Scroll to top for new tab
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Reset sticky state immediately and recalculate after DOM updates
    setIsTabsSticky(false);

    // Force recalculation after DOM updates
    setTimeout(() => {
      if (headerRef.current && tabsRef.current && heroBannerRef.current) {
        const scrollY = window.scrollY;
        const headerHeight = headerRef.current.offsetHeight;
        const heroBannerHeight = heroBannerRef.current.offsetHeight;
        
        let originalTabsOffsetTop = heroBannerHeight;

        if (newTab === 'products' && sellerInfoRef.current) {
          const sellerInfoHeight = sellerInfoRef.current.offsetHeight;
          originalTabsOffsetTop += sellerInfoHeight;
        }

        const shouldBeSticky = scrollY >= (originalTabsOffsetTop - headerHeight);
        setIsTabsSticky(shouldBeSticky);
      }
    }, 300);
  };  

  // Loading state  
  if (sellerLoading || !seller) {  
    return <LoadingSpinner />;  
  }  

  const headerHeight = headerRef.current?.offsetHeight || 0;  
  const tabs = [  
    { id: 'products', label: 'Products' },  
    { id: 'categories', label: 'Categories' },  
    { id: 'reels', label: 'Reels' },  
    { id: 'about', label: 'About' },  
    { id: 'reviews', label: 'Reviews' },  
    { id: 'qas', label: 'Q&A' },  
    { id: 'contact', label: 'Contact' },  
  ];

  return (  
    <div className="min-h-screen bg-white">  
      <SellerHeader  
        ref={headerRef}
        activeTab={activeTab}  
        onTabChange={handleTabChange}  
        seller={seller}
        isFollowing={isFollowing}  
        onFollow={handleFollow}  
        onMessage={handleMessage}
        onShare={handleShare}
        customScrollProgress={scrollProgress}
        onlineStatus={onlineStatus}
        actionButtons={[  
          {  
            Icon: Heart,  
            active: isFollowing,  
            onClick: handleFollow,  
            activeColor: "#f43f5e"  
          },  
          {  
            Icon: Share,  
            onClick: handleShare  
          }  
        ]}  
      />  

      <main>  
        <SellerHeroBanner 
          ref={heroBannerRef}
          seller={seller} 
          onScrollProgress={handleScrollProgress}
        />

        {activeTab === 'products' && (  
          <div ref={sellerInfoRef}>
            <SellerInfoSection   
              seller={seller}   
              products={products}   
              onlineStatus={onlineStatus}  
            />  
          </div>
        )}  

        <nav   
          ref={tabsRef}  
          className={`bg-white border-b transition-all duration-200 ease-out ${  
            isTabsSticky   
              ? 'fixed top-0 left-0 right-0 z-40 shadow-md'   
              : 'relative'  
          }`}  
          style={isTabsSticky ? { 
            top: `${headerHeight}px`,
            transform: isTabsSticky ? 'translateZ(0)' : 'none' // GPU acceleration for smoother animation
          } : undefined}  
        >  
          <TabsNavigation  
            tabs={tabs}  
            activeTab={activeTab}  
            onTabChange={handleTabChange}  
          />  
        </nav>  

        {/* Spacer div when tabs are sticky to prevent content jumping */}  
        {isTabsSticky && (
          <div 
            className="transition-all duration-200 ease-out"
            style={{ height: `${tabsHeight}px` }} 
          />
        )}

        <div   
          ref={mainContentRef}  
          className="container mx-auto px-4 py-6 tab-content-container"  
        >  
          {activeTab === 'products' && (  
            <ProductsTab  
              products={products}  
              isLoading={productsLoading}  
              searchQuery={searchQuery}  
              setSearchQuery={setSearchQuery}  
              navigate={navigate}  
            />  
          )}  

          {activeTab === 'categories' && (  
            <CategoriesTab sellerId={sellerId} />  
          )}  

          {activeTab === 'reels' && (  
            <ReelsTab sellerId={sellerId} />  
          )}  

          {activeTab === 'about' && (  
            <AboutTab seller={seller} />  
          )}  

          {activeTab === 'reviews' && (  
            <CustomerReviewsEnhanced productId={sellerId} limit={10} />  
          )}  

          {activeTab === 'qas' && (  
            <ProductQA productId={sellerId} limit={10} />  
          )}  

          {activeTab === 'contact' && (  
            <ContactTab seller={seller} />  
          )}
        </div>  
      </main>  
    </div>  
  );  
};

export default SellerPage;