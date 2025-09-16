import React, { useState } from 'react';

interface DragHandleProps {
  onClose: () => void;
}

const DragHandle: React.FC<DragHandleProps> = ({ onClose }) => {
  const [dragStartY, setDragStartY] = useState(0);

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid browser's pull-to-refresh
    if ('touches' in event) {
      event.preventDefault();
    }
    
    setDragStartY('touches' in event ? event.touches[0].clientY : event.clientY);
  };

  const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid browser's pull-to-refresh
    if ('touches' in event) {
      event.preventDefault();
    }
    
    const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const deltaY = currentY - dragStartY;
    
    // Only allow dragging down (positive deltaY)
    if (deltaY > 0) {
      // You could add visual feedback here if needed
    }
  };

  const handleDragEnd = (event: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid browser's pull-to-refresh
    if ('changedTouches' in event) {
      event.preventDefault();
    }
    
    const currentY = 'changedTouches' in event ? event.changedTouches[0].clientY : event.clientY;
    const deltaY = currentY - dragStartY;
    
    // Close the sheet if dragged down sufficiently
    if (deltaY > 100) {
      onClose();
    }
  };

  return (
    <div 
      className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDrag}
      onTouchEnd={handleDragEnd}
    >
      <div className="w-12 h-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"></div>
    </div>
  );
};

export default DragHandle;