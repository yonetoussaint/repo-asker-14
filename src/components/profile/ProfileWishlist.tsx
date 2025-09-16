import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Heart, ShoppingCart, X, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileWishlistProps {
  user: any;
}

export default function ProfileWishlist({ user }: ProfileWishlistProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  
  // Sample wishlist data
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      name: "Wireless Noise Cancelling Headphones",
      price: 249.99,
      originalPrice: 299.99,
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=product7",
      addedAt: "2023-05-12",
      inStock: true
    },
    {
      id: "2",
      name: "Smartphone Stand with Wireless Charging",
      price: 49.99,
      originalPrice: 59.99,
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=product8",
      addedAt: "2023-05-10",
      inStock: true
    },
    {
      id: "3",
      name: "Ergonomic Office Chair",
      price: 199.99,
      originalPrice: 249.99,
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=product9",
      addedAt: "2023-05-08",
      inStock: false
    },
    {
      id: "4",
      name: "Smart Home Hub",
      price: 129.99,
      originalPrice: 129.99,
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=product10",
      addedAt: "2023-05-05",
      inStock: true
    }
  ]);

  const handleRemoveItem = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from wishlist");
  };

  const handleAddToCart = (item: any) => {
    // Add to cart logic would go here
    toast.success(`${item.name} added to cart`);
  };

  const handleClearWishlist = () => {
    setWishlistItems([]);
    toast.success("Wishlist cleared");
  };

  const filteredItems = wishlistItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "recent":
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  const calculateDiscount = (price: number, originalPrice: number) => {
    if (originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search wishlist..."
            className="w-full sm:w-[300px] pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          
          {wishlistItems.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearWishlist}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white shadow-sm"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="h-48 bg-muted flex items-center justify-center p-4 overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium line-clamp-2 mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                      {item.originalPrice > item.price && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">${item.originalPrice.toFixed(2)}</span>
                          <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                            -{calculateDiscount(item.price, item.originalPrice)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      disabled={!item.inStock}
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:border-red-200"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  
                  {!item.inStock && (
                    <p className="text-xs text-red-500">Out of stock</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Heart className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Your wishlist is empty</h3>
            <p className="text-muted-foreground text-center mt-1">
              {searchQuery ? 
                "No items match your search" : 
                "Save items you're interested in for later"}
            </p>
            <Button variant="link" className="mt-2">
              Browse products
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}