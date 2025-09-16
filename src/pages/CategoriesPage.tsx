import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AliExpressHeader from "@/components/home/AliExpressHeader";

// Type definitions
interface SubCategory {
  id: string;
  name: string;
  imageUrl: string;
  isHot?: boolean;
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

const CATEGORIES: Category[] = [
  {
    id: "men",
    name: "Men's Clothing",
    subCategories: [
      { id: "suits", name: "Men's Suits & Separates", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "tshirts", name: "Men's T-Shirts", imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "shoes", name: "Men's Shoes", imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "underwear", name: "Men's Underwear & Sleepwear", imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=150&h=150&auto=format&fit=crop" },
    ]
  },
  {
    id: "women",
    name: "Women's Clothing",
    subCategories: [
      { id: "dresses", name: "Women's Dresses", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=150&h=150&auto=format&fit=crop", isHot: true },
      { id: "tshirts", name: "Women's T-Shirt", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "jewelry", name: "Women's Jewelry", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=150&h=150&auto=format&fit=crop", isHot: true },
      { id: "curve", name: "Women's Curve Clothing", imageUrl: "https://images.unsplash.com/photo-1610030469668-76d3f13ebad5?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "shoes", name: "Women's Shoes", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "lingerie", name: "Women's Lingerie & Lounge", imageUrl: "https://images.unsplash.com/photo-1619547871259-fd2ca7253ede?q=80&w=150&h=150&auto=format&fit=crop" },
    ]
  },
  {
    id: "home",
    name: "Home & Kitchen",
    subCategories: [
      { id: "decor", name: "Home Decor Products", imageUrl: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "livingroom", name: "Living Room Furniture", imageUrl: "https://images.unsplash.com/photo-1567016376408-0226e4d0b1ea?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "bedroom", name: "Bedroom Furniture", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "patio", name: "Patio Furniture", imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "bedding", name: "Bedding", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "storage", name: "Home Storage & Organization", imageUrl: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "kitchen", name: "Kitchen Storage & Organization", imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=150&h=150&auto=format&fit=crop" },
    ]
  },
  {
    id: "sports",
    name: "Sports & Outdoors",
    subCategories: [
      { id: "camping", name: "Camping & Hiking", imageUrl: "https://images.unsplash.com/photo-1471542550801-a7523dede1a2?q=80&w=150&h=150&auto=format&fit=crop" },
      { id: "outdoor", name: "Outdoor Lighting", imageUrl: "https://images.unsplash.com/photo-1593152167544-085d3b9c4938?q=80&w=150&h=150&auto=format&fit=crop", isHot: true },
    ]
  },
  {
    id: "event",
    name: "Event & Party",
    subCategories: [
      { id: "supplies", name: "Event & Party Supplies", imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=150&h=150&auto=format&fit=crop" },
    ]
  },
  {
    id: "jewelry",
    name: "Jewelry & Accessories",
    subCategories: [
      { id: "jewelry", name: "Jewelry & Accessories", imageUrl: "https://images.unsplash.com/photo-1603974795126-ef18c83e7902?q=80&w=150&h=150&auto=format&fit=crop" },
    ]
  },
  {
    id: "beauty",
    name: "Beauty & Fashion",
    subCategories: [
      { id: "beauty", name: "Beauty Products", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=150&h=150&auto=format&fit=crop", isHot: true },
    ]
  },
];

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].id);

  // Filter subcategories based on the selected category
  const selectedCategoryData = CATEGORIES.find(cat => cat.id === selectedCategory);
  const subCategories = selectedCategoryData?.subCategories || [];

  return (
    <div className="max-w-screen overflow-hidden pb-16 relative bg-gray-50">
      {/* Header with no specific activeTabId */}
      <AliExpressHeader />
      
      <div className="pt-[70px]">
        <div className="max-w-7xl mx-auto px-3 mt-4">
          {/* Shop by category heading */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Shop by category</h1>
          </div>
          
          <div className="flex">
            {/* Left sidebar - Vertical category list */}
            <div className="w-1/3 md:w-1/4 lg:w-1/5 pr-2 md:pr-4">
              <div className="bg-white rounded-md overflow-hidden">
                <ScrollArea className="h-[calc(100vh-190px)]">
                  <ul className="py-2">
                    {/* Featured section */}
                    <li>
                      <div className="px-4 py-2 bg-orange-100 text-orange-800 font-semibold">
                        Featured
                      </div>
                    </li>
                    
                    {/* Category list */}
                    {CATEGORIES.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() => setSelectedCategory(category.id)}
                          className={cn(
                            "w-full text-left px-4 py-3 text-sm transition-colors border-b border-gray-100",
                            selectedCategory === category.id 
                              ? "bg-gray-50 text-gray-900 font-medium" 
                              : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </div>
            
            {/* Right content - Grid of subcategories with circular images */}
            <div className="w-2/3 md:w-3/4 lg:w-4/5 pl-2 md:pl-4">
              <div className="bg-white rounded-md p-4">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                  {subCategories.map((subCategory) => (
                    <a 
                      key={subCategory.id}
                      href={`/${selectedCategory}?subcategory=${subCategory.id}`}
                      className="flex flex-col items-center"
                    >
                      <div className="relative mb-2">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-gray-200">
                          <img 
                            src={subCategory.imageUrl} 
                            alt={subCategory.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {subCategory.isHot && (
                          <Badge className="absolute -top-1 -right-1 bg-orange-500 hover:bg-orange-500 text-[10px] px-1.5 border-none">
                            HOT
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-center text-gray-800">{subCategory.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}