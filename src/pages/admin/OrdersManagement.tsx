import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/db/api";
import type { Order } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function OrdersManagement() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "pending": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  if (profile?.role !== "admin") {
    return <div className="container mx-auto px-4 py-8">Access Denied</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Orders Management</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                <Badge variant={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
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
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">₹{((item.price / 100) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">₹{(order.total_amount / 100).toFixed(2)}</span>
              </div>
              {order.customer_name && (
                <div className="pt-4 border-t text-sm space-y-1">
                  <p><span className="font-medium">Customer:</span> {order.customer_name}</p>
                  {order.customer_email && <p><span className="font-medium">Email:</span> {order.customer_email}</p>}
                  {order.customer_phone && <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>}
                  {order.customer_address && <p><span className="font-medium">Address:</span> {order.customer_address}</p>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
