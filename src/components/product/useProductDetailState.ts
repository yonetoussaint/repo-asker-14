import { useState, useRef, useCallback, useEffect } from "react";

export const useProductDetailState = (product: any) => {
  // State management
  const [activeSection, setActiveSection] = useState("overview");
  const [activeTab, setActiveTab] = useState("overview");
  const [focusMode, setFocusMode] = useState(false);
  const [showHeaderInFocus, setShowHeaderInFocus] = useState(false);
  const [productDetailsSheetOpen, setProductDetailsSheetOpen] = useState(false);
  const [showStickyRecommendations, setShowStickyRecommendations] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [headerHeight, setHeaderHeight] = useState(44);
  const [sharePanelOpen, setSharePanelOpen] = useState(false);

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const imageGalleryRef = useRef<any>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const verticalRecommendationsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<any>(null);
  const focusModeRef = useRef(focusMode);
  const prevFocusModeRef = useRef(focusMode);

  // Initialize display images with product images
  useEffect(() => {
    const imgs = product?.product_images?.map((img: any) => img.src) || [];
    if (imgs.length > 0) {
      setDisplayImages(imgs);
    }
  }, [product?.product_images]);

  // Keep track of current focusMode in a ref for stable event handlers
  useEffect(() => {
    focusModeRef.current = focusMode;
  }, [focusMode]);

  // Push a history state entry when entering focus mode
  useEffect(() => {
    if (!prevFocusModeRef.current && focusMode) {
      try {
        history.pushState({ focusOverlay: true }, '');
      } catch {}
    }
    prevFocusModeRef.current = focusMode;
  }, [focusMode]);

  // Global back-button handler: if in focus mode, exit it
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      if (focusModeRef.current) {
        setFocusMode(false);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [setFocusMode]);

  // Function to handle tab changes
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    if (imageGalleryRef.current && imageGalleryRef.current.setActiveTab) {
      imageGalleryRef.current.setActiveTab(tab);
    }
  }, []);

  // Handle variant image selection
  const handleVariantImageSelection = useCallback((imageUrl: string, variantName?: string) => {
    console.log('📷 Variant image selected in ProductDetail:', imageUrl, variantName);
  }, []);

  // Scroll to section function
  const scrollToSection = useCallback((section: string) => {
    const refs = {
      overview: overviewRef,
      description: descriptionRef
    };

    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      const yOffset = -120;
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveSection(section);
  }, []);

  return {
    state: {
      activeSection,
      activeTab,
      focusMode,
      showHeaderInFocus,
      productDetailsSheetOpen,
      showStickyRecommendations,
      currentImageIndex,
      totalImages,
      displayImages,
      headerHeight,
      sharePanelOpen,
      setActiveSection,
      setActiveTab,
      setFocusMode,
      setShowHeaderInFocus,
      setProductDetailsSheetOpen,
      setShowStickyRecommendations,
      setCurrentImageIndex,
      setTotalImages,
      setDisplayImages,
      setHeaderHeight,
      setSharePanelOpen
    },
    refs: {
      headerRef,
      imageGalleryRef,
      contentRef,
      overviewRef,
      descriptionRef,
      recommendationsRef,
      verticalRecommendationsRef,
      galleryRef
    },
    handlers: {
      handleTabChange,
      handleVariantImageSelection,
      scrollToSection
    }
  };
};