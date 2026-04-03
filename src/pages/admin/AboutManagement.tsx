import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { api } from "@/db/api";
import type { AboutSection } from "@/types/types";
import { Loader2, Upload, X } from "lucide-react";
import PageMeta from "@/components/common/PageMeta";
import AdminLayout from "@/components/admin/AdminLayout";

const AboutManagement = () => {
  const { toast } = useToast();
  const { profile, loading: authLoading } = useAuth();
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const data = await api.getAboutSections();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast({
        title: "Error",
        description: "Failed to load about sections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (sectionId: string, file: File) => {
    if (file.size > 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be smaller than 1MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(sectionId);
    try {
      const imageUrl = await api.uploadAboutImage(file);
      
      await api.updateAboutSection(sectionId, { image_url: imageUrl });
      
      setSections(sections.map(s => 
        s.id === sectionId ? { ...s, image_url: imageUrl } : s
      ));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = async (sectionId: string) => {
    try {
      await api.updateAboutSection(sectionId, { image_url: null });
      
      setSections(sections.map(s => 
        s.id === sectionId ? { ...s, image_url: null } : s
      ));

      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error("Error removing image:", error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (section: AboutSection) => {
    setSaving(section.id);
    try {
      await api.updateAboutSection(section.id, {
        title: section.title,
        content: section.content,
      });

      toast({
        title: "Success",
        description: "Section updated successfully",
      });
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const updateSection = (id: string, field: keyof AboutSection, value: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
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
      <AdminLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to access this page.</p>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageMeta title="About Us Management" description="Manage about us page content" />
      <AdminLayout>
        <h1 className="text-3xl font-bold mb-8">About Us Management</h1>

        <div className="space-y-8">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.section_key.replace(/_/g, " ").toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor={`title-${section.id}`}>Title</Label>
                  <Input
                    id={`title-${section.id}`}
                    value={section.title}
                    onChange={(e) => updateSection(section.id, "title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`content-${section.id}`}>Content</Label>
                  <Textarea
                    id={`content-${section.id}`}
                    value={section.content}
                    onChange={(e) => updateSection(section.id, "content", e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Section Image</Label>
                  {section.image_url ? (
                    <div className="space-y-4">
                      <img
                        src={section.image_url}
                        alt={section.title}
                        className="w-full max-w-md rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(section.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(section.id, file);
                        }}
                        disabled={uploading === section.id}
                        className="hidden"
                        id={`image-${section.id}`}
                      />
                      <Label
                        htmlFor={`image-${section.id}`}
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {uploading === section.id ? (
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : (
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {uploading === section.id ? "Uploading..." : "Click to upload image (max 1MB)"}
                        </span>
                      </Label>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSave(section)}
                  disabled={saving === section.id}
                >
                  {saving === section.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminLayout>
    </>
  );
};

export default AboutManagement;
