import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/db/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Package } from "lucide-react";
import { calculateTotalWeight, INDIAN_STATES, getShippingRegion } from "@/lib/shipping";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  const [formData, setFormData] = useState({
    name: profile?.full_name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    state: "", // Empty by default to force user selection
  });

  // Calculate total weight when cart changes
  useEffect(() => {
    const weight = calculateTotalWeight(cart);
    setTotalWeight(weight);
  }, [cart]);

  // Calculate shipping cost when weight or state changes
  useEffect(() => {
    const calculateShipping = async () => {
      if (totalWeight > 0 && formData.state) {
        try {
          const region = getShippingRegion(formData.state);
          const cost = await api.calculateShippingCost(totalWeight, region);
          setShippingCost(cost);
        } catch (error) {
          console.error("Failed to calculate shipping:", error);
          setShippingCost(0);
        }
      }
    };

    calculateShipping();
  }, [totalWeight, formData.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStateChange = (value: string) => {
    setFormData({
      ...formData,
      state: value,
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.state) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number is exactly 10 digits
    if (formData.phone.length !== 10 || !/^[0-9]{10}$/.test(formData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter exactly 10 digits for your mobile number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const items = cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url || undefined,
      }));

      // Debug logging for Razorpay payment flow
      console.log("=== CHECKOUT DEBUG ===");
      console.log("Cart items before payment:", cart.map(item => ({
        name: item.name,
        id: item.id,
        quantity: item.quantity
      })));
      console.log("Items being sent to Razorpay:", items.map(item => ({
        name: item.name,
        quantity: item.quantity
      })));
      console.log("======================");

      const totalAmount = cartTotal + shippingCost;

      const response = await api.createCheckoutSession(items, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      if (response?.orderId && response?.keyId) {
        const options = {
          key: response.keyId,
          amount: Math.round(totalAmount * 100), // Convert to paise and ensure integer
          currency: response.currency,
          name: "MCK Foods",
          description: "Order Payment",
          order_id: response.orderId,
          handler: async function (razorpayResponse: any) {
            try {
              await api.verifyPayment(
                razorpayResponse.razorpay_order_id,
                razorpayResponse.razorpay_payment_id,
                razorpayResponse.razorpay_signature
              );
              clearCart();
              navigate("/payment-success");
            } catch (error: any) {
              toast({
                title: "Payment verification failed",
                description: error.message,
                variant: "destructive",
              });
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#8B4513",
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.message || "Please ensure Razorpay keys are configured correctly",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some products before checkout
            </p>
            <Button onClick={() => navigate("/")}>Browse Products</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center bg-muted px-3 rounded-md border border-input">
                      <span className="text-sm font-medium">+91</span>
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      placeholder="Enter 10 digit mobile number"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      className="flex-1"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, '');
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter exactly 10 digits (without +91)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    placeholder="Enter your complete address"
                  />
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-2">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      📝 Please provide complete address details:
                    </p>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-disc">
                      <li>Door/House Number</li>
                      <li>Street Name</li>
                      <li>Area/Locality</li>
                      <li><strong>District (Mandatory)</strong></li>
                      <li><strong>Pincode (Mandatory)</strong></li>
                    </ul>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
                      Example: 123, Main Street, Gandhi Nagar, Coimbatore District, 641001
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-base font-semibold">
                    State *
                  </Label>
                  <Select
                    value={formData.state}
                    onValueChange={handleStateChange}
                    disabled={loading}
                    required
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state, index) => (
                        <SelectItem key={index} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-2">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      📍 Shipping rates vary by location
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      {formData.state === "" ? (
                        <>Please select your state to see shipping rates</>
                      ) : getShippingRegion(formData.state) === "tamil_nadu" ? (
                        <>Tamil Nadu: ₹70 (0-500g), ₹100 (501g-1kg), +₹40 per 500g above 1kg</>
                      ) : (
                        <>Other States: ₹90 (0-500g), ₹130 (501g-1kg), +₹50 per 500g above 1kg</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total Weight:</span>
                      <span className="font-semibold">{(totalWeight / 1000).toFixed(2)} kg</span>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">₹{shippingCost.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{(cartTotal + shippingCost).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}