/*
# Create Product Images Storage Bucket

1. Purpose
   - Store product images uploaded by admins
   - Support multiple images per product
   - Public read access for all users
   - Admin-only upload access

2. Bucket Configuration
   - Name: app-7ntoux6y51c1_product_images
   - Public: true (images visible to everyone)
   - File size limit: 1MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

3. Security
   - Public read access (anyone can view images)
   - Admin-only write access (only admins can upload/delete)
*/

-- Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-7ntoux6y51c1_product_images',
  'app-7ntoux6y51c1_product_images',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 1048576,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- Storage policies are already created in previous migrations
