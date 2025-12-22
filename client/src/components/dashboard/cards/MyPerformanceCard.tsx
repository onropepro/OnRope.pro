import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronRight, Star, Target } from "lucide-react";
import type { CardProps } from "../cardRegistry";

export function MyPerformanceCard({ currentUser, onRouteNavigate, branding }: CardProps) {
  const accentColor = branding?.primaryColor || "#0B64A3";

  return (
    <>
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: accentColor }} />
          My Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 text-amber-500" />
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
              <p className="text-xl font-bold" data-testid="text-my-rating">
                4.8/5
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Target className="w-4 h-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Jobs</p>
              </div>
              <p className="text-xl font-bold" data-testid="text-my-jobs">
                12
              </p>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
            <p className="text-base font-medium text-green-700 dark:text-green-400">
              Great month!
            </p>
            <p className="text-sm text-muted-foreground">
              On track for performance bonus
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => onRouteNavigate("/profile")}
            data-testid="button-view-my-performance"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </>
  );
}
