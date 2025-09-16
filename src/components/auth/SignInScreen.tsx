import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLoginScreen from './MainLoginScreen';
import EmailAuthScreen from './EmailAuthScreen';
import VerificationCodeScreen from './VerificationCodeScreen';
import PasswordAuthScreen from './PasswordAuthScreen';
import SuccessScreen from './SuccessScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import OTPResetScreen from './OTPResetScreen';
import NewPasswordScreen from './NewPasswordScreen';
import AccountCreationScreen from './AccountCreationScreen';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/auth/AuthContext';

type ScreenType = 'main' | 'email' | 'verification' | 'password' | 'success' | 'account-creation' | 'reset-password' | 'otp-reset' | 'new-password';

const SignInScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userEmail, setUserEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');

  const handleContinueWithEmail = () => {
    console.log('Navigating to email screen');
    setCurrentScreen('email');
  };

  const handleBackToMain = () => {
    console.log('Navigating back to main screen');
    setCurrentScreen('main');
  };

  const handleContinueWithPassword = (email: string) => {
    console.log('Continue with password for:', email);
    setUserEmail(email);
    setCurrentScreen('password');
  };

  const handleContinueWithCode = (email: string) => {
    console.log('Continue with code for:', email);
    setUserEmail(email);
    setCurrentScreen('verification');
  };

  const handleCreateAccount = (email: string) => {
    console.log('Create account for:', email);
    setUserEmail(email);
    setCurrentScreen('account-creation');
  };

  const handleSignUpClick = () => {
    console.log('Sign up clicked, navigating to account creation');
    setCurrentScreen('account-creation');
  };

  const handleBackFromVerification = () => {
    console.log('Navigating back to email screen from verification');
    setCurrentScreen('email');
  };

  const handleBackFromPassword = () => {
    console.log('Navigating back to email screen from password');
    setCurrentScreen('email');
  };

  const handleVerificationSuccess = () => {
    console.log('Verification successful, user authenticated');
    setCurrentScreen('success');
  };

  const handleSignInSuccess = () => {
    console.log('Sign in successful, user authenticated');
    setCurrentScreen('success');
  };

  const handleForgotPasswordClick = () => {
    console.log('Forgot password clicked');
    setCurrentScreen('reset-password');
  };

  const handleContinueToApp = () => {
    console.log('Continuing to main app');
    // Stay on current page by navigating to the same location
    navigate(location.pathname, { replace: true });
  };

  const handleBackFromAccountCreation = () => {
    console.log('Navigating back to email screen from account creation');
    setCurrentScreen('email');
  };

  const handleAccountCreated = () => {
    console.log('Account created successfully, user authenticated');
    setCurrentScreen('success');
  };

  return (
    <AuthProvider>
      <LanguageProvider>
      <div className="min-h-screen bg-white">
        {currentScreen === 'main' && (
          <MainLoginScreen 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onContinueWithEmail={handleContinueWithEmail}
          />
        )}
        
        {currentScreen === 'email' && (
          <EmailAuthScreen 
            onBack={handleBackToMain}
            selectedLanguage={selectedLanguage}
            onContinueWithPassword={handleContinueWithPassword}
            onContinueWithCode={handleContinueWithCode}
            onCreateAccount={handleCreateAccount}
            onSignUpClick={handleSignUpClick}
            initialEmail={userEmail}
          />
        )}
        
        {currentScreen === 'verification' && (
          <VerificationCodeScreen
            email={userEmail}
            onBack={handleBackFromVerification}
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}
        
        {currentScreen === 'password' && (
          <PasswordAuthScreen
            email={userEmail}
            onBack={handleBackFromPassword}
            onSignInSuccess={handleSignInSuccess}
            onForgotPasswordClick={handleForgotPasswordClick}
          />
        )}


{currentScreen === 'reset-password' && (
  <ResetPasswordScreen
    onBack={() => setCurrentScreen('password')}
    onResetSuccess={(email) => {
      setUserEmail(email);
      setCurrentScreen('otp-reset');
    }}
    initialEmail={userEmail}
  />
)}

{currentScreen === 'otp-reset' && (
  <OTPResetScreen
    email={userEmail}
    onBack={() => setCurrentScreen('reset-password')}
    onOTPVerified={(email, otp) => {
      setResetOTP(otp);
      setCurrentScreen('new-password');
    }}
  />
)}

{currentScreen === 'new-password' && (
  <NewPasswordScreen
    email={userEmail}
    otp={resetOTP}
    onBack={() => setCurrentScreen('otp-reset')}
    onPasswordResetSuccess={() => {
      setCurrentScreen('success');
    }}
  />
)}


        {currentScreen === 'account-creation' && (
          <AccountCreationScreen
            email={userEmail}
            onBack={handleBackFromAccountCreation}
            onAccountCreated={handleAccountCreated}
          />
        )}

        {currentScreen === 'success' && (
          <SuccessScreen
            email={userEmail}
            onContinue={handleContinueToApp}
          />
        )}
      </div>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default SignInScreen;
