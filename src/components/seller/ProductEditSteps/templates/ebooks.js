const EbookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5v4.5h4.5L13 3.5zM8 11h8v2H8v-2zm0 4h8v2H8v-2z"/>
  </svg>
);

export const ebooksTemplate = {
  id: 'ebooks',
  name: 'E-books',
  icon: EbookIcon,
  product: {
    name: 'Complete JavaScript Masterclass',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center'
  },
  variantFields: [
    { key: 'format', label: 'Format', options: ['PDF', 'ePub', 'Mobi', 'AZW3', 'Multi-Format Bundle'] },
    { key: 'edition', label: 'Edition', options: ['Standard Edition', 'Deluxe Edition', 'Collector\'s Edition', 'Revised Edition', 'First Edition'] },
    { key: 'language', label: 'Language', options: ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian'] },
    { key: 'licenseType', label: 'License Type', options: ['Personal Use', 'Commercial Use', 'Educational License', 'Multi-User License'] }
  ],
  defaultVariantNames: [
    { id: 1, name: 'Single Book', stock: 0, price: 0 },
    { id: 2, name: 'Book + Audiobook Bundle', stock: 0, price: 0 },
    { id: 3, name: 'Complete Series (3 Books)', stock: 0, price: 0 },
    { id: 4, name: 'Premium Package', stock: 0, price: 0 },
    { id: 5, name: 'Study Guide Bundle', stock: 0, price: 0 }
  ],
  skuGenerator: (variantName, fields) => {
    const nameAbbr = variantName.split(' ').map(word => word.substring(0, 2).toUpperCase()).join('');
    const formatAbbr = fields.format === 'PDF' ? 'PDF' : 
                      fields.format === 'ePub' ? 'EPUB' : 
                      fields.format === 'Mobi' ? 'MOBI' : 
                      fields.format === 'AZW3' ? 'AZW3' : 
                      fields.format === 'Multi-Format Bundle' ? 'MULTI' : 'UNK';
    const editionAbbr = fields.edition === 'Standard Edition' ? 'STD' : 
                       fields.edition === 'Deluxe Edition' ? 'DLX' : 
                       fields.edition === 'Collector\'s Edition' ? 'COL' : 
                       fields.edition === 'Revised Edition' ? 'REV' : 
                       fields.edition === 'First Edition' ? '1ST' : 'UNK';
    const langAbbr = fields.language === 'English' ? 'EN' : 
                    fields.language === 'Spanish' ? 'ES' : 
                    fields.language === 'French' ? 'FR' : 
                    fields.language === 'German' ? 'DE' : 
                    fields.language === 'Portuguese' ? 'PT' : 
                    fields.language === 'Italian' ? 'IT' : 'UNK';
    const licenseAbbr = fields.licenseType === 'Personal Use' ? 'PERS' : 
                       fields.licenseType === 'Commercial Use' ? 'COMM' : 
                       fields.licenseType === 'Educational License' ? 'EDU' : 
                       fields.licenseType === 'Multi-User License' ? 'MULTI' : 'UNK';
    return `EBOOK-${nameAbbr}-${formatAbbr}-${editionAbbr}-${langAbbr}-${licenseAbbr}`;
  }
};