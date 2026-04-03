import { supabase } from "./supabase";
import type { Product, Category, Order, Profile, OrderItem, PolicyPage, AboutSection, FAQ, ContactInfo, ShippingConfig, ProductReview, ProductReviewWithUser } from "@/types/types";

export const api = {
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getAllProductsForAdmin() {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getProductById(id: string) {
    console.log("=== GET PRODUCT BY ID ===");
    console.log("Product ID:", id);
    
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("id", id)
      .maybeSingle();

    console.log("Query result - data:", data);
    console.log("Query result - error:", error);

    if (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
    
    if (!data) {
      console.warn("Product not found for ID:", id);
    }
    
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
      .order("priority", { ascending: true })
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

  async getPendingOrdersCount() {
    const { count, error } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    if (error) throw error;
    return count || 0;
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

  async getProductImages(productId: string) {
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async addProductImage(productId: string, imageUrl: string, isPrimary: boolean = false, displayOrder: number = 0) {
    const { data, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        image_url: imageUrl,
        is_primary: isPrimary,
        display_order: displayOrder,
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProductImage(imageId: string, updates: { image_url?: string; is_primary?: boolean; display_order?: number }) {
    const { data, error } = await supabase
      .from("product_images")
      .update(updates)
      .eq("id", imageId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async deleteProductImage(imageId: string) {
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (error) throw error;
  },

  async setPrimaryImage(productId: string, imageId: string) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    const { data, error } = await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", imageId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
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

  async uploadProductImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from("app-7ntoux6y51c1_product_images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("app-7ntoux6y51c1_product_images")
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async uploadAboutImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `about/${fileName}`;

    const { data, error } = await supabase.storage
      .from("app-7ntoux6y51c1_product_images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("app-7ntoux6y51c1_product_images")
      .getPublicUrl(data.path);

    return publicUrl;
  },

  async deleteProductImageFile(imageUrl: string) {
    const urlParts = imageUrl.split("/");
    const bucketIndex = urlParts.findIndex(part => part === "app-7ntoux6y51c1_product_images");
    
    if (bucketIndex === -1) return;

    const filePath = urlParts.slice(bucketIndex + 1).join("/");

    const { error } = await supabase.storage
      .from("app-7ntoux6y51c1_product_images")
      .remove([filePath]);

    if (error) throw error;
  },

  // Policy Pages
  async getPolicyPages() {
    const { data, error } = await supabase
      .from("policy_pages")
      .select("*")
      .order("title", { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getPolicyPageBySlug(slug: string) {
    const { data, error } = await supabase
      .from("policy_pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updatePolicyPage(id: string, content: string) {
    const { data, error } = await supabase
      .from("policy_pages")
      .update({ content })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAboutSections() {
    const { data, error } = await supabase
      .from("about_sections")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async updateAboutSection(id: string, updates: { title?: string; content?: string; image_url?: string | null }) {
    const { data, error } = await supabase
      .from("about_sections")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getFAQs() {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getAllFAQs() {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createFAQ(faq: { question: string; answer: string; display_order: number }) {
    const { data, error } = await supabase
      .from("faqs")
      .insert(faq)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateFAQ(id: string, updates: { question?: string; answer?: string; display_order?: number; is_active?: boolean }) {
    const { data, error } = await supabase
      .from("faqs")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async deleteFAQ(id: string) {
    const { error } = await supabase
      .from("faqs")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getContactInfo() {
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateContactInfo(id: string, updates: { address?: string; email?: string; phone?: string; fssai?: string; business_hours?: string }) {
    const { data, error } = await supabase
      .from("contact_info")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Shipping Configuration
  async getShippingConfig() {
    const { data, error } = await supabase
      .from("shipping_config")
      .select("*")
      .eq("is_active", true)
      .order("region", { ascending: true })
      .order("weight_from_grams", { ascending: true });

    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async updateShippingConfig(id: string, updates: { base_cost?: number; additional_cost_per_500g?: number; is_active?: boolean }) {
    const { data, error } = await supabase
      .from("shipping_config")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async calculateShippingCost(weightGrams: number, region: string): Promise<number> {
    const { data, error } = await supabase
      .rpc("calculate_shipping_cost", {
        weight_grams: weightGrams,
        region: region,
      });

    if (error) throw error;
    return data || 0;
  },

  async updateOrderCancellation(orderId: string, cancellationReason: string) {
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        cancellation_reason: cancellationReason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateOrderRefundStatus(
    orderId: string,
    refundStatus: string,
    refundAmount?: number,
    refundNotes?: string
  ) {
    const updates: Record<string, unknown> = {
      refund_status: refundStatus,
      updated_at: new Date().toISOString(),
    };

    if (refundAmount !== undefined) {
      updates.refund_amount = refundAmount;
    }

    if (refundNotes !== undefined) {
      updates.refund_notes = refundNotes;
    }

    if (refundStatus === "completed") {
      updates.refund_date = new Date().toISOString();
      updates.status = "refunded";
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "completed") {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // ============================================
  // PRODUCT REVIEWS
  // ============================================

  async getProductReviews(productId: string): Promise<ProductReviewWithUser[]> {
    console.log("getProductReviews called for product:", productId);
    
    const { data, error } = await supabase
      .from("product_reviews")
      .select(`
        *,
        profiles(email, full_name)
      `)
      .eq("product_id", productId)
      .order("is_featured", { ascending: false })
      .order("featured_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    console.log("getProductReviews result:", { count: data?.length || 0, error });

    if (error) throw error;

    const reviews = Array.isArray(data) ? data : [];
    return reviews.map((review: any) => ({
      ...review,
      user_email: review.profiles?.email,
      user_name: review.profiles?.full_name || review.profiles?.email?.split('@')[0],
    }));
  },

  async getAllReviewsForAdmin(): Promise<ProductReviewWithUser[]> {
    const { data, error } = await supabase
      .from("product_reviews")
      .select(`
        *,
        profiles(email, full_name),
        products(name, image_url)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const reviews = Array.isArray(data) ? data : [];
    return reviews.map((review: any) => ({
      ...review,
      user_email: review.profiles?.email,
      user_name: review.profiles?.full_name || review.profiles?.email?.split('@')[0],
      product_name: review.products?.name,
      product_image: review.products?.image_url,
    }));
  },

  async getAverageRating(productId: string): Promise<number> {
    console.log("getAverageRating called for product:", productId);
    const { data, error } = await supabase
      .rpc("get_product_average_rating", { p_product_id: productId });

    console.log("getAverageRating result:", { data, error });
    if (error) throw error;
    return data || 0;
  },

  async getReviewCount(productId: string): Promise<number> {
    console.log("getReviewCount called for product:", productId);
    const { data, error } = await supabase
      .rpc("get_product_review_count", { p_product_id: productId });

    console.log("getReviewCount result:", { data, error });
    if (error) throw error;
    return data || 0;
  },

  async createReview(review: Omit<ProductReview, "id" | "created_at" | "updated_at" | "is_featured" | "featured_at">): Promise<ProductReview> {
    console.log("Creating review with data:", review);
    
    // Check authentication state
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Current session:", session ? "Authenticated" : "Not authenticated");
    console.log("Session user ID:", session?.user?.id);
    console.log("Review user ID:", review.user_id);
    
    const { data, error } = await supabase
      .from("product_reviews")
      .insert(review)
      .select()
      .single();

    console.log("Create review result:", { data, error });
    
    if (error) {
      console.error("Create review error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    return data;
  },

  async updateReview(reviewId: string, updates: Partial<Pick<ProductReview, "rating" | "comment">>): Promise<ProductReview> {
    const { data, error } = await supabase
      .from("product_reviews")
      .update(updates)
      .eq("id", reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", reviewId);

    if (error) throw error;
  },

  async getUserReviewForProduct(productId: string, userId: string): Promise<ProductReview | null> {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async toggleReviewFeatured(reviewId: string, isFeatured: boolean): Promise<void> {
    const { error } = await supabase
      .rpc("toggle_review_featured", { 
        p_review_id: reviewId, 
        p_is_featured: isFeatured 
      });

    if (error) throw error;
  },
};