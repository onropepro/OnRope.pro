import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface PurchaseSeatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSeats: number;
  onPurchaseSuccess?: () => void;
  isTrialing?: boolean;
  seatsUsed?: number;
  baseSeatLimit?: number;
}

export function PurchaseSeatsDialog({ 
  open, 
  onOpenChange, 
  currentSeats,
  onPurchaseSuccess,
  isTrialing = false,
  seatsUsed = 0,
  baseSeatLimit = 2
}: PurchaseSeatsDialogProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const SEAT_PRICE = 34.95;
  const totalPrice = (quantity * SEAT_PRICE).toFixed(2);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const response = await apiRequest("POST", "/api/stripe/add-seats", { quantity });
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Seats Purchased",
          description: `Successfully added ${data.seatsAdded} seat(s) to your subscription.`,
        });
        setShowConfirmDialog(false);
        onOpenChange(false);
        setQuantity(1);
        onPurchaseSuccess?.();
      } else {
        const error = await response.json();
        toast({
          title: "Purchase Failed",
          description: error.message || "Failed to purchase seats. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: "An error occurred while processing your purchase. Please try again.",
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
              Purchase Employee Seats
            </DialogTitle>
            <DialogDescription>
              {currentSeats === 0 
                ? "You haven't purchased any employee seats yet. Each seat allows you to add one team member to your company."
                : `You've used all ${currentSeats} of your employee seats. Purchase additional seats to add more team members.`}
            </DialogDescription>
          </DialogHeader>
          
          {/* Trial Billing Warning */}
          {isTrialing && (() => {
            // Calculate billable seats: seats used minus the free base seats, plus the new seats being added
            const currentBillableSeats = Math.max(0, seatsUsed - baseSeatLimit);
            const newBillableSeats = currentBillableSeats + quantity;
            
            return (
              <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-icons text-amber-600 dark:text-amber-400 text-xl mt-0.5">warning</span>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Free Trial - Billing Notice
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                      You're currently on a <strong>30-day free trial</strong>. You have {baseSeatLimit} gifted seats. Each additional seat is billed at <strong>$34.95/month</strong> when your trial ends.
                    </p>
                    <div className="bg-white dark:bg-amber-900 rounded-md p-3 border border-amber-200 dark:border-amber-700">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-amber-700 dark:text-amber-300">Base subscription:</span>
                        <span className="font-medium text-amber-900 dark:text-amber-100">$99.00/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-amber-700 dark:text-amber-300">Gifted seats (free):</span>
                        <span className="font-medium text-amber-900 dark:text-amber-100">{baseSeatLimit} seats</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-amber-700 dark:text-amber-300">Additional paid seats after adding:</span>
                        <span className="font-medium text-amber-900 dark:text-amber-100">
                          {newBillableSeats} x $34.95 = ${(newBillableSeats * 34.95).toFixed(2)}/mo
                        </span>
                      </div>
                      <div className="border-t border-amber-200 dark:border-amber-700 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-amber-900 dark:text-amber-100">Projected monthly cost after trial:</span>
                          <span className="font-bold text-lg text-amber-900 dark:text-amber-100">
                            ${(99 + newBillableSeats * 34.95).toFixed(2)}/mo
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
                  <p className="font-medium">Additional Seats</p>
                  <p className="text-sm text-muted-foreground">$34.95 per seat/month</p>
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
                <p className="font-medium">Monthly Total</p>
                <p className="font-bold text-xl text-primary">${totalPrice}/month</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Seats are billed monthly and prorated based on your billing cycle. You will be charged a prorated amount for the remainder of this billing period.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              data-testid="button-cancel-purchase-seats"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setShowConfirmDialog(true)}
              data-testid="button-confirm-purchase-seats"
            >
              <span className="material-icons text-sm mr-1">shopping_cart</span>
              Confirm Purchase - ${totalPrice}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent data-testid="dialog-confirm-seat-purchase">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">verified</span>
              Confirm Seat Purchase
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>You are about to purchase <strong>{quantity} additional seat{quantity > 1 ? 's' : ''}</strong> for your subscription.</p>
              <p className="text-lg font-semibold text-foreground">
                Total: ${totalPrice}/month
              </p>
              <p className="text-sm">
                A prorated amount will be charged to your payment method on file for the remainder of this billing period.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowConfirmDialog(false)}
              disabled={isPurchasing}
              data-testid="button-cancel-confirm-purchase"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePurchase}
              disabled={isPurchasing}
              data-testid="button-complete-purchase"
            >
              {isPurchasing ? (
                <>
                  <span className="material-icons animate-spin text-sm mr-1">sync</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1">check</span>
                  Purchase ${totalPrice}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
