import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/db/api";
import type { Product, Category } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Search, ShoppingCart, Loader2 } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productRatings, setProductRatings] = useState<Record<string, { avg: number; count: number }>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  // ⭐ Added: priority sorter
  const sortByPriority = (data: Product[]) => {
    return data.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);

      setProducts(sortByPriority(productsData)); // ⭐ priority sorting
      setCategories(categoriesData);

      const ratings: Record<string, { avg: number; count: number }> = {};
      await Promise.all(
        productsData.map(async (product) => {
          const [avg, count] = await Promise.all([
            api.getAverageRating(product.id),
            api.getReviewCount(product.id),
          ]);
          ratings[product.id] = { avg, count };
        })
      );
      setProductRatings(ratings);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }
    setLoading(true);
    try {
      const results = await api.searchProducts(searchQuery);
      setProducts(sortByPriority(results)); // ⭐ priority sorting
      setSelectedCategory(null);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSearchQuery("");
    setLoading(true);
    try {
      if (categoryId) {
        const results = await api.getProductsByCategory(categoryId);
        setProducts(sortByPriority(results)); // ⭐ priority sorting
      } else {
        const results = await api.getProducts();
        setProducts(sortByPriority(results)); // ⭐ priority sorting
      }
    } catch (error) {
      console.error("Filter failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Adding to cart:", {
      productName: product.name,
      productId: product.id,
      quantity: 1,
      timestamp: new Date().toISOString()
    });
    
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-4xl font-bold text-primary mb-2">Ragi Products Online Store</h1>
        <p className="text-muted-foreground">
          Premium health food products for your wellness journey
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between animate-fade-in-up animation-delay-100">
        <div className="flex gap-2 flex-1 max-w-xl">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 transition-smooth"
          />
          <Button onClick={handleSearch} className="transition-smooth hover-lift">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => handleCategoryFilter(null)}
            className="transition-smooth"
          >
            All Products
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryFilter(category.id)}
              className="transition-smooth"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-muted-foreground text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="block"
            >
              <Card 
                className="flex flex-col hover-lift transition-smooth stagger-item cursor-pointer h-full"
                style={{ animationDelay: `${(index % 8) * 0.1}s` }}
              >
                <CardHeader>
                  <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden group">
                    <img
                      src={product.image_url || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                    />
                  </div>
                  <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                  {product.weight && (
                    <Badge variant="secondary" className="w-fit">
                      {product.weight}
                    </Badge>
                  )}
                  {productRatings[product.id] && productRatings[product.id].count > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating 
                        rating={productRatings[product.id].avg} 
                        readonly 
                        size="sm" 
                      />
                      <span className="text-xs text-muted-foreground">
                        ({productRatings[product.id].count})
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl font-bold text-primary">
                      ₹{product.price.toFixed(2)}
                    </span>
                    {product.stock > 0 ? (
                      <Badge variant="outline" className="text-secondary">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button 
                      variant="outline" 
                      className="flex-1 transition-smooth"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/product/${product.id}`;
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock === 0}
                      className="flex-1 transition-smooth hover-lift"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
