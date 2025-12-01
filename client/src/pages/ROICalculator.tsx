import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calculator, 
  Clock, 
  DollarSign, 
  Users, 
  ChevronDown,
  ChevronUp,
  Mail,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  FileText,
  Calendar,
  FolderOpen,
  MessageSquare,
  Shield,
  Globe
} from "lucide-react";
import ropeAccessProLogo from "@assets/generated_images/Blue_rope_access_worker_logo_ac1aa8fd.png";

type TimeTrackingOption = 'paper' | 'excel' | 'software' | 'none';
type ProjectManagementOption = 'whiteboard' | 'excel' | 'software' | 'texts';
type CRMOption = 'email' | 'spreadsheet' | 'software' | 'memory';
type SafetyComplianceOption = 'paper' | 'none' | 'software' | 'photos';
type SchedulingOption = 'calls' | 'excel' | 'software' | 'verbal';
type DocumentStorageOption = 'filing' | 'computer' | 'cloud' | 'mix';

interface CalculatorAnswers {
  timeTracking: TimeTrackingOption | null;
  projectManagement: ProjectManagementOption | null;
  crm: CRMOption | null;
  safetyCompliance: SafetyComplianceOption | null;
  scheduling: SchedulingOption | null;
  documentStorage: DocumentStorageOption | null;
}

interface CostBreakdown {
  category: string;
  method: string;
  directCost: number;
  hiddenCost: number;
  hoursWasted: number;
}

const TOOL_COSTS = {
  timeTracking: {
    software: { perUser: 7, base: 0, hours: 0 },
    paper: { hidden: 173, hours: 7 },
    excel: { hidden: 217, hours: 8.7 },
    none: { hidden: 350, hours: 14 }
  },
  projectManagement: {
    software: { perUser: 12, base: 0, hours: 0 },
    whiteboard: { hidden: 278, hours: 10 },
    excel: { hidden: 208, hours: 7.5 },
    texts: { hidden: 347, hours: 12.5 }
  },
  crm: {
    software: { perUser: 20, base: 0, hours: 0 },
    email: { hidden: 417, hours: 15 },
    spreadsheet: { hidden: 278, hours: 10 },
    memory: { hidden: 556, hours: 20 }
  },
  safetyCompliance: {
    software: { perUser: 0, base: 65, hours: 0 },
    paper: { hidden: 125, hours: 4.5 },
    none: { hidden: 208, hours: 0 },
    photos: { hidden: 139, hours: 5 }
  },
  scheduling: {
    software: { perUser: 6, base: 0, hours: 0 },
    calls: { hidden: 347, hours: 12.5 },
    excel: { hidden: 278, hours: 10 },
    verbal: { hidden: 417, hours: 15 }
  },
  documentStorage: {
    cloud: { perUser: 0, base: 15, hours: 0 },
    filing: { hidden: 156, hours: 5.5 },
    computer: { hidden: 208, hours: 7.5 },
    mix: { hidden: 278, hours: 10 }
  }
};

const ONROPEPRO_TIER_1 = 299;
const ONROPEPRO_TIER_2 = 499;

const REVEAL_MESSAGES = {
  timeTracking: {
    paper: "Manual payroll processing costs 7 hours per pay period (26 per year). That's 182 hours annually worth $9,100 in admin time alone—plus payroll errors averaging $1,200-3,600/year.",
    excel: "Spreadsheet-based time tracking requires manual entry and constant error correction. You're spending 8.7 hours monthly just on time data management.",
    none: "Without precise time tracking, payroll errors average 15-25% of labor costs. That's thousands of dollars in overpayments or compliance risks annually."
  },
  projectManagement: {
    whiteboard: "Without centralized project tracking, managers spend 10+ hours weekly coordinating teams, finding project details, and answering 'where should I go?' questions. That's 520 hours/year worth $26,000 in wasted coordination time.",
    excel: "Spreadsheet project tracking requires constant manual updates and creates version control nightmares. You're spending 7.5 hours monthly on updates that could be automated.",
    texts: "Group texts create no searchable records, constant interruptions, and miscommunication. You're spending 12.5 hours monthly on fragmented coordination."
  },
  crm: {
    email: "Without CRM, you're losing 3-5 contracts per year to missed follow-ups and poor contact management. That's $25,000-40,000 in annual lost revenue opportunity.",
    spreadsheet: "Contact spreadsheets require 10 hours monthly to maintain and still miss critical follow-up opportunities.",
    memory: "Relying on memory for client relationships means missed follow-ups, lost contracts, and inconsistent communication. The average cost is 3-5 lost contracts per year."
  },
  safetyCompliance: {
    paper: "Paper safety forms get lost, damaged, or are unavailable during audits. Companies with digital compliance save 10-20% on insurance premiums (average $2,500/year) and avoid $15,625 OSHA penalties for missing documentation.",
    none: "Operating without formal safety documentation increases insurance premiums by 10-20% and exposes you to significant regulatory penalties.",
    photos: "Phone photos without organization mean lost documentation and 5 hours monthly searching for compliance records during audits."
  },
  scheduling: {
    calls: "Manual scheduling creates double-booking conflicts, missed job assignments, and constant phone interruptions. You're spending 5+ hours per week just coordinating who goes where. That's 260 hours/year worth $13,000.",
    excel: "Excel scheduling requires daily updates and lacks real-time visibility. Conflicts and missed assignments are common, costing 10 hours monthly in coordination.",
    verbal: "Day-by-day verbal assignments create chaos, missed jobs, and frustrated employees. You're spending 15 hours monthly on avoidable scheduling confusion."
  },
  documentStorage: {
    filing: "When insurance auditors or clients ask for documents, can you find them in 5 minutes or 45 minutes? Lost time searching for rope access plans, safety certificates, and project photos costs 6.5 hours/month (78 hours/year = $3,900).",
    computer: "Personal computer folders mean lost files when employees leave, no backup, and 7.5 hours monthly searching for documents.",
    mix: "Mixing physical and digital storage means searching multiple places for every document—10 hours monthly in wasted search time."
  }
};

export default function ROICalculator() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [employeeCount, setEmployeeCount] = useState(12);
  const [answers, setAnswers] = useState<CalculatorAnswers>({
    timeTracking: null,
    projectManagement: null,
    crm: null,
    safetyCompliance: null,
    scheduling: null,
    documentStorage: null
  });
  const [showResults, setShowResults] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    totalCurrent: 0,
    monthlySavings: 0,
    annualSavings: 0,
    roi: 0,
    hoursRecovered: 0
  });
  const [landingLanguage, setLandingLanguage] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    const savedLandingLang = localStorage.getItem('landingPageLang') as 'en' | 'fr' | null;
    const lang = savedLandingLang || 'en';
    setLandingLanguage(lang);
    i18n.changeLanguage(lang);
  }, [i18n]);

  const toggleLandingLanguage = () => {
    const newLang = landingLanguage === 'en' ? 'fr' : 'en';
    setLandingLanguage(newLang);
    localStorage.setItem('landingPageLang', newLang);
    i18n.changeLanguage(newLang);
  };

  const calculateCosts = () => {
    let totalDirectCosts = 0;
    let totalHiddenCosts = 0;
    let totalHoursWasted = 0;
    const breakdown: CostBreakdown[] = [];

    if (answers.timeTracking) {
      const costs = TOOL_COSTS.timeTracking[answers.timeTracking];
      if ('perUser' in costs) {
        const cost = costs.perUser * employeeCount + costs.base;
        totalDirectCosts += cost;
        breakdown.push({ category: t('roi.categories.timeTracking'), method: t(`roi.options.timeTracking.${answers.timeTracking}`), directCost: cost, hiddenCost: 0, hoursWasted: 0 });
      } else {
        totalHiddenCosts += costs.hidden;
        totalHoursWasted += costs.hours;
        breakdown.push({ category: t('roi.categories.timeTracking'), method: t(`roi.options.timeTracking.${answers.timeTracking}`), directCost: 0, hiddenCost: costs.hidden, hoursWasted: costs.hours });
      }
    }

    if (answers.projectManagement) {
      const costs = TOOL_COSTS.projectManagement[answers.projectManagement];
      if ('perUser' in costs) {
        const cost = costs.perUser * employeeCount + costs.base;
        totalDirectCosts += cost;
        breakdown.push({ category: t('roi.categories.projectManagement'), method: t(`roi.options.projectManagement.${answers.projectManagement}`), directCost: cost, hiddenCost: 0, hoursWasted: 0 });
      } else {
        totalHiddenCosts += costs.hidden;
        totalHoursWasted += costs.hours;
        breakdown.push({ category: t('roi.categories.projectManagement'), method: t(`roi.options.projectManagement.${answers.projectManagement}`), directCost: 0, hiddenCost: costs.hidden, hoursWasted: costs.hours });
      }
    }

    if (answers.crm) {
      const costs = TOOL_COSTS.crm[answers.crm];
      if ('perUser' in costs) {
        const cost = costs.perUser * employeeCount + costs.base;
        totalDirectCosts += cost;
        breakdown.push({ category: t('roi.categories.crm'), method: t(`roi.options.crm.${answers.crm}`), directCost: cost, hiddenCost: 0, hoursWasted: 0 });
      } else {
        totalHiddenCosts += costs.hidden;
        totalHoursWasted += costs.hours;
        breakdown.push({ category: t('roi.categories.crm'), method: t(`roi.options.crm.${answers.crm}`), directCost: 0, hiddenCost: costs.hidden, hoursWasted: costs.hours });
      }
    }

    if (answers.safetyCompliance) {
      const costs = TOOL_COSTS.safetyCompliance[answers.safetyCompliance];
      if ('perUser' in costs) {
        const cost = costs.perUser * employeeCount + costs.base;
        totalDirectCosts += cost;
        breakdown.push({ category: t('roi.categories.safetyCompliance'), method: t(`roi.options.safetyCompliance.${answers.safetyCompliance}`), directCost: cost, hiddenCost: 0, hoursWasted: 0 });
      } else {
        totalHiddenCosts += costs.hidden;
        totalHoursWasted += costs.hours;
        breakdown.push({ category: t('roi.categories.safetyCompliance'), method: t(`roi.options.safetyCompliance.${answers.safetyCompliance}`), directCost: 0, hiddenCost: costs.hidden, hoursWasted: costs.hours });
      }
    }

    if (answers.scheduling) {
      const costs = TOOL_COSTS.scheduling[answers.scheduling];
      if ('perUser' in costs) {
        const cost = costs.perUser * employeeCount + costs.base;
        totalDirectCosts += cost;
        breakdown.push({ category: t('roi.categories.scheduling'), method: t(`roi.options.scheduling.${answers.scheduling}`), directCost: cost, hiddenCost: 0, hoursWasted: 0 });
      } else {
        totalHiddenCosts += costs.hidden;
        totalHoursWasted += costs.hours;
        breakdown.push({ category: t('roi.categories.scheduling'), method: t(`roi.options.scheduling.${answers.scheduling}`), directCost: 0, hiddenCost: costs.hidden, hoursWasted: costs.hours });
      }
    }

    if (answers.documentStorage) {
      const costs = TOOL_COSTS.documentStorage[answers.documentStorage];
      if ('perUser' in costs) {
        const cost = costs.perUser * employeeCount + costs.base;
        totalDirectCosts += cost;
        breakdown.push({ category: t('roi.categories.documentStorage'), method: t(`roi.options.documentStorage.${answers.documentStorage}`), directCost: cost, hiddenCost: 0, hoursWasted: 0 });
      } else {
        totalHiddenCosts += costs.hidden;
        totalHoursWasted += costs.hours;
        breakdown.push({ category: t('roi.categories.documentStorage'), method: t(`roi.options.documentStorage.${answers.documentStorage}`), directCost: 0, hiddenCost: costs.hidden, hoursWasted: costs.hours });
      }
    }

    const totalCurrentSpending = totalDirectCosts + totalHiddenCosts;
    const onropeproCost = employeeCount < 8 ? ONROPEPRO_TIER_1 : ONROPEPRO_TIER_2;
    const monthlySavings = totalCurrentSpending - onropeproCost;
    const annualSavings = monthlySavings * 12;
    const roi = onropeproCost > 0 ? Math.round((monthlySavings / onropeproCost) * 100) : 0;
    const hoursRecoveredMonthly = totalHoursWasted;
    const hoursRecoveredAnnually = hoursRecoveredMonthly * 12;
    const valueOfTimeRecovered = hoursRecoveredAnnually * 50;

    return {
      totalDirectCosts,
      totalHiddenCosts,
      totalCurrentSpending,
      onropeproCost,
      monthlySavings,
      annualSavings,
      roi,
      hoursRecoveredMonthly,
      hoursRecoveredAnnually,
      valueOfTimeRecovered,
      breakdown
    };
  };

  const costs = calculateCosts();

  useEffect(() => {
    if (showResults) {
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedValues({
          totalCurrent: Math.round(costs.totalCurrentSpending * easeOut),
          monthlySavings: Math.round(costs.monthlySavings * easeOut),
          annualSavings: Math.round(costs.annualSavings * easeOut),
          roi: Math.round(costs.roi * easeOut),
          hoursRecovered: Math.round(costs.hoursRecoveredMonthly * easeOut)
        });
        
        if (step >= steps) {
          clearInterval(timer);
          if (costs.monthlySavings > 0 && costs.annualSavings > 5000) {
            setTimeout(() => setShowEmailModal(true), 500);
          }
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [showResults, costs.totalCurrentSpending, costs.monthlySavings, costs.annualSavings, costs.roi, costs.hoursRecoveredMonthly]);

  const getCurrentAnswer = () => {
    switch (currentStep) {
      case 2: return answers.timeTracking;
      case 3: return answers.projectManagement;
      case 4: return answers.crm;
      case 5: return answers.safetyCompliance;
      case 6: return answers.scheduling;
      case 7: return answers.documentStorage;
      default: return null;
    }
  };

  const setAnswer = (value: string) => {
    switch (currentStep) {
      case 2:
        setAnswers(prev => ({ ...prev, timeTracking: value as TimeTrackingOption }));
        break;
      case 3:
        setAnswers(prev => ({ ...prev, projectManagement: value as ProjectManagementOption }));
        break;
      case 4:
        setAnswers(prev => ({ ...prev, crm: value as CRMOption }));
        break;
      case 5:
        setAnswers(prev => ({ ...prev, safetyCompliance: value as SafetyComplianceOption }));
        break;
      case 6:
        setAnswers(prev => ({ ...prev, scheduling: value as SchedulingOption }));
        break;
      case 7:
        setAnswers(prev => ({ ...prev, documentStorage: value as DocumentStorageOption }));
        break;
    }
  };

  const getRevealMessage = (): string | null => {
    const answer = getCurrentAnswer();
    if (!answer) return null;
    
    switch (currentStep) {
      case 2:
        return answer !== 'software' ? REVEAL_MESSAGES.timeTracking[answer as keyof typeof REVEAL_MESSAGES.timeTracking] : null;
      case 3:
        return answer !== 'software' ? REVEAL_MESSAGES.projectManagement[answer as keyof typeof REVEAL_MESSAGES.projectManagement] : null;
      case 4:
        return answer !== 'software' ? REVEAL_MESSAGES.crm[answer as keyof typeof REVEAL_MESSAGES.crm] : null;
      case 5:
        return answer !== 'software' ? REVEAL_MESSAGES.safetyCompliance[answer as keyof typeof REVEAL_MESSAGES.safetyCompliance] : null;
      case 6:
        return answer !== 'software' ? REVEAL_MESSAGES.scheduling[answer as keyof typeof REVEAL_MESSAGES.scheduling] : null;
      case 7:
        return answer !== 'cloud' ? REVEAL_MESSAGES.documentStorage[answer as keyof typeof REVEAL_MESSAGES.documentStorage] : null;
      default:
        return null;
    }
  };

  const canProceed = currentStep === 1 || getCurrentAnswer() !== null;

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowEmailModal(false);
  };

  const getQuestionIcon = () => {
    switch (currentStep) {
      case 1: return <Users className="w-6 h-6" />;
      case 2: return <Clock className="w-6 h-6" />;
      case 3: return <Building2 className="w-6 h-6" />;
      case 4: return <MessageSquare className="w-6 h-6" />;
      case 5: return <Shield className="w-6 h-6" />;
      case 6: return <Calendar className="w-6 h-6" />;
      case 7: return <FolderOpen className="w-6 h-6" />;
      default: return <Calculator className="w-6 h-6" />;
    }
  };

  const allSoftwareSelected = 
    answers.timeTracking === 'software' &&
    answers.projectManagement === 'software' &&
    answers.crm === 'software' &&
    answers.safetyCompliance === 'software' &&
    answers.scheduling === 'software' &&
    answers.documentStorage === 'cloud';

  const renderQuestion = () => {
    const revealMessage = getRevealMessage();
    
    if (currentStep === 1) {
      return (
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-4">
            {getQuestionIcon()}
            <h2 className="text-xl md:text-2xl font-semibold">
              {t('roi.questions.employees.title')}
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('roi.questions.employees.min')}</span>
              <span className="text-3xl font-bold text-primary">{employeeCount}</span>
              <span className="text-sm text-muted-foreground">{t('roi.questions.employees.max')}</span>
            </div>
            <Slider
              value={[employeeCount]}
              onValueChange={(value) => setEmployeeCount(value[0])}
              min={5}
              max={50}
              step={1}
              className="w-full"
              data-testid="slider-employee-count"
            />
            <p className="text-sm text-muted-foreground text-center">
              {t('roi.questions.employees.description')}
            </p>
          </div>
        </div>
      );
    }

    const questionConfig = {
      2: {
        title: t('roi.questions.timeTracking.title'),
        options: [
          { value: 'paper', label: t('roi.options.timeTracking.paper'), icon: FileText },
          { value: 'excel', label: t('roi.options.timeTracking.excel'), icon: FileText },
          { value: 'software', label: t('roi.options.timeTracking.software'), icon: Clock },
          { value: 'none', label: t('roi.options.timeTracking.none'), icon: AlertTriangle }
        ]
      },
      3: {
        title: t('roi.questions.projectManagement.title'),
        options: [
          { value: 'whiteboard', label: t('roi.options.projectManagement.whiteboard'), icon: FileText },
          { value: 'excel', label: t('roi.options.projectManagement.excel'), icon: FileText },
          { value: 'software', label: t('roi.options.projectManagement.software'), icon: Building2 },
          { value: 'texts', label: t('roi.options.projectManagement.texts'), icon: MessageSquare }
        ]
      },
      4: {
        title: t('roi.questions.crm.title'),
        options: [
          { value: 'email', label: t('roi.options.crm.email'), icon: Mail },
          { value: 'spreadsheet', label: t('roi.options.crm.spreadsheet'), icon: FileText },
          { value: 'software', label: t('roi.options.crm.software'), icon: MessageSquare },
          { value: 'memory', label: t('roi.options.crm.memory'), icon: AlertTriangle }
        ]
      },
      5: {
        title: t('roi.questions.safetyCompliance.title'),
        options: [
          { value: 'paper', label: t('roi.options.safetyCompliance.paper'), icon: FileText },
          { value: 'none', label: t('roi.options.safetyCompliance.none'), icon: AlertTriangle },
          { value: 'software', label: t('roi.options.safetyCompliance.software'), icon: Shield },
          { value: 'photos', label: t('roi.options.safetyCompliance.photos'), icon: FolderOpen }
        ]
      },
      6: {
        title: t('roi.questions.scheduling.title'),
        options: [
          { value: 'calls', label: t('roi.options.scheduling.calls'), icon: MessageSquare },
          { value: 'excel', label: t('roi.options.scheduling.excel'), icon: FileText },
          { value: 'software', label: t('roi.options.scheduling.software'), icon: Calendar },
          { value: 'verbal', label: t('roi.options.scheduling.verbal'), icon: AlertTriangle }
        ]
      },
      7: {
        title: t('roi.questions.documentStorage.title'),
        options: [
          { value: 'filing', label: t('roi.options.documentStorage.filing'), icon: FolderOpen },
          { value: 'computer', label: t('roi.options.documentStorage.computer'), icon: FileText },
          { value: 'cloud', label: t('roi.options.documentStorage.cloud'), icon: FolderOpen },
          { value: 'mix', label: t('roi.options.documentStorage.mix'), icon: AlertTriangle }
        ]
      }
    };

    const config = questionConfig[currentStep as keyof typeof questionConfig];
    const currentAnswer = getCurrentAnswer();

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          {getQuestionIcon()}
          <h2 className="text-lg md:text-xl font-semibold">
            {config.title}
          </h2>
        </div>

        <RadioGroup
          value={currentAnswer || ""}
          onValueChange={setAnswer}
          className="grid grid-cols-1 gap-3"
        >
          {config.options.map((option) => {
            const Icon = option.icon;
            return (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-all ${
                  currentAnswer === option.value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} data-testid={`radio-${option.value}`} />
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1">{option.label}</span>
              </Label>
            );
          })}
        </RadioGroup>

        {revealMessage && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-md animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {revealMessage}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResults = () => {
    const isNegativeOrZeroSavings = costs.monthlySavings <= 0;
    
    return (
      <div className="space-y-8">
        {isNegativeOrZeroSavings ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold">
              {t('roi.results.alreadyOptimized')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {allSoftwareSelected 
                ? t('roi.results.consolidateMessage', { cost: costs.totalDirectCosts, onropeCost: costs.onropeproCost })
                : t('roi.results.currentSetupGood')}
            </p>
            {allSoftwareSelected && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  {t('roi.results.consolidateBenefits')}
                </p>
                <ul className="text-sm text-left max-w-md mx-auto space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {t('roi.results.benefits.singleLogin')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {t('roi.results.benefits.integratedData')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {t('roi.results.benefits.ropeAccessSpecific')}
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <p className="text-muted-foreground uppercase tracking-wide text-sm">
                {t('roi.results.wastingTitle')}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-red-500">
                ${animatedValues.totalCurrent.toLocaleString()}{t('roi.results.perMonth')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                    {t('roi.results.currentCosts')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{t('roi.results.directToolCosts')}</span>
                    <span className="font-semibold">${costs.totalDirectCosts.toLocaleString()}/mo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('roi.results.hiddenAdminWaste')}</span>
                    <span className="font-semibold">${costs.totalHiddenCosts.toLocaleString()}/mo</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>{t('roi.results.total')}</span>
                    <span className="text-red-600 dark:text-red-400">${costs.totalCurrentSpending.toLocaleString()}/mo</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/10 border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">
                    OnRopePro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    ${costs.onropeproCost}/mo
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {employeeCount < 8 ? t('roi.results.tier1') : t('roi.results.tier2')}
                  </p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>{t('roi.results.includes.timeTracking')}</li>
                    <li>{t('roi.results.includes.projectManagement')}</li>
                    <li>{t('roi.results.includes.crm')}</li>
                    <li>{t('roi.results.includes.safetyCompliance')}</li>
                    <li>{t('roi.results.includes.scheduling')}</li>
                    <li>{t('roi.results.includes.documentStorage')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-green-500/10 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                    {t('roi.results.yourSavings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{t('roi.results.monthly')}</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${animatedValues.monthlySavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('roi.results.annually')}</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${animatedValues.annualSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ROI</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {animatedValues.roi}%
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-sm">
                    <span>{t('roi.results.timeRecovered')}</span>
                    <span className="font-semibold">{animatedValues.hoursRecovered} hrs/mo</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <Collapsible open={breakdownOpen} onOpenChange={setBreakdownOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between" data-testid="button-show-breakdown">
              {t('roi.results.showBreakdown')}
              {breakdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {costs.breakdown.map((item, index) => (
                    <div key={index} className="flex flex-wrap items-center justify-between gap-2 py-2 border-b last:border-0">
                      <div className="flex-1 min-w-[200px]">
                        <p className="font-medium text-sm">{item.category}</p>
                        <p className="text-xs text-muted-foreground">{item.method}</p>
                      </div>
                      <div className="flex gap-4 text-sm">
                        {item.directCost > 0 && (
                          <span className="text-blue-600">${item.directCost}/mo</span>
                        )}
                        {item.hiddenCost > 0 && (
                          <span className="text-red-500">${item.hiddenCost}/mo hidden</span>
                        )}
                        {item.hoursWasted > 0 && (
                          <span className="text-amber-600">{item.hoursWasted} hrs/mo</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" onClick={() => setLocation("/pricing")} data-testid="button-start-trial">
            <TrendingUp className="w-5 h-5 mr-2" />
            {t('roi.results.startFreeTrial')}
          </Button>
          <Button variant="outline" size="lg" onClick={() => setShowEmailModal(true)} data-testid="button-email-analysis">
            <Mail className="w-5 h-5 mr-2" />
            {t('roi.results.emailAnalysis')}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
          <img src={ropeAccessProLogo} alt="OnRopePro" className="w-7 h-7 object-contain" />
          <span className="font-bold text-lg">OnRopePro</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            size="sm"
            onClick={toggleLandingLanguage}
            className="gap-1.5"
            data-testid="button-language-toggle"
          >
            <Globe className="w-4 h-4" />
            {landingLanguage === 'en' ? 'FR' : 'EN'}
          </Button>
          <Button variant="ghost" onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('roi.header.backToHome')}
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t('roi.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('roi.subtitle')}
            </p>
          </div>

          {!showResults && (
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>{t('roi.progress.step', { current: currentStep, total: 7 })}</span>
                <span>{Math.round((currentStep / 7) * 100)}%</span>
              </div>
              <Progress value={(currentStep / 7) * 100} className="h-2" />
            </div>
          )}

          <Card className="p-6 md:p-8">
            <CardContent className="p-0">
              {showResults ? renderResults() : renderQuestion()}

              {!showResults && (
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    data-testid="button-previous"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('roi.navigation.previous')}
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={!canProceed}
                    data-testid="button-next"
                  >
                    {currentStep === 7 ? t('roi.navigation.seeResults') : t('roi.navigation.next')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {showResults && (
                <div className="flex justify-center mt-6">
                  <Button variant="ghost" onClick={handleBack} data-testid="button-back-questions">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('roi.navigation.backToQuestions')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {!showResults && costs.totalCurrentSpending > 0 && (
            <Card className="mt-4 p-4 bg-muted/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('roi.preview.currentWaste')}</span>
                <span className="font-semibold text-red-500">
                  ${costs.totalCurrentSpending.toLocaleString()}/mo
                </span>
              </div>
              {costs.monthlySavings > 0 && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">{t('roi.preview.potentialSavings')}</span>
                  <span className="font-semibold text-green-500">
                    ${costs.monthlySavings.toLocaleString()}/mo
                  </span>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>

      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              {t('roi.email.title', { savings: costs.annualSavings.toLocaleString() })}
            </DialogTitle>
            <DialogDescription>
              {t('roi.email.description')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('roi.email.label')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('roi.email.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="button-send-analysis">
              <Mail className="w-4 h-4 mr-2" />
              {t('roi.email.submit')}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {t('roi.email.disclaimer')}
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
