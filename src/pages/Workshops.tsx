import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Workshops = () => {
  const workshops = [
    {
      title: "Introduction to Python Programming",
      date: "March 15, 2024",
      time: "2:00 PM - 4:00 PM EST",
      level: "Beginner",
      spots: "15 spots available",
      description: "Learn the basics of Python programming with hands-on coding exercises."
    },
    {
      title: "Web Development Fundamentals", 
      date: "March 22, 2024",
      time: "1:00 PM - 3:00 PM EST",
      level: "Beginner",
      spots: "20 spots available",
      description: "Build your first website using HTML, CSS, and JavaScript."
    },
    {
      title: "Data Science with R",
      date: "March 29, 2024", 
      time: "3:00 PM - 5:00 PM EST",
      level: "Intermediate",
      spots: "12 spots available",
      description: "Explore data analysis and visualization techniques using R programming."
    },
    {
      title: "Circuit Design Workshop",
      date: "April 5, 2024",
      time: "2:30 PM - 4:30 PM EST", 
      level: "Beginner",
      spots: "18 spots available",
      description: "Hands-on experience building and testing electronic circuits."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Interactive STEM Workshops
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join our hands-on workshops designed to make STEM learning engaging and accessible. 
            All skill levels welcome!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {workshops.map((workshop, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-primary">{workshop.title}</CardTitle>
                  <Badge variant={workshop.level === "Beginner" ? "secondary" : "outline"}>
                    {workshop.level}
                  </Badge>
                </div>
                <CardDescription>
                  {workshop.date} • {workshop.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{workshop.description}</p>
                <p className="text-sm text-accent-foreground font-semibold mb-4">
                  {workshop.spots}
                </p>
                <Button className="w-full">Register Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-accent/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Workshop Benefits
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Small class sizes for personalized attention</li>
              <li>• All materials and tools provided</li>
              <li>• Take-home projects and resources</li>
              <li>• Certificate of completion</li>
              <li>• Access to workshop recordings</li>
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Suggest a Workshop
            </h2>
            <p className="text-muted-foreground mb-4">
              Have an idea for a workshop topic? We'd love to hear from you!
            </p>
            <Button variant="secondary" className="w-full">
              Submit Suggestion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workshops;