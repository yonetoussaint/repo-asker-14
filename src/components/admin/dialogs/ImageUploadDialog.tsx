
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/integrations/supabase/products";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: Product | null;
  onSuccess: () => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({ 
  open, 
  onOpenChange,
  selectedProduct,
  onSuccess
}) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!uploadFile || !selectedProduct || !imageAlt) {
      toast.error("Please provide both an image and alt text.");
      return;
    }

    try {
      setUploading(true);
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${selectedProduct.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, uploadFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const { error: dbError } = await supabase
        .from('product_images')
        .insert({
          product_id: selectedProduct.id,
          src: imageUrl,
          alt: imageAlt
        });

      if (dbError) {
        throw dbError;
      }

      toast.success("Image uploaded successfully");
      onSuccess();
      onOpenChange(false);
      setUploadFile(null);
      setImageAlt("");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("There was an error uploading the image.");
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload New Image</DialogTitle>
          <DialogDescription>
            Upload a new image for {selectedProduct?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image">Select Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploadFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Selected: {uploadFile.name}</p>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              placeholder="Image description"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              disabled={uploading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUploadImage}
            disabled={!uploadFile || !imageAlt || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
