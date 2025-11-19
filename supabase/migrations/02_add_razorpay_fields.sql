/*
# Add Razorpay Payment Fields

1. Schema Changes
   - Add `razorpay_order_id` column to orders table
   - Add `razorpay_payment_id` column to orders table
   - Add `razorpay_signature` column to orders table
   - Remove Stripe-specific columns

2. Purpose
   - Support Razorpay payment integration
   - Store Razorpay order and payment IDs for verification
   - Track payment signatures for security
*/

-- Add Razorpay columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_signature text;

-- Drop Stripe columns if they exist
ALTER TABLE orders DROP COLUMN IF EXISTS stripe_session_id;
ALTER TABLE orders DROP COLUMN IF EXISTS stripe_payment_intent_id;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
