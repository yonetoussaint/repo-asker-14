import React, { useState } from 'react';
import { Upload, Trash2, Plus, X, ChevronUp, ChevronDown, Package, Edit2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  bestseller?: boolean;
  limited?: boolean;
  active?: boolean;
  storage?: string;
  networkStatus?: string;
  productGrade?: string;
  product_images?: {
    id: string;
    src: string;
    alt?: string;
  }[];
  product_videos?: {
    id: string;
    video_url: string;
    title?: string;
    description?: string;
  }[];
}

interface VariantsEditPageProps {
  formData: {
    variants: Variant[];
  };
  onInputChange: (field: string, value: any) => void;
  onNavigationChange?: (context: { 
    canGoBack: boolean; 
    onBack: () => void; 
    title: string; 
    subtitle?: string;
  } | null) => void;
}

const VariantsEditPage: React.FC<VariantsEditPageProps> = ({
  formData,
  onInputChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [uploadingVideos, setUploadingVideos] = useState<string[]>([]);
  const [isVariantsOpen, setIsVariantsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State for new variant form
  const [newVariantData, setNewVariantData] = useState({
    storage: '',
    networkStatus: '',
    productGrade: '',
    price: 0,
    stock: 0
  });
  
  // Options for variant properties
  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
  const networkStatusOptions = ['Unlocked', 'AT&T', 'Verizon', 'T-Mobile', 'Sprint'];
  const productGradeOptions = ['Brand New', 'Refurbished', 'Used'];

  // Get the first variant or create a default one if none exists
  const variant = formData.variants[0] || {
    id: Date.now().toString(),
    name: '',
    price: 0,
    stock: 0,
    image: undefined,
    bestseller: false,
    limited: false,
    active: true,
    product_images: [],
    product_videos: []
  };

  console.log('VariantsEditPage - Current variant:', variant);
  console.log('VariantsEditPage - Full formData:', formData);

  const uploadFile = async (file: File, isVideo = false): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const folder = isVideo ? 'product-videos' : 'product-images';

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(`${fileName}`, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error(`Failed to upload ${isVideo ? 'video' : 'image'}`);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(`${fileName}`);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${isVideo ? 'video' : 'image'}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, false);
    if (url) {
      handleVariantUpdate('image', url);
      toast.success('Main image uploaded successfully');
    }
  };

  const handleProductImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: { id: string; src: string; alt?: string }[] = [];

    for (const file of Array.from(files)) {
      const imageId = `img-${Date.now()}-${Math.random()}`;
      setUploadingImages(prev => [...prev, imageId]);

      const url = await uploadFile(file, false);
      if (url) {
        newImages.push({
          id: imageId,
          src: url,
          alt: variant.name
        });
      }

      setUploadingImages(prev => prev.filter(id => id !== imageId));
    }

    if (newImages.length > 0) {
      const updatedImages = [...(variant.product_images || []), ...newImages];
      handleVariantUpdate('product_images', updatedImages);
      toast.success(`${newImages.length} image(s) uploaded successfully`);
    }
  };

  const handleProductVideosUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newVideos: { id: string; video_url: string; title?: string; description?: string }[] = [];

    for (const file of Array.from(files)) {
      const videoId = `vid-${Date.now()}-${Math.random()}`;
      setUploadingVideos(prev => [...prev, videoId]);

      const url = await uploadFile(file, true);
      if (url) {
        newVideos.push({
          id: videoId,
          video_url: url,
          title: file.name
        });
      }

      setUploadingVideos(prev => prev.filter(id => id !== videoId));
    }

    if (newVideos.length > 0) {
      const updatedVideos = [...(variant.product_videos || []), ...newVideos];
      handleVariantUpdate('product_videos', updatedVideos);
      toast.success(`${newVideos.length} video(s) uploaded successfully`);
    }
  };

  const handleVariantUpdate = (field: string, value: any) => {
    console.log('VariantsEditPage - handleVariantUpdate:', field, value);
    
    const updatedVariant = { ...variant, [field]: value };
    
    // Update the variants array properly - preserve existing variants and update the current one
    const currentVariants = formData.variants || [];
    let updatedVariants;
    
    if (currentVariants.length === 0) {
      // If no variants exist, create a new array with the updated variant
      updatedVariants = [updatedVariant];
    } else {
      // Find and update the existing variant, or add it if it doesn't exist
      const variantIndex = currentVariants.findIndex(v => v.id === updatedVariant.id);
      if (variantIndex >= 0) {
        updatedVariants = [...currentVariants];
        updatedVariants[variantIndex] = updatedVariant;
      } else {
        updatedVariants = [...currentVariants, updatedVariant];
      }
    }
    
    console.log('VariantsEditPage - Updated variants array:', updatedVariants);
    onInputChange('variants', updatedVariants);
  };

  const removeProductImage = (imageId: string) => {
    const updatedImages = variant.product_images?.filter(img => img.id !== imageId) || [];
    handleVariantUpdate('product_images', updatedImages);
  };

  const removeProductVideo = (videoId: string) => {
    const updatedVideos = variant.product_videos?.filter(vid => vid.id !== videoId) || [];
    handleVariantUpdate('product_videos', updatedVideos);
  };

  // Handle adding new variants
  const handleAddNewVariant = () => {
    if (!newVariantData.storage || !newVariantData.networkStatus || !newVariantData.productGrade) {
      toast.error('Please fill in all variant details');
      return;
    }

    const newVariant: Variant = {
      id: `var-${Date.now()}-${Math.random()}`,
      name: `${newVariantData.storage} ${newVariantData.networkStatus} ${newVariantData.productGrade}`,
      price: newVariantData.price,
      stock: newVariantData.stock,
      storage: newVariantData.storage,
      networkStatus: newVariantData.networkStatus,
      productGrade: newVariantData.productGrade,
      active: true,
      bestseller: false,
      limited: false,
      product_images: [],
      product_videos: []
    };

    const updatedVariants = [...(formData.variants || []), newVariant];
    onInputChange('variants', updatedVariants);
    
    // Reset form
    setNewVariantData({
      storage: '',
      networkStatus: '',
      productGrade: '',
      price: 0,
      stock: 0
    });
    setShowAddForm(false);
    toast.success('New variant added successfully');
  };

  const resetNewVariantForm = () => {
    setNewVariantData({
      storage: '',
      networkStatus: '',
      productGrade: '',
      price: 0,
      stock: 0
    });
    setShowAddForm(false);
  };

  // For the variant card component that was referenced but not defined
  const VariantCard = ({ variant, isEditing }: { variant: any; isEditing: boolean }) => {
    const [editData, setEditData] = useState({
      storage: variant.storage || '',
      networkStatus: variant.networkStatus || '',
      productGrade: variant.productGrade || '',
      price: variant.price || 0,
      stock: variant.stock || 0
    });

    const handleUpdateVariant = (id: string, data: any) => {
      const currentVariants = formData.variants || [];
      const updatedVariants = currentVariants.map(v => 
        v.id === id 
          ? { 
              ...v, 
              storage: data.storage,
              networkStatus: data.networkStatus,
              productGrade: data.productGrade,
              price: data.price,
              stock: data.stock,
              name: `${data.storage} ${data.networkStatus} ${data.productGrade}`
            } 
          : v
      );
      onInputChange('variants', updatedVariants);
      setEditingId(null);
      toast.success('Variant updated successfully');
    };

    const handleDeleteVariant = (id: string) => {
      const currentVariants = formData.variants || [];
      const updatedVariants = currentVariants.filter(v => v.id !== id);
      onInputChange('variants', updatedVariants);
      toast.success('Variant deleted successfully');
    };

    if (isEditing) {
      return (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-blue-800">Editing Variant</span>
            <div className="flex space-x-1">
              <button
                onClick={() => handleUpdateVariant(variant.id, editData)}
                className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded"
              >
                <Save size={14} />
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white p-1.5 rounded"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={editData.storage}
                onChange={(e) => setEditData({ ...editData, storage: e.target.value })}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {storageOptions.map(storage => (
                  <option key={storage} value={storage}>{storage}</option>
                ))}
              </select>

              <select
                value={editData.networkStatus}
                onChange={(e) => setEditData({ ...editData, networkStatus: e.target.value })}
                className="w-full border rounded px-2 py-1.5 text-sm"
              >
                {networkStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <select
              value={editData.productGrade}
              onChange={(e) => setEditData({ ...editData, productGrade: e.target.value })}
              className="w-full border rounded px-2 py-1.5 text-sm"
            >
              {productGradeOptions.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                className="w-full border rounded px-2 py-1.5 text-sm"
                placeholder="Price"
              />
              <input
                type="number"
                value={editData.stock}
                onChange={(e) => setEditData({ ...editData, stock: parseInt(e.target.value) })}
                className="w-full border rounded px-2 py-1.5 text-sm"
                placeholder="Stock"
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-2.5 mb-2 shadow-sm">
        {/* Header Row with Storage and Actions */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {variant.storage} • {variant.networkStatus}{variant.networkStatus !== 'Unlocked' ? ' (Locked)' : ''}
            </h3>
            <span className={`inline-block px-2 py-0.5 rounded-full font-medium text-xs mt-1 ${
              variant.productGrade === 'Brand New' ? 'bg-green-100 text-green-800' :
              variant.productGrade === 'Refurbished' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {variant.productGrade}
            </span>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setEditingId(variant.id)}
              className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => handleDeleteVariant(variant.id)}
              className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Compact Metrics Row */}
        <div className="grid grid-cols-3 gap-1.5 text-xs text-gray-600">
          <div className="flex flex-col items-center py-1.5 px-2 bg-green-50 rounded text-center">
            <span className="text-gray-600 mb-0.5">Price</span>
            <span className="font-bold text-gray-900 text-sm">${variant.price}</span>
          </div>

          <div className="flex flex-col items-center py-1.5 px-2 bg-blue-50 rounded text-center">
            <span className="text-gray-600 mb-0.5">Stock</span>
            <span className="font-bold text-gray-900 text-sm">{variant.stock}</span>
          </div>

          <div className="flex flex-col items-center py-1.5 px-2 bg-gray-50 rounded text-center">
            <span className="text-gray-600 mb-0.5">SKU</span>
            <span className="font-mono text-gray-700 text-xs">{variant.sku || 'N/A'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-4 min-h-screen bg-background">
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <Label className="text-xs font-medium block mb-1">Main Image</Label>
            <div className="relative w-24 h-24 rounded border border-gray-300 bg-gray-50 group cursor-pointer hover:bg-gray-100 transition-colors"
                 onClick={() => document.getElementById('main-image-upload')?.click()}>
              {variant.image ? (
                <img 
                  src={variant.image} 
                  alt={variant.name} 
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              )}

              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <Upload className="w-5 h-5 text-white" />
              </div>

              {variant.image && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVariantUpdate('image', undefined);
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
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

          <div className="flex-1 space-y-2">
            <div>
              <Label className="text-xs font-medium block mb-1">Variant Name</Label>
              <Input
                value={variant.name}
                onChange={(e) => handleVariantUpdate('name', e.target.value)}
                placeholder="e.g., Space Gray, 64GB, etc."
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-medium block mb-1">Price ($)</Label>
                <Input
                  type="number"
                  value={variant.price || 0}
                  onChange={(e) => handleVariantUpdate('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <Label className="text-xs font-medium block mb-1">Stock</Label>
                <Input
                  type="number"
                  value={variant.stock || 0}
                  onChange={(e) => handleVariantUpdate('stock', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium block mb-2">Product Images</Label>
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4">
          <div 
            className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-gray-300 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-center transition-colors"
            onClick={() => document.getElementById('product-images-upload')?.click()}
          >
            <Upload className="w-6 h-6 text-gray-400" />
          </div>

          {variant.product_images?.map((image) => (
            <div key={image.id} className="relative flex-shrink-0">
              <img 
                src={image.src} 
                alt={image.alt || variant.name} 
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                onClick={() => removeProductImage(image.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {uploadingImages.map(id => (
            <div key={id} className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded border flex items-center justify-center">
              <div className="text-xs text-gray-500">...</div>
            </div>
          ))}
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleProductImagesUpload}
          className="hidden"
          id="product-images-upload"
          disabled={uploading}
        />
      </div>

      <div>
        <Label className="text-sm font-medium block mb-2">Product Videos</Label>
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4">
          <div 
            className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-gray-300 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-center transition-colors"
            onClick={() => document.getElementById('product-videos-upload')?.click()}
          >
            <Upload className="w-6 h-6 text-gray-400" />
          </div>

          {variant.product_videos?.map((video) => (
            <div key={video.id} className="relative flex-shrink-0">
              <div className="w-24 h-24 bg-gray-900 rounded border flex items-center justify-center relative">
                <video 
                  src={video.video_url} 
                  className="w-full h-full object-cover rounded"
                  muted
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeProductVideo(video.id)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {uploadingVideos.map(id => (
            <div key={id} className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded border flex items-center justify-center">
              <div className="text-xs text-gray-500">...</div>
            </div>
          ))}
        </div>

        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleProductVideosUpload}
          className="hidden"
          id="product-videos-upload"
          disabled={uploading}
        />
      </div>

      <div className="border-t border-gray-200 -mx-4 px-4">
        <div className="py-4">
          <button
            onClick={() => setIsVariantsOpen(!isVariantsOpen)}
            className="w-full flex items-center justify-between text-left rounded transition-colors"
          >
            <span className="text-sm font-medium">Variants ({formData.variants.length})</span>
            {isVariantsOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-700 font-bold" strokeWidth={2.5} />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-700 font-bold" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {isVariantsOpen && (
          <>
            <div className="border-t border-gray-200 -mx-4"></div>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-2 rounded border text-center">
                  <p className="text-sm font-bold text-blue-600">{formData.variants.length}</p>
                  <p className="text-xs text-gray-600">Variants</p>
                </div>
                <div className="bg-white p-2 rounded border text-center">
                  <p className="text-sm font-bold text-green-600">{formData.variants.reduce((sum, v) => sum + (v.stock || 0), 0)}</p>
                  <p className="text-xs text-gray-600">Total Stock</p>
                </div>
                <div className="bg-white p-2 rounded border text-center">
                  <p className="text-sm font-bold text-purple-600">1</p>
                  <p className="text-xs text-gray-600">Storage Options</p>
                </div>
              </div>

              <div>
                {formData.variants.length === 0 ? (
                  <div className="bg-white border rounded-lg p-6 text-center">
                    <Package size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 font-medium text-sm">No variants yet</p>
                    <p className="text-gray-400 text-xs">Add your first variant below</p>
                  </div>
                ) : (
                  formData.variants.map((variant) => (
                    <VariantCard 
                      key={variant.id} 
                      variant={variant} 
                      isEditing={editingId === variant.id}
                    />
                  ))
                )}
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Plus size={16} />
                <span className="font-medium text-sm">Add New Variant</span>
              </button>

              {showAddForm && (
                <div className="bg-white border rounded-lg p-3">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">New Variant</h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newVariantData.storage}
                        onChange={(e) => setNewVariantData({ ...newVariantData, storage: e.target.value })}
                        className="border rounded px-2 py-1.5 text-sm"
                      >
                        <option value="">Storage</option>
                        {storageOptions.map(storage => (
                          <option key={storage} value={storage}>{storage}</option>
                        ))}
                      </select>

                      <select
                        value={newVariantData.networkStatus}
                        onChange={(e) => setNewVariantData({ ...newVariantData, networkStatus: e.target.value })}
                        className="border rounded px-2 py-1.5 text-sm"
                      >
                        <option value="">Network</option>
                        {networkStatusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <select
                      value={newVariantData.productGrade}
                      onChange={(e) => setNewVariantData({ ...newVariantData, productGrade: e.target.value })}
                      className="w-full border rounded px-2 py-1.5 text-sm"
                    >
                      <option value="">Product Grade</option>
                      {productGradeOptions.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={newVariantData.price}
                        onChange={(e) => setNewVariantData({ ...newVariantData, price: parseFloat(e.target.value) || 0 })}
                        className="border rounded px-2 py-1.5 text-sm"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                      />
                      <input
                        type="number"
                        value={newVariantData.stock}
                        onChange={(e) => setNewVariantData({ ...newVariantData, stock: parseInt(e.target.value) || 0 })}
                        className="border rounded px-2 py-1.5 text-sm"
                        placeholder="Stock"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={handleAddNewVariant}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition-colors text-sm"
                    >
                      Add Variant
                    </button>
                    <button
                      onClick={resetNewVariantForm}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded font-medium transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VariantsEditPage;