import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Copy, Trash2, MoreHorizontal, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { fetchUserProducts, Product } from "@/integrations/supabase/products";
import { useQuery } from "@tanstack/react-query";

interface ProfileProductsProps {
  user: any;
}

interface EnhancedProduct extends Product {
  status: string;
  image: string;
  sales: number;
  createdAt: string;
}

export default function ProfileProducts({ user }: ProfileProductsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<EnhancedProduct | null>(null);
  
  // Use React Query to fetch products
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['userProducts', user?.id],
    queryFn: () => fetchUserProducts(user?.id),
    enabled: !!user?.id,
  });
  
  console.log("User products loaded:", products);
  
  // Transform products from the database to match our component's expected format
  const transformedProducts: EnhancedProduct[] = products.map((product: Product) => ({
    ...product,
    status: product.inventory && product.inventory <= 0 ? "out_of_stock" : "active", // Derive status
    inventory: product.inventory || 0,
    image: product.product_images?.length ? 
      product.product_images[0].src : 
      `https://api.dicebear.com/7.x/shapes/svg?seed=product${product.id}`,
    sales: 0, // Default value for sales
    createdAt: new Date(product.created_at || "").toLocaleDateString(),
  }));
  
  const handleDeleteConfirm = () => {
    if (productToDelete) {
      // Here we would call the API to delete the product
      // For now, we'll just filter out the product from our local state
      toast.success(`"${productToDelete.name}" has been deleted`);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      refetch(); // Refetch products after deletion
    }
  };
  
  const openDeleteDialog = (product: EnhancedProduct) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDuplicate = (product: EnhancedProduct) => {
    // Here we would call the API to duplicate the product
    // For now we'll just show a toast notification
    toast.success(`"${product.name}" has been duplicated`);
    refetch(); // Refetch products after duplication
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Active</Badge>;
      case "draft":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Draft</Badge>;
      case "out_of_stock":
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredProducts = transformedProducts.filter(product => {
    // Filter by status
    if (filter !== "all" && product.status !== filter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
        <div className="h-64 w-full bg-muted animate-pulse rounded-md"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-red-500">Error loading products</p>
          <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Search products..." 
              className="w-full sm:w-[300px] pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-sm">Product</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Price</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Inventory</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Sales</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Date Added</th>
                <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    ${parseFloat(product.price.toString()).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {product.status === "out_of_stock" ? (
                      <span className="text-red-600 font-medium">0</span>
                    ) : (
                      product.inventory
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {product.sales || 0}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-sm">
                    {product.createdAt}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/product/${product.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => openDeleteDialog(product)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-muted-foreground text-center mt-1 max-w-sm">
              {searchQuery || filter !== "all" ? 
                "Try adjusting your filters or search terms" : 
                "Start by adding your first product to your store"}
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
