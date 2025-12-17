import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { differenceInDays, parseISO } from "date-fns";

interface SubscriptionRenewalBadgeProps {
  subscriptionEndDate: string | null | undefined;
  subscriptionStatus: string | null | undefined;
}

export function SubscriptionRenewalBadge({ subscriptionEndDate, subscriptionStatus }: SubscriptionRenewalBadgeProps) {
  const isActive = subscriptionStatus === 'active';
  const isTrialing = subscriptionStatus === 'trialing';
  
  if (!isActive && !isTrialing) {
    return null;
  }

  if (!subscriptionEndDate) {
    if (isTrialing) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline"
              className="hidden sm:flex gap-1 text-xs font-medium cursor-default bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30"
              data-testid="badge-subscription-trial"
            >
              <span className="material-icons text-sm">science</span>
              Trial
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>You are on a free trial</p>
          </TooltipContent>
        </Tooltip>
      );
    }
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
  const label = isTrialing ? 'Trial ends' : 'Renews';
  
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
          {daysUntilRenewal === 0 ? `${label} today` : `${daysUntilRenewal}d`}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isTrialing ? 'Trial ends' : 'Subscription renews'} in {daysUntilRenewal} day{daysUntilRenewal !== 1 ? 's' : ''}</p>
      </TooltipContent>
    </Tooltip>
  );
}
