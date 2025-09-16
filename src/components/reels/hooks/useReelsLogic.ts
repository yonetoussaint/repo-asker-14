import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVideos, Video } from '@/hooks/useVideos';

// Mock custom hook - returns true for mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  return isMobile;
};

export const useReelsLogic = () => {
  const [searchParams] = useSearchParams();
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playingStates, setPlayingStates] = useState<boolean[]>([]);
  const reelRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { data: videos, isLoading } = useVideos();
  const videoParam = searchParams.get('video');

  // Initialize playing states when videos load
  useEffect(() => {
    if (videos) {
      setPlayingStates(new Array(videos.length).fill(false));
      reelRefs.current = new Array(videos.length).fill(null);
    }
  }, [videos]);

  const formatViews = useCallback((views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${Math.round(views / 1000)}K`;
    }
    return views.toString();
  }, []);

  // Find initial video index if video param is provided
  useEffect(() => {
    if (videos && videoParam) {
      const videoIndex = videos.findIndex(video => video.id === videoParam);
      if (videoIndex !== -1) {
        setActiveReelIndex(videoIndex);
      }
    }
  }, [videos, videoParam]);

  // Setup intersection observer
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Sort entries by intersection ratio to prioritize the most visible one
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Find the entry with the highest intersection ratio
          const mostVisible = visibleEntries.reduce((max, entry) => 
            entry.intersectionRatio > max.intersectionRatio ? entry : max
          );
          
          const videoId = Number(mostVisible.target.id.replace('reel-', ''));
          setActiveReelIndex(videoId);
          
          // Pause ALL videos first
          reelRefs.current.forEach((videoRef, idx) => {
            if (videoRef) {
              videoRef.pause();
            }
          });
          
          // Then play only the most visible video
          const video = reelRefs.current[videoId];
          if (video) {
            video.currentTime = 0;
            video.muted = isMuted;
            video.play().catch(err => console.log('Autoplay prevented:', err));
          }
        } else {
          // If no videos are intersecting, pause all
          reelRefs.current.forEach((videoRef) => {
            if (videoRef) {
              videoRef.pause();
            }
          });
        }
      },
      { threshold: [0.5, 0.7, 0.9] } // Multiple thresholds for better detection
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isMuted]);

  // Observe video elements
  useEffect(() => {
    if (!observerRef.current || !containerRef.current) return;

    const videoContainers = containerRef.current.querySelectorAll('[data-reel-container]');
    videoContainers.forEach(container => {
      observerRef.current?.observe(container);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos, isReady]);

  useEffect(() => {
    if (isMobile !== undefined) {
      setIsReady(true);
    }
  }, [isMobile]);

  // Only handle initial video load, let intersection observer handle the rest
  useEffect(() => {
    if (videos && isReady && reelRefs.current.length > 0 && activeReelIndex === 0) {
      // Only auto-play if we're at the first video initially
      const targetVideo = reelRefs.current[0];
      
      if (targetVideo && !videoParam) {
        // Only if no specific video is requested via URL
        targetVideo.currentTime = 0;
        targetVideo.muted = isMuted;
        
        targetVideo.play().then(() => {
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[0] = true;
            return newStates;
          });
        }).catch(err => {
          console.log('Autoplay prevented, user interaction required:', err);
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[0] = false;
            return newStates;
          });
        });
      }
    }
  }, [videos, isReady, isMuted, videoParam]);

  const handleVideoClick = (index: number, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    const video = reelRefs.current[index];

    if (video) {
      if (video.paused) {
        video.currentTime = 0;
        video.play().then(() => {
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        }).catch(err => {
          console.error('Play failed:', err);
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = false;
            return newStates;
          });
        });
      } else {
        video.pause();
        setPlayingStates(prev => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      }
    }
  };

  // Add event listeners to track video play/pause state
  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];
    
    reelRefs.current.forEach((video, index) => {
      if (video) {
        const handlePlay = () => {
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = true;
            return newStates;
          });
        };

        const handlePause = () => {
          setPlayingStates(prev => {
            const newStates = [...prev];
            newStates[index] = false;
            return newStates;
          });
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        cleanupFunctions.push(() => {
          video.removeEventListener('play', handlePlay);
          video.removeEventListener('pause', handlePause);
        });
      }
    });
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [videos]);


  return {
    videos,
    isLoading,
    isReady,
    isMuted,
    playingStates,
    reelRefs,
    containerRef,
    handleVideoClick,
    formatViews,
    currentVideoIndex: activeReelIndex,
  };
};