import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Mic, Coffee, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Events = () => {
  const guestSpeakers = [
    {
      title: "Women in Tech Leadership Panel",
      date: "December 5, 2024",
      time: "6:00 PM - 7:30 PM",
      location: "Virtual (Zoom)",
      speakers: ["Dr. Maria Chen - Google AI", "Sarah Williams - NASA", "Prof. Aisha Johnson - MIT"],
      description: "Hear from inspiring women leaders about their journeys in technology and innovation.",
      attendees: 45,
      maxAttendees: 100,
      type: "Guest Speaker"
    },
    {
      title: "Breaking Barriers in Biotech",
      date: "December 12, 2024",
      time: "5:00 PM - 6:00 PM",
      location: "Virtual (Zoom)",
      speakers: ["Dr. Elena Rodriguez - Moderna"],
      description: "Learn about cutting-edge biotechnology research and career paths in the field.",
      attendees: 32,
      maxAttendees: 75,
      type: "Guest Speaker"
    },
    {
      title: "Climate Science & Engineering Solutions",
      date: "December 18, 2024",
      time: "4:00 PM - 5:30 PM",
      location: "Virtual (Zoom)",
      speakers: ["Dr. Keisha Brown - Tesla", "Prof. Yuki Tanaka - Stanford"],
      description: "Explore how engineering innovations are addressing climate challenges.",
      attendees: 28,
      maxAttendees: 80,
      type: "Guest Speaker"
    }
  ];

  const studyNights = [
    {
      title: "AP Chemistry Study Marathon",
      date: "December 7, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "Virtual Study Rooms",
      description: "Group study session with practice problems, concept reviews, and peer support.",
      attendees: 18,
      maxAttendees: 30,
      type: "Study Night",
      subjects: ["Chemistry", "AP Prep"]
    },
    {
      title: "Calculus Crash Course",
      date: "December 10, 2024",
      time: "7:00 PM - 9:00 PM",
      location: "Virtual Study Rooms",
      description: "Focus on derivatives, integrals, and applications with group problem-solving.",
      attendees: 22,
      maxAttendees: 35,
      type: "Study Night",
      subjects: ["Mathematics", "Calculus"]
    },
    {
      title: "Physics Lab Prep Session",
      date: "December 14, 2024",
      time: "5:00 PM - 7:00 PM",
      location: "Virtual Study Rooms",
      description: "Prepare for physics lab practicals with demonstrations and Q&A.",
      attendees: 15,
      maxAttendees: 25,
      type: "Study Night",
      subjects: ["Physics", "Lab Skills"]
    }
  ];

  const collaborativeProjects = [
    {
      title: "Build a Weather Station",
      date: "Ongoing - Join Anytime",
      time: "Weekly meetings Saturdays 2:00 PM",
      location: "Virtual + Local Meetups",
      description: "Collaborative engineering project to design and build IoT weather monitoring stations.",
      attendees: 12,
      maxAttendees: 20,
      type: "Project",
      skills: ["Engineering", "Programming", "Electronics"],
      duration: "8 weeks"
    },
    {
      title: "Community Water Quality Analysis",
      date: "Ongoing - Join Anytime",
      time: "Bi-weekly Sundays 3:00 PM",
      location: "Virtual + Field Work",
      description: "Scientific research project testing local water sources and analyzing data.",
      attendees: 8,
      maxAttendees: 15,
      type: "Project",
      skills: ["Chemistry", "Data Analysis", "Research"],
      duration: "10 weeks"
    },
    {
      title: "Mobile App for Study Resources",
      date: "Ongoing - Join Anytime",
      time: "Weekly Fridays 6:00 PM",
      location: "Virtual Collaboration",
      description: "Develop a mobile app to organize and share STEM study materials.",
      attendees: 10,
      maxAttendees: 18,
      type: "Project",
      skills: ["Programming", "UI/UX Design", "Teamwork"],
      duration: "12 weeks"
    }
  ];

  const socialEvents = [
    {
      title: "STEM Game Night",
      date: "December 8, 2024",
      time: "7:00 PM - 9:00 PM",
      location: "Virtual (Discord)",
      description: "Fun evening with science trivia, math puzzles, and coding challenges!",
      attendees: 35,
      maxAttendees: 50,
      type: "Social"
    },
    {
      title: "Coffee Chat: Women in Engineering",
      date: "December 15, 2024",
      time: "11:00 AM - 12:00 PM",
      location: "Virtual (Zoom)",
      description: "Casual conversation about experiences, challenges, and successes in engineering.",
      attendees: 12,
      maxAttendees: 20,
      type: "Social"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Community Events 🌟
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Connect with guest speakers, join study nights, collaborate on STEM projects, 
            and build lasting friendships with your STEM sisters!
          </p>
        </div>

        <Tabs defaultValue="speakers" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="speakers">Guest Speakers</TabsTrigger>
            <TabsTrigger value="study">Study Nights</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          {/* Guest Speakers */}
          <TabsContent value="speakers" className="space-y-6">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-playfair flex items-center gap-2">
                  <Mic className="h-6 w-6" />
                  Inspiring Guest Speakers
                </CardTitle>
                <CardDescription>
                  Learn from accomplished women in STEM fields and get inspired by their journeys
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guestSpeakers.map((event, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader>
                    <Badge className="w-fit mb-2">{event.type}</Badge>
                    <CardTitle className="font-playfair text-xl">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees}/{event.maxAttendees} registered</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Featured Speakers:</p>
                      {event.speakers.map((speaker, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs mr-2">
                          {speaker}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Register for Event
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Study Nights */}
          <TabsContent value="study" className="space-y-6">
            <Card className="border-2 border-secondary/20 bg-secondary/5">
              <CardHeader>
                <CardTitle className="font-playfair flex items-center gap-2">
                  <Coffee className="h-6 w-6" />
                  Group Study Nights
                </CardTitle>
                <CardDescription>
                  Join focused study sessions with peers tackling the same subjects
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyNights.map((event, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-secondary/30">
                  <CardHeader>
                    <Badge className="w-fit mb-2" variant="secondary">{event.type}</Badge>
                    <CardTitle className="font-playfair text-xl">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees}/{event.maxAttendees} attending</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {event.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full">Join Study Night</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaborative Projects */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="border-2 border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="font-playfair flex items-center gap-2">
                  <Lightbulb className="h-6 w-6" />
                  Collaborative STEM Projects
                </CardTitle>
                <CardDescription>
                  Work together on real-world projects and build your portfolio
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collaborativeProjects.map((project, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-accent/30">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{project.type}</Badge>
                      <Badge>{project.duration}</Badge>
                    </div>
                    <CardTitle className="font-playfair text-xl">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{project.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{project.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{project.attendees}/{project.maxAttendees} participants</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Skills You'll Gain:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-accent hover:bg-accent/90">
                      Join Project Team
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Social Events */}
          <TabsContent value="social" className="space-y-6">
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-playfair flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Social & Networking Events
                </CardTitle>
                <CardDescription>
                  Build friendships and connections in a relaxed, fun environment
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialEvents.map((event, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/30">
                  <CardHeader>
                    <Badge className="w-fit mb-2">{event.type}</Badge>
                    <CardTitle className="font-playfair text-xl">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.attendees}/{event.maxAttendees} attending</span>
                      </div>
                    </div>

                    <Button className="w-full">Join Event</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
