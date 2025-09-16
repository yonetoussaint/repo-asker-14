import React, { useState, useEffect } from 'react';
import { Block, BlockEditorProps } from './types';
import { TextBlockComponent } from './TextBlock';
import { ImageBlockComponent } from './ImageBlock';
import { DividerBlockComponent } from './DividerBlock';
import { VideoBlockComponent } from './VideoBlock';
import { QuoteBlockComponent } from './QuoteBlock';
import { ListBlockComponent } from './ListBlock';
import { TableBlockComponent } from './TableBlock';
import { CodeBlockComponent } from './CodeBlock';
import { AddBlockButton } from './AddBlockButton';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';

export const BlockEditor: React.FC<BlockEditorProps> = ({
  blocks: initialBlocks,
  onBlocksChange,
  onSave,
  onCancel
}) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Initialize blocks from props only once
  useEffect(() => {
    if (initialBlocks.length > 0 && !hasInitialized) {
      setBlocks(initialBlocks);
      setHasInitialized(true);
    }
  }, [initialBlocks, hasInitialized]);

  const addBlock = (newBlock: Block) => {
    const updatedBlocks = [...blocks, { ...newBlock, order: blocks.length }];
    setBlocks(updatedBlocks);
    if (onBlocksChange) {
      onBlocksChange(updatedBlocks);
    }
  };

  const updateBlock = (blockId: string, updatedBlock: Block) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? updatedBlock : block
    );
    setBlocks(updatedBlocks);
    if (onBlocksChange) {
      onBlocksChange(updatedBlocks);
    }
  };

  const deleteBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    // Reorder remaining blocks
    const reorderedBlocks = updatedBlocks.map((block, index) => ({
      ...block,
      order: index
    }));
    setBlocks(reorderedBlocks);
    if (onBlocksChange) {
      onBlocksChange(reorderedBlocks);
    }
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = blocks.findIndex(block => block.id === blockId);
    if (blockIndex === -1) return;

    const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[blockIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[blockIndex]];
    
    // Update order numbers
    newBlocks.forEach((block, index) => {
      block.order = index;
    });
    
    setBlocks(newBlocks);
  };

  const generateHTML = (): string => {
    return blocks
      .sort((a, b) => a.order - b.order)
      .map(block => {
        switch (block.type) {
          case 'text':
            const textBlock = block as any;
            switch (textBlock.textType) {
              case 'heading1':
                return `<h1>${textBlock.content}</h1>`;
              case 'heading2':
                return `<h2>${textBlock.content}</h2>`;
              case 'heading3':
                return `<h3>${textBlock.content}</h3>`;
              default:
                return `<p>${textBlock.content}</p>`;
            }
          case 'image':
            const imageBlock = block as any;
            const alignClass = imageBlock.alignment === 'center' ? 'center' : imageBlock.alignment;
            return `<div style="text-align: ${alignClass}; margin: 20px 0;">
              <img src="${imageBlock.url}" alt="${imageBlock.alt}" style="max-width: 100%; height: auto; border-radius: 8px;" />
              ${imageBlock.caption ? `<p style="font-size: 14px; color: #666; margin-top: 8px; font-style: italic;">${imageBlock.caption}</p>` : ''}
            </div>`;
          case 'video':
            const videoBlock = block as any;
            const getEmbedUrl = (url: string) => {
              if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
              }
              if (url.includes('vimeo.com')) {
                const videoId = url.match(/vimeo\.com\/([^&\n?#]+)/)?.[1];
                return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
              }
              return url;
            };
            const embedUrl = getEmbedUrl(videoBlock.url);
            return `<div style="text-align: center; margin: 20px 0;">
              <div style="position: relative; width: 100%; padding-bottom: 56.25%;">
                <iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" allowfullscreen title="${videoBlock.title || 'Video'}"></iframe>
              </div>
              ${videoBlock.title ? `<p style="font-size: 14px; color: #666; margin-top: 8px;">${videoBlock.title}</p>` : ''}
            </div>`;
          case 'list':
            const listBlock = block as any;
            const listTag = listBlock.listType === 'numbered' ? 'ol' : 'ul';
            const listItems = listBlock.items.map((item: string) => `<li>${item}</li>`).join('');
            return `<${listTag} style="margin: 20px 0; padding-left: 20px;">${listItems}</${listTag}>`;
          case 'table':
            const tableBlock = block as any;
            const headerRow = `<tr>${tableBlock.headers.map((header: string) => `<th style="border: 1px solid #e2e8f0; padding: 8px; background: #f8f9fa;">${header}</th>`).join('')}</tr>`;
            const bodyRows = tableBlock.rows.map((row: string[]) => 
              `<tr>${row.map((cell: string) => `<td style="border: 1px solid #e2e8f0; padding: 8px;">${cell}</td>`).join('')}</tr>`
            ).join('');
            return `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>${headerRow}</thead>
              <tbody>${bodyRows}</tbody>
            </table>`;
          case 'divider':
            const dividerBlock = block as any;
            switch (dividerBlock.style) {
              case 'dots':
                return '<div style="text-align: center; margin: 20px 0; color: #666;">• • •</div>';
              case 'stars':
                return '<div style="text-align: center; margin: 20px 0; color: #666;">★ ★ ★</div>';
              default:
                return '<hr style="margin: 20px 0; border: 1px solid #e2e8f0;" />';
            }
          case 'quote':
            const quoteBlock = block as any;
            return `<blockquote style="border-left: 4px solid #e2e8f0; padding-left: 16px; margin: 20px 0; font-style: italic;">${quoteBlock.content}${quoteBlock.author ? `<br/><cite>— ${quoteBlock.author}</cite>` : ''}</blockquote>`;
          case 'code':
            const codeBlock = block as any;
            return `<pre style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0; overflow-x: auto;"><code${codeBlock.language ? ` class="language-${codeBlock.language}"` : ''}>${codeBlock.content}</code></pre>`;
          default:
            return '';
        }
      })
      .join('\n');
  };

  const handleSave = () => {
    const html = generateHTML();
    onSave(html);
  };

  const renderBlock = (block: Block) => {
    const commonProps = {
      onDelete: () => deleteBlock(block.id),
      onMoveUp: () => moveBlock(block.id, 'up'),
      onMoveDown: () => moveBlock(block.id, 'down')
    };

    switch (block.type) {
      case 'text':
        return (
          <TextBlockComponent
            key={block.id}
            block={block as any}
            onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
            {...commonProps}
          />
        );
      case 'image':
        return (
          <ImageBlockComponent
            key={block.id}
            block={block as any}
            onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
            {...commonProps}
          />
        );
      case 'video':
        return (
          <VideoBlockComponent
            key={block.id}
            block={block as any}
            onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
            {...commonProps}
          />
        );
      case 'list':
        return (
          <ListBlockComponent
            key={block.id}
            block={block as any}
            onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
            {...commonProps}
          />
        );
      case 'table':
        return (
          <TableBlockComponent
            key={block.id}
            block={block as any}
            onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
            {...commonProps}
          />
        );
      case 'quote':
        return (
          <QuoteBlockComponent
            key={block.id}
            block={block as any}
            onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
            {...commonProps}
          />
        );
      case 'code':
        return (
          <CodeBlockComponent
            key={block.id}
            block={block as any}
            onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
            {...commonProps}
          />
        );
      case 'divider':
        return (
          <DividerBlockComponent
            key={block.id}
            block={block as any}
            onUpdate={(updatedBlock) => updateBlock(block.id, updatedBlock)}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };


  return (
    <div className="min-h-[400px] bg-white text-gray-900">
      <div className="space-y-1">
        {/* Add block at top if no blocks */}
        {blocks.length === 0 && (
          <div className="py-4">
            <AddBlockButton onAddBlock={addBlock} position="top" />
          </div>
        )}
        
        {/* Render blocks */}
        <div className="space-y-1">
          {blocks
            .sort((a, b) => a.order - b.order)
            .map(renderBlock)}
        </div>
        
        {/* Add block at bottom */}
        <div className="py-2">
          <AddBlockButton onAddBlock={addBlock} position="bottom" />
        </div>
      </div>
    </div>
  );
};