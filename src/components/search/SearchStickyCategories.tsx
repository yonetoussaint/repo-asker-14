
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Headphones, Watch, Shirt, Home, Camera, Gift } from 'lucide-react';

const SearchStickyCategories = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  
  // Category data with icons
  const categories = [
    { name: "Electronics", icon: <Smartphone className="h-5 w-5" /> },
    { name: "Computers", icon: <Laptop className="h-5 w-5" /> },
    { name: "Audio", icon: <Headphones className="h-5 w-5" /> },
    { name: "Wearables", icon: <Watch className="h-5 w-5" /> },
    { name: "Fashion", icon: <Shirt className="h-5 w-5" /> },
    { name: "Home", icon: <Home className="h-5 w-5" /> },
    { name: "Cameras", icon: <Camera className="h-5 w-5" /> },
    { name: "Gifts", icon: <Gift className="h-5 w-5" /> },
  ];
  
  return (
    <div className="overflow-x-auto no-scrollbar">
      <motion.div 
        className="flex items-center py-2 px-3 space-x-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className={`flex flex-col items-center py-2 px-3 cursor-pointer ${
              activeCategory === index ? 'text-red-500' : 'text-gray-500'
            }`}
            onClick={() => setActiveCategory(index)}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-1 ${
              activeCategory === index ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              {category.icon}
            </div>
            <span className="text-[10px]">{category.name}</span>
            {activeCategory === index && (
              <motion.div
                className="h-0.5 w-6 bg-red-500 mt-1 rounded-full"
                layoutId="activeCategory"
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchStickyCategories;
