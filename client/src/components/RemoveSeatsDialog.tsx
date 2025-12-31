import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/hooks/use-language";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
  suspendedAt?: string | null;
}

interface RemoveSeatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paidSeats: number;
  giftedSeats: number;
  onRemoveSuccess?: () => void;
}

export function RemoveSeatsDialog({ 
  open, 
  onOpenChange, 
  paidSeats,
  giftedSeats,
  onRemoveSuccess 
}: RemoveSeatsDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const SEAT_PRICE = 34.95;
  const creditAmount = (selectedEmployees.length * SEAT_PRICE).toFixed(2);

  const { data: employeesData } = useQuery<{ employees: Employee[] }>({
    queryKey: ["/api/employees"],
    enabled: open,
  });

  const activeEmployees = (employeesData?.employees || []).filter(
    (emp: Employee) => emp.role !== 'company' && !emp.suspendedAt
  );

  const maxRemovable = Math.min(paidSeats, activeEmployees.length);

  const handleToggleEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      }
      if (prev.length < maxRemovable) {
        return [...prev, employeeId];
      }
      return prev;
    });
  };

  const handleRemove = async () => {
    if (selectedEmployees.length === 0) return;
    
    setIsRemoving(true);
    try {
      const response = await apiRequest("POST", "/api/stripe/remove-seats", { 
        quantity: selectedEmployees.length,
        employeeIds: selectedEmployees 
      });
      if (response.ok) {
        const data = await response.json();
        toast({
          title: t("seats.seatsRemoved", "Seats Removed"),
          description: `${t("seats.seatsRemovedSuccess", `Successfully removed ${selectedEmployees.length} seat(s).`).replace("{{count}}", String(selectedEmployees.length))} ${data.creditAmount ? t("seats.creditApplied", `A credit of $${data.creditAmount} has been applied to your next invoice.`).replace("{{amount}}", data.creditAmount) : ''}`,
        });
        setShowConfirmDialog(false);
        onOpenChange(false);
        setSelectedEmployees([]);
        queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
        queryClient.invalidateQueries({ queryKey: ["/api/subscription/details"] });
        queryClient.invalidateQueries({ queryKey: ["/api/stripe/subscription-status"] });
        onRemoveSuccess?.();
      } else {
        const error = await response.json();
        toast({
          title: t("seats.removalFailed", "Removal Failed"),
          description: error.message || t("seats.removalFailedMessage", "Failed to remove seats. Please try again."),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("seats.removalFailed", "Removal Failed"),
        description: t("seats.removalErrorMessage", "An error occurred while processing your request. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedEmployees([]);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      owner_ceo: t("roles.ownerCeo", "Owner/CEO"),
      operations_manager: t("roles.operationsManager", "Operations Manager"),
      general_supervisor: t("roles.generalSupervisor", "General Supervisor"),
      rope_access_supervisor: t("roles.ropeAccessSupervisor", "Rope Access Supervisor"),
      rope_access_tech: t("roles.technician", "Technician"),
      human_resources: t("roles.hr", "HR"),
      accounting: t("roles.accounting", "Accounting"),
      account_manager: t("roles.accountManager", "Account Manager"),
      supervisor: t("roles.supervisor", "Supervisor"),
    };
    return roleNames[role] || role;
  };

  return (
    <>
      <Dialog open={open && !showConfirmDialog} onOpenChange={(o) => { if (!o) handleClose(); }}>
        <DialogContent className="max-w-lg" data-testid="dialog-remove-seats">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-destructive">person_remove</span>
              {t("seats.removeTitle", "Remove Seats")}
            </DialogTitle>
            <DialogDescription>
              {t("seats.removeDescription", "Select employees to suspend. Their access will be revoked, and you'll receive a prorated credit toward your next billing period.")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2 space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">{t("seats.yourPaidSeats", "Your Paid Seats")}</p>
                <p className="text-xs text-muted-foreground">
                  {paidSeats} {t("common.paid", "paid")}{giftedSeats > 0 ? ` + ${giftedSeats} ${t("common.gifted", "gifted")} (${t("common.freeForever", "free forever")})` : ''}
                </p>
              </div>
              <Badge variant="outline">{t("seats.maxRemovable", "Max removable")}: {maxRemovable}</Badge>
            </div>
            
            {maxRemovable === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <span className="material-icons text-4xl mb-2">info</span>
                <p className="text-sm">{t("seats.noPaidSeats", "No paid seats available to remove.")}</p>
                {giftedSeats > 0 && (
                  <p className="text-xs mt-1">{t("seats.giftedCannotRemove", "Gifted seats cannot be removed.")}</p>
                )}
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  {t("seats.selectToSuspend", `Select employees to suspend (${selectedEmployees.length}/${maxRemovable} selected):`).replace("{{selected}}", String(selectedEmployees.length)).replace("{{max}}", String(maxRemovable))}
                </div>
                
                <ScrollArea className="h-[250px] pr-4">
                  <div className="space-y-2">
                    {activeEmployees.map((employee) => (
                      <div 
                        key={employee.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedEmployees.includes(employee.id) 
                            ? 'border-destructive bg-destructive/5' 
                            : 'border-border hover:bg-muted/50'
                        }`}
                        onClick={() => handleToggleEmployee(employee.id)}
                        data-testid={`employee-select-${employee.id}`}
                      >
                        <Checkbox 
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() => handleToggleEmployee(employee.id)}
                          disabled={!selectedEmployees.includes(employee.id) && selectedEmployees.length >= maxRemovable}
                        />
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.photoUrl} />
                          <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{employee.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{employee.email}</p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">{getRoleName(employee.role)}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {selectedEmployees.length > 0 && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-amber-600 dark:text-amber-400 text-sm mt-0.5">info</span>
                      <div className="text-sm">
                        <p className="font-medium text-amber-800 dark:text-amber-200">
                          {t("seats.estimatedCredit", "Estimated Credit")}: ${creditAmount}
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          {t("seats.creditNotice", "Prorated credit will be applied to your next invoice. Selected employees will be moved to the Suspended section and can be reactivated later.")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClose} data-testid="button-cancel-remove">
              {t("common.cancel", "Cancel")}
            </Button>
            <Button 
              variant="destructive"
              disabled={selectedEmployees.length === 0}
              onClick={() => setShowConfirmDialog(true)}
              data-testid="button-continue-remove"
            >
              <span className="material-icons text-sm mr-1">person_remove</span>
              {t("seats.removeSeats", `Remove ${selectedEmployees.length} Seat${selectedEmployees.length !== 1 ? 's' : ''}`).replace("{{count}}", String(selectedEmployees.length))}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent data-testid="dialog-confirm-remove">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="material-icons text-destructive">warning</span>
              {t("seats.confirmRemoval", "Confirm Seat Removal")}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>{t("seats.confirmRemovalDescription", `You are about to remove ${selectedEmployees.length} seat${selectedEmployees.length !== 1 ? 's' : ''} from your subscription.`).replace("{{count}}", String(selectedEmployees.length))}</p>
                
                <div className="p-3 bg-muted rounded-lg space-y-1">
                  <p className="text-sm font-medium">{t("seats.selectedWillBeSuspended", "Selected employees will be suspended:")}</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    {selectedEmployees.map(id => {
                      const emp = activeEmployees.find(e => e.id === id);
                      return <li key={id}>{emp?.name || t("common.unknown", "Unknown")}</li>;
                    })}
                  </ul>
                </div>
                
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">{t("seats.creditAmount", "Credit amount")}:</span> ~${creditAmount} ({t("seats.prorated", "prorated")})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("seats.suspendedNotice", "Suspended employees lose access immediately but can be reactivated at any time (unless they unlink from your company).")}
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving} data-testid="button-cancel-confirm">
              {t("common.cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-remove"
            >
              {isRemoving ? (
                <>
                  <span className="material-icons animate-spin text-sm mr-1">sync</span>
                  {t("common.processing", "Processing...")}
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1">check</span>
                  {t("seats.confirmRemovalButton", "Confirm Removal")}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
