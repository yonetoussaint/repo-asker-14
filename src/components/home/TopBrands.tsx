import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Crown } from "lucide-react";
import SectionHeader from "./SectionHeader";

const brands = [
  { id: 1, name: "Apple", logo: "https://placehold.co/200x80/FFFFFF/000000?text=Apple" },
  { id: 2, name: "Samsung", logo: "https://placehold.co/200x80/FFFFFF/000000?text=Samsung" },
  { id: 3, name: "Nike", logo: "https://placehold.co/200x80/FFFFFF/000000?text=Nike" },
  { id: 4, name: "Sony", logo: "https://placehold.co/200x80/FFFFFF/000000?text=Sony" },
  { id: 5, name: "Adidas", logo: "https://placehold.co/200x80/FFFFFF/000000?text=Adidas" },
  { id: 6, name: "Xiaomi", logo: "https://placehold.co/200x80/FFFFFF/000000?text=Xiaomi" }
];

export default function TopBrands() {
  const isMobile = useIsMobile();

  return (
    <div className="w-full bg-white">
      <SectionHeader
        title="Featured Brands"
        icon={Crown}
        viewAllLink="/brands"
        viewAllText="View All"
      />

      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {brands.map((brand) => (
            <Link 
              key={brand.id} 
              to={`/brand/${brand.name.toLowerCase()}`}
              className="flex items-center justify-center border rounded-md hover:shadow-md transition-shadow py-3 bg-white"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-h-6 md:max-h-8"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}