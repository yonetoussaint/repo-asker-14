import React from 'react';

/**
 * Formats description text with markdown-like syntax into HTML
 * Same formatting logic as used in DescriptionEditor preview
 */
export const formatDescription = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.*)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
    .replace(/^## (.*)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^• (.*)$/gm, '<li class="ml-4">• $1</li>')
    .replace(/^\d+\. (.*)$/gm, '<li class="ml-4">$1</li>')
    .split('\n\n') // Split by double newlines for paragraphs
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => {
      // Don't wrap already formatted elements (blockquotes, headers, lists)
      if (paragraph.startsWith('<blockquote') || paragraph.startsWith('<h2') || paragraph.startsWith('<li')) {
        return paragraph;
      }
      // Wrap plain text in paragraph tags
      return `<p class="mb-4">${paragraph.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
};

/**
 * Component wrapper to render formatted description
 */
export const FormattedDescription: React.FC<{ 
  text: string; 
  className?: string; 
}> = ({ text, className = '' }) => {
  return (
    <div 
      className={`prose prose-gray max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: formatDescription(text) }}
    />
  );
};