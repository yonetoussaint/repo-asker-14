
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, ChevronRight, TrendingUp, CircleDollarSign, Package, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileDashboardProps {
  user: any;
  profile: any;
}

export default function ProfileDashboard({ user, profile }: ProfileDashboardProps) {
  // Sample data - in a real app, this would come from API calls
  const recentOrders = [
    { id: "ORD-1234", date: "2023-05-10", status: "Delivered", total: 124.99 },
    { id: "ORD-1235", date: "2023-05-08", status: "Shipped", total: 74.50 },
    { id: "ORD-1236", date: "2023-05-05", status: "Processing", total: 249.99 },
  ];
  
  const recentSales = [
    { id: "SAL-8765", date: "2023-05-09", product: "Premium Headphones", amount: 89.99 },
    { id: "SAL-8766", date: "2023-05-07", product: "Smart Watch", amount: 199.99 },
  ];
  
  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buyer Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/account/orders" className="flex items-center gap-1 text-xs">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>Your most recent purchases</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{order.id}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-xs ${statusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                      <span className="font-medium">${order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No orders yet</p>
                <Button variant="link" asChild className="mt-2">
                  <Link to="/browse">Start shopping</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seller Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Sales</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/account/sales" className="flex items-center gap-1 text-xs">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>Your most recent sales</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSales.length > 0 ? (
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <CircleDollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{sale.id}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{sale.date}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm">{sale.product}</span>
                      <span className="font-medium text-green-600">${sale.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No sales yet</p>
                <Button variant="link" asChild className="mt-2">
                  <Link to="/account/products/new">Add a product</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Overview</CardTitle>
          <CardDescription>Your store's performance this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Sales Target</span>
                <span className="font-medium">$2,400 / $5,000</span>
              </div>
              <Progress value={48} className="h-2" />
              <p className="text-xs text-muted-foreground">48% of monthly target reached</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Customer Satisfaction</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">Based on 23 reviews</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Inventory Status</span>
                <span className="font-medium">8/12 products</span>
              </div>
              <Progress value={66} className="h-2" />
              <p className="text-xs text-muted-foreground">66% of products in stock</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="group hover:border-primary transition-colors">
          <Link to="/account/products/new" className="block p-4">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Add New Product</h3>
              <p className="text-xs text-muted-foreground mt-1">List a new item for sale</p>
            </div>
          </Link>
        </Card>
        
        <Card className="group hover:border-primary transition-colors">
          <Link to="/browse" className="block p-4">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Browse Products</h3>
              <p className="text-xs text-muted-foreground mt-1">Discover new items</p>
            </div>
          </Link>
        </Card>
        
        <Card className="group hover:border-primary transition-colors">
          <Link to="/account/wishlist" className="block p-4">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium">Wishlist</h3>
              <p className="text-xs text-muted-foreground mt-1">View saved items</p>
            </div>
          </Link>
        </Card>
        
        <Card className="group hover:border-primary transition-colors">
          <Link to="/account/analytics" className="block p-4">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium">View Analytics</h3>
              <p className="text-xs text-muted-foreground mt-1">Track your performance</p>
            </div>
          </Link>
        </Card>
      </div>
    </div>
  );
}
