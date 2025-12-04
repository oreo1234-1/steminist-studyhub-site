import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, Users, Award, Target, Zap, Code, Palette, FolderOpen } from "lucide-react";
import { SubmissionPortal } from "@/components/challenges/SubmissionPortal";
import { MySubmissions } from "@/components/challenges/MySubmissions";

const Challenges = () => {
  const [selectedTab, setSelectedTab] = useState("monthly");
  const monthlyChallenges = [
    {
      id: 1,
      title: "Climate Data Analysis Challenge",
      description: "Analyze global climate datasets and create visualizations that tell a compelling story about environmental change.",
      category: "Data Science",
      difficulty: "Intermediate",
      deadline: "2025-12-15",
      participants: 127,
      prize: "$500 + Internship Interview",
      status: "active"
    },
    {
      id: 2,
      title: "Medical Device Innovation",
      description: "Design a low-cost medical device prototype that addresses healthcare accessibility in underserved communities.",
      category: "Engineering",
      difficulty: "Advanced",
      deadline: "2025-12-20",
      participants: 89,
      prize: "$750 + Mentorship",
      status: "active"
    },
    {
      id: 3,
      title: "Algorithm Optimization Sprint",
      description: "Optimize sorting and search algorithms for performance on large datasets. Fastest solution wins!",
      category: "Computer Science",
      difficulty: "Beginner",
      deadline: "2025-12-10",
      participants: 203,
      prize: "$300 + Tech Bundle",
      status: "active"
    }
  ];

  const hackathons = [
    {
      id: 1,
      title: "Women in Tech Hackathon 2025",
      description: "48-hour virtual hackathon focused on building solutions for women's health and wellness.",
      date: "Jan 15-17, 2025",
      format: "Virtual",
      teamSize: "2-4 members",
      participants: 450,
      prize: "$5,000 Prize Pool",
      sponsors: ["Tech Corp", "Innovation Labs"]
    },
    {
      id: 2,
      title: "AI for Good Challenge",
      description: "Create AI-powered solutions that address social impact challenges in education, healthcare, or environment.",
      date: "Feb 1-3, 2025",
      format: "Hybrid",
      teamSize: "1-5 members",
      participants: 320,
      prize: "$3,000 + Cloud Credits",
      sponsors: ["AI Foundation", "Cloud Solutions"]
    },
    {
      id: 3,
      title: "Biotech Innovation Sprint",
      description: "Design biotechnology solutions for sustainable food production and agricultural innovation.",
      date: "Mar 8-10, 2025",
      format: "In-Person",
      teamSize: "3-5 members",
      participants: 180,
      prize: "$4,000 + Lab Access",
      sponsors: ["BioTech Inc", "Green Future"]
    }
  ];

  const designCompetitions = [
    {
      id: 1,
      title: "STEM Learning App UI/UX Design",
      description: "Design an intuitive and engaging user interface for a K-12 STEM learning application.",
      type: "UI/UX Design",
      deadline: "2025-12-25",
      participants: 156,
      prize: "$1,000 + Portfolio Feature",
      requirements: ["Figma/Adobe XD", "Interactive Prototype", "Design System"]
    },
    {
      id: 2,
      title: "Robotics Prototype Challenge",
      description: "Design and prototype a robot that can assist in disaster relief operations.",
      type: "Engineering Design",
      deadline: "2026-01-15",
      participants: 94,
      prize: "$2,000 + Manufacturing Grant",
      requirements: ["CAD Models", "Bill of Materials", "Proof of Concept"]
    },
    {
      id: 3,
      title: "Sustainable Energy System Design",
      description: "Create an innovative design for a renewable energy system for remote communities.",
      type: "Systems Design",
      deadline: "2026-01-30",
      participants: 112,
      prize: "$1,500 + Mentor Network",
      requirements: ["Technical Drawings", "Feasibility Study", "Cost Analysis"]
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 2450, badges: 12, challenges: 18 },
    { rank: 2, name: "Maya Patel", points: 2380, badges: 11, challenges: 16 },
    { rank: 3, name: "Jessica Rodriguez", points: 2210, badges: 10, challenges: 15 },
    { rank: 4, name: "Emily Washington", points: 2150, badges: 9, challenges: 14 },
    { rank: 5, name: "Zara Ahmed", points: 2050, badges: 9, challenges: 13 },
    { rank: 6, name: "Olivia Kim", points: 1980, badges: 8, challenges: 12 },
    { rank: 7, name: "Rachel Green", points: 1890, badges: 8, challenges: 11 },
    { rank: 8, name: "Sophia Martinez", points: 1820, badges: 7, challenges: 10 },
    { rank: 9, name: "Priya Sharma", points: 1750, badges: 7, challenges: 10 },
    { rank: 10, name: "Isabella Brown", points: 1690, badges: 6, challenges: 9 }
  ];

  const recentWinners = [
    {
      challenge: "Quantum Computing Algorithm Challenge",
      winner: "Maya Patel",
      date: "Nov 2025",
      prize: "$1,000",
      achievement: "Developed breakthrough optimization algorithm"
    },
    {
      challenge: "Green Tech Innovation Hackathon",
      winner: "Team EcoBuilders (Sarah Chen, Emily Washington, Zara Ahmed)",
      date: "Oct 2025",
      prize: "$3,500",
      achievement: "Created sustainable building materials from waste"
    },
    {
      challenge: "Medical AI Design Sprint",
      winner: "Jessica Rodriguez",
      date: "Oct 2025",
      prize: "$750",
      achievement: "AI-powered early disease detection system"
    }
  ];

  return (
    <>
      <Helmet>
        <title>STEM Challenges & Competitions | Women in STEM</title>
        <meta name="description" content="Join monthly STEM challenges, hackathons, and design competitions. Compete for prizes, build your portfolio, and connect with the STEM community." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">Compete, Learn, Win</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              STEM Challenges & Competitions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Test your skills, compete with peers, and win prizes while building your STEM portfolio
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">Active Challenges</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1,847</p>
                    <p className="text-sm text-muted-foreground">Participants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$50K+</p>
                    <p className="text-sm text-muted-foreground">In Prizes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Upcoming Events</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-12">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="monthly">
                <Target className="w-4 h-4 mr-2" />
                Monthly Challenges
              </TabsTrigger>
              <TabsTrigger value="hackathons">
                <Code className="w-4 h-4 mr-2" />
                Hackathons
              </TabsTrigger>
              <TabsTrigger value="design">
                <Palette className="w-4 h-4 mr-2" />
                Design Competitions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {monthlyChallenges.map((challenge) => (
                  <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={challenge.status === "active" ? "default" : "secondary"}>
                          {challenge.status === "active" ? "Active" : "Upcoming"}
                        </Badge>
                        <Badge variant="outline">{challenge.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {new Date(challenge.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Trophy className="w-4 h-4" />
                          <span className="font-semibold text-foreground">{challenge.prize}</span>
                        </div>
                      </div>
                      <SubmissionPortal 
                        challenge={{ id: challenge.id, title: challenge.title, type: "monthly" }} 
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hackathons" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {hackathons.map((hackathon) => (
                  <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge>{hackathon.format}</Badge>
                        <Badge variant="outline">{hackathon.teamSize}</Badge>
                      </div>
                      <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                      <CardDescription>{hackathon.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{hackathon.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{hackathon.participants} registered</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Trophy className="w-4 h-4" />
                          <span className="font-semibold text-foreground">{hackathon.prize}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Sponsored by:</p>
                        <div className="flex flex-wrap gap-2">
                          {hackathon.sponsors.map((sponsor, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {sponsor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <SubmissionPortal 
                        challenge={{ id: hackathon.id, title: hackathon.title, type: "hackathon" }} 
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designCompetitions.map((competition) => (
                  <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit mb-2">{competition.type}</Badge>
                      <CardTitle className="text-xl">{competition.title}</CardTitle>
                      <CardDescription>{competition.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {new Date(competition.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{competition.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Trophy className="w-4 h-4" />
                          <span className="font-semibold text-foreground">{competition.prize}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {competition.requirements.map((req, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <SubmissionPortal 
                        challenge={{ id: competition.id, title: competition.title, type: "design" }} 
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* My Submissions Section */}
          <div className="mb-12">
            <MySubmissions />
          </div>

          {/* Leaderboard Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Community Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Top performers based on challenge completions and points earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.rank}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 font-bold text-primary">
                          {entry.rank}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{entry.name}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{entry.points} points</span>
                            <span>{entry.badges} badges</span>
                            <span>{entry.challenges} challenges</span>
                          </div>
                        </div>
                        {entry.rank <= 3 && (
                          <Award className={`w-6 h-6 ${
                            entry.rank === 1 ? "text-yellow-500" :
                            entry.rank === 2 ? "text-gray-400" :
                            "text-amber-700"
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Recent Winners
                  </CardTitle>
                  <CardDescription>
                    Celebrating our latest champions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentWinners.map((winner, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <Badge variant="secondary">{winner.date}</Badge>
                          <Badge>{winner.prize}</Badge>
                        </div>
                        <h4 className="font-semibold text-sm">{winner.challenge}</h4>
                        <p className="text-sm text-muted-foreground">{winner.winner}</p>
                        <p className="text-xs text-muted-foreground italic">{winner.achievement}</p>
                        {idx < recentWinners.length - 1 && <div className="border-t mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Ready to Compete?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join our community of ambitious STEM students, showcase your skills, and win prizes while building your portfolio.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg">Browse All Challenges</Button>
                <Button size="lg" variant="outline">View Past Winners</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Challenges;
