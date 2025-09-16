import React, { useState } from 'react';
import { TableBlock as TableBlockType } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, Trash2, Plus, X } from 'lucide-react';

interface TableBlockProps {
  block: TableBlockType;
  onUpdate: (block: TableBlockType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const TableBlockComponent: React.FC<TableBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [editingCell, setEditingCell] = useState<{ type: 'header' | 'cell', index: number, rowIndex?: number } | null>(null);

  const handleHeaderChange = (index: number, value: string) => {
    const newHeaders = [...block.headers];
    newHeaders[index] = value;
    onUpdate({ ...block, headers: newHeaders });
  };

  const handleCellChange = (rowIndex: number, cellIndex: number, value: string) => {
    const newRows = [...block.rows];
    newRows[rowIndex][cellIndex] = value;
    onUpdate({ ...block, rows: newRows });
  };

  const addColumn = () => {
    const newHeaders = [...block.headers, `Header ${block.headers.length + 1}`];
    const newRows = block.rows.map(row => [...row, '']);
    onUpdate({ ...block, headers: newHeaders, rows: newRows });
  };

  const removeColumn = (index: number) => {
    if (block.headers.length <= 1) return;
    const newHeaders = block.headers.filter((_, i) => i !== index);
    const newRows = block.rows.map(row => row.filter((_, i) => i !== index));
    onUpdate({ ...block, headers: newHeaders, rows: newRows });
  };

  const addRow = () => {
    const newRow = new Array(block.headers.length).fill('');
    const newRows = [...block.rows, newRow];
    onUpdate({ ...block, rows: newRows });
  };

  const removeRow = (index: number) => {
    if (block.rows.length <= 1) return;
    const newRows = block.rows.filter((_, i) => i !== index);
    onUpdate({ ...block, rows: newRows });
  };

  return (
    <div className="group relative my-4">
      {/* Block Controls */}
      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white rounded-md shadow-sm border p-1">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={onDelete} className="h-6 w-6 p-0">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {block.headers.map((header, index) => (
                <th key={index} className="border border-gray-300 p-2 bg-gray-100 relative group/header">
                  {editingCell?.type === 'header' && editingCell.index === index ? (
                    <Input
                      value={header}
                      onChange={(e) => handleHeaderChange(index, e.target.value)}
                      onBlur={() => setEditingCell(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingCell(null);
                      }}
                      className="h-8 text-sm font-medium bg-transparent border-none shadow-none p-0"
                      autoFocus
                    />
                  ) : (
                    <div
                      className="cursor-pointer font-medium text-sm py-1"
                      onClick={() => setEditingCell({ type: 'header', index })}
                    >
                      {header || `Header ${index + 1}`}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColumn(index)}
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 opacity-0 group-hover/header:opacity-100 transition-opacity bg-red-500 text-white"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </th>
              ))}
              <th className="border border-gray-300 p-2 w-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addColumn}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="group/row">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 p-2">
                    {editingCell?.type === 'cell' && editingCell.index === cellIndex && editingCell.rowIndex === rowIndex ? (
                      <Input
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingCell(null);
                        }}
                        className="h-8 text-sm bg-transparent border-none shadow-none p-0"
                        autoFocus
                      />
                    ) : (
                      <div
                        className={`cursor-pointer text-sm py-1 ${
                          cell ? '' : 'text-gray-400'
                        }`}
                        onClick={() => setEditingCell({ type: 'cell', index: cellIndex, rowIndex })}
                      >
                        {cell || 'Enter value...'}
                      </div>
                    )}
                  </td>
                ))}
                <td className="border border-gray-300 p-2 w-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(rowIndex)}
                    className="h-6 w-6 p-0 opacity-0 group-hover/row:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={block.headers.length + 1} className="border border-gray-300 p-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addRow}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add row
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};