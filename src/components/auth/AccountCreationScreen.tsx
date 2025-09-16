import React, { useState } from 'react';
import AccountCreationNameStep from './AccountCreationNameStep';
import AccountCreationPasswordStep from './AccountCreationPasswordStep';
import AccountCreationSuccessStep from './AccountCreationSuccessStep';

interface AccountCreationScreenProps {
  email: string;
  onBack: () => void;
  onAccountCreated: () => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

type Step = 'name' | 'password' | 'success';

const AccountCreationScreen: React.FC<AccountCreationScreenProps> = ({
  email,
  onBack,
  onAccountCreated,
  isCompact = false,
  onExpand
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameStepContinue = (newFirstName: string, newLastName: string) => {
    // Clear any previous errors
    setError(null);
    
    // Validate names
    if (!newFirstName.trim() || !newLastName.trim()) {
      setError('First name and last name are required');
      return;
    }
    
    setFirstName(newFirstName.trim());
    setLastName(newLastName.trim());
    setCurrentStep('password');
  };

  const handlePasswordStepContinue = () => {
    // Account creation is now handled in the password step component
    // Just move to success step when called
    setCurrentStep('success');
  };

  const handleChangeEmail = () => {
    onBack();
  };

  const handleNameStepBack = () => {
    onBack();
  };

  const handlePasswordStepBack = () => {
    setError(null); // Clear errors when going back
    setCurrentStep('name');
  };

  const handleSuccessStepContinue = () => {
    onAccountCreated();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    console.error('Account creation error:', errorMessage);
    
    // Optional: Clear error after a few seconds
    setTimeout(() => setError(null), 5000);
  };

  const clearError = () => {
    setError(null);
  };

  // Error display component
  const ErrorBanner = () => (
    error ? (
      <div className="fixed top-4 left-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-600 text-sm font-medium">
              {error}
            </div>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 text-sm font-medium ml-4"
          >
            ×
          </button>
        </div>
      </div>
    ) : null
  );

  if (currentStep === 'name') {
    return (
      <div>
        <ErrorBanner />
        <AccountCreationNameStep
          email={email}
          onBack={handleNameStepBack}
          onChangeEmail={handleChangeEmail}
          onContinue={handleNameStepContinue}
          initialFirstName={firstName}
          initialLastName={lastName}
          isCompact={isCompact}
          onExpand={onExpand}
        />
      </div>
    );
  }

  if (currentStep === 'password') {
    return (
      <div>
        <ErrorBanner />
        <AccountCreationPasswordStep
          email={email}
          firstName={firstName}
          lastName={lastName}
          onBack={handlePasswordStepBack}
          onContinue={handlePasswordStepContinue}
          onError={handleError}
          isLoading={isLoading}
          isCompact={isCompact}
          onExpand={onExpand}
        />
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <AccountCreationSuccessStep
        email={email}
        firstName={firstName}
        lastName={lastName}
        onContinue={handleSuccessStepContinue}
        isCompact={isCompact}
        onExpand={onExpand}
      />
    );
  }

  return null;
};

export default AccountCreationScreen;
