import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { differenceInDays, parseISO } from "date-fns";

interface SubscriptionRenewalBadgeProps {
  subscriptionEndDate: string | null | undefined;
  subscriptionStatus: string | null | undefined;
}

export function SubscriptionRenewalBadge({ subscriptionEndDate, subscriptionStatus }: SubscriptionRenewalBadgeProps) {
  if (!subscriptionEndDate || subscriptionStatus !== 'active') {
    return null;
  }

  const endDate = typeof subscriptionEndDate === 'string' 
    ? parseISO(subscriptionEndDate) 
    : new Date(subscriptionEndDate);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const daysUntilRenewal = differenceInDays(endDate, today);
  
  if (daysUntilRenewal < 0) {
    return null;
  }

  const isWarning = daysUntilRenewal <= 5;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          variant="outline"
          className={`hidden sm:flex gap-1 text-xs font-medium cursor-default ${
            isWarning 
              ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30' 
              : 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30'
          }`}
          data-testid="badge-subscription-renewal"
        >
          <span className="material-icons text-sm">
            {isWarning ? 'schedule' : 'check_circle'}
          </span>
          {daysUntilRenewal === 0 ? 'Renews today' : `${daysUntilRenewal}d`}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Subscription renews in {daysUntilRenewal} day{daysUntilRenewal !== 1 ? 's' : ''}</p>
      </TooltipContent>
    </Tooltip>
  );
}
