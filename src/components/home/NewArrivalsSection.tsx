import { Link } from "react-router-dom";
import { ArrowRight, Package, Timer } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import SectionHeader from "./SectionHeader";

export default function NewArrivalsSection() {
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);

  // Fetch products from the database
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: fetchAllProducts,
  });

  // Filter products based on Haiti-friendly & practical criteria
  const filterNewArrivals = (products: any[]) => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    return products.filter(product => {
      // 🆕 Recently Posted (3-7 days)
      const createdAt = new Date(product.created_at);
      const isRecentlyPosted = createdAt >= sevenDaysAgo && createdAt <= now;
      
      // 📸 Clean Image (has at least one product image)
      const hasCleanImage = product.product_images && product.product_images.length > 0;
      
      // 📝 Complete Info (title, description, price, category filled)
      const hasCompleteInfo = product.name && 
                             product.description && 
                             product.price && 
                             product.tags && product.tags.length > 0;
      
      // ⚙️ In-Stock / Available (inventory > 0 and not out of stock)
      const isInStock = product.inventory > 0 && product.status !== 'out_of_stock';
      
      // 📍 Location Tag (has location field or Haiti-related tags)
      const hasLocationTag = product.location || 
                            (product.tags && product.tags.some((tag: string) => 
                              tag.toLowerCase().includes('haiti') || 
                              tag.toLowerCase().includes('commune') ||
                              tag.toLowerCase().includes('district') ||
                              tag.toLowerCase().includes('port-au-prince') ||
                              tag.toLowerCase().includes('cap-haitien') ||
                              tag.toLowerCase().includes('jacmel') ||
                              tag.toLowerCase().includes('gonaives')
                            ));
      
      // ✅ Approved/Verified (status is approved or active, seller trust score >= 70)
      const isApproved = (product.status === 'approved' || product.status === 'active') &&
                        (!product.seller_trust_score || product.seller_trust_score >= 70);
      
      // 🔥 Engagement Boost (has some views, saves, or likes)
      const hasEngagement = (product.views && product.views > 0) || 
                           (product.saves && product.saves > 0);
      
      // Must meet all mandatory criteria + at least one optional
      const meetsMandatory = isRecentlyPosted && hasCleanImage && hasCompleteInfo && isInStock;
      const meetsOptional = hasLocationTag || isApproved || hasEngagement;
      
      return meetsMandatory && meetsOptional;
    })
    .sort((a, b) => {
      // Sort by engagement first, then by recency
      const aEngagement = (a.views || 0) + (a.saves || 0);
      const bEngagement = (b.views || 0) + (b.saves || 0);
      if (aEngagement !== bEngagement) return bEngagement - aEngagement;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, 5); // Get top 5 that meet criteria
  };

  // Get filtered new arrivals
  const newArrivalProducts = filterNewArrivals(products as any[]);

  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 30, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Process products for display
  const processedProducts = newArrivalProducts.map(product => {
    // Simulate "new" metrics
    const simulatedViews = Math.floor(Math.random() * 500) + 100;
    const simulatedStock = Math.floor(Math.random() * 100) + 20;

    return {
      ...product,
      views: simulatedViews,
      stock: simulatedStock,
      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=New+Product"
    };
  });

  const middleElement = (
    <div className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-0.5 rounded-full backdrop-blur-sm">
      <Timer className="w-4 h-4 shrink-0" />
      <span className="whitespace-nowrap">
        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
          <span key={i}>
            {unit.toString().padStart(2, "0")}
            {i < 2 && <span className="mx-0.5">:</span>}
          </span>
        ))}
      </span>
    </div>
  );

  return (
    <div className="w-full bg-white">
      <SectionHeader
        title="NEW ARRIVALS"
        icon={Package}
        viewAllLink="/search?category=new-arrivals"
        viewAllText="View All"
      />

      <div className="relative">
        {isLoading ? (
          <div className="pl-2 flex overflow-x-hidden">
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index} 
                className="w-[calc(100%/3.5)] flex-shrink-0 mr-2"
              >
                <div className="aspect-square bg-gray-200 animate-pulse rounded-md mb-1.5"></div>
                <div className="h-3 w-3/4 bg-gray-200 animate-pulse mb-1"></div>
                <div className="h-2 w-1/2 bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : processedProducts.length > 0 ? (
          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollPaddingLeft: "1rem",
              WebkitOverflowScrolling: "touch"
            }}
          >
            <div className="flex pl-2">
              {processedProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[calc(100%/3.5)] flex-shrink-0 snap-start mr-2"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-md mb-1.5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-0 left-0 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-br-md font-medium">
                        {product.inventory || 0} left
                      </div>
                      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] flex justify-center py-0.5">
                        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                          <span key={i} className="mx-0.5">
                            <span>{unit.toString().padStart(2, "0")}</span>
                            {i < 2 && <span className="mx-0.5">:</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <div className="text-green-600 font-semibold text-sm">
                          ${Number(product.price).toFixed(2)}
                        </div>
                        {product.discount_price && (
                          <div className="text-[10px] text-gray-500 line-through">
                            ${Number(product.discount_price).toFixed(2)}
                          </div>
                        )}
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
            <p className="text-sm text-gray-500">No new arrivals available right now</p>
          </div>
        )}
      </div>
    </div>
  );
}