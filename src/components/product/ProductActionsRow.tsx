
import React from "react";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductActionsRowProps {
  isFavorite: boolean;
  toggleFavorite: () => void;
  handleShare: () => void;
  handleCartClick: () => void;
  likeCount?: number;
}

const ProductActionsRow: React.FC<ProductActionsRowProps> = ({
  isFavorite,
  toggleFavorite,
  handleShare,
  handleCartClick,
  likeCount = 0
}) => {
  const { toast } = useToast();

  const handleLike = () => {
    toggleFavorite();
    
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "Product removed from your saved collection" 
        : "Product saved to your collection",
      duration: 2000,
    });
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        {likeCount > 0 && (
          <span className="ml-1 text-sm text-gray-600">
            {likeCount > 999 ? '999+' : likeCount}
          </span>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={handleShare}
      >
        <Share2 className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={handleCartClick}
      >
        <ShoppingCart className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ProductActionsRow;
