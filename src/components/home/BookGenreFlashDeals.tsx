import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Timer, LucideIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts, trackProductView } from "@/integrations/supabase/products";
import SectionHeader from "./SectionHeader";
import TabsNavigation from "./TabsNavigation";

interface GenreFlashDealsProps {
  productType?: string;
  excludeTypes?: string[];
  title?: string;
  icon?: LucideIcon;
  headerGradient?: string;
  categories?: Array<{ id: string; label: string }>;
  viewAllLink?: string;
  viewAllText?: string;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
}

export default function BookGenreFlashDeals({ 
  productType = undefined,
  excludeTypes = [],
  title = 'BOOK GENRES',
  icon = BookOpen,
  headerGradient = 'from-blue-500 via-purple-500 to-indigo-600',
  categories,
  viewAllLink,
  viewAllText = 'View All',
  compact = false,
  showHeader = true,
  className = ''
}: GenreFlashDealsProps) {
  // Define default book genre tabs
  const defaultBookTabs = [
    { id: 'all', label: 'All Products' },
    { id: 'fiction', label: 'Fiction' },
    { id: 'science-fiction', label: 'Sci-Fi' },
    { id: 'fantasy', label: 'Fantasy' },
    { id: 'romance', label: 'Romance' },
    { id: 'mystery', label: 'Mystery' },
    { id: 'thriller', label: 'Thriller' },
    { id: 'non-fiction', label: 'Non-Fiction' },
    { id: 'biography', label: 'Biography' },
    { id: 'business', label: 'Business' },
    { id: 'self-help', label: 'Self-Help' },
    { id: 'history', label: 'History' },
    { id: 'cooking', label: 'Cooking' }
  ];

  const genreTabs = categories || defaultBookTabs;

  const [activeTab, setActiveTab] = useState(genreTabs[0]?.id || 'all');
  const [displayCount, setDisplayCount] = useState(8);

  // Fetch ALL products without any filtering
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => fetchAllProducts(), // This should fetch all products without filters
    refetchInterval: 5 * 60 * 1000,
  });

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining for flash deals
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!allProducts || allProducts.length === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const latestFlashStart = allProducts.reduce((latest, product) => {
        const startTime = new Date(product.flash_start_time || '').getTime();
        return startTime > latest ? startTime : latest;
      }, 0);

      if (latestFlashStart === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const endTime = latestFlashStart + (24 * 60 * 60 * 1000);
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

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [allProducts]);

  // Process ALL products without any filtering
  const processedProducts = allProducts.map(product => {
    const discountPercentage = product.discount_price 
      ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
      : 0;

    return {
      ...product,
      discountPercentage,
      stock: product.inventory ?? 0,
      image: product.product_images?.[0]?.src || "https://placehold.co/300x300?text=No+Image"
    };
  });

  // Don't render if no products available
  if (!isLoading && processedProducts.length === 0) {
    return null;
  }

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (displayCount >= processedProducts.length) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Load more when user is 200px from bottom
      if (scrollTop + windowHeight >= documentHeight - 200) {
        setDisplayCount(prev => Math.min(prev + 8, processedProducts.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayCount, processedProducts.length]);

  // Reset display count when products change
  useEffect(() => {
    setDisplayCount(8);
  }, [processedProducts.length]);

  return (
    <div className={`w-full ${compact ? '' : 'bg-white'} ${className}`}>
      {/* Header Row with Gradient Background - Only show if not compact or showHeader is true */}
      {showHeader && !compact && (
        <div className={`bg-gradient-to-r ${headerGradient} text-white`}>
          <SectionHeader
            title={title}
            icon={icon}
            viewAllLink={viewAllLink || `/search`}
            viewAllText={viewAllText}
            showTabs={false}
          />
        </div>
      )}

      {/* Compact header for embedded use */}
      {compact && showHeader && (
        <div className="px-4 py-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {React.createElement(icon, { size: 16, className: "text-gray-600" })}
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            </div>
            {viewAllLink && (
              <Link 
                to={viewAllLink}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {viewAllText}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Tabs Navigation - Display but don't filter */}
      <div className={compact ? "bg-gray-50" : "bg-white"}>
        <TabsNavigation
          tabs={genreTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          edgeToEdge={!compact}
          style={{ backgroundColor: compact ? '#f9fafb' : 'white' }}
        />
      </div>

      <div className={`relative ${compact ? 'pt-2 px-2' : 'pt-4 px-2'}`}>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-[3:4] bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        ) : processedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {processedProducts.slice(0, displayCount).map((product) => (
              <div key={product.id} className="space-y-2">
                <Link 
                  to={`/product/${product.id}`}
                  onClick={() => trackProductView(product.id)}
                  className="block"
                >
                  <div className="relative aspect-[3:4] overflow-hidden bg-gray-50 rounded-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Discount badge */}
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                        -{product.discountPercentage}%
                      </div>
                    )}

                    {/* Timer overlay */}
                    {timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0 ? (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs flex items-center justify-center py-1 gap-1">
                        <Timer className="w-3 h-3" />
                        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
                          <span key={i}>
                            {unit.toString().padStart(2, "0")}
                            {i < 2 && <span className="mx-0.5">:</span>}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* Product info */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium line-clamp-2 text-gray-900">
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-semibold text-base">
                        ${Number(product.discount_price || product.price).toFixed(2)}
                      </span>
                      {product.discount_price && (
                        <span className="text-xs text-gray-500 line-through">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500">
                      {product.stock} in stock
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No products available
          </div>
        )}
      </div>
    </div>
  );
}