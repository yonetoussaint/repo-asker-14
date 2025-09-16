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

// Mock data for preview
const mockSeller = {
  id: '1',
  name: 'TechGear Pro',
  username: 'techgearpro',
  bio: 'Premium electronics and accessories for tech enthusiasts',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  followers_count: 12500,
  following_count: 234,
  products_count: 89,
  rating: 4.8,
  reviews_count: 1240,
  verified: true,
  badges: ['Top Seller', 'Fast Shipping'],
  location: 'New York, USA',
  email: 'contact@techgearpro.com',
  phone: '+1-555-0123',
  created_at: '2022-01-15'
};

// Mock ProductHeader component
const MockProductHeader = ({ 
  sellerMode, 
  activeSection, 
  onTabChange, 
  seller, 
  isFollowing, 
  onFollow, 
  onMessage, 
  actionButtons 
}) => (
  <div className="bg-white border-b px-4 py-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-3">
          <img 
            src={seller.avatar_url} 
            alt={seller.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold">{seller.name}</h1>
              {seller.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
            </div>
            <p className="text-sm text-gray-600">@{seller.username}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {actionButtons.map((button, index) => (
          <button 
            key={index}
            onClick={button.onClick}
            className={`p-2 hover:bg-gray-100 rounded-full ${button.active ? 'text-red-500' : 'text-gray-600'}`}
          >
            <button.Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

// Mock SellerStickyTabsNavigation component
const MockSellerStickyTabsNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'about', label: 'About', icon: Store },
    { id: 'reviews', label: 'Reviews', icon: MessageCircle }
  ];

  return (
    <div className="bg-white border-b px-4">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const SellerPage = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');

  // Header height measurement
  const headerRef = useRef(null);
  const tabsRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [tabsHeight, setTabsHeight] = useState(0);

  // Mock data usage instead of actual hooks
  const seller = mockSeller;
  const products = [];
  const sellerLoading = false;
  const productsLoading = false;

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

  const getSellerLogoUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
    // Mock supabase call
    return imagePath;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Mock toast
    console.log(isFollowing ? "Unfollowed" : "Following");
  };

  const handleMessage = () => {
    console.log("Message feature coming soon");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalStickyHeight = headerHeight + tabsHeight;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Header - Fixed */}
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <MockProductHeader 
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
        className="fixed left-0 right-0 z-40 bg-white border-b"
        style={{ top: `${headerHeight}px` }}
      >
        <MockSellerStickyTabsNavigation
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
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Products Content</h3>
              <p className="text-gray-600">Products tab content will be displayed here.</p>
            </div>
            {/* Added extra content to test scrolling */}
            <div className="h-screen bg-gray-100 flex items-center justify-center">
              <p className="text-lg">Scroll test area - Products tab</p>
            </div>
            <div className="h-screen bg-gray-200 flex items-center justify-center">
              <p className="text-lg">More scroll test area - Products tab</p>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">About Content</h3>
              <p className="text-gray-600">About tab content will be displayed here.</p>
            </div>
            {/* Added extra content to test scrolling */}
            <div className="h-screen bg-gray-100 flex items-center justify-center">
              <p className="text-lg">Scroll test area - About tab</p>
            </div>
            <div className="h-screen bg-gray-200 flex items-center justify-center">
              <p className="text-lg">More scroll test area - About tab</p>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews Content</h3>
              <p className="text-gray-600">Reviews tab content will be displayed here.</p>
            </div>
            {/* Added extra content to test scrolling */}
            <div className="h-screen bg-gray-100 flex items-center justify-center">
              <p className="text-lg">Scroll test area - Reviews tab</p>
            </div>
            <div className="h-screen bg-gray-200 flex items-center justify-center">
              <p className="text-lg">More scroll test area - Reviews tab</p>
            </div>
            <div className="h-screen bg-gray-300 flex items-center justify-center">
              <p className="text-lg">Even more scroll test area - Reviews tab</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;