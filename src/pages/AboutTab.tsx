
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';

interface AboutTabProps {
  seller: any;
}

const AboutTab: React.FC<AboutTabProps> = ({ seller }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Business Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span>{seller.category || 'General'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Since</span>
              <span>{formatDate(seller.created_at || new Date().toISOString()).split(' ')[1]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={seller.verified ? "default" : "secondary"} className="text-xs">
                {seller.verified ? "Verified" : "Pending"}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Performance</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trust Score</span>
              <span className="font-medium">{seller.trust_score}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sales</span>
              <span className="font-medium">{formatNumber(seller.total_sales)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rating</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{seller.rating?.toFixed(1) || '4.8'}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-sm">About</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {seller.description || "This seller hasn't provided additional details yet."}
        </p>
      </Card>
    </div>
  );
};

export default AboutTab;