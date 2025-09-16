import React from 'react';

interface ProductSectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const ProductSectionWrapper = React.forwardRef<HTMLDivElement, ProductSectionWrapperProps>(({ 
  children, 
  className = "",
  noPadding = false 
}, ref) => {
  const baseClasses = noPadding ? "" : "px-2 py-1";
  
  return (
    <div ref={ref} className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
});

ProductSectionWrapper.displayName = 'ProductSectionWrapper';

export default ProductSectionWrapper;