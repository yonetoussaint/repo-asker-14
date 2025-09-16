import React, { useRef, useState, useEffect } from 'react';
import ProductDetail from '@/pages/ProductDetail';
import ProductHeader from '@/components/product/ProductHeader';
import { Heart, Share } from 'lucide-react';
import { useScreenOverlay } from "@/context/ScreenOverlayContext";

// Custom hook for panel scroll progress
const usePanelScrollProgress = (scrollContainerRef: React.RefObject<HTMLDivElement>, isOpen: boolean) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isOpen) return;

    console.log('🔧 Setting up scroll listener for panel');

    const onScroll = () => {
      const currentScrollTop = container.scrollTop;
      setScrollY(currentScrollTop);

      // Additional debug for scroll events
      console.log('🔄 Panel Scroll Event:', {
        scrollTop: currentScrollTop,
        timestamp: Date.now()
      });
    };

    // Reset scroll to top when container is available
    container.scrollTop = 0;
    setScrollY(0);

    // Use scroll event listener
    container.addEventListener("scroll", onScroll, { passive: true });

    // Initial call to set progress immediately
    onScroll();

    return () => {
      console.log('🧹 Cleaning up panel scroll listener');
      container.removeEventListener("scroll", onScroll);
    };
  }, [scrollContainerRef, isOpen]); // Added isOpen dependency

  const maxScroll = 120; // Match the standard header scroll threshold
  const progress = Math.min(scrollY / maxScroll, 1);

  return { scrollY, progress };
};

interface ProductSemiPanelProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductSemiPanel: React.FC<ProductSemiPanelProps> = ({
  productId,
  isOpen,
  onClose,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [focusMode, setFocusMode] = useState(false);
  const [showHeaderInFocus, setShowHeaderInFocus] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [panelHeaderHeight, setPanelHeaderHeight] = useState(60); // Default header height
  const { setHasActiveOverlay } = useScreenOverlay();

  // Get scroll progress for the panel
  const { progress: scrollProgress, scrollY } = usePanelScrollProgress(scrollContainerRef, isOpen);

  // Measure panel header height
  React.useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.getBoundingClientRect().height;
      setPanelHeaderHeight(height);
    }
  }, [isOpen]);

  // Force immediate scroll progress update when panel opens
  React.useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTop = 0;
          console.log('🎯 Panel opened - container setup:', {
            hasContainer: true,
            scrollTop: container.scrollTop,
            clientHeight: container.clientHeight,
            scrollHeight: container.scrollHeight,
            overflow: getComputedStyle(container).overflow
          });

          // Force a scroll event to initialize progress
          const scrollEvent = new Event('scroll', { bubbles: true });
          container.dispatchEvent(scrollEvent);
        } else {
          console.log('❌ Panel opened but no scroll container found');
        }
      }, 100); // Increased delay for better reliability

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Debug logging for panel scroll progress
  React.useEffect(() => {
    console.log('📋 Panel Scroll Debug:', {
      scrollY,
      scrollProgress,
      hasContainer: !!scrollContainerRef.current,
      panelHeaderHeight,
      maxScroll: 120,
      progressCalculation: `${scrollY}/120 = ${scrollProgress}`,
      isOpen,
      containerScrollTop: scrollContainerRef.current?.scrollTop || 0,
      shouldShowScrolledState: scrollProgress > 0.5
    });
  }, [scrollY, scrollProgress, panelHeaderHeight, isOpen]);


  // Handle panel state changes to control bottom nav visibility
  useEffect(() => {
    setHasActiveOverlay(isOpen);
    return () => {
      setHasActiveOverlay(false);
    };
  }, [isOpen, setHasActiveOverlay]);

  if (!isOpen) return null;

  const handleTabChange = (section: string) => {
    setActiveSection(section);
    console.log('Tab changed to:', section);
    // You might want to implement scroll-to-section logic here
  };

  const handleShareClick = () => {
    console.log('Share clicked in panel');
  };

  const handleProductDetailsClick = () => {
    console.log('Product details clicked');
    onClose(); // Or any other action
  };

  return (
    <>
      {/* Backdrop with full coverage */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
        style={{ margin: 0, padding: 0 }}
      />

      {/* Semi Panel with increased height (85vh) */}
      <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-[9999] rounded-t-lg shadow-xl overflow-hidden flex flex-col">

        {/* Product Header - with scroll-based behavior */}
        <div 
          ref={headerRef} 
          className="absolute top-0 left-0 right-0 z-50"
        >
          <ProductHeader 
            inPanel={true} // Enable panel behavior
            activeSection={activeSection}
            onTabChange={handleTabChange}
            focusMode={focusMode}
            showHeaderInFocus={showHeaderInFocus}
            onProductDetailsClick={handleProductDetailsClick}
            currentImageIndex={currentImageIndex}
            totalImages={totalImages}
            onShareClick={handleShareClick}
            forceScrolledState={false}
            customScrollProgress={scrollProgress}
            showCloseIcon={true} // Show X icon in panel
            onCloseClick={onClose} // Handle close click
            actionButtons={[
              {
                Icon: Heart,
                active: false,
                onClick: () => console.log('Favorite clicked in panel'),
                count: 147
              },
              {
                Icon: Share,
                onClick: handleShareClick,
                count: 23
              }
            ]}
          />
        </div>

        {/* Scrollable Content with header space */}
        {productId ? (
          <div className="flex-1 overflow-hidden min-h-0 relative">
            {/* Scrollable container that we track for scroll progress */}
            <div 
              ref={scrollContainerRef}
              className="absolute inset-0 overflow-y-auto"
            >
              <ProductDetail 
                productId={productId} 
                hideHeader={true}
                inPanel={true}
                scrollContainerRef={scrollContainerRef}
                stickyTopOffset={panelHeaderHeight}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              No product selected
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductSemiPanel;