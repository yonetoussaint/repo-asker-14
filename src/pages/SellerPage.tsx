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
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [tabsHeight, setTabsHeight] = useState(0);
  const tabsInitialOffset = useRef<number | null>(null);

  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId!);
  const { data: products = [], isLoading: productsLoading } = useSellerProducts(sellerId!);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        return headerRef.current.offsetHeight;
      }
      return 0;
    };

    const updateTabsOffset = (headerH: number) => {
      if (tabsRef.current) {
        const rect = tabsRef.current.getBoundingClientRect();
        return rect.top + window.scrollY - headerH;
      }
      return 0;
    };

    const updateTabsHeight = () => {
      if (tabsRef.current) {
        setTabsHeight(tabsRef.current.offsetHeight);
      }
    };

    const initialHeaderHeight = updateHeaderHeight();
    setHeaderHeight(initialHeaderHeight);
    tabsInitialOffset.current = updateTabsOffset(initialHeaderHeight);
    updateTabsHeight();

    const handleResize = () => {
      const newHeaderHeight = updateHeaderHeight();
      setHeaderHeight(newHeaderHeight);
      tabsInitialOffset.current = updateTabsOffset(newHeaderHeight);
      updateTabsHeight();
    };

    const handleScroll = () => {
      if (tabsInitialOffset.current === null) return;

      setIsSticky(window.scrollY >= tabsInitialOffset.current);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!tabsRef.current || !headerRef.current) return;
    const tabsTop = tabsRef.current.getBoundingClientRect().top + window.scrollY;
    const headerH = headerRef.current.offsetHeight;
    const scrollTo = tabsTop - headerH;
    window.scrollTo({
      top: scrollTo,
      behavior: 'smooth',
    });
  }, [activeTab]);

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

  return (
    <div className="min-h-screen bg-white overflow-visible">
      {/* Fixed Header */}
      <div 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b"
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
      </div>

      {/* Main Content padding top fixed */}
      <div className="bg-white pt-4">
        {/* Seller Info styled like TikTok profile */}
        {activeTab === 'products' && (
          <div className="container mx-auto px-4 py-6 border-b">
            <div className="flex items-center space-x-6">
              {/* Profile Image */}
              <img
                src={getSellerLogoUrl(seller.logo_path)}
                alt={`${seller.store_name} logo`}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
              
              {/* Name and Description */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold truncate">
                  {seller.store_name}
                </h1>
                <p className="text-muted-foreground text-sm mt-1 truncate">
                  {seller.description}
                </p>
                {/* Stats */}
                <div className="flex space-x-8 mt-4 text-sm text-muted-foreground">
                  {typeof seller.follower_count === 'number' && (
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-lg">
                        {formatNumber(seller.follower_count)}
                      </span>
                      <span>Followers</span>
                    </div>
                  )}
                  {products.length > 0 && (
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-lg">{products.length}</span>
                      <span>Products</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-lg">{seller.response_rate || 95}%</span>
                    <span>Response Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation - sticky below header */}
        <div
          ref={tabsRef}
          className={`bg-white border-b z-50 transition-all ${isSticky ? 'sticky shadow-md' : ''}`}
          style={isSticky ? { top: headerHeight } : undefined}
        >
          <div className="container mx-auto">
            <TabsNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Placeholder to prevent jump */}
        {isSticky && <div style={{ height: tabsHeight }} />}

        {/* Tab content with padding to avoid overlap */}
        {activeTab === 'products' && (
          <div
            className="container mx-auto px-4 py-6"
            style={{ paddingTop: headerHeight + tabsHeight }}
          >
            {/* Products tab content unchanged */}
            {/* ... */}
          </div>
        )}
        {activeTab === 'about' && (
          <div
            className="container mx-auto px-4 py-6"
            style={{ paddingTop: headerHeight + tabsHeight }}
          >
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">About Content</h3>
              <p className="text-muted-foreground">About tab content will be displayed here.</p>
            </div>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div
            className="container mx-auto px-4 py-6"
            style={{ paddingTop: headerHeight + tabsHeight }}
          >
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Reviews Content</h3>
              <p className="text-muted-foreground">Reviews tab content will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;
