import React, { useState, useEffect, useRef } from "react";
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useProduct, useProductAnalytics } from "@/hooks/useProduct";
import { trackProductView } from "@/integrations/supabase/products";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import ProductHeader from "@/components/product/ProductHeader";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductSectionWrapper from "@/components/product/ProductSectionWrapper";

import PricingSection from '@/components/product/PricingSection';
import ProductQuantitySelector from "@/components/product/ProductQuantitySelector";
import ShippingOptionsComponent from '@/components/product/ShippingOptionsComponent';
import ProductDetailsTabs from '@/components/product/ProductDetailsTabs';
import ProductReviews from '@/components/product/ProductReviews';

import SellerInfo from '@/components/product/SellerInfo';

const DEFAULT_PRODUCT_ID = "280df32f-5ec2-4d65-af11-6be19a40cc77"; // Product with actual reviews
const MAX_QUANTITY = 250;

const SingleProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [maxQuantityReached, setMaxQuantityReached] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [focusMode, setFocusMode] = useState(false);
  const [showHeaderInFocus, setShowHeaderInFocus] = useState(false);

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id: paramId } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const productId = paramId || DEFAULT_PRODUCT_ID;

  const { data: product, isLoading } = useProduct(productId);
  const { data: analytics, isLoading: analyticsLoading } = useProductAnalytics(productId);

  // Debug logging for 3D model
  console.log('🎯 SingleProductDetail: Product data:', product);
  console.log('🎯 SingleProductDetail: model_3d_url:', product?.model_3d_url);

  const triggerHaptic = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  const incrementQuantity = async () => {
    if (quantity < MAX_QUANTITY) {
      await triggerHaptic();
      setQuantity(prev => prev + 1);
      if (quantity === MAX_QUANTITY - 1) {
        setMaxQuantityReached(true);
        toast({
          title: "Maximum quantity reached",
          description: "You've reached the maximum allowed quantity for this item.",
          variant: "destructive"
        });
      }
    }
  };

  const decrementQuantity = async () => {
    if (quantity > 1) {
      await triggerHaptic();
      setQuantity(prev => prev - 1);
      if (maxQuantityReached) {
        setMaxQuantityReached(false);
      }
    }
  };

  const buyNow = async () => {
    await triggerHaptic();
    
    const checkoutParams = new URLSearchParams({
      productName: product?.name || "Product",
      quantity: quantity.toString(),
      price: (product?.discount_price || product?.price || 0).toString(),
    });
    
    navigate(`/product-checkout?${checkoutParams.toString()}`);
  };

  const scrollToSection = (section: string) => {
    const refs = {
      overview: overviewRef,
      description: descriptionRef,
      reviews: reviewsRef
    };
    
    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      const yOffset = -80;
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveSection(section);
  };

  // Track product view on component mount
  useEffect(() => {
    console.log(`🚀 SingleProductDetail: Component mounted with productId: ${productId}`);
    
    if (productId) {
      console.log(`📊 SingleProductDetail: Tracking view for product: ${productId}`);
      trackProductView(productId)
        .then(() => {
          console.log('✅ SingleProductDetail: Product view tracked successfully');
          // Invalidate the product query to refresh the view count in the UI
          queryClient.invalidateQueries({ queryKey: ['product', productId] });
        })
        .catch((error) => {
          console.error('❌ SingleProductDetail: Error tracking product view:', error);
        });
    } else {
      console.warn('⚠️ SingleProductDetail: No productId available for tracking');
    }
  }, [productId, queryClient]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      
      // Handle focus mode header visibility
      if (focusMode && window.scrollY > 100) {
        setShowHeaderInFocus(true);
      } else if (focusMode && window.scrollY <= 50) {
        setShowHeaderInFocus(false);
      }
      
      if (reviewsRef.current && scrollPosition >= reviewsRef.current.offsetTop) {
        setActiveSection("reviews");
      } else if (descriptionRef.current && scrollPosition >= descriptionRef.current.offsetTop) {
        setActiveSection("description");
      } else {
        setActiveSection("overview");
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [focusMode]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const productImages = product?.product_images?.map(img => img.src) || [];
  const currentPrice = product?.discount_price || product?.price || 0;
  
  return (
    <div className="flex flex-col min-h-screen bg-white overscroll-none overflow-x-hidden" ref={contentRef}>
      <ProductHeader 
        activeSection={activeSection}
        onTabChange={scrollToSection}
        focusMode={focusMode}
        showHeaderInFocus={showHeaderInFocus}
      />
      
      <div className="relative w-full bg-transparent" ref={overviewRef}>
        <ProductImageGallery 
          images={productImages.length > 0 ? productImages : ["/placeholder.svg"]} 
          videos={product?.product_videos}
          model3dUrl={product?.model_3d_url}
          focusMode={focusMode}
          onFocusModeChange={setFocusMode}
          seller={product?.sellers}
          product={product}
          onSellerClick={() => {
            console.log('🔍 Seller click - seller data:', product?.sellers);
            console.log('🔍 Seller ID:', product?.sellers?.id);
            if (product?.sellers?.id) {
              navigate(`/seller/${product?.sellers?.id}`);
            } else {
              console.error('❌ No seller ID found');
            }
          }}
        />
      </div>

      <div className="flex-1 overscroll-none">
        <div className="bg-white pb-20">
          
          <ProductSectionWrapper>
            <ProductQuantitySelector 
              quantity={quantity}
              onQuantityChange={(newQuantity) => setQuantity(newQuantity)}
              price={currentPrice}
              maxQuantity={MAX_QUANTITY}
              minQuantity={1}
              inStock={product?.inventory || 0}
              productName={product?.name}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
            />
          </ProductSectionWrapper>
          

          <ProductSectionWrapper>
            <ShippingOptionsComponent />
          </ProductSectionWrapper>
          
          <ProductSectionWrapper ref={descriptionRef}>
            <ProductDetailsTabs />
          </ProductSectionWrapper>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <div className="px-4 py-3">
          <Button 
            onClick={buyNow}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-full font-medium text-base hover:opacity-90"
          >
            Proceed to checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductDetail;