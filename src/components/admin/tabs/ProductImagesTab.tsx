
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import { fetchAllProducts, Product } from "@/integrations/supabase/products";
import ImageUploadDialog from "@/components/admin/dialogs/ImageUploadDialog";
import ImageEditDialog from "@/components/admin/dialogs/ImageEditDialog";

const ProductImagesTab: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  
  // Fetch products
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['adminProductImages'],
    queryFn: fetchAllProducts,
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleUploadClick = () => {
    if (!selectedProduct) return;
    setIsUploadDialogOpen(true);
  };

  const handleEditImage = (image: any) => {
    setEditingImage(image);
    setIsEditDialogOpen(true);
  };

  const handleDeleteImage = async (imageId: string, imagePath: string) => {
    try {
      const url = new URL(imagePath);
      const pathname = url.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1);

      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        throw dbError;
      }

      try {
        await supabase.storage
          .from('product-images')
          .remove([filename]);
      } catch (storageError) {
        console.warn('Could not delete from storage:', storageError);
      }

      toast.success("Image deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("There was an error deleting the image.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
        <div className="h-64 w-full bg-muted animate-pulse rounded-md"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-red-500">Error loading products</p>
          <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Products List */}
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <div className="p-2">
            <Input
              placeholder="Search products..."
              className="mb-2"
            />
          </div>
          <div className="h-[calc(100vh-240px)] overflow-auto">
            <ul className="divide-y">
              {products.map((product) => (
                <li 
                  key={product.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedProduct?.id === product.id ? 'bg-gray-50' : ''}`}
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500 truncate">{product.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {product.product_images?.length || 0} images
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
      
      {/* Images Display */}
      <div className="md:col-span-2">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{selectedProduct ? `${selectedProduct.name} Images` : 'Select a Product'}</CardTitle>
            {selectedProduct && (
              <Button onClick={handleUploadClick}>
                Add Image
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {selectedProduct ? (
              selectedProduct.product_images && selectedProduct.product_images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProduct.product_images.map((image) => (
                    <div key={image.id} className="border rounded-lg overflow-hidden bg-white">
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={image.src} 
                          alt={image.alt} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm truncate mb-3">{image.alt}</p>
                        <div className="flex justify-between">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditImage(image)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Alt
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteImage(image.id, image.src)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-white">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-1">No images found for this product</p>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={handleUploadClick}
                    className="mt-2"
                  >
                    Upload First Image
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center py-12 border rounded-lg bg-white">
                <p className="text-gray-600">Select a product to manage its images</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Upload Dialog */}
      <ImageUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
        selectedProduct={selectedProduct}
        onSuccess={() => refetch()}
      />
      
      {/* Edit Dialog */}
      <ImageEditDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        image={editingImage}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default ProductImagesTab;
