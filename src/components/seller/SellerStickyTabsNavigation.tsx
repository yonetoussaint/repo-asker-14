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
      // Adjust threshold to show tabs after header area (account for seller info section)
      setShowStickyTabs(scrollTop > headerHeight + 100);
    };

    window.addEventListener('scroll', handleScrollForStickyTabs, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollForStickyTabs);
  }, []);

  // Handle tab click with smooth scrolling
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    
    // Scroll to appropriate section based on tab
    const sectionOffsets = {
      overview: headerHeight + 150,
      products: headerHeight + 300,
      contact: headerHeight + 500,
      about: headerHeight + 400
    };
    
    window.scrollTo({
      top: sectionOffsets[tabId] || headerHeight + 200,
      behavior: 'smooth'
    });
  };

  if (!showStickyTabs) return null;

  return (
    <div 
      className="fixed left-0 right-0 z-40 bg-white border-b overflow-x-auto"
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