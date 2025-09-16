import React, { useState } from 'react';
import { 
  Package, AlertTriangle, TrendingDown, Plus, 
  Search, Filter, MoreHorizontal, Edit, RefreshCw,
  Download, Upload, Barcode, Warehouse 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const SellerInventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const inventoryItems = [
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      sku: 'WEP-001',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&h=150&fit=crop',
      currentStock: 156,
      minStock: 20,
      maxStock: 500,
      location: 'A1-B2',
      supplier: 'TechCorp Inc.',
      lastRestocked: '2024-01-15',
      avgSales: 15,
      status: 'In Stock',
      value: 7800,
    },
    {
      id: '2',
      name: 'Smart Watch Series 5',
      sku: 'SWS-005',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
      currentStock: 43,
      minStock: 50,
      maxStock: 200,
      location: 'B2-C1',
      supplier: 'WearTech Ltd.',
      lastRestocked: '2024-01-10',
      avgSales: 8,
      status: 'Low Stock',
      value: 12897,
    },
    {
      id: '3',
      name: 'USB-C Fast Charger',
      sku: 'UFC-020',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&h=150&fit=crop',
      currentStock: 0,
      minStock: 100,
      maxStock: 1000,
      location: 'C1-D2',
      supplier: 'PowerMax Co.',
      lastRestocked: '2024-01-01',
      avgSales: 25,
      status: 'Out of Stock',
      value: 0,
    },
    {
      id: '4',
      name: 'Bluetooth Speaker',
      sku: 'BTS-012',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=150&h=150&fit=crop',
      currentStock: 89,
      minStock: 30,
      maxStock: 300,
      location: 'D2-E1',
      supplier: 'AudioPro Inc.',
      lastRestocked: '2024-01-12',
      avgSales: 12,
      status: 'In Stock',
      value: 7120,
    },
    {
      id: '5',
      name: 'Phone Case Premium',
      sku: 'PCP-089',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=150&h=150&fit=crop',
      currentStock: 234,
      minStock: 50,
      maxStock: 500,
      location: 'E1-F2',
      supplier: 'CaseMaster Ltd.',
      lastRestocked: '2024-01-08',
      avgSales: 18,
      status: 'In Stock',
      value: 5850,
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    return (current / max) * 100;
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case 'In Stock': return Package;
      case 'Low Stock': return AlertTriangle;
      case 'Out of Stock': return TrendingDown;
      default: return Package;
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0);
  const lowStockCount = inventoryItems.filter(item => item.status === 'Low Stock').length;
  const outOfStockCount = inventoryItems.filter(item => item.status === 'Out of Stock').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">89</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">${totalValue.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Warehouse className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">{lowStockCount}</h3>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">{outOfStockCount}</h3>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">SKU</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Stock Level</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Value</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Last Restocked</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const StatusIcon = getStockIcon(item.status);
                  const stockLevel = getStockLevel(item.currentStock, item.minStock, item.maxStock);
                  
                  return (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Avg. {item.avgSales}/day</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Barcode className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-sm">{item.sku}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{item.currentStock}/{item.maxStock}</span>
                            <span className="text-muted-foreground">{Math.round(stockLevel)}%</span>
                          </div>
                          <Progress value={stockLevel} className="h-2" />
                          <p className="text-xs text-muted-foreground">Min: {item.minStock}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-mono">{item.location}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          <Badge variant="secondary" className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold">${item.value.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{item.lastRestocked}</span>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Restock
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="w-4 h-4 mr-2" />
                              Move Location
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerInventory;