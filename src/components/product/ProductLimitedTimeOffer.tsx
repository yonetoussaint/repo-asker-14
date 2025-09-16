
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Zap,
  BookmarkPlus,
  BellRing,
  Clock,
  Check,
  CircleDollarSign,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HoverCardWithDuration, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";

interface ProductLimitedTimeOfferProps {
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const ProductLimitedTimeOffer: React.FC<ProductLimitedTimeOfferProps> = ({ timeLeft }) => {
  const [isNotifyActive, setIsNotifyActive] = useState(false);
  const [earlyAccessActivated, setEarlyAccessActivated] = useState(false);
  const { toast } = useToast();
  
  const handleEarlyAccess = () => {
    setEarlyAccessActivated(!earlyAccessActivated);
    toast({
      title: earlyAccessActivated ? "Early access deactivated" : "Early access activated!",
      description: earlyAccessActivated
        ? "You'll no longer get early access to new products"
        : "You'll now get early access to new products in this category",
    });
  };

  const handlePriceAlert = () => {
    setIsNotifyActive(!isNotifyActive);
    toast({
      title: isNotifyActive ? "Price alert removed" : "Price alert set",
      description: isNotifyActive 
        ? "You will no longer receive notifications for price drops" 
        : "We'll notify you when this product's price drops",
    });
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-100 p-2.5 rounded-md border border-purple-200 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-violet-300/10 rounded-full -translate-x-4 -translate-y-10 blur-md"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-300/20 to-purple-400/10 rounded-full translate-x-2 translate-y-6 blur-md"></div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative mr-2">
            <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-30"></div>
            <Zap className="h-4 w-4 text-purple-600 relative z-10" />
          </div>
          <span className="font-medium text-purple-900">Limited Time Offer</span>
        </div>
        
        <div className="flex space-x-1">
          <HoverCardWithDuration openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 w-6 p-0 rounded-full ${earlyAccessActivated ? "bg-purple-200" : "bg-white/60"}`}
                onClick={handleEarlyAccess}
              >
                <BookmarkPlus className={`h-3.5 w-3.5 ${earlyAccessActivated ? "text-purple-700" : "text-gray-500"}`} />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-60 p-3">
              <div className="font-medium mb-1 text-sm">Early Access</div>
              <p className="text-xs text-muted-foreground">
                {earlyAccessActivated
                  ? "You have early access to new releases in this category"
                  : "Get early access to new releases in this category"}
              </p>
            </HoverCardContent>
          </HoverCardWithDuration>
          
          <HoverCardWithDuration openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-6 w-6 p-0 rounded-full ${isNotifyActive ? "bg-purple-200" : "bg-white/60"}`}
                onClick={handlePriceAlert}
              >
                <BellRing className={`h-3.5 w-3.5 ${isNotifyActive ? "text-purple-700" : "text-gray-500"}`} />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-60 p-3">
              <div className="font-medium mb-1 text-sm">Price Drop Alert</div>
              <p className="text-xs text-muted-foreground">
                {isNotifyActive 
                  ? "You will be notified when this product's price drops"
                  : "Get notified when this product's price drops"}
              </p>
            </HoverCardContent>
          </HoverCardWithDuration>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-1.5 mb-0.5">
        <div className="flex items-center space-x-1">
          <Clock className="h-3.5 w-3.5 text-purple-700" />
          <span className="text-xs text-purple-800 font-medium">Deal ends in:</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5">
        <div className="flex items-center justify-center">
          <div className="bg-purple-700 text-white font-mono rounded px-1.5 py-0.5 min-w-[32px] text-center">
            <span className="text-sm">{timeLeft.hours.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-purple-900 mx-0.5">:</span>
          <div className="bg-purple-700 text-white font-mono rounded px-1.5 py-0.5 min-w-[32px] text-center">
            <span className="text-sm">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-purple-900 mx-0.5">:</span>
          <div className="bg-purple-700 text-white font-mono rounded px-1.5 py-0.5 min-w-[32px] text-center">
            <span className="text-sm">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          </div>
        </div>
        
        <div className="flex-1 pl-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="bg-white/60 text-[10px] py-0 h-4 flex items-center border-purple-200 text-purple-800">
              <CircleDollarSign className="h-2.5 w-2.5 mr-0.5" />
              30-DAY LOW
            </Badge>
            <Badge variant="outline" className="bg-white/60 text-[10px] py-0 h-4 flex items-center border-purple-200 text-purple-800">
              <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
              GUARANTEED
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px] bg-white/40 rounded p-1">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-purple-100 flex items-center justify-center mr-1">
            <Check className="h-2 w-2 text-purple-700" />
          </div>
          <span className="text-purple-900">Free fast shipping</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-purple-100 flex items-center justify-center mr-1">
            <Check className="h-2 w-2 text-purple-700" />
          </div>
          <span className="text-purple-900">30-day returns</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-purple-100 flex items-center justify-center mr-1">
            <Check className="h-2 w-2 text-purple-700" />
          </div>
          <span className="text-purple-900">2-year warranty</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-purple-100 flex items-center justify-center mr-1">
            <Check className="h-2 w-2 text-purple-700" />
          </div>
          <span className="text-purple-900">Price match</span>
        </div>
      </div>
    </div>
  );
};

export default ProductLimitedTimeOffer;
