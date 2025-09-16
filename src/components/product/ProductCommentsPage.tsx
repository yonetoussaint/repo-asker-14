import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from 'sonner';
import CommentHeader from './comments/CommentHeader';
import CommentFilters, { FilterType, SortType } from './comments/CommentFilters';
import CommentItem from './comments/CommentItem';
import CommentInput from './comments/CommentInput';

interface Comment {
  id: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  verified: boolean;
  images?: string[];
  rating?: number;
  helpful: number;
  isHelpful?: boolean;
}

interface ProductCommentsPageProps {
  onClose: () => void;
  productName?: string;
}

const ProductCommentsPage: React.FC<ProductCommentsPageProps> = ({ 
  onClose, 
  productName = "Product" 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userName: 'Sarah Chen',
      userAvatar: '/placeholder.svg',
      content: 'Amazing product! The quality exceeded my expectations. Fast shipping and exactly as described. The material feels premium and the packaging was excellent. I will definitely order again! 🔥',
      timestamp: '2 hours ago',
      likes: 24,
      replies: 3,
      isLiked: false,
      verified: true,
      rating: 5,
      images: ['/placeholder.svg', '/placeholder.svg'],
      helpful: 18,
      isHelpful: false
    },
    {
      id: '2',
      userName: 'Mike Rodriguez',
      content: 'Good value for money. The material feels premium and the packaging was excellent. Took about 10 days to arrive but worth the wait.',
      timestamp: '5 hours ago',
      likes: 12,
      replies: 1,
      isLiked: true,
      verified: false,
      rating: 4,
      helpful: 8,
      isHelpful: true
    },
    {
      id: '3',
      userName: 'Emma Liu',
      userAvatar: '/placeholder.svg',
      content: 'Perfect fit! Love the color and design. Customer service was also very helpful when I had questions. Highly recommend this seller.',
      timestamp: '1 day ago',
      likes: 18,
      replies: 2,
      isLiked: false,
      verified: true,
      rating: 5,
      helpful: 14,
      isHelpful: false
    },
    {
      id: '4',
      userName: 'Alex Thompson',
      content: 'The product arrived earlier than expected and the quality is fantastic. Great communication from the seller throughout the process.',
      timestamp: '2 days ago',
      likes: 9,
      replies: 0,
      isLiked: false,
      verified: true,
      rating: 5,
      images: ['/placeholder.svg'],
      helpful: 6,
      isHelpful: false
    },
    {
      id: '5',
      userName: 'Jessica Wang',
      content: 'Decent product for the price. Shipping was a bit slow but the item matches the description perfectly.',
      timestamp: '3 days ago',
      likes: 5,
      replies: 0,
      isLiked: false,
      verified: false,
      rating: 3,
      helpful: 3,
      isHelpful: false
    }
  ]);

  // Filter and sort comments
  const filteredAndSortedComments = useMemo(() => {
    let filtered = comments;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(comment =>
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (activeFilter) {
      case 'photos':
        filtered = filtered.filter(comment => comment.images && comment.images.length > 0);
        break;
      case 'high-rated':
        filtered = filtered.filter(comment => comment.rating === 5);
        break;
      case 'helpful':
        filtered = filtered.filter(comment => comment.helpful > 10);
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered = [...filtered].reverse();
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'helpful':
        filtered = [...filtered].sort((a, b) => b.helpful - a.helpful);
        break;
      default: // newest
        break;
    }

    return filtered;
  }, [comments, searchQuery, activeFilter, sortBy]);

  // Calculate filter counts
  const filterCounts = useMemo(() => ({
    all: comments.length,
    photos: comments.filter(c => c.images && c.images.length > 0).length,
    highRated: comments.filter(c => c.rating === 5).length,
    recent: comments.filter(c => {
      const hours = parseInt(c.timestamp);
      return !isNaN(hours) && hours <= 24;
    }).length,
    helpful: comments.filter(c => c.helpful > 10).length
  }), [comments]);

  // Handlers
  const handleLike = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleHelpful = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            isHelpful: !comment.isHelpful,
            helpful: comment.isHelpful ? comment.helpful - 1 : comment.helpful + 1
          }
        : comment
    ));
    toast.success("Thanks for your feedback!");
  };

  const handleReply = (commentId: string) => {
    toast.info("Reply feature coming soon!");
  };

  const handleImageClick = (images: string[], index: number) => {
    // Open image gallery/lightbox
    toast.info("Image gallery feature coming soon!");
  };

  const handleSubmitComment = async (content: string, images?: File[]) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userName: 'You',
      content,
      timestamp: 'Just now',
      likes: 0,
      replies: 0,
      isLiked: false,
      verified: false,
      rating: 5,
      helpful: 0,
      isHelpful: false,
      images: images?.map(file => URL.createObjectURL(file))
    };

    setComments(prev => [newComment, ...prev]);
    toast.success("Comment posted successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      <CommentHeader
        onClose={onClose}
        productName={productName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
        totalComments={comments.length}
      />

      <CommentFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        counts={filterCounts}
        show={showFilters}
      />

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto pb-24">
        {filteredAndSortedComments.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No comments found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search' : 'Be the first to comment!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {filteredAndSortedComments.map((comment, index) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={handleLike}
                onHelpful={handleHelpful}
                onReply={handleReply}
                onImageClick={handleImageClick}
              />
            ))}
          </div>
        )}
      </div>

      <CommentInput
        onSubmit={handleSubmitComment}
        placeholder="Share your experience..."
      />
    </motion.div>
  );
};

export default ProductCommentsPage;