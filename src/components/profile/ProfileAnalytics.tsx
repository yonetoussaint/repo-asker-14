
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ArrowDownRight, ArrowUpRight, Download, TrendingUp, BarChart3 } from "lucide-react";

interface ProfileAnalyticsProps {
  user: any;
}

export default function ProfileAnalytics({ user }: ProfileAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("30days");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Sample data for the charts
  const salesData = [
    { date: '05/01', sales: 900 },
    { date: '05/05', sales: 1200 },
    { date: '05/10', sales: 1800 },
    { date: '05/15', sales: 1600 },
    { date: '05/20', sales: 2200 },
    { date: '05/25', sales: 2800 },
    { date: '05/30', sales: 3200 },
  ];
  
  const visitorsData = [
    { date: '05/01', visitors: 120 },
    { date: '05/05', visitors: 250 },
    { date: '05/10', visitors: 320 },
    { date: '05/15', visitors: 280 },
    { date: '05/20', visitors: 400 },
    { date: '05/25', visitors: 450 },
    { date: '05/30', visitors: 520 },
  ];
  
  const categoryData = [
    { name: 'Electronics', value: 45 },
    { name: 'Fashion', value: 25 },
    { name: 'Home', value: 15 },
    { name: 'Beauty', value: 10 },
    { name: 'Other', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const productPerformanceData = [
    { name: 'Wireless Headphones', sales: 42, revenue: 5460 },
    { name: 'Smartphone Stand', sales: 28, revenue: 1400 },
    { name: 'Bluetooth Speaker', sales: 23, revenue: 3450 },
    { name: 'Phone Case', sales: 19, revenue: 380 },
    { name: 'Laptop Stand', sales: 15, revenue: 540 },
  ];

  const getStatColor = (value: number, isPositive = true) => {
    return value >= 0 
      ? 'text-green-500 bg-green-50' 
      : 'text-red-500 bg-red-50';
  };

  const getStatIcon = (value: number) => {
    return value >= 0 
      ? <ArrowUpRight className="h-4 w-4" /> 
      : <ArrowDownRight className="h-4 w-4" />;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-xl font-semibold">Store Analytics</h2>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm text-muted-foreground">Total Sales</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">$12,450.80</span>
                <div className={`flex items-center text-xs px-1.5 py-0.5 rounded ${getStatColor(24)}`}>
                  {getStatIcon(24)}
                  <span className="ml-0.5">24%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm text-muted-foreground">Orders</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">154</span>
                <div className={`flex items-center text-xs px-1.5 py-0.5 rounded ${getStatColor(12)}`}>
                  {getStatIcon(12)}
                  <span className="ml-0.5">12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm text-muted-foreground">Visitors</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">1,689</span>
                <div className={`flex items-center text-xs px-1.5 py-0.5 rounded ${getStatColor(-3, false)}`}>
                  {getStatIcon(-3)}
                  <span className="ml-0.5">3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">9.1%</span>
                <div className={`flex items-center text-xs px-1.5 py-0.5 rounded ${getStatColor(5)}`}>
                  {getStatIcon(5)}
                  <span className="ml-0.5">5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs for different analytics views */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Sales Trend</CardTitle>
                <CardDescription>Sales performance over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        name="Sales ($)"
                        stroke="#8884d8" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Visitors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visitors</CardTitle>
                <CardDescription>Store traffic analysis</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitorsData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="visitors" 
                        name="Visitors"
                        fill="#82ca9d" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sales by Category</CardTitle>
                <CardDescription>Product category performance</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Products</CardTitle>
              <CardDescription>Best performing products by sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={productPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Units Sold" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Demographics</CardTitle>
              <CardDescription>Insights into your customer base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Analytics coming soon</h3>
                <p className="text-muted-foreground text-center max-w-sm mt-1">
                  We're working on gathering more customer data to provide you with valuable insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
