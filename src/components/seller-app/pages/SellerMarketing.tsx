import React, { useState } from 'react';
import { 
  Megaphone, Mail, Users, TrendingUp, 
  Plus, Eye, Edit, Calendar, Target, 
  BarChart3, Share2, Gift, Zap 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const SellerMarketing = () => {
  const [activeTab, setActiveTab] = useState('campaigns');

  const campaigns = [
    {
      id: '1',
      name: 'Summer Sale 2024',
      type: 'Discount',
      status: 'Active',
      discount: '25%',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      views: 1250,
      clicks: 89,
      conversions: 23,
      revenue: 1450.50
    },
    {
      id: '2',
      name: 'Free Shipping Weekend',
      type: 'Shipping',
      status: 'Active',
      discount: 'Free Shipping',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      views: 890,
      clicks: 67,
      conversions: 34,
      revenue: 2100.75
    },
    {
      id: '3',
      name: 'Electronics Bundle Deal',
      type: 'Bundle',
      status: 'Scheduled',
      discount: 'Buy 2 Get 1',
      startDate: '2024-01-25',
      endDate: '2024-02-25',
      views: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    },
    {
      id: '4',
      name: 'Customer Loyalty Rewards',
      type: 'Loyalty',
      status: 'Ended',
      discount: '10% Cashback',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      views: 2100,
      clicks: 156,
      conversions: 78,
      revenue: 3250.25
    }
  ];

  const promotions = [
    {
      id: '1',
      title: 'Flash Sale - Wireless Earbuds',
      description: 'Limited time offer on premium wireless earbuds',
      type: 'Flash Sale',
      discount: '40%',
      expiry: '2024-01-22',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Bundle Deal - Smart Home Kit',
      description: 'Complete smart home setup at unbeatable price',
      type: 'Bundle',
      discount: 'Save $150',
      expiry: '2024-01-30',
      status: 'Active'
    },
    {
      id: '3',
      title: 'New Customer Welcome',
      description: 'Special discount for first-time buyers',
      type: 'Welcome',
      discount: '15%',
      expiry: 'Ongoing',
      status: 'Active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Ended': return 'bg-gray-100 text-gray-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Discount': return 'bg-purple-100 text-purple-800';
      case 'Shipping': return 'bg-blue-100 text-blue-800';
      case 'Bundle': return 'bg-orange-100 text-orange-800';
      case 'Loyalty': return 'bg-pink-100 text-pink-800';
      case 'Flash Sale': return 'bg-red-100 text-red-800';
      case 'Welcome': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing</h1>
          <p className="text-muted-foreground">Create and manage your marketing campaigns</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">5</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Megaphone className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">2,456</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">189</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Generated</p>
                <h3 className="text-2xl font-bold text-foreground mt-2">$8,901</h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'campaigns' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </Button>
        <Button
          variant={activeTab === 'promotions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('promotions')}
        >
          Promotions
        </Button>
        <Button
          variant={activeTab === 'create' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('create')}
        >
          Create New
        </Button>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Marketing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium text-muted-foreground">Campaign</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Performance</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Revenue</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Duration</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-border hover:bg-muted/30">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-foreground">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">{campaign.discount}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary" className={getTypeColor(campaign.type)}>
                          {campaign.type}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>CTR: {campaign.clicks > 0 ? ((campaign.clicks / campaign.views) * 100).toFixed(1) : '0'}%</span>
                          </div>
                          <Progress 
                            value={campaign.clicks > 0 ? (campaign.clicks / campaign.views) * 100 : 0} 
                            className="h-2" 
                          />
                          <p className="text-xs text-muted-foreground">
                            {campaign.views} views • {campaign.conversions} conversions
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-green-600">
                          ${campaign.revenue.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <p>{campaign.startDate}</p>
                          <p className="text-muted-foreground">to {campaign.endDate}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{promotion.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{promotion.description}</p>
                  </div>
                  <Badge variant="secondary" className={getTypeColor(promotion.type)}>
                    {promotion.type}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Discount:</span>
                    <span className="font-semibold text-green-600">{promotion.discount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expires:</span>
                    <span className="text-sm">{promotion.expiry}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="secondary" className={getStatusColor(promotion.status)}>
                      {promotion.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create New Tab */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Create New Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input id="campaignName" placeholder="Enter campaign name" />
              </div>

              <div>
                <Label htmlFor="campaignType">Campaign Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Discount Campaign</SelectItem>
                    <SelectItem value="shipping">Free Shipping</SelectItem>
                    <SelectItem value="bundle">Bundle Deal</SelectItem>
                    <SelectItem value="loyalty">Loyalty Rewards</SelectItem>
                    <SelectItem value="flash">Flash Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>

              <div>
                <Label htmlFor="discount">Discount Value</Label>
                <Input id="discount" placeholder="e.g., 25% or $50" />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your campaign..." 
                  rows={3}
                />
              </div>

              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Quick Campaign Templates */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Flash Sale (24 Hours)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Gift className="w-4 h-4 mr-2" />
                  Buy 2 Get 1 Free
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  New Customer Discount
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Newsletter Campaign
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Marketing Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Flash sales create urgency and can boost conversions by up to 35%.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Tip:</strong> Offering free shipping on orders over $50 increases average order value.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Tip:</strong> Bundle deals work best for complementary products.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerMarketing;