import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  showViewAll?: boolean;
  onViewAllClick?: () => void;
  viewAllText?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showViewAll = false,
  onViewAllClick,
  viewAllText = "View all",
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h1 className="text-xl font-semibold text-gray-900">
        {title}
      </h1>
      {showViewAll && (
        <button 
          onClick={onViewAllClick}
          className="flex items-center gap-1 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {viewAllText} <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;