
import { Bell } from 'lucide-react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

const NotificationBadge = () => {
  const { progress } = useScrollProgress();
  
  if (progress < 0.5) return null;
  
  return (
    <div className="cursor-pointer relative hover:bg-black hover:bg-opacity-30 p-1 rounded-full">
      <Bell className="h-4 w-4 text-gray-600" />
      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] rounded-full h-3.5 w-3.5 flex items-center justify-center">
        2
      </span>
    </div>
  );
};

export default NotificationBadge;
