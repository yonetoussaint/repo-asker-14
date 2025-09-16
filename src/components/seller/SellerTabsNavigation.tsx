import React from 'react';

interface SellerTabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  productCount: number;
  reelsCount: number;
}

const SellerTabsNavigation: React.FC<SellerTabsNavigationProps> = ({
  activeTab,
  onTabChange,
  productCount,
  reelsCount,
}) => {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'reels', label: 'Reels', count: reelsCount },
    { id: 'posts', label: 'Posts' },
  ];

  return (
    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-2 py-2 text-xs font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <span>{tab.label}</span>
          </div>

          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default SellerTabsNavigation;