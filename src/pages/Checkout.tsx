
import { useEffect } from "react";

const NftPayment = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://paypal-with-nodejs.onrender.com/script.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const hidePayPalButtons = () => {
        const selectors = [
          ".paypal-button",
          "#paypal-button-container",
          ".paypal-buttons",
          "#smart-button-container"
        ];

        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
          elements.forEach((el) => {
            el.style.display = "none";
          });
        });
      };

      // Run immediately and after a short delay
      hidePayPalButtons();
      setTimeout(hidePayPalButtons, 1000);
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      {/* External CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/minstyle.io@2.0.1/dist/css/minstyle.io.min.css"
      />
      <link
        rel="stylesheet"
        href="https://paypal-with-nodejs.onrender.com/style.css"
      />

      <div className="container">
        <div className="row">
          <div className="col-sm"></div>
          <div className="col-sm">
            <h2 className="ms-text-center">ai-generated NFT Bored Ape</h2>
            <div className="ms-text-center pb-2">
              <div className="ms-label ms-large ms-action2 ms-light">
                $100.00 USD
              </div>
            </div>
            <div id="alerts" className="ms-text-center"></div>
            <div id="loading" className="spinner-container ms-div-center">
              <div className="spinner"></div>
            </div>
            <div id="content" className="hide">
              <div className="ms-card ms-fill">
                <div className="ms-card-content">
                  <img
                    src="https://cdn.discordapp.com/attachments/1060825015681028127/1076385063903694908/rauljr7_3d_e83fed6a-69aa-4a6a-b0ec-928edd57aecf.png"
                    style={{ width: "400px" }}
                    alt="NFT"
                  />
                </div>
              </div>
              <div id="payment_options">
                <form className="row ms-form-group" id="card-form">
                  <div>
                    <label htmlFor="card-number">Card Number</label>
                    <div className="div_input" id="card-number"></div>
                  </div>
                  <div className="col-md mb-2">
                    <label htmlFor="expiration-date">Expiration Date</label>
                    <div className="div_input" id="expiration-date"></div>
                  </div>
                  <div className="col-md mb-2">
                    <label htmlFor="cvv">Security Code</label>
                    <div className="div_input" id="cvv"></div>
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input
                      placeholder="username@email.com"
                      type="email"
                      id="email"
                      className="div_input"
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="ms-fullwidth mt-2 ms-medium"
                      type="submit"
                      value="Purchase"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-sm"></div>
          <footer style={{ marginTop: "50px" }} className="ms-footer">
            Footer Intentionally left empty :)
          </footer>
        </div>
      </div>
    </>
  );
};

export default NftPayment;