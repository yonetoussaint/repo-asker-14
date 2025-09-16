import React from "react";
import { Play, Pause, RotateCw, FlipHorizontal, Focus, ChevronLeft, ChevronRight, Download, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import VerificationBadge from "@/components/shared/VerificationBadge";

interface ImageGalleryControlsProps {
  currentIndex: number;
  totalImages: number;
  isRotated: number;
  isFlipped: boolean;
  autoScrollEnabled: boolean;
  focusMode: boolean;
  isPlaying?: boolean;
  showControls?: boolean;
  variant?: "default" | "fullscreen";
  onRotate: (e?: React.MouseEvent) => void;
  onFlip: (e?: React.MouseEvent) => void;
  onToggleAutoScroll: (e?: React.MouseEvent) => void;
  onToggleFocusMode: (e?: React.MouseEvent) => void;
  onPrevious?: (e?: React.MouseEvent) => void;
  onNext?: (e?: React.MouseEvent) => void;
  onDownload?: (e?: React.MouseEvent) => void;
  className?: string;
  seller?: {
    id: string;
    name: string;
    image_url?: string;
    verified: boolean;
    followers_count: number;
  };
  onSellerClick?: () => void;
}

const ImageGalleryControls: React.FC<ImageGalleryControlsProps> = ({
  currentIndex,
  totalImages,
  isRotated,
  isFlipped,
  autoScrollEnabled,
  focusMode,
  isPlaying,
  showControls = true,
  variant = "default",
  onRotate,
  onFlip,
  onToggleAutoScroll,
  onToggleFocusMode,
  onPrevious,
  onNext,
  onDownload,
  className,
  seller,
  onSellerClick
}) => {
  if (!showControls) return null;

  const isFullscreen = variant === "fullscreen";

  const FALLBACK_SELLER_LOGO = "https://picsum.photos/100/100?random=1";

  const getSellerLogoUrl = (imagePath?: string): string | null => {
    if (!imagePath) return null;
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = FALLBACK_SELLER_LOGO;
    target.onerror = null;
  };

  if (!isFullscreen) {
    return (
      <>
        <div className={cn(
          "absolute bottom-3 right-3 flex items-center gap-2 z-30 transition-opacity duration-300",
          (focusMode || (isPlaying)) && "opacity-0",
          className
        )}>
          <Button
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full bg-black/10 backdrop-blur-sm text-white hover:bg-black/20"
            onClick={onRotate}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full bg-black/10 backdrop-blur-sm text-white hover:bg-black/20"
            onClick={onFlip}
          >
            <FlipHorizontal className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost" 
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full bg-black/10 backdrop-blur-sm text-white hover:bg-black/20",
              autoScrollEnabled && "bg-primary text-white"
            )}
            onClick={onToggleAutoScroll}
          >
            {autoScrollEnabled ? 
              <Pause className="h-4 w-4" /> : 
              <Play className="h-4 w-4" />
            }
          </Button>
          
          <button
            onClick={onToggleFocusMode}
            className={cn(
              "h-8 w-8 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 transition-colors",
              focusMode && "bg-primary text-white"
            )}
            aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
          >
            <Focus size={16} />
          </button>
        </div>
        
        
        <div className={cn(
          "absolute bottom-3 left-3 z-30 transition-opacity duration-300 flex items-center h-8",
          (focusMode || isPlaying) && "opacity-0"
        )}>
          {seller ? (
            <button
              onClick={onSellerClick}
              className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-black/70 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                <img 
                  src={getSellerLogoUrl(seller.image_url) || FALLBACK_SELLER_LOGO}
                  alt={`${seller.name} seller`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
              <span className="truncate max-w-[80px]">{seller.name}</span>
              {seller.verified && <VerificationBadge size="xs" />}
              <span className="text-xs opacity-80">{formatNumber(seller.followers_count)}</span>
            </button>
          ) : (
            <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
              {currentIndex + 1} / {totalImages}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
      {onPrevious && onNext && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-black/10 backdrop-blur-sm hover:bg-black/20 border-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious(e);
            }}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Button>
          
          <div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
            {currentIndex + 1} / {totalImages}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-black/10 backdrop-blur-sm hover:bg-black/20 border-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onNext(e);
            }}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full p-1.5">
        <Button
          variant="ghost" 
          size="icon"
          className="h-8 w-8 rounded-full bg-black/10 backdrop-blur-sm hover:bg-black/20"
          onClick={(e) => {
            e.stopPropagation();
            onRotate(e);
          }}
        >
          <RotateCw className="h-4 w-4 text-white" />
        </Button>
        
        <Button
          variant="ghost" 
          size="icon"
          className="h-8 w-8 rounded-full bg-black/10 backdrop-blur-sm hover:bg-black/20"
          onClick={(e) => {
            e.stopPropagation();
            onFlip(e);
          }}
        >
          <FlipHorizontal className="h-4 w-4 text-white" />
        </Button>
        
        {onDownload && (
          <Button
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full bg-black/10 backdrop-blur-sm hover:bg-black/20"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(e);
            }}
          >
            <Download className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageGalleryControls;
