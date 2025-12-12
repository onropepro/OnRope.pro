import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface ConflictInfo {
  employeeId: string;
  employeeName: string;
  conflictingJob: string;
}

interface DoubleBookingWarningDialogProps {
  open: boolean;
  onClose: () => void;
  onProceed: () => void;
  conflicts: ConflictInfo[];
  isPending?: boolean;
}

export function DoubleBookingWarningDialog({
  open,
  onClose,
  onProceed,
  conflicts,
  isPending = false,
}: DoubleBookingWarningDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="max-w-md" data-testid="dialog-double-booking-warning">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <AlertDialogTitle className="text-lg">
              {t('schedule.doubleBookingWarning.title', 'Schedule Conflict Detected')}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogDescription asChild>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('schedule.doubleBookingWarning.description', 'The following employees are already scheduled for overlapping jobs during this time:')}
            </p>
            
            <div className="space-y-2 rounded-md border p-3 bg-muted/30">
              {conflicts.map((conflict, index) => (
                <div key={`${conflict.employeeId}-${index}`} className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{conflict.employeeName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {conflict.conflictingJob}
                  </Badge>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {t('schedule.doubleBookingWarning.question', 'Would you like to proceed with the double-booking anyway?')}
            </p>
          </div>
        </AlertDialogDescription>
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose} 
            disabled={isPending}
            data-testid="button-cancel-double-booking"
          >
            {t('common.cancel', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onProceed}
            disabled={isPending}
            className="bg-amber-500 hover:bg-amber-600 text-white"
            data-testid="button-proceed-double-booking"
          >
            {isPending 
              ? t('common.assigning', 'Assigning...') 
              : t('schedule.doubleBookingWarning.proceed', 'Proceed Anyway')
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
