
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const VideosSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black pt-[44px] pb-16">
      {/* Categories */}
      <div className="bg-black sticky top-[44px] z-10 border-b border-gray-800">
        <div className="flex gap-2 overflow-x-auto py-2 px-3">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full bg-gray-700" />
          ))}
        </div>
      </div>
      
      {/* Video Feed */}
      <div className="space-y-0.5">
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="bg-black text-white relative">
            {/* Video Thumbnail */}
            <div className="relative w-full aspect-[9/16]">
              <Skeleton className="w-full h-full bg-gray-800" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                {/* User Info */}
                <div className="flex items-center">
                  <Skeleton className="w-8 h-8 rounded-full bg-gray-700" />
                  <div className="ml-2">
                    <Skeleton className="h-4 w-24 bg-gray-700" />
                    <Skeleton className="h-3 w-16 mt-1 bg-gray-700" />
                  </div>
                </div>
                
                {/* Video Title */}
                <Skeleton className="h-4 w-full mt-2 bg-gray-700" />
                
                {/* Views */}
                <Skeleton className="h-3 w-16 mt-1 bg-gray-700" />
              </div>
            </div>
            
            {/* Video Actions */}
            <div className="flex justify-between items-center p-3 border-b border-gray-800">
              <div className="flex space-x-4">
                <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
              </div>
            </div>
            
            {/* Related Products */}
            <div className="p-3 bg-gray-900">
              <Skeleton className="h-4 w-48 mb-2 bg-gray-800" />
              <div className="flex gap-2 overflow-x-auto pb-1">
                {Array(3).fill(0).map((_, j) => (
                  <div key={j} className="flex flex-col w-32 flex-shrink-0">
                    <Skeleton className="w-full aspect-square bg-gray-800 rounded" />
                    <Skeleton className="h-3 w-full mt-1 bg-gray-800" />
                    <Skeleton className="h-3 w-2/3 mt-1 bg-gray-800" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosSkeleton;
