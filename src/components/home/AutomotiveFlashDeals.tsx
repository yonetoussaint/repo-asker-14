import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import ProductCard from "../ProductCard";
import SectionHeader from "./SectionHeader";

interface AutomotiveFlashDealsProps {
  title?: string;
}

export default function AutomotiveFlashDeals({ title = "Automotive Flash Deals" }: AutomotiveFlashDealsProps) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchAllProducts,
    staleTime: 60000,
  });

  const automotiveDeals = [
    {
      id: "auto-1",
      title: "Car Phone Mount",
      price: "$19.99",
      originalPrice: "$39.99",
      discount: "50% OFF",
      image: "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png",
      rating: 4.7,
      sold: "10k+ sold",
      timeLeft: "2h 30m"
    },
    {
      id: "auto-2",
      title: "Dashboard Camera",
      price: "$79.99",
      originalPrice: "$159.99",
      discount: "50% OFF",
      image: "/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png",
      rating: 4.8,
      sold: "6k+ sold",
      timeLeft: "1h 20m"
    },
    {
      id: "auto-3",
      title: "Car Seat Covers",
      price: "$59.99",
      originalPrice: "$119.99",
      discount: "50% OFF",
      image: "/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png",
      rating: 4.6,
      sold: "4k+ sold",
      timeLeft: "3h 45m"
    },
    {
      id: "auto-4",
      title: "Tire Pressure Monitor",
      price: "$49.99",
      originalPrice: "$99.99",
      discount: "50% OFF",
      image: "/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png",
      rating: 4.9,
      sold: "8k+ sold",
      timeLeft: "4h 10m"
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
          {automotiveDeals.map((deal) => (
            <div key={deal.id} className="relative">
              <ProductCard
                product={{
                  id: deal.id,
                  name: deal.title,
                  image: deal.image,
                  price: parseFloat(deal.price.replace('$', '')),
                  discountPrice: parseFloat(deal.originalPrice.replace('$', '')),
                  rating: deal.rating,
                  category: "Automotive",
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