import React from 'react';
import { X, HelpCircle } from 'lucide-react';

interface UnifiedHeaderProps {
  title: string;
  onClose?: () => void;
  onHelp?: () => void;
  showCloseButton?: boolean;
  showHelpButton?: boolean;
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  className?: string;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  title,
  onClose,
  onHelp,
  showCloseButton = true,  
  showHelpButton = true,
  leftButton,
  rightButton,
  className = ""
}) => {
  return (
    <div className={`bg-white p-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex-shrink-0">
          {leftButton || (
            showCloseButton && onClose && (
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )
          )}
        </div>

        {/* Center - Title */}
        <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center px-4">
          {title}
        </h1>

        {/* Right side */}
        <div className="flex-shrink-0">
          {rightButton || (
            showHelpButton && (
              <button 
                onClick={onHelp}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <HelpCircle className="h-6 w-6" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedHeader;