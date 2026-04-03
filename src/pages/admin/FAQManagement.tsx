import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/db/api";
import type { FAQ } from "@/types/types";
import { Loader2, Plus, Trash2, Edit } from "lucide-react";
import PageMeta from "@/components/common/PageMeta";
import AdminLayout from "@/components/admin/AdminLayout";

const FAQManagement = () => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const data = await api.getAllFAQs();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const newFAQ = await api.createFAQ({
        question: formData.question,
        answer: formData.answer,
        display_order: formData.display_order || faqs.length + 1,
      });

      if (newFAQ) {
        setFaqs([...faqs, newFAQ]);
        setFormData({ question: "", answer: "", display_order: 0 });
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "FAQ created successfully",
        });
      }
    } catch (error) {
      console.error("Error creating FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (faq: FAQ) => {
    try {
      await api.updateFAQ(faq.id, {
        question: faq.question,
        answer: faq.answer,
        display_order: faq.display_order,
        is_active: faq.is_active,
      });

      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await api.deleteFAQ(id);
      setFaqs(faqs.filter((f) => f.id !== id));
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (faq: FAQ) => {
    const updated = { ...faq, is_active: !faq.is_active };
    setFaqs(faqs.map((f) => (f.id === faq.id ? updated : f)));
    await handleUpdate(updated);
  };

  const updateFAQ = (id: string, field: keyof FAQ, value: string | number | boolean) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageMeta title="FAQ Management" description="Manage frequently asked questions" />
      <AdminLayout>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New FAQ</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-question">Question</Label>
                  <Input
                    id="new-question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter question"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-answer">Answer</Label>
                  <Textarea
                    id="new-answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Enter answer"
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-order">Display Order</Label>
                  <Input
                    id="new-order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    placeholder="Display order"
                  />
                </div>
                <Button onClick={handleCreate} className="w-full">
                  Create FAQ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">FAQ #{faq.display_order}</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${faq.id}`} className="text-sm">Active</Label>
                      <Switch
                        id={`active-${faq.id}`}
                        checked={faq.is_active}
                        onCheckedChange={() => handleToggleActive(faq)}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`question-${faq.id}`}>Question</Label>
                  <Input
                    id={`question-${faq.id}`}
                    value={faq.question}
                    onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`answer-${faq.id}`}>Answer</Label>
                  <Textarea
                    id={`answer-${faq.id}`}
                    value={faq.answer}
                    onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`order-${faq.id}`}>Display Order</Label>
                  <Input
                    id={`order-${faq.id}`}
                    type="number"
                    value={faq.display_order}
                    onChange={(e) => updateFAQ(faq.id, "display_order", parseInt(e.target.value))}
                  />
                </div>
                <Button onClick={() => handleUpdate(faq)}>
                  <Edit className="h-4 w-4 mr-2" />
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

export default FAQManagement;