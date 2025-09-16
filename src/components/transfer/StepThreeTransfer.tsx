
import React, { useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';

interface StepThreeTransferProps {
  amount: string;
}

const StepThreeTransfer: React.FC<StepThreeTransferProps> = ({ amount }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Add the exact styles from DynamicPayPalCheckout
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      :root {
        --bg-primary: #0f0f14;
        --bg-secondary: #1a1a21;
        --bg-card: #ffffff;
        --text-primary: #1a1a21;
        --text-secondary: #6b7280;
        --text-muted: #9ca3af;
        --accent-primary: #5b5bd6;
        --accent-hover: #4c4cc4;
        --success: #059669;
        --error: #dc2626;
        --border: #e5e7eb;
        --border-focus: #5b5bd6;
        --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }

      .transfer-checkout-card {
        background: var(--bg-card);
        border-radius: 12px;
        padding: 2rem;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--border);
      }

      .transfer-payment-form {
        space-y: 1rem;
      }

      .transfer-form-group {
        margin-bottom: 1rem;
      }

      .transfer-form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
        margin-bottom: 0.375rem;
      }

      .transfer-form-input, .transfer-form-field {
        width: 100%;
        padding: 0.75rem 0.875rem;
        background: var(--bg-card);
        border: 1.5px solid var(--border);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 1rem;
        font-family: inherit;
        transition: all 0.15s ease;
        appearance: none;
      }

      .transfer-form-input:focus, .transfer-form-field:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgba(91, 91, 214, 0.1);
      }

      .transfer-form-input::placeholder {
        color: var(--text-muted);
        font-size: 1rem;
      }

      .transfer-card-row {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }

      .transfer-card-row .transfer-card-field {
        flex: 1;
      }

      .transfer-card-field {
        padding: 0.75rem 0.875rem;
        background: var(--bg-card);
        border: 1.5px solid var(--border);
        border-radius: 8px;
        transition: all 0.15s ease;
        min-height: 48px;
        display: flex;
        align-items: center;
        width: 100%;
      }

      .transfer-card-field:focus-within {
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px rgba(91, 91, 214, 0.1);
      }

      .transfer-card-field iframe {
        border: none !important;
        outline: none !important;
        width: 100% !important;
        height: 20px !important;
      }

      .transfer-pay-button {
        width: 100%;
        padding: 0.875rem 1rem;
        background: var(--accent-primary);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        margin-top: 1.5rem;
        font-family: inherit;
        min-height: 48px;
      }

      .transfer-pay-button:hover:not(:disabled) {
        background: var(--accent-hover);
        transform: translateY(-1px);
      }

      .transfer-pay-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .transfer-alert {
        padding: 0.875rem 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        position: relative;
        font-size: 0.875rem;
      }

      .transfer-alert-success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: var(--success);
      }

      .transfer-alert-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: var(--error);
      }

      .transfer-alert-close {
        position: absolute;
        top: 0.5rem;
        right: 0.75rem;
        background: none;
        border: none;
        color: inherit;
        font-size: 1.125rem;
        cursor: pointer;
        opacity: 0.7;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .transfer-alert-close:hover {
        opacity: 1;
      }

      .transfer-loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3rem 0;
      }

      .transfer-spinner {
        width: 32px;
        height: 32px;
        border: 2px solid var(--border);
        border-top: 2px solid var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .transfer-hide {
        display: none !important;
      }

      .transfer-security-info {
        text-align: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);
      }

      .transfer-security-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .transfer-security-icon {
        width: 16px;
        height: 16px;
        color: var(--success);
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(styleElement);

    // Create the checkout container with exact structure from DynamicPayPalCheckout
    const checkoutContainer = document.createElement('div');
    checkoutContainer.innerHTML = `
      <div class="transfer-checkout-card">
        <!-- Alerts -->
        <div id="transfer-alerts"></div>

        <!-- Loading State -->
        <div id="transfer-loading" class="transfer-loading-container">
          <div class="transfer-spinner"></div>
        </div>

        <!-- Payment Form -->
        <div id="transfer-content" class="transfer-hide">
          <form id="transfer-card-form" class="transfer-payment-form">
            <!-- Email -->
            <div class="transfer-form-group">
              <label for="transfer-email" class="transfer-form-label">Email</label>
              <input type="email" id="transfer-email" class="transfer-form-input" placeholder="Enter your email" required />
            </div>

            <!-- Card Information -->
            <div class="transfer-form-group">
              <label class="transfer-form-label">Card information</label>
              <div class="transfer-card-field" id="transfer-card-number"></div>
              <div class="transfer-card-row">
                <div class="transfer-card-field" id="transfer-expiration-date"></div>
                <div class="transfer-card-field" id="transfer-cvv"></div>
              </div>
            </div>

            <!-- Button text will be populated dynamically -->
            <button type="submit" class="transfer-pay-button">Loading...</button>
          </form>

          <!-- Security Info -->
          <div class="transfer-security-info">
            <div class="transfer-security-badge">
              <svg class="transfer-security-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
              </svg>
              Secured by PayPal
            </div>
          </div>
        </div>
      </div>
    `;

    containerRef.current.appendChild(checkoutContainer);

    // Load the exact JavaScript from DynamicPayPalCheckout with transfer-specific modifications
    const script = document.createElement('script');
    script.innerHTML = `
      // Global variables to store application state
      let transfer_current_customer_id;
      let transfer_order_id;
      let transfer_currentPrice = null;
      let transfer_paypal_hosted_fields = null;

      // Replace this URL with your actual Render.com backend URL
      const TRANSFER_API_BASE_URL = "https://paypal-with-nodejs.onrender.com";

      // PayPal SDK configuration
      const transfer_paypal_sdk_url = "https://www.paypal.com/sdk/js";
      const transfer_client_id = "AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4--RTg146F1Mj";
      const transfer_currency = "USD";
      const transfer_intent = "capture";
      const transferAmount = "${amount}";

      /**
       * Helper function to dynamically load PayPal SDK script
       */
      let transfer_script_to_head = (attributes_object) => {
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

      /**
       * Fetch current price from backend for transfer
       */
      const transfer_fetchCurrentPrice = () => {
        const priceData = {
          value: transferAmount,
          display: "$" + parseFloat(transferAmount).toFixed(2),
          currency: "USD"
        };
        
        transfer_currentPrice = priceData;
        
        const submitBtn = document.querySelector('.transfer-pay-button');
        if (submitBtn) {
          submitBtn.textContent = \`Complete Transfer \${priceData.display}\`;
        }
        
        return Promise.resolve(priceData);
      };

      /**
       * Reset the purchase button to its normal state
       */
      let transfer_reset_purchase_button = () => {
          const btn = document.querySelector("#transfer-card-form").querySelector("button[type='submit']");
          if (btn) {
            btn.removeAttribute("disabled");
            const buttonText = transfer_currentPrice ? \`Complete Transfer \${transfer_currentPrice.display}\` : "Complete Transfer";
            btn.textContent = buttonText;
          }
      }

      /**
       * Simulate user authentication check
       */
      const transfer_is_user_logged_in = () => {
        return new Promise((resolve) => {
          transfer_current_customer_id = "";
          resolve();
        });
      }

      /**
       * Get PayPal client token for hosted fields
       */
      const transfer_get_client_token = () => {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(\`\${TRANSFER_API_BASE_URL}/get_client_token\`, {
              method: "POST", 
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ "customer_id": transfer_current_customer_id }),
            });

            if (!response.ok) {
              throw new Error(\`HTTP error! status: \${response.status}\`);
            }

            const client_token = await response.text();
            resolve(client_token);
          } catch (error) {
            console.error('Error getting client token:', error);
            reject(error);
          }
        });
      }

      /**
       * Global click handler for alert close buttons
       */
      let transfer_handle_click = (event) => {
          if (event.target.classList.contains("transfer-alert-close")) {
              event.target.closest(".transfer-alert").remove();
          }
      }

      document.addEventListener("click", transfer_handle_click);

      /**
       * Display error alert with custom message
       */
      let transfer_display_error_alert = (message = "An error occurred. Please try again.") => {
          const alertsContainer = document.getElementById("transfer-alerts");
          if (alertsContainer) {
            alertsContainer.innerHTML = \`<div class="transfer-alert transfer-alert-error"><button class="transfer-alert-close">×</button>\${message}</div>\`;
          }
      }

      /**
       * Display success message after payment completion
       */
      let transfer_display_success_message = (order_details) => {
          console.log('Transfer payment completed:', order_details);
          let intent_object = transfer_intent === "authorize" ? "authorizations" : "captures";
          const firstName = order_details?.payer?.name?.given_name || '';
          const lastName = order_details?.payer?.name?.surname || '';
          const amount = order_details.purchase_units[0].payments[intent_object][0].amount.value;
          const currency = order_details.purchase_units[0].payments[intent_object][0].amount.currency_code;

          const alertsContainer = document.getElementById("transfer-alerts");
          if (alertsContainer) {
            alertsContainer.innerHTML = \`<div class='transfer-alert transfer-alert-success'>Transfer successful! Thank you \${firstName} \${lastName}. Your money transfer to Haiti has been initiated and will be available for pickup within 24-48 hours.</div>\`;
          }

          const cardForm = document.getElementById("transfer-card-form");
          if (cardForm) {
            cardForm.classList.add("transfer-hide");
          }
      }

      // Initialize the transfer payment system
      console.log('Starting transfer payment initialization...');

      transfer_is_user_logged_in()
      .then(() => {
          console.log('User login check completed');
          return transfer_fetchCurrentPrice();
      })
      .then((priceData) => {
          console.log('Price set, now getting client token...');
          return transfer_get_client_token();
      })
      .then((client_token) => {
          console.log('Client token received, loading PayPal SDK...');
          return transfer_script_to_head({
              "src": transfer_paypal_sdk_url + "?client-id=" + transfer_client_id + "&enable-funding=venmo&currency=" + transfer_currency + "&intent=" + transfer_intent + "&components=hosted-fields", 
              "data-client-token": client_token
          });
      })
      .then(() => {
          console.log('PayPal SDK loaded, initializing payment form...');

          const loadingElement = document.getElementById("transfer-loading");
          const contentElement = document.getElementById("transfer-content");
          
          if (loadingElement) loadingElement.classList.add("transfer-hide");
          if (contentElement) contentElement.classList.remove("transfer-hide");

          if (window.paypal && window.paypal.HostedFields.isEligible()) {
              console.log('Hosted Fields are eligible, setting up...');

              transfer_paypal_hosted_fields = window.paypal.HostedFields.render({
                createOrder: () => {
                  console.log('Creating order with transfer amount...');
                  return fetch(\`\${TRANSFER_API_BASE_URL}/create_order\`, {
                      method: "post", 
                      headers: { "Content-Type": "application/json; charset=utf-8" },
                      body: JSON.stringify({ 
                          "intent": transfer_intent,
                          "amount": transferAmount
                      })
                  })
                  .then((response) => {
                      if (!response.ok) {
                          throw new Error(\`HTTP error! status: \${response.status}\`);
                      }
                      return response.json();
                  })
                  .then((order) => { 
                      transfer_order_id = order.id; 
                      console.log('Order created with ID:', transfer_order_id);
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
                  ':focus': {
                      'color': '#1a1a21'
                  },
                  '.valid': {
                      'color': '#1a1a21'
                  },
                  '.invalid': {
                      'color': '#dc2626'
                  }
                },
                fields: {
                  number: {
                    selector: "#transfer-card-number",
                    placeholder: "1234 1234 1234 1234"
                  },
                  cvv: {
                    selector: "#transfer-cvv",
                    placeholder: "CVC"
                  },
                  expirationDate: {
                    selector: "#transfer-expiration-date",
                    placeholder: "MM / YY"
                  }
                }
              }).then((card_fields) => {
                console.log('Hosted Fields rendered successfully');

                const cardForm = document.querySelector("#transfer-card-form");
                if (cardForm) {
                  cardForm.addEventListener("submit", (event) => {
                    event.preventDefault();
                    console.log('Form submitted, processing payment...');

                    const submitBtn = cardForm.querySelector("button[type='submit']");
                    if (submitBtn) {
                      submitBtn.setAttribute("disabled", "");
                      submitBtn.textContent = "Processing Transfer...";
                    }

                    card_fields
                      .submit({
                          cardholderName: "Transfer Customer",
                          billingAddress: {
                            streetAddress: "123 Main St",
                            extendedAddress: "",
                            region: "CA",
                            locality: "San Jose",
                            postalCode: "95131",
                            countryCodeAlpha2: "US",
                          },
                        }
                      )
                      .then(() => {
                        console.log('Card fields submitted, completing order...');
                        const emailInput = document.getElementById("transfer-email");
                        return fetch(\`\${TRANSFER_API_BASE_URL}/complete_order\`, {
                            method: "post", 
                            headers: { "Content-Type": "application/json; charset=utf-8" },
                            body: JSON.stringify({
                                "intent": transfer_intent,
                                "order_id": transfer_order_id,
                                "email": emailInput ? emailInput.value : ""
                            })
                        })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(\`HTTP error! status: \${response.status}\`);
                            }
                            return response.json();
                        })
                        .then((order_details) => {
                            console.log('Order completed successfully');
                            transfer_display_success_message(order_details);
                         })
                         .catch((error) => {
                            console.error('Error completing order:', error);
                            transfer_display_error_alert("Transfer processing failed. Please try again.");
                            transfer_reset_purchase_button();
                         });
                      })
                      .catch((err) => {
                        console.error('Error submitting card fields:', err);
                        transfer_reset_purchase_button();
                        transfer_display_error_alert("Card validation failed. Please check your information.");
                      });
                  });
                }
              });
            } else {
              console.error('Hosted Fields not eligible in this browser');
              const alertsContainer = document.getElementById("transfer-alerts");
              if (alertsContainer) {
                alertsContainer.innerHTML = \`<div class="transfer-alert transfer-alert-error"><button class="transfer-alert-close">×</button>Card payments are not supported in this browser.</div>\`;
              }
            }
      })
      .catch((error) => {
          console.error('Application initialization failed:', error);
          transfer_reset_purchase_button();
          transfer_display_error_alert("Failed to initialize payment system. Please refresh the page.");
      });
    `;

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [amount]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Complete Your Transfer</h2>
        <p className="text-gray-600 text-sm">
          Transfer Amount: <span className="font-semibold">${parseFloat(amount).toFixed(2)} USD</span>
        </p>
      </div>

      {/* Security Information */}
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-green-800 mb-1">
              Secure Payment Processing
            </h3>
            <p className="text-xs text-green-600">
              Your payment is protected by PayPal's industry-leading security measures. 
              All transactions are encrypted and monitored for fraud.
            </p>
          </div>
        </div>
      </div>

      {/* PayPal Checkout Container */}
      <div ref={containerRef}></div>
    </div>
  );
};

export default StepThreeTransfer;
