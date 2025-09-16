import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ForYouSkeleton = () => {
  const [offset, setOffset] = useState<number>(0);

  // Dynamically measure header height
  useEffect(() => {
    function updateOffset() {
      const header = document.getElementById("ali-header");
      setOffset(header ? header.offsetHeight : 0);
    }
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  return (
    <div className="pb-16 min-h-screen">
      {/* Hero Banner Skeleton - matches BannerSlides.tsx h-[60vh] */}
      <div 
        className="relative w-full overflow-hidden"
        style={{ marginTop: offset }}
      >
        <div className="relative w-full bg-gray-200 animate-pulse h-[60vh] mb-1">
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-24 h-6" />
          </div>
          {/* Banner controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="w-2 h-2 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section Skeleton */}
      <div className="bg-white py-3 mb-1">
        <div className="flex overflow-x-auto gap-3 pl-2 scrollbar-hide">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center w-16 flex-shrink-0">
              <Skeleton className="w-14 h-14 rounded-lg mb-1" />
              <Skeleton className="w-12 h-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Feed Content Skeleton */}
      <div className="space-y-2">
        
        {/* Flash Deals Section */}
        <div className="bg-white">
          {/* Section Header */}
          <div className="px-2 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-24 h-4" />
              </div>
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
          {/* Products */}
          <div className="flex overflow-x-auto pl-2 pb-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="w-[calc(100%/3.5)] flex-shrink-0 mr-2">
                <Skeleton className="w-full aspect-square mb-1.5 rounded-md" />
                <Skeleton className="h-3 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Reels Section */}
        <div className="bg-white">
          {/* Section Header */}
          <div className="px-2 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
          {/* Reels Grid */}
          <div className="flex overflow-x-auto pl-2 pb-3">
            {Array(6).fill(0).map((_, i) => (
              <div 
                key={i}
                className="flex-shrink-0 mr-[3vw] rounded-lg overflow-hidden"
                style={{ 
                  width: '35vw', 
                  maxWidth: '160px',
                  height: '49vw', 
                  maxHeight: '220px'
                }}
              >
                <Skeleton className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendors Section */}
        <div className="bg-white">
          {/* Section Header */}
          <div className="px-2 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-24 h-4" />
              </div>
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
          {/* Vendor Cards */}
          <div className="flex overflow-x-auto pl-2 pb-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-2/3 mr-[3vw] bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-start p-2">
                  <div className="relative w-16 h-16">
                    <Skeleton className="w-12 h-12 rounded-md" />
                    <Skeleton className="absolute -bottom-2 left-0 w-8 h-4 rounded-full" />
                  </div>
                  <div className="flex-1 pl-3">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
                <div className="px-2 pt-1 pb-2">
                  <div className="grid grid-cols-4 gap-1">
                    {Array(4).fill(0).map((_, j) => (
                      <Skeleton key={j} className="aspect-square rounded-md" />
                    ))}
                  </div>
                </div>
                <div className="px-2 pb-2 pt-1 grid grid-cols-2 gap-2">
                  <Skeleton className="h-7 rounded-full" />
                  <Skeleton className="h-7 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Arrivals Section */}
        <div className="bg-white">
          <div className="px-2 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-24 h-4" />
              </div>
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
          <div className="flex overflow-x-auto pl-2 pb-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="w-[calc(100%/2.5)] flex-shrink-0 mr-3 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                <Skeleton className="w-full aspect-square" />
                <div className="p-3">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Super Deals Section */}
        <div className="bg-white">
          <div className="px-2 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-24 h-4" />
              </div>
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
          <div className="flex overflow-x-auto pl-2 pb-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="min-w-[140px] flex-shrink-0 mr-3 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                <Skeleton className="w-full h-32" />
                <div className="p-2">
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Mixed Sections */}
        {Array(5).fill(0).map((_, sectionIndex) => (
          <div key={sectionIndex} className="bg-white">
            <div className="px-2 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="w-28 h-4" />
                </div>
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
            
            {sectionIndex % 3 === 0 ? (
              // Product grid layout
              <div className="grid grid-cols-2 gap-3 p-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <Skeleton className="w-full aspect-square" />
                    <div className="p-2">
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-2/3 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sectionIndex % 3 === 1 ? (
              // Horizontal scroll layout
              <div className="flex overflow-x-auto pl-2 pb-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="min-w-[140px] flex-shrink-0 mr-3 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <Skeleton className="w-full h-24" />
                    <div className="p-2">
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Banner/info layout
              <div className="p-3">
                <Skeleton className="w-full h-20 rounded-lg mb-3" />
                <div className="flex gap-3">
                  <Skeleton className="flex-1 h-12 rounded-lg" />
                  <Skeleton className="flex-1 h-12 rounded-lg" />
                </div>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
};

export default ForYouSkeleton;