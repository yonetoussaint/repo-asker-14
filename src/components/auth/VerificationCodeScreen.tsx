
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Key, Mail, HelpCircle, Loader2 } from 'lucide-react';
import { FAVICON_OVERRIDES } from '../../constants/email';

interface VerificationCodeScreenProps {
  email: string;
  onBack: () => void;
  onVerificationSuccess: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

const VerificationCodeScreen: React.FC<VerificationCodeScreenProps> = ({ 
  email, 
  onBack, 
  onVerificationSuccess,
  isCompact = false,
  onExpand
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const API_BASE_URL = 'https://supabase-y8ak.onrender.com/api';

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setIsComplete(newCode.every(digit => digit !== ''));
    setError(''); // Clear any previous errors

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeLeft(60);
        setCanResend(false);
        // Clear the code inputs
        setCode(['', '', '', '', '', '']);
        setIsComplete(false);
        // Focus first input
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!isComplete) return;
    
    setIsLoading(true);
    setError('');
    
    const otpCode = code.join('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otpCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onVerificationSuccess();
      } else {
        setError(data.message || 'Invalid verification code. Please try again.');
        // Clear the code inputs on error
        setCode(['', '', '', '', '', '']);
        setIsComplete(false);
        // Focus first input
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
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
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
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
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Enter verification code
          </h1>
          <p className="text-gray-600">
            We sent a 6-digit code to your email address
          </p>
        </div>

        {/* Email display */}
        <div className="mb-6">
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
              className="text-red-500 font-medium hover:text-red-600 text-sm"
              type="button"
            >
              Change
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Code input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Verification Code
          </label>
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg outline-none transition-colors ${
                  error 
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                } ${isLoading ? 'bg-gray-50' : 'bg-white'}`}
              />
            ))}
          </div>
        </div>

        {/* Resend code section */}
        <div className="text-center mb-8">
          {canResend ? (
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="text-red-500 font-medium hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              type="button"
            >
              {isResending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isResending ? 'Sending...' : 'Resend verification code'}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Resend code in {timeLeft}s
            </p>
          )}
        </div>

        {/* Sign in button */}
        <div className="space-y-3 mb-8">
          <button
            disabled={!isComplete || isLoading}
            onClick={handleVerifyCode}
            className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium transition-all ${
              isComplete && !isLoading
                ? 'bg-red-500 text-white hover:bg-red-600 active:scale-98'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            type="button"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Key className="w-5 h-5" />
            )}
            <span>
              {isLoading ? 'Verifying...' : 'Verify & Sign In'}
            </span>
          </button>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
            </svg>
            <span className="text-gray-500 text-sm">Your code is secure with us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeScreen;
