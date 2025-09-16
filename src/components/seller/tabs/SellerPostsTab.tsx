import React from 'react';
import { Image, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerPostsTabProps {
  onCreatePost?: () => void;
}

const SellerPostsTab: React.FC<SellerPostsTabProps> = ({ onCreatePost }) => {
  // Mock posts data - replace with real data when available
  const posts: any[] = [];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 bg-white rounded-lg p-4 border border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Posts</h2>
          <p className="text-sm text-gray-600">Share updates, announcements, and photos with followers</p>
        </div>
        <Button
          onClick={onCreatePost}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {/* Posts Content */}
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-100">
              {/* Post content will go here */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Image className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
          <p className="text-gray-500 mb-4">Share updates and connect with your customers</p>
          <Button onClick={onCreatePost} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerPostsTab;