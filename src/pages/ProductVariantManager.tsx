// components/product/ProductVariantManager.tsx
import React, { useState, useEffect } from 'react';
import { useVariantStockDecay } from "@/hooks/useVariantStockDecay";

interface ProductVariantManagerProps {
  product: any;
  displayImages: string[];
  setDisplayImages: (images: string[]) => void;
  setCurrentImageIndex: (index: number) => void;
}

const ProductVariantManager: React.FC<ProductVariantManagerProps> = ({
  product,
  displayImages,
  setDisplayImages,
  setCurrentImageIndex
}) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const allColorVariants = (product as any)?.variants || [];
  const colorVariants = allColorVariants.filter((variant: any) => variant.active !== false);
  const isVariableProduct = product?.product_type === 'variable';

  const { variantStockInfo, activateVariant, resetAllVariants } = useVariantStockDecay({
    variants: colorVariants,
    decayPeriod: 12 * 60 * 60 * 1000
  });

  // Get storage variants
  const getStorageVariantsForColor = () => {
    if (selectedColor) {
      const selectedColorVariant = colorVariants.find(v => v.name === selectedColor);
      if (selectedColorVariant && (selectedColorVariant as any).storageOptions) {
        return (selectedColorVariant as any).storageOptions.map((storageOption: any) => ({
          id: storageOption.id,
          name: storageOption.capacity,
          capacity: storageOption.capacity,
          price: storageOption.price || 0,
          stock: storageOption.stock || storageOption.quantity || 0,
          bestseller: storageOption.bestseller || false,
          limited: storageOption.limited || false,
          networkOptions: storageOption.networkOptions || []
        })).sort((a: any, b: any) => a.price - b.price);
      }
    }
    return (product?.storage_variants || []).sort((a, b) => a.price - b.price);
  };

  const storageVariants = getStorageVariantsForColor();

  // Auto-select variants
  useEffect(() => {
    if (colorVariants.length > 0 && !selectedColor) {
      const firstAvailableColor = colorVariants.find(variant => variant.stock > 0) || colorVariants[0];
      if (firstAvailableColor) setSelectedColor(firstAvailableColor.name);
    }
  }, [colorVariants.length, selectedColor]);

  useEffect(() => {
    if (selectedColor && storageVariants.length > 0 && !selectedStorage) {
      const firstAvailableStorage = storageVariants.find(variant => variant.stock > 0) || storageVariants[0];
      if (firstAvailableStorage) setSelectedStorage(firstAvailableStorage.capacity || firstAvailableStorage.name);
    }
  }, [storageVariants.length, selectedStorage, selectedColor]);

  useEffect(() => {
    if (selectedColor && activateVariant && isVariableProduct) {
      activateVariant(selectedColor);
    }
  }, [selectedColor, activateVariant, isVariableProduct]);

  const handleVariantImageChange = (imageUrl: string) => {
    const otherImages = product?.product_images?.map((img: any) => img.src).filter(img => img !== imageUrl) || [];
    setDisplayImages([imageUrl, ...otherImages]);
    setCurrentImageIndex(0);
  };

  return null; // This component manages state, doesn't render UI
};

export default ProductVariantManager;