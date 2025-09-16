
import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom"; 
import { ChevronLeft, Bell, Bookmark, Users, ShoppingBag, Settings, Star, Tv, Rss, MessageCircle, Zap, Home, SendHorizonal, Plus, CreditCard, Film, HelpCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const MoreMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      title: "Notifications", 
      icon: Bell, 
      link: "/notifications",
      badge: 12
    },
    { 
      title: "Bookmarks", 
      icon: Bookmark, 
      link: "/bookmarks"
    },
    { 
      title: "Friends", 
      icon: Users, 
      link: "/friends",
      badge: 3
    },
    { 
      title: "Shopping", 
      icon: ShoppingBag, 
      link: "/shopping"
    },
    { 
      title: "Settings", 
      icon: Settings, 
      link: "/settings"
    },
    { 
      title: "Transfer Money", 
      icon: SendHorizonal, 
      link: "/transfer"
    },
    { 
      title: "Top Up", 
      icon: Plus, 
      link: "/topup"
    },
    { 
      title: "Netflix", 
      icon: Film, 
      link: "/netflix"
    },
    { 
      title: "PayPal Checkout", 
      icon: CreditCard, 
      link: "/paypal-checkout"
    },
    { 
      title: "Help Center", 
      icon: HelpCircle, 
      link: "#"
    },
    { 
      title: "About Us", 
      icon: Info, 
      link: "#"
    },
    { 
      title: "Favorites", 
      icon: Star, 
      link: "/favorites"
    }
  ];

  const handleItemClick = (item) => {
    // Store the selected item name in localStorage so the bottom nav can access it
    localStorage.setItem('selectedMoreItem', item.title);
    
    // Navigate to the item's link
    if (item.link !== "#") {
      navigate(item.link);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">More Options</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Grid Menu */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200",
                  "hover:bg-accent hover:scale-105 active:scale-95",
                  "border border-border bg-card shadow-sm"
                )}
              >
                <div className="relative mb-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold px-1.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </div>
                <span className="text-center text-sm font-medium text-foreground leading-tight">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoreMenu;