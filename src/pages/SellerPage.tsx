import React, { useState, useRef, useEffect, useState as useStateReact } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeller, useSellerProducts } from '@/hooks/useSeller';
import { useAuth } from '@/hooks/use-auth';
import { Heart, MessageCircle } from 'lucide-react';
import ProductHeader from '@/components/product/ProductHeader';
import SellerStickyTabsNavigation from '@/components/seller/SellerStickyTabsNavigation';
import SellerProductCard from '@/components/seller/SellerProductCard';

const SellerPage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { seller, isFollowing, handleFollow, handleMessage } = useSeller(sellerId || '');
  const { products } = useSellerProducts(sellerId || '');

  const [activeTab, setActiveTab] = useState<'products' | 'about'>('products');
  const [headerHeight, setHeaderHeight] = useStateReact(0);
  const [tabsHeight, setTabsHeight] = useStateReact(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Measure header & tabs height
  useEffect(() => {
    function updateHeights() {
      setHeaderHeight(headerRef.current?.offsetHeight || 0);
      setTabsHeight(tabsRef.current?.offsetHeight || 0);
    }

    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header (Sticky) */}
      <div ref={headerRef} className="sticky top-0 z-40 bg-background border-b">
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

      {/* Tabs (Sticky below header) */}
      <div ref={tabsRef} className="sticky z-30 bg-background border-b" style={{ top: headerHeight }}>
        <SellerStickyTabsNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          headerHeight={0}
        />
      </div>

      {/* Content */}
      <div style={{ paddingTop: headerHeight + tabsHeight }}>
        {activeTab === 'products' && (
          <div className="container mx-auto px-4 py-6">
            {products.length === 0 ? (
              <p className="text-center text-muted-foreground">No products yet.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <SellerProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-lg font-semibold mb-2">About Seller</h2>
            <p className="text-muted-foreground">{seller?.description || 'No description available.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;