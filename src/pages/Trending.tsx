import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import AliExpressHeader from "@/components/home/AliExpressHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { TrendingUp, ArrowRight, ShoppingBag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TrendingSkeleton from "@/components/skeletons/TrendingSkeleton";

export default function Trending() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  const isMobile = useIsMobile();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isMobile !== undefined) {
      setIsReady(true);
    }
  }, [isMobile]);

  if (!isReady) {
    return <TrendingSkeleton />;
  }
  
  if (isLoading) {
    return <TrendingSkeleton />;
  }

  // Mock data for trending categories and products
  const trendingCategories = [
    { id: 1, name: "Electronics", count: "12.5K views" },
    { id: 2, name: "Fashion", count: "8.2K views" },
    { id: 3, name: "Home & Garden", count: "6.8K views" },
    { id: 4, name: "Beauty", count: "5.3K views" },
    { id: 5, name: "Sports", count: "4.1K views" }
  ];

  const trendingProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Earbuds",
      price: "$25.99",
      originalPrice: "$45.99",
      discount: "-43%",
      image: "https://picsum.photos/id/100/300",
      views: "25.3K",
      orders: "5.6K"
    },
    {
      id: 2,
      name: "Portable Power Bank 10000mAh",
      price: "$18.50",
      originalPrice: "$29.99",
      discount: "-38%",
      image: "https://picsum.photos/id/110/300",
      views: "18.7K",
      orders: "3.2K"
    },
    {
      id: 3,
      name: "Smart Watch Fitness Tracker",
      price: "$34.99",
      originalPrice: "$59.99",
      discount: "-42%",
      image: "https://picsum.photos/id/120/300",
      views: "20.5K",
      orders: "4.8K"
    },
    {
      id: 4,
      name: "LED Strip Lights 5M",
      price: "$12.99",
      originalPrice: "$22.99",
      discount: "-43%",
      image: "https://picsum.photos/id/130/300",
      views: "15.4K",
      orders: "6.1K"
    },
    {
      id: 5,
      name: "Foldable Phone Stand Holder",
      price: "$4.99",
      originalPrice: "$8.99",
      discount: "-44%",
      image: "https://picsum.photos/id/140/300",
      views: "12.8K",
      orders: "7.5K"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 overscroll-none overflow-x-hidden">
      {/* AliExpressHeader component with active tab set to trending */}
      <AliExpressHeader activeTabId="trending" />

      <div className="pt-[44px] pb-16">
        {/* Trending Stats Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center">
                <TrendingUp className="mr-1 h-5 w-5" />
                Trending Now
              </h2>
              <p className="text-xs opacity-90">Discover what's hot right now</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">158K+</div>
              <div className="text-xs">People shopping</div>
            </div>
          </div>
        </div>
        
        {/* Trending Categories */}
        <div className="p-3 bg-white mt-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Trending Categories</h3>
            <div className="text-xs text-orange-500 flex items-center">
              View All
              <ArrowRight className="h-3 w-3 ml-0.5" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {trendingCategories.map(category => (
              <div key={category.id} className="flex justify-between items-center p-2 rounded bg-gray-50 border border-gray-100">
                <span className="text-xs font-medium">{category.name}</span>
                <span className="text-[10px] text-gray-500">{category.count}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trending Products */}
        <div className="p-3 bg-white mt-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">What People Are Buying</h3>
            <div className="text-xs text-orange-500 flex items-center">
              See More
              <ArrowRight className="h-3 w-3 ml-0.5" />
            </div>
          </div>
          
          <div className="space-y-3">
            {trendingProducts.map(product => (
              <div key={product.id} className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="w-24 h-24">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 p-2">
                  <h4 className="text-xs font-medium line-clamp-2">{product.name}</h4>
                  <div className="flex items-baseline mt-1">
                    <span className="text-xs text-red-500 font-medium">{product.price}</span>
                    <span className="text-[10px] text-gray-400 line-through ml-1">{product.originalPrice}</span>
                    <Badge className="ml-2 bg-red-500 text-white text-[8px] px-1 py-0">{product.discount}</Badge>
                  </div>
                  <div className="flex items-center mt-1.5 justify-between text-[9px] text-gray-500">
                    <div className="flex items-center">
                      <Eye className="h-2.5 w-2.5 mr-0.5" />
                      <span>{product.views}</span>
                    </div>
                    <div className="flex items-center">
                      <ShoppingBag className="h-2.5 w-2.5 mr-0.5" />
                      <span>{product.orders} orders</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trending Searches */}
        <div className="p-3 bg-white mt-2">
          <h3 className="text-sm font-medium mb-2">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-600 border-0">wireless earbuds</Badge>
            <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-600 border-0">smart watch</Badge>
            <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-600 border-0">phone case</Badge>
            <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-600 border-0">led lights</Badge>
            <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-600 border-0">bluetooth speaker</Badge>
            <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-600 border-0">power bank</Badge>
            <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-600 border-0">laptop sleeve</Badge>
          </div>
        </div>
      </div>

      {/* Extra bottom padding for mobile to account for fixed navigation */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
}