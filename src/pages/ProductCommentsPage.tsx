import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCommentsPageComponent from '@/components/product/ProductCommentsPage';

const ProductCommentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <ProductCommentsPageComponent 
      onClose={handleClose}
      productName="Product Details"
    />
  );
};

export default ProductCommentsPage;