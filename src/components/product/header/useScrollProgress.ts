
import { useState, useEffect } from "react";

// Hook to track scroll position and progress
export const useScrollProgress = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // You can easily adjust this max value - here 120 is a nice mobile-friendly threshold.
  const maxScroll = 120;
  const progress = Math.min(scrollY / maxScroll, 1);

  return { scrollY, progress };
};
