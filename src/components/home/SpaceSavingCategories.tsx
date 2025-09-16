import React, { useRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { 
  Sparkles, 
  TrendingUp, 
  Percent, 
  Flame, 
  Star, 
  Tag, 
  DollarSign, 
  Gift, 
  Leaf, 
  Crown 
} from 'lucide-react';
import SectionHeader from "./SectionHeader";

interface SpaceSavingCategoriesProps {
  onCategorySelect?: (category: string) => void;
  // Optional SectionHeader props
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  headerIcon?: LucideIcon;
  headerViewAllLink?: string;
  headerViewAllText?: string;
  headerTitleTransform?: "uppercase" | "capitalize" | "none";
}

// Category shortcut component - Updated to use icons
const CategoryShortcut = ({ category, onCategorySelect }) => {
  const IconComponent = category.icon;
  
  return (
    <div 
      className="flex flex-col items-start w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => onCategorySelect?.(category.name)}
    >
      <div className={`relative w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center`}>
        <IconComponent className="w-7 h-7 text-gray-700" />
      </div>
      <span className="text-xs font-normal text-gray-800 text-left truncate w-full leading-tight mt-2">
        {category.name}
      </span>
    </div>
  );
};

const SpaceSavingCategories: React.FC<SpaceSavingCategoriesProps> = ({ 
  onCategorySelect,
  showHeader = false,
  headerTitle,
  headerSubtitle,
  headerIcon,
  headerViewAllLink,
  headerViewAllText,
  headerTitleTransform = "uppercase"
}) => {
  const rowRef = useRef(null);

  // Top 10 product categories data
  const categories = [
  { 
    id: 'new-arrivals', 
    name: 'New Arrivals', 
    icon: Sparkles,
    bgColor: 'bg-blue-100', 
    iconBg: 'bg-blue-400', 
    labelBg: 'bg-blue-500/90',
    isSpecial: true
  },
  { 
    id: 'bestsellers', 
    name: 'Bestsellers', 
    icon: TrendingUp,
    bgColor: 'bg-red-100', 
    iconBg: 'bg-red-500', 
    labelBg: 'bg-red-600/90',
    isSpecial: true
  },
  { 
    id: 'deals', 
    name: 'Today\'s Deals', 
    icon: Percent,
    bgColor: 'bg-orange-100', 
    iconBg: 'bg-orange-500', 
    labelBg: 'bg-orange-600/90',
    isSpecial: true
  },
  { 
    id: 'trending', 
    name: 'Trending Now', 
    icon: Flame,
    bgColor: 'bg-purple-100', 
    iconBg: 'bg-purple-500', 
    labelBg: 'bg-purple-600/90',
    isSpecial: true
  },
  { 
    id: 'staff-picks', 
    name: 'Staff Picks', 
    icon: Star,
    bgColor: 'bg-teal-100', 
    iconBg: 'bg-teal-500', 
    labelBg: 'bg-teal-600/90',
    isSpecial: true
  },
  { 
    id: 'clearance', 
    name: 'Clearance', 
    icon: Tag,
    bgColor: 'bg-yellow-100', 
    iconBg: 'bg-yellow-500', 
    labelBg: 'bg-yellow-600/90',
    isSpecial: true
  },
  { 
    id: 'under-25', 
    name: 'Under $25', 
    icon: DollarSign,
    bgColor: 'bg-green-100', 
    iconBg: 'bg-green-500', 
    labelBg: 'bg-green-600/90',
    isSpecial: true
  },
  { 
    id: 'gift-ideas', 
    name: 'Gift Ideas', 
    icon: Gift,
    bgColor: 'bg-pink-100', 
    iconBg: 'bg-pink-400', 
    labelBg: 'bg-pink-500/90',
    isSpecial: true
  },
  { 
    id: 'seasonal', 
    name: 'Seasonal Picks', 
    icon: Leaf,
    bgColor: 'bg-rose-100', 
    iconBg: 'bg-rose-500', 
    labelBg: 'bg-rose-600/90',
    isSpecial: true
  },
  { 
    id: 'premium', 
    name: 'Premium Selection', 
    icon: Crown,
    bgColor: 'bg-amber-100', 
    iconBg: 'bg-amber-500', 
    labelBg: 'bg-amber-600/90',
    isSpecial: true
  }
];

  return (
    <div className="w-full bg-white">
      {showHeader && headerTitle && (
        <SectionHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          icon={headerIcon}
          viewAllLink={headerViewAllLink}
          viewAllText={headerViewAllText}
          titleTransform={headerTitleTransform}
        />
      )}
      <div className="py-3 bg-white">
        <div 
          ref={rowRef}
          className="flex overflow-x-auto pl-2 scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '8px'
          }}
        >
          {categories.map(category => (
            <div 
              key={category.id}
              className="flex-shrink-0 mr-[3vw]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <CategoryShortcut category={category} onCategorySelect={onCategorySelect} />
            </div>
          ))}

          {/* Add right spacing for proper scrolling to the end */}
          <div className="flex-shrink-0 w-2"></div>
        </div>
      </div>
    </div>
  );
};

export default SpaceSavingCategories;