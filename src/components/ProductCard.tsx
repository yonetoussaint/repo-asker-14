
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export interface ProductProps {
  id: string; // Changed from number to string for compatibility
  name: string;
  price: number;
  discountPrice?: number;
  rating: number;
  image: string;
  isNew?: boolean;
  category: string;
  sold?: number;
  // Allow for additional properties that might be needed
  product_images?: { src: string }[];
  [key: string]: any;
}

interface ProductCardProps {
  product: ProductProps;
  className?: string;
  showTitle?: boolean;
  showButton?: boolean;
  compact?: boolean;
  onProductClick?: (productId: string) => void;
}

const ProductCard = ({
  product,
  className = "",
  showTitle = true,
  showButton = true,
  compact = false,
  onProductClick,
}: ProductCardProps) => {
  const { id, name, price, discountPrice, rating, image, isNew, sold } = product;
  const discount = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent) => {
    if (onProductClick) {
      e.preventDefault();
      onProductClick(id);
    }
  };

  return (
    <Card className={`overflow-hidden group border rounded-sm h-full transition-all ${className}`}>
      <Link to={`/product/${id}`} className="block h-full" onClick={handleClick}>
        <div className="relative overflow-hidden aspect-square bg-white">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-1.5 right-1.5">
            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" />
          </div>
          {discount > 0 && (
            <Badge className="absolute top-1.5 left-1.5 bg-red-500 hover:bg-red-600 text-[10px] px-1.5 py-0.5 rounded-sm">
              -{discount}%
            </Badge>
          )}
          {isNew && (
            <Badge className="absolute bottom-1.5 left-1.5 bg-green-500 hover:bg-green-600 text-[10px] px-1.5 py-0.5 rounded-sm">
              New
            </Badge>
          )}
        </div>

        {showTitle && (
          <CardContent className={`flex flex-col gap-0.5 ${compact ? "p-2" : "p-3"}`}>
            <h3 className="text-xs font-normal text-gray-800 line-clamp-2 leading-snug">
              {name}
            </h3>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-red-500 font-bold text-sm">
                ${discountPrice ?? price}
              </span>
              {discountPrice && (
                <span className="text-gray-400 line-through text-xs">
                  ${price}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center mt-0.5 text-[10px] text-gray-500">
              <span>{rating}★</span>
              {sold && <span>{sold} sold</span>}
            </div>
            {showButton && (
              <button className="text-[10px] mt-1 px-2 py-0.5 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors w-full">
                {t('product.addToCart')}
              </button>
            )}
          </CardContent>
        )}
      </Link>
    </Card>
  );
};

export default ProductCard;
