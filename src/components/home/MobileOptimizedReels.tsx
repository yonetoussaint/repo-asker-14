
import React, { useRef } from 'react';
import { Store, Users, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import { useVideos } from '@/hooks/useVideos';

const MobileOptimizedReels = () => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const { data: videos, isLoading } = useVideos(6);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVideoClick = (videoId: string) => {
    navigate(`/reels?video=${videoId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden">
        <SectionHeader
          title="SHORTS"
          icon={Zap}
          viewAllLink="/reels"
          viewAllText="View All"
        />
        <div className="flex overflow-x-auto pl-2 scrollbar-none w-full">
          {Array(6).fill(0).map((_, i) => (
            <div 
              key={i}
              className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-gray-200 relative mr-[3vw] animate-pulse"
              style={{ 
                width: '35vw', 
                maxWidth: '160px',
                height: '49vw', 
                maxHeight: '220px'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const middleElement = (
    <div className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-0.5 rounded-full backdrop-blur-sm">
      <Users className="w-4 h-4 shrink-0" />
      <span className="whitespace-nowrap">2M+ Watching</span>
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      <SectionHeader
        title="SHORTS"
        icon={Zap}
        viewAllLink="/reels"
        viewAllText="View All"
      />

      {/* Edge-to-edge container for scrolling, with left padding pl-2 */}
      <div 
        ref={scrollContainerRef}
        className="reels-container flex overflow-x-auto pl-2 scrollbar-none w-full"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '8px'
        }}
      >
        {videos?.map((video) => (
          <div 
            key={video.id} 
            className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-black relative mr-[3vw] cursor-pointer"
            style={{ 
              width: '35vw', 
              maxWidth: '160px',
              scrollSnapAlign: 'start'
            }}
            onClick={() => handleVideoClick(video.id)}
          >
            {/* Video preview with auto-generated thumbnail */}
            <div className="relative bg-gray-200" style={{ height: '49vw', maxHeight: '220px' }}>
              <video 
                src={video.video_url} 
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />

              {/* Video duration indicator */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(video.duration)}
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                <h3 className="hidden"></h3>
                <div className="flex items-center text-gray-300 text-xs">
                  <span>{formatViews(video.views)} views</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add right spacing for proper scrolling to the end */}
        <div className="flex-shrink-0 w-2"></div>
      </div>
    </div>
  );
};

export default MobileOptimizedReels;