import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Users, Calendar, Target, Heart, Mail, Brain, MessageCircle, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const quickAccessItems = [
    {
      title: "🧠 Study Materials",
      description: "Access comprehensive STEM resources",
      icon: <BookOpen className="h-8 w-8" />,
      link: "/study-materials"
    },
    {
      title: "👩🏾‍🏫 Meet Mentors", 
      description: "Connect with inspiring STEM professionals",
      icon: <Users className="h-8 w-8" />,
      link: "/mentors"
    },
    {
      title: "🗓️ Join Workshops",
      description: "Participate in hands-on learning sessions", 
      icon: <Calendar className="h-8 w-8" />,
      link: "/workshops"
    },
    {
      title: "🤖 AI Study Tools",
      description: "Supercharge your learning with AI",
      icon: <Brain className="h-8 w-8" />,
      link: "/ai-tools"
    },
    {
      title: "💬 Community Forum",
      description: "Connect with fellow STEM sisters",
      icon: <MessageCircle className="h-8 w-8" />,
      link: "/community"
    },
    {
      title: "🏆 Your Progress",
      description: "Track achievements and level up",
      icon: <Trophy className="h-8 w-8" />,
      link: "/gamification"
    }
  ];

  const testimonials = [
    {
      quote: "This platform helped me discover my passion for computer science!",
      author: "Sarah M., High School Student",
      emoji: "👩🏽‍💻"
    },
    {
      quote: "The mentorship program connected me with amazing role models.",
      author: "Maya P., College Freshman",
      emoji: "👩🏾‍🔬"
    },
    {
      quote: "I never thought I could love chemistry until I found this community.",
      author: "Alex Chen, Junior",
      emoji: "👩🏻‍🔬"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-16 border border-accent/20">
        <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6">
          Welcome to STEMinist Study Hub
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-inter">
          Empowering girls to thrive in STEM through study, mentorship, and sisterhood.
        </p>
        <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
          Start Your Journey ✨
        </Button>
      </div>

      {/* Quick Access */}
      <div className="mb-16">
        <h2 className="font-playfair text-3xl font-bold text-center text-foreground mb-8">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessItems.map((item, index) => (
            <Card key={index} className="group hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 cursor-pointer border-2 hover:border-accent">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-secondary/20 rounded-full w-fit group-hover:bg-accent/30 transition-colors">
                  <div className="text-primary">
                    {item.icon}
                  </div>
                </div>
                <CardTitle className="font-playfair text-lg">{item.title}</CardTitle>
                <CardDescription className="font-inter">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
                  <Link to={item.link}>
                    Explore
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16 bg-muted/30 rounded-xl p-8">
        <h2 className="font-playfair text-3xl font-bold text-center text-foreground mb-8">
          What Our Community Says
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="text-center border-2 border-secondary/30">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">{testimonial.emoji}</div>
                <p className="font-inter text-muted-foreground mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <p className="font-medium text-foreground">
                  {testimonial.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="text-center bg-primary/5 rounded-xl p-8 border border-accent/30">
        <h2 className="font-playfair text-3xl font-bold text-center text-foreground mb-8">
          Stay Connected
        </h2>
        <p className="text-muted-foreground mb-6 font-inter">
          Get the latest updates on workshops, opportunities, and community highlights
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input 
            placeholder="Enter your email" 
            className="flex-1"
          />
          <Button className="bg-primary hover:bg-primary/90">
            <Mail className="h-4 w-4 mr-2" />
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;