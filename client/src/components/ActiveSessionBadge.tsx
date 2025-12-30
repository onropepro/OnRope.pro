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
  
  const label = data.type === "billable" 
    ? data.projectName || "Project"
    : data.description || "Non-billable";

  const tooltipContent = (
    <div className="text-sm">
      <div className="font-medium">
        {data.type === "billable" ? "Active Work Session" : "Non-Billable Session"}
      </div>
      <div className="text-muted-foreground">
        {label}
        {duration && ` - ${duration}`}
      </div>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline" 
          className={`bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700 cursor-default ${className || ""}`}
          data-testid="badge-active-session"
        >
          <Clock className="w-3 h-3 mr-1 animate-pulse" />
          Active Session
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}
