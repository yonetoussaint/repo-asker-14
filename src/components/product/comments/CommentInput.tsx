import React, { useState } from 'react';
import { Send, Image, Smile, Camera, Video, Mic, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from 'framer-motion';

interface CommentInputProps {
  onSubmit: (content: string, images?: File[]) => void;
  placeholder?: string;
  userAvatar?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = "Write a comment...",
  userAvatar
}) => {
  const [comment, setComment] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim() && selectedImages.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(comment, selectedImages);
      setComment('');
      setSelectedImages([]);
      setShowAttachments(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 3)); // Max 3 images
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="p-4 space-y-3">
        {/* Selected Images Preview */}
        <AnimatePresence>
          {selectedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex space-x-2 overflow-x-auto"
            >
              {selectedImages.map((file, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded-lg border border-border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Input */}
        <div className="flex items-end space-x-3">
          <Avatar className="h-8 w-8 ring-1 ring-border">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              You
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <div className="relative">
              <Input
                placeholder={placeholder}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="pr-20 min-h-[44px] bg-muted/30 border-0 focus:bg-background transition-colors"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                disabled={isSubmitting}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 h-auto opacity-60 hover:opacity-100"
                  onClick={() => setShowAttachments(!showAttachments)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1.5 h-auto opacity-60 hover:opacity-100"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Attachment Options */}
            <AnimatePresence>
              {showAttachments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="image-upload"
                    onChange={handleImageSelect}
                  />
                  <label htmlFor="image-upload">
                    <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                      <span className="cursor-pointer">
                        <Image className="h-3 w-3 mr-1" />
                        Photo
                      </span>
                    </Button>
                  </label>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Video className="h-3 w-3 mr-1" />
                    Video
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Mic className="h-3 w-3 mr-1" />
                    Voice
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={(!comment.trim() && selectedImages.length === 0) || isSubmitting}
            className="h-11 px-4 bg-primary hover:bg-primary/90 transition-colors"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Send className="h-4 w-4" />
              </motion.div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;