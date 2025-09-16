
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Info, Check, X, Tv } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const NETFLIX_PLANS = [
  { 
    id: 'basic', 
    name: 'Basic', 
    features: ['Watch on 1 device at a time', 'Standard Definition (SD)', 'Download on 1 device'],
    pricePerMonth: 599,
  },
  { 
    id: 'standard', 
    name: 'Standard', 
    features: ['Watch on 2 devices at a time', 'Full High Definition (HD)', 'Download on 2 devices'],
    pricePerMonth: 799,
    recommended: true,
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    features: ['Watch on 4 devices at a time', 'Ultra High Definition (4K) and HDR', 'Download on 6 devices', 'Spatial Audio'],
    pricePerMonth: 1199,
  },
];

const PAYMENT_METHODS = [
  { id: 'moncash', name: 'MonCash', logo: 'https://placehold.co/200/red/white?text=MonCash' },
  { id: 'natcash', name: 'Natcash', logo: 'https://placehold.co/200/purple/white?text=NatCash' },
];

const NetflixPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [months, setMonths] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('moncash');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const handleBackClick = () => {
    navigate(-1);
  };
  
  const handlePayment = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your Netflix email address",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedPlan) {
      toast({
        title: "Error",
        description: "Please select a Netflix plan",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      const plan = NETFLIX_PLANS.find(p => p.id === selectedPlan);
      const totalAmount = plan ? plan.pricePerMonth * months : 0;
      
      toast({
        title: "Payment successful!",
        description: `Your Netflix ${plan?.name} plan has been activated for ${months} month${months > 1 ? 's' : ''}`,
        variant: "default"
      });
      
      setEmail('');
    }, 1500);
  };
  
  const calculateTotalAmount = () => {
    const plan = NETFLIX_PLANS.find(p => p.id === selectedPlan);
    return plan ? plan.pricePerMonth * months : 0;
  };
  
  const formatCurrency = (amount: number) => {
    return `${(amount / 100).toFixed(2)} HTG`;
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
        <h1 className="text-xl font-semibold ml-2">Netflix Subscription</h1>
      </div>
      
      <div className="max-w-md mx-auto p-4">
        {/* Netflix branding */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="bg-red-600 w-16 h-16 flex items-center justify-center rounded-xl mb-2">
            <Tv size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Netflix Subscription</h2>
          <p className="text-sm text-gray-500">Select your plan and duration</p>
        </div>
      
        {/* Email input */}
        <Card className="p-4 mb-4">
          <h3 className="font-medium mb-2">Netflix Account</h3>
          <div className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Netflix email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll use this email to register or extend your Netflix subscription
            </p>
          </div>
        </Card>
      
        {/* Plan selection */}
        <Card className="p-4 mb-4">
          <h3 className="font-medium mb-2">Select Your Plan</h3>
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-3">
            {NETFLIX_PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`relative border rounded-lg p-4 ${
                  selectedPlan === plan.id ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-2 right-4 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    Recommended
                  </div>
                )}
                <div className="flex items-start">
                  <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                  <div className="ml-3 flex-1">
                    <Label htmlFor={plan.id} className="text-base font-medium">
                      {plan.name}
                    </Label>
                    <p className="font-semibold text-red-600">
                      {formatCurrency(plan.pricePerMonth)}/month
                    </p>
                    <ul className="mt-2 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <Check className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </Card>
        
        {/* Months selection */}
        <Card className="p-4 mb-4">
          <h3 className="font-medium mb-3">Subscription Duration</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 3, 6, 12].map((m) => (
              <Button 
                key={m}
                variant={months === m ? "default" : "outline"}
                className={months === m ? 'bg-red-600 hover:bg-red-700' : ''}
                onClick={() => setMonths(m)}
              >
                {m} {m === 1 ? 'month' : 'months'}
              </Button>
            ))}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm mb-1">
              <span>Monthly price:</span>
              <span>{formatCurrency(NETFLIX_PLANS.find(p => p.id === selectedPlan)?.pricePerMonth || 0)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Duration:</span>
              <span>{months} {months === 1 ? 'month' : 'months'}</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between font-bold">
              <span>Total amount:</span>
              <span className="text-red-600">{formatCurrency(calculateTotalAmount())}</span>
            </div>
          </div>
        </Card>
        
        {/* Payment method */}
        <Card className="p-4 mb-6">
          <h3 className="font-medium mb-3">Payment Method</h3>
          <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <Label
                key={method.id}
                htmlFor={method.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPaymentMethod === method.id ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <img 
                    src={method.logo} 
                    alt={method.name} 
                    className="w-16 h-10 object-contain" 
                  />
                </div>
                <div className="font-medium">{method.name}</div>
              </Label>
            ))}
          </RadioGroup>
        </Card>
        
        {/* Submit button */}
        <Button 
          onClick={handlePayment}
          disabled={isProcessing || !email || !selectedPlan}
          className="w-full bg-red-600 hover:bg-red-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${formatCurrency(calculateTotalAmount())}`
          )}
        </Button>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" /> Important Information
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 shrink-0" />
              Your subscription will be activated within 24 hours
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 shrink-0" />
              Payment is non-refundable once processed
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 shrink-0" />
              For issues, contact our customer support
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetflixPage;