import PageMeta from "@/components/common/PageMeta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/db/api";
import type { AboutSection, FAQ } from "@/types/types";

const About = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsData, faqsData] = await Promise.all([
          api.getAboutSections(),
          api.getFAQs(),
        ]);
        setSections(sectionsData);
        setFaqs(faqsData);
      } catch (error) {
        console.error("Error fetching about page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSectionIcon = (sectionKey: string) => {
    switch (sectionKey) {
      case "who_we_are":
        return <Heart className="h-8 w-8 text-amber-700" />;
      case "our_founder":
        return <Users className="h-8 w-8 text-amber-700" />;
      case "our_mission":
        return <Target className="h-8 w-8 text-amber-700" />;
      default:
        return <Heart className="h-8 w-8 text-amber-700" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="About Us"
        description="Learn about MCK Foods - bringing authentic South Indian flavors to your kitchen"
      />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-900 to-orange-800 text-white py-16 animate-fade-in-down">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About MCK Foods</h1>
            <p className="text-xl text-amber-100">
              Bringing Authentic South Indian Flavors to Your Kitchen
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {sections.map((section, index) => (
            <Card 
              key={section.id} 
              className="mb-12 stagger-item hover-lift transition-smooth"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <span className="animate-float">{getSectionIcon(section.section_key)}</span>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                {section.image_url && (
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <img
                      src={section.image_url}
                      alt={section.title}
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-lg transition-smooth hover:scale-105"
                    />
                  </div>
                )}
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <Card className="animate-fade-in-up hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`item-${index}`} className="transition-smooth">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-smooth">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default About;