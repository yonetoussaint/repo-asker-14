import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, Package } from 'lucide-react';

interface ProductReelsActionButtonsProps {
  likes: number;
  views?: number;
  inquiries?: number;
  formatViews: (views: number) => string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: () => void;
  onInquiry?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onViewProduct?: () => void;
}

export const ReelsActionButtons: React.FC<ProductReelsActionButtonsProps> = ({
  likes,
  views = 0,
  inquiries = 0,
  formatViews,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onInquiry,
  onShare,
  onBookmark,
  onViewProduct,
}) => {
  return (
    <div className="absolute bottom-20 right-3 flex flex-col items-center space-y-4 pointer-events-auto">
      {/* Like/Favorite Product Button */}
      <button 
        className="flex flex-col items-center group"
        onClick={onLike}
      >
        <div className="rounded-full bg-black/30 p-2 group-hover:bg-black/50 transition-colors">
          <Heart 
            className={`h-6 w-6 transition-colors ${
              isLiked ? 'text-red-500 fill-red-500' : 'text-white'
            }`} 
          />
        </div>
        <span className="text-white text-xs mt-1 font-semibold">{formatViews(likes)}</span>
      </button>

      {/* Product Inquiry/Questions Button */}
      <button 
        className="flex flex-col items-center group"
        onClick={onInquiry}
      >
        <div className="rounded-full bg-black/30 p-2 group-hover:bg-black/50 transition-colors">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1 font-semibold">{formatViews(inquiries)}</span>
      </button>

      {/* Share Product Button */}
      <button 
        className="flex flex-col items-center group"
        onClick={onShare}
      >
        <div className="rounded-full bg-black/30 p-2 group-hover:bg-black/50 transition-colors">
          <Send className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1 font-semibold">Share</span>
      </button>

      {/* Save/Wishlist Product Button */}
      <button 
        className="flex flex-col items-center group"
        onClick={onBookmark}
      >
        <div className="rounded-full bg-black/30 p-2 group-hover:bg-black/50 transition-colors">
          <Bookmark 
            className={`h-6 w-6 transition-colors ${
              isBookmarked ? 'text-yellow-500 fill-yellow-500' : 'text-white'
            }`} 
          />
        </div>
        <span className="text-white text-xs mt-1 font-semibold">Save</span>
      </button>

      {/* View Product Details Button */}
      <button 
        className="flex flex-col items-center group"
        onClick={onViewProduct}
      >
        <div className="rounded-full bg-black/30 p-2 group-hover:bg-black/50 transition-colors">
          <Package className="h-6 w-6 text-white" />
        </div>
        <span className="text-white text-xs mt-1 font-semibold">Details</span>
      </button>
    </div>
  );
};