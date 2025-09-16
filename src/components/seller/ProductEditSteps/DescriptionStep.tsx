import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Eye, Edit2 } from 'lucide-react';
import DescriptionEditor from './DescriptionEditor';

interface DescriptionStepProps {
  formData: {
    description: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const DescriptionStep: React.FC<DescriptionStepProps> = ({ formData, onInputChange }) => {
  const [showDescriptionEditor, setShowDescriptionEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleExpandDescription = () => {
    setShowDescriptionEditor(true);
  };

  const handleSaveDescription = (description: string) => {
    onInputChange('description', description);
    setShowDescriptionEditor(false);
  };

  const handleCancelDescription = () => {
    setShowDescriptionEditor(false);
  };

  // Function to strip HTML tags for textarea display
  const stripHtml = (html: string) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold">Product Description</h3>
          <p className="text-sm text-gray-600">
            Provide a detailed description of your product to help customers understand its features and benefits
          </p>
        </div>

        {/* Product Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description">Description *</Label>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700"
              type="button"
            >
              <Eye className="w-3.5 h-3.5" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
          
          {showPreview ? (
            <div className="relative">
              <div 
                className="border rounded-md p-3 min-h-[200px] bg-gray-50 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.description || '<p class="text-gray-500">No description yet...</p>' }}
              />
              <button
                onClick={handleExpandDescription}
                className="absolute top-3 right-3 p-1.5 bg-white border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-md shadow-sm transition-all duration-200 z-10"
                type="button"
                title="Edit in full editor"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Textarea
                id="description"
                value={stripHtml(formData.description)}
                onChange={(e) => onInputChange('description', e.target.value)}
                placeholder="Enter product description or click the edit button to use the rich text editor"
                rows={8}
                required
                className="pr-12"
              />
              <button
                onClick={handleExpandDescription}
                className="absolute top-3 right-3 p-1.5 bg-white border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 rounded-md shadow-sm transition-all duration-200 z-10"
                type="button"
                title="Open full editor"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            {showPreview 
              ? 'This is how your description will appear to customers' 
              : 'Click the edit button to access the rich text editor with formatting options'}
          </p>
        </div>
      </div>

      {/* Full-screen Description Editor Overlay */}
      {showDescriptionEditor && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <DescriptionEditor
            initialDescription={formData.description}
            onSave={handleSaveDescription}
            onCancel={handleCancelDescription}
          />
        </div>
      )}
    </>
  );
};

export { DescriptionStep };