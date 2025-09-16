import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardDrive, Palette, Wifi, WifiOff, Edit, Plus, ChevronLeft, ChevronDown, ChevronRight, HelpCircle, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export interface GradeOption {
  id: string;
  grade: string;
  price: number;
  quantity: number;
}

export interface NetworkOption {
  id: string;
  type: string; // "4G", "5G", "WiFi"
  locked: boolean;
  carriers: string[];
  price: number;
  quantity: number;
  sku: string;
  condition?: string;
  availability?: string;
  warranty?: string;
  gradeOptions: GradeOption[];
}

export interface StorageOption {
  id: string;
  capacity: string;
  networkOptions: NetworkOption[];
}

export interface ColorVariant {
  id: string;
  name: string;
  colorCode?: string;
  image?: string;
  bestseller?: boolean;
  limited?: boolean;
  active?: boolean;
  storageOptions: StorageOption[];
  // Legacy fields for compatibility
  stock?: number;
  storage_pricing?: { [storageId: string]: number };
}

interface VariantsListProps {
  colors: ColorVariant[];
  productId?: string;
  onDeleteColor?: (colorId: string) => void;
  onToggleActive?: (colorId: string, active: boolean) => void;
}

export const VariantsList: React.FC<VariantsListProps> = ({ colors, productId, onDeleteColor, onToggleActive }) => {
  const navigate = useNavigate();
  const [expandedColors, setExpandedColors] = useState<{ [key: string]: boolean }>({});
  const [expandedStorages, setExpandedStorages] = useState<{ [key: string]: boolean }>({});
  const [expandedNetworks, setExpandedNetworks] = useState<{ [key: string]: boolean }>({});

  const handleToggleActive = (colorId: string, active: boolean) => {
    if (onToggleActive) {
      onToggleActive(colorId, active);
    } else {
      console.warn('onToggleActive function not provided');
    }
  };

  const handleDeleteColor = (colorId: string, colorName: string) => {
    if (window.confirm(`Are you sure you want to delete the ${colorName} color variant?`)) {
      console.log('Delete color variant:', colorId);
      if (onDeleteColor) {
        onDeleteColor(colorId);
      } else {
        // Fallback if parent component doesn't provide onDeleteColor
        console.warn('onDeleteColor function not provided. Implement this function in the parent component to handle deletion.');
      }
    }
  };

  const toggleColorExpansion = (colorId: string) => {
    setExpandedColors(prev => ({ ...prev, [colorId]: !prev[colorId] }));
  };

  const toggleStorageExpansion = (storageId: string) => {
    setExpandedStorages(prev => ({ ...prev, [storageId]: !prev[storageId] }));
  };

  const toggleNetworkExpansion = (networkId: string) => {
    setExpandedNetworks(prev => ({ ...prev, [networkId]: !prev[networkId] }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (colors.length === 0) {
    return (
      <div className="w-full">
        <div className="p-2 border-b border-gray-100">
          <p className="text-sm text-gray-500">Add different color options for your product to give customers more choices</p>
        </div>

        <div className="space-y-2 p-1 w-full">
          <div className="text-center py-4">
            <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">Create your first color variant to get started</p>

            {/* Add New Variant Button */}
            {productId && (
              <Button 
                onClick={() => {
                  console.log('VariantsList: Add New Color Variant clicked, productId:', productId);
                  console.log('VariantsList: Navigating to:', `/product/${productId}/edit/variants/new`);
                  navigate(`/product/${productId}/edit/variants/new`);
                }} 
                className="w-full mb-4" 
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Color Variant
              </Button>
            )}
            {!productId && (
              <div className="text-xs text-red-500 mt-2">Product ID missing</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-2 w-full">
        {colors.map((color, index) => (
          <div key={color.id}>
            {index > 0 && <hr className="border-gray-200 my-2" />}

            <div className="p-1">
              {/* Color Header */}
              <div 
                className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-gray-50 -m-1 p-1 rounded"
                onClick={() => toggleColorExpansion(color.id)}
              >
                <div className="flex items-center gap-2">
                  {color.image ? (
                    <img 
                      src={color.image} 
                      alt={color.name}
                      className="w-8 h-8 object-cover rounded border"
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color.colorCode || '#000000' }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-base">{color.name || 'Unnamed Color'}</h3>
                  <p className="text-xs text-gray-500">
                    {(color.storageOptions || []).length} storage option{(color.storageOptions || []).length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={color.active || false}
                    onCheckedChange={(checked) => handleToggleActive(color.id, checked)}
                    className="mr-1"
                  />
                  {productId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${productId}/edit/variants/${color.id}`);
                      }}
                      className="p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {productId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteColor(color.id, color.name);
                      }}
                      className="p-2 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Storage Options - Full Width Column */}
              {expandedColors[color.id] && (color.storageOptions || []).length > 0 && (
                <div className="space-y-1">
                  {(color.storageOptions || []).map((storage) => (
                    <div key={storage.id} className="bg-gray-50 rounded-lg p-2">
                      <div 
                        className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-100 -m-1 p-1 rounded"
                        onClick={() => toggleStorageExpansion(storage.id)}
                      >
                        <HardDrive className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm">{storage.capacity}</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {(storage.networkOptions || []).length} network option{(storage.networkOptions || []).length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Network Options - Only show when expanded */}
                      {expandedStorages[storage.id] && (storage.networkOptions || []).length > 0 && (
                        <div className="space-y-1">
                          {(storage.networkOptions || []).map((network) => (
                            <div key={network.id} className="bg-white rounded border">
                              <div 
                                className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleNetworkExpansion(network.id)}
                              >
                                <div className="flex items-center gap-2">
                                  {network.locked ? (
                                    <WifiOff className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <Wifi className="w-4 h-4 text-blue-600" />
                                  )}
                                  <span className="text-sm font-medium">{network.type}</span>
                                   {network.locked && (network.carriers || []).length > 0 && (
                                     <span className="text-xs text-gray-500">
                                       ({(network.carriers || []).join(', ')})
                                     </span>
                                   )}
                                 </div>
                                 <div className="text-right">
                                   <div className="text-xs text-gray-500">
                                     {(network.gradeOptions || []).length} grade option{(network.gradeOptions || []).length !== 1 ? 's' : ''}
                                   </div>
                                 </div>
                               </div>

                               {/* Grade Options - Only show when network is expanded */}
                               {expandedNetworks[network.id] && (network.gradeOptions || []).length > 0 && (
                                 <div className="px-2 pb-1 border-t border-gray-100">
                                   {(network.gradeOptions || []).map((gradeOption, gradeIndex) => {
                                    return (
                                      <div key={gradeOption.id}>
                                        {gradeIndex > 0 && <div className="border-t border-gray-100 my-1 -mx-4"></div>}
                                        <div className="flex items-center justify-between py-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{gradeOption.grade}</span>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-sm font-bold text-green-600">
                                              {formatPrice(gradeOption.price)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              Stock: {gradeOption.quantity}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add New Variant Button */}
        {productId && (
          <Button 
            onClick={() => {
              console.log('VariantsList: Add New Color Variant clicked (bottom), productId:', productId);
              console.log('VariantsList: Navigating to:', `/product/${productId}/edit/variants/new`);
              navigate(`/product/${productId}/edit/variants/new`);
            }} 
            className="w-full mt-4" 
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Color Variant
          </Button>
        )}
        {!productId && (
          <div className="text-xs text-red-500 mt-4">Product ID missing</div>
        )}
      </div>
    </div>
  );
};