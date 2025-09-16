
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransferHeader: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  return (
    <div className="bg-white flex items-center p-4 sticky top-0 z-50 shadow-sm">
      <button 
        onClick={handleBackClick}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <ChevronLeft size={20} />
      </button>
      <h1 className="text-xl font-semibold ml-2">Send Money to Haiti</h1>
    </div>
  );
};

export default TransferHeader;
