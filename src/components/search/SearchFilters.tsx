
import React from 'react';
import { Check, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SearchFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  ratings: number[];
  toggleRating: (rating: number) => void;
  freeShipping: boolean;
  setFreeShipping: (value: boolean) => void;
}

const SearchFilters = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  toggleCategory,
  ratings,
  toggleRating,
  freeShipping,
  setFreeShipping,
}: SearchFiltersProps) => {
  // Mock data
  const categories = [
    "Electronics", "Fashion", "Home & Garden", "Beauty", "Sports", 
    "Toys & Games", "Automotive", "Office Supplies", "Health"
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants}>
        <Accordion type="single" collapsible defaultValue="price">
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 px-1">
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  max={1000}
                  step={10}
                  onValueChange={(values) => setPriceRange([values[0], values[1]])}
                  className="mb-6"
                />
                <div className="flex justify-between">
                  <div className="border rounded p-2 w-[45%] text-center text-sm">
                    ${priceRange[0]}
                  </div>
                  <div className="border rounded p-2 w-[45%] text-center text-sm">
                    ${priceRange[1]}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="category">
            <AccordionTrigger className="text-sm">Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div 
                    key={category} 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    <span className="text-sm">{category}</span>
                    {selectedCategories.includes(category) && (
                      <Check className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="ratings">
            <AccordionTrigger className="text-sm">Customer Reviews</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div 
                    key={rating} 
                    className={`flex items-center p-2 rounded cursor-pointer ${ratings.includes(rating) ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                    onClick={() => toggleRating(rating)}
                  >
                    <div className="flex items-center">
                      {Array(rating).fill(0).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                      {Array(5 - rating).fill(0).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 text-gray-300" />
                      ))}
                      <span className="ml-2 text-sm">& Up</span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="shipping">
            <AccordionTrigger className="text-sm">Shipping Options</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Free Shipping</span>
                <Switch 
                  checked={freeShipping} 
                  onCheckedChange={setFreeShipping} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
      
      {/* Selected filters display */}
      {(selectedCategories.length > 0 || ratings.length > 0) && (
        <motion.div variants={itemVariants}>
          <h4 className="text-xs text-gray-500 mb-2">Selected Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(category => (
              <Badge key={category} variant="outline" className="cursor-pointer">
                {category}
              </Badge>
            ))}
            
            {ratings.map(rating => (
              <Badge key={rating} variant="outline" className="cursor-pointer">
                {rating}+ Stars
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchFilters;
