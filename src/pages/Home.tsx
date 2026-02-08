import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BookOpen, Users, Calendar, Brain, MessageCircle, Trophy,
  ArrowRight, Sparkles, Mail, Star, Target, Shield, ChevronRight,
  GraduationCap, Lightbulb, Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Study Pods",
      description: "Join small-group study sessions with peers in your subject area.",
      link: "/study-pods",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Study Tools",
      description: "Flashcards, summaries, and practice questions powered by AI.",
      link: "/ai-tools",
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Mentorship",
      description: "Connect with mentors who've walked the path before you.",
      link: "/mentors",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Resource Library",
      description: "Notes, cheat sheets, and problem sets curated for STEM students.",
      link: "/resources",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Workshops & Events",
      description: "Hands-on labs, webinars, and guest speaker sessions.",
      link: "/events",
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Challenges & Growth",
      description: "Earn badges, track streaks, and level up your STEM skills.",
      link: "/gamification",
    },
  ];

  const stats = [
    { value: "5,000+", label: "Active Members" },
    { value: "500+", label: "Study Resources" },
    { value: "100+", label: "Expert Mentors" },
    { value: "85%", label: "STEM Enrollment" },
  ];

  const testimonials = [
    {
      quote: "This platform helped me discover my passion for computer science. The study pods kept me accountable.",
      author: "Sarah M.",
      role: "CS Major, Stanford",
    },
    {
      quote: "The mentorship program connected me with a NASA engineer who changed my entire career trajectory.",
      author: "Maya P.",
      role: "Aerospace Engineering Student",
    },
    {
      quote: "I never thought I could love chemistry until I found this community and its incredible resources.",
      author: "Alex Chen",
      role: "Pre-Med, Johns Hopkins",
    },
  ];

  const pillars = [
    {
      icon: <Target className="h-7 w-7" />,
      title: "Empowerment",
      description: "We believe every student has the potential to excel in STEM, and we provide the tools and support to make it happen.",
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Equity",
      description: "Access to quality STEM resources shouldn't depend on your background. We're breaking down barriers.",
    },
    {
      icon: <Heart className="h-7 w-7" />,
      title: "Community",
      description: "Learning is better together. Our community is built on mutual support, respect, and shared growth.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>STEMinist Study Hub — Your STEM Community</title>
        <meta name="description" content="An inclusive digital study hub empowering women and underrepresented students in STEM through study groups, mentorship, AI tools, and community." />
      </Helmet>

      <div className="min-h-screen bg-background font-inter">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Where STEM students thrive together
              </div>
              <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Study smarter.{" "}
                <span className="text-primary">Grow together.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
                An inclusive study hub empowering women and underrepresented students in STEM through community, mentorship, and cutting-edge tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 text-base font-medium shadow-lg shadow-primary/20">
                  <Link to="/auth">
                    Join the Hub
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-medium">
                  <Link to="/features">
                    Explore Features
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {stats.map((stat) => (
                <div key={stat.label} className="py-8 md:py-10 text-center">
                  <p className="text-3xl md:text-4xl font-playfair font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Pillars */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-sm font-medium tracking-widest uppercase text-accent mb-3">Our Mission</p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground text-balance">
                Built on what matters most
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="text-center space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    {pillar.icon}
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 md:py-28 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-sm font-medium tracking-widest uppercase text-accent mb-3">Platform</p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Everything you need to succeed in STEM
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From study tools to mentorship, we've got your entire academic journey covered.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature) => (
                <Link key={feature.title} to={feature.link} className="group">
                  <Card className="h-full border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="font-playfair text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{feature.description}</p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                        Learn more <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link to="/features">
                  View all features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-sm font-medium tracking-widest uppercase text-accent mb-3">Community</p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground text-balance">
                Voices from our community
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t) => (
                <Card key={t.author} className="border border-border/60 bg-card">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-1 text-accent">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed italic">"{t.quote}"</p>
                    <div className="pt-2 border-t border-border">
                      <p className="font-medium text-foreground">{t.author}</p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <Lightbulb className="h-10 w-10 mx-auto opacity-80" />
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-balance">
                Ready to start your STEM journey?
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                Join thousands of students who are studying smarter, building community, and achieving their goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base font-medium bg-white text-primary hover:bg-white/90">
                  <Link to="/auth">
                    Get started — it's free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center space-y-4">
              <h3 className="font-playfair text-2xl font-bold text-foreground">Stay in the loop</h3>
              <p className="text-muted-foreground text-sm">
                Get updates on workshops, opportunities, and community highlights.
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <Input placeholder="Your email address" className="h-11 flex-1" />
                <Button className="h-11 px-6">
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/8f8193e3-0898-424f-8592-ce16830b43ed.png" 
                    alt="STEMinist Study Hub" 
                    className="h-8 w-auto"
                  />
                  <span className="font-playfair font-bold text-foreground">STEMinist</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Empowering the next generation of STEM leaders.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-3">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link to="/study-pods" className="hover:text-primary transition-colors">Study Pods</Link></li>
                  <li><Link to="/ai-tools" className="hover:text-primary transition-colors">AI Tools</Link></li>
                  <li><Link to="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-3">Community</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/mentors" className="hover:text-primary transition-colors">Mentorship</Link></li>
                  <li><Link to="/events" className="hover:text-primary transition-colors">Events</Link></li>
                  <li><Link to="/community" className="hover:text-primary transition-colors">Forum</Link></li>
                  <li><Link to="/challenges" className="hover:text-primary transition-colors">Challenges</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-3">About</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/about" className="hover:text-primary transition-colors">Our Mission</Link></li>
                  <li><Link to="/impact" className="hover:text-primary transition-colors">Impact</Link></li>
                  <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                  <li><Link to="/leadership" className="hover:text-primary transition-colors">Leadership</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} STEMinist Study Hub. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
