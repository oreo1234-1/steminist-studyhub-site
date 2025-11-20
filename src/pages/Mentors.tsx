import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Briefcase, HeartPulse, Users } from "lucide-react";

const Mentors = () => {
  const collegeMentors = [
    {
      name: "Sofia Martinez",
      expertise: "Computer Science Major - MIT",
      year: "Senior",
      description: "Software engineering intern at Meta, specializing in full-stack development and AI.",
      type: "College Student"
    },
    {
      name: "Priya Sharma",
      expertise: "Biomedical Engineering - Stanford",
      year: "Junior",
      description: "Research assistant in medical device innovation, pre-med track advisor.",
      type: "College Student"
    },
    {
      name: "Emma Thompson",
      expertise: "Environmental Science - UC Berkeley",
      year: "Senior",
      description: "Climate research lab member, passionate about sustainable technology solutions.",
      type: "College Student"
    },
    {
      name: "Maya Chen",
      expertise: "Mathematics & Data Science - Carnegie Mellon",
      year: "Graduate Student",
      description: "Machine learning researcher, mentoring undergrads in advanced mathematics.",
      type: "College Student"
    }
  ];

  const professionals = [
    {
      name: "Dr. Sarah Johnson",
      expertise: "Senior Software Engineer - Google",
      experience: "12 years",
      description: "Tech lead for AI/ML products, mentoring women entering software engineering.",
      type: "Tech Professional"
    },
    {
      name: "Dr. Aisha Patel",
      expertise: "Principal Researcher - Biotech Startup",
      experience: "10 years",
      description: "Leading clinical trials for gene therapy, advising pre-med and biotech students.",
      type: "Biotech Professional"
    },
    {
      name: "Prof. Maria Rodriguez",
      expertise: "Mechanical Engineer - NASA",
      experience: "15 years",
      description: "Aerospace systems designer, guiding students interested in engineering careers.",
      type: "Engineering Professional"
    },
    {
      name: "Dr. Rachel Kim",
      expertise: "Data Science Director - Healthcare AI",
      experience: "8 years",
      description: "Building predictive models for patient care, mentoring aspiring data scientists.",
      type: "Healthcare Professional"
    }
  ];

  const preMedGuides = [
    {
      name: "Dr. Jennifer Lee",
      expertise: "Emergency Medicine Physician",
      experience: "7 years clinical practice",
      description: "Advising on medical school preparation, MCAT study strategies, and clinical experiences.",
      type: "Pre-Med Guide"
    },
    {
      name: "Dr. Fatima Hassan",
      expertise: "Pediatric Surgeon",
      experience: "9 years post-residency",
      description: "Guiding students through surgical pathways, medical ethics, and specialty selection.",
      type: "Pre-Med Guide"
    },
    {
      name: "Dr. Amanda Wright",
      expertise: "Public Health Researcher",
      experience: "6 years MD/PhD program",
      description: "Supporting students combining medicine with research, global health interests.",
      type: "Pre-Med Guide"
    }
  ];

  const renderMentorCards = (mentors: any[], showYear = false) => (
    <div className="grid md:grid-cols-2 gap-6">
      {mentors.map((mentor, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <CardTitle className="font-playfair text-xl">{mentor.name}</CardTitle>
              <Badge variant="secondary">{mentor.type}</Badge>
            </div>
            <CardDescription className="font-semibold text-primary">
              {mentor.expertise}
            </CardDescription>
            <CardDescription className="text-sm">
              {showYear ? mentor.year : mentor.experience}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">{mentor.description}</p>
            <Button className="w-full bg-primary hover:bg-primary/90">
              Request Mentorship
            </Button>
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
            Mentorship Program 🌟
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Connect with college STEM majors, women in professional STEM fields, and pre-med guides. 
            Get personalized guidance, career insights, and support from those who've walked the path.
          </p>
        </div>

        <Tabs defaultValue="college" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="college" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              College Mentors
            </TabsTrigger>
            <TabsTrigger value="professionals" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              STEM Professionals
            </TabsTrigger>
            <TabsTrigger value="premed" className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4" />
              Pre-Med Guides
            </TabsTrigger>
          </TabsList>

          <TabsContent value="college">
            {renderMentorCards(collegeMentors, true)}
          </TabsContent>

          <TabsContent value="professionals">
            {renderMentorCards(professionals)}
          </TabsContent>

          <TabsContent value="premed">
            {renderMentorCards(preMedGuides)}
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="font-playfair flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mentorship Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• One-on-one guidance tailored to your goals</li>
                <li>• Career pathway advice and insights</li>
                <li>• College application support</li>
                <li>• Research and internship connections</li>
                <li>• Monthly check-ins and accountability</li>
                <li>• Portfolio and resume reviews</li>
                <li>• Industry networking opportunities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-muted">
            <CardHeader>
              <CardTitle className="font-playfair">Become a Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Are you a college STEM student or professional? Share your journey and inspire the next generation of women in STEM.
              </p>
              <Button size="lg" variant="secondary" className="w-full">
                Apply to Mentor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Mentors;