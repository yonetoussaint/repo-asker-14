import React from 'react';

interface SearchInfoHeaderProps {
  title?: string;
  className?: string;
}

const SearchInfoHeader: React.FC<SearchInfoHeaderProps> = ({
  title = "Looking for specific info?",
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 mb-4 ${className}`}>
      <div className="relative">
        <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
      </div>
      <h1 className="text-xl font-semibold text-gray-900">
        {title}
      </h1>
    </div>
  );
};

export default SearchInfoHeader;