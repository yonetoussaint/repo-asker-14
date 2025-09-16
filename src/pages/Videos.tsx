
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Heart, MessageSquare, Share, Play, Pause, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import VideosSkeleton from "@/components/skeletons/VideosSkeleton";

export default function Videos() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  const isMobile = useIsMobile();
  const [isReady, setIsReady] = useState(false);
  const [activeVideo, setActiveVideo] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isMobile !== undefined) {
      setIsReady(true);
    }
  }, [isMobile]);

  if (!isReady) {
    return <VideosSkeleton />;
  }
  
  if (isLoading) {
    return <VideosSkeleton />;
  }

  // Mock data for videos
  const videos = [
    {
      id: 1,
      username: "gadget_demos",
      avatar: "https://picsum.photos/id/1039/200",
      timeAgo: "3h",
      title: "Amazing gadget that will change your life! 🔥",
      thumbnail: "https://picsum.photos/id/250/500/600",
      views: "245K",
      likes: "12.5K",
      comments: 352,
      products: [
        {
          id: 101,
          name: "Multi-function Gadget",
          price: "$19.99",
          originalPrice: "$29.99",
          image: "https://picsum.photos/id/180/100"
        }
      ]
    },
    {
      id: 2,
      username: "beauty_hacks",
      avatar: "https://picsum.photos/id/1062/200",
      timeAgo: "6h",
      title: "5 makeup hacks you need to try! 💄",
      thumbnail: "https://picsum.photos/id/260/500/600",
      views: "389K",
      likes: "32.1K",
      comments: 648,
      products: [
        {
          id: 102,
          name: "Pro Makeup Kit",
          price: "$24.99",
          originalPrice: "$49.99",
          image: "https://picsum.photos/id/190/100"
        },
        {
          id: 103,
          name: "Makeup Brush Set",
          price: "$12.99",
          originalPrice: "$19.99",
          image: "https://picsum.photos/id/200/100"
        }
      ]
    },
    {
      id: 3,
      username: "kitchen_gadgets",
      avatar: "https://picsum.photos/id/1074/200",
      timeAgo: "1d",
      title: "Must-have kitchen tools for every home chef! 🍳",
      thumbnail: "https://picsum.photos/id/270/500/600",
      views: "156K",
      likes: "8.7K",
      comments: 231,
      products: [
        {
          id: 104,
          name: "Multi-function Kitchen Tool",
          price: "$15.99",
          originalPrice: "$24.99",
          image: "https://picsum.photos/id/210/100"
        }
      ]
    }
  ];

  const togglePlay = (videoId) => {
    if (activeVideo === videoId) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveVideo(videoId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black overscroll-none overflow-x-hidden">
      <div className="pb-16">
        {/* Categories Scroller */}
        <div className="bg-black sticky top-0 z-10 border-b border-gray-800">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-3">
            <Badge variant="outline" className="whitespace-nowrap px-3 py-1 bg-gray-800 text-white border-gray-700">
              For You
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap px-3 py-1 text-gray-400 border-gray-700">
              Following
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap px-3 py-1 text-gray-400 border-gray-700">
              Technology
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap px-3 py-1 text-gray-400 border-gray-700">
              Beauty
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap px-3 py-1 text-gray-400 border-gray-700">
              Home
            </Badge>
            <Badge variant="outline" className="whitespace-nowrap px-3 py-1 text-gray-400 border-gray-700">
              Fashion
            </Badge>
          </div>
        </div>
        
        {/* Video Feed */}
        <div className="space-y-0.5">
          {videos.map(video => (
            <div key={video.id} className="bg-black text-white relative">
              {/* Video Thumbnail */}
              <div 
                className="relative w-full aspect-[9/16]" 
                onClick={() => togglePlay(video.id)}
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover" 
                />
                
                {/* Play/Pause Button */}
                {activeVideo === video.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-black/40 flex items-center justify-center">
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>
                )}
                
                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  {/* User Info */}
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={video.avatar} alt={video.username} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium">{video.username}</div>
                      <div className="text-xs text-gray-300">{video.timeAgo}</div>
                    </div>
                  </div>
                  
                  {/* Video Title */}
                  <p className="text-sm mt-2">{video.title}</p>
                  
                  {/* Views */}
                  <div className="flex items-center mt-1 text-xs text-gray-300">
                    <Eye className="w-3 h-3 mr-1" />
                    {video.views} views
                  </div>
                </div>
              </div>
              
              {/* Video Actions */}
              <div className="flex justify-between items-center p-3 border-b border-gray-800">
                <div className="flex space-x-4">
                  <button className="flex flex-col items-center">
                    <Heart className="h-5 w-5 text-white" />
                    <span className="text-xs mt-1">{video.likes}</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <MessageSquare className="h-5 w-5 text-white" />
                    <span className="text-xs mt-1">{video.comments}</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <Share className="h-5 w-5 text-white" />
                    <span className="text-xs mt-1">Share</span>
                  </button>
                </div>
              </div>
              
              {/* Related Products */}
              <div className="p-3 bg-gray-900">
                <h3 className="text-xs font-medium mb-2">Products in this video</h3>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {video.products.map(product => (
                    <div key={product.id} className="flex flex-col w-32 flex-shrink-0">
                      <div className="w-full aspect-square bg-gray-800 rounded overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="mt-1">
                        <p className="text-[10px] line-clamp-1">{product.name}</p>
                        <div className="flex items-baseline">
                          <span className="text-xs text-red-500">{product.price}</span>
                          <span className="text-[8px] text-gray-400 line-through ml-1">{product.originalPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extra bottom padding for mobile to account for fixed navigation */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
}