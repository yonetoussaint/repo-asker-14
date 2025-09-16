import React, { useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const DynamicPayPalCheckout: React.FC = () => {
  useEffect(() => {
    // Load the external scripts and styles
    const loadExternalResources = () => {
      // Add Google Fonts
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);

      // Inline JavaScript from the HTML
      const script = document.createElement('script');
      script.innerHTML = `
        // Global variables to store application state
        let current_customer_id;
        let order_id;
        let currentPrice = null; // This will store the fetched price data
        let paypal_hosted_fields = null; // Store PayPal fields instance

        // Replace this URL with your actual Render.com backend URL
        const API_BASE_URL = "https://paypal-with-nodejs.onrender.com";

        // PayPal SDK configuration
        const paypal_sdk_url = "https://www.paypal.com/sdk/js";
        const client_id = "AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4--RTg146F1Mj";
        const currency = "USD";
        const intent = "capture";

        /**
         * Helper function to dynamically load PayPal SDK script
         * This is essential for PayPal's hosted fields to work properly
         */
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

        /**
         * NEW FUNCTION: Fetch current price from backend
         * This is the foundation of our dynamic pricing system
         * The server controls what price gets displayed and charged
         */
        const fetchCurrentPrice = () => {
          return fetch(\`\${API_BASE_URL}/get_price\`)
            .then(response => {
              if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
              }
              return response.json();
            })
            .then(priceData => {
              // Store the price data globally for later use
              currentPrice = priceData;

              // Update the button text with the fetched price
              const submitBtn = document.querySelector('.pay-button');
              if (submitBtn) {
                submitBtn.textContent = \`Pay \${priceData.display}\`;
              }

              console.log('Price fetched successfully:', priceData);
              return priceData;
            })
            .catch(error => {
              console.error('Error fetching price:', error);
              // Show a user-friendly error message
              display_error_alert('Unable to load current pricing. Please refresh the page.');
              throw error;
            });
        };

        /**
         * Reset the purchase button to its normal state
         * Used after successful payments or errors
         */
        let reset_purchase_button = () => {
            const btn = document.querySelector("#card-form").querySelector("button[type='submit']");
            if (btn) {
              btn.removeAttribute("disabled");
              // Use the current price data if available, otherwise fallback
              const buttonText = currentPrice ? \`Pay \${currentPrice.display}\` : "Pay Now";
              btn.textContent = buttonText;
            }
        }

        /**
         * Simulate user authentication check
         * In a real app, this would verify if user is logged in
         */
        const is_user_logged_in = () => {
          return new Promise((resolve) => {
            current_customer_id = "";
            resolve();
          });
        }

        /**
         * Get PayPal client token for hosted fields
         * This token allows secure card field rendering
         */
        const get_client_token = () => {
          return new Promise(async (resolve, reject) => {
            try {
              const response = await fetch(\`\${API_BASE_URL}/get_client_token\`, {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "customer_id": current_customer_id }),
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
         * Event handler for closing alert messages
         */
        let handle_close = (event) => {
            event.target.closest(".alert").remove();
        }

        /**
         * Global click handler for alert close buttons
         */
        let handle_click = (event) => {
            if (event.target.classList.contains("alert-close")) {
                handle_close(event);
            }
        }

        // Register the global click handler
        document.addEventListener("click", handle_click);

        /**
         * Display error alert with custom message
         * Now accepts custom error messages for better user experience
         */
        let display_error_alert = (message = "An error occurred. Please try again.") => {
            const alertsContainer = document.getElementById("alerts");
            if (alertsContainer) {
              alertsContainer.innerHTML = \`<div class="alert alert-error"><button class="alert-close">×</button>\${message}</div>\`;
            }
        }

        /**
         * Display success message after payment completion
         * Uses the actual order details from PayPal
         */
        let display_success_message = (order_details) => {
            console.log('Payment completed:', order_details);
            let intent_object = intent === "authorize" ? "authorizations" : "captures";
            const firstName = order_details?.payer?.name?.given_name || '';
            const lastName = order_details?.payer?.name?.surname || '';
            const amount = order_details.purchase_units[0].payments[intent_object][0].amount.value;
            const currency = order_details.purchase_units[0].payments[intent_object][0].amount.currency_code;

            const alertsContainer = document.getElementById("alerts");
            if (alertsContainer) {
              alertsContainer.innerHTML = \`<div class='alert alert-success'>Payment successful! Thank you \${firstName} \${lastName}. Your NFT will be delivered to your email shortly.</div>\`;
            }

            // Hide the card form after successful payment
            const cardForm = document.getElementById("card-form");
            if (cardForm) {
              cardForm.classList.add("hide");
            }
        }

        /**
         * MAIN APPLICATION INITIALIZATION
         * This is the new flow that includes dynamic price fetching:
         * 1. Check user login status
         * 2. Fetch current price from server
         * 3. Get PayPal client token
         * 4. Load PayPal SDK
         * 5. Initialize payment form
         */
        console.log('Starting application initialization...');

        is_user_logged_in()
        .then(() => {
            console.log('User login check completed');
            // NEW: Fetch price before proceeding
            return fetchCurrentPrice();
        })
        .then((priceData) => {
            console.log('Price fetched, now getting client token...');
            return get_client_token();
        })
        .then((client_token) => {
            console.log('Client token received, loading PayPal SDK...');
            return script_to_head({
                "src": paypal_sdk_url + "?client-id=" + client_id + "&enable-funding=venmo&currency=" + currency + "&intent=" + intent + "&components=hosted-fields", 
                "data-client-token": client_token
            });
        })
        .then(() => {
            console.log('PayPal SDK loaded, initializing payment form...');

            // Hide loading spinner and show the form
            const loadingElement = document.getElementById("loading");
            const contentElement = document.getElementById("content");
            
            if (loadingElement) loadingElement.classList.add("hide");
            if (contentElement) contentElement.classList.remove("hide");

            // Initialize PayPal Hosted Fields (only if eligible)
            if (window.paypal && window.paypal.HostedFields.isEligible()) {
                console.log('Hosted Fields are eligible, setting up...');

                // Render PayPal hosted card fields
                paypal_hosted_fields = window.paypal.HostedFields.render({
                  createOrder: () => {
                    console.log('Creating order with current price...');
                    return fetch(\`\${API_BASE_URL}/create_order\`, {
                        method: "post", 
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify({ 
                            "intent": intent,
                            // Pass the current price to ensure consistency
                            "amount": currentPrice ? currentPrice.value : null
                        })
                    })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(\`HTTP error! status: \${response.status}\`);
                        }
                        return response.json();
                    })
                    .then((order) => { 
                        order_id = order.id; 
                        console.log('Order created with ID:', order_id);
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
                      selector: "#card-number",
                      placeholder: "1234 1234 1234 1234"
                    },
                    cvv: {
                      selector: "#cvv",
                      placeholder: "CVC"
                    },
                    expirationDate: {
                      selector: "#expiration-date",
                      placeholder: "MM / YY"
                    }
                  }
                }).then((card_fields) => {
                  console.log('Hosted Fields rendered successfully');

                  // Set up form submission handler
                  const cardForm = document.querySelector("#card-form");
                  if (cardForm) {
                    cardForm.addEventListener("submit", (event) => {
                      event.preventDefault();
                      console.log('Form submitted, processing payment...');

                      const submitBtn = cardForm.querySelector("button[type='submit']");
                      if (submitBtn) {
                        submitBtn.setAttribute("disabled", "");
                        submitBtn.textContent = "Processing...";
                      }

                      // Submit the card fields data to PayPal
                      card_fields
                        .submit({
                            cardholderName: "Raúl Uriarte, Jr.",
                            billingAddress: {
                              streetAddress: "123 Springfield Rd",
                              extendedAddress: "",
                              region: "AZ",
                              locality: "CHANDLER",
                              postalCode: "85224",
                              countryCodeAlpha2: "US",
                            },
                          }
                        )
                        .then(() => {
                          console.log('Card fields submitted, completing order...');
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
                          .then((response) => {
                              if (!response.ok) {
                                  throw new Error(\`HTTP error! status: \${response.status}\`);
                              }
                              return response.json();
                          })
                          .then((order_details) => {
                              console.log('Order completed successfully');
                              display_success_message(order_details);
                           })
                           .catch((error) => {
                              console.error('Error completing order:', error);
                              display_error_alert("Payment processing failed. Please try again.");
                              reset_purchase_button();
                           });
                        })
                        .catch((err) => {
                          console.error('Error submitting card fields:', err);
                          reset_purchase_button();
                          display_error_alert("Card validation failed. Please check your information.");
                        });
                    });
                  }
                });
              } else {
                console.error('Hosted Fields not eligible in this browser');
                const alertsContainer = document.getElementById("alerts");
                if (alertsContainer) {
                  alertsContainer.innerHTML = \`<div class="alert alert-error"><button class="alert-close">×</button>Card payments are not supported in this browser.</div>\`;
                }
              }
        })
        .catch((error) => {
            console.error('Application initialization failed:', error);
            reset_purchase_button();
            display_error_alert("Failed to initialize payment system. Please refresh the page.");
        });
      `;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(fontLink);
        document.head.removeChild(script);
      };
    };

    loadExternalResources();
  }, []);

  return (
    <>
      <style>{`
        :root {
          --bg-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --bg-secondary: #1e1b2e;
          --bg-card: #ffffff;
          --bg-glass: rgba(255, 255, 255, 0.95);
          --text-primary: #1a1d29;
          --text-secondary: #6b7394;
          --text-muted: #9ca3c4;
          --text-light: rgba(255, 255, 255, 0.9);
          --accent-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --accent-secondary: #667eea;
          --accent-hover: #5a6fd8;
          --success: #10b981;
          --success-bg: #d1fae5;
          --success-border: #6ee7b7;
          --error: #ef4444;
          --error-bg: #fee2e2;
          --error-border: #fca5a5;
          --border: #e2e8f0;
          --border-focus: #667eea;
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          --border-radius: 16px;
          --border-radius-sm: 12px;
          --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--bg-primary);
          min-height: 100vh;
          color: var(--text-primary);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: relative;
          overflow-x: hidden;
        }

        body::before {
          content: '';
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
        }

        @keyframes float {
          0%, 100% { transform: translate(-20px, -10px) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }

        .container {
          width: 100%;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .checkout-card {
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 0;
          padding: 2rem;
          box-shadow: none;
          border: none;
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .checkout-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        .checkout-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .checkout-title {
          font-size: 1.75rem;
          font-weight: 700;
          background: var(--accent-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .checkout-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
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
          letter-spacing: 0.025em;
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
          appearance: none;
          box-shadow: var(--shadow-sm);
        }

        .form-input:focus, .form-field:focus {
          outline: none;
          border-color: var(--border-focus);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), var(--shadow);
          transform: translateY(-1px);
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
          position: relative;
        }

        .card-field:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), var(--shadow);
          transform: translateY(-1px);
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
          position: relative;
          overflow: hidden;
          letter-spacing: 0.025em;
          box-shadow: var(--shadow-lg);
        }

        .pay-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .pay-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px -12px rgba(102, 126, 234, 0.4);
        }

        .pay-button:hover:not(:disabled)::before {
          left: 100%;
        }

        .pay-button:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .pay-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .alert {
          padding: 1rem 1.25rem;
          border-radius: var(--border-radius-sm);
          margin-bottom: 1.5rem;
          position: relative;
          font-size: 0.9rem;
          font-weight: 500;
          box-shadow: var(--shadow);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .alert-success {
          background: var(--success-bg);
          border: 2px solid var(--success-border);
          color: var(--success);
        }

        .alert-error {
          background: var(--error-bg);
          border: 2px solid var(--error-border);
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
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: var(--transition);
        }

        .alert-close:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.1);
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 4rem 0;
          gap: 1.5rem;
        }

        .skeleton-form {
          width: 100%;
          max-width: 400px;
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
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .skeleton-card-row {
          display: flex;
          gap: 0.75rem;
        }

        .skeleton-card-row .skeleton-shimmer {
          flex: 1;
        }

        .loading-text {
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.95rem;
        }

        .hide {
          display: none !important;
        }

        .security-info {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(203, 213, 225, 0.6);
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
          letter-spacing: 0.025em;
        }

        .security-icon {
          width: 16px;
          height: 16px;
          color: var(--success);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 1rem;
          }

          .checkout-card {
            padding: 0;
            border-radius: var(--border-radius-sm);
          }

          .checkout-title {
            font-size: 1.5rem;
          }

          .card-row {
            gap: 0.5rem;
          }

          .form-input, .form-field, .card-field {
            padding: 0.875rem 1rem;
          }

          .pay-button {
            font-size: 1rem;
            padding: 0.875rem 1.25rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="container">
        <div className="checkout-card">
          {/* Alerts */}
          <div id="alerts"></div>

          {/* Loading State */}
          <div id="loading" className="loading-container">
            <div className="skeleton-form">
              {/* Email field skeleton */}
              <div className="form-group">
                <div className="skeleton-shimmer h-4 w-24 mb-2 rounded"></div>
                <div className="skeleton-shimmer h-12 w-full rounded-xl"></div>
              </div>

              {/* Card Information skeleton */}
              <div className="form-group">
                <div className="skeleton-shimmer h-4 w-32 mb-2 rounded"></div>
                <div className="space-y-3">
                  {/* Card number field */}
                  <div className="skeleton-shimmer h-12 w-full rounded-xl"></div>
                  {/* Expiry and CVC row */}
                  <div className="skeleton-card-row">
                    <div className="skeleton-shimmer h-12 rounded-xl"></div>
                    <div className="skeleton-shimmer h-12 rounded-xl"></div>
                  </div>
                </div>
              </div>

              {/* Pay button skeleton */}
              <div className="skeleton-shimmer h-12 w-full rounded-xl mt-4"></div>

              {/* Security info skeleton */}
              <div className="mt-8 text-center">
                <div className="skeleton-shimmer h-8 w-32 mx-auto rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div id="content" className="hide">
            <form id="card-form" className="payment-form">
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="your@email.com" 
                  required 
                />
              </div>

              {/* Card Information */}
              <div className="form-group">
                <label className="form-label">Card Information</label>
                <div className="card-group">
                  <div className="card-field" id="card-number"></div>
                  <div className="card-row">
                    <div className="card-field" id="expiration-date"></div>
                    <div className="card-field" id="cvv"></div>
                  </div>
                </div>
              </div>

              {/* Button text will be populated dynamically */}
              <button type="submit" className="pay-button">Loading...</button>
            </form>

            {/* Security Info */}
            <div className="security-info">
              <div className="security-badge">
                <svg className="security-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                </svg>
                Secured by PayPal
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicPayPalCheckout;