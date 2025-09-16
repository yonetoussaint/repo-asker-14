
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

export interface ReceiverDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  department: string;
  arrondissement: string;
  commune: string;
}

interface ReceiverDetailsFormProps {
  onDetailsChange: (details: ReceiverDetails) => void;
  amount?: string;
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

const ReceiverDetailsForm: React.FC<ReceiverDetailsFormProps> = ({ onDetailsChange, amount = "0" }) => {
  const form = useForm<ReceiverDetails>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      department: "Artibonite",
      arrondissement: "",
      commune: "",
    },
  });

  const watchedValues = form.watch();

  // Update parent component when form values change
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      onDetailsChange(value as ReceiverDetails);
    });
    return () => subscription.unsubscribe();
  }, [form, onDetailsChange]);

  const availableCommunes = watchedValues.arrondissement ? artiboniteData[watchedValues.arrondissement] || [] : [];

  const handleArrondissementChange = (value: string) => {
    form.setValue('arrondissement', value);
    form.setValue('commune', ''); // Reset commune when arrondissement changes
  };

  return (
    <div className="space-y-4 py-2">
      <h3 className="text-base font-medium">Receiver Details</h3>
      
      <div className="space-y-3">
        {/* Full Name - Horizontal Layout */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Full Name</Label>
          <div className="grid grid-cols-2 gap-3">
            <Input 
              placeholder="First name" 
              {...form.register("firstName")}
            />
            <Input 
              placeholder="Last name" 
              {...form.register("lastName")}
            />
          </div>
        </div>

        {/* Phone Number with Haiti Country Code */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="flex">
            <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-md">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-r from-blue-600 via-red-500 to-red-600 relative">
                    <div className="absolute inset-0 bg-blue-600"></div>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-red-600"></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">+509</span>
              </div>
            </div>
            <Input 
              id="phoneNumber" 
              placeholder="XXXX XXXX" 
              {...form.register("phoneNumber")}
              className="rounded-l-none"
            />
          </div>
          <p className="text-xs text-gray-500">Enter 8-digit Haitian phone number</p>
        </div>

        {/* Address - Haiti Administrative Divisions - Compact Layout */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Address in Haiti</Label>
          
          {/* Department and Arrondissement - Horizontal Layout */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Department</Label>
              <Input 
                value="Artibonite"
                disabled
                className="bg-gray-50 text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Arrondissement</Label>
              <Select value={watchedValues.arrondissement} onValueChange={handleArrondissementChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select arrondissement" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 z-50">
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
          <div className="space-y-2">
            <Label className="text-xs text-gray-600">Commune</Label>
            <Select 
              value={watchedValues.commune} 
              onValueChange={(value) => form.setValue('commune', value)}
              disabled={!watchedValues.arrondissement}
            >
              <SelectTrigger>
                <SelectValue placeholder={watchedValues.arrondissement ? "Select commune" : "Select arrondissement first"} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 z-50">
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
    </div>
  );
};

export default ReceiverDetailsForm;
