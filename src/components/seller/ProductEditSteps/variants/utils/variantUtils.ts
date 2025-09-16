export const getVariantName = (variantNameId: number, customVariantNames: any[]) => {
  return customVariantNames.find(vn => vn.id === variantNameId)?.name || 'Unknown';
};

export const getVariantNameAbbreviation = (variantName: string) => {
  if (!variantName) return 'UNK';
  const words = variantName.split(' ');
  if (words.length === 1) {
    return variantName.substring(0, 4).toUpperCase();
  }
  return words.map(word => word.substring(0, 2).toUpperCase()).join('');
};

export const generateSKU = (variantNameId: number, fields: any, currentTemplate: any, customVariantNames: any[]) => {
  const variantName = getVariantName(variantNameId, customVariantNames);
  return currentTemplate.skuGenerator(variantName, fields);
};

export const getDisplayName = (variant: any, currentTemplate: any, customVariantNames: any[]) => {
  const variantName = getVariantName(variant.variantNameId, customVariantNames);
  const firstField = currentTemplate.variantFields[0];
  return `${variantName} · ${variant[firstField.key]}`;
};

// Get the main image for a variant type from variant-specific images
export const getVariantMainImage = (variantNameId: number, variants: any[], currentTemplate: any, productImages: any[] = [], customVariantNames: any[] = []) => {
  // First, try to get image from customVariantNames (variant_names from database)
  const variantType = customVariantNames.find(vn => vn.id === variantNameId);
  if (variantType && variantType.mainImage) {
    return variantType.mainImage;
  }
  if (variantType && variantType.image) {
    return variantType.image;
  }
  
  // Then try to get image from variant data
  const variant = variants.find(v => v.variantNameId === variantNameId);
  if (variant && variant.image) {
    return variant.image;
  }
  
  // Fallback to template default image
  return currentTemplate.product.image;
};

// Get all images for a variant type
export const getVariantImages = (variantNameId: number, variants: any[], variantTypeImages: any) => {
  const variantImages = variants
    .filter(v => v.variantNameId === variantNameId)
    .map(v => v.image);

  const additionalImages = variantTypeImages[variantNameId] || [];
  const allImages = [...variantImages, ...additionalImages];
  return [...new Set(allImages.filter(img => img))];
};

// Count subvariants for each variant type
export const getSubvariantCount = (variantNameId: number, variants: any[]) => {
  return variants.filter(v => v.variantNameId === variantNameId).length;
};

// Get price range for a variant type
export const getVariantPriceRange = (variantNameId: number, variants: any[], customVariantNames: any[], formatPrice: (price: number) => string) => {
  const variantPrices = variants
    .filter(v => v.variantNameId === variantNameId)
    .map(v => v.price || 0)
    .filter(price => price > 0);

  if (variantPrices.length === 0) {
    const variantType = customVariantNames.find(vn => vn.id === variantNameId);
    const savedPrice = variantType?.price || 0;
    return `$${savedPrice.toFixed(2)}`;
  }

  const minPrice = Math.min(...variantPrices);
  const maxPrice = Math.max(...variantPrices);

  return minPrice === maxPrice 
    ? `$${minPrice.toFixed(2)}` 
    : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

// Get total stock for a variant type
export const getVariantTotalStock = (variantNameId: number, variants: any[], customVariantNames: any[]) => {
  const subvariantStock = variants
    .filter(v => v.variantNameId === variantNameId)
    .reduce((sum, variant) => sum + (variant.stock || 0), 0);

  if (subvariantStock === 0) {
    const variantType = customVariantNames.find(vn => vn.id === variantNameId);
    return variantType?.stock || 0;
  }

  return subvariantStock;
};