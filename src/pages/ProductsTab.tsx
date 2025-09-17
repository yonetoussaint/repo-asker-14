import React from 'react';
import { Search, Grid3X3, List, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatNumber } from '@/lib/utils';

interface ProductsTabProps {
  products: any[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  navigate: (path: string) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  isLoading,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  navigate
}) => {
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.saves || 0) - (a.saves || 0);
      case 'popularity':
      default:
        return (b.views || 0) - (a.views || 0);
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-muted/20 rounded-lg p-3">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popular</SelectItem>
              <SelectItem value="newest">Latest</SelectItem>
              <SelectItem value="price-low">Price ↑</SelectItem>
              <SelectItem value="price-high">Price ↓</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-9 px-3"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-9 px-3"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{sortedProducts.length} products {searchQuery && `matching "${searchQuery}"`}</span>
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="h-8 px-2 text-xs">
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-2">
            {searchQuery ? 'No matches found' : 'No products yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? `Try different keywords` : 'Check back later for new products'}
          </p>
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" 
            : "space-y-3"
        }>
          {sortedProducts.map((product) => (
            <Card 
              key={product.id} 
              className={`group cursor-pointer hover:shadow-md transition-all duration-200 ${
                viewMode === 'list' ? 'p-3' : 'overflow-hidden'
              }`}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {viewMode === 'grid' ? (
                <div>
                  <div className="aspect-square bg-muted rounded-md flex items-center justify-center mb-3">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="p-3 pt-0 space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">${product.price}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{((product.saves || 0) / 10 + 4).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">${product.price}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{((product.saves || 0) / 10 + 4).toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <span>{formatNumber(product.views || 0)} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsTab;