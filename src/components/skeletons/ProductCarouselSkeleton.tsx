
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCarouselSkeletonProps {
  title?: string;
  count?: number;
}

const ProductCarouselSkeleton = ({ 
  title = "Loading...", 
  count = 6 
}: ProductCarouselSkeletonProps) => {
  return (
    <div className="w-full py-6">
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-16" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(count).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-md overflow-hidden border border-gray-100">
              <Skeleton className="w-full aspect-square" />
              <div className="p-2">
                <Skeleton className="h-4 w-full mb-1.5" />
                <Skeleton className="h-4 w-2/3 mb-1.5" />
                <div className="flex justify-between items-center mt-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarouselSkeleton;
