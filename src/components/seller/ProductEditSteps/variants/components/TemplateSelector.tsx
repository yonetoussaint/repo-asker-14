import React from 'react';

interface TemplateSelectorProps {
  activeTemplate: string;
  onTemplateChange: (template: string) => void;
  templates: any;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  activeTemplate,
  onTemplateChange,
  templates
}) => {
  return (
    <div className="flex-1">
      <select
        value={activeTemplate}
        onChange={(e) => onTemplateChange(e.target.value)}
        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Object.values(templates).map((template: any) => (
          <option key={template.id} value={template.id}>
            {template.name} Template
          </option>
        ))}
      </select>
    </div>
  );
};