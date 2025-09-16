import { useState } from 'react';
import { 
  CreditCard, 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Eye,
  EyeOff,
  History,
  ShoppingCart,
  TrendingUp,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  category?: string;
}

export default function Wallet() {
  const [purchaseBalance] = useState(2847.50);
  const [salesBalance] = useState(1523.75);
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'sale',
      amount: 124.99,
      description: 'iPhone 15 Pro Max sold',
      timestamp: '2 min ago',
      status: 'completed',
      category: 'Electronics'
    },
    {
      id: '2', 
      type: 'purchase',
      amount: -45.00,
      description: 'Nike Air Jordan purchased',
      timestamp: '1 hour ago',
      status: 'completed',
      category: 'Fashion'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 500.00,
      description: 'Bank transfer deposit',
      timestamp: 'Yesterday',
      status: 'completed'
    },
    {
      id: '4',
      type: 'sale',
      amount: 89.50,
      description: 'Headphones sold',
      timestamp: '2 days ago',
      status: 'completed',
      category: 'Electronics'
    },
    {
      id: '5',
      type: 'purchase',
      amount: -156.00,
      description: 'Samsung Galaxy Watch',
      timestamp: '3 days ago',
      status: 'pending',
      category: 'Electronics'
    }
  ];

  const totalBalance = purchaseBalance + salesBalance;

  const filteredTransactions = recentTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Balance Overview */}
      <div className="p-4 space-y-4">
        {/* Total Balance Card */}
        <Card className="border border-black bg-white text-foreground shadow-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground font-medium">Total Balance</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-muted-foreground hover:bg-muted/50"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              </div>
              
              <div className="text-5xl font-bold text-foreground tracking-tight">
                {showBalance ? `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 h-12 bg-foreground text-background hover:bg-foreground/90 font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Deposit
              </Button>
              <Button variant="outline" className="flex-1 h-12 border-2 font-medium">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Transaction History */}
      <div>
        {/* Search and Filter Header */}
        <div className="p-4 bg-card rounded-t-lg border-b space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Transaction History</h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Transactions Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full rounded-none border-b bg-card p-0">
            <TabsTrigger value="all" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              All
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Purchases
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Sales
            </TabsTrigger>
            <TabsTrigger value="deposits" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
              Deposits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 bg-card">
            <div className="divide-y">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'sale' ? 'bg-green-100 dark:bg-green-900/20' :
                        transaction.type === 'purchase' ? 'bg-red-100 dark:bg-red-900/20' :
                        transaction.type === 'deposit' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        'bg-orange-100 dark:bg-orange-900/20'
                      }`}>
                        {transaction.type === 'sale' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : transaction.type === 'purchase' ? (
                          <ShoppingCart className="h-4 w-4 text-red-600" />
                        ) : transaction.type === 'deposit' ? (
                          <ArrowDownLeft className="h-4 w-4 text-blue-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-orange-600" />
                        )}
                      </div>

                      <div>
                        <div className="font-medium text-sm text-foreground">{transaction.description}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{transaction.timestamp}</span>
                          {transaction.category && (
                            <>
                              <span>•</span>
                              <span>{transaction.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-semibold text-sm ${
                        transaction.type === 'sale' || transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(transaction.type === 'purchase' || transaction.type === 'withdrawal') ? '-' : '+'}
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className={`text-xs ${
                        transaction.status === 'completed' ? 'text-green-600' : 
                        transaction.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 text-center border-t bg-card">
              <Button variant="ghost" className="text-sm text-muted-foreground">
                Load More Transactions
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="purchases" className="mt-0 bg-card">
            <div className="divide-y">
              {filteredTransactions.filter(t => t.type === 'purchase').map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{transaction.description}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{transaction.timestamp}</span>
                          {transaction.category && (
                            <>
                              <span>•</span>
                              <span>{transaction.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-red-600">
                        -${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className={`text-xs ${
                        transaction.status === 'completed' ? 'text-green-600' : 
                        transaction.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sales" className="mt-0 bg-card">
            <div className="divide-y">
              {filteredTransactions.filter(t => t.type === 'sale').map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{transaction.description}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{transaction.timestamp}</span>
                          {transaction.category && (
                            <>
                              <span>•</span>
                              <span>{transaction.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-green-600">
                        +${transaction.amount.toFixed(2)}
                      </div>
                      <div className={`text-xs ${
                        transaction.status === 'completed' ? 'text-green-600' : 
                        transaction.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deposits" className="mt-0 bg-card rounded-b-lg">
            <div className="divide-y">
              {filteredTransactions.filter(t => t.type === 'deposit').map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <ArrowDownLeft className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">{transaction.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-blue-600">
                        +${transaction.amount.toFixed(2)}
                      </div>
                      <div className={`text-xs ${
                        transaction.status === 'completed' ? 'text-green-600' : 
                        transaction.status === 'pending' ? 'text-orange-500' : 'text-red-500'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}