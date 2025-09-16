import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { TemplateSelector } from './TemplateSelector';
import { CurrencySelector } from './CurrencySelector';

interface EmptyStateProps {
  templates: any;
  activeTemplate: string;
  onTemplateChange: (template: string) => void;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  loadingRates: boolean;
  onCreateFirstTab: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  templates,
  activeTemplate,
  onTemplateChange,
  selectedCurrency,
  onCurrencyChange,
  loadingRates,
  onCreateFirstTab
}) => {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Template Switcher and Currency for Empty State */}
      <div className="p-4">
        <div className="flex justify-between items-center gap-4 mb-4">
          {/* Template Switcher Dropdown */}
          <TemplateSelector
            activeTemplate={activeTemplate}
            onTemplateChange={onTemplateChange}
            templates={templates}
          />

          {/* Currency Switcher */}
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencyChange={onCurrencyChange}
            loadingRates={loadingRates}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No variants yet</h3>
          <p className="text-gray-500 text-sm">Add different variants to give customers more choices</p>
        </div>
      </div>

      <div className="sticky bottom-0 p-4">
        <Button className="w-full" onClick={onCreateFirstTab}>
          Create First Tab
        </Button>
      </div>
    </div>
  );
};