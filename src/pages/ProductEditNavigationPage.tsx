import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useProduct } from '@/hooks/useProduct';

const ProductEditNavigationPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(productId || '');

  const categories = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Name, price, and inventory',
      icon: '📝'
    },
    {
      id: 'description',
      title: 'Product Description',
      description: 'Detailed product description and features',
      icon: '📄'
    },
    {
      id: 'category',
      title: 'Category & Type',
      description: 'Product category and type settings',
      icon: '🏷️'
    },
    {
      id: 'media',
      title: 'Media',
      description: 'Images, videos, and 3D models',
      icon: '📸'
    },
    {
      id: 'shipping',
      title: 'Shipping',
      description: 'Dimensions, weight, and shipping options',
      icon: '📦'
    },
    {
      id: 'deals',
      title: 'Flash Deals',
      description: 'Promotional offers and discounts',
      icon: '⚡'
    },
    {
      id: 'specifications',
      title: 'Specifications',
      description: 'Technical details and features',
      icon: '🔧'
    },
    {
      id: 'variants',
      title: 'Color Variants',
      description: 'Color options and variations',
      icon: '🎨'
    },
    {
      id: 'storage',
      title: 'Storage Variants',
      description: 'Storage options and variations',
      icon: '💾'
    },
    {
      id: 'details',
      title: 'Details & Bundles',
      description: 'Tags and bundle deals',
      icon: '📋'
    }
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Product not found</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="relative flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-600 truncate max-w-xs">{product.name}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/product/${productId}/edit/${category.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{category.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductEditNavigationPage;