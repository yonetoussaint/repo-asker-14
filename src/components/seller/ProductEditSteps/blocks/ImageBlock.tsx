import React, { useState } from 'react';
import { ImageBlock as ImageBlockType } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Image, Trash2, Upload, Edit } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImageBlockProps {
  block: ImageBlockType;
  onUpdate: (block: ImageBlockType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const ImageBlockComponent: React.FC<ImageBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select an image file.");
      return;
    }

    try {
      setUploading(true);
      
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `block_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, uploadFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // Get product ID from URL (assuming we're in a product edit context)
      const urlParts = window.location.pathname.split('/');
      const productIndex = urlParts.indexOf('product');
      const productId = productIndex !== -1 ? urlParts[productIndex + 1] : null;

      // Also save the image to product_images table for database tracking
      if (productId) {
        try {
          const { error: dbError } = await supabase
            .from('product_images')
            .insert({
              product_id: productId,
              src: imageUrl,
              alt: uploadFile.name
            });
          
          if (dbError) {
            console.warn('Warning: Failed to save image to database:', dbError);
            // Don't fail the whole upload for this
          }
        } catch (dbError) {
          console.warn('Warning: Failed to save image to database:', dbError);
        }
      }

      onUpdate({
        ...block,
        url: imageUrl
      });

      toast.success("Image uploaded successfully");
      setShowUploadDialog(false);
      setUploadFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    onUpdate({ ...block, alignment });
  };

  const getAlignmentClass = () => {
    switch (block.alignment) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };

  return (
    <>
      <div className="group relative my-4">
        {/* Block Controls */}
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white rounded-md shadow-sm border p-1">
          <div className="flex items-center gap-1">
            <Select
              value={block.alignment || 'center'}
              onValueChange={handleAlignmentChange}
            >
              <SelectTrigger className="w-20 h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => setShowUploadDialog(true)} className="h-6 w-6 p-0">
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="h-6 w-6 p-0">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Image Content */}
        <div className={getAlignmentClass()}>
          {block.url ? (
            <div>
              <img
                src={block.url}
                alt=""
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => setShowUploadDialog(true)}
            >
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload image</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-file">Image File</Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
            
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImageUpload} disabled={uploading || !uploadFile}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};