import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ToggleExpandButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  labelExpanded?: string;
  labelCollapsed?: string;
  className?: string;
}

const ToggleExpandButton: React.FC<ToggleExpandButtonProps> = ({
  isExpanded,
  onToggle,
  labelExpanded = "View less",
  labelCollapsed = "View more",
  className = "",
}) => {
  return (
    <button
      onClick={onToggle}
      className={`text-red-500 text-xs font-medium flex items-center justify-center mx-auto hover:text-red-600 transition-colors ${className}`}
    >
      {isExpanded ? labelExpanded : labelCollapsed}
      {isExpanded ? (
        <ChevronUp size={12} className="ml-1" />
      ) : (
        <ChevronDown size={12} className="ml-1" />
      )}
    </button>
  );
};

export default ToggleExpandButton;