import React, { useState } from 'react';
import { Package, Star, Edit, Eye, Download } from 'lucide-react';
import { Product } from '@/integrations/supabase/products';

interface SellerProductsTabProps {
  products: Product[];
  isLoading: boolean;
  onEditProduct: (product: Product) => void;
  onViewProduct: (productId: string) => void;
}

const SellerProductsTab: React.FC<SellerProductsTabProps> = ({
  products,
  isLoading,
  onEditProduct,
  onViewProduct
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Products', count: products.length },
    { 
      id: 'physical', 
      label: 'Physical', 
      count: products.filter(p => !p.product_type || p.product_type === 'single' || p.product_type === 'physical' || p.product_type === 'variable').length 
    },
    { 
      id: 'digital', 
      label: 'Digital', 
      count: products.filter(p => p.product_type === 'digital' || p.tags?.includes('digital')).length 
    },
    { 
      id: 'books', 
      label: 'Books', 
      count: products.filter(p => p.tags?.includes('books') || p.tags?.includes('book') || p.name?.toLowerCase().includes('book')).length 
    }
  ];

  const getFilteredProducts = () => {
    if (activeFilter === 'all') return products;
    
    switch (activeFilter) {
      case 'physical':
        return products.filter(product => 
          !product.product_type || 
          product.product_type === 'single' || 
          product.product_type === 'physical' || 
          product.product_type === 'variable'
        );
      case 'digital':
        return products.filter(product => 
          product.product_type === 'digital' ||
          product.tags?.includes('digital')
        );
      case 'books':
        return products.filter(product => 
          product.tags?.includes('books') || 
          product.tags?.includes('book') ||
          product.name?.toLowerCase().includes('book')
        );
      default:
        return products;
    }
  };

  const getProductImageUrl = (product: Product): string => {
    if (product.product_images && product.product_images.length > 0) {
      return product.product_images[0].src;
    }
    return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="p-4">
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-1 border border-gray-100 mb-4">
        <div className="flex overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeFilter === filter.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeFilter === 'all' ? 'Products' : filters.find(f => f.id === activeFilter)?.label}
          </h3>
          <p className="text-gray-500">
            {activeFilter === 'all' 
              ? 'Start adding products to your store' 
              : 'No products found in this category'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden border border-gray-100 group hover:shadow-md transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                {product.product_type === 'digital' || product.tags?.includes('digital') ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                    <Download className="w-12 h-12 text-blue-500" />
                  </div>
                ) : (
                  <img 
                    src={getProductImageUrl(product)} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                )}
                
                {/* Product badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {(product.product_type === 'digital' || product.tags?.includes('digital')) && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-medium">
                      Digital
                    </span>
                  )}
                  {product.discount_price && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded font-medium">
                      Sale
                    </span>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => onViewProduct(product.id)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-sm mb-2 text-gray-900 line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-primary font-bold text-sm">${product.price}</span>
                    {product.discount_price && (
                      <span className="text-xs text-gray-400 line-through">${product.discount_price}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{product.inventory || 0} sold</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                    <span>4.5</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProductsTab;