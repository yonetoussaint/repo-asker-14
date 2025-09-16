import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Sparkles, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const flashProducts = [
  {
    id: 201,
    name: "Premium Bluetooth Headphones",
    image: "https://placehold.co/300x300/9b87f5/FFF?text=Headphones",
    price: 129.99,
    discountPrice: 69.99,
    rating: 4.8,
    ratingCount: 328,
    sold: 1876,
    stock: 32
  },
  {
    id: 202,
    name: "Smart Home Speaker System",
    image: "https://placehold.co/300x300/7E69AB/FFF?text=Speaker",
    price: 199.99,
    discountPrice: 99.99,
    rating: 4.6,
    ratingCount: 512,
    sold: 1243,
    stock: 21
  },
  {
    id: 203,
    name: "Ultra Slim Tablet 10-inch",
    image: "https://placehold.co/300x300/6E59A5/FFF?text=Tablet",
    price: 299.99,
    discountPrice: 179.99,
    rating: 4.7,
    ratingCount: 267,
    sold: 895,
    stock: 18
  },
  {
    id: 204,
    name: "Professional Camera Drone",
    image: "https://placehold.co/300x300/D6BCFA/FFF?text=Drone",
    price: 399.99,
    discountPrice: 249.99,
    rating: 4.9,
    ratingCount: 186,
    sold: 456,
    stock: 9
  },
  {
    id: 205,
    name: "Fitness Smart Watch",
    image: "https://placehold.co/300x300/1A1F2C/FFF?text=Watch",
    price: 159.99,
    discountPrice: 89.99,
    rating: 4.5,
    ratingCount: 423,
    sold: 1532,
    stock: 27
  }
];

export default function SecondaryFlashDeals() {
  const isMobile = useIsMobile();
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 0
  });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        // Reset timer when it reaches 0
        return { hours: 2, minutes: 45, seconds: 0 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const middleElement = (
    <div className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-0.5 rounded-full backdrop-blur-sm">
      <Clock className="w-4 h-4 shrink-0" />
      <span className="whitespace-nowrap">
        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((unit, i) => (
          <span key={i}>
            {unit.toString().padStart(2, "0")}
            {i < 2 && <span className="mx-0.5">:</span>}
          </span>
        ))}
      </span>
    </div>
  );
  
  return (
    <div className="py-3 bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="container mx-auto px-3">
        <SectionHeader
          title="LIMITED OFFERS"
          icon={Sparkles}
          viewAllLink="/limited-offers"
          viewAllText="View All"
        />
        
        <div 
          className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide"
        >
          {flashProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="w-[110px] md:w-[130px] flex-shrink-0 animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-md mb-1.5">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-0 left-0 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded-br-md font-medium">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </div>
                </div>
                <div>
                  <div className="text-purple-600 font-semibold text-sm">US ${product.discountPrice.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 line-through">US ${product.price.toFixed(2)}</div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mt-1 mb-0.5">
                    <motion.div 
                      className="h-full bg-purple-600 rounded-full"
                      style={{width: `${100 - (product.stock / (product.stock + product.sold) * 100)}%`}}
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - (product.stock / (product.stock + product.sold) * 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {product.stock} left
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
