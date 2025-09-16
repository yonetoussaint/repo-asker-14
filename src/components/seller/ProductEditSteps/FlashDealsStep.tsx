import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FlashDealsStepProps {
  formData: {
    flash_deal: boolean;
    flash_start_time: string;
    flash_end_time: string;
    flash_discount: string;
  };
  onInputChange: (field: string, value: any) => void;
}

export const FlashDealsStep: React.FC<FlashDealsStepProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Flash Deals</h3>
        <p className="text-sm text-muted-foreground">
          Set up time-limited promotional offers
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enable Flash Deal</CardTitle>
              <CardDescription>
                Create limited-time offers to boost sales
              </CardDescription>
            </div>
            <Switch
              checked={formData.flash_deal}
              onCheckedChange={(checked) => onInputChange('flash_deal', checked)}
            />
          </div>
        </CardHeader>

        {formData.flash_deal && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Flash Discount (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.flash_discount}
                onChange={(e) => onInputChange('flash_discount', e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.flash_start_time}
                  onChange={(e) => onInputChange('flash_start_time', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>End Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.flash_end_time}
                  onChange={(e) => onInputChange('flash_end_time', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Flash Deal Preview</h4>
              <p className="text-sm text-blue-700">
                {formData.flash_discount}% off for a limited time!
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Deal runs from {formData.flash_start_time ? new Date(formData.flash_start_time).toLocaleString() : 'Not set'} 
                {' '}to {formData.flash_end_time ? new Date(formData.flash_end_time).toLocaleString() : 'Not set'}
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};