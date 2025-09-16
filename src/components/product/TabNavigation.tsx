import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'reviews', label: 'Reviews' }
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll visibility of chevrons
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftChevron(scrollLeft > 0);
      setShowRightChevron(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Check scroll buttons on mount and when tabs change
  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [activeTab]);

  return (
    <div className="relative w-full bg-white flex-shrink-0 border-b border-gray-100 border-t border-gray-100">
      {/* Scroll Buttons */}
      {showLeftChevron && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-0 z-10 h-full bg-gradient-to-r from-white via-white to-transparent flex items-center justify-center active:bg-gray-50 transition-colors touch-manipulation px-2"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
      )}
      {showRightChevron && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-0 z-10 h-full bg-gradient-to-l from-white via-white to-transparent flex items-center justify-center active:bg-gray-50 transition-colors touch-manipulation px-2"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      )}

      {/* Scrollable Tabs Container */}
      <div
        ref={scrollContainerRef}
        className="flex w-full overflow-x-auto no-scrollbar py-2 gap-2 px-6"
        onScroll={checkScrollButtons}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 whitespace-nowrap touch-manipulation ${
              activeTab === tab.id
                ? 'bg-white text-red-600 border-red-500'
                : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100 active:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;