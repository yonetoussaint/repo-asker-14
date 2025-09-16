import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Product, SpecificationSection } from '@/types/product';

interface SpecificationsTabProps {
  product: Product;
}

const availableIcons = {
  Award: () => <></>, // Add your icon components here
  Package: () => <></>,
  // Add other icons as needed
};

const getIconComponent = (iconName: string) => {
  const IconComponent = availableIcons[iconName as keyof typeof availableIcons];
  if (IconComponent) {
    return <IconComponent />;
  }
  return <></>;
};

const SpecificationsTab: React.FC<SpecificationsTabProps> = ({ product }) => {
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});

  const specifications: SpecificationSection[] = Array.isArray(product?.specifications) 
    ? product.specifications 
    : [
    {
      title: 'General Information',
      icon: 'Award',
      items: [
        { label: 'Product Name', value: product?.name || 'Not specified' },
        { label: 'Price', value: `$${product?.price || 0}` },
        { label: 'Category', value: product?.category || 'General' },
        { label: 'SKU', value: product?.id?.slice(0, 8) || 'N/A' }
      ]
    },
    {
      title: 'Availability',
      icon: 'Package', 
      items: [
        { label: 'Stock', value: product?.inventory ? `${product.inventory} available` : 'Limited stock' },
        { label: 'Condition', value: 'Brand New' }
      ]
    }
  ];

  const toggleSpecExpansion = (sectionTitle: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <div className="w-full">
      {specifications.map((specSection, sectionIndex) => (
        <div
          key={specSection.title}
          className={`w-full ${sectionIndex !== specifications.length - 1 ? 'border-b border-gray-100' : ''}`}
        >
          {/* Section Header */}
          <div
            className="flex justify-between items-center w-full py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            onClick={() => toggleSpecExpansion(specSection.title)}
          >
            <div className="flex items-center gap-2 w-full">
              {getIconComponent(specSection.icon)}
              <h3 className="text-lg font-semibold text-gray-900 w-full">
                {specSection.title}
              </h3>
            </div>
            {expandedSpecs[specSection.title] ? (
              <ChevronUp className="w-6 h-6 text-gray-700 font-bold" strokeWidth={2.5} />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-700 font-bold" strokeWidth={2.5} />
            )}
          </div>

          {/* Collapsible Specifications List */}
          {expandedSpecs[specSection.title] && (
            <div className="w-full pb-2">
              {specSection.items.map((spec, specIndex) => (
                <div
                  key={spec.label}
                  className={`flex justify-between items-center w-full py-2 px-4 ${
                    specIndex !== specSection.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className="text-gray-600 w-full">{spec.label}</span>
                  <span className="text-gray-900 font-medium w-full text-right">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SpecificationsTab;