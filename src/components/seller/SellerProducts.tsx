import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  product_images?: Array<{ src: string }>;
  inventory?: number;
}

interface SellerProductsProps {
  products: Product[];
  isLoading: boolean;
}

const SellerProducts: React.FC<SellerProductsProps> = ({ products, isLoading }) => {
  const navigate = useNavigate();

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Products</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="w-full h-48 bg-muted animate-pulse rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Products</h3>
            <Badge variant="secondary">{products.length} items</Badge>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleViewProduct(product.id)}
                  className="group cursor-pointer space-y-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.product_images?.[0]?.src || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.discount_price && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Sale
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium line-clamp-2 group-hover:text-primary">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {product.discount_price ? (
                        <>
                          <span className="font-bold text-primary">
                            ${product.discount_price}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">${product.price}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                      <span>•</span>
                      <span>{product.inventory || 0} left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <Package className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="font-medium">No products yet</p>
              <p className="text-sm text-muted-foreground">
                This seller hasn't listed any products yet.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerProducts;