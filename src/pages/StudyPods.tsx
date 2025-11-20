import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, BookOpen, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const StudyPods = () => {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const studyPods = [
    {
      name: "Algebra 1 Study Group",
      subject: "Mathematics",
      level: "Middle School (6-8)",
      members: 8,
      maxMembers: 12,
      schedule: "Tuesdays & Thursdays, 4:00 PM",
      description: "Master algebraic concepts with collaborative problem-solving and peer support.",
      topics: ["Linear Equations", "Polynomials", "Factoring"]
    },
    {
      name: "Biology Lab Partners",
      subject: "Science",
      level: "High School (9-12)",
      members: 6,
      maxMembers: 10,
      schedule: "Mondays & Wednesdays, 5:30 PM",
      description: "Dive deep into cellular biology, genetics, and lab techniques together.",
      topics: ["Cell Biology", "Genetics", "Lab Skills"]
    },
    {
      name: "Python Programming Circle",
      subject: "Technology",
      level: "High School (9-12)",
      members: 10,
      maxMembers: 15,
      schedule: "Saturdays, 2:00 PM",
      description: "Learn Python from scratch through coding challenges and group projects.",
      topics: ["Python Basics", "Data Structures", "Projects"]
    },
    {
      name: "Calculus BC Support Squad",
      subject: "Mathematics",
      level: "High School (9-12)",
      members: 7,
      maxMembers: 10,
      schedule: "Sundays, 3:00 PM",
      description: "Conquer AP Calculus BC with practice problems and concept reviews.",
      topics: ["Derivatives", "Integrals", "Series"]
    },
    {
      name: "Chemistry Problem Solvers",
      subject: "Science",
      level: "High School (9-12)",
      members: 9,
      maxMembers: 12,
      schedule: "Fridays, 4:00 PM",
      description: "Work through chemistry concepts, stoichiometry, and lab techniques.",
      topics: ["Chemical Reactions", "Stoichiometry", "Lab Safety"]
    },
    {
      name: "College Physics Study Pod",
      subject: "Science",
      level: "College (Undergrad)",
      members: 5,
      maxMembers: 8,
      schedule: "Wednesdays & Fridays, 6:00 PM",
      description: "Tackle university-level physics with collaborative problem-solving.",
      topics: ["Mechanics", "Thermodynamics", "Electricity"]
    },
    {
      name: "Discrete Math Study Circle",
      subject: "Mathematics",
      level: "College (Undergrad)",
      members: 6,
      maxMembers: 10,
      schedule: "Tuesdays, 7:00 PM",
      description: "Master logic, proofs, and discrete structures for computer science.",
      topics: ["Logic", "Proofs", "Graph Theory"]
    },
    {
      name: "Data Structures & Algorithms",
      subject: "Technology",
      level: "College (Undergrad)",
      members: 8,
      maxMembers: 12,
      schedule: "Thursdays, 5:00 PM",
      description: "Prepare for technical interviews and master CS fundamentals together.",
      topics: ["Arrays & Lists", "Trees & Graphs", "Algorithms"]
    }
  ];

  const filteredPods = studyPods.filter(pod => {
    const matchesLevel = levelFilter === "all" || pod.level === levelFilter;
    const matchesSubject = subjectFilter === "all" || pod.subject === subjectFilter;
    return matchesLevel && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Study Pods 👥
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Join small-group study sessions for core STEM subjects from middle school to college. 
            Collaborate, learn, and grow together with fellow STEM sisters!
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Your Study Pod
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Education Level</label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Middle School (6-8)">Middle School (6-8)</SelectItem>
                    <SelectItem value="High School (9-12)">High School (9-12)</SelectItem>
                    <SelectItem value="College (Undergrad)">College (Undergrad)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Area</label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(levelFilter !== "all" || subjectFilter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setLevelFilter("all");
                  setSubjectFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Study Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPods.map((pod, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{pod.level}</Badge>
                  <Badge variant="outline">{pod.members}/{pod.maxMembers} members</Badge>
                </div>
                <CardTitle className="font-playfair text-xl">{pod.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4" />
                  {pod.subject}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{pod.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{pod.schedule}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Topics Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {pod.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Users className="h-4 w-4 mr-2" />
                  Join Pod
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPods.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No study pods match your filters.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setLevelFilter("all");
                setSubjectFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Create Your Own Pod */}
        <Card className="border-2 border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="font-playfair text-2xl">Create Your Own Study Pod</CardTitle>
            <CardDescription>
              Don't see what you're looking for? Start your own study pod and invite others to join!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              <Plus className="h-5 w-5 mr-2" />
              Create New Pod
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyPods;
