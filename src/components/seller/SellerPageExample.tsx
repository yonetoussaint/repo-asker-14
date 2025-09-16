import React, { useState } from 'react';
import ProductHeader from '@/components/product/ProductHeader';
import SellerStickyTabsNavigation from '@/components/seller/SellerStickyTabsNavigation';
import { Heart, Share } from 'lucide-react';

// Example seller page component demonstrating the header and sticky tabs functionality
const SellerPageExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const headerHeight = 60; // Approximate header height

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleShareClick = () => {
    console.log('Share clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Header with seller mode enabled */}
      <ProductHeader
        sellerMode={true} // This forces the header to always show the search bar
        onShareClick={handleShareClick}
        activeSection={activeTab}
        onTabChange={handleTabChange}
      />
      
      {/* Sticky Tabs Navigation */}
      <SellerStickyTabsNavigation
        headerHeight={headerHeight}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {/* Page Content */}
      <div className="pt-16"> {/* Account for header height */}
        {/* Seller Info Section */}
        <div className="bg-white p-6 border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Seller Store Name</h1>
                <p className="text-gray-600">Premium Electronics & Gadgets</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">⭐ 4.8 (2,340 reviews)</span>
                  <span className="text-sm text-gray-500">📍 New York, USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content Sections */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Overview Section */}
          <div id="overview" className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Store Overview</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4">
                Welcome to our premium electronics store! We specialize in high-quality gadgets 
                and electronics with fast shipping and excellent customer service.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">24h</div>
                  <div className="text-sm text-gray-600">Fast Shipping</div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div id="products" className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <h3 className="font-semibold mb-2">Product {i}</h3>
                  <p className="text-gray-600 text-sm mb-2">Great quality product with excellent features</p>
                  <div className="text-lg font-bold text-red-600">$99.99</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Store Address</h3>
                  <p className="text-gray-600">123 Electronics Street<br />New York, NY 10001<br />United States</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Contact Details</h3>
                  <p className="text-gray-600">Email: contact@sellerstore.com<br />Phone: +1 (555) 123-4567<br />Hours: Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div id="about" className="mb-12">
            <h2 className="text-xl font-semibold mb-4">About Our Store</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4">
                Founded in 2018, we started as a small electronics retailer with a passion for 
                bringing the latest technology to our customers. Over the years, we've grown into 
                a trusted source for premium electronics and gadgets.
              </p>
              <p className="text-gray-700 mb-4">
                Our mission is to provide high-quality products at competitive prices while 
                maintaining exceptional customer service. We carefully curate our product selection 
                to ensure we only offer items that meet our high standards.
              </p>
              <h3 className="font-semibold mb-2">Our Values</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Quality products and authentic warranties</li>
                <li>Fast and reliable shipping</li>
                <li>Responsive customer support</li>
                <li>Competitive pricing</li>
                <li>Secure payment processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPageExample;