
import React from "react";

export const PriceHistoryModal: React.FC = () => {
  return (
    <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
      <div className="text-sm font-medium mb-2">Price History</div>
      <div className="h-32 w-full bg-slate-50 rounded-md flex items-end p-1 space-x-[2px]">
        {[7,5,6,8,9,8,7,5,6,4,5,7,8,9,10,9,8,7,6,5,6,7,5,4,3,5,7,8,6,5].map((value, i) => (
          <div 
            key={i} 
            className="flex-1 bg-purple-200 rounded-sm" 
            style={{ height: `${value * 10}%` }} 
          />
        ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-green-700">Lowest: $19.99</div>
        <div className="text-xs text-red-700">Highest: $39.99</div>
      </div>
    </div>
  );
};
