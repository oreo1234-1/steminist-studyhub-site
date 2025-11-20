import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Calendar, Megaphone, Star, Target } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Leadership = () => {
  const positions = [
    {
      title: "Student Ambassador",
      icon: Megaphone,
      commitment: "5-7 hours/month",
      responsibilities: [
        "Represent the organization at school events",
        "Recruit new members and promote programs",
        "Share STEM stories on social media",
        "Organize campus awareness campaigns"
      ],
      benefits: [
        "Leadership certificate",
        "Early access to opportunities",
        "Networking with ambassadors nationwide",
        "Resume-building experience"
      ]
    },
    {
      title: "Peer Mentor",
      icon: Users,
      commitment: "3-5 hours/month",
      responsibilities: [
        "Mentor 2-4 younger students",
        "Provide academic and career guidance",
        "Lead small group study sessions",
        "Share your STEM journey experiences"
      ],
      benefits: [
        "Mentorship training & certification",
        "Build teaching and leadership skills",
        "Connect with mentees long-term",
        "Letter of recommendation support"
      ]
    },
    {
      title: "Event Coordinator",
      icon: Calendar,
      commitment: "6-10 hours/month",
      responsibilities: [
        "Plan and execute community events",
        "Coordinate with speakers and vendors",
        "Manage event logistics and promotion",
        "Lead event planning committees"
      ],
      benefits: [
        "Project management experience",
        "Professional event planning skills",
        "Expand your professional network",
        "Portfolio of executed events"
      ]
    },
    {
      title: "Workshop Lead",
      icon: Star,
      commitment: "4-6 hours/month",
      responsibilities: [
        "Design and lead STEM workshops",
        "Prepare materials and presentations",
        "Teach coding, engineering, or science topics",
        "Mentor workshop participants"
      ],
      benefits: [
        "Teaching and presentation skills",
        "Subject matter expertise recognition",
        "Curriculum development experience",
        "Public speaking confidence"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Leadership Opportunities - STEM Student Positions</title>
        <meta name="description" content="Student ambassador, peer mentor, event coordinator, and workshop lead positions available. Build leadership skills while supporting the STEM community." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Leadership Opportunities 👑
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Step into leadership roles as an ambassador, peer mentor, event coordinator, or workshop lead. 
            Build valuable skills while making a real impact in the STEM community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {positions.map((position, index) => {
            const Icon = position.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-playfair text-2xl">{position.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">{position.commitment}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Responsibilities:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {position.responsibilities.map((resp, idx) => (
                        <li key={idx}>• {resp}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">What You'll Gain:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {position.benefits.map((benefit, idx) => (
                        <li key={idx}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Apply for This Position
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="font-playfair flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Why Lead?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Build real-world leadership skills</li>
                <li>• Stand out on college applications</li>
                <li>• Make a tangible community impact</li>
                <li>• Network with student leaders</li>
                <li>• Receive professional development</li>
                <li>• Earn certificates & recommendations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="font-playfair flex items-center gap-2">
                <Target className="h-5 w-5" />
                Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Active member for 3+ months</li>
                <li>• Strong academic standing</li>
                <li>• Passion for STEM and community</li>
                <li>• Reliable and committed</li>
                <li>• Good communication skills</li>
                <li>• Open to all education levels</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="font-playfair">Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Submit online application</li>
                <li>Brief written statement</li>
                <li>Interview with current leaders</li>
                <li>Complete orientation training</li>
                <li>Start making an impact!</li>
              </ol>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Rolling admissions - apply anytime!
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="font-playfair text-2xl text-center">
              Ready to Lead?
            </CardTitle>
            <CardDescription className="text-center">
              Join our leadership team and help empower the next generation of women in STEM
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Apply Now for Leadership
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leadership;
