
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../../contexts/auth/AuthContext';

interface SuccessScreenProps {
  email: string;
  onContinue: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ email, onContinue }) => {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // User should already be authenticated by the time we reach this screen
    // The authentication was handled in the previous step (password or verification)
    console.log('Success screen loaded for user:', email);
    console.log('Current auth state - user:', user?.email, 'authenticated:', !!user);

    // Start checkmark animation immediately
    const checkmarkTimer = setTimeout(() => {
      setShowCheckmark(true);
    }, 100);

    // Show content after checkmark animation
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 800);

    // Auto-redirect after 3 seconds
    const redirectTimer = setTimeout(() => {
      console.log('Auto-redirecting to homepage after successful authentication');
      onContinue();
    }, 3000);

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(contentTimer);
      clearTimeout(redirectTimer);
    };
  }, [onContinue, email, user]);

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Main content container - no progress bar */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto relative">
        
        {/* Animated Checkmark */}
        <div className="mb-8 relative">
          <div className={`w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center transition-all duration-500 ${
            showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}>
            <Check className={`w-12 h-12 text-green-500 transition-all duration-300 delay-300 ${
              showCheckmark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`} />
          </div>
          
          {/* Pulsing background effect */}
          <div className={`absolute inset-0 w-24 h-24 rounded-full bg-green-500 opacity-20 transition-all duration-1000 ${
            showCheckmark ? 'animate-ping' : ''
          }`}></div>
        </div>

        {/* Success content */}
        <div className={`text-center transition-all duration-500 delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            Welcome back!
          </h1>
          <p className="text-gray-600 mb-2">
            You have successfully signed in to your account
          </p>
          <p className="text-sm text-gray-500 mb-8">
            {email}
          </p>
          <p className="text-sm text-gray-400">
            Redirecting to homepage...
          </p>
          
          {/* Manual continue button for immediate access */}
          <button
            onClick={onContinue}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Continue to App
          </button>
        </div>

        {/* Security message */}
        <div className={`text-center mt-8 transition-all duration-500 delay-700 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
            </svg>
            <span className="text-gray-500 text-sm">Your session is secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
