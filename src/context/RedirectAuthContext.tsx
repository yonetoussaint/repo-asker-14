import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_BASE_URL = "https://account.mimaht.com";
const LOCAL_STORAGE_KEY = "redirect_auth_user";

export const RedirectAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Handle auth callback from external service
  useEffect(() => {
    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');
      const error = urlParams.get('error');

      if (error) {
        toast.error(`Authentication failed: ${error}`);
        navigate('/');
        return;
      }

      if (token && userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          setUser(userData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
          
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          toast.success("Successfully signed in!");
          navigate('/for-you');
        } catch (error) {
          console.error("Failed to parse user data:", error);
          toast.error("Authentication failed - invalid user data");
          navigate('/');
        }
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const signIn = () => {
  const currentUrl = window.location.origin + window.location.pathname;
  const redirectUrl = `${AUTH_BASE_URL}/signin?returnUrl=${encodeURIComponent(currentUrl)}`;
  window.location.href = redirectUrl;
};

const signUp = () => {
  const currentUrl = window.location.origin + window.location.pathname;
  const redirectUrl = `${AUTH_BASE_URL}/signin?returnUrl=${encodeURIComponent(currentUrl)}`;
  window.location.href = redirectUrl;
};


  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      
      // Optional: notify external auth service of logout
      const logoutUrl = `${AUTH_BASE_URL}/logout`;
      
      // Create a hidden iframe to call logout endpoint
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = logoutUrl;
      document.body.appendChild(iframe);
      
      // Remove iframe after a short delay
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
      
      toast.success("Signed out successfully!");
      navigate('/');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a RedirectAuthProvider");
  }
  return context;
};