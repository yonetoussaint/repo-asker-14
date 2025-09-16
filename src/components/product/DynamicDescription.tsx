import React, { useState, useMemo } from 'react';
import { formatDescription } from '@/utils/formatDescription';

interface DynamicDescriptionProps {
  content: string;
  className?: string;
  product?: any; // Add product data prop
}

const DynamicDescription: React.FC<DynamicDescriptionProps> = ({ content, className = '', product }) => {
  const [error, setError] = useState<string | null>(null);

  const processedContent = useMemo(() => {
    if (!content) return { type: 'empty', content: '' };

    // Clean up the content by removing HTML font tags and extracting text
    const cleanedContent = content
      .replace(/<\/?font[^>]*>/g, '') // Remove font tags
      .replace(/<div>/g, '\n\n') // Replace div with double newlines for paragraphs
      .replace(/<\/div>/g, '') // Remove closing divs
      .replace(/<p>/g, '') // Remove opening p tags
      .replace(/<\/p>/g, '\n\n') // Replace closing p tags with double newlines
      .replace(/<br\s*\/?>/g, '\n') // Replace br with single newlines
      .replace(/&nbsp;/g, ' ') // Replace nbsp with spaces
      .replace(/&gt;/g, '>') // Replace HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&')
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .trim();

    // Check if it's React component code
    if (cleanedContent.includes('import React') || 
        cleanedContent.includes('const ') && cleanedContent.includes('useState') ||
        cleanedContent.includes('function ') && cleanedContent.includes('return (')) {
      return { type: 'react', content: cleanedContent };
    }

    // Check if it's HTML content
    if (cleanedContent.includes('<') && cleanedContent.includes('>') && 
        (cleanedContent.includes('<div') || cleanedContent.includes('<p') || 
         cleanedContent.includes('<span') || cleanedContent.includes('<img'))) {
      return { type: 'html', content: cleanedContent };
    }

    // Default to plain text
    return { type: 'text', content: cleanedContent };
  }, [content]);

  const renderReactComponent = (code: string) => {
    try {
      // Only use real product data if available
      const realData = product ? {
        colorGallery: product.product_images?.slice(0, 6).map((img: any, index: number) => ({
          image: img.src,
          alt: img.alt || `${product.name} - Color variant ${index + 1}`,
          color: ['White', 'Black', 'Blue', 'Yellow', 'Coral', '(PRODUCT)RED'][index] || `Color ${index + 1}`
        })) || [],
        portraitGallery: product.product_images?.slice(6).map((img: any) => ({
          image: img.src,
          alt: img.alt || `${product.name} - Product view`
        })) || []
      } : null;

      // Only render if we have real data
      if (!realData || realData.colorGallery.length === 0) {
        return (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-600 text-sm">Product gallery data not available</p>
          </div>
        );
      }

      // Render the iPhone gallery component with real data only
      return (
        <IPhoneXRGallery data={realData} product={product} />
      );
    } catch (err) {
      setError('Error rendering React component');
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600 text-sm">Error rendering component: {err instanceof Error ? err.message : 'Unknown error'}</p>
        </div>
      );
    }
  };

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (processedContent.type === 'empty') {
    return <div className={className}>No description available.</div>;
  }

  if (processedContent.type === 'react') {
    return (
      <div className={className}>
        {renderReactComponent(processedContent.content)}
      </div>
    );
  }

  if (processedContent.type === 'html') {
    return (
      <div 
        className={`prose prose-gray max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: processedContent.content }}
      />
    );
  }

  // Default to formatted text
  return (
    <div 
      className={`prose prose-gray max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: formatDescription(processedContent.content) }}
    />
  );
};

// Simplified iPhone XR Gallery Component
const IPhoneXRGallery: React.FC<{ data: any; product?: any }> = ({ data, product }) => {
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [currentPortraitIndex, setCurrentPortraitIndex] = useState(0);

  return (
    <div className="space-y-8">
      {/* Color Gallery */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{product?.name || 'iPhone XR'} Colors</h3>
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={data.colorGallery[currentGalleryIndex]?.image}
              alt={data.colorGallery[currentGalleryIndex]?.alt}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute inset-y-0 left-2 flex items-center">
            <button 
              onClick={() => setCurrentGalleryIndex(prev => 
                prev === 0 ? data.colorGallery.length - 1 : prev - 1
              )}
              className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
            >
              ←
            </button>
          </div>
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button 
              onClick={() => setCurrentGalleryIndex(prev => 
                prev === data.colorGallery.length - 1 ? 0 : prev + 1
              )}
              className="p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
            >
              →
            </button>
          </div>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-medium">{data.colorGallery[currentGalleryIndex]?.color}</h4>
        </div>
        <div className="flex justify-center gap-2">
          {data.colorGallery.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGalleryIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentGalleryIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Portrait Gallery */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Product Views</h3>
        <div className="grid grid-cols-2 gap-4">
          {data.portraitGallery.map((item, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Features - only show if product has specifications */}
      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">Key Features</h4>
            <ul className="space-y-2 text-gray-700">
              {product.specifications?.map((spec: any, index: number) => (
                <li key={index}>• {spec.name}: {spec.value}</li>
              )) || (
                <li className="text-gray-500 italic">No specifications available</li>
              )}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">Product Details</h4>
            <ul className="space-y-2 text-gray-700">
              {product.category && <li>• Category: {product.category}</li>}
              {product.brand && <li>• Brand: {product.brand}</li>}
              {product.model && <li>• Model: {product.model}</li>}
              {product.condition && <li>• Condition: {product.condition}</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicDescription;