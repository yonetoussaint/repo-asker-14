
import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchHeroBanners } from "@/integrations/supabase/hero";
import { setupStorageBuckets } from "@/integrations/supabase/setupStorage";
import { toast } from "sonner";
import BannerSlides from '../home/hero/BannerSlides';
import BannerControls from '../home/hero/BannerControls';
import FloatingVideo from '../hero/FloatingVideo';
import { BannerType } from '../home/hero/types';

interface SellerHeroBannerProps {
  seller: any;
  onScrollProgress?: (progress: number) => void;
}

export default function SellerHeroBanner({ seller, onScrollProgress }: SellerHeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [offset, setOffset] = useState<number>(0);
  const [videoDurations, setVideoDurations] = useState<{[key: number]: number}>({});
  const [showFloatingVideo, setShowFloatingVideo] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const heroBannerRef = useRef<HTMLDivElement>(null);

  // Dynamically measure header height
  useEffect(() => {
    function updateOffset() {
      const header = document.getElementById("seller-header");
      setOffset(header ? header.offsetHeight : 0);
    }
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, []);

  // Initialize storage buckets if needed
  useEffect(() => {
    const initStorage = async () => {
      await setupStorageBuckets();
      console.log('Storage buckets initialized');
    };
    initStorage();
  }, []);

  // Fetch banners from Supabase
  const { data: banners, isLoading, error } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: fetchHeroBanners,
    staleTime: 5000,
    refetchInterval: 10000,
  });

  // Show error if banner fetch fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load banner images");
      console.error("Banner fetch error:", error);
    }
  }, [error]);

  // Preload images
  useEffect(() => {
    if (banners) {
      console.log("Banners loaded from query:", banners);
      banners.forEach(banner => {
        if (banner.image) {
          const img = new Image();
          img.src = banner.image;
        }
      });
    }
  }, [banners]);

  // Transform banners to match BannerType interface
  const transformedBanners: BannerType[] = banners?.map(banner => {
    const decodedUrl = decodeURIComponent(banner.image);
    const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(decodedUrl) || 
                    /\.(mp4|webm|ogg|mov|avi)$/i.test(banner.image);
    
    return {
      ...banner,
      type: isVideo ? "video" as const : "image" as const,
      duration: banner.duration || (isVideo ? 10000 : 5000)
    };
  }) || [];
  
  const slidesToShow = transformedBanners;

  // Handle video duration updates
  const handleVideoDurationChange = (index: number, duration: number) => {
    setVideoDurations(prev => ({ ...prev, [index]: duration }));
  };

  // Get duration for current slide
  const getCurrentSlideDuration = () => {
    const slide = slidesToShow[activeIndex];
    if (!slide) return 5000;
    
    if (slide.type === "video" && videoDurations[activeIndex]) {
      return videoDurations[activeIndex];
    }
    
    return slide.duration || 5000;
  };

  // Banner rotation with dynamic video duration
  useEffect(() => {
    if (slidesToShow.length <= 1) return;
    
    let timeoutRef: ReturnType<typeof setTimeout> | null = null;
    let progressIntervalRef: ReturnType<typeof setInterval> | null = null;

    const duration = getCurrentSlideDuration();
    const progressStep = (50 / duration) * 100;

    const startSlideTimer = () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      if (progressIntervalRef) clearInterval(progressIntervalRef);
      setProgress(0);

      progressIntervalRef = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 100 : prev + progressStep));
      }, 50);

      timeoutRef = setTimeout(() => {
        setProgress(0);
        setPreviousIndex(activeIndex);
        setActiveIndex((current) => (current + 1) % slidesToShow.length);
      }, duration);
    };

    startSlideTimer();

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
      if (progressIntervalRef) clearInterval(progressIntervalRef);
    };
  }, [activeIndex, slidesToShow.length, videoDurations]);

  // Scroll detection for floating video and progress tracking
  useEffect(() => {
    const handleScroll = () => {
      if (!heroBannerRef.current) return;
      
      const rect = heroBannerRef.current.getBoundingClientRect();
      const bannerHeight = rect.height;
      const scrollProgress = Math.max(0, Math.min(1, (bannerHeight - rect.bottom) / bannerHeight));
      
      // Notify parent component of scroll progress
      if (onScrollProgress) {
        onScrollProgress(scrollProgress);
      }

      const currentSlide = slidesToShow[activeIndex];
      if (!currentSlide || currentSlide.type !== "video") {
        setShowFloatingVideo(false);
        return;
      }

      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      
      if (!isVisible && !showFloatingVideo) {
        const videoElement = heroBannerRef.current.querySelector('video');
        if (videoElement && !videoElement.paused) {
          const exactTime = videoElement.currentTime;
          videoElement.pause();
          videoElement.muted = true;
          setVideoCurrentTime(exactTime);
          setShowFloatingVideo(true);
        }
      } else if (isVisible && showFloatingVideo) {
        const videoElement = heroBannerRef.current.querySelector('video');
        if (videoElement && videoElement.paused) {
          videoElement.play().catch(console.error);
        }
        setShowFloatingVideo(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex, slidesToShow, showFloatingVideo, onScrollProgress]);

  const handleCloseFloatingVideo = () => {
    setShowFloatingVideo(false);
  };

  const handleExpandFloatingVideo = () => {
    setShowFloatingVideo(false);
    heroBannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSlide = slidesToShow[activeIndex];

  return (
    <>
      <div
        ref={heroBannerRef}
        className="hero-banner relative overflow-hidden w-full"
        style={{ marginTop: offset }}
      >
        <BannerSlides 
          slides={slidesToShow}
          activeIndex={activeIndex}
          previousIndex={previousIndex}
          onVideoDurationChange={handleVideoDurationChange}
        />
        <BannerControls
          slidesCount={slidesToShow.length}
          activeIndex={activeIndex}
          previousIndex={previousIndex}
          setActiveIndex={setActiveIndex}
          setPreviousIndex={setPreviousIndex}
          progress={progress}
        />
      </div>
      
      {/* Floating Video */}
      {showFloatingVideo && currentSlide && currentSlide.type === "video" && (
        <FloatingVideo
          src={currentSlide.image}
          alt={currentSlide.alt}
          isVisible={showFloatingVideo}
          onClose={handleCloseFloatingVideo}
          onExpand={handleExpandFloatingVideo}
          currentTime={videoCurrentTime}
          headerOffset={offset}
        />
      )}
    </>
  );
}
