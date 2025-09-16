import React from 'react';
import { Video } from '@/hooks/useVideos';

// Avatar components
const Avatar = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <div className={`relative inline-block rounded-full overflow-hidden ${className}`}>
    {children}
  </div>
);
const AvatarImage = ({ src, alt }: { src?: string; alt?: string }) => (
  <img src={src} alt={alt} className="h-full w-full object-cover" />
);
const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full w-full items-center justify-center bg-gray-500 text-white">
    {children}
  </div>
);

interface ReelsVideoInfoProps {
  video: Video;
}

export const ReelsVideoInfo: React.FC<ReelsVideoInfoProps> = ({ video }) => {
  const user = (video as any).user;
  const username = video.username || user?.username || 'Unknown';
  const avatar = video.avatar_url || user?.avatar;

  return (
    <div className="absolute bottom-4 left-3 right-16 pointer-events-auto">
      <div className="flex items-center mb-2">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{username.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-white font-semibold">{username}</span>
      </div>
      <p className="text-white text-sm">{video.description}</p>
    </div>
  );
};