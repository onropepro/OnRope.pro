import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, X, Lightbulb, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

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

  const step = steps[currentStep];

  const updateHighlight = useCallback(() => {
    if (!isActive || !step) return;

    const container = document.querySelector(containerSelector);
    if (!container) return;

    const element = container.querySelector(step.fieldSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightRect(rect);

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add visual highlight class to the element
      element.classList.add('tour-highlight-active');
      
      // Remove highlight from all other elements
      container.querySelectorAll('.tour-highlight-active').forEach(el => {
        if (el !== element) {
          el.classList.remove('tour-highlight-active');
        }
      });
    }
  }, [isActive, step, containerSelector]);

  useEffect(() => {
    // Add the highlight styles to the document
    const styleId = 'guided-tour-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .tour-highlight-active {
          box-shadow: 0 0 0 3px hsl(var(--primary)), 0 0 20px 4px hsl(var(--primary) / 0.3) !important;
          border-radius: 8px;
          position: relative;
          z-index: 10;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Clean up highlights when component unmounts
      document.querySelectorAll('.tour-highlight-active').forEach(el => {
        el.classList.remove('tour-highlight-active');
      });
    };
  }, []);

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
    } else {
      // Clean up all highlights when tour closes
      document.querySelectorAll('.tour-highlight-active').forEach(el => {
        el.classList.remove('tour-highlight-active');
      });
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

  // Position the tooltip card at fixed position at bottom of viewport
  // This ensures it never overlaps with dropdowns or form fields
  return createPortal(
    <Card
      className="fixed z-[9999] shadow-xl border-primary/30 bg-card/95 backdrop-blur-sm"
      style={{
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(500px, calc(100vw - 32px))',
      }}
      data-testid="tour-tooltip"
    >
      <CardContent className="p-4">
        {/* Header with step indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              {t('common.step', 'Step')} {currentStep + 1} / {steps.length}
            </Badge>
            <h4 className="font-semibold">{step.title}</h4>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={onClose}
            data-testid="button-close-tour"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Main explanation */}
        <p className="text-sm text-muted-foreground mb-3">{step.explanation}</p>

        {/* App context tip */}
        {step.appContext && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 mb-4">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">{step.appContext}</p>
          </div>
        )}

        {/* Instruction to interact */}
        <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/10 mb-4">
          <ChevronRight className="h-4 w-4 text-primary" />
          <p className="text-xs text-primary font-medium">
            {t('tour.interactPrompt', 'Fill in the highlighted field above, then click Next to continue.')}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t">
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
            {t('common.endTour', 'End Tour')}
          </Button>

          <Button
            size="sm"
            onClick={handleNext}
            data-testid="button-tour-next"
          >
            {currentStep === steps.length - 1 
              ? t('common.finish', 'Finish') 
              : t('common.next', 'Next')}
            {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>,
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
