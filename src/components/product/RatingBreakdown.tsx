
import React from 'react';
import { Star, User, ThumbsUp, Award } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

interface RatingBreakdownItemProps {
  stars: number;
  percentage: number;
  count: number;
}

interface RatingBreakdownProps {
  breakdown: RatingBreakdownItemProps[];
  totalReviews: number;
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ 
  breakdown, 
  totalReviews 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-200 animate-in fade-in-50 duration-300">
      {/* Rating breakdown header */}
      <div className="flex justify-between items-center mb-1.5 sm:mb-2">
        <h4 className="text-xs sm:text-sm font-medium">Rating Breakdown</h4>
      </div>
      
      {/* Star ratings distribution */}
      <div className="space-y-1 sm:space-y-1.5">
        {breakdown.map((item) => (
          <div key={item.stars} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <div className="flex items-center w-9 sm:w-12">
              <span className="mr-0.5 sm:mr-1">{item.stars}</span>
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-400 fill-yellow-400" />
            </div>
            <Progress value={item.percentage} className="h-1.5 sm:h-2 w-full max-w-[120px] sm:max-w-[180px]" />
            <span className="text-[10px] sm:text-xs text-gray-500 w-8 sm:w-10">{item.percentage}%</span>
            <span className="text-[10px] sm:text-xs text-gray-500">({item.count})</span>
          </div>
        ))}
      </div>
      
      {/* Reviews stats */}
      <div className="flex flex-wrap justify-between items-center gap-y-1 mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-600">
        <div className="flex items-center">
          <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
          <span>{Math.round(totalReviews * 0.22)} verified purchases</span>
        </div>
        <div className="flex items-center">
          <ThumbsUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
          <span>94% recommend this product</span>
        </div>
        <div className="flex items-center">
          <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
          <span>Top 5% in category</span>
        </div>
      </div>
    </div>
  );
};

export default RatingBreakdown;
