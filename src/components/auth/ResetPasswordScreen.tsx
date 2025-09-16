
import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Mail } from 'lucide-react';
import { FAVICON_OVERRIDES } from '../../constants/email';

interface ResetPasswordScreenProps {
  onBack: () => void;
  onResetSuccess: (email: string) => void;
  initialEmail?: string;
  isCompact?: boolean;
  onExpand?: () => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onBack,
  onResetSuccess,
  initialEmail = '',
  isCompact = false,
  onExpand
}) => {
  const [email] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [resetState, setResetState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const API_BASE_URL = 'https://supabase-y8ak.onrender.com/api';

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  };

  const updateFavicon = (emailValue: string) => {
    const domain = extractDomain(emailValue);
    if (domain) {
      const url = FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=20`;
      return { url, show: true, domain };
    }
    return { url: '', show: false, domain: '' };
  };

  const { url: faviconUrl, show: showFavicon } = updateFavicon(email);

  const handleSendResetCode = async () => {
    if (!isEmailValid(email) || isLoading) return;

    setIsLoading(true);
    setResetState('sending');
    
    try {
      const response = await fetch(`${API_BASE_URL}/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResetState('sent');
        setTimeout(() => {
          onResetSuccess(email);
        }, 2000);
      } else {
        setResetState('error');
        setErrorMessage(data.message || 'Failed to send reset code. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reset code:', error);
      setResetState('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canSendReset = isEmailValid(email) && !isLoading && resetState !== 'sent';

  const handleFaviconError = () => {
    // Favicon failed to load
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-2 pb-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Go back"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">
            Reset Password
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
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Forgot your password?
          </h1>
          <p className="text-gray-600">
            We'll send a reset code to your email address below
          </p>
        </div>

        {/* Status Messages */}
        {resetState === 'error' && errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        {resetState === 'sent' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Reset code sent!</p>
            </div>
            <p className="text-green-700 text-sm">
              Check your email for a reset code. If it doesn't appear within a few minutes, check your spam folder.
            </p>
          </div>
        )}

        {/* Email Input */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10">
              {showFavicon && faviconUrl ? (
                <img
                  src={faviconUrl}
                  alt="Email provider favicon"
                  className="w-full h-full object-contain"
                  onError={handleFaviconError}
                />
              ) : (
                <Mail className="w-full h-full text-gray-400" />
              )}
            </div>

            <input
              type="email"
              value={email}
              placeholder="Your email address"
              className={`w-full pl-10 pr-4 py-3 text-base border-2 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none ${
                resetState === 'error'
                  ? 'border-red-300'
                  : resetState === 'sent'
                  ? 'border-green-300'
                  : 'border-gray-200'
              }`}
              disabled={true}
              readOnly={true}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Send Reset Code Button */}
        <button
          onClick={handleSendResetCode}
          disabled={!canSendReset}
          className={`w-full py-4 px-6 rounded-xl text-lg font-medium transition-all duration-200 mb-6 ${
            canSendReset
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {resetState === 'sending' ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Sending...
            </div>
          ) : resetState === 'sent' ? (
            'Reset code sent'
          ) : (
            'Send reset code'
          )}
        </button>

        {/* Back to Sign In */}
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm">
            Remember your password?{' '}
            <button
              type="button"
              onClick={onBack}
              className="text-red-500 hover:underline font-medium focus:outline-none"
              disabled={isLoading}
            >
              Back to sign in
            </button>
          </p>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z" />
          </svg>
          <span className="text-gray-500 text-sm">Reset codes expire in 10 minutes</span>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
