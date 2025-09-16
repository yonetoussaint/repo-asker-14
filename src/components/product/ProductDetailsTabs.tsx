import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';
import DragHandle from './DragHandle';
import Overlay from './Overlay';

interface ProductDetailsTabsProps {
  isSheetOpen?: boolean;
  onSheetOpenChange?: (open: boolean) => void;
}

const ProductDetailsTabs: React.FC<ProductDetailsTabsProps> = ({
  isSheetOpen: externalIsSheetOpen,
  onSheetOpenChange
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [internalIsSheetOpen, setInternalIsSheetOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isSheetOpen = externalIsSheetOpen !== undefined ? externalIsSheetOpen : internalIsSheetOpen;
  const setIsSheetOpen = onSheetOpenChange || setInternalIsSheetOpen;

  const { id: paramId } = useParams<{ id: string }>();
  const { data: product } = useProduct(paramId || '');

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isSheetOpen]);

  if (!product) return null;

  return (
    <div className="w-full bg-white overflow-hidden">
      <Overlay isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
      
      {/* Snapping sheet panel */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-[60] bg-background h-[60vh] rounded-t-xl p-0 flex flex-col shadow-lg"
        initial={{ y: "100%" }}
        animate={{ y: isSheetOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        dragMomentum={false}
        dragSnapToOrigin
        onDragEnd={(event, info) => {
          if (info.offset.y > 100) {
            setIsSheetOpen(false);
          }
        }}
        whileDrag={{ scale: 0.98 }}
      >
        {/* Hidden accessibility header */}
        <div className="sr-only">
          <h2>Product Details</h2>
        </div>

        {/* Drag handle indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          <TabContent 
            activeTab={activeTab} 
            product={product} 
            productId={paramId || ''} 
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetailsTabs;