import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export default function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape" && isFullScreenOpen) {
        setIsFullScreenOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreenOpen]);

  const openFullScreen = () => {
    setIsFullScreenOpen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreenOpen(false);
  };

  // If no images, show "No images" message
  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center p-8">
            <p className="text-muted-foreground text-lg">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image Display */}
      <div
        className="relative aspect-square bg-white rounded-lg overflow-hidden group cursor-pointer border border-border"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={openFullScreen}
      >
        <img
          src={images[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-contain transition-transform duration-300"
        />

        {/* Zoom Icon Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-3 shadow-lg">
              <ZoomIn className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Only show if multiple images */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg h-10 w-10 z-10"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg h-10 w-10 z-10"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* "Click to see full view" text - Only show if images exist */}
      {images.length > 0 && (
        <div className="text-center">
          <button
            onClick={openFullScreen}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            Click to see full view
          </button>
        </div>
      )}

      {/* Thumbnail Navigation - Only show if multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                currentIndex === index
                  ? "border-primary ring-2 ring-primary ring-offset-1"
                  : "border-border hover:border-primary/50"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image indicator for multiple images */}
      {images.length > 1 && (
        <div className="text-center text-sm text-muted-foreground">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Full Screen Image Viewer Dialog */}
      <Dialog open={isFullScreenOpen} onOpenChange={setIsFullScreenOpen}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 bg-white border-0">
          <div 
            className="relative w-full h-full flex items-center justify-center bg-white"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 xl:top-4 xl:right-4 z-50 bg-white hover:bg-gray-100 text-gray-700 h-12 w-12 xl:h-14 xl:w-14 rounded-full shadow-lg border border-gray-200"
              onClick={closeFullScreen}
              aria-label="Close full view"
            >
              <X className="h-6 w-6 xl:h-7 xl:w-7" />
            </Button>

            {/* Main Full Screen Image */}
            <div className="relative w-full h-full flex items-center justify-center px-4 py-24 xl:px-8 xl:py-28">
              <img
                src={images[currentIndex]}
                alt={`${productName} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                style={{ maxHeight: 'calc(100vh - 200px)', maxWidth: 'calc(100vw - 32px)' }}
              />
            </div>

            {/* Navigation Arrows for Full Screen */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 xl:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-700 h-14 w-14 xl:h-16 xl:w-16 z-50 rounded-full shadow-lg border border-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-7 w-7 xl:h-8 xl:w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 xl:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-700 h-14 w-14 xl:h-16 xl:w-16 z-50 rounded-full shadow-lg border border-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-7 w-7 xl:h-8 xl:w-8" />
                </Button>
              </>
            )}

            {/* Image Counter for Full Screen */}
            {images.length > 1 && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 xl:top-4 bg-white border border-gray-200 text-gray-700 px-4 py-2 xl:px-5 xl:py-2.5 rounded-full text-sm xl:text-base font-medium z-50 shadow-md">
                {currentIndex + 1} / {images.length}
              </div>
            )}

            {/* Thumbnail Strip for Full Screen - Desktop Only */}
            {images.length > 1 && (
              <div className="absolute bottom-2 xl:bottom-4 left-1/2 -translate-x-1/2 hidden xl:flex gap-2 overflow-x-auto max-w-[90vw] pb-2 z-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 xl:w-24 xl:h-24 rounded-md overflow-hidden border-2 transition-all shadow-md",
                      currentIndex === index
                        ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-white"
                        : "border-gray-300 hover:border-primary/50"
                    )}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${productName} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Swipe Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 xl:hidden bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-xs font-medium z-50 shadow-md">
                Swipe to navigate
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}