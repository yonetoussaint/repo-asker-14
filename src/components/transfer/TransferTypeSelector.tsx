import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TransferTypeSelectorProps {
  transferType?: 'international' | 'national';
  onTransferTypeChange?: (value: 'international' | 'national') => void;
  onSelectType?: (type: string) => void;
}

export const TransferTypeSelector: React.FC<TransferTypeSelectorProps> = ({ 
  onSelectType, 
  transferType, 
  onTransferTypeChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Choose Transfer Type</h2>
        <p className="text-sm text-muted-foreground">Select how you want to send money</p>
      </div>

      <div className="grid gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectType('personal')}>
          <CardContent className="p-4">
            <h3 className="font-medium">Personal Transfer</h3>
            <p className="text-sm text-muted-foreground">Send money to friends and family</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectType('business')}>
          <CardContent className="p-4">
            <h3 className="font-medium">Business Transfer</h3>
            <p className="text-sm text-muted-foreground">Send money for business purposes</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectType('international')}>
          <CardContent className="p-4">
            <h3 className="font-medium">International Transfer</h3>
            <p className="text-sm text-muted-foreground">Send money across borders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransferTypeSelector;