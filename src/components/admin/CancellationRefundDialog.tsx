import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/db/api";
import { useToast } from "@/hooks/use-toast";
import type { Order, RefundStatus } from "@/types/types";

interface CancellationRefundDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  mode: "cancellation" | "refund";
}

export default function CancellationRefundDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
  mode,
}: CancellationRefundDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [refundStatus, setRefundStatus] = useState<RefundStatus>("pending");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundNotes, setRefundNotes] = useState("");

  const handleSubmit = async () => {
    if (!order) return;

    try {
      setLoading(true);

      if (mode === "cancellation") {
        if (!cancellationReason.trim()) {
          toast({
            title: "Error",
            description: "Please provide a cancellation reason",
            variant: "destructive",
          });
          return;
        }

        await api.updateOrderCancellation(order.id, cancellationReason);
        toast({
          title: "Success",
          description: "Order cancelled successfully",
        });
      } else {
        const amount = refundAmount ? parseInt(refundAmount) * 100 : undefined;
        await api.updateOrderRefundStatus(
          order.id,
          refundStatus,
          amount,
          refundNotes || undefined
        );
        toast({
          title: "Success",
          description: "Refund status updated successfully",
        });
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
      // Dispatch event to update header badge
      window.dispatchEvent(new Event("orders-updated"));
    } catch (error: any) {
      console.error("Error updating order:", error);
      console.error("Error details:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
      });
      
      // Show more specific error message
      const errorMessage = error?.message || error?.details || "Failed to update order. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCancellationReason("");
    setRefundStatus("pending");
    setRefundAmount("");
    setRefundNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "cancellation" ? "Cancel Order" : "Manage Refund"}
          </DialogTitle>
          <DialogDescription>
            {mode === "cancellation"
              ? "Provide a reason for cancelling this order"
              : "Update the refund status and details for this order"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {mode === "cancellation" ? (
            <div className="space-y-2">
              <Label htmlFor="cancellation-reason">Cancellation Reason *</Label>
              <Textarea
                id="cancellation-reason"
                placeholder="Enter the reason for cancellation..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="refund-status">Refund Status *</Label>
                <Select value={refundStatus} onValueChange={(value) => setRefundStatus(value as RefundStatus)}>
                  <SelectTrigger id="refund-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refund-amount">Refund Amount (₹)</Label>
                <Input
                  id="refund-amount"
                  type="number"
                  placeholder="Enter refund amount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Original amount: ₹{((order?.total_amount || 0) / 100).toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refund-notes">Refund Notes</Label>
                <Textarea
                  id="refund-notes"
                  placeholder="Add any additional notes about the refund..."
                  value={refundNotes}
                  onChange={(e) => setRefundNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
