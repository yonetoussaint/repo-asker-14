// components/product/StickyTabsNavigation.tsx
import React, { useState, useEffect } from 'react';
import TabsNavigation from "@/components/home/TabsNavigation";
import { ProductImageGalleryRef } from "@/components/ProductImageGallery";

interface StickyTabsNavigationProps {
  headerHeight: number;
  // Add gallery ref to sync state
  galleryRef: React.RefObject<ProductImageGalleryRef>;
}

const StickyTabsNavigation: React.FC<StickyTabsNavigationProps> = ({
  headerHeight,
  galleryRef
}) => {
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // Local state for UI updates

  // Sync with gallery's active tab
  useEffect(() => {
    const syncActiveTab = () => {
      if (galleryRef.current) {
        const galleryActiveTab = galleryRef.current.getActiveTab();
        if (galleryActiveTab !== activeTab) {
          setActiveTab(galleryActiveTab);
        }
      }
    };

    // Sync initially and then periodically
    syncActiveTab();
    const interval = setInterval(syncActiveTab, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [galleryRef, activeTab]);

  useEffect(() => {
    const handleScrollForStickyTabs = () => {
      // Get the tabs container directly from the gallery ref
      const tabsContainer = galleryRef.current?.getTabsContainer();
      
      if (tabsContainer) {
        const tabsRect = tabsContainer.getBoundingClientRect();

        // Show sticky tabs when the original tabs start to scroll out of view
        // (when top of tabs container reaches bottom of header)
        const shouldShow = tabsRect.top <= headerHeight;

        setShowStickyTabs(shouldShow);

        console.log('📊 Tabs scroll detection:', {
          tabsTop: tabsRect.top,
          headerHeight,
          shouldShow,
          tabsContainer: !!tabsContainer
        });
      }
    };

    window.addEventListener('scroll', handleScrollForStickyTabs, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollForStickyTabs);
  }, [galleryRef, headerHeight]);

  // Handle tab click with smooth scrolling and sync with gallery
  const handleTabClick = (tabId: string) => {
    // Update the gallery's active tab
    if (galleryRef.current) {
      galleryRef.current.setActiveTab(tabId);
    }
    
    // Update local state immediately for UI responsiveness
    setActiveTab(tabId);

    // Scroll to the corresponding section
    const targetElement = document.getElementById(tabId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - headerHeight - 60; // 60px buffer for sticky tabs

      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
      });
    }
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
          { id: 'variants', label: 'Variants' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'qna', label: 'Q&A' },
          { id: 'shipping', label: 'Shipping' }
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

export default StickyTabsNavigation;