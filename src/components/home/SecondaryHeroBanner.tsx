
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Clock, Newspaper, AlertCircle, TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const banners = [
  { id: 1, color: "from-purple-500 to-indigo-500", text: "Hot Offers" },
  { id: 2, color: "from-emerald-500 to-teal-500", text: "Special Collection" },
  { id: 3, color: "from-rose-500 to-red-500", text: "Flash Deals" },
  { id: 4, color: "from-amber-400 to-orange-500", text: "Best Sellers" },
  { id: 5, color: "from-blue-400 to-sky-500", text: "New Arrivals" },
  { id: 6, color: "from-pink-400 to-purple-700", text: "Exclusive Items" }
];

const newsItems = [
  { id: 1, icon: <AlertCircle className="w-3 h-3 text-white" />, text: "EXTRA 10% OFF WITH CODE: SUMMER10" },
  { id: 2, icon: <TrendingUp className="w-3 h-3 text-white" />, text: "FREE SHIPPING ON ORDERS OVER ¥99" },
  { id: 3, icon: <Clock className="w-3 h-3 text-white" />, text: "LIMITED TIME: BUY 2 GET 1 FREE" },
  { id: 4, icon: <Newspaper className="w-3 h-3 text-white" />, text: "NEW SEASON ITEMS JUST ARRIVED" }
];

export default function SecondaryHeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);
  const [showNews, setShowNews] = useState(true);
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const [previousNewsIndex, setPreviousNewsIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();
  const intervalRef = useRef(null);
  const newsIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const slideDuration = 5000;
  const newsDuration = 4000;

  const startSlideTimer = () => {
    clearInterval(intervalRef.current);
    clearInterval(progressIntervalRef.current);
    setProgress(0);
    const progressStep = (50 / slideDuration) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 100 : prev + progressStep));
    }, 50);

    intervalRef.current = setInterval(() => {
      setProgress(0);
      setPreviousIndex(activeIndex);
      setActiveIndex(current => (current + 1) % banners.length);
    }, slideDuration);
  };

  const startNewsTimer = () => {
    clearInterval(newsIntervalRef.current);
    newsIntervalRef.current = setInterval(() => {
      setPreviousNewsIndex(activeNewsIndex);
      setActiveNewsIndex(current => (current + 1) % newsItems.length);
    }, newsDuration);
  };

  useEffect(() => {
    startSlideTimer();
    startNewsTimer();
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressIntervalRef.current);
      clearInterval(newsIntervalRef.current);
    };
  }, [activeIndex]);

  const handleDotClick = (index) => {
    setPreviousIndex(activeIndex);
    setActiveIndex(index);
  };

  return (
    <>
      <div className={`relative bg-gradient-to-r ${banners[activeIndex].color} transition-colors duration-500 overflow-hidden`}>
        {/* No margin-top needed for the SecondaryHeroBanner as it's not at the top */}
        <div className="relative h-[150px] md:h-[200px] lg:h-[250px]">
          {banners.map((banner, index) => {
            const isActive = index === activeIndex;
            const isPrevious = index === previousIndex;
            
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 w-full flex items-center transition-transform duration-500 ease-out ${
                  isActive ? "translate-y-0 z-10" : 
                  isPrevious ? "-translate-y-full z-0" : "translate-y-full z-0"
                }`}
              >
                <div className="container mx-auto px-4">
                  <div className="max-w-lg">
                    <h2 className="text-xl md:text-3xl font-extrabold text-white mb-0.5 md:mb-2 drop-shadow-md">
                      {banner.text}
                    </h2>
                    <p className="text-white text-xs md:text-base mb-2 md:mb-4 max-w-md drop-shadow-md font-medium">
                      Discover incredible deals today.
                    </p>
                    <Button className="bg-white text-black hover:bg-gray-100 font-medium text-xs md:text-sm rounded-full h-7 md:h-auto">
                      View All
                      <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isMobile && (
          <>
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/80 hover:bg-white hidden md:flex items-center justify-center z-20"
              onClick={() => {
                setPreviousIndex(activeIndex);
                setActiveIndex((current) => (current - 1 + banners.length) % banners.length);
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </button>
            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/80 hover:bg-white hidden md:flex items-center justify-center z-20"
              onClick={() => {
                setPreviousIndex(activeIndex);
                setActiveIndex((current) => (current + 1) % banners.length);
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                <path d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67627 12.0433 6.86514 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86514 3.15794C6.67627 2.95648 6.35986 2.94628 6.1584 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </button>
          </>
        )}

        {/* Animated Dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              className="relative h-1 rounded-full bg-gray-300 w-5 overflow-hidden"
              onClick={() => handleDotClick(index)}
            >
              <div className="absolute inset-0 bg-gray-300 rounded-full"></div>
              {activeIndex === index && (
                <div
                  className="absolute inset-0 bg-orange-500 rounded-full origin-left"
                  style={{
                    width: `${progress}%`,
                    transition: 'width 0.05s linear'
                  }}
                ></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Smooth Vertical Sliding News Banner */}
      {showNews && (
        <div className="bg-blue-50">
          <div className="max-w-screen-xl mx-auto">
            <div className="relative overflow-hidden h-7">
              {newsItems.map((item, index) => {
                const bgColors = [
                  "bg-blue-600", "bg-green-500", "bg-purple-600", "bg-pink-600"
                ];
                const bgColor = bgColors[index % bgColors.length];
                const isActive = index === activeNewsIndex;
                const isPrevious = index === previousNewsIndex;

                return (
                  <div
                    key={item.id}
                    className={`absolute top-0 left-0 w-full h-7 flex items-center px-2 transform transition-transform duration-500 ease-in-out ${bgColor} ${
                      isActive ? "translate-y-0 z-10" : 
                      isPrevious ? "-translate-y-full z-0" : "translate-y-full z-0"
                    }`}
                  >
                    <span className="flex-shrink-0 mr-1">{item.icon}</span>
                    <span className="text-xs font-medium text-white truncate">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
