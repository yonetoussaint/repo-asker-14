import React, { useState, useEffect } from 'react';
import { BlockEditor } from './blocks/BlockEditor';
import { Block } from './blocks/types';

interface DescriptionEditorProps {
  initialDescription: string;
  onSave: (description: string) => void;
  onCancel: () => void;
}

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({ 
  initialDescription, 
  onSave, 
  onCancel 
}) => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Convert HTML to blocks on initialization
  useEffect(() => {
    if (initialDescription && initialDescription.trim()) {
      const convertedBlocks = convertHTMLToBlocks(initialDescription);
      setBlocks(convertedBlocks);
    } else {
      // Start with a single text block
      setBlocks([{
        id: `text-${Date.now()}`,
        type: 'text',
        order: 0,
        content: '',
        textType: 'paragraph'
      }]);
    }
  }, [initialDescription]);

  // Convert HTML content to block structure
  const convertHTMLToBlocks = (html: string): Block[] => {
    if (!html || html.trim() === '') {
      return [{
        id: `text-${Date.now()}`,
        type: 'text',
        order: 0,
        content: '',
        textType: 'paragraph'
      }];
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const blocks: Block[] = [];
    let order = 0;

    // Handle both direct children and text nodes
    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          blocks.push({
            id: `text-${Date.now()}-${order}`,
            type: 'text',
            order,
            content: text,
            textType: 'paragraph'
          });
          order++;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        
        switch (element.tagName) {
          case 'P':
            const content = element.textContent?.trim() || '';
            if (content) {
              blocks.push({
                id: `text-${Date.now()}-${order}`,
                type: 'text',
                order,
                content,
                textType: 'paragraph'
              });
              order++;
            }
            break;
          case 'H1':
            blocks.push({
              id: `text-${Date.now()}-${order}`,
              type: 'text',
              order,
              content: element.textContent || '',
              textType: 'heading1'
            });
            order++;
            break;
          case 'H2':
            blocks.push({
              id: `text-${Date.now()}-${order}`,
              type: 'text',
              order,
              content: element.textContent || '',
              textType: 'heading2'
            });
            order++;
            break;
          case 'H3':
            blocks.push({
              id: `text-${Date.now()}-${order}`,
              type: 'text',
              order,
              content: element.textContent || '',
              textType: 'heading3'
            });
            order++;
            break;
          case 'IMG':
            const img = element as HTMLImageElement;
            blocks.push({
              id: `image-${Date.now()}-${order}`,
              type: 'image',
              order,
              url: img.src,
              alt: img.alt || '',
              alignment: 'center'
            });
            order++;
            break;
          case 'DIV':
            // Check if div contains an image
            const img2 = element.querySelector('img');
            if (img2) {
              blocks.push({
                id: `image-${Date.now()}-${order}`,
                type: 'image',
                order,
                url: img2.src,
                alt: img2.alt || '',
                alignment: 'center'
              });
              order++;
            } else {
              // Process div content as text if it has text content
              const text = element.textContent?.trim();
              if (text) {
                blocks.push({
                  id: `text-${Date.now()}-${order}`,
                  type: 'text',
                  order,
                  content: text,
                  textType: 'paragraph'
                });
                order++;
              }
            }
            break;
          case 'HR':
            blocks.push({
              id: `divider-${Date.now()}-${order}`,
              type: 'divider',
              order,
              style: 'line'
            });
            order++;
            break;
          case 'BLOCKQUOTE':
            blocks.push({
              id: `quote-${Date.now()}-${order}`,
              type: 'quote',
              order,
              content: element.textContent || '',
              author: ''
            });
            order++;
            break;
          case 'UL':
          case 'OL':
            const listItems = Array.from(element.querySelectorAll('li')).map(li => li.textContent || '');
            if (listItems.length > 0) {
              blocks.push({
                id: `list-${Date.now()}-${order}`,
                type: 'list',
                order,
                items: listItems,
                listType: element.tagName === 'OL' ? 'numbered' : 'bullet'
              });
              order++;
            }
            break;
          default:
            // For other elements, try to extract text content
            const textContent = element.textContent?.trim();
            if (textContent) {
              blocks.push({
                id: `text-${Date.now()}-${order}`,
                type: 'text',
                order,
                content: textContent,
                textType: 'paragraph'
              });
              order++;
            }
        }
      }
    };

    // Process all child nodes
    Array.from(tempDiv.childNodes).forEach(processNode);

    // If no blocks were created, try to extract any text content
    if (blocks.length === 0) {
      const textContent = tempDiv.textContent?.trim() || html.replace(/<[^>]*>/g, '').trim();
      blocks.push({
        id: `text-${Date.now()}`,
        type: 'text',
        order: 0,
        content: textContent || '',
        textType: 'paragraph'
      });
    }

    return blocks;
  };

  const handleSave = (html: string) => {
    onSave(html);
  };

  const handleBlocksChange = (updatedBlocks: Block[]) => {
    setBlocks(updatedBlocks);
  };

  return (
    <BlockEditor
      blocks={blocks}
      onBlocksChange={handleBlocksChange}
      onSave={handleSave}
      onCancel={onCancel}
    />
  );
};

export default DescriptionEditor;