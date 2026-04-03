import { useState, useEffect } from "react";
import { api } from "@/db/api";
import type { PolicyPage } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";

export default function PoliciesManagement() {
  const [policies, setPolicies] = useState<PolicyPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPolicy, setEditingPolicy] = useState<PolicyPage | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const data = await api.getPolicyPages();
      setPolicies(data);
    } catch (error) {
      console.error("Failed to load policies:", error);
      toast({
        title: "Error",
        description: "Failed to load policy pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (policy: PolicyPage) => {
    setEditingPolicy(policy);
    setEditContent(policy.content);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingPolicy) return;

    setSaving(true);
    try {
      await api.updatePolicyPage(editingPolicy.id, editContent);
      toast({
        title: "Success",
        description: "Policy page updated successfully",
      });
      setDialogOpen(false);
      loadPolicies();
    } catch (error) {
      console.error("Failed to update policy:", error);
      toast({
        title: "Error",
        description: "Failed to update policy page",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Policy Pages Management
        </h1>
        <p className="text-gray-600">
          Edit and manage your website's policy pages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy) => (
          <Card key={policy.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {policy.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Last updated: {new Date(policy.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                {policy.content.substring(0, 150)}...
              </p>
              <Dialog open={dialogOpen && editingPolicy?.id === policy.id} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleEdit(policy)} className="w-full">
                    Edit Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit {policy.title}</DialogTitle>
                    <DialogDescription>
                      Update the content of this policy page. Use Markdown formatting for better structure.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Content (Markdown supported)
                      </label>
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={20}
                        className="font-mono text-sm"
                        placeholder="Enter policy content..."
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Markdown Formatting Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Headers:</p>
              <code className="block bg-muted p-2 rounded mb-2"># Heading 1</code>
              <code className="block bg-muted p-2 rounded mb-2">## Heading 2</code>
              <code className="block bg-muted p-2 rounded">### Heading 3</code>
            </div>
            <div>
              <p className="font-semibold mb-2">Text Formatting:</p>
              <code className="block bg-muted p-2 rounded mb-2">**Bold text**</code>
              <code className="block bg-muted p-2 rounded mb-2">*Italic text*</code>
              <code className="block bg-muted p-2 rounded">- Bullet point</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}