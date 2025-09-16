import React from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';

interface SellerReviewsTabProps {
  reviews: any[];
  isLoading: boolean;
}

const SellerReviewsTab: React.FC<SellerReviewsTabProps> = ({ reviews, isLoading }) => {
  const formatTimeAgo = (date: string): string => {
    const now = new Date();
    const pastDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - pastDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Mock review data
  const mockReviews = [
    {
      id: '1',
      customer_name: 'John Doe',
      rating: 5,
      comment: 'Excellent service and fast shipping! The product quality exceeded my expectations.',
      created_at: '2024-01-20T10:00:00Z',
      product_name: 'iPhone 15 Pro',
      verified_purchase: true
    },
    {
      id: '2',
      customer_name: 'Sarah Smith',
      rating: 4,
      comment: 'Good quality product, delivery was on time. Would recommend this seller.',
      created_at: '2024-01-19T14:30:00Z',
      product_name: 'Samsung Galaxy Watch',
      verified_purchase: true
    },
    {
      id: '3',
      customer_name: 'Mike Johnson',
      rating: 5,
      comment: 'Amazing seller! Great communication and the product arrived in perfect condition.',
      created_at: '2024-01-18T09:15:00Z',
      product_name: 'AirPods Pro',
      verified_purchase: true
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : mockReviews;

  const averageRating = displayReviews.reduce((sum, review) => sum + review.rating, 0) / displayReviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => 
    displayReviews.filter(review => review.rating === rating).length
  );

  return (
    <div className="p-4">
      {/* Reviews Overview */}
      <div className="bg-white rounded-lg p-4 border border-gray-100 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-orange-400 text-orange-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">Based on {displayReviews.length} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
                    style={{
                      width: `${displayReviews.length > 0 ? (ratingDistribution[index] / displayReviews.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{ratingDistribution[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayReviews.length > 0 ? (
        <div className="space-y-4">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {review.customer_name.charAt(0)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{review.customer_name}</h4>
                    {review.verified_purchase && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-orange-400 text-orange-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      for {review.product_name}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatTimeAgo(review.created_at)}</span>
                    <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500">Customer reviews will appear here once you start selling</p>
        </div>
      )}
    </div>
  );
};

export default SellerReviewsTab;