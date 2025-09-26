import React, { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import { fetchAllProducts } from "@/integrations/supabase/products";

import { PageContainer } from "@/components/layout/PageContainer";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import SecondaryHeroBanner from "@/components/home/SecondaryHeroBanner";
import FlashDeals from "@/components/home/FlashDeals";
import SimpleFlashDeals from "@/components/home/SimpleFlashDeals";
import ProductRecommendations from "@/components/home/ProductRecommendations";
import SpaceSavingCategories from "@/components/home/SpaceSavingCategories";
import TopBrands from "@/components/home/TopBrands";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import Newsletter from "@/components/home/Newsletter";
import PopularSearches from "@/components/home/PopularSearches";
import ProductSemiPanel from "@/components/home/ProductSemiPanel";

import NewArrivals from "@/components/home/NewArrivals";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import HeroBanner from "@/components/home/HeroBanner";
import AliExpressHeader from "@/components/home/AliExpressHeader";

import { 
  Smartphone, 
  ShoppingBag, 
  Shirt, 
  Baby, 
  Home, 
  Dumbbell, 
  Sparkles, 
  Car, 
  BookOpen,
  Gamepad2,
  Watch,
  Headphones,
  Camera,
  Laptop,
  Coffee
} from "lucide-react";

// Component patterns for endless feed
const flashDealsCategories = [
  { title: "ELECTRONICS", icon: Smartphone },
  { title: "WOMEN'S FASHION", icon: ShoppingBag },
  { title: "MEN'S FASHION", icon: Shirt },
  { title: "KIDS & TOYS", icon: Baby },
  { title: "HOME & GARDEN", icon: Home },
  { title: "SPORTS & FITNESS", icon: Dumbbell },
  { title: "BEAUTY & HEALTH", icon: Sparkles },
  { title: "AUTOMOTIVE", icon: Car },
  { title: "BOOKS & MEDIA", icon: BookOpen },
  { title: "GAMING", icon: Gamepad2 },
  { title: "WATCHES", icon: Watch },
  { title: "AUDIO", icon: Headphones },
  { title: "PHOTOGRAPHY", icon: Camera },
  { title: "COMPUTERS", icon: Laptop },
  { title: "COFFEE & TEA", icon: Coffee },
];

const feedComponents = [
  'FlashDeals',
  'MobileOptimizedReels',
  'TopVendorsCompact',
  'NewArrivalsSection',
  'SuperDealsSection',
  'VendorProductCarousel',
  'SimpleFlashDeals',
  'PopularSearches',
  'TopBrands',
  'BenefitsBanner',
];

export default function ElectronicsPage() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showFilterBarInHeader, setShowFilterBarInHeader] = useState(false);
  const { t } = useTranslation(['product', 'categories']);

  const heroBannerRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  // Generate initial feed
  const generateFeedItems = useCallback((count: number, startIndex: number = 0) => {
    const items = [];

    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % feedComponents.length;
      const componentType = feedComponents[index];

      if (componentType === 'SimpleFlashDeals') {
        const categoryIndex = (startIndex + i) % flashDealsCategories.length;
        items.push({
          id: `${componentType}-${startIndex + i}`,
          type: componentType,
          category: flashDealsCategories[categoryIndex],
        });
      } else {
        items.push({
          id: `${componentType}-${startIndex + i}`,
          type: componentType,
        });
      }
    }

    return items;
  }, []);

  // Initialize feed immediately - don't wait for products
  useEffect(() => {
    setFeedItems(generateFeedItems(10, 0));
    setTimeout(() => {
      setIsContentReady(true);
    }, 800);
  }, [generateFeedItems]);

  // Use Intersection Observer to detect when filter bar in HeroBanner scrolls out of view
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let debounceTimeout: NodeJS.Timeout;
    let setupTimer: NodeJS.Timeout;
    let retryTimer: NodeJS.Timeout;
    
    const setupObserver = () => {
      // Disconnect any existing observer first
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      
      // Get header height for proper root margin
      const header = document.getElementById("ali-header");
      const headerHeight = header ? header.offsetHeight : 76; // fallback to typical header height
      
      // Wait for HeroBanner and ProductFilterBar to render
      setupTimer = setTimeout(() => {
        // Scope the query to the hero banner to ensure we get the correct ProductFilterBar
        const filterBar = heroBannerRef.current?.querySelector('.product-filter-bar');
        
        if (!filterBar) {
          console.log('❌ ProductFilterBar not found in HeroBanner, retrying...');
          retryTimer = setTimeout(setupObserver, 200);
          return;
        }

        console.log('✅ Found ProductFilterBar in HeroBanner:', filterBar);

        observer = new IntersectionObserver(
          ([entry]) => {
            clearTimeout(debounceTimeout);
            
            debounceTimeout = setTimeout(() => {
              // Show filter bar in header when the hero filter bar is not intersecting (hidden by header)
              const shouldShowInHeader = !entry.isIntersecting;
              
              console.log('🎯 Filter bar intersection:', entry.isIntersecting, 'Show in header:', shouldShowInHeader);

              setShowFilterBarInHeader(prev => {
                if (prev !== shouldShowInHeader) {
                  return shouldShowInHeader;
                }
                return prev;
              });
            }, 50);
          },
          {
            root: null,
            rootMargin: `-${headerHeight}px 0px 0px 0px`, // Account for header height for snappier transitions
            threshold: [0, 1]
          }
        );

        observer.observe(filterBar);
      }, 300);
    };

    setupObserver();

    return () => {
      // Clear all timers and observers
      clearTimeout(setupTimer);
      clearTimeout(retryTimer);
      clearTimeout(debounceTimeout);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isContentReady])

  // Handle product click to open semi panel
  const handleProductClick = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setIsPanelOpen(true);
  }, []);

  // Handle panel close
  const handlePanelClose = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedProductId(null);
  }, []);

  // Render component based on type
  const renderFeedItem = (item: any) => {
    const { type, category, id } = item;

    switch (type) {
      case 'FlashDeals':
        return <FlashDeals key={id} />;
      case 'MobileOptimizedReels':
        return <MobileOptimizedReels key={id} />;
      case 'TopVendorsCompact':
        return <TopVendorsCompact key={id} />;
      case 'NewArrivalsSection':
        return <NewArrivalsSection key={id} />;
      case 'SuperDealsSection':
        return products && products.length > 0 ? (
          <SuperDealsSection key={id} products={products} onProductClick={handleProductClick} />
        ) : (
          <div key={id} className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        );
      case 'VendorProductCarousel':
        return products && products.length > 0 ? (
          <VendorProductCarousel 
            key={id}
            title={t('trending', { ns: 'product' })} 
            products={products.slice(0, 10)} 
            onProductClick={handleProductClick}
          />
        ) : (
          <div key={id} className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        );
      case 'SimpleFlashDeals':
        return (
          <SimpleFlashDeals 
            key={id}
            title={category.title} 
            icon={category.icon}
          />
        );
      case 'PopularSearches':
        return <PopularSearches key={id} />;
      case 'TopBrands':
        return <TopBrands key={id} />;
      case 'BenefitsBanner':
        return <BenefitsBanner key={id} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer className="overflow-hidden pb-16 relative">
      {/* Header - shows CategoryTabs by default, ProductFilterBar when scrolled */}
      <AliExpressHeader 
        activeTabId="electronics" 
        showFilterBar={showFilterBarInHeader}
      />

      {/* Hero Banner with the actual ProductFilterBar */}
      <div ref={heroBannerRef}>
        <HeroBanner showNewsTicker={false} />
      </div>

      

      {/* Endless feed content */}
      <div className="space-y-2">
        {feedItems.map(renderFeedItem)}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Product Semi Panel */}
      <ProductSemiPanel
        productId={selectedProductId}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />

      
    </PageContainer>
  );
}