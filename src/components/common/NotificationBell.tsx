import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/db/api";
import type { Order } from "@/types/types";
import { Link } from "react-router-dom";
import { formatOrderId } from "@/lib/utils";

const SEEN_ORDERS_KEY = "seen_order_ids";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();

    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);

    // Listen for order updates
    window.addEventListener("orders-updated", loadNotifications);

    return () => {
      clearInterval(interval);
      window.removeEventListener("orders-updated", loadNotifications);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const orders = await api.getAllOrders();
      const pending = orders.filter((order) => order.status === "pending");
      setPendingOrders(pending);

      // Get seen order IDs from localStorage
      const seenIds = getSeenOrderIds();
      
      // Count only unseen pending orders
      const unseenCount = pending.filter(
        (order) => !seenIds.includes(order.id)
      ).length;
      
      setUnreadCount(unseenCount);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  const getSeenOrderIds = (): string[] => {
    try {
      const stored = localStorage.getItem(SEEN_ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const markAllAsSeen = () => {
    const allPendingIds = pendingOrders.map((order) => order.id);
    localStorage.setItem(SEEN_ORDERS_KEY, JSON.stringify(allPendingIds));
    setUnreadCount(0);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && unreadCount > 0) {
      // Mark as seen when bell is clicked
      markAllAsSeen();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative transition-smooth hover-scale">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground animate-scale-in">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Pending Orders</h3>
            {pendingOrders.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {pendingOrders.length} total
              </Badge>
            )}
          </div>

          {pendingOrders.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No pending orders
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {pendingOrders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  to="/admin/orders"
                  className="block p-3 rounded-md border bg-card hover:bg-accent transition-smooth"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        {formatOrderId(order.id)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {order.customer_name || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} item(s) • ₹{(order.total_amount / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      Pending
                    </Badge>
                  </div>
                </Link>
              ))}
              
              {pendingOrders.length > 5 && (
                <Link
                  to="/admin/orders"
                  className="block text-center py-2 text-sm text-primary hover:underline"
                  onClick={() => setOpen(false)}
                >
                  View all {pendingOrders.length} orders
                </Link>
              )}
            </div>
          )}

          {pendingOrders.length > 0 && (
            <div className="pt-2 border-t">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <Link to="/admin/orders">
                  Manage All Orders
                </Link>
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}