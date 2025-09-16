
import React, { useState, useRef, useEffect } from 'react';

interface AliExpressTabsProps {
  children?: React.ReactNode;
  initialTab?: number;
  tabs?: Array<{ id: number; name: string; content: React.ReactNode }>;
  className?: string; // Added className prop to the interface
}

const AliExpressTabs = ({ initialTab = 0, tabs = [], className = '' }: AliExpressTabsProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tabUnderlineStyle, setTabUnderlineStyle] = useState({});
  const tabsRef = useRef<Array<HTMLDivElement | null>>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const defaultTabs = [
    { id: 0, name: 'Description', content: <div>Description content goes here</div> },
    { id: 1, name: 'Specifications', content: <div>Specifications content goes here</div> },
    { id: 2, name: 'Reviews', content: <div>Reviews content goes here</div> },
    { id: 3, name: 'Q&As', content: <div>Q&As content goes here</div> },
    { id: 4, name: 'Shipping', content: <div>Shipping content goes here</div> },
    { id: 5, name: 'Return Policy', content: <div>Return Policy content goes here</div> },
    { id: 6, name: 'Recommendations', content: <div>Recommendations content goes here</div> },
  ];

  const displayTabs = tabs.length > 0 ? tabs : defaultTabs;

  // Force a resize check when component mounts to initialize the underline correctly
  useEffect(() => {
    const handleResize = () => {
      if (tabsRef.current[activeTab]) {
        const currentTab = tabsRef.current[activeTab];
        if (currentTab) {
          setTabUnderlineStyle({
            left: currentTab.offsetLeft,
            width: currentTab.offsetWidth,
          });
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Initial calculation
    setTimeout(handleResize, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  // Update underline position when active tab changes
  useEffect(() => {
    // Update the underline position and width after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (tabsRef.current[activeTab]) {
        const currentTab = tabsRef.current[activeTab];
        if (currentTab) {
          setTabUnderlineStyle({
            left: currentTab.offsetLeft,
            width: currentTab.offsetWidth,
          });
          
          // Scroll active tab into view
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const tabElement = currentTab;
            
            // Calculate position to center the tab
            const scrollLeft = tabElement.offsetLeft - (container.offsetWidth / 2) + (tabElement.offsetWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
          }
        }
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  // Add CSS to hide scrollbar for Webkit browsers
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className={`w-screen -mx-4 flex flex-col bg-white border-t border-gray-100 ${className}`}>
      {/* Header with full-width, edge-to-edge scrollable tabs */}
      <div 
        className="sticky top-[var(--header-height)] z-40 w-full bg-white shadow-sm"
        id="tabs-header"
      >
        <div className="w-full flex overflow-x-auto py-2 px-0 bg-white border-b border-gray-200 hide-scrollbar relative" 
          ref={scrollContainerRef}
          style={{ scrollbarWidth: 'none' }}
        >
          {displayTabs.map((tab, index) => (
            <div
              key={tab.id}
              ref={(el) => (tabsRef.current[index] = el)}
              className={`flex-shrink-0 cursor-pointer px-4 whitespace-nowrap text-xs font-medium ${
                activeTab === index ? 'text-red-500' : 'text-gray-600'
              }`}
              onClick={() => handleTabClick(index)}
            >
              {tab.name}
            </div>
          ))}
          {/* Animated underline */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-red-500 transition-all duration-300"
            style={tabUnderlineStyle}
          />
        </div>
      </div>

      {/* Content area */}
      <div className="w-full flex-1 p-4 overflow-y-auto bg-white">
        {displayTabs.map((tab, index) => (
          <div 
            key={tab.id}
            className={`${activeTab === index ? 'block' : 'hidden'}`}
          >
            {tab.content || (
              <div className="min-h-64 flex items-center justify-center text-gray-400">
                {tab.name} content goes here
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AliExpressTabs;
