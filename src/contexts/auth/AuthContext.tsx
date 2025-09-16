import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  profile_picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://supabase-y8ak.onrender.com/api';

  useEffect(() => {
    // Check authentication status immediately on app load
    checkAuthStatus();

    // Listen for auth state changes from other components
    const handleAuthChange = () => {
      console.log('Auth state change event detected, rechecking auth status');
      checkAuthStatus();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('Checking authentication status...');
      const token = localStorage.getItem('authToken');

      // If no token exists, user is not authenticated
      if (!token) {
        console.log('No token found in localStorage');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Skip verification for temporary tokens (from success screen)
      if (token.startsWith('authenticated_')) {
        console.log('Found temporary token, checking for stored user info');
        const userInfo = localStorage.getItem('userInfo') || localStorage.getItem('user');

        if (userInfo) {
          try {
            const userData = JSON.parse(userInfo);
            console.log('Using stored user data:', userData.email);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            clearAuthData();
          }
        } else {
          console.log('No user info found with temporary token');
          clearAuthData();
        }
        setIsLoading(false);
        return;
      }

      // Verify real token with backend
      console.log('Verifying token with backend...');
      const response = await fetch(`${API_BASE_URL}/verify-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Token verification successful:', data.user?.email || 'Unknown user');

        // Use backend user data if available
        const userData = data.user || JSON.parse(localStorage.getItem('userInfo') || '{}');
        setUser(userData);
        setIsAuthenticated(true);

        // Update stored user info with latest data from backend
        if (data.user) {
          localStorage.setItem('userInfo', JSON.stringify(data.user));
        }
      } else {
        console.log('Token verification failed, status:', response.status);
        clearAuthData();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = () => {
    console.log('Clearing authentication data');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = (userData: User, token: string) => {
    console.log('Logging in user:', userData.email);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    setUser(userData);
    setIsAuthenticated(true);

    // Trigger auth state change event
    window.dispatchEvent(new Event('authStateChanged'));
  };

  const logout = async () => {
    console.log('Logging out user');

    try {
      const token = localStorage.getItem('authToken');

      // Notify backend about logout if we have a real token
      if (token && !token.startsWith('authenticated_')) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error notifying backend about logout:', error);
    }

    clearAuthData();

    // Trigger auth state change event
    window.dispatchEvent(new Event('authStateChanged'));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};