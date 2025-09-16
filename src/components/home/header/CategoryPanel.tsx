
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ShoppingBag, Shirt, Bike, Coffee, Wrench, Gamepad2, Baby, Car, Tv, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CategoryPanelProps {
  isOpen: boolean;
  activeTab: string;
  setActiveTab: (id: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  categories: string[];
  progress: number;
}

const CategoryPanel = ({ isOpen, activeTab, setActiveTab, setIsOpen, categories, progress }: CategoryPanelProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const popularCategories = [
    { id: 'fashion', name: t('fashion', { ns: 'categories' }), icon: <Shirt className="h-4 w-4" /> },
    { id: 'sports', name: t('sports', { ns: 'categories' }), icon: <Bike className="h-4 w-4" /> },
    { id: 'home', name: t('home', { ns: 'categories' }), icon: <Coffee className="h-4 w-4" /> },
    { id: 'tools', name: t('tools', { ns: 'categories' }), icon: <Wrench className="h-4 w-4" /> },
    { id: 'gaming', name: t('gaming', { ns: 'categories' }), icon: <Gamepad2 className="h-4 w-4" /> },
    { id: 'baby', name: t('baby', { ns: 'categories' }), icon: <Baby className="h-4 w-4" /> },
    { id: 'auto', name: t('auto', { ns: 'categories' }), icon: <Car className="h-4 w-4" /> },
    { id: 'electronics', name: t('electronics', { ns: 'categories' }), icon: <Tv className="h-4 w-4" /> },
    { id: 'all', name: t('allCategories', { ns: 'categories' }), icon: <Menu className="h-4 w-4" /> },
  ];
  
  if (!isOpen) return null;
  
  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
    
    // Navigate based on the tab ID
    if (id === 'recommendations') navigate('/for-you');
    else if (id === 'posts') navigate('/posts');
    else if (id === 'shops') navigate('/shops');
    else if (id === 'trending') navigate('/trending');
    else if (id === 'videos') navigate('/videos');
  };

  return (
    <div 
      className="absolute w-full bg-white shadow-md z-20 overflow-hidden transition-all duration-300"
      style={{ 
        maxHeight: isOpen ? '400px' : '0',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div className="p-3 max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {popularCategories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => {
                setIsOpen(false);
                // Navigate to category page
                navigate(`/search?category=${cat.id}`);
              }}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className="p-1.5 bg-white rounded-full mb-2 shadow-sm">
                {cat.icon}
              </div>
              <span className="text-xs text-center">{cat.name}</span>
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1 uppercase font-medium">{t('browseBy', { ns: 'categories' })}</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(id => (
              <button
                key={id}
                className={`px-3 py-2 rounded-md text-sm text-left ${
                  activeTab === id ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50"
                }`}
                onClick={() => handleTabClick(id)}
              >
                {id === 'recommendations' && t('forYou', { ns: 'home' })}
                {id === 'posts' && t('posts', { ns: 'home' })}
                {id === 'shops' && t('shops', { ns: 'home' })}
                {id === 'trending' && t('trending', { ns: 'home' })}
                {id === 'videos' && t('videos', { ns: 'home' })}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPanel;
