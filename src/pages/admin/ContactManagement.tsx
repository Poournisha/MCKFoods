import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/db/api";
import type { ContactInfo } from "@/types/types";
import { Loader2 } from "lucide-react";
import PageMeta from "@/components/common/PageMeta";
import AdminLayout from "@/components/admin/AdminLayout";

const ContactManagement = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const data = await api.getContactInfo();
      setContactInfo(data);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      toast({
        title: "Error",
        description: "Failed to load contact information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contactInfo) return;

    setSaving(true);
    try {
      await api.updateContactInfo(contactInfo.id, {
        address: contactInfo.address,
        email: contactInfo.email,
        phone: contactInfo.phone || undefined,
        fssai: contactInfo.fssai || undefined,
        business_hours: contactInfo.business_hours,
      });

      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
    } catch (error) {
      console.error("Error updating contact info:", error);
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ContactInfo, value: string) => {
    if (!contactInfo) return;
    setContactInfo({ ...contactInfo, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <AdminLayout>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No contact information found</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageMeta title="Contact Management" description="Manage contact information" />
      <AdminLayout>
        <h1 className="text-3xl font-bold mb-8">Contact Information Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={contactInfo.address}
                onChange={(e) => updateField("address", e.target.value)}
                rows={3}
                placeholder="Enter business address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="contact@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={contactInfo.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+91 1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fssai">FSSAI License Number</Label>
              <Input
                id="fssai"
                value={contactInfo.fssai || ""}
                onChange={(e) => updateField("fssai", e.target.value)}
                placeholder="FSSAI License Number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_hours">Business Hours *</Label>
              <Textarea
                id="business_hours"
                value={contactInfo.business_hours}
                onChange={(e) => updateField("business_hours", e.target.value)}
                rows={3}
                placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
              />
            </div>

            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    </>
  );
};

export default ContactManagement;