import React, { useState, useRef, useEffect } from 'react';
import { CodeBlock as CodeBlockType } from './types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Trash2 } from 'lucide-react';

interface CodeBlockProps {
  block: CodeBlockType;
  onUpdate: (block: CodeBlockType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const CodeBlockComponent: React.FC<CodeBlockProps> = ({
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

  const handleLanguageChange = (language: string) => {
    onUpdate({ ...block, language: language || undefined });
  };

  const languages = [
    { value: '', label: 'Plain Text' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'yaml', label: 'YAML' },
  ];

  return (
    <div className="bg-gray-100 rounded-lg p-3 font-mono">
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={block.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          placeholder="Enter code..."
          className="w-full resize-none border-none outline-none bg-transparent font-mono text-sm"
          style={{ minHeight: '100px' }}
        />
      ) : (
        <pre
          className={`cursor-pointer text-sm min-h-[100px] whitespace-pre-wrap ${
            block.content ? '' : 'text-gray-400'
          }`}
          onClick={() => setIsEditing(true)}
        >
          {block.content || 'Enter code...'}
        </pre>
      )}
    </div>
  );
};