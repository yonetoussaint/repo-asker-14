// SellerPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeller, useSellerProducts } from '@/hooks/useSeller';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SellerHeader from '@/components/product/SellerHeader';
import TabsNavigation from '@/components/home/TabsNavigation';
import SellerInfoSection from './SellerInfoSection';
import ProductsTab from './ProductsTab';
import AboutTab from './AboutTab';
import ReviewsTab from './ReviewsTab';
import LoadingSpinner from './LoadingSpinner';
// Import icons (example using Lucide React - adjust based on your icon library)
import { Heart, MessageCircle } from 'lucide-react';

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
  const [isTabsSticky, setIsTabsSticky] = useState(false);

  // Add check for sellerId before using hooks
  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId || '');
  const { data: products = [], isLoading: productsLoading } = useSellerProducts(sellerId || '');

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

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed" : "Following");
  };

  const handleMessage = () => {
    toast.info("Message feature coming soon");
  };

  // Handle case where sellerId is not provided
  if (!sellerId) {
    return <div>Seller not found</div>;
  }

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
          <SellerInfoSection seller={seller} products={products} />
        )}

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

        <div className="container mx-auto px-4 py-6">
          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              isLoading={productsLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
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