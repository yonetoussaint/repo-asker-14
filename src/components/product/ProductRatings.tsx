import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HoverCardWithDuration,
  HoverCardTrigger,
  HoverCardContent
} from "@/components/ui/hover-card";

interface ProductRatingsProps {
  rating: number;
  reviewCount: number;
  soldCount: number;
}

const ProductRatings: React.FC<ProductRatingsProps> = ({
  rating,
  reviewCount,
  soldCount
}) => {
  const formatNumber = (num: number): string => {
    if (!num && num !== 0) return "0"; // Handle undefined/null values
    if (num >= 1000) return `Over ${Math.floor(num / 1000) * 1000} Sold`;
    return num.toString();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-sm">
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(rating))}
            {rating % 1 !== 0 && '☆'}
            {'☆'.repeat(5 - Math.ceil(rating))}
          </div>
          <span className="ml-1 text-black">{rating}</span>
        </div>
        <span className="mx-2 text-gray-300">|</span>
        
        <HoverCardWithDuration openDelay={300} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="link" className="h-5 p-0 text-sm text-gray-500">
              {reviewCount} Reviews
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-56 p-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="text-amber-400 mr-1">★★★★★</div>
                  <span>5 star</span>
                </div>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="text-gray-500">72%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="text-amber-400 mr-1">★★★★☆</div>
                  <span>4 star</span>
                </div>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '18%' }}></div>
                </div>
                <span className="text-gray-500">18%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="text-amber-400 mr-1">★★★☆☆</div>
                  <span>3 star</span>
                </div>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '6%' }}></div>
                </div>
                <span className="text-gray-500">6%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="text-amber-400 mr-1">★★☆☆☆</div>
                  <span>2 star</span>
                </div>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '3%' }}></div>
                </div>
                <span className="text-gray-500">3%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <div className="text-amber-400 mr-1">★☆☆☆☆</div>
                  <span>1 star</span>
                </div>
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '1%' }}></div>
                </div>
                <span className="text-gray-500">1%</span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCardWithDuration>
        
        <span className="mx-2 text-gray-300">|</span>
        
        <HoverCardWithDuration openDelay={300} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="link" className="h-5 p-0 text-sm text-gray-500">
              {formatNumber(soldCount)}+ Sold
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-56 p-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Sales History</span>
                <Badge variant="outline" className="text-[10px] py-0 font-normal">Last 30 days</Badge>
              </div>
              <div className="h-20 w-full bg-slate-50 rounded flex items-end p-1 space-x-[2px]">
                {[12,18,15,22,24,19,17,20,22,27,29,24,20,25,28,30,32,26,24,22,28,33,38,42,45,41,39,35,32,30].map((value, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-blue-200 rounded-sm" 
                      style={{ height: `${Math.min(100, value * 2)}%` }} 
                    />
                ))}
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div>
                  <span className="font-medium text-green-600">+140%</span> vs last month
                </div>
                <div className="text-xs">
                  <span className="font-medium">{soldCount}</span> total sales
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCardWithDuration>
      </div>
    </div>
  );
};

export default ProductRatings;
