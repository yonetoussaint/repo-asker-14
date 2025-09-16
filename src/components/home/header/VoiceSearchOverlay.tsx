
import React from 'react';
import { Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VoiceSearchOverlayProps {
  active: boolean;
  onCancel: () => void;
}

const VoiceSearchOverlay = ({ active, onCancel }: VoiceSearchOverlayProps) => {
  const { t } = useTranslation();
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-4 rounded-xl w-64 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2 animate-pulse">
          <Mic className="h-6 w-6 text-orange-500" />
        </div>
        <p className="text-sm mb-1">Listening...</p>
        <p className="text-xs text-gray-500 mb-2">Speak now to search</p>
        <button
          className="text-xs px-4 py-1 bg-orange-500 text-white rounded-full"
          onClick={onCancel}
        >
          {t('header.voiceSearchCancel')}
        </button>
      </div>
    </div>
  );
};

export default VoiceSearchOverlay;
