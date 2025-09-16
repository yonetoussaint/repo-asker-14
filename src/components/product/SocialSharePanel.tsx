import React from 'react';
import { X, MessageCircle, Link, Send, Facebook, Mail, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SocialSharePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

const SocialSharePanel: React.FC<SocialSharePanelProps> = ({ 
  open, 
  onOpenChange, 
  product 
}) => {
  const shareUrl = window.location.href;
  const productName = product?.name || "Check out this product";

  const shareOptions = [
    {
      icon: (
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" fill="currentColor" />
        </div>
      ),
      label: 'WhatsApp',
      onClick: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${productName} ${shareUrl}`)}`, '_blank');
      }
    },
    {
      icon: (
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      ),
      label: 'SMS',
      onClick: () => {
        window.open(`sms:?body=${encodeURIComponent(`${productName} ${shareUrl}`)}`, '_blank');
      }
    },
    {
      icon: (
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <Link className="w-6 h-6 text-white" />
        </div>
      ),
      label: 'Copy link',
      onClick: () => {
        navigator.clipboard.writeText(shareUrl);
      }
    },
    {
      icon: (
        <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center">
          <Send className="w-6 h-6 text-white" />
        </div>
      ),
      label: 'Telegram',
      onClick: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(productName)}`, '_blank');
      }
    },
    {
      icon: (
        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center">
          <div className="text-blue-600 font-bold text-sm">f</div>
        </div>
      ),
      label: 'Lite',
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    },
    {
      icon: (
        <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-white" />
        </div>
      ),
      label: 'Email',
      onClick: () => {
        window.open(`mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(`Check this out: ${shareUrl}`)}`, '_blank');
      }
    },
    {
      icon: (
        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-purple-600 rounded"></div>
          </div>
        </div>
      ),
      label: 'Viber',
      onClick: () => {
        window.open(`viber://forward?text=${encodeURIComponent(`${productName} ${shareUrl}`)}`, '_blank');
      }
    },
    {
      icon: (
        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 text-white font-bold text-xs">R</div>
        </div>
      ),
      label: 'Reddit',
      onClick: () => {
        window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(productName)}`, '_blank');
      }
    },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Panel content */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 pb-2">
          <h2 className="text-lg font-medium text-gray-900">Share to</h2>
          <button className="p-1" onClick={() => onOpenChange(false)}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Scrollable container */}
        <div className="pb-4">
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-2 px-6">
            {shareOptions.map((option, index) => (
              <div key={index} className="flex flex-col items-center flex-shrink-0">
                <button 
                  className="mb-2 hover:scale-105 transition-transform"
                  onClick={option.onClick}
                >
                  {option.icon}
                </button>
                <span className="text-sm text-gray-700 text-center whitespace-nowrap">
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SocialSharePanel;