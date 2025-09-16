import React from 'react';
import { ChevronDown, Store, BookOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHomepage } from '@/context/HomepageContext';

const HomepageDropdown = () => {
  const { homepageType, setHomepageType } = useHomepage();

  const options = [
    {
      value: 'marketplace' as const,
      label: 'Marketplace Homepage',
      icon: <Store className="h-4 w-4" />,
    },
    {
      value: 'books' as const,
      label: 'Books Homepage',
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  const currentOption = options.find(option => option.value === homepageType);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
          {currentOption?.icon}
          <span className="hidden sm:inline-block font-medium text-gray-700">
            {currentOption?.label.split(' ')[0]}
          </span>
          <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={`flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
              homepageType === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
            onClick={() => setHomepageType(option.value)}
          >
            {option.icon}
            <span className="font-medium">{option.label}</span>
            {homepageType === option.value && (
              <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HomepageDropdown;