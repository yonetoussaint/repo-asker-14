// ProductDescription.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import ReactCodeRenderer from './ReactCodeRenderer';

interface ProductDescriptionProps {
  showFullContent?: boolean;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ showFullContent = false }) => {
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();
  const { data: product } = useProduct(paramId || '');

  if (!product) return null;

  const handleSeeFullDescription = () => {
    navigate(`/product/${paramId}/description`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Product Description</h3>
        <button 
          onClick={handleSeeFullDescription}
          className="bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full text-gray-600 font-medium text-sm"
        >
          See Full Description
        </button>
      </div>

      {/* Main Description Block */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-gray-900">{product.name}</h4>
        {product.description ? (
          <ReactCodeRenderer 
            code={product.description}
            product={product}
          />
        ) : (
          <div className="text-gray-500 italic">
            No description available for this product.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;