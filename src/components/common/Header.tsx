import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/db/api";
import type { PolicyPage } from "@/types/types";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { cartCount, clearCart } = useCart();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [policies, setPolicies] = useState<PolicyPage[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    clearCart();
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    const updateWishlistCount = () => {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        try {
          const items = JSON.parse(stored);
          setWishlistCount(Array.isArray(items) ? items.length : 0);
        } catch {
          setWishlistCount(0);
        }
      } else {
        setWishlistCount(0);
      }
    };

    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlist-updated", updateWishlistCount);

    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlist-updated", updateWishlistCount);
    };
  }, []);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await api.getPolicyPages();
        setPolicies(data);
      } catch (error) {
        console.error("Failed to load policies:", error);
      }
    };

    loadPolicies();
  }, []);

  return (
    <header className="bg-card border-b sticky top-0 z-50 animate-slide-in-down backdrop-blur-sm bg-card/95">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 transition-smooth hover-scale">
            <img src="/mck-logo.jpg" alt="MCK Foods" className="h-10 w-auto" />
            <span className="text-xl md:text-2xl font-bold text-primary">MCK Foods</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            <Link to="/" className="text-foreground hover:text-primary transition-smooth font-medium relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-smooth group-hover:w-full"></span>
            </Link>
            <Link to="/" className="text-foreground hover:text-primary transition-smooth font-medium relative group">
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-smooth group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-smooth font-medium relative group">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-smooth group-hover:w-full"></span>
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-smooth font-medium relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-smooth group-hover:w-full"></span>
            </Link>
            
            {/* Policies Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto p-0 text-base text-foreground hover:text-primary transition-smooth font-medium bg-transparent hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary relative group">
                    Policies
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-smooth group-hover:w-full group-data-[state=open]:w-full"></span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-4">
                      {policies.map((policy) => (
                        <li key={policy.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/policy/${policy.slug}`}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-smooth hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{policy.title}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions - Desktop */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Button asChild variant="ghost" size="icon" className="relative transition-smooth hover-scale">
              <Link to="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-scale-in">
                    {wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button asChild variant="ghost" size="icon" className="relative transition-smooth hover-scale">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-scale-in">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {profile?.role === "admin" && <NotificationBell />}

            {user ? (
              <>
                {profile?.role === "admin" && (
                  <Button asChild variant="outline" size="sm" className="transition-smooth hover-lift">
                    <Link to="/admin">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="sm" className="transition-smooth hover-lift">
                  <Link to="/orders">
                    <User className="h-4 w-4 mr-2" />
                    Orders
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="transition-smooth hover-lift">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild size="sm" className="transition-smooth hover-lift">
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu - Icons and Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {/* User Actions */}
                  {user ? (
                    <div className="flex flex-col gap-2 pb-4 border-b">
                      {profile?.role === "admin" && (
                        <Button asChild variant="outline" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                          <Link to="/admin">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="outline" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                        <Link to="/orders">
                          <User className="h-4 w-4 mr-2" />
                          My Orders
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="pb-4 border-b">
                      <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        <Link to="/login">Log in</Link>
                      </Button>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                      <Link to="/">Home</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                      <Link to="/">Shop</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                      <Link to="/wishlist">
                        Wishlist
                        {wishlistCount > 0 && (
                          <Badge className="ml-auto">{wishlistCount}</Badge>
                        )}
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                      <Link to="/about">About Us</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                      <Link to="/contact">Contact</Link>
                    </Button>
                  </div>

                  {/* Policies */}
                  {policies.length > 0 && (
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      <p className="text-sm font-semibold text-muted-foreground px-2">Policies</p>
                      {policies.map((policy) => (
                        <Button
                          key={policy.id}
                          asChild
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link to={`/policy/${policy.slug}`}>{policy.title}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}