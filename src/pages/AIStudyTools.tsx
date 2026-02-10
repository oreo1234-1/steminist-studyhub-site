import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, MessageCircle, Calendar, Loader2, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AIStudyTools = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any>({});

  const [flashcardNotes, setFlashcardNotes] = useState("");
  const [summarizerText, setSummarizerText] = useState("");
  const [chatQuestion, setChatQuestion] = useState("");
  const [examDate, setExamDate] = useState("");
  const [studyTopics, setStudyTopics] = useState("");

  const handleFlashcardGeneration = async (notes: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use AI tools",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

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
    } catch (error: any) {
      console.error('Flashcard generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleSummarization = async (text: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use AI tools",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

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
    } catch (error: any) {
      console.error('Summarization error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleChatbot = async (question: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use AI tools",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

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

      setResults(prev => ({ ...prev, chatResponse: data.answer }));
      toast({
        title: "Answer Ready! 💬",
        description: "Your STEM question has been answered",
      });
    } catch (error: any) {
      console.error('Chatbot error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleStudyPlan = async (examDate: string, topics: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use AI tools",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!examDate || !topics.trim()) {
      toast({
        title: "Error",
        description: "Please enter exam date and topics",
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

      // The edge function returns { studyPlan, tips, totalDays } or { studyPlan, tips, totalDays, rawResponse }
      const planText = data.rawResponse || 
        (data.studyPlan ? 
          data.studyPlan.map((day: any) => 
            `📅 Day ${day.day} (${day.date}) - ${day.topic}\n   Type: ${day.type}\n   Tasks: ${day.tasks?.join(', ')}\n   Time: ${day.estimatedTime}`
          ).join('\n\n') + 
          (data.tips ? '\n\n💡 Tips:\n' + data.tips.map((t: string) => `• ${t}`).join('\n') : '')
        : JSON.stringify(data, null, 2));
      setResults(prev => ({ ...prev, studyPlan: planText }));
      toast({
        title: "Study Plan Created! 📅",
        description: "Your personalized study schedule is ready",
      });
    } catch (error: any) {
      console.error('Study plan error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create study plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 flex items-center justify-center p-8">
        <Card className="max-w-md w-full border-2">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription>
              Sign in to access AI-powered study tools and boost your learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
              size="lg"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-playfair">
              AI Study Tools
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leverage AI to make studying smarter, faster, and more effective
          </p>
        </div>

        {/* Tabs Interface */}
        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-2 bg-card/50 p-2">
            <TabsTrigger value="flashcards" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="summarizer" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Summarizer</span>
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chatbot</span>
            </TabsTrigger>
            <TabsTrigger value="studyplan" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Study Plan</span>
            </TabsTrigger>
          </TabsList>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="mt-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>AI Flashcard Generator</CardTitle>
                    <CardDescription>
                      Paste your notes and get instant flashcards for effective memorization
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Paste your notes here... (e.g., Photosynthesis is the process by which plants...)" 
                  className="min-h-[200px] resize-none"
                  value={flashcardNotes}
                  onChange={(e) => setFlashcardNotes(e.target.value)}
                />
                <Button 
                  onClick={() => handleFlashcardGeneration(flashcardNotes)}
                  disabled={loading === 'flashcards' || !flashcardNotes.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading === 'flashcards' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Flashcards...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Flashcards
                    </>
                  )}
                </Button>
                {results.flashcards && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold text-lg">Generated Flashcards ({results.flashcards.length})</h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {results.flashcards.map((card: any, idx: number) => (
                        <Card key={idx} className="bg-muted/50">
                          <CardContent className="p-4 space-y-2">
                            <p className="font-semibold text-primary">Q: {card.question}</p>
                            <p className="text-foreground/80">A: {card.answer}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summarizer Tab */}
          <TabsContent value="summarizer" className="mt-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>AI Text Summarizer</CardTitle>
                    <CardDescription>
                      Upload long text and get concise summaries with key points
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Paste text to summarize... (e.g., a chapter from your textbook)" 
                  className="min-h-[200px] resize-none"
                  value={summarizerText}
                  onChange={(e) => setSummarizerText(e.target.value)}
                />
                <Button 
                  onClick={() => handleSummarization(summarizerText)}
                  disabled={loading === 'summarizer' || !summarizerText.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading === 'summarizer' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing Text...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Summarize Text
                    </>
                  )}
                </Button>
                {results.summary && (
                  <Card className="mt-6 bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap leading-relaxed">{results.summary}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chatbot Tab */}
          <TabsContent value="chatbot" className="mt-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>AI STEM Chatbot</CardTitle>
                    <CardDescription>
                      Ask any STEM question and get detailed, student-friendly answers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Ask a question... (e.g., Explain Newton's laws of motion)" 
                  className="text-base"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && chatQuestion.trim() && loading !== 'chatbot') {
                      handleChatbot(chatQuestion);
                    }
                  }}
                />
                <Button 
                  onClick={() => handleChatbot(chatQuestion)}
                  disabled={loading === 'chatbot' || !chatQuestion.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading === 'chatbot' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Ask Question
                    </>
                  )}
                </Button>
                {results.chatResponse && (
                  <Card className="mt-6 bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Answer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap leading-relaxed">{results.chatResponse}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Plan Tab */}
          <TabsContent value="studyplan" className="mt-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Study Plan Builder</CardTitle>
                    <CardDescription>
                      Enter your exam date and topics to get a personalized study schedule
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exam Date</label>
                  <Input 
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topics to Study</label>
                  <Textarea 
                    placeholder="Enter topics separated by commas... (e.g., Calculus, Physics, Chemistry)"
                    className="min-h-[120px] resize-none"
                    value={studyTopics}
                    onChange={(e) => setStudyTopics(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => handleStudyPlan(examDate, studyTopics)}
                  disabled={loading === 'studyplan' || !examDate || !studyTopics.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading === 'studyplan' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Study Plan...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Build Study Plan
                    </>
                  )}
                </Button>
                {results.studyPlan && (
                  <Card className="mt-6 bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Your Personalized Study Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap leading-relaxed">{results.studyPlan}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIStudyTools;
