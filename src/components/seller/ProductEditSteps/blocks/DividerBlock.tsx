import React from 'react';
import { DividerBlock as DividerBlockType } from './types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Trash2 } from 'lucide-react';

interface DividerBlockProps {
  block: DividerBlockType;
  onUpdate: (block: DividerBlockType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const DividerBlockComponent: React.FC<DividerBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const handleStyleChange = (style: 'line' | 'dots' | 'stars') => {
    onUpdate({ ...block, style });
  };

  const renderDivider = () => {
    switch (block.style) {
      case 'dots':
        return (
          <div className="text-center text-gray-400 text-2xl py-4">
            • • •
          </div>
        );
      case 'stars':
        return (
          <div className="text-center text-gray-400 text-xl py-4">
            ★ ★ ★
          </div>
        );
      default:
        return <hr className="border-gray-300 my-4" />;
    }
  };

  return renderDivider();
};