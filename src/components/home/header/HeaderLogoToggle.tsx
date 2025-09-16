
import Logo from '../Logo';

interface HeaderLogoToggleProps {
  progress: number;
  togglePanel: () => void;
  isOpen: boolean;
  activeTab: string;
}

const HeaderLogoToggle = ({ 
  progress, 
  togglePanel, 
  isOpen,
  activeTab 
}: HeaderLogoToggleProps) => {
  return (
    <div
      className="flex items-center space-x-1 cursor-pointer"
      onClick={togglePanel}
    >
      <Logo />
    </div>
  );
};

export default HeaderLogoToggle;
