
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, Shield } from 'lucide-react';

interface PayPalConfigProps {
  onSave: (clientId: string, isProduction: boolean) => void;
  onCancel: () => void;
}

const PayPalConfig: React.FC<PayPalConfigProps> = ({ onSave, onCancel }) => {
  const [clientId, setClientId] = useState('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');
  const [isValidId, setIsValidId] = useState(false);
  
  // Load saved environment and client ID on component mount
  useEffect(() => {
    const savedEnvironment = localStorage.getItem('paypal_environment') as 'sandbox' | 'production';
    const savedClientId = localStorage.getItem('paypal_client_id');
    
    if (savedEnvironment) {
      setEnvironment(savedEnvironment);
    }
    
    if (savedClientId) {
      setClientId(savedClientId);
      validateClientId(savedClientId);
    }
  }, []);
  
  const validateClientId = (id: string) => {
    // Basic validation for PayPal Client ID format
    const isValid = id.trim().length >= 20 && (
      (environment === 'sandbox' && id.startsWith('AS')) || 
      (environment === 'production' && id.startsWith('AY'))
    );
    
    setIsValidId(isValid);
    return isValid;
  };
  
  const handleClientIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setClientId(newId);
    validateClientId(newId);
  };
  
  const handleEnvironmentChange = (value: 'sandbox' | 'production') => {
    setEnvironment(value);
    // Re-validate the client ID when environment changes
    validateClientId(clientId);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your PayPal Client ID.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValidId) {
      toast({
        title: "Invalid Client ID",
        description: `This doesn't appear to be a valid ${environment} Client ID. Please check and try again.`,
        variant: "destructive",
      });
      return;
    }
    
    // Save to localStorage for persistence
    localStorage.setItem('paypal_client_id', clientId);
    localStorage.setItem('paypal_environment', environment);
    
    // Notify parent component
    onSave(clientId, environment === 'production');
    
    toast({
      title: "API Key Saved",
      description: `Your PayPal Client ID has been saved securely for ${environment} mode.`,
      variant: "default",
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Configure PayPal Integration</h2>
      <p className="text-gray-600 mb-4">
        Please enter your PayPal Client ID to activate the PayPal payment gateway.
        This will be stored locally in your browser and not sent to any server.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="environment" className="mb-2 block">Environment</Label>
          <RadioGroup 
            value={environment} 
            onValueChange={(value) => handleEnvironmentChange(value as 'sandbox' | 'production')} 
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sandbox" id="sandbox" />
              <Label htmlFor="sandbox" className="font-normal cursor-pointer">Sandbox (Testing)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="production" id="production" />
              <Label htmlFor="production" className="font-normal cursor-pointer">Production (Live)</Label>
            </div>
          </RadioGroup>
          {environment === 'production' && (
            <div className="flex items-center gap-2 text-amber-600 text-sm mt-1 bg-amber-50 p-2 rounded border border-amber-200">
              <AlertCircle className="h-4 w-4" />
              <span>
                Production mode will process real payments with actual money
              </span>
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <Label htmlFor="clientId">PayPal Client ID</Label>
          <Input
            id="clientId"
            value={clientId}
            onChange={handleClientIdChange}
            placeholder={environment === 'production' 
              ? "Live Client ID (e.g., AYxxx...)" 
              : "Sandbox Client ID (e.g., ASxxx...)"}
            className={`w-full mt-1 ${isValidId ? 'border-green-500' : clientId ? 'border-red-300' : ''}`}
          />
          <div className="flex justify-between">
            <p className="text-xs text-gray-500 mt-1">
              You can find your Client ID in your PayPal Developer Dashboard 
              under {environment === 'production' ? 'Live' : 'Sandbox'} API Credentials.
            </p>
            {isValidId && (
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Valid {environment} Client ID
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Security Notice</h3>
              <p className="text-xs text-blue-700">
                Your Client ID is stored locally in your browser only and never sent to our servers.
                We recommend using a Sandbox Client ID for testing before switching to Production.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant={environment === 'production' ? 'destructive' : 'default'}
            disabled={clientId.trim().length === 0}
          >
            {environment === 'production' ? 'Save Live API Key' : 'Save Test API Key'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PayPalConfig;
