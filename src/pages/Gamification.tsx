import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Crown, Lightbulb, Users, Star, Target } from "lucide-react";

const Gamification = () => {
  const leaderboard = [
    { rank: 1, name: "Sarah M.", points: 2850, avatar: "👩🏽‍💻", badge: "STEM Queen 👑" },
    { rank: 2, name: "Maya P.", points: 2720, avatar: "👩🏾‍🔬", badge: "Quiz Master 💡" },
    { rank: 3, name: "Alex Chen", points: 2650, avatar: "👩🏻‍💻", badge: "Active Helper 🤝" },
    { rank: 4, name: "Priya K.", points: 2580, avatar: "👩🏽‍🔬", badge: "Study Star ⭐" },
    { rank: 5, name: "Emma L.", points: 2420, avatar: "👩🏼‍🔬", badge: "Rising Scholar 📚" }
  ];

  const badges = [
    { name: "STEM Queen", icon: "👑", description: "Earned 2000+ points", earned: true, rarity: "Legendary" },
    { name: "Quiz Master", icon: "💡", description: "Completed 50+ quizzes", earned: true, rarity: "Epic" },
    { name: "Active Helper", icon: "🤝", description: "Helped 25+ students", earned: true, rarity: "Rare" },
    { name: "Study Star", icon: "⭐", description: "Study streak of 30 days", earned: false, rarity: "Epic" },
    { name: "Workshop Warrior", icon: "🎯", description: "Attended 10+ workshops", earned: false, rarity: "Common" },
    { name: "Knowledge Seeker", icon: "🔍", description: "Read 100+ study materials", earned: false, rarity: "Rare" }
  ];

  const activities = [
    { action: "Daily login", points: "+10", color: "text-green-600" },
    { action: "Complete quiz", points: "+25", color: "text-blue-600" },
    { action: "Help another student", points: "+50", color: "text-purple-600" },
    { action: "Post in forum", points: "+15", color: "text-orange-600" },
    { action: "Attend workshop", points: "+100", color: "text-pink-600" },
    { action: "Upload study material", points: "+75", color: "text-indigo-600" }
  ];

  const currentUser = {
    name: "You",
    points: 1850,
    level: 8,
    nextLevelPoints: 2000,
    rank: 12
  };

  const progressToNext = (currentUser.points / currentUser.nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your STEM Journey 🏆
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your progress, earn badges, and climb the leaderboard as you grow in STEM
          </p>
        </div>

        {/* Personal Dashboard */}
        <Card className="mb-8 border-2 border-accent bg-gradient-to-r from-accent/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="font-playfair text-2xl text-foreground flex items-center gap-2">
              <Trophy className="h-6 w-6 text-accent" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{currentUser.points}</div>
                <div className="text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1">#{currentUser.rank}</div>
                <div className="text-muted-foreground">Global Rank</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">Level {currentUser.level}</div>
                <div className="text-muted-foreground">Current Level</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress to Level {currentUser.level + 1}</span>
                <span className="text-sm text-muted-foreground">{currentUser.points}/{currentUser.nextLevelPoints}</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-foreground flex items-center gap-2">
                <Crown className="h-5 w-5 text-accent" />
                Leaderboard
              </CardTitle>
              <CardDescription>Top performers this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      user.rank === 1 ? 'bg-yellow-500' : 
                      user.rank === 2 ? 'bg-gray-400' : 
                      user.rank === 3 ? 'bg-amber-600' : 'bg-primary'
                    }`}>
                      {user.rank}
                    </div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <Badge variant="outline" className="text-xs">{user.badge}</Badge>
                    </div>
                  </div>
                  <div className="font-bold text-primary">{user.points}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Points System */}
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-foreground flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                Earn Points
              </CardTitle>
              <CardDescription>Ways to gain points and level up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-foreground">{activity.action}</span>
                  <span className={`font-bold ${activity.color}`}>{activity.points}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Badges Collection */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-playfair text-xl text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" />
              Badge Collection
            </CardTitle>
            <CardDescription>Unlock achievements as you progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge, index) => (
                <div key={index} className={`text-center p-4 rounded-lg border-2 transition-all ${
                  badge.earned ? 'border-accent bg-accent/10' : 'border-muted bg-muted/20 opacity-60'
                }`}>
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="font-medium text-sm text-foreground mb-1">{badge.name}</div>
                  <Badge variant={badge.earned ? "default" : "outline"} className="text-xs mb-2">
                    {badge.rarity}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{badge.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gamification;