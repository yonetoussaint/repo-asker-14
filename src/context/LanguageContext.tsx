
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language, Location, LanguageContextType } from '@/types/language';
import { translations } from '@/translations';

// Supported languages (English, Spanish, French, Haitian Creole)
export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'us' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'es' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'fr' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: 'ht' },
];

// Supported locations (United States, Haiti, Canada, France, Spain)
export const supportedLocations: Location[] = [
  { code: 'US', name: 'United States', flag: 'us' },
  { code: 'HT', name: 'Haiti', flag: 'ht' },
  { code: 'CA', name: 'Canada', flag: 'ca' },
  { code: 'FR', name: 'France', flag: 'fr' },
  { code: 'ES', name: 'Spain', flag: 'es' },
];

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get stored preferences or use defaults
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
      return JSON.parse(storedLanguage) as Language;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    const detectedLang = supportedLanguages.find(lang => lang.code === browserLang);
    
    return detectedLang || supportedLanguages[0];
  });
  
  const [currentLocation, setCurrentLocation] = useState<Location>(() => {
    const storedLocation = localStorage.getItem('preferredLocation');
    if (storedLocation) {
      const parsed = JSON.parse(storedLocation) as Location;
      // If stored location is not Haiti, reset to default
      if (!parsed.code.startsWith('HT')) {
        localStorage.removeItem('preferredLocation');
        return { 
          code: 'HT-OU', 
          name: 'Pétionville, Ouest, Haiti', 
          flag: 'ht' 
        };
      }
      return parsed;
    }
    
    // Default to Port-au-Prince, Petionville, Haiti
    return { 
      code: 'HT-OU', 
      name: 'Pétionville, Ouest, Haiti', 
      flag: 'ht' 
    };
  });
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('preferredLanguage', JSON.stringify(currentLanguage));
    document.documentElement.lang = currentLanguage.code;
    
    // Force a re-render of all components that use the translation function
    // This is a trick to make sure components update when language changes
    const event = new Event('languageChange');
    window.dispatchEvent(event);
  }, [currentLanguage]);
  
  useEffect(() => {
    localStorage.setItem('preferredLocation', JSON.stringify(currentLocation));
  }, [currentLocation]);
  
  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    document.documentElement.lang = language.code;
  };
  
  const setLocation = (location: Location) => {
    setCurrentLocation(location);
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>) => {
    // Get translations for current language
    const currentTranslations = translations[currentLanguage.code] || translations.en;
    
    // Get the translation string
    let parts = key.split('.');
    let translatedText: any = currentTranslations;
    
    // Traverse the translations object to find the right key
    for (let part of parts) {
      if (translatedText && typeof translatedText === 'object' && part in translatedText) {
        translatedText = translatedText[part];
      } else {
        // If key doesn't exist in current language, try English as fallback
        if (currentLanguage.code !== 'en') {
          let fallback = translations.en;
          for (let p of parts) {
            if (fallback && typeof fallback === 'object' && p in fallback) {
              fallback = fallback[p];
            } else {
              fallback = null;
              break;
            }
          }
          translatedText = fallback || key;
        } else {
          translatedText = key;
        }
        break;
      }
    }
    
    // Replace parameters if provided
    if (params && typeof translatedText === 'string') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translatedText = translatedText.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
      });
    }
    
    return typeof translatedText === 'string' ? translatedText : key;
  };
  
  // Listen for language changes and force a re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      // This is just to force components to re-render
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);
  
  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, currentLocation, setLocation, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
