import React, { createContext, useContext, useState } from 'react';

interface ScreenOverlayContextType {
  isLanguageScreenOpen: boolean;
  isLocationScreenOpen: boolean;
  isLocationListScreenOpen: boolean;
  isGenericOverlayOpen: boolean; // Add generic overlay state
  locationListScreenData: {
    title: string;
    items: Array<{ code: string; name: string }>;
    onSelect: (item: any) => void;
    searchPlaceholder?: string;
  } | null;
  setLanguageScreenOpen: (open: boolean) => void;
  setLocationScreenOpen: (open: boolean) => void;
  setLocationListScreenOpen: (open: boolean, data?: any) => void;
  setGenericOverlayOpen: (open: boolean) => void; // Add setter
  setHasActiveOverlay: (hasOverlay: boolean) => void; // Add compatibility method
  hasActiveOverlay: boolean;
}

const ScreenOverlayContext = createContext<ScreenOverlayContextType | undefined>(undefined);

export const ScreenOverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLanguageScreenOpen, setIsLanguageScreenOpen] = useState(false);
  const [isLocationScreenOpen, setIsLocationScreenOpen] = useState(false);
  const [isLocationListScreenOpen, setIsLocationListScreenOpen] = useState(false);
  const [isGenericOverlayOpen, setIsGenericOverlayOpen] = useState(false); // Add generic overlay state
  const [locationListScreenData, setLocationListScreenData] = useState<any>(null);

  const setLanguageScreenOpen = (open: boolean) => {
    setIsLanguageScreenOpen(open);
  };

  const setLocationScreenOpen = (open: boolean) => {
    setIsLocationScreenOpen(open);
  };

  const setLocationListScreenOpen = (open: boolean, data?: any) => {
    setIsLocationListScreenOpen(open);
    setLocationListScreenData(open ? data : null);
  };

  const setGenericOverlayOpen = (open: boolean) => {
    setIsGenericOverlayOpen(open);
  };

  // Compatibility method - maps to generic overlay
  const setHasActiveOverlay = (hasOverlay: boolean) => {
    setIsGenericOverlayOpen(hasOverlay);
  };

  const hasActiveOverlay = isLanguageScreenOpen || isLocationScreenOpen || isLocationListScreenOpen || isGenericOverlayOpen;

  return (
    <ScreenOverlayContext.Provider
      value={{
        isLanguageScreenOpen,
        isLocationScreenOpen,
        isLocationListScreenOpen,
        isGenericOverlayOpen, // Add to provider
        locationListScreenData,
        setLanguageScreenOpen,
        setLocationScreenOpen,
        setLocationListScreenOpen,
        setGenericOverlayOpen, // Add to provider
        setHasActiveOverlay, // Add compatibility method
        hasActiveOverlay,
      }}
    >
      {children}
    </ScreenOverlayContext.Provider>
  );
};

export const useScreenOverlay = () => {
  const context = useContext(ScreenOverlayContext);
  if (context === undefined) {
    throw new Error('useScreenOverlay must be used within a ScreenOverlayProvider');
  }
  return context;
};