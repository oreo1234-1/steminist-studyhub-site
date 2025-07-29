import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Impact = () => {
  const stats = [
    {
      number: "500+",
      label: "Students Reached",
      description: "Young women from underserved communities who have accessed our platform"
    },
    {
      number: "85%",
      label: "STEM Enrollment Rate", 
      description: "Of our participants who enrolled in STEM programs in college"
    },
    {
      number: "50+",
      label: "Mentor Partnerships",
      description: "Industry professionals volunteering their time and expertise"
    },
    {
      number: "100+",
      label: "Workshops Conducted",
      description: "Interactive sessions covering various STEM topics and skills"
    },
    {
      number: "$250K+",
      label: "Scholarships Facilitated",
      description: "In funding opportunities connected to our students"
    },
    {
      number: "25",
      label: "Partner Organizations",
      description: "Schools and community organizations we collaborate with"
    }
  ];

  const stories = [
    {
      name: "Maria S.",
      achievement: "Full Scholarship to MIT",
      story: "After joining our programming workshops, Maria discovered her passion for computer science. With mentorship support, she built several projects and earned a full scholarship to study at MIT."
    },
    {
      name: "Aisha K.",
      achievement: "NASA Internship",
      story: "Through our aerospace engineering materials and mentorship program, Aisha developed the skills and confidence to apply for competitive internships. She's now working with NASA on satellite technology."
    },
    {
      name: "Sofia R.",
      achievement: "Biotech Startup Founder",
      story: "Our entrepreneurship workshops and business mentors helped Sofia turn her biotech research into a startup focused on developing affordable medical diagnostics for rural communities."
    }
  ];

  const partnerships = [
    {
      name: "Local School Districts",
      impact: "Integrated our curriculum into 15 schools, reaching 300+ students annually"
    },
    {
      name: "Tech Companies",
      impact: "Provided internship opportunities and industry mentors for our participants"
    },
    {
      name: "Universities",
      impact: "Established pipeline programs and scholarship opportunities"
    },
    {
      name: "Community Centers",
      impact: "Extended our reach to underserved neighborhoods through local partnerships"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Our Impact
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Measuring success through the achievements of the young women we serve 
            and the communities we strengthen.
          </p>
        </div>

        {/* Statistics Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            By the Numbers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-foreground mb-2">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Success Stories
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-primary">{story.name}</CardTitle>
                  <CardDescription className="font-semibold text-accent-foreground">
                    {story.achievement}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">{story.story}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Impact Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Community Partnerships
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {partnerships.map((partnership, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-primary">{partnership.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{partnership.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Long-term Goals Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Looking Forward
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-6 max-w-3xl mx-auto">
            Our goal is to reach 1,000 students by 2025 and establish programs in 50 
            communities nationwide. Together, we're building a future where every girl 
            has the opportunity to thrive in STEM.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-foreground mb-2">1,000</div>
              <div className="text-primary-foreground/90">Students by 2025</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-foreground mb-2">50</div>
              <div className="text-primary-foreground/90">Communities Served</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-foreground mb-2">100</div>
              <div className="text-primary-foreground/90">Partner Organizations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;