
import { useState, useEffect } from 'react';
import { Clock, Tag } from 'lucide-react';

export default function LimitedOffersBand() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newSeconds = prevTime.seconds - 1;
        const newMinutes = newSeconds < 0 ? prevTime.minutes - 1 : prevTime.minutes;
        const newHours = newMinutes < 0 ? prevTime.hours - 1 : prevTime.hours;

        return {
          hours: newHours < 0 ? 0 : newHours,
          minutes: newMinutes < 0 ? 59 : newMinutes,
          seconds: newSeconds < 0 ? 59 : newSeconds
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time digits to always show two digits
  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="bg-[#FFDEE2] w-full py-0.5 px-2 text-[#ea384c] flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-1.5">
        <Tag size={12} className="text-[#ea384c]" />
        <span className="font-bold text-xs">FLASH DEALS</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Clock size={12} className="text-[#ea384c]" />
        <span className="text-xs font-medium">Ends in:</span>
        <div className="flex items-center">
          <span className="text-xs font-mono font-semibold">{formatTime(timeLeft.hours)}</span>
          <span className="text-xs mx-0.5 font-bold">:</span>
          <span className="text-xs font-mono font-semibold">{formatTime(timeLeft.minutes)}</span>
          <span className="text-xs mx-0.5 font-bold">:</span>
          <span className="text-xs font-mono font-semibold">{formatTime(timeLeft.seconds)}</span>
        </div>
      </div>
    </div>
  );
}
