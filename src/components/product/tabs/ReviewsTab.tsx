import React from 'react';
import CustomerReviewsEnhanced from '../CustomerReviewsEnhanced';

interface ReviewsTabProps {
  productId: string;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ productId }) => {
  return (
    <div className="w-full py-4">
      <CustomerReviewsEnhanced productId={productId} limit={10} />
    </div>
  );
};

export default ReviewsTab;