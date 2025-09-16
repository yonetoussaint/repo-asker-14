import React, { useRef } from 'react';

// Category shortcut component
const CategoryShortcut = ({ category, navigate }) => {
  return (
    <div 
      className="flex flex-col items-center w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => navigate(`/sports/${category.id}`)}
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

const SportsSubcategories = () => {
  const rowRef = useRef(null);

  // Mock navigate function
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  // Sports & Outdoors subcategories data
  const sportsCategories = [
    { 
      id: 'fitness', 
      name: 'Fitness Equipment', 
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-red-100', 
      iconBg: 'bg-red-500', 
      labelBg: 'bg-red-600/90' 
    },
    { 
      id: 'outdoor-gear', 
      name: 'Outdoor Gear', 
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-green-100', 
      iconBg: 'bg-green-500', 
      labelBg: 'bg-green-600/90' 
    },
    { 
      id: 'cycling', 
      name: 'Cycling', 
      image: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-blue-100', 
      iconBg: 'bg-blue-500', 
      labelBg: 'bg-blue-600/90' 
    },
    { 
      id: 'running', 
      name: 'Running', 
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d2d?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-orange-100', 
      iconBg: 'bg-orange-500', 
      labelBg: 'bg-orange-600/90' 
    },
    { 
      id: 'water-sports', 
      name: 'Water Sports', 
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-teal-100', 
      iconBg: 'bg-teal-500', 
      labelBg: 'bg-teal-600/90' 
    },
    { 
      id: 'team-sports', 
      name: 'Team Sports', 
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-purple-100', 
      iconBg: 'bg-purple-500', 
      labelBg: 'bg-purple-600/90' 
    },
    { 
      id: 'winter-sports', 
      name: 'Winter Sports', 
      image: 'https://images.unsplash.com/photo-1551524164-6cf533eb73a4?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-indigo-100', 
      iconBg: 'bg-indigo-500', 
      labelBg: 'bg-indigo-600/90' 
    },
    { 
      id: 'camping', 
      name: 'Camping', 
      image: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-amber-100', 
      iconBg: 'bg-amber-500', 
      labelBg: 'bg-amber-600/90' 
    },
    { 
      id: 'yoga', 
      name: 'Yoga & Pilates', 
      image: 'https://images.unsplash.com/photo-1506629905607-c28660f5b39a?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-pink-100', 
      iconBg: 'bg-pink-500', 
      labelBg: 'bg-pink-600/90' 
    },
    { 
      id: 'golf', 
      name: 'Golf', 
      image: 'https://images.unsplash.com/photo-1530028828-25e8270681ed?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-green-100', 
      iconBg: 'bg-green-500', 
      labelBg: 'bg-green-600/90' 
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
          {sportsCategories.map(category => (
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

export default SportsSubcategories;