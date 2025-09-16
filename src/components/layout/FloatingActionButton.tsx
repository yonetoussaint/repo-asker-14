
import React from 'react';
import { Plus, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTransferPage = location.pathname === '/transfer-old';
  const isProductPage = location.pathname.includes('/product/');

  const handleClick = () => {
    if (isProductPage) {
      // Navigate to comments page when on product page
      const currentPath = location.pathname;
      navigate(`${currentPath}/comments`);
    } else {
      // Default behavior for other pages
      onClick();
    }
  };

  return (
    <motion.button
      className={`fixed bottom-24 right-5 z-50 bg-primary text-primary-foreground rounded-full ${
        isTransferPage ? 'px-6 py-3 h-auto' : 'w-14 h-14'
      } flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors`}
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {isTransferPage ? (
        <>
          <Send size={20} className="mr-2" />
          <span className="text-sm font-medium">Send</span>
        </>
      ) : isProductPage ? (
        <MessageSquare size={24} />
      ) : (
        <Plus size={28} />
      )}
    </motion.button>
  );
};

export default FloatingActionButton;
