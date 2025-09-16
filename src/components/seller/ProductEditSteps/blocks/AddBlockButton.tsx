import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Type, 
  Image, 
  Video, 
  Table, 
  Minus, 
  Quote, 
  List, 
  Code,
  Hash,
  Calendar,
  Database,
  FileText,
  BarChart3,
  CheckSquare,
  Bookmark,
  AlignLeft,
  MoreHorizontal,
  Layout,
  ExternalLink,
  Archive
} from 'lucide-react';
import { BlockType, Block } from './types';

interface AddBlockButtonProps {
  onAddBlock: (block: Block) => void;
  position?: 'top' | 'bottom';
}

export const AddBlockButton: React.FC<AddBlockButtonProps> = ({ 
  onAddBlock, 
  position = 'bottom' 
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const createBlock = (type: BlockType): Block => {
    const baseId = `${type}-${Date.now()}`;
    
    switch (type) {
      case 'text':
        return {
          id: baseId,
          type: 'text',
          order: 0,
          content: '',
          textType: 'paragraph'
        };
      case 'image':
        return {
          id: baseId,
          type: 'image',
          order: 0,
          url: '',
          alt: '',
          alignment: 'center'
        };
      case 'video':
        return {
          id: baseId,
          type: 'video',
          order: 0,
          url: '',
          platform: 'youtube'
        };
      case 'table':
        return {
          id: baseId,
          type: 'table',
          order: 0,
          headers: ['Header 1', 'Header 2'],
          rows: [['Cell 1', 'Cell 2']]
        };
      case 'divider':
        return {
          id: baseId,
          type: 'divider',
          order: 0,
          style: 'line'
        };
      case 'quote':
        return {
          id: baseId,
          type: 'quote',
          order: 0,
          content: ''
        };
      case 'list':
        return {
          id: baseId,
          type: 'list',
          order: 0,
          items: [''],
          listType: 'bullet'
        };
      case 'code':
        return {
          id: baseId,
          type: 'code',
          order: 0,
          content: ''
        };
      default:
        throw new Error(`Unknown block type: ${type}`);
    }
  };

  const handleAddBlock = (type: BlockType) => {
    const block = createBlock(type);
    onAddBlock(block);
    setShowDialog(false);
  };

  const blockGroups = [
    {
      title: "Text",
      blocks: [
        { type: 'text' as BlockType, label: 'Text', icon: AlignLeft },
        { type: 'text' as BlockType, label: 'Heading 1', icon: Hash, textType: 'heading1' },
        { type: 'text' as BlockType, label: 'Heading 2', icon: Hash, textType: 'heading2' },
        { type: 'text' as BlockType, label: 'Heading 3', icon: Hash, textType: 'heading3' },
      ]
    },
    {
      title: "Lists",
      blocks: [
        { type: 'list' as BlockType, label: 'Bullet List', icon: List },
        { type: 'list' as BlockType, label: 'Numbered', icon: List, listType: 'numbered' },
        { type: 'list' as BlockType, label: 'To-do', icon: CheckSquare, listType: 'checklist' },
      ]
    },
    {
      title: "Media",
      blocks: [
        { type: 'image' as BlockType, label: 'Image', icon: Image },
        { type: 'video' as BlockType, label: 'Video', icon: Video },
        { type: 'code' as BlockType, label: 'Code', icon: Code },
      ]
    },
    {
      title: "Other",
      blocks: [
        { type: 'quote' as BlockType, label: 'Quote', icon: Quote },
        { type: 'divider' as BlockType, label: 'Divider', icon: Minus },
        { type: 'table' as BlockType, label: 'Table', icon: Table },
      ]
    }
  ];

  return (
    <>
      <div className={`group ${position === 'top' ? 'mb-2' : 'mt-2'}`}>
        <Button
          variant="ghost"
          onClick={() => setShowDialog(true)}
          className="w-full justify-start text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-8 px-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="text-sm">Click to add below</span>
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="!fixed !bottom-0 !left-0 !right-0 !top-auto !translate-x-0 !translate-y-0 !max-w-full !w-full bg-white border-none text-gray-900 max-h-[70vh] overflow-y-auto rounded-t-3xl !data-[state=open]:slide-in-from-bottom !data-[state=closed]:slide-out-to-bottom [&>button]:hidden shadow-2xl">
          <div className="space-y-6 pt-2 pb-6">
            {/* Handle bar */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

            {blockGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold text-gray-600 mb-3 px-4 uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="grid grid-cols-2 gap-3 px-4">
                  {group.blocks.map((blockConfig, index) => {
                    const IconComponent = blockConfig.icon;
                    return (
                      <button
                        key={`${blockConfig.type}-${index}`}
                        className="p-3 flex items-center text-left hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md"
                        onClick={() => {
                          let block = createBlock(blockConfig.type);
                          // Apply special configurations
                          if (blockConfig.textType && block.type === 'text') {
                            (block as any).textType = blockConfig.textType;
                          }
                          if (blockConfig.listType && block.type === 'list') {
                            (block as any).listType = blockConfig.listType;
                          }
                          onAddBlock(block);
                          setShowDialog(false);
                        }}
                      >
                        <IconComponent className="h-5 w-5 text-gray-600 mr-2" />
                        <span className="font-medium text-sm text-gray-800 leading-tight">
                          {blockConfig.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
