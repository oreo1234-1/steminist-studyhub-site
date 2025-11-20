import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Cog, Microscope, Cpu, Palette, Beaker } from "lucide-react";

const Workshops = () => {
  const codingLabs = [
    {
      title: "Python Coding Bootcamp",
      date: "Weekly Tuesdays",
      time: "4:00 PM - 6:00 PM EST",
      level: "Beginner to Advanced",
      spots: "15 spots available",
      description: "Progressive Python learning with real coding projects and challenges.",
      category: "Coding"
    },
    {
      title: "Web Development Lab",
      date: "Weekly Thursdays",
      time: "3:00 PM - 5:00 PM EST",
      level: "Beginner",
      spots: "20 spots available",
      description: "Build interactive websites with HTML, CSS, JavaScript, and React.",
      category: "Coding"
    },
    {
      title: "Data Science & AI Workshop",
      date: "Monthly - First Saturday",
      time: "10:00 AM - 2:00 PM EST",
      level: "Intermediate",
      spots: "12 spots available",
      description: "Explore machine learning, data visualization, and AI applications.",
      category: "Coding"
    }
  ];

  const engineeringBuilds = [
    {
      title: "Robotics Build Challenge",
      date: "Weekly Wednesdays",
      time: "3:30 PM - 5:30 PM EST",
      level: "All Levels",
      spots: "18 spots available",
      description: "Design, build, and program robots for real-world challenges.",
      category: "Engineering"
    },
    {
      title: "Circuit Design & Electronics",
      date: "Bi-weekly Fridays",
      time: "4:00 PM - 6:00 PM EST",
      level: "Beginner",
      spots: "16 spots available",
      description: "Learn electronics fundamentals and build working circuits.",
      category: "Engineering"
    },
    {
      title: "3D Design & Printing Lab",
      date: "Weekly Mondays",
      time: "3:00 PM - 5:00 PM EST",
      level: "Beginner to Intermediate",
      spots: "14 spots available",
      description: "Create 3D models and bring them to life with 3D printing.",
      category: "Engineering"
    }
  ];

  const medicalCaseStudies = [
    {
      title: "Medical Case Analysis Workshop",
      date: "Monthly - Second Saturday",
      time: "11:00 AM - 3:00 PM EST",
      level: "High School & College",
      spots: "20 spots available",
      description: "Explore real medical cases and diagnostic reasoning with pre-med guides.",
      category: "Medical"
    },
    {
      title: "Lab Techniques & Microbiology",
      date: "Bi-weekly Saturdays",
      time: "10:00 AM - 1:00 PM EST",
      level: "Intermediate",
      spots: "15 spots available",
      description: "Hands-on experience with lab safety, microscopy, and specimen analysis.",
      category: "Medical"
    },
    {
      title: "Anatomy & Physiology Sessions",
      date: "Weekly Thursdays",
      time: "5:00 PM - 6:30 PM EST",
      level: "All Levels",
      spots: "25 spots available",
      description: "Interactive study of human body systems with visual models and cases.",
      category: "Medical"
    }
  ];

  const designChallenges = [
    {
      title: "Product Design Thinking",
      date: "Monthly - Third Friday",
      time: "4:00 PM - 7:00 PM EST",
      level: "All Levels",
      spots: "20 spots available",
      description: "Solve real-world problems through design thinking and prototyping.",
      category: "Design"
    },
    {
      title: "UX/UI Design for Apps",
      date: "Bi-weekly Wednesdays",
      time: "5:00 PM - 7:00 PM EST",
      level: "Beginner to Intermediate",
      spots: "18 spots available",
      description: "Design user-friendly interfaces using Figma and user research methods.",
      category: "Design"
    }
  ];

  const renderWorkshopCards = (workshops: any[]) => (
    <div className="grid lg:grid-cols-2 gap-6">
      {workshops.map((workshop, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="font-playfair">{workshop.title}</CardTitle>
              <Badge variant="secondary">{workshop.level}</Badge>
            </div>
            <CardDescription className="flex items-center gap-2">
              {workshop.date} • {workshop.time}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{workshop.description}</p>
            <p className="text-sm font-semibold text-primary mb-4">{workshop.spots}</p>
            <Button className="w-full bg-primary hover:bg-primary/90">Register Now</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hands-On STEM Workshops 🔬
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Coding labs, engineering builds, medical case studies, robotics challenges, and design thinking. 
            Build real skills through hands-on experimentation and expert guidance.
          </p>
        </div>

        <Tabs defaultValue="coding" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="coding" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Coding Labs
            </TabsTrigger>
            <TabsTrigger value="engineering" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              Engineering
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-2">
              <Microscope className="h-4 w-4" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Design
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coding">
            {renderWorkshopCards(codingLabs)}
          </TabsContent>

          <TabsContent value="engineering">
            {renderWorkshopCards(engineeringBuilds)}
          </TabsContent>

          <TabsContent value="medical">
            {renderWorkshopCards(medicalCaseStudies)}
          </TabsContent>

          <TabsContent value="design">
            {renderWorkshopCards(designChallenges)}
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="font-playfair flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Workshop Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Hands-on learning with real tools</li>
                <li>• Small groups (12-20 students)</li>
                <li>• All materials provided</li>
                <li>• Take-home projects</li>
                <li>• Certificate of completion</li>
                <li>• Workshop recordings available</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="font-playfair flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Special Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Middle School intro sessions</li>
                <li>• Pre-med pathway workshops</li>
                <li>• Engineering bootcamps</li>
                <li>• Tech industry prep</li>
                <li>• Research skills training</li>
                <li>• Portfolio building support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="font-playfair">Suggest a Workshop</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Have an idea for a workshop? We want to hear from you!
              </p>
              <Button variant="secondary" className="w-full">
                Submit Your Idea
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Workshops;