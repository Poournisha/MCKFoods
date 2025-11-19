/*
# Create Initial E-commerce Schema

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `full_name` (text)
- `phone` (text)
- `address` (text)
- `role` (user_role enum: 'user', 'admin')
- `created_at` (timestamptz)

### categories
- `id` (uuid, primary key)
- `name` (text, unique, not null)
- `description` (text)
- `created_at` (timestamptz)

### products
- `id` (uuid, primary key)
- `name` (text, not null)
- `description` (text)
- `price` (numeric, not null)
- `weight` (text)
- `category_id` (uuid, references categories)
- `image_url` (text)
- `stock` (integer, default 100)
- `is_active` (boolean, default true)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### orders
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `items` (jsonb, not null)
- `total_amount` (numeric, not null)
- `currency` (text, default 'inr')
- `status` (order_status enum: 'pending', 'completed', 'cancelled', 'refunded')
- `stripe_session_id` (text, unique)
- `stripe_payment_intent_id` (text)
- `customer_email` (text)
- `customer_name` (text)
- `customer_phone` (text)
- `customer_address` (text)
- `completed_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## 2. Security

- Enable RLS on all tables
- Profiles: Users can view/update own profile; admins have full access
- Categories: Public read access; admin-only write access
- Products: Public read access; admin-only write access
- Orders: Users can view own orders; admins have full access; service role can manage all
- First registered user becomes admin automatically via trigger

## 3. Storage

- Create product_images bucket for storing product photos
- Public read access, authenticated users can upload

## 4. Initial Data

- Insert 3 product categories
- Insert 7 products with pricing
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  phone text,
  address text,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  weight text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  stock integer DEFAULT 100 CHECK (stock >= 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  items jsonb NOT NULL,
  total_amount numeric(12,2) NOT NULL CHECK (total_amount >= 0),
  currency text NOT NULL DEFAULT 'inr',
  status order_status NOT NULL DEFAULT 'pending'::order_status,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  customer_email text,
  customer_name text,
  customer_phone text,
  customer_address text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_stripe_session_id ON orders(stripe_session_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) 
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (is_admin(auth.uid()));

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin(auth.uid()));

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (is_admin(auth.uid()));

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Service role can manage orders" ON orders
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Trigger to auto-create profile and set first user as admin
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    INSERT INTO profiles (id, email, role)
    VALUES (
      NEW.id,
      NEW.email,
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-7ntoux6y51c1_product_images', 'app-7ntoux6y51c1_product_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'app-7ntoux6y51c1_product_images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'app-7ntoux6y51c1_product_images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'app-7ntoux6y51c1_product_images' AND is_admin(auth.uid()));

-- Insert categories
INSERT INTO categories (name, description) VALUES
  ('Ragi-based Products', 'Nutritious ragi milk powder products for health and wellness'),
  ('Dal-based Products', 'Traditional dal-based kanji and kali powders'),
  ('Banana Powder Products', 'Pure banana powder products for natural nutrition');

-- Insert products
INSERT INTO products (name, description, price, weight, category_id, image_url) VALUES
  (
    'Ragi Milk Powder',
    'Pure ragi milk powder rich in calcium and iron, perfect for growing children and adults',
    120.00,
    '200g',
    (SELECT id FROM categories WHERE name = 'Ragi-based Products'),
    'https://miaoda-site-img.s3cdn.medo.dev/images/b204a149-8daf-4cd5-96b4-89d3c765b99f.jpg'
  ),
  (
    'Ragi Milk Powder with Beetroot and Carrot Powder',
    'Enhanced ragi milk powder with the goodness of beetroot and carrot for added nutrition',
    200.00,
    '200g',
    (SELECT id FROM categories WHERE name = 'Ragi-based Products'),
    'https://miaoda-site-img.s3cdn.medo.dev/images/aee543e9-23c0-4926-af0a-03917b56b20e.jpg'
  ),
  (
    'Ragi Milk Powder with Sweet Potato Powder',
    'Delicious blend of ragi and sweet potato powder for natural sweetness and nutrition',
    200.00,
    '200g',
    (SELECT id FROM categories WHERE name = 'Ragi-based Products'),
    'https://miaoda-site-img.s3cdn.medo.dev/images/6b0667d6-0cc2-4689-9703-fbbfeb55fef8.jpg'
  ),
  (
    'Ragi Milk Powder with Nenthiram Powder',
    'Traditional ragi milk powder combined with nenthiram banana powder',
    130.00,
    '200g',
    (SELECT id FROM categories WHERE name = 'Ragi-based Products'),
    'https://miaoda-site-img.s3cdn.medo.dev/images/c8ce4fbc-27b8-4330-b437-5e8c6412887c.jpg'
  ),
  (
    'Black Urad Dal Kanji Powder',
    'Nutritious black urad dal kanji powder for traditional health drinks',
    80.00,
    '200g',
    (SELECT id FROM categories WHERE name = 'Dal-based Products'),
    'https://miaoda-site-img.s3cdn.medo.dev/images/4d7e9dd5-bc42-4198-a713-4ea0f8325d67.jpg'
  ),
  (
    'Black Urad Dal Kali Powder',
    'Premium black urad dal kali powder for authentic South Indian recipes',
    70.00,
    '200g',
    (SELECT id FROM categories WHERE name = 'Dal-based Products'),
    'https://miaoda-site-img.s3cdn.medo.dev/images/f7e9dace-ac65-4134-8674-1b9977002c81.jpg'
  ),
  (
    'Pure Nenthiram Banana Powder',
    'Pure nenthiram banana powder packed with natural nutrients and flavor',
    150.00,
    '200g',
    (SELECT id FROM categories WHERE name = 'Banana Powder Products'),
    'https://miaoda-site-img.s3cdn.medo.dev/images/79634929-79b6-40bb-9b5f-d5c7d9d792d9.jpg'
  );
