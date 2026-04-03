import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/db/api";
import type { PolicyPage } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageMeta from "@/components/common/PageMeta";

export default function PolicyPageView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<PolicyPage | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      loadPolicy(slug);
    }
  }, [slug]);

  const loadPolicy = async (policySlug: string) => {
    try {
      const data = await api.getPolicyPageBySlug(policySlug);
      setPolicy(data);
    } catch (error) {
      console.error("Failed to load policy:", error);
      toast({
        title: "Error",
        description: "Failed to load policy page",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-xl font-semibold text-gray-700 mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={key++} className="ml-4 text-gray-600">
            {line.substring(2)}
          </li>
        );
      } else if (line.match(/^\d+\. /)) {
        elements.push(
          <li key={key++} className="ml-4 text-gray-600">
            {line.replace(/^\d+\. /, '')}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2" />);
      } else if (line.startsWith('*') && line.endsWith('*')) {
        elements.push(
          <p key={key++} className="text-gray-500 italic mb-4">
            {line.replace(/^\*/, '').replace(/\*$/, '')}
          </p>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={key++} className="text-gray-800 font-semibold mb-4">
            {line.replace(/^\*\*/, '').replace(/\*\*$/, '')}
          </p>
        );
      } else if (line.trim()) {
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        elements.push(
          <p key={key++} className="text-gray-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Policy Page Not Found</h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={policy.title}
        description={`Read our ${policy.title}`}
      />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <Card>
            <CardContent className="p-8">
              <h1 className="text-4xl font-bold text-primary mb-6">
                {policy.title}
              </h1>
              <div className="prose prose-amber max-w-none">
                {renderContent(policy.content)}
              </div>
              <div className="mt-8 pt-6 border-t text-sm text-gray-500">
                Last Updated: {new Date(policy.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
