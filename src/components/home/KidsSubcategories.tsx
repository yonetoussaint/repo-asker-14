import React, { useRef } from 'react';

// Category shortcut component
const CategoryShortcut = ({ category, navigate }) => {
  return (
    <div 
      className="flex flex-col items-center w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => navigate(`/kids/${category.id}`)}
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

const KidsSubcategories = () => {
  const rowRef = useRef(null);

  // Mock navigate function
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  // Kids & Hobbies subcategories data
  const kidsCategories = [
    { 
      id: 'toys', 
      name: 'Toys', 
      image: 'https://images.unsplash.com/photo-1558877385-bb2e3cc39845?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-yellow-100', 
      iconBg: 'bg-yellow-500', 
      labelBg: 'bg-yellow-600/90' 
    },
    { 
      id: 'baby-care', 
      name: 'Baby Care', 
      image: 'https://images.unsplash.com/photo-1544112502-0f8c62e29426?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-pink-100', 
      iconBg: 'bg-pink-500', 
      labelBg: 'bg-pink-600/90' 
    },
    { 
      id: 'kids-clothing', 
      name: "Kids' Clothing", 
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-blue-100', 
      iconBg: 'bg-blue-500', 
      labelBg: 'bg-blue-600/90' 
    },
    { 
      id: 'educational', 
      name: 'Educational Toys', 
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-green-100', 
      iconBg: 'bg-green-500', 
      labelBg: 'bg-green-600/90' 
    },
    { 
      id: 'outdoor-play', 
      name: 'Outdoor Play', 
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-orange-100', 
      iconBg: 'bg-orange-500', 
      labelBg: 'bg-orange-600/90' 
    },
    { 
      id: 'arts-crafts', 
      name: 'Arts & Crafts', 
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-purple-100', 
      iconBg: 'bg-purple-500', 
      labelBg: 'bg-purple-600/90' 
    },
    { 
      id: 'dolls-figures', 
      name: 'Dolls & Figures', 
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-red-100', 
      iconBg: 'bg-red-500', 
      labelBg: 'bg-red-600/90' 
    },
    { 
      id: 'building-blocks', 
      name: 'Building Blocks', 
      image: 'https://images.unsplash.com/photo-1558060370-b1d2c5ec4eb5?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-indigo-100', 
      iconBg: 'bg-indigo-500', 
      labelBg: 'bg-indigo-600/90' 
    },
    { 
      id: 'musical-toys', 
      name: 'Musical Toys', 
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-teal-100', 
      iconBg: 'bg-teal-500', 
      labelBg: 'bg-teal-600/90' 
    },
    { 
      id: 'school-supplies', 
      name: 'School Supplies', 
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-gray-100', 
      iconBg: 'bg-gray-500', 
      labelBg: 'bg-gray-600/90' 
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
          {kidsCategories.map(category => (
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

export default KidsSubcategories;