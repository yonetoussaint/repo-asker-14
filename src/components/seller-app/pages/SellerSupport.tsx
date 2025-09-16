import React, { useState } from 'react';
import { 
  MessageCircle, HelpCircle, BookOpen, Phone, 
  Mail, Clock, CheckCircle, AlertCircle, 
  User, Search, Filter, Send, FileText, ExternalLink 
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SellerSupport = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchQuery, setSearchQuery] = useState('');

  const tickets = [
    {
      id: 'TICKET-001',
      subject: 'Payment Processing Issue',
      category: 'Payments',
      status: 'Open',
      priority: 'High',
      created: '2024-01-20',
      lastUpdated: '2024-01-20',
      responses: 2,
      agent: 'Sarah Wilson'
    },
    {
      id: 'TICKET-002',
      subject: 'Product Listing Guidelines',
      category: 'Products',
      status: 'Resolved',
      priority: 'Medium',
      created: '2024-01-18',
      lastUpdated: '2024-01-19',
      responses: 5,
      agent: 'Mike Johnson'
    },
    {
      id: 'TICKET-003',
      subject: 'Shipping Label Generation Error',
      category: 'Shipping',
      status: 'In Progress',
      priority: 'High',
      created: '2024-01-17',
      lastUpdated: '2024-01-19',
      responses: 3,
      agent: 'Emma Davis'
    },
    {
      id: 'TICKET-004',
      subject: 'Account Verification Documents',
      category: 'Account',
      status: 'Waiting for Response',
      priority: 'Low',
      created: '2024-01-15',
      lastUpdated: '2024-01-16',
      responses: 1,
      agent: 'Alex Chen'
    }
  ];

  const faqs = [
    {
      id: '1',
      question: 'How do I set up payment processing?',
      answer: 'You can set up payment processing by going to Settings > Payment Methods and connecting your preferred payment provider like Stripe or PayPal.',
      category: 'Payments',
      helpful: 45,
      views: 234
    },
    {
      id: '2',
      question: 'What are the product listing requirements?',
      answer: 'All products must have clear images, accurate descriptions, proper categorization, and competitive pricing. Prohibited items include counterfeit goods and restricted substances.',
      category: 'Products',
      helpful: 67,
      views: 456
    },
    {
      id: '3',
      question: 'How do I handle returns and refunds?',
      answer: 'You can manage returns through the Orders section. Set up your return policy in Settings and process refunds directly through the platform.',
      category: 'Orders',
      helpful: 38,
      views: 189
    },
    {
      id: '4',
      question: 'How to optimize my store for better visibility?',
      answer: 'Use relevant keywords in product titles, maintain high-quality images, keep competitive prices, and maintain good seller ratings through excellent customer service.',
      category: 'Marketing',
      helpful: 52,
      views: 321
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Waiting for Response': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return AlertCircle;
      case 'In Progress': return MessageCircle;
      case 'Waiting for Response': return Clock;
      case 'Resolved': return CheckCircle;
      default: return HelpCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support Center</h1>
          <p className="text-muted-foreground">Get help and find answers to your questions</p>
        </div>
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Call Support</h3>
            <p className="text-sm text-muted-foreground mb-3">Speak with our team</p>
            <p className="text-sm font-medium">1-800-SUPPORT</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-3">Send us an email</p>
            <p className="text-sm font-medium">support@seller.com</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground mb-3">Browse our guides</p>
            <div className="flex items-center justify-center gap-1 text-sm font-medium">
              <span>View Docs</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'tickets' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('tickets')}
        >
          My Tickets
        </Button>
        <Button
          variant={activeTab === 'faq' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </Button>
        <Button
          variant={activeTab === 'create' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('create')}
        >
          Create Ticket
        </Button>
      </div>

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Support Tickets</CardTitle>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.map((ticket) => {
                const StatusIcon = getStatusIcon(ticket.status);
                return (
                  <div key={ticket.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground">{ticket.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p className="font-medium">{ticket.category}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Agent:</span>
                        <p className="font-medium">{ticket.agent}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <p className="font-medium">{ticket.created}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Responses:</span>
                        <p className="font-medium">{ticket.responses}</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search frequently asked questions..."
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground text-lg">{faq.question}</h3>
                    <Badge variant="outline">{faq.category}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{faq.answer}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>{faq.views} views</span>
                      <span>{faq.helpful} found helpful</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        👍 Helpful
                      </Button>
                      <Button variant="outline" size="sm">
                        👎 Not Helpful
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Ticket Tab */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of your issue" />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="payments">Payments</SelectItem>
                    <SelectItem value="products">Product Listings</SelectItem>
                    <SelectItem value="orders">Orders & Shipping</SelectItem>
                    <SelectItem value="technical">Technical Issues</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="attachment">Attachments</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here or click to browse
                  </p>
                  <Input type="file" className="hidden" />
                </div>
              </div>

              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Submit Ticket
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">1-800-SUPPORT</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@seller.com</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 24/7</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Start Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Support Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Check our FAQ section first - you might find an instant answer!
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Tip:</strong> Include screenshots or error messages to help us resolve issues faster.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Tip:</strong> For urgent issues, use our live chat for immediate assistance.
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

export default SellerSupport;