import React, { useState, useRef, useEffect } from 'react';
import { QuoteBlock as QuoteBlockType } from './types';
import { Button } from '@/components/ui/button';
import { Quote, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuoteBlockProps {
  block: QuoteBlockType;
  onUpdate: (block: QuoteBlockType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const QuoteBlockComponent: React.FC<QuoteBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [isEditingAuthor, setIsEditingAuthor] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingContent && contentRef.current) {
      contentRef.current.focus();
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = contentRef.current.scrollHeight + 'px';
    }
    if (isEditingAuthor && authorRef.current) {
      authorRef.current.focus();
    }
  }, [isEditingContent, isEditingAuthor]);

  const handleContentChange = (content: string) => {
    onUpdate({ ...block, content });
  };

  const handleAuthorChange = (author: string) => {
    onUpdate({ ...block, author: author || undefined });
  };

  return (
    <div className="border-l-4 border-blue-400 pl-4 py-2 bg-gray-50 rounded-r-lg">
      {isEditingContent ? (
        <textarea
          ref={contentRef}
          value={block.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onBlur={() => setIsEditingContent(false)}
          placeholder="Enter quote text..."
          className="w-full resize-none border-none outline-none bg-transparent text-lg italic font-medium"
          style={{ minHeight: '60px' }}
        />
      ) : (
        <div
          className={`text-lg italic font-medium cursor-pointer min-h-[60px] ${
            block.content ? '' : 'text-gray-400'
          }`}
          onClick={() => setIsEditingContent(true)}
        >
          {block.content || 'Enter quote text...'}
        </div>
      )}
      
      {/* Author section */}
      <div className="mt-3">
        {isEditingAuthor ? (
          <Input
            ref={authorRef}
            value={block.author || ''}
            onChange={(e) => handleAuthorChange(e.target.value)}
            onBlur={() => setIsEditingAuthor(false)}
            placeholder="— Author (optional)"
            className="text-sm font-medium bg-transparent border-none shadow-none p-0 h-auto"
          />
        ) : (
          <div
            className={`text-sm font-medium cursor-pointer ${
              block.author ? '' : 'text-gray-400'
            }`}
            onClick={() => setIsEditingAuthor(true)}
          >
            {block.author ? `— ${block.author}` : '— Author (optional)'}
          </div>
        )}
      </div>
    </div>
  );
};