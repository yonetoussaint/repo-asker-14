
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, MapPin, Phone, User } from "lucide-react";
import BundleDeals from "@/components/product/BundleDeals";

interface ReceiverDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  department: string;
  arrondissement: string;
  commune: string;
}

interface StepTwoTransferProps {
  receiverDetails: ReceiverDetails;
  onDetailsChange: (details: ReceiverDetails) => void;
}

// Artibonite department administrative divisions
const artiboniteData = {
  "Dessalines": [
    "Dessalines",
    "Grande-Saline",
    "Marchand-Dessalines"
  ],
  "Gonaïves": [
    "Gonaïves",
    "Ennery",
    "L'Estère"
  ],
  "Gros-Morne": [
    "Gros-Morne",
    "Anse-Rouge",
    "Terre-Neuve"
  ],
  "Marmelade": [
    "Marmelade",
    "Saint-Michel-de-l'Attalaye"
  ],
  "Saint-Marc": [
    "Saint-Marc",
    "La Chapelle",
    "Liancourt",
    "Montrouis",
    "Verrettes"
  ]
};

const StepTwoTransfer: React.FC<StepTwoTransferProps> = ({ receiverDetails, onDetailsChange }) => {
  const [quantity, setQuantity] = useState(1);
  
  // Provide default values if receiverDetails is undefined
  const details = receiverDetails || {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    department: 'Artibonite',
    arrondissement: '',
    commune: ''
  };

  const updateField = (field: keyof ReceiverDetails, value: string) => {
    const updatedDetails = {
      ...details,
      [field]: value
    };
    
    // Reset commune when arrondissement changes
    if (field === 'arrondissement') {
      updatedDetails.commune = '';
    }
    
    onDetailsChange(updatedDetails);
  };

  const availableCommunes = details.arrondissement ? artiboniteData[details.arrondissement] || [] : [];

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Bundle Deals */}
      <BundleDeals />
      
      {/* Full Name Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <User className="w-4 h-4" />
          Full Name *
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            placeholder="First name" 
            value={details.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className="border border-gray-300 focus:border-gray-500"
            required
          />
          <Input 
            placeholder="Last name" 
            value={details.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className="border border-gray-300 focus:border-gray-500"
            required
          />
        </div>
      </div>

      {/* Phone Number Section */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Phone Number *
        </Label>
        
        <div className="flex">
          <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 relative">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-red-600"></div>
              </div>
              <span className="text-sm">+509</span>
            </div>
          </div>
          <Input 
            id="phoneNumber" 
            placeholder="XXXX XXXX" 
            value={details.phoneNumber}
            onChange={(e) => updateField('phoneNumber', e.target.value)}
            className="border border-gray-300 focus:border-gray-500 rounded-l-none"
            required
          />
        </div>
        <p className="text-xs text-gray-500 flex items-center">
          <Info className="w-3 h-3 mr-1" />
          8-digit number without spaces or dashes
        </p>
      </div>

      {/* Address Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Address in Haiti *
        </Label>
        
        {/* Department and Arrondissement Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-gray-600 uppercase">
              Department
            </Label>
            <Input 
              value="Artibonite"
              disabled
              className="bg-gray-50 border border-gray-300 text-gray-600"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-gray-600 uppercase">
              Arrondissement
            </Label>
            <Select value={details.arrondissement} onValueChange={(value) => updateField('arrondissement', value)}>
              <SelectTrigger className="border border-gray-300 focus:border-gray-500">
                <SelectValue placeholder="Choose arrondissement" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(artiboniteData).map((arrondissement) => (
                  <SelectItem key={arrondissement} value={arrondissement}>
                    {arrondissement}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Commune */}
        <div className="space-y-1">
          <Label className="text-xs text-gray-600 uppercase">
            Commune
          </Label>
          <Select 
            value={details.commune} 
            onValueChange={(value) => updateField('commune', value)}
            disabled={!details.arrondissement}
          >
            <SelectTrigger className="border border-gray-300 focus:border-gray-500 disabled:bg-gray-50">
              <SelectValue placeholder={details.arrondissement ? "Choose commune" : "Select arrondissement first"} />
            </SelectTrigger>
            <SelectContent>
              {availableCommunes.map((commune) => (
                <SelectItem key={commune} value={commune}>
                  {commune}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StepTwoTransfer;
