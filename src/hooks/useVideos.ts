import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  views: number;
  likes: number;
  user_id?: string;
  username: string;
  avatar_url?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export const useVideos = (limit?: number) => {
  return useQuery({
    queryKey: ['videos', limit],
    queryFn: async () => {
      let query = supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching videos:', error);
        throw error;
      }
      
      // Filter to only show videos from the storage bucket
      const bucketVideos = data?.filter(video => 
        video.video_url.includes('wkfzhcszhgewkvwukzes.supabase.co/storage/v1/object/public/videos')
      ) || [];
      
      return bucketVideos as Video[];
    },
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching video:', error);
        throw error;
      }
      
      return data as Video;
    },
  });
};