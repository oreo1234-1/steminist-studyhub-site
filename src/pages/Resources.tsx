import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Download, Sparkles, Loader2, Search, X } from "lucide-react";
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

const SUBJECTS = [
  "Biology", "Chemistry", "Physics", "Math", "Computer Science",
  "Engineering", "Environmental Science", "Anatomy", "Statistics",
  "Calculus", "Algebra", "Geometry", "AP/IB General", "Other"
];

const LEVELS = [
  { value: "middle-school", label: "Middle School" },
  { value: "high-school", label: "High School" },
  { value: "ap-ib", label: "AP / IB" },
  { value: "college", label: "College" },
];

const Resources = () => {
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const setSubjectFilterValue = (v: string) => setSubjectFilter(v === "__all" ? "" : v);
  const setLevelFilterValue = (v: string) => setLevelFilter(v === "__all" ? "" : v);

  const fetchResources = () => {
    setLoading(true);
    supabase.from("resources").select("*").then(({ data }) => {
      if (data) setResources(data as ResourceRow[]);
      setLoading(false);
    });
  };

  useEffect(() => { fetchResources(); }, []);

  const applyFilters = (list: ResourceRow[]) => {
    let filtered = list;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.subject?.toLowerCase().includes(q)
      );
    }
    if (subjectFilter) filtered = filtered.filter(r => r.subject === subjectFilter);
    if (levelFilter) filtered = filtered.filter(r => r.level === levelFilter);
    return filtered;
  };

  const filterByCategory = (cat: string) => applyFilters(resources.filter(r => r.category === cat));

  const hasActiveFilters = search || subjectFilter || levelFilter;
  const clearFilters = () => { setSearch(""); setSubjectFilter(""); setLevelFilter(""); };

  const handleDownload = (resource: ResourceRow) => {
    if (resource.file_url) {
      window.open(resource.file_url, "_blank");
    } else {
      toast({ title: "Coming soon", description: "This resource will be available for download shortly." });
    }
  };

  const ResourceCard = ({ r, downloadLabel }: { r: ResourceRow; downloadLabel: string }) => (
    <Card key={r.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
      <CardHeader>
        <div className="flex justify-between items-start mb-2 flex-wrap gap-1">
          {r.level && <Badge variant="secondary">{LEVELS.find(l => l.value === r.level)?.label || r.level}</Badge>}
          {r.subject && <Badge variant="outline">{r.subject}</Badge>}
        </div>
        <CardTitle className="font-playfair text-lg">{r.title}</CardTitle>
        {r.description && <CardDescription className="text-sm line-clamp-2">{r.description}</CardDescription>}
        {!r.description && r.downloads_count ? (
          <CardDescription className="text-sm">Downloaded {r.downloads_count.toLocaleString()} times</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <Button className="w-full" variant="outline" onClick={() => handleDownload(r)}>
          <Download className="h-4 w-4 mr-2" /> {downloadLabel}
        </Button>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ label }: { label: string }) => (
    <div className="col-span-full text-center py-12 text-muted-foreground">
      <p>No {label} found{hasActiveFilters ? " matching your filters" : ""}.</p>
      {hasActiveFilters && <Button variant="link" onClick={clearFilters}>Clear filters</Button>}
    </div>
  );

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
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Resource Library 📚
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Study guides, AP/IB resources, practice question banks, revision templates, and curated STEM toolkits.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={subjectFilter || "__all"} onValueChange={setSubjectFilterValue}>
            <SelectTrigger className="sm:w-48"><SelectValue placeholder="All Subjects" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">All Subjects</SelectItem>
              {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={levelFilter || "__all"} onValueChange={setLevelFilterValue}>
            <SelectTrigger className="sm:w-44"><SelectValue placeholder="All Levels" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">All Levels</SelectItem>
              {LEVELS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Tabs defaultValue="guides" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="guides" className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Study Guides</TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Practice Banks</TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2"><Download className="h-4 w-4" /> Templates</TabsTrigger>
            <TabsTrigger value="toolkits" className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> STEM Toolkits</TabsTrigger>
          </TabsList>

          <TabsContent value="guides">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByCategory("guide").length ? filterByCategory("guide").map(r => <ResourceCard key={r.id} r={r} downloadLabel="Download PDF" />) : <EmptyState label="study guides" />}
            </div>
          </TabsContent>
          <TabsContent value="practice">
            <div className="grid md:grid-cols-2 gap-6">
              {filterByCategory("practice").length ? filterByCategory("practice").map(r => <ResourceCard key={r.id} r={r} downloadLabel="Download Question Bank" />) : <EmptyState label="practice banks" />}
            </div>
          </TabsContent>
          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterByCategory("template").length ? filterByCategory("template").map(r => <ResourceCard key={r.id} r={r} downloadLabel="Download Template" />) : <EmptyState label="templates" />}
            </div>
          </TabsContent>
          <TabsContent value="toolkits">
            <div className="grid md:grid-cols-2 gap-6">
              {filterByCategory("toolkit").length ? filterByCategory("toolkit").map(r => <ResourceCard key={r.id} r={r} downloadLabel="Download Toolkit" />) : <EmptyState label="toolkits" />}
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
