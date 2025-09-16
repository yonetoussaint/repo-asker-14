import React, { useRef } from 'react';

// Category shortcut component
const CategoryShortcut = ({ category, navigate }) => {
  return (
    <div 
      className="flex flex-col items-center w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => navigate(`/home/${category.id}`)}
    >
      <div className="relative w-14 h-14 rounded-lg overflow-hidden shadow-sm">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs font-medium text-gray-700 text-center truncate w-full leading-snug mt-1">
        {category.name}
      </span>
    </div>
  );
};

const HomeSubcategories = () => {
  const rowRef = useRef(null);

  // Mock navigate function
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  // Home & Living subcategories data
  const homeCategories = [
    { 
      id: 'furniture', 
      name: 'Furniture', 
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-amber-100', 
      iconBg: 'bg-amber-500', 
      labelBg: 'bg-amber-600/90' 
    },
    { 
      id: 'kitchen', 
      name: 'Kitchen & Dining', 
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-red-100', 
      iconBg: 'bg-red-500', 
      labelBg: 'bg-red-600/90' 
    },
    { 
      id: 'bedding', 
      name: 'Bedding', 
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-blue-100', 
      iconBg: 'bg-blue-500', 
      labelBg: 'bg-blue-600/90' 
    },
    { 
      id: 'bathroom', 
      name: 'Bathroom', 
      image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-teal-100', 
      iconBg: 'bg-teal-500', 
      labelBg: 'bg-teal-600/90' 
    },
    { 
      id: 'lighting', 
      name: 'Lighting', 
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-yellow-100', 
      iconBg: 'bg-yellow-500', 
      labelBg: 'bg-yellow-600/90' 
    },
    { 
      id: 'storage', 
      name: 'Storage', 
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-gray-100', 
      iconBg: 'bg-gray-500', 
      labelBg: 'bg-gray-600/90' 
    },
    { 
      id: 'garden', 
      name: 'Garden & Outdoor', 
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-green-100', 
      iconBg: 'bg-green-500', 
      labelBg: 'bg-green-600/90' 
    },
    { 
      id: 'appliances', 
      name: 'Appliances', 
      image: 'https://images.unsplash.com/photo-1571175351991-b8de32b43999?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-purple-100', 
      iconBg: 'bg-purple-500', 
      labelBg: 'bg-purple-600/90' 
    },
    { 
      id: 'decor', 
      name: 'Home Decor', 
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-pink-100', 
      iconBg: 'bg-pink-500', 
      labelBg: 'bg-pink-600/90' 
    },
    { 
      id: 'cleaning', 
      name: 'Cleaning', 
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-indigo-100', 
      iconBg: 'bg-indigo-500', 
      labelBg: 'bg-indigo-600/90' 
    }
  ];

  return (
    <div className="w-full bg-white">
      <div className="py-3 bg-white">
        <div 
          ref={rowRef}
          className="flex overflow-x-auto pl-2 scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '8px'
          }}
        >
          {homeCategories.map(category => (
            <div 
              key={category.id}
              className="flex-shrink-0 mr-[3vw]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <CategoryShortcut category={category} navigate={navigate} />
            </div>
          ))}
          
          {/* Add right spacing for proper scrolling to the end */}
          <div className="flex-shrink-0 w-2"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeSubcategories;