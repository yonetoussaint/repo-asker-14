import React from 'react';
import OverviewTab from './tabs/OverviewTab';
import SpecificationsTab from './tabs/SpecificationsTab';
import ShippingTab from './tabs/ShippingTab';
import ReviewsTab from './tabs/ReviewsTab';
import { Product } from '@/types/product';

interface TabContentProps {
  activeTab: string;
  product: Product;
  productId: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, product, productId }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab product={product} />;
      case 'specifications':
        return <SpecificationsTab product={product} />;
      case 'shipping':
        return <ShippingTab />;
      case 'reviews':
        return <ReviewsTab productId={productId} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full px-6 py-6">
      {renderTabContent()}
    </div>
  );
};

export default TabContent;