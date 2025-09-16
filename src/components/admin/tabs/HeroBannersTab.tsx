
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, ArrowUp, ArrowDown, Image } from "lucide-react";
import { 
  fetchHeroBanners, 
  deleteHeroBanner, 
  updateHeroBannerPosition 
} from "@/integrations/supabase/hero";
import HeroBannerUploadDialog from "@/components/admin/dialogs/HeroBannerUploadDialog";

const HeroBannersTab: React.FC = () => {
  const [isHeroUploadDialogOpen, setIsHeroUploadDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch hero banners with a shorter staleTime for testing
  const { data: heroBanners = [], isLoading, error, refetch } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: fetchHeroBanners,
    staleTime: 5000, // 5 seconds for testing
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
    toast.success("Data refreshed");
  };

  const handleDeleteHeroBanner = async (id: string, imagePath: string) => {
    try {
      // Extract just the filename if it's a full URL
      let filename = imagePath;
      if (imagePath.includes('/')) {
        try {
          const url = new URL(imagePath);
          filename = url.pathname.split('/').pop() || imagePath;
        } catch (e) {
          // If not a valid URL, try to extract the filename from the path
          filename = imagePath.split('/').pop() || imagePath;
        }
      }

      console.log(`Deleting banner ${id} with image: ${filename}`);

      // Delete from database
      await deleteHeroBanner(id);

      try {
        // Try to delete from storage
        await supabase.storage
          .from('hero-banners')
          .remove([filename]);
        console.log(`Deleted file ${filename} from storage`);
      } catch (storageError) {
        console.warn('Could not delete from storage:', storageError);
      }

      queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
      toast.success("Hero banner deleted successfully");
    } catch (error) {
      console.error('Error deleting hero banner:', error);
      toast.error("There was an error deleting the hero banner.");
    }
  };

  const handleMoveHeroBanner = async (id: string, currentPosition: number, direction: 'up' | 'down') => {
    const sortedBanners = [...heroBanners].sort((a, b) => (a.position || 0) - (b.position || 0));
    const currentIndex = sortedBanners.findIndex(banner => banner.id === id);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= sortedBanners.length) return;
    
    const otherBanner = sortedBanners[newIndex];
    const otherPosition = otherBanner.position || 0;
    
    try {
      await Promise.all([
        updateHeroBannerPosition(id, otherPosition),
        updateHeroBannerPosition(otherBanner.id, currentPosition)
      ]);
      
      queryClient.invalidateQueries({ queryKey: ["hero-banners"] });
      toast.success("Banner position updated successfully");
    } catch (error) {
      console.error('Error updating banner position:', error);
      toast.error("There was an error updating the banner position.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
        <div className="h-64 w-full bg-muted animate-pulse rounded-md"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-red-500">Error loading hero banners</p>
          <Button onClick={() => refetch()} className="mt-4">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  const sortedBanners = [...heroBanners].sort((a, b) => (a.position || 0) - (b.position || 0));
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Hero Banners</h2>
            <p className="text-sm text-gray-500">Manage the banners shown in the homepage hero section</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefreshData}>
              Refresh Data
            </Button>
            <Button onClick={() => setIsHeroUploadDialogOpen(true)}>
              Add Banner
            </Button>
          </div>
        </div>
        
        {sortedBanners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBanners.map((banner, index) => (
              <Card key={banner.id} className="overflow-hidden border-gray-200">
                <div className="aspect-[16/9] relative">
                  {banner.image ? (
                    <img 
                      src={banner.image} 
                      alt={banner.alt} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${banner.image}`);
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Image className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                    Position: {banner.position || index}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium text-sm truncate">{banner.alt}</h3>
                    <p className="text-xs text-gray-500 truncate mt-1">{banner.image}</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMoveHeroBanner(banner.id, banner.position || 0, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4 mr-1" />
                        Move Up
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMoveHeroBanner(banner.id, banner.position || 0, 'down')}
                        disabled={index === sortedBanners.length - 1}
                      >
                        <ArrowDown className="h-4 w-4 mr-1" />
                        Move Down
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteHeroBanner(banner.id, banner.image)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No hero banners yet</h3>
              <p className="text-muted-foreground text-center mt-1 max-w-sm mb-4">
                Add some banners to display on your homepage hero slider
              </p>
              <Button onClick={() => setIsHeroUploadDialogOpen(true)}>
                Add Your First Banner
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <HeroBannerUploadDialog 
        open={isHeroUploadDialogOpen} 
        onOpenChange={setIsHeroUploadDialogOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["hero-banners"] })}
      />
    </div>
  );
};

export default HeroBannersTab;
