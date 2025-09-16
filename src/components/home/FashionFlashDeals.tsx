import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import ProductCard from "../ProductCard";
import SectionHeader from "./SectionHeader";

interface FashionFlashDealsProps {
  title?: string;
}

export default function FashionFlashDeals({ title = "Fashion Flash Deals" }: FashionFlashDealsProps) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000,
  });

  const fashionDeals = [
    {
      id: "fashion-1",
      title: "Designer Handbag",
      price: "$129.99",
      originalPrice: "$259.99",
      discount: "50% OFF",
      image: "/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png",
      rating: 4.8,
      sold: "3k+ sold",
      timeLeft: "1h 30m"
    },
    {
      id: "fashion-2",
      title: "Trendy Sneakers",
      price: "$89.99",
      originalPrice: "$179.99",
      discount: "50% OFF",
      image: "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png",
      rating: 4.6,
      sold: "7k+ sold",
      timeLeft: "2h 45m"
    },
    {
      id: "fashion-3",
      title: "Luxury Watch",
      price: "$299.99",
      originalPrice: "$599.99",
      discount: "50% OFF",
      image: "/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png",
      rating: 4.9,
      sold: "1.5k+ sold",
      timeLeft: "3h 15m"
    },
    {
      id: "fashion-4",
      title: "Stylish Sunglasses",
      price: "$49.99",
      originalPrice: "$99.99",
      discount: "50% OFF",
      image: "/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png",
      rating: 4.7,
      sold: "5k+ sold",
      timeLeft: "4h 20m"
    }
  ];

  if (isLoading) {
    return (
      <div className="bg-white mb-1">
        <div className="px-4 py-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white mb-1">
      <SectionHeader title={title} />
      
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-2">
          {fashionDeals.map((deal) => (
            <div key={deal.id} className="relative">
              <ProductCard
                product={{
                  id: deal.id,
                  name: deal.title,
                  image: deal.image,
                  price: parseFloat(deal.price.replace('$', '')),
                  discountPrice: parseFloat(deal.originalPrice.replace('$', '')),
                  rating: deal.rating,
                  category: "Fashion",
                  sold: parseInt(deal.sold.replace(/[^0-9]/g, ''))
                }}
              />
              {deal.timeLeft && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {deal.timeLeft}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}