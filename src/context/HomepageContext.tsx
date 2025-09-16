import React, { createContext, useContext, useState, useEffect } from 'react';

type HomepageType = 'marketplace' | 'books';

interface HomepageContextType {
  homepageType: HomepageType;
  setHomepageType: (type: HomepageType) => void;
}

const HomepageContext = createContext<HomepageContextType | undefined>(undefined);

export const HomepageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [homepageType, setHomepageTypeState] = useState<HomepageType>('books');

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('homepage-preference');
    if (saved === 'books' || saved === 'marketplace') {
      setHomepageTypeState(saved);
    } else {
      setHomepageTypeState('books');
    }
  }, []);

  // Save preference to localStorage when changed
  const setHomepageType = (type: HomepageType) => {
    setHomepageTypeState(type);
    localStorage.setItem('homepage-preference', type);
  };

  return (
    <HomepageContext.Provider value={{ homepageType, setHomepageType }}>
      {children}
    </HomepageContext.Provider>
  );
};

export const useHomepage = () => {
  const context = useContext(HomepageContext);
  if (context === undefined) {
    throw new Error('useHomepage must be used within a HomepageProvider');
  }
  return context;
};