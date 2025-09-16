// components/seller/SellerStickyTabsNavigation.tsx
import React, { useState, useEffect } from 'react';
import TabsNavigation from "@/components/home/TabsNavigation";

interface SellerStickyTabsNavigationProps {
  headerHeight: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SellerStickyTabsNavigation: React.FC<SellerStickyTabsNavigationProps> = ({
  headerHeight,
  activeTab,
  onTabChange
}) => {
  const [showStickyTabs, setShowStickyTabs] = useState(false);

  useEffect(() => {
    const handleScrollForStickyTabs = () => {
      // Show sticky tabs when scrolled past the header area
      const scrollTop = window.scrollY;
      // Show tabs after scrolling past the seller info section (which is around 250px)
      setShowStickyTabs(scrollTop > 250);
    };

    // Initial check
    handleScrollForStickyTabs();
    
    window.addEventListener('scroll', handleScrollForStickyTabs, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollForStickyTabs);
  }, [headerHeight]); // Add headerHeight dependency

  // Handle tab click - simplified to avoid scroll conflicts
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    // Don't scroll automatically to prevent sticky tabs from hiding
  };

  if (!showStickyTabs) return null;

  return (
    <div 
      className="fixed left-0 right-0 z-40 bg-white border-b overflow-x-auto shadow-sm"
      style={{ top: `${headerHeight}px` }}
    >
      <div className="w-full bg-white">
        <TabsNavigation
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: 'Products' },
            { id: 'contact', label: 'Contact' },
            { id: 'about', label: 'About' }
          ]}
          activeTab={activeTab}
          onTabChange={handleTabClick}
          edgeToEdge={true}
          style={{ 
            backgroundColor: 'white',
            margin: 0,
            padding: 0
          }}
        />
      </div>
    </div>
  );
};

export default SellerStickyTabsNavigation;