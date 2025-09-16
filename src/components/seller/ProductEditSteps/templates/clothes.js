import { Shirt } from 'lucide-react';

export const clothesTemplate = {
  id: 'clothes',
  name: 'Clothing',
  icon: Shirt,
  product: {
    name: 'Classic Cotton T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center'
  },
  variantFields: [
    { key: 'size', label: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { key: 'material', label: 'Material', options: ['100% Cotton', 'Cotton Blend', 'Polyester', 'Organic Cotton'] },
    { key: 'fit', label: 'Fit', options: ['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Oversized'] }
  ],
  defaultVariantNames: [
    { id: 1, name: 'Navy Blue', stock: 0, price: 0 },
    { id: 2, name: 'White', stock: 0, price: 0 },
    { id: 3, name: 'Black', stock: 0, price: 0 },
    { id: 4, name: 'Heather Gray', stock: 0, price: 0 }
  ],
  skuGenerator: (variantName, fields) => {
    const colorAbbr = variantName.split(' ').map(word => word.substring(0, 2).toUpperCase()).join('');
    const sizeAbbr = fields.size || 'UNK';
    const materialAbbr = fields.material === '100% Cotton' ? 'COT' : 
                        fields.material === 'Cotton Blend' ? 'COTB' : 
                        fields.material === 'Polyester' ? 'POLY' : 
                        fields.material === 'Organic Cotton' ? 'OCOT' : 'UNK';
    const fitAbbr = fields.fit === 'Slim Fit' ? 'SLM' : 
                   fields.fit === 'Regular Fit' ? 'REG' : 
                   fields.fit === 'Relaxed Fit' ? 'RLX' : 
                   fields.fit === 'Oversized' ? 'OVR' : 'UNK';
    return `TSH-${colorAbbr}-${sizeAbbr}-${materialAbbr}-${fitAbbr}`;
  }
};