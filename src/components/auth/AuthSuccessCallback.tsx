// AuthSuccess.js - Component to handle OAuth callback
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuthCallback = () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const userData = urlParams.get('user');
      const isNewUser = urlParams.get('new') === 'true';

      if (token && userData) {
        try {
          // Parse user data
          const user = JSON.parse(decodeURIComponent(userData));
          
          // Store token in localStorage or your preferred method
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          console.log('Auth successful:', { user, isNewUser });
          
          // Redirect based on whether user is new or returning
          if (isNewUser) {
            navigate('/onboarding'); // or wherever you want new users to go
          } else {
            navigate('/dashboard'); // or your main app route
          }
        } catch (error) {
          console.error('Error processing auth callback:', error);
          navigate('/login?error=processing_failed');
        }
      } else {
        console.error('Missing token or user data in callback');
        navigate('/login?error=missing_data');
      }
    };

    processAuthCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;