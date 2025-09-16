import React from 'react';
import { Clock } from 'lucide-react';
import SectionHeader from "./SectionHeader";

interface RecentlyViewedProps {
  onClearClick?: () => void;
  // SectionHeader props matching SpaceSavingCategories pattern
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  headerIcon?: typeof Clock;
  headerViewAllLink?: string;
  headerViewAllText?: string;
  headerTitleTransform?: "uppercase" | "capitalize" | "none";
  showClearButton?: boolean;
  clearButtonText?: string;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  onClearClick,
  showHeader = true,
  headerTitle = "Recently Viewed",
  headerSubtitle,
  headerIcon = Clock,
  headerViewAllLink,
  headerViewAllText = "View All",
  headerTitleTransform = "uppercase",
  showClearButton = true,
  clearButtonText = "× Clear"
}) => {
  // Sample products data to make the component work
  const products = [
    {
      color: 'bg-blue-200',
      price: '12.99'
    },
    {
      color: 'bg-green-200',
      price: '8.50'
    },
    {
      color: 'bg-purple-200',
      price: '22.00'
    },
    {
      color: 'bg-yellow-200',
      price: '6.75'
    },
    {
      color: 'bg-pink-200',
      price: '18.99'
    },
    {
      color: 'bg-indigo-200',
      price: '14.25'
    },
    {
      color: 'bg-red-200',
      price: '9.99'
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
          showClearButton={showClearButton}
          clearButtonText={clearButtonText}
          onClearClick={onClearClick}
        />
      )}
      
      <div className="py-3 bg-white">
        <div className="flex overflow-x-auto pl-2 scrollbar-hide">
          {products.map((product, index) => (
            <div key={index} className="flex-shrink-0 w-20 pb-1 mr-[3vw]">
              <div className="relative">
                <div className={`${product.color} h-20 w-20 rounded flex items-center justify-center`}>
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <span className="font-medium text-xs text-orange-600">${product.price}</span>
              </div>
            </div>
          ))}

          {/* Add right spacing for proper scrolling to the end */}
          <div className="flex-shrink-0 w-2"></div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;