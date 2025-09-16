import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, CreditCard, Loader2 } from 'lucide-react';

interface MockPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  selectedNetwork?: string;
  selectedCondition?: string;
  totalPrice: number;
}

const MockPaymentDialog = ({
  open,
  onOpenChange,
  product,
  quantity,
  selectedColor,
  selectedStorage,
  selectedNetwork,
  selectedCondition,
  totalPrice
}: MockPaymentDialogProps) => {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [orderCode, setOrderCode] = useState('');

  // Generate order code when dialog opens
  useEffect(() => {
    if (open) {
      const code = 'HT' + Math.random().toString().slice(2, 7);
      setOrderCode(code);
      setStep('payment');
    }
  }, [open]);

  const handlePayment = () => {
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent(
      `Bonjour! J'ai commandé le produit: ${product?.name}\n` +
      `Code de commande: ${orderCode}\n` +
      `Couleur: ${selectedColor || 'N/A'}\n` +
      `Stockage: ${selectedStorage || 'N/A'}\n` +
      `Quantité: ${quantity}\n` +
      `Total payé: $${totalPrice}\n\n` +
      `Je souhaite organiser la livraison. Merci!`
    );
    
    // Replace with actual seller WhatsApp number
    const whatsappUrl = `https://wa.me/50938887777?text=${message}`;
    window.open(whatsappUrl, '_blank');
    onOpenChange(false);
  };

  if (step === 'payment') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Paiement Sécurisé
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="font-medium mb-2">Résumé de la commande</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Produit:</span>
                  <span className="font-medium">{product?.name}</span>
                </div>
                {selectedColor && (
                  <div className="flex justify-between">
                    <span>Couleur:</span>
                    <span>{selectedColor}</span>
                  </div>
                )}
                {selectedStorage && (
                  <div className="flex justify-between">
                    <span>Stockage:</span>
                    <span>{selectedStorage}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Quantité:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-orange-500">${totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Mock Payment Form */}
            <div className="space-y-3">
              <div className="text-center text-sm text-gray-600">
                💳 <strong>Simulation de paiement</strong> - Aucun argent ne sera débité
              </div>
              
              <div className="border rounded-lg p-3 bg-blue-50">
                <div className="text-xs text-gray-600 mb-2">Numéro de carte (simulation)</div>
                <div className="font-mono text-sm">4242 4242 4242 4242</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-lg p-3 bg-blue-50">
                  <div className="text-xs text-gray-600 mb-1">Expiration</div>
                  <div className="font-mono text-sm">12/25</div>
                </div>
                <div className="border rounded-lg p-3 bg-blue-50">
                  <div className="text-xs text-gray-600 mb-1">CVC</div>
                  <div className="font-mono text-sm">123</div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Payer ${totalPrice} (Simulation)
            </Button>

            <div className="text-xs text-center text-gray-500">
              Après le paiement, vous serez redirigé vers WhatsApp pour organiser la livraison
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'processing') {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
            <h3 className="text-lg font-medium mb-2">Traitement du paiement...</h3>
            <p className="text-gray-600">Veuillez patienter pendant que nous traitons votre paiement</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <div className="text-center py-6">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h3 className="text-xl font-bold mb-2 text-green-600">Paiement Réussi!</h3>
          
          <div className="bg-green-50 rounded-lg p-4 my-4">
            <div className="text-sm text-gray-600 mb-1">Code de commande:</div>
            <div className="text-2xl font-bold text-green-700">{orderCode}</div>
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            Votre commande a été confirmée. Contactez maintenant le vendeur via WhatsApp pour organiser la livraison et les frais de transport.
          </p>

          <Button 
            onClick={handleWhatsAppRedirect}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            📱 Contacter le vendeur sur WhatsApp
          </Button>

          <div className="mt-4 text-xs text-gray-500">
            Gardez votre code de commande <strong>{orderCode}</strong> pour la livraison
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MockPaymentDialog;