import React, { useState } from "react";
import { Heart, Share, Package, BadgeInfo, Star, HelpCircle, Truck, Lightbulb, Search, ChevronRight, ScanLine } from "lucide-react";
import { useScrollProgress } from "./header/useScrollProgress";
import LiveBadge from "./header/LiveBadge";
import BackButton from "./header/BackButton";
import HeaderActionButton from "./header/HeaderActionButton";
import AliExpressSearchBar from "@/components/shared/AliExpressSearchBar";
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigationLoading } from '@/hooks/useNavigationLoading';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import { useProduct } from '@/hooks/useProduct';
import CategoryTabs from "../home/header/CategoryTabs";
import { Separator } from "@/components/ui/separator";
import PriceInfo, { CurrencySwitcher } from "./PriceInfo";

interface ActionButton {
  Icon: any;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  count?: number;
}

interface ProductHeaderProps {
  activeSection?: string;
  onTabChange?: (section: string) => void;
  focusMode?: boolean;
  showHeaderInFocus?: boolean;
  onProductDetailsClick?: () => void;
  currentImageIndex?: number;
  totalImages?: number;
  onShareClick?: () => void;
  forceScrolledState?: boolean;
  actionButtons?: ActionButton[];
  inPanel?: boolean; // New prop
  customScrollProgress?: number; // New prop for external scroll progress
  showCloseIcon?: boolean; // New prop to show X icon
  onCloseClick?: () => void; // New prop for close handler
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  activeSection = "overview", 
  onTabChange,
  focusMode = false,
  showHeaderInFocus = false,
  onProductDetailsClick,
  currentImageIndex,
  totalImages,
  onShareClick,
  forceScrolledState = false,
  actionButtons,
  inPanel = false, // Default to false
  customScrollProgress, // New prop for external scroll progress
  showCloseIcon = false, // New prop for close icon
  onCloseClick // New prop for close handler
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { progress: internalProgress } = useScrollProgress();
  const [searchQuery, setSearchQuery] = useState("");

  // Use custom progress if provided (for panels), otherwise use internal progress
  // In panel mode, we should always use customScrollProgress
  const progress = inPanel ? (customScrollProgress || 0) : internalProgress;
  

  // Use forced state or actual scroll progress
  const displayProgress = forceScrolledState ? 1 : progress;

  // Debug logging for panel scroll behavior
  React.useEffect(() => {
    if (inPanel) {
      console.log('🎯 ProductHeader Panel Debug:', {
        customScrollProgress,
        internalProgress,
        progress,
        displayProgress,
        forceScrolledState,
        inPanel,
        usingCustomProgress: customScrollProgress !== undefined,
        shouldShowSearchBar: displayProgress >= 0.5,
        headerBackgroundOpacity: displayProgress * 0.95,
        blurAmount: displayProgress * 8
      });
    }
  }, [customScrollProgress, internalProgress, progress, displayProgress, forceScrolledState, inPanel]);

  const { id: paramId } = useParams<{ id: string }>();
  const { data: product } = useProduct(paramId || '');
  const navigate = useNavigate();
  const { isLoading, startLoading } = useNavigationLoading();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const productSections = [
    { id: "overview", name: "Overview", icon: <Package className="w-4 h-4" />, path: "#overview" },
    { id: "description", name: "Description", icon: <BadgeInfo className="w-4 h-4" />, path: "#description" },
    { id: "reviews", name: "Reviews", icon: <Star className="w-4 h-4" />, path: "#reviews" },
    { id: "qa", name: "Q&A", icon: <HelpCircle className="w-4 h-4" />, path: "#qa" },
    { id: "shipping", name: "Shipping", icon: <Truck className="w-4 h-4" />, path: "#shipping" },
    { id: "specifications", name: "Specs", icon: <Lightbulb className="w-4 h-4" />, path: "#specifications" }
  ];

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  return (
    <div 
      className={`${inPanel ? 'relative' : 'fixed top-0 left-0 right-0'} z-30 flex flex-col transition-all duration-300 ${
        focusMode && !showHeaderInFocus ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
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
          {/* Left side - Back button and CurrencySwitcher */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <BackButton 
              progress={displayProgress} 
              showCloseIcon={showCloseIcon}
              onClick={onCloseClick}
            />

            {/* CurrencySwitcher - only visible in non-scrolled state */}
            {displayProgress < 0.5 && (
              <CurrencySwitcher showPrice={false} />
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
                  active={isFavorite} 
                  onClick={toggleFavorite} 
                  progress={displayProgress} 
                  activeColor="#f43f5e"
                  likeCount={147}
                />

                <HeaderActionButton 
                  Icon={Share} 
                  progress={displayProgress}
                  shareCount={23}
                  onClick={onShareClick}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;