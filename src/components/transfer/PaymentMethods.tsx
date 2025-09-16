
import React from 'react';
import { 
  CreditCard, 
  Banknote, 
  Send,
  DollarSign,
  Smartphone,
  XCircle,
  CircleDollarSign,
  Landmark 
} from 'lucide-react';
import { PaymentMethod } from './PaymentMethodItem';

// PayPal backend API URL as a constant
export const PAYPAL_BACKEND_URL = 'https://paypal-backend-9mw4.onrender.com';

// International payment methods (USD)
export const internationalPaymentMethods: PaymentMethod[] = [
  { 
    id: 'credit-card', 
    name: 'Credit or Debit Card', 
    icon: CreditCard, 
    description: 'Safe and secure card payment',
    fee: '3.5% + $0.30',
    processorUrl: PAYPAL_BACKEND_URL
  },
  { 
    id: 'bank-transfer', 
    name: 'Bank Transfer / ACH', 
    icon: Banknote, 
    description: 'Direct from your bank account',
    fee: '$0.25' 
  },
  { 
    id: 'zelle', 
    name: 'Zelle', 
    icon: Landmark,
    description: 'Fast transfers between US banks',
    fee: 'Free' 
  },
  { 
    id: 'paypal', 
    name: 'PayPal', 
    icon: CircleDollarSign,
    description: 'Send using your PayPal balance',
    fee: '2.9% + $0.30' 
  },
  { 
    id: 'cashapp', 
    name: 'Cash App', 
    icon: DollarSign,
    description: 'Send using Cash App',
    fee: '1.5%' 
  }
];

// National payment methods (HTG - Haitian Gourdes)
export const nationalPaymentMethods: PaymentMethod[] = [
  { 
    id: 'moncash', 
    name: 'MonCash', 
    icon: Smartphone, 
    description: 'Mobile money service by Digicel',
    fee: '1% (min 5 HTG)',
    available: true
  },
  { 
    id: 'natcash', 
    name: 'Natcash', 
    icon: Smartphone, 
    description: 'National digital wallet service',
    fee: '0.5% (min 3 HTG)',
    available: false,
    unavailableReason: 'Coming soon'
  },
  { 
    id: 'bnc', 
    name: 'BNC Bank', 
    icon: Banknote, 
    description: 'Banque Nationale de Crédit',
    fee: '10 HTG',
    available: false,
    unavailableReason: 'Currently unavailable'
  },
  { 
    id: 'unibank', 
    name: 'Unibank', 
    icon: Banknote, 
    description: 'Unibank S.A.',
    fee: '12 HTG',
    available: false,
    unavailableReason: 'Coming soon'
  },
  { 
    id: 'sogebank', 
    name: 'SogeBank', 
    icon: Banknote, 
    description: 'Société Générale Haïtienne de Banque',
    fee: '15 HTG',
    available: false,
    unavailableReason: 'Currently unavailable'
  },
  { 
    id: 'buh', 
    name: 'BUH', 
    icon: Banknote, 
    description: 'Banque de l\'Union Haïtienne',
    fee: '10 HTG',
    available: false,
    unavailableReason: 'Coming soon'
  }
];
