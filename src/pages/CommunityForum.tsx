import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Bookmark, Clock } from "lucide-react";

const CommunityForum = () => {
  const categories = [
    { name: "Study Help", color: "bg-primary", count: 45 },
    { name: "Mental Health", color: "bg-secondary", count: 23 },
    { name: "Win of the Week", color: "bg-accent", count: 18 },
    { name: "General Chat", color: "bg-muted", count: 67 }
  ];

  const posts = [
    {
      author: "Sarah M.",
      category: "Study Help",
      title: "Need help with calculus derivatives!",
      content: "I'm struggling with the chain rule. Can someone explain it in simple terms?",
      timestamp: "2 hours ago",
      likes: 12,
      comments: 8,
      avatar: "👩🏽‍💻"
    },
    {
      author: "Maya P.",
      category: "Win of the Week",
      title: "Just got accepted to my dream engineering program! 🎉",
      content: "After months of studying and preparation, I finally got in! Thank you to this amazing community for all the support.",
      timestamp: "4 hours ago",
      likes: 34,
      comments: 15,
      avatar: "👩🏾‍🔬"
    },
    {
      author: "Alex Chen",
      category: "Mental Health",
      title: "Dealing with imposter syndrome in STEM",
      content: "Sometimes I feel like I don't belong in my computer science classes. Anyone else feel this way?",
      timestamp: "6 hours ago",
      likes: 28,
      comments: 12,
      avatar: "👩🏻‍💻"
    },
    {
      author: "Priya K.",
      category: "General Chat",
      title: "What's your favorite STEM podcast?",
      content: "Looking for new podcasts to listen to during my commute. Drop your recommendations!",
      timestamp: "1 day ago",
      likes: 19,
      comments: 22,
      avatar: "👩🏽‍🔬"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Community Forum 💬
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow STEM sisters, share knowledge, and support each other's journey
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                    <span className="text-white font-bold">{category.count}</span>
                  </div>
                  <h3 className="font-medium text-foreground">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* New Post */}
        <Card className="mb-8 border-2 border-secondary/50">
          <CardHeader>
            <CardTitle className="font-playfair text-xl text-foreground">Start a New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer hover:bg-secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
            <Input placeholder="Post title..." />
            <Textarea placeholder="Share your thoughts, questions, or wins..." className="min-h-[100px]" />
            <Button className="bg-primary hover:bg-primary/90">
              Post to Community ✨
            </Button>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-6">
          <h2 className="font-playfair text-2xl font-bold text-foreground">Recent Posts</h2>
          {posts.map((post, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{post.avatar}</div>
                    <div>
                      <h3 className="font-medium text-foreground">{post.author}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {post.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardTitle className="font-playfair text-lg text-foreground mt-3">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.content}</p>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;