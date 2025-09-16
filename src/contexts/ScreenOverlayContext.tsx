import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScreenOverlayContextType {
  hasActiveOverlay: boolean;
  setHasActiveOverlay: (hasOverlay: boolean) => void;
}

const ScreenOverlayContext = createContext<ScreenOverlayContextType | undefined>(undefined);

export const ScreenOverlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hasActiveOverlay, setHasActiveOverlay] = useState(false);

  return (
    <ScreenOverlayContext.Provider value={{ hasActiveOverlay, setHasActiveOverlay }}>
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