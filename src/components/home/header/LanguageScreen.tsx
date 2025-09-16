import React, { useState, useMemo } from 'react';
import { Languages, Check, X, HelpCircle, Search, Pin } from 'lucide-react';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface LanguageScreenProps {
  onClose: () => void;
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({ onClose }) => {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguageSwitcher();
  const { t } = useTranslation();
  const [languageQuery, setLanguageQuery] = useState('');
  const [pinnedLanguages, setPinnedLanguages] = useState(new Set(['en', 'es']));

  const handleLanguageSelect = (language: any) => {
    setLanguage(language.code);
    onClose();
  };

  const toggleLanguagePin = (languageCode: string) => {
    setPinnedLanguages((prev) => {
      const newSet = new Set(prev);
      newSet.has(languageCode) ? newSet.delete(languageCode) : newSet.add(languageCode);
      return newSet;
    });
  };

  const filteredLanguages = useMemo(() => {
    const filtered = supportedLanguages.filter((lang) =>
      lang.name.toLowerCase().includes(languageQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(languageQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aPinned = pinnedLanguages.has(a.code);
      const bPinned = pinnedLanguages.has(b.code);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [languageQuery, pinnedLanguages]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white p-3">
        <div className="relative flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute left-0 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{t('header.language', { ns: 'common' })}</h1>
          <button className="absolute right-0 text-gray-600 hover:text-gray-900 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
        <div className="text-center mt-1">
          <p className="text-sm text-gray-500">{t('header.selectLanguage', { ns: 'common' })}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="mt-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder', { ns: 'common' })}
              value={languageQuery}
              onChange={(e) => setLanguageQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            {filteredLanguages.map((language) => (
              <div
                key={language.code}
                className="flex items-center w-full hover:bg-orange-50 rounded-lg text-sm transition-colors border border-transparent hover:border-orange-200"
              >
                <button
                  className="flex items-center justify-between flex-1 p-4"
                  onClick={() => handleLanguageSelect(language)}
                >
                  <div className="flex items-center gap-4">
                    <Languages className="h-5 w-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {language.nativeName}
                        {pinnedLanguages.has(language.code) && (
                          <Pin className="h-3 w-3 text-orange-600 fill-current" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{language.name}</div>
                    </div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <Check className="h-5 w-5 text-orange-600" />
                  )}
                </button>
                <button
                  onClick={() => toggleLanguagePin(language.code)}
                  className={`p-2 mr-2 rounded-md transition-colors ${
                    pinnedLanguages.has(language.code)
                      ? 'text-orange-600 hover:bg-orange-100'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title={pinnedLanguages.has(language.code) ? 'Unpin' : 'Pin'}
                >
                  <Pin className={`h-4 w-4 ${pinnedLanguages.has(language.code) ? 'fill-current' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageScreen;