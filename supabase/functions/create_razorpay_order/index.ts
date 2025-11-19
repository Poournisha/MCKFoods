import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { items, customerInfo }: { items: OrderItem[]; customerInfo: CustomerInfo } = await req.json();

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayOrder = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: {
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          customer_address: customerInfo.address,
        },
      }),
    });

    if (!razorpayOrder.ok) {
      const errorText = await razorpayOrder.text();
      throw new Error(`Razorpay API error: ${errorText}`);
    }

    const orderData = await razorpayOrder.json();

    const orderItems = items.map((item) => ({
      name: item.name,
      price: Math.round(item.price * 100),
      quantity: item.quantity,
      image_url: item.image_url,
    }));

    const { data: dbOrder, error: dbError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: amountInPaise,
        status: "pending",
        items: orderItems,
        razorpay_order_id: orderData.id,
        customer_name: customerInfo.name,
        customer_email: user.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          orderId: orderData.id,
          amount: amountInPaise,
          currency: "INR",
          keyId: razorpayKeyId,
          dbOrderId: dbOrder.id,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to create order",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
