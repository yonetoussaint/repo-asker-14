import React, { useState, useEffect } from 'react';
import { Wifi, HardDrive, CircleFadingArrowUp, Circle, Check } from 'lucide-react';
import ProductColorVariants from './ProductColorVariants';
import ProductStorageVariants from './ProductStorageVariants';
import ProductNetworkVariants from './ProductNetworkVariants';
import ProductConditionsVariants from './ProductConditionsVariants';

import VariantSection from './VariantSection';
import { useVariantSections } from '@/hooks/useVariantSections';
import { useProduct } from '@/hooks/useProduct';
import { useCurrency } from '@/contexts/CurrencyContext';
import * as variantUtils from '@/components/seller/ProductEditSteps/variants/utils/variantUtils';

// Mock data interface
interface ColorVariant {
  id: string;
  name: string;
  colorCode: string;
  price: number;
  stock: number;
  isBestseller?: boolean;
  stockQuantity?: number;
  image?: string; // Add image property for variant images
}

interface StorageVariant {
  name: string;
  price: number;
  quantity: number;
  isBestseller?: boolean;
}



interface NetworkVariant {
  type: string;
  price: number;
  isBestseller?: boolean;
  stockQuantity: number;
  logo?: string;
  color?: string;
  bgColor?: string;
  borderColor?: string;
}

interface ConditionVariant {
  name: string;
  price: number;
  isBestseller?: boolean;
  stockQuantity?: number;
}

export default function ProductVariants({ 
  productId, 
  onImageSelect,
  onConfigurationChange 
}: { 
  productId?: string; 
  onImageSelect?: (imageUrl: string, variantName: string) => void; 
  onConfigurationChange?: (configData: any) => void;
}) {
  // Fetch product data
  const { data: product, isLoading } = useProduct(productId || '');
  const { formatPrice } = useCurrency();

  // State management
  const [isVariableProduct] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  const { isExpanded, toggleSection } = useVariantSections();

  // Transform product data into variant format
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);
  const [storageVariants, setStorageVariants] = useState<StorageVariant[]>([]);
  const [networkVariants, setNetworkVariants] = useState<NetworkVariant[]>([]);
  const [conditionVariants, setConditionVariants] = useState<ConditionVariant[]>([]);

  useEffect(() => {
    if (!product || !Array.isArray(product.variants)) return;

    console.log('ProductVariants - product.variants:', product.variants);
    console.log('ProductVariants - product.variant_names:', product.variant_names);
    console.log('ProductVariants - selectedColor:', selectedColor);

    // 1) Transform variant_names (color tabs) into ColorVariant format
    const colors: ColorVariant[] = (product.variant_names || []).map((variantName: any) => {
      // Get variants for this color to calculate aggregated data
      const colorVariants = product.variants.filter((v: any) => v.variantNameId === variantName.id);

      // Calculate price range for this color
      const prices = colorVariants.map((v: any) => v.price || 0).filter(p => p > 0);
      const price = prices.length > 0 ? Math.min(...prices) : variantName.price || 0;

      // Calculate total stock for this color
      const totalStock = colorVariants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || variantName.stock || 0;

      return {
        id: variantName.id,
        name: variantName.name,
        colorCode: variantName.colorCode || '#000000',
        price,
        stock: totalStock,
        isBestseller: variantName.isBestseller || false,
        stockQuantity: totalStock,
        image: variantName.mainImage || variantName.image
      };
    });

    console.log('ProductVariants - mapped colors array:', colors);
    setColorVariants(colors);

    // Ensure a color is selected and set default image
    if (colors.length > 0 && !selectedColor) {
      const firstColor = colors[0];
      setSelectedColor(firstColor.name);
      
      // Set the first color variant's image as default in gallery
      if (firstColor.image && onImageSelect) {
        console.log('Setting default color variant image:', firstColor.image, firstColor.name);
        onImageSelect(firstColor.image, firstColor.name);
      }
    }

    // Determine active color id and variants for that color
    const selectedVariantName = (product.variant_names || []).find((vn: any) => vn.name === selectedColor) || (product.variant_names || [])[0];
    const variantsForColor = selectedVariantName
      ? product.variants.filter((v: any) => v.variantNameId === selectedVariantName.id)
      : product.variants;

    // 2) Build storage options filtered by selected color
    const storageOptions = new Set<string>();
    const storageData: Record<string, { prices: number[]; stocks: number[] }> = {};

    variantsForColor.forEach((variant: any) => {
      if (variant.storage) {
        storageOptions.add(variant.storage);
        if (!storageData[variant.storage]) storageData[variant.storage] = { prices: [], stocks: [] };
        if (variant.price !== undefined && variant.price !== null) storageData[variant.storage].prices.push(variant.price);
        if (variant.stock !== undefined && variant.stock !== null) storageData[variant.storage].stocks.push(variant.stock);
      }
    });

    const storages: StorageVariant[] = Array.from(storageOptions).map((storage, index) => {
      const data = storageData[storage] || { prices: [], stocks: [] };
      const minPrice = data.prices.length > 0 ? Math.min(...data.prices) : 0;
      const totalStock = data.stocks.reduce((sum, s) => sum + s, 0);
      return {
        name: storage,
        price: minPrice,
        quantity: totalStock,
        isBestseller: index === 0
      };
    });

    console.log('ProductVariants - final storage variants (by color):', storages);
    setStorageVariants(storages);

    // Ensure selectedStorage is valid for current color
    if (storages.length > 0) {
      const exists = storages.some(s => s.name === selectedStorage);
      if (!exists) {
        setSelectedStorage(storages[0].name);
      }
    } else if (selectedStorage) {
      setSelectedStorage('');
    }

    // 3) Build network options filtered by selected color + storage
    const variantsForStorage = selectedStorage
      ? variantsForColor.filter((v: any) => v.storage === selectedStorage)
      : variantsForColor;

    const networkOptions = new Set<string>();
    const networkData: Record<string, { prices: number[]; stocks: number[] }> = {};

    variantsForStorage.forEach((variant: any) => {
      const network = variant.networkStatus;
      if (network) {
        networkOptions.add(network);
        if (!networkData[network]) networkData[network] = { prices: [], stocks: [] };
        if (variant.price !== undefined && variant.price !== null) networkData[network].prices.push(variant.price);
        if (variant.stock !== undefined && variant.stock !== null) networkData[network].stocks.push(variant.stock);
      }
    });

    const networks: NetworkVariant[] = Array.from(networkOptions).map((network) => {
      const data = networkData[network] || { prices: [], stocks: [] };
      return {
        type: network,
        price: data.prices.length > 0 ? Math.min(...data.prices) : 0,
        stockQuantity: data.stocks.reduce((sum, s) => sum + s, 0),
        isBestseller: network === 'Unlocked',
        // Carrier-specific styling
        color: network === 'Verizon' ? '#ee112d' : 
               network === 'AT&T' ? '#007cba' : 
               network === 'T-Mobile' ? '#e20e84' : 
               network === 'MetroPCS' ? '#8f52b4' :
               network === 'Sprint' ? '#ffdd00' :
               network === 'Boost Mobile' ? '#ff6600' :
               network === 'Unlocked' ? '#10b981' : '#6b7280',
        bgColor: network === 'Verizon' ? 'bg-red-50' : 
                 network === 'AT&T' ? 'bg-blue-50' : 
                 network === 'T-Mobile' ? 'bg-pink-50' : 
                 network === 'MetroPCS' ? 'bg-purple-50' :
                 network === 'Sprint' ? 'bg-yellow-50' :
                 network === 'Boost Mobile' ? 'bg-orange-50' :
                 network === 'Unlocked' ? 'bg-green-50' : 'bg-gray-50',
        borderColor: network === 'Verizon' ? 'border-red-200' : 
                     network === 'AT&T' ? 'border-blue-200' : 
                     network === 'T-Mobile' ? 'border-pink-200' : 
                     network === 'MetroPCS' ? 'border-purple-200' :
                     network === 'Sprint' ? 'border-yellow-200' :
                     network === 'Boost Mobile' ? 'border-orange-200' :
                     network === 'Unlocked' ? 'border-green-200' : 'border-gray-200'
      };
    });

    setNetworkVariants(networks);

    // Ensure selectedNetwork is valid for current storage
    if (networks.length > 0) {
      const exists = networks.some(n => n.type === selectedNetwork);
      if (!exists) {
        setSelectedNetwork(networks[0].type);
      }
    } else if (selectedNetwork) {
      setSelectedNetwork('');
    }

    // 4) Build condition options filtered by selected color + storage + network
    const variantsForNetwork = selectedNetwork
      ? variantsForStorage.filter((v: any) => v.networkStatus === selectedNetwork)
      : variantsForStorage;

    const conditionOptions = new Set<string>();
    const conditionData: Record<string, { prices: number[]; stocks: number[] }> = {};

    variantsForNetwork.forEach((variant: any) => {
      const condition = variant.productGrade;
      if (condition) {
        conditionOptions.add(condition);
        if (!conditionData[condition]) conditionData[condition] = { prices: [], stocks: [] };
        if (variant.price !== undefined && variant.price !== null) conditionData[condition].prices.push(variant.price);
        if (variant.stock !== undefined && variant.stock !== null) conditionData[condition].stocks.push(variant.stock);
      }
    });

    const conditions: ConditionVariant[] = Array.from(conditionOptions).map((condition) => {
      const data = conditionData[condition] || { prices: [], stocks: [] };
      return {
        name: condition,
        price: data.prices.length > 0 ? Math.min(...data.prices) : 0,
        stockQuantity: data.stocks.reduce((sum, s) => sum + s, 0),
        isBestseller: condition === 'Brand New'
      };
    });

    setConditionVariants(conditions);

    // Ensure selectedCondition is valid for current network
    if (conditions.length > 0) {
      const exists = conditions.some(c => c.name === selectedCondition);
      if (!exists) {
        setSelectedCondition(conditions[0].name);
      }
    } else if (selectedCondition) {
      setSelectedCondition('');
    }
  }, [product, selectedColor, selectedStorage, selectedNetwork]);

  // Pass configuration data upward whenever it changes
  useEffect(() => {
    if (onConfigurationChange) {
      onConfigurationChange({
        selectedColor,
        selectedStorage,
        selectedNetwork,
        selectedCondition,
        colorVariants,
        storageVariants,
        networkVariants,
        conditionVariants,
        getSelectedColorVariant,
        getSelectedStorageVariant,
        getSelectedNetworkVariant,
        getSelectedConditionVariant,
        getStorageDisplayValue,
        getVariantFormattedPrice,
        formatPrice
      });
    }
  }, [selectedColor, selectedStorage, selectedNetwork, selectedCondition, colorVariants, storageVariants, networkVariants, conditionVariants, onConfigurationChange]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-screen -mx-2 bg-white overflow-x-hidden p-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading variants...</span>
        </div>
      </div>
    );
  }

  // If no product data or no variants, show a message
  if (!product || (!product.variant_names && !product.variants)) {
    return (
      <div className="w-screen -mx-2 bg-white overflow-x-hidden p-4">
        <div className="text-center py-8">
          <p className="text-gray-600">No variants available for this product.</p>
        </div>
      </div>
    );
  }

  // Calculate bundle price from product data
  const bundlePrice = product?.price || 899;

  // Helper functions
  const getStorageDisplayValue = (storage: string) => {
    if (!storage) return '';
    return storage.includes('GB') || storage.includes('TB') ? storage : `${storage}GB`;
  };

  const getSelectedColorVariant = () => colorVariants.find(v => v.name === selectedColor);
  const getSelectedStorageVariant = () => storageVariants.find(v => v.name === selectedStorage);
  const getSelectedNetworkVariant = () => networkVariants.find(v => v.type === selectedNetwork);
  const getSelectedConditionVariant = () => conditionVariants.find(v => v.name === selectedCondition);

  // Helper functions to get formatted price and stock like in VariantSummaryCard
  const getVariantFormattedPrice = (variantNameId: number) => {
    if (!product?.variant_names || !product?.variants) return formatPrice(0);
    
    // Find variants for this variant name ID
    const variantNameVariants = product.variants.filter((v: any) => v.variantNameId === variantNameId);
    
    if (variantNameVariants.length === 0) {
      // If no sub-variants, get price from variant_names
      const variantName = product.variant_names.find((vn: any) => vn.id === variantNameId);
      return formatPrice(variantName?.price || 0);
    }
    
    // Get all prices from variants
    const prices = variantNameVariants
      .map((v: any) => v.price || 0)
      .filter(price => price > 0);
    
    if (prices.length === 0) {
      const variantName = product.variant_names.find((vn: any) => vn.id === variantNameId);
      return formatPrice(variantName?.price || 0);
    }
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Return formatted price range or single price
    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    } else {
      return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
  };

  const getVariantStock = (variantNameId: number) => {
    if (!product?.variant_names || !product?.variants) return 0;
    
    // Find variants for this variant name ID
    const variantNameVariants = product.variants.filter((v: any) => v.variantNameId === variantNameId);
    
    if (variantNameVariants.length === 0) {
      // If no sub-variants, get stock from variant_names
      const variantName = product.variant_names.find((vn: any) => vn.id === variantNameId);
      return variantName?.stock || 0;
    }
    
    // Sum all stock from variants
    return variantNameVariants.reduce((total: number, variant: any) => {
      return total + (variant.stock || 0);
    }, 0);
  };

  // Calculate price ranges (with fallbacks for empty arrays)
  const colorPriceRange = {
    from: colorVariants.length > 0 ? Math.min(...colorVariants.map(v => v.price)) : 0,
    to: colorVariants.length > 0 ? Math.max(...colorVariants.map(v => v.price)) : 0
  };

  const storagePriceRange = {
    from: storageVariants.length > 0 ? Math.min(...storageVariants.map(v => v.price)) : 0,
    to: storageVariants.length > 0 ? Math.max(...storageVariants.map(v => v.price)) : 0
  };

  const networkPriceRange = {
    from: networkVariants.length > 0 ? Math.min(...networkVariants.map(v => v.price)) : 0,
    to: networkVariants.length > 0 ? Math.max(...networkVariants.map(v => v.price)) : 0
  };

  const conditionPriceRange = {
    from: conditionVariants.length > 0 ? Math.min(...conditionVariants.map(v => v.price)) : 0,
    to: conditionVariants.length > 0 ? Math.max(...conditionVariants.map(v => v.price)) : 0
  };

  // Icons for different sections - using Lucide React icons directly
  const ColorIcon = () => <Circle className="w-7 h-7 text-gray-600" />;
  const StorageIcon = () => <HardDrive className="w-7 h-7 text-gray-600" />;
  const NetworkIcon = () => <Wifi className="w-7 h-7 text-gray-600" />;
  const ConditionIcon = () => <CircleFadingArrowUp className="w-7 h-7 text-gray-600" />;

  return (
    <div className="w-screen -mx-2 bg-white overflow-x-hidden">
      {/* Color Variants Section */}
      {isVariableProduct && colorVariants.length > 0 && (
        <VariantSection
          title="Color"
          selectedValue={selectedColor}
          variantCount={colorVariants.length}
          price={getSelectedColorVariant()?.id ? getVariantFormattedPrice(Number(getSelectedColorVariant()?.id)) : formatPrice(getSelectedColorVariant()?.price || 999)}
          isExpanded={isExpanded('color')}
          onToggle={() => toggleSection('color')}
          colorCode={getSelectedColorVariant()?.colorCode}
          icon={<ColorIcon />}
          // All available props for expanded view
          isBestseller={getSelectedColorVariant()?.isBestseller}
          stockQuantity={getSelectedColorVariant()?.id ? getVariantStock(Number(getSelectedColorVariant()?.id)) : getSelectedColorVariant()?.stockQuantity}
          optionsQuantity={colorVariants.length}
          priceFrom={colorPriceRange.from}
          priceTo={colorPriceRange.to}
        >
          <ProductColorVariants 
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            variants={colorVariants}
            bundlePrice={bundlePrice}
            hideHeader={true}
            onImageSelect={onImageSelect}
          />
        </VariantSection>
      )}

      {/* Storage Variants Section - Always show if storage variants exist */}
      {storageVariants.length > 0 && (
        <VariantSection
          title="Storage"
          selectedValue={selectedStorage}
          variantCount={storageVariants.length}
          price={formatPrice(getSelectedStorageVariant()?.price || 0)}
          isExpanded={isExpanded('storage')}
          onToggle={() => toggleSection('storage')}
          displayValue={getStorageDisplayValue(selectedStorage)}
          icon={<StorageIcon />}
          showSeparator={true}
          // All available props for expanded view
          isBestseller={getSelectedStorageVariant()?.isBestseller}
          stockQuantity={getSelectedStorageVariant()?.quantity}
          optionsQuantity={storageVariants.length}
          priceFrom={storagePriceRange.from}
          priceTo={storagePriceRange.to}
        >
          <ProductStorageVariants 
            selectedStorage={selectedStorage}
            onStorageChange={setSelectedStorage}
            variants={storageVariants}
            bundlePrice={bundlePrice}
            hideHeader={true}
          />
        </VariantSection>
      )}

      {/* Network Variants Section */}
      {/* Network Variants Section */}
{selectedStorage && networkVariants.length > 0 && (
  <VariantSection
    title="Network"
    selectedValue={selectedNetwork}
    variantCount={networkVariants.length}
    price={getSelectedNetworkVariant()?.price || 0}
    isExpanded={isExpanded('network')}
    onToggle={() => toggleSection('network')}
    icon={<NetworkIcon />}
    showSeparator={true}
    // Add displayValue to show "(Locked)" for non-Unlocked networks in the header
    displayValue={selectedNetwork === 'Unlocked' ? selectedNetwork : `${selectedNetwork} (Locked)`}
    // All available props for expanded view
    isBestseller={getSelectedNetworkVariant()?.isBestseller}
    stockQuantity={getSelectedNetworkVariant()?.stockQuantity}
    optionsQuantity={networkVariants.length}
    priceFrom={networkPriceRange.from}
    priceTo={networkPriceRange.to}
  >
    <ProductNetworkVariants 
      selectedNetwork={selectedNetwork}
      onNetworkChange={setSelectedNetwork}
      variants={networkVariants}
      bundlePrice={bundlePrice}
      hideHeader={true}
    />
  </VariantSection>
)}

      {/* Condition Variants Section */}
      {selectedNetwork && conditionVariants.length > 0 && (
        <VariantSection
          title="Condition"
          selectedValue={selectedCondition}
          variantCount={conditionVariants.length}
          price={getSelectedConditionVariant()?.price || 0}
          isExpanded={isExpanded('condition')}
          onToggle={() => toggleSection('condition')}
          icon={<ConditionIcon />}
          showSeparator={false}
          // All available props for expanded view
          isBestseller={getSelectedConditionVariant()?.isBestseller}
          stockQuantity={getSelectedConditionVariant()?.stockQuantity}
          optionsQuantity={conditionVariants.length}
          priceFrom={conditionPriceRange.from}
          priceTo={conditionPriceRange.to}
        >
          <ProductConditionsVariants 
            selectedCondition={selectedCondition}
            onConditionChange={setSelectedCondition}
            variants={conditionVariants}
            bundlePrice={bundlePrice}
            hideHeader={true}
          />
        </VariantSection>
      )}

    </div>
  );
}