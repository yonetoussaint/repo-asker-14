import React from 'react';
import { Package, Users, TrendingUp, Award } from 'lucide-react';
import type { Seller } from '@/integrations/supabase/sellers';

interface SellerStatsProps {
  seller: Seller;
}

const SellerStats: React.FC<SellerStatsProps> = ({ seller }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateRating = () => {
    return seller.rating || 4.8;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center space-y-1">
        <Package className="w-5 h-5 mx-auto text-muted-foreground" />
        <p className="text-sm font-medium">{formatNumber(seller.total_sales)}</p>
        <p className="text-xs text-muted-foreground">Total Sales</p>
      </div>
      <div className="text-center space-y-1">
        <Users className="w-5 h-5 mx-auto text-muted-foreground" />
        <p className="text-sm font-medium">{formatNumber(seller.followers_count)}</p>
        <p className="text-xs text-muted-foreground">Followers</p>
      </div>
      <div className="text-center space-y-1">
        <TrendingUp className="w-5 h-5 mx-auto text-muted-foreground" />
        <p className="text-sm font-medium">{seller.trust_score}%</p>
        <p className="text-xs text-muted-foreground">Trust Score</p>
      </div>
      <div className="text-center space-y-1">
        <Award className="w-5 h-5 mx-auto text-muted-foreground" />
        <p className="text-sm font-medium">{calculateRating()}</p>
        <p className="text-xs text-muted-foreground">Rating</p>
      </div>
    </div>
  );
};

export default SellerStats;