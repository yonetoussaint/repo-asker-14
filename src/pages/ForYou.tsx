
import React, { useState, useEffect, useCallback } from "react";
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

export default function ForYou() {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { t } = useTranslation(['product', 'categories']);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000, // 1 minute
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

  // Initialize feed and mark content as ready
  useEffect(() => {
    if (products) {
      setFeedItems(generateFeedItems(15, 0));
      // Add a small delay to ensure all components have time to render
      setTimeout(() => {
        setIsContentReady(true);
      }, 800);
    }
  }, [products, generateFeedItems]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading) return;
    
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      setLoading(true);
      
      setTimeout(() => {
        setFeedItems(prev => [
          ...prev,
          ...generateFeedItems(10, prev.length)
        ]);
        setLoading(false);
      }, 500);
    }
  }, [loading, generateFeedItems]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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
        ) : null;
      case 'VendorProductCarousel':
        return products && products.length > 0 ? (
          <VendorProductCarousel 
            key={id}
            title={t('trending', { ns: 'product' })} 
            products={products.slice(0, 10)} 
            onProductClick={handleProductClick}
          />
        ) : null;
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

  // Show content immediately without skeleton loading

  return (
    <PageContainer className="overflow-hidden pb-16 relative">
      {/* Hero Banner - shown once at the top */}
      <HeroBanner />
      <SpaceSavingCategories />
      

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