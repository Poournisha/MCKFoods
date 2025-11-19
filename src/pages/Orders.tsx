import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/db/api";
import type { Order } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Package } from "lucide-react";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      const data = await api.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                <CardTitle className="text-lg">
                  Order #{order.id.slice(0, 8)}
                </CardTitle>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{((item.price / 100) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{(order.total_amount / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              {order.customer_name && (
                <div className="pt-4 border-t text-sm space-y-1">
                  <p><span className="font-medium">Name:</span> {order.customer_name}</p>
                  {order.customer_email && (
                    <p><span className="font-medium">Email:</span> {order.customer_email}</p>
                  )}
                  {order.customer_phone && (
                    <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                  )}
                  {order.customer_address && (
                    <p><span className="font-medium">Address:</span> {order.customer_address}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
