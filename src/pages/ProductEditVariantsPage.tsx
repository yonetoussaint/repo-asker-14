import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { Product, updateProduct } from '@/integrations/supabase/products';
import { useProduct } from '@/hooks/useProduct';
import { toast } from 'sonner';
import VariantsList from '@/components/seller/ProductEditSteps/NewVariantsList';

const ProductEditVariantsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, refetch } = useProduct(productId || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    variants: []
  });

  useEffect(() => {
    if (product) {
      setFormData({
        variants: product.variants || []
      });
    }
  }, [product?.id, product?.variants]); // Add product.variants to dependency array

  // Auto-save function for variant changes - disabled to prevent conflicts with child component
  const autoSaveVariants = useCallback(async () => {
    // Disabled: The NewVariantsList component handles its own saves
    console.log('Auto-save disabled - child component manages variants');
    return;
  }, []);

  // Make auto-save available globally for the editor (but disabled)
  useEffect(() => {
    (window as any).triggerVariantSave = autoSaveVariants;
    return () => {
      delete (window as any).triggerVariantSave;
    };
  }, [autoSaveVariants]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteColor = async (colorId: string) => {
    const updated = (formData.variants as any[]).filter(variant => variant.id !== colorId);
    setFormData(prev => ({
      ...prev,
      variants: updated
    }));

    if (!product?.id) return;
    try {
      await updateProduct(product.id, {
        variants: updated as any,
      });
      toast.success('Variant deleted');
      await refetch();
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete variant');
    }
  };

  const handleToggleActive = async (colorId: string, active: boolean) => {
    const updated = (formData.variants as any[]).map(variant => 
      variant.id === colorId ? { ...variant, active } : variant
    );

    setFormData(prev => ({
      ...prev,
      variants: updated
    }));

    if (!product?.id) return;
    try {
      await updateProduct(product.id, {
        variants: updated as any,
      });
      toast.success(`Variant ${active ? 'shown' : 'hidden'} successfully`);
      await refetch();
    } catch (e) {
      console.error(e);
      toast.error('Failed to update variant visibility');
    }
  };

  const handleSubmit = async () => {
    if (!product) return;

    setIsUpdating(true);

    try {
      const updateData: Partial<Product> = {
        variants: formData.variants
      };

      await updateProduct(product.id, updateData);
      await refetch();

      toast.success('Product variants updated successfully');
      navigate(`/product/${productId}/edit`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product variants');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Product not found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => navigate(`/product/${productId}/edit`)}
            className="absolute left-0 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">Product Variants</h1>
            <p className="text-sm text-gray-600">Manage color and storage options</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        <VariantsList 
          variants={formData.variants || []} 
          productId={productId} 
          onDeleteVariant={handleDeleteColor}
          onToggleActive={handleToggleActive}
        />
      </div>
    </div>
  );
};

export default ProductEditVariantsPage;