import { supabase } from "./supabase";
import type { Product, Category, Order, Profile, OrderItem } from "@/types/types";

export const api = {
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getProductsByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async searchProducts(query: string) {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .ilike("name", `%${query}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getAllOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getOrderById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAllProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async updateUserRole(userId: string, role: 'user' | 'admin') {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: Partial<Category>) {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async createCheckoutSession(items: OrderItem[], customerInfo?: { name?: string; phone?: string; address?: string }) {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await supabase.functions.invoke("create_razorpay_order", {
      body: JSON.stringify({
        items,
        customerInfo,
      }),
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
    });

    if (response.error) {
      const errorMsg = await response.error?.context?.text();
      throw new Error(errorMsg || "Failed to create checkout session");
    }

    return response.data;
  },

  async verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await supabase.functions.invoke("verify_razorpay_payment", {
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }),
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
    });

    if (response.error) {
      const errorMsg = await response.error?.context?.text();
      throw new Error(errorMsg || "Failed to verify payment");
    }

    return response.data;
  },
};
