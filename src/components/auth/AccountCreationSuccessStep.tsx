
import React from 'react';
import { CheckCircle, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FAVICON_OVERRIDES } from '../../constants/auth/email';

interface AccountCreationSuccessStepProps {
  email: string;
  firstName: string;
  lastName: string;
  onContinue: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

const AccountCreationSuccessStep: React.FC<AccountCreationSuccessStepProps> = ({
  email,
  firstName,
  lastName,
  onContinue,
  isCompact = false,
  onExpand
}) => {
  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  };

  const getFaviconUrl = (emailValue: string) => {
    const domain = extractDomain(emailValue);
    if (domain) {
      return FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=20`;
    }
    return null;
  };

  const faviconUrl = getFaviconUrl(email);

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-2 pb-3 flex items-center justify-between">
          <div className="w-10 h-10"></div>
          <h2 className="text-lg font-semibold text-gray-900">Account Created</h2>
          <div className="w-10 h-10"></div>
        </div>
      )}

      {/* Progress Bar - always show */}
      <div className="mb-6 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto justify-center">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome, {firstName}!
          </h1>
          <p className="text-gray-600">
            Your account has been created successfully
          </p>
        </div>

        {/* Account Info */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6">
                {faviconUrl ? (
                  <img
                    src={faviconUrl}
                    alt="Email provider favicon"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Mail className="w-full h-full text-gray-400" />
                )}
              </div>
              <span className="text-gray-700 font-medium">{email}</span>
            </div>
            <div className="text-gray-600">
              {firstName} {lastName}
            </div>
          </div>
        </div>

        <Button
          onClick={onContinue}
          className="w-full mb-6"
          size="lg"
        >
          Get Started
        </Button>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            You can now access all features of your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountCreationSuccessStep;
