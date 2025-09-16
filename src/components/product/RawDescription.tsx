import React from 'react';

interface RawDescriptionProps {
  content: string;
  className?: string;
}

const RawDescription: React.FC<RawDescriptionProps> = ({ content, className = '' }) => {
  console.log('🔍 DEBUG RawDescription: Received content:', content);
  
  if (!content) {
    return <div className={className}>No description available.</div>;
  }

  return (
    <div
      className={`prose prose-gray max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RawDescription;
