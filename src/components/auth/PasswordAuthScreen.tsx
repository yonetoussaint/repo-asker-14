import React, { useState, useRef } from 'react';
import { ArrowLeft, Lock, Check, HelpCircle, Eye, EyeOff, Mail, Loader2 } from 'lucide-react';
import { FAVICON_OVERRIDES } from '../../constants/email';
import { useAuth } from '../../contexts/auth/AuthContext';

interface PasswordAuthScreenProps {
  email: string;
  onBack: () => void;
  onSignInSuccess: () => void;
  onForgotPasswordClick: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

const PasswordAuthScreen: React.FC<PasswordAuthScreenProps> = ({
  email,
  onBack,
  onSignInSuccess,
  onForgotPasswordClick,
  isCompact = false,
  onExpand
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();

  const API_BASE_URL = 'https://supabase-y8ak.onrender.com/api';

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setIsPasswordValid(value.length >= 8);
    setError(''); // Clear any previous errors
  };

  const handleSignIn = async () => {
    if (!isPasswordValid || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign in successful, storing token and user data');
        
        // Use the login function from AuthContext to handle token storage
        // and authentication state management
        const userData = {
          id: data.user?.id || data.id,
          email: email,
          full_name: data.user?.full_name || data.full_name,
          profile_picture: data.user?.profile_picture || data.profile_picture
        };
        
        login(userData, data.token);
        onSignInSuccess();
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
        setPassword('');
        setIsPasswordValid(false);
        passwordInputRef.current?.focus();
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const domain = email.split('@')[1] || '';
  const faviconUrl = FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}`;

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-2 pb-3 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95 disabled:opacity-50"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">
            Welcome Back! Sign In
          </h2>

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Help"
            onClick={() => alert('Need help? Contact support@example.com')}
            type="button"
            disabled={isLoading}
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Progress Bar - always show */}
      <div className="mb-4 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Enter your password
          </h1>
          <p className="text-gray-600">
            Sign in with your password
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {faviconUrl ? (
                <img
                  src={faviconUrl}
                  alt="Email provider favicon"
                  className="w-5 h-5 rounded"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '';
                  }}
                />
              ) : (
                <Mail className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-gray-700">{email}</span>
            </div>
            <button
              onClick={onBack}
              disabled={isLoading}
              className="text-red-500 font-medium hover:text-red-600 text-sm disabled:opacity-50"
              type="button"
            >
              Change
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="mb-6 relative">
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isPasswordValid && !isLoading) {
                  handleSignIn();
                }
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              ref={passwordInputRef}
              disabled={isLoading}
              className={`relative w-full pl-10 ${isPasswordValid && !error ? 'pr-20' : 'pr-12'} py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed ${
                error 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {isPasswordValid && !error && (
              <Check className="absolute right-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button
            disabled={!isPasswordValid || isLoading}
            onClick={handleSignIn}
            className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium transition-all ${
              isPasswordValid && !isLoading
                ? 'bg-red-500 text-white hover:bg-red-600 active:scale-98'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            type="button"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            <span>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </span>
          </button>
        </div>

        <div className="text-center">
          <button 
  className="text-red-500 font-medium hover:text-red-600 mb-4" 
  type="button"
  onClick={onForgotPasswordClick}
>
  Forgot password?
</button>

          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
            </svg>
            <span className="text-gray-500 text-sm">Your session is secured with HTTP-only cookies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordAuthScreen;
