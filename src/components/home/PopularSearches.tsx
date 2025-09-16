import React, { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, TrendingUp, ArrowUp, Tags, Bookmark, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import SectionHeader from "./SectionHeader";

const popularSearches = [
  { id: 1, term: "Wireless Headphones", count: 1243 },
  { id: 2, term: "Smart Watch", count: 986 },
  { id: 3, term: "iPhone Case", count: 879 },
  { id: 4, term: "Gaming Laptop", count: 765 },
  { id: 5, term: "Bluetooth Speaker", count: 654 },
  { id: 6, term: "Drone Camera", count: 543 },
  { id: 7, term: "LED TV", count: 432 },
  { id: 8, term: "Fitness Tracker", count: 321 },
  { id: 9, term: "Power Bank", count: 298 },
  { id: 10, term: "Smart Home Hub", count: 276 },
  { id: 11, term: "Mechanical Keyboard", count: 254 },
  { id: 12, term: "Wireless Mouse", count: 243 },
  { id: 13, term: "USB-C Hub", count: 231 },
  { id: 14, term: "Monitor Stand", count: 219 },
  { id: 15, term: "Desk Lamp", count: 208 },
  { id: 16, term: "Webcam Cover", count: 197 },
  { id: 17, term: "Laptop Cooling Pad", count: 185 },
  { id: 18, term: "Cable Organizer", count: 176 },
  { id: 19, term: "Wireless Charger", count: 165 },
  { id: 20, term: "Phone Tripod", count: 154 }
];

export default function PopularSearches() {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('product');

  // Group searches into rows for display
  const rows = [
    popularSearches.slice(0, 5),    // Row 1: items 0-4
    popularSearches.slice(5, 10),   // Row 2: items 5-9
    popularSearches.slice(10, 15),  // Row 3: items 10-14
    popularSearches.slice(15, 20)   // Row 4: items 15-19
  ];

  const middleElement = (
    <div className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-0.5 rounded-full backdrop-blur-sm">
      <TrendingUp className="w-3 h-3 shrink-0" />
      <span className="whitespace-nowrap">{popularSearches.length} {t('terms')}</span>
    </div>
  );

  return (
    <div className="w-full bg-white">
      <SectionHeader
        title={t('popularSearches')}
        icon={Search}
        viewAllLink="/search/trending"
      />

      {/* Edge-to-edge scrolling container with rows */}
      <div className="py-3 bg-white">
        <div 
          className="overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '8px'
          }}
          ref={scrollRef}
        >
          <div className="pl-2 space-y-2 min-w-max">
            {rows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex gap-2">
                {row.map((item, itemIndex) => (
                  <div 
                    key={item.id}
                    className="flex-shrink-0 mr-[3vw]"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <Link 
                      to={`/search?q=${encodeURIComponent(item.term)}`}
                      className="text-xs flex-none relative bg-gray-100 hover:bg-gray-200 transition-colors px-2.5 py-1.5 pr-7 rounded-full group"
                    >
                      {item.term}
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-gray-500 bg-gray-200 group-hover:bg-gray-300 px-1 rounded-full">
                        {item.count}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            ))}
            
            {/* Add right spacing for proper scrolling to the end */}
            <div className="flex-shrink-0 w-2"></div>
          </div>
        </div>
      </div>

      {/* Bottom section with trending indicators */}
      <div className="px-4 mt-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-orange-50 rounded-md p-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3 text-orange-500" />
              <span className="text-xs font-medium">{t('trending')}</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-orange-200 text-orange-600">{t('trending').toUpperCase()}</Badge>
          </div>
          <div className="bg-blue-50 rounded-md p-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium">{t('mostSearched')}</span>
            </div>
            <Badge variant="outline" className="text-[8px] border-blue-200 text-blue-600">{t('mostSearched').toUpperCase()}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}