
import React from 'react';
import { COMMON_DOMAINS } from '../../constants/auth/email';

interface DomainSuggestionsProps {
  show: boolean;
  onDomainClick: (domain: string) => void;
  isLoading: boolean;
}

const DomainSuggestions: React.FC<DomainSuggestionsProps> = ({
  show,
  onDomainClick,
  isLoading,
}) => {
  if (!show) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {COMMON_DOMAINS.map((domainOption) => (
        <button
          key={domainOption}
          type="button"
          onClick={() => onDomainClick(domainOption)}
          disabled={isLoading}
          className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          @{domainOption}
        </button>
      ))}
    </div>
  );
};

export default DomainSuggestions;
