import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  colorCode?: string;
  bestseller?: boolean;
  limited?: boolean;
}

interface VariantsStepProps {
  formData: {
    variants: Variant[];
  };
  onInputChange: (field: string, value: any) => void;
}

export const VariantsStep: React.FC<VariantsStepProps> = ({
  formData,
  onInputChange
}) => {
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      stock: 0,
      colorCode: '#000000'
    };
    const updatedVariants = [...formData.variants, newVariant];
    onInputChange('variants', updatedVariants);
    setEditingVariant(newVariant);
  };

  const updateVariant = (updatedVariant: Variant) => {
    const updatedVariants = formData.variants.map(variant =>
      variant.id === updatedVariant.id ? updatedVariant : variant
    );
    onInputChange('variants', updatedVariants);
    setEditingVariant(null);
  };

  const updateVariantField = (field: keyof Variant, value: any) => {
    if (!editingVariant) return;
    const updatedVariant = { ...editingVariant, [field]: value };
    setEditingVariant(updatedVariant);
    
    // Immediately update the parent form data
    const updatedVariants = formData.variants.map(variant =>
      variant.id === updatedVariant.id ? updatedVariant : variant
    );
    onInputChange('variants', updatedVariants);
  };

  const deleteVariant = (variantId: string) => {
    const updatedVariants = formData.variants.filter(variant => variant.id !== variantId);
    onInputChange('variants', updatedVariants);
  };

  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Red': '#FF0000',
      'Blue': '#0000FF',
      'Green': '#008000',
      'Yellow': '#FFFF00',
      'Pink': '#FFC0CB',
      'Purple': '#800080',
      'Orange': '#FFA500',
      'Gray': '#808080',
      'Brown': '#A52A2A'
    };
    return colorMap[colorName] || '#000000';
  };

  const handleImageUpload = async (file: File, variantId: string) => {
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `variant-${variantId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Update the editing variant with the new image URL
      if (editingVariant && editingVariant.id === variantId) {
        setEditingVariant({ ...editingVariant, image: publicUrl });
      }

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (variantId: string) => {
    if (editingVariant && editingVariant.id === variantId) {
      setEditingVariant({ ...editingVariant, image: undefined });
    }
  };

  if (editingVariant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Variant</h3>
          <Button
            variant="outline"
            onClick={() => setEditingVariant(null)}
          >
            Cancel
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="variant-name">Variant Name</Label>
            <Input
              id="variant-name"
              value={editingVariant.name}
              onChange={(e) => updateVariantField('name', e.target.value)}
              placeholder="e.g., Midnight Black"
            />
          </div>

          <div>
            <Label htmlFor="variant-color">Color Code</Label>
            <div className="flex gap-2">
              <Input
                id="variant-color"
                type="color"
                value={editingVariant.colorCode || getColorHex(editingVariant.name)}
                onChange={(e) => updateVariantField('colorCode', e.target.value)}
                className="w-20"
              />
              <Input
                value={editingVariant.colorCode || getColorHex(editingVariant.name)}
                onChange={(e) => updateVariantField('colorCode', e.target.value)}
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="variant-price">Price ($)</Label>
              <Input
                id="variant-price"
                type="number"
                step="0.01"
                value={editingVariant.price}
                onChange={(e) => updateVariantField('price', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="variant-stock">Stock</Label>
              <Input
                id="variant-stock"
                type="number"
                value={editingVariant.stock}
                onChange={(e) => updateVariantField('stock', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label>Variant Image</Label>
            <div className="space-y-3">
              {editingVariant.image ? (
                <div className="relative inline-block">
                  <img 
                    src={editingVariant.image} 
                    alt={editingVariant.name}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(editingVariant.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
              
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, editingVariant.id);
                  }}
                  className="hidden"
                  id="variant-image-upload"
                  disabled={uploadingImage}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('variant-image-upload')?.click()}
                  disabled={uploadingImage}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingVariant.bestseller || false}
                onChange={(e) => updateVariantField('bestseller', e.target.checked)}
              />
              Bestseller
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingVariant.limited || false}
                onChange={(e) => updateVariantField('limited', e.target.checked)}
              />
              Limited Edition
            </label>
          </div>

          <Button onClick={() => setEditingVariant(null)} className="w-full">
            Done Editing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Variants</h3>
          <p className="text-sm text-muted-foreground">
            Add different variants for your product (colors, sizes, models, etc.)
          </p>
        </div>
        <Button onClick={addVariant} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Variant
        </Button>
      </div>

      {formData.variants.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground">No variants added yet</p>
          <Button onClick={addVariant} variant="outline" className="mt-2">
            Add First Variant
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {formData.variants.map((variant) => (
            <div key={variant.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: variant.colorCode || getColorHex(variant.name) }}
                />
                {variant.image && (
                  <img 
                    src={variant.image} 
                    alt={variant.name}
                    className="w-8 h-8 object-cover rounded border"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{variant.name || 'Unnamed'}</div>
                <div className="text-sm text-muted-foreground">
                  ${variant.price} • {variant.stock} in stock
                  {variant.bestseller && ' • Bestseller'}
                  {variant.limited && ' • Limited'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingVariant(variant)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteVariant(variant.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};