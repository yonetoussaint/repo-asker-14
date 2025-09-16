import React, { useState, useEffect } from 'react';
import { X, Upload, Lock, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { PopupSelector } from '../ui/PopupSelector';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

interface EditFormProps {
  variant: any;
  onSave: (variant: any) => void;
  onClose: () => void;
  isNew?: boolean;
  defaultVariantId?: number | null;
  currentTemplate: any;
  customVariantNames: any[];
  setCustomVariantNames: (names: any[]) => void;
  getCustomOptions: (fieldKey: string) => string[];
  setCustomOptions: (fieldKey: string, options: string[]) => void;
  activeVariantFilter: string | null;
  generateSKU: (variantNameId: number, fields: any) => string;
}

export const EditForm: React.FC<EditFormProps> = ({
  variant,
  onSave,
  onClose,
  isNew = false,
  defaultVariantId = null,
  currentTemplate,
  customVariantNames,
  setCustomVariantNames,
  getCustomOptions,
  setCustomOptions,
  activeVariantFilter,
  generateSKU
}) => {
  const { currentCurrency, convertPrice } = useCurrency();
  
  const [formData, setFormData] = useState(() => {
    const defaultData = {
      variantNameId: defaultVariantId,
      price: 0,
      stock: 0,
      sku: '',
      image: null
    };

    // Add template-specific fields with defaults
    currentTemplate.variantFields.forEach((field: any) => {
      defaultData[field.key] = field.options[0] || '';
    });

    return variant || defaultData;
  });

  // State for the display price (in selected currency)
  const [displayPrice, setDisplayPrice] = useState('0.00');
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  
  // Update display price when currency or formData.price changes, but don't override while editing
  useEffect(() => {
    if (!isEditingPrice && formData.price !== undefined) {
      const converted = convertPrice(formData.price);
      setDisplayPrice(converted.toFixed(2));
      console.log('EditForm: Currency changed to:', currentCurrency);
      console.log('EditForm: Base price:', formData.price);
      console.log('EditForm: Converted price:', converted);
    }
  }, [currentCurrency, formData.price, convertPrice, isEditingPrice]);
  
  console.log('EditForm: Current currency:', currentCurrency);
  console.log('EditForm: currencies object:', currencies);

  const [uploading, setUploading] = useState(false);
  const [showAddNewVariant, setShowAddNewVariant] = useState(false);
  const [tempNewVariantName, setTempNewVariantName] = useState('');
  const [panelHeight, setPanelHeight] = useState(85);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
      setUploading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleAddNewVariantName = () => {
    if (tempNewVariantName.trim()) {
      const nextId = customVariantNames.length > 0 ? Math.max(...customVariantNames.map(vn => vn.id)) + 1 : 1;
      const newVariant = {
        id: nextId,
        name: tempNewVariantName.trim(),
        stock: 0,
        price: 0
      };
      setCustomVariantNames([...customVariantNames, newVariant]);
      setFormData({...formData, variantNameId: nextId});
      setTempNewVariantName('');
      setShowAddNewVariant(false);
    }
  };

  // Auto-generate SKU preview
  const skuPreview = formData.variantNameId && currentTemplate.variantFields.every((field: any) => formData[field.key])
    ? (() => {
        const fields = {};
        currentTemplate.variantFields.forEach((field: any) => {
          fields[field.key] = formData[field.key];
        });
        return generateSKU(formData.variantNameId, fields);
      })()
    : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <motion.div 
        className="bg-white rounded-t-2xl w-full relative flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ height: `${panelHeight}vh` }}
      >
        <div className="sticky top-0 bg-white px-4 pt-2 pb-1 border-b border-gray-200 z-10">
          <motion.div 
            className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-2 cursor-grab active:cursor-grabbing"
            whileHover={{ backgroundColor: "rgb(156, 163, 175)", scale: 1.05 }}
            whileTap={{ scale: 0.95, backgroundColor: "rgb(107, 114, 128)" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDrag={(_, info: any) => {
              const dragPercentage = (info.offset.y / window.innerHeight) * 100;
              const newHeight = Math.max(30, Math.min(95, 85 - dragPercentage));
              setPanelHeight(newHeight);
            }}
            onDragEnd={(_, info: any) => {
              const dragDistance = info.offset.y;
              if (dragDistance > 100) {
                setPanelHeight(40);
              } else if (dragDistance < -100) {
                setPanelHeight(95);
              } else {
                setPanelHeight(85);
              }
            }}
          ></motion.div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{isNew ? 'Add New Variant' : 'Edit Variant'}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 p-4 pb-20">
          {/* Image Upload */}
          <div>
            <Label className="text-sm font-medium block mb-2">Variant Image</Label>
            <div className="flex items-center gap-3">
              <div 
                className="relative w-16 h-16 rounded-lg border border-gray-300 bg-gray-50 group cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => document.getElementById('variant-image-upload')?.click()}
              >
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Variant" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Upload className="w-4 h-4 text-white" />
                </div>

                {formData.image && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, image: null });
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Click to upload or change image</p>
                {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="variant-image-upload"
              disabled={uploading}
            />
          </div>

          {/* Variant Name Selection */}
          <div>
            <Label className="text-sm font-medium block mb-2">Variant Name</Label>
            {!showAddNewVariant ? (
              <div className="space-y-2">
                {activeVariantFilter ? (
                  <div>
                    <div className="relative">
                      <div className="flex items-center justify-between px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700">
                        <span>{customVariantNames.find(vn => vn.id === parseInt(activeVariantFilter))?.name || 'Unknown'}</span>
                        <Lock className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      To change the variant name, go to the summary card above and click the edit button.
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select
                      value={formData.variantNameId || ''}
                      onChange={(e) => {
                        if (e.target.value === 'add-new') {
                          setShowAddNewVariant(true);
                        } else {
                          setFormData({...formData, variantNameId: parseInt(e.target.value)});
                        }
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select variant name</option>
                      {customVariantNames.map(vn => (
                        <option key={vn.id} value={vn.id}>{vn.name}</option>
                      ))}
                      <option value="add-new" className="text-blue-600 font-medium">
                        + Add new variant name
                      </option>
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="mb-3">
                  <Label className="text-sm font-medium block mb-1">New Variant Name</Label>
                  <Input
                    type="text"
                    value={tempNewVariantName}
                    onChange={(e) => setTempNewVariantName(e.target.value)}
                    placeholder="Enter new variant name"
                    className="w-full"
                    autoFocus
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleAddNewVariantName}
                    disabled={!tempNewVariantName.trim()}
                    size="sm"
                  >
                    Add Name
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddNewVariant(false);
                      setTempNewVariantName('');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic variant fields based on template */}
          <div className="space-y-3">
            {/* First two fields in a grid */}
            <div className="grid grid-cols-2 gap-2">
              {currentTemplate.variantFields.slice(0, 2).map((field: any) => (
                <div key={field.key}>
                  <Label className="text-sm font-medium block mb-1">{field.label}</Label>
                  <PopupSelector
                    value={formData[field.key]}
                    onChange={(value) => setFormData({...formData, [field.key]: value})}
                    options={getCustomOptions(field.key)}
                    onAddOption={(newOption) => {
                      const updatedOptions = [...getCustomOptions(field.key), newOption];
                      setCustomOptions(field.key, updatedOptions);
                      setFormData({...formData, [field.key]: newOption});
                    }}
                    onEditOption={(index, newValue) => {
                      const updatedOptions = [...getCustomOptions(field.key)];
                      const oldValue = updatedOptions[index];
                      updatedOptions[index] = newValue;
                      setCustomOptions(field.key, updatedOptions);
                      if (formData[field.key] === oldValue) {
                        setFormData({...formData, [field.key]: newValue});
                      }
                    }}
                    onDeleteOption={(optionToDelete) => {
                      setCustomOptions(field.key, getCustomOptions(field.key).filter(opt => opt !== optionToDelete));
                      if (formData[field.key] === optionToDelete) {
                        setFormData({...formData, [field.key]: ''});
                      }
                    }}
                    placeholder={`Select ${field.label.toLowerCase()}`}
                    addText={`Add custom ${field.label.toLowerCase()}`}
                    label={field.label}
                  />
                </div>
              ))}
            </div>

            {/* Remaining fields (like Condition) in full width */}
            {currentTemplate.variantFields.slice(2).map((field: any) => (
              <div key={field.key}>
                <Label className="text-sm font-medium block mb-1">{field.label}</Label>
                <PopupSelector
                  value={formData[field.key]}
                  onChange={(value) => setFormData({...formData, [field.key]: value})}
                  options={getCustomOptions(field.key)}
                  onAddOption={(newOption) => {
                    const updatedOptions = [...getCustomOptions(field.key), newOption];
                    setCustomOptions(field.key, updatedOptions);
                    setFormData({...formData, [field.key]: newOption});
                  }}
                  onEditOption={(index, newValue) => {
                    const updatedOptions = [...getCustomOptions(field.key)];
                    const oldValue = updatedOptions[index];
                    updatedOptions[index] = newValue;
                    setCustomOptions(field.key, updatedOptions);
                    if (formData[field.key] === oldValue) {
                      setFormData({...formData, [field.key]: newValue});
                    }
                  }}
                  onDeleteOption={(optionToDelete) => {
                    setCustomOptions(field.key, getCustomOptions(field.key).filter(opt => opt !== optionToDelete));
                    if (formData[field.key] === optionToDelete) {
                      setFormData({...formData, [field.key]: ''});
                    }
                  }}
                  placeholder={`Select ${field.label.toLowerCase()}`}
                  addText={`Add custom ${field.label.toLowerCase()}`}
                  label={field.label}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm font-medium block mb-1">
                Price ({currencies[currentCurrency]})
              </Label>
              <Input
                type="text"
                value={displayPrice}
                onFocus={() => setIsEditingPrice(true)}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string and numeric with optional single dot
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setDisplayPrice(value);
                  }
                }}
                onBlur={() => {
                  let value = displayPrice.trim();
                  // Commit value to base currency
                  let displayValue = value === '' ? 0 : parseFloat(value);
                  if (isNaN(displayValue)) displayValue = 0;
                  let basePrice = displayValue;
                  if (currentCurrency === 'HTG') {
                    basePrice = displayValue / 132;
                  } else if (currentCurrency === 'HTD') {
                    basePrice = (displayValue * 132) / 5;
                  }
                  setFormData({ ...formData, price: basePrice });
                  setIsEditingPrice(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur();
                  } else if (e.key === 'Escape') {
                    setIsEditingPrice(false);
                  }
                }}
                placeholder="0"
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-sm font-medium block mb-1">Stock Quantity</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                className="w-full"
              />
            </div>
          </div>

          {/* Auto-generated SKU display */}
          <div>
            <Label className="text-sm font-medium block mb-1">SKU (Auto-generated)</Label>
            <div className="relative">
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm font-mono">
                <div className="flex items-center justify-between">
                  <span>{skuPreview || 'SKU will be generated after saving'}</span>
                  {skuPreview && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(skuPreview);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors ml-2"
                      title="Copy SKU"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              SKU is auto-generated and used for tracking and identifying this specific variant in your inventory system.
            </p>
          </div>

          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-10">
          <div className="flex space-x-2">
            <Button type="button" onClick={handleSubmit} className="flex-1">
              {isNew ? 'Add Variant' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
