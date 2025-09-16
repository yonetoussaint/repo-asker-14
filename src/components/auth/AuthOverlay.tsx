
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { } from 'lucide-react';
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

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userEmail, setUserEmail] = useState('');
  const [resetOTP, setResetOTP] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  // Reset to main screen when overlay opens
  useEffect(() => {
    if (isOpen) {
      setCurrentScreen('main');
      setIsExpanded(false);
      setUserEmail('');
      setResetOTP('');
    }
  }, [isOpen]);

  // Auth flow handlers - same as SignInScreen
  const handleContinueWithEmail = () => {
    setCurrentScreen('email');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  const handleContinueWithPassword = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('password');
  };

  const handleContinueWithCode = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('verification');
  };

  const handleCreateAccount = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('account-creation');
  };

  const handleSignUpClick = () => {
    setCurrentScreen('account-creation');
  };

  const handleBackFromVerification = () => {
    setCurrentScreen('email');
  };

  const handleBackFromPassword = () => {
    setCurrentScreen('email');
  };

  const handleVerificationSuccess = () => {
    setCurrentScreen('success');
  };

  const handleSignInSuccess = () => {
    setCurrentScreen('success');
  };

  const handleForgotPasswordClick = () => {
    setCurrentScreen('reset-password');
  };

  const handleContinueToApp = () => {
    onClose();
    // Just close the overlay, stay on current page without any navigation
  };

  const handleBackFromAccountCreation = () => {
    setCurrentScreen('email');
  };

  const handleAccountCreated = () => {
    setCurrentScreen('success');
  };

  // Drag handlers for expansion (only when not expanded)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isExpanded) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isExpanded) return;
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;
    setDragY(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isExpanded) return;
    setIsDragging(false);
    
    if (dragY > 100) {
      setIsExpanded(true);
    } else if (dragY < -100) {
      onClose();
    }
    
    setDragY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isExpanded) return;
    setIsDragging(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isExpanded) return;
    const diff = startY - e.clientY;
    setDragY(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging || isExpanded) return;
    setIsDragging(false);
    
    if (dragY > 100) {
      setIsExpanded(true);
    } else if (dragY < -100) {
      onClose();
    }
    
    setDragY(0);
  };

  // Get compact props for each screen
  const getCompactProps = () => {
    return {
      isCompact: !isExpanded,
      onExpand: () => setIsExpanded(true)
    };
  };

  const renderCurrentScreen = () => {
    const compactProps = getCompactProps();

    switch (currentScreen) {
      case 'main':
        return (
          <MainLoginScreen
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onContinueWithEmail={handleContinueWithEmail}
            {...compactProps}
          />
        );
      case 'email':
        return (
          <EmailAuthScreen
            onBack={handleBackToMain}
            selectedLanguage={selectedLanguage}
            onContinueWithPassword={handleContinueWithPassword}
            onContinueWithCode={handleContinueWithCode}
            onCreateAccount={handleCreateAccount}
            onSignUpClick={handleSignUpClick}
            initialEmail={userEmail}
            {...compactProps}
          />
        );
      case 'verification':
        return (
          <VerificationCodeScreen
            email={userEmail}
            onBack={handleBackFromVerification}
            onVerificationSuccess={handleVerificationSuccess}
            {...compactProps}
          />
        );
      case 'password':
        return (
          <PasswordAuthScreen
            email={userEmail}
            onBack={handleBackFromPassword}
            onSignInSuccess={handleSignInSuccess}
            onForgotPasswordClick={handleForgotPasswordClick}
            {...compactProps}
          />
        );
      case 'reset-password':
        return (
          <ResetPasswordScreen
            onBack={() => setCurrentScreen('password')}
            onResetSuccess={(email) => {
              setUserEmail(email);
              setCurrentScreen('otp-reset');
            }}
            initialEmail={userEmail}
            {...compactProps}
          />
        );
      case 'otp-reset':
        return (
          <OTPResetScreen
            email={userEmail}
            onBack={() => setCurrentScreen('reset-password')}
            onOTPVerified={(email, otp) => {
              setResetOTP(otp);
              setCurrentScreen('new-password');
            }}
            {...compactProps}
          />
        );
      case 'new-password':
        return (
          <NewPasswordScreen
            email={userEmail}
            otp={resetOTP}
            onBack={() => setCurrentScreen('otp-reset')}
            onPasswordResetSuccess={() => setCurrentScreen('success')}
            {...compactProps}
          />
        );
      case 'account-creation':
        return (
          <AccountCreationScreen
            email={userEmail}
            onBack={handleBackFromAccountCreation}
            onAccountCreated={handleAccountCreated}
            {...compactProps}
          />
        );
      case 'success':
        return (
          <SuccessScreen
            email={userEmail}
            onContinue={handleContinueToApp}
            {...compactProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
      {isExpanded ? (
        // Full page mode
        <div className="fixed inset-0 z-50 bg-background">
          <div className="h-full overflow-auto">
            {renderCurrentScreen()}
          </div>
        </div>
      ) : (
        // Drawer overlay mode
        <Drawer open={isOpen} onOpenChange={(open) => {
          if (!open) onClose();
        }}>
          <DrawerContent 
            className="h-auto max-h-[70vh] transition-all duration-300 ease-out"
            style={{
              transform: isDragging ? `translateY(${-dragY}px)` : undefined
            }}
          >
            {/* Drag handle */}
            <div 
              className="flex flex-col items-center pt-2 pb-4 cursor-grab active:cursor-grabbing select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div className="w-16 h-1.5 bg-gray-300 rounded-full shadow-sm hover:bg-gray-400 transition-colors" />
            </div>
            
            <div className="overflow-hidden px-0">
              {renderCurrentScreen()}
            </div>
          </DrawerContent>
        </Drawer>
      )}
      </LanguageProvider>
    </AuthProvider>
  );
};

export default AuthOverlay;
