
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface ReviewsTabProps {
  seller: any;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ seller }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center sm:col-span-1">
          <div className="text-2xl font-bold mb-1">{seller.rating?.toFixed(1) || '4.8'}</div>
          <div className="flex justify-center mb-2">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{formatNumber(seller.total_sales)} reviews</p>
        </Card>

        <div className="sm:col-span-2 space-y-2">
          {[5,4,3,2,1].map((rating) => (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-4">{rating}★</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                />
              </div>
              <span className="w-8 text-xs text-muted-foreground">{rating === 5 ? '70%' : rating === 4 ? '20%' : '5%'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Recent Reviews</h3>
        {[1,2,3].map((review) => (
          <Card key={review} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">U{review}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Customer {review}</span>
                  <span className="text-xs text-muted-foreground">2d ago</span>
                </div>
                <div className="flex mb-2">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Great products and fast shipping. Highly recommend!
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;