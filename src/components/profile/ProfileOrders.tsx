
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, ChevronDown } from "lucide-react";

interface ProfileOrdersProps {
  user: any;
}

export default function ProfileOrders({ user }: ProfileOrdersProps) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample orders data
  const orders = [
    {
      id: "ORD-7851",
      date: "2023-05-15",
      status: "Delivered",
      total: 129.99,
      items: [
        { name: "Wireless Earbuds", quantity: 1, price: 79.99, image: "https://api.dicebear.com/7.x/shapes/svg?seed=product1" },
        { name: "Phone Case", quantity: 1, price: 19.99, image: "https://api.dicebear.com/7.x/shapes/svg?seed=product2" }
      ]
    },
    {
      id: "ORD-6532",
      date: "2023-05-10",
      status: "Shipped",
      total: 249.99,
      items: [
        { name: "Smart Watch", quantity: 1, price: 249.99, image: "https://api.dicebear.com/7.x/shapes/svg?seed=product3" }
      ]
    },
    {
      id: "ORD-5219",
      date: "2023-05-03",
      status: "Processing",
      total: 85.00,
      items: [
        { name: "Desk Lamp", quantity: 1, price: 45.00, image: "https://api.dicebear.com/7.x/shapes/svg?seed=product4" },
        { name: "Mouse Pad", quantity: 2, price: 20.00, image: "https://api.dicebear.com/7.x/shapes/svg?seed=product5" }
      ]
    },
    {
      id: "ORD-4127",
      date: "2023-04-28",
      status: "Cancelled",
      total: 149.99,
      items: [
        { name: "Bluetooth Speaker", quantity: 1, price: 149.99, image: "https://api.dicebear.com/7.x/shapes/svg?seed=product6" }
      ]
    }
  ];
  
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filter !== "all" && order.status.toLowerCase() !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    return true;
  });
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search orders..." 
            className="w-full sm:w-[300px] pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-base">{order.id}</CardTitle>
                      <Badge variant="outline" className={`ml-2 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">Ordered on {order.date}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-muted-foreground text-center mt-1">
              {searchQuery || filter !== "all" ? 
                "Try adjusting your filters or search terms" : 
                "You haven't placed any orders yet"}
            </p>
            {!searchQuery && filter === "all" && (
              <Button variant="link" className="mt-2" onClick={() => setFilter("all")}>
                Start shopping
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
