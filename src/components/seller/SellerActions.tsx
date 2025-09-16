import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerActionsProps {
  isFollowing: boolean;
  onFollow: () => void;
  onContact: () => void;
}

const SellerActions: React.FC<SellerActionsProps> = ({
  isFollowing,
  onFollow,
  onContact
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        onClick={onFollow}
        variant={isFollowing ? "outline" : "default"}
        className="flex-1"
      >
        <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
      <Button onClick={onContact} variant="outline" className="flex-1">
        <MessageCircle className="w-4 h-4 mr-2" />
        Contact
      </Button>
    </div>
  );
};

export default SellerActions;