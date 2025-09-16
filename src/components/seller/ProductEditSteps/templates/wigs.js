const WigIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.69 2 6 4.69 6 8c0 1.5.6 2.87 1.56 3.86L6.5 21h3l.94-7.5h3.12L14.5 21h3l-1.06-9.14C17.4 10.87 18 9.5 18 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4 0 1.2-.53 2.27-1.36 3h-5.28C8.53 10.27 8 9.2 8 8c0-2.21 1.79-4 4-4z"/>
  </svg>
);

export const wigsTemplate = {
  id: 'wigs',
  name: 'Wigs',
  icon: WigIcon,
  product: {
    name: 'Premium Lace Front Wig',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=400&fit=crop&crop=center'
  },
  variantFields: [
    { key: 'length', label: 'Length', options: ['8"', '10"', '12"', '14"', '16"', '18"', '20"', '22"', '24"'] },
    { key: 'texture', label: 'Texture', options: ['Straight', 'Body Wave', 'Deep Wave', 'Curly', 'Kinky Straight', 'Water Wave'] },
    { key: 'hairType', label: 'Hair Type', options: ['Human Hair', 'Synthetic', 'Heat Resistant Synthetic', 'Remy Human Hair'] },
    { key: 'laceType', label: 'Lace Type', options: ['Lace Front', 'Full Lace', '360 Lace', 'Lace Closure', 'Standard Cap'] }
  ],
  defaultVariantNames: [
    { id: 1, name: 'Natural Black', stock: 0, price: 0 },
    { id: 2, name: 'Dark Brown', stock: 0, price: 0 },
    { id: 3, name: 'Medium Brown', stock: 0, price: 0 },
    { id: 4, name: 'Honey Blonde', stock: 0, price: 0 },
    { id: 5, name: 'Platinum Blonde', stock: 0, price: 0 },
    { id: 6, name: 'Auburn Red', stock: 0, price: 0 }
  ],
  skuGenerator: (variantName, fields) => {
    const colorAbbr = variantName.split(' ').map(word => word.substring(0, 2).toUpperCase()).join('');
    const lengthAbbr = fields.length ? fields.length.replace('"', '') : 'UNK';
    const textureAbbr = fields.texture === 'Straight' ? 'STR' : 
                       fields.texture === 'Body Wave' ? 'BW' : 
                       fields.texture === 'Deep Wave' ? 'DW' : 
                       fields.texture === 'Curly' ? 'CUR' : 
                       fields.texture === 'Kinky Straight' ? 'KS' : 
                       fields.texture === 'Water Wave' ? 'WW' : 'UNK';
    const hairTypeAbbr = fields.hairType === 'Human Hair' ? 'HH' : 
                        fields.hairType === 'Synthetic' ? 'SYN' : 
                        fields.hairType === 'Heat Resistant Synthetic' ? 'HRS' : 
                        fields.hairType === 'Remy Human Hair' ? 'RHH' : 'UNK';
    const laceAbbr = fields.laceType === 'Lace Front' ? 'LF' : 
                    fields.laceType === 'Full Lace' ? 'FL' : 
                    fields.laceType === '360 Lace' ? '360' : 
                    fields.laceType === 'Lace Closure' ? 'LC' : 
                    fields.laceType === 'Standard Cap' ? 'SC' : 'UNK';
    return `WIG-${colorAbbr}-${lengthAbbr}-${textureAbbr}-${hairTypeAbbr}-${laceAbbr}`;
  }
};