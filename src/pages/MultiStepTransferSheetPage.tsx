import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ChevronLeft, DollarSign, User, CreditCard, Shield, Clock, CheckCircle, Receipt, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StepOneTransfer from '@/components/transfer/StepOneTransfer';
import StepTwoTransfer from '@/components/transfer/StepTwoTransfer';
import PaymentMethodList from '@/components/transfer/PaymentMethodList';
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

const MultiStepTransferSheetPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  
  const [transferData, setTransferData] = useState<TransferData>({
    amount: '100.00',
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

  // PayPal integration effect for step 3
  useEffect(() => {
    if (currentStep === 3 && paypalContainerRef.current) {
      const container = paypalContainerRef.current;
      
      // Clear any existing content
      container.innerHTML = '';

      // Add PayPal checkout styles
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        :root {
          --bg-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --bg-secondary: #1e1b2e;
          --bg-card: #ffffff;
          --bg-glass: rgba(255, 255, 255, 0.95);
          --text-primary: #1a1d29;
          --text-secondary: #6b7394;
          --text-muted: #9ca3c4;
          --accent-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --accent-secondary: #667eea;
          --border: #e2e8f0;
          --border-focus: #667eea;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --success: #10b981;
          --success-bg: #d1fae5;
          --error: #ef4444;
          --error-bg: #fee2e2;
          --border-radius-sm: 12px;
          --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .checkout-container {
          width: 100%;
          background: var(--bg-card);
          border-radius: var(--border-radius-sm);
          padding: 1.5rem;
          box-shadow: var(--shadow);
        }

        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          position: relative;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .form-input, .form-field {
          width: 100%;
          padding: 1rem 1.125rem;
          background: var(--bg-card);
          border: 2px solid var(--border);
          border-radius: var(--border-radius-sm);
          color: var(--text-primary);
          font-size: 1rem;
          font-family: inherit;
          font-weight: 500;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .form-input:focus, .form-field:focus {
          outline: none;
          border-color: var(--border-focus);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), var(--shadow);
        }

        .form-input::placeholder {
          color: var(--text-muted);
          font-weight: 400;
        }

        .card-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .card-row {
          display: flex;
          gap: 0.75rem;
        }

        .card-row .card-field {
          flex: 1;
        }

        .card-field {
          padding: 1rem 1.125rem;
          background: var(--bg-card);
          border: 2px solid var(--border);
          border-radius: var(--border-radius-sm);
          transition: var(--transition);
          min-height: 56px;
          display: flex;
          align-items: center;
          width: 100%;
          box-shadow: var(--shadow-sm);
        }

        .card-field:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), var(--shadow);
        }

        .card-field iframe {
          border: none !important;
          outline: none !important;
          width: 100% !important;
          height: 24px !important;
        }

        .pay-button {
          width: 100%;
          padding: 1rem 1.5rem;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          margin-top: 1rem;
          font-family: inherit;
          min-height: 56px;
        }

        .pay-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .pay-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .alert {
          padding: 1rem 1.25rem;
          border-radius: var(--border-radius-sm);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .alert-success {
          background: var(--success-bg);
          color: var(--success);
        }

        .alert-error {
          background: var(--error-bg);
          color: var(--error);
        }

        .alert-close {
          position: absolute;
          top: 0.75rem;
          right: 1rem;
          background: none;
          border: none;
          color: inherit;
          font-size: 1.25rem;
          cursor: pointer;
          opacity: 0.7;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin: 0 auto;
        }

        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .skeleton-card-row {
          display: flex;
          gap: 0.75rem;
        }

        .skeleton-card-row .skeleton-shimmer {
          flex: 1;
        }

        .hide {
          display: none !important;
        }

        .security-info {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 600;
          padding: 0.5rem 1rem;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 50px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .security-icon {
          width: 16px;
          height: 16px;
          color: var(--success);
        }
      `;
      document.head.appendChild(styleElement);

      // Create the checkout HTML structure
      const checkoutHTML = `
        <div class="checkout-container">
          <div id="alerts"></div>
          
          <div id="loading" class="loading-container">
            <div class="skeleton-form">
              <div class="form-group">
                <div class="skeleton-shimmer h-4 w-24 mb-2 rounded"></div>
                <div class="skeleton-shimmer h-12 w-full rounded-xl"></div>
              </div>

              <div class="form-group">
                <div class="skeleton-shimmer h-4 w-32 mb-2 rounded"></div>
                <div class="space-y-3">
                  <div class="skeleton-shimmer h-12 w-full rounded-xl"></div>
                  <div class="skeleton-card-row">
                    <div class="skeleton-shimmer h-12 rounded-xl"></div>
                    <div class="skeleton-shimmer h-12 rounded-xl"></div>
                  </div>
                </div>
              </div>

              <div class="skeleton-shimmer h-12 w-full rounded-xl mt-4"></div>

              <div class="mt-8 text-center">
                <div class="skeleton-shimmer h-8 w-32 mx-auto rounded-full"></div>
              </div>
            </div>
          </div>

          <div id="content" class="hide">
            <form id="card-form" class="payment-form">
              <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <input type="email" id="email" class="form-input" placeholder="your@email.com" required />
              </div>

              <div class="form-group">
                <label class="form-label">Card Information</label>
                <div class="card-group">
                  <div class="card-field" id="card-number"></div>
                  <div class="card-row">
                    <div class="card-field" id="expiration-date"></div>
                    <div class="card-field" id="cvv"></div>
                  </div>
                </div>
              </div>

              <button type="submit" class="pay-button">Loading...</button>
            </form>

            <div class="security-info">
              <div class="security-badge">
                <svg class="security-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                </svg>
                Secured by PayPal
              </div>
            </div>
          </div>
        </div>
      `;

      container.innerHTML = checkoutHTML;

      // Add PayPal integration script
      const script = document.createElement('script');
      script.innerHTML = `
        let current_customer_id;
        let order_id;
        let currentPrice = null;
        let paypal_hosted_fields = null;

        const API_BASE_URL = "https://paypal-with-nodejs.onrender.com";
        const paypal_sdk_url = "https://www.paypal.com/sdk/js";
        const client_id = "AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4--RTg146F1Mj";
        const currency = "USD";
        const intent = "capture";

        let script_to_head = (attributes_object) => {
            return new Promise((resolve, reject) => {
              const script = document.createElement('script');
              for (const name of Object.keys(attributes_object)) {
                script.setAttribute(name, attributes_object[name]);
              }
              document.head.appendChild(script);
              script.addEventListener('load', resolve);
              script.addEventListener('error', reject);
            });
        }

        const fetchCurrentPrice = () => {
          const priceData = {
            value: "${transferData.amount}",
            display: "$${parseFloat(transferData.amount).toFixed(2)}",
            currency: "USD"
          };
          
          currentPrice = priceData;
          
          const submitBtn = document.querySelector('.pay-button');
          if (submitBtn) {
            submitBtn.textContent = \`Pay \${priceData.display}\`;
          }
          
          return Promise.resolve(priceData);
        };

        let reset_purchase_button = () => {
            const btn = document.querySelector("#card-form").querySelector("button[type='submit']");
            if (btn) {
              btn.removeAttribute("disabled");
              const buttonText = currentPrice ? \`Pay \${currentPrice.display}\` : "Pay Now";
              btn.textContent = buttonText;
            }
        }

        const is_user_logged_in = () => {
          return new Promise((resolve) => {
            current_customer_id = "";
            resolve();
          });
        }

        const get_client_token = () => {
          return new Promise(async (resolve, reject) => {
            try {
              const response = await fetch(\`\${API_BASE_URL}/get_client_token\`, {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "customer_id": current_customer_id }),
              });

              const client_token = await response.text();
              resolve(client_token);
            } catch (error) {
              reject(error);
            }
          });
        }

        let handle_click = (event) => {
            if (event.target.classList.contains("alert-close")) {
                event.target.closest(".alert").remove();
            }
        }

        document.addEventListener("click", handle_click);

        let display_error_alert = (message = "An error occurred. Please try again.") => {
            const alertsContainer = document.getElementById("alerts");
            if (alertsContainer) {
              alertsContainer.innerHTML = \`<div class="alert alert-error"><button class="alert-close">×</button>\${message}</div>\`;
            }
        }

        let display_success_message = (order_details) => {
            const alertsContainer = document.getElementById("alerts");
            if (alertsContainer) {
              alertsContainer.innerHTML = \`<div class='alert alert-success'>Payment successful! Your transfer has been initiated.</div>\`;
            }

            const cardForm = document.getElementById("card-form");
            if (cardForm) {
              cardForm.classList.add("hide");
            }

            // Trigger step completion
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('paymentSuccess', { 
                detail: { orderDetails: order_details } 
              }));
            }, 2000);
        }

        is_user_logged_in()
        .then(() => {
            return fetchCurrentPrice();
        })
        .then((priceData) => {
            return get_client_token();
        })
        .then((client_token) => {
            return script_to_head({
                "src": paypal_sdk_url + "?client-id=" + client_id + "&enable-funding=venmo&currency=" + currency + "&intent=" + intent + "&components=hosted-fields", 
                "data-client-token": client_token
            });
        })
        .then(() => {
            const loadingElement = document.getElementById("loading");
            const contentElement = document.getElementById("content");
            
            if (loadingElement) loadingElement.classList.add("hide");
            if (contentElement) contentElement.classList.remove("hide");

            if (window.paypal && window.paypal.HostedFields.isEligible()) {
                paypal_hosted_fields = window.paypal.HostedFields.render({
                  createOrder: () => {
                    return fetch(\`\${API_BASE_URL}/create_order\`, {
                        method: "post", 
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify({ 
                            "intent": intent,
                            "amount": currentPrice ? currentPrice.value : null
                        })
                    })
                    .then((response) => response.json())
                    .then((order) => { 
                        order_id = order.id; 
                        return order.id; 
                    });
                  },
                  styles: {
                    'input': {
                        'font-size': '16px',
                        'color': '#1a1a21',
                        'font-family': 'Inter, sans-serif',
                        'font-weight': '400'
                    },
                    ':focus': { 'color': '#1a1a21' },
                    '.valid': { 'color': '#1a1a21' },
                    '.invalid': { 'color': '#dc2626' }
                  },
                  fields: {
                    number: { selector: "#card-number", placeholder: "1234 1234 1234 1234" },
                    cvv: { selector: "#cvv", placeholder: "CVC" },
                    expirationDate: { selector: "#expiration-date", placeholder: "MM / YY" }
                  }
                }).then((card_fields) => {
                  const cardForm = document.querySelector("#card-form");
                  if (cardForm) {
                    cardForm.addEventListener("submit", (event) => {
                      event.preventDefault();

                      const submitBtn = cardForm.querySelector("button[type='submit']");
                      if (submitBtn) {
                        submitBtn.setAttribute("disabled", "");
                        submitBtn.textContent = "Processing...";
                      }

                      card_fields.submit({
                          cardholderName: "Transfer Customer",
                          billingAddress: {
                            streetAddress: "123 Springfield Rd",
                            extendedAddress: "",
                            region: "AZ",
                            locality: "CHANDLER",
                            postalCode: "85224",
                            countryCodeAlpha2: "US",
                          },
                        })
                        .then(() => {
                          const emailInput = document.getElementById("email");
                          return fetch(\`\${API_BASE_URL}/complete_order\`, {
                              method: "post", 
                              headers: { "Content-Type": "application/json; charset=utf-8" },
                              body: JSON.stringify({
                                  "intent": intent,
                                  "order_id": order_id,
                                  "email": emailInput ? emailInput.value : ""
                              })
                          })
                          .then((response) => response.json())
                          .then((order_details) => {
                              display_success_message(order_details);
                           })
                           .catch((error) => {
                              display_error_alert("Payment processing failed. Please try again.");
                              reset_purchase_button();
                           });
                        })
                        .catch((err) => {
                          reset_purchase_button();
                          display_error_alert("Card validation failed. Please check your information.");
                        });
                    });
                  }
                });
              } else {
                display_error_alert("Card payments are not supported in this browser.");
              }
        })
        .catch((error) => {
            reset_purchase_button();
            display_error_alert("Failed to initialize payment system. Please refresh the page.");
        });
      `;

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      };
    }
  }, [currentStep, transferData.amount]);

  // Listen for payment success
  useEffect(() => {
    const handlePaymentSuccess = (event: any) => {
      setPaymentCompleted(true);
      setTransactionId(event.detail.orderDetails.id || `TX${Date.now()}`);
      setCurrentStep(4);
    };

    window.addEventListener('paymentSuccess', handlePaymentSuccess);
    return () => window.removeEventListener('paymentSuccess', handlePaymentSuccess);
  }, []);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackClick = () => {
    if (currentStep === 1) {
      navigate(-1);
    } else {
      handlePreviousStep();
    }
  };

  const handleCloseClick = () => {
    navigate(-1);
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
  const canProceedFromStep3 = transferData.selectedPaymentMethod;

  const stepTitles = ['Send Money', 'Recipient Details', 'Payment Method', 'Transfer Complete'];

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

  const transferFee = transferData.amount ? (Math.ceil(parseFloat(transferData.amount) / 100) * 15).toFixed(2) : '0.00';
  const totalAmount = transferData.amount ? (parseFloat(transferData.amount) + parseFloat(transferFee)).toFixed(2) : '0.00';
  const receiverAmount = transferData.amount ? (parseFloat(transferData.amount) * 127.5).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-white">
      {/* Header with reduced height, back button (chevron), step title, and close button */}
      <div className="bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between p-2 h-12">
          <button 
            onClick={handleBackClick}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex-1 flex justify-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {stepTitles[currentStep - 1]}
            </h1>
          </div>
          
          <button 
            onClick={handleCloseClick}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Animated Step Indicator */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step, index) => (
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
                {index < 3 && (
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
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto pb-32">
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
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Complete Your Payment</h2>
                <p className="text-gray-600 leading-relaxed">
                  Sending <span className="font-semibold text-blue-600">${transferData.amount}</span> to{' '}
                  <span className="font-semibold text-gray-900">
                    {transferData.receiverDetails.firstName} {transferData.receiverDetails.lastName}
                  </span>
                </p>
              </div>
              
              {/* PayPal Checkout Container */}
              <div ref={paypalContainerRef}></div>
            </div>
          )}

          {currentStep === 4 && (
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
                  onClick={() => navigate('/for-you')}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Navigation Buttons */}
      {currentStep < 4 && (
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
                
                {currentStep < 3 ? (
                  <Button 
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 2 && !canProceedFromStep2)
                    }
                    className="flex-1 transition-all duration-200"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : currentStep === 3 ? (
                  <Button 
                    onClick={() => {
                      // Payment is handled by the embedded PayPal checkout
                    }}
                    disabled={!canProceedFromStep3}
                    className="flex-1 transition-all duration-200"
                  >
                    Continue
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

export default MultiStepTransferSheetPage;