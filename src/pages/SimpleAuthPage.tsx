import React, { useEffect } from 'react';
import { useAuth } from '@/context/RedirectAuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

interface SimpleAuthPageProps {
  isOverlay?: boolean;
  onClose?: () => void;
}

const SimpleAuthPage = ({ isOverlay = false, onClose }: SimpleAuthPageProps) => {
  const { user, isLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/for-you');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect in useEffect
  }

  const containerClasses = isOverlay
    ? "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    : "min-h-screen flex items-center justify-center bg-background";

  const contentClasses = isOverlay
    ? "bg-background rounded-lg p-8 max-w-md w-full mx-4 shadow-xl"
    : "max-w-md w-full mx-4";

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        {isOverlay && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            ×
          </button>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome to Mima</h1>
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={signIn}
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </Button>

          <Button
            onClick={signUp}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <UserPlus className="h-5 w-5" />
            Create Account
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAuthPage;