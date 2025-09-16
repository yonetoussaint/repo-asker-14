
import React, { useState, useRef } from "react";
import { X, Upload, Camera, Film, Image, Trash2, AlertCircle, Info, PlusCircle, Check, Loader2, Tag, GripVertical, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

type ContentType = "product" | "reel" | "post";

interface ProductUploadOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductUploadOverlay({ isOpen, onClose }: ProductUploadOverlayProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [contentType, setContentType] = useState<ContentType>("product");
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  // Product form state
  const productForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      category: "",
      tags: [] as string[],
      isFeatured: false,
      hasVariants: false
    }
  });
  
  // Reel form state
  const [reelTitle, setReelTitle] = useState("");
  const [reelDescription, setReelDescription] = useState("");
  const [reelVideo, setReelVideo] = useState<File | null>(null);
  const [reelVideoUrl, setReelVideoUrl] = useState<string>("");
  const [reelTags, setReelTags] = useState<string[]>([]);
  const [reelCategory, setReelCategory] = useState("");
  
  // Post form state
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postCategory, setPostCategory] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  
  // Advanced options state
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to maximum 5 images
      const newImages = [...images, ...filesArray].slice(0, 5);
      setImages(newImages);
      
      // Generate preview URLs for the images
      const newImagePreviewUrls = newImages.map(image => URL.createObjectURL(image));
      setImagePreviewUrls(newImagePreviewUrls);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReelVideo(file);
      setReelVideoUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newImagePreviewUrls = [...imagePreviewUrls];
    URL.revokeObjectURL(newImagePreviewUrls[index]);
    newImagePreviewUrls.splice(index, 1);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const addTag = (tagsList: string[], setTagsList: React.Dispatch<React.SetStateAction<string[]>>) => (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTag.trim() && !tagsList.includes(currentTag.trim())) {
      setTagsList([...tagsList, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagsList: string[], setTagsList: React.Dispatch<React.SetStateAction<string[]>>) => (index: number) => {
    const newTags = [...tagsList];
    newTags.splice(index, 1);
    setTagsList(newTags);
  };

  const validateProductForm = () => {
    const { name, price } = productForm.getValues();
    
    if (!name.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a product name",
        variant: "destructive"
      });
      return false;
    }

    if (!price.trim() || isNaN(parseFloat(price))) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price",
        variant: "destructive"
      });
      return false;
    }

    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one product image",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateReelForm = () => {
    if (!reelTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a title for your reel",
        variant: "destructive"
      });
      return false;
    }

    if (!reelVideo) {
      toast({
        title: "No video",
        description: "Please upload a video for your reel",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validatePostForm = () => {
    if (!postTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a title for your post",
        variant: "destructive"
      });
      return false;
    }

    if (!postContent.trim()) {
      toast({
        title: "Missing content",
        description: "Please enter some content for your post",
        variant: "destructive"
      });
      return false;
    }

    if (images.length === 0) {
      toast({
        title: "No images",
        description: "Please upload at least one image for your post",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    productForm.reset();
    setReelTitle("");
    setReelDescription("");
    setReelVideo(null);
    setReelVideoUrl("");
    setPostTitle("");
    setPostContent("");
    setPostTags([]);
    setReelTags([]);
    setPostCategory("");
    setReelCategory("");
    setCurrentTag("");
    setShowAdvancedOptions(false);
    
    // Clean up image previews
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setImagePreviewUrls([]);
    
    if (reelVideoUrl) {
      URL.revokeObjectURL(reelVideoUrl);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProductForm()) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formValues = productForm.getValues();
      
      // 1. Create product entry
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: formValues.name,
          description: formValues.description,
          price: parseFloat(formValues.price),
          discount_price: formValues.discountPrice ? parseFloat(formValues.discountPrice) : null
        })
        .select()
        .single();
      
      if (productError) throw productError;
      
      // 2. Upload images and create product_images entries
      const imagePromises = images.map(async (file, index) => {
        const fileName = `${Date.now()}-${index}-${file.name}`;
        const fileExt = fileName.split('.').pop();
        const filePath = `${product.id}/${fileName}`;
        
        // Upload image file
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicURL } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        // Create product_images entry
        return supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            src: publicURL.publicUrl,
            alt: formValues.name
          });
      });
      
      await Promise.all(imagePromises);
      
      // Show success message
      toast({
        title: "Product added!",
        description: "Your product has been successfully uploaded.",
      });
      
      // Refresh products list
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      // Close the overlay and reset form
      resetForm();
      onClose();
      
    } catch (error) {
      console.error("Error uploading product:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitReel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateReelForm()) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      // For now, just show a toast that this functionality is coming soon
      toast({
        title: "Coming Soon!",
        description: "Reel upload functionality will be available soon.",
        variant: "default"
      });
      
      // Close the overlay and reset form
      resetForm();
      onClose();
      
    } catch (error) {
      console.error("Error uploading reel:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your reel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePostForm()) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      // For now, just show a toast that this functionality is coming soon
      toast({
        title: "Coming Soon!",
        description: "Post upload functionality will be available soon.",
        variant: "default"
      });
      
      // Close the overlay and reset form
      resetForm();
      onClose();
      
    } catch (error) {
      console.error("Error uploading post:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const AdvancedOptionsButton = () => (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full mt-2 flex items-center justify-center gap-2"
      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
    >
      {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
      <Info className="h-4 w-4" />
    </Button>
  );

  const ProductImageUploader = () => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Product Images (Max 5)</label>
        {images.length > 0 && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs" 
            onClick={() => imageInputRef.current?.click()}
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" /> Add More
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {imagePreviewUrls.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-gray-100 border border-gray-200 group">
            <img 
              src={url}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => removeImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Badge className="absolute top-1 left-1 bg-black/50 hover:bg-black/50 text-white text-[10px] px-1.5 py-0.5">
              #{index + 1}
            </Badge>
          </div>
        ))}
        
        {images.length < 5 && (
          <label className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <Camera className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">Add</span>
            <input 
              ref={imageInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="sr-only"
              multiple
            />
          </label>
        )}
      </div>
    </div>
  );

  const TagsInput = ({ 
    tags, 
    removeTagFn, 
    category, 
    setCategory 
  }: { 
    tags: string[], 
    removeTagFn: (index: number) => void, 
    category: string, 
    setCategory: (value: string) => void  // Fixed this line to expect a string parameter
  }) => (
    <div className="space-y-4">
      <div>
        <label htmlFor="category" className="text-sm font-medium block mb-1">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fashion">Fashion</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
            <SelectItem value="beauty">Beauty</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label htmlFor="tags" className="text-sm font-medium block mb-1">Tags</label>
        <form className="flex" onSubmit={addTag(tags, (newTags) => {
          if (contentType === "post") setPostTags(newTags);
          else if (contentType === "reel") setReelTags(newTags);
        })}>
          <Input 
            id="tags" 
            value={currentTag} 
            onChange={(e) => setCurrentTag(e.target.value)}
            placeholder="Add a tag" 
            className="flex-1 rounded-r-none"
          />
          <Button 
            type="submit" 
            className="rounded-l-none px-3"
          >
            Add
          </Button>
        </form>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="pl-2 pr-1 py-1 flex items-center gap-1 text-xs"
              >
                <Tag className="h-3 w-3" />
                {tag}
                <button
                  type="button"
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5 ml-1"
                  onClick={() => removeTagFn(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[95vh] p-0 inset-x-0 w-full sm:max-w-none bg-white"
      >
        <SheetHeader className="text-left px-4 pt-4 pb-2">
          <SheetTitle>Create New Content</SheetTitle>
        </SheetHeader>
        
        <div className="relative h-[calc(100%-50px)]">
          <Tabs value={contentType} onValueChange={(value) => setContentType(value as ContentType)} className="h-full flex flex-col">
            <TabsContent value="product" className="flex-1 overflow-auto px-4 pb-20">
              <form onSubmit={handleSubmitProduct} className="space-y-6 py-2">
                {/* Image Upload Section */}
                <ProductImageUploader />
                
                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium">Product Name</label>
                    <Input
                      id="name"
                      {...productForm.register('name')}
                      placeholder="Enter product name"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Textarea
                      id="description"
                      {...productForm.register('description')}
                      placeholder="Describe your product..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="text-sm font-medium">Price</label>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          id="price"
                          type="text"
                          inputMode="decimal"
                          {...productForm.register('price')}
                          placeholder="0.00"
                          className="pl-7"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="discount" className="text-sm font-medium">Discount Price (Optional)</label>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                          id="discount"
                          type="text"
                          inputMode="decimal"
                          {...productForm.register('discountPrice')}
                          placeholder="0.00"
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <TagsInput 
                    tags={productForm.watch('tags')} 
                    removeTagFn={(index) => {
                      const currentTags = [...productForm.watch('tags')];
                      currentTags.splice(index, 1);
                      productForm.setValue('tags', currentTags);
                    }}
                    category={productForm.watch('category')}
                    setCategory={(value: string) => productForm.setValue('category', value)}
                  />
                </div>
                
                <AdvancedOptionsButton />
                
                <AnimatePresence>
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border rounded-md p-4 space-y-4 mt-2 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="featured" className="text-sm font-medium">Featured Product</label>
                            <p className="text-xs text-gray-500">Show this product in the featured section</p>
                          </div>
                          <Switch
                            id="featured"
                            checked={productForm.watch('isFeatured')}
                            onCheckedChange={(checked) => productForm.setValue('isFeatured', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="variants" className="text-sm font-medium">Product Variants</label>
                            <p className="text-xs text-gray-500">Create multiple options (size, color, etc.)</p>
                          </div>
                          <Switch
                            id="variants"
                            checked={productForm.watch('hasVariants')}
                            onCheckedChange={(checked) => productForm.setValue('hasVariants', checked)}
                          />
                        </div>

                        {productForm.watch('hasVariants') && (
                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button variant="outline" type="button" className="w-full">
                                Configure Product Variants
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent className="p-4">
                              <div className="text-center pb-4 pt-2">
                                <h3 className="text-lg font-semibold">Product Variants</h3>
                                <p className="text-sm text-gray-500">Coming soon</p>
                              </div>
                            </DrawerContent>
                          </Drawer>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-red-500 hover:bg-red-600 text-white" 
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Product
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="reel" className="flex-1 overflow-auto px-4 pb-20">
              <form onSubmit={handleSubmitReel} className="space-y-6 py-2">
                {/* Video Upload Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reel Video</label>
                  
                  <div className="flex flex-col items-center">
                    {reelVideoUrl ? (
                      <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-md overflow-hidden bg-gray-100 mb-2 mx-auto">
                        <video 
                          src={reelVideoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full"
                          onClick={() => {
                            URL.revokeObjectURL(reelVideoUrl);
                            setReelVideo(null);
                            setReelVideoUrl("");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full max-w-[300px] aspect-[9/16] rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors mx-auto">
                        <Film className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload a video</span>
                        <span className="text-xs text-gray-400 mt-1">MP4, MOV, or WebM format</span>
                        <input 
                          type="file" 
                          accept="video/mp4,video/quicktime,video/webm" 
                          onChange={handleVideoUpload} 
                          className="sr-only"
                        />
                      </label>
                    )}
                  </div>
                </div>
                
                {/* Reel Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reelTitle" className="text-sm font-medium">Title</label>
                    <Input
                      id="reelTitle"
                      value={reelTitle}
                      onChange={(e) => setReelTitle(e.target.value)}
                      placeholder="Enter reel title"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="reelDescription" className="text-sm font-medium">Description</label>
                    <Textarea
                      id="reelDescription"
                      value={reelDescription}
                      onChange={(e) => setReelDescription(e.target.value)}
                      placeholder="Add a description..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <TagsInput 
                    tags={reelTags} 
                    removeTagFn={removeTag(reelTags, setReelTags)}
                    category={reelCategory}
                    setCategory={(value: string) => setReelCategory(value)}
                  />
                </div>
                
                <AdvancedOptionsButton />
                
                <AnimatePresence>
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border rounded-md p-4 space-y-4 mt-2 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="searchable" className="text-sm font-medium">Searchable</label>
                            <p className="text-xs text-gray-500">Allow this reel to appear in search results</p>
                          </div>
                          <Switch id="searchable" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="comments" className="text-sm font-medium">Allow Comments</label>
                            <p className="text-xs text-gray-500">Let viewers comment on your reel</p>
                          </div>
                          <Switch id="comments" defaultChecked />
                        </div>
                        
                        <div>
                          <label htmlFor="visibility" className="text-sm font-medium block mb-1">Visibility</label>
                          <Select defaultValue="public">
                            <SelectTrigger id="visibility">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="followers">Followers Only</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-red-500 hover:bg-red-600 text-white" 
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Reel
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="post" className="flex-1 overflow-auto px-4 pb-20">
              <form onSubmit={handleSubmitPost} className="space-y-6 py-2">
                {/* Image Upload Section */}
                <ProductImageUploader />
                
                {/* Post Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="postTitle" className="text-sm font-medium">Title</label>
                    <Input
                      id="postTitle"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Enter post title"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="postContent" className="text-sm font-medium">Content</label>
                    <Textarea
                      id="postContent"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Write your post content..."
                      className="mt-1"
                      rows={6}
                      required
                    />
                  </div>
                  
                  <TagsInput 
                    tags={postTags} 
                    removeTagFn={removeTag(postTags, setPostTags)}
                    category={postCategory}
                    setCategory={(value: string) => setPostCategory(value)}
                  />
                </div>
                
                <AdvancedOptionsButton />
                
                <AnimatePresence>
                  {showAdvancedOptions && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border rounded-md p-4 space-y-4 mt-2 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="featured" className="text-sm font-medium">Featured Post</label>
                            <p className="text-xs text-gray-500">Show this post on the featured section</p>
                          </div>
                          <Switch id="featured" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label htmlFor="post-comments" className="text-sm font-medium">Allow Comments</label>
                            <p className="text-xs text-gray-500">Let users comment on your post</p>
                          </div>
                          <Switch id="post-comments" defaultChecked />
                        </div>
                        
                        <div>
                          <label htmlFor="post-visibility" className="text-sm font-medium block mb-1">Visibility</label>
                          <Select defaultValue="public">
                            <SelectTrigger id="post-visibility">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="followers">Followers Only</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-red-500 hover:bg-red-600 text-white" 
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Uploading...
                      </span>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Post
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            {/* Content Type Switcher Tabs - Fixed at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t z-10">
              <TabsList className="grid grid-cols-3 w-full rounded-none h-14">
                <TabsTrigger value="product" className="flex items-center justify-center gap-1.5 h-full">
                  <Camera className="h-4 w-4" />
                  <span className="font-medium">Product</span>
                </TabsTrigger>
                <TabsTrigger value="reel" className="flex items-center justify-center gap-1.5 h-full">
                  <Film className="h-4 w-4" />
                  <span className="font-medium">Reel</span>
                </TabsTrigger>
                <TabsTrigger value="post" className="flex items-center justify-center gap-1.5 h-full">
                  <Image className="h-4 w-4" />
                  <span className="font-medium">Post</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
