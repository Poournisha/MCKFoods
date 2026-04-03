import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/db/api";
import type { Product, ProductImage } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingCart, Loader2, Minus, Plus, Heart } from "lucide-react";
import ProductImageCarousel from "@/components/product/ProductImageCarousel";
import { ProductReviews } from "@/components/product/ProductReviews";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadProduct(id);
      checkWishlistStatus(id);
    }
  }, [id]);

  const checkWishlistStatus = (productId: string) => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        const items = JSON.parse(stored);
        setIsInWishlist(items.some((item: Product) => item.id === productId));
      } catch {
        setIsInWishlist(false);
      }
    }
  };

  const loadProduct = async (productId: string) => {
    console.log("=== LOADING PRODUCT ===");
    console.log("Product ID from URL:", productId);
    
    try {
      const [productData, imagesData] = await Promise.all([
        api.getProductById(productId),
        api.getProductImages(productId),
      ]);
      
      console.log("Product data received:", productData);
      console.log("Product images received:", imagesData);
      
      setProduct(productData);
      setProductImages(imagesData);
    } catch (error) {
      console.error("Failed to load product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });

      // Scroll to top after adding to cart
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    const stored = localStorage.getItem("wishlist");
    let wishlist: Product[] = [];
    
    if (stored) {
      try {
        wishlist = JSON.parse(stored);
      } catch {
        wishlist = [];
      }
    }

    if (isInWishlist) {
      wishlist = wishlist.filter((item) => item.id !== product.id);
      setIsInWishlist(false);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      wishlist.push(product);
      setIsInWishlist(true);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 transition-smooth hover-lift animate-fade-in-left">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="animate-fade-in-left">
          <CardContent className="p-6">
            <ProductImageCarousel
              images={
                productImages.length > 0
                  ? productImages
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((img) => img.image_url)
                  : product.image_url
                  ? [product.image_url]
                  : []
              }
              productName={product.name}
            />
          </CardContent>
        </Card>

        <div className="space-y-6 animate-fade-in-right">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
            {product.weight && (
              <Badge variant="secondary" className="mb-4">
                {product.weight}
              </Badge>
            )}
            <p className="text-4xl font-bold text-primary mb-4">
              ₹{product.price.toFixed(2)}
            </p>
            {product.stock > 0 ? (
              <Badge variant="outline" className="text-secondary">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description || "No description available"}
            </p>
          </div>

          <Card className="hover-lift transition-smooth">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="transition-smooth hover-scale"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="transition-smooth hover-scale"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{(product.price * quantity).toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full transition-smooth hover-lift"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  onClick={handleToggleWishlist}
                  variant={isInWishlist ? "default" : "outline"}
                  className="w-full transition-smooth hover-lift"
                  size="lg"
                >
                  <Heart className={`h-5 w-5 mr-2 transition-smooth ${isInWishlist ? "fill-current" : ""}`} />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className="mt-12">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}