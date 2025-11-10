import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function NonBillableHours() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  
  // Get current user
  const { data: userData } = useQuery({
    queryKey: ["/api/user"],
  });
  
  const user = userData?.user;

  // Get active non-billable session
  const { data: activeSessionData } = useQuery({
    queryKey: ["/api/non-billable-sessions/active"],
    enabled: !!user,
  });

  const activeSession = activeSessionData?.session;

  // Start new non-billable work session
  const startSessionMutation = useMutation({
    mutationFn: async (description: string) => {
      return apiRequest("POST", "/api/non-billable-sessions", {
        description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/non-billable-sessions/active"] });
      setDescription("");
      toast({
        title: "Non-billable session started",
        description: "Your non-billable work session has been started",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // End non-billable work session
  const endSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return apiRequest("PATCH", `/api/non-billable-sessions/${sessionId}/end`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/non-billable-sessions/active"] });
      toast({
        title: "Session ended",
        description: "Your non-billable work session has been ended",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartSession = () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please describe what you're working on",
        variant: "destructive",
      });
      return;
    }
    
    startSessionMutation.mutate(description);
  };

  const handleEndSession = () => {
    if (activeSession) {
      endSessionMutation.mutate(activeSession.id);
    }
  };

  // Calculate duration for active session
  const getSessionDuration = () => {
    if (!activeSession?.startTime) return "0h 0m";
    
    const start = new Date(activeSession.startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
            className="text-primary-foreground hover:bg-primary-foreground/20"
            data-testid="button-back"
          >
            <span className="material-icons text-xl">arrow_back</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Non-Billable Hours</h1>
            <p className="text-xs text-primary-foreground/90">
              Track errands, training, and other non-project work
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Active Session Card */}
        {activeSession ? (
          <Card className="border-l-4 border-l-primary shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="material-icons text-primary animate-pulse">schedule</span>
                    Active Session
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {activeSession.description}
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {getSessionDuration()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="material-icons text-base">today</span>
                  <span>Started: {new Date(activeSession.startTime).toLocaleString()}</span>
                </div>
                
                <Button
                  onClick={handleEndSession}
                  disabled={endSessionMutation.isPending}
                  className="w-full h-12"
                  variant="destructive"
                  data-testid="button-end-session"
                >
                  <span className="material-icons mr-2">stop_circle</span>
                  {endSessionMutation.isPending ? "Ending..." : "End Session"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="material-icons text-primary">add_circle</span>
                Start New Session
              </CardTitle>
              <CardDescription>
                Log non-billable work like errands, training, meetings, or administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">What are you working on?</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Picking up supplies, training, office work..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                  data-testid="input-description"
                  autoComplete="off"
                />
              </div>

              <Button
                onClick={handleStartSession}
                disabled={startSessionMutation.isPending || !description.trim()}
                className="w-full h-12"
                data-testid="button-start-session"
              >
                <span className="material-icons mr-2">play_circle</span>
                {startSessionMutation.isPending ? "Starting..." : "Start Session"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="material-icons text-primary mt-0.5">info</span>
                <div>
                  <p className="font-medium mb-1">About Non-Billable Hours</p>
                  <p className="text-sm text-muted-foreground">
                    These hours are included in payroll but don't count toward project performance analytics.
                    Use this for any work that isn't directly tied to a specific project.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="material-icons text-primary mt-0.5">schedule</span>
                <div>
                  <p className="font-medium mb-1">Time Tracking</p>
                  <p className="text-sm text-muted-foreground">
                    Your session time is tracked automatically from start to finish.
                    Remember to end your session when you're done.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
