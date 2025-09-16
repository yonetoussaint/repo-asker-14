
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReelsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black border-b border-zinc-800">
        <div className="h-[44px] flex items-center justify-between px-4">
          <Skeleton className="h-6 w-24 bg-zinc-800" />
          <div className="flex space-x-4">
            <Skeleton className="h-6 w-6 rounded-full bg-zinc-800" />
            <Skeleton className="h-6 w-6 rounded-full bg-zinc-800" />
          </div>
        </div>
      </div>
      
      <div className="pt-[44px]">
        {/* Categories skeleton */}
        <div className="bg-black sticky top-[44px] z-10 border-b border-gray-800">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-3">
            <Skeleton className="h-8 w-20 rounded-full bg-zinc-800" />
            <Skeleton className="h-8 w-24 rounded-full bg-zinc-800" />
            <Skeleton className="h-8 w-16 rounded-full bg-zinc-800" />
            <Skeleton className="h-8 w-20 rounded-full bg-zinc-800" />
          </div>
        </div>
        
        {/* Reel skeleton - full height */}
        <div className="w-full h-[calc(100vh-104px)] bg-zinc-900 relative">
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent h-16" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent h-64">
            {/* User info skeleton */}
            <div className="absolute bottom-20 left-4 right-16">
              <div className="flex items-center mb-3">
                <Skeleton className="w-9 h-9 rounded-full bg-zinc-800" />
                <Skeleton className="ml-2 w-24 h-4 bg-zinc-800" />
                <Skeleton className="ml-2 w-16 h-6 rounded-full bg-zinc-800" />
              </div>
              
              <Skeleton className="w-full h-4 bg-zinc-800 mb-2" />
              <Skeleton className="w-3/4 h-4 bg-zinc-800 mb-4" />
              
              {/* Product skeleton */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center">
                <Skeleton className="w-12 h-12 rounded-md bg-zinc-800" />
                <div className="ml-3 flex-1">
                  <Skeleton className="w-20 h-3 bg-zinc-800 mb-2" />
                  <Skeleton className="w-12 h-4 bg-zinc-800" />
                </div>
                <Skeleton className="w-14 h-8 rounded-full bg-zinc-800" />
              </div>
            </div>
            
            {/* Action buttons skeleton */}
            <div className="absolute bottom-24 right-2 flex flex-col items-center space-y-6">
              <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
              <div className="flex flex-col items-center">
                <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
                <Skeleton className="mt-1 w-8 h-2 bg-zinc-800" />
              </div>
              <div className="flex flex-col items-center">
                <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
                <Skeleton className="mt-1 w-8 h-2 bg-zinc-800" />
              </div>
              <div className="flex flex-col items-center">
                <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
                <Skeleton className="mt-1 w-8 h-2 bg-zinc-800" />
              </div>
            </div>
          </div>
          
          {/* Loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-red-500 animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
