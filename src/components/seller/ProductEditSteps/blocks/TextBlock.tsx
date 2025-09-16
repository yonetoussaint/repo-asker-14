import React, { useState, useRef, useEffect } from 'react';
import { TextBlock as TextBlockType } from './types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, Trash2 } from 'lucide-react';

interface TextBlockProps {
  block: TextBlockType;
  onUpdate: (block: TextBlockType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const TextBlockComponent: React.FC<TextBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleContentChange = (content: string) => {
    onUpdate({ ...block, content });
  };

  const handleTextTypeChange = (textType: 'paragraph' | 'heading1' | 'heading2' | 'heading3') => {
    onUpdate({ ...block, textType });
  };

  const getTextStyles = () => {
    switch (block.textType) {
      case 'heading1':
        return 'text-3xl font-bold text-gray-900 leading-tight';
      case 'heading2':
        return 'text-2xl font-semibold text-gray-900 leading-tight';
      case 'heading3':
        return 'text-xl font-medium text-gray-900 leading-tight';
      default:
        return 'text-base leading-relaxed text-gray-900';
    }
  };

  const getPlaceholder = () => {
    switch (block.textType) {
      case 'heading1':
        return 'Heading 1';
      case 'heading2':
        return 'Heading 2';
      case 'heading3':
        return 'Heading 3';
      default:
        return "Type '/' for commands";
    }
  };

  const getTextareaStyles = () => {
    switch (block.textType) {
      case 'heading1':
        return 'text-3xl font-bold text-gray-900 leading-tight bg-transparent border-none outline-none resize-none w-full placeholder-gray-400';
      case 'heading2':
        return 'text-2xl font-semibold text-gray-900 leading-tight bg-transparent border-none outline-none resize-none w-full placeholder-gray-400';
      case 'heading3':
        return 'text-xl font-medium text-gray-900 leading-tight bg-transparent border-none outline-none resize-none w-full placeholder-gray-400';
      default:
        return 'text-base leading-relaxed text-gray-900 bg-transparent border-none outline-none resize-none w-full placeholder-gray-400';
    }
  };

  return isEditing ? (
    <textarea
      ref={textareaRef}
      value={block.content}
      onChange={(e) => handleContentChange(e.target.value)}
      onBlur={() => setIsEditing(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && block.textType !== 'paragraph') {
          e.preventDefault();
          setIsEditing(false);
        }
      }}
      placeholder={getPlaceholder()}
      className={getTextareaStyles()}
      style={{ minHeight: block.textType === 'paragraph' ? '24px' : '40px' }}
    />
  ) : (
    <div
      className={`${getTextStyles()} cursor-text min-h-[24px] py-1 ${
        !block.content ? 'text-gray-400' : ''
      }`}
      onClick={() => setIsEditing(true)}
    >
      {block.content || getPlaceholder()}
    </div>
  );
};