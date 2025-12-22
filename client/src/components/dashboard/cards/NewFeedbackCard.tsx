import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight, Inbox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { CardProps } from "../cardRegistry";

interface NewFeedbackData {
  unreadCount: number;
  recentItems: Array<{
    id: string;
    subject: string;
    type: string;
  }>;
}

export function NewFeedbackCard({ onRouteNavigate, branding }: CardProps) {
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data, isLoading } = useQuery<NewFeedbackData>({
    queryKey: ["/api/new-feedback"],
  });

  if (isLoading) {
    return (
      <>
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" style={{ color: accentColor }} />
            New Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </>
    );
  }

  const hasData = data && data.unreadCount > 0;

  return (
    <>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" style={{ color: accentColor }} />
          New Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {hasData ? (
          <div className="space-y-3">
            <div className="text-center mb-2">
              <p className="text-2xl font-bold" style={{ color: accentColor }} data-testid="text-feedback-count">
                {data!.unreadCount}
              </p>
              <p className="text-sm text-muted-foreground">Unread items</p>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {data!.recentItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded"
                  data-testid={`row-feedback-${item.id}`}
                >
                  <span className="font-medium truncate flex-1">{item.subject}</span>
                  <span className="text-xs text-muted-foreground ml-2">{item.type}</span>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between"
              onClick={() => onRouteNavigate("/feedback")}
              data-testid="button-view-feedback"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <Inbox className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-base text-muted-foreground">No new feedback</p>
            <p className="text-sm text-muted-foreground/70">You're all caught up</p>
          </div>
        )}
      </CardContent>
    </>
  );
}
