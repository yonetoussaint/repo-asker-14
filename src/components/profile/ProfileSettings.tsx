
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, User } from "lucide-react";

interface ProfileSettingsProps {
  user: any;
  profile: any;
}

export default function ProfileSettings({ user, profile }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    fullName: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
    address: profile?.address || "",
    avatarUrl: profile?.avatar_url || user?.user_metadata?.avatar_url || "",
    emailNotifications: profile?.email_notifications !== false,
    pushNotifications: profile?.push_notifications !== false,
    marketingEmails: profile?.marketing_emails !== false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `avatars/${user.id}/${fileName}`;
    
    try {
      setIsLoading(true);
      
      // For demonstration purposes - in a real app, upload to Supabase storage
      // const { error } = await supabase.storage
      //   .from('avatars')
      //   .upload(filePath, file);
      
      // if (error) throw error;
      
      // const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // For demo, just create an object URL
      const imageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({ ...prev, avatarUrl: imageUrl }));
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // In a real app, update the profile in Supabase
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({
      //     username: formData.username,
      //     full_name: formData.fullName,
      //     bio: formData.bio,
      //     phone: formData.phone,
      //     address: formData.address,
      //     avatar_url: formData.avatarUrl,
      //     email_notifications: formData.emailNotifications,
      //     push_notifications: formData.pushNotifications,
      //     marketing_emails: formData.marketingEmails,
      //     updated_at: new Date()
      //   })
      //   .eq('id', user.id);
      
      // if (error) throw error;
      
      // For demonstration
      setTimeout(() => {
        toast.success("Profile updated successfully");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6 py-2">
      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-lg">Account Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-white shadow-lg">
                <AvatarImage 
                  src={formData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} 
                  alt="User avatar"
                />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {user.email ? user.email.substring(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2 bg-muted hover:bg-muted/80 transition-colors rounded-md px-3 py-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload New Picture</span>
                  </div>
                  <Input 
                    id="avatar" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </Label>
                <p className="text-xs text-muted-foreground">
                  JPG, GIF or PNG. Max size 2MB.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  name="username"
                  value={formData.username} 
                  onChange={handleChange}
                  placeholder="yourusername" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  name="fullName"
                  value={formData.fullName} 
                  onChange={handleChange}
                  placeholder="Your Name" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="email@example.com" 
                  disabled 
                />
                <p className="text-xs text-muted-foreground">
                  To change your email address, please contact support.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone} 
                  onChange={handleChange}
                  placeholder="(123) 456-7890" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio"
                value={formData.bio} 
                onChange={handleChange}
                placeholder="Tell us a little about yourself" 
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                name="address"
                value={formData.address} 
                onChange={handleChange}
                placeholder="Your shipping address" 
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Separator className="my-8" />
        
        <Card className="border-none shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-lg">Notification Preferences</CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive order updates and important announcements</p>
              </div>
              <Switch 
                checked={formData.emailNotifications} 
                onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive real-time alerts on your device</p>
              </div>
              <Switch 
                checked={formData.pushNotifications} 
                onCheckedChange={(checked) => handleSwitchChange('pushNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Marketing Emails</h3>
                <p className="text-sm text-muted-foreground">Receive promotional offers and new product announcements</p>
              </div>
              <Switch 
                checked={formData.marketingEmails} 
                onCheckedChange={(checked) => handleSwitchChange('marketingEmails', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
