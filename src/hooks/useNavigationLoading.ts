import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useNavigationLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(false);
  }, [location]);

  const startLoading = () => {
    setIsLoading(true);
  };

  return { isLoading, startLoading };
};