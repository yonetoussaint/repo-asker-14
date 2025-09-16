export type EmailCheckState = 'unchecked' | 'checking' | 'exists' | 'not-exists' | 'error';

export interface EmailAuthScreenProps {
  onBack: () => void;
  selectedLanguage: string;
  onContinueWithPassword: (email: string) => void;
  onContinueWithCode: (email: string) => void;
  onCreateAccount: (email: string) => void;
  onSignUpClick: () => void;
  initialEmail?: string;
  isCompact?: boolean;
  onExpand?: () => void;
}