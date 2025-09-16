import { LayoutGrid } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, animate as fmAnimate } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CategoryTab {
  id: string;
  name: string;
  icon: ReactNode;
  path: string;
}

interface CategoryTabsProps {
  progress: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  categories: CategoryTab[];
  showCategoriesButton?: boolean;
}

const CategoryTabs = ({
  progress,
  activeTab,
  setActiveTab,
  categories,
  showCategoriesButton = true,
}: CategoryTabsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, categories.length);
  }, [categories]);

  // Function to update underline position and width
  const updateUnderline = () => {
    const activeTabIndex = categories.findIndex(cat => cat.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      // Get the text span element
      const textSpan = activeTabElement.querySelector('span'); 

      if (textSpan) {
        // Calculate underline width based on text content
        const textWidth = textSpan.offsetWidth;
        const newWidth = Math.max(textWidth * 0.8, 20); // Minimum 20px width, 80% of text width

        // Calculate position relative to the button center 
        const buttonRect = activeTabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const relativeLeft = buttonRect.left - containerRect.left + containerElement.scrollLeft;
        const buttonCenter = relativeLeft + (activeTabElement.offsetWidth / 2);
        const underlineStart = buttonCenter - (newWidth / 2);

        setUnderlineWidth(newWidth);
        setUnderlineLeft(underlineStart);
      }
    }
  };

  useEffect(() => {
    const activeTabIndex = categories.findIndex(cat => cat.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    const containerElement = scrollContainerRef.current;

    if (activeTabElement && containerElement) {
      // Scroll to position the active tab at the left edge (with some padding)
      const paddingLeft = 8; // Account for container padding
      const newScrollLeft = activeTabElement.offsetLeft - paddingLeft;

      fmAnimate(scrollX, newScrollLeft, {
        duration: 0.4,
        ease: 'easeInOut',
      });
    }
  }, [activeTab, categories, scrollX]);

  // Update underline when active tab changes
  useEffect(() => {
    if (activeTab) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(updateUnderline, 0);
    }
  }, [activeTab, categories]);

  // Set initial underline when component mounts
  useEffect(() => {
    if (activeTab && categories.length > 0) {
      setTimeout(updateUnderline, 100); // Small delay to ensure fonts are loaded
    }
  }, []);

  useEffect(() => {
    const unsubscribe = scrollX.on('change', latestValue => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = latestValue;
      }
    });
    return () => unsubscribe();
  }, [scrollX]);

  const handleTabClick = (id: string, path: string) => {
    console.log('Tab clicked:', id, 'Navigating to:', path);
    setActiveTab(id);
    // Only navigate if path doesn't start with # (for product sections)
    if (!path.startsWith('#')) {
      navigate(path);
    }
  };

  const handleCategoriesClick = () => {
    navigate('/all-categories');
  };

  return (
    <div
      className="relative w-full transition-all duration-700 overflow-hidden"
      style={{
        maxHeight: '40px',
        opacity: 1,
        backgroundColor: 'white',
      }}
    >
      {/* Tabs List */}
      <div className={`h-full w-full ${showCategoriesButton ? 'pr-[48px]' : ''}`}>
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar h-full w-full relative px-2"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {categories.map(({ id, name, icon, path }, index) => (
            <button
              key={id}
              ref={el => (tabRefs.current[index] = el)}
              onClick={() => handleTabClick(id, path)}
              aria-pressed={activeTab === id}
              className={`relative flex items-center px-2 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out outline-none flex-shrink-0 ${
                activeTab === id
                  ? 'text-red-600'
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              <span className="font-medium">{name}</span>
            </button>
          ))}

          {/* Animated underline - positioned absolutely within the scroll container */}
          {activeTab && (
            <div
              className="absolute bottom-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: underlineWidth,
                left: underlineLeft,
                transform: 'translateZ(0)', // Hardware acceleration
              }}
            />
          )}
        </div>
      </div>

      {/* Icon Button on Right */}
      {showCategoriesButton && (
        <div 
          className="absolute top-0 right-0 h-full flex items-center pl-1 pr-1 z-10 space-x-1"
          style={{
            backgroundColor: 'white',
          }}
        >
          <div className="h-6 w-px bg-gray-200 opacity-50" />
          <button
            type="button"
            onClick={handleCategoriesClick}
            className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-all duration-200"
            aria-label={t('allCategories', { ns: 'categories' })}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;