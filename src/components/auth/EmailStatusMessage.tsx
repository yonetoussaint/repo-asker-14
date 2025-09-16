import React from 'react';
import { EmailCheckState } from '../../types/auth/email';

interface EmailStatusMessageProps {
  emailCheckState: EmailCheckState;
  isUntrustedProvider: boolean; // New prop to track untrusted provider status
}

const EmailStatusMessage: React.FC<EmailStatusMessageProps> = ({ 
  emailCheckState, 
  isUntrustedProvider 
}) => {
  // Priority 1: Show untrusted provider message first
  // This appears when email has valid format but uses unsupported domain
  if (isUntrustedProvider) {
    return (
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          {/* Info icon for visual clarity */}
          <svg 
            className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>

          <div className="flex-1">
            <p className="text-blue-800 text-sm font-medium mb-1">
              Email provider not supported
            </p>
            <p className="text-blue-700 text-xs">
              Please use an email from Gmail, Outlook, Yahoo, iCloud, or other supported providers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Priority 2: Show connection error message
  // This appears when there's a network issue checking if email exists
  if (emailCheckState === 'error') {
    return (
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          {/* Warning icon */}
          <svg 
            className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>

          <div className="flex-1">
            <p className="text-yellow-800 text-sm font-medium mb-1">
              Connection issue
            </p>
            <p className="text-yellow-700 text-xs">
              You can still continue with verification code if the connection doesn't improve.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Priority 3: No message shown when email exists
  // This allows the UI to handle the success state without additional messaging
  if (emailCheckState === 'exists') {
    return null;
  }

  // Priority 4: Show account creation message when email doesn't exist
  // This guides users toward account creation
  if (emailCheckState === 'not-exists') {
    return (
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex-1">
          <p className="text-purple-700 text-xs">
            This email isn’t registered. Click “Create Account” to continue, or check for typos.
          </p>
        </div>
      </div>
    );
  }

  // No message needed for other states (unchecked, checking)
  // These states are handled by the UI buttons and loading indicators
  return null;
};

export default EmailStatusMessage;