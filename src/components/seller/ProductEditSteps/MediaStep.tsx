import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Upload, Loader2, Video, Play, Box } from 'lucide-react';
import { Product } from '@/integrations/supabase/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MediaStepProps {
  product: Product;
  uploadingImages: boolean;
  uploadingVideos: boolean;
  setUploadingImages: (uploading: boolean) => void;
  setUploadingVideos: (uploading: boolean) => void;
  onSuccess: () => void;
  formData?: { model_3d_url: string };
  onInputChange?: (field: string, value: any) => void;
}

export const MediaStep: React.FC<MediaStepProps> = ({
  product,
  uploadingImages,
  uploadingVideos,
  setUploadingImages,
  setUploadingVideos,
  onSuccess,
  formData,
  onInputChange
}) => {
  const getProductImageUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop";
    return imagePath;
  };

  const getProductVideoUrl = (videoPath?: string): string => {
    if (!videoPath) return "";
    return videoPath;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !product) return;

    setUploadingImages(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          // Create unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${product.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          console.log('Uploading image:', fileName);

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

          console.log('Image uploaded, saving to database:', urlData.publicUrl);

          // Save image record to database
          const { error: dbError } = await supabase
            .from('product_images')
            .insert({
              product_id: product.id,
              src: urlData.publicUrl,
              alt: `${product.name} image`
            });

          if (dbError) {
            console.error('Database error:', dbError);
            // Try to delete the uploaded file if DB insert fails
            await supabase.storage
              .from('product-images')
              .remove([fileName]);
            throw new Error(`Failed to save ${file.name} to database: ${dbError.message}`);
          }

          console.log('Image saved successfully:', file.name);
          return { success: true, fileName: file.name };
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          toast.error(error instanceof Error ? error.message : `Failed to upload ${file.name}`);
          return { success: false, fileName: file.name, error };
        }
      });

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r.success).length;
      
      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}`);
        // Wait a moment for database to sync before refreshing
        await new Promise(resolve => setTimeout(resolve, 500));
        onSuccess(); // Refresh the product data
      }
      
      if (successCount < results.length) {
        const failedCount = results.length - successCount;
        toast.error(`Failed to upload ${failedCount} image${failedCount > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !product) return;

    setUploadingVideos(true);

    try {
      for (const file of Array.from(files)) {
        // Validate video file type
        if (!file.type.startsWith('video/')) {
          toast.error(`${file.name} is not a valid video file`);
          continue;
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${product.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // First ensure the product folder exists
        const { error: folderError } = await supabase.storage
          .from('product-videos')
          .upload(`${product.id}/.placeholder`, new Blob(), {
            upsert: true
          });

        if (folderError && folderError.message !== 'The resource already exists') {
          console.error('Folder creation error:', folderError);
          throw folderError;
        }

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('product-videos')
          .upload(fileName, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Video upload error:', uploadError);
          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('product-videos')
          .getPublicUrl(fileName);

        // Save video record to database
        const { error: dbError } = await supabase
          .from('product_videos')
          .insert({
            product_id: product.id,
            video_url: urlData.publicUrl,
            title: `${product.name} video`,
            description: `Video for ${product.name}`
          });

        if (dbError) {
          console.error('Database error:', dbError);
          // Attempt to delete the uploaded video if DB insert fails
          await supabase.storage
            .from('product-videos')
            .remove([fileName]);
            
          toast.error(`Failed to save ${file.name} to database: ${dbError.message}`);
        } else {
          toast.success(`${file.name} uploaded successfully`);
        }
      }

      onSuccess(); // Refresh the product data
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast.error(`Failed to upload videos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingVideos(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Product Media</h3>
        <p className="text-sm text-muted-foreground">
          Upload images and videos to showcase your product
        </p>
      </div>

      {/* Product Images */}
      <div className="space-y-3">
        <Label>Product Images</Label>
        {product.product_images && product.product_images.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {product.product_images.map((image) => (
              <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={getProductImageUrl(image.src)}
                  alt={image.alt || 'Product image'}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      // Delete from storage
                      const path = image.src.split('/').pop();
                      if (path) {
                        const { error: storageError } = await supabase.storage
                          .from('product-images')
                          .remove([path]);

                        if (storageError) throw storageError;
                      }

                      // Delete from database
                      const { error: dbError } = await supabase
                        .from('product_images')
                        .delete()
                        .eq('id', image.id);

                      if (dbError) throw dbError;

                      toast.success('Image deleted successfully');
                      onSuccess();
                    } catch (error) {
                      console.error('Error deleting image:', error);
                      toast.error('Failed to delete image');
                    }
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No images uploaded yet</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={uploadingImages}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={uploadingImages}
            className="flex items-center gap-2"
          >
            {uploadingImages ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add Images
          </Button>
        </div>
      </div>

      {/* Product Videos */}
      <div className="space-y-3">
        <Label>Product Videos</Label>
        {product.product_videos && product.product_videos.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {product.product_videos.map((video) => (
              <div key={video.id} className="relative aspect-video rounded-lg overflow-hidden border">
                <video
                  src={getProductVideoUrl(video.video_url)}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      // Delete from storage
                      const path = video.video_url.split('/').pop();
                      if (path) {
                        const { error: storageError } = await supabase.storage
                          .from('product-videos')
                          .remove([path]);

                        if (storageError) throw storageError;
                      }

                      // Delete from database
                      const { error: dbError } = await supabase
                        .from('product_videos')
                        .delete()
                        .eq('id', video.id);

                      if (dbError) throw dbError;

                      toast.success('Video deleted successfully');
                      onSuccess();
                    } catch (error) {
                      console.error('Error deleting video:', error);
                      toast.error('Failed to delete video');
                    }
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No videos uploaded yet</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="video-upload"
            disabled={uploadingVideos}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('video-upload')?.click()}
            disabled={uploadingVideos}
            className="flex items-center gap-2"
          >
            {uploadingVideos ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add Videos
          </Button>
        </div>
      </div>

      {/* 3D Model URL */}
      {formData && onInputChange && (
        <div className="space-y-3">
          <Label>3D Model URL</Label>
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Enter 3D model URL (e.g., .glb, .gltf file URL)"
              value={formData.model_3d_url}
              onChange={(e) => onInputChange('model_3d_url', e.target.value)}
              className="w-full"
            />
            {formData.model_3d_url && (
              <div className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <Box className="w-4 h-4" />
                <span>3D model will be displayed in the product gallery</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};