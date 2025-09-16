import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, MoreHorizontal, Star, Reply, ThumbsUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';

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

interface CommentItemProps {
  comment: Comment;
  onLike: (id: string) => void;
  onHelpful: (id: string) => void;
  onReply: (id: string) => void;
  onImageClick: (images: string[], index: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike,
  onHelpful,
  onReply,
  onImageClick
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    );
  };

  const shouldTruncateContent = comment.content.length > 200;
  const displayContent = shouldTruncateContent && !showFullContent 
    ? comment.content.substring(0, 200) + '...' 
    : comment.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border-b border-border/50"
    >
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-start space-x-3 mb-3">
          <Avatar className="h-9 w-9 ring-1 ring-border">
            <AvatarImage src={comment.userAvatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {comment.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-foreground text-sm truncate">
                {comment.userName}
              </span>
              {comment.verified && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                  ✓
                </Badge>
              )}
              {comment.rating && (
                <div className="flex items-center space-x-1">
                  {renderStars(comment.rating)}
                </div>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
          </div>
          <Button variant="ghost" size="sm" className="p-1 h-auto opacity-60 hover:opacity-100">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Comment Content */}
        <div className="ml-12 space-y-3">
          <div>
            <p className="text-sm text-foreground leading-relaxed">
              {displayContent}
            </p>
            {shouldTruncateContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullContent(!showFullContent)}
                className="p-0 h-auto text-xs text-primary mt-1"
              >
                {showFullContent ? 'Show less' : 'Read more'}
              </Button>
            )}
          </div>

          {/* Comment Images */}
          {comment.images && comment.images.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto">
              {comment.images.map((image, idx) => (
                <motion.img
                  key={idx}
                  src={image}
                  alt="Comment"
                  className="h-20 w-20 object-cover rounded-lg border border-border cursor-pointer flex-shrink-0 hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onImageClick(comment.images!, idx)}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-4">
              <motion.button
                className={`flex items-center space-x-1 text-xs transition-colors ${
                  comment.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                }`}
                onClick={() => onLike(comment.id)}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-red-500' : ''}`} />
                <span>{comment.likes}</span>
              </motion.button>
              
              <motion.button
                className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                onClick={() => onReply(comment.id)}
                whileTap={{ scale: 0.95 }}
              >
                <Reply className="h-4 w-4" />
                <span>{comment.replies}</span>
              </motion.button>
              
              <motion.button
                className={`flex items-center space-x-1 text-xs transition-colors ${
                  comment.isHelpful ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500'
                }`}
                onClick={() => onHelpful(comment.id)}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsUp className={`h-4 w-4 ${comment.isHelpful ? 'fill-blue-500' : ''}`} />
                <span>{comment.helpful}</span>
              </motion.button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-xs text-muted-foreground hover:text-primary"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentItem;