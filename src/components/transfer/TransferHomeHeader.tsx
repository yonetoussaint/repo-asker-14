
import React from 'react';
import { ChevronLeft, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransferHomeHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/for-you');
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-1">
        <div className="flex items-center justify-between h-10">
          {/* Back button */}
          <button 
            onClick={handleBackClick}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          {/* Title */}
          <h1 className="text-base font-semibold text-gray-900">Global Transfer</h1>

          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <Settings className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferHomeHeader;
