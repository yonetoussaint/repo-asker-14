import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts, trackProductView } from '@/integrations/supabase/products';

export default function ProductRecommendations() {
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [loading, setLoading] = useState(false);

  // Fetch all products from the database
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['all-products-recommendations'],
    queryFn: () => fetchAllProducts(),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  // Process products with discount calculations
  const processedProducts = allProducts.map(product => {
    const discountPercentage = product.discount_price 
      ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
      : 0;

    return {
      ...product,
      discountPercentage,
      stock: product.inventory ?? Math.floor(Math.random() * 50) + 1, // Random stock for variety
      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image"
    };
  });

  // Shuffle products for variety and limit to what's actually available
  const shuffledProducts = [...processedProducts].sort(() => Math.random() - 0.5);
  const maxProducts = Math.min(shuffledProducts.length, 30); // Show max 30 products total
  const availableProducts = shuffledProducts.slice(0, maxProducts);

  // Manual load more function - no automatic triggering
  const loadMoreProducts = () => {
    if (loading || visibleProducts >= availableProducts.length) return;
    
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 8, availableProducts.length));
      setLoading(false);
    }, 500);
  };

  const displayedProducts = availableProducts.slice(0, visibleProducts);

  // Don't render if no products available
  if (!isLoading && processedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Recommendations</h3>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-square bg-muted animate-pulse rounded-md"></div>
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
              <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {displayedProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="space-y-2">
              <Link 
                to={`/product/${product.id}`}
                className="block"
                onClick={() => trackProductView(product.id)}
              >
                <div className="relative aspect-square overflow-hidden bg-muted rounded-md border">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Stock indicator */}
                  <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded font-medium">
                    {product.stock} left
                  </div>
                  
                  {/* Discount badge */}
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                      -{product.discountPercentage}%
                    </div>
                  )}

                  {/* Favorite button */}
                  <button 
                    className="absolute bottom-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-background transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Product info */}
                <div className="space-y-1">
                  <h4 className="text-sm font-medium line-clamp-2 text-foreground">
                    {product.name}
                  </h4>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-3 h-3 ${star <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">(4.0)</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-destructive font-semibold text-base">
                      ${Number(product.discount_price || product.price).toFixed(2)}
                    </span>
                    {product.discount_price && (
                      <span className="text-xs text-muted-foreground line-through">
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

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Show more button if not loading */}
      {!loading && visibleProducts < availableProducts.length && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={loadMoreProducts}
            className="bg-muted hover:bg-muted/80 transition-colors px-6 py-2 rounded-full text-foreground font-medium"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}