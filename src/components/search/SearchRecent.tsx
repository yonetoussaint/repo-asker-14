import React from 'react';
import { Clock, Search, X, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/components/home/SectionHeader';

interface SearchRecentProps {
  searches: string[];
  onSearchSelect: (search: string) => void;
  onRemoveSearch: (search: string) => void;
  onClearAll: () => void;
  // Optional SectionHeader props
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  headerIcon?: LucideIcon;
  headerViewAllLink?: string;
  headerViewAllText?: string;
  headerTitleTransform?: "uppercase" | "capitalize" | "none";
}

const SearchRecent: React.FC<SearchRecentProps> = ({
  searches,
  onSearchSelect,
  onRemoveSearch,
  onClearAll,
  showHeader = true,
  headerTitle = "Recent Searches",
  headerSubtitle,
  headerIcon = Clock,
  headerViewAllLink,
  headerViewAllText,
  headerTitleTransform = "uppercase"
}) => {
  if (searches.length === 0) return null;

  return (
    <div className="w-full bg-background">
      {showHeader && (
        <div className="flex items-center justify-between">
          <SectionHeader
            title={headerTitle}
            subtitle={headerSubtitle}
            icon={headerIcon}
            viewAllLink={headerViewAllLink}
            viewAllText={headerViewAllText}
            titleTransform={headerTitleTransform}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive text-sm hover:bg-destructive/10 transition-colors"
            onClick={onClearAll}
          >
            Clear all
          </Button>
        </div>
      )}
      
      <div className="py-3 bg-background">
        <div className="px-2 space-y-2">
          <AnimatePresence>
            {searches.map((search, index) => (
              <motion.div
                key={search}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors w-full"
                  onClick={() => onSearchSelect(search)}
                >
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground flex-1">{search}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted-foreground/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSearch(search);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SearchRecent;