export type BlockType = 
  | 'text'
  | 'image'
  | 'video'
  | 'table'
  | 'divider'
  | 'quote'
  | 'list'
  | 'code';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
  textType?: 'paragraph' | 'heading1' | 'heading2' | 'heading3';
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  title?: string;
  platform?: 'youtube' | 'vimeo' | 'upload';
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  style?: 'line' | 'dots' | 'stars';
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
  author?: string;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  items: string[];
  listType: 'bullet' | 'numbered' | 'checklist';
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  content: string;
  language?: string;
}

export type Block = 
  | TextBlock 
  | ImageBlock 
  | VideoBlock 
  | TableBlock 
  | DividerBlock 
  | QuoteBlock 
  | ListBlock 
  | CodeBlock;

export interface BlockEditorProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  onSave: (html: string) => void;
  onCancel: () => void;
}