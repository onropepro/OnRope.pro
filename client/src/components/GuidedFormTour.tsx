import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, X, Lightbulb, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface TourStep {
  fieldSelector: string;
  title: string;
  explanation: string;
  appContext?: string;
}

interface GuidedFormTourProps {
  steps: TourStep[];
  isActive: boolean;
  onClose: () => void;
  containerSelector?: string;
}

export function GuidedFormTour({ 
  steps, 
  isActive, 
  onClose,
  containerSelector = "[role='dialog']"
}: GuidedFormTourProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  const step = steps[currentStep];

  const updateHighlight = useCallback(() => {
    if (!isActive || !step) return;

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const element = container.querySelector(step.fieldSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightRect(rect);

      const tooltipTop = rect.bottom + 8;
      const tooltipLeft = rect.left;
      const tooltipWidth = Math.min(rect.width, 400);

      setTooltipPosition({ top: tooltipTop, left: tooltipLeft, width: tooltipWidth });

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive, step, containerSelector]);

  useEffect(() => {
    updateHighlight();

    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight, true);

    const observer = new MutationObserver(updateHighlight);
    const container = document.querySelector(containerSelector);
    if (container) {
      observer.observe(container, { childList: true, subtree: true, attributes: true });
    }

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight, true);
      observer.disconnect();
    };
  }, [updateHighlight, containerSelector]);

  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
      setTimeout(updateHighlight, 100);
    }
  }, [isActive, updateHighlight]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isActive || !step) return null;

  return createPortal(
    <>
      {highlightRect && (
        <div
          className="fixed pointer-events-none z-[9998]"
          style={{
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8,
            boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            border: '2px solid hsl(var(--primary))',
            backgroundColor: 'transparent',
          }}
        />
      )}

      {tooltipPosition && (
        <Card
          className="fixed z-[9999] shadow-xl border-primary/20"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            width: Math.max(tooltipPosition.width, 320),
            maxWidth: 'calc(100vw - 32px)',
          }}
          data-testid="tour-tooltip"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-md bg-primary/10">
                <HelpCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {currentStep + 1} / {steps.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.explanation}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={onClose}
                data-testid="button-close-tour"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {step.appContext && (
              <div className="flex items-start gap-2 p-2 rounded-md bg-amber-500/10 border border-amber-500/20 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">{step.appContext}</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                data-testid="button-tour-previous"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t('common.back', 'Back')}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground"
                data-testid="button-tour-skip"
              >
                {t('common.skip', 'Skip Tour')}
              </Button>

              <Button
                size="sm"
                onClick={handleNext}
                data-testid="button-tour-next"
              >
                {currentStep === steps.length - 1 
                  ? t('common.done', 'Done') 
                  : t('common.next', 'Next')}
                {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>,
    document.body
  );
}

export const PROJECT_CREATION_TOUR_STEPS: TourStep[] = [
  {
    fieldSelector: '[data-testid="button-client-strata-search"]',
    title: "Quick Fill from Client",
    explanation: "Choose an existing client from your database to auto-fill building details.",
    appContext: "Linking to a client enables quick access to their history, quotes, and contact info from the project."
  },
  {
    fieldSelector: '[data-testid="input-strata-plan-number"]',
    title: "Strata / Job Number",
    explanation: "Enter the strata plan number or your internal job reference number.",
    appContext: "This ID appears on invoices, work orders, and helps technicians identify the job site."
  },
  {
    fieldSelector: '[data-testid="input-building-name"]',
    title: "Building Name",
    explanation: "The name of the building or property where work will be performed.",
    appContext: "Shown to technicians in their app and used in all client communications."
  },
  {
    fieldSelector: '[data-testid="input-building-address"]',
    title: "Building Address",
    explanation: "Full street address for the job site.",
    appContext: "Enables GPS navigation for technicians and powers the map view in scheduling."
  },
  {
    fieldSelector: '[data-testid="switch-requires-elevation"]',
    title: "Work at Height",
    explanation: "Toggle on if this job requires rope access or elevated work.",
    appContext: "Enables safety compliance features: gear tracking, harness inspections, and IRATA certification verification."
  },
  {
    fieldSelector: '[data-testid="input-start-date"]',
    title: "Start Date",
    explanation: "When work is scheduled to begin on this project.",
    appContext: "Appears on the Job Schedule calendar and triggers technician notifications."
  },
  {
    fieldSelector: '[data-testid="input-end-date"]',
    title: "End Date",
    explanation: "Target completion date for the project.",
    appContext: "Used to calculate project timeline, appears in reports, and triggers deadline reminders."
  },
  {
    fieldSelector: '[data-testid="input-drops-north"]',
    title: "Total Drops (North)",
    explanation: "Number of rope drops on the north elevation of the building.",
    appContext: "Drops power the progress bars in Building Portal and help calculate daily targets for your crew."
  },
  {
    fieldSelector: '[data-testid="input-daily-target"]',
    title: "Daily Drop Target",
    explanation: "How many drops should the crew aim to complete each day.",
    appContext: "Shown to technicians and used to calculate if the project is on schedule."
  }
];
