import React from 'react';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor = "", className = "" }) => (
  <label htmlFor={htmlFor} className={className}>
    {children}
  </label>
);