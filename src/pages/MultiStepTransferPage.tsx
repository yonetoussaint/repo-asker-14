
import React, { useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import TransferHeader from '@/components/transfer/TransferHeader';
import StepOneTransfer from '@/components/transfer/StepOneTransfer';
import StepTwoTransfer from '@/components/transfer/StepTwoTransfer';
import StepThreeTransfer from '@/components/transfer/StepThreeTransfer';
import LocationSelector from '@/components/product/LocationSelector';
import ShippingOptionsComponent from '@/components/product/ShippingOptionsComponent';

export interface TransferData {
  amount: string;
  receiverDetails: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    department: string;
    arrondissement: string;
    commune: string;
  };
}

const MultiStepTransferPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState<TransferData>({
    amount: '',
    receiverDetails: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      department: 'Artibonite',
      arrondissement: '',
      commune: '',
    }
  });

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/transfer');
    }
  };

  const updateTransferData = (data: Partial<TransferData>) => {
    setTransferData(prev => ({ ...prev, ...data }));
  };

  const canProceedFromStep1 = transferData.amount && parseFloat(transferData.amount) > 0;
  const canProceedFromStep2 = transferData.receiverDetails.firstName && 
                              transferData.receiverDetails.lastName && 
                              transferData.receiverDetails.phoneNumber && 
                              transferData.receiverDetails.arrondissement &&
                              transferData.receiverDetails.commune;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TransferHeader />
      
      {/* Step Indicator */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-center mb-6">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : step < currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 5 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold">
            {currentStep === 1 && 'Enter Amount'}
            {currentStep === 2 && 'Recipient Details'}
            {currentStep === 3 && 'Location'}
            {currentStep === 4 && 'Shipping Options'}
            {currentStep === 5 && 'Payment'}
          </h2>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-md mx-auto px-4">
        {currentStep === 1 && (
          <StepOneTransfer 
            amount={transferData.amount}
            onAmountChange={(amount) => updateTransferData({ amount })}
          />
        )}
        
        {currentStep === 2 && (
          <StepTwoTransfer 
            receiverDetails={transferData.receiverDetails}
            onDetailsChange={(receiverDetails) => updateTransferData({ receiverDetails })}
          />
        )}
        
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-medium">Select Delivery Location</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <LocationSelector />
            </div>
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-medium">Choose Shipping Method</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <ShippingOptionsComponent />
            </div>
          </div>
        )}
        
        {currentStep === 5 && (
          <StepThreeTransfer amount={transferData.amount} />
        )}
      </div>

      {/* Sticky Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex gap-3">
          <Button 
            variant="outline" 
            onClick={handlePreviousStep}
            className="flex-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {currentStep === 1 ? 'Back to Home' : 'Previous'}
          </Button>
          
          {currentStep < 5 && (
            <Button 
              onClick={handleNextStep}
              disabled={
                currentStep === 1 ? !canProceedFromStep1 : 
                currentStep === 2 ? !canProceedFromStep2 : 
                false
              }
              className="flex-1"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepTransferPage;