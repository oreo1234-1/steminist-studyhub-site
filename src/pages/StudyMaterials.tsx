import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Search } from "lucide-react";
import { UploadMaterialDialog } from "@/components/study-materials/UploadMaterialDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from "react-helmet-async";

interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_type: string | null;
  subject: string;
  difficulty_level: string | null;
  downloads_count: number | null;
  views_count: number | null;
  created_at: string | null;
}

const StudyMaterials = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Error",
        description: "Failed to load study materials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (material: StudyMaterial) => {
    if (!material.file_url) return;

    try {
      // Increment download count
      await supabase
        .from('study_materials')
        .update({ downloads_count: (material.downloads_count || 0) + 1 })
        .eq('id', material.id);

      // Open file in new tab
      window.open(material.file_url, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = levelFilter === "all" || material.subject.includes(levelFilter);
    
    const matchesDifficulty = difficultyFilter === "all" || 
                             material.difficulty_level === difficultyFilter;

    return matchesSearch && matchesLevel && matchesDifficulty;
  });

  // Group materials by education level
  const groupedMaterials = {
    "Middle School": filteredMaterials.filter(m => m.subject.includes("🟦")),
    "High School": filteredMaterials.filter(m => m.subject.includes("🟩")),
    "College": filteredMaterials.filter(m => m.subject.includes("🟥"))
  };

  return (
    <>
      <Helmet>
        <title>STEM Study Materials | STEMinist Study Hub</title>
        <meta name="description" content="Access and share comprehensive STEM study materials for middle school, high school, and college. Free resources for math, science, engineering, and technology." />
      </Helmet>

      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              STEM Study Materials 📚
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Access comprehensive learning resources designed to support your STEM journey. 
              Upload and share your own materials with the community!
            </p>
            <UploadMaterialDialog />
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Education Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="🟦">🟦 Middle School</SelectItem>
                    <SelectItem value="🟩">🟩 High School</SelectItem>
                    <SelectItem value="🟥">🟥 College</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading materials...</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedMaterials).map(([level, levelMaterials]) => {
                if (levelMaterials.length === 0) return null;

                const emoji = level === "Middle School" ? "🟦" : level === "High School" ? "🟩" : "🟥";

                return (
                  <div key={level}>
                    <h2 className="font-playfair text-3xl font-bold text-foreground mb-6">
                      {emoji} {level}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {levelMaterials.map((material) => (
                        <Card key={material.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <CardTitle className="text-lg line-clamp-2">
                                  {material.title}
                                </CardTitle>
                                <CardDescription className="mt-2 text-sm">
                                  {material.subject.split(' - ').slice(1).join(' - ')}
                                </CardDescription>
                              </div>
                              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {material.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {material.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={
                                material.difficulty_level === "beginner" ? "secondary" :
                                material.difficulty_level === "intermediate" ? "outline" : "destructive"
                              }>
                                {material.difficulty_level || "Beginner"}
                              </Badge>
                              {material.downloads_count !== null && material.downloads_count > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {material.downloads_count} downloads
                                </span>
                              )}
                            </div>

                            <Button 
                              className="w-full gap-2" 
                              onClick={() => handleDownload(material)}
                              disabled={!material.file_url}
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredMaterials.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No materials found. {searchQuery && "Try adjusting your search filters."}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-accent/20">
              <CardHeader>
                <CardTitle className="text-primary">Free Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All study materials are completely free and accessible to our community members.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-primary">Community Curated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Materials uploaded by students and reviewed for quality by our team.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/10">
              <CardHeader>
                <CardTitle className="text-primary">Share Knowledge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload your own study materials to help other students succeed in STEM.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyMaterials;