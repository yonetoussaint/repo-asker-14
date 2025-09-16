import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShippingStepProps {
  formData: {
    weight: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
    };
    shipping_cost: string;
    free_shipping: boolean;
    shipping_time: string;
  };
  onInputChange: (field: string, value: any) => void;
}

export const ShippingStep: React.FC<ShippingStepProps> = ({
  formData,
  onInputChange
}) => {
  const handleDimensionChange = (dimension: string, value: string) => {
    onInputChange('dimensions', {
      ...formData.dimensions,
      [dimension]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Shipping Information</h3>
        <p className="text-sm text-muted-foreground">
          Configure shipping details and costs
        </p>
      </div>

      <div className="space-y-4">
        {/* Weight */}
        <div className="space-y-2">
          <Label>Weight (kg)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.weight}
            onChange={(e) => onInputChange('weight', e.target.value)}
            placeholder="0.00"
          />
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <Label>Dimensions (cm)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              step="0.1"
              min="0"
              value={formData.dimensions.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              placeholder="Length"
            />
            <Input
              type="number"
              step="0.1"
              min="0"
              value={formData.dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              placeholder="Width"
            />
            <Input
              type="number"
              step="0.1"
              min="0"
              value={formData.dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              placeholder="Height"
            />
          </div>
        </div>

        {/* Free Shipping Toggle */}
        <div className="flex items-center justify-between">
          <Label>Free Shipping</Label>
          <Switch
            checked={formData.free_shipping}
            onCheckedChange={(checked) => onInputChange('free_shipping', checked)}
          />
        </div>

        {/* Shipping Cost */}
        {!formData.free_shipping && (
          <div className="space-y-2">
            <Label>Shipping Cost ($)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.shipping_cost}
              onChange={(e) => onInputChange('shipping_cost', e.target.value)}
              placeholder="0.00"
            />
          </div>
        )}

        {/* Shipping Time */}
        <div className="space-y-2">
          <Label>Estimated Shipping Time</Label>
          <Select 
            value={formData.shipping_time} 
            onValueChange={(value) => onInputChange('shipping_time', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shipping time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2 days">1-2 Business Days</SelectItem>
              <SelectItem value="3-5 days">3-5 Business Days</SelectItem>
              <SelectItem value="1 week">1 Week</SelectItem>
              <SelectItem value="2 weeks">2 Weeks</SelectItem>
              <SelectItem value="3-4 weeks">3-4 Weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};