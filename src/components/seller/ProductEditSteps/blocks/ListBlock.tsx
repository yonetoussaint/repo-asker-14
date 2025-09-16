import React, { useState } from 'react';
import { ListBlock as ListBlockType } from './types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, Trash2, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ListBlockProps {
  block: ListBlockType;
  onUpdate: (block: ListBlockType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const ListBlockComponent: React.FC<ListBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleListTypeChange = (listType: 'bullet' | 'numbered' | 'checklist') => {
    onUpdate({ ...block, listType });
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...block.items];
    newItems[index] = value;
    onUpdate({ ...block, items: newItems });
  };

  const addItem = () => {
    const newItems = [...block.items, ''];
    onUpdate({ ...block, items: newItems });
    setEditingIndex(newItems.length - 1);
  };

  const removeItem = (index: number) => {
    const newItems = block.items.filter((_, i) => i !== index);
    onUpdate({ ...block, items: newItems });
  };

  const getListIcon = (index: number) => {
    switch (block.listType) {
      case 'numbered':
        return `${index + 1}.`;
      case 'checklist':
        return '☐';
      default:
        return '•';
    }
  };

  return (
    <div className="space-y-2">
      {block.items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 group/item">
          <span className="text-sm font-medium text-gray-500 min-w-[24px]">
            {getListIcon(index)}
          </span>
          
          {editingIndex === index ? (
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingIndex(null);
                  addItem();
                }
              }}
              placeholder="Enter list item..."
              className="flex-1 h-8 text-sm border-none shadow-none p-0 bg-transparent"
              autoFocus
            />
          ) : (
            <div
              className={`flex-1 cursor-pointer text-sm py-1 ${
                item ? '' : 'text-gray-400'
              }`}
              onClick={() => setEditingIndex(index)}
            >
              {item || 'Enter list item...'}
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(index)}
            className="opacity-0 group-hover/item:opacity-100 transition-opacity h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={addItem}
        className="text-xs text-gray-400 hover:text-gray-600"
      >
        <Plus className="h-3 w-3 mr-1" />
        Add item
      </Button>
    </div>
  );
};