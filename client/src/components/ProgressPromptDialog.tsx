import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ProgressPromptDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string | null;
  currentProgress: number;
}

export function ProgressPromptDialog({ open, onClose, projectId, currentProgress }: ProgressPromptDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState(String(currentProgress));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (skip: boolean = false) => {
    if (!projectId) return;
    
    setIsSubmitting(true);
    try {
      const value = skip ? undefined : parseInt(inputValue);
      if (!skip && (isNaN(value!) || value! < 0 || value! > 100)) {
        toast({ 
          title: t('dashboard.toast.error', 'Error'), 
          description: t('dashboard.progressPrompt.invalidValue', 'Please enter a valid percentage between 0 and 100'),
          variant: "destructive" 
        });
        setIsSubmitting(false);
        return;
      }
      
      await apiRequest("PATCH", `/api/projects/${projectId}/overall-progress`, {
        completionPercentage: skip ? undefined : value,
        skip,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      if (!skip) {
        toast({ 
          title: t('dashboard.toast.progressUpdated', 'Progress updated'), 
          description: t('dashboard.toast.progressUpdatedDesc', 'Project completion percentage has been recorded.')
        });
      } else {
        toast({ 
          title: t('dashboard.toast.workSessionEnded', 'Work session ended'), 
          description: t('dashboard.toast.greatWorkNoLocation', 'Great work today!')
        });
      }
      
      onClose();
    } catch (error: any) {
      toast({ 
        title: t('dashboard.toast.error', 'Error'), 
        description: error.message || 'Failed to update progress',
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="material-icons text-primary">update</span>
            {t('dashboard.progressPrompt.title', 'Update Project Progress')}
          </DialogTitle>
          <DialogDescription>
            {t('dashboard.progressPrompt.description', "You're the last one leaving the site today. Please enter the overall project completion percentage.")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t('dashboard.progressPrompt.currentProgress', 'Current Progress')}: {currentProgress}%</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                step="1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0-100"
                className="h-12 text-xl"
                data-testid="input-overall-progress"
              />
              <span className="text-xl font-bold">%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.progressPrompt.hint', 'Enter the overall project completion as a percentage (0-100)')}
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            data-testid="button-skip-progress"
          >
            {t('dashboard.progressPrompt.skip', 'Skip')}
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            data-testid="button-submit-progress"
          >
            {isSubmitting 
              ? t('dashboard.progressPrompt.saving', 'Saving...') 
              : t('dashboard.progressPrompt.save', 'Save Progress')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
