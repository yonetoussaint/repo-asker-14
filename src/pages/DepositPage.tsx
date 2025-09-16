import React, { useState, useRef, useEffect } from 'react';

// Create blob URL for iframe content - moved outside component
const createIframeUrl = () => {
  const iframeContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Checkout</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: #1a202c;
      }

      .payment-container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        padding: 40px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        width: 100%;
        max-width: 480px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
      }

      .payment-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      }

      .hide {
        display: none !important;
      }

      .spinner-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 120px;
        gap: 16px;
      }

      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(102, 126, 234, 0.1);
        border-top: 3px solid #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      .spinner-text {
        color: #667eea;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.5px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .form-group {
        margin-bottom: 24px;
        position: relative;
      }

      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #4a5568;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 12px;
      }

      .div_input {
        width: 100%;
        height: 56px;
        background: #ffffff;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 0 20px;
        font-size: 16px;
        color: #2d3748;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
      }

      .div_input::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .div_input:focus-within {
        border-color: #667eea;
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.2);
      }

      .div_input:focus-within::before {
        opacity: 1;
      }

      .div_input:hover {
        border-color: #cbd5e0;
        transform: translateY(-1px);
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .purchase-btn {
        width: 100%;
        height: 56px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 12px;
        color: white;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin-top: 16px;
        position: relative;
        overflow: hidden;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
      }

      .purchase-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }

      .purchase-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 15px 35px -5px rgba(102, 126, 234, 0.5);
      }

      .purchase-btn:hover:not(:disabled)::before {
        left: 100%;
      }

      .purchase-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      .purchase-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }

      .paypal-buttons {
        margin-bottom: 32px;
      }

      .divider {
        display: flex;
        align-items: center;
        margin: 32px 0;
        color: #718096;
        font-size: 14px;
        font-weight: 500;
        position: relative;
      }

      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 2px;
        background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
      }

      .divider span {
        padding: 0 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        color: #667eea;
      }

      .alert {
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 24px;
        font-size: 14px;
        font-weight: 500;
        position: relative;
        border: 1px solid;
        backdrop-filter: blur(10px);
      }

      .alert-success {
        background: rgba(72, 187, 120, 0.1);
        color: #2f855a;
        border-color: rgba(72, 187, 120, 0.2);
      }

      .alert-error {
        background: rgba(245, 101, 101, 0.1);
        color: #c53030;
        border-color: rgba(245, 101, 101, 0.2);
      }

      .alert-warning {
        background: rgba(237, 137, 54, 0.1);
        color: #dd6b20;
        border-color: rgba(237, 137, 54, 0.2);
      }

      .close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.6;
        padding: 4px;
        line-height: 1;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .close-btn:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.1);
      }

      .title {
        text-align: center;
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 40px;
        letter-spacing: -1px;
        position: relative;
      }

      .title::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 2px;
      }

      #payment_options {
        margin-top: 20px;
      }

      .ms-alert {
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 24px;
        font-size: 14px;
        position: relative;
        border: 1px solid;
        backdrop-filter: blur(10px);
      }

      .ms-alert.ms-action {
        background: rgba(72, 187, 120, 0.1);
        color: #2f855a;
        border-color: rgba(72, 187, 120, 0.2);
      }

      .ms-alert.ms-action2 {
        background: rgba(245, 101, 101, 0.1);
        color: #c53030;
        border-color: rgba(245, 101, 101, 0.2);
      }

      .ms-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        opacity: 0.6;
        padding: 4px;
        line-height: 1;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .ms-close:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.1);
      }

      .ms-close::before {
        content: '×';
      }

      /* Enhanced PayPal button styling */
      .paypal-buttons iframe {
        border-radius: 12px !important;
      }

      /* Email field specific styling */
      #email {
        font-family: inherit;
        font-size: 16px;
        color: #2d3748;
      }

      /* Card field enhancements */
      .div_input input {
        background: transparent;
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
        font-size: 16px;
        color: #2d3748;
        font-family: inherit;
      }

      /* Responsive design */
      @media (max-width: 640px) {
        .payment-container {
          padding: 24px;
          margin: 12px;
        }
        
        .form-row {
          grid-template-columns: 1fr;
          gap: 12px;
        }
        
        .title {
          font-size: 24px;
          margin-bottom: 32px;
        }
        
        .div_input {
          height: 52px;
          font-size: 16px;
          padding: 0 16px;
        }
        
        .purchase-btn {
          height: 52px;
          font-size: 15px;
        }
      }

      /* Loading animation improvements */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      #content {
        animation: fadeIn 0.6s ease-out;
      }

      /* Success message styling */
      .success-checkmark {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #48bb78;
        margin-right: 8px;
        position: relative;
      }

      .success-checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 10px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="payment-container">
      <h1 class="title">Secure Checkout</h1>
      
      <div id="alerts"></div>
      
      <div id="loading" class="spinner-container">
        <div class="spinner"></div>
        <div class="spinner-text">Loading Payment Options...</div>
      </div>
      
      <div id="content" class="hide">
        <div id="payment_options" class="paypal-buttons"></div>
        
        <div class="divider">
          <span>or pay with card</span>
        </div>
        
        <div id="card-form">
          <div class="form-group">
            <label class="form-label" for="card-number">Card Number</label>
            <div class="div_input" id="card-number"></div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="expiration-date">Expiry Date</label>
              <div class="div_input" id="expiration-date"></div>
            </div>
            <div class="form-group">
              <label class="form-label" for="cvv">Security Code</label>
              <div class="div_input" id="cvv"></div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <div class="div_input" id="email">
              <input type="email" placeholder="your@email.com" style="background: none; border: none; outline: none; width: 100%; font-size: 16px; color: #2d3748;">
            </div>
          </div>
          
          <button class="purchase-btn" type="submit" id="purchase-btn">
            Complete Purchase
          </button>
        </div>
      </div>
    </div>

    <script>
      // Configuration - Update this URL to your deployed backend
      const BACKEND_URL = 'https://paypal-with-nodejs.onrender.com'; // Change this to your Render.com URL

      // Helper / Utility functions
      let current_customer_id;
      let order_id;
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
      let reset_purchase_button = () => {
          document.querySelector("#purchase-btn").removeAttribute("disabled");
          document.querySelector("#purchase-btn").textContent = "Complete Purchase";
      }

      const is_user_logged_in = () => {
        return new Promise((resolve) => {
          current_customer_id = ""; // No localStorage usage
          resolve();
        });
      }

      const get_client_token = () => {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(\`\${BACKEND_URL}/get_client_token\`, {
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

      let handle_close = (event) => {
          event.target.closest(".ms-alert").remove();
      }
      let handle_click = (event) => {
          if (event.target.classList.contains("ms-close")) {
              handle_close(event);
          }
      }
      document.addEventListener("click", handle_click);

      const paypal_sdk_url = "https://www.paypal.com/sdk/js";
      const client_id = "AU23YbLMTqxG3iSvnhcWtix6rGN14uw3axYJgrDe8VqUVng8XiQmmeiaxJWbnpbZP_f4--RTg146F1Mj";
      const currency = "USD";
      const intent = "capture";

      let display_error_alert = () => {
          document.getElementById("alerts").innerHTML = \`<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>❌ An error occurred. Please try again.</p></div>\`;
      }

      let display_success_message = (object) => {
          order_details = object.order_details;
          paypal_buttons = object.paypal_buttons;
          console.log(order_details);
          let intent_object = intent === "authorize" ? "authorizations" : "captures";
          
          document.getElementById("alerts").innerHTML = \`<div class='ms-alert ms-action'><span class="success-checkmark"></span>Payment successful! Thank you \` + (order_details?.payer?.name?.given_name || '') + \` \` + (order_details?.payer?.name?.surname || '') + \`</div>\`;

          paypal_buttons.close();
          document.getElementById("card-form").classList.add("hide");
          
          // Notify parent window of successful payment
          window.parent.postMessage({ 
            type: 'PAYMENT_SUCCESS', 
            orderDetails: order_details 
          }, '*');
      }

      //PayPal Code
      is_user_logged_in()
      .then(() => {
          return get_client_token();
      })
      .then((client_token) => {
          return script_to_head({"src": paypal_sdk_url + "?client-id=" + client_id + "&enable-funding=venmo&currency=" + currency + "&intent=" + intent + "&components=buttons,hosted-fields", "data-client-token": client_token})
      })
      .then(() => {
          document.getElementById("loading").classList.add("hide");
          document.getElementById("content").classList.remove("hide");
          let paypal_buttons = paypal.Buttons({
              onClick: (data) => {
                  // Custom JS here
              },
              style: {
                  shape: 'rect',
                  color: 'black',
                  layout: 'vertical',
                  label: 'paypal',
                  height: 50,
                  borderRadius: 12
              },

              createOrder: function(data, actions) {
                  const orderAmount = window.orderAmount || '100.00';
                  return fetch(\`\${BACKEND_URL}/create_order\`, {
                      method: "post", 
                      headers: { "Content-Type": "application/json; charset=utf-8" },
                      body: JSON.stringify({ "intent": intent, "amount": orderAmount })
                  })
                  .then((response) => response.json())
                  .then((order) => { return order.id; });
              },

              onApprove: function(data, actions) {
                  order_id = data.orderID;
                  console.log(data);
                  return fetch(\`\${BACKEND_URL}/complete_order\`, {
                      method: "post", 
                      headers: { "Content-Type": "application/json; charset=utf-8" },
                      body: JSON.stringify({
                          "intent": intent,
                          "order_id": order_id
                      })
                  })
                  .then((response) => response.json())
                  .then((order_details) => {
                      display_success_message({"order_details": order_details, "paypal_buttons": paypal_buttons});
                   })
                   .catch((error) => {
                      console.log(error);
                      display_error_alert()
                   });
              },

              onCancel: function (data) {
                  document.getElementById("alerts").innerHTML = \`<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>⚠️ Payment cancelled</p></div>\`;
                  
                  // Notify parent window of cancelled payment
                  window.parent.postMessage({ 
                    type: 'PAYMENT_CANCELLED' 
                  }, '*');
              },

              onError: function(err) {
                  console.log(err);
                  
                  // Notify parent window of payment error
                  window.parent.postMessage({ 
                    type: 'PAYMENT_ERROR', 
                    error: err 
                  }, '*');
              }
          });
          paypal_buttons.render('#payment_options');
          
          // Hosted Fields
          if (paypal.HostedFields.isEligible()) {
              paypal_hosted_fields = paypal.HostedFields.render({
                createOrder: () => {
                  const orderAmount = window.orderAmount || '100.00';
                  return fetch(\`\${BACKEND_URL}/create_order\`, {
                      method: "post", 
                      headers: { "Content-Type": "application/json; charset=utf-8" },
                      body: JSON.stringify({ "intent": intent, "amount": orderAmount })
                  })
                  .then((response) => response.json())
                  .then((order) => { order_id = order.id; return order.id; });
                },
                styles: {
                  '.valid': {
                    color: '#48bb78'
                  },
                  '.invalid': {
                    color: '#f56565'
                  },
                  'input': {
                      'font-size': '16px',
                      'color': '#2d3748',
                      'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", sans-serif',
                      'padding': '0',
                      '::placeholder': {
                        'color': '#a0aec0'
                      }
                  },
                },
                fields: {
                  number: {
                    selector: "#card-number",
                    placeholder: "1234 5678 9012 3456"
                  },
                  cvv: {
                    selector: "#cvv",
                    placeholder: "123"
                  },
                  expirationDate: {
                    selector: "#expiration-date",
                    placeholder: "MM/YY"
                  }
                }
              }).then((card_fields) => {
               document.querySelector("#purchase-btn").addEventListener("click", (event) => {
                  event.preventDefault();
                  
                  // Get email value
                  const emailInput = document.querySelector("#email input");
                  const emailValue = emailInput ? emailInput.value : '';
                  
                  if (!emailValue || !emailValue.includes('@')) {
                    document.getElementById("alerts").innerHTML = \`<div class="ms-alert ms-action2 ms-small"><span class="ms-close"></span><p>⚠️ Please enter a valid email address</p></div>\`;
                    return;
                  }
                  
                  document.querySelector("#purchase-btn").setAttribute("disabled", "");
                  document.querySelector("#purchase-btn").textContent = "Processing Payment...";
                  
                  card_fields
                    .submit({
                      cardholderName: "Card Holder",
                      billingAddress: {
                        streetAddress: "123 Main St",
                        extendedAddress: "",
                        region: "CA",
                        locality: "San Jose",
                        postalCode: "95131",
                        countryCodeAlpha2: "US",
                      },
                    })
                    .then(() => {
                      return fetch(\`\${BACKEND_URL}/complete_order\`, {
                          method: "post", 
                          headers: { "Content-Type": "application/json; charset=utf-8" },
                          body: JSON.stringify({
                              "intent": intent,
                              "order_id": order_id,
                              "email": emailValue
                          })
                      })
                      .then((response) => response.json())
                      .then((order_details) => {
                          display_success_message({"order_details": order_details, "paypal_buttons": paypal_buttons});
                       })
                       .catch((error) => {
                          console.log(error);
                          display_error_alert();
                          reset_purchase_button();
                       });
                    })
                    .catch((err) => {
                      console.log(err);
                      reset_purchase_button();
                      display_error_alert();
                    });
                });
              });
            }
      })
      .catch((error) => {
          console.log(error);
          reset_purchase_button();
          display_error_alert();
      });
    </script>
  </body>
</html>`;

  const blob = new Blob([iframeContent], { type: 'text/html' });
  return URL.createObjectURL(blob);
};

const PayPalCheckoutPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);
  const amount = '100.00'; // Static amount

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'PAYMENT_SUCCESS') {
        console.log('Payment successful:', event.data.orderDetails);
        alert(`Payment successful! Order ID: ${event.data.orderDetails.id}`);
      } else if (event.data.type === 'PAYMENT_CANCELLED') {
        console.log('Payment cancelled');
        alert('Payment was cancelled');
      } else if (event.data.type === 'PAYMENT_ERROR') {
        console.log('Payment error:', event.data.error);
        alert('Payment error occurred');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    // Set the static amount in the iframe
    setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.orderAmount = amount;
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Full-width iframe container */}
      <div className="w-full h-screen relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-3 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-purple-200 text-lg font-medium">Loading Secure Checkout...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={createIframeUrl()}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          title="PayPal Checkout"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
};

export default PayPalCheckoutPage;