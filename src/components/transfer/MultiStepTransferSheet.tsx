import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, DollarSign, User, CreditCard, Shield, Clock, CheckCircle, Receipt } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import StepOneTransfer from '@/components/transfer/StepOneTransfer';
import StepTwoTransfer from '@/components/transfer/StepTwoTransfer';
import StepThreeTransfer from '@/components/transfer/StepThreeTransfer';
import PaymentMethodList from '@/components/transfer/PaymentMethodList';
import PayPalHostedCheckout from '@/components/transfer/PayPalHostedCheckout';
import CompactCardSelection from '@/components/transfer/CompactCardSelection';
import { internationalPaymentMethods } from '@/components/transfer/PaymentMethods';

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
  selectedPaymentMethod?: string;
}

interface MultiStepTransferSheetProps {
  onClose: () => void;
}

const MultiStepTransferSheet: React.FC<MultiStepTransferSheetProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFullHeight, setIsFullHeight] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  
  const [transferData, setTransferData] = useState<TransferData>({
    amount: '',
    receiverDetails: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      department: 'Artibonite',
      arrondissement: '',
      commune: '',
    },
    selectedPaymentMethod: 'credit-card'
  });

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateTransferData = (data: Partial<TransferData>) => {
    setTransferData(prev => ({ ...prev, ...data }));
  };

  const handlePaymentMethodChange = (methodId: string) => {
    updateTransferData({ selectedPaymentMethod: methodId });
  };

  const handlePaymentSuccess = (details: any) => {
    console.log('Payment successful:', details);
    setPaymentCompleted(true);
    setTransactionId(details.id || `TX${Date.now()}`);
    setCurrentStep(5); // Move to receipt step
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
  };

  // Touch/Mouse event handlers for drag functionality
  const handleStart = (clientY: number) => {
    setStartY(clientY);
    setCurrentY(clientY);
    setIsDragging(true);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    setCurrentY(clientY);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const deltaY = startY - currentY;
    const threshold = 100; // pixels to trigger full height

    if (deltaY > threshold) {
      setIsFullHeight(true);
    } else if (deltaY < -threshold && isFullHeight) {
      setIsFullHeight(false);
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const canProceedFromStep1 = transferData.amount && parseFloat(transferData.amount) > 0;
  const canProceedFromStep2 = transferData.receiverDetails.firstName && 
                              transferData.receiverDetails.lastName &&
                              transferData.receiverDetails.phoneNumber && 
                              transferData.receiverDetails.arrondissement &&
                              transferData.receiverDetails.commune;
  const canProceedFromStep3 = transferData.selectedPaymentMethod;

  const stepTitles = ['Send Money', 'Recipient Details', 'Payment Method', 'Review & Pay', 'Transfer Complete'];

  // Animation variants for step indicator - similar to bottom nav
  const stepVariants = {
    inactive: { 
      scale: 1,
      backgroundColor: '#E5E7EB',
      color: '#6B7280'
    },
    active: { 
      scale: 1.05,
      backgroundColor: '#DC2626',
      color: '#FFFFFF',
        transition: {
          type: "spring" as const,
          stiffness: 260,
          damping: 20
        }
    },
    completed: {
      scale: 1,
      backgroundColor: '#10B981',
      color: '#FFFFFF',
      transition: {
            type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
  };

  const lineVariants = {
    inactive: {
      backgroundColor: '#E5E7EB',
      scaleX: 1
    },
    active: {
      backgroundColor: '#10B981',
      scaleX: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const
      }
    }
  };

  const labelVariants = {
    inactive: {
      color: '#6B7280',
      fontWeight: 400
    },
    active: {
      color: '#DC2626',
      fontWeight: 600,
      transition: { duration: 0.2 }
    },
    completed: {
      color: '#10B981',
      fontWeight: 500,
      transition: { duration: 0.2 }
    }
  };

  // Calculate transfer fee and total using new 15% per $100 logic
  const transferFee = transferData.amount ? (Math.ceil(parseFloat(transferData.amount) / 100) * 15).toFixed(2) : '0.00';
  const totalAmount = transferData.amount ? (parseFloat(transferData.amount) + parseFloat(transferFee)).toFixed(2) : '0.00';

  // Calculate receiver amount (assuming USD to HTG conversion rate of 127.5)
  const receiverAmount = transferData.amount ? (parseFloat(transferData.amount) * 127.5).toFixed(2) : '0.00';

  return (
    <div 
      ref={panelRef}
      className={`flex flex-col bg-white rounded-t-lg shadow-lg relative transition-all duration-300 ${
        isFullHeight ? 'h-screen' : 'h-[95vh]'
      }`}
    >
      {/* Header with Title only - removed X button */}
      <div className="flex items-center justify-center py-4 px-4 bg-white rounded-t-lg flex-shrink-0">
        <h1 className="text-xl font-semibold text-gray-900">
          {stepTitles[currentStep - 1]}
        </h1>
      </div>
      
      {/* Animated Step Indicator */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <motion.div 
                  className={`rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm ${
                    step === currentStep 
                      ? 'w-auto h-7 px-2 bg-red-600 text-white' 
                      : 'w-7 h-7 bg-gray-200 text-gray-600'
                  }`}
                  variants={stepVariants}
                  initial="inactive"
                  animate={
                    step === currentStep ? 'active' : 
                    step < currentStep ? 'completed' : 
                    'inactive'
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  {step < currentStep ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : step === currentStep ? (
                    <div className="flex items-center space-x-1">
                      {step === 1 ? (
                        <DollarSign className="h-3 w-3" />
                      ) : step === 2 ? (
                        <User className="h-3 w-3" />
                      ) : step === 3 ? (
                        <CreditCard className="h-3 w-3" />
                      ) : step === 4 ? (
                        <Shield className="h-3 w-3" />
                      ) : (
                        <Receipt className="h-3 w-3" />
                      )}
                      <span className="font-medium whitespace-nowrap text-xs">
                        {stepTitles[index].split(' ')[0]}
                      </span>
                    </div>
                  ) : (
                    step
                  )}
                </motion.div>
              </div>
              {index < 4 && (
                <motion.div 
                  className="flex-1 h-0.5 mx-2 rounded-full origin-left"
                  variants={lineVariants}
                  initial="inactive"
                  animate={step < currentStep ? 'active' : 'inactive'}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content - Reduced padding and consistent spacing */}
      <div className="flex-1 overflow-y-auto pb-64">
        <div className="px-4 py-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">Enter the amount you want to send</p>
              </div>
              
              <StepOneTransfer 
                amount={transferData.amount}
                onAmountChange={(amount) => updateTransferData({ amount })}
              />
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">Who are you sending ${transferData.amount} to?</p>
              </div>
              
              <StepTwoTransfer 
                receiverDetails={transferData.receiverDetails}
                onDetailsChange={(receiverDetails) => updateTransferData({ receiverDetails })}
              />
              
              {(transferData.receiverDetails.firstName || transferData.receiverDetails.lastName) && (
                <div className="bg-green-50 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">Secure Transfer</h4>
                    <p className="text-sm text-green-700">Recipient information is encrypted and secure</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Choose Payment Method</h2>
                <p className="text-sm text-gray-600">
                  Sending ${transferData.amount} to {transferData.receiverDetails.firstName} {transferData.receiverDetails.lastName}
                </p>
              </div>
              
              <CompactCardSelection
                selectedMethod={transferData.selectedPaymentMethod}
                onMethodChange={handlePaymentMethodChange}
              />
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-800">Bank-Level Security</p>
                    <p className="text-xs text-blue-600">Your payment information is fully encrypted and protected</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm">Review your transfer details before proceeding</p>
              </div>
              
              <div className="bg-black text-white rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-white mb-2 text-sm">Transfer Summary</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-300">To:</span>
                    <span className="font-medium text-right">{transferData.receiverDetails.firstName} {transferData.receiverDetails.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Amount:</span>
                    <span className="font-medium">${transferData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Fee:</span>
                    <span className="font-medium">${transferFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Rate:</span>
                    <span className="font-medium">1 USD = 127.5 HTG</span>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
                  <span className="font-semibold text-sm">Total</span>
                  <span className="text-lg font-bold text-green-400">${totalAmount}</span>
                </div>
              </div>
              
              <StepThreeTransfer amount={transferData.amount} />
              
              <div className="flex justify-center">
                <Button 
                  onClick={handlePaymentSuccess}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  Complete Payment
                </Button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600">Your money has been sent successfully</p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Receipt className="h-5 w-5 mr-2" />
                    Receipt
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-gray-900">{transactionId}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className="text-green-600 font-medium">Completed</span>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Recipient</span>
                      <span className="font-medium">{transferData.receiverDetails.firstName} {transferData.receiverDetails.lastName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phone Number</span>
                      <span className="font-medium">+509 {transferData.receiverDetails.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-right max-w-xs">{transferData.receiverDetails.commune}, {transferData.receiverDetails.arrondissement}, {transferData.receiverDetails.department}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount Sent</span>
                      <span className="font-medium">${transferData.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transfer Fee</span>
                      <span className="font-medium">${transferFee}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total Paid</span>
                      <span className="text-blue-600">${totalAmount}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium capitalize">
                        {transferData.selectedPaymentMethod?.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Delivery Information</h4>
                      <p className="text-sm text-green-700 mt-1">
                        The recipient will receive the funds within 24-48 hours. They will be notified via SMS when the money is ready for pickup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.share?.({
                      title: 'Transfer Receipt',
                      text: `Transfer of $${transferData.amount} to ${transferData.receiverDetails.firstName} ${transferData.receiverDetails.lastName} completed successfully. Transaction ID: ${transactionId}`,
                    }).catch(() => {
                      navigator.clipboard?.writeText(`Transaction ID: ${transactionId}`);
                    });
                  }}
                  className="flex-1"
                >
                  Share Receipt
                </Button>
                <Button 
                  onClick={onClose}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Navigation Buttons - Fixed at bottom of viewport */}
      {currentStep < 5 && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white px-4 py-3 z-[60] shadow-lg">
          <div className="flex gap-3 max-w-md mx-auto">
            {currentStep === 1 ? (
              <Button 
                onClick={handleNextStep}
                disabled={!canProceedFromStep1}
                className="flex-1 transition-all duration-200"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handlePreviousStep}
                  className="flex-1 transition-all duration-200"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button 
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 2 && !canProceedFromStep2) ||
                      (currentStep === 3 && !canProceedFromStep3)
                    }
                    className="flex-1 transition-all duration-200"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex-1"></div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepTransferSheet;
