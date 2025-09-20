import React, { useState } from "react";
import { Heart, MessageCircle, Search, ChevronRight, Share, CheckCircle, ShoppingCart, MoreHorizontal } from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import BackButton from "./header/BackButton";
import HeaderActionButton from "./header/HeaderActionButton";
import { useNavigate } from 'react-router-dom';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import SearchBar from "./header/SearchBar";


interface ActionButton {
  Icon: any;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  count?: number;
}

interface OnlineStatus {
  isOnline: boolean;
  lastSeen?: string;
}

interface SellerHeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  forceScrolledState?: boolean;
  actionButtons?: ActionButton[];
  seller?: any;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
  customScrollProgress?: number;
  onlineStatus?: OnlineStatus;
}

const SellerHeader = React.forwardRef<HTMLDivElement, SellerHeaderProps>(({ 
  activeTab = "products", 
  onTabChange,
  forceScrolledState = false,
  actionButtons,
  seller,
  isFollowing = false,
  onFollow,
  onMessage,
  onShare,
  customScrollProgress,
  onlineStatus
}, ref) => {
  const { progress: internalProgress } = useScrollProgress();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { isLoading, startLoading } = useNavigationLoading();

  // Use custom progress if provided, otherwise use internal progress
  const progress = customScrollProgress !== undefined ? customScrollProgress : internalProgress;

  // Calculate display progress with gradual transition for forced state
  const displayProgress = React.useMemo(() => {
    if (forceScrolledState) {
      // Gradual transition from current progress to 1 over time
      return Math.min(1, Math.max(progress, 0.8)); // Ensure minimum 0.8 progress when forced
    }
    return progress;
  }, [forceScrolledState, progress]);


  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  const getStatusText = () => {
    if (!onlineStatus) return null;

    if (onlineStatus.isOnline) return "Online now";
    if (onlineStatus.lastSeen) {
      const now = new Date();
      const lastSeenDate = new Date(onlineStatus.lastSeen);
      const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
    return "Offline";
  };

  return (
    <div 
      ref={ref}
      id="seller-header"
      className="fixed top-0 left-0 right-0 z-30 flex flex-col transition-all duration-300"
    >
      {/* Main Header */}
      <div 
        className="py-2 px-3 w-full transition-all duration-700"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${displayProgress * 0.95})`,
          backdropFilter: `blur(${displayProgress * 8}px)`,
        }}
      >
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          {/* Left side - Back button and seller info when scrolled */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <BackButton progress={displayProgress} />

            {/* Seller info when scrolled */}
            {displayProgress >= 0.5 && seller && (
              <div 
              className="flex items-center gap-3 transition-all duration-300 ease-out"
              style={{
                opacity: displayProgress,
                transform: `translateX(${(1 - displayProgress) * -20}px)`
              }}
            >
              <div className="relative transition-transform duration-300 ease-out">
                <img
                  src={seller.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                  alt={seller.name}
                  className="w-8 h-8 rounded-full object-cover border"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-gray-900 truncate max-w-32 transition-opacity duration-300 ease-out">
                    {seller.name}
                  </span>
                  {seller.verified && (
                    <CheckCircle className="w-3 h-3 text-blue-500 fill-current" />
                  )}
                </div>
                {onlineStatus && (
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${onlineStatus.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className={`text-xs ${onlineStatus.isOnline ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {getStatusText()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>

          {/* Center - Search icon only in second state */}
          <div className="flex-1 mx-4">
            <div className="flex justify-center">
              <HeaderActionButton
                Icon={Search}
                onClick={() => {
                  startLoading();
                  navigate('/search');
                }}
                progress={displayProgress}
              />
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div 
            className="flex items-center gap-2 transition-all duration-300 ease-out"
            style={{
              opacity: displayProgress,
              transform: `translateX(${(1 - displayProgress) * 20}px)`
            }}
          >
            {actionButtons ? (
              actionButtons.map((button, index) => (
                <div 
                  key={index}
                  className="transition-all duration-300 ease-out"
                  style={{
                    transform: `scale(${0.9 + (displayProgress * 0.1)})`,
                    transitionDelay: `${index * 50}ms`
                  }}
                >
                  <HeaderActionButton 
                    key={index}
                    Icon={button.Icon} 
                    active={button.active} 
                    onClick={button.onClick} 
                    progress={displayProgress} 
                    activeColor={button.activeColor}
                    likeCount={button.count}
                    shareCount={button.count}
                  />
                </div>
              ))
            ) : (
              <>
                <div 
                  className="transition-all duration-300 ease-out"
                  style={{
                    transform: `scale(${0.9 + (displayProgress * 0.1)})`
                  }}
                >
                  <HeaderActionButton 
                    Icon={Heart} 
                    active={isFollowing} 
                    onClick={onFollow} 
                    progress={displayProgress} 
                    activeColor="#f43f5e"
                  />
                </div>
                <div 
                  className="transition-all duration-300 ease-out"
                  style={{
                    transform: `scale(${0.9 + (displayProgress * 0.1)})`
                  }}
                >
                  <HeaderActionButton 
                    Icon={Share} 
                    progress={displayProgress}
                    onClick={onShare}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SellerHeader.displayName = 'SellerHeader';

export default SellerHeader;