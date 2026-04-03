import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/db/api";
import type { Product, Category, ProductImage } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Loader2, X, Star, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/ImageUpload";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ProductsManagement() {
  const { profile, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    category_id: "",
    image_url: "",
    stock: "100",
    priority: "999",
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.getAllProductsForAdmin(),
        api.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProductImages = async (productId: string) => {
    try {
      const images = await api.getProductImages(productId);
      setProductImages(images);
    } catch (error) {
      console.error("Failed to load product images:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: Number.parseFloat(formData.price),
        weight: formData.weight || null,
        category_id: formData.category_id || null,
        image_url: formData.image_url || null,
        stock: Number.parseInt(formData.stock),
        priority: Number.parseInt(formData.priority),
        is_active: formData.is_active,
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
        toast({ title: "Product updated successfully" });
      } else {
        await api.createProduct(productData);
        toast({ title: "Product created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.deleteProduct(id);
      toast({ title: "Product deleted successfully" });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      weight: product.weight || "",
      category_id: product.category_id || "",
      image_url: product.image_url || "",
      stock: product.stock.toString(),
      priority: product.priority.toString(),
      is_active: product.is_active,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      weight: "",
      category_id: "",
      image_url: "",
      stock: "100",
      priority: "999",
      is_active: true,
    });
    setEditingProduct(null);
  };

  const handleManageImages = async (product: Product) => {
    setEditingProduct(product);
    await loadProductImages(product.id);
    setImageDialogOpen(true);
  };

  const handleAddImage = async (file: File) => {
    if (!editingProduct) {
      toast({
        title: "Error",
        description: "No product selected",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await api.uploadProductImage(file);
      
      const displayOrder = productImages.length;
      const isPrimary = productImages.length === 0;
      await api.addProductImage(editingProduct.id, imageUrl, isPrimary, displayOrder);
      
      toast({ title: "Image uploaded successfully" });
      await loadProductImages(editingProduct.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await api.deleteProductImage(imageId);
      toast({ title: "Image deleted successfully" });
      if (editingProduct) {
        await loadProductImages(editingProduct.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!editingProduct) return;

    try {
      await api.setPrimaryImage(editingProduct.id, imageId);
      toast({ title: "Primary image updated" });
      await loadProductImages(editingProduct.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  // Check admin access after loading is complete
  if (!profile || profile.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Products Management</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g., 200g"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="priority">Display Priority *</Label>
                <Input
                  id="priority"
                  type="number"
                  min="1"
                  max="999"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first (1-999)
                </p>
              </div>

              <div>
                <Label htmlFor="image_url">Primary Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can add more images after creating the product
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active">Available (visible to customers)</Label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                {product.is_active && (
                  <Badge variant="default">Available</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground line-clamp-2">{product.description}</p>
                <p className="font-semibold text-lg text-primary">₹{product.price}</p>
                <p className="text-muted-foreground">Stock: {product.stock}</p>
                {product.weight && <p className="text-muted-foreground">Weight: {product.weight}</p>}
                <p className="text-muted-foreground">Priority: {product.priority}</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleManageImages(product)}>
                <ImageIcon className="h-4 w-4 mr-1" />
                Images
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Product Images - {editingProduct?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Upload Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Upload New Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors">
                <ImageUpload onUpload={handleAddImage} />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Supports: JPG, PNG, WEBP (Max 1MB)
                </p>
              </div>
            </div>

            {/* Images Grid */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Product Images ({productImages.length})
              </Label>
              
              {productImages.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-medium">No images added yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your first product image above
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Instructions */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex gap-2 text-sm text-blue-900 dark:text-blue-100">
                      <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-medium">Image Management Tips:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-blue-800 dark:text-blue-200">
                          <li>Click the star icon to set an image as primary</li>
                          <li>Primary image appears first in the product gallery</li>
                          <li>Drag images to reorder them (coming soon)</li>
                          <li>Click the X icon to delete an image</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {productImages
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((image, index) => (
                        <div
                          key={image.id}
                          className="relative group border-2 rounded-lg overflow-hidden hover:border-primary transition-all"
                          style={{
                            borderColor: image.is_primary ? "hsl(var(--primary))" : "hsl(var(--border))",
                          }}
                        >
                          {/* Image */}
                          <div className="aspect-square bg-muted">
                            <img
                              src={image.image_url}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Primary Badge */}
                          {image.is_primary && (
                            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground shadow-lg">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Primary
                            </Badge>
                          )}

                          {/* Display Order Badge */}
                          <Badge
                            variant="secondary"
                            className="absolute bottom-2 left-2 bg-black/60 text-white border-0"
                          >
                            #{index + 1}
                          </Badge>

                          {/* Action Buttons */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!image.is_primary && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 shadow-lg"
                                onClick={() => handleSetPrimaryImage(image.id)}
                                title="Set as primary image"
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0 shadow-lg"
                              onClick={() => handleDeleteImage(image.id)}
                              title="Delete image"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                        </div>
                      ))}
                  </div>

                  {/* Summary */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                    <span>Total images: {productImages.length}</span>
                    <span>
                      Primary: {productImages.find((img) => img.is_primary)?.display_order !== undefined
                        ? `#${productImages.find((img) => img.is_primary)!.display_order + 1}`
                        : "None"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setImageDialogOpen(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}