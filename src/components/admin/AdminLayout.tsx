import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, TrendingUp, Package, ShoppingCart, Users, FileText, Info, HelpCircle, Mail, Truck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/revenue", label: "Revenue", icon: TrendingUp },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { path: "/admin/reviews", label: "Reviews", icon: Star },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/policies", label: "Policies", icon: FileText },
  { path: "/admin/about", label: "About Us", icon: Info },
  { path: "/admin/faq", label: "FAQs", icon: HelpCircle },
  { path: "/admin/contact", label: "Contact", icon: Mail },
  { path: "/admin/shipping", label: "Shipping", icon: Truck },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Vertical Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Back to Main Page */}
        <div className="p-4 border-b border-border">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main Page
          </Link>
        </div>

        {/* Admin Title */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold text-primary">Admin Panel</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage your store</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            MCK Foods Admin
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 xl:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
