
/// <reference types="vite/client" />

// Define PayPal global object
interface Window {
  paypal?: {
    Buttons: (options: any) => { 
      render: (element: HTMLElement | string) => void;
      isEligible: () => boolean;
      close: () => void;
    };
    HostedFields: {
      isEligible: () => boolean;
      render: (options: any) => Promise<any>;
    };
    [key: string]: any;
  };
}
