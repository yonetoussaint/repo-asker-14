import { useState, useEffect, useMemo, forwardRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, trackProductView } from "@/integrations/supabase/products";
import { ShoppingBag } from "lucide-react";
import TabsNavigation from "@/components/home/TabsNavigation";
import SectionHeader from "@/components/home/SectionHeader";
import { Link, useLocation } from "react-router-dom";

const ProductRecommendationsVertical = forwardRef<HTMLDivElement>((props, ref) => {
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('electronics');
  const [visibleProducts, setVisibleProducts] = useState(12);

  // Reset component state when location changes
  useEffect(() => {
    setActiveTab('electronics');
    setVisibleProducts(12);
  }, [location.pathname]);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['product-recommendations-vertical', activeTab],
    queryFn: () => fetchAllProducts(),
    staleTime: 300000, // 5 minutes
  });

  // Process products with discount calculations
  const processedProducts = useMemo(() => 
    allProducts.map(product => ({
      ...product,
      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image"
    })), [allProducts]);

  // Create a stable shuffled list
  const extendedProducts = useMemo(() => {
    if (processedProducts.length === 0) return [];

    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const seed = activeTab.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const j = Math.floor((Math.sin(seed + i) + 1) * newArray.length) % newArray.length;
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    const shuffledProducts = shuffleArray(processedProducts);

    const extended = [];
    for (let i = 0; i < 200; i++) {
      extended.push(shuffledProducts[i % shuffledProducts.length]);
    }

    return extended;
  }, [processedProducts, activeTab]);

  const displayedProducts = extendedProducts.slice(0, visibleProducts);

  // Reset visible products when tab changes
  useEffect(() => {
    setVisibleProducts(12);
  }, [activeTab]);

  // Don't render if no products available
  if (!isLoading && processedProducts.length === 0) {
    return null;
  }

  const loadMore = () => {
    setVisibleProducts(prev => Math.min(prev + 12, extendedProducts.length));
  };

  return (
    <div id="recommendations-vertical-section" className="w-full bg-white">
      {/* Static Header - with ref for sticky detection */}
      <div ref={ref} className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 text-white">
        <SectionHeader
          title="RECOMMENDATIONS"
          icon={ShoppingBag}
          viewAllLink="/search"
          viewAllText="View All Products"
          showTabs={false}
        />
      </div>

      {/* Static Tabs Navigation */}
      <div className="w-screen -mx-4 bg-white border-b border-gray-100">
        <TabsNavigation
          tabs={[
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
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          edgeToEdge={true}
          style={{ backgroundColor: 'white' }}
        />
      </div>

      {/* Products Grid - Two Columns Vertical */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-square bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {displayedProducts.map((product) => (
                <div key={`${product.id}-${Math.random()}`} className="space-y-2">
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

                    {/* Product info */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium line-clamp-2 text-gray-900">
                        {product.name}
                      </h4>

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

            {/* Load More Button */}
            {visibleProducts < extendedProducts.length && (
              <div className="flex justify-center pt-6">
                <button
                  onClick={loadMore}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No products available
          </div>
        )}
      </div>
    </div>
  );
});

ProductRecommendationsVertical.displayName = "ProductRecommendationsVertical";

export default ProductRecommendationsVertical;