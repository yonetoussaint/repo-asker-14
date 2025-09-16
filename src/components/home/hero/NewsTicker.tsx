import { useState } from 'react';
import { AlertCircle, TrendingUp, Clock, Newspaper } from "lucide-react";

// News items for the ticker
const newsItems = [
  { id: 1, icon: <AlertCircle className="w-3 h-3 text-white" />, text: "EXTRA 10% OFF WITH CODE: SUMMER10" },
  { id: 2, icon: <TrendingUp className="w-3 h-3 text-white" />, text: "FREE SHIPPING ON ORDERS OVER ¥99" },
  { id: 3, icon: <Clock className="w-3 h-3 text-white" />, text: "LIMITED TIME: BUY 2 GET 1 FREE" },
  { id: 4, icon: <Newspaper className="w-3 h-3 text-white" />, text: "NEW SEASON ITEMS JUST ARRIVED" }
];

export default function NewsTicker() {
  const [isPaused, setIsPaused] = useState(false);

  // Create multiple copies for truly endless scrolling
  const newsRepeats = Array(5).fill(newsItems).flat();

  return (
    <div className="bg-black">
      <div className="max-w-screen-xl mx-auto">
        <div 
          className="relative overflow-hidden h-7 bg-black"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`flex items-center h-7 whitespace-nowrap ${
              isPaused ? '' : 'animate-scroll'
            }`}
            style={{ width: 'max-content' }}
          >
            {newsRepeats.map((item, index) => (
              <div key={`item-${index}`} className="flex items-center flex-shrink-0">
                <span className="flex-shrink-0 mr-2 ml-6">{item.icon}</span>
                <span className="text-xs font-medium text-white mr-6">{item.text}</span>
                <span className="text-white text-xs">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-20%);
            }
          }
          
          .animate-scroll {
            animation: scroll 25s linear infinite;
          }
        `
      }} />
    </div>
  );
}