import React, { useState } from "react";
import { Heart, MessageCircle, Search, ChevronRight, Share, CheckCircle } from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import BackButton from "./header/BackButton";
import HeaderActionButton from "./header/HeaderActionButton";
import { useNavigate } from 'react-router-dom';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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

const SellerHeader: React.FC<SellerHeaderProps> = ({ 
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
}) => {
  const { progress: internalProgress } = useScrollProgress();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { isLoading, startLoading } = useNavigationLoading();

  // Use custom progress if provided, otherwise use internal progress
  const progress = customScrollProgress !== undefined ? customScrollProgress : internalProgress;
  
  // Use forced state or actual scroll progress
  const displayProgress = forceScrolledState ? 1 : progress;

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
              <div className="flex items-center gap-2">
                <img
                  src={seller.profile_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                  alt={seller.name}
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-32">
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

          {/* Center - Search bar when scrolled */}
          <div className="flex-1 mx-4">
            {displayProgress >= 0.5 && (
              <div className="flex-1 relative max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search seller products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => {
                    startLoading();
                    navigate(`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
                  }}
                  className="w-full px-3 py-1 text-sm font-medium border-2 border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white shadow-sm cursor-pointer"
                  readOnly
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 font-bold" />
              </div>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {actionButtons ? (
              actionButtons.map((button, index) => (
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
              ))
            ) : (
              <>
                <HeaderActionButton 
                  Icon={Heart} 
                  active={isFollowing} 
                  onClick={onFollow} 
                  progress={displayProgress} 
                  activeColor="#f43f5e"
                />
                <HeaderActionButton 
                  Icon={Share} 
                  progress={displayProgress}
                  onClick={onShare}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerHeader;