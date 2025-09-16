
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface Location {
  code: string;
  name: string;
  flag: string;
}

export interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  currentLocation: Location;
  setLocation: (location: Location) => void;
  t: (key: string, params?: Record<string, string>) => string;
}
