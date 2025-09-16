import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from './Input';

interface PopupSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  onAddOption: (option: string) => void;
  onEditOption: (index: number, newValue: string) => void;
  onDeleteOption: (option: string) => void;
  placeholder: string;
  addText?: string;
  label: string;
}

export const PopupSelector: React.FC<PopupSelectorProps> = ({ 
  value, 
  onChange, 
  options, 
  onAddOption, 
  onEditOption, 
  onDeleteOption, 
  placeholder, 
  addText = "Add new option",
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingValue, setEditingValue] = useState('');

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (newOption.trim()) {
      onAddOption(newOption.trim());
      setNewOption('');
      setShowAddNew(false);
    }
  };

  const handleEdit = (index: number, option: string) => {
    setEditingIndex(index);
    setEditingValue(option);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim()) {
      onEditOption(editingIndex, editingValue.trim());
      setEditingIndex(-1);
      setEditingValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditingValue('');
  };

  const handleDelete = (option: string) => {
    onDeleteOption(option);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200 relative"
      >
        <span className={`block ${value ? 'text-gray-900' : 'text-gray-500'}`}>
          {value || placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-white rounded-t-lg shadow-lg max-w-md w-full max-h-96 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Select {label}</h3>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowAddNew(false);
                    setEditingIndex(-1);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {options.map((option, index) => (
                <div key={option} className="group border-b border-gray-100 last:border-b-0">
                  {editingIndex === index ? (
                    <div className="flex items-center p-3">
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1 mr-2"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 text-gray-400 hover:bg-gray-50 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50">
                      <button
                        onClick={() => handleSelect(option)}
                        className="flex-1 text-left text-gray-900"
                      >
                        {option}
                      </button>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(index, option);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(option);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {showAddNew ? (
                <div className="p-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder={`Enter new ${label.toLowerCase()}`}
                      className="flex-1"
                      autoFocus
                    />
                    <button
                      onClick={handleAddNew}
                      disabled={!newOption.trim()}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddNew(false);
                        setNewOption('');
                      }}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddNew(true)}
                    className="w-full flex items-center justify-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Plus size={16} />
                    {addText}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};