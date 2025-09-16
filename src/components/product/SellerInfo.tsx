import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import VerificationBadge from "@/components/shared/VerificationBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProductReviewsStats } from "@/hooks/useProductReviews";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" className={className}>
    <path fill="#fff" d="M4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5c5.1,0,9.8,2,13.4,5.6	C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19c0,0,0,0,0,0h0c-3.2,0-6.3-0.8-9.1-2.3L4.9,43.3z"></path>
    <path fill="#fff" d="M4.9,43.8c-0.1,0-0.3-0.1-0.4-0.1c-0.1-0.1-0.2-0.3-0.1-0.5L7,33.5c-1.6-2.9-2.5-6.2-2.5-9.6	C4.5,13.2,13.3,4.5,24,4.5c5.2,0,10.1,2,13.8,5.7c3.7,3.7,5.7,8.6,5.7,13.8c0,10.7-8.7,19.5-19.5,19.5c-3.2,0-6.3-0.8-9.1-2.3	L5,43.8C5,43.8,4.9,43.8,4.9,43.8z"></path>
    <path fill="#cfd8dc" d="M24,5c5.1,0,9.8,2,13.4,5.6C41,14.2,43,18.9,43,24c0,10.5-8.5,19-19,19h0c-3.2,0-6.3-0.8-9.1-2.3	L4.9,43.3l2.7-9.8C5.9,30.6,5,27.3,5,24C5,13.5,13.5,5,24,5 M24,43L24,43L24,43 M24,43L24,43L24,43 M24,4L24,4C13,4,4,13,4,24	c0,3.4,0.8,6.7,2.5,9.6L3.9,43c-0.1,0.3,0,0.7,0.3,1c0.2,0.2,0.4,0.3,0.7,0.3c0.1,0,0.2,0,0.3,0l9.7-2.5c2.8,1.5,6,2.2,9.2,2.2	c11,0,20-9,20-20c0-5.3-2.1-10.4-5.8-14.1C34.4,6.1,29.4,4,24,4L24,4z"></path>
    <path fill="#40c351" d="M35.2,12.8c-3-3-6.9-4.6-11.2-4.6C15.3,8.2,8.2,15.3,8.2,24c0,3,0.8,5.9,2.4,8.4L11,33l-1.6,5.8	l6-1.6l0.6,0.3c2.4,1.4,5.2,2.2,8,2.2h0c8.7,0,15.8-7.1,15.8-15.8C39.8,19.8,38.2,15.8,35.2,12.8z"></path>
    <path fill="#fff" fillRule="evenodd" d="M19.3,16c-0.4-0.8-0.7-0.8-1.1-0.8c-0.3,0-0.6,0-0.9,0	s-0.8,0.1-1.3,0.6c-0.4,0.5-1.7,1.6-1.7,4s1.7,4.6,1.9,4.9s3.3,5.3,8.1,7.2c4,1.6,4.8,1.3,5.7,1.2c0.9-0.1,2.8-1.1,3.2-2.3	c0.4-1.1,0.4-2.1,0.3-2.3c-0.1-0.2-0.4-0.3-0.9-0.6s-2.8-1.4-3.2-1.5c-0.4-0.2-0.8-0.2-1.1,0.2c-0.3,0.5-1.2,1.5-1.5,1.9	c-0.3,0.3-0.6,0.4-1,0.1c-0.5-0.2-2-0.7-3.8-2.4c-1.4-1.3-2.4-2.8-2.6-3.3c-0.3-0.5,0-0.7,0.2-1c0.2-0.2,0.5-0.6,0.7-0.8	c0.2-0.3,0.3-0.5,0.5-0.8c0.2-0.3,0.1-0.6,0-0.8C20.6,19.3,19.7,17,19.3,16z" clipRule="evenodd"></path>
  </svg>
);

const FALLBACK_SELLER_LOGO = "https://picsum.photos/100/100?random=1";
const FALLBACK_BUYER_AVATAR = "https://i.pravatar.cc/100?img=3";

interface SellerInfoProps {
  seller?: {
    id: string;
    name: string;
    image_url?: string;
    verified: boolean;
    rating?: number;
    rating_count?: number;
    total_sales: number;
    followers_count: number;
  };
  stock?: number;
  reservedStock?: number;
  lastBuyerAvatar?: string | null;
  lastPurchase?: string;
  productId?: string;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ 
  seller, 
  stock = 0, 
  reservedStock = 0, 
  lastBuyerAvatar, 
  lastPurchase = "recently",
  productId
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { data: reviewsStats } = useProductReviewsStats(productId || '');


  if (!seller) {
    return null;
  }


  const handleStockNotification = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsSubscribed(!isSubscribed);
      toast.success(
        isSubscribed 
          ? "You'll no longer receive stock notifications" 
          : "You'll be notified when stock is available!"
      );
    } catch (error) {
      toast.error("Failed to update notification preference");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Hi, I'm interested in your product. Can you provide more details?`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSellerClick = () => {
    navigate(`/seller/${seller.id}`);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatSales = (num: number): string => formatNumber(num);

  const getSellerLogoUrl = (imagePath?: string): string | null => {
    if (!imagePath) return null;
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const StockIndicator = ({ stock }: { stock: number }) => {
    if (stock > 10) return <span className="text-green-600">In stock</span>;
    if (stock > 0) return <span className="text-yellow-600">Low stock</span>;
    return <span className="text-red-600">Out of stock</span>;
  };

  const logoUrl = getSellerLogoUrl(seller.image_url);
  const rating = seller.rating?.toFixed(1) || "0.0";
  const totalSales = seller.total_sales;
  const availableStock = Math.max(0, stock - reservedStock);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.alt.includes("seller")) {
      target.src = FALLBACK_SELLER_LOGO;
    } else {
      target.src = FALLBACK_BUYER_AVATAR;
    }
    target.onerror = null;
  };

  return (
    <div className="seller-info">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSellerClick}
            className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            title={`Visit ${seller.name}'s profile`}
          >
            <img 
              src={logoUrl || FALLBACK_SELLER_LOGO}
              alt={`${seller.name} seller`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </button>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              <button
                onClick={handleSellerClick}
                className="text-xs font-medium text-gray-900 truncate max-w-[100px] hover:text-blue-600 hover:underline transition-colors"
                title={`Visit ${seller.name}'s profile`}
              >
                {seller.name}
              </button>
              {seller.verified && <VerificationBadge size="xs" />}
            </div>
            <span className="text-xs text-gray-600">{formatNumber(seller.followers_count)} followers</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={handleWhatsAppContact}
          >
            <WhatsAppIcon className="w-3 h-3 mr-0.5" />
            WhatsApp
          </Button>
          <Button
            variant={isSubscribed ? "outline" : "default"}
            size="sm"
            className="h-6 px-3 text-xs"
            onClick={handleStockNotification}
            disabled={isLoading}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </div>


      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <StockIndicator stock={stock} />
          <span className="text-gray-300 mx-1">|</span>
          <span className="text-gray-600">{availableStock} available</span>
          {stock <= 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-4 h-4 ml-1 text-gray-400 hover:text-primary"
              onClick={handleStockNotification}
              disabled={isLoading}
            >
              {isSubscribed ? (
                <BellOff className="w-3 h-3" />
              ) : (
                <Bell className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
            <img 
              src={lastBuyerAvatar || FALLBACK_BUYER_AVATAR}
              alt="Last buyer"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          <span className="text-gray-500">Last bought {lastPurchase}</span>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;