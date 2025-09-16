import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Smartphone, Shirt } from 'lucide-react';
import React from 'react';

// Custom icon components for wigs and ebooks
const WigIcon = () => React.createElement('svg', 
  { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor" },
  React.createElement('path', { d: "M12 2C8.69 2 6 4.69 6 8c0 1.5.6 2.87 1.56 3.86L6.5 21h3l.94-7.5h3.12L14.5 21h3l-1.06-9.14C17.4 10.87 18 9.5 18 8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4 0 1.2-.53 2.27-1.36 3h-5.28C8.53 10.27 8 9.2 8 8c0-2.21 1.79-4 4-4z" })
);

const EbookIcon = () => React.createElement('svg', 
  { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor" },
  React.createElement('path', { d: "M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5v4.5h4.5L13 3.5zM8 11h8v2H8v-2zm0 4h8v2H8v-2z" })
);

const iconMapping = {
  'Smartphone': Smartphone,
  'Shirt': Shirt,
  'custom-wig': WigIcon,
  'custom-ebook': EbookIcon,
};

// SKU Generators for each template
const skuGenerators = {
  smartphone: (variantName: string, fields: Record<string, any>) => {
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
  },
  clothes: (variantName: string, fields: Record<string, any>) => {
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
  },
  wigs: (variantName: string, fields: Record<string, any>) => {
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
  },
  ebooks: (variantName: string, fields: Record<string, any>) => {
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

export const useVariantTemplates = () => {
  return useQuery({
    queryKey: ['variant-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_variant_templates')
        .select('*');

      if (error) throw error;

      // Transform database data to match expected format
      const templates = {};
      data?.forEach(template => {
        const icon = iconMapping[template.icon as keyof typeof iconMapping] || Smartphone;
        const config = template.sku_generator_config as any;
        const product = config?.product || {
          name: template.name,
          image: ''
        };

        templates[template.template_id] = {
          id: template.template_id,
          name: template.name,
          icon,
          product,
          variantFields: template.variant_fields || [],
          defaultVariantNames: template.default_variant_names || [],
          skuGenerator: skuGenerators[template.template_id as keyof typeof skuGenerators] || (() => 'DEFAULT-SKU')
        };
      });

      return templates;
    }
  });
};