import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Zap, Star, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchFlashDeals, trackProductView } from '@/integrations/supabase/products';

export default function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fetch flash deals from the database
  const { data: flashProducts = [], isLoading } = useQuery({
    queryKey: ['flash-deals'],
    queryFn: () => fetchFlashDeals(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Calculate time remaining for flash deals
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!flashProducts || flashProducts.length === 0) return { hours: 0, minutes: 0, seconds: 0 };
      
      // Get the most recent flash deal start time
      const latestFlashStart = flashProducts.reduce((latest, product) => {
        const startTime = new Date(product.flash_start_time || '').getTime();
        return startTime > latest ? startTime : latest;
      }, 0);

      if (latestFlashStart === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const endTime = latestFlashStart + (24 * 60 * 60 * 1000); // 24 hours later
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [flashProducts]);

  // Process products with discount calculations
  const processedProducts = flashProducts.map(product => {
    const discountPercentage = product.discount_price 
      ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
      : 0;

    return {
      ...product,
      discountPercentage,
      stock: product.inventory ?? 0,
      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image"
    };
  });

  // Don't render if no products available
  if (!isLoading && processedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white space-y-4">
      {/* Header with timer */}
      <div className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Flash Deals</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            <Timer className="w-4 h-4" />
            <span>
              {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                <span key={i}>
                  {unit.toString().padStart(2, "0")}
                  {i < 2 && <span className="mx-0.5">:</span>}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-square bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {processedProducts.slice(0, 6).map((product, index) => (
            <div key={`${product.id}-${index}`} className="space-y-2">
              <Link 
                to={`/product/${product.id}`}
                className="block"
                onClick={() => trackProductView(product.id)}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-md border">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Stock indicator */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                    {product.stock} left
                  </div>
                  
                  {/* Discount badge */}
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                      -{product.discountPercentage}%
                    </div>
                  )}
                  
                  {/* Timer overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs flex justify-center py-1">
                    {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                      <span key={i}>
                        {unit.toString().padStart(2, "0")}
                        {i < 2 && <span className="mx-0.5">:</span>}
                      </span>
                    ))}
                  </div>

                  {/* Favorite button */}
                  <button 
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Product info */}
                <div className="space-y-1">
                  <h4 className="text-sm font-medium line-clamp-2 text-gray-900">
                    {product.name}
                  </h4>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-3 h-3 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">(4.0)</span>
                  </div>
                  
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
      )}

      {/* View All Link */}
      {processedProducts.length > 6 && (
        <div className="flex justify-center pt-4">
          <Link 
            to="/search?category=flash-deals"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            View All Flash Deals
          </Link>
        </div>
      )}
    </div>
  );
}