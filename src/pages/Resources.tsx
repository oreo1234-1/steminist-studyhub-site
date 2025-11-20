import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Download, ExternalLink, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Resources = () => {
  const studyGuides = [
    { title: "AP Biology Complete Study Guide", subject: "Biology", level: "AP", downloads: 2847 },
    { title: "Calculus BC Formula Sheet & Practice", subject: "Mathematics", level: "AP", downloads: 3102 },
    { title: "Physics 1 & 2 Concept Review", subject: "Physics", level: "AP", downloads: 1956 },
    { title: "Chemistry Problem-Solving Strategies", subject: "Chemistry", level: "AP", downloads: 2234 },
    { title: "IB Math HL Revision Notes", subject: "Mathematics", level: "IB", downloads: 1478 },
    { title: "IB Biology Extended Essay Guide", subject: "Biology", level: "IB", downloads: 987 }
  ];

  const practiceQuestions = [
    { title: "AP Calculus BC Practice Test Bank (200+ Questions)", subject: "Mathematics", questions: 200 },
    { title: "Organic Chemistry Reaction Practice", subject: "Chemistry", questions: 150 },
    { title: "AP Physics Multiple Choice Set", subject: "Physics", questions: 180 },
    { title: "Biology Cell & Molecular Practice", subject: "Biology", questions: 120 },
    { title: "Statistics & Probability Question Bank", subject: "Mathematics", questions: 175 }
  ];

  const revisionTemplates = [
    { title: "STEM Flashcard Template (Anki-Compatible)", type: "Template" },
    { title: "Lab Report Writing Template", type: "Template" },
    { title: "Research Paper Outline Template", type: "Template" },
    { title: "Cornell Notes for STEM Subjects", type: "Template" },
    { title: "Exam Preparation Checklist", type: "Template" }
  ];

  const stemToolkits = [
    { title: "Python Programming Starter Kit", category: "Coding", description: "Essential libraries, tutorials, and project ideas" },
    { title: "Pre-Med Student Roadmap", category: "Medicine", description: "Timeline, prerequisites, volunteering, and MCAT prep" },
    { title: "Engineering Design Process Guide", category: "Engineering", description: "Step-by-step framework for design challenges" },
    { title: "Data Science Toolkit", category: "Technology", description: "R, Python, visualization tools, and datasets" },
    { title: "Lab Safety & Equipment Guide", category: "Science", description: "Protocols, techniques, and best practices" },
    { title: "Research Methods Handbook", category: "All Fields", description: "Scientific method, data analysis, and publication tips" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Resource Library - STEM Study Guides & Tools</title>
        <meta name="description" content="Comprehensive STEM resource library with AP/IB study guides, practice question banks, revision templates, and specialized STEM toolkits for students." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Resource Library 📚
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Study guides, AP/IB resources, practice question banks, revision templates, and curated STEM toolkits. 
            Everything you need to excel in your STEM journey.
          </p>
        </div>

        <Tabs defaultValue="guides" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Study Guides
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Practice Banks
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="toolkits" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              STEM Toolkits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guides">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGuides.map((guide, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{guide.level}</Badge>
                      <Badge variant="outline">{guide.subject}</Badge>
                    </div>
                    <CardTitle className="font-playfair text-lg">{guide.title}</CardTitle>
                    <CardDescription className="text-sm">
                      Downloaded {guide.downloads.toLocaleString()} times
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="practice">
            <div className="grid md:grid-cols-2 gap-6">
              {practiceQuestions.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{resource.subject}</Badge>
                      <span className="text-sm font-semibold text-primary">
                        {resource.questions} Questions
                      </span>
                    </div>
                    <CardTitle className="font-playfair text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full" variant="default">
                      <Download className="h-4 w-4 mr-2" />
                      Download Question Bank
                    </Button>
                    <Button className="w-full" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Answer Key
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {revisionTemplates.map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-accent/30 bg-accent/5">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">{template.type}</Badge>
                    <CardTitle className="font-playfair text-lg">{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="secondary">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="toolkits">
            <div className="grid md:grid-cols-2 gap-6">
              {stemToolkits.map((toolkit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{toolkit.category}</Badge>
                    <CardTitle className="font-playfair text-xl">{toolkit.title}</CardTitle>
                    <CardDescription>{toolkit.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Download className="h-4 w-4 mr-2" />
                      Download Toolkit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="font-playfair">Resource Benefits</CardTitle>
            </CardHeader>
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
            <CardHeader>
              <CardTitle className="font-playfair">Request a Resource</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Need a specific study guide or toolkit? Let us know what would help you succeed.
              </p>
              <Button variant="outline" className="w-full">Submit Request</Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="font-playfair">Contribute</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share your study guides and templates to help the community grow.
              </p>
              <Button variant="secondary" className="w-full">Upload Resource</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
