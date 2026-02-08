import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Shield, Heart, Globe, ArrowRight, Sparkles, Users, BookOpen, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const About = () => {
  const values = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Empowerment",
      description: "We believe every student has the capacity to excel in STEM. We provide the tools and support to make it happen."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Equity",
      description: "Access to quality STEM resources shouldn't depend on your background, location, or economic status."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Community",
      description: "We foster a supportive community where students can learn, grow, and inspire each other."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Representation",
      description: "We champion diversity in STEM and amplify voices that have historically been underrepresented."
    }
  ];

  const stats = [
    { value: "5,000+", label: "Students Served", icon: <Users className="h-5 w-5" /> },
    { value: "100+", label: "Expert Mentors", icon: <GraduationCap className="h-5 w-5" /> },
    { value: "500+", label: "Study Resources", icon: <BookOpen className="h-5 w-5" /> },
    { value: "85%", label: "STEM Enrollment", icon: <Target className="h-5 w-5" /> },
  ];

  return (
    <>
      <Helmet>
        <title>About — STEMinist Study Hub</title>
        <meta name="description" content="Learn about STEMinist Study Hub's mission to empower women and underrepresented students in STEM through community, mentorship, and accessible resources." />
      </Helmet>

      <div className="min-h-screen bg-background font-inter">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Our Story
              </div>
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
                Empowering STEM students to <span className="text-primary">reach their potential</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                STEMinist Study Hub was founded to break down barriers in STEM education — creating a space where underrepresented students can access the resources, mentorship, and community they deserve.
              </p>
            </div>
          </div>
        </section>

        {/* Mission / Vision */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
              <div className="space-y-5">
                <p className="text-sm font-medium tracking-widest uppercase text-accent">Mission</p>
                <h2 className="font-playfair text-3xl font-bold text-foreground">Why we exist</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Talented students in underserved communities often lack access to quality STEM resources and mentorship. We're changing that.
                  </p>
                  <p>
                    STEMinist Study Hub combines cutting-edge educational tools with personalized mentorship to create a comprehensive, accessible learning experience for students at every level.
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                <p className="text-sm font-medium tracking-widest uppercase text-accent">Vision</p>
                <h2 className="font-playfair text-3xl font-bold text-foreground">Where we're headed</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We envision a world where every aspiring scientist, engineer, and innovator has access to the support they need — regardless of who they are or where they come from.
                  </p>
                  <p>
                    By investing in the education and empowerment of students today, we're building a more diverse and innovative future for STEM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 bg-muted/40 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center border border-border/60">
                  <CardContent className="pt-6 pb-6 space-y-2">
                    <div className="mx-auto w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {stat.icon}
                    </div>
                    <p className="text-3xl font-playfair font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-sm font-medium tracking-widest uppercase text-accent mb-3">Values</p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground text-balance">
                What we stand for
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value) => (
                <div key={value.title} className="text-center space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    {value.icon}
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-balance">
                Be part of the change
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Whether you're a student, mentor, or supporter — there's a place for you in our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base font-medium bg-white text-primary hover:bg-white/90">
                  <Link to="/auth">
                    Join STEMinist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 px-8 text-base font-medium text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
