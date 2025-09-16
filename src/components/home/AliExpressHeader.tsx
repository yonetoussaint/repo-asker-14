import { useState, useRef, useEffect, useCallback } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Home, Search, ShoppingBag, Tv, Sofa, ShoppingCart, Car, Gamepad2 } from 'lucide-react';
import HeaderSearchBar from './header/HeaderSearchBar';
import CategoryTabs from './header/CategoryTabs';
import CategoryPanel from './header/CategoryPanel';
import VoiceSearchOverlay from './header/VoiceSearchOverlay';
import HeaderLanguage from './header/HeaderLanguage';
import NotificationBadge from './header/NotificationBadge';
import HeaderLogoToggle from './header/HeaderLogoToggle';
import HomepageDropdown from './header/HomepageDropdown';
import { useAuthOverlay } from '@/context/AuthOverlayContext';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHomepage } from '@/context/HomepageContext';
import { BookOpen, Heart, Users, TrendingUp, Sparkles, GraduationCap, Briefcase } from 'lucide-react';

interface AliExpressHeaderProps {
  activeTabId?: string;
}

export default function AliExpressHeader({ activeTabId = 'recommendations' }: AliExpressHeaderProps) {
  const { progress } = useScrollProgress();
  const { currentLanguage } = useLanguageSwitcher();
  const { homepageType } = useHomepage();
  const { t } = useTranslation();
  const location = useLocation();

  const HeaderLocation = () => (
    <select className="text-xs border rounded px-2 py-1 bg-white">
      <option>📍 New York</option>
      <option>📍 Los Angeles</option>
      <option>📍 Chicago</option>
      <option>📍 Miami</option>
    </select>
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(activeTabId);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [isSearchGlowing, setIsSearchGlowing] = useState(false);
  const scrollY = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null);

  // Popular searches data (using useRef to prevent recreation on re-renders)
  const popularSearches = useRef([
    "Wireless earbuds",
    "Smart watches",
    "Summer dresses",
    "Phone cases",
    "Home decor",
    "Fitness trackers",
    "LED strip lights"
  ]).current;

  const [currentPopularSearch, setCurrentPopularSearch] = useState(0);
  const [placeholder, setPlaceholder] = useState(popularSearches[0]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const showSearchBarRef = useRef(showSearchBar);

  // Stable scroll handler
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    scrollY.current = currentScrollY;
    
    // Only update state if the threshold is crossed
    if (currentScrollY > 100 && !showSearchBarRef.current) {
      setShowSearchBar(true);
      showSearchBarRef.current = true;
    } else if (currentScrollY <= 100 && showSearchBarRef.current) {
      setShowSearchBar(false);
      showSearchBarRef.current = false;
    }
  }, []);

  // Track scroll position
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Determine if we should show the top bar based on current route
  const isForYouPage = location.pathname === '/for-you' || location.pathname === '/';

  // Determine if we should show icons only in the tabs
  const showIconsOnly = !isForYouPage;

  const categories = [
    { id: 'recommendations', name: t('forYou', { ns: 'home' }), icon: <Home className="h-3 w-3" />, path: '/for-you' },
    { id: 'electronics', name: t('electronics', { ns: 'categories' }), icon: <Tv className="h-3 w-3" />, path: '/categories/electronics' },
    { id: 'home', name: t('homeLiving', { ns: 'categories' }), icon: <Sofa className="h-3 w-3" />, path: '/categories/home-living' },
    { id: 'fashion', name: t('fashion', { ns: 'categories' }), icon: <ShoppingBag className="h-3 w-3" />, path: '/categories/fashion' },
    { id: 'entertainment', name: t('entertainment', { ns: 'categories' }), icon: <Gamepad2 className="h-3 w-3" />, path: '/categories/entertainment' },
    { id: 'kids', name: t('kidsHobbies', { ns: 'categories' }), icon: <ShoppingCart className="h-3 w-3" />, path: '/categories/kids-hobbies' },
    { id: 'sports', name: t('sports', { ns: 'categories' }), icon: <ShoppingBag className="h-3 w-3" />, path: '/categories/sports-outdoors' },
    { id: 'automotive', name: t('automotive', { ns: 'categories' }), icon: <Car className="h-3 w-3" />, path: '/categories/automotive' },
  ];

  const bookCategories = [
    { id: 'foryou', name: 'For You', icon: <Home className="h-3 w-3" />, path: '/for-you' },
    { id: 'fiction', name: 'Fiction', icon: <BookOpen className="h-3 w-3" />, path: '/books/fiction' },
    { id: 'non-fiction', name: 'Non-Fiction', icon: <GraduationCap className="h-3 w-3" />, path: '/books/non-fiction' },
    { id: 'self-help', name: 'Self-Help', icon: <Users className="h-3 w-3" />, path: '/books/self-help' },
    { id: 'business', name: 'Business', icon: <Briefcase className="h-3 w-3" />, path: '/books/business' },
    { id: 'romance', name: 'Romance', icon: <Heart className="h-3 w-3" />, path: '/books/romance' },
    { id: 'fantasy', name: 'Fantasy', icon: <Sparkles className="h-3 w-3" />, path: '/books/fantasy' },
    { id: 'bestsellers', name: 'Bestsellers', icon: <TrendingUp className="h-3 w-3" />, path: '/books/bestsellers' },
  ];

  const currentCategories = homepageType === 'books' ? bookCategories : categories;

  // Update active tab when prop changes or route changes
  useEffect(() => {
    const currentCategory = currentCategories.find(cat => location.pathname === cat.path);
    if (currentCategory) {
      setActiveTab(currentCategory.id);
    } else if (location.pathname === '/' || location.pathname === '/for-you') {
      setActiveTab(homepageType === 'books' ? 'foryou' : 'recommendations');
    }
  }, [activeTabId, location.pathname, currentCategories, homepageType]);

  // Cycle through popular searches
  useEffect(() => {
    if (isSearchFocused) {
      setPlaceholder('Search for products');
      return;
    }

    const interval = setInterval(() => {
      setCurrentPopularSearch((prev) => (prev + 1) % popularSearches.length);
      setPlaceholder(popularSearches[currentPopularSearch]);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isSearchFocused, currentPopularSearch, popularSearches]);

  // Stable tab change handler
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const togglePanel = () => setIsOpen(!isOpen);
  const handleSearchFocus = () => setIsSearchFocused(true);
  const handleClearSearch = () => setSearchQuery('');
  const handleVoiceSearch = () => setVoiceSearchActive(!voiceSearchActive);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header id="ali-header" className="fixed top-0 w-full z-30 bg-white shadow-sm">
    {/* Top Bar - Replace with search bar when scrolled */}
<div 
  className="flex items-center pl-3 pr-3 transition-all duration-500 ease-in-out bg-white"
  style={{ 
    height: '36px',
  }}
>
  {showSearchBar ? (
    <div className="flex-1 relative max-w-md mx-auto" key="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => {
          handleSearchFocus();
          setPlaceholder('Search for products');
        }}
        onBlur={() => {
          setIsSearchFocused(false);
          setPlaceholder(popularSearches[currentPopularSearch]);
        }}
        className="w-full px-3 py-1 text-sm font-medium border-2 border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300 bg-white shadow-sm"
        ref={searchRef}
      />
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600 font-bold" />
    </div>
        ) : (
          <>
            {/* Left: Language */}
            <HeaderLanguage />

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Right: Homepage Dropdown */}
            <div className="flex items-center">
              <HomepageDropdown />
            </div>
          </>
        )}
      </div>

      {/* Category Tabs - Always show */}
      <CategoryTabs 
        progress={1}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        categories={currentCategories}
      />

      {/* Category Panel - Always show */}
      <CategoryPanel 
        progress={1}
        isOpen={isOpen}
        activeTab={activeTab}
        categories={currentCategories.map(cat => cat.id)}
        setActiveTab={setActiveTab}
        setIsOpen={setIsOpen}
      />

      {/* Voice Search Overlay */}
      <VoiceSearchOverlay
        active={voiceSearchActive}
        onCancel={handleVoiceSearch}
      />
    </header>
  );
}