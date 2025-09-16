import React from 'react';
import { Mail, Loader2, UserPlus, Lock, Key } from 'lucide-react';

// Define the EmailCheckState type
type EmailCheckState = 'unchecked' | 'checking' | 'exists' | 'not-exists' | 'error';

interface EmailActionButtonsProps {
  isEmailValid: boolean;
  emailCheckState: EmailCheckState;
  isLoading: boolean;
  isUntrustedProvider: boolean;
  onContinueWithPassword: () => void;
  onContinueWithCode: () => void;
  onCreateAccount: () => void;
}

const EmailActionButtons: React.FC<EmailActionButtonsProps> = ({
  isEmailValid,
  emailCheckState,
  isLoading,
  isUntrustedProvider,
  onContinueWithPassword,
  onContinueWithCode,
  onCreateAccount,
}) => {
  const getPasswordButtonState = () => {
    if (!isEmailValid) return { disabled: true, text: 'Continue with Password' };
    if (emailCheckState === 'checking') return { disabled: true, text: 'Checking...' };
    if (emailCheckState === 'exists') return { disabled: false, text: 'Continue with Password' };
    if (emailCheckState === 'not-exists') return { disabled: true, text: 'Account Not Found' };
    if (emailCheckState === 'error') return { disabled: true, text: 'Check Connection' };
    return { disabled: true, text: 'Continue with Password' };
  };

  const getCodeButtonState = () => {
    if (!isEmailValid) return { disabled: true, text: 'Send Verification Code' };
    if (emailCheckState === 'checking') return { disabled: true, text: 'Checking...' };
    if (emailCheckState === 'exists') return { disabled: false, text: 'Send One-Time Password (OTP)' };
    if (emailCheckState === 'not-exists') return { disabled: false, text: 'Create Account' };
    if (emailCheckState === 'error') return { disabled: false, text: 'Send Verification Code' };
    return { disabled: true, text: 'Send Verification Code' };
  };

  const passwordButtonState = getPasswordButtonState();
  const codeButtonState = getCodeButtonState();

  // Show create account button when email doesn't exist
  const showCreateAccountButton = emailCheckState === 'not-exists';

  // Show untrusted provider state
  if (isUntrustedProvider) {
    return (
      <div className="space-y-3 mb-8">
        {/* No button shown for untrusted provider */}
      </div>
    );
  }

  // Show initial waiting button when email is unchecked or invalid
  if (!isEmailValid || emailCheckState === 'unchecked') {
    return (
      <div className="space-y-3 mb-8">
        <button
          disabled={true}
          className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium bg-gray-200 text-gray-400 cursor-not-allowed"
          type="button"
        >
          <span className="flex items-center gap-2">
            <span className="animate-pulse">Waiting for email address</span>
            <span className="flex gap-1">
              <span className="animate-bounce text-sm opacity-60" style={{ animationDelay: '0s' }}>●</span>
              <span className="animate-bounce text-sm opacity-60" style={{ animationDelay: '0.4s' }}>●</span>
              <span className="animate-bounce text-sm opacity-60" style={{ animationDelay: '0.8s' }}>●</span>
            </span>
          </span>
        </button>
      </div>
    );
  }

  // Show checking state
  if (emailCheckState === 'checking') {
    return (
      <div className="space-y-3 mb-8">
        <button
          disabled={true}
          className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium bg-gray-200 text-gray-400 cursor-not-allowed"
          type="button"
        >
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking email...</span>
        </button>
      </div>
    );
  }

  // If email doesn't exist, show only create account button
  if (showCreateAccountButton) {
    return (
      <div className="space-y-3 mb-8">
        <button
          disabled={isLoading}
          onClick={onCreateAccount}
          className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium transition-all ${
            !isLoading
              ? 'bg-red-500 text-white hover:bg-red-600 transform active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          type="button"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <UserPlus className="w-5 h-5" />
          )}
          <span>{isLoading ? 'Loading...' : 'Create Account'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-8">
      <button
        disabled={passwordButtonState.disabled || isLoading}
        onClick={onContinueWithPassword}
        className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium transition-all ${
          !passwordButtonState.disabled && !isLoading
            ? 'bg-red-500 text-white hover:bg-red-600 transform active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        type="button"
      >
        <Lock className="w-5 h-5" />
        <span>{passwordButtonState.text}</span>
      </button>

      <button
        disabled={codeButtonState.disabled || isLoading}
        onClick={onContinueWithCode}
        className={`w-full flex items-center justify-center gap-3 py-4 px-4 border-2 rounded-lg font-medium transition-all ${
          !codeButtonState.disabled && !isLoading
            ? 'border-red-500 text-red-500 hover:bg-red-50 transform active:scale-95'
            : 'border-gray-300 text-gray-400 cursor-not-allowed'
        }`}
        type="button"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Key className="w-5 h-5" />
        )}
        <span>{isLoading ? 'Sending...' : codeButtonState.text}</span>
      </button>
    </div>
  );
};

export default EmailActionButtons;