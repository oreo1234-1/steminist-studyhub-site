import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, BookOpen, Trophy, Users, Target, Star, Bookmark, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface UserStats {
  points: number;
  level: number;
  badges_count: number;
  quizzes_completed: number;
  workshops_attended: number;
  materials_downloaded: number;
}

interface RecentActivity {
  id: string;
  activity_type: string;
  points_earned: number;
  created_at: string;
  metadata: any;
}

interface UpcomingWorkshop {
  id: string;
  title: string;
  scheduled_at: string;
  instructor_name: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState<UpcomingWorkshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user points and stats
      const { data: pointsData } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Fetch badges count
      const { count: badgesCount } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id);

      // Fetch quiz results count
      const { count: quizzesCount } = await supabase
        .from('user_quiz_results')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id);

      // Fetch workshop registrations count
      const { count: workshopsCount } = await supabase
        .from('workshop_registrations')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id)
        .eq('attended', true);

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch upcoming workshops
      const { data: workshopsData } = await supabase
        .from('workshops')
        .select('id, title, scheduled_at, instructor_name')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(3);

      setStats({
        points: pointsData?.points || 0,
        level: pointsData?.current_level || 1,
        badges_count: badgesCount || 0,
        quizzes_completed: quizzesCount || 0,
        workshops_attended: workshopsCount || 0,
        materials_downloaded: 0 // We'll implement this later
      });

      setRecentActivity(activityData || []);
      setUpcomingWorkshops(workshopsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your STEM journey...</p>
        </div>
      </div>
    );
  }

  const nextLevelPoints = (stats?.level || 1) * 200;
  const progressToNext = ((stats?.points || 0) % 200) / 200 * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-foreground mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'STEM Sister'}! 🌟
          </h1>
          <p className="text-lg text-muted-foreground">
            Continue your amazing STEM journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.points || 0}</div>
              <p className="text-xs text-muted-foreground">Level {stats?.level || 1}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Star className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.badges_count || 0}</div>
              <p className="text-xs text-muted-foreground">Achievements unlocked</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.quizzes_completed || 0}</div>
              <p className="text-xs text-muted-foreground">Knowledge gained</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workshops</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats?.workshops_attended || 0}</div>
              <p className="text-xs text-muted-foreground">Sessions attended</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Level Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Level Progress
              </CardTitle>
              <CardDescription>Keep learning to reach the next level!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Level {stats?.level}</span>
                  <span className="text-sm text-muted-foreground">
                    {(stats?.points || 0) % 200}/{nextLevelPoints} points to next level
                  </span>
                </div>
                <Progress value={progressToNext} className="h-3" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats?.points || 0}</div>
                    <div className="text-xs text-muted-foreground">Current Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">Level {(stats?.level || 1) + 1}</div>
                    <div className="text-xs text-muted-foreground">Next Level</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-foreground">Quick Actions</CardTitle>
              <CardDescription>Jump back into your STEM journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/study-materials">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Study Materials
                </Button>
              </Link>
              <Link to="/workshops">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Workshops
                </Button>
              </Link>
              <Link to="/community-forum">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Join Discussion
                </Button>
              </Link>
              <Link to="/gamification">
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {activity.activity_type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {activity.points_earned > 0 && (
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          +{activity.points_earned} pts
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Start your STEM journey to see activity here! 🚀
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Workshops */}
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Upcoming Workshops
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingWorkshops.length > 0 ? (
                <div className="space-y-4">
                  {upcomingWorkshops.map((workshop) => (
                    <div key={workshop.id} className="p-3 rounded-lg bg-muted/50">
                      <h4 className="font-medium text-foreground mb-1">{workshop.title}</h4>
                      <p className="text-sm text-muted-foreground mb-1">
                        Instructor: {workshop.instructor_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(workshop.scheduled_at).toLocaleDateString()} at{' '}
                        {new Date(workshop.scheduled_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  ))}
                  <Link to="/workshops">
                    <Button variant="outline" className="w-full">
                      View All Workshops
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    No upcoming workshops scheduled
                  </p>
                  <Link to="/workshops">
                    <Button variant="outline">
                      Browse Available Workshops
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;