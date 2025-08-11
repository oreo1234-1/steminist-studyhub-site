import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState } from "react";

interface Streak {
  id?: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_check_in_date: string | null; // ISO date string
}

function formatISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function StreakCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState<Streak | null>(null);

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatISODate(today), [today]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("user_streaks")
        .select("id,user_id,current_streak,longest_streak,last_check_in_date")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) {
        console.error(error);
        toast({ title: "Could not load streak", description: error.message, variant: "destructive" });
        return;
      }
      if (data) setStreak(data as Streak);
    };
    load();
  }, [user, toast]);

  const hasCheckedInToday = useMemo(() => {
    if (!streak?.last_check_in_date) return false;
    return streak.last_check_in_date === todayStr;
  }, [streak, todayStr]);

  const onCheckIn = async () => {
    if (!user) {
      toast({ title: "Please sign in to check in" });
      return;
    }
    if (hasCheckedInToday) {
      toast({ title: "Already checked in today!", description: "Come back tomorrow to continue your streak." });
      return;
    }

    setLoading(true);
    try {
      const last = streak?.last_check_in_date ? new Date(streak.last_check_in_date) : null;
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let nextCurrent = 1;
      let nextLongest = streak?.longest_streak ?? 0;

      if (last) {
        const lastStr = formatISODate(last);
        const yStr = formatISODate(yesterday);
        if (lastStr === yStr) {
          nextCurrent = (streak?.current_streak ?? 0) + 1;
        } else {
          nextCurrent = 1;
        }
      }

      if (nextCurrent > nextLongest) nextLongest = nextCurrent;

      const payload = {
        user_id: user.id,
        current_streak: nextCurrent,
        longest_streak: nextLongest,
        last_check_in_date: todayStr,
      };

      const { data, error } = await supabase
        .from("user_streaks")
        .upsert(payload as any, { onConflict: "user_id" })
        .select()
        .maybeSingle();

      if (error) throw error;
      setStreak(data as Streak);
      toast({ title: "Checked in!", description: `You're on a ${nextCurrent}-day streak. Keep it up!` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Check-in failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair text-xl text-foreground">Study Streak</CardTitle>
        <CardDescription>Build momentum with daily check-ins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-primary">{streak?.current_streak ?? 0} days</div>
            <div className="text-sm text-muted-foreground">Longest: {streak?.longest_streak ?? 0} days</div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={hasCheckedInToday ? "default" : "outline"}>
              {hasCheckedInToday ? "Checked in today" : "Not yet today"}
            </Badge>
            <Button onClick={onCheckIn} disabled={loading || hasCheckedInToday}>
              {hasCheckedInToday ? "Come back tomorrow" : loading ? "Checking..." : "Check in"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
