import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";

export default function PomodoroCard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const [secondsLeft, setSecondsLeft] = useState(focusMinutes * 60);
  const [running, setRunning] = useState(false);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    setSecondsLeft((mode === "focus" ? focusMinutes : breakMinutes) * 60);
  }, [mode, focusMinutes, breakMinutes]);

  const start = () => {
    setRunning(true);
    startTimeRef.current = new Date();
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setSecondsLeft((mode === "focus" ? focusMinutes : breakMinutes) * 60);
    startTimeRef.current = null;
  };

  const complete = async () => {
    setRunning(false);
    const endedAt = new Date();
    const startedAt = startTimeRef.current ?? new Date(endedAt.getTime() - ((mode === "focus" ? focusMinutes : breakMinutes) * 60000));
    const duration = Math.round(((endedAt.getTime() - startedAt.getTime()) / 1000) / 60);

    if (!user) {
      toast({ title: "Please sign in to log sessions" });
      return;
    }

    try {
      const { error } = await supabase.from("pomodoro_sessions").insert({
        user_id: user.id,
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        duration_minutes: duration,
        mode,
        completed: true,
      });
      if (error) throw error;

      // Note: Points will be updated via edge functions for security
      // This is a placeholder for frontend feedback only
      const pointsEarned = mode === "focus" ? 10 : 0;
      if (pointsEarned > 0) {
        // Log the activity for user tracking
        await supabase.from("user_activity").insert({
          user_id: user.id,
          activity_type: mode === "focus" ? "pomodoro_focus" : "pomodoro_break",
          points_earned: pointsEarned,
          metadata: { duration },
        } as any);
      }

      toast({ title: "Session saved", description: `${mode === "focus" ? "Focus" : "Break"} for ${duration} min` });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Could not save session", description: e.message, variant: "destructive" });
    }
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair text-xl text-foreground">Pomodoro Timer</CardTitle>
        <CardDescription>Stay focused with timed sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Select value={mode} onValueChange={(v) => setMode(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="break">Break</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={String(focusMinutes)}
            onValueChange={(v) => setFocusMinutes(Number(v))}
            disabled={mode !== "focus"}
          >
            <SelectTrigger className="w-28"><SelectValue placeholder="25 min" /></SelectTrigger>
            <SelectContent>
              {[15, 20, 25, 30, 45, 50].map((m) => (
                <SelectItem key={m} value={String(m)}>{m} min</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(breakMinutes)}
            onValueChange={(v) => setBreakMinutes(Number(v))}
            disabled={mode !== "break"}
          >
            <SelectTrigger className="w-28"><SelectValue placeholder="5 min" /></SelectTrigger>
            <SelectContent>
              {[5, 10, 15].map((m) => (
                <SelectItem key={m} value={String(m)}>{m} min</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-center py-6">
          <div className="text-5xl font-bold tracking-tight text-primary">{mm}:{ss}</div>
          <div className="text-sm text-muted-foreground mt-1">Mode: {mode}</div>
        </div>

        <div className="flex gap-3">
          {!running ? (
            <Button onClick={start}>Start</Button>
          ) : (
            <Button variant="secondary" onClick={pause}>Pause</Button>
          )}
          <Button variant="outline" onClick={reset}>Reset</Button>
          <Button variant="default" onClick={complete} disabled={secondsLeft > 0}>Complete</Button>
        </div>
      </CardContent>
    </Card>
  );
}
