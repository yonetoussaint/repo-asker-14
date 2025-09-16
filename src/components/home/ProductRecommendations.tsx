import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';

const ProductRecommendations = () => {
  const recommendations = [
    { id: 1, name: 'Recommended Phone', price: 799, rating: 4.8 },
    { id: 2, name: 'Popular Laptop', price: 1299, rating: 4.9 },
    { id: 3, name: 'Trending Headphones', price: 249, rating: 4.7 },
    { id: 4, name: 'Best Seller Watch', price: 349, rating: 4.6 }
  ];

  return (
    <div className="py-6">
      <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <div key={product.id} className="ali-card p-4 text-center">
            <div className="w-full h-32 bg-gray-200 rounded mb-2 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <p className="font-medium text-sm mb-1">{product.name}</p>
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-xs ml-1">{product.rating}</span>
            </div>
            <p className="ali-price text-lg">HTG {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;