import React, { useRef } from 'react';

// Category shortcut component
const CategoryShortcut = ({ category, navigate }) => {
  return (
    <div 
      className="flex flex-col items-center w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => navigate(`/entertainment/${category.id}`)}
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

const EntertainmentSubcategories = () => {
  const rowRef = useRef(null);

  // Mock navigate function
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  // Entertainment subcategories data
  const entertainmentCategories = [
    { 
      id: 'gaming-consoles', 
      name: 'Gaming Consoles', 
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-blue-100', 
      iconBg: 'bg-blue-500', 
      labelBg: 'bg-blue-600/90' 
    },
    { 
      id: 'streaming', 
      name: 'Streaming Devices', 
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-red-100', 
      iconBg: 'bg-red-500', 
      labelBg: 'bg-red-600/90' 
    },
    { 
      id: 'books', 
      name: 'Books & E-readers', 
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-amber-100', 
      iconBg: 'bg-amber-500', 
      labelBg: 'bg-amber-600/90' 
    },
    { 
      id: 'music', 
      name: 'Music & Audio', 
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-purple-100', 
      iconBg: 'bg-purple-500', 
      labelBg: 'bg-purple-600/90' 
    },
    { 
      id: 'movies', 
      name: 'Movies & TV', 
      image: 'https://images.unsplash.com/photo-1489599513-cf5b85e6bb43?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-indigo-100', 
      iconBg: 'bg-indigo-500', 
      labelBg: 'bg-indigo-600/90' 
    },
    { 
      id: 'board-games', 
      name: 'Board Games', 
      image: 'https://images.unsplash.com/photo-1611891487948-e218de6e12b0?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-green-100', 
      iconBg: 'bg-green-500', 
      labelBg: 'bg-green-600/90' 
    },
    { 
      id: 'puzzles', 
      name: 'Puzzles', 
      image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-yellow-100', 
      iconBg: 'bg-yellow-500', 
      labelBg: 'bg-yellow-600/90' 
    },
    { 
      id: 'collectibles', 
      name: 'Collectibles', 
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-pink-100', 
      iconBg: 'bg-pink-500', 
      labelBg: 'bg-pink-600/90' 
    },
    { 
      id: 'magazines', 
      name: 'Magazines', 
      image: 'https://images.unsplash.com/photo-1567443024551-6e4ac786ea52?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-teal-100', 
      iconBg: 'bg-teal-500', 
      labelBg: 'bg-teal-600/90' 
    },
    { 
      id: 'art-supplies', 
      name: 'Art & Crafts', 
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-orange-100', 
      iconBg: 'bg-orange-500', 
      labelBg: 'bg-orange-600/90' 
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
          {entertainmentCategories.map(category => (
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

export default EntertainmentSubcategories;