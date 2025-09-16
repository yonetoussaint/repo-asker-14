import React from 'react';

const ShippingTab: React.FC = () => {
  return (
    <div className="w-full space-y-6 py-4">
      <div className="w-full">
        <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Delivery Options</h3>
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center w-full p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-gray-600">Local Delivery</span>
            <span className="font-semibold text-green-700">1-2 business days</span>
          </div>
          <div className="flex justify-between items-center w-full p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-gray-600">International Shipping</span>
            <span className="font-semibold text-blue-700">5-10 business days</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Shipping Partners</h3>
        <div className="w-full grid grid-cols-2 gap-3">
          <div className="flex items-center w-full p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">DHL</span>
            </div>
            <span className="text-gray-600">DHL Express</span>
          </div>
          <div className="flex items-center w-full p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">FX</span>
            </div>
            <span className="text-gray-600">FedEx</span>
          </div>
          <div className="flex items-center w-full p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">LD</span>
            </div>
            <span className="text-gray-600">Local Delivery</span>
          </div>
          <div className="flex items-center w-full p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs font-bold">CP</span>
            </div>
            <span className="text-gray-600">Courier Plus</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
        <ul className="w-full space-y-2 text-gray-600">
          <li className="flex items-start w-full">
            <span className="text-amber-600 mr-2">•</span>
            <span>30-day return window from delivery date</span>
          </li>
          <li className="flex items-start w-full">
            <span className="text-amber-600 mr-2">•</span>
            <span>Items must be in original condition with all accessories</span>
          </li>
          <li className="flex items-start w-full">
            <span className="text-amber-600 mr-2">•</span>
            <span>Free return shipping for defective items</span>
          </li>
          <li className="flex items-start w-full">
            <span className="text-amber-600 mr-2">•</span>
            <span>Full refund processed within 3-5 business days</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShippingTab;