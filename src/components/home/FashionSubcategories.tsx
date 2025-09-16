import React, { useRef } from 'react';

// Category shortcut component
const CategoryShortcut = ({ category, navigate }) => {
  return (
    <div 
      className="flex flex-col items-center w-16 flex-shrink-0 active:opacity-80 transition-opacity touch-manipulation cursor-pointer"
      onClick={() => navigate(`/fashion/${category.id}`)}
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

const FashionSubcategories = () => {
  const rowRef = useRef(null);

  // Mock navigate function
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  // Fashion subcategories data
  const fashionCategories = [
    { 
      id: 'womens-clothing', 
      name: "Women's Clothing", 
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-pink-100', 
      iconBg: 'bg-pink-500', 
      labelBg: 'bg-pink-600/90' 
    },
    { 
      id: 'mens-clothing', 
      name: "Men's Clothing", 
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-blue-100', 
      iconBg: 'bg-blue-500', 
      labelBg: 'bg-blue-600/90' 
    },
    { 
      id: 'shoes', 
      name: 'Shoes', 
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-amber-100', 
      iconBg: 'bg-amber-500', 
      labelBg: 'bg-amber-600/90' 
    },
    { 
      id: 'bags-accessories', 
      name: 'Bags & Accessories', 
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-purple-100', 
      iconBg: 'bg-purple-500', 
      labelBg: 'bg-purple-600/90' 
    },
    { 
      id: 'jewelry', 
      name: 'Jewelry', 
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-yellow-100', 
      iconBg: 'bg-yellow-500', 
      labelBg: 'bg-yellow-600/90' 
    },
    { 
      id: 'watches', 
      name: 'Watches', 
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-gray-100', 
      iconBg: 'bg-gray-500', 
      labelBg: 'bg-gray-600/90' 
    },
    { 
      id: 'sunglasses', 
      name: 'Sunglasses', 
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-indigo-100', 
      iconBg: 'bg-indigo-500', 
      labelBg: 'bg-indigo-600/90' 
    },
    { 
      id: 'sportswear', 
      name: 'Sportswear', 
      image: 'https://images.unsplash.com/photo-1506629905607-c28660f5b39a?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-green-100', 
      iconBg: 'bg-green-500', 
      labelBg: 'bg-green-600/90' 
    },
    { 
      id: 'lingerie', 
      name: 'Lingerie', 
      image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=80&h=80&fit=crop&crop=center', 
      bgColor: 'bg-rose-100', 
      iconBg: 'bg-rose-500', 
      labelBg: 'bg-rose-600/90' 
    },
    { 
      id: 'vintage', 
      name: 'Vintage', 
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&h=80&fit=crop&crop=center', 
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
          {fashionCategories.map(category => (
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

export default FashionSubcategories;