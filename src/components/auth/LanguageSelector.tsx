
import React, { useState, useEffect } from 'react';
import { Languages, ChevronDown, X, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Language {
  code: string;
  name: string;
  country: string;
  countryName: string;
}

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, setSelectedLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentLanguage } = useLanguage();

  // Sync the context with the prop on mount and when selectedLanguage changes
  useEffect(() => {
    setCurrentLanguage(selectedLanguage);
  }, [selectedLanguage, setCurrentLanguage]);

  const languages: Language[] = [
    { code: 'ht', name: 'Kreyòl Ayisyen', country: 'HT', countryName: 'Haiti' },
    { code: 'fr', name: 'Français', country: 'FR', countryName: 'France' },
    { code: 'en', name: 'English', country: 'US', countryName: 'United States' },
    { code: 'es', name: 'Español', country: 'ES', countryName: 'Spain' },
    { code: 'pt', name: 'Português', country: 'PT', countryName: 'Portugal' },
  ];

  const currentLang = languages.find(lang => lang.code === selectedLanguage);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    setCurrentLanguage(langCode);
    setIsOpen(false);
    console.log('Language changed to:', langCode);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors active:scale-98"
      >
        <Languages className="w-5 h-5 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{currentLang?.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 animate-slide-up shadow-2xl">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Language</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto pb-6">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className="flex items-center w-full px-6 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
                >
                  <img 
                    src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/${lang.country.toLowerCase()}.svg`}
                    alt={`${lang.name} flag`}
                    className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                  />
                  <div className="flex flex-col items-start flex-1 ml-4">
                    <span className="text-gray-800 font-medium">{lang.name}</span>
                    <span className="text-gray-500 text-sm">{lang.countryName}</span>
                  </div>
                  {lang.code === selectedLanguage && (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white stroke-2" />
                    </div>
                  )}
                  {lang.code !== selectedLanguage && (
                    <div className="w-6 h-6 flex-shrink-0"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};

export default LanguageSelector;
