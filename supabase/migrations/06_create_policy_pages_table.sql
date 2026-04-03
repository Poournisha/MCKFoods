/*
# Create Policy Pages Table

## Purpose
This migration creates a table to store editable policy pages (Terms & Conditions, Privacy Policy, etc.)
that can be managed through the admin panel.

## Tables Created

### `policy_pages`
Stores policy page content that can be edited by administrators.

**Columns:**
- `id` (uuid, primary key): Unique identifier for each policy page
- `slug` (text, unique, not null): URL-friendly identifier (e.g., 'terms-conditions', 'privacy-policy')
- `title` (text, not null): Display title of the policy page
- `content` (text, not null): Full content of the policy (supports markdown or HTML)
- `created_at` (timestamptz): Timestamp when the policy was created
- `updated_at` (timestamptz): Timestamp when the policy was last updated

## Security
- No RLS enabled - public read access for all users
- Admin users can edit through admin panel
- All users can view policy pages without authentication

## Initial Data
Inserts default content for:
1. Terms & Conditions
2. Privacy Policy
3. Refund and Returns Policy
4. Shipping Policy
*/

-- Create policy_pages table
CREATE TABLE IF NOT EXISTS policy_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on slug for faster lookups
CREATE INDEX idx_policy_pages_slug ON policy_pages(slug);

-- Insert default policy pages
INSERT INTO policy_pages (slug, title, content) VALUES
(
  'terms-conditions',
  'Terms & Conditions',
  E'# Terms & Conditions\n\n## 1. Introduction\n\nWelcome to MCK Foods. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions.\n\n## 2. Use of Website\n\nYou may use our website for lawful purposes only. You agree not to use our website:\n- In any way that breaches any applicable local, national, or international law or regulation\n- To transmit any unsolicited or unauthorized advertising or promotional material\n\n## 3. Product Information\n\nWe strive to provide accurate product information. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.\n\n## 4. Pricing\n\nAll prices are in Indian Rupees (INR) and are subject to change without notice. We reserve the right to modify or discontinue products without prior notice.\n\n## 5. Orders and Payment\n\n- All orders are subject to acceptance and availability\n- Payment must be made at the time of ordering\n- We accept payments through Razorpay payment gateway\n\n## 6. Intellectual Property\n\nAll content on this website, including text, graphics, logos, and images, is the property of MCK Foods and is protected by copyright laws.\n\n## 7. Limitation of Liability\n\nMCK Foods shall not be liable for any indirect, incidental, special, or consequential damages arising out of the use or inability to use our products or services.\n\n## 8. Changes to Terms\n\nWe reserve the right to modify these terms at any time. Please review these terms periodically for changes.\n\n## 9. Contact Information\n\nFor questions about these Terms & Conditions, please contact us at info@mckfoods.com.\n\nLast Updated: January 2025'
),
(
  'privacy-policy',
  'Privacy Policy',
  E'# Privacy Policy\n\n## 1. Information We Collect\n\nWe collect information that you provide directly to us, including:\n- Name and contact information\n- Email address and phone number\n- Shipping and billing addresses\n- Payment information (processed securely through Razorpay)\n- Order history and preferences\n\n## 2. How We Use Your Information\n\nWe use the information we collect to:\n- Process and fulfill your orders\n- Send you order confirmations and updates\n- Respond to your comments and questions\n- Improve our products and services\n- Send you marketing communications (with your consent)\n\n## 3. Information Sharing\n\nWe do not sell, trade, or rent your personal information to third parties. We may share your information with:\n- Service providers who assist in our operations\n- Payment processors (Razorpay) for transaction processing\n- Shipping companies for order delivery\n\n## 4. Data Security\n\nWe implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.\n\n## 5. Cookies\n\nWe use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.\n\n## 6. Your Rights\n\nYou have the right to:\n- Access your personal information\n- Correct inaccurate information\n- Request deletion of your information\n- Opt-out of marketing communications\n\n## 7. Children''s Privacy\n\nOur services are not directed to children under 13. We do not knowingly collect information from children under 13.\n\n## 8. Changes to Privacy Policy\n\nWe may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.\n\n## 9. Contact Us\n\nFor questions about this Privacy Policy, please contact us at:\n- Email: info@mckfoods.com\n- Phone: +91 XXXXXXXXXX\n\nLast Updated: January 2025'
),
(
  'refund-returns-policy',
  'Refund and Returns Policy',
  E'# Refund and Returns Policy\n\n## 1. Return Eligibility\n\nWe want you to be completely satisfied with your purchase. You may return products within **7 days** of delivery if:\n- The product is damaged or defective\n- You received the wrong product\n- The product is significantly different from the description\n\n## 2. Non-Returnable Items\n\nFor hygiene and safety reasons, the following items cannot be returned:\n- Products with broken seals or opened packaging\n- Products that have been used or consumed\n- Products past the return window\n\n## 3. Return Process\n\nTo initiate a return:\n1. Contact our customer service at info@mckfoods.com within 7 days of delivery\n2. Provide your order number and reason for return\n3. Include photos if the product is damaged or defective\n4. Wait for return authorization and instructions\n\n## 4. Refund Process\n\nOnce we receive and inspect your return:\n- Approved refunds will be processed within **5-7 business days**\n- Refunds will be issued to the original payment method\n- You will receive an email confirmation once the refund is processed\n\n## 5. Shipping Costs\n\n- Return shipping costs are the customer''s responsibility unless the product is defective or we made an error\n- Original shipping charges are non-refundable\n- We recommend using a trackable shipping service\n\n## 6. Exchanges\n\nWe do not offer direct exchanges. If you need a different product:\n1. Return the original item for a refund\n2. Place a new order for the desired product\n\n## 7. Damaged or Defective Products\n\nIf you receive a damaged or defective product:\n- Contact us immediately with photos\n- We will arrange for a replacement or full refund\n- Return shipping will be covered by MCK Foods\n\n## 8. Contact Us\n\nFor return or refund inquiries:\n- Email: info@mckfoods.com\n- Phone: +91 XXXXXXXXXX\n- Support Hours: Mon-Sat, 9:00 AM - 6:00 PM\n\nLast Updated: January 2025'
),
(
  'shipping-policy',
  'Shipping Policy',
  E'# Shipping Policy\n\n## 1. Shipping Coverage\n\nWe currently ship to all locations within India. International shipping is not available at this time.\n\n## 2. Shipping Costs\n\n- **Free Shipping**: On orders above ₹500\n- **Standard Shipping**: ₹50 for orders below ₹500\n- Shipping costs are calculated at checkout\n\n## 3. Delivery Time\n\n**Standard Delivery:**\n- Metro cities: 3-5 business days\n- Other cities: 5-7 business days\n- Remote areas: 7-10 business days\n\n*Note: Delivery times are estimates and may vary due to unforeseen circumstances.*\n\n## 4. Order Processing\n\n- Orders are processed within 1-2 business days\n- Orders placed on weekends or holidays will be processed on the next business day\n- You will receive a confirmation email once your order is shipped\n\n## 5. Tracking Your Order\n\n- A tracking number will be provided via email once your order ships\n- You can track your order status in the "My Orders" section of your account\n- For tracking assistance, contact our customer service\n\n## 6. Shipping Restrictions\n\nWe cannot ship to:\n- P.O. Boxes (in some cases)\n- Military addresses (APO/FPO)\n- Areas with delivery restrictions\n\n## 7. Failed Delivery Attempts\n\nIf delivery fails due to:\n- Incorrect address provided\n- Recipient unavailable\n- Refusal to accept delivery\n\nThe package will be returned to us, and you may be charged for re-shipping.\n\n## 8. Lost or Damaged Shipments\n\n- If your package is lost or damaged during shipping, please contact us immediately\n- We will work with the shipping carrier to resolve the issue\n- A replacement or refund will be provided for confirmed lost or damaged shipments\n\n## 9. Order Modifications\n\n- Contact us immediately if you need to modify your shipping address\n- Once an order is shipped, the address cannot be changed\n- Cancellations may be possible if the order hasn''t been shipped yet\n\n## 10. Contact Us\n\nFor shipping inquiries:\n- Email: info@mckfoods.com\n- Phone: +91 XXXXXXXXXX\n- Support Hours: Mon-Sat, 9:00 AM - 6:00 PM\n\nLast Updated: January 2025'
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_policy_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_policy_pages_updated_at
  BEFORE UPDATE ON policy_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_policy_pages_updated_at();
