import { Link } from "react-router-dom";
import { Zap, LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, fetchFlashDeals } from "@/integrations/supabase/products";
import SectionHeader from "./SectionHeader";

interface SimpleFlashDealsProps {
  title?: string;
  icon?: LucideIcon;
}

export default function SimpleFlashDeals({ title = "FLASH DEALS", icon = Zap, productType }: { title?: string; icon?: LucideIcon; productType?: string }) {
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products', 'simple-flash-deals', productType],
    queryFn: () => productType ? fetchFlashDeals(undefined, productType) : fetchAllProducts(),
  });

  console.log('🔍 SimpleFlashDeals - All products:', products);
  console.log('🔍 SimpleFlashDeals - Products with tags:', products?.map(p => ({ id: p.id, name: p.name, tags: p.tags, tagsType: typeof p.tags })));

  const flashProducts = (products as any[])
    .slice(0, 5);

  console.log('🔍 SimpleFlashDeals - Filtered flash products:', flashProducts);

  const processedProducts = flashProducts.map(product => {
    const discountPercentage = product.discount_price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : 0;

    return {
      ...product,
      discountPercentage,
      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image",
    };
  });

  return (
    <div className="w-full bg-white">
      <SectionHeader
        title={title}
        icon={icon}
        viewAllLink="/search?category=flash-deals"
        viewAllText="View All"
      />

      <div className="relative">
        {isLoading ? (
          <div className="pl-2 flex overflow-x-hidden">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="w-[calc(100%/3.5)] flex-shrink-0 mr-2">
                <div className="aspect-square bg-gray-200 animate-pulse rounded-md mb-1.5"></div>
                <div className="h-3 w-3/4 bg-gray-200 animate-pulse mb-1"></div>
                <div className="h-2 w-1/2 bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-sm text-red-500">
            Failed to load flash deals. Please try again later.
          </div>
        ) : processedProducts.length > 0 ? (
          <div
            className="overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollPaddingLeft: "1rem",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex pl-2">
              {processedProducts.map((item) => (
                <div
                  key={item.id}
                  className="w-[calc(100%/3.5)] flex-shrink-0 snap-start mr-2"
                >
                  <Link to={`/product/${item.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-md mb-1.5">
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                       <div className="absolute top-0 left-0 bg-[#FF4747] text-white text-[10px] px-1.5 py-0.5 rounded-br-md font-medium">
                         {item.inventory || 0} left
                       </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <div className="text-[#FF4747] font-semibold text-sm">
                        ${Number(item.discount_price).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-gray-500 line-through">
                        ${Number(item.price).toFixed(2)}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              <div className="flex-none w-4" />
            </div>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No items available right now</p>
          </div>
        )}
      </div>
    </div>
  );
}