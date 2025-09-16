import React from 'react';
import { useParams } from 'react-router-dom';
import CustomerReviewsEnhanced from './CustomerReviewsEnhanced';

interface CustomerReviewsProps {
  productId?: string;
  limit?: number;
}

const CustomerReviews = ({ productId: propProductId, limit }: CustomerReviewsProps = {}) => {
  const { id: paramId } = useParams<{ id: string }>();
  const DEFAULT_PRODUCT_ID = "280df32f-5ec2-4d65-af11-6be19a40cc77";
  
  const productId = propProductId || paramId || DEFAULT_PRODUCT_ID;

  return <CustomerReviewsEnhanced productId={productId} limit={limit} />;
};

export default CustomerReviews;