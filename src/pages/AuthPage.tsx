import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import SignInScreen from '@/components/auth/SignInScreen';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <AuthProvider>
        <LanguageProvider>
          <SignInScreen />
        </LanguageProvider>
      </AuthProvider>
    </div>
  );
};

export default AuthPage;