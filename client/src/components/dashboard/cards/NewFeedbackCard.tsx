import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight, Inbox } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
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
  const { t } = useLanguage();
  const accentColor = branding?.primaryColor || "#0B64A3";

  const { data, isLoading } = useQuery<NewFeedbackData>({
    queryKey: ["/api/new-feedback"],
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" style={{ color: accentColor }} />
            {t("dashboardCards.newFeedback.title", "New Feedback")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-20 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  const hasData = data && data.unreadCount > 0;

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" style={{ color: accentColor }} />
          {t("dashboardCards.newFeedback.title", "New Feedback")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-auto">
        {hasData ? (
          <div className="space-y-3">
            <div className="text-center mb-2">
              <p className="text-2xl font-bold" style={{ color: accentColor }} data-testid="text-feedback-count">
                {data!.unreadCount}
              </p>
              <p className="text-sm text-muted-foreground">{t("dashboardCards.newFeedback.unreadItems", "Unread items")}</p>
            </div>
            <div className="space-y-2">
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
              {t("common.viewAll", "View All")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Inbox className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-base text-muted-foreground">{t("dashboardCards.newFeedback.noFeedback", "No new feedback")}</p>
            <p className="text-sm text-muted-foreground/70">{t("common.allCaughtUp", "You're all caught up")}</p>
          </div>
        )}
      </CardContent>
    </div>
  );
}
