import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Download, Sparkles, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UploadResourceDialog } from "@/components/resources/UploadResourceDialog";

interface ResourceRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  subject: string | null;
  level: string | null;
  file_url: string | null;
  external_url: string | null;
  downloads_count: number | null;
  question_count: number | null;
}

const Resources = () => {
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = () => {
    setLoading(true);
    supabase.from("resources").select("*").then(({ data }) => {
      if (data) setResources(data as ResourceRow[]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filterByCategory = (cat: string) => resources.filter((r) => r.category === cat);

  const handleDownload = (resource: ResourceRow) => {
    if (resource.file_url) {
      window.open(resource.file_url, "_blank");
    } else {
      toast({ title: "Coming soon", description: "This resource will be available for download shortly." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Resource Library - STEM Study Guides & Tools</title>
        <meta name="description" content="Comprehensive STEM resource library with AP/IB study guides, practice question banks, revision templates, and specialized STEM toolkits." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Resource Library 📚
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Study guides, AP/IB resources, practice question banks, revision templates, and curated STEM toolkits.
          </p>
        </div>

        <Tabs defaultValue="guides" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Study Guides
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Practice Banks
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Templates
            </TabsTrigger>
            <TabsTrigger value="toolkits" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> STEM Toolkits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByCategory("guide").map((r) => (
                <Card key={r.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      {r.level && <Badge variant="secondary">{r.level}</Badge>}
                      {r.subject && <Badge variant="outline">{r.subject}</Badge>}
                    </div>
                    <CardTitle className="font-playfair text-lg">{r.title}</CardTitle>
                    {r.downloads_count ? (
                      <CardDescription className="text-sm">Downloaded {r.downloads_count.toLocaleString()} times</CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline" onClick={() => handleDownload(r)}>
                      <Download className="h-4 w-4 mr-2" /> Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="practice">
            <div className="grid md:grid-cols-2 gap-6">
              {filterByCategory("practice").map((r) => (
                <Card key={r.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {r.subject && <Badge variant="secondary">{r.subject}</Badge>}
                    </div>
                    <CardTitle className="font-playfair text-lg">{r.title}</CardTitle>
                    {r.description && <CardDescription>{r.description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={() => handleDownload(r)}>
                      <Download className="h-4 w-4 mr-2" /> Download Question Bank
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByCategory("template").map((r) => (
                <Card key={r.id} className="hover:shadow-lg transition-shadow border-2 hover:border-accent/30 bg-accent/5">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">Template</Badge>
                    <CardTitle className="font-playfair text-lg">{r.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="secondary" onClick={() => handleDownload(r)}>
                      <Download className="h-4 w-4 mr-2" /> Download Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="toolkits">
            <div className="grid md:grid-cols-2 gap-6">
              {filterByCategory("toolkit").map((r) => (
                <Card key={r.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader>
                    {r.subject && <Badge variant="secondary" className="w-fit mb-2">{r.subject}</Badge>}
                    <CardTitle className="font-playfair text-xl">{r.title}</CardTitle>
                    {r.description && <CardDescription>{r.description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => handleDownload(r)}>
                      <Download className="h-4 w-4 mr-2" /> Download Toolkit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader><CardTitle className="font-playfair">Resource Benefits</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• All resources free for members</li>
                <li>• Created by top students & educators</li>
                <li>• Regularly updated content</li>
                <li>• Printable & digital formats</li>
                <li>• Aligned with AP/IB curricula</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/20">
            <CardHeader><CardTitle className="font-playfair">Request a Resource</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Need a specific study guide or toolkit? Let us know.</p>
              <Button variant="outline" className="w-full">Submit Request</Button>
            </CardContent>
          </Card>
          <Card className="border-2 border-secondary/20 bg-secondary/5">
            <CardHeader><CardTitle className="font-playfair">Contribute</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Share your study guides and templates to help the community.</p>
              <UploadResourceDialog onUploaded={fetchResources} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
