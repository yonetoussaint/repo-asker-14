
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, TrendingUp, Award } from 'lucide-react';

const ProductCarousel = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const products = [
    {
      id: 1,
      title: "Wireless Bluetooth Earbuds",
      image: "https://picsum.photos/seed/earbuds123/300/300",
      originalPrice: 39.99,
      discountPrice: 19.99,
      discount: 50,
      rating: 4.8,
      sales: 5382,
      freeShipping: true,
    },
    {
      id: 2,
      title: "Smart Watch Fitness Tracker",
      image: "https://picsum.photos/seed/smartwatch456/300/300",
      originalPrice: 59.99,
      discountPrice: 29.99,
      discount: 50,
      rating: 4.6,
      sales: 3287,
      freeShipping: true,
    },
    {
      id: 3,
      title: "Portable Power Bank 20000mAh",
      image: "https://picsum.photos/seed/powerbank789/300/300",
      originalPrice: 45.99,
      discountPrice: 22.5,
      discount: 51,
      rating: 4.7,
      sales: 7621,
      freeShipping: true,
    },
    {
      id: 4,
      title: "LED Ring Light with Tripod Stand",
      image: "https://picsum.photos/seed/ringlight101/300/300",
      originalPrice: 34.99,
      discountPrice: 19.99,
      discount: 43,
      rating: 4.5,
      sales: 2938,
      freeShipping: false,
    },
    {
      id: 5,
      title: "Laptop Backpack with USB Port",
      image: "https://picsum.photos/seed/backpack202/300/300",
      originalPrice: 49.99,
      discountPrice: 27.99,
      discount: 44,
      rating: 4.9,
      sales: 8273,
      freeShipping: true,
    },
    {
      id: 6,
      title: "Foldable Selfie Drone with Camera",
      image: "https://picsum.photos/seed/drone303/300/300",
      originalPrice: 129.99,
      discountPrice: 79.99,
      discount: 38,
      rating: 4.4,
      sales: 1536,
      freeShipping: true,
    },
    {
      id: 7,
      title: "Wireless Phone Charger Stand",
      image: "https://picsum.photos/seed/charger404/300/300",
      originalPrice: 29.99,
      discountPrice: 15.99,
      discount: 47,
      rating: 4.6,
      sales: 4721,
      freeShipping: true,
    },
    {
      id: 8,
      title: "Gaming Mechanical Keyboard RGB",
      image: "https://picsum.photos/seed/keyboard505/300/300",
      originalPrice: 89.99,
      discountPrice: 45.99,
      discount: 49,
      rating: 4.7,
      sales: 3198,
      freeShipping: true,
    }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      setTimeout(() => {
        setShowLeftArrow(current.scrollLeft > 0);
      }, 500);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 0);
    }
  };

  return (
    <div className="w-full bg-gray-50 py-6 px-4 relative">
      {/* Sponsored Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-800">Sponsored</span>
            <span className="ml-2 text-xs text-gray-500 border border-gray-300 rounded px-1">AD</span>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center bg-orange-50 rounded-full px-2 py-0.5">
              {/* Replace Fire with another available icon */}
              <TrendingUp size={14} className="text-orange-500 mr-1" />
              <span className="text-xs font-medium text-orange-500">Hot Deals</span>
            </div>
            <div className="flex items-center bg-blue-50 rounded-full px-2 py-0.5">
              <TrendingUp size={14} className="text-blue-500 mr-1" />
              <span className="text-xs font-medium text-blue-500">Trending</span>
            </div>
            <div className="flex items-center bg-purple-50 rounded-full px-2 py-0.5">
              <Award size={14} className="text-purple-500 mr-1" />
              <span className="text-xs font-medium text-purple-500">Top Rated</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm text-orange-500 font-medium cursor-pointer hover:text-orange-600">
          Show More
          <ChevronRight size={16} className="ml-1" />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-2 hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div
          className="flex overflow-x-auto scrollbar-hide gap-3 pb-4"
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-40 bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative">
                <img src={product.image} alt={product.title} className="w-full h-40 object-cover" />
                <button className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white">
                  <Heart size={16} className="text-gray-400 hover:text-red-500" />
                </button>
                <div className="absolute bottom-0 left-0 bg-red-500 text-white text-xs px-1.5 py-0.5">
                  -{product.discount}%
                </div>
              </div>

              <div className="p-2">
                <div className="flex items-baseline">
                  <span className="text-red-500 font-medium text-base">
                    US ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="ml-1 text-gray-400 text-xs line-through">
                    US ${product.originalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <div className="flex items-center bg-yellow-50 px-1.5 py-0.5 rounded">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="ml-0.5 font-medium">{product.rating}</span>
                  </div>
                  <span className="mx-1">·</span>
                  <span className="font-medium">{product.sales}+ sold</span>
                </div>
                {product.freeShipping && (
                  <div className="mt-1">
                    <span className="text-xs text-green-600">Free Shipping</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-2 hover:bg-white"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
