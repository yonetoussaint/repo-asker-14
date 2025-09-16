import React, { useRef } from 'react';
import { ChevronRight, Tv, Smartphone, Coffee, Headphones, Watch, Speaker, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/integrations/supabase/products';
import SectionHeader from './SectionHeader';

interface SuperDealsProps {
  products?: Product[];
  onProductClick?: (productId: string) => void; // Added prop
}

const SuperDeals = ({ products = [], onProductClick }: SuperDealsProps) => {
  const scrollContainerRef = useRef(null);

  // Filter products with discount_price and with at least one product_image
  const discountedProducts = products
    .filter(product => 
      product.discount_price !== null && 
      product.product_images && 
      product.product_images.length > 0
    )
    .slice(0, 9); // Limit to 9 products for display

  // Fallback icons for products without specific category
  const categoryIcons = {
    tv: <Tv size={24} color="white" />,
    phone: <Smartphone size={24} color="white" />,
    coffee: <Coffee size={24} color="white" />,
    headphones: <Headphones size={24} color="white" />,
    watch: <Watch size={24} color="white" />,
    speaker: <Speaker size={24} color="white" />
  };

  // Colors for deal tiles
  const colors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", 
    "bg-red-500", "bg-yellow-500", "bg-indigo-500",
    "bg-pink-500", "bg-blue-400", "bg-gray-500"
  ];

  // Map products to deal format with images from database
  const deals = discountedProducts.map((product, index) => {
    // Calculate discount percentage
    const discountPercent = product.discount_price 
      ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
      : 0;

    // Get first product image or use default
    const image = product.product_images && product.product_images.length > 0 
      ? product.product_images[0] 
      : null;

    // Determine which icon to show based on product name (simple logic)
    let iconComponent;
    const productNameLower = product.name.toLowerCase();
    if (productNameLower.includes('tv')) iconComponent = categoryIcons.tv;
    else if (productNameLower.includes('phone')) iconComponent = categoryIcons.phone;
    else if (productNameLower.includes('coffee')) iconComponent = categoryIcons.coffee;
    else if (productNameLower.includes('earbuds') || productNameLower.includes('headphone')) iconComponent = categoryIcons.headphones;
    else if (productNameLower.includes('watch')) iconComponent = categoryIcons.watch;
    else if (productNameLower.includes('speaker')) iconComponent = categoryIcons.speaker;
    else {
      // Default to using the index to pick an icon
      const iconKeys = Object.keys(categoryIcons);
      const iconKey = iconKeys[index % iconKeys.length];
      iconComponent = categoryIcons[iconKey];
    }

    return {
      id: product.id,
      title: product.name,
      currentPrice: product.discount_price,
      originalPrice: product.price,
      discount: discountPercent,
      color: colors[index % colors.length],
      icon: iconComponent,
      shortLabel: product.name.split(' ')[0],
      image: image?.src
    };
  });

  // Group deals into columns of 3
  const groupedDeals = [];
  for (let i = 0; i < deals.length; i += 3) {
    groupedDeals.push(deals.slice(i, i + 3));
  }

  // Function to render a product card
  const renderProductCard = (deal) => (
    // Modified to call onProductClick and prevent default navigation
    <div key={deal.id} onClick={() => onProductClick?.(deal.id)} className="block cursor-pointer">
      <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute top-0 left-0 bg-orange-500 text-white px-2 py-1 text-xs font-bold rounded-br">
              SUPER
            </div>
            {deal.image ? (
              <div className={`${deal.color} p-2 w-24 h-24 flex items-center justify-center overflow-hidden`}>
                <img 
                  src={deal.image} 
                  alt={deal.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className={`${deal.color} p-2 w-24 h-24 flex items-center justify-center`}>
                <div className="flex flex-col items-center">
                  {deal.icon}
                  <span className="text-xs font-medium text-white mt-1 text-center">
                    {deal.shortLabel}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-2 flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 text-xs mb-1 whitespace-nowrap overflow-hidden text-ellipsis pr-1" title={deal.title}>
              {deal.title}
            </h3>
            <div className="flex flex-col">
              <span className="text-base font-bold text-orange-500">
                US ${deal.currentPrice}
              </span>
              <span className="text-gray-500 line-through text-xs">
                US ${deal.originalPrice}
              </span>
              <span className="mt-1 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded inline-block w-fit">
                {deal.discount}% OFF
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show placeholder message if no deals available
  if (groupedDeals.length === 0) {
    return (
      <div className="w-full bg-white">
        <SectionHeader
          title="SUPER DEALS"
          icon={Star}
          viewAllLink="/super-deals"
          viewAllText="View All"
        />
        <div className="px-4 pb-4">
          <div className="p-4 border border-gray-200 rounded text-center text-gray-500">
            No deals available at the moment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Use SectionHeader component */}
      <SectionHeader
        title="SUPER DEALS"
        icon={Star}
        viewAllLink="/super-deals"
        viewAllText="View All"
      />

      {/* Edge-to-edge container for scrolling, with left padding pl-2 */}
      <div 
        className="flex overflow-x-auto pl-2 scrollbar-none w-full"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '8px'
        }}
        ref={scrollContainerRef}
      >
        {groupedDeals.map((column, colIndex) => (
          <div 
            key={`column-${colIndex}`}
            className="flex-shrink-0 w-64 mr-[3vw]"
            style={{ scrollSnapAlign: 'start' }}
          >
            {column.map(deal => renderProductCard(deal))}
          </div>
        ))}

        {/* Add right spacing for proper scrolling to the end */}
        <div className="flex-shrink-0 w-2"></div>
      </div>
    </div>
  );
};

export default SuperDeals;