
import React from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "./ProductGrid";
import { ChevronRight, CirclePlus, ArrowRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from 'react-i18next';
import { Product } from "@/integrations/supabase/products";
import SectionHeader from "./SectionHeader";

interface NewArrivalsProps {
  products?: Product[];
}

export default function NewArrivals({ products = [] }: NewArrivalsProps) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  if (!products?.length) return null;
  
  return (
    <div className="py-3 w-full">
      <div className="container mx-auto px-3">
        <SectionHeader
          title="NEW ARRIVALS"
          icon={Tag}
          viewAllLink="/new-arrivals"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {products.map(product => (
            <div key={product.id} className="relative h-full">
              <ProductCard product={product} />
              <div className="absolute top-2 right-2 z-10 bg-green-600 h-5 w-5 rounded-full flex items-center justify-center">
                <CirclePlus className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}