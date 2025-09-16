import { Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Fetch smartphone products from database
const fetchSmartphoneProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .contains('tags', ['smartphones'])
      .limit(1);

    if (error) {
      console.error('Error fetching smartphone products:', error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching smartphone products:', error);
    return null;
  }
};

// Get variant options from existing data
const getVariantOptions = (variants) => {
  const options = {
    storage: new Set(),
    networkStatus: new Set(),
    productGrade: new Set()
  };

  variants?.forEach(variant => {
    if (variant.storage) options.storage.add(variant.storage);
    if (variant.networkStatus) options.networkStatus.add(variant.networkStatus);
    if (variant.productGrade) options.productGrade.add(variant.productGrade);
  });

  return {
    storage: Array.from(options.storage),
    networkStatus: Array.from(options.networkStatus),
    productGrade: Array.from(options.productGrade)
  };
};

// Generate template from database data
const generateSmartphoneTemplate = async () => {
  const product = await fetchSmartphoneProducts();
  
  if (!product) {
    // Fallback to static template if no data found
    return {
      id: 'smartphone',
      name: 'Smartphones',
      icon: Smartphone,
      product: {
        name: 'iPhone 15 Pro',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center'
      },
      variantFields: [
        { key: 'storage', label: 'Storage', options: ['64GB', '128GB', '256GB', '512GB'] },
        { key: 'networkStatus', label: 'Network', options: ['Verizon', 'AT&T', 'T-Mobile', 'Unlocked'] },
        { key: 'productGrade', label: 'Condition', options: ['Brand New', 'Refurbished', 'Used - Like New', 'Used - Good'] }
      ],
      defaultVariantNames: [
        { id: 1, name: 'Space Black', stock: 0, price: 0 },
        { id: 2, name: 'Deep Purple', stock: 0, price: 0 },
        { id: 3, name: 'Gold', stock: 0, price: 0 }
      ]
    };
  }

  const variants = product.color_variants || [];
  const variantOptions = getVariantOptions(variants);
  
  // Extract unique variant names for default options
  const uniqueVariantNames = variants.reduce((acc, variant) => {
    if (!acc.find(v => v.name === variant.name)) {
      acc.push({
        id: variant.id,
        name: variant.name,
        stock: variant.stock || 0,
        price: variant.price || 0,
        active: variant.active !== false
      });
    }
    return acc;
  }, []);

  return {
    id: 'smartphone',
    name: 'Smartphones',
    icon: Smartphone,
    product: {
      name: product.name,
      image: product.product_images?.[0]?.src || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center'
    },
    variantFields: [
      { 
        key: 'storage', 
        label: 'Storage', 
        options: variantOptions.storage.length > 0 ? variantOptions.storage : ['64GB', '128GB', '256GB', '512GB'] 
      },
      { 
        key: 'networkStatus', 
        label: 'Network', 
        options: variantOptions.networkStatus.length > 0 ? variantOptions.networkStatus : ['Verizon', 'AT&T', 'T-Mobile', 'Unlocked'] 
      },
      { 
        key: 'productGrade', 
        label: 'Condition', 
        options: variantOptions.productGrade.length > 0 ? variantOptions.productGrade : ['Brand New', 'Refurbished', 'Used - Like New', 'Used - Good'] 
      }
    ],
    defaultVariantNames: uniqueVariantNames.length > 0 ? uniqueVariantNames : [
      { id: 1, name: 'Space Black', stock: 0, price: 0 },
      { id: 2, name: 'Deep Purple', stock: 0, price: 0 },
      { id: 3, name: 'Gold', stock: 0, price: 0 }
    ],
    skuGenerator: (variantName, fields) => {
      const variantAbbr = variantName.substring(0, 4).toUpperCase();
      const storageAbbr = fields.storage || 'UNK';
      const networkAbbr = fields.networkStatus === 'Verizon' ? 'VZ' : 
                         fields.networkStatus === 'AT&T' ? 'ATT' : 
                         fields.networkStatus === 'T-Mobile' ? 'TMO' : 
                         fields.networkStatus === 'Unlocked' ? 'UNL' : 'UNK';
      const gradeAbbr = fields.productGrade === 'Brand New' ? 'NEW' : 
                       fields.productGrade === 'Refurbished' ? 'REF' : 
                       fields.productGrade === 'Used - Like New' ? 'ULN' : 
                       fields.productGrade === 'Used - Good' ? 'UGD' : 'UNK';
      return `IPH15-${variantAbbr}-${storageAbbr}-${networkAbbr}-${gradeAbbr}`;
    }
  };
};

// Export async function to get template with real data
export const getSmartphoneTemplate = generateSmartphoneTemplate;

// Export static template for immediate use (backwards compatibility)
export const smartphoneTemplate = {
  id: 'smartphone',
  name: 'Smartphones',
  icon: Smartphone,
  product: {
    name: 'iPhone 15 Pro',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center'
  },
  variantFields: [
    { key: 'storage', label: 'Storage', options: ['64GB', '128GB', '256GB', '512GB'] },
    { key: 'networkStatus', label: 'Network', options: ['Verizon', 'AT&T', 'T-Mobile', 'Unlocked'] },
    { key: 'productGrade', label: 'Condition', options: ['Brand New', 'Refurbished', 'Used - Like New', 'Used - Good'] }
  ],
  defaultVariantNames: [
    { id: 1, name: 'Space Black', stock: 0, price: 0 },
    { id: 2, name: 'Deep Purple', stock: 0, price: 0 },
    { id: 3, name: 'Gold', stock: 0, price: 0 }
  ],
  skuGenerator: (variantName, fields) => {
    const variantAbbr = variantName.substring(0, 4).toUpperCase();
    const storageAbbr = fields.storage || 'UNK';
    const networkAbbr = fields.networkStatus === 'Verizon' ? 'VZ' : 
                       fields.networkStatus === 'AT&T' ? 'ATT' : 
                       fields.networkStatus === 'T-Mobile' ? 'TMO' : 
                       fields.networkStatus === 'Unlocked' ? 'UNL' : 'UNK';
    const gradeAbbr = fields.productGrade === 'Brand New' ? 'NEW' : 
                     fields.productGrade === 'Refurbished' ? 'REF' : 
                     fields.productGrade === 'Used - Like New' ? 'ULN' : 
                     fields.productGrade === 'Used - Good' ? 'UGD' : 'UNK';
    return `IPH15-${variantAbbr}-${storageAbbr}-${networkAbbr}-${gradeAbbr}`;
  }
};