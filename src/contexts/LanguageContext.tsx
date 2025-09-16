import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  translateText: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const translateText = (key: string, fallback?: string) => {
    // Simple implementation - in real app would use proper translation
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      currentLanguage: language,
      setCurrentLanguage: setLanguage,
      translateText
    }}>
      {children}
    </LanguageContext.Provider>
  );
};