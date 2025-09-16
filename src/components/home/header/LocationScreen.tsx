import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Globe, Check, X, Search, ChevronLeft, MapPin, Loader2, Navigation, ChevronDown, Star, HelpCircle } from 'lucide-react';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useScreenOverlay } from '@/context/ScreenOverlayContext';
import { countries, Country } from '@/data/locations';
import { 
  departments, 
  communes, 
  sections, 
  quartiers,
  getCommunesByDepartment,
  getSectionsByCommune,
  getQuartiersBySection,
  Department,
  Commune,
  Section,
  Quartier
} from '@/data/haitiLocations';

interface LocationScreenProps {
  onClose: () => void;
  showHeader?: boolean;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ onClose, showHeader = true }) => {
  const { setLocation, currentLocation } = useLanguageSwitcher();
  const { t } = useTranslation('location');
  const { setLocationListScreenOpen } = useScreenOverlay();
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationTip, setShowLocationTip] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const dismissTimerRef = useRef<NodeJS.Timeout>();

  // Check if tip has been seen before
  useEffect(() => {
    const hasSeenTip = localStorage.getItem('hasSeenLocationTip');

    if (!hasSeenTip) {
      setShowLocationTip(true);
      // Mark as seen permanently
      localStorage.setItem('hasSeenLocationTip', 'true');
    }
  }, []);

  // Close tip when clicking outside or after timeout
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tipRef.current && !tipRef.current.contains(event.target as Node)) {
        dismissTip();
      }
    };

    if (showLocationTip) {
      // Set timer to auto-dismiss after 3 seconds
      dismissTimerRef.current = setTimeout(() => {
        dismissTip();
      }, 3000);

      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationTip]);

  const dismissTip = () => {
    setShowLocationTip(false);
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }
  };

  // Pre-select Haiti as the only country
  const haitiCountry = countries.find(country => country.code === 'HT') || countries[4];
  const [locationLevel, setLocationLevel] = useState<'countries' | 'states' | 'cities' | 'sections' | 'quartiers'>('states');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(haitiCountry);
  const [selectedState, setSelectedState] = useState<Department | null>(null);
  const [selectedCity, setSelectedCity] = useState<Commune | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [selectedQuartier, setSelectedQuartier] = useState<Quartier | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([haitiCountry?.name || 'Haiti']);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);
  const [quartierDropdownOpen, setQuartierDropdownOpen] = useState(false);

  // Step configuration
  const stepConfig = {
    states: {
      question: t('questionDepartment'),
      subtitle: t('subtitleDepartment')
    },
    cities: {
      question: t('questionCommune'),
      subtitle: `${t('subtitleCommune')} ${selectedState?.name}.`
    },
    sections: {
      question: t('questionSection'),
      subtitle: `${t('subtitleSection')} ${selectedCity?.name}.`
    },
    quartiers: {
      question: t('questionQuartier'),
      subtitle: `${t('subtitleQuartier')} ${selectedSection?.name}.`
    }
  };

  // Modified handlers - only set selection, don't advance automatically
  const handleStateSelect = (state: Department) => {
    setSelectedState(state);
    setLocationQuery('');
    setDropdownOpen(false);
    setBreadcrumb([selectedCountry?.name || '', state.name]);
    // Removed auto-advance: setLocationLevel('cities');
  };

  const handleCitySelect = (city: Commune) => {
    setSelectedCity(city);
    setLocationQuery('');
    setCityDropdownOpen(false);
    setBreadcrumb([selectedCountry?.name || '', selectedState?.name || '', city.name]);
    // Removed auto-advance: setLocationLevel('sections');
  };

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
    setLocationQuery('');
    setSectionDropdownOpen(false);
    setBreadcrumb([selectedCountry?.name || '', selectedState?.name || '', selectedCity?.name || '', section.name]);
    // Removed auto-advance: setLocationLevel('quartiers');
  };

  const handleQuartierSelect = (quartier: Quartier) => {
    setSelectedQuartier(quartier);
    setQuartierDropdownOpen(false);

    // Complete location selection
    const location = {
      code: `${selectedCity?.code}-${quartier.code}`,
      name: `${quartier.name}, ${selectedSection?.name}, ${selectedCity?.name}, ${selectedState?.name}`,
      flag: selectedCountry?.flag || 'ht'
    };
    setLocation(location);
    onClose();
  };

  const goBack = () => {
    if (locationLevel === 'quartiers') {
      setLocationLevel('sections');
      setSelectedQuartier(null);
      setLocationQuery('');
      setBreadcrumb([selectedCountry?.name || '', selectedState?.name || '', selectedCity?.name || '']);
    } else if (locationLevel === 'sections') {
      setLocationLevel('cities');
      setSelectedSection(null);
      setLocationQuery('');
      setBreadcrumb([selectedCountry?.name || '', selectedState?.name || '']);
    } else if (locationLevel === 'cities') {
      setLocationLevel('states');
      setSelectedCity(null);
      setLocationQuery('');
      setBreadcrumb([selectedCountry?.name || '']);
    } else if (locationLevel === 'states') {
      onClose();
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(t('geoLocationNotSupported'));
      return;
    }

    setIsGeolocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) {
            throw new Error(t('geoLocationFailed'));
          }

          const data = await response.json();
          const detectedCountry = countries.find(
            country => 
              country.name.toLowerCase() === data.countryName?.toLowerCase() ||
              country.code.toLowerCase() === data.countryCode?.toLowerCase()
          );

          if (detectedCountry) {
            const location = {
              code: data.countryCode || detectedCountry.code,
              name: data.city || data.locality || detectedCountry.name,
              flag: detectedCountry.flag
            };
            setLocation(location);
            onClose();
          } else {
            setGeoError(t('geoLocationFailed'));
          }
        } catch (error) {
          setGeoError(t('geoLocationFailed'));
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        setIsGeolocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError(t('geoLocationFailed'));
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError(t('geoLocationFailed'));
            break;
          case error.TIMEOUT:
            setGeoError(t('geoLocationFailed'));
            break;
          default:
            setGeoError(t('geoLocationFailed'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 600000
      }
    );
  };

  const filteredStates = useMemo(() => {
    if (!locationQuery) return departments;
    return departments.filter(dept => 
      dept.name.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [locationQuery]);

  const filteredCities = useMemo(() => {
    if (!selectedState) return [];
    const deptCommunes = getCommunesByDepartment(selectedState.code);
    if (!locationQuery) return deptCommunes;
    return deptCommunes.filter(commune =>
      commune.name.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [selectedState, locationQuery]);

  const filteredSections = useMemo(() => {
    if (!selectedCity) return [];
    const communeSections = getSectionsByCommune(selectedCity.code);
    if (!locationQuery) return communeSections;
    return communeSections.filter(section =>
      section.name.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [selectedCity, locationQuery]);

  const filteredQuartiers = useMemo(() => {
    if (!selectedSection) return [];
    const sectionQuartiers = getQuartiersBySection(selectedSection.code);
    if (!locationQuery) return sectionQuartiers;
    return sectionQuartiers.filter(quartier =>
      quartier.name.toLowerCase().includes(locationQuery.toLowerCase())
    );
  }, [selectedSection, locationQuery]);

  const getCurrentStep = () => {
    switch (locationLevel) {
      case 'states':
        return 1;
      case 'cities':
        return 2;
      case 'sections':
        return 3;
      case 'quartiers':
        return 4;
      default:
        return 1;
    }
  };

  const ProgressBar = () => {
    const currentStep = getCurrentStep();
    const totalSteps = 4;


    return (
      <div className="flex gap-2 mt-3">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;

          return (
            <div
              key={stepNumber}
              className={`
                flex-1 h-1 rounded-full transition-colors duration-300
                ${isActive ? 'bg-orange-500' : 'bg-gray-200'}
              `}
            />
          );
        })}
      </div>
    );
  };

  return (
   <div className={showHeader ? "fixed inset-0 bg-white z-50 flex flex-col h-screen" : "flex flex-col h-full"}>
      {showHeader && (
        <div className="bg-white p-3">
          <div className="relative flex items-center justify-center">
            <button
              onClick={locationLevel === 'states' ? onClose : goBack}
              className="absolute left-0 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {locationLevel === 'states' ? (
                <X className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {t('locationSetup')}
            </h1>
             <div className="absolute right-0">
              <button 
                onClick={handleUseMyLocation}
                disabled={isGeolocating}
                className="text-gray-600 hover:text-gray-900 disabled:text-gray-400 transition-colors"
                id="location-icon"
              >
                {isGeolocating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Navigation className="h-5 w-5" />
                )}
              </button>

              {/* Location Tip Bubble */}
              {showLocationTip && locationLevel === 'states' && (
                <div 
                  ref={tipRef}
                  className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 animate-fade-in"
                  style={{
                    transform: 'translateX(10px)'
                  }}
                >
                  <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                  <div className="flex items-start gap-2">
                    <Navigation className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('quickTip')}</p>
                      <p className="text-xs text-gray-600">
                        {t('gpsTip')}
                      </p>
                    </div>
                    <button 
                      onClick={dismissTip}
                      className="ml-auto text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ProgressBar />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="mt-6 mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {stepConfig[locationLevel]?.question}
          </h2>
          <p className="text-gray-600 text-sm">
            {stepConfig[locationLevel]?.subtitle}
          </p>
        </div>

        {locationLevel === 'states' && (
          <>
            {/* Current Location Display */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{t('currentLocation', { defaultValue: 'Current Location' })}</p>
                  <p className="text-sm text-gray-600">{currentLocation.name}</p>
                </div>
              </div>
            </div>

            {geoError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{geoError}</p>
              </div>
            )}

            <div className="mb-6">
              <div className="relative">
                <button
                  onClick={() => {
                    setLocationListScreenOpen(true, {
                      title: t('chooseDepartmentTitle'),
                      items: filteredStates,
                      onSelect: handleStateSelect,
                      searchPlaceholder: t('searchDepartments')
                    });
                  }}
                  className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={selectedState ? "text-gray-900" : "text-gray-500"}>
                      {selectedState ? selectedState.name : t('chooseDepartment')}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">{t('popularDepartments')}</h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {filteredStates.map((state) => (
                  <button
                    key={state.code}
                    onClick={() => handleStateSelect(state)}
                    className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                      selectedState?.code === state.code
                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                        : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600'
                    }`}
                  >
                    {state.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {locationLevel === 'cities' && (
          <>
            <div className="mb-6">
              <div className="relative">
                <button
                  onClick={() => {
                    setLocationListScreenOpen(true, {
                      title: t('chooseCommuneTitle'),
                      items: filteredCities,
                      onSelect: handleCitySelect,
                      searchPlaceholder: t('searchCommunes')
                    });
                  }}
                  className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={selectedCity ? "text-gray-900" : "text-gray-500"}>
                      {selectedCity ? selectedCity.name : t('chooseCommune')}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">{t('popularCommunes')}</h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {filteredCities.map((city) => (
                  <button
                    key={city.code}
                    onClick={() => handleCitySelect(city)}
                    className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                      selectedCity?.code === city.code
                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                        : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {locationLevel === 'sections' && (
          <>
            <div className="mb-6">
              <div className="relative">
                <button
                  onClick={() => {
                    setLocationListScreenOpen(true, {
                      title: t('chooseSectionTitle'),
                      items: filteredSections,
                      onSelect: handleSectionSelect,
                      searchPlaceholder: t('searchSections')
                    });
                  }}
                  className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={selectedSection ? "text-gray-900" : "text-gray-500"}>
                      {selectedSection ? selectedSection.name : t('chooseSectionCommunale')}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">{t('popularSections')}</h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {filteredSections.map((section) => (
                  <button
                    key={section.code}
                    onClick={() => handleSectionSelect(section)}
                    className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                      selectedSection?.code === section.code
                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                        : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600'
                    }`}
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {locationLevel === 'quartiers' && (
          <>
            <div className="mb-6">
              <div className="relative">
                <button
                  onClick={() => {
                    setLocationListScreenOpen(true, {
                      title: t('chooseQuartierTitle'),
                      items: filteredQuartiers,
                      onSelect: handleQuartierSelect,
                      searchPlaceholder: t('searchQuartiers')
                    });
                  }}
                  className="w-full p-3 text-left bg-white border border-gray-300 rounded-lg hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={selectedQuartier ? "text-gray-900" : "text-gray-500"}>
                      {selectedQuartier ? selectedQuartier.name : t('chooseQuartier')}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">{t('popularQuartiers')}</h3>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {filteredQuartiers.map((quartier) => (
                  <button
                    key={quartier.code}
                    onClick={() => handleQuartierSelect(quartier)}
                    className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                      selectedQuartier?.code === quartier.code
                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                        : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600'
                    }`}
                  >
                    {quartier.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

     {/* Sticky Continue Button - Border Removed */}
<div className="bg-white p-4 sticky bottom-0"> {/* Removed border classes here */}
  <button
    onClick={() => {
      if (locationLevel === 'states' && selectedState) {
        setLocationLevel('cities');
        setLocationQuery('');
      } else if (locationLevel === 'cities' && selectedCity) {
        setLocationLevel('sections');
        setLocationQuery('');
      } else if (locationLevel === 'sections' && selectedSection) {
        setLocationLevel('quartiers');
        setLocationQuery('');
      } else if (locationLevel === 'quartiers' && selectedQuartier) {
        const location = {
          code: `${selectedCity?.code}-${selectedQuartier.code}`,
          name: `${selectedQuartier.name}, ${selectedSection?.name}, ${selectedCity?.name}, ${selectedState?.name}`,
          flag: selectedCountry?.flag || 'ht'
        };
        setLocation(location);
        onClose();
      }
    }}
    disabled={(locationLevel === 'states' && !selectedState) || 
             (locationLevel === 'cities' && !selectedCity) || 
             (locationLevel === 'sections' && !selectedSection) ||
             (locationLevel === 'quartiers' && !selectedQuartier)}
    className="w-full py-3 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 rounded-lg transition-colors"
  >
    {locationLevel === 'quartiers' ? t('header.finish', { ns: 'common' }) : t('header.continue', { ns: 'common' })}
  </button>
</div>
    </div>
  );
};

export default LocationScreen;