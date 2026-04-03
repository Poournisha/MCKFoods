import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/db/api";
import type { Order } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Ban, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import CancellationRefundDialog from "@/components/admin/CancellationRefundDialog";
import { formatOrderId } from "@/lib/utils";

export default function OrdersManagement() {
  const { profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogMode, setDialogMode] = useState<"cancellation" | "refund">("cancellation");
  const [dialogOpen, setDialogOpen] = useState(false);

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
      case "refunded": return "outline";
      default: return "outline";
    }
  };

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "processing": return "secondary";
      case "pending": return "outline";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      loadOrders();
      // Dispatch event to update header badge
      window.dispatchEvent(new Event("orders-updated"));
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const openCancellationDialog = (order: Order) => {
    setSelectedOrder(order);
    setDialogMode("cancellation");
    setDialogOpen(true);
  };

  const openRefundDialog = (order: Order) => {
    setSelectedOrder(order);
    setDialogMode("refund");
    setDialogOpen(true);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return <AdminLayout><div>Access Denied</div></AdminLayout>;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Orders Management</h1>
          <p className="text-muted-foreground">Manage customer orders, cancellations, and refunds</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
                    <CardTitle className="text-lg">Order {formatOrderId(order.id)}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant={getStatusColor(order.status)}>{order.status.toUpperCase()}</Badge>
                      {order.refund_status !== "none" && (
                        <Badge variant={getRefundStatusColor(order.refund_status)}>
                          Refund: {order.refund_status}
                        </Badge>
                      )}
                    </div>
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
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Products</p>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-semibold">₹{((item.price / 100) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{((order.total_amount - (order.shipping_cost || 0)) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Shipping Cost {order.total_weight_grams ? `(${order.total_weight_grams}g)` : ''}
                    </span>
                    <span className="font-semibold">
                      {order.shipping_cost && order.shipping_cost > 0 
                        ? `₹${(order.shipping_cost / 100).toFixed(2)}`
                        : 'Free'}
                    </span>
                  </div>
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

                {order.cancellation_reason && (
                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-destructive">Cancellation Reason</p>
                        <p className="text-sm text-muted-foreground">{order.cancellation_reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {order.refund_status !== "none" && (
                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-2 p-3 bg-secondary/10 rounded-md">
                      <RefreshCw className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium">Refund Information</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Status: <span className="font-medium">{order.refund_status}</span></p>
                          {order.refund_amount && (
                            <p>Amount: <span className="font-medium">₹{(order.refund_amount / 100).toFixed(2)}</span></p>
                          )}
                          {order.refund_date && (
                            <p>Date: <span className="font-medium">
                              {new Date(order.refund_date).toLocaleDateString("en-IN")}
                            </span></p>
                          )}
                          {order.refund_notes && (
                            <p className="mt-2">Notes: {order.refund_notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {order.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCancellationDialog(order)}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Cancel Order
                      </Button>
                    )}
                    {(order.status === "cancelled" || order.status === "refunded") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRefundDialog(order)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Manage Refund
                      </Button>
                    )}
                    {order.status === "completed" && (
                      <Button
                        variant="default"
                        size="sm"
                        disabled
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {orders.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <CancellationRefundDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadOrders}
        mode={dialogMode}
      />
    </AdminLayout>
  );
}
