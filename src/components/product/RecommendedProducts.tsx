import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  tag?: string;
}

const RecommendedProducts = () => {
  const relatedProducts: RecommendedProduct[] = [
    {
      id: '1',
      name: 'Premium Beard Brush - Natural Boar Bristles',
      price: 800,
      originalPrice: 1200,
      image: '/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png',
      rating: 4.6,
      reviews: 89,
      tag: 'Popular'
    },
    {
      id: '2',
      name: 'Beard Styling Balm - Hold & Shine',
      price: 650,
      image: '/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png',
      rating: 4.4,
      reviews: 67
    },
    {
      id: '3',
      name: 'Mustache Wax - Strong Hold',
      price: 450,
      originalPrice: 600,
      image: '/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png',
      rating: 4.7,
      reviews: 123,
      tag: 'Best Seller'
    },
    {
      id: '4',
      name: 'Beard Shampoo & Conditioner Set',
      price: 950,
      image: '/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png',
      rating: 4.5,
      reviews: 234
    }
  ];

  const recentlyViewed: RecommendedProduct[] = [
    {
      id: '5',
      name: 'Hair Growth Serum',
      price: 1200,
      image: '/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png',
      rating: 4.3,
      reviews: 45
    },
    {
      id: '6',
      name: 'Face Moisturizer - Men\'s',
      price: 850,
      originalPrice: 1100,
      image: '/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png',
      rating: 4.6,
      reviews: 156
    }
  ];

  const ProductCard = ({ product }: { product: RecommendedProduct }) => (
    <div className="border rounded-lg p-3 space-y-2 hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-32 object-cover rounded"
        />
        {product.tag && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            {product.tag}
          </span>
        )}
        <button className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Heart className="w-3 h-3 text-gray-400" />
        </button>
      </div>

      <div className="space-y-1">
        <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>
        
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`w-3 h-3 ${star <= product.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-semibold text-orange-600">{product.price} HTG</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{product.originalPrice} HTG</span>
          )}
        </div>
      </div>

      <div className="flex gap-1">
        <Button size="sm" className="flex-1 h-8 text-xs">
          <ShoppingCart className="w-3 h-3 mr-1" />
          Add
        </Button>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <Heart className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-white space-y-6">
      {/* Related Products */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Complete Your Beard Care Routine</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recently Viewed</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {recentlyViewed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Frequently Bought Together */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold">Frequently Bought Together</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
              <img src="/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png" alt="Current" className="w-full h-full object-cover rounded" />
            </div>
            <span>+</span>
            <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
              <img src="/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png" alt="Bundle" className="w-full h-full object-cover rounded" />
            </div>
            <span>+</span>
            <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
              <img src="/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png" alt="Bundle" className="w-full h-full object-cover rounded" />
            </div>
          </div>
          
          <div className="text-sm">
            <p className="font-medium">Babli Oil + Brush + Balm</p>
            <div className="flex items-center gap-2">
              <span className="text-orange-600 font-semibold">1,850 HTG</span>
              <span className="text-gray-400 line-through text-xs">2,200 HTG</span>
              <span className="text-green-600 text-xs">Save 350 HTG</span>
            </div>
          </div>
          
          <Button className="w-full h-8" size="sm">
            Add Bundle to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts;