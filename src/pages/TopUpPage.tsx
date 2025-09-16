
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, PhoneCall, Wifi, RefreshCw, Info, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const MOBILE_OPERATORS = [
  { id: 'digicel', name: 'Digicel', logo: 'https://placehold.co/200/red/white?text=Digicel' },
  { id: 'natcom', name: 'Natcom', logo: 'https://placehold.co/200/blue/white?text=Natcom' },
  { id: 'access', name: 'Access Haiti', logo: 'https://placehold.co/200/green/white?text=AccessHT' },
];

const DATA_PLANS = [
  { id: 'plan1', name: '1-Day Plan', data: '500 MB', price: 50, validity: '1 day' },
  { id: 'plan2', name: '3-Day Plan', data: '1 GB', price: 100, validity: '3 days' },
  { id: 'plan3', name: '7-Day Plan', data: '3 GB', price: 250, validity: '7 days' },
  { id: 'plan4', name: '30-Day Plan', data: '10 GB', price: 500, validity: '30 days' },
];

const TopUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('topup');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [topupAmount, setTopupAmount] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('digicel');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handleTopUp = () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }
    
    if (!topupAmount || parseInt(topupAmount) < 25) {
      toast({
        title: "Error",
        description: "Minimum top-up amount is 25 HTG",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Top-up successful!",
        description: `${topupAmount} HTG has been sent to ${phoneNumber}`,
        variant: "default"
      });
      setPhoneNumber('');
      setTopupAmount('');
    }, 1500);
  };
  
  const handlePurchasePlan = () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a data plan",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      const plan = DATA_PLANS.find(p => p.id === selectedPlan);
      toast({
        title: "Purchase successful!",
        description: `${plan?.name} (${plan?.data}) has been activated for ${phoneNumber}`,
        variant: "default"
      });
      setPhoneNumber('');
      setSelectedPlan('');
    }, 1500);
  };
  
  const handleQuickTopUp = (amount: string) => {
    setTopupAmount(amount);
  };
  
  const getSelectedOperatorLogo = () => {
    return MOBILE_OPERATORS.find(op => op.id === selectedOperator)?.logo;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white flex items-center p-4 sticky top-0 z-10 shadow-sm">
        <button 
          onClick={handleBackClick}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold ml-2">Mobile Top Up & Data</h1>
      </div>
      
      <div className="max-w-md mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="topup" className="flex items-center gap-2">
              <PhoneCall size={16} />
              <span>Mobile Credit</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Wifi size={16} />
              <span>Data Plans</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="topup">
            <Card className="p-4 mb-4">
              <h2 className="text-lg font-medium mb-4">Top Up Mobile Credit</h2>
              
              {/* Mobile operator selection */}
              <div className="mb-4">
                <Label className="mb-2 block">Select Mobile Operator</Label>
                <RadioGroup value={selectedOperator} onValueChange={setSelectedOperator} className="flex gap-4">
                  {MOBILE_OPERATORS.map((operator) => (
                    <div key={operator.id} className="flex flex-col items-center">
                      <Label 
                        htmlFor={operator.id}
                        className={`cursor-pointer p-2 border-2 rounded-lg hover:bg-gray-50 transition-colors ${
                          selectedOperator === operator.id ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={operator.logo} 
                          alt={operator.name} 
                          className="w-16 h-10 object-contain" 
                        />
                      </Label>
                      <RadioGroupItem value={operator.id} id={operator.id} className="sr-only" />
                      <span className="text-xs mt-1">{operator.name}</span>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Phone number input */}
              <div className="mb-4">
                <Label htmlFor="phone-number">Phone Number</Label>
                <div className="flex items-center mt-1">
                  <div className="bg-gray-100 border border-gray-300 px-2 py-2 rounded-l-md text-sm text-gray-600">
                    +509
                  </div>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-l-none"
                    maxLength={8}
                  />
                </div>
              </div>
              
              {/* Amount input */}
              <div className="mb-4">
                <Label htmlFor="topup-amount">Amount (HTG)</Label>
                <Input
                  id="topup-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="mt-1"
                  min="25"
                  step="5"
                />
                
                {/* Quick amount selection */}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["50", "100", "250", "500", "1000", "2000"].map((amount) => (
                    <Button 
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickTopUp(amount)}
                      className={topupAmount === amount ? 'border-blue-500 bg-blue-50' : ''}
                    >
                      {amount} HTG
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Submit button */}
              <Button 
                onClick={handleTopUp}
                disabled={isProcessing || !phoneNumber || !topupAmount}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Top Up Now'
                )}
              </Button>
              
              <p className="text-xs text-gray-500 mt-4 flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Top-ups are typically processed instantly but may take up to 15 minutes during high traffic periods.</span>
              </p>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card className="p-4 mb-4">
              <h2 className="text-lg font-medium mb-4">Purchase Data Plan</h2>
              
              {/* Mobile operator selection */}
              <div className="mb-4">
                <Label className="mb-2 block">Select Mobile Operator</Label>
                <RadioGroup value={selectedOperator} onValueChange={setSelectedOperator} className="flex gap-4">
                  {MOBILE_OPERATORS.map((operator) => (
                    <div key={operator.id} className="flex flex-col items-center">
                      <Label 
                        htmlFor={`data-${operator.id}`}
                        className={`cursor-pointer p-2 border-2 rounded-lg hover:bg-gray-50 transition-colors ${
                          selectedOperator === operator.id ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={operator.logo} 
                          alt={operator.name} 
                          className="w-16 h-10 object-contain" 
                        />
                      </Label>
                      <RadioGroupItem value={operator.id} id={`data-${operator.id}`} className="sr-only" />
                      <span className="text-xs mt-1">{operator.name}</span>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Phone number input */}
              <div className="mb-4">
                <Label htmlFor="data-phone-number">Phone Number</Label>
                <div className="flex items-center mt-1">
                  <div className="bg-gray-100 border border-gray-300 px-2 py-2 rounded-l-md text-sm text-gray-600">
                    +509
                  </div>
                  <Input
                    id="data-phone-number"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-l-none"
                    maxLength={8}
                  />
                </div>
              </div>
              
              {/* Data plans */}
              <div className="mb-4">
                <Label className="mb-2 block">Select Data Plan</Label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-2">
                  {DATA_PLANS.map((plan) => (
                    <Label
                      key={plan.id}
                      htmlFor={plan.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedPlan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-gray-500">{plan.validity} • {plan.data}</div>
                        </div>
                      </div>
                      <div className="font-medium">{plan.price} HTG</div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Submit button */}
              <Button 
                onClick={handlePurchasePlan}
                disabled={isProcessing || !phoneNumber || !selectedPlan}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Purchase Plan'
                )}
              </Button>
            </Card>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                <Info className="h-4 w-4" /> Data Plan Information
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  All plans provide high-speed data with no throttling
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  Unused data does not roll over when plan expires
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  Plans take effect immediately after purchase
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TopUpPage;