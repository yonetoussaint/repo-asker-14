import React from "react";
import BookGenreFlashDeals from "@/components/home/BookGenreFlashDeals";

const ProductRelatedSection: React.FC = () => {
  return (
    <div className="w-full">
      <BookGenreFlashDeals 
        excludeTypes={['books']}
        title="RELATED PRODUCTS"
        headerGradient="from-orange-500 via-red-500 to-pink-600"
        categories={[
          { id: 'electronics', label: 'Electronics' },
          { id: 'fashion', label: 'Fashion' },
          { id: 'home', label: 'Home' },
          { id: 'sports', label: 'Sports' },
          { id: 'automotive', label: 'Auto' },
          { id: 'health', label: 'Health' },
          { id: 'beauty', label: 'Beauty' },
          { id: 'toys', label: 'Toys' },
          { id: 'office', label: 'Office' },
          { id: 'garden', label: 'Garden' },
          { id: 'pet', label: 'Pet' }
        ]}
        viewAllLink="/search"
        viewAllText="View All Products"
      />
    </div>
  );
};

export default ProductRelatedSection;