import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import PageMeta from "@/components/common/PageMeta";
import type { Product } from "@/types/types";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        const items = JSON.parse(stored);
        setWishlistItems(items);
      } catch (error) {
        console.error("Error loading wishlist:", error);
        setWishlistItems([]);
      }
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    
    // Dispatch event to update wishlist count in header
    window.dispatchEvent(new Event("wishlist-updated"));
    
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist",
    });
  };

  const moveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been moved to your cart`,
    });

    // Scroll to top after adding to cart
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem("wishlist");
    
    // Dispatch event to update wishlist count in header
    window.dispatchEvent(new Event("wishlist-updated"));
    
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <>
        <PageMeta
          title="My Wishlist"
          description="View and manage your favorite products"
        />
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <Heart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 mb-8">
                Start adding products you love to your wishlist!
              </p>
              <Link to="/">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="My Wishlist"
        description="View and manage your favorite products"
      />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1599909533730-f9d5f8e3c1c1?w=400"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-amber-700 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-amber-700">
                        ₹{product.price}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        / {product.weight}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-amber-600 hover:bg-amber-700"
                      onClick={() => moveToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Link to={`/product/${product.id}`} className="flex-shrink-0">
                      <Button variant="outline">View</Button>
                    </Link>
                  </div>
                  {product.stock > 0 && product.stock < 10 && (
                    <p className="text-orange-600 text-sm mt-2">
                      Only {product.stock} left in stock
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;