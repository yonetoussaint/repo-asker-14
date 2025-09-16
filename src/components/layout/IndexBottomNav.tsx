import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Zap, Rss, Wallet, Tv, LayoutGrid, X, MoreHorizontal,
  Settings, Bell, Bookmark, Star, Users, ShoppingBag, ChevronDown, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ProductUploadOverlay from '@/components/product/ProductUploadOverlay';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SimpleAuthPage from '@/pages/SimpleAuthPage';
import SignInBanner from './SignInBanner';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useScreenOverlay } from '@/context/ScreenOverlayContext';
import Logo from '@/components/home/Logo';
import { useTranslation } from 'react-i18next';

interface BottomNavTab {
  id: string;
  nameKey: string;
  icon: React.FC<any> | React.ForwardRefExoticComponent<any>;
  path: string;
  isAvatar?: boolean;
  badge?: number;
}

const navItems: BottomNavTab[] = [
  { id: 'home', nameKey: 'navigation.home', icon: Logo, path: '/for-you' }, 
  { id: 'shorts', nameKey: 'navigation.shorts', icon: Zap, path: '/reels' },
  { id: 'categories', nameKey: 'navigation.categories', icon: LayoutGrid, path: '/posts' },
  { id: 'wallet', nameKey: 'navigation.wallet', icon: Wallet, path: '/wallet' },
  { id: 'account', nameKey: 'navigation.account', icon: User, path: '/profile' },
  { id: 'videos', nameKey: 'navigation.videos', icon: Tv, path: '/videos' },
  { id: 'notifications', nameKey: 'navigation.notifications', icon: Bell, path: '/notifications', badge: 12 },
  { id: 'bookmarks', nameKey: 'navigation.bookmarks', icon: Bookmark, path: '/bookmarks' },
  { id: 'friends', nameKey: 'navigation.friends', icon: Users, path: '/friends', badge: 3 },
  { id: 'shopping', nameKey: 'navigation.shopping', icon: ShoppingBag, path: '/shopping' },
  { id: 'settings', nameKey: 'navigation.settings', icon: Settings, path: '/settings' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { hasActiveOverlay } = useScreenOverlay(); // Use the context
  const { t } = useTranslation('home');

  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [showProductUpload, setShowProductUpload] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showSignInBanner, setShowSignInBanner] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [reorderedNavItems, setReorderedNavItems] = useState(navItems);
  const [selectedMoreItem, setSelectedMoreItem] = useState(() => t('navigation.more'));

  // Load selected more item from localStorage on mount
  useEffect(() => {
    const savedSelectedItem = localStorage.getItem('selectedMoreItem');
    if (savedSelectedItem) {
      setSelectedMoreItem(savedSelectedItem);
    }
  }, []);

  // Listen for localStorage changes to update the button text and icon
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSelectedItem = localStorage.getItem('selectedMoreItem');
      if (savedSelectedItem) {
        setSelectedMoreItem(savedSelectedItem);
      }
    };

    // Check for changes periodically
    const interval = setInterval(handleStorageChange, 100);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // Overflow management - show 5 items total
  const MAX_VISIBLE_ITEMS = 5;
  const visibleItems = reorderedNavItems.slice(0, MAX_VISIBLE_ITEMS);
  const hiddenItems = reorderedNavItems.slice(MAX_VISIBLE_ITEMS);
  const showMoreButton = false; // Disable the overflow more button since we have a dedicated More button

  // Function to swap a hidden item to visible position
  const swapItemToVisible = (selectedItem) => {
    const newNavItems = [...reorderedNavItems];
    const selectedIndex = newNavItems.findIndex(item => item.id === selectedItem.id);
    const lastVisibleIndex = MAX_VISIBLE_ITEMS - 2; // -2 because we need space for More button

    if (selectedIndex > lastVisibleIndex) {
      // Remove the selected item from its current position
      const [movedItem] = newNavItems.splice(selectedIndex, 1);
      // Insert it at the last visible position
      newNavItems.splice(lastVisibleIndex, 0, movedItem);
      setReorderedNavItems(newNavItems);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    const savedSelectedItem = localStorage.getItem('selectedMoreItem');

    if (path.startsWith('/for-you')) setActiveTab('home');
    else if (path.startsWith('/shorts')) setActiveTab('shorts');
    else if (path.startsWith('/posts')) setActiveTab('categories');
    else if (path.startsWith('/wallet')) setActiveTab('wallet');
    else if (path.startsWith('/videos')) setActiveTab('videos');
    else if (path.startsWith('/profile')) setActiveTab('account');
    // Handle more menu items - check if current path matches a more menu item
    else if (path.startsWith('/notifications') || 
             path.startsWith('/bookmarks') || 
             path.startsWith('/friends') || 
             path.startsWith('/shopping') || 
             path.startsWith('/settings') ||
             path.startsWith('/transfer') ||
             path.startsWith('/topup') ||
             path.startsWith('/netflix') ||
             path.startsWith('/paypal-checkout') ||
              path.startsWith('/favorites')) {
      // For these routes, don't set any tab as active since there's no more menu
      setActiveTab('');
    }
  }, [location.pathname]);

  const handleTabClick = (item) => {
    if (animating) return;

    // If clicking the same item that's already active, do nothing
    if (item.id === activeTab) return;

    setAnimating(true);
    setPreviousTab(activeTab);
    setActiveTab(item.id);
    navigate(item.path);
    setShowMoreMenu(false); // Close more menu when selecting an item

    // If the clicked item is from the dropdown (hidden items), swap it with the last visible item
    if (hiddenItems.some(hiddenItem => hiddenItem.id === item.id)) {
      swapItemToVisible(item);
    }

    setTimeout(() => {
      setAnimating(false);
      setPreviousTab(null);
    }, 300);
  };

  const handleMoreClick = () => {
    const savedSelectedItem = localStorage.getItem('selectedMoreItem');

    // If a more item has been selected and is not the default "More"
    if (savedSelectedItem && savedSelectedItem !== t('navigation.more')) {
      const selectedItem = navItems.find(item => t(item.nameKey) === savedSelectedItem);

      if (selectedItem) {
        // If we're currently on the selected item's route, go to more menu
        if (location.pathname.startsWith(selectedItem.path.split('?')[0])) {
          navigate('/more-menu');
        } else {
          // If we're on a different route, go to the selected item
          navigate(selectedItem.path);
        }
        return;
      }
    }

    // Default behavior: go to more menu
    navigate('/more-menu');
  };

  const handleMoreItemSelect = (itemName) => {
    setSelectedMoreItem(itemName);
  };

  const MoreMenu = () => (
    <AnimatePresence>
      {showMoreMenu && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full right-2 mb-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg py-2 min-w-48"
        >
          {hiddenItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors ${
                  isActive ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="relative flex items-center">
                  {item.isAvatar && user ? (
                    <Avatar className="w-5 h-5 border mr-3">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="User" />
                      <AvatarFallback className="text-xs">{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Icon className="w-5 h-5 mr-3" />
                  )}
                  <span className="font-medium">{t(item.nameKey)}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Don't render if overlay screens are active
  if (hasActiveOverlay) {
    return null;
  }

  // Don't show SignInBanner on reels route
  const shouldShowSignInBanner = showSignInBanner && !location.pathname.startsWith('/reels');

  return (
    <>
      {shouldShowSignInBanner && <SignInBanner />}

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="w-full max-w-sm p-0 h-[100dvh] sm:h-auto overflow-auto">
          <button 
            onClick={() => setShowAuthDialog(false)}
            className="absolute left-4 top-4 z-50 rounded-sm opacity-70 text-white bg-gray-800/40 hover:bg-gray-700/40 transition-opacity p-1"
          >
            <X className="h-4 w-4" />
          </button>
          <SimpleAuthPage isOverlay onClose={() => setShowAuthDialog(false)} />
        </DialogContent>
      </Dialog>

      <ProductUploadOverlay
        isOpen={showProductUpload}
        onClose={() => setShowProductUpload(false)}
      />

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex justify-between items-center h-12 px-2 max-w-md mx-auto relative">
          {/* Render visible items */}
          {visibleItems.map((item) => {
            const Icon = item.icon;
            // Visible items should only be active if the activeTab is exactly their ID
            // AND the activeTab is not in hiddenItems
            const isActive = activeTab === item.id && !hiddenItems.some(hiddenItem => hiddenItem.id === activeTab);
            const wasActive = previousTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={cn(
                  'flex items-center justify-center relative transition-all duration-300 ease-out transform px-3 py-1 rounded-full',
                  isActive
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : wasActive
                      ? 'scale-95 text-gray-500'
                      : 'scale-100 text-gray-500'
                )}
              >
                <div className="relative flex items-center justify-center">
                  {item.isAvatar && user ? (
                    <Avatar className="w-5 h-5 border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt="User" />
                      <AvatarFallback className="text-xs">{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                   ) : (
                   <Icon
                      className={cn(
                        'transition-transform duration-300',
                        'w-5 h-5',
                        isActive ? 'scale-110' : 'scale-100'
                      )}
                      width={20}
                      height={20}
                    />
                  )}
                  {item.badge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full"
                    >
                      {item.badge}
                    </motion.div>
                  )}
                  {isActive && (
                    <span className="ml-2 font-medium whitespace-nowrap max-w-[80px] overflow-hidden">
                      {t(item.nameKey)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* More button when there are hidden items */}
          {showMoreButton && (
            <div className="relative">
              <MoreMenu />
              <button
                onClick={handleMoreClick}
                className={cn(
                  'flex items-center justify-center relative transition-all duration-300 ease-out transform px-3 py-1 rounded-full',
                  activeTab === 'more'
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : 'scale-100 text-gray-500'
                )}
              >
                <div className="relative flex items-center justify-center">
                  <LayoutGrid
                    className={cn(
                      'transition-transform duration-300',
                      'w-4 h-4 mr-1',
                      activeTab === 'more' ? 'scale-110' : 'scale-100'
                    )}
                    width={16}
                    height={16}
                  />
                  <ChevronDown
                    className={cn(
                      'transition-transform duration-300',
                      'w-3 h-3',
                      activeTab === 'more' ? 'scale-110' : 'scale-100'
                    )}
                    width={12}
                    height={12}
                  />
                  {/* Show total badges from hidden items */}
                  {hiddenItems.some(item => item.badge) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full"
                    >
                      {hiddenItems.reduce((total, item) => {
                        const badgeNum = item.badge || 0;
                        return total + badgeNum;
                      }, 0)}
                    </motion.div>
                  )}
                  {activeTab === 'more' && (
                    <span className="ml-2 font-medium whitespace-nowrap max-w-[80px] overflow-hidden">
                      {selectedMoreItem}
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}