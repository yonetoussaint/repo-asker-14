
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ShopsSkeleton = () => {
  return (
    <div className="pt-[44px] pb-16">
      {/* Categories */}
      <div className="p-3 bg-white">
        <div className="flex gap-2 overflow-x-auto py-1">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>
      </div>
      
      {/* Shop Cards */}
      <div className="max-w-md mx-auto mt-2">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white mb-3 rounded-lg shadow">
            {/* Shop Banner */}
            <div className="relative">
              <Skeleton className="w-full h-28 rounded-t-lg" />
              <div className="absolute bottom-0 left-0 w-full p-2">
                <div className="flex items-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="ml-2">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shop Tags */}
            <div className="px-3 pt-2 flex gap-1 flex-wrap">
              {Array(3).fill(0).map((_, j) => (
                <Skeleton key={j} className="h-5 w-16 rounded-full" />
              ))}
            </div>
            
            {/* Featured Products */}
            <div className="grid grid-cols-3 gap-1 p-3">
              {Array(3).fill(0).map((_, j) => (
                <Skeleton key={j} className="w-full aspect-square rounded-md" />
              ))}
            </div>
            
            {/* Shop Actions */}
            <div className="flex justify-between items-center px-3 py-2.5 border-t border-gray-100">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopsSkeleton;
