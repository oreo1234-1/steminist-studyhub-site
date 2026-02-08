import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, Brain, BookOpen, Calendar, Trophy, Target, Shield,
  MessageCircle, Timer, CheckSquare, BarChart3, Zap, Video,
  GraduationCap, Award, Globe, Accessibility, Lock, Upload,
  Github, Layers, Lightbulb, Mic, ClipboardList, Flame,
  Star, ArrowRight, Sparkles, HeartHandshake, Pencil
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureCategory {
  tag: string;
  title: string;
  description: string;
  features: FeatureItem[];
  accent?: boolean;
}

const Features = () => {
  const categories: FeatureCategory[] = [
    {
      tag: "Community",
      title: "Find your people",
      description: "Connect with peers who share your interests, goals, and drive.",
      features: [
        { icon: <Users className="h-5 w-5" />, title: "User Profiles", description: "Showcase your interests, subjects, and achievements." },
        { icon: <BookOpen className="h-5 w-5" />, title: "Study Groups", description: "Subject-based groups for focused collaboration." },
        { icon: <HeartHandshake className="h-5 w-5" />, title: "Identity Groups", description: "Interest and identity-based communities for belonging." },
        { icon: <MessageCircle className="h-5 w-5" />, title: "Discussion Forums", description: "Ask questions, share knowledge, celebrate wins." },
        { icon: <Video className="h-5 w-5" />, title: "Live Co-Study Rooms", description: "Virtual rooms for real-time study sessions." },
      ],
    },
    {
      tag: "Productivity",
      title: "Study smarter, not harder",
      description: "Tools designed to keep you focused, organized, and on track.",
      features: [
        { icon: <Timer className="h-5 w-5" />, title: "Focus Timer", description: "Pomodoro-style timer with study analytics." },
        { icon: <Calendar className="h-5 w-5" />, title: "Session Scheduling", description: "Plan and schedule study sessions with your group." },
        { icon: <CheckSquare className="h-5 w-5" />, title: "Task Tracker", description: "Track assignments, deadlines, and to-dos." },
        { icon: <Target className="h-5 w-5" />, title: "Goal Setting", description: "Set weekly and semester goals with streaks." },
        { icon: <Layers className="h-5 w-5" />, title: "Calendar Integration", description: "Sync with Google Calendar and other apps." },
      ],
    },
    {
      tag: "Learning",
      title: "Resources that power your learning",
      description: "AI-enhanced tools and curated content for deeper understanding.",
      accent: true,
      features: [
        { icon: <BookOpen className="h-5 w-5" />, title: "Resource Library", description: "Notes, cheat sheets, and problem sets." },
        { icon: <Brain className="h-5 w-5" />, title: "AI Study Assistant", description: "Explanations, summaries, and practice questions." },
        { icon: <Zap className="h-5 w-5" />, title: "Flashcard Generator", description: "Auto-generate flashcards from your materials." },
        { icon: <ClipboardList className="h-5 w-5" />, title: "Quizzes & Mock Exams", description: "Test your knowledge with practice assessments." },
        { icon: <Lightbulb className="h-5 w-5" />, title: "STEM Simulations", description: "Interactive simulations for hands-on learning." },
        { icon: <Pencil className="h-5 w-5" />, title: "Shared Whiteboard", description: "Collaborative problem solving in real time." },
      ],
    },
    {
      tag: "Collaboration",
      title: "Work together, learn faster",
      description: "Real-time tools for group work and peer feedback.",
      features: [
        { icon: <Layers className="h-5 w-5" />, title: "Group Workspaces", description: "Shared spaces for projects and assignments." },
        { icon: <Zap className="h-5 w-5" />, title: "Real-Time Collaboration", description: "Edit documents and solve problems together." },
        { icon: <Video className="h-5 w-5" />, title: "Voice & Video Sessions", description: "Live study calls with screen sharing." },
        { icon: <Star className="h-5 w-5" />, title: "Peer Feedback", description: "Give and receive constructive reviews." },
      ],
    },
    {
      tag: "Mentorship",
      title: "Guidance for every stage",
      description: "Connect with mentors, explore careers, and discover opportunities.",
      accent: true,
      features: [
        { icon: <GraduationCap className="h-5 w-5" />, title: "Peer Mentor Matching", description: "Get matched with mentors in your field." },
        { icon: <Mic className="h-5 w-5" />, title: "Office Hours", description: "Drop-in help sessions with experienced students." },
        { icon: <Globe className="h-5 w-5" />, title: "Career Exploration", description: "Guides, roadmaps, and day-in-the-life spotlights." },
        { icon: <Award className="h-5 w-5" />, title: "Scholarships & Internships", description: "Curated listings updated regularly." },
        { icon: <Lightbulb className="h-5 w-5" />, title: "Project Showcases", description: "Present your research and projects to the community." },
        { icon: <Mic className="h-5 w-5" />, title: "Guest Speakers", description: "Learn from women leaders in STEM." },
      ],
    },
    {
      tag: "Motivation",
      title: "Stay motivated, stay inspired",
      description: "Gamification and recognition to celebrate your progress.",
      features: [
        { icon: <Trophy className="h-5 w-5" />, title: "Badges & Achievements", description: "Earn recognition for milestones and contributions." },
        { icon: <Flame className="h-5 w-5" />, title: "Study Challenges", description: "Weekly sprints and team competitions." },
        { icon: <BarChart3 className="h-5 w-5" />, title: "Leaderboards", description: "Optional rankings to stay competitive." },
        { icon: <Award className="h-5 w-5" />, title: "Certificates", description: "Micro-credentials for completed challenges." },
      ],
    },
    {
      tag: "Analytics",
      title: "Know where you stand",
      description: "Insights into your study habits and progress.",
      features: [
        { icon: <BarChart3 className="h-5 w-5" />, title: "Progress Dashboard", description: "Visualize your study hours, streaks, and growth." },
        { icon: <Timer className="h-5 w-5" />, title: "Study Time Tracking", description: "Automatic tracking across all activities." },
        { icon: <Target className="h-5 w-5" />, title: "Strength & Weakness Insights", description: "AI-powered analysis of your performance." },
      ],
    },
    {
      tag: "Accessibility",
      title: "Designed for everyone",
      description: "Inclusive, safe, and accessible by design.",
      accent: true,
      features: [
        { icon: <Accessibility className="h-5 w-5" />, title: "Accessible Design", description: "WCAG-compliant, screen-reader friendly." },
        { icon: <Zap className="h-5 w-5" />, title: "Low-Bandwidth Mode", description: "Optimized experience for slower connections." },
        { icon: <Lock className="h-5 w-5" />, title: "Privacy & Safety", description: "Robust moderation and privacy protections." },
        { icon: <Shield className="h-5 w-5" />, title: "Safe Spaces", description: "Moderated communities with clear guidelines." },
      ],
    },
    {
      tag: "Integrations",
      title: "Works with your tools",
      description: "Connect the platforms you already use.",
      features: [
        { icon: <Upload className="h-5 w-5" />, title: "Google Drive", description: "Upload and share files directly." },
        { icon: <Calendar className="h-5 w-5" />, title: "Calendar Apps", description: "Sync events with your favorite calendar." },
        { icon: <Github className="h-5 w-5" />, title: "GitHub", description: "Showcase code projects and contributions." },
        { icon: <Layers className="h-5 w-5" />, title: "LMS Compatibility", description: "Works alongside your school's learning system." },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Features — STEMinist Study Hub</title>
        <meta name="description" content="Explore all the features of STEMinist Study Hub: study groups, AI tools, mentorship, resource library, gamification, and more." />
      </Helmet>

      <div className="min-h-screen bg-background font-inter">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-20 relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Everything in one place
            </div>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight max-w-3xl mx-auto text-balance">
              Built for how you <span className="text-primary">actually study</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              From focus timers to AI assistants, mentorship to career prep — every feature is designed to help STEM students succeed.
            </p>
            <Button asChild size="lg" className="h-12 px-8 text-base font-medium shadow-lg shadow-primary/20">
              <Link to="/auth">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Feature Categories */}
        {categories.map((category, idx) => (
          <section
            key={category.tag}
            className={`py-16 md:py-24 ${idx % 2 === 1 ? "bg-muted/40" : ""}`}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                  <p className="text-sm font-medium tracking-widest uppercase text-accent mb-3">{category.tag}</p>
                  <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
                    {category.title}
                  </h2>
                  <p className="text-muted-foreground max-w-xl">{category.description}</p>
                </div>
                <div className={`grid sm:grid-cols-2 ${category.features.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-5`}>
                  {category.features.map((feature) => (
                    <Card key={feature.title} className="border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300">
                      <CardContent className="p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <section className="py-20 md:py-28 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-balance">
                Ready to explore everything?
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Join thousands of students already using STEMinist Study Hub to ace their studies and build their future.
              </p>
              <Button asChild size="lg" variant="secondary" className="h-12 px-8 text-base font-medium bg-white text-primary hover:bg-white/90">
                <Link to="/auth">
                  Join the Hub — free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Features;
