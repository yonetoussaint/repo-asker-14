import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Zap, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FlashProduct {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  image: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

const ProductRecommendationsFlash = () => {
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [loading, setLoading] = useState(false);

  // Mock flash products data
  const mockFlashProducts: FlashProduct[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 120,
      discount_price: 89,
      image: '/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png',
      stock: 15,
      rating: 4.5,
      reviews: 234
    },
    {
      id: '2',
      name: 'Smart Watch Series X',
      price: 299,
      discount_price: 199,
      image: '/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png',
      stock: 8,
      rating: 4.8,
      reviews: 156
    },
    {
      id: '3',
      name: 'Bluetooth Speaker Pro',
      price: 79,
      discount_price: 59,
      image: '/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png',
      stock: 23,
      rating: 4.3,
      reviews: 89
    },
    {
      id: '4',
      name: 'Gaming Mouse RGB',
      price: 45,
      discount_price: 29,
      image: '/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png',
      stock: 31,
      rating: 4.6,
      reviews: 67
    }
  ];

  // Duplicate products to create endless scroll effect
  const extendedProducts = [...Array(20)].flatMap((_, i) => 
    mockFlashProducts.map((product, j) => ({
      ...product,
      id: `${product.id}-${i}-${j}`,
      stock: Math.floor(Math.random() * 50) + 1
    }))
  );

  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset to 24 hours when countdown reaches 0
          return { hours: 23, minutes: 59, seconds: 59 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (loading) return;
    
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 8, extendedProducts.length));
      setLoading(false);
    }, 500);
  }, [loading, extendedProducts.length]);

  // Simple scroll handler
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
  }, [loadMoreProducts]);

  const displayedProducts = extendedProducts.slice(0, visibleProducts);

  return (
    <div className="bg-white space-y-4">
      {/* Header with timer */}
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 text-white p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Flash Deals & Recommendations</h3>
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

      {/* Two-column grid */}
      <div className="grid grid-cols-2 gap-3">
        {displayedProducts.map((product, index) => {
          const discountPercentage = product.discount_price 
            ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
            : 0;

          return (
            <div key={`${product.id}-${index}`} className="space-y-2">
              <Link 
                to={`/product/${product.id}`}
                className="block"
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
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                      -{discountPercentage}%
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
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Product info */}
                <div className="space-y-1">
                  <h4 className="text-sm font-medium line-clamp-2 text-gray-900">
                    {product.name}
                  </h4>
                  
                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-3 h-3 ${star <= (product.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                  )}
                  
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
          );
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Show more button if not loading */}
      {!loading && visibleProducts < extendedProducts.length && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={loadMoreProducts}
            className="bg-gray-100 hover:bg-gray-200 transition-colors px-6 py-2 rounded-full text-gray-700 font-medium"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendationsFlash;