
import React from 'react';
import { Search, Clock, Trash2, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SearchSuggestionsProps {
  query: string;
  onSelectSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

const SearchSuggestions = ({ query, onSelectSuggestion, onClose }: SearchSuggestionsProps) => {
  // Mock data
  const recentSearches = ['wireless earbuds', 'smartphone case', 'smart watch'];
  
  const popularSearches = [
    'phone charger', 'laptop sleeve', 'bluetooth speaker',
    'wireless mouse', 'keyboard', 'screen protector'
  ];
  
  const relatedProducts = [
    {
      name: 'Wireless Earbuds with Noise Cancellation',
      image: 'https://picsum.photos/100/100?random=1',
      price: 29.99,
      originalPrice: 49.99,
    },
    {
      name: 'Bluetooth Speaker Waterproof',
      image: 'https://picsum.photos/100/100?random=2',
      price: 19.99,
    },
  ];
  
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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Suggestions</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Autocomplete suggestions based on current query */}
      {query && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-4 space-y-2"
        >
          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
            onClick={() => onSelectSuggestion(query)}
          >
            <Search className="h-4 w-4 text-gray-500" />
            <span className="text-sm flex-1">{query}</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
            onClick={() => onSelectSuggestion(`${query} wireless`)}
          >
            <Search className="h-4 w-4 text-gray-500" />
            <span className="text-sm flex-1">{query} wireless</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
            onClick={() => onSelectSuggestion(`${query} bluetooth`)}
          >
            <Search className="h-4 w-4 text-gray-500" />
            <span className="text-sm flex-1">{query} bluetooth</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-gray-400" />
          </motion.div>
        </motion.div>
      )}
      
      {/* Recent searches */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Recent Searches
          </h4>
          <Button variant="ghost" size="sm" className="h-6 text-xs text-gray-500 p-0">
            <Trash2 className="h-3 w-3 mr-1" /> Clear
          </Button>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-2"
        >
          {recentSearches.map((search, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-gray-50 text-sm"
                onClick={() => onSelectSuggestion(search)}
              >
                {search}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Popular searches */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-500 mb-2">Popular Searches</h4>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-2"
        >
          {popularSearches.map((search, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
              onClick={() => onSelectSuggestion(search)}
            >
              <Search className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs">{search}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Product suggestions */}
      <div>
        <h4 className="text-xs text-gray-500 mb-2">Popular Products</h4>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {relatedProducts.map((product, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="flex space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
              onClick={() => onSelectSuggestion(product.name)}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="text-xs line-clamp-2">{product.name}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm text-red-500 font-medium">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
