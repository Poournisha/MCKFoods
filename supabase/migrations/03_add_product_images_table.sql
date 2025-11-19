/*
# Add Product Images Support

1. New Tables
   - `product_images` table for storing multiple images per product
     - `id` (uuid, primary key)
     - `product_id` (uuid, foreign key to products)
     - `image_url` (text, not null)
     - `display_order` (integer, default 0)
     - `is_primary` (boolean, default false)
     - `created_at` (timestamptz, default now())

2. Purpose
   - Support multiple images per product
   - Allow admins to upload and manage product images
   - Set primary image for product display
   - Order images for product gallery

3. Security
   - Public read access for product images
   - Admin-only write access
*/

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON product_images(product_id, display_order);

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view product images" ON product_images
  FOR SELECT USING (true);

-- Allow admins to manage product images
CREATE POLICY "Admins can insert product images" ON product_images
  FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update product images" ON product_images
  FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete product images" ON product_images
  FOR DELETE TO authenticated
  USING (is_admin(auth.uid()));
