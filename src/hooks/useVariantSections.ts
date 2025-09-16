import { useState } from 'react';

export type VariantSectionType = 'color' | 'storage' | 'network' | 'condition';

export const useVariantSections = () => {
  // Set 'color' as the default expanded section
  const [expandedSection, setExpandedSection] = useState<VariantSectionType | null>('color');

  const toggleSection = (section: VariantSectionType) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isExpanded = (section: VariantSectionType) => expandedSection === section;

  return {
    expandedSection,
    toggleSection,
    isExpanded
  };
};