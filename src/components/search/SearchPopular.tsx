import React from 'react';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PopularProduct {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
  isLiked?: boolean;
  views?: number;
}

interface SearchPopularProps {
  onProductClick: (productId: string) => void;
  onLike: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const SearchPopular: React.FC<SearchPopularProps> = ({
  onProductClick,
  onLike,
  onAddToCart
}) => {
  const popularProducts: PopularProduct[] = [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones Pro',
      price: '$89.99',
      originalPrice: '$129.99',
      rating: 4.8,
      reviews: 1247,
      image: '',
      discount: 30,
      views: 12500
    },
    {
      id: '2',
      name: 'Smart Fitness Tracker Watch',
      price: '$45.99',
      originalPrice: '$69.99',
      rating: 4.6,
      reviews: 856,
      image: '',
      discount: 34,
      views: 8900
    },
    {
      id: '3',
      name: 'USB-C Fast Charging Cable 3ft',
      price: '$12.99',
      rating: 4.9,
      reviews: 2341,
      image: '',
      views: 15600
    },
    {
      id: '4',
      name: 'Gaming Mechanical Keyboard',
      price: '$79.99',
      originalPrice: '$99.99',
      rating: 4.7,
      reviews: 634,
      image: '',
      discount: 20,
      views: 5400
    },
  ];

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k views`;
    }
    return `${views} views`;
  };

  return (
    <div className="mb-6">
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800"
      >
        <Star className="h-5 w-5 text-yellow-500" />
        Popular Right Now
      </motion.h3>
      
      <div className="grid grid-cols-2 gap-4">
        {popularProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-3 cursor-pointer hover:shadow-lg active:shadow-md transition-all duration-200 border border-gray-100"
            onClick={() => onProductClick(product.id)}
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 overflow-hidden">
              {product.discount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                  -{product.discount}%
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white active:scale-95 transition-all z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(product.id);
                }}
              >
                <Heart className={`h-4 w-4 ${product.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              
              {/* Placeholder for product image */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
                {product.name}
              </h4>
              
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-bold text-base">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-sm line-through">{product.originalPrice}</span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600 font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                
                {product.views && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{formatViews(product.views)}</span>
                  </div>
                )}
              </div>
              
              <Button
                size="sm"
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl h-8 active:scale-95 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product.id);
                }}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchPopular;