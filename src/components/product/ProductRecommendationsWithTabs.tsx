import { Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, trackProductView } from "@/integrations/supabase/products";
import TabsNavigation from "@/components/home/TabsNavigation";
import ProductSectionWrapper from "@/components/product/ProductSectionWrapper";

export default function ProductRecommendationsWithTabs({ hideHeader = false, hideTabs = false }: { hideHeader?: boolean; hideTabs?: boolean }) {
  const location = useLocation();

  // Define product category tabs
  const categoryTabs = [
    { id: 'electronics', label: 'Electronics' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'home', label: 'Home' },
    { id: 'sports', label: 'Sports' },
    { id: 'books', label: 'Books' },
    { id: 'automotive', label: 'Auto' },
    { id: 'health', label: 'Health' },
    { id: 'beauty', label: 'Beauty' },
    { id: 'toys', label: 'Toys' },
    { id: 'office', label: 'Office' },
    { id: 'garden', label: 'Garden' },
    { id: 'pet', label: 'Pet' }
  ];

  const [activeTab, setActiveTab] = useState(categoryTabs[0]?.id || 'electronics');
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [loading, setLoading] = useState(false);

  // Reset component state when location changes (navigating to different product)
  useEffect(() => {
    setActiveTab(categoryTabs[0]?.id || 'electronics');
    setVisibleProducts(8);
    setLoading(false);
  }, [location.pathname]);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['product-recommendations', activeTab],
    queryFn: () => fetchAllProducts(),
    staleTime: 300000, // 5 minutes
  });

  // Process products with discount calculations - simplified
  const processedProducts = useMemo(() => 
    allProducts.map(product => ({
      ...product,
      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image"
    })), [allProducts]);

  // Create a stable shuffled list using a seeded random approach
  const extendedProducts = useMemo(() => {
    if (processedProducts.length === 0) return [];

    // Create a stable shuffled array using Fisher-Yates algorithm with a fixed seed
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        // Use a deterministic seed based on the activeTab to ensure consistent shuffling
        const seed = activeTab.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const j = Math.floor((Math.sin(seed + i) + 1) * newArray.length) % newArray.length;
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    const shuffledProducts = shuffleArray(processedProducts);

    // Extend the list for infinite scroll but maintain order
    const extended = [];
    for (let i = 0; i < 200; i++) {
      extended.push(shuffledProducts[i % shuffledProducts.length]);
    }

    return extended;
  }, [processedProducts, activeTab]); // activeTab as dependency ensures reshuffle only when tab changes

  const loadMoreProducts = useCallback(() => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 8, extendedProducts.length));
      setLoading(false);
    }, 500);
  }, [loading, extendedProducts.length]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 1000) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreProducts, loading]);

  const displayedProducts = extendedProducts.slice(0, visibleProducts);

  // Reset visible products when tab changes
  useEffect(() => {
    setVisibleProducts(8);
  }, [activeTab]);

  // Don't render if no products available
  if (!isLoading && processedProducts.length === 0) {
    return null;
  }

  return (
  <div>
    <div className="w-full bg-white">
      {/* Header */}
      {!hideHeader && (
        <SectionHeader 
          title="More from this seller"
          showViewAll={true}
          onViewAllClick={() => {/* Handle view all click */}}
        />
      )}

      <div className={`relative ${hideHeader ? 'pt-0' : 'pt-4'}`}>
        {isLoading ? (
          <div className="flex items-center gap-2 py-2 overflow-x-auto w-full scrollbar-hide -mx-4 px-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex-none w-[calc((100vw-32px)/3.5)] space-y-2">
                <div className="aspect-square bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {displayedProducts.slice(0, 20).map((product) => (
              <div key={product.id} className="flex-none w-[calc((100vw-32px)/3.5)] space-y-2">
                <Link 
                  to={`/product/${product.id}`}
                  onClick={() => trackProductView(product.id)}
                  className="block"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Product info - Clean and simple */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-semibold text-base">
                        ${Number(product.discount_price || product.price).toFixed(2)}
                      </span>
                      {product.discount_price && (
                        <span className="text-xs text-gray-500 line-through">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 px-4">
            No products available for {categoryTabs.find(tab => tab.id === activeTab)?.label}
          </div>
        )}
      </div>
    </div>
  </div>
);
}