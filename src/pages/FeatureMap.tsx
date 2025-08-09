import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeatureItem {
  name: string;
  status: "live" | "planned";
  link?: string;
  note?: string;
}

interface FeatureSection {
  title: string;
  items: FeatureItem[];
}

const sections: FeatureSection[] = [
  {
    title: "AI-Powered Learning",
    items: [
      { name: "AI study assistant (explain concepts, generate notes, flashcards, quizzes)", status: "live", link: "/ai-tools" },
      { name: "Personalized study plan generator", status: "live", link: "/ai-tools" },
      { name: "STEM-specific problem-solving help", status: "live", link: "/ai-tools" },
      { name: "AI research summarizer", status: "live", link: "/ai-tools" },
    ],
  },
  {
    title: "Gamification & Productivity",
    items: [
      { name: "Study streak tracker", status: "planned" },
      { name: "XP points & leveling system", status: "live", link: "/gamification", note: "Basic version" },
      { name: "Leaderboards (individual & group)", status: "planned" },
      { name: "Timed study sessions (Pomodoro mode)", status: "planned" },
      { name: "Achievements & badges", status: "live", link: "/gamification" },
    ],
  },
  {
    title: "Community & Collaboration",
    items: [
      { name: "Study group matching (interest/subject-based)", status: "planned" },
      { name: "Live co-study rooms (video/audio + shared timer)", status: "planned" },
      { name: "Peer mentorship matching", status: "planned" },
      { name: "Discussion boards for STEM topics", status: "live", link: "/community" },
      { name: "Group challenges & competitions", status: "planned" },
    ],
  },
  {
    title: "Events & Opportunities",
    items: [
      { name: "Virtual STEM workshops & webinars", status: "live", link: "/workshops" },
      { name: "Hackathons & innovation challenges", status: "planned" },
      { name: "Career talks with STEM professionals", status: "planned" },
      { name: "Internship & research opportunity board", status: "live", link: "/opportunities" },
    ],
  },
  {
    title: "Resource Library",
    items: [
      { name: "Curated STEM textbooks, articles, and tools", status: "live", link: "/study-materials" },
      { name: "Journal club (share & discuss research papers)", status: "planned" },
      { name: "Recorded workshops & tutorials archive", status: "planned" },
      { name: "STEM-focused blog & newsletters", status: "planned" },
    ],
  },
  {
    title: "Profile & Customization",
    items: [
      { name: "Customizable dashboard (widgets, themes)", status: "planned" },
      { name: "Progress tracking & analytics", status: "live", link: "/dashboard" },
      { name: "Portfolio of completed challenges & achievements", status: "planned" },
      { name: "Integration with calendars & task managers", status: "planned" },
    ],
  },
  {
    title: "Platform Integration",
    items: [
      { name: "Discord/Forum community link", status: "live", link: "/community", note: "Forum live" },
      { name: "Mobile & desktop access", status: "live" },
      { name: "Cloud-synced notes & resources", status: "planned" },
      { name: "AI plugin integrations for added features", status: "planned" },
    ],
  },
];

const StatusBadge = ({ status }: { status: FeatureItem["status"] }) => (
  <Badge variant={status === "live" ? "default" : "outline"} className={status === "live" ? "bg-accent text-white" : "text-primary border-primary/30"}>
    {status === "live" ? "Live" : "Planned"}
  </Badge>
);

export default function FeatureMap() {
  const canonical = typeof window !== "undefined" ? `${window.location.origin}/feature-map` : "/feature-map";

  return (
    <>
      <Helmet>
        <title>Feature Map | STEMinist Study Hub</title>
        <meta name="description" content="Explore live and upcoming features: AI tools, gamification, community, events, resources, and more." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <header className="bg-gradient-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            STEMinist Study Hub Feature Map
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            See what’s live today and what’s coming next across AI learning, gamification, community, events, and resources.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <section key={section.title} aria-labelledby={section.title.replace(/\s+/g, "-").toLowerCase()}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle id={section.title.replace(/\s+/g, "-").toLowerCase()} className="flex items-center justify-between">
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.name} className="flex items-start justify-between gap-4 p-3 rounded-lg border bg-card/50">
                      <div className="space-y-1">
                        <p className="font-medium text-primary leading-snug">
                          {item.name}
                        </p>
                        {item.note && (
                          <p className="text-xs text-muted-foreground">{item.note}</p>
                        )}
                        {item.link && (
                          <div className="pt-1">
                            <Button asChild size="sm" variant="link" className="px-0 text-accent">
                              <Link to={item.link} aria-label={`Go to ${item.name}`}>Open</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        <aside className="mt-10 text-sm text-muted-foreground">
          Can’t find a feature you want? Tell us and we’ll prioritize it.
        </aside>
      </main>
    </>
  );
}
