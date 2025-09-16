import React, { useState, useEffect } from 'react';
import { Star, MapPin, Zap, ChevronLeft, Bell, ChevronDown, ExternalLink, X, Phone, Mail, MessageCircle, ChevronRight, Clock } from 'lucide-react';

const SellerProfile = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState('hours');
  const [activeMainTab, setActiveMainTab] = useState('products');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Helper function to format follower count
  const formatFollowerCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const seller = {
    name: "Alex Chen",
    title: "Electronics Specialist • 🔥 Black Friday Sale Active!",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    totalReviews: 2847,
    location: "San Francisco, CA",
    isOnline: false,
    lastSeen: "2h ago",
    totalSales: "15.2K",
    responseTime: "< 1hr",
    badges: ["Top Seller", "Verified", "Fast Ship", "40% OFF Sale"],
    businessHours: "Mon-Fri 9AM-6PM PST",
    specialNote: "Free shipping on orders over $50 • Same-day shipping available",
    followers: 3200,
    stats: {
      products: 184,
      followers: 3200,
      orders: 15234,
    },
    socialLinks: {
      instagram: "https://instagram.com/alexchen_electronics",
      twitter: "https://twitter.com/alexchen_tech",
      youtube: "https://youtube.com/c/AlexChenTech",
      website: "https://alexchen-electronics.com",
      linkedin: "https://linkedin.com/in/alexchen-tech"
    },
    contact: {
      phone: "+1 (415) 555-0123",
      email: "alex.chen@electronics-store.com",
      whatsapp: "+1 (415) 555-0123",
      address: "1234 Market St, San Francisco, CA 94103",
      businessName: "Chen Electronics Store"
    },
    schedule: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM", 
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed"
    }
  };

  return (
    <div className={`min-h-screen bg-white text-gray-900 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center px-4 py-3">
          {/* Back button */}
          <button className="mr-3 -ml-1">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          {/* Avatar */}
          <div className="relative mr-3">
            <img src={seller.avatar} alt={seller.name} className="w-9 h-9 rounded-full" />
            {seller.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>}
          </div>
          {/* Name and info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h1 className="font-semibold text-gray-900 truncate">{seller.name}</h1>
              <Zap className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span>{formatFollowerCount(seller.followers)} followers</span>
              <span>|</span>
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{seller.rating}</span>
              </div>
            </div>
          </div>
          {/* Follow button */}
          <button 
            className={`flex items-center justify-center h-8 px-4 rounded-full text-sm font-medium transition-colors ${
              isFollowing 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? (
              <div className="flex items-center gap-1">
                <Bell className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </div>
            ) : (
              'Follow'
            )}
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          🚀 Black Friday Special: Enjoy up to 40% off on all electronics! Limited time offer.
        </p>
      </div>

      {/* Mobile-only Main Tabs Bar and Content */}
      <div className="block sm:hidden max-w-4xl mx-auto px-4 mt-4">
        <div className="flex border-b border-gray-200">
          {['products', 'reels', 'posts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(tab)}
              className={`flex-1 py-3 text-center font-medium text-sm transition-colors ${
                activeMainTab === tab 
                  ? 'border-b-2 border-purple-600 text-purple-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Mobile Tab Content */}
        <div className="mt-6 min-h-[300px]">
          {activeMainTab === 'products' && (
            <div>
              {/* Render Products content here */}
              <h2 className="text-lg font-semibold">Products</h2>
              <p>Show the list of products here...</p>
            </div>
          )}
          {activeMainTab === 'reels' && (
            <div>
              {/* Render Reels content here */}
              <h2 className="text-lg font-semibold">Reels</h2>
              <p>Show reels videos or media here...</p>
            </div>
          )}
          {activeMainTab === 'posts' && (
            <div>
              {/* Render Posts content here */}
              <h2 className="text-lg font-semibold">Posts</h2>
              <p>Show posts or updates here...</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout reminder or custom content can go here */}

      {/* Info Panel Overlay with Tabs */}
      {showInfoPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full mx-4 shadow-xl max-h-[80vh] flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
              <button 
                onClick={() => setShowInfoPanel(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Info Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveInfoTab('hours')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeInfoTab === 'hours'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Clock className="w-4 h-4 mx-auto mb-1" />
                Hours
              </button>
              <button
                onClick={() => setActiveInfoTab('social')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeInfoTab === 'social'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <ExternalLink className="w-4 h-4 mx-auto mb-1" />
                Social
              </button>
              <button
                onClick={() => setActiveInfoTab('contact')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeInfoTab === 'contact'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Phone className="w-4 h-4 mx-auto mb-1" />
                Contact
              </button>
            </div>

            {/* Info Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeInfoTab === 'hours' && (
                <>
                  {Object.entries(seller.schedule).map(([day, hours]) => (
                    <div key={day} className="flex items-center justify-between p-2">
                      <div className="font-medium text-gray-900 capitalize">{day}</div>
                      <div className={`text-sm ${hours === 'Closed' ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {hours}
                      </div>
                    </div>
                  ))}
                </>
              )}
              {activeInfoTab === 'social' && (
                <>
                  {Object.entries(seller.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
                        {platform === 'instagram' && (
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">IG</div>
                        )}
                        {platform === 'twitter' && (
                          <div className="w-6 h-6 bg-blue-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">TW</div>
                        )}
                        {platform === 'youtube' && (
                          <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">YT</div>
                        )}
                        {platform === 'website' && (
                          <div className="w-6 h-6 bg-gray-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">WEB</div>
                        )}
                        {platform === 'linkedin' && (
                          <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">LI</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 capitalize">{platform}</div>
                        <div className="text-xs text-gray-500 truncate">{url.replace('https://', '').replace('http://', '')}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </a>
                  ))}
                </>
              )}
              {activeInfoTab === 'contact' && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">B</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Business</div>
                      <div className="text-sm text-gray-600">{seller.contact.businessName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-sm text-gray-600">{seller.location}</div>
                    </div>
                  </div>
                  <a href={`tel:${seller.contact.phone}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Téléphone</div>
                      <div className="text-sm text-gray-600">{seller.contact.phone}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </a>
                  <a href={`mailto:${seller.contact.email}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Email</div>
                      <div className="text-sm text-gray-600 truncate">{seller.contact.email}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </a>
                  <a href={`https://wa.me/${seller.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">WhatsApp</div>
                      <div className="text-sm text-gray-600">{seller.contact.whatsapp}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </a>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(seller.contact.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Adresse</div>
                      <div className="text-sm text-gray-600">{seller.contact.address}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;
