import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { updateProduct, type Product } from '@/integrations/supabase/products';
import { useProduct } from '@/hooks/useProduct';
import { toast } from 'sonner';
import VariantsEditPage, { type Variant } from '@/components/seller/ProductEditSteps/NewVariantsEditPage';

const ProductEditNewVariantPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, refetch } = useProduct(productId || '');
  const [isUpdating, setIsUpdating] = useState(false);

  console.log('ProductEditNewVariantPage - productId:', productId, 'URL:', window.location.pathname);

  // Initialize with a new variant
  const [formData, setFormData] = useState({
    variants: [{
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
    }] as Variant[],
  });

  useEffect(() => {
    if (product && Array.isArray(product.storage_variants)) {
      console.log('ProductEditNewVariantPage - Product loaded, setting storage variants');
      setFormData(prev => ({
        ...prev,
        storage_variants: product.storage_variants || []
      }));
    }
  }, [product?.id]); // Only depend on product.id to avoid infinite re-renders

  const handleInputChange = (field: string, value: any) => {
    console.log('ProductEditNewVariantPage - Input change:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!product || !formData.variants[0]) {
      toast.error('Please fill in variant information');
      return;
    }

    const newVariant = formData.variants[0];
    if (!newVariant.name || !newVariant.name.trim()) {
      toast.error('Please enter a variant name');
      return;
    }

    setIsUpdating(true);

    try {
      // Add new variant to the product's variants array
      const existingVariants = Array.isArray(product.variants) ? product.variants : [];
      
      const variantToAdd = {
        id: newVariant.id,
        name: newVariant.name,
        price: newVariant.price || 0,
        stock: newVariant.stock || 0,
        image: newVariant.image,
        bestseller: newVariant.bestseller || false,
        limited: newVariant.limited || false,
        active: true,
        product_images: newVariant.product_images || [],
        product_videos: newVariant.product_videos || []
      };
      
      const updatedVariants = [...existingVariants, variantToAdd];
      
      const updateData: Partial<Product> = {
        variants: updatedVariants
      };
      
      await updateProduct(product.id, updateData);
      await refetch();
      
      toast.success('New variant added successfully');
      navigate(`/product/${productId}/edit/variants`);
    } catch (error) {
      console.error('Error adding variant:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add variant');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Product not found</p>
            <button
              onClick={() => navigate(`/product/${productId}/edit/variants`)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Variants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-[9999] flex flex-col h-screen">
      {/* Header */}
      <div className="bg-background p-4 border-b border-border">
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => navigate(`/product/${productId}/edit/variants`)}
            className="absolute left-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">Add New Variant</h1>
            <p className="text-sm text-muted-foreground">Create a new color variant</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="absolute right-0 px-3 py-1 text-sm font-medium text-primary hover:text-primary/80 disabled:text-muted-foreground transition-colors border border-primary hover:border-primary/80 disabled:border-muted-foreground rounded-md flex items-center gap-1"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                Creating...
              </>
            ) : (
              <>
                <Check className="h-3 w-3" />
                Create
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <VariantsEditPage
          formData={formData}
          onInputChange={handleInputChange}
        />
      </div>

      {/* Bottom Action */}
      <div className="bg-background border-t border-border p-4">
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors flex items-center justify-center gap-2"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating Variant...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Create Variant
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductEditNewVariantPage;