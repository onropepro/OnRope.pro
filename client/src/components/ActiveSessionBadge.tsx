import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  
  const tooltipContent = (
    <div className="text-sm">
      <div className="font-medium">Active Work Session</div>
      <div className="text-muted-foreground">
        {buildingName}
        {duration && ` - ${duration}`}
      </div>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline" 
          className={`bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700 cursor-default ${className || ""}`}
          data-testid="badge-active-session"
        >
          <Clock className="w-3 h-3 mr-1 animate-pulse" />
          Active work session on {buildingName}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}
