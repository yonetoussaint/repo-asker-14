
import React from 'react';
import { useTranslation } from 'react-i18next';
import AliExpressSearchBar from '@/components/shared/AliExpressSearchBar';

interface HeaderSearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  isSearchFocused: boolean;
  handleSearchFocus: () => void;
  handleClearSearch: () => void;
  voiceSearchActive: boolean;
  handleVoiceSearch: () => void;
  isGlowing?: boolean;
}

const HeaderSearchBar = ({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  handleSearchFocus,
  handleClearSearch,
  voiceSearchActive,
  handleVoiceSearch,
  isGlowing = false
}: HeaderSearchBarProps) => {
  const { t } = useTranslation();
  
  return (
    <AliExpressSearchBar
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      placeholder={t('header.search', { ns: 'common' })}
      onFocus={handleSearchFocus}
    />
  );
};

export default HeaderSearchBar;
