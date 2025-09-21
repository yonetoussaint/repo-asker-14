
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, 
  Warehouse, DollarSign, Megaphone, HelpCircle, Settings,
  Bell, Store, Heart, Share
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductHeader from '@/components/product/ProductHeader';
import TabsNavigation from '@/components/home/TabsNavigation';

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const headerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sellerInfoRef = useRef<HTMLDivElement>(null);

  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleBackClick = () => {
    navigate('/profile');
  };

  // Extract current tab from pathname
  const getCurrentTab = () => {
    const path = location.pathname.split('/seller-dashboard/')[1];
    return path || 'overview';
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  const navigationItems = [
    { id: 'overview', name: 'Overview', href: '/seller-dashboard/overview', icon: LayoutDashboard },
    { id: 'products', name: 'Products', href: '/seller-dashboard/products', icon: Package },
    { id: 'orders', name: 'Orders', href: '/seller-dashboard/orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', href: '/seller-dashboard/customers', icon: Users },
    { id: 'analytics', name: 'Analytics', href: '/seller-dashboard/analytics', icon: BarChart3 },
    { id: 'inventory', name: 'Inventory', href: '/seller-dashboard/inventory', icon: Warehouse },
    { id: 'finances', name: 'Finances', href: '/seller-dashboard/finances', icon: DollarSign },
    { id: 'marketing', name: 'Marketing', href: '/seller-dashboard/marketing', icon: Megaphone },
    { id: 'support', name: 'Support', href: '/seller-dashboard/support', icon: HelpCircle },
    { id: 'settings', name: 'Settings', href: '/seller-dashboard/settings', icon: Settings },
  ];

  const handleTabChange = (tabId: string) => {
    const item = navigationItems.find(nav => nav.id === tabId);
    if (item) {
      setActiveTab(tabId);
      navigate(item.href);
    }

    // Scroll to top smoothly when changing tabs
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Convert navigation items to tabs format
  const tabs = navigationItems.map(item => ({
    id: item.id,
    label: item.name
  }));

  // Mock seller data - in real app this would come from context or props
  const mockSeller = {
    id: 'seller-123',
    business_name: "John's Store",
    full_name: 'John Doe',
    logo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    followers_count: 1250
  };

  // Scroll handling for sticky tabs (exact same logic as SellerPage)
  useEffect(() => {
    let isCalculating = false;

    const calculateOriginalPosition = () => {
      if (isCalculating || !headerRef.current || !tabsRef.current) return;
      
      isCalculating = true;
      
      requestAnimationFrame(() => {
        try {
          // For seller dashboard, tabs come right after header + seller info
          const headerHeight = headerRef.current?.offsetHeight || 0;
          const sellerInfoHeight = sellerInfoRef.current?.offsetHeight || 0;
        } finally {
          isCalculating = false;
        }
      });
    };

    const handleScroll = () => {
      if (!headerRef.current || !tabsRef.current || isCalculating) return;

      const scrollY = window.scrollY;
      const headerHeight = headerRef.current.offsetHeight;
      const tabsCurrentHeight = tabsRef.current.offsetHeight;

      // Update tabs height if changed
      if (tabsCurrentHeight !== tabsHeight) {
        setTabsHeight(tabsCurrentHeight);
      }

      // Calculate sticky threshold - tabs should stick when seller info scrolls out
      let stickyThreshold = 0;
      if (sellerInfoRef.current) {
        const sellerInfoRect = sellerInfoRef.current.getBoundingClientRect();
        const sellerInfoTop = sellerInfoRect.top + scrollY;
        const sellerInfoHeight = sellerInfoRef.current.offsetHeight;
        stickyThreshold = sellerInfoTop + sellerInfoHeight - headerHeight;
      }

      // Calculate scroll progress for header transitions
      const maxScrollForProgress = Math.max(stickyThreshold, 100); // Prevent division by 0
      const calculatedProgress = Math.min(1, Math.max(0, scrollY / maxScrollForProgress));
      setScrollProgress(calculatedProgress);

      // Determine if tabs should be sticky - tabs stick when they would scroll past header
      const shouldBeSticky = scrollY > stickyThreshold;

      // Only update state if it changed to prevent unnecessary re-renders
      if (shouldBeSticky !== isTabsSticky) {
        setIsTabsSticky(shouldBeSticky);
      }
    };

    // Use RAF for smoother scrolling performance (same as SellerPage)
    let rafId: number;
    const smoothScrollHandler = () => {
      rafId = requestAnimationFrame(handleScroll);
    };

    // Initial setup with proper timing (same as SellerPage)
    const setupTimeout = setTimeout(() => {
      calculateOriginalPosition();
      
      const initialCheckTimeout = setTimeout(() => {
        handleScroll();
        window.addEventListener('scroll', smoothScrollHandler, { passive: true });
      }, 50);

      return () => clearTimeout(initialCheckTimeout);
    }, 100);

    return () => {
      clearTimeout(setupTimeout);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', smoothScrollHandler);
    };
  }, [activeTab, isTabsSticky, tabsHeight]);

  const headerHeight = headerRef.current?.offsetHeight || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ProductHeader with seller mode - same as SellerPage */}
      <div ref={headerRef}>
        <ProductHeader
          sellerMode={true}
          seller={mockSeller}
          showCloseIcon={true}
          onCloseClick={handleBackClick}
          customScrollProgress={scrollProgress}
          actionButtons={[
            {
              Icon: Bell,
              onClick: () => {},
              count: 3
            }
          ]}
        />
      </div>

      <main>
        {/* Seller Info Section - same structure as SellerPage */}
        <div ref={sellerInfoRef} className="w-full bg-white border-b">
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            <div className="flex items-center gap-4">
              {/* Profile Picture */}
              <Avatar className="w-16 h-16 flex-shrink-0">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                    <Store className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h1 className="text-xl font-bold text-foreground">John's Store</h1>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Premium Seller Dashboard</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>⭐ Premium Account</span>
                  <span>📊 Dashboard Analytics</span>
                  <span>🛡️ Verified Business</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation - same sticky behavior as SellerPage */}
        <nav
          ref={tabsRef}
          className={`bg-white border-b transition-all duration-300 ease-out ${
            isTabsSticky
              ? 'fixed left-0 right-0 z-40'
              : 'relative'
          }`}
          style={{
            top: isTabsSticky ? `${headerHeight}px` : 'auto',
            transform: 'translateZ(0)',
            willChange: isTabsSticky ? 'transform' : 'auto',
            backfaceVisibility: 'hidden'
          }}
        >
          <TabsNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </nav>

        {/* Spacer div when tabs are sticky to prevent content jumping - same as SellerPage */}
        {isTabsSticky && (
          <div
            className="transition-all duration-300 ease-out"
            style={{ 
              height: `${tabsHeight}px`,
              opacity: isTabsSticky ? 1 : 0,
              transform: 'translateZ(0)'
            }}
          />
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SellerLayout;
