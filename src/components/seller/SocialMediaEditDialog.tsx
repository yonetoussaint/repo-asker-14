import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Save, Loader2, Instagram, Facebook, Twitter, Youtube, Linkedin, Globe, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface SocialLink {
  platform: string;
  url: string;
  username: string;
}

interface SocialMediaEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellerId: string;
  currentLinks: SocialLink[];
  onSuccess: () => void;
}

const SOCIAL_PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'website', label: 'Website', icon: Globe },
  { value: 'other', label: 'Other', icon: ExternalLink }
];

export const SocialMediaEditDialog: React.FC<SocialMediaEditDialogProps> = ({
  open,
  onOpenChange,
  sellerId,
  currentLinks,
  onSuccess
}) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState({
    platform: '',
    url: '',
    username: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (open && currentLinks) {
      setSocialLinks([...currentLinks]);
    }
  }, [open, currentLinks]);

  const handleAddLink = () => {
    if (!newLink.platform || !newLink.url.trim()) {
      toast.error('Please select a platform and enter a URL');
      return;
    }

    // Check if platform already exists
    if (socialLinks.find(link => link.platform === newLink.platform)) {
      toast.error('This platform is already added');
      return;
    }

    // Auto-generate username from URL if not provided
    let username = newLink.username.trim();
    if (!username) {
      try {
        const url = new URL(newLink.url);
        const pathParts = url.pathname.split('/').filter(part => part);
        username = pathParts[0] || url.hostname;
        
        // Clean up common social media URL patterns
        if (newLink.platform === 'instagram' && username.startsWith('@')) {
          username = username;
        } else if (newLink.platform === 'instagram') {
          username = `@${username}`;
        } else if (newLink.platform === 'website') {
          username = url.hostname.replace('www.', '');
        }
      } catch (e) {
        username = newLink.url;
      }
    }

    setSocialLinks(prev => [...prev, {
      platform: newLink.platform,
      url: newLink.url.trim(),
      username: username
    }]);

    setNewLink({ platform: '', url: '', username: '' });
    toast.success('Social link added');
  };

  const handleRemoveLink = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
    toast.success('Social link removed');
  };

  const handleUpdateLink = (index: number, field: keyof SocialLink, value: string) => {
    setSocialLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all URLs
    const invalidLinks = socialLinks.filter(link => !validateUrl(link.url));
    if (invalidLinks.length > 0) {
      toast.error('Please check all URLs are valid');
      return;
    }

    setIsUpdating(true);

    try {
      // Here you would typically save to your backend/database
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Social media links updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating social links:', error);
      toast.error('Failed to update social media links');
    } finally {
      setIsUpdating(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    const platformData = SOCIAL_PLATFORMS.find(p => p.value === platform);
    if (platformData) {
      const IconComponent = platformData.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <ExternalLink className="w-4 h-4" />;
  };

  const getPlatformBaseUrl = (platform: string): string => {
    switch (platform) {
      case 'instagram': return 'https://instagram.com/';
      case 'facebook': return 'https://facebook.com/';
      case 'twitter': return 'https://twitter.com/';
      case 'youtube': return 'https://youtube.com/';
      case 'linkedin': return 'https://linkedin.com/in/';
      default: return 'https://';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Manage Social Media Links
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Existing Links */}
          {socialLinks.length > 0 && (
            <div className="space-y-3">
              <Label>Current Social Media Links</Label>
              {socialLinks.map((link, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getSocialIcon(link.platform)}
                    <Badge variant="outline" className="capitalize">
                      {link.platform}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Display name/username"
                      value={link.username}
                      onChange={(e) => handleUpdateLink(index, 'username', e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLink(index)}
                    className="flex-shrink-0 text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Link */}
          <div className="space-y-4 border-t pt-4">
            <Label>Add New Social Media Link</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={newLink.platform}
                  onValueChange={(value) => setNewLink(prev => ({ 
                    ...prev, 
                    platform: value,
                    url: prev.url || getPlatformBaseUrl(value)
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          <platform.icon className="w-4 h-4" />
                          {platform.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Display Name</Label>
                <Input
                  id="username"
                  placeholder="@username or display name"
                  value={newLink.username}
                  onChange={(e) => setNewLink(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://..."
                  value={newLink.url}
                  onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddLink}
              className="w-full flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Social Link
            </Button>
          </div>

          {/* Platform Suggestions */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Platform URL Examples:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Instagram: https://instagram.com/yourusername</div>
              <div>• Facebook: https://facebook.com/yourpage</div>
              <div>• Twitter: https://twitter.com/yourusername</div>
              <div>• YouTube: https://youtube.com/c/yourchannel</div>
              <div>• Website: https://yourwebsite.com</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="flex-1 flex items-center gap-2"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};