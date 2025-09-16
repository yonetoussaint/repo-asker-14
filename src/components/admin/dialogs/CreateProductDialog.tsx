
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import { createProduct } from "@/integrations/supabase/products";
import { useQueryClient } from "@tanstack/react-query";

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProductDialog: React.FC<CreateProductDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    discount_price: null as number | null,
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState("");
  const [creatingProduct, setCreatingProduct] = useState(false);
  const queryClient = useQueryClient();

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "price" || name === "discount_price") {
      const numValue = value === "" ? (name === "discount_price" ? null : 0) : parseFloat(value);
      setNewProduct(prev => ({ ...prev, [name]: numValue }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !newProduct.tags.includes(newTag.trim())) {
      setNewProduct(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      toast.error("Please fill in all required fields and ensure price is greater than zero.");
      return;
    }

    try {
      setCreatingProduct(true);
      
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        discount_price: newProduct.discount_price || null,
        tags: newProduct.tags
      };
      
      const data = await createProduct(productData);

      if (data) {
        toast.success("Product created successfully!");
        // Clear the form
        setNewProduct({
          name: "",
          description: "",
          price: 0,
          discount_price: null,
          tags: []
        });
        // Close the dialog
        onOpenChange(false);
        // Refresh product data
        queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      } else {
        toast.error("Failed to create product. Please try again.");
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setCreatingProduct(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Add details for your new product
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleNewProductChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Product description"
              value={newProduct.description}
              onChange={handleNewProductChange}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newProduct.price || ""}
                onChange={handleNewProductChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="discount_price">Discount Price ($) (Optional)</Label>
              <Input
                id="discount_price"
                name="discount_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={newProduct.discount_price === null ? "" : newProduct.discount_price}
                onChange={handleNewProductChange}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addTag}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>
            {newProduct.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newProduct.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={creatingProduct}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateProduct}
            disabled={creatingProduct || !newProduct.name || !newProduct.description || !newProduct.price}
          >
            {creatingProduct ? "Creating..." : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;
