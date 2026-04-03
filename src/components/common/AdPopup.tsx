import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdPopupProps {
  productId: string;
  productName: string;
  imageUrl: string;
}

export default function AdPopup({ productId, productName, imageUrl }: AdPopupProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show popup when navigating to home page
    if (location.pathname === "/") {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]); // Re-run when route changes

  const handleImageClick = () => {
    setOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full shadow-lg"
            onClick={handleClose}
          >
            <X className="h-5 w-5 text-gray-700" />
          </Button>

          {/* Clickable image */}
          <div
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleImageClick();
              }
            }}
            aria-label={`View ${productName} details`}
          >
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-auto rounded-lg"
              loading="eager"
            />
          </div>

          {/* Optional: Add a "View Details" button at the bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={handleImageClick}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg"
              size="lg"
            >
              View Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}