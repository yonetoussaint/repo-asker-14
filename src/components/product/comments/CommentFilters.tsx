import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Star, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type FilterType = 'all' | 'photos' | 'high-rated' | 'recent' | 'helpful';
export type SortType = 'newest' | 'oldest' | 'rating' | 'helpful';

interface CommentFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  counts: {
    all: number;
    photos: number;
    highRated: number;
    recent: number;
    helpful: number;
  };
  show: boolean;
}

const CommentFilters: React.FC<CommentFiltersProps> = ({
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  counts,
  show
}) => {
  const filters = [
    { id: 'all' as FilterType, label: 'All', count: counts.all, icon: null },
    { id: 'photos' as FilterType, label: 'Photos', count: counts.photos, icon: Camera },
    { id: 'high-rated' as FilterType, label: '5★', count: counts.highRated, icon: Star },
    { id: 'helpful' as FilterType, label: 'Helpful', count: counts.helpful, icon: TrendingUp }
  ];

  const sortOptions = [
    { id: 'newest' as SortType, label: 'Newest' },
    { id: 'helpful' as SortType, label: 'Most Helpful' },
    { id: 'rating' as SortType, label: 'Highest Rated' },
    { id: 'oldest' as SortType, label: 'Oldest' }
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-b border-border bg-muted/20"
        >
          <div className="px-4 py-3 space-y-3">
            {/* Filter Tabs */}
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange(filter.id)}
                    className="flex-shrink-0 h-8 text-xs gap-1.5"
                  >
                    {Icon && <Icon className="h-3 w-3" />}
                    {filter.label}
                    <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-xs">
                      {filter.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Sort by:</span>
              {sortOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={sortBy === option.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onSortChange(option.id)}
                  className="flex-shrink-0 h-7 text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentFilters;