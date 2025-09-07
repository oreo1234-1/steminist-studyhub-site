import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, MessageCircle, Calendar, Loader2, Crown, Zap, Target, BookOpen, Users, BarChart3 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AIStudyTools = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any>({});

  const tools = [
    {
      title: "AI Flashcard Generator",
      description: "Paste your notes and get instant flashcards",
      icon: <Brain className="h-8 w-8" />,
      example: "Input: Photosynthesis notes → Output: 10 flashcards with Q&A",
      tier: "free"
    },
    {
      title: "AI Summarizer", 
      description: "Upload text and get summaries with key points",
      icon: <FileText className="h-8 w-8" />,
      example: "Input: 5-page chapter → Output: 1-page summary + bullet points",
      tier: "free"
    },
    {
      title: "AI STEM Chatbot",
      description: "Ask questions and get STEM-specific answers",
      icon: <MessageCircle className="h-8 w-8" />,
      example: "Ask: 'Explain Newton's laws' → Get detailed, student-friendly answer",
      tier: "free"
    },
    {
      title: "Study Plan Builder",
      description: "Enter exam date and topics for AI-built study schedule",
      icon: <Calendar className="h-8 w-8" />,
      example: "Input: Chemistry exam in 2 weeks → Output: Daily study plan",
      tier: "free"
    }
  ];

  const premiumFeatures = [
    {
      title: "Advanced Analytics Dashboard",
      description: "Track your learning progress with detailed insights",
      icon: <BarChart3 className="h-6 w-6" />,
      features: ["Study time tracking", "Performance analytics", "Progress reports", "Goal tracking"],
      tier: "premium"
    },
    {
      title: "Unlimited AI Generations",
      description: "No limits on flashcards, summaries, or AI interactions",
      icon: <Zap className="h-6 w-6" />,
      features: ["Unlimited flashcards", "Unlimited summaries", "Unlimited chatbot usage", "Priority processing"],
      tier: "premium"
    },
    {
      title: "Personalized Study Paths",
      description: "AI-powered adaptive learning recommendations",
      icon: <Target className="h-6 w-6" />,
      features: ["Personalized curriculum", "Adaptive difficulty", "Smart scheduling", "Learning style analysis"],
      tier: "premium"
    },
    {
      title: "Expert Study Materials",
      description: "Access premium STEM resources and expert content",
      icon: <BookOpen className="h-6 w-6" />,
      features: ["Premium study guides", "Expert-curated content", "Advanced simulations", "Research paper access"],
      tier: "premium"
    },
    {
      title: "Private Study Groups",
      description: "Create and manage exclusive study communities",
      icon: <Users className="h-6 w-6" />,
      features: ["Private group creation", "Advanced moderation tools", "Custom challenges", "Group analytics"],
      tier: "premium"
    },
    {
      title: "1-on-1 AI Tutor",
      description: "Personal AI tutor for advanced STEM concepts",
      icon: <Crown className="h-6 w-6" />,
      features: ["Personalized tutoring", "Advanced problem solving", "Real-time feedback", "Custom learning plans"],
      tier: "premium"
    }
  ];

  const handleFlashcardGeneration = async (notes: string) => {
    if (!notes.trim()) {
      toast({
        title: "Error",
        description: "Please enter some notes to generate flashcards",
        variant: "destructive",
      });
      return;
    }

    setLoading('flashcards');
    try {
      const { data, error } = await supabase.functions.invoke('ai-flashcards', {
        body: { notes }
      });

      if (error) throw error;

      setResults(prev => ({ ...prev, flashcards: data.flashcards }));
      toast({
        title: "Success! ✨",
        description: `Generated ${data.flashcards.length} flashcards from your notes`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleSummarization = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to summarize",
        variant: "destructive",
      });
      return;
    }

    setLoading('summarizer');
    try {
      const { data, error } = await supabase.functions.invoke('ai-summarizer', {
        body: { text }
      });

      if (error) throw error;

      setResults(prev => ({ ...prev, summary: data.summary }));
      toast({
        title: "Success! 📝",
        description: "Generated summary of your text",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleChatbot = async (question: string) => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setLoading('chatbot');
    try {
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: { question }
      });

      if (error) throw error;

      setResults(prev => ({ ...prev, chatAnswer: data.answer }));
      toast({
        title: "Success! 💬",
        description: "Your STEM study buddy has answered your question",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleStudyPlan = async (examDate: string, topics: string) => {
    if (!examDate || !topics.trim()) {
      toast({
        title: "Error",
        description: "Please enter both exam date and topics",
        variant: "destructive",
      });
      return;
    }

    setLoading('studyplan');
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-plan', {
        body: { examDate, topics }
      });

      if (error) throw error;

      setResults(prev => ({ ...prev, studyPlan: data }));
      toast({
        title: "Success! 📅",
        description: "Created your personalized study plan",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create study plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI Study Tools 🤖
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Supercharge your STEM learning with AI-powered study tools designed just for you
          </p>
        </div>

        {/* Free Tools Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">Free Tools</Badge>
            <h2 className="font-playfair text-3xl font-bold text-foreground mb-4">
              Get Started with AI Study Tools
            </h2>
            <p className="text-muted-foreground">
              Try our core AI-powered study tools completely free
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-card border-2 hover:border-accent">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="text-xs">FREE</Badge>
                  </div>
                  <div className="mx-auto mb-4 p-4 bg-secondary/20 rounded-full w-fit group-hover:bg-accent/30 transition-colors">
                    <div className="text-primary">
                      {tool.icon}
                    </div>
                  </div>
                  <CardTitle className="font-playfair text-xl text-foreground">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground font-medium mb-2">Example:</p>
                  <p className="text-sm">{tool.example}</p>
                </div>
                
                {tool.title === "AI Flashcard Generator" && (
                  <div className="space-y-3">
                    <Textarea 
                      id="flashcard-notes"
                      placeholder="Paste your notes here..."
                      className="min-h-[100px]"
                    />
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        const notes = (document.getElementById('flashcard-notes') as HTMLTextAreaElement)?.value;
                        handleFlashcardGeneration(notes);
                      }}
                      disabled={loading === 'flashcards'}
                    >
                      {loading === 'flashcards' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Flashcards ✨'
                      )}
                    </Button>
                    {results.flashcards && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Generated Flashcards:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {results.flashcards.map((card: any, i: number) => (
                            <div key={i} className="text-sm border rounded p-2">
                              <div className="font-medium">Q: {card.question}</div>
                              <div className="text-muted-foreground">A: {card.answer}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tool.title === "AI Summarizer" && (
                  <div className="space-y-3">
                    <Textarea 
                      id="summarizer-text"
                      placeholder="Paste text to summarize..."
                      className="min-h-[100px]"
                    />
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        const text = (document.getElementById('summarizer-text') as HTMLTextAreaElement)?.value;
                        handleSummarization(text);
                      }}
                      disabled={loading === 'summarizer'}
                    >
                      {loading === 'summarizer' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Summarizing...
                        </>
                      ) : (
                        'Create Summary 📝'
                      )}
                    </Button>
                    {results.summary && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Summary:</h4>
                        <div className="text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {results.summary}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tool.title === "AI STEM Chatbot" && (
                  <div className="space-y-3">
                    <Input 
                      id="chatbot-question"
                      placeholder="Ask me anything about STEM..."
                    />
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        const question = (document.getElementById('chatbot-question') as HTMLInputElement)?.value;
                        handleChatbot(question);
                      }}
                      disabled={loading === 'chatbot'}
                    >
                      {loading === 'chatbot' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Thinking...
                        </>
                      ) : (
                        'Ask Question 💬'
                      )}
                    </Button>
                    {results.chatAnswer && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Study Buddy Says:</h4>
                        <div className="text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {results.chatAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tool.title === "Study Plan Builder" && (
                  <div className="space-y-3">
                    <Input 
                      id="exam-date"
                      type="date"
                      placeholder="Exam date"
                    />
                    <Input 
                      id="study-topics"
                      placeholder="Enter topics (e.g., Chemistry, Biology)"
                    />
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        const examDate = (document.getElementById('exam-date') as HTMLInputElement)?.value;
                        const topics = (document.getElementById('study-topics') as HTMLInputElement)?.value;
                        handleStudyPlan(examDate, topics);
                      }}
                      disabled={loading === 'studyplan'}
                    >
                      {loading === 'studyplan' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Plan...
                        </>
                      ) : (
                        'Build Study Plan 📅'
                      )}
                    </Button>
                    {results.studyPlan && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Your Study Plan:</h4>
                        <div className="text-sm max-h-40 overflow-y-auto">
                          {results.studyPlan.studyPlan ? (
                            <div className="space-y-2">
                              {results.studyPlan.studyPlan.slice(0, 3).map((day: any, i: number) => (
                                <div key={i} className="border rounded p-2">
                                  <div className="font-medium">Day {day.day}: {day.topic}</div>
                                  <div className="text-xs text-muted-foreground">{day.estimatedTime}</div>
                                </div>
                              ))}
                              {results.studyPlan.studyPlan.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                  ... and {results.studyPlan.studyPlan.length - 3} more days
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">{results.studyPlan.rawResponse}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

        {/* Premium Features Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Badge variant="default" className="mb-4 bg-gradient-to-r from-primary to-accent text-white">
              <Crown className="h-3 w-3 mr-1" />
              Premium Features
            </Badge>
            <h2 className="font-playfair text-3xl font-bold text-foreground mb-4">
              Unlock Your Full Potential
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Supercharge your STEM learning with advanced AI features, unlimited access, and personalized guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-secondary/20 border-2 hover:border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-accent text-white text-xs px-2 py-1 rounded-bl-lg">
                  PREMIUM
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="font-playfair text-lg text-foreground mb-2">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing CTA */}
          <div className="mt-12 text-center">
            <Card className="max-w-md mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Crown className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-playfair text-2xl text-center">
                  Upgrade to Premium
                </CardTitle>
                <CardDescription className="text-center">
                  Unlock all features and accelerate your STEM learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">$9.99</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudyTools;