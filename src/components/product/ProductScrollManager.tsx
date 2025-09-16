// components/product/ProductScrollManager.tsx
import React, { useEffect } from 'react';

interface ProductScrollManagerProps {
  focusMode: boolean;
  setFocusMode: (mode: boolean) => void;
  setShowHeaderInFocus: (show: boolean) => void;
  setShowStickyRecommendations: (show: boolean) => void;
  setActiveSection: (section: string) => void;
  setActiveTab: (tab: string) => void; // Added to sync tabs
  setHeaderHeight: (height: number) => void;
  headerRef: React.RefObject<HTMLDivElement>;
  overviewRef: React.RefObject<HTMLDivElement>;
  descriptionRef: React.RefObject<HTMLDivElement>;
  verticalRecommendationsRef: React.RefObject<HTMLDivElement>;
}

const ProductScrollManager: React.FC<ProductScrollManagerProps> = ({
  focusMode,
  setFocusMode,
  setShowHeaderInFocus,
  setShowStickyRecommendations,
  setActiveSection,
  setActiveTab, // Added prop
  setHeaderHeight,
  headerRef,
  overviewRef,
  descriptionRef,
  verticalRecommendationsRef
}) => {
  // Measure header height
  useEffect(() => {
    const measureHeaderHeight = () => {
      if (headerRef.current) {
        const headerMainContent = headerRef.current.querySelector('[class*="py-2"]');
        if (headerMainContent) {
          const height = headerMainContent.getBoundingClientRect().height;
          setHeaderHeight(height);
          document.documentElement.style.setProperty('--header-height', `${height}px`);
        }
      }
    };

    measureHeaderHeight();
    window.addEventListener('resize', measureHeaderHeight);
    return () => window.removeEventListener('resize', measureHeaderHeight);
  }, [headerRef, setHeaderHeight]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      // Handle sticky recommendations
      if (verticalRecommendationsRef.current) {
        const headerRect = verticalRecommendationsRef.current.getBoundingClientRect();
        setShowStickyRecommendations(headerRect.bottom <= 160);
      }

      // Handle focus mode
      if (focusMode && window.scrollY > 100) {
        setFocusMode(false);
      }
      if (focusMode && window.scrollY <= 50) {
        setShowHeaderInFocus(false);
      }

      // Handle section detection and sync tabs
      if (descriptionRef.current && scrollPosition >= descriptionRef.current.offsetTop) {
        setActiveSection("description");
        setActiveTab("description"); // Sync the tab
      } else if (overviewRef.current && scrollPosition >= overviewRef.current.offsetTop) {
        setActiveSection("overview");
        setActiveTab("overview"); // Sync the tab
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [focusMode, setFocusMode, setShowHeaderInFocus, setShowStickyRecommendations, setActiveSection, setActiveTab, verticalRecommendationsRef, descriptionRef, overviewRef]);

  return null;
};

export default ProductScrollManager;