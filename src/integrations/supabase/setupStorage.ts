
import { supabase } from "./client";

/**
 * Sets up storage buckets for the application if they don't exist
 */
export const setupStorageBuckets = async () => {
  try {
    console.log('Setting up storage buckets...');
    
    // Check if the needed buckets already exist
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets();
    
    if (error) {
      console.error('Error checking buckets:', error);
      return;
    }
    
    if (!buckets) {
      console.error('No buckets returned from Supabase');
      return;
    }
    
    console.log('Available buckets:', buckets.map(b => b.name));
    
    // Check for hero-banners bucket and create it if it doesn't exist
    const heroBannersBucketExists = buckets.some(bucket => bucket.name === 'hero-banners');
    
    if (!heroBannersBucketExists) {
      console.log('Hero banners bucket does not exist, creating it...');
      // Check if the user is authenticated (needed for creating buckets)
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        console.log('User is not authenticated. Skipping bucket creation.');
        return;
      }
      
      const { error: createError } = await supabase
        .storage
        .createBucket('hero-banners', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      
      if (createError) {
        console.error('Error creating hero-banners bucket:', createError);
        console.log('Note: You may need to enable bucket creation in your Supabase RLS policies');
      } else {
        console.log('Successfully created hero-banners bucket');
      }
    } else {
      console.log('Hero banners bucket already exists');
      
      // Update bucket to be public if it exists
      try {
        const { error: updateError } = await supabase
          .storage
          .updateBucket('hero-banners', {
            public: true,
          });
        
        if (!updateError) {
          console.log('Updated hero-banners bucket to be public');
        }
      } catch (e) {
        console.error('Failed to update hero-banners bucket visibility:', e);
      }
    }
    
    // Check for product-images bucket and create it if it doesn't exist
    const productImagesBucketExists = buckets.some(bucket => bucket.name === 'product-images');
    
    if (!productImagesBucketExists) {
      console.log('Product images bucket does not exist, creating it...');
      // Check if the user is authenticated (needed for creating buckets)
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        console.log('User is not authenticated. Skipping bucket creation.');
        return;
      }
      
      const { error: createError } = await supabase
        .storage
        .createBucket('product-images', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      
      if (createError) {
        console.error('Error creating product-images bucket:', createError);
        console.log('Note: You may need to enable bucket creation in your Supabase RLS policies');
      } else {
        console.log('Successfully created product-images bucket');
      }
    } else {
      console.log('Product images bucket already exists');
      
      // Update bucket to be public if it exists
      try {
        const { error: updateError } = await supabase
          .storage
          .updateBucket('product-images', {
            public: true,
          });
        
        if (!updateError) {
          console.log('Updated product-images bucket to be public');
        }
      } catch (e) {
        console.error('Failed to update product-images bucket visibility:', e);
      }
    }
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
  }
};

// Helper function to generate public URL for a storage item
export const getPublicUrl = (bucket: string, path: string): string => {
  if (!path) {
    console.error('Empty path provided to getPublicUrl');
    return '';
  }
  
  console.log(`Getting public URL for ${bucket}/${path}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  console.log(`Public URL result:`, data);
  return data.publicUrl;
};