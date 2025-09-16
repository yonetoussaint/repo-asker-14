import React, { useState, useMemo } from 'react';
import { X, Search, HelpCircle, ChevronRight } from 'lucide-react';
import UnifiedHeader from '@/components/shared/UnifiedHeader';
import { useTranslation } from 'react-i18next';


interface LocationListScreenProps {
  title: string;
  items: Array<{ code: string; name: string }>;
  onSelect: (item: any) => void;
  onClose: () => void;
  searchPlaceholder?: string;
}

const LocationListScreen: React.FC<LocationListScreenProps> = ({
  title,
  items,
  onSelect,
  onClose,
  searchPlaceholder
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
      {/* Header */}
<UnifiedHeader
  title={title}
  onClose={onClose}
/>

      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={searchPlaceholder || t('searchPlaceholder', { ns: 'location' })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <button
              key={item.code}
              onClick={() => onSelect(item)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-100 transition-colors"
            >
              <span className="text-gray-900 text-left">{item.name}</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="h-12 w-12" />
            </div>
            <p className="text-gray-500 text-center">{t('common.noResults')}</p>
            <p className="text-gray-400 text-sm text-center mt-1">
              {t('common.tryAdjustingSearch')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationListScreen;