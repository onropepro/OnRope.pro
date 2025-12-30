import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useActiveWorkSession } from "@/hooks/use-active-session";
import { formatDistanceToNow } from "date-fns";

interface ActiveSessionBadgeProps {
  className?: string;
}

export function ActiveSessionBadge({ className }: ActiveSessionBadgeProps) {
  const { data, isLoading } = useActiveWorkSession();

  if (isLoading || !data?.hasActiveSession) {
    return null;
  }

  const startTime = data.startTime ? new Date(data.startTime) : null;
  const duration = startTime ? formatDistanceToNow(startTime, { addSuffix: false }) : null;
  
  const buildingName = data.buildingName || data.projectName || "Unknown";

  return (
    <div 
      className={`w-full bg-slate-200 dark:bg-slate-800 px-4 py-2 flex items-center justify-center ${className || ""}`}
      data-testid="banner-active-session"
    >
      <Badge 
        variant="outline" 
        className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700 cursor-default"
        data-testid="badge-active-session"
      >
        <Clock className="w-3 h-3 mr-1 animate-pulse" />
        Active work session on {buildingName}
        {duration && <span className="ml-1 text-red-500 dark:text-red-300">({duration})</span>}
      </Badge>
    </div>
  );
}
