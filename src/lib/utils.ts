// utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from '@/integrations/supabase/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Type utility to help work around type comparison issues
export function safelyCompareStrings<T extends string, U extends string>(a: T, b: U): boolean {
  return a === b as unknown as T;
}

// New utility functions added
export const getSellerLogoUrl = (imagePath?: string): string => {
  if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face";
  const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
  return data.publicUrl;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });
};