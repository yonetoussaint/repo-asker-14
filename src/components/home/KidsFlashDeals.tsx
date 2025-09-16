import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/integrations/supabase/products";
import ProductCard from "../ProductCard";
import SectionHeader from "./SectionHeader";

interface KidsFlashDealsProps {
  title?: string;
}

export default function KidsFlashDeals({ title = "Kids Flash Deals" }: KidsFlashDealsProps) {
  const kidsDeals = [
    {
      id: "kids-1",
      title: "Educational Tablet",
      price: "$99.99",
      originalPrice: "$199.99",
      image: "/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png",
      rating: 4.8,
      sold: "8k+ sold",
      timeLeft: "1h 20m"
    },
    {
      id: "kids-2",
      title: "Building Blocks Set",
      price: "$49.99",
      originalPrice: "$99.99",
      image: "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png",
      rating: 4.9,
      sold: "15k+ sold",
      timeLeft: "2h 35m"
    },
    {
      id: "kids-3",
      title: "Art Supplies Kit",
      price: "$29.99",
      originalPrice: "$59.99",
      image: "/lovable-uploads/f3efe2eb-c3db-48bd-abc7-c65456fdc028.png",
      rating: 4.7,
      sold: "22k+ sold",
      timeLeft: "3h 50m"
    },
    {
      id: "kids-4",
      title: "Remote Control Car",
      price: "$69.99",
      originalPrice: "$139.99",
      image: "/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png",
      rating: 4.6,
      sold: "11k+ sold",
      timeLeft: "4h 25m"
    }
  ];

  return (
    <div className="bg-white mb-1">
      <SectionHeader title={title} />
      
      <div className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-2">
          {kidsDeals.map((deal) => (
            <div key={deal.id} className="relative">
              <ProductCard
                product={{
                  id: deal.id,
                  name: deal.title,
                  image: deal.image,
                  price: parseFloat(deal.price.replace('$', '')),
                  discountPrice: parseFloat(deal.originalPrice.replace('$', '')),
                  rating: deal.rating,
                  category: "Kids",
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