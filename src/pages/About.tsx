import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      title: "Accessibility",
      description: "We believe STEM education should be accessible to all, regardless of economic background or geographic location."
    },
    {
      title: "Empowerment", 
      description: "We empower young women to see themselves as capable scientists, engineers, and innovators."
    },
    {
      title: "Community",
      description: "We foster a supportive community where girls can learn, grow, and inspire each other."
    },
    {
      title: "Excellence",
      description: "We provide high-quality resources and mentorship to help students achieve their full potential."
    }
  ];

  const team = [
    {
      name: "Founder & CEO",
      description: "Passionate about creating opportunities for underrepresented communities in STEM"
    },
    {
      name: "Education Director", 
      description: "Former STEM teacher with 15 years of experience in curriculum development"
    },
    {
      name: "Mentorship Coordinator",
      description: "Connects students with industry professionals and academic mentors"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About STEMinist Study Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Founded with the mission to break down barriers in STEM education, 
            we're dedicated to creating opportunities for underserved girls to explore 
            and excel in science, technology, engineering, and mathematics.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                STEMinist Study Hub was born from the recognition that talented young women 
                in underserved communities often lack access to quality STEM resources and 
                mentorship opportunities.
              </p>
              <p>
                Since our founding, we've served hundreds of students, providing them with 
                the tools, knowledge, and support needed to pursue their dreams in STEM fields. 
                Our platform combines cutting-edge educational resources with personalized 
                mentorship to create a comprehensive learning experience.
              </p>
              <p>
                We believe that by investing in the education of young women today, we're 
                building a more diverse and innovative future for tomorrow's scientific 
                and technological breakthroughs.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Impact</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Students Served</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Mentors</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">Workshops</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">85%</div>
                  <div className="text-sm text-muted-foreground">STEM Enrollment</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-primary">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-primary">{member.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{member.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;