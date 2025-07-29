import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Mentors = () => {
  const mentors = [
    {
      name: "Dr. Sarah Johnson",
      expertise: "Computer Science & AI",
      experience: "10+ years at Google",
      description: "Specialized in machine learning and software engineering mentorship"
    },
    {
      name: "Prof. Maria Rodriguez",
      expertise: "Biomedical Engineering", 
      experience: "15+ years in research",
      description: "Expert in medical device development and biotechnology"
    },
    {
      name: "Dr. Aisha Patel",
      expertise: "Environmental Science",
      experience: "12+ years in sustainability",
      description: "Focused on climate research and renewable energy solutions"
    },
    {
      name: "Dr. Emily Chen",
      expertise: "Mathematics & Data Science",
      experience: "8+ years in analytics",
      description: "Specialized in statistical modeling and data visualization"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Connect with STEM Mentors
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Get guidance from experienced professionals who are passionate about 
            supporting the next generation of women in STEM fields.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {mentors.map((mentor, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-primary">{mentor.name}</CardTitle>
                <CardDescription className="font-semibold">
                  {mentor.expertise}
                </CardDescription>
                <CardDescription>{mentor.experience}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{mentor.description}</p>
                <Button className="w-full">Request Mentorship</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Want to Become a Mentor?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join our community of mentors and help inspire the next generation of women in STEM.
          </p>
          <Button size="lg" variant="secondary">
            Apply to Mentor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Mentors;