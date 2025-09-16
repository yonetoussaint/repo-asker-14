
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface SearchSkeletonProps {
  viewMode: 'grid' | 'list';
}

const SearchSkeleton = ({ viewMode }: SearchSkeletonProps) => {
  // Animation variants for shimmer effect
  const shimmer = {
    hidden: { backgroundPosition: '-468px 0' },
    animate: { 
      backgroundPosition: ['468px 0', '-468px 0'], 
      transition: { 
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear' as const
      }
    }
  };

  // Generate skeleton array
  const skeletonCount = viewMode === 'grid' ? 8 : 5;
  
  return (
    <div className={viewMode === 'grid' 
      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' 
      : 'space-y-4'
    }>
      {Array(skeletonCount).fill(0).map((_, index) => (
        viewMode === 'grid' ? (
          <div key={index} className="bg-white rounded-md overflow-hidden border border-gray-100">
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="animate"
              className="w-full aspect-square bg-gradient-to-r from-transparent via-gray-200 to-transparent bg-[length:468px_100%]"
            />
            <div className="p-2">
              <Skeleton className="h-4 w-full mb-1.5" />
              <Skeleton className="h-4 w-2/3 mb-1.5" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-6 w-full mt-2" />
            </div>
          </div>
        ) : (
          <div key={index} className="flex bg-white rounded-md overflow-hidden border border-gray-100">
            <motion.div
              variants={shimmer}
              initial="hidden"
              animate="animate"
              className="w-24 h-24 bg-gradient-to-r from-transparent via-gray-200 to-transparent bg-[length:468px_100%]"
            />
            <div className="flex-1 p-3">
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default SearchSkeleton;
