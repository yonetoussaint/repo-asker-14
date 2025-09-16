
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    console.log('OAuth Callback - URL params:', {
      token: token ? 'present' : 'missing',
      error,
      success,
      fullURL: window.location.href
    });

    // Check if we received a success=false parameter
    if (success === 'false') {
      const message = searchParams.get('message') || 'Unknown error occurred';
      console.error('OAuth failed with message:', message);
      setErrorDetails(message);
      setTimeout(() => {
        navigate('/signin?error=oauth_failed');
      }, 3000);
      return;
    }

    if (error) {
      console.error('OAuth error:', error);
      setErrorDetails(error);
      setTimeout(() => {
        navigate('/signin?error=' + error);
      }, 3000);
      return;
    }

    if (token) {
      // Store the token and authentication status
      localStorage.setItem('authToken', token);
      localStorage.setItem('isAuthenticated', 'true');
      console.log('OAuth success, token received and stored');
      
      // Trigger auth state change event
      window.dispatchEvent(new Event('authStateChanged'));
      
      // Redirect to dashboard/home page
      navigate('/');
    } else {
      console.error('No token received in OAuth callback');
      setErrorDetails('No authentication token received');
      setTimeout(() => {
        navigate('/signin?error=no_token');
      }, 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        {errorDetails ? (
          <>
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-4">{errorDetails}</p>
            <p className="text-sm text-gray-500">Redirecting back to sign in...</p>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Processing sign in...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
