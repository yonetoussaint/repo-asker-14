import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { Product, updateProduct } from '@/integrations/supabase/products';
import { toast } from 'sonner';
import { BasicInfoStep, DescriptionStep, MediaStep, DetailsStep } from './ProductEditSteps';
import { SpecificationsStep } from './ProductEditSteps/SpecificationsStep';
import DescriptionEditor from './ProductEditSteps/DescriptionEditor';

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export const ProductEditDialog: React.FC<ProductEditDialogProps> = ({
  open,
  onOpenChange,
  product,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(0);
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
    specifications: [] as any[]
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [showDescriptionEditor, setShowDescriptionEditor] = useState(false);

  const totalSteps = 5;

  useEffect(() => {
    if (product && open) {
      setCurrentStep(0);
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
        specifications: product.specifications || []
      });
    }
  }, [product, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDescription = (description: string) => {
    console.log('🔍 DEBUG: Saving description:', description);
    handleInputChange('description', description);
    setShowDescriptionEditor(false);
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

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Basic Info
        return !!(formData.name && formData.price && formData.inventory);
      case 1: // Description
        return !!(formData.description);
      case 2: // Media
        return true; // Media is optional
      case 3: // Details
        return true; // Details are optional
      case 4: // Specifications
        return true; // Specifications are optional
      default:
        return true;
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
        specifications: formData.specifications
      };

      console.log('🔍 DEBUG: Updating product with data:', updateData);
      console.log('🔍 DEBUG: Description being saved:', formData.description);

      await updateProduct(product.id, updateData);

      toast.success('Product updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderCurrentStep = () => {
    if (!product) return null;

    if (showDescriptionEditor) {
      return (
        <DescriptionEditor
          initialDescription={formData.description}
          onSave={handleSaveDescription}
          onCancel={() => setShowDescriptionEditor(false)}
        />
      );
    }

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
          <MediaStep
            product={product}
            uploadingImages={uploadingImages}
            uploadingVideos={uploadingVideos}
            setUploadingImages={setUploadingImages}
            setUploadingVideos={setUploadingVideos}
            onSuccess={onSuccess}
          />
        );
      case 3:
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
      case 4:
        return (
          <SpecificationsStep
            formData={{
              specifications: formData.specifications
            }}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!showDescriptionEditor && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Product
            </DialogTitle>
          </DialogHeader>
        )}

        <div className="space-y-6">
          {/* Current Step Content */}
          <div className="min-h-[400px]">
            {renderCurrentStep()}
          </div>

          {/* Action Buttons - Only show when not in description editor */}
          {!showDescriptionEditor && (
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {currentStep === totalSteps - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isUpdating || !validateCurrentStep()}
                  className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors flex items-center justify-center gap-2"
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
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!validateCurrentStep()}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};