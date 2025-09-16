import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoStepProps {
  formData: {
    name: string;
    price: string;
    discount_price: string;
    inventory: string;
    status: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, onInputChange }) => {
  const [usdPrice, setUsdPrice] = useState((parseFloat(formData.price) / 130).toFixed(2));
  const [usdDiscountPrice, setUsdDiscountPrice] = useState((parseFloat(formData.discount_price || '0') / 130).toFixed(2));
  
  // Exchange rate: 1 USD = 130 HTG (100 USD = 13,000 HTG)
  const USD_TO_HTG_RATE = 130;

  const handleUsdPriceChange = (usdValue: string) => {
    setUsdPrice(usdValue);
    const usdPrice = parseFloat(usdValue) || 0;
    const htgPrice = usdPrice * USD_TO_HTG_RATE;
    onInputChange('price', htgPrice.toFixed(2));
  };

  const handleUsdDiscountChange = (usdValue: string) => {
    setUsdDiscountPrice(usdValue);
    const usdPrice = parseFloat(usdValue) || 0;
    const htgPrice = usdPrice * USD_TO_HTG_RATE;
    onInputChange('discount_price', htgPrice.toFixed(2));
  };

  const handleHtgPriceChange = (htgValue: string) => {
    onInputChange('price', htgValue);
    const htg = parseFloat(htgValue) || 0;
    setUsdPrice((htg / USD_TO_HTG_RATE).toFixed(2));
  };

  const handleHtgDiscountChange = (htgValue: string) => {
    onInputChange('discount_price', htgValue);
    const htg = parseFloat(htgValue) || 0;
    setUsdDiscountPrice((htg / USD_TO_HTG_RATE).toFixed(2));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold">Basic Product Information</h3>
          <p className="text-sm text-gray-600">
            Enter the essential details about your product
          </p>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Exchange Rate Display */}
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
          <div className="flex justify-center items-center">
            <span className="text-sm font-medium text-blue-700">Exchange Rate:</span>
            <span className="ml-2 text-sm font-bold text-blue-800">1 USD = 130 HTG</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-700">Pricing</h4>
          
          {/* Regular Price */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Regular Price *</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="price_usd" className="text-xs text-gray-500">USD</Label>
                <Input
                  id="price_usd"
                  type="number"
                  step="0.01"
                  min="0"
                  value={usdPrice}
                  onChange={(e) => handleUsdPriceChange(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="price" className="text-xs text-gray-500">HTG</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleHtgPriceChange(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Discount Price */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Discount Price (Optional)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="discount_price_usd" className="text-xs text-gray-500">USD</Label>
                <Input
                  id="discount_price_usd"
                  type="number"
                  step="0.01"
                  min="0"
                  value={usdDiscountPrice}
                  onChange={(e) => handleUsdDiscountChange(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="discount_price" className="text-xs text-gray-500">HTG</Label>
                <Input
                  id="discount_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discount_price}
                  onChange={(e) => handleHtgDiscountChange(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="inventory">Inventory *</Label>
            <Input
              id="inventory"
              type="number"
              min="0"
              value={formData.inventory}
              onChange={(e) => onInputChange('inventory', e.target.value)}
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => onInputChange('status', e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export { BasicInfoStep };