import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  ChevronLeft, Check, ShoppingBag, CreditCard, MapPin, Package,
  Minus, Plus, Star, Shield, Truck, Clock, Zap, CreditCard as CardIcon,
  Smartphone, Wallet, Gift, Info, AlertCircle, ChevronRight, ChevronDown,
  HelpCircle, Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/useProduct";
import { motion, AnimatePresence } from "framer-motion";
import ProductColorVariants from "@/components/product/ProductColorVariants";
import BundleDeals from "@/components/product/BundleDeals";
import { countries, states, cities } from '@/data/locations';
import UnifiedHeader from '@/components/shared/UnifiedHeader';
import LocationScreen from '@/components/home/header/LocationScreen';
import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';

interface CheckoutStep {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image?: string;
}

interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: React.ReactNode;
  features: string[];
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fee: number;
  popular?: boolean;
}

interface PickupStation {
  id: string;
  name: string;
  address: string;
  hours: string;
  distance: string;
  estimatedTime: string;
  phone: string;
  features: string[];
}

const ProductCheckout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentLocation, setLocation } = useLanguageSwitcher();
  const [locationStep, setLocationStep] = useState(1); // 1: department, 2: commune, 3: section, 4: localité
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showLocationScreen, setShowLocationScreen] = useState(false);

  // Get product ID from URL params and fetch real product data
  const productId = searchParams.get("productId") || "";
  const { data: productData, isLoading } = useProduct(productId);
  
  // Enhanced product details
  const productName = searchParams.get("productName") || productData?.name || "Premium Bluetooth Headphones";
  const initialQuantity = parseInt(searchParams.get("quantity") || "1");
  const selectedColor = searchParams.get("color") || "Black";
  const basePrice = parseFloat(searchParams.get("price") || productData?.price?.toString() || "62.993");
  
  // Check if product is variable type (has variants)
  const isVariableProduct = productData?.product_type === 'variable';

  // Product variants
  const variants: ProductVariant[] = [
    { id: "black", name: "Midnight Black", price: 62.99, originalPrice: 89.99, stock: 256 },
    { id: "white", name: "Pearl White", price: 65.99, originalPrice: 89.99, stock: 124 },
    { id: "blue", name: "Ocean Blue", price: 67.99, originalPrice: 89.99, stock: 55 },
    { id: "green", name: "Forest Green", price: 64.99, originalPrice: 89.99, stock: 180 },
    { id: "jetblack", name: "Jet Black", price: 66.99, originalPrice: 89.99, stock: 18 },
    { id: "red", name: "Crimson Red", price: 69.99, originalPrice: 89.99, stock: 0 },
  ];

  // Shipping options
  const shippingOptions: DeliveryMethod[] = [
    {
      id: "pickup-station",
      name: "Pickup Station",
      description: "Collect your order from our convenient pickup locations",
      price: 0,
      estimatedDays: "1-2 days",
      icon: <MapPin className="h-5 w-5" />,
      features: ["Free", "Multiple locations", "Extended hours"]
    },
    {
      id: "motorcycle",
      name: "Motorcycle Delivery Agent",
      description: "Fast delivery by motorcycle courier",
      price: 3.99,
      estimatedDays: "Same day",
      icon: <Truck className="h-5 w-5" />,
      features: ["Fast delivery", "Real-time tracking", "Same day service"]
    },
    {
      id: "meetup",
      name: "Meetup",
      description: "Meet the seller at an agreed central location for safe exchange",
      price: 0,
      estimatedDays: "1-2 days",
      icon: <MapPin className="h-5 w-5" />,
      features: ["Fast & Reliable", "Safe exchange", "Flexible timing"]
    },
    {
      id: "local",
      name: "Local",
      description: "Delivery within the same neighborhood on foot or bicycle",
      price: 1.99,
      estimatedDays: "Same day",
      icon: <Package className="h-5 w-5" />,
      features: ["Fast & Reliable", "Same neighborhood", "Eco-friendly"]
    },
    {
      id: "transit",
      name: "Transit",
      description: "Inter-city delivery via trusted bus companies for long-distance orders",
      price: 5.99,
      estimatedDays: "2-3 days",
      icon: <Truck className="h-5 w-5" />,
      features: ["Fast & Reliable", "Long distance", "Trusted partners"]
    },
    {
      id: "pickup",
      name: "Pickup",
      description: "Go directly to the seller's home or shop to collect your item",
      price: 0,
      estimatedDays: "Same day",
      icon: <Package className="h-5 w-5" />,
      features: ["Fast & Reliable", "Direct collection", "Immediate pickup"]
    }
  ];

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: "moncash",
      name: "MonCash",
      description: "Pay securely with MonCash wallet",
      icon: <Smartphone className="h-5 w-5" />,
      fee: 0,
      popular: true
    },
    {
      id: "natcash",
      name: "NatCash",
      description: "Quick payment with NatCash",
      icon: <Wallet className="h-5 w-5" />,
      fee: 0
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, MasterCard, American Express",
      icon: <CardIcon className="h-5 w-5" />,
      fee: 0
    },
    {
      id: "banktransfer",
      name: "Bank Transfer",
      description: "Direct bank transfer",
      icon: <CreditCard className="h-5 w-5" />,
      fee: 1.99
    }
  ];

  // Pickup stations
  const pickupStations: PickupStation[] = [
    {
      id: "station-1",
      name: "Port-au-Prince Central Station",
      address: "123 Boulevard Jean-Jacques Dessalines, Port-au-Prince",
      hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
      distance: "0.5 km",
      estimatedTime: "2 min walk",
      phone: "+509 2234 5678",
      features: ["24/7 Access", "Security Guard", "Parking Available"]
    },
    {
      id: "station-2", 
      name: "Pétion-Ville Express Station",
      address: "45 Rue Grégoire, Pétion-Ville",
      hours: "Mon-Fri: 9AM-7PM, Sat: 9AM-5PM",
      distance: "1.2 km",
      estimatedTime: "5 min walk",
      phone: "+509 2234 5679",
      features: ["Air Conditioned", "Customer Service", "Easy Access"]
    },
    {
      id: "station-3",
      name: "Delmas Shopping Center Station", 
      address: "67 Route de Delmas, Delmas 31",
      hours: "Daily: 9AM-9PM",
      distance: "2.1 km",
      estimatedTime: "8 min drive",
      phone: "+509 2234 5680",
      features: ["Shopping Center", "Food Court", "Free WiFi"]
    },
    {
      id: "station-4",
      name: "Carrefour Mall Station",
      address: "89 Boulevard du 15 Octobre, Carrefour",
      hours: "Mon-Sat: 10AM-8PM, Sun: 12PM-6PM", 
      distance: "3.5 km",
      estimatedTime: "12 min drive",
      phone: "+509 2234 5681",
      features: ["Mall Location", "Restaurants", "Ample Parking"]
    }
  ];

  const [formData, setFormData] = useState({
    // Product selection
    selectedVariant: variants.find(v => v.id === selectedColor.toLowerCase()) || variants[0],
    quantity: initialQuantity,
    
    // Delivery
    deliveryMethod: "pickup-station",
    userLocation: "",
    selectedPickupStation: "",
    
    // Location details
    selectedDepartment: "",
    selectedCommune: "",
    selectedSection: "", 
    selectedLocalite: "",
    
    // Shipping Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Haiti",
    
    // Payment
    paymentMethod: "moncash",
    
    // Card details
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    
    // Mobile wallet details
    walletPhone: "",
    
    // Options
    saveInfo: false,
    giftMessage: "",
    isGift: false
  });

  const steps: CheckoutStep[] = [
    ...(isVariableProduct ? [{ 
      id: 1, 
      title: "Variant Selection", 
      icon: <ShoppingBag className="h-4 w-4" />,
      description: "Choose your preferred variant"
    }] : []),
    { 
      id: isVariableProduct ? 2 : 1, 
      title: "Quantity", 
      icon: <Package className="h-4 w-4" />,
      description: "Select how many you need"
    },
    { 
      id: isVariableProduct ? 3 : 2, 
      title: "Your Location", 
      icon: <MapPin className="h-4 w-4" />,
      description: "Tell us where you are"
    },
    { 
      id: isVariableProduct ? 4 : 3, 
      title: "Shipping Options", 
      icon: <Truck className="h-4 w-4" />,
      description: "Choose delivery method"
    },
    { 
      id: isVariableProduct ? 5 : 4, 
      title: "Pickup Station", 
      icon: <MapPin className="h-4 w-4" />,
      description: "Select pickup location"
    },
    { 
      id: isVariableProduct ? 6 : 5, 
      title: "Delivery Address", 
      icon: <MapPin className="h-4 w-4" />,
      description: "Enter shipping details"
    },
    { 
      id: isVariableProduct ? 7 : 6, 
      title: "Payment", 
      icon: <CreditCard className="h-4 w-4" />,
      description: "Choose payment method"
    },
    { 
      id: isVariableProduct ? 8 : 7, 
      title: "Review & Place Order", 
      icon: <Check className="h-4 w-4" />,
      description: "Confirm your order"
    }
  ];

  // Bundle pricing tiers (matching BundleDeals component)
  const PRICE_TIERS = [
    { min: 1, max: 2, price: 10.00, discount: 0 },
    { min: 3, max: 5, price: 9.00, discount: 10 },
    { min: 6, max: 9, price: 8.50, discount: 15 },
    { min: 10, max: 49, price: 8.00, discount: 20 },
    { min: 50, max: 99, price: 7.50, discount: 25 },
    { min: 100, max: Infinity, price: 7.00, discount: 30 }
  ];

  // Get current bundle deal price
  const getBundlePrice = () => {
    const tier = PRICE_TIERS.find(tier => 
      formData.quantity >= tier.min && 
      (tier.max === Infinity || formData.quantity <= tier.max)
    );
    return tier ? tier.price : formData.selectedVariant.price;
  };

  // Calculate pricing
  const selectedDelivery = shippingOptions.find(d => d.id === formData.deliveryMethod);
  const selectedPayment = paymentMethods.find(p => p.id === formData.paymentMethod);
  const currentPrice = getBundlePrice();
  const subtotal = currentPrice * formData.quantity;
  const deliveryCost = selectedDelivery?.price || 0;
  const paymentFee = selectedPayment?.fee || 0;
  const discount = Math.max(0, subtotal - (formData.selectedVariant.originalPrice || 0) * formData.quantity);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + deliveryCost + paymentFee + tax;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(formData.selectedVariant.stock, formData.quantity + change));
    handleInputChange("quantity", newQuantity);
  };

  const getNextStepId = (currentId: number) => {
    const stepOffset = isVariableProduct ? 0 : -1;
    const locationStepId = 3 + stepOffset;
    const shippingStepId = 4 + stepOffset;
    const pickupStepId = 5 + stepOffset;
    const deliveryStepId = 6 + stepOffset;
    const maxStepId = 8 + stepOffset;
    
    if (currentId === locationStepId - 1) {
      return locationStepId;
    } else if (currentId === locationStepId) {
      const hasLocation = Boolean(
        (currentLocation && currentLocation.name) ||
        formData.selectedDepartment ||
        formData.selectedCommune ||
        formData.selectedSection ||
        formData.selectedLocalite
      );
      return hasLocation ? shippingStepId : (locationStep < 4 ? locationStepId : shippingStepId);
    } else if (currentId === shippingStepId) {
      return formData.deliveryMethod === "pickup-station" ? pickupStepId : deliveryStepId;
    } else if (currentId === pickupStepId) {
      return deliveryStepId;
    } else if (currentId < maxStepId) {
      return currentId + 1;
    }
    return currentId;
  };

  const handleNext = () => {
    const locationStepId = isVariableProduct ? 3 : 2;
    
    if (currentStep === locationStepId) {
      const hasLocation = Boolean(
        (currentLocation && currentLocation.name) ||
        formData.selectedDepartment ||
        formData.selectedCommune ||
        formData.selectedSection ||
        formData.selectedLocalite
      );

      if (!hasLocation) {
        if (locationStep < 4) {
          setLocationStep(prev => prev + 1);
          return;
        } else {
          // No explicit selection but user finished sub-steps: advance anyway
          setLocationStep(1);
          const nextMainStep = isVariableProduct ? 4 : 3;
          setCurrentStep(nextMainStep);
          return;
        }
      } else {
        // Location is already set (via LocationScreen or selections)
        setLocationStep(1);
      }
    }
    
    const nextStep = getNextStepId(currentStep);
    if (nextStep > currentStep) {
      setCurrentStep(nextStep);
    } else {
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been confirmed and will be processed soon.",
      });
      navigate("/");
    }
  };

  const handleBack = () => {
    if (currentStep === 3 && locationStep > 1) {
      // Handle going back in location sub-steps
      setLocationStep(prev => prev - 1);
    } else if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      if (currentStep === 3) {
        setLocationStep(4); // Reset to last location step when returning to step 3
      }
    } else {
      navigate(-1);
    }
  };

  const canProceed = () => {
    const stepOffset = isVariableProduct ? 0 : -1;
    const adjustedStep = currentStep - stepOffset;
    
    switch (adjustedStep) {
      case 1:
        return isVariableProduct ? true : formData.quantity > 0 && formData.quantity <= formData.selectedVariant.stock;
      case 2:
        return formData.quantity > 0 && formData.quantity <= formData.selectedVariant.stock;
      case 3:
        {
          const hasLocation = Boolean(
            (currentLocation && currentLocation.name) ||
            formData.selectedDepartment ||
            formData.selectedCommune ||
            formData.selectedSection ||
            formData.selectedLocalite
          );
          return hasLocation;
        }
      case 4:
        return formData.deliveryMethod;
      case 5:
        return formData.selectedPickupStation;
      case 6:
        return formData.firstName && formData.lastName && formData.email && formData.address && formData.city;
      case 7:
        if (formData.paymentMethod === "card") {
          return formData.cardNumber && formData.expiryDate && formData.cvv && formData.cardholderName;
        }
        if (formData.paymentMethod === "moncash" || formData.paymentMethod === "natcash") {
          return formData.walletPhone;
        }
        return true;
      default:
        return true;
    }
  };

  const renderQuantityStep = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Question Heading */}
        <div className="mb-4 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            How many would you like?
          </h2>
          <p className="text-sm text-gray-600">
            Select the quantity you need. Limited stock available for this item.
          </p>
        </div>

        {/* Bundle Deals Component with real data */}
        <BundleDeals 
          bundleDeals={productData?.bundle_deals || []}
          productPrice={productData?.price || basePrice}
          calculatePrice={(discount) => (productData?.price || basePrice) * (1 - discount / 100)}
          onQuantitySelect={(qty) => handleInputChange("quantity", Math.max(1, Math.min(qty, formData.selectedVariant.stock)))}
        />

        {/* Current Selection Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center border rounded-lg bg-white">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={formData.quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const clampedValue = Math.max(1, Math.min(value, formData.selectedVariant.stock));
                    handleInputChange("quantity", clampedValue);
                  }}
                  min="1"
                  max={formData.selectedVariant.stock}
                  className="w-12 text-center font-medium bg-transparent border-none outline-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={formData.quantity >= formData.selectedVariant.stock}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                {formData.selectedVariant.stock} available
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">
                ${(currentPrice * formData.quantity).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                ${currentPrice.toFixed(2)} each
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStepContent = () => {
    const stepOffset = isVariableProduct ? 0 : -1;
    const adjustedStep = currentStep - stepOffset;
    
    switch (adjustedStep) {
      case 1:
        if (!isVariableProduct) {
          // Skip to quantity step for single products
          return renderQuantityStep();
        }
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Which variant would you like?
              </h2>
              <p className="text-sm text-gray-600">
                Choose your preferred variant. Each variant may have different pricing and availability.
              </p>
            </div>

            {/* Color Variants Component with real data */}
            <ProductColorVariants 
              hideHeader={true}
              selectedColor={formData.selectedVariant.name}
              bundlePrice={getBundlePrice()}
              onColorChange={(colorName) => {
                const variant = variants.find(v => v.name === colorName) || variants[0];
                handleInputChange("selectedVariant", variant);
              }}
              variants={productData?.bundle_deals && Array.isArray(productData.bundle_deals) 
                ? productData.bundle_deals.map((deal: any, index: number) => ({
                    id: deal.id || `deal-${index}`,
                    name: deal.variant_name || deal.name,
                    price: deal.price || productData.price,
                    stock: deal.stock || productData.inventory || 100,
                    bestseller: deal.bestseller || false,
                    image: deal.image || "",
                  }))
                : variants.map(v => ({
                    id: v.id || v.name,
                    name: v.name,
                    price: v.price,
                    stock: v.stock,
                    bestseller: false,
                    image: v.image || "",
                  }))
              }
            />
          </motion.div>
         );

      case 2:
        return renderQuantityStep();
        

      case 3:
        const haitiStates = states.filter(state => state.countryCode === 'HT');
        const availableCities = cities.filter(city => 
          city.countryCode === 'HT' && 
          city.stateCode === formData.selectedDepartment
        );
        
        const getLocationStepTitle = () => {
          switch (locationStep) {
            case 1: return "What Department are you in?";
            case 2: return "What Commune are you in?";
            case 3: return "What Section Communale are you in?";
            case 4: return "What Localité are you in?";
            default: return "Select your location";
          }
        };

        const getLocationStepDescription = () => {
          switch (locationStep) {
            case 1: return "Please select your department first";
            case 2: return "Choose your commune within the selected department";
            case 3: return "Select your section communale";
            case 4: return "Finally, choose your localité";
            default: return "Complete your location details";
          }
        };

        const getCurrentOptions = () => {
          switch (locationStep) {
            case 1: 
              return haitiStates.map(state => ({ value: state.code, label: state.name }));
            case 2:
              return availableCities
                .filter((city, index, self) => 
                  index === self.findIndex(c => c.name === city.name)
                )
                .map(city => ({ value: city.name, label: city.name }));
            case 3:
              // For section communale, we'll use some example sections
              return [
                { value: "section-1", label: "1ère Section" },
                { value: "section-2", label: "2ème Section" },
                { value: "section-3", label: "3ème Section" },
                { value: "section-4", label: "4ème Section" },
                { value: "section-urbaine", label: "Section Urbaine" }
              ];
            case 4:
              // For localités, we'll use some example localities
              return [
                { value: "localite-1", label: "Habitation Leclerc" },
                { value: "localite-2", label: "Habitation Duval" },
                { value: "localite-3", label: "Centre-ville" },
                { value: "localite-4", label: "Bord de mer" },
                { value: "localite-5", label: "Montagne" }
              ];
            default:
              return [];
          }
        };

        const getCurrentValue = () => {
          switch (locationStep) {
            case 1: return formData.selectedDepartment;
            case 2: return formData.selectedCommune;
            case 3: return formData.selectedSection;
            case 4: return formData.selectedLocalite;
            default: return "";
          }
        };

        const handleLocationStepContinue = () => {
          if (locationStep < 4) {
            setLocationStep(prev => prev + 1);
          } else {
            // Complete location step and go to next main step
            const nextMainStep = isVariableProduct ? 4 : 3;
            setCurrentStep(nextMainStep);
            setLocationStep(1);
          }
        };

        const handleLocationSelect = (value: string) => {
          switch (locationStep) {
            case 1:
              handleInputChange("selectedDepartment", value);
              break;
            case 2:
              handleInputChange("selectedCommune", value);
              break;
            case 3:
              handleInputChange("selectedSection", value);
              break;
            case 4:
              handleInputChange("selectedLocalite", value);
              break;
          }
        };

        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Where should we deliver your order?
              </h2>
              <p className="text-sm text-gray-600">
                Please confirm your delivery address or update it if needed.
              </p>
            </div>

            {/* Full Address Card - Show when location is set from LanguageContext */}
            {currentLocation && currentLocation.name && currentLocation.name.includes(',') ? (
              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-orange-900 mb-2">
                          Delivery Address
                        </h4>
                        <div className="text-sm text-orange-800 space-y-1">
                          {(() => {
                            // Parse the location name to extract parts
                            const parts = currentLocation.name.split(', ');
                            if (parts.length >= 4) {
                              return (
                                <>
                                  <div className="font-medium">Quartier: {parts[0]}</div>
                                  <div>Section: {parts[1]}</div>
                                  <div>Commune: {parts[2]}</div>
                                  <div>Department: {parts[3]}</div>
                                </>
                              );
                            } else {
                              return <div className="font-medium">{currentLocation.name}</div>;
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Change Button */}
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <Button
                      onClick={() => setShowLocationScreen(true)}
                      variant="outline"
                      size="sm"
                      className="w-full bg-white border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Change Address
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Original Location Selection Interface - Show when no location is set */
              <>
                {/* Department Selector */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">What Department are you in?</p>
                  <button
                    onClick={() => setShowLocationScreen(true)}
                    className="flex items-center justify-between w-full py-3 px-0 text-sm border-b border-gray-200 hover:border-gray-300"
                  >
                    <span className="text-gray-700">
                      {formData.selectedDepartment 
                        ? haitiStates.find(s => s.code === formData.selectedDepartment)?.name
                        : "Select Department"
                      }
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                {/* Commune Selector */}
                {formData.selectedDepartment && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">What Commune are you in?</p>
                    <button
                      onClick={() => {
                        setShowLocationSelector(true);
                        setLocationStep(2);
                      }}
                      className="flex items-center justify-between w-full py-3 px-0 text-sm border-b border-gray-200 hover:border-gray-300"
                    >
                      <span className="text-gray-700">
                        {formData.selectedCommune || "Select Commune"}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                )}

                {/* Section Selector */}
                {formData.selectedCommune && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">What Section Communale are you in?</p>
                    <button
                      onClick={() => {
                        setShowLocationSelector(true);
                        setLocationStep(3);
                      }}
                      className="flex items-center justify-between w-full py-3 px-0 text-sm border-b border-gray-200 hover:border-gray-300"
                    >
                      <span className="text-gray-700">
                        {formData.selectedSection 
                          ? getCurrentOptions().find(o => o.value === formData.selectedSection)?.label
                          : "Select Section Communale"
                        }
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                )}

                {/* Localité Selector */}
                {formData.selectedSection && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">What Localité are you in?</p>
                    <button
                      onClick={() => {
                        setShowLocationSelector(true);
                        setLocationStep(4);
                      }}
                      className="flex items-center justify-between w-full py-3 px-0 text-sm border-b border-gray-200 hover:border-gray-300"
                    >
                      <span className="text-gray-700">
                        {formData.selectedLocalite 
                          ? getCurrentOptions().find(o => o.value === formData.selectedLocalite)?.label
                          : "Select Localité"
                        }
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                )}

                {/* Help Card */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                          Need help finding your location?
                        </h4>
                        <p className="text-sm text-blue-700">
                          Tap "Choose Department" to open our location selector with GPS detection and search functionality.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Location Screen Modal */}
            {showLocationScreen && (
              <div className="fixed inset-0 bg-white z-50">
                <LocationScreen 
                  onClose={() => setShowLocationScreen(false)}
                  showHeader={true}
                />
              </div>
            )}

            {/* Full Page Location Selector */}
            {showLocationSelector && (
              <div className="fixed inset-0 bg-white z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <button
                    onClick={() => setShowLocationSelector(false)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Back
                  </button>
                  <h2 className="text-lg font-semibold">{getLocationStepTitle()}</h2>
                  <div className="w-16" /> {/* Spacer for centering */}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {getCurrentOptions().map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleLocationSelect(option.value);
                          setShowLocationSelector(false);
                        }}
                        className={`
                          flex items-center justify-between w-full p-4 rounded-lg text-left transition-colors border
                          ${getCurrentValue() === option.value
                            ? 'bg-orange-50 border-orange-500 text-orange-900'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <span className="font-medium">{option.label}</span>
                        {getCurrentValue() === option.value && (
                          <Check className="h-4 w-4 text-orange-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                How would you like to receive your order?
              </h2>
              <p className="text-sm text-gray-600">
                Choose the delivery method that works best for you. Each option has different speeds and costs.
              </p>
            </div>

            {/* Shipping Options Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Shipping Options</h3>
              <RadioGroup
                value={formData.deliveryMethod}
                onValueChange={(value) => handleInputChange("deliveryMethod", value)}
                className="space-y-2"
              >
                {shippingOptions.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between w-full py-3 px-0 text-sm border-b border-gray-200 ${
                      formData.deliveryMethod === method.id
                        ? "border-orange-400"
                        : "hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div>
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                        <div className="text-xs text-gray-500">{method.estimatedDays}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {method.price === 0 ? "Free" : `$${method.price.toFixed(2)}`}
                      </div>
                      {method.price === 0 && (
                        <div className="text-xs text-green-600">Free shipping</div>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Helpful Question */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">
                      When do you need this delivered?
                    </h4>
                    <p className="text-sm text-green-700">
                      {selectedDelivery?.name === "Pickup Station" 
                        ? "Pickup stations are perfect for secure, convenient collection at your own schedule."
                        : selectedDelivery?.name === "Motorcycle Delivery Agent"
                        ? "Same-day motorcycle delivery is our fastest option for urgent orders."
                        : "Each delivery option is designed to meet different timing and convenience needs."
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 5:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Which pickup station works best for you?
              </h2>
              <p className="text-sm text-gray-600">
                Choose your preferred pickup location. You can collect your order at your convenience during operating hours.
              </p>
            </div>

            {/* Pickup Stations Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Pickup Stations</h3>
              <RadioGroup
                value={formData.selectedPickupStation}
                onValueChange={(value) => handleInputChange("selectedPickupStation", value)}
                className="space-y-2"
              >
                {pickupStations.map((station) => (
                  <div
                    key={station.id}
                    className={`flex items-start justify-between w-full py-3 px-0 border-b border-gray-200 ${
                      formData.selectedPickupStation === station.id
                        ? "border-orange-400"
                        : "hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <RadioGroupItem value={station.id} id={station.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{station.name}</div>
                        <div className="text-sm text-gray-600 mb-1">{station.address}</div>
                        <div className="text-xs text-gray-500">{station.hours}</div>
                        <div className="text-xs text-gray-500">{station.phone}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {station.features.map((feature, idx) => (
                            <span key={idx} className="text-xs text-gray-400">
                              {feature}{idx < station.features.length - 1 ? ' • ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-green-600">{station.distance}</div>
                      <div className="text-xs text-gray-500">{station.estimatedTime}</div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Where should we deliver your order?
              </h2>
              <p className="text-sm text-gray-600">
                Please provide your delivery address. This information will be used to ship your order safely.
              </p>
            </div>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Jean"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Baptiste"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="jean@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+509 1234 5678"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Rue de la République"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Port-au-Prince"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Department</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="Ouest"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      placeholder="HT6110"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onCheckedChange={(checked) => handleInputChange("saveInfo", checked)}
                  />
                  <Label htmlFor="saveInfo" className="text-sm">
                    Save this address for future orders
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Helpful Question */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900 mb-1">
                      Is this address correct?
                    </h4>
                    <p className="text-sm text-orange-700">
                      Double-check your address to ensure smooth delivery. We'll send tracking updates to your email and phone.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 7:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                How would you like to pay?
              </h2>
              <p className="text-sm text-gray-600">
                Choose your preferred payment method. All payments are secure and encrypted.
              </p>
            </div>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.01 }}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex items-center space-x-2">
                            {method.icon}
                            <span className="font-semibold">{method.name}</span>
                            {method.popular && (
                              <Badge className="bg-green-100 text-green-700">Popular</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {method.fee > 0 ? (
                            <span className="text-sm text-gray-600">+${method.fee}</span>
                          ) : (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Free
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 ml-8">{method.description}</p>
                    </motion.div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <AnimatePresence mode="wait">
              {formData.paymentMethod === "card" && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="cardholderName">Cardholder Name *</Label>
                        <Input
                          id="cardholderName"
                          value={formData.cardholderName}
                          onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                          placeholder="Jean Baptiste"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                            placeholder="MM/YY"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                            placeholder="123"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {(formData.paymentMethod === "moncash" || formData.paymentMethod === "natcash") && (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {formData.paymentMethod === "moncash" ? "MonCash" : "NatCash"} Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="walletPhone">Phone Number *</Label>
                        <Input
                          id="walletPhone"
                          value={formData.walletPhone}
                          onChange={(e) => handleInputChange("walletPhone", e.target.value)}
                          placeholder="+509 1234 5678"
                          className="mt-1"
                        />
                        <p className="text-sm text-gray-600 mt-1">
                          Enter your {formData.paymentMethod === "moncash" ? "MonCash" : "NatCash"} registered phone number
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Helpful Question */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900 mb-1">
                      Want to save your payment info?
                    </h4>
                    <p className="text-sm text-purple-700">
                      MonCash is the most popular choice in Haiti. All payment methods are secure and encrypted with bank-level security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary for Payment Step */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({formData.quantity} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery ({selectedDelivery?.name})</span>
                    <span>${deliveryCost.toFixed(2)}</span>
                  </div>
                  {paymentFee > 0 && (
                    <div className="flex justify-between">
                      <span>Payment Fee</span>
                      <span>${paymentFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 8:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Question Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to complete your order?
              </h2>
              <p className="text-sm text-gray-600">
                Please review your order details carefully. You can go back to make changes if needed.
              </p>
            </div>

            {/* Order Review */}
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Summary */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{productName}</h4>
                    <p className="text-sm text-gray-600">
                      {formData.selectedVariant.name} × {formData.quantity}
                    </p>
                    {formData.isGift && (
                      <Badge className="mt-1 bg-purple-100 text-purple-700">
                        <Gift className="h-3 w-3 mr-1" />
                        Gift Item
                      </Badge>
                    )}
                  </div>
                  <div className="text-lg font-bold">
                    ${(formData.selectedVariant.price * formData.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Delivery Summary */}
                <div className="space-y-2">
                  <h5 className="font-semibold">Delivery</h5>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {selectedDelivery?.icon}
                        <span className="font-medium">{selectedDelivery?.name}</span>
                      </div>
                      <span>{selectedDelivery?.estimatedDays}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} {formData.zipCode}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="space-y-2">
                  <h5 className="font-semibold">Payment</h5>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {selectedPayment?.icon}
                      <span className="font-medium">{selectedPayment?.name}</span>
                      {selectedPayment?.popular && (
                        <Badge className="bg-green-100 text-green-700">Popular</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Final Total */}
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and 
                    <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>. 
                    I understand that my order will be processed according to these terms.
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Helpful Question */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">
                      All details look correct?
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Once you place the order, we'll start processing it immediately. You'll receive a confirmation email shortly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Unified Header */}
      <UnifiedHeader 
        title="Secure Checkout"
        leftButton={
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        }
        onHelp={() => {
          toast({
            title: "Need Help?",
            description: "Contact our support team for assistance with your order.",
          });
        }}
        className="sticky top-0 z-50"
      />
      
      {/* Progress Bars */}
      <div className="sticky top-16 z-40 bg-white px-4 pb-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-1">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  currentStep >= step.id ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

      {/* Sticky Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full max-w-md bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl text-base"
              size="lg"
            >
              {currentStep === 8 ? "Place Order" : "Continue"}
            </Button>
          </div>
          
          {/* Progress hint */}
          {!canProceed() && (
            <div className="mt-2 text-center">
              <p className="text-xs text-red-600 flex items-center justify-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {(() => {
                  const stepOffset = isVariableProduct ? 0 : -1;
                  const adjusted = currentStep - stepOffset;
                  switch (adjusted) {
                    case 1: return "Please select a color variant";
                    case 2: return "Please select quantity";
                    case 3: return "Please select your location";
                    case 4: return "Please select delivery method";
                    case 5: return "Please select pickup station";
                    case 6: return "Please fill in delivery details";
                    case 7: return "Please select payment method";
                    default: return "";
                  }
                })()}
              </p>
            </div>
          )}
        </div>
      </div>

      </div>
    </div>
  );
};

export default ProductCheckout;