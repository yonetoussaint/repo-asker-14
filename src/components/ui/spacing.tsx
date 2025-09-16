import React from 'react';

interface SpacingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  children: React.ReactNode;
  className?: string;
}

const spacingMap = {
  none: '',
  xs: 'py-2',
  sm: 'py-3', 
  md: 'py-4',
  lg: 'py-6',
  xl: 'py-8'
};

export const Spacing = React.forwardRef<HTMLDivElement, SpacingProps>(({ 
  size = 'xs', 
  children, 
  className = '' 
}, ref) => {
  const spacingClass = spacingMap[size];
  
  return (
    <div ref={ref} className={`w-full px-2 ${spacingClass} ${className}`}>
      {children}
    </div>
  );
});

Spacing.displayName = 'Spacing';