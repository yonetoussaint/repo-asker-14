
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TrendingSkeleton = () => {
  return (
    <div className="pt-[44px] pb-16">
      {/* Trending Stats Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-36 bg-white/30" />
            <Skeleton className="h-4 w-48 mt-1 bg-white/30" />
          </div>
          <div className="text-right">
            <Skeleton className="h-6 w-16 ml-auto bg-white/30" />
            <Skeleton className="h-4 w-24 mt-1 ml-auto bg-white/30" />
          </div>
        </div>
      </div>
      
      {/* Trending Categories */}
      <div className="p-3 bg-white mt-2">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      </div>
      
      {/* Trending Products */}
      <div className="p-3 bg-white mt-2">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex rounded-lg overflow-hidden">
              <Skeleton className="w-24 h-24" />
              <div className="flex-1 p-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSkeleton;
