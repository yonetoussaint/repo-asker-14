import React, { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Leaf, Shield, Award, Truck,
  Settings, Zap, Star, Heart, Package, Box, Layers, Clock,
  Target, Globe, Droplet, Thermometer, Calendar, Users
} from 'lucide-react';

interface ProductSpecificationsProps {
  product?: {
    specifications?: {
      title: string;
      icon: string;
      items: { label: string; value: string; }[];
    }[];
  };
}

const ProductSpecifications = ({ product }: ProductSpecificationsProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-4 h-4" />;
      case 'Leaf': return <Leaf className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Truck': return <Truck className="w-4 h-4" />;
      case 'Settings': return <Settings className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Star': return <Star className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4" />;
      case 'Package': return <Package className="w-4 h-4" />;
      case 'Box': return <Box className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Clock': return <Clock className="w-4 h-4" />;
      case 'Target': return <Target className="w-4 h-4" />;
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'Droplet': return <Droplet className="w-4 h-4" />;
      case 'Thermometer': return <Thermometer className="w-4 h-4" />;
      case 'Calendar': return <Calendar className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const specifications = product?.specifications || [];
  
  console.log('📋 ProductSpecifications - Received specifications:', specifications);

  // Don't render anything if no specifications are available
  if (!specifications || specifications.length === 0) {
    console.log('📋 ProductSpecifications - No specifications available, not rendering');
    return null;
  }

  return (
    <div className="bg-white py-4 space-y-4">
      <h3 className="text-lg font-semibold">Product Specifications</h3>

      <div className="space-y-3">
        {specifications.map((section, index) => (
          <div key={index} className="bg-gray-100 rounded-lg">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between p-3 text-left bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg"
            >
              <div className="flex items-center gap-2">
                {getIconComponent(section.icon)}
                <span className="font-medium">{section.title}</span>
              </div>
              {expandedSections.includes(section.title) ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.includes(section.title) && (
              <div className="bg-gray-100">
                <div className="p-3 space-y-2 bg-gray-100">
                  {section.items
                    .filter(item => item.label && item.value) // Only show items with both label and value
                    .map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-800 font-medium">{item.label}:</span>
                      <span className="text-gray-600 text-right flex-1 ml-4">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Only show certifications if there are specifications */}
      {specifications.length > 0 && (
        <div className="pt-4">
          <h4 className="font-medium mb-3">Certifications & Quality</h4>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              <Leaf className="w-3 h-3" />
              100% Natural
            </div>
            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              <Shield className="w-3 h-3" />
              Dermatologist Tested
            </div>
            <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              <Award className="w-3 h-3" />
              Cruelty Free
            </div>
            <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
              <Leaf className="w-3 h-3" />
              Vegan Friendly
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;