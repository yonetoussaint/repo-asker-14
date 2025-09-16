import { supabase } from './client';
import { getPublicUrl } from './setupStorage';

export interface HeroBanner {
  id: string;
  image: string;
  alt: string;
  position: number;
  duration?: number;
  created_at?: string;
  updated_at?: string;
}

export const fetchHeroBanners = async (): Promise<HeroBanner[]> => {
  try {
    console.log('Starting fetchHeroBanners...');
    
    // Need to explicitly type the response to avoid type errors
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('position', { ascending: true }) as { 
        data: HeroBanner[] | null; 
        error: any; 
      };
      
    if (error) {
      console.error('Error fetching hero banners:', error);
      return [];
    }

    console.log('Raw data from Supabase:', data);
    
    if (!data || data.length === 0) {
      console.log('No hero banners found in database');
      return [];
    }
    
    // Transform the data to ensure image URLs are properly formatted
    const banners = data.map(banner => {
      // Check if the image is a full URL or just a path
      let imageUrl = banner.image;
      
      console.log(`Processing banner ${banner.id} with image path: ${imageUrl}`);
      
      // If the image doesn't start with http/https or isn't a local path, assume it's a filename in the bucket
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/lovable-uploads')) {
        try {
          // Decode the URL first to avoid double encoding
          const decodedPath = decodeURIComponent(imageUrl);
          console.log(`Decoded path for ${banner.id}: ${decodedPath}`);
          
          // Get the public URL for the file in the hero-banners bucket
          const { data } = supabase.storage
            .from('hero-banners')
            .getPublicUrl(decodedPath);
          
          imageUrl = data.publicUrl;
          console.log(`Generated public URL for ${banner.id}: ${imageUrl}`);
        } catch (err) {
          console.error(`Failed to get public URL for ${banner.image}:`, err);
          // Fallback: try with original path
          try {
            const { data } = supabase.storage
              .from('hero-banners')
              .getPublicUrl(imageUrl);
            imageUrl = data.publicUrl;
          } catch (fallbackErr) {
            console.error(`Fallback failed for ${banner.image}:`, fallbackErr);
          }
        }
      }
      
      return {
        ...banner,
        image: imageUrl
      };
    });
    
    console.log('Transformed hero banners with full URLs:', banners);
    return banners;
  } catch (error) {
    console.error('Error in fetchHeroBanners:', error);
    return [];
  }
};

// Create hero banner function - without using RPC since that's causing errors
export const createHeroBanner = async (banner: { 
  image: string; 
  alt: string; 
  position: number; 
}): Promise<HeroBanner | null> => {
  try {
    console.log('Creating hero banner with data:', banner);

    // Direct insert approach since RPC is not working
    const { data, error } = await supabase
      .from('hero_banners')
      .insert({
        image: banner.image,
        alt: banner.alt,
        position: banner.position
      })
      .select()
      .single() as {
        data: HeroBanner | null;
        error: any;
      };
      
    if (error) {
      console.error('Error creating hero banner:', error);
      return null;
    }
    
    console.log('Successfully created hero banner:', data);
    return data;
  } catch (error) {
    console.error('Error in createHeroBanner:', error);
    return null;
  }
};

export const deleteHeroBanner = async (id: string): Promise<boolean> => {
  try {
    // MODIFIED: Removed auth check for demo purposes
    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id) as {
        error: any;
      };
      
    if (error) {
      console.error(`Error deleting hero banner with id ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in deleteHeroBanner for id ${id}:`, error);
    return false;
  }
};

export const updateHeroBannerPosition = async (id: string, position: number): Promise<boolean> => {
  try {
    // MODIFIED: Removed auth check for demo purposes
    const { error } = await supabase
      .from('hero_banners')
      .update({ position })
      .eq('id', id) as {
        error: any;
      };
      
    if (error) {
      console.error(`Error updating hero banner position for id ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error in updateHeroBannerPosition for id ${id}:`, error);
    return false;
  }
};

/**
 * Upload a hero banner to Supabase storage
 * @param file The file to upload
 * @param metadata Optional metadata
 * @returns A promise that resolves with the upload result
 */
export const uploadBanner = async (file: File, metadata?: Record<string, unknown>) => {
  // This is a placeholder implementation
  // You should implement the actual upload logic based on your requirements
  const result = {
    error: null,
    data: {
      path: `hero-banners/${file.name}`,
      fullPath: `https://your-supabase-url.supabase.co/storage/v1/object/public/hero-banners/${file.name}`,
    }
  };
  
  return result;
};