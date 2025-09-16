import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';

const PricingSection = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const { data: product } = useProduct(paramId || '');

  if (!product) return null;

  const finalPrice = product.discount_price || product.price;
  const originalPrice = product.price;
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  
  const savingsPercent = hasDiscount 
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  return null; // Component removed as pricing moved to CoreIdentity
};

export default PricingSection;