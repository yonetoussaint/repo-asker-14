
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: any;
  onSuccess: () => void;
}

const ImageEditDialog: React.FC<ImageEditDialogProps> = ({ 
  open, 
  onOpenChange,
  image,
  onSuccess
}) => {
  const [imageAlt, setImageAlt] = useState("");
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    if (image && open) {
      setImageAlt(image.alt || "");
    }
  }, [image, open]);

  const handleUpdateImage = async () => {
    if (!image || !imageAlt) {
      toast.error("Alt text cannot be empty");
      return;
    }

    try {
      setUpdating(true);
      const { error } = await supabase
        .from('product_images')
        .update({ alt: imageAlt })
        .eq('id', image.id);

      if (error) {
        throw error;
      }

      toast.success("Image updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error("There was an error updating the image.");
    } finally {
      setUpdating(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
          <DialogDescription>
            Update the details for this image
          </DialogDescription>
        </DialogHeader>
        {image && (
          <div className="grid gap-4 py-4">
            <div className="mx-auto mb-4">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="max-h-40 object-contain rounded-lg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-alt">Alt Text</Label>
              <Input
                id="edit-alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                disabled={updating}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={updating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateImage}
            disabled={updating || !imageAlt}
          >
            {updating ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditDialog;
