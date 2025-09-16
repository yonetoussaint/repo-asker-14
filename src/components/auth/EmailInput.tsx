
import React, { useRef, useEffect } from 'react';
import { Mail, Check, X, AlertTriangle } from 'lucide-react';
import { EmailCheckState } from '../../types/auth/email';
import { FAVICON_OVERRIDES } from '../../constants/auth/email';

interface EmailInputProps {
  email: string;
  onEmailChange: (value: string) => void;
  emailCheckState: EmailCheckState;
  isLoading: boolean;
  isUntrustedProvider?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  onEmailChange,
  emailCheckState,
  isLoading,
  isUntrustedProvider = false,
}) => {
  const emailInputRef = useRef<HTMLInputElement>(null);

  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  };

  const updateFavicon = (emailValue: string) => {
  const domain = extractDomain(emailValue);
  if (domain && FAVICON_OVERRIDES[domain]) {
    return {
      url: FAVICON_OVERRIDES[domain],
      show: true,
      domain,
    };
  }
  return {
    url: '',
    show: false,
    domain: '',
  };
};
  const { url: faviconUrl, show: showFavicon } = updateFavicon(email);

  useEffect(() => {
    const input = emailInputRef.current;
    if (!input) return;

    const syncWithDOM = () => {
      const domValue = input.value;
      if (domValue !== email && domValue.length > 0) {
        onEmailChange(domValue);
        return true;
      }
      return false;
    };

    const handleFocus = () => {
      setTimeout(syncWithDOM, 50);
      setTimeout(syncWithDOM, 200);
      setTimeout(syncWithDOM, 500);
    };

    const handleBlur = () => {
      syncWithDOM();
    };

    const handleInput = () => {
      syncWithDOM();
    };

    const handleChange = () => {
      syncWithDOM();
    };

    const observer = new MutationObserver(() => {
      syncWithDOM();
    });

    observer.observe(input, {
      attributes: true,
      attributeFilter: ['value']
    });

    const pollInterval = setInterval(() => {
      syncWithDOM();
    }, 100);

    const stopPolling = setTimeout(() => {
      clearInterval(pollInterval);
    }, 5000);

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleChange);

    setTimeout(syncWithDOM, 100);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(stopPolling);
      observer.disconnect();
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('input', handleInput);
      input.removeEventListener('change', handleChange);
    };
  }, [email, onEmailChange]);

  const getRightSideIcon = () => {
    // Show alert icon for untrusted provider first
    if (isUntrustedProvider) {
      return (
        <div className="w-5 h-5">
          <AlertTriangle className="w-full h-full text-orange-500" />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="w-5 h-5">
          <svg className="animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      );
    }

    if (emailCheckState === 'checking') {
      return (
        <div className="w-5 h-5">
          <svg className="animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      );
    }

    if (emailCheckState === 'exists') {
      return (
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
            <path fill="#10b981" d="M21.672,12.954l-1.199-1.965l0.597-2.224c0.124-0.463-0.098-0.949-0.529-1.159L18.47,6.601l-0.7-2.193	c-0.146-0.457-0.596-0.746-1.072-0.689l-2.286,0.274l-1.775-1.467c-0.37-0.306-0.904-0.306-1.274,0L9.588,3.993L7.302,3.719	C6.826,3.662,6.376,3.951,6.231,4.407l-0.7,2.193L3.459,7.606C3.028,7.815,2.806,8.302,2.93,8.765l0.597,2.224l-1.199,1.965	c-0.25,0.409-0.174,0.939,0.181,1.261l1.704,1.548l0.054,2.302c0.011,0.479,0.361,0.883,0.834,0.963l2.271,0.381l1.29,1.907	c0.269,0.397,0.782,0.548,1.222,0.359L12,20.767l2.116,0.907c0.441,0.189,0.954,0.038,1.222-0.359l1.29-1.907l2.271-0.381	c0.473-0.079,0.823-0.483,0.834-0.963l0.054-2.302l1.704-1.548C21.846,13.892,21.922,13.363,21.672,12.954z M14.948,11.682	l-2.868,3.323c-0.197,0.229-0.476,0.347-0.758,0.347c-0.215,0-0.431-0.069-0.613-0.211l-1.665-1.295	c-0.436-0.339-0.515-0.968-0.175-1.403l0,0c0.339-0.435,0.967-0.514,1.403-0.175l0.916,0.712l2.247-2.603	c0.361-0.418,0.992-0.464,1.41-0.104C15.263,10.632,15.309,11.264,14.948,11.682z"/>
          </svg>
        );
    }

    if (emailCheckState === 'not-exists') {
      return (
        <div className="w-5 h-5">
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-2.517-7.665c.112-.223.268-.424.488-.57C11.186 8.12 11.506 8 12 8c.384 0 .766.118 1.034.319a.95.95 0 0 1 .403.806c0 .48-.218.81-.62 1.186a9 9 0 0 1-.409.354l-.294.249c-.246.213-.524.474-.738.795l-.126.19V13.5a.75.75 0 0 0 1.5 0v-1.12c.09-.1.203-.208.347-.333.063-.055.14-.119.222-.187.166-.14.358-.3.52-.452.536-.5 1.098-1.2 1.098-2.283a2.45 2.45 0 0 0-1.003-2.006C13.37 6.695 12.658 6.5 12 6.5c-.756 0-1.373.191-1.861.517a2.94 2.94 0 0 0-.997 1.148.75.75 0 0 0 1.341.67"/>
            <path fillRule="evenodd" d="M9.864 1.2a3.61 3.61 0 0 1 4.272 0l1.375 1.01c.274.2.593.333.929.384l1.686.259a3.61 3.61 0 0 1 3.021 3.02l.259 1.687c.051.336.183.655.384.929l1.01 1.375a3.61 3.61 0 0 1 0 4.272l-1.01 1.375a2.1 2.1 0 0 0-.384.929l-.259 1.686a3.61 3.61 0 0 1-3.02 3.021l-1.687.259a2.1 2.1 0 0 0-.929.384l-1.375 1.01a3.61 3.61 0 0 1-4.272 0l-1.375-1.01a2.1 2.1 0 0 0-.929-.384l-1.686-.259a3.61 3.61 0 0 1-3.021-3.02l-.259-1.687a2.1 2.1 0 0 0-.384-.929L1.2 14.136a3.61 3.61 0 0 1 0-4.272l1.01-1.375a2.1 2.1 0 0 0 .384-.929l.259-1.686a3.61 3.61 0 0 1 3.02-3.021l1.687-.259a2.1 2.1 0 0 0 .929-.384zm3.384 1.209a2.11 2.11 0 0 0-2.496 0l-1.376 1.01a3.6 3.6 0 0 1-1.589.658l-1.686.258a2.11 2.11 0 0 0-1.766 1.766l-.258 1.686a3.6 3.6 0 0 1-.658 1.59l-1.01 1.375a2.11 2.11 0 0 0 0 2.496l1.01 1.376a3.6 3.6 0 0 1 .658 1.589l.258 1.686a2.11 2.11 0 0 0 1.766 1.765l1.686.26a3.6 3.6 0 0 1 1.59.657l1.375 1.01a2.11 2.11 0 0 0 2.496 0l1.376-1.01a3.6 3.6 0 0 1 1.589-.658l1.686-.258a2.11 2.11 0 0 0 1.765-1.766l.26-1.686a3.6 3.6 0 0 1 .657-1.59l1.01-1.375a2.11 2.11 0 0 0 0-2.496l-1.01-1.376a3.6 3.6 0 0 1-.658-1.589l-.258-1.686a2.11 2.11 0 0 0-1.766-1.766l-1.686-.258a3.6 3.6 0 0 1-1.59-.658z"/>
          </svg>
        </div>
      );
    }

    if (emailCheckState === 'error') {
      return (
        <div className="w-5 h-5">
          <svg className="text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
      );
    }

    return null;
  };

  const handleFaviconError = () => {
    // Icon failed to load
  };

  return (
   <div className="relative">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10">
            {showFavicon && faviconUrl ? (
              <img
                src={faviconUrl}
                alt="Email provider favicon"
                className="w-full h-full object-contain"
                onError={handleFaviconError}
              />
            ) : (
              <Mail className="w-full h-full text-gray-400" />
            )}
          </div>

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            {getRightSideIcon()}
          </div>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
            ref={emailInputRef}
            disabled={isLoading}
            className="relative w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-transparent disabled:opacity-50"
          />
        </div>
      </div>
  );
};

export default EmailInput;
