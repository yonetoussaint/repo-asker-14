import { useTranslation } from 'react-i18next';
import { Language, Location } from '@/types/language';

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'us' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'es' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'fr' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: 'ht' },
];

export const supportedLocations: Location[] = [
  { code: 'US', name: 'United States', flag: 'us' },
  { code: 'HT', name: 'Haiti', flag: 'ht' },
  { code: 'CA', name: 'Canada', flag: 'ca' },
  { code: 'FR', name: 'France', flag: 'fr' },
  { code: 'ES', name: 'Spain', flag: 'es' },
];

export const useLanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const getCurrentLanguage = (): Language => {
    return supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0];
  };

  const setLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  // For location, we'll still use localStorage since it's not really part of i18n
  const getCurrentLocation = (): Location => {
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
  };

  const setLocation = (location: Location) => {
    localStorage.setItem('preferredLocation', JSON.stringify(location));
  };

  return {
    currentLanguage: getCurrentLanguage(),
    setLanguage,
    currentLocation: getCurrentLocation(),
    setLocation,
    supportedLanguages,
    supportedLocations
  };
};