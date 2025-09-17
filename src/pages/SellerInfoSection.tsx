
import React from 'react';
import { Star, Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatDate } from '@/lib/utils';

interface SellerInfoSectionProps {
  seller: any;
  products: any[];
}

const SellerInfoSection: React.FC<SellerInfoSectionProps> = ({ seller, products }) => {
  return (
    <section className="bg-background border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{seller.name}</h1>
                  {seller.verified && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">{seller.description}</p>
              </div>
              <div className="flex items-center gap-2 text-right">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{seller.rating?.toFixed(1) || '4.8'}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatNumber(seller.total_sales)} sales</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Since {formatDate(seller.created_at || new Date().toISOString()).split(' ')[1]}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{formatNumber(seller.followers_count || 0)} followers</span>
              </div>
              {seller.category && (
                <Badge variant="outline" className="text-xs py-0">{seller.category}</Badge>
              )}
            </div>
          </div>

          <div className="flex lg:flex-col gap-3 lg:w-48">
            <div className="flex-1 bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-foreground">{seller.trust_score}/100</div>
              <div className="text-xs text-muted-foreground">Trust Score</div>
            </div>
            <div className="flex-1 bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-foreground">{products.length}</div>
              <div className="text-xs text-muted-foreground">Products</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerInfoSection;