import { Link } from "react-router-dom";
import { ArrowRight, Zap, Bolt, Timer } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { fetchFlashDeals, trackProductView } from "@/integrations/supabase/products";
import SectionHeader from "./SectionHeader";

export default function EntertainmentFlashDeals() {
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);

  // Fetch flash deals from the database
  const { data: flashProducts = [], isLoading } = useQuery({
    queryKey: ['flash-deals'],
    queryFn: () => fetchFlashDeals(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining for flash deals
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!flashProducts || flashProducts.length === 0) return { hours: 0, minutes: 0, seconds: 0 };
      
      // Get the most recent flash deal start time
      const latestFlashStart = flashProducts.reduce((latest, product) => {
        const startTime = new Date(product.flash_start_time || '').getTime();
        return startTime > latest ? startTime : latest;
      }, 0);

      if (latestFlashStart === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const endTime = latestFlashStart + (24 * 60 * 60 * 1000); // 24 hours later
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [flashProducts]);

  // Calculate discount percentage and real inventory for display
  const processedProducts = flashProducts.map(product => {
    const discountPercentage = product.discount_price 
      ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
      : 0;

    return {
      ...product,
      discountPercentage,
      stock: product.inventory ?? 0,  // Real stock from database
      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image"
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

  // Don't render the component if no products are available
  if (!isLoading && processedProducts.length === 0) {
    return null;
  }

  return (
   <div className="w-full bg-white">
      <SectionHeader
        title="FLASH DEALS"
        icon={Zap}
        viewAllLink="/search?category=flash-deals"
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
                  <Link 
                    to={`/product/${product.id}`}
                    onClick={() => trackProductView(product.id)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-md mb-1.5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                       <div className="absolute top-0 left-0 bg-[#FF4747] text-white text-[10px] px-1.5 py-0.5 rounded-br-md font-medium">
                         {product.stock} left
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
                        <div className="text-[#FF4747] font-semibold text-sm">
                          ${Number(product.discount_price).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-gray-500 line-through">
                          ${Number(product.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              <div className="flex-none w-4" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}