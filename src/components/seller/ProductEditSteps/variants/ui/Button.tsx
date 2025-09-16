import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm";
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = "default", 
  size = "default", 
  disabled = false, 
  className = "", 
  children, 
  ...props 
}) => {
  const baseClass = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500";
  const variantClass = variant === "outline" ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeClass = size === "sm" ? "px-3 py-1 text-sm" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};