import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  Plus, 
  Store,
  Users, 
} from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import { fetchAllSellers } from "@/integrations/supabase/sellers";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import SectionHeader from './SectionHeader';
import VerificationBadge from "@/components/shared/VerificationBadge";
import ProductSemiPanel from './ProductSemiPanel';


// Utility functions
const formatFollowers = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const getSellerLogoUrl = (imagePath) => {
  if (!imagePath) return "";
  const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
  return data.publicUrl;
};

const getProductImageUrl = (imagePath) => {
  if (!imagePath) return "";
  const { data } = supabase.storage.from('product-images').getPublicUrl(imagePath);
  return data.publicUrl;
};

// Custom Seller Avatar SVG Component
const DefaultSellerAvatar = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shop/Store building outline */}
    <path 
      d="M3 21H21V9L18 6.5L15 4L12 6.5L9 4L6 6.5L3 9V21Z" 
      fill="#E5E7EB" 
      stroke="#9CA3AF" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Store front */}
    <path 
      d="M6 21V12H10V21" 
      fill="#F3F4F6" 
      stroke="#9CA3AF" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M14 21V12H18V21" 
      fill="#F3F4F6" 
      stroke="#9CA3AF" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Awning/roof detail */}
    <path 
      d="M2 9H22" 
      stroke="#9CA3AF" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    {/* Windows */}
    <circle cx="8" cy="16.5" r="1" fill="#9CA3AF"/>
    <circle cx="16" cy="16.5" r="1" fill="#9CA3AF"/>
  </svg>
);

// Alternative User/Profile SVG Component
const DefaultProfileAvatar = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Circle background */}
    <circle cx="12" cy="12" r="12" fill="#E5E7EB"/>
    {/* Person silhouette */}
    <circle cx="12" cy="8" r="3" fill="#9CA3AF"/>
    <path 
      d="M6.168 18.849C6.718 16.761 9.143 15.25 12 15.25s5.282 1.511 5.832 3.599" 
      fill="#9CA3AF"
    />
  </svg>
);



// Vendor Card Component
const VendorCard = ({ vendor, onProductClick }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const displayProducts = vendor.products.slice(0, 4);

  const handleProductClick = (productId) => {
    onProductClick(productId);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden hover:border-gray-400 transition-all duration-300">

        {/* Products Grid */}  
        <div className="px-2 pt-2 pb-1 relative">  
          {vendor.discount && (  
            <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">  
              {vendor.discount}  
            </div>  
          )}

          <div className="grid grid-cols-4 gap-1">  
            {displayProducts.map(product => (  
              <button 
                key={product.id} 
                className="group cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >  
                <div className="aspect-square rounded-md border border-gray-100 bg-gray-50 overflow-hidden hover:border-gray-200 transition-colors">  
                  {product.image ? (
                    <img   
                      src={product.image}   
                      alt=""   
                      className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Store size={16} />
                    </div>
                  )}
                </div>
              </button>  
            ))}  
          </div>  
        </div>

        {/* Vendor Info */}
        <div className="px-2 py-1">
          <div className="flex items-center gap-2">

            {/* Vendor Avatar */}
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              {vendor.image && !imageError ? (
                <img   
                  src={vendor.image}   
                  alt={vendor.name}   
                  className="w-full h-full object-cover rounded-full"  
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <DefaultSellerAvatar className="w-6 h-6" />
              )}
            </div>

            {/* Vendor Details */}
            <div className="flex-1 min-w-0">
              {/* Name and Verification */}
              <div className="flex items-center mb-0.5">  
                <h3 className="font-medium text-xs truncate mr-1">{vendor.name}</h3>  
                {vendor.verified && <VerificationBadge />}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">  
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-yellow-500">  
                    <Star size={10} className="fill-yellow-500" />  
                    <span className="font-medium ml-0.5 text-gray-600">{vendor.rating}</span>  
                  </div>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <div className="flex items-center">  
                    <Users size={10} className="mr-0.5" />  
                    {vendor.followers}  
                  </div>
                </div>
                <span className="text-xs font-bold text-white bg-gray-400 px-1.5 py-0.5 rounded-full">#{vendor.rank}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}  
        <div className="px-2 pb-2 grid grid-cols-2 gap-2">  
          <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs font-medium py-1.5 px-2 rounded-full transition-colors">  
            Visit Store  
          </button>  
          <button   
            className={`flex items-center justify-center text-xs font-medium py-1.5 px-2 rounded-full transition-colors ${  
              isFollowing   
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"   
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"  
            }`}  
            onClick={() => setIsFollowing(!isFollowing)}  
          >  
            {isFollowing ? "Following" : "Follow"}  
          </button>  
        </div>
      </div>
    </div>
  );
};

// Custom hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
};

// Main Carousel Component
const VendorCarousel = () => {
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedProductId(null);
  };

  const { data: sellers = [], isLoading: sellersLoading } = useQuery({
    queryKey: ['sellers'],
    queryFn: fetchAllSellers,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  const isLoading = sellersLoading || productsLoading;

  // Transform data
  const vendors = sellers
    .map((seller, index) => {
      const sellerProducts = products
        .filter(product => product.seller_id === seller.id)
        .slice(0, 4)
        .map(product => {
          const productImages = Array.isArray(product.product_images) ? product.product_images : [];
          const firstImage = productImages.length > 0 ? productImages[0] : null;

          return {
            id: product.id,
            image: firstImage?.src || "",
            price: `$${product.price}`,
            discount: product.discount_price ? `${Math.round((1 - product.discount_price / product.price) * 100)}%` : null
          };
        });

      // Handle different types of image URLs
      let imageUrl = "";
      if (seller.image_url) {
        // If it's already a full URL (like Unsplash), use it directly
        if (seller.image_url.startsWith('http')) {
          imageUrl = seller.image_url;
        } else {
          // If it's a filename, get it from Supabase storage
          imageUrl = getSellerLogoUrl(seller.image_url);
        }
      }

      return {
        id: seller.id,
        name: seller.name,
        image: imageUrl,
        verified: seller.verified,
        rating: seller.rating?.toFixed(1) || "0.0",
        sales: seller.total_sales,
        followers: formatFollowers(seller.followers_count),
        category: seller.category || "general",
        discount: seller.category === "flash-deals" ? "30%" : null,
        products: sellerProducts,
        rank: index + 1
      };
    })
    .filter(vendor => vendor.products.length >= 4);

  const cardWidth = isMobile ? "66%" : "33.333%";

  const middleElement = (
    <div className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-0.5 rounded-full backdrop-blur-sm">
      <Users className="w-4 h-4 shrink-0" />
      <span className="whitespace-nowrap">5K+ Vendors</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full relative">
        <SectionHeader
          title="TOP VENDORS"
          icon={Store}
          viewAllLink="/vendors"
          viewAllText="View All"
        />
        <div className="flex overflow-x-auto pl-2 space-x-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-2/3 md:w-1/3 bg-gray-200 rounded-2xl h-40 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <SectionHeader
        title="TOP VENDORS"
        icon={Store}
        viewAllLink="/vendors"
        viewAllText="View All"
      />

      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pl-2 scrollbar-none w-full"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory',
          scrollPaddingLeft: '8px'
        }}
      >
        {vendors.map((vendor) => (
          <div 
            key={vendor.id}
            className="flex-shrink-0 mr-[3vw]"
            style={{ 
              width: cardWidth,
              scrollSnapAlign: 'start'
            }}
          >
            <VendorCard vendor={vendor} onProductClick={handleProductClick} />
          </div>
        ))}

        <div className="flex-shrink-0 w-2"></div>
      </div>

      {/* Product Semi Panel */}
      <ProductSemiPanel
        productId={selectedProductId}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default VendorCarousel;