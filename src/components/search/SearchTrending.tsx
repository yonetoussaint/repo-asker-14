import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrendingItem {
  term: string;
  growth: string;
  isHot?: boolean;
}

interface SearchTrendingProps {
  onTrendingSelect: (search: string) => void;
}

const SearchTrending: React.FC<SearchTrendingProps> = ({ onTrendingSelect }) => {
  const trendingSearches: TrendingItem[] = [
    { term: 'Black Friday deals', growth: '+250%', isHot: true },
    { term: 'Winter jackets', growth: '+180%', isHot: true },
    { term: 'Christmas gifts', growth: '+120%' },
    { term: 'Gaming chairs', growth: '+95%' },
    { term: 'Fitness trackers', growth: '+75%' },
    { term: 'Phone cases', growth: '+60%' },
    { term: 'Laptop bags', growth: '+45%' },
    { term: 'Wireless chargers', growth: '+30%' },
  ];

  return (
    <div className="mb-6">
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800"
      >
        <TrendingUp className="h-5 w-5 text-red-500" />
        Trending Now
      </motion.h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {trendingSearches.map((item, index) => (
          <motion.div
            key={item.term}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden px-4 py-3 bg-white rounded-2xl cursor-pointer transition-all duration-200 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 active:shadow-sm ${
              item.isHot ? 'ring-2 ring-red-100 bg-gradient-to-r from-red-50 to-white' : ''
            }`}
            onClick={() => onTrendingSelect(item.term)}
          >
            {item.isHot && (
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                HOT
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 mb-1">{item.term}</div>
                <div className="flex items-center gap-1 text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span className="text-xs font-medium">{item.growth}</span>
                </div>
              </div>
              
              <div className="ml-3 opacity-60">
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchTrending;