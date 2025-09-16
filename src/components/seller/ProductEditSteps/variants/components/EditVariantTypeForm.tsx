import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EditVariantTypeFormProps {
  variantNameId: number;
  onSave: (variantNameId: number, name: string, stock: number, price: number, imageData?: {
    mainImage?: string;
    additionalImages?: string[];
  }) => void;
  onClose: () => void;
  getVariantName: (variantNameId: number) => string;
  getVariantMainImage: (variantNameId: number) => string;
  variants: any[];
  customVariantNames: any[];
  variantTypeImages: any;
  setVariants: (variants: any[] | ((prev: any[]) => any[])) => void;
  setVariantTypeImages: (images: any | ((prev: any) => any)) => void;
  formatPrice: (price: number) => string;
}

export const EditVariantTypeForm: React.FC<EditVariantTypeFormProps> = ({
  variantNameId,
  onSave,
  onClose,
  getVariantName,
  getVariantMainImage,
  variants,
  customVariantNames,
  variantTypeImages,
  setVariants,
  setVariantTypeImages,
  formatPrice
}) => {
  const variantName = getVariantName(variantNameId);
  const [name, setName] = useState(variantName);
  const [uploading, setUploading] = useState(false);
  const [productImages, setProductImages] = useState(() => {
    const mainImg = getVariantMainImage(variantNameId);
    const additionalImages = variantTypeImages[variantNameId] || [];
    return [mainImg, ...additionalImages].filter(img => img);
  });
  const [mainImage, setMainImage] = useState(getVariantMainImage(variantNameId));

  const hasSubvariants = variants.filter(variant => variant.variantNameId === variantNameId).length > 0;

  const calculatedStock = variants
    .filter(variant => variant.variantNameId === variantNameId)
    .reduce((sum, variant) => sum + (variant.stock || 0), 0);

  const variantPrices = variants
    .filter(variant => variant.variantNameId === variantNameId)
    .map(variant => variant.price || 0)
    .filter(price => price > 0);

  const minPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
  const maxPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : 0;
  const priceRange = variantPrices.length > 0 
    ? (minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`)
    : '$0.00';

  const currentVariantType = customVariantNames.find(vn => vn.id === variantNameId);
  
  const [editableStock, setEditableStock] = useState(currentVariantType?.stock || 0);
  const [editablePrice, setEditablePrice] = useState(currentVariantType?.price || 0);
  const totalStock = hasSubvariants ? calculatedStock : editableStock;
  const displayPrice = hasSubvariants ? priceRange : formatPrice(editablePrice);

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Create unique filename for the variant image
      const fileExt = file.name.split('.').pop();
      const fileName = `variants/${variantNameId}/${Date.now()}-main.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;
      setMainImage(imageUrl);
      
      // Update variants with the new image URL
      setVariants(prevVariants => 
        prevVariants.map(variant => 
          variant.variantNameId === variantNameId 
            ? { ...variant, image: imageUrl }
            : variant
        )
      );
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleProductImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file, index) => {
        try {
          // Create unique filename for additional images
          const fileExt = file.name.split('.').pop();
          const fileName = `variants/${variantNameId}/${Date.now()}-${index}.${fileExt}`;

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          return urlData.publicUrl;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast.error(`Failed to upload ${file.name}`);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.filter(url => url !== null);
      
      if (newImageUrls.length > 0) {
        setProductImages(prevImages => [...prevImages, ...newImageUrls]);
        toast.success(`Successfully uploaded ${newImageUrls.length} image${newImageUrls.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProductImage = async (imageToRemove: string) => {
    setProductImages(prevImages => prevImages.filter(img => img !== imageToRemove));
    
    // If it's a blob URL, clean it up
    if (imageToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove);
    } else if (imageToRemove.includes('supabase')) {
      // If it's a Supabase storage URL, optionally delete it from storage
      // Extract the file path from the URL for cleanup
      try {
        const urlParts = imageToRemove.split('/');
        const storageIndex = urlParts.findIndex(part => part === 'product-images');
        if (storageIndex !== -1 && storageIndex < urlParts.length - 1) {
          const filePath = urlParts.slice(storageIndex + 1).join('/');
          await supabase.storage
            .from('product-images')
            .remove([filePath]);
          console.log('Removed image from storage:', filePath);
        }
      } catch (error) {
        console.error('Error removing image from storage:', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mainImage !== getVariantMainImage(variantNameId)) {
      setVariants(prevVariants => 
        prevVariants.map(variant => 
          variant.variantNameId === variantNameId 
            ? { ...variant, image: mainImage }
            : variant
        )
      );
    }

    const additionalImages = productImages.filter(img => img !== mainImage);
    setVariantTypeImages(prev => ({
      ...prev,
      [variantNameId]: additionalImages
    }));
    
    // Include image data in the save call
    const imageData = {
      mainImage: mainImage,
      additionalImages: additionalImages
    };
    
    onSave(variantNameId, name, editableStock, editablePrice, imageData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-2xl w-full h-full transform transition-transform duration-300 ease-out animate-slide-up relative flex flex-col">
        <div className="sticky top-0 bg-white px-4 pt-4 pb-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit Variant Type</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2"></div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 p-4 pb-20">
          <div>
            <Label className="text-sm font-medium block mb-2">Main Image</Label>
            <div className="flex items-center gap-3">
              <div 
                className="relative w-16 h-16 rounded-lg border border-gray-300 bg-gray-50 group cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => document.getElementById('main-image-upload')?.click()}
              >
                <img 
                  src={mainImage} 
                  alt={variantName} 
                  className="w-full h-full object-cover rounded-lg"
                />

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Click to change main image</p>
                {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="hidden"
              id="main-image-upload"
              disabled={uploading}
            />
          </div>

          <div>
            <Label className="text-sm font-medium block mb-2">Variant Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium block mb-2">Total Stock Quantity</Label>
              <Input
                type="number"
                value={totalStock}
                onChange={hasSubvariants ? undefined : (e) => setEditableStock(parseInt(e.target.value) || 0)}
                readOnly={hasSubvariants}
                className={`w-full ${hasSubvariants ? 'bg-gray-50 text-gray-700' : 'bg-white'}`}
                placeholder={hasSubvariants ? "Calculated from individual variants" : "Enter stock quantity"}
              />
              <p className="text-xs text-gray-500 mt-1">
                {hasSubvariants 
                  ? `Sum of all individual variant stocks (${variants.filter(v => v.variantNameId === variantNameId).length} variants)`
                  : 'Stock quantity for this variant type'
                }
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium block mb-2">Price</Label>
              {hasSubvariants ? (
                <div className="px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm">
                  {priceRange}
                </div>
              ) : (
                <Input
                  type="number"
                  value={editablePrice}
                  onChange={(e) => setEditablePrice(parseFloat(e.target.value) || 0)}
                  className="w-full"
                  step="0.01"
                  placeholder="Enter price"
                />
              )}
              <p className="text-xs text-gray-500 mt-1">
                {hasSubvariants 
                  ? `Price range from all individual variants (${variants.filter(v => v.variantNameId === variantNameId).length} variants)`
                  : 'Base price for this variant type'
                }
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-white font-bold">i</span>
              </div>
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Stock & Price Policy</p>
                <ul className="space-y-1 text-blue-600">
                  <li>• When this tab has <strong>no subvariants</strong>, you can manually edit both stock quantity and price</li>
                  <li>• When you <strong>add subvariants</strong>, stock becomes a calculated sum and price shows as a range from all subvariant prices</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium block mb-2">Product Images</Label>
            <div className="flex overflow-x-auto pb-2 gap-2">
              {productImages.filter(image => image !== mainImage).map((image, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={image}
                    alt={`Variant image ${index + 1}`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => handleRemoveProductImage(image)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div 
                className="w-16 h-16 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={() => document.getElementById('product-images-upload')?.click()}
              >
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProductImagesUpload}
              className="hidden"
              id="product-images-upload"
              multiple
              disabled={uploading}
            />
            <p className="text-xs text-gray-500 mt-2">
              {uploading ? 'Uploading images...' : 'Click + to add more product images'}
            </p>
          </div>

          <div className="mt-6 flex space-x-2">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};