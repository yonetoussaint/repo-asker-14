import React, { useState } from "react";
import { Heart, MessageCircle, Search, ChevronRight } from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import BackButton from "./header/BackButton";
import HeaderActionButton from "./header/HeaderActionButton";
import { useNavigate } from 'react-router-dom';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import { Separator } from "@/components/ui/separator";

interface ActionButton {
  Icon: any;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  count?: number;
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
}

const SellerHeader: React.FC<SellerHeaderProps> = ({ 
  activeTab = "products", 
  onTabChange,
  forceScrolledState = false,
  actionButtons,
  seller,
  isFollowing = false,
  onFollow,
  onMessage
}) => {
  const { progress: internalProgress } = useScrollProgress();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { isLoading, startLoading } = useNavigationLoading();

  // Use forced state or actual scroll progress
  const displayProgress = forceScrolledState ? 1 : internalProgress;

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  return (
    <div className="sticky top-0 left-0 right-0 z-30 flex flex-col bg-white">
      {/* Main Header */}
      <div 
        className="py-2 px-3 w-full transition-all duration-700 border-b"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${displayProgress * 0.95})`,
          backdropFilter: `blur(${displayProgress * 8}px)`,
        }}
      >
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          {/* Left side - Back button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <BackButton progress={displayProgress} />

            {/* Seller info when scrolled */}
            {displayProgress >= 0.7 && seller && (
              <div className="flex items-center gap-2 ml-2">
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <img
                    src={seller.logo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                    alt={seller.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {seller.name}
                  </span>
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
                  placeholder="Search products..."
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
                  Icon={MessageCircle} 
                  progress={displayProgress}
                  onClick={onMessage}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Seller info when not fully scrolled */}
      {displayProgress < 0.7 && seller && (
        <div 
          className="px-3 py-2 w-full border-b bg-white transition-opacity duration-300"
          style={{ opacity: 1 - (displayProgress / 0.7) }}
        >
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <img
                src={seller.logo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                alt={seller.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-sm">{seller.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {seller.followers_count ? `${seller.followers_count} followers` : 'New seller'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onFollow}
                className={`px-3 py-1 text-xs rounded-full border ${
                  isFollowing 
                    ? 'bg-gray-100 border-gray-300 text-foreground' 
                    : 'bg-primary border-primary text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={onMessage}
                className="px-3 py-1 text-xs rounded-full border border-gray-300 bg-white"
              >
                Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerHeader;