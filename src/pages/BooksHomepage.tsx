import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import PageSkeleton from "@/components/skeletons/PageSkeleton";
import SuperDealsSection from "@/components/home/SuperDealsSection";
import SecondaryHeroBanner from "@/components/home/SecondaryHeroBanner";
import FlashDeals from "@/components/home/FlashDeals";
import ProductRecommendations from "@/components/home/ProductRecommendations";
import TopBrands from "@/components/home/TopBrands";
import VendorProductCarousel from "@/components/home/VendorProductCarousel";
import SecondaryFlashDeals from "@/components/home/SecondaryFlashDeals";
import BenefitsBanner from "@/components/home/BenefitsBanner";
import TopVendorsCompact from "@/components/home/TopVendorsCompact";
import MobileOptimizedReels from "@/components/home/MobileOptimizedReels";
import Newsletter from "@/components/home/Newsletter";
import PopularSearches from "@/components/home/PopularSearches";
import NewArrivals from "@/components/home/NewArrivals";
import HeroBanner from "@/components/home/HeroBanner";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import HomeSubcategories from "@/components/home/HomeSubcategories";
import BookGenreFlashDeals from "@/components/home/BookGenreFlashDeals";

export default function BooksHomepage() {
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
      <AliExpressHeader activeTabId="home" />
      
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Books Subcategories */}
      <HomeSubcategories />

      <div className="space-y-1">
        <FlashDeals productType="books" />
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
            title="Bestselling Books" 
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
        
        {/* Book Genre Flash Deals - Last component with vertical two-column layout */}
        <BookGenreFlashDeals />
      </div>
    </div>
  );
}