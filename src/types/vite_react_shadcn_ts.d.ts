declare module 'vite_react_shadcn_ts' {
  import { ComponentType } from 'react';
  
  interface MainLoginScreenProps {
    onEmailAuth?: () => void;
    onGoogleAuth?: () => void;
    onGuestContinue?: () => void;
  }
  
  interface SignInScreenProps {
    onSuccess?: () => void;
    onError?: (error: any) => void;
  }
  
  export const MainLoginScreen: ComponentType<MainLoginScreenProps>;
  export const SignInScreen: ComponentType<SignInScreenProps>;
}