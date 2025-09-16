import React, { useState } from 'react';
import { ChevronRight, Languages, Globe } from 'lucide-react';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { useScreenOverlay } from '@/context/ScreenOverlayContext';
import LanguageScreen from './LanguageScreen';
import LocationScreen from './LocationScreen';

const HeaderLanguage = () => {
  const { currentLanguage, currentLocation } = useLanguageSwitcher();
  const { 
    isLanguageScreenOpen, 
    isLocationScreenOpen, 
    setLanguageScreenOpen, 
    setLocationScreenOpen 
  } = useScreenOverlay();

  const handleOpenLanguageScreen = () => {
    setLanguageScreenOpen(true);
  };

  const handleOpenLocationScreen = () => {
    setLocationScreenOpen(true);
  };

  const handleCloseLanguageScreen = () => {
    setLanguageScreenOpen(false);
  };

  const handleCloseLocationScreen = () => {
    setLocationScreenOpen(false);
  };

  if (isLanguageScreenOpen) {
    return <LanguageScreen onClose={handleCloseLanguageScreen} />;
  }

  if (isLocationScreenOpen) {
    return <LocationScreen onClose={handleCloseLocationScreen} />;
  }

  return (
    <div className="flex items-center bg-white shadow-sm">
      <button 
        className="flex items-center pr-4 py-2 space-x-2 hover:bg-orange-50 transition-colors"
        onClick={handleOpenLanguageScreen}
      >
        <Languages className="h-4 w-4 text-orange-600" />
        <span className="text-gray-800 text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
      </button>
      <div className="w-px h-4 bg-gray-300"></div>
      <button 
        className="flex items-center px-4 py-2 space-x-2 hover:bg-orange-50 transition-colors"
        onClick={handleOpenLocationScreen}
      >
        {currentLocation.flag ? (
          <img
            src={`https://flagcdn.com/${currentLocation.flag.toLowerCase()}.svg`}
            alt={currentLocation.name}
            className="h-4 w-4 rounded-full object-cover"
          />
        ) : (
          <Globe className="h-4 w-4 text-orange-600" />
        )}
        <span className="text-gray-800 text-sm">{currentLocation.name.split(',')[0]}</span>
      </button>
      <ChevronRight className="h-4 w-4 text-gray-500 ml-2" />
    </div>
  );
};

export default HeaderLanguage;