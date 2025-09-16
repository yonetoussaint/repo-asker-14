import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { fetchHeroBanners } from "@/integrations/supabase/hero";
import { setupStorageBuckets } from "@/integrations/supabase/setupStorage";
import { toast } from "sonner";
import BannerControls from '../home/hero/BannerControls';
import NewsTicker from '../home/hero/NewsTicker';
import { BannerType } from '../home/hero/types';

export default function TransferHeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [showNews, setShowNews] = useState(true);
  const [progress, setProgress] = useState(0);
  const [offset, setOffset] = useState<number>(0);
  const slideDuration = 5000;

  // Dynamically measure header height
  useEffect(() => {
    function updateOffset() {
      const header = document.getElementById("ali-header");
      if (header) {
        setOffset(header.offsetHeight);
      } else {
        setOffset(0);
      }
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

  // Fetch banners from Supabase with a shorter cache time for testing
  const { data: banners, isLoading, error } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: fetchHeroBanners,
    staleTime: 5000,
    refetchInterval: 10000,
  });

  // Show error if we failed to fetch banners
  useEffect(() => {
    if (error) {
      toast.error("Failed to load banner images");
      console.error("Banner fetch error:", error);
    }
  }, [error]);

  // Log banners whenever they change
  useEffect(() => {
    if (banners) {
      console.log("Banners loaded from query:", banners);
      
      // Force image preloading
      banners.forEach(banner => {
        if (banner.image) {
          const img = new Image();
          img.src = banner.image;
          img.onload = () => console.log(`Preloaded image successfully: ${banner.image}`);
          img.onerror = (e) => console.error(`Failed to preload image ${banner.image}:`, e);
        }
      });
    }
  }, [banners]);

  // Fallback banners in case database is empty
  const fallbackBanners: BannerType[] = [
    {
      id: "1",
      image: "/lovable-uploads/2102d3a1-ec6e-4c76-8ee0-549c3ae3d54e.png",
      type: "image",
      alt: "Banner 1",
      position: 0
    },
    {
      id: "2",
      image: "/lovable-uploads/4dbaee7c-2ac5-4a1b-9f9b-121275273e79.png",
      type: "image", 
      alt: "Banner 2",
      position: 1
    },
    {
      id: "3",
      image: "/lovable-uploads/dd1cad7b-c3b6-43a6-9bc6-deb38a120604.png",
      type: "image",
      alt: "Banner 3",
      position: 2
    }
  ];

  // Use banners from database or fallback banners
  const slidesToShow = banners?.length > 0 ? banners : fallbackBanners;

  // Set up intervals for banner rotation and progress tracking
  useEffect(() => {
    let intervalRef: ReturnType<typeof setInterval> | null = null;
    let progressIntervalRef: ReturnType<typeof setInterval> | null = null;

    const startSlideTimer = () => {
      clearInterval(intervalRef as ReturnType<typeof setInterval>);
      clearInterval(progressIntervalRef as ReturnType<typeof setInterval>);
      setProgress(0);
      const progressStep = (50 / slideDuration) * 100;

      progressIntervalRef = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 100 : prev + progressStep));
      }, 50);

      intervalRef = setInterval(() => {
        setProgress(0);
        setPreviousIndex(activeIndex);
        setActiveIndex(current => (current + 1) % slidesToShow.length);
      }, slideDuration);
    };

    startSlideTimer();
    
    return () => {
      clearInterval(intervalRef as ReturnType<typeof setInterval>);
      clearInterval(progressIntervalRef as ReturnType<typeof setInterval>);
    };
  }, [activeIndex, slidesToShow.length]);

  if (isLoading) {
    return (
      <div className="px-4" style={{ marginTop: offset }}>
        <div className="relative w-full bg-gray-200 animate-pulse h-[60vh] rounded-3xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">Loading banners...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4" style={{ marginTop: offset }}>
        {/* Main container with rounded borders and overflow hidden */}
        <div className="relative w-full rounded-3xl shadow-lg aspect-[16/5] bg-gray-100 overflow-hidden">
          {/* Image slides container */}
          <div className="absolute inset-0 w-full h-full">
            {slidesToShow.map((banner, index) => {
              const isActive = index === activeIndex;
              const isPrevious = index === previousIndex;
              
              return (
                <div
                  key={banner.id}
                  className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-out ${
                    isActive ? "translate-y-0 z-10" : 
                    isPrevious ? "-translate-y-full z-0 hidden" : "translate-y-full z-0 hidden"
                  }`}
                >
                  <img
                    src={banner.image} 
                    alt={banner.alt || "Banner image"}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: 'inherit' }}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Banner controls overlay */}
          <BannerControls
            slidesCount={slidesToShow.length}
            activeIndex={activeIndex}
            previousIndex={previousIndex}
            setActiveIndex={setActiveIndex}
            setPreviousIndex={setPreviousIndex}
            progress={progress}
          />
        </div>
      </div>
      {/* News Ticker */}
      {showNews && <NewsTicker />}
    </>
  );
}
