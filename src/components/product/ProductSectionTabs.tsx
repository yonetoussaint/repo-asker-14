import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, animate as fmAnimate } from 'framer-motion';


interface ProductSection {
  id: string;
  name: string;
  path: string;
}

interface ProductSectionTabsProps {
  sections: ProductSection[];
  activeSection: string;
  onTabChange: (section: string) => void;
  progress: number;
}

const ProductSectionTabs: React.FC<ProductSectionTabsProps> = ({
  sections,
  activeSection,
  onTabChange,
  progress
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, sections.length);
  }, [sections]);

  useEffect(() => {
    const activeTabIndex = sections.findIndex(section => section.id === activeSection);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      const newScrollLeft =
        activeTabElement.offsetLeft - (containerElement.offsetWidth / 2) + (activeTabElement.offsetWidth / 2);

      fmAnimate(scrollX, newScrollLeft, {
        duration: 0.4,
        ease: 'easeInOut',
      });

      // Use the full tab width for underline
      setUnderlineWidth(activeTabElement.offsetWidth * 0.6);
    }
  }, [activeSection, sections, scrollX]);

  useEffect(() => {
    const unsubscribe = scrollX.on('change', latestValue => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = latestValue;
      }
    });
    return () => unsubscribe();
  }, [scrollX]);

  const handleTabClick = (id: string) => {
    onTabChange(id);
  };

  return (
    <div
      className="relative w-full transition-all duration-700 overflow-hidden"
      style={{
        maxHeight: '40px',
        opacity: progress >= 0.3 ? 1 : 0,
        backgroundColor: `rgba(255, 255, 255, ${progress * 0.95})`,
        backdropFilter: `blur(${progress * 8}px)`,
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
      }}
    >
      {/* Tabs List */}
      <div className="h-full">
        <motion.div
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto no-scrollbar h-full px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sections.map(({ id, name }, index) => (
            <button
              key={id}
              ref={el => (tabRefs.current[index] = el)}
              onClick={() => handleTabClick(id)}
              aria-pressed={activeSection === id}
              className={`relative flex items-center justify-center px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out outline-none mr-1 rounded-full ${
                activeSection === id
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold">{name}</span>
              {activeSection === id && (
                <div
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-600 rounded-full transition-all duration-200"
                  style={{
                    width: underlineWidth,
                  }}
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      
    </div>
  );
};

export default ProductSectionTabs;