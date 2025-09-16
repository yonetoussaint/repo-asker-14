import { useState, useEffect, useCallback, useRef } from 'react';
import { EmailCheckState } from '../../types/auth/email';

// List of trusted email providers - these are the only domains we accept
const TRUSTED_PROVIDERS = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'protonmail.com',
  'aol.com',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'fastmail.com',
  'tutanota.com',
  // Add more trusted providers as needed
];

export const useEmailValidation = (initialEmail = '') => {
  // Core email state
  const [email, setEmail] = useState(initialEmail);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailCheckState, setEmailCheckState] = useState<EmailCheckState>('unchecked');
  const [lastCheckedEmail, setLastCheckedEmail] = useState('');

  // NEW: Track when email has valid format but uses untrusted provider
  const [isUntrustedProvider, setIsUntrustedProvider] = useState(false);

  // Debounce timer for API calls
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Regular expression for basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to check if email domain is from a trusted provider
  const isFromTrustedProvider = useCallback((emailAddress: string): boolean => {
    if (!emailAddress.includes('@')) return false;

    const domain = emailAddress.split('@')[1]?.toLowerCase();
    return domain ? TRUSTED_PROVIDERS.includes(domain) : false;
  }, []);

  // Function to validate email format only (without provider check)
  const hasValidEmailFormat = useCallback((emailAddress: string): boolean => {
    return emailRegex.test(emailAddress);
  }, []);

  // Function to validate email format AND trusted provider (full validation)
  const validateEmail = useCallback((emailAddress: string): boolean => {
    return hasValidEmailFormat(emailAddress) && isFromTrustedProvider(emailAddress);
  }, [hasValidEmailFormat, isFromTrustedProvider]);

  // API call to check if email exists in database
  const checkEmailExists = useCallback(async (emailToCheck: string): Promise<boolean> => {
    try {
      const response = await fetch('https://supabase-y8ak.onrender.com/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToCheck }),
      });
      const data = await response.json();

      if (data.success) {
        return data.exists;
      } else {
        throw new Error(data.message || 'Failed to check email');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  }, []);

  // Debounced function to check email existence (prevents too many API calls)
  const debouncedEmailCheck = useCallback((emailToCheck: string) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for 800ms delay
    debounceTimeoutRef.current = setTimeout(async () => {
      // Only check if email passes full validation and hasn't been checked recently
      if (validateEmail(emailToCheck) && emailToCheck !== lastCheckedEmail) {
        setEmailCheckState('checking');

        try {
          const exists = await checkEmailExists(emailToCheck);
          setEmailCheckState(exists ? 'exists' : 'not-exists');
          setLastCheckedEmail(emailToCheck);
        } catch (error) {
          setEmailCheckState('error');
          setLastCheckedEmail(emailToCheck);
        }
      }
    }, 800);
  }, [checkEmailExists, lastCheckedEmail, validateEmail]);

  // MAIN VALIDATION EFFECT: This runs every time the email changes
  useEffect(() => {
    // Step 1: Check if email has basic valid format (user@domain.com)
    const hasValidFormat = hasValidEmailFormat(email);

    // Step 2: Check if the domain is from a trusted provider
    const isFromTrusted = isFromTrustedProvider(email);

    // Step 3: Email is only fully valid if both conditions are met
    const isFullyValid = hasValidFormat && isFromTrusted;

    // Update the main validation state
    setIsEmailValid(isFullyValid);

    // CRITICAL LOGIC: Determine if we should show "untrusted provider" message
    // This happens when:
    // 1. Email has correct format (user@domain.com)
    // 2. Email contains @ symbol (to avoid showing message for partial input)
    // 3. Domain is NOT in our trusted providers list
    const shouldShowUntrustedMessage = hasValidFormat && !isFromTrusted && email.includes('@');
    setIsUntrustedProvider(shouldShowUntrustedMessage);

    // Reset email check state if email is not fully valid
    if (!isFullyValid) {
      setEmailCheckState('unchecked');
      setLastCheckedEmail('');
    } else {
      // Email is fully valid, so check if it exists in our database
      debouncedEmailCheck(email);
    }
  }, [email, debouncedEmailCheck, hasValidEmailFormat, isFromTrustedProvider]);

  // Initialize validation state for initial email (if provided)
  useEffect(() => {
    if (initialEmail) {
      setIsEmailValid(validateEmail(initialEmail));
    }
  }, [initialEmail, validateEmail]);

  // Cleanup effect: Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Return all the states and helper functions that components need
  return {
    email,
    setEmail,
    isEmailValid,
    emailCheckState,
    isFromTrustedProvider: isFromTrustedProvider(email),
    trustedProviders: TRUSTED_PROVIDERS,
    isUntrustedProvider, // NEW: This tells us when to show the untrusted provider message
    hasValidEmailFormat: hasValidEmailFormat(email), // NEW: Useful for more granular UI feedback
  };
};