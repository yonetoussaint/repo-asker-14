import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthOverlayContextType {
  isAuthOverlayOpen: boolean;
  setIsAuthOverlayOpen: (value: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  openAuthOverlay: () => void;
}

const AuthOverlayContext = createContext<AuthOverlayContextType | undefined>(undefined);

export const useAuthOverlay = () => {
  const context = useContext(AuthOverlayContext);
  if (!context) {
    throw new Error('useAuthOverlay must be used within an AuthOverlayProvider');
  }
  return context;
};

interface AuthOverlayProviderProps {
  children: ReactNode;
}

export const AuthOverlayProvider: React.FC<AuthOverlayProviderProps> = ({ children }) => {
  const [isAuthOverlayOpen, setIsAuthOverlayOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthOverlay = () => {
    setIsAuthOverlayOpen(true);
  };

  return (
    <AuthOverlayContext.Provider 
      value={{ 
        isAuthOverlayOpen, 
        setIsAuthOverlayOpen, 
        authMode, 
        setAuthMode,
        openAuthOverlay
      }}
    >
      {children}
    </AuthOverlayContext.Provider>
  );
};