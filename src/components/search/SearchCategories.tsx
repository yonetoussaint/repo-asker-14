import React from 'react';
import { motion } from 'framer-motion';

interface Category {
  name: string;
  emoji: string;
  color: string;
  count?: number;
}

interface SearchCategoriesProps {
  onCategorySelect: (category: string) => void;
}

const SearchCategories: React.FC<SearchCategoriesProps> = ({ onCategorySelect }) => {
  const categories: Category[] = [
    { name: 'Electronics', emoji: '📱', color: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700', count: 12500 },
    { name: 'Fashion', emoji: '👕', color: 'bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700', count: 8900 },
    { name: 'Home', emoji: '🏠', color: 'bg-gradient-to-br from-green-50 to-green-100 text-green-700', count: 6700 },
    { name: 'Sports', emoji: '⚽', color: 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700', count: 4300 },
    { name: 'Beauty', emoji: '💄', color: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700', count: 5600 },
    { name: 'Books', emoji: '📚', color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-700', count: 3400 },
    { name: 'Games', emoji: '🎮', color: 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700', count: 2800 },
    { name: 'Auto', emoji: '🚗', color: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700', count: 1900 },
    { name: 'Health', emoji: '💊', color: 'bg-gradient-to-br from-teal-50 to-teal-100 text-teal-700', count: 2200 },
  ];

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="mb-6">
      <motion.h3 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-lg font-semibold mb-4 text-gray-800"
      >
        Shop by Category
      </motion.h3>
      
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${category.color} rounded-2xl p-4 cursor-pointer hover:shadow-lg active:shadow-md transition-all duration-200 border border-white/50`}
            onClick={() => onCategorySelect(category.name)}
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-2">{category.emoji}</div>
              <div className="text-sm sm:text-base font-semibold mb-1">{category.name}</div>
              {category.count && (
                <div className="text-xs opacity-70">{formatCount(category.count)} items</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchCategories;