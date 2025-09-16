import React, { useState, useEffect } from 'react';
import { Heart, Star, ChevronDown, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface SearchResultsProps {
  viewMode: 'grid' | 'list';
  sortBy: string;
  filters: {
    priceRange: [number, number];
    categories: string[];
    ratings: number[];
    freeShipping: boolean;
  };
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  rating: number;
  reviews: number;
  freeShipping: boolean;
  orders: number;
  category: string;
  tags?: string[];
  isFavorited?: boolean;
}

const SearchResults = ({ viewMode, sortBy, filters }: SearchResultsProps) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  // Mock products data
  const mockProducts: Product[] = Array(20).fill(null).map((_, index) => ({
    id: index + 1,
    name: [
      'Wireless Bluetooth Earbuds',
      'Smartphone Magnetic Charger',
      'Smart Watch with Heart Rate Monitor',
      'Laptop Sleeve Case',
      'Portable Bluetooth Speaker',
      'USB Type-C Cable Pack',
      'Wireless Gaming Mouse',
      'LED Desk Lamp with USB Port',
    ][index % 8] + ` ${index + 1}`,
    price: Math.floor(Math.random() * 200) + 9.99,
    originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 300) + 59.99 : undefined,
    image: `https://picsum.photos/300/300?random=${index + 1}`,
    rating: Math.floor(Math.random() * 2) + 4,
    reviews: Math.floor(Math.random() * 1000) + 10,
    freeShipping: Math.random() > 0.3,
    orders: Math.floor(Math.random() * 10000),
    category: ['Electronics', 'Fashion', 'Home & Garden', 'Beauty'][Math.floor(Math.random() * 4)],
    tags: Math.random() > 0.5 ? ['Popular', 'New Arrival', 'Hot Sale'].slice(0, Math.floor(Math.random() * 3) + 1) : undefined,
    isFavorited: Math.random() > 0.8,
  }));
  
  // Filter and sort products based on user selections
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API fetch with delay
    setTimeout(() => {
      let filteredProducts = [...mockProducts];
      
      // Apply price filter
      filteredProducts = filteredProducts.filter(product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      );
      
      // Apply category filter
      if (filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.categories.includes(product.category)
        );
      }
      
      // Apply ratings filter
      if (filters.ratings.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          filters.ratings.some(rating => product.rating >= rating)
        );
      }
      
      // Apply free shipping filter
      if (filters.freeShipping) {
        filteredProducts = filteredProducts.filter(product => 
          product.freeShipping
        );
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'popular':
          filteredProducts.sort((a, b) => b.orders - a.orders);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => b.id - a.id);
          break;
        case 'price_low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // Default is relevance, keep original order
          break;
      }
      
      setProducts(filteredProducts);
      setHasMore(filteredProducts.length >= 20);
      setIsLoading(false);
    }, 300);
    
  }, [sortBy, filters]);
  
  const handleAddToCart = (productId: number) => {
    toast({
      title: "Added to cart",
      description: "Item added to your shopping cart",
    });
  };
  
  const toggleFavorite = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isFavorited: !product.isFavorited } 
        : product
    ));
    
    const product = products.find(p => p.id === productId);
    if (product) {
      toast({
        title: product.isFavorited ? "Removed from wishlist" : "Added to wishlist",
        description: product.isFavorited 
          ? "Item removed from your wishlist" 
          : "Item added to your wishlist",
      });
    }
  };
  
  const loadMore = () => {
    setIsLoading(true);
    
    // Simulate loading more products
    setTimeout(() => {
      setPage(page + 1);
      // In a real app, you would fetch more products here
      setHasMore(page < 3); // For demo purposes, limit to 3 pages
      setIsLoading(false);
    }, 1000);
  };
  
  // If no products match the filters
  if (products.length === 0 && !isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="h-10 w-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium mb-1">No Products Found</h3>
        <p className="text-sm text-gray-500 mb-4">
          Try adjusting your filters or search criteria
        </p>
        <Button 
          variant="outline"
          onClick={() => {
            // Reset filters logic would go here
          }}
        >
          Reset Filters
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' 
          : 'space-y-4'
        }
      >
        {products.map((product) => (
          viewMode === 'grid' ? (
            <GridProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
              onToggleFavorite={toggleFavorite}
              variants={itemVariants}
            />
          ) : (
            <ListProductCard 
              key={product.id} 
              product={product}
              onAddToCart={handleAddToCart}
              onToggleFavorite={toggleFavorite}
              variants={itemVariants}
            />
          )
        ))}
      </motion.div>
      
      {hasMore && (
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            className="text-sm" 
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

const GridProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleFavorite,
  variants
}: { 
  product: Product, 
  onAddToCart: (id: number) => void,
  onToggleFavorite: (id: number) => void,
  variants: any
}) => {
  return (
    <motion.div 
      variants={variants}
      className="bg-white rounded-md overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative">
        {/* Product image */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full aspect-square object-cover"
        />
        
        {/* Discount badge */}
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-8 w-8 bg-white/80 hover:bg-white p-0 rounded-full"
          onClick={() => onToggleFavorite(product.id)}
        >
          <Heart 
            className="h-4 w-4" 
            fill={product.isFavorited ? "#f43f5e" : "none"} 
            color={product.isFavorited ? "#f43f5e" : "currentColor"}
          />
        </Button>
        
        {/* Tags */}
        {product.tags && (
          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-[8px] py-0 px-1 bg-white/80">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2">
        {/* Product name */}
        <h3 className="text-xs leading-tight line-clamp-2 mb-1.5 h-8">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline mb-1">
          <span className="text-red-500 text-sm font-medium mr-1.5">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center text-[10px] text-gray-500 mb-2">
          <div className="flex">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i} 
                className="h-3 w-3 mr-0.5" 
                fill={i < product.rating ? "#FFB800" : "none"}
                color={i < product.rating ? "#FFB800" : "#E5E7EB"}
              />
            ))}
          </div>
          <span className="ml-1">{product.rating.toFixed(1)}</span>
          <span className="mx-1">|</span>
          <span>{product.orders}+ sold</span>
        </div>
        
        {/* Free shipping */}
        {product.freeShipping && (
          <div className="mb-2">
            <Badge variant="outline" className="text-[10px] px-1 py-0 border-green-500 text-green-600">
              Free Shipping
            </Badge>
          </div>
        )}
        
        {/* Add to cart button */}
        <Button
          size="sm"
          className="w-full h-7 text-xs bg-red-500 hover:bg-red-600"
          onClick={() => onAddToCart(product.id)}
        >
          <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

const ListProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleFavorite,
  variants
}: { 
  product: Product, 
  onAddToCart: (id: number) => void,
  onToggleFavorite: (id: number) => void,
  variants: any
}) => {
  return (
    <motion.div 
      variants={variants}
      className="flex bg-white rounded-md overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="w-24 h-24 relative shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Discount badge */}
        {product.originalPrice && (
          <div className="absolute top-1 left-1 bg-red-500 text-white text-[8px] px-1 py-0 rounded">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="flex-1 p-2 relative">
        {/* Product name */}
        <h3 className="text-xs leading-tight line-clamp-2 mb-1 pr-6">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline mb-1">
          <span className="text-red-500 text-sm font-medium mr-1">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center text-[10px] text-gray-500 mb-1">
          <div className="flex">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i} 
                className="h-2.5 w-2.5 mr-0.5" 
                fill={i < product.rating ? "#FFB800" : "none"}
                color={i < product.rating ? "#FFB800" : "#E5E7EB"}
              />
            ))}
          </div>
          <span className="ml-1">{product.rating.toFixed(1)}</span>
          <span className="mx-1">|</span>
          <span>{product.reviews} reviews</span>
        </div>
        
        {/* Free shipping */}
        <div className="flex items-center flex-wrap gap-1">
          {product.freeShipping && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 border-green-500 text-green-600">
              Free Shipping
            </Badge>
          )}
          
          {product.tags && product.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-[8px] py-0 px-1 bg-gray-100">
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 p-0"
          onClick={() => onToggleFavorite(product.id)}
        >
          <Heart 
            className="h-3.5 w-3.5" 
            fill={product.isFavorited ? "#f43f5e" : "none"} 
            color={product.isFavorited ? "#f43f5e" : "currentColor"}
          />
        </Button>
        
        {/* Add to cart button */}
        <Button
          size="sm"
          className="absolute bottom-2 right-2 h-6 text-[10px] py-0 px-2 bg-red-500 hover:bg-red-600"
          onClick={() => onAddToCart(product.id)}
        >
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default SearchResults;
