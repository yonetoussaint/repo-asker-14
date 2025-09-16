import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { BundleDealsEditor } from '../BundleDealsEditor';

interface DetailsStepProps {
  formData: {
    tags: string[];
    bundle_deals: any[];
    bundle_deals_enabled: boolean;
  };
  onInputChange: (field: string, value: any) => void;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({
  formData,
  onInputChange
}) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      onInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Product Details</h3>
        <p className="text-sm text-muted-foreground">
          Add tags and configure bundle deals for your product
        </p>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <Label>Tags</Label>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            Add
          </Button>
        </div>
      </div>

      {/* Bundle Deals Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="bundle-deals-toggle">Bundle Deals</Label>
            <p className="text-sm text-muted-foreground">
              Enable bundle pricing for bulk orders
            </p>
          </div>
          <Switch
            id="bundle-deals-toggle"
            checked={formData.bundle_deals_enabled}
            onCheckedChange={(checked) => onInputChange('bundle_deals_enabled', checked)}
          />
        </div>
      </div>

      {/* Bundle Deals Editor - Only show when enabled */}
      {formData.bundle_deals_enabled && (
        <BundleDealsEditor
          bundleDeals={formData.bundle_deals}
          onUpdate={(bundleDeals) => onInputChange('bundle_deals', bundleDeals)}
        />
      )}
    </div>
  );
};