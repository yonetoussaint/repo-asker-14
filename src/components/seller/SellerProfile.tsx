import React from 'react';
import { MapPin, Mail, Phone, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import VerificationBadge from '@/components/shared/VerificationBadge';
import { supabase } from '@/integrations/supabase/client';
import type { Seller } from '@/integrations/supabase/sellers';

interface SellerProfileProps {
  seller: Seller;
}

const SellerProfile: React.FC<SellerProfileProps> = ({ seller }) => {
  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateRating = () => {
    return seller.rating || 4.8;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <img
                src={getSellerLogoUrl(seller.image_url)}
                alt={seller.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
              />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(seller.status)} rounded-full border-2 border-background`}></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{seller.name}</h2>
                {seller.verified && <VerificationBadge />}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{calculateRating()}</span>
                <span>•</span>
                <span>{formatNumber(seller.followers_count)} followers</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            {/* Description */}
            {seller.description && (
              <p className="text-muted-foreground leading-relaxed">
                {seller.description}
              </p>
            )}

            {/* Contact Info */}
            {(seller.email || seller.phone || seller.address) && (
              <div className="space-y-2">
                {seller.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{seller.email}</span>
                  </div>
                )}
                {seller.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{seller.phone}</span>
                  </div>
                )}
                {seller.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{seller.address}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerProfile;