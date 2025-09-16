import React, { useState, useEffect } from 'react';
import {
  AlertCircle, 
  Clock, 
  Heart, 
  ShoppingBag, 
  Truck, 
  Award, 
  Shield, 
  Users, 
  Leaf, 
  Package, 
  Calendar, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  Star, 
  Trophy, 
  Eye, 
  MapPin, 
  CheckCircle, 
  Lock, 
  List, 
  Share2, 
  MessageSquare
} from 'lucide-react';

const InfoBand = () => {
  // Array of info band items with different colors and icons
  const infoBands = [
    // Informational Bands (News/Status Updates)
    {
      text: "Just In: New update coming this week!",
      color: "bg-blue-500",
      icon: AlertCircle,
      category: "News"
    },
    {
      text: "The blue color is finally back in stock!",
      color: "bg-cyan-500",
      icon: Package,
      category: "Stock"
    },
    {
      text: "Only 5 left in red – don't miss out!",
      color: "bg-red-500",
      icon: Clock,
      category: "Stock"
    },
    {
      text: "Get 20% off before midnight!",
      color: "bg-purple-500",
      icon: ShoppingBag,
      category: "Offer"
    },
    {
      text: "Free shipping for orders over $50.",
      color: "bg-green-500",
      icon: Truck,
      category: "Shipping"
    },
    {
      text: "Order today, get it by April 25.",
      color: "bg-emerald-600",
      icon: Calendar,
      category: "Shipping"
    },
    {
      text: "Please note: Delays may occur during national holidays.",
      color: "bg-amber-500",
      icon: AlertTriangle,
      category: "Notice"
    },
    {
      text: "Flash Sale! 1-hour deal active now.",
      color: "bg-rose-500",
      icon: Zap,
      category: "Sale"
    },
    
    // Social Proof & Community
    {
      text: "Over 500 people viewed this today.",
      color: "bg-yellow-500",
      icon: TrendingUp,
      category: "Social"
    },
    {
      text: "\"Best product ever!\" – user231dze342.",
      color: "bg-pink-500",
      icon: Star,
      category: "Review"
    },
    {
      text: "#1 in customer satisfaction last month.",
      color: "bg-amber-600",
      icon: Trophy,
      category: "Social"
    },
    {
      text: "12 people are viewing this right now.",
      color: "bg-sky-500",
      icon: Eye,
      category: "Social"
    },
    {
      text: "Someone from Miami just bought this.",
      color: "bg-teal-600",
      icon: MapPin,
      category: "Social"
    },
    
    // Trust & Support
    {
      text: "30-Day Risk-Free Return Policy.",
      color: "bg-indigo-500",
      icon: Shield,
      category: "Trust"
    },
    {
      text: "Quality tested by professionals.",
      color: "bg-blue-600",
      icon: CheckCircle,
      category: "Trust"
    },
    {
      text: "Includes 1-Year Warranty.",
      color: "bg-teal-500",
      icon: Award,
      category: "Trust"
    },
    {
      text: "Safe checkout with SSL encryption.",
      color: "bg-slate-600",
      icon: Lock,
      category: "Trust"
    },
    {
      text: "Made with sustainable materials.",
      color: "bg-emerald-500",
      icon: Leaf,
      category: "Trust"
    },
    
    // Gamification & Engagement
    {
      text: "Can't get it now? Join the waitlist.",
      color: "bg-violet-500",
      icon: List,
      category: "Engagement"
    },
    {
      text: "Refer a friend & earn 10% off.",
      color: "bg-orange-500",
      icon: Share2,
      category: "Engagement"
    },
    {
      text: "Help us improve – give feedback.",
      color: "bg-blue-400",
      icon: MessageSquare,
      category: "Engagement"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Animation timing control
    const fadeDelay = 5000; // How long each message displays
    const fadeTime = 1000; // How long the fade transition takes

    const intervalId = setInterval(() => {
      // Start the fade out
      setIsVisible(false);
      
      // After fade out completes, change the message and fade back in
      setTimeout(() => {
        // Get a random index that's different from the current one
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * infoBands.length);
        } while (nextIndex === currentIndex && infoBands.length > 1);
        
        setCurrentIndex(nextIndex);
        setIsVisible(true);
      }, fadeTime);
    }, fadeDelay);

    return () => clearInterval(intervalId);
  }, [currentIndex, infoBands.length]);

  const currentBand = infoBands[currentIndex];
  const IconComponent = currentBand.icon;

  return (
    <div className="w-full p-0">
      <div 
        className={`${currentBand.color} w-full transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex items-center justify-center py-1 px-4 text-white">
          <IconComponent className="mr-2 h-5 w-5" />
          <p className="font-medium text-sm">{currentBand.text}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoBand;
