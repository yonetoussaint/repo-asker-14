import React from 'react';
import { Smartphone, Laptop, Headphones, Camera, Watch, Gamepad2 } from 'lucide-react';

const ElectronicsSubcategories = () => {
  const subcategories = [
    { name: 'Phones', icon: Smartphone, color: 'bg-blue-500' },
    { name: 'Laptops', icon: Laptop, color: 'bg-purple-500' },
    { name: 'Audio', icon: Headphones, color: 'bg-green-500' },
    { name: 'Cameras', icon: Camera, color: 'bg-red-500' },
    { name: 'Wearables', icon: Watch, color: 'bg-orange-500' },
    { name: 'Gaming', icon: Gamepad2, color: 'bg-indigo-500' }
  ];

  return (
    <div className="py-4">
      <h3 className="text-xl font-bold mb-4">Electronics Categories</h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {subcategories.map((sub, index) => {
          const IconComponent = sub.icon;
          return (
            <div key={sub.name} className="text-center group cursor-pointer">
              <div className={`${sub.color} w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs font-medium text-gray-700">{sub.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElectronicsSubcategories;