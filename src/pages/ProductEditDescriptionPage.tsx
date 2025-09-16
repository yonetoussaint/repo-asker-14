import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProduct';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProductEditDescriptionPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(productId || '');
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product?.description) {
      setDescription(product.description);
    }
  }, [product]);

  const handleSave = async () => {
    if (!productId) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ description })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Description updated successfully",
      });

      navigate(-1);
    } catch (error) {
      console.error('Error updating description:', error);
      toast({
        title: "Error",
        description: "Failed to update description",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Edit Description</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleCancel} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px' }}>
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter product description..."
        style={{ 
          width: '100%', 
          minHeight: '300px', 
          padding: '12px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          fontSize: '16px',
          lineHeight: '1.5'
        }}
      />
    </div>
  );
};

export default ProductEditDescriptionPage;