import React, { useState, useEffect } from "react";
import { LogIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useAuthOverlay } from "@/context/AuthOverlayContext";
import { useNavigate } from "react-router-dom";

interface SignInBannerProps {
  openAuthDialog?: () => void;
}

export default function SignInBanner({ openAuthDialog }: SignInBannerProps) {
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();
  const navigate = useNavigate();
  const [hasStickyCheckout, setHasStickyCheckout] = useState(false);

  // Check if StickyCheckoutBar is present on the page
  useEffect(() => {
    const checkForStickyCheckout = () => {
      // Look for StickyCheckoutBar more specifically
      const stickyElements = document.querySelectorAll('[class*="z-[45]"], [class*="z-40"]');
      const hasCheckoutBar = Array.from(stickyElements).some(el => {
        const classList = el.classList.toString();
        return (
          classList.includes('bottom-0') && 
          classList.includes('fixed') &&
          (classList.includes('z-[45]') || (classList.includes('z-40') && classList.includes('shadow-lg')))
        );
      });
      setHasStickyCheckout(hasCheckoutBar);
    };

    // Initial check
    checkForStickyCheckout();

    // Set up observer to watch for DOM changes
    const observer = new MutationObserver(checkForStickyCheckout);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Don't show banner if user is logged in
  if (user) {
    return null;
  }

  const handleSignInClick = () => {
    openAuthOverlay();
  };

  // Dynamic positioning based on whether StickyCheckoutBar is present
  const bottomPosition = hasStickyCheckout ? 'bottom-0' : 'bottom-12';
  const zIndex = hasStickyCheckout ? 'z-50' : 'z-40';

  return (
    <div className={`fixed ${bottomPosition} left-0 right-0 ${zIndex} bg-gradient-to-r from-red-500/80 to-orange-500/80 backdrop-blur-sm py-1.5 px-4 flex items-center justify-between shadow-md`}>
      <div className="text-white text-xs font-medium">Sign in to explore more</div>
      <Button 
        onClick={handleSignInClick}
        size="sm" 
        className="bg-white hover:bg-white/90 text-red-500 shadow-sm flex items-center gap-1 px-2 py-0.5 h-6 rounded-full"
      >
        <LogIn className="w-3 h-3" />
        <span className="text-xs font-medium">Sign in</span>
      </Button>
    </div>
  );
}