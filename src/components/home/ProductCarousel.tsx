
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, TrendingUp, Award } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";

const ProductCarousel = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Fetch products from the database
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'carousel'],
    queryFn: fetchAllProducts,
  });

  // Process products for display
  const processedProducts = products.slice(0, 8).map(product => {
    const discountPercentage = product.discount_price 
      ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
      : 0;

    return {
      id: product.id,
      title: product.name,
      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image",
      originalPrice: Number(product.price),
      discountPrice: product.discount_price ? Number(product.discount_price) : Number(product.price),
      discount: discountPercentage,
      rating: product.rating || 4.5,
      sales: Math.floor(Math.random() * 5000) + 1000, // Simulated sales data
      shipping: "Free Shipping",
    };
  });

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  useEffect(() => {
    checkScrollPosition();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -280 : 280; // Adjusted for smaller cards
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 500);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 py-4 px-0 relative">
        <div className="px-4 flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-sm font-bold text-gray-800">Sponsored</span>
            <span className="ml-2 text-xs text-gray-500 border border-gray-300 rounded px-1">AD</span>
          </div>
        </div>
        <div className="flex overflow-x-auto scrollbar-hide pb-4 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-32 bg-white rounded overflow-hidden ml-2 first:ml-4">
              <div className="w-full h-28 bg-gray-200 animate-pulse"></div>
              <div className="p-1.5 space-y-1">
                <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-2 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 py-4 px-0 relative">
      {/* Header */}
      <div className="px-4 flex justify-between items-center mb-3">
        <div className="flex items-center">
          <span className="text-sm font-bold text-gray-800">Sponsored</span>
          <span className="ml-2 text-xs text-gray-500 border border-gray-300 rounded px-1">AD</span>
        </div>
        <div className="flex items-center text-xs text-orange-500 font-medium cursor-pointer hover:text-orange-600">
          More
          <ChevronRight size={14} className="ml-1" />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-1.5 hover:bg-white"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div
          className="flex overflow-x-auto scrollbar-hide pb-4 gap-1"
          ref={scrollRef}
          onScroll={checkScrollPosition}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {processedProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-32 bg-white rounded overflow-hidden hover:shadow-sm transition-shadow duration-300 ml-2 first:ml-4 last:mr-4"
            >
              <div className="relative">
                <img src={product.image} alt={product.title} className="w-full h-28 object-cover" />
                <button className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-white">
                  <Heart size={12} className="text-gray-400 hover:text-red-500" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-8">
                  <div className="absolute bottom-1 left-1 text-white text-xs px-1 py-0.5 rounded flex items-center">
                    <Star size={10} className="fill-yellow-400 text-yellow-400 mr-0.5" />
                    {product.rating}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-sm">
                    -{product.discount}%
                  </div>
                </div>
              </div>

              <div className="p-1.5">
                <div className="text-xs text-gray-800 line-clamp-2 leading-tight h-8 mb-1">
                  {product.title}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline">
                    <span className="text-sm text-red-500 font-semibold">
                      US ${product.discountPrice.toFixed(2)}
                    </span>
                    <span className="ml-1 text-xs text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {product.shipping}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {product.sales}+ sold
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-1.5 hover:bg-white"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
