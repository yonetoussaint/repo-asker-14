import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Leaf, Shield, Award, Truck, Plus, X, 
  Settings, Zap, Star, Heart, Package, Box, Layers, Clock,
  Target, Globe, Droplet, Thermometer, Calendar, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface SpecificationItem {
  label: string;
  value: string;
}

interface SpecificationSection {
  title: string;
  icon: string;
  items: SpecificationItem[];
}

interface SpecificationsStepProps {
  formData: {
    specifications?: SpecificationSection[];
  };
  onInputChange: (field: string, value: any) => void;
}

const defaultSections: SpecificationSection[] = [
  {
    title: 'Basic Information',
    icon: 'Award',
    items: [
      { label: 'Product Type', value: '' },
      { label: 'Volume', value: '' },
      { label: 'Scent', value: '' },
      { label: 'Texture', value: '' },
      { label: 'Color', value: '' },
      { label: 'Origin', value: '' },
      { label: 'Shelf Life', value: '' }
    ]
  },
  {
    title: 'Ingredients & Composition',
    icon: 'Leaf',
    items: [
      { label: 'Primary Ingredient', value: '' },
      { label: 'Secondary Ingredients', value: '' },
      { label: 'Preservatives', value: '' }
    ]
  },
  {
    title: 'Usage & Application',
    icon: 'Shield',
    items: [
      { label: 'Frequency', value: '' },
      { label: 'Application Method', value: '' },
      { label: 'Best Time to Use', value: '' },
      { label: 'Suitable For', value: '' },
      { label: 'Age Range', value: '' }
    ]
  },
  {
    title: 'Shipping & Storage',
    icon: 'Truck',
    items: [
      { label: 'Storage Temperature', value: '' },
      { label: 'Storage Location', value: '' },
      { label: 'Weight', value: '' },
      { label: 'Dimensions', value: '' },
      { label: 'Packaging Type', value: '' }
    ]
  }
];

const availableIcons = [
  { name: 'Award', component: Award, label: 'Award' },
  { name: 'Leaf', component: Leaf, label: 'Nature/Organic' },
  { name: 'Shield', component: Shield, label: 'Protection/Safety' },
  { name: 'Truck', component: Truck, label: 'Shipping/Delivery' },
  { name: 'Settings', component: Settings, label: 'Technical/Features' },
  { name: 'Zap', component: Zap, label: 'Power/Energy' },
  { name: 'Star', component: Star, label: 'Quality/Premium' },
  { name: 'Heart', component: Heart, label: 'Health/Wellness' },
  { name: 'Package', component: Package, label: 'Product/Package' },
  { name: 'Box', component: Box, label: 'Storage/Container' },
  { name: 'Layers', component: Layers, label: 'Materials/Layers' },
  { name: 'Clock', component: Clock, label: 'Time/Duration' },
  { name: 'Target', component: Target, label: 'Purpose/Goal' },
  { name: 'Globe', component: Globe, label: 'Global/Origin' },
  { name: 'Droplet', component: Droplet, label: 'Liquid/Moisture' },
  { name: 'Thermometer', component: Thermometer, label: 'Temperature' },
  { name: 'Calendar', component: Calendar, label: 'Date/Schedule' },
  { name: 'Users', component: Users, label: 'People/Users' }
];

const getIconComponent = (iconName: string) => {
  const icon = availableIcons.find(i => i.name === iconName);
  if (icon) {
    const IconComponent = icon.component;
    return <IconComponent className="w-4 h-4" />;
  }
  return <Award className="w-4 h-4" />;
};

export const SpecificationsStep: React.FC<SpecificationsStepProps> = ({
  formData,
  onInputChange
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Basic Information']);
  const [specifications, setSpecifications] = useState<SpecificationSection[]>(
    formData.specifications || defaultSections
  );
  const [openIconSheet, setOpenIconSheet] = useState<number | null>(null);

  console.log('🔄 SpecificationsStep rendered with formData:', formData);

  // Update local state when formData changes
  useEffect(() => {
    console.log('⚡ formData changed, updating specifications:', formData.specifications);
    setSpecifications(formData.specifications || defaultSections);
  }, [formData.specifications]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle)
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const updateSpecifications = (newSpecs: SpecificationSection[]) => {
    console.log('📝 Updating specifications in component:', newSpecs);
    setSpecifications(newSpecs);
    onInputChange('specifications', newSpecs);
  };

  const updateSectionItem = (sectionIndex: number, itemIndex: number, field: 'label' | 'value', newValue: string) => {
    const newSpecs = [...specifications];
    newSpecs[sectionIndex].items[itemIndex][field] = newValue;
    updateSpecifications(newSpecs);
  };

  const addItemToSection = (sectionIndex: number) => {
    const newSpecs = [...specifications];
    newSpecs[sectionIndex].items.push({ label: '', value: '' });
    updateSpecifications(newSpecs);
  };

  const removeItemFromSection = (sectionIndex: number, itemIndex: number) => {
    const newSpecs = [...specifications];
    newSpecs[sectionIndex].items.splice(itemIndex, 1);
    updateSpecifications(newSpecs);
  };

  const addNewSection = () => {
    const newSection: SpecificationSection = {
      title: 'New Section',
      icon: 'Award',
      items: [{ label: '', value: '' }]
    };
    updateSpecifications([...specifications, newSection]);
    setExpandedSections(prev => [...prev, 'New Section']);
  };

  const updateSectionTitle = (sectionIndex: number, newTitle: string) => {
    const newSpecs = [...specifications];
    newSpecs[sectionIndex].title = newTitle;
    updateSpecifications(newSpecs);
  };

  const updateSectionIcon = (sectionIndex: number, newIcon: string) => {
    const newSpecs = [...specifications];
    newSpecs[sectionIndex].icon = newIcon;
    updateSpecifications(newSpecs);
    setOpenIconSheet(null); // Close the sheet after selection
  };

  const removeSection = (sectionIndex: number) => {
    const newSpecs = specifications.filter((_, index) => index !== sectionIndex);
    updateSpecifications(newSpecs);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Product Specifications</h3>
        <p className="text-sm text-muted-foreground">
          Add detailed specifications for your product organized by categories
        </p>
      </div>

      <div className="space-y-4">
        {specifications.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border border-border rounded-lg">
            <div className="flex items-center justify-between p-3 bg-muted/50">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center gap-2 flex-1 text-left"
                type="button"
              >
                {getIconComponent(section.icon)}
                <Input
                  value={section.title}
                  onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                  className="border-none bg-transparent text-sm font-medium p-0 h-auto focus:ring-0"
                  onClick={(e) => e.stopPropagation()}
                />
              </button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(sectionIndex)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
                {expandedSections.includes(section.title) ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedSections.includes(section.title) && (
              <div className="p-4 space-y-3 border-t border-border">
                <div className="mb-4">
                  <Label className="text-xs text-muted-foreground">Section Icon</Label>
                  <Sheet open={openIconSheet === sectionIndex} onOpenChange={(open) => setOpenIconSheet(open ? sectionIndex : null)}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-10 justify-start text-left font-normal"
                      >
                        <div className="flex items-center gap-2">
                          {getIconComponent(section.icon)}
                          <span>{availableIcons.find(i => i.name === section.icon)?.label || section.icon}</span>
                        </div>
                      </Button>
                    </SheetTrigger>
                     <SheetContent side="bottom" className="h-[60vh] max-h-[500px]">
                        <div className="flex items-center justify-center mb-2">
                          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                        </div>
                        <SheetHeader className="pb-4">
                          <SheetTitle>Choose an Icon</SheetTitle>
                        </SheetHeader>
                        <div className="overflow-y-auto flex-1">
                          <div className="grid grid-cols-6 gap-3 pb-4">
                            {availableIcons.map((icon) => (
                              <button
                                key={icon.name}
                                onClick={() => updateSectionIcon(sectionIndex, icon.name)}
                                className={`
                                  aspect-square flex items-center justify-center rounded-xl transition-all duration-200
                                  hover:scale-105 active:scale-95
                                  ${section.icon === icon.name 
                                    ? 'bg-primary text-primary-foreground shadow-lg' 
                                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                  }
                                `}
                              >
                                <icon.component className="w-6 h-6" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </SheetContent>
                  </Sheet>
                </div>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2 items-center">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Label</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => updateSectionItem(sectionIndex, itemIndex, 'label', e.target.value)}
                          placeholder="e.g., Product Type"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Value</Label>
                        <Input
                          value={item.value}
                          onChange={(e) => updateSectionItem(sectionIndex, itemIndex, 'value', e.target.value)}
                          placeholder="e.g., Beard Growth Oil"
                          className="h-8"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItemFromSection(sectionIndex, itemIndex)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive mt-4"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItemToSection(sectionIndex)}
                  className="w-full h-8 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Specification
                </Button>
              </div>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addNewSection}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Section
        </Button>
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="font-medium mb-2 text-sm">Preview</h4>
        <p className="text-xs text-muted-foreground">
          This is how your specifications will appear to customers on the product page.
        </p>
        <div className="mt-3 space-y-2">
          {specifications.map((section, index) => (
            <div key={index} className="text-xs">
              <span className="font-medium text-foreground">{section.title}</span>
              <span className="text-muted-foreground ml-2">
                ({section.items.filter(item => item.label && item.value).length} items)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};