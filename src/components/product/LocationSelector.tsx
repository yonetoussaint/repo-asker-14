
import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, MapPin, Edit, X, Check, Globe, Building, Mail, History, Star } from 'lucide-react';

const LocationSelector = () => {
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('New York');
  const [zipCode, setZipCode] = useState('10001');
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [recentLocations, setRecentLocations] = useState([
    { country: 'United States', city: 'San Francisco', zipCode: '94103' },
    { country: 'United Kingdom', city: 'London', zipCode: 'EC1A 1BB' }
  ]);
  const [favorites, setFavorites] = useState([
    { country: 'United States', city: 'New York', zipCode: '10001' }
  ]);
  const [activeTab, setActiveTab] = useState('edit');
  const [searchTerm, setSearchTerm] = useState('');
  
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'China', 
    'Germany', 'France', 'Japan', 'Brazil', 'India'
  ];
  
  const cities = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'San Francisco', 'Seattle', 'Boston', 'Denver', 'Atlanta'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Quebec City', 'Winnipeg', 'Halifax', 'Victoria'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol', 'Leeds', 'Sheffield', 'Newcastle'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Hobart', 'Darwin', 'Cairns'],
    'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hong Kong', 'Chengdu', 'Wuhan', 'Xi\'an', 'Nanjing', 'Hangzhou'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai']
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // Save to recent locations when exiting edit mode
      addToRecentLocations();
    }
    setIsEditMode(!isEditMode);
    setCountryOpen(false);
    setCityOpen(false);
    setActiveTab('edit');
  };

  const addToRecentLocations = () => {
    if (!city) return;
    
    const newLocation = { country, city, zipCode };
    const locationExists = recentLocations.some(
      loc => loc.country === country && loc.city === city && loc.zipCode === zipCode
    );
    
    if (!locationExists) {
      setRecentLocations(prev => [newLocation, ...prev.slice(0, 4)]);
    }
  };

  const toggleFavorite = () => {
    const currentLocation = { country, city, zipCode };
    const isFavorite = favorites.some(
      fav => fav.country === country && fav.city === city && fav.zipCode === zipCode
    );
    
    if (isFavorite) {
      setFavorites(favorites.filter(
        fav => !(fav.country === country && fav.city === city && fav.zipCode === zipCode)
      ));
    } else {
      setFavorites([currentLocation, ...favorites]);
    }
  };

  const isCurrentLocationFavorite = () => {
    return favorites.some(
      fav => fav.country === country && fav.city === city && fav.zipCode === zipCode
    );
  };

  const applyLocation = (loc) => {
    setCountry(loc.country);
    setCity(loc.city);
    setZipCode(loc.zipCode);
    setActiveTab('edit');
  };

  const filteredCountries = searchTerm 
    ? countries.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    : countries;

  const filteredCities = searchTerm && cities[country]
    ? cities[country].filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    : cities[country] || [];

  return (
    <div className="flex flex-col w-full">
      {/* Enhanced Header - Always visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-red-500 flex-shrink-0">
            <MapPin size={12} />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center">
              <span className="text-gray-800 text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                Ship to: <span className="font-medium">{country}</span>
              </span>
              <span className="mx-1 text-gray-400 text-xs">|</span>
              <span className="text-gray-600 text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                {city ? `${city}` : ''}{zipCode ? ` ${zipCode}` : ''}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditMode && (
            <button 
              onClick={toggleFavorite}
              className={`p-1 hover:bg-gray-50 rounded-full ${isCurrentLocationFavorite() ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Star size={12} />
            </button>
          )}
          <button 
            onClick={toggleEditMode} 
            className="flex items-center text-xs text-red-500 hover:text-red-600 px-2 py-1"
          >
            {isEditMode ? <Check size={12} className="mr-1" /> : <Edit size={12} className="mr-1" />}
            {isEditMode ? 'Done' : 'Change'}
          </button>
        </div>
      </div>
      
      {/* Edit Panel */}
      {isEditMode && (
        <div className="flex flex-col bg-white">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-2">
            <button 
              className={`px-2 py-1 text-xs font-medium ${activeTab === 'edit' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('edit')}
            >
              Edit
            </button>
            <button 
              className={`px-2 py-1 text-xs font-medium ${activeTab === 'recent' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('recent')}
            >
              Recent
            </button>
            <button 
              className={`px-2 py-1 text-xs font-medium ${activeTab === 'favorites' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
          </div>

          {/* Search bar for edit mode */}
          {activeTab === 'edit' && (
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search countries or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-xs text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-red-500 pl-7"
              />
              <Search size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <X 
                  size={12} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
          )}

          {/* Edit Form */}
          {activeTab === 'edit' && (
            <div className="grid grid-cols-2 gap-2">
              {/* Country Selector */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1 flex items-center">
                  <Globe size={10} className="mr-1" />
                  Country
                </label>
                <div className="relative">
                  <button 
                    className="flex items-center justify-between w-full px-2 py-1 text-xs text-gray-700 hover:text-red-500 border border-gray-200 rounded"
                    onClick={() => {
                      setCountryOpen(!countryOpen);
                      setCityOpen(false);
                    }}
                  >
                    <span className="truncate">{country}</span>
                    <ChevronDown size={10} className="text-gray-500 ml-1" />
                  </button>
                  
                  {countryOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-36 overflow-y-auto">
                      {filteredCountries.map(c => (
                        <div 
                          key={c} 
                          className="px-3 py-1 text-xs hover:bg-red-50 cursor-pointer" 
                          onClick={() => {
                            setCountry(c);
                            setCity('');
                            setCountryOpen(false);
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* City Selector */}
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1 flex items-center">
                  <Building size={10} className="mr-1" />
                  City
                </label>
                <div className="relative">
                  <button 
                    className="flex items-center justify-between w-full px-2 py-1 text-xs text-gray-700 hover:text-orange-500 border border-gray-200 rounded"
                    onClick={() => {
                      setCityOpen(!cityOpen);
                      setCountryOpen(false);
                    }}
                  >
                    <span className="truncate">
                      {city || "Select City"}
                    </span>
                    <ChevronDown size={10} className="text-gray-500 ml-1" />
                  </button>
                  
                  {cityOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-36 overflow-y-auto">
                      {filteredCities.map(c => (
                        <div 
                          key={c} 
                          className="px-3 py-1 text-xs hover:bg-orange-50 cursor-pointer" 
                          onClick={() => {
                            setCity(c);
                            setCityOpen(false);
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Zip Code Input */}
              <div className="flex flex-col col-span-2">
                <label className="text-xs text-gray-500 mb-1 flex items-center">
                  <Mail size={10} className="mr-1" />
                  ZIP/Postal Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter ZIP/Postal Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-2 py-1 text-xs text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recent Locations */}
          {activeTab === 'recent' && (
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <History size={12} className="text-gray-400 mr-1" />
                <span className="text-xs text-gray-500">Recently Used</span>
              </div>
              {recentLocations.length > 0 ? (
                recentLocations.map((loc, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-1 text-xs hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    onClick={() => applyLocation(loc)}
                  >
                    <div className="flex items-center">
                      <MapPin size={10} className="text-gray-400 mr-1" />
                      <span className="text-gray-700">{loc.country}, {loc.city} {loc.zipCode}</span>
                    </div>
                    <Star 
                      size={12} 
                      className={`${favorites.some(fav => 
                        fav.country === loc.country && 
                        fav.city === loc.city && 
                        fav.zipCode === loc.zipCode
                      ) ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                      onClick={(e) => {
                        e.stopPropagation();
                        applyLocation(loc);
                        toggleFavorite();
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500 py-2 text-center">No recent locations</div>
              )}
            </div>
          )}

          {/* Favorites */}
          {activeTab === 'favorites' && (
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <Star size={12} className="text-yellow-500 mr-1" />
                <span className="text-xs text-gray-500">Favorite Locations</span>
              </div>
              {favorites.length > 0 ? (
                favorites.map((loc, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-1 text-xs hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                    onClick={() => applyLocation(loc)}
                  >
                    <div className="flex items-center">
                      <MapPin size={10} className="text-gray-400 mr-1" />
                      <span className="text-gray-700">{loc.country}, {loc.city} {loc.zipCode}</span>
                    </div>
                    <X 
                      size={12} 
                      className="text-gray-300 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavorites(favorites.filter(
                          fav => !(fav.country === loc.country && fav.city === loc.city && fav.zipCode === loc.zipCode)
                        ));
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500 py-2 text-center">No favorite locations</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
