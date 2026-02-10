import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Clock, Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = ["Study Help", "Mental Health", "Win of the Week", "General Chat"];

const CommunityForum = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General Chat");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // Fetch posts
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["forumPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch author names
      const authorIds = [...new Set((data || []).map(p => p.author_id).filter(Boolean))] as string[];
      let profilesMap = new Map<string, string>();
      if (authorIds.length) {
        const { data: profs } = await supabase.rpc("get_public_profiles", { user_ids: authorIds });
        if (profs) {
          profs.forEach((p: any) => profilesMap.set(p.id, p.full_name || "User"));
        }
      }

      return (data || []).map(post => ({
        ...post,
        author_name: profilesMap.get(post.author_id || "") || "Anonymous",
      }));
    },
  });

  // Fetch comments for expanded post
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["forumComments", expandedPost],
    queryFn: async () => {
      if (!expandedPost) return [];
      const { data, error } = await supabase
        .from("forum_comments")
        .select("*")
        .eq("post_id", expandedPost)
        .order("created_at", { ascending: true });
      if (error) throw error;

      const authorIds = [...new Set((data || []).map(c => c.author_id).filter(Boolean))] as string[];
      let profilesMap = new Map<string, string>();
      if (authorIds.length) {
        const { data: profs } = await supabase.rpc("get_public_profiles", { user_ids: authorIds });
        if (profs) {
          profs.forEach((p: any) => profilesMap.set(p.id, p.full_name || "User"));
        }
      }

      return (data || []).map(c => ({
        ...c,
        author_name: profilesMap.get(c.author_id || "") || "Anonymous",
      }));
    },
    enabled: !!expandedPost,
  });

  // Fetch user votes
  const { data: userVotes = [] } = useQuery({
    queryKey: ["forumVotes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("forum_votes")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Create post mutation
  const createPost = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("forum_posts").insert({
        title: newTitle,
        content: newContent,
        category: selectedCategory,
        author_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
      setNewTitle("");
      setNewContent("");
      toast({ title: "Post created! ✨" });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  // Create comment mutation
  const createComment = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("forum_comments").insert({
        post_id: postId,
        content: commentText,
        author_id: user.id,
      });
      if (error) throw error;

      // Update comment count
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase.from("forum_posts").update({
          comments_count: (post.comments_count || 0) + 1,
        }).eq("id", postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumComments", expandedPost] });
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
      setCommentText("");
      toast({ title: "Comment posted! 💬" });
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  // Vote mutation
  const toggleVote = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Not authenticated");
      const existingVote = userVotes.find(v => v.post_id === postId);
      if (existingVote) {
        await supabase.from("forum_votes").delete().eq("id", existingVote.id);
        const post = posts.find(p => p.id === postId);
        if (post) {
          await supabase.from("forum_posts").update({
            upvotes_count: Math.max(0, (post.upvotes_count || 0) - 1),
          }).eq("id", postId);
        }
      } else {
        await supabase.from("forum_votes").insert({
          post_id: postId,
          user_id: user.id,
          vote_type: "upvote",
        });
        const post = posts.find(p => p.id === postId);
        if (post) {
          await supabase.from("forum_posts").update({
            upvotes_count: (post.upvotes_count || 0) + 1,
          }).eq("id", postId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forumPosts"] });
      queryClient.invalidateQueries({ queryKey: ["forumVotes", user?.id] });
    },
  });

  const categoryCounts = CATEGORIES.map(cat => ({
    name: cat,
    count: posts.filter(p => p.category === cat).length,
  }));

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
            {categoryCounts.map((category, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-primary font-bold">{category.count}</span>
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
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Post title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Textarea
              placeholder="Share your thoughts, questions, or wins..."
              className="min-h-[100px]"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <Button
              onClick={() => {
                if (!user) {
                  toast({ title: "Please sign in to post", variant: "destructive" });
                  navigate("/auth");
                  return;
                }
                if (!newTitle.trim() || !newContent.trim()) {
                  toast({ title: "Please fill in title and content", variant: "destructive" });
                  return;
                }
                createPost.mutate();
              }}
              disabled={createPost.isPending}
            >
              {createPost.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Posting...</>
              ) : (
                "Post to Community ✨"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Posts */}
        <div className="space-y-6">
          <h2 className="font-playfair text-2xl font-bold text-foreground">
            Recent Posts {postsLoading && <Loader2 className="inline h-5 w-5 animate-spin ml-2" />}
          </h2>

          {posts.length === 0 && !postsLoading && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to start a discussion! 🚀</p>
            </Card>
          )}

          {posts.map((post) => {
            const hasVoted = userVotes.some(v => v.post_id === post.id);
            return (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {(post.author_name as string)?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{post.author_name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    {post.is_pinned && <Badge variant="outline">📌 Pinned</Badge>}
                  </div>
                  <CardTitle className="font-playfair text-lg text-foreground mt-3">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={hasVoted ? "text-primary" : "text-muted-foreground hover:text-primary"}
                      onClick={() => {
                        if (!user) {
                          toast({ title: "Sign in to vote", variant: "destructive" });
                          return;
                        }
                        toggleVote.mutate(post.id);
                      }}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${hasVoted ? "fill-current" : ""}`} />
                      {post.upvotes_count || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments_count || 0}
                    </Button>
                  </div>

                  {/* Comments Section */}
                  {expandedPost === post.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {commentsLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <>
                          {comments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                                {comment.author_name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{comment.author_name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ""}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                          {comments.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-2">No comments yet.</p>
                          )}
                        </>
                      )}

                      {/* Add comment */}
                      {user && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && commentText.trim()) {
                                createComment.mutate(post.id);
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            onClick={() => {
                              if (commentText.trim()) createComment.mutate(post.id);
                            }}
                            disabled={createComment.isPending || !commentText.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;
