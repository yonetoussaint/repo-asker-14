
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Edit, Settings, ShoppingBag, Store, Heart, Package, User, Star, LogOut, UserCheck, ShoppingCart, ToggleLeft, ToggleRight } from "lucide-react";
import ProfileOrders from "@/components/profile/ProfileOrders";
import ProfileWishlist from "@/components/profile/ProfileWishlist";
import ProfileSettings from "@/components/profile/ProfileSettings";
import ProfileProducts from "@/components/profile/ProfileProducts";
import ProfileDashboard from "@/components/profile/ProfileDashboard";
import ProfileAnalytics from "@/components/profile/ProfileAnalytics";
import { Navigate, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState<"buyer" | "seller">("buyer");
  const [profileData, setProfileData] = useState<any>(null);
  const [sellerData, setSellerData] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/auth");
      return;
    }

    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        // Fetch profile data with seller information
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*, sellers(*)")
          .eq("id", user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast.error("Could not load profile data");
        } else {
          setProfileData(profile);
          // Set seller data if it exists
          if (profile?.sellers) {
            setSellerData(profile.sellers);
          }
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error(error);
    }
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userInitials = user.email ? user.email.substring(0, 2).toUpperCase() : "U";
  
  // Different info based on view mode
  const userName = viewMode === "seller" && sellerData 
    ? sellerData.name 
    : (profileData?.username || user.email?.split("@")[0] || "User");
    
  const displayImage = viewMode === "seller" && sellerData 
    ? sellerData.image_url 
    : (profileData?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`);
    
  const displayBio = viewMode === "seller" && sellerData 
    ? sellerData.description 
    : (profileData?.bio || "No bio yet");
  
  return (
    <div className="min-h-screen bg-background">
      {/* View Mode Switcher - Top */}
      <div className="border-b bg-background sticky top-0 z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="bg-muted p-1 rounded-full flex">
              <Button
                variant={viewMode === "buyer" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("buyer")}
                className="rounded-full px-4 py-2 text-xs font-medium transition-all"
              >
                <ShoppingCart className="h-3 w-3 mr-1.5" />
                Buyer
              </Button>
              <Button
                variant={viewMode === "seller" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("seller")}
                className="rounded-full px-4 py-2 text-xs font-medium transition-all"
              >
                <Store className="h-3 w-3 mr-1.5" />
                Seller
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header - Simplified */}
      <div className="px-4 py-6 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-border">
            <AvatarImage src={displayImage} alt={userName} />
            <AvatarFallback className="bg-muted text-foreground font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold truncate">{userName}</h1>
              {viewMode === "seller" && sellerData?.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate mb-2">{user.email}</p>
            <p className="text-sm text-foreground line-clamp-2">{displayBio}</p>
          </div>
          
          <div className="flex gap-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                </SheetHeader>
                <ProfileSettings user={user} profile={profileData} />
              </SheetContent>
            </Sheet>
            
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Mobile First */}
      <div className="px-4 py-4">
        {viewMode === "buyer" ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center text-center">
              <ShoppingBag className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">23</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center text-center">
              <Heart className="h-5 w-5 text-red-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">56</p>
              <p className="text-xs text-muted-foreground">Wishlist</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center text-center">
              <Star className="h-5 w-5 text-amber-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">4.8</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center text-center">
              <Package className="h-5 w-5 text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-xs text-muted-foreground">Returns</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center text-center">
              <Store className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Products</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center text-center">
              <ShoppingBag className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">89</p>
              <p className="text-xs text-muted-foreground">Sales</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center text-center">
              <Star className="h-5 w-5 text-amber-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">4.8</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center text-center">
              <Package className="h-5 w-5 text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">$2.4k</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {viewMode === "buyer" ? (
            <TabsList className="w-full grid grid-cols-3 h-10 bg-muted/30 rounded-lg p-1">
              <TabsTrigger value="dashboard" className="text-xs font-medium">Dashboard</TabsTrigger>
              <TabsTrigger value="orders" className="text-xs font-medium">Orders</TabsTrigger>
              <TabsTrigger value="wishlist" className="text-xs font-medium">Wishlist</TabsTrigger>
            </TabsList>
          ) : (
            <TabsList className="w-full grid grid-cols-3 h-10 bg-muted/30 rounded-lg p-1">
              <TabsTrigger value="dashboard" className="text-xs font-medium">Dashboard</TabsTrigger>
              <TabsTrigger value="products" className="text-xs font-medium">Products</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs font-medium">Analytics</TabsTrigger>
            </TabsList>
          )}
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard" className="mt-0">
            <ProfileDashboard user={user} profile={profileData} />
          </TabsContent>
          
          {viewMode === "buyer" && (
            <>
              <TabsContent value="orders" className="mt-0">
                <ProfileOrders user={user} />
              </TabsContent>
              
              <TabsContent value="wishlist" className="mt-0">
                <ProfileWishlist user={user} />
              </TabsContent>
            </>
          )}
          
          {viewMode === "seller" && (
            <>
              <TabsContent value="products" className="mt-0">
                <ProfileProducts user={user} />
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-0">
                <ProfileAnalytics user={user} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}