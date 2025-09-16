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
      // Show sticky tabs when scrolled past the initial tabs
      const scrollTop = window.scrollY;
      setShowStickyTabs(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScrollForStickyTabs, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollForStickyTabs);
  }, []);

  // Handle tab click with smooth scrolling
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    
    // Scroll to top of content area
    window.scrollTo({
      top: headerHeight + 200, // Adjust for header and seller info
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
            { id: 'products', label: 'Products' },
            { id: 'categories', label: 'Categories' },
            { id: 'about', label: 'About' },
            { id: 'contact', label: 'Contact' }
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