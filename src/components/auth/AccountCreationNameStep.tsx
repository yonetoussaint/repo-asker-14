import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { FAVICON_OVERRIDES } from '../../constants/email';

interface AccountCreationNameStepProps {
  email: string;
  onBack: () => void;
  onChangeEmail: () => void;
  onContinue: (firstName: string, lastName: string) => void;
  initialFirstName?: string;
  initialLastName?: string;
  isCompact?: boolean;
  onExpand?: () => void;
}

const AccountCreationNameStep: React.FC<AccountCreationNameStepProps> = ({
  email,
  onBack,
  onChangeEmail,
  onContinue,
  initialFirstName = '',
  initialLastName = '',
  isCompact = false,
  onExpand
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: ''
  });

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

  const handleContinue = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    onContinue(firstName.trim(), lastName.trim());
  };

  const validateName = (name: string, fieldName: string, options: any = {}) => {
    const {
      minLength = 2,
      maxLength = 50,
      allowNumbers = false,
      allowUnicode = true,
      allowAllCaps = false,
    } = options;

    let basePattern = allowUnicode ? '\\p{L}' : 'a-zA-Z';
    if (allowNumbers) basePattern += '0-9';

    const nameRegex = new RegExp(
      `^[${basePattern}\\s\\-'."]+$`, 
      allowUnicode ? 'u' : ''
    );

    const trimmedName = name.trim();

    if (!trimmedName) {
      return `${fieldName} is required`;
    }

    if (trimmedName.length < minLength) {
      return `${fieldName} must be at least ${minLength} character${minLength === 1 ? '' : 's'}`;
    }
    if (trimmedName.length > maxLength) {
      return `${fieldName} must be less than ${maxLength} characters`;
    }

    if (!nameRegex.test(trimmedName)) {
      const allowedChars = [
        'letters (including accented ones like é, ü, ñ)',
        allowNumbers && 'numbers',
        'spaces',
        'hyphens (-)',
        'apostrophes (\')',
        'periods (.)'
      ].filter(Boolean).join(', ');
      return `${fieldName} can only contain ${allowedChars}`;
    }

    if (!allowAllCaps && trimmedName === trimmedName.toUpperCase()) {
      return `${fieldName} should not be in all capital letters`;
    }

    if (/(['\-."])\1/.test(trimmedName)) {
      return `${fieldName} contains repeated special characters`;
    }

    if (/^['\-."]|['\-."]$/.test(trimmedName)) {
      return `${fieldName} cannot start or end with a special character`;
    }

    if (/\s{2,}/.test(trimmedName)) {
      return `${fieldName} cannot contain multiple consecutive spaces`;
    }

    return '';
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    const error = validateName(value, 'First name');
    setErrors(prev => ({ ...prev, firstName: error }));
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    const error = validateName(value, 'Last name');
    setErrors(prev => ({ ...prev, lastName: error }));
  };

  const isFormValid = firstName.trim() !== '' && 
                     lastName.trim() !== '' && 
                     !errors.firstName && 
                     !errors.lastName;

  // Disable last name field if there's an error in first name
  const isLastNameDisabled = !!errors.firstName;
  
  // Get the current error to display (prioritize first name errors)
  const currentError = errors.firstName || errors.lastName;

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header - hide in compact mode */}
      {!isCompact && (
        <div className="pt-2 pb-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Create Account</h2>
          <div className="w-10 h-10"></div>
        </div>
      )}

      {/* Progress Bar - always show */}
      <div className="mb-6 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            What's your name?
          </h1>
          <p className="text-gray-600">
            We'll use this to personalize your experience
          </p>
        </div>

        {/* Email Display */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            <button
              onClick={onChangeEmail}
              className="text-red-500 hover:text-red-600 font-medium text-sm"
            >
              Change
            </button>
          </div>
        </div>

        {/* Status Message Box - Simplified to show one error at a time */}
        {currentError && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
            <p className="text-sm">{currentError}</p>
          </div>
        )}

        {/* Name Form */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={handleFirstNameChange}
                placeholder="First name"
                className={errors.firstName ? 'border-red-500' : ''}
              />
            </div>

            <div className="flex-1">
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={handleLastNameChange}
                placeholder="Last name"
                className={errors.lastName ? 'border-red-500' : ''}
                disabled={isLastNameDisabled}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="w-full mb-6"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AccountCreationNameStep;