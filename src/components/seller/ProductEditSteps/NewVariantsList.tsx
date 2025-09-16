import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useVariantTemplates } from '@/hooks/useVariantTemplates';

// Import refactored components
import { useCurrency } from '@/contexts/CurrencyContext';
import * as variantUtils from './variants/utils/variantUtils';
import { Button } from '@/components/ui/button';
import {
  CurrencySelector,
  EditForm,
  EditVariantTypeForm,
  EmptyState,
  SearchBar,
  SimpleTabModal,
  TemplateSelector,
  VariantCard,
  VariantSummaryCard,
  VariantTabs
} from './variants/components';

export default function VariantsList({ variants: initialVariants = [], productId, onDeleteVariant, onToggleActive }) {
  const { data: templates = {}, isLoading: templatesLoading } = useVariantTemplates();
  
  // Template state
  const [activeTemplate, setActiveTemplate] = useState('smartphone');
  const currentTemplate = templates[activeTemplate];

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditVariantTypeForm, setShowEditVariantTypeForm] = useState(false);
  const [editingVariantType, setEditingVariantType] = useState(null);
  const [activeVariantFilter, setActiveVariantFilter] = useState(null);
  const [newVariantName, setNewVariantName] = useState('');
  const [showSimpleTabForm, setShowSimpleTabForm] = useState(false);
  const [simpleTabName, setSimpleTabName] = useState('');

  // Currency hook from global context
  const {
    currentCurrency,
    setCurrency,
    formatPrice,
    convertPrice
  } = useCurrency();

  // Template-specific data initialization based on fetched templates
  const initializeTemplateData = useMemo(() => {
    if (!templates || Object.keys(templates).length === 0) return {};
    
    const data = {};
    Object.keys(templates).forEach(templateId => {
      const template = templates[templateId];
      data[templateId] = {
        customVariantNames: [], // Start empty for existing products, will be populated from database
        customOptions: {},
        variants: [],
        variantTypeImages: {}
      };
      
      // Initialize custom options from template variant fields
      template.variantFields?.forEach((field, index) => {
        data[templateId].customOptions[field.key] = [...field.options];
      });
      
      // Only initialize default variants if there's no productId (new product)
      if (!productId && template.defaultVariantNames) {
        data[templateId].customVariantNames = template.defaultVariantNames;
        template.defaultVariantNames.forEach((variant, index) => {
          data[templateId].variants.push({
            id: variant.id || index + 1,
            variantNameId: variant.id || index + 1,
            name: variant.name,
            price: variant.price || 0,
            stock: variant.stock || 0,
            isActive: true,
            sku: '',
            fields: {}
          });
        });
      }
    });
    
    return data;
  }, [templates, productId]);

  // Fetch product data to get existing variant names
  const [product, setProduct] = React.useState(null);
  const [productLoading, setProductLoading] = React.useState(!!productId);
  
  React.useEffect(() => {
    if (productId) {
      setProductLoading(true);
      import('@/integrations/supabase/products').then(({ fetchProductById }) => {
        fetchProductById(productId)
          .then(productData => {
            setProduct(productData);
            setProductLoading(false);
          })
          .catch(error => {
            console.error('Failed to fetch product:', error);
            setProductLoading(false);
          });
      });
    } else {
      setProductLoading(false);
    }
  }, [productId]);

  const [templateData, setTemplateData] = useState({});

  // Initialize template data when both templates and product are loaded
  useEffect(() => {
    if (templatesLoading || (productId && productLoading)) return;
    
    if (Object.keys(templates).length > 0) {
      const data = {};
      Object.keys(templates).forEach(templateId => {
        const template = templates[templateId];
        data[templateId] = {
          customVariantNames: [],
          customOptions: {},
          variants: [],
          variantTypeImages: {}
        };
        
        // Initialize custom options from template variant fields
        template.variantFields?.forEach((field, index) => {
          data[templateId].customOptions[field.key] = [...field.options];
        });
        
        // For existing products, use variant_names from database
        if (productId && product?.variant_names) {
          console.log('Loading variant_names with images from database:', product.variant_names);
          data[templateId].customVariantNames = product.variant_names;
        } else if (!productId && template.defaultVariantNames) {
          // Only initialize default variants for new products
          data[templateId].customVariantNames = template.defaultVariantNames;
        }
        
        // Load existing variants from database (they come from product.variants which maps to color_variants)
        if (productId && product?.variants && Array.isArray(product.variants)) {
          console.log('Loading existing variants from database:', product.variants);
          data[templateId].variants = product.variants.map(variant => ({
            id: variant.id,
            variantNameId: variant.variantNameId || variant.id,
            name: variant.name || '',
            price: variant.price || 0,
            stock: variant.stock || 0,
            isActive: variant.active !== false,
            sku: variant.sku || '',
            image: variant.image || null,
            // Map template-specific fields
            storage: variant.storage || '',
            networkStatus: variant.networkStatus || '',
            productGrade: variant.productGrade || '',
            // Generic field mapping for other templates
            ...Object.fromEntries(
              template.variantFields?.map(field => [field.key, variant[field.key] || '']) || []
            )
          }));
          console.log('Mapped variants to template data:', data[templateId].variants);
        } else if (!productId && template.defaultVariantNames) {
          // Only initialize default variants for new products
          template.defaultVariantNames.forEach((variant, index) => {
            data[templateId].variants.push({
              id: variant.id || index + 1,
              variantNameId: variant.id || index + 1,
              name: variant.name,
              price: variant.price || 0,
              stock: variant.stock || 0,
              isActive: true,
              sku: '',
              fields: {}
            });
          });
        }
      });
      
      setTemplateData(data);
      console.log('Template data initialized:', data);
    }
  }, [templates, templatesLoading, product, productLoading, productId]);

  // Reset active variant filter when template changes
  useEffect(() => {
    setActiveVariantFilter(null);
    setSearchQuery('');
  }, [activeTemplate]);

  // Show all variant names as tabs, regardless of whether they have variants
  const availableVariants = useMemo(() => {
    return templateData[activeTemplate]?.customVariantNames || [];
  }, [templateData, activeTemplate]);

  // Auto-select the first variant when availableVariants changes
  useEffect(() => {
    if (availableVariants.length > 0 && activeVariantFilter === null) {
      setActiveVariantFilter(availableVariants[0].id.toString());
    }
  }, [availableVariants, activeVariantFilter]);

  // Show loading state while templates are loading or while product data is loading for existing products
  if (templatesLoading || (productId && productLoading)) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading variants...</p>
          </div>
        </div>
      </div>
    );
  }

  // Add safety checks for template data access
  if (!templateData[activeTemplate] || !currentTemplate) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing template...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get current template data
  const customVariantNames = templateData[activeTemplate]?.customVariantNames || [];
  const setCustomVariantNames = (newData) => {
    setTemplateData(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        customVariantNames: newData
      }
    }));
  };

  const variants = templateData[activeTemplate]?.variants || [];
  const setVariants = (newData) => {
    setTemplateData(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        variants: typeof newData === 'function' ? newData(prev[activeTemplate]?.variants || []) : newData
      }
    }));
  };

  const variantTypeImages = templateData[activeTemplate]?.variantTypeImages || {};
  const setVariantTypeImages = (newData) => {
    setTemplateData(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        variantTypeImages: typeof newData === 'function' ? newData(prev[activeTemplate]?.variantTypeImages || {}) : newData
      }
    }));
  };

  // Custom options getters and setters for current template
  const getCustomOptions = (fieldKey) => templateData[activeTemplate]?.customOptions?.[fieldKey] || [];
  const setCustomOptions = (fieldKey, newOptions) => {
    setTemplateData(prev => ({
      ...prev,
      [activeTemplate]: {
        ...prev[activeTemplate],
        customOptions: {
          ...prev[activeTemplate]?.customOptions,
          [fieldKey]: typeof newOptions === 'function' ? newOptions(prev[activeTemplate]?.customOptions?.[fieldKey] || []) : newOptions
        }
      }
    }));
  };

  // Utility function wrappers
  const getVariantName = (variantNameId) => variantUtils.getVariantName(variantNameId, customVariantNames);
  const generateSKU = (variantNameId, fields) => variantUtils.generateSKU(variantNameId, fields, currentTemplate, customVariantNames);
  const getDisplayName = (variant) => variantUtils.getDisplayName(variant, currentTemplate, customVariantNames);
  const getVariantMainImage = (variantNameId) => variantUtils.getVariantMainImage(variantNameId, variants, currentTemplate, product?.product_images, customVariantNames);
  const getVariantImages = (variantNameId) => variantUtils.getVariantImages(variantNameId, variants, variantTypeImages);
  const getSubvariantCount = (variantNameId) => variantUtils.getSubvariantCount(variantNameId, variants);
  const getVariantPriceRange = (variantNameId) => variantUtils.getVariantPriceRange(variantNameId, variants, customVariantNames, formatPrice);
  const getVariantTotalStock = (variantNameId) => variantUtils.getVariantTotalStock(variantNameId, variants, customVariantNames);

  const filteredVariants = variants.filter(variant => {
    const displayName = getDisplayName(variant);
    const variantName = getVariantName(variant.variantNameId);
    
    // Build search string from all variant fields
    const searchFields = currentTemplate.variantFields.map(field => variant[field.key] || '').join(' ');
    const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           variantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           searchFields.toLowerCase().includes(searchQuery.toLowerCase()) ||
           variant.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVariant = activeVariantFilter === null || 
                         variant.variantNameId === parseInt(activeVariantFilter);

    return matchesSearch && matchesVariant;
  });

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    setShowEditForm(true);
  };

  const handleEditVariantType = (variantNameId) => {
    setEditingVariantType(variantNameId);
    setShowEditVariantTypeForm(true);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleAddTab = () => {
    setSimpleTabName('');
    setShowSimpleTabForm(true);
  };

  const handleCreateFirstTab = () => {
    setSimpleTabName('');
    setShowSimpleTabForm(true);
  };

  const handleDelete = async (id) => {
    const updatedVariants = variants.filter(v => v.id !== id);
    setVariants(updatedVariants);

    // Save to database
    if (productId) {
      try {
        console.log('Saving sub variant deletion to database:', updatedVariants);
        const { updateProduct } = await import('@/integrations/supabase/products');
        await updateProduct(productId, {
          variants: updatedVariants  // This will be mapped to color_variants internally
        });
        
        // Trigger auto-save for global state if available
        if ((window as any).triggerVariantSave) {
          (window as any).triggerVariantSave();
        }
        console.log('Sub variant deleted and saved to database');
      } catch (error) {
        console.error('Failed to save sub variant deletion:', error);
      }
    }
  };

  const handleSaveEdit = async (updatedVariant) => {
    const originalVariant = variants.find(v => v.id === updatedVariant.id);
    let shouldRegenerateSKU = false;
    
    // Check if any key fields changed
    if (originalVariant.variantNameId !== updatedVariant.variantNameId) {
      shouldRegenerateSKU = true;
    }
    
    for (const field of currentTemplate.variantFields) {
      if (originalVariant[field.key] !== updatedVariant[field.key]) {
        shouldRegenerateSKU = true;
        break;
      }
    }

    if (shouldRegenerateSKU) {
      const fields = {};
      currentTemplate.variantFields.forEach(field => {
        fields[field.key] = updatedVariant[field.key];
      });
      updatedVariant.sku = generateSKU(updatedVariant.variantNameId, fields);
    }

    const updatedVariants = variants.map(v => v.id === updatedVariant.id ? updatedVariant : v);
    setVariants(updatedVariants);
    setShowEditForm(false);
    setEditingVariant(null);

    // Save to database
    if (productId) {
      try {
        console.log('Saving sub variant edit to database:', updatedVariant);
        const { updateProduct } = await import('@/integrations/supabase/products');
        await updateProduct(productId, {
          variants: updatedVariants  // This will be mapped to color_variants internally
        });
        
        // Trigger auto-save for global state if available
        if ((window as any).triggerVariantSave) {
          (window as any).triggerVariantSave();
        }
        
        // Refresh the product data to ensure UI is in sync with database
        const { fetchProductById } = await import('@/integrations/supabase/products');
        const refreshedProduct = await fetchProductById(productId);
        if (refreshedProduct?.variants) {
          setVariants(refreshedProduct.variants);
        }
        
        console.log('Sub variant edit saved to database and data refreshed');
      } catch (error) {
        console.error('Failed to save sub variant edit:', error);
      }
    }
  };

  const handleSaveNew = async (newVariant) => {
    const nextId = variants.length > 0 ? Math.max(...variants.map(v => v.id)) + 1 : 1;

    const fields = {};
    currentTemplate.variantFields.forEach(field => {
      fields[field.key] = newVariant[field.key];
    });
    newVariant.sku = generateSKU(newVariant.variantNameId, fields);

    const variantWithId = { ...newVariant, id: nextId };
    const updatedVariants = [...variants, variantWithId];
    setVariants(updatedVariants);
    setShowAddForm(false);

    // Save to database
    if (productId) {
      try {
        console.log('Saving new sub variant to database:', variantWithId);
        const { updateProduct } = await import('@/integrations/supabase/products');
        await updateProduct(productId, {
          variants: updatedVariants  // This will be mapped to color_variants internally
        });
        
        // Trigger auto-save for global state if available
        if ((window as any).triggerVariantSave) {
          (window as any).triggerVariantSave();
        }
        
        // Refresh the product data to ensure UI is in sync with database
        const { fetchProductById } = await import('@/integrations/supabase/products');
        const refreshedProduct = await fetchProductById(productId);
        if (refreshedProduct?.variants) {
          setVariants(refreshedProduct.variants);
        }
        
        console.log('New sub variant saved to database and data refreshed');
      } catch (error) {
        console.error('Failed to save new sub variant:', error);
      }
    }
  };

  const handleSaveVariantTypeEdit = async (variantNameId, newName, stock, price, imageData) => {
    if (newName.trim()) {
      const updatedVariantNames = customVariantNames.map(vn => 
        vn.id === variantNameId ? { 
          ...vn, 
          name: newName.trim(), 
          stock: stock !== undefined ? stock : vn.stock, 
          price: price !== undefined ? price : vn.price,
          // Add image data to variant names
          mainImage: imageData?.mainImage || vn.mainImage,
          additionalImages: imageData?.additionalImages || vn.additionalImages || []
        } : vn
      );
      
      setCustomVariantNames(updatedVariantNames);

      // Also update any variants that belong to this variant type with the main image
      if (imageData?.mainImage) {
        const updatedVariants = variants.map(variant => 
          variant.variantNameId === variantNameId 
            ? { ...variant, image: imageData.mainImage }
            : variant
        );
        setVariants(updatedVariants);
      }

      // Save to database
      if (productId) {
        try {
          console.log('Saving variant type with images:', {
            variantNameId,
            name: newName,
            imageData,
            updatedVariantNames
          });
          
          const { updateProduct } = await import('@/integrations/supabase/products');
          
          // Prepare the update data
          const updateData: any = {
            variant_names: updatedVariantNames
          };
          
          // If we have updated variants with images, save them too
          if (imageData?.mainImage) {
            const updatedVariants = variants.map(variant => 
              variant.variantNameId === variantNameId 
                ? { ...variant, image: imageData.mainImage }
                : variant
            );
            updateData.variants = updatedVariants;
          }
          
          await updateProduct(productId, updateData);
          
          console.log('Update data sent to database:', updateData);
          console.log('Variant type with images saved to database successfully');
        } catch (error) {
          console.error('Failed to save variant type with images:', error);
        }
      }

      setShowEditVariantTypeForm(false);
      setEditingVariantType(null);
    }
  };

  const handleSimpleTabCreate = async () => {
    if (simpleTabName.trim()) {
      const nextVariantNameId = customVariantNames.length > 0 ? Math.max(...customVariantNames.map(vn => vn.id)) + 1 : 1;
      const newVariantName = { id: nextVariantNameId, name: simpleTabName.trim(), stock: 0, price: 0 };
      const updatedVariantNames = [...customVariantNames, newVariantName];
      
      setCustomVariantNames(updatedVariantNames);

      // Save to database
      if (productId) {
        try {
          const { updateProduct } = await import('@/integrations/supabase/products');
          await updateProduct(productId, {
            variant_names: updatedVariantNames
          });
          console.log('Variant tab saved to database');
          
          // Trigger auto-save for global state
          if ((window as any).triggerVariantSave) {
            (window as any).triggerVariantSave();
          }
        } catch (error) {
          console.error('Failed to save variant tab:', error);
        }
      }

      setActiveVariantFilter(nextVariantNameId.toString());
      setShowSimpleTabForm(false);
      setSimpleTabName('');
    }
  };

  const handleDeleteVariantType = async (variantNameId) => {
    const variantName = getVariantName(variantNameId);
    const variantCount = getSubvariantCount(variantNameId);

    if (confirm(`Are you sure you want to delete "${variantName}" and all ${variantCount} of its variants? This action cannot be undone.`)) {
      const updatedVariants = variants.filter(v => v.variantNameId !== variantNameId);
      const updatedVariantNames = customVariantNames.filter(vn => vn.id !== variantNameId);

      setVariants(updatedVariants);
      setCustomVariantNames(updatedVariantNames);

      if (activeVariantFilter === variantNameId.toString()) {
        setActiveVariantFilter(null);
      }

      // Persist changes to database
      if (productId) {
        try {
          const { updateProduct } = await import('@/integrations/supabase/products');
          await updateProduct(productId, {
            variant_names: updatedVariantNames,
            variants: updatedVariants,
          });
          // Trigger auto-save for global state if available
          if ((window as any).triggerVariantSave) {
            (window as any).triggerVariantSave();
          }
          console.log('Variant tab deleted and saved to database');
        } catch (error) {
          console.error('Failed to persist variant tab deletion:', error);
        }
      }
    }
  };

  const handleUpdateVariantPrice = async (variantNameId, price) => {
    const updatedVariantNames = customVariantNames.map(vn => 
      vn.id === variantNameId ? { ...vn, price } : vn
    );
    
    setCustomVariantNames(updatedVariantNames);

    // Save to database
    if (productId) {
      try {
        const { updateProduct } = await import('@/integrations/supabase/products');
        await updateProduct(productId, {
          variant_names: updatedVariantNames
        });
        
        // Trigger auto-save for global state if available
        if ((window as any).triggerVariantSave) {
          (window as any).triggerVariantSave();
        }
        console.log('Variant price updated in database');
      } catch (error) {
        console.error('Failed to update variant price:', error);
        throw error;
      }
    }
  };

  // Show empty state when no variant names exist
  if (customVariantNames.length === 0) {
    return (
      <>
        <EmptyState
          templates={templates}
          activeTemplate={activeTemplate}
          onTemplateChange={setActiveTemplate}
          selectedCurrency={currentCurrency}
          onCurrencyChange={setCurrency}
          loadingRates={false}
          onCreateFirstTab={handleCreateFirstTab}
        />
        
        <SimpleTabModal
          isVisible={showSimpleTabForm}
          tabName={simpleTabName}
          onTabNameChange={setSimpleTabName}
          onCreateTab={handleSimpleTabCreate}
          onCancel={() => {
            setShowSimpleTabForm(false);
            setSimpleTabName('');
          }}
          isEmptyState={true}
        />
      </>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Template Switcher and Currency */}
      <div className="p-4">
        <div className="flex justify-between items-center gap-4 mb-4">
          <TemplateSelector
            activeTemplate={activeTemplate}
            onTemplateChange={setActiveTemplate}
            templates={templates}
          />
          <CurrencySelector
            selectedCurrency={currentCurrency}
            onCurrencyChange={setCurrency}
            loadingRates={false}
          />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {/* Variant Tabs */}
        <VariantTabs
          availableVariants={availableVariants}
          activeVariantFilter={activeVariantFilter}
          onVariantFilterChange={setActiveVariantFilter}
          onAddTab={handleAddTab}
        />

        {/* Variant Summary Card */}
        <VariantSummaryCard
          activeVariantFilter={activeVariantFilter}
          availableVariants={availableVariants}
          getVariantMainImage={getVariantMainImage}
          getVariantName={getVariantName}
          getSubvariantCount={getSubvariantCount}
          getVariantPriceRange={getVariantPriceRange}
          getVariantTotalStock={getVariantTotalStock}
          onEditVariantType={handleEditVariantType}
          onDeleteVariantType={handleDeleteVariantType}
          onUpdateVariantPrice={handleUpdateVariantPrice}
          productId={productId}
        />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        {/* Variants List */}
        <div className="space-y-3 mb-6">
          {filteredVariants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'No variants match your search.' : 
                 activeVariantFilter ? 'No variants in this tab yet.' : 
                 'No variants match your filters.'}
              </p>
            </div>
          ) : (
            filteredVariants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                currentTemplate={currentTemplate}
                getDisplayName={getDisplayName}
                formatPrice={formatPrice}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Add New Variant Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50">
          <div className="max-w-md mx-auto px-4 py-2">
            <Button className="w-full" variant="outline" onClick={handleAdd}>
              Add New Variant
            </Button>
          </div>
        </div>

        {/* Modals */}
        {showEditForm && editingVariant && (
          <EditForm
            variant={editingVariant}
            onSave={handleSaveEdit}
            onClose={() => setShowEditForm(false)}
            currentTemplate={currentTemplate}
            customVariantNames={customVariantNames}
            setCustomVariantNames={setCustomVariantNames}
            getCustomOptions={getCustomOptions}
            setCustomOptions={setCustomOptions}
            activeVariantFilter={activeVariantFilter}
            generateSKU={generateSKU}
          />
        )}

        {showAddForm && (
          <EditForm
            variant={null}
            onSave={handleSaveNew}
            onClose={() => setShowAddForm(false)}
            isNew={true}
            defaultVariantId={activeVariantFilter ? parseInt(activeVariantFilter) : null}
            currentTemplate={currentTemplate}
            customVariantNames={customVariantNames}
            setCustomVariantNames={setCustomVariantNames}
            getCustomOptions={getCustomOptions}
            setCustomOptions={setCustomOptions}
            activeVariantFilter={activeVariantFilter}
            generateSKU={generateSKU}
          />
        )}

        {showEditVariantTypeForm && editingVariantType && (
          <EditVariantTypeForm
            variantNameId={editingVariantType}
            onSave={handleSaveVariantTypeEdit}
            onClose={() => setShowEditVariantTypeForm(false)}
            getVariantName={getVariantName}
            getVariantMainImage={getVariantMainImage}
            variants={variants}
            customVariantNames={customVariantNames}
            variantTypeImages={variantTypeImages}
            setVariants={setVariants}
            setVariantTypeImages={setVariantTypeImages}
            formatPrice={formatPrice}
          />
        )}

        <SimpleTabModal
          isVisible={showSimpleTabForm}
          tabName={simpleTabName}
          onTabNameChange={setSimpleTabName}
          onCreateTab={handleSimpleTabCreate}
          onCancel={() => {
            setShowSimpleTabForm(false);
            setSimpleTabName('');
          }}
        />
      </div>
    </div>
  );
}