
import React from "react";
import NewQuantitySelector from "./NewQuantitySelector";
import { VariantStockInfo } from "@/hooks/useVariantStockDecay";

interface ProductQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  price?: number;
  maxQuantity?: number;
  minQuantity?: number;
  inStock?: number;
  productName?: string;
  stockInfo?: VariantStockInfo;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

const ProductQuantitySelector: React.FC<ProductQuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  price = 0,
  maxQuantity = 250,
  minQuantity = 1,
  inStock,
  productName,
  stockInfo,
  onIncrement,
  onDecrement,
}) => (
  <div className="w-full px-2 py-0.5">
    <NewQuantitySelector />
  </div>
);

export default ProductQuantitySelector;
