export type UserRole = 'user' | 'admin';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';
export type RefundStatus = 'none' | 'pending' | 'processing' | 'completed' | 'failed';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  weight: string | null;
  category_id: string | null;
  image_url: string | null;
  stock: number;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithImages extends Product {
  images?: ProductImage[];
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: OrderStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  shipping_cost: number | null;
  shipping_region: string | null;
  total_weight_grams: number | null;
  completed_at: string | null;
  cancellation_reason: string | null;
  refund_status: RefundStatus;
  refund_amount: number | null;
  refund_date: string | null;
  refund_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface PolicyPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  image_url: string | null;
  display_order: number;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  address: string;
  email: string;
  phone: string | null;
  fssai: string | null;
  business_hours: string;
  updated_at: string;
}

export interface ShippingConfig {
  id: string;
  region: 'tamil_nadu' | 'other_states';
  weight_from_grams: number;
  weight_to_grams: number | null;
  base_cost: number;
  additional_cost_per_500g: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_featured: boolean;
  featured_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductReviewWithUser extends ProductReview {
  user_email?: string;
  user_name?: string;
  product_name?: string;
  product_image?: string;
}
