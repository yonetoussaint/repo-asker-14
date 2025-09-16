import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import VerificationBadge from '@/components/shared/VerificationBadge';

interface SellerInfoOverlayProps {
  seller?: {
    id: string;
    name: string;
    image_url?: string;
    verified: boolean;
    followers_count: number;
  };
  onSellerClick?: () => void;
  focusMode?: boolean;
  isPlaying?: boolean;
}

const SellerInfoOverlay: React.FC<SellerInfoOverlayProps> = ({ 
  seller, 
  onSellerClick,
  focusMode,
  isPlaying 
}) => {
  if (!seller) return null;

  return (
    <div className={`absolute bottom-3 left-3 z-30 transition-opacity duration-300 ${(focusMode || isPlaying) ? 'opacity-0' : 'opacity-100'}`}>
      <button
        onClick={() => {
          console.log('🔍 SellerInfoOverlay clicked, seller:', seller);
          onSellerClick?.();
        }}
        className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-black/70 transition-colors"
      >
        <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
          <img 
            src={(() => {
              if (!seller.image_url) return "https://picsum.photos/100/100?random=1";
              const { data } = supabase.storage.from('seller-logos').getPublicUrl(seller.image_url);
              return data.publicUrl;
            })()}
            alt={`${seller.name} seller`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://picsum.photos/100/100?random=1";
              target.onerror = null;
            }}
          />
        </div>
        <span className="truncate max-w-[80px]">{seller.name}</span>
        {seller.verified && <VerificationBadge size="xs" />}
        <span className="text-xs opacity-80">
          {seller.followers_count >= 1000000 
            ? `${(seller.followers_count / 1000000).toFixed(1)}M`
            : seller.followers_count >= 1000
            ? `${(seller.followers_count / 1000).toFixed(1)}K`
            : seller.followers_count.toString()
          }
        </span>
      </button>
    </div>
  );
};

export default SellerInfoOverlay;