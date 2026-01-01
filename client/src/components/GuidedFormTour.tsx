import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, X, Lightbulb } from "lucide-react";
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
  containerRef?: React.RefObject<HTMLElement>;
}

export function GuidedFormTour({ 
  steps, 
  isActive, 
  onClose,
  containerRef
}: GuidedFormTourProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];

  const highlightCurrentField = useCallback(() => {
    if (!isActive || !step) return;

    const container = containerRef?.current || document;
    if (!container) return;

    document.querySelectorAll('.tour-highlight-active').forEach(el => {
      el.classList.remove('tour-highlight-active');
    });

    const element = container.querySelector(step.fieldSelector);
    if (element) {
      element.classList.add('tour-highlight-active');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive, step, containerRef]);

  useEffect(() => {
    const styleId = 'guided-tour-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .tour-highlight-active {
          box-shadow: 0 0 0 3px hsl(var(--primary)), 0 0 16px 2px hsl(var(--primary) / 0.25) !important;
          border-radius: 8px;
          position: relative;
          z-index: 10;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      document.querySelectorAll('.tour-highlight-active').forEach(el => {
        el.classList.remove('tour-highlight-active');
      });
    };
  }, []);

  // Highlight the current field whenever step changes
  useEffect(() => {
    if (isActive) {
      highlightCurrentField();
    }
  }, [currentStep, isActive]);

  // Reset to step 0 only when tour is activated
  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
    } else {
      document.querySelectorAll('.tour-highlight-active').forEach(el => {
        el.classList.remove('tour-highlight-active');
      });
    }
  }, [isActive]);

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

  return (
    <div 
      className="mt-3 p-3 rounded-lg border border-primary/20 bg-primary/5"
      data-testid="tour-tooltip"
    >
      {/* Top row: Step badge, title, and close button */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="text-xs shrink-0">
            {currentStep + 1}/{steps.length}
          </Badge>
          <span className="font-medium text-sm">{step.title}</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 shrink-0"
          onClick={onClose}
          data-testid="button-close-tour"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Content row: Explanation and context tip side by side on larger screens */}
      <div className="flex flex-col sm:flex-row gap-2 text-xs mb-2">
        <p className="text-muted-foreground flex-1">{step.explanation}</p>
        {step.appContext && (
          <div className="flex items-start gap-1.5 p-2 rounded bg-amber-500/10 border border-amber-500/20 sm:max-w-[45%]">
            <Lightbulb className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <span className="text-amber-700 dark:text-amber-300">{step.appContext}</span>
          </div>
        )}
      </div>

      {/* Navigation row: Compact buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-primary/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="h-7 px-2 text-xs"
          data-testid="button-tour-previous"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          {t('common.back', 'Back')}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-7 px-2 text-xs text-muted-foreground"
          data-testid="button-tour-skip"
        >
          {t('common.endTour', 'End Tour')}
        </Button>

        <Button
          size="sm"
          onClick={handleNext}
          className="h-7 px-3 text-xs"
          data-testid="button-tour-next"
        >
          {currentStep === steps.length - 1 
            ? t('common.finish', 'Finish') 
            : t('common.next', 'Next')}
          {currentStep < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 ml-1" />}
        </Button>
      </div>
    </div>
  );
}

export const PROJECT_CREATION_TOUR_STEPS: TourStep[] = [
  {
    fieldSelector: '[data-testid="button-client-strata-search"]',
    title: "Quick Fill from Client Database",
    explanation: "Select an existing client to auto-populate building details like address, floor count, and drop targets. You can also enter details manually if the client isn't in your database yet.",
    appContext: "One-time client entry saves 20+ hours monthly. Building specs auto-fill into every future project for this client."
  },
  {
    fieldSelector: '[data-testid="input-strata-plan-number"]',
    title: "Strata Plan Number / Job Number",
    explanation: "Enter the unique building identifier (LMS, EMS, VIS) or your internal job reference number. This becomes the project's primary identifier throughout the system.",
    appContext: "Used for resident portal access codes, quote generation, and linking projects to CRM building records."
  },
  {
    fieldSelector: '[data-testid="input-building-name"]',
    title: "Building Name",
    explanation: "Enter the display name for this building. This is how the project appears in all calendar views, work session logs, and team communications.",
    appContext: "Technicians see this name when clocking in. It appears on safety forms, toolbox meeting records, and all project documentation."
  },
  {
    fieldSelector: '[data-testid="input-building-address"]',
    title: "Building Address",
    explanation: "Full street address including city and postal code. This powers GPS-verified clock-in/out and appears on all project documentation.",
    appContext: "Technicians get one-tap navigation to the site. The address is captured in every work session for audit verification."
  },
  {
    fieldSelector: '[data-testid="switch-requires-elevation"]',
    title: "Work at Height Toggle",
    explanation: "Enable this for rope access or any elevated work requiring fall protection. This unlocks safety compliance features specific to height work.",
    appContext: "Enables harness inspection requirements, IRATA/SPRAT certification verification, and equipment checkout tracking for this project."
  },
  {
    fieldSelector: '[data-testid="input-start-date"]',
    title: "Project Start Date",
    explanation: "When work is scheduled to begin. This date appears on the visual calendar and resource timeline for crew assignment planning.",
    appContext: "The scheduling system uses this to detect conflicts and prevent double-booking. Technicians see their assignments in their portal."
  },
  {
    fieldSelector: '[data-testid="input-end-date"]',
    title: "Target End Date",
    explanation: "Expected project completion date. Used to calculate project timeline and track if work is progressing on schedule.",
    appContext: "Compare scheduled vs actual hours in analytics. The system flags projects at risk of missing deadlines."
  },
  {
    fieldSelector: '[data-testid="input-drops-north"]',
    title: "Drops per Elevation",
    explanation: "Enter the number of rope drops for each building side (North, East, South, West). This is static building data that carries over to future projects.",
    appContext: "Powers the Building Portal progress tracking. Technicians log completed drops which updates the visual progress bars in real-time."
  },
  {
    fieldSelector: '[data-testid="input-daily-target"]',
    title: "Daily Drop Target",
    explanation: "Expected drops your crew should complete per day. This helps measure daily productivity and forecast project completion.",
    appContext: "Used in performance analytics. If technicians end early, they select a valid reason (weather, access issues, etc.) which is tracked separately."
  }
];
