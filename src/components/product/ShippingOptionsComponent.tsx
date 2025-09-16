import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Clock, ChevronDown, Zap, Truck, Package, Plane, Edit, MapPin } from 'lucide-react';
import { useScreenOverlay } from '@/context/ScreenOverlayContext';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import DeliveryAddressSheet from './DeliveryAddressSheet';

const DeliveryOptions = () => {
  const [selectedOption, setSelectedOption] = useState('meetup');
  const [showAll, setShowAll] = useState(false);
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
  const { setLocationScreenOpen } = useScreenOverlay();
  const { currentLocation } = useLanguageSwitcher();

  // Get delivery options based on current location
  const getDeliveryOptionsForLocation = (location) => {
    if (!location) return getDefaultOptions();

    const baseOptions = [
      {
        id: 'meetup',
        icon: <Truck className="w-6 h-6 text-gray-600" />,
        title: 'Meetup',
        subtitle: 'Meet in person',
        description: 'Arrange to meet at a convenient location',
        popular: true
      }
    ];

    // Extract department from location code (e.g., "HT-OU" -> "OU")
    const department = location.code?.split('-')[1] || '';
    
    console.log('🚚 ShippingOptions: Location department:', department, 'for location:', location);

    // Port-au-Prince (Ouest) - Most delivery options available
    if (department === 'OU' || location.name?.includes('Ouest') || location.name?.includes('Port-au-Prince')) {
      return [
        ...baseOptions,
        {
          id: 'local',
          icon: <Package className="w-6 h-6 text-blue-600" />,
          title: 'Local',
          subtitle: 'Local delivery',
          description: 'Delivered within Port-au-Prince metro area',
          popular: false
        },
        {
          id: 'moto',
          icon: <Plane className="w-6 h-6 text-purple-600" />,
          title: 'Moto',
          subtitle: 'Motorcycle delivery',
          description: 'Fast motorcycle delivery service',
          popular: false
        },
        {
          id: 'pickup-station',
          icon: <Package className="w-6 h-6 text-green-600" />,
          title: 'Pick up station',
          subtitle: 'Collect from station',
          description: 'Pick up from designated collection point',
          popular: false
        }
      ];
    } 
    // Cap-Haïtien (Nord) and Gonaïves (Artibonite) - Regional centers
    else if (department === 'NO' || department === 'AR' || 
             location.name?.includes('Cap-Haïtien') || location.name?.includes('Gonaïves')) {
      return [
        ...baseOptions,
        {
          id: 'moto',
          icon: <Plane className="w-6 h-6 text-purple-600" />,
          title: 'Moto',
          subtitle: 'Motorcycle delivery',
          description: 'Fast motorcycle delivery service',
          popular: false
        },
        {
          id: 'transit',
          icon: <Zap className="w-6 h-6 text-orange-600" />,
          title: 'Transit',
          subtitle: 'Inter departmentale',
          description: 'For delivery between departments',
          popular: false
        },
        {
          id: 'pickup-station',
          icon: <Package className="w-6 h-6 text-green-600" />,
          title: 'Pick up station',
          subtitle: 'Collect from station',
          description: 'Pick up from designated collection point',
          popular: false
        }
      ];
    }
    // Other departments (Sud, Sud-Est) - Limited options
    else {
      return [
        ...baseOptions,
        {
          id: 'transit',
          icon: <Zap className="w-6 h-6 text-orange-600" />,
          title: 'Transit',
          subtitle: 'Inter departmentale',
          description: 'For delivery between departments and communes',
          popular: false
        },
        {
          id: 'pickup-station',
          icon: <Package className="w-6 h-6 text-green-600" />,
          title: 'Pick up station',
          subtitle: 'Collect from station',
          description: 'Pick up from designated collection point',
          popular: false
        }
      ];
    }
  };

  const getDefaultOptions = () => [
    {
      id: 'meetup',
      icon: <Truck className="w-6 h-6 text-gray-600" />,
      title: 'Meetup',
      subtitle: 'Meet in person',
      description: 'Arrange to meet at a convenient location',
      popular: true
    }
  ];

  const deliveryOptions = getDeliveryOptionsForLocation(currentLocation);

  // Update selected option when location changes
  useEffect(() => {
    if (currentLocation) {
      console.log('🚚 ShippingOptions: Current location changed:', currentLocation);
      const newOptions = getDeliveryOptionsForLocation(currentLocation);
      setSelectedOption(newOptions[0]?.id || 'meetup');
    }
  }, [currentLocation]);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Options de Livraison</h3>
      </div>

      {/* Current Location Display */}
      <div className="relative">
        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-900">
              {currentLocation?.name || 'Pétionville, Ouest, Haiti'}
            </span>
          </div>
          <button 
            onClick={() => setIsAddressSheetOpen(true)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* All Delivery Options */}
      <div className="grid grid-cols-2 gap-3">
        {(showAll ? deliveryOptions : deliveryOptions.slice(0, 4)).map((option) => (
          <div 
            key={option.id}
            className="rounded-lg p-3 bg-gray-100"
          >
            <div className="flex flex-col space-y-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1 relative">
                  <span className="font-medium text-gray-900 text-sm">{option.title}</span>
                  {option.popular && (
                    <>
                      <span className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                        <Zap size={8} fill="white" className="text-white" />
                      </div>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-600">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More/Less Button */}
      <button 
        onClick={() => setShowAll(!showAll)}
        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors py-3 rounded-full w-full text-gray-600 font-medium"
      >
        <span>{showAll ? 'Show less options' : 'View more options'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
      </button>

      {/* Delivery Address Sheet */}
      <DeliveryAddressSheet
        isOpen={isAddressSheetOpen}
        onClose={() => setIsAddressSheetOpen(false)}
      />
    </div>
  );
};



export default DeliveryOptions;