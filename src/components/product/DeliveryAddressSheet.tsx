import React, { useState } from 'react';
import { X, MapPin, Phone, User, Edit, Trash2, Check, Plus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeliveryAddressSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryAddressSheet: React.FC<DeliveryAddressSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    departement: '',
    commune: '',
    quartier: '',
    streetDetails: '',
    tag: 'domicile',
    isDefault: false
  });

  // Sample saved addresses
  const savedAddresses = [
    {
      id: '1',
      name: 'Jean Baptiste',
      phone: '+509 3456 7890',
      departement: 'Ouest',
      commune: 'Pétionville',
      quartier: 'Thomassin',
      streetDetails: 'Près de l\'école St-Jean, 3e maison bleue',
      tag: 'Domicile',
      isDefault: true
    },
    {
      id: '2',
      name: 'Marie Duclair',
      phone: '+509 2345 6789',
      departement: 'Ouest',
      commune: 'Port-au-Prince',
      quartier: 'Delmas 33',
      streetDetails: 'Rue Mercier, en face de la pharmacie',
      tag: 'Travail',
      isDefault: false
    }
  ];

  const departements = [
    'Ouest', 'Nord', 'Artibonite', 'Sud', 'Sud-Est', 'Nord-Ouest', 
    'Nord-Est', 'Centre', 'Grande-Anse', 'Nippes'
  ];

  const communes = {
    'Ouest': ['Port-au-Prince', 'Pétionville', 'Delmas', 'Tabarre', 'Kenscoff', 'Croix-des-Bouquets'],
    'Nord': ['Cap-Haïtien', 'Fort-Dauphin', 'Limonade', 'Quartier-Morin'],
    'Artibonite': ['Gonaïves', 'Saint-Marc', 'Dessalines', 'Verrettes'],
    // Add more as needed
  };

  const handleDeliverHere = () => {
    if (selectedAddress) {
      onClose();
    }
  };

  const handleAddNewAddress = () => {
    // Handle adding new address logic here
    console.log('New address:', newAddress);
    setShowAddForm(false);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <div className="flex flex-col h-full">
          {/* Drag Handle */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <SheetHeader className="text-center pb-4">
            <SheetTitle className="text-lg font-semibold">
              Choisissez une adresse de livraison
            </SheetTitle>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Saved Addresses */}
            <div className="space-y-3">
              {savedAddresses.map((address) => (
                <div 
                  key={address.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAddress === address.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{address.name}</span>
                      <Phone className="w-4 h-4 text-gray-500 ml-2" />
                      <span className="text-sm text-gray-600">{address.phone}</span>
                    </div>
                    {address.isDefault && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        Adresse principale
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm">
                      {address.departement} → {address.commune} → {address.quartier}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 ml-5">
                    {address.streetDetails}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {address.tag}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {selectedAddress === address.id && (
                        <span className="flex items-center gap-1 text-primary text-sm font-medium">
                          <Check className="w-4 h-4" />
                          Livrer ici
                        </span>
                      )}
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500 font-medium">OU</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Add New Address Button */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 font-medium">Ajouter une nouvelle adresse</span>
              </button>
            )}

            {/* Add New Address Form */}
            {showAddForm && (
              <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium text-gray-900">Nouvelle adresse</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                      placeholder="Jean Baptiste"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      placeholder="+509 3456 7890"
                    />
                  </div>

                  <div>
                    <Label htmlFor="departement">Département</Label>
                    <Select value={newAddress.departement} onValueChange={(value) => setNewAddress({...newAddress, departement: value, commune: ''})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un département" />
                      </SelectTrigger>
                      <SelectContent>
                        {departements.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="commune">Commune</Label>
                    <Select 
                      value={newAddress.commune} 
                      onValueChange={(value) => setNewAddress({...newAddress, commune: value})}
                      disabled={!newAddress.departement}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une commune" />
                      </SelectTrigger>
                      <SelectContent>
                        {(communes[newAddress.departement] || []).map((commune) => (
                          <SelectItem key={commune} value={commune}>{commune}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quartier">Quartier</Label>
                    <Input
                      id="quartier"
                      value={newAddress.quartier}
                      onChange={(e) => setNewAddress({...newAddress, quartier: e.target.value})}
                      placeholder="Thomassin"
                    />
                  </div>

                  <div>
                    <Label htmlFor="streetDetails">Rue / Détails</Label>
                    <Textarea
                      id="streetDetails"
                      value={newAddress.streetDetails}
                      onChange={(e) => setNewAddress({...newAddress, streetDetails: e.target.value})}
                      placeholder="Près de l'école, 3e maison bleue..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Type d'adresse</Label>
                    <RadioGroup 
                      value={newAddress.tag} 
                      onValueChange={(value) => setNewAddress({...newAddress, tag: value})}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="domicile" id="domicile" />
                        <Label htmlFor="domicile">Domicile</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="travail" id="travail" />
                        <Label htmlFor="travail">Travail</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="autre" id="autre" />
                        <Label htmlFor="autre">Autre</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isDefault" 
                      checked={newAddress.isDefault}
                      onCheckedChange={(checked) => setNewAddress({...newAddress, isDefault: checked as boolean})}
                    />
                    <Label htmlFor="isDefault">Définir comme adresse principale</Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleAddNewAddress}
                    className="flex-1"
                    disabled={!newAddress.fullName || !newAddress.phone || !newAddress.departement}
                  >
                    Ajouter l'adresse
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleDeliverHere}
              className="flex-1"
              disabled={!selectedAddress}
            >
              Livrer à cette adresse
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DeliveryAddressSheet;