import React, { useState } from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { EmailAuthScreenProps } from '../../types/auth/email';
import { useEmailValidation } from '../../hooks/auth/useEmailValidation';
import EmailInput from './EmailInput';
import DomainSuggestions from './DomainSuggestions';
import EmailStatusMessage from './EmailStatusMessage';
import EmailActionButtons from './EmailActionButtons';

const EmailAuthScreen: React.FC<EmailAuthScreenProps> = ({
  onBack,
  selectedLanguage,
  onContinueWithPassword,
  onContinueWithCode,
  onCreateAccount,
  onSignUpClick,
  initialEmail = '',
  isCompact = false,
  onExpand,
}) => {
  // Extract the new isUntrustedProvider value from the hook
  // This tells us when an email has valid format but uses an untrusted domain
  const { 
    email, 
    setEmail, 
    isEmailValid, 
    emailCheckState, 
    isUntrustedProvider  // This is the new value we're extracting
  } = useEmailValidation(initialEmail);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showDomainSuggestions, setShowDomainSuggestions] = useState(false);

  const API_BASE_URL = 'https://supabase-y8ak.onrender.com/api';

  const handleEmailChange = (value: string) => {
    setEmail(value);

    // Show domain suggestions logic remains the same
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const afterAt = value.slice(atIndex + 1);
      setShowDomainSuggestions(afterAt === '' || (!afterAt.includes('.') && afterAt.length < 15));
    } else {
      setShowDomainSuggestions(false);
    }
  };

  // Email provider icon component - no changes needed here
  const EmailIcon = ({ provider }) => {
    const icons = {
      gmail: (
        <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path>
          <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path>
          <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon>
          <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"></path>
          <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"></path>
        </svg>
      ),
      outlook: (
        <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#1a237e" d="M43.607,23.752l-7.162-4.172v11.594H44v-6.738C44,24.155,43.85,23.894,43.607,23.752z"></path>
          <path fill="#0c4999" d="M33.919,8.84h9.046V7.732C42.965,6.775,42.19,6,41.234,6H17.667c-0.956,0-1.732,0.775-1.732,1.732 V8.84h9.005H33.919z"></path>
          <path fill="#0f73d9" d="M33.919,33.522h7.314c0.956,0,1.732-0.775,1.732-1.732v-6.827h-9.046V33.522z"></path>
          <path fill="#0f439d" d="M15.936,24.964v6.827c0,0.956,0.775,1.732,1.732,1.732h7.273v-8.558H15.936z"></path>
          <path fill="#2ecdfd" d="M33.919 8.84H42.964999999999996V16.866999999999997H33.919z"></path>
          <path fill="#1c5fb0" d="M15.936 8.84H24.941000000000003V16.866999999999997H15.936z"></path>
          <path fill="#1467c7" d="M24.94 24.964H33.919V33.522H24.94z"></path>
          <path fill="#1690d5" d="M24.94 8.84H33.919V16.866999999999997H24.94z"></path>
          <path fill="#1bb4ff" d="M33.919 16.867H42.964999999999996V24.963H33.919z"></path>
          <path fill="#074daf" d="M15.936 16.867H24.941000000000003V24.963H15.936z"></path>
          <path fill="#2076d4" d="M24.94 16.867H33.919V24.963H24.94z"></path>
          <path fill="#2ed0ff" d="M15.441,42c0.463,0,26.87,0,26.87,0C43.244,42,44,41.244,44,40.311V24.438 c0,0-0.03,0.658-1.751,1.617c-1.3,0.724-27.505,15.511-27.505,15.511S14.978,42,15.441,42z"></path>
          <path fill="#139fe2" d="M42.279,41.997c-0.161,0-26.59,0.003-26.59,0.003C14.756,42,14,41.244,14,40.311V25.067 l29.363,16.562C43.118,41.825,42.807,41.997,42.279,41.997z"></path>
          <path fill="#00488d" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path>
          <path fill="#fff" d="M13.914,18.734c-3.131,0-5.017,2.392-5.017,5.343c0,2.951,1.879,5.342,5.017,5.342 c3.139,0,5.017-2.392,5.017-5.342C18.931,21.126,17.045,18.734,13.914,18.734z M13.914,27.616c-1.776,0-2.838-1.584-2.838-3.539 s1.067-3.539,2.838-3.539c1.771,0,2.839,1.585,2.839,3.539S15.689,27.616,13.914,27.616z"></path>
        </svg>
      ),
      yahoo: (
        <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <polygon fill="#5e35b1" points="4.209,14.881 11.632,14.881 16.189,26.715 20.966,14.881 28.315,14.881 17.07,42 9.501,42 12.587,34.96"></polygon>
          <circle cx="29.276" cy="30.522" r="4.697" fill="#5e35b1"></circle>
          <polygon fill="#5e35b1" points="34.693,6 27.213,24.042 35.444,24.042 42.925,6"></polygon>
        </svg>
      ),
      hotmail: (
        <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#f57c00" d="M7,38c-2.075,0-6-1.132-6-5.416c0-3.997,3.503-5.95,5.858-6.288	c5.277-0.755,8.417-0.488,20.577,5.388C42.229,38.834,48,31,48,31s-1.684,4.039-6,5c-3.286,0.731-8.216,0.973-15.436-2.516	C14.91,27.853,11.985,27.58,7.142,28.276C5.99,28.441,3,29.537,3,32.584C3,35.961,6.837,36,7,36c0.553,0,1,0.447,1,1S7.553,38,7,38z"></path>
          <path fill="#f57c00" d="M22.039,22.625c-0.644,0-1.287-0.155-1.871-0.464L6,14.661v9.762 c0.196-0.043,0.389-0.08,0.575-0.107c1.119-0.16,2.454-0.324,3.869-0.324c4.24,0,8.748,1.486,17.862,5.891 c3.858,1.865,7.384,2.811,10.479,2.811c1.239,0,2.301-0.156,3.215-0.39V13.118l-18.172,9.086 C23.266,22.485,22.652,22.625,22.039,22.625z"></path>
          <path fill="#f57c00" d="M21.104,20.394c0.57,0.301,1.254,0.31,1.83,0.021l19.049-9.525 c-0.087-1.046-0.969-1.863-2.039-1.833l-32,0.889C6.862,9.976,6,10.862,6,11.945v0.453L21.104,20.394z"></path>
          <path fill="#f57c00" d="M38.785,34.693c-2.964,0-6.714-0.769-11.349-3.01c-9.241-4.465-13.272-5.691-16.991-5.691 c-1.175,0-2.319,0.122-3.586,0.304C6.586,26.335,6.296,26.405,6,26.489v11.566c0,1.083,0.862,1.969,1.944,1.999l32,0.889 C41.07,40.974,42,40.07,42,38.944v-4.589C41.052,34.562,39.987,34.693,38.785,34.693z"></path>
          <path fill="#f57c00" d="M38,26.673v1.772c1.543-0.004,2.871-0.193,4-0.444c4.316-0.961,5-5,5-5S45.058,26.985,38,26.673z"></path>
        </svg>
      ),
      aol: (
        <svg width="16" height="16" viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
          <path d="M156.19727 0 0 387.89062h109.33789l18.22266-54.66992h135.37109l18.22266 54.66992h109.33789L236.89844 0h-80.70117zm598.75585 0v387.89062h85.90821V0h-85.90821zM550.5957 85.908203c-89.81391 0-157.75976 69.768357-157.75976 156.197267 0 91.11491 70.80985 156.19726 157.75976 156.19726 86.94892 0 157.49805-65.08235 157.49805-156.19726 0-86.42891-67.68514-156.197267-157.49805-156.197267zM196.54883 122.35547l40.34961 130.16406h-80.70117l40.35156-130.16406zm354.04687 46.07812c38.78896-.26 70.54883 32.79992 70.54883 73.67188 0 40.61096-31.75987 73.67383-70.54883 73.67383-38.78896 0-70.54882-33.06287-70.54882-73.67383 0-40.87196 31.75986-73.67188 70.54882-73.67188zm394.73438 120.52149c-30.19797 0-54.66797 24.47-54.66797 54.66797 0 30.19797 24.47 54.66992 54.66797 54.66992 30.19797 0 54.66992-24.47195 54.66992-54.66992 0-30.19797-24.47195-54.66797-54.66992-54.66797z"/>
        </svg>
      ),
      icloud: (
        <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#29b6f6" d="M38.9,22.1c0-0.4,0.1-0.7,0.1-1.1c0-6.1-4.9-11-11-11c-4.9,0-9.1,3.3-10.5,7.7 c-1-1.1-2.4-1.7-4-1.7c-3,0-5.5,2.5-5.5,5.5c0,0.3,0,0.5,0.1,0.7C4.6,23.1,2,26.3,2,30c0,4.4,3.6,8,8,8h28c4.4,0,8-3.6,8-8 C46,25.9,42.9,22.5,38.9,22.1z"></path>
          <path fill="#1565c0" d="M38,39H10c-5,0-9-4-9-9c0-3.8,2.4-7.2,6-8.5c0,0,0,0,0,0c0-3.6,2.9-6.5,6.5-6.5 c1.3,0,2.5,0.4,3.6,1.1C19,11.8,23.2,9,28,9c6.6,0,12,5.4,12,12c0,0.1,0,0.2,0,0.2c4.1,0.9,7,4.5,7,8.8C47,35,43,39,38,39z M13.5,17C11,17,9,19,9,21.5c0,0.2,0,0.4,0,0.6L9.2,23l-0.9,0.2C5.2,24,3,26.8,3,30c0,3.9,3.1,7,7,7h28c3.9,0,7-3.1,7-7 c0-3.5-2.7-6.5-6.2-6.9l-1-0.1l0.1-1c0-0.3,0-0.6,0-1c0-5.5-4.5-10-10-10c-4.4,0-8.2,2.8-9.5,7l-0.5,1.6l-1.2-1.2 C15.9,17.5,14.7,17,13.5,17z"></path>
        </svg>
      ),
      protonmail: (
        <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#d1c4e9" d="M42.449,9.264L26.355,22.088c-1.401,1.117-3.404,1.112-4.8-0.01L5.535,9.198	C4.909,8.721,4,9.161,4,9.941v5.603v19.732c0,2.076,1.706,3.758,3.81,3.758H40.19c2.104,0,3.81-1.683,3.81-3.758V9.995	C44,9.205,43.072,8.767,42.449,9.264z"></path>
          <path fill="#7c4dff" d="M35.429,14.858l-13.79,10.988c-1.4,1.115-3.399,1.112-4.796-0.007L4,15.545v19.732	c0,2.076,1.706,3.758,3.81,3.758h27.619V14.858z"></path>
        </svg>
      ),
      more: (
        <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="#666" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path>
          <path fill="#fff" d="M18,20h4v4h-4V20z M22,20h4v4h-4V20z M26,20h4v4h-4V20z"></path>
        </svg>
      )
    };

    return icons[provider] || icons.more;
  };

  const handleDomainClick = (domain: string) => {
    const atIndex = email.lastIndexOf('@');
    const localPart = atIndex === -1 ? email : email.slice(0, atIndex);
    const newEmail = `${localPart}@${domain}`;
    setEmail(newEmail);
    setShowDomainSuggestions(false);
  };

  // Event handlers remain the same - no changes needed
  const handleContinueWithPassword = async () => {
    if (!isEmailValid || isLoading || emailCheckState !== 'exists') return;

    console.log('EmailAuthScreen: handleContinueWithPassword called for email:', email);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('EmailAuthScreen: Calling onContinueWithPassword');
      onContinueWithPassword(email);
    } catch (error) {
      console.error('Error continuing with password:', error);
      onContinueWithPassword(email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithCode = async () => {
    if (!isEmailValid || isLoading || emailCheckState === 'checking') return;
    
    console.log('EmailAuthScreen: handleContinueWithCode called for email:', email);
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Verification code sent successfully');
        console.log('EmailAuthScreen: Calling onContinueWithCode');
        onContinueWithCode(email);
      } else {
        console.error('Failed to send OTP:', data.message);
        console.log('EmailAuthScreen: Calling onContinueWithCode (fallback)');
        onContinueWithCode(email);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      console.log('EmailAuthScreen: Calling onContinueWithCode (error fallback)');
      onContinueWithCode(email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccountClick = async () => {
    if (!isEmailValid || isLoading || emailCheckState === 'checking') return;
    
    console.log('EmailAuthScreen: handleCreateAccountClick called for email:', email);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('EmailAuthScreen: Calling onCreateAccount');
      onCreateAccount(email);
    } catch (error) {
      console.error('Error navigating to create account:', error);
      onCreateAccount(email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header section - hide in compact mode */}
      {!isCompact && (
        <div className="pt-2 pb-3 flex items-center justify-between">
          <button
            onClick={() => {
              console.log('EmailAuthScreen: Back button clicked');
              onBack();
            }}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Go back"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900">
            Continue with Email
          </h2>

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            aria-label="Help"
            onClick={() => alert('Need help? Contact support@example.com')}
            type="button"
            disabled={isLoading}
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Progress Bar - always show */}
      <div className="mb-4 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            What's your email?
          </h1>
          <p className="text-gray-600">
            We'll see if you have an account — if not, we'll help you create one.
          </p>
        </div>

        {/* THIS IS THE KEY CHANGE: Pass the isUntrustedProvider prop */}
        
  <div className="flex flex-col gap-2">
  <EmailStatusMessage
    emailCheckState={emailCheckState}
    isUntrustedProvider={isUntrustedProvider}
  />

  <EmailInput
    email={email}
    onEmailChange={handleEmailChange}
    emailCheckState={emailCheckState}
    isLoading={isLoading}
    isUntrustedProvider={isUntrustedProvider}
  />

  <EmailActionButtons
    isEmailValid={isEmailValid}
    emailCheckState={emailCheckState}
    isLoading={isLoading}
    isUntrustedProvider={isUntrustedProvider}
    onContinueWithPassword={handleContinueWithPassword}
    onContinueWithCode={handleContinueWithCode}
    onCreateAccount={handleCreateAccountClick}
  />
</div>


        {/* Email providers section - only show in full mode */}
        {!isCompact && (
          <div className="text-center mb-8">
            {/* Accepted Email Providers section */}
            <div>
              <p className="text-center text-sm text-gray-500 mb-4">Accepted email providers</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center gap-1">
                    <EmailIcon provider="gmail" />
                    <span className="text-xs font-medium text-gray-900">Gmail</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center gap-1">
                    <EmailIcon provider="outlook" />
                    <span className="text-xs font-medium text-gray-900">Outlook</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center gap-1">
                    <EmailIcon provider="yahoo" />
                    <span className="text-xs font-medium text-gray-900">Yahoo</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center gap-1">
                    <EmailIcon provider="hotmail" />
                    <span className="text-xs font-medium text-gray-900">Hotmail</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center gap-1">
                    <EmailIcon provider="aol" />
                    <span className="text-xs font-medium text-gray-900">AOL</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center gap-1">
                    <EmailIcon provider="icloud" />
                    <span className="text-xs font-medium text-gray-900">iCloud</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center gap-1">
                    <EmailIcon provider="protonmail" />
                    <span className="text-xs font-medium text-gray-900">ProtonMail</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-center gap-1">
                    <EmailIcon provider="more" />
                    <span className="text-xs font-medium text-gray-900">More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailAuthScreen;