import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">Ragi Products</span>
          </Link>

          <div className="flex items-center gap-4">
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

            {user ? (
              <>
                {profile?.role === "admin" && (
                  <Button asChild variant="outline">
                    <Link to="/admin">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline">
                  <Link to="/orders">
                    <User className="h-4 w-4 mr-2" />
                    My Orders
                  </Link>
                </Button>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
