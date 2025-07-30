import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Brain, FileText, MessageCircle, Calendar } from "lucide-react";

const AIStudyTools = () => {
  const tools = [
    {
      title: "AI Flashcard Generator",
      description: "Paste your notes and get instant flashcards",
      icon: <Brain className="h-8 w-8" />,
      example: "Input: Photosynthesis notes → Output: 10 flashcards with Q&A"
    },
    {
      title: "AI Summarizer", 
      description: "Upload text and get summaries with key points",
      icon: <FileText className="h-8 w-8" />,
      example: "Input: 5-page chapter → Output: 1-page summary + bullet points"
    },
    {
      title: "AI STEM Chatbot",
      description: "Ask questions and get STEM-specific answers",
      icon: <MessageCircle className="h-8 w-8" />,
      example: "Ask: 'Explain Newton's laws' → Get detailed, student-friendly answer"
    },
    {
      title: "Study Plan Builder",
      description: "Enter exam date and topics for AI-built study schedule",
      icon: <Calendar className="h-8 w-8" />,
      example: "Input: Chemistry exam in 2 weeks → Output: Daily study plan"
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-card border-2 hover:border-accent">
              <CardHeader className="text-center pb-4">
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
                      placeholder="Paste your notes here..."
                      className="min-h-[100px]"
                    />
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Generate Flashcards ✨
                    </Button>
                  </div>
                )}

                {tool.title === "AI Summarizer" && (
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="Paste text to summarize..."
                      className="min-h-[100px]"
                    />
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Create Summary 📝
                    </Button>
                  </div>
                )}

                {tool.title === "AI STEM Chatbot" && (
                  <div className="space-y-3">
                    <Input 
                      placeholder="Ask me anything about STEM..."
                    />
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Ask Question 💬
                    </Button>
                  </div>
                )}

                {tool.title === "Study Plan Builder" && (
                  <div className="space-y-3">
                    <Input 
                      type="date"
                      placeholder="Exam date"
                    />
                    <Input 
                      placeholder="Enter topics (e.g., Chemistry, Biology)"
                    />
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Build Study Plan 📅
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIStudyTools;