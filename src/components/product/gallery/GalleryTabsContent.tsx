import React from 'react';
import { GalleryThumbnails } from '@/components/product/GalleryThumbnails';
import ProductVariants from '@/components/product/ProductVariants';
import CustomerReviewsEnhanced from '@/components/product/CustomerReviewsEnhanced';
import ProductQA from '@/components/product/ProductQA';
import { GalleryItem } from './types';
import ShippingOptionsComponent from '@/components/product/ShippingOptionsComponent';
import SearchInfoComponent from '@/components/product/SearchInfoComponent';
import SectionHeader from '@/components/shared/SectionHeader';
import ReviewGallery from '@/components/product/ReviewGallery';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import StickyCheckoutBar from '@/components/product/StickyCheckoutBar';
import ProductSectionWrapper from '@/components/product/ProductSectionWrapper';

interface GalleryTabsContentProps {
  activeTab: string;
  totalItems: number;
  galleryItems: GalleryItem[];
  currentIndex: number;
  isPlaying: boolean;
  videoIndices: number[];
  productId?: string;
  product?: any;
  onThumbnailClick: (index: number) => void;
  onImageSelect: (imageUrl: string, variantName: string) => void;
  onConfigurationChange: (configData: any) => void;
  onBuyNow?: () => void;
}

const GalleryTabsContent: React.FC<GalleryTabsContentProps> = ({
  activeTab,
  totalItems,
  galleryItems,
  currentIndex,
  isPlaying,
  videoIndices,
  productId,
  product,
  onThumbnailClick,
  onImageSelect,
  onConfigurationChange,
  onBuyNow
}) => {
  // Only show tabs when there's more than 1 item OR when there's a 3D model
  if (!(totalItems > 1 || galleryItems.some(item => item.type === 'model3d'))) {
    return null;
  }

  return (
    <div className="mt-1 w-full">
     {activeTab === 'overview' && (
  <div className="space-y-4">
    <GalleryThumbnails
      images={galleryItems.map(item => item.src)}
      currentIndex={currentIndex}
      onThumbnailClick={onThumbnailClick}
      isPlaying={isPlaying}
      videoIndices={videoIndices}
      galleryItems={galleryItems}
    />

    {/* Search Info Component moved to description's original position */}
    {productId && (
      <ProductSectionWrapper>
        <SearchInfoComponent productId={productId} />
      </ProductSectionWrapper>
    )}

    <ProductSectionWrapper>
      <ReviewGallery />
    </ProductSectionWrapper>

    {/* Description Component moved before BookGenreFlashDeals */}
    {product && product.description && (
      <ProductSectionWrapper>
        <div className="bg-gray-50 rounded-lg p-4">
          <SectionHeader 
            title="Description"
            showViewAll={false}
            className="mb-4"
          />
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      </ProductSectionWrapper>
    )}

    <ProductSectionWrapper>
      <BookGenreFlashDeals 
        compact={true}
        showHeader={true}
        title="More Products"
        className="border border-gray-200 rounded-lg overflow-hidden"
        categories={[
          { id: 'all', label: 'All' },
          { id: 'related', label: 'Related' },
          { id: 'similar', label: 'Similar' },
          { id: 'bestsellers', label: 'Bestsellers' }
        ]}
      />
    </ProductSectionWrapper>

    {/* Sticky Checkout Bar for Overview Tab */}
    {product && onBuyNow && (
      <StickyCheckoutBar
        product={product}
        onBuyNow={onBuyNow}
        selectedColor=""
        selectedStorage=""
        selectedNetwork=""
        selectedCondition=""
        className=""
      />
    )}
  </div>
)}

      {activeTab === 'variants' && (
        <ProductSectionWrapper>
          <ProductVariants 
            productId={productId}
            onImageSelect={onImageSelect}
            onConfigurationChange={onConfigurationChange}
          />
        </ProductSectionWrapper>
      )}

      {activeTab === 'reviews' && (
        <ProductSectionWrapper>
          <CustomerReviewsEnhanced productId={productId || ''} limit={10} />
        </ProductSectionWrapper>
      )}

      {activeTab === 'qna' && ( 
        <ProductSectionWrapper>
          <ProductQA/>
        </ProductSectionWrapper>
      )}

      {activeTab === 'shipping' && (
        <ProductSectionWrapper>
          <div className="w-full space-y-6 py-4">
            <div className="w-full">
              <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Delivery Options</h3>
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center w-full p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-gray-600">Local Delivery</span>
                  <span className="font-semibold text-green-700">1-2 business days</span>
                </div>
                <div className="flex justify-between items-center w-full p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-600">International Shipping</span>
                  <span className="font-semibold text-blue-700">5-10 business days</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Shipping Partners</h3>
              <div className="w-full grid grid-cols-2 gap-3">
                <div className="flex items-center w-full p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">DHL</span>
                  </div>
                  <span className="text-gray-600">DHL Express</span>
                </div>
                <div className="flex items-center w-full p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">FX</span>
                  </div>
                  <span className="text-gray-600">FedEx</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="w-full text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
              <ul className="w-full space-y-2 text-gray-600">
                <li className="flex items-start w-full">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>30-day return window from delivery date</span>
                </li>
                <li className="flex items-start w-full">
                  <span className="text-amber-600 mr-2">•</span>
                  <span>Items must be in original condition with all accessories</span>
                </li>
              </ul>
            </div>
          </div>
        </ProductSectionWrapper>
      )}

      {activeTab === 'recommendations' && (
        <ProductSectionWrapper>
          <BookGenreFlashDeals 
            compact={true}
            showHeader={true}
            title="Recommended Products"
            className="border border-gray-200 rounded-lg overflow-hidden"
            categories={[
              { id: 'recommended', label: 'For You' },
              { id: 'trending', label: 'Trending' },
              { id: 'popular', label: 'Popular' },
              { id: 'new', label: 'New Arrivals' }
            ]}
          />
        </ProductSectionWrapper>
      )}
    </div>
  );
};

export default GalleryTabsContent;