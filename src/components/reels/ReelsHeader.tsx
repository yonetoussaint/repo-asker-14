import React, { useState } from 'react';
import { Search, Radio, X } from 'lucide-react';

interface ReelsHeaderProps {
  isModalMode?: boolean;
  onClose?: () => void;
}

export const ReelsHeader: React.FC<ReelsHeaderProps> = ({ isModalMode = false, onClose }) => {
  const [activeTab, setActiveTab] = useState('forYou');

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] w-full flex justify-between items-center px-4 pt-1 pb-2 bg-gradient-to-b from-black/50 to-transparent">
      {isModalMode ? (
        <button 
          onClick={onClose} 
          className="text-white p-2 hover:bg-white/20 rounded-full transition-colors relative z-[70]"
        >
          <X className="h-6 w-6" />
        </button>
      ) : (
        <div className="w-6"></div>
      )}
      
      <div className="flex">
        <div 
          className={`px-3 py-2 text-sm font-bold relative ${
            activeTab === 'forYou' ? 'text-white' : 'text-white/50'
          }`}
          onClick={() => setActiveTab('forYou')}
        >
          For You
          {activeTab === 'forYou' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white"></div>
          )}
        </div>
        
        <div 
          className={`px-3 py-2 text-sm font-bold relative ${
            activeTab === 'following' ? 'text-white' : 'text-white/50'
          }`}
          onClick={() => setActiveTab('following')}
        >
          Following
          {activeTab === 'following' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white"></div>
          )}
        </div>
        
        <div 
          className={`px-3 py-2 text-sm font-bold relative flex items-center gap-1 ${
            activeTab === 'live' ? 'text-red-500' : 'text-red-400/80'
          }`}
          onClick={() => setActiveTab('live')}
        >
          <Radio className="h-4 w-4" />
          Live
          {activeTab === 'live' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-red-500"></div>
          )}
        </div>
      </div>
      
      <button className="text-white p-1">
        <Search className="h-6 w-6" />
      </button>
    </div>
  );
};