import React from 'react';
import { Product } from '@/types/product';

interface OverviewTabProps {
  product: Product;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ product }) => {
  return (
    <div className="w-full space-y-6 py-4">
      <div className="w-full text-center text-gray-500">
        <p>Additional product information and details</p>
      </div>
    </div>
  );
};

export default OverviewTab;