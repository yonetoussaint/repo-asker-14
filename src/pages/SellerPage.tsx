import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeller, useSellerProducts } from '@/hooks/useSeller';
import { 
  Heart, 
  MessageCircle, 
  Star, 
  Package,
  Search,
  Grid3X3,
  List,
  Store,
  MapPin,
  Calendar,
  Users,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SellerPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId!);
  const { data: products = [], isLoading: productsLoading } = useSellerProducts(sellerId!);

  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed" : "Following");
  };

  const handleMessage = () => {
    toast.info("Message feature coming soon");
  };

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
        return (b.rating || 0) - (a.rating || 0);
      case 'popularity':
      default:
        return (b.sales_count || 0) - (a.sales_count || 0);
    }
  });

  const tabs = [
    { id: 'products', label: 'Products', count: products.length },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews', count: seller?.review_count || 0 },
  ];

  if (sellerLoading || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading seller...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Seller Avatar */}
            <div className="flex-shrink-0">
              <img
                src={getSellerLogoUrl(seller.logo_url)}
                alt={seller.store_name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Seller Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {seller.store_name}
                  </h1>
                  <p className="text-gray-600 mb-4 max-w-2xl">
                    {seller.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {seller.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {seller.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Member since {formatDate(seller.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {formatNumber(seller.follower_count || 0)} followers
                    </div>
                    {seller.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {seller.rating.toFixed(1)} rating
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" onClick={handleMessage}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Seller Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {seller.response_rate || 95}%
                  </div>
                  <div className="text-xs text-gray-500">Response Rate</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {seller.response_time || 'Within hours'}
                  </div>
                  <div className="text-xs text-gray-500">Response Time</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatNumber(products.length)}
                  </div>
                  <div className="text-xs text-gray-500">Products</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {seller.rating ? seller.rating.toFixed(1) : 'New'}
                  </div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"}
                        alt={product.name}
                        className={`object-cover ${
                          viewMode === 'list' ? 'w-full h-32' : 'w-full h-48'
                        }`}
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No matching products' : 'No products yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? `No products match "${searchQuery}". Try a different search term.`
                    : 'This seller hasn\'t added any products yet.'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About {seller.store_name}</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                {seller.description || 'No description available.'}
              </p>
              
              {seller.location && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {seller.location}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Member Since</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(seller.created_at)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Response Rate</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {seller.response_rate || 95}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Typical Response Time</h4>
                  <p className="text-lg font-semibold text-gray-700">
                    {seller.response_time || 'Within hours'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg p-6">
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Reviews Coming Soon
              </h3>
              <p className="text-gray-500">
                Customer reviews and ratings will be displayed here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPage;