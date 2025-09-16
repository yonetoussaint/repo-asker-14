import React from 'react';
import { ChevronLeft, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';

interface CommentHeaderProps {
  onClose: () => void;
  productName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
  showFilters: boolean;
  totalComments: number;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({
  onClose,
  productName,
  searchQuery,
  onSearchChange,
  onFilterToggle,
  showFilters,
  totalComments
}) => {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-muted/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Comments</h2>
            <p className="text-sm text-muted-foreground">
              {totalComments} comments • {productName}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFilterToggle}
          className={`p-2 transition-colors ${showFilters ? 'bg-muted' : 'hover:bg-muted/50'}`}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Search Bar */}
      <motion.div 
        className="px-4 pb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted/30 border-0 h-10 focus:bg-background transition-colors"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CommentHeader;