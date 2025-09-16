
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import SecondaryHeroBanner from "@/components/home/SecondaryHeroBanner";
import FlashDeals from "@/components/home/ElectronicsFlashDeals";
import ProductRecommendations from "@/components/home/ProductRecommendations";
import TopBrands from "@/components/home/ElectronicsTopBrands";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import SecondaryFlashDeals from "@/components/home/SecondaryFlashDeals";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import Newsletter from "@/components/home/Newsletter";
import PopularSearches from "@/components/home/PopularSearches";
import NewArrivals from "@/components/home/NewArrivals";
import ElectronicsHeroBanner from "@/components/home/ElectronicsHeroBanner";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import ElectronicsSubcategories from "@/components/home/ElectronicsSubcategories";

export default function ElectronicsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="max-w-screen overflow-hidden pb-16 relative">
      {/* Header with the correct active tab */}
      <AliExpressHeader activeTabId="electronics" />
      
      {/* Hero Banner */}
      <ElectronicsHeroBanner />
      
      {/* Electronics Subcategories */}
      <ElectronicsSubcategories />

      <div className="space-y-1 pt-[80px]">
        <FlashDeals />
        <TopVendorsCompact />
        <MobileOptimizedReels />
        
        {Array.isArray(products) && products.length > 0 && (
          <SuperDealsSection products={products} />
        )}
        
        <SecondaryHeroBanner />
        <PopularSearches />
        <TopBrands />
        
        {Array.isArray(products) && products.length > 0 && (
          <VendorProductCarousel 
            title="Technology" 
            products={products.slice(0, 10)} 
          />
        )}
        
        <SecondaryFlashDeals />
        <BenefitsBanner />
        
        <div className="bg-white mb-1">
          <ProductRecommendations />
        </div>
        
        {/* New Arrivals section */}
        {Array.isArray(products) && products.length > 0 && (
          <NewArrivals products={products.slice(0, 4)} />
        )}
        
        <Newsletter />
      </div>
    </div>
  );
}