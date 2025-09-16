import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus } from 'lucide-react';

interface BundleTier {
  min: number;
  max: number | null;
  discount: number;
  isMinimum?: boolean;
}

interface BundleDealsEditorProps {
  bundleDeals: BundleTier[];
  onUpdate: (bundleDeals: BundleTier[]) => void;
}

export const BundleDealsEditor = ({ bundleDeals, onUpdate }: BundleDealsEditorProps) => {
  const [tiers, setTiers] = useState<BundleTier[]>(
    bundleDeals.length > 0 ? bundleDeals : [
      { min: 1, max: 9, discount: 0, isMinimum: true }
    ]
  );

  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMin = lastTier ? (lastTier.max || lastTier.min) + 1 : 1;
    
    setTiers([...tiers, {
      min: newMin,
      max: newMin + 49,
      discount: 5,
      isMinimum: false
    }]);
  };

  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index));
    }
  };

  const updateTier = (index: number, field: keyof BundleTier, value: any) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setTiers(updatedTiers);
  };

  const handleSave = () => {
    onUpdate(tiers);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bundle Deals Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tiers.map((tier, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Tier {index + 1}</h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={tier.isMinimum || false}
                    onCheckedChange={(checked) => updateTier(index, 'isMinimum', checked)}
                  />
                  <Label className="text-sm">Minimum Order</Label>
                </div>
                {tiers.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTier(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Minimum Quantity</Label>
                <Input
                  type="number"
                  value={tier.min}
                  onChange={(e) => updateTier(index, 'min', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Maximum Quantity</Label>
                <Input
                  type="number"
                  value={tier.max || ''}
                  placeholder="Unlimited"
                  onChange={(e) => updateTier(index, 'max', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>
            
            <div>
              <Label>Discount Percentage (%)</Label>
              <Input
                type="number"
                value={tier.discount}
                min="0"
                max="100"
                onChange={(e) => updateTier(index, 'discount', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        ))}
        
        <div className="flex gap-2">
          <Button onClick={addTier} variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Tier
          </Button>
          <Button onClick={handleSave}>
            Save Bundle Deals
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleDealsEditor;