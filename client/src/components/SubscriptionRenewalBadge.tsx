import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { differenceInDays, parseISO, format } from "date-fns";

interface SubscriptionRenewalBadgeProps {
  subscriptionEndDate: string | null | undefined;
  subscriptionStatus: string | null | undefined;
}

interface SubscriptionDetails {
  tier: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  whitelabelBrandingActive: boolean;
  additionalSeatsCount: number;
    giftedSeatsCount: number;
  trialEnd?: number | null;
}

export function SubscriptionRenewalBadge({ subscriptionEndDate, subscriptionStatus }: SubscriptionRenewalBadgeProps) {
  const isActive = subscriptionStatus === 'active';
  const isTrialing = subscriptionStatus === 'trialing';
  
  const { data: subscriptionData } = useQuery<SubscriptionDetails>({
    queryKey: ["/api/subscription/details"],
    enabled: isActive || isTrialing,
  });

  if (!isActive && !isTrialing) {
    return null;
  }

  const trialEndTimestamp = subscriptionData?.trialEnd;
  
  let daysRemaining: number | null = null;
  let endDate: Date | null = null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isTrialing) {
    // For trials, prefer Stripe's trialEnd, fallback to subscriptionEndDate
    if (trialEndTimestamp) {
      endDate = new Date(trialEndTimestamp * 1000);
      daysRemaining = differenceInDays(endDate, today);
    } else if (subscriptionEndDate) {
      endDate = typeof subscriptionEndDate === 'string' 
        ? parseISO(subscriptionEndDate) 
        : new Date(subscriptionEndDate);
      daysRemaining = differenceInDays(endDate, today);
    }
  } else {
    // For active subscriptions, use currentPeriodEnd or subscriptionEndDate
    const endDateSource = subscriptionData?.currentPeriodEnd || subscriptionEndDate;
    if (endDateSource) {
      endDate = typeof endDateSource === 'string' 
        ? parseISO(endDateSource) 
        : new Date(endDateSource);
      daysRemaining = differenceInDays(endDate, today);
    }
  }

  const isWarning = daysRemaining !== null && daysRemaining <= 5;
  const tierNames: Record<string, string> = {
    basic: 'Basic',
    starter: 'Starter', 
    premium: 'Premium',
    enterprise: 'Enterprise'
  };

  const getBadgeContent = () => {
    if (isTrialing) {
      if (daysRemaining !== null && daysRemaining >= 0) {
        return daysRemaining === 0 ? 'Trial ends today' : `Trial: ${daysRemaining}d`;
      }
      return 'Trial';
    }
    if (daysRemaining !== null && daysRemaining >= 0) {
      return daysRemaining === 0 ? 'Renews today' : `${daysRemaining}d`;
    }
    return 'Active';
  };

  const getBadgeColor = () => {
    if (isTrialing && (daysRemaining === null || daysRemaining > 5)) {
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
    }
    if (isWarning) {
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
    }
    return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge 
          variant="outline"
          className={`hidden sm:flex gap-1 text-xs font-medium cursor-pointer hover:opacity-80 ${getBadgeColor()}`}
          data-testid="badge-subscription-renewal"
        >
          <span className="material-icons text-sm">
            {isTrialing ? 'science' : (isWarning ? 'schedule' : 'check_circle')}
          </span>
          {getBadgeContent()}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Subscription Details</h4>
            <Badge variant={isTrialing ? "secondary" : "default"} className="text-xs">
              {isTrialing ? 'Trial' : 'OnRopePro'}
            </Badge>
          </div>
          
          <Separator />
          
          <div className="space-y-2 text-sm">
            {endDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{isTrialing ? 'Trial ends' : 'Renews on'}</span>
                <span className="font-medium">{format(endDate, 'MMM d, yyyy')}</span>
              </div>
            )}
            
            {daysRemaining !== null && daysRemaining >= 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days remaining</span>
                <span className={`font-medium ${isWarning ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
                  {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {subscriptionData && (
              <>
                <Separator className="my-2" />
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{'OnRopePro'}</span>
                </div>

                {(subscriptionData.additionalSeatsCount > 0 || subscriptionData.giftedSeatsCount > 0) && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Additional seats</span>
                    <span className="font-medium">
                      {subscriptionData.additionalSeatsCount}
                      {subscriptionData.giftedSeatsCount > 0 && (
                        <span className="text-green-600 dark:text-green-400"> +{subscriptionData.giftedSeatsCount} free</span>
                      )}
                    </span>
                  </div>
                )}



                {subscriptionData.whitelabelBrandingActive && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">White-label</span>
                    <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                  </div>
                )}

                {subscriptionData.cancelAtPeriodEnd && (
                  <div className="mt-2 p-2 bg-yellow-500/10 rounded text-xs text-yellow-700 dark:text-yellow-400">
                    Subscription will cancel at period end
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
