import React, { useState } from 'react';
import { 
  Shield, 
  Truck, 
  RotateCcw, 
  Gift, 
  MessageCircle, 
  MapPin, 
  Clock,
  AlertCircle,
  Bell,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductExtras = () => {
  const [selectedWarranty, setSelectedWarranty] = useState('none');
  const [giftWrap, setGiftWrap] = useState(false);
  const [notifyStock, setNotifyStock] = useState(false);

  return (
    <div className="bg-white space-y-4">
      {/* Warranty Options */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <h4 className="font-medium">Product Protection</h4>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="radio" 
              name="warranty" 
              value="none"
              checked={selectedWarranty === 'none'}
              onChange={(e) => setSelectedWarranty(e.target.value)}
            />
            <span>No additional protection - FREE</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="radio" 
              name="warranty" 
              value="basic"
              checked={selectedWarranty === 'basic'}
              onChange={(e) => setSelectedWarranty(e.target.value)}
            />
            <span>3-Month Quality Guarantee - 50 HTG</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="radio" 
              name="warranty" 
              value="premium"
              checked={selectedWarranty === 'premium'}
              onChange={(e) => setSelectedWarranty(e.target.value)}
            />
            <span>6-Month Premium Protection - 120 HTG</span>
          </label>
        </div>
      </div>

      {/* Gift Options */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-purple-500" />
          <h4 className="font-medium">Gift Options</h4>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
            />
            <span>Gift wrap (+25 HTG)</span>
          </label>
          
          {giftWrap && (
            <div className="ml-6 space-y-2">
              <input 
                type="text" 
                placeholder="Gift message (optional)"
                className="w-full text-sm border rounded px-2 py-1"
              />
              <select className="w-full text-sm border rounded px-2 py-1">
                <option>Classic gift wrap</option>
                <option>Premium gift box (+15 HTG)</option>
                <option>Eco-friendly wrap</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Delivery & Returns */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border rounded-lg p-3 text-center">
          <Truck className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-xs font-medium">Free Delivery</p>
          <p className="text-xs text-gray-500">Orders over 500 HTG</p>
        </div>
        
        <div className="border rounded-lg p-3 text-center">
          <RotateCcw className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-xs font-medium">Easy Returns</p>
          <p className="text-xs text-gray-500">30-day policy</p>
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" />
          <h4 className="font-medium">Stock Notifications</h4>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox"
              checked={notifyStock}
              onChange={(e) => setNotifyStock(e.target.checked)}
            />
            <span>Notify me when stock is low</span>
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            <span>Price drop alerts</span>
          </label>
        </div>
      </div>

      {/* Store Availability */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          <h4 className="font-medium">Store Availability</h4>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Port-au-Prince Store</span>
            <span className="text-green-600">In Stock (5 left)</span>
          </div>
          <div className="flex justify-between">
            <span>Cap-Haïtien Store</span>
            <span className="text-yellow-600">Low Stock (2 left)</span>
          </div>
          <div className="flex justify-between">
            <span>Les Cayes Store</span>
            <span className="text-red-600">Out of Stock</span>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          Find Nearest Store
        </Button>
      </div>

      {/* Social Sharing */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-500" />
          <h4 className="font-medium">Share This Product</h4>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Facebook
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Copy Link
          </Button>
        </div>
      </div>

      {/* Live Support */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          <h4 className="font-medium">Need Help?</h4>
        </div>
        
        <p className="text-sm text-gray-600">
          Our beard care experts are online now to help you choose the right products.
        </p>
        
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <MessageCircle className="w-3 h-3 mr-1" />
            Live Chat
          </Button>
          <Button variant="outline" size="sm">
            Call Now
          </Button>
        </div>
      </div>

      {/* Care Instructions */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          <h4 className="font-medium">Care Instructions</h4>
        </div>
        
        <div className="text-sm space-y-1 text-gray-600">
          <p>• Store in cool, dry place away from direct sunlight</p>
          <p>• Use within 24 months of opening</p>
          <p>• Apply to clean, slightly damp beard for best results</p>
          <p>• Perform patch test if you have sensitive skin</p>
        </div>
      </div>

      {/* Delivery Time */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-green-500" />
          <h4 className="font-medium">Delivery Estimates</h4>
        </div>
        
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Standard Delivery:</span>
            <span className="font-medium">3-5 business days</span>
          </div>
          <div className="flex justify-between">
            <span>Express Delivery:</span>
            <span className="font-medium">1-2 business days (+50 HTG)</span>
          </div>
          <div className="flex justify-between">
            <span>Same Day (PAP only):</span>
            <span className="font-medium">Within 6 hours (+100 HTG)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductExtras;