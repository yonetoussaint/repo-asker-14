import React, { useState, useEffect } from 'react';
import { Search, Bell, QrCode, Smartphone, Upload, Building2, User, FileText, Users, Lightbulb, Truck, Plus, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MultiStepTransferSheet from '@/components/transfer/MultiStepTransferSheet';

export default function PaytmApp() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Sample banner data - now just for images
  const bannerImages = [
    "/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png",
    "/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png",
    "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png"
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const handleSendClick = () => {
    navigate('/multi-step-transfer-page');
  };

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-blue-100 to-blue-50 min-h-screen">
      {/* Header - Sticky with proper spacing */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-blue-100 to-blue-50 px-2 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-900">Paytm</span>
              <span className="text-red-500 text-lg ml-1">❤</span>
              <span className="text-xl font-bold text-blue-600 ml-1">UPI</span>
              <span className="text-yellow-500 text-lg">⚡</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-blue-600" />
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Content Container with reduced padding */}
      <div className="px-2 space-y-4">
        {/* Image Carousel - Proper spacing from header */}
        <div className="mt-4 bg-white rounded-xl relative overflow-hidden">
          <div className="relative h-40">
            {bannerImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                  index === activeSlide ? 'translate-x-0' : 
                  index < activeSlide ? '-translate-x-full' : 'translate-x-full'
                }`}
              >
                <img
                  src={image}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Money Transfer */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Money Transfer</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-2">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-700 text-center">Scan & Pay</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-2">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-700 text-center">To Mobile</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-2">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-700 text-center">To Bank A/C</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-700 text-center">To Self A/c</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700 text-center">Balance & History</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-sm text-gray-700 text-center">Receive Money</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700 text-center">Refer & Win</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <span className="text-blue-600 font-bold text-lg">⚡</span>
              </div>
              <span className="text-sm text-gray-700 text-center">All UPI Services</span>
            </div>
          </div>
        </div>

        {/* Recharge & Bill Payments */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Recharge & Bill Payments</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700 text-center">Mobile Recharge</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-2">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-700 text-center">FASTag Recharge</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-2">
                <Lightbulb className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-700 text-center">Electricity Bill</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-2">
                <span className="text-red-600 font-bold">Lo</span>
              </div>
              <span className="text-sm text-gray-700 text-center">Loan Payments</span>
            </div>
          </div>
          <div className="mt-4">
            <button className="flex items-center gap-2 text-blue-600 font-medium">
              <Plus className="w-5 h-5" />
              Add New or View existing Bills
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Send Button - now navigates to full page */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={handleSendClick}
          className="bg-blue-600 text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-lg"
        >
          <Send className="w-6 h-6" />
          <span className="text-lg font-semibold">Send</span>
        </button>
      </div>
    </div>
  );
}