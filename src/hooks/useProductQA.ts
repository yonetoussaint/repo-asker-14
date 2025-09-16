import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QAItem {
  id: string;
  question: string;
  answer: string | null;
  asked_by: string;
  answered_by: string | null;
  ask_date: string;
  answer_date: string | null;
  helpful_count: number;
  question_likes: number;
}

export interface Seller {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  trust_score: number;
}

export const useProductQA = (productId: string) => {
  const [qaItems, setQaItems] = useState<QAItem[]>([]);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQAItems = async () => {
    try {
      setIsLoading(true);
      
      // Fetch Q&A items
      const { data: qaData, error: qaError } = await supabase
        .from('questions_answers')
        .select('*')
        .eq('product_id', productId)
        .order('ask_date', { ascending: false });

      if (qaError) throw qaError;
      
      // Fetch seller information for the product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          sellers (
            id,
            name,
            verified,
            rating,
            trust_score
          )
        `)
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      
      setQaItems(qaData || []);
      setSeller(productData?.sellers || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Q&A data');
    } finally {
      setIsLoading(false);
    }
  };

  const incrementHelpful = async (qaId: string) => {
    try {
      // Get current item
      const currentItem = qaItems.find(item => item.id === qaId);
      if (!currentItem) return;

      const { error } = await supabase
        .from('questions_answers')
        .update({ helpful_count: currentItem.helpful_count + 1 })
        .eq('id', qaId);

      if (error) throw error;
      
      // Update local state
      setQaItems(prev => prev.map(item => 
        item.id === qaId 
          ? { ...item, helpful_count: item.helpful_count + 1 }
          : item
      ));
    } catch (err) {
      console.error('Failed to increment helpful count:', err);
    }
  };

  const incrementQuestionLikes = async (qaId: string) => {
    try {
      // Get current item
      const currentItem = qaItems.find(item => item.id === qaId);
      if (!currentItem) return;

      const { error } = await supabase
        .from('questions_answers')
        .update({ question_likes: currentItem.question_likes + 1 })
        .eq('id', qaId);

      if (error) throw error;
      
      // Update local state
      setQaItems(prev => prev.map(item => 
        item.id === qaId 
          ? { ...item, question_likes: item.question_likes + 1 }
          : item
      ));
    } catch (err) {
      console.error('Failed to increment question likes:', err);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchQAItems();
    }
  }, [productId]);

  return {
    qaItems,
    seller,
    isLoading,
    error,
    refetch: fetchQAItems,
    incrementHelpful,
    incrementQuestionLikes
  };
};