
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import SecondaryHeroBanner from "@/components/home/SecondaryHeroBanner";
import FlashDeals from "@/components/home/AutomotiveFlashDeals";
import ProductRecommendations from "@/components/home/ProductRecommendations";
import TopBrands from "@/components/home/AutomotiveTopBrands";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import SecondaryFlashDeals from "@/components/home/SecondaryFlashDeals";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import Newsletter from "@/components/home/Newsletter";
import PopularSearches from "@/components/home/PopularSearches";
import NewArrivals from "@/components/home/NewArrivals";
import AutomotiveHeroBanner from "@/components/home/AutomotiveHeroBanner";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import AutomotiveSubcategories from "@/components/home/AutomotiveSubcategories";

export default function AutomotivePage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="max-w-screen overflow-hidden pb-16 relative">
      {/* Header with the correct active tab */}
      <AliExpressHeader activeTabId="automotive" />
      
      {/* Hero Banner */}
      <AutomotiveHeroBanner />
      
      {/* Automotive Subcategories */}
      <AutomotiveSubcategories />

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
            title="Auto Accessories" 
            products={products.slice(0, 10)} 
          />
        )}
        
        <SecondaryFlashDeals />
        <BenefitsBanner />
        
        <div className="bg-white mb-1">
          <ProductRecommendations />
        </div>
        
        {Array.isArray(products) && products.length > 0 && (
          <NewArrivals products={products.slice(0, 4)} />
        )}
        
        <Newsletter />
      </div>
    </div>
  );
}