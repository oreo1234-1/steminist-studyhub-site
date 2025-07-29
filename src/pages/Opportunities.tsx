import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Opportunities = () => {
  const scholarships = [
    {
      title: "STEM Excellence Scholarship",
      amount: "$5,000",
      deadline: "April 30, 2024",
      requirements: "High school seniors pursuing STEM degrees",
      type: "Scholarship"
    },
    {
      title: "Women in Tech Scholarship",
      amount: "$3,000", 
      deadline: "May 15, 2024",
      requirements: "Undergraduate women in computer science or engineering",
      type: "Scholarship"
    }
  ];

  const internships = [
    {
      title: "Software Engineering Intern",
      company: "Tech Innovation Corp",
      duration: "Summer 2024 (12 weeks)",
      location: "Remote/Hybrid",
      type: "Internship"
    },
    {
      title: "Research Assistant",
      company: "University Medical Center",
      duration: "Spring 2024 (16 weeks)", 
      location: "On-site",
      type: "Internship"
    },
    {
      title: "Data Science Intern",
      company: "Analytics Solutions Inc",
      duration: "Summer 2024 (10 weeks)",
      location: "Remote",
      type: "Internship"
    }
  ];

  const competitions = [
    {
      title: "Young Innovators Challenge",
      prize: "$10,000 grand prize",
      deadline: "March 31, 2024",
      description: "Design solutions for environmental challenges",
      type: "Competition"
    },
    {
      title: "Code for Change Hackathon",
      prize: "Mentorship + $2,000",
      deadline: "April 20, 2024", 
      description: "48-hour coding competition for social good",
      type: "Competition"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            STEM Opportunities
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover scholarships, internships, competitions, and career opportunities 
            designed to support your STEM journey.
          </p>
        </div>

        {/* Scholarships Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Scholarships</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {scholarships.map((scholarship, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-primary">{scholarship.title}</CardTitle>
                    <Badge variant="secondary">{scholarship.type}</Badge>
                  </div>
                  <CardDescription className="font-semibold text-accent-foreground">
                    {scholarship.amount}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{scholarship.requirements}</p>
                  <p className="text-sm font-semibold text-foreground mb-4">
                    Deadline: {scholarship.deadline}
                  </p>
                  <Button className="w-full">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Internships Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Internships</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {internships.map((internship, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-primary text-lg">{internship.title}</CardTitle>
                    <Badge variant="outline">{internship.type}</Badge>
                  </div>
                  <CardDescription className="font-semibold">
                    {internship.company}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p>Duration: {internship.duration}</p>
                    <p>Location: {internship.location}</p>
                  </div>
                  <Button className="w-full">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Competitions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Competitions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {competitions.map((competition, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-primary">{competition.title}</CardTitle>
                    <Badge variant="destructive">{competition.type}</Badge>
                  </div>
                  <CardDescription className="font-semibold text-accent-foreground">
                    {competition.prize}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-2">{competition.description}</p>
                  <p className="text-sm font-semibold text-foreground mb-4">
                    Deadline: {competition.deadline}
                  </p>
                  <Button className="w-full">Register</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground mb-4">
            Don't See What You're Looking For?
          </h2>
          <p className="text-primary-foreground/90 mb-6">
            Our team is constantly sourcing new opportunities. Get personalized recommendations 
            based on your interests and goals.
          </p>
          <Button size="lg" variant="secondary">
            Get Personalized Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;