import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/hooks/use-language";

interface PurchaseSeatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSeats: number;
  onPurchaseSuccess?: () => void;
  isTrialing?: boolean;
  seatsUsed?: number;
  baseSeatLimit?: number;
  paidSeats?: number;
  giftedSeats?: number;
  hasWhitelabelBranding?: boolean;
}

export function PurchaseSeatsDialog({ 
  open, 
  onOpenChange, 
  currentSeats,
  onPurchaseSuccess,
  isTrialing = false,
  seatsUsed = 0,
  baseSeatLimit = 2,
  paidSeats = 0,
  giftedSeats = 0,
  hasWhitelabelBranding = false
}: PurchaseSeatsDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const SEAT_PRICE = 34.95;
  const BASE_SUBSCRIPTION = 99.00;
  const WHITELABEL_PRICE = 49.95;
  
  const newSeatsCost = quantity * SEAT_PRICE;
  const totalPrice = newSeatsCost.toFixed(2);
  
  const currentPaidSeatsCost = paidSeats * SEAT_PRICE;
  const whitelabelCost = hasWhitelabelBranding ? WHITELABEL_PRICE : 0;
  const currentMonthlyTotal = BASE_SUBSCRIPTION + currentPaidSeatsCost + whitelabelCost;
  const newMonthlyTotal = currentMonthlyTotal + newSeatsCost;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const response = await apiRequest("POST", "/api/stripe/add-seats", { quantity });
      if (response.ok) {
        const data = await response.json();
        toast({
          title: t("seats.seatsPurchased", "Seats Purchased"),
          description: t("seats.seatsAddedSuccess", `Successfully added ${data.seatsAdded} seat(s) to your subscription.`).replace("{{count}}", String(data.seatsAdded)),
        });
        setShowConfirmDialog(false);
        onOpenChange(false);
        setQuantity(1);
        onPurchaseSuccess?.();
      } else {
        const error = await response.json();
        toast({
          title: t("seats.purchaseFailed", "Purchase Failed"),
          description: error.message || t("seats.purchaseFailedMessage", "Failed to purchase seats. Please try again."),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("seats.purchaseFailed", "Purchase Failed"),
        description: t("seats.purchaseErrorMessage", "An error occurred while processing your purchase. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setQuantity(1);
  };

  return (
    <>
      <Dialog open={open && !showConfirmDialog} onOpenChange={(o) => { if (!o) handleClose(); }}>
        <DialogContent className="max-w-md" data-testid="dialog-purchase-seats">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">group_add</span>
              {t("seats.purchaseTitle", "Purchase Employee Seats")}
            </DialogTitle>
            <DialogDescription>
              {currentSeats === 0 
                ? t("seats.purchaseDescriptionEmpty", "You haven't purchased any employee seats yet. Each seat allows you to add one team member to your company.")
                : t("seats.purchaseDescriptionFull", `You've used all ${currentSeats} of your employee seats. Purchase additional seats to add more team members.`).replace("{{count}}", String(currentSeats))}
            </DialogDescription>
          </DialogHeader>
          
          {(() => {
            return (
              <div className={`p-4 rounded-lg border ${isTrialing ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800' : 'bg-muted/50 border-border'}`}>
                <div className="flex items-start gap-3">
                  {isTrialing && (
                    <span className="material-icons text-amber-600 dark:text-amber-400 text-xl mt-0.5">warning</span>
                  )}
                  <div className="flex-1">
                    {isTrialing && (
                      <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                        {t("seats.freeTrialNotice", "Free Trial - Billing Notice")}
                      </p>
                    )}
                    <p className={`text-sm mb-3 ${isTrialing ? 'text-amber-800 dark:text-amber-200' : 'text-muted-foreground'}`}>
                      {isTrialing 
                        ? <>{t("seats.trialBillingInfo", "You're currently on a 30-day free trial. Here's what your monthly bill will be when your trial ends:")}</>
                        : <>{t("seats.currentBillingInfo", "Here's your current monthly subscription and what it will be after adding seats:")}</>
                      }
                    </p>
                    <div className={`rounded-md p-3 border ${isTrialing ? 'bg-white dark:bg-amber-900 border-amber-200 dark:border-amber-700' : 'bg-background border-border'}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isTrialing ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                        {t("seats.currentMonthlyBill", "Current Monthly Bill")}
                      </p>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className={isTrialing ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}>{t("seats.baseSubscription", "Base subscription")}:</span>
                        <span className={`font-medium ${isTrialing ? 'text-amber-900 dark:text-amber-100' : 'text-foreground'}`}>$99.00</span>
                      </div>
                      {giftedSeats > 0 && (
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className={isTrialing ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}>{t("seats.giftedSeats", "Gifted seats (free)")}:</span>
                          <span className={`font-medium ${isTrialing ? 'text-amber-900 dark:text-amber-100' : 'text-foreground'}`}>{giftedSeats} {t("common.seats", "seats")}</span>
                        </div>
                      )}
                      {paidSeats > 0 && (
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className={isTrialing ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}>{t("seats.paidSeats", "Paid seats")} ({paidSeats}):</span>
                          <span className={`font-medium ${isTrialing ? 'text-amber-900 dark:text-amber-100' : 'text-foreground'}`}>${currentPaidSeatsCost.toFixed(2)}</span>
                        </div>
                      )}
                      {hasWhitelabelBranding && (
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className={isTrialing ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}>{t("seats.whiteLabelBranding", "White Label Branding")}:</span>
                          <span className={`font-medium ${isTrialing ? 'text-amber-900 dark:text-amber-100' : 'text-foreground'}`}>${WHITELABEL_PRICE.toFixed(2)}</span>
                        </div>
                      )}
                      <div className={`flex justify-between items-center text-sm pt-1 border-t mt-1 ${isTrialing ? 'border-amber-200 dark:border-amber-700' : 'border-border'}`}>
                        <span className={`font-medium ${isTrialing ? 'text-amber-900 dark:text-amber-100' : 'text-foreground'}`}>{t("seats.currentTotal", "Current total")}:</span>
                        <span className={`font-semibold ${isTrialing ? 'text-amber-900 dark:text-amber-100' : 'text-foreground'}`}>${currentMonthlyTotal.toFixed(2)}/{t("common.mo", "mo")}</span>
                      </div>
                      
                      <div className={`mt-3 pt-3 border-t ${isTrialing ? 'border-amber-200 dark:border-amber-700' : 'border-border'}`}>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isTrialing ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                          {t("seats.addingNow", "Adding Now")}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className={isTrialing ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}>{t("seats.newSeats", "New seats")} ({quantity}):</span>
                          <span className={`font-medium text-primary`}>+${newSeatsCost.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className={`border-t pt-2 mt-3 ${isTrialing ? 'border-amber-200 dark:border-amber-700' : 'border-border'}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-semibold ${isTrialing ? 'text-amber-900 dark:text-amber-100' : 'text-foreground'}`}>
                            {isTrialing ? t("seats.projectedCost", "Projected monthly cost after trial:") : t("seats.newMonthlyTotal", "New monthly total:")}
                          </span>
                          <span className={`font-bold text-lg ${isTrialing ? 'text-amber-900 dark:text-amber-100' : 'text-primary'}`}>
                            ${newMonthlyTotal.toFixed(2)}/{t("common.mo", "mo")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{t("seats.additionalSeats", "Additional Seats")}</p>
                  <p className="text-sm text-muted-foreground">$34.95 {t("seats.perSeatMonth", "per seat/month")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-decrease-seats"
                  >
                    <span className="material-icons text-sm">remove</span>
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(100, val)));
                    }}
                    className="w-16 text-center"
                    data-testid="input-seat-quantity"
                  />
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => setQuantity(Math.min(100, quantity + 1))}
                    disabled={quantity >= 100}
                    data-testid="button-increase-seats"
                  >
                    <span className="material-icons text-sm">add</span>
                  </Button>
                </div>
              </div>
              <div className="border-t pt-3 flex items-center justify-between gap-2">
                <p className="font-medium">{t("seats.newMonthlyTotal", "New Monthly Total")}</p>
                <p className="font-bold text-xl text-primary">${newMonthlyTotal.toFixed(2)}/{t("common.month", "month")}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("seats.seatsProratedNotice", "Seats are billed monthly and prorated based on your billing cycle. You will be charged a prorated amount for the remainder of this billing period.")}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              data-testid="button-cancel-purchase-seats"
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button 
              onClick={() => setShowConfirmDialog(true)}
              data-testid="button-confirm-purchase-seats"
            >
              <span className="material-icons text-sm mr-1">shopping_cart</span>
              {t("seats.addSeats", `Add ${quantity} Seat${quantity > 1 ? 's' : ''}`).replace("{{count}}", String(quantity))} (+${totalPrice}/{t("common.mo", "mo")})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent data-testid="dialog-confirm-seat-purchase">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">verified</span>
              {t("seats.confirmPurchase", "Confirm Seat Purchase")}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>{t("seats.confirmPurchaseDescription", `You are about to purchase ${quantity} additional seat${quantity > 1 ? 's' : ''} for your subscription.`).replace("{{count}}", String(quantity))}</p>
              <p className="text-lg font-semibold text-foreground">
                {t("common.total", "Total")}: ${totalPrice}/{t("common.month", "month")}
              </p>
              <p className="text-sm">
                {t("seats.proratedCharge", "A prorated amount will be charged to your payment method on file for the remainder of this billing period.")}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowConfirmDialog(false)}
              disabled={isPurchasing}
              data-testid="button-cancel-confirm-purchase"
            >
              {t("common.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePurchase}
              disabled={isPurchasing}
              data-testid="button-complete-purchase"
            >
              {isPurchasing ? (
                <>
                  <span className="material-icons animate-spin text-sm mr-1">sync</span>
                  {t("common.processing", "Processing...")}
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1">check</span>
                  {t("common.purchase", "Purchase")} ${totalPrice}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
