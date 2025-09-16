import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import ProductCard from "../ProductCard";
import SectionHeader from "./SectionHeader";

interface SportsFlashDealsProps {
  title?: string;
}

export default function SportsFlashDeals({ title = "Sports Flash Deals" }: SportsFlashDealsProps) {
  const sportsDeals = [
    {
      id: "sports-1",
      title: "Fitness Tracker Pro",
      price: "$79.99",
      originalPrice: "$159.99",
      image: "/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png",
      rating: 4.8,
      sold: "12k+ sold",
      timeLeft: "2h 10m"
    },
    {
      id: "sports-2",
      title: "Yoga Mat Premium",
      price: "$39.99",
      originalPrice: "$79.99",
      image: "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png",
      rating: 4.7,
      sold: "18k+ sold",
      timeLeft: "1h 45m"
    },
    {
      id: "sports-3",
      title: "Resistance Bands Set",
      price: "$24.99",
      originalPrice: "$49.99",
      image: "/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png",
      rating: 4.6,
      sold: "25k+ sold",
      timeLeft: "3h 30m"
    },
    {
      id: "sports-4",
      title: "Water Bottle Smart",
      price: "$29.99",
      originalPrice: "$59.99",
      image: "/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png",
      rating: 4.5,
      sold: "9k+ sold",
      timeLeft: "4h 15m"
    }
  ];

  return (
    <div className="bg-white mb-1">
      <SectionHeader title={title} />
      
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-2">
          {sportsDeals.map((deal) => (
            <div key={deal.id} className="relative">
              <ProductCard
                product={{
                  id: deal.id,
                  name: deal.title,
                  image: deal.image,
                  price: parseFloat(deal.price.replace('$', '')),
                  discountPrice: parseFloat(deal.originalPrice.replace('$', '')),
                  rating: deal.rating,
                  category: "Sports",
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