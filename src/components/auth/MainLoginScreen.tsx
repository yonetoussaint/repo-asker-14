
import React from 'react';
import Lottie from 'lottie-react';
import LanguageSelector from './LanguageSelector';
import TranslatedText from './TranslatedText';

interface Language {
  code: string;
  name: string;
  country: string;
  countryName: string;
}

interface MainLoginScreenProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  onContinueWithEmail: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

const MainLoginScreen: React.FC<MainLoginScreenProps> = ({ 
  selectedLanguage, 
  setSelectedLanguage, 
  onContinueWithEmail,
  isCompact = false,
  onExpand 
}) => {
  const languages: Language[] = [
    { code: 'ht', name: 'Kreyòl Ayisyen', country: 'HT', countryName: 'Haiti' },
    { code: 'fr', name: 'Français', country: 'FR', countryName: 'France' },
    { code: 'en', name: 'English', country: 'US', countryName: 'United States' },
    { code: 'es', name: 'Español', country: 'ES', countryName: 'Spain' },
    { code: 'pt', name: 'Português', country: 'PT', countryName: 'Portugal' },
  ];

  const currentLang = languages.find(lang => lang.code === selectedLanguage);

  // Lottie animation URL
  const lottieUrl = 'https://lottie.host/67390598-e140-4d3c-ad5b-fa8e572fddb7/bFJV5M8lWj.json';

  const [animationData, setAnimationData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch(lottieUrl)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load Lottie animation', err));
  }, [lottieUrl]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('Initiating Google OAuth with Supabase...');
      
      // Get the current origin and construct the auth callback URL
      const currentOrigin = window.location.origin;
      const redirectUrl = `${currentOrigin}/auth/callback`;
      
      console.log('Using redirect URL:', redirectUrl);

      // For demo purposes, just redirect to a placeholder OAuth URL
      console.log('Google OAuth would redirect to:', redirectUrl);
      alert('Google OAuth integration would be implemented here');
    } catch (error) {
      console.error('Error initiating Google sign-in:', error);
    }
  };

  if (isCompact) {
    return (
      <div className="px-4 pb-6">
        {/* Compact view - only buttons and footer */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <TranslatedText className="text-gray-700 font-medium">
              Continue with Google
            </TranslatedText>
          </button>

          <button 
            onClick={onContinueWithEmail}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <TranslatedText className="text-gray-700 font-medium">
              Continue with Email
            </TranslatedText>
          </button>

          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <TranslatedText className="text-gray-700 font-medium">
              Continue with Phone Number
            </TranslatedText>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
          </svg>
          <TranslatedText className="text-gray-500 text-sm">
            Secure Authentication
          </TranslatedText>
        </div>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          <TranslatedText>
            By proceeding, you confirm that you've read and agree to our
          </TranslatedText>{' '}
          <TranslatedText className="text-red-500">Terms of Service</TranslatedText>{' '}
          <TranslatedText>and</TranslatedText>{' '}
          <TranslatedText className="text-red-500">Privacy Policy</TranslatedText>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      <div className="pt-4 pb-4 flex items-center justify-between">
        <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
        <div className="flex items-center">
          <img 
            src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/${currentLang?.country.toLowerCase()}.svg`}
            alt={`${currentLang?.name} flag`}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full p-0">
        {/* Lottie animation replacing welcome text */}
        <div className="flex justify-center mb-0">
          {animationData ? (
            <Lottie 
              animationData={animationData} 
              loop={true} 
              style={{ width: 300, height: 300 }}
            />
          ) : (
            <div className="shimmer-wrapper" />
          )}
        </div>

        <div className="space-y-3 mb-6">
          <button 
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <TranslatedText className="text-gray-700 font-medium">
              Continue with Google
            </TranslatedText>
          </button>

          <button 
            onClick={onContinueWithEmail}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <TranslatedText className="text-gray-700 font-medium">
              Continue with Email
            </TranslatedText>
          </button>

          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <TranslatedText className="text-gray-700 font-medium">
              Continue with Phone Number
            </TranslatedText>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
          </svg>
          <TranslatedText className="text-gray-500 text-sm">
            Secure Authentication
          </TranslatedText>
        </div>

        <p className="text-xs text-gray-500 text-center leading-relaxed">
          <TranslatedText>
            By proceeding, you confirm that you've read and agree to our
          </TranslatedText>{' '}
          <TranslatedText className="text-red-500">Terms of Service</TranslatedText>{' '}
          <TranslatedText>and</TranslatedText>{' '}
          <TranslatedText className="text-red-500">Privacy Policy</TranslatedText>
        </p>
      </div>
    </div>
  );
};

export default MainLoginScreen;
