import React, { useState } from 'react';
import { VideoBlock as VideoBlockType } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Video, Trash2, Edit, Play } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface VideoBlockProps {
  block: VideoBlockType;
  onUpdate: (block: VideoBlockType) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const VideoBlockComponent: React.FC<VideoBlockProps> = ({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [tempUrl, setTempUrl] = useState(block.url);
  const [tempTitle, setTempTitle] = useState(block.title || '');

  const handleSave = () => {
    onUpdate({
      ...block,
      url: tempUrl,
      title: tempTitle || undefined
    });
    setShowEditDialog(false);
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/([^&\n?#]+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  const renderVideo = () => {
    if (!block.url) {
      return (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => setShowEditDialog(true)}
        >
          <div className="text-center">
            <Play className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Click to add video</p>
          </div>
        </div>
      );
    }

    const embedUrl = getEmbedUrl(block.url);
    
    return (
      <div className="text-center">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full rounded-lg"
            allowFullScreen
            title={block.title || 'Video'}
          />
        </div>
        {block.title && (
          <p className="text-sm text-gray-500 mt-2">
            {block.title}
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {renderVideo()}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="YouTube or Vimeo URL..."
              />
            </div>
            
            <div>
              <Label htmlFor="video-title">Title (optional)</Label>
              <Input
                id="video-title"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Video title..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};