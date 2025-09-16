import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { Product, updateProduct } from '@/integrations/supabase/products';
import { useProduct } from '@/hooks/useProduct';
import { toast } from 'sonner';
import { FlashDealsStep } from '@/components/seller/ProductEditSteps';

const ProductEditDealsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, refetch } = useProduct(productId || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    flash_deal: false,
    flash_start_time: '',
    flash_end_time: '',
    flash_discount: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        flash_deal: product.flash_deal || false,
        flash_start_time: product.flash_start_time || '',
        flash_end_time: '',
        flash_discount: ''
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!product) return;

    setIsUpdating(true);

    try {
      const updateData: Partial<Product> = {
        flash_deal: formData.flash_deal,
        flash_start_time: formData.flash_start_time || null
      };

      await updateProduct(product.id, updateData);
      await refetch();

      toast.success('Flash deals updated successfully');
      navigate(`/product/${productId}/edit`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update flash deals');
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
            <h1 className="text-lg font-semibold text-gray-900">Flash Deals</h1>
            <p className="text-sm text-gray-600">Promotional offers and discounts</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="absolute right-0 px-3 py-1 text-sm font-medium text-orange-600 hover:text-orange-700 disabled:text-gray-400 transition-colors border border-orange-600 hover:border-orange-700 disabled:border-gray-400 rounded-md flex items-center gap-1"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                Updating...
              </>
            ) : (
              <>
                <Check className="h-3 w-3" />
                Update
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <FlashDealsStep
          formData={formData}
          onInputChange={handleInputChange}
        />
      </div>

      {/* Bottom Action */}
      <div className="bg-white border-t border-gray-100 p-4">
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex items-center justify-center gap-2"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Updating Flash Deals...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Update Flash Deals
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductEditDealsPage;