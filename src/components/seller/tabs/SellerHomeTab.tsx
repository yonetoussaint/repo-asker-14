import React, { useState } from 'react';
import { 
  Star, Users, ShoppingBag, Package, CheckCircle2, Shield, Award, TrendingUp,
  MapPin, Megaphone, Sparkles, Calendar, Truck, ExternalLink, Instagram, 
  Twitter, Facebook, Globe, MessageCircle, ChevronUp, ChevronDown, Heart, MessageSquare, X
} from 'lucide-react';
import VerificationBadge from '@/components/shared/VerificationBadge';

interface SellerHomeTabProps {
  seller: any;
  products: any[];
  announcements?: any[];
  isFollowing: boolean;
  onFollow: () => void;
  mockSocialLinks: any[];
  showLinksDropdown: boolean;
  onToggleLinksDropdown: () => void;
  hideSellerInfo?: boolean;
}

const SellerHomeTab: React.FC<SellerHomeTabProps> = ({ 
  seller, 
  products, 
  announcements = [], 
  isFollowing, 
  onFollow, 
  mockSocialLinks, 
  showLinksDropdown, 
  onToggleLinksDropdown,
  hideSellerInfo = false
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatTimeAgo = (date: string): string => {
    const now = new Date();
    const pastDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - pastDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getTrustLevel = (score: number): { level: string; color: string } => {
    if (score >= 90) return { level: "Excellent", color: "text-green-600" };
    if (score >= 80) return { level: "Very Good", color: "text-blue-600" };
    if (score >= 70) return { level: "Good", color: "text-yellow-600" };
    return { level: "Fair", color: "text-orange-600" };
  };

  const trustInfo = getTrustLevel(seller.trust_score);


const [selectedPost, setSelectedPost] = useState(null);


// Function to check if text exceeds 3 lines (approximate)
  const isTextLong = (text) => {
    return text.length > 100; // Lower threshold to ensure we see the button
  };

  // Function to truncate text and add view more inline
  const renderTextWithViewMore = (post) => {
    if (!isTextLong(post.content)) {
      return <span>{post.content}</span>;
    }
    
    const truncatedText = post.content.substring(0, 100) + "...";
    return (
      <span>
        {truncatedText}{" "}
        <button 
          onClick={() => setSelectedPost(post)}
          className="text-blue-500 font-medium hover:text-blue-600 inline"
        >
          View More
        </button>
      </span>
    );
  };



  // Mock posts data
  const posts = [
    {
      id: 1,
      type: 'announcement',
      content: 'New iPhone 15 Pro Max models now available! Get yours with 20% off for the first 100 customers.',
      image: '/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png',
      timestamp: '2024-01-15T10:30:00Z',
      likes: 45,
      comments: 12
    },
    {
      id: 2,
      type: 'tip',
      content: 'Pro tip: Always use original chargers to extend your device battery life. We only sell authentic accessories.',
      timestamp: '2024-01-14T15:45:00Z',
      likes: 23,
      comments: 8
    },
    {
      id: 3,
      type: 'update',
      content: 'Store hours updated! We are now open Monday-Saturday 9AM-8PM. Sunday 11AM-6PM for your convenience.',
      timestamp: '2024-01-13T09:00:00Z',
      likes: 18,
      comments: 5
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Store Header - Only show when not hiding seller info */}
      {!hideSellerInfo && (
        <>
          <div className="border-b border-gray-100">
            <div className="p-3">
              <div className="flex items-center gap-3">
                <img 
                  src={seller.image_url} 
                  alt={seller.name} 
                  className="w-12 h-12 rounded-full" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base font-semibold text-gray-900 truncate">{seller.name}</h2>
                    {seller.verified && <VerificationBadge size="sm" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Last seen 2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Premium electronics and gadgets store with over 5 years of experience. 
                We offer high-quality products with fast shipping and excellent customer service.
              </p>

              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>Joined March 2019</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{seller.location || 'Location not set'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="border-b border-gray-100">
            <div className="grid grid-cols-4 divide-x divide-gray-100">
              <div className="px-3 py-4 text-center">
                <div className="text-base font-semibold text-gray-900">{seller.rating?.toFixed(1) || '0.0'}</div>
                <div className="text-xs text-gray-500 mt-0.5">Rating</div>
              </div>
              <div className="px-3 py-4 text-center">
                <div className="text-base font-semibold text-gray-900">{formatNumber(seller.followers_count)}</div>
                <div className="text-xs text-gray-500 mt-0.5">Followers</div>
              </div>
              <div className="px-3 py-4 text-center">
                <div className="text-base font-semibold text-gray-900">{formatNumber(seller.total_sales)}</div>
                <div className="text-xs text-gray-500 mt-0.5">Sales</div>
              </div>
              <div className="px-3 py-4 text-center">
                <div className="text-base font-semibold text-gray-900">{products.length}</div>
                <div className="text-xs text-gray-500 mt-0.5">Products</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-b border-gray-100 p-3">
            <div className="flex items-center gap-2">
              <button 
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  isFollowing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={onFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              <button 
                className="py-2 px-3 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
                onClick={onToggleLinksDropdown}
              >
                <ExternalLink className="w-4 h-4" />
                {showLinksDropdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Social Links Dropdown */}
          {showLinksDropdown && (
            <div className="border-b border-gray-100">
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {mockSocialLinks.map((link) => (
                    <a 
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 border border-gray-200 rounded text-sm text-gray-700 active:bg-gray-50"
                    >
                      {link.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                      {link.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-500" />}
                      {link.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                      {link.platform === 'website' && <Globe className="w-4 h-4 text-green-500" />}
                      <span className="capitalize font-medium">{link.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Store Policies */}
      <div className="border-b border-gray-100">
        <div className="p-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Store Policies</h3>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Free shipping over $50</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">30-day returns</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Secure payments</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700">24/7 support</span>
          </div>
        </div>
      </div>

      {/* Shipping Policy */}
      <div className="border-b border-gray-100">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900">Shipping Policy</h3>
          </div>
        </div>
        <div className="p-3 space-y-3">
          {/* Processing Time */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Processing Time</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">In-stock items: 1-2 business days</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Custom orders: 3-5 business days</span>
              </div>
            </div>
          </div>

          {/* Shipping Locations */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Locations</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">United States (All 50 states)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Canada</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">International shipping available</span>
              </div>
            </div>
          </div>

          {/* Carriers */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Carriers</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">FedEx</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">UPS</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">USPS</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">DHL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* Posts Section */}
      <div className="border-b border-gray-100">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Recent Posts</h3>
            <button className="text-xs text-blue-500 font-medium">View All</button>
          </div>
        </div>
        <div className="p-3">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {posts.map((post) => (
              <div key={post.id} className="flex-shrink-0 w-64 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex-1">
                    <p className="text-xs text-gray-700 leading-relaxed mb-3">
                      {renderTextWithViewMore(post)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">{post.comments}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{formatTimeAgo(post.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Semi-transparent overlay and panel */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-96 rounded-t-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Post Details</h3>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-80">
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {selectedPost.content}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{selectedPost.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{selectedPost.comments}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{formatTimeAgo(selectedPost.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Products Section */}
      <div className="border-b border-gray-100">
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Products ({products.length})</h3>
            <button className="text-xs text-blue-500 font-medium">View All</button>
          </div>
        </div>
        <div className="p-3">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-36 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-36 object-cover"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h4 className="text-xs font-medium text-gray-900 leading-tight mb-1 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SellerHomeTab;