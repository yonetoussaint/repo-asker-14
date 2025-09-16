import React, { useState } from 'react';
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/shared/SectionHeader';

const ReviewGallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const reviews = [
    {
      id: 1,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      alt: "Happy customer review"
    },
    {
      id: 2,
      rating: 4.0,
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=200&fit=crop",
      alt: "Product in use"
    },
    {
      id: 3,
      rating: 3.0,
      image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=800&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=200&h=200&fit=crop",
      alt: "Product demonstration"
    },
    {
      id: 4,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c851?w=800&h=800&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b332c851?w=200&h=200&fit=crop&crop=face",
      alt: "Satisfied customer"
    },
    {
      id: 5,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      alt: "Customer testimonial"
    },
    {
      id: 6,
      rating: 4.0,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      alt: "Review photo"
    },
    {
      id: 7,
      rating: 3.5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      alt: "Customer experience"
    },
    {
      id: 8,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
      alt: "Product review"
    },
    {
      id: 9,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop&crop=face",
      thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
      alt: "User feedback"
    }
  ];

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeImageViewer = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : reviews.length - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex !== null && prevIndex < reviews.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex !== null) {
      if (e.key === 'Escape') {
        closeImageViewer();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  return (
  <>
    <div className="w-full bg-white">
      {/* Header */}
      <SectionHeader 
        title="Review Gallery"
        showViewAll={true}
        onViewAllClick={() => {/* Handle view all click */}}
        className="mb-4"
      />

      {/* Scrollable Gallery - FIXED */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4 pb-4">
            {reviews.map((review, index) => (
              <div 
                key={review.id} 
                className="flex-none w-40 h-40 relative group cursor-pointer"
                onClick={() => openImageViewer(index)}
              >
                <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-200">
                  <img
                    src={review.thumbnail}
                    alt={review.alt}
                    className="w-full h-full object-cover"
                  />

                  {/* Rating overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center bg-black bg-opacity-70 rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-white text-sm font-medium">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === 0 ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Image Viewer Modal */}
    {selectedImageIndex !== null && (
      <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={closeImageViewer}
          className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Main Image */}
        <div className="max-w-4xl max-h-[90vh] mx-auto px-16">
          <img
            src={reviews[selectedImageIndex].image}
            alt={reviews[selectedImageIndex].alt}
            className="w-full h-full object-contain rounded-lg"
          />

          {/* Image Info */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center bg-black bg-opacity-70 rounded-full px-4 py-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
            <span className="text-white font-medium mr-4">
              {reviews[selectedImageIndex].rating.toFixed(1)}
            </span>
            <span className="text-gray-300 text-sm">
              {selectedImageIndex + 1} of {reviews.length}
            </span>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
          <div className="overflow-x-auto">
            <div className="flex gap-3 px-4 justify-center">
              {reviews.map((review, index) => (
                <button
                  key={review.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                    index === selectedImageIndex
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <img
                    src={review.thumbnail}
                    alt={review.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);
};

export default ReviewGallery;