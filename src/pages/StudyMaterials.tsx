import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const StudyMaterials = () => {
  const subjects = [
    {
      title: "Mathematics",
      materials: [
        { name: "Algebra Fundamentals", type: "PDF Guide", level: "Beginner" },
        { name: "Calculus Practice Problems", type: "Workbook", level: "Advanced" },
        { name: "Statistics Tutorial Videos", type: "Video Series", level: "Intermediate" }
      ]
    },
    {
      title: "Computer Science", 
      materials: [
        { name: "Python Programming Basics", type: "Interactive Course", level: "Beginner" },
        { name: "Data Structures Guide", type: "PDF Guide", level: "Intermediate" },
        { name: "Web Development Toolkit", type: "Resource Pack", level: "Beginner" }
      ]
    },
    {
      title: "Engineering",
      materials: [
        { name: "Circuit Analysis Workbook", type: "Workbook", level: "Intermediate" },
        { name: "3D Design Software Tutorials", type: "Video Series", level: "Beginner" },
        { name: "Engineering Design Process", type: "PDF Guide", level: "Beginner" }
      ]
    },
    {
      title: "Science",
      materials: [
        { name: "Chemistry Lab Manual", type: "Laboratory Guide", level: "Intermediate" },
        { name: "Physics Concept Videos", type: "Video Series", level: "Beginner" },
        { name: "Biology Research Methods", type: "PDF Guide", level: "Advanced" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            STEM Study Materials
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive learning resources designed to support your STEM journey. 
            All materials are curated by experts and tailored for different skill levels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {subjects.map((subject, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-primary text-2xl">{subject.title}</CardTitle>
                <CardDescription>
                  {subject.materials.length} resources available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subject.materials.map((material, materialIndex) => (
                    <div key={materialIndex} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-semibold text-foreground">{material.name}</h4>
                        <p className="text-sm text-muted-foreground">{material.type}</p>
                      </div>
                      <Badge variant={material.level === "Beginner" ? "secondary" : material.level === "Intermediate" ? "outline" : "destructive"}>
                        {material.level}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">
                  Access {subject.title} Materials
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
              <CardTitle className="text-primary">Regular Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                New materials are added monthly based on curriculum standards and student feedback.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-secondary/20">
            <CardHeader>
              <CardTitle className="text-primary">Study Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join study groups to learn collaboratively and get peer support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;