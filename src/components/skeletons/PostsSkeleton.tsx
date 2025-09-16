
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PostsSkeleton = () => {
  return (
    <div className="pt-[44px] pb-16">
      <div className="max-w-md mx-auto mt-2">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white mb-3 rounded-lg shadow">
            {/* Post Header */}
            <div className="flex items-center p-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            
            {/* Post Content */}
            <div className="px-3 pb-2">
              <Skeleton className="h-4 w-full" />
            </div>
            
            {/* Post Images */}
            <div className="grid grid-cols-2 gap-1">
              <Skeleton className="w-full h-52" />
              <Skeleton className="w-full h-52" />
            </div>
            
            {/* Post Actions */}
            <div className="flex justify-between items-center px-4 py-2.5 border-t border-gray-100">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsSkeleton;
