import React from 'react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface SimpleTabModalProps {
  isVisible: boolean;
  tabName: string;
  onTabNameChange: (name: string) => void;
  onCreateTab: () => void;
  onCancel: () => void;
  isEmptyState?: boolean;
}

export const SimpleTabModal: React.FC<SimpleTabModalProps> = ({
  isVisible,
  tabName,
  onTabNameChange,
  onCreateTab,
  onCancel,
  isEmptyState = false
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEmptyState ? 'Create First Tab' : 'Add New Tab'}
          </h3>
          <div className="mb-4">
            <Label htmlFor="tabName" className="block text-sm font-medium text-gray-700 mb-1">
              Tab Name
            </Label>
            <Input
              id="tabName"
              type="text"
              value={tabName}
              onChange={(e) => onTabNameChange(e.target.value)}
              placeholder="Enter tab name"
              className="w-full"
              autoFocus
            />
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={onCreateTab}
              disabled={!tabName.trim()}
              className="flex-1"
            >
              {isEmptyState ? 'Create Tab' : 'Create Tab'}
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};