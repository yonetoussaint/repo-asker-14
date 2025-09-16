import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Check } from 'lucide-react';
import { Product, updateProduct } from '@/integrations/supabase/products';
import { useSeller } from '@/hooks/useSeller';
import { useProduct } from '@/hooks/useProduct';
import { toast } from 'sonner';
import { BasicInfoStep, DescriptionStep, MediaStep, DetailsStep, CategoryStep, ShippingStep, FlashDealsStep, SpecificationsStep, VariantsStep } from '@/components/seller/ProductEditSteps';

const ProductEditPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading: productLoading, error, refetch } = useProduct(productId || '');

  // Force refetch on mount to ensure fresh data
  useEffect(() => {
    if (productId && !productLoading) {
      refetch();
    }
  }, [productId, refetch, productLoading]);

  // Debug logging
  console.log('ProductEditPage - productId from URL:', productId);
  console.log('ProductEditPage - product data:', product);
  console.log('ProductEditPage - loading state:', productLoading);
  console.log('ProductEditPage - error:', error);
  const [currentStep, setCurrentStep] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    inventory: '',
    tags: [] as string[],
    status: 'active',
    bundle_deals: [] as any[],
    bundle_deals_enabled: false,
    category: '',
    subcategory: '',
    type: 'single',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    shipping_cost: '',
    free_shipping: false,
    shipping_time: '',
    flash_deal: false,
    flash_start_time: '',
    flash_end_time: '',
    flash_discount: '',
    specifications: [],
    model_3d_url: '',
    variants: []
  });

  const totalSteps = 9;

  const stepConfig = {
    0: {
      title: 'Basic Information',
      subtitle: 'Enter essential product details'
    },
    1: {
      title: 'Product Description',
      subtitle: 'Provide detailed product description'
    },
    2: {
      title: 'Category & Type',
      subtitle: 'Choose product category and type'
    },
    3: {
      title: 'Media',
      subtitle: 'Upload images and videos'
    },
    4: {
      title: 'Shipping',
      subtitle: 'Configure shipping details'
    },
    5: {
      title: 'Flash Deals',
      subtitle: 'Set up promotional offers'
    },
    6: {
      title: 'Specifications',
      subtitle: 'Add detailed product specifications'
    },
    7: {
      title: 'Color Variants',
      subtitle: 'Configure color options for variable products'
    },
    8: {
      title: 'Details & Bundles',
      subtitle: 'Add tags and configure deals'
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        discount_price: product.discount_price?.toString() || '',
        inventory: product.inventory?.toString() || '',
        tags: product.tags || [],
        status: product.status || 'active',
        bundle_deals: product.bundle_deals || [],
        bundle_deals_enabled: product.bundle_deals_enabled ?? false,
        category: '',
        subcategory: '',
        type: product.product_type || 'single',
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: ''
        },
        shipping_cost: '',
        free_shipping: false,
        shipping_time: '',
        flash_deal: product.flash_deal || false,
        flash_start_time: product.flash_start_time || '',
        flash_end_time: '',
        flash_discount: '',
        specifications: product.specifications || [],
        model_3d_url: product.model_3d_url || '',
        variants: (product as any).variants || []
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Basic Info
        return !!(formData.name && formData.price && formData.inventory);
      case 1: // Description
        return !!(formData.description);
      case 2: // Category  
        return !!(formData.type); // Only require type, category can be optional
      case 3: // Media
        return true; // Media is optional
      case 4: // Shipping
        return true; // Shipping is optional
      case 5: // Flash Deals
        return true; // Flash deals are optional
      case 6: // Specifications
        return true; // Specifications are optional
      case 7: // Color Variants
        return true; // Color variants are optional
      case 8: // Details
        return true; // Details are optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!product) return;

    setIsUpdating(true);

    try {
      const updateData: Partial<Product> = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        inventory: parseInt(formData.inventory),
        tags: formData.tags,
        status: formData.status,
        bundle_deals: formData.bundle_deals,
        bundle_deals_enabled: formData.bundle_deals_enabled,
        product_type: formData.type,
        flash_deal: formData.flash_deal,
        flash_start_time: formData.flash_start_time || null,
        specifications: formData.specifications,
        model_3d_url: formData.model_3d_url || null,
        variants: formData.variants
      };

      await updateProduct(product.id, updateData);

      toast.success('Product updated successfully');
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsUpdating(false);
    }
  };

  const ProgressBar = () => {
    return (
      <div className="flex gap-2 mt-3">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep + 1;

          return (
            <div
              key={stepNumber}
              className={`
                flex-1 h-1 rounded-full transition-colors duration-300
                ${isActive ? 'bg-orange-500' : 'bg-gray-200'}
              `}
            />
          );
        })}
      </div>
    );
  };

  const renderCurrentStep = () => {
    if (!product) return null;

    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={{
              name: formData.name,
              price: formData.price,
              discount_price: formData.discount_price,
              inventory: formData.inventory,
              status: formData.status
            }}
            onInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <DescriptionStep
            formData={{
              description: formData.description
            }}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <CategoryStep
            formData={{
              category: formData.category,
              subcategory: formData.subcategory,
              type: formData.type
            }}
            onInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <MediaStep
            product={product}
            uploadingImages={uploadingImages}
            uploadingVideos={uploadingVideos}
            setUploadingImages={setUploadingImages}
            setUploadingVideos={setUploadingVideos}
            onSuccess={() => window.location.reload()} // Refresh product data
            formData={{ model_3d_url: formData.model_3d_url }}
            onInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <ShippingStep
            formData={{
              weight: formData.weight,
              dimensions: formData.dimensions,
              shipping_cost: formData.shipping_cost,
              free_shipping: formData.free_shipping,
              shipping_time: formData.shipping_time
            }}
            onInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <FlashDealsStep
            formData={{
              flash_deal: formData.flash_deal,
              flash_start_time: formData.flash_start_time,
              flash_end_time: formData.flash_end_time,
              flash_discount: formData.flash_discount
            }}
            onInputChange={handleInputChange}
          />
        );
      case 6:
        return (
          <SpecificationsStep
            formData={{
              specifications: formData.specifications
            }}
            onInputChange={handleInputChange}
          />
        );
      case 7:
        return (
          <VariantsStep
            formData={{
              variants: formData.variants
            }}
            onInputChange={handleInputChange}
          />
        );
      case 8:
        return (
          <DetailsStep
            formData={{
              tags: formData.tags,
              bundle_deals: formData.bundle_deals,
              bundle_deals_enabled: formData.bundle_deals_enabled
            }}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  if (productLoading) {
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

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white p-3 border-b border-gray-100">
        <div className="relative flex items-center justify-center">
          <button
            onClick={isFirstStep ? () => navigate(-1) : handlePrevious}
            className="absolute left-0 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isFirstStep ? (
              <X className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Edit Product
          </h1>
          <button
            onClick={handleSubmit}
            disabled={isUpdating || !validateCurrentStep()}
            className="absolute right-0 px-3 py-1 text-sm font-medium text-orange-600 hover:text-orange-700 disabled:text-gray-400 transition-colors border border-orange-600 hover:border-orange-700 disabled:border-gray-400 rounded-md"
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
        <ProgressBar />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderCurrentStep()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex gap-3">
          {!isFirstStep && (
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Previous
            </button>
          )}
          
          {!isLastStep ? (
            <button
              onClick={handleNext}
              disabled={!validateCurrentStep()}
              className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isUpdating || !validateCurrentStep()}
              className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;