import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryStepProps {
  formData: {
    category: string;
    subcategory: string;
    type: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export const CategoryStep: React.FC<CategoryStepProps> = ({
  formData,
  onInputChange
}) => {
  const categories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Sports & Outdoors',
    'Automotive',
    'Kids & Hobbies',
    'Entertainment'
  ];

  const subcategories = {
    'Electronics': ['Smartphones', 'Laptops', 'Accessories', 'Audio', 'Gaming'],
    'Fashion': ['Clothing', 'Shoes', 'Accessories', 'Jewelry', 'Bags'],
    'Home & Living': ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Storage'],
    'Sports & Outdoors': ['Fitness', 'Outdoor Gear', 'Sports Equipment', 'Activewear'],
    'Automotive': ['Car Accessories', 'Tools', 'Parts', 'Electronics', 'Care Products'],
    'Kids & Hobbies': ['Toys', 'Games', 'Books', 'Crafts', 'Educational'],
    'Entertainment': ['Movies', 'Music', 'Books', 'Gaming', 'Collectibles']
  };

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-center">Product Category</h3>
        <p className="text-sm text-muted-foreground text-center">
          Choose the appropriate category and subcategory
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Select 
            value={formData.subcategory} 
            onValueChange={(value) => onInputChange('subcategory', value)}
            disabled={!formData.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map((subcategory) => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Product Type</Label>
          <Select value={formData.type} onValueChange={(value) => onInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Product</SelectItem>
              <SelectItem value="variable">Variable Product (with variants)</SelectItem>
              <SelectItem value="digital">Digital Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};