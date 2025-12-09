import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Building,
  Eye,
  EyeOff,
  Shield,
  CalendarDays,
  Award,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  FileText,
  Lock,
  Star,
  Gift,
  Save
} from "lucide-react";
import { format } from "date-fns";
import type { JobPosting, User, JobApplication } from "@shared/schema";

type ApplicationWithJob = JobApplication & { jobPosting: JobPosting };
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

type Language = 'en' | 'fr';

const translations = {
  en: {
    title: "Job Board",
    subtitle: "Browse opportunities and manage your visibility",
    backToPortal: "Back to Portal",
    activeJobs: "Active Opportunities",
    noJobsTitle: "No Active Jobs",
    noJobsDesc: "There are no job postings available at the moment. Check back later!",
    loading: "Loading job postings...",
    visibilitySettings: "Employer Visibility",
    visibilityDesc: "Control whether employers can see your profile when browsing candidates",
    visibleToEmployers: "Visible to Employers",
    hiddenFromEmployers: "Hidden from Employers",
    visibilityEnabled: "Your profile is visible to employers on the job board",
    visibilityDisabled: "Your profile is hidden from employers",
    enabledSince: "Visible since",
    whatEmployersSee: "What employers can see:",
    visibleFields: [
      "Your name and photo",
      "IRATA/SPRAT certification levels",
      "Years of experience",
      "Uploaded resume/CV documents",
      "Your safety rating",
      "Certification expiration dates"
    ],
    viewDetails: "View Details",
    jobDetails: "Job Details",
    description: "Description",
    requirements: "Requirements",
    benefits: "Benefits",
    salary: "Salary",
    location: "Location",
    remote: "Remote",
    onSite: "On-site",
    postedBy: "Posted by",
    expiresOn: "Posting expires",
    startsOn: "Start date",
    schedule: "Work Schedule",
    experience: "Experience Required",
    certifications: "Required Certifications",
    fullTime: "Full-time",
    partTime: "Part-time",
    contract: "Contract",
    temporary: "Temporary",
    permanent: "Permanent",
    seasonal: "Seasonal",
    hourly: "per hour",
    daily: "per day",
    weekly: "per week",
    monthly: "per month",
    annually: "per year",
    irataLevel: "IRATA Level",
    spratLevel: "SPRAT Level",
    close: "Close",
    apply: "Express Interest",
    confirmVisibility: "Enable Visibility?",
    confirmVisibilityDesc: "Once enabled, employers will be able to see your profile information including your name, certifications, experience, and resume.",
    enableVisibility: "Enable Visibility",
    cancel: "Cancel",
    visibilityUpdated: "Visibility Updated",
    visibilityNowEnabled: "Your profile is now visible to employers",
    visibilityNowDisabled: "Your profile is now hidden from employers",
    updateFailed: "Failed to update visibility",
    mondayFriday: "Monday to Friday",
    mondaySaturday: "Monday to Saturday", 
    flexible: "Flexible Schedule",
    rotatingShifts: "Rotating Shifts",
    weekendsOnly: "Weekends Only",
    onCall: "On Call",
    entryLevel: "Entry Level",
    oneToTwo: "1-2 years",
    threeToFive: "3-5 years",
    fivePlus: "5+ years",
    tenPlus: "10+ years",
    applied: "Applied",
    applyNow: "Apply Now",
    withdrawApplication: "Withdraw",
    applicationSubmitted: "Application Submitted",
    applicationSubmittedDesc: "Your interest has been noted. The employer will review your profile.",
    applicationWithdrawn: "Application Withdrawn",
    applicationWithdrawnDesc: "Your application has been removed.",
    applyFailed: "Failed to submit application",
    withdrawFailed: "Failed to withdraw application",
    myApplications: "My Applications & Offers",
    noApplications: "No applications or offers yet",
    applicationStatus: "Status",
    statusApplied: "Applied",
    statusReviewing: "Under Review",
    statusInterviewed: "Interviewed",
    statusOffered: "Job Offer Received",
    statusHired: "Hired",
    statusRejected: "Not Selected",
    jobOfferReceived: "You received a job offer!",
    receivedOn: "Received",
    plusRequired: "PLUS Required",
    plusRequiredDesc: "Job browsing is a PLUS feature. Refer a technician to unlock!",
    unlockWithReferral: "Unlock with Referral",
    referFriend: "Refer a Friend",
    plusBenefits: "PLUS Benefits",
    plusBenefitsList: [
      "Browse job opportunities",
      "Be visible to employers",
      "Upload resume/CV",
      "Export work history",
      "30-day license expiry alerts"
    ],
    yourReferralCode: "Your Referral Code",
    shareCode: "Share this code with fellow technicians",
    copyCode: "Copy Code",
    codeCopied: "Code copied!",
    // Location Filters
    filterByLocation: "Filter by Location",
    country: "Country",
    provinceState: "Province/State",
    city: "City",
    allCountries: "All Countries",
    allProvinces: "All Provinces/States",
    allCities: "All Cities",
    clearFilters: "Clear Filters",
    showingResults: "Showing",
    of: "of",
    jobs: "jobs",
    // Expected Salary
    expectedSalary: "Expected Salary",
    expectedSalaryDesc: "Set your salary expectations (visible to employers)",
    minimumSalary: "Minimum",
    maximumSalary: "Maximum",
    salaryPeriod: "Period",
    selectPeriod: "Select period",
    saveSalary: "Save",
    salaryUpdated: "Salary expectations updated",
    salaryUpdateFailed: "Failed to update salary expectations",
    notSet: "Not set",
    perHour: "Per hour",
    perDay: "Per day",
    perWeek: "Per week",
    perMonth: "Per month",
    perYear: "Per year",
  },
  fr: {
    title: "Offres d'emploi",
    subtitle: "Parcourir les opportunites et gerer votre visibilite",
    backToPortal: "Retour au portail",
    activeJobs: "Opportunites actives",
    noJobsTitle: "Aucune offre active",
    noJobsDesc: "Il n'y a pas d'offres d'emploi disponibles pour le moment. Revenez plus tard!",
    loading: "Chargement des offres...",
    visibilitySettings: "Visibilite employeur",
    visibilityDesc: "Controlez si les employeurs peuvent voir votre profil",
    visibleToEmployers: "Visible aux employeurs",
    hiddenFromEmployers: "Cache des employeurs",
    visibilityEnabled: "Votre profil est visible par les employeurs sur le tableau d'emploi",
    visibilityDisabled: "Votre profil est cache des employeurs",
    enabledSince: "Visible depuis",
    whatEmployersSee: "Ce que les employeurs peuvent voir:",
    visibleFields: [
      "Votre nom et photo",
      "Niveaux de certification IRATA/SPRAT",
      "Annees d'experience",
      "Documents CV/resume telecharges",
      "Votre cote de securite",
      "Dates d'expiration des certifications"
    ],
    viewDetails: "Voir les details",
    jobDetails: "Details de l'emploi",
    description: "Description",
    requirements: "Exigences",
    benefits: "Avantages",
    salary: "Salaire",
    location: "Lieu",
    remote: "A distance",
    onSite: "Sur place",
    postedBy: "Publie par",
    expiresOn: "Expire le",
    startsOn: "Date de debut",
    schedule: "Horaire de travail",
    experience: "Experience requise",
    certifications: "Certifications requises",
    fullTime: "Temps plein",
    partTime: "Temps partiel",
    contract: "Contrat",
    temporary: "Temporaire",
    permanent: "Permanent",
    seasonal: "Saisonnier",
    hourly: "par heure",
    daily: "par jour",
    weekly: "par semaine",
    monthly: "par mois",
    annually: "par an",
    irataLevel: "Niveau IRATA",
    spratLevel: "Niveau SPRAT",
    close: "Fermer",
    apply: "Manifester son interet",
    confirmVisibility: "Activer la visibilite?",
    confirmVisibilityDesc: "Une fois active, les employeurs pourront voir les informations de votre profil, y compris votre nom, vos certifications, votre experience et votre CV.",
    enableVisibility: "Activer la visibilite",
    cancel: "Annuler",
    visibilityUpdated: "Visibilite mise a jour",
    visibilityNowEnabled: "Votre profil est maintenant visible par les employeurs",
    visibilityNowDisabled: "Votre profil est maintenant cache des employeurs",
    updateFailed: "Echec de la mise a jour de la visibilite",
    mondayFriday: "Lundi au vendredi",
    mondaySaturday: "Lundi au samedi",
    flexible: "Horaire flexible",
    rotatingShifts: "Quarts rotatifs",
    weekendsOnly: "Fins de semaine seulement",
    onCall: "Sur appel",
    entryLevel: "Niveau d'entree",
    oneToTwo: "1-2 ans",
    threeToFive: "3-5 ans",
    fivePlus: "5+ ans",
    tenPlus: "10+ ans",
    applied: "Postule",
    applyNow: "Postuler",
    withdrawApplication: "Retirer",
    applicationSubmitted: "Candidature soumise",
    applicationSubmittedDesc: "Votre interet a ete note. L'employeur examinera votre profil.",
    applicationWithdrawn: "Candidature retiree",
    applicationWithdrawnDesc: "Votre candidature a ete supprimee.",
    applyFailed: "Echec de la soumission",
    withdrawFailed: "Echec du retrait",
    myApplications: "Mes candidatures et offres",
    noApplications: "Aucune candidature ou offre pour le moment",
    applicationStatus: "Statut",
    statusApplied: "Postule",
    statusReviewing: "En cours d'examen",
    statusInterviewed: "Entrevue",
    statusOffered: "Offre d'emploi recue",
    statusHired: "Embauche",
    statusRejected: "Non selectionne",
    jobOfferReceived: "Vous avez recu une offre d'emploi!",
    receivedOn: "Recu le",
    plusRequired: "PLUS Requis",
    plusRequiredDesc: "La navigation d'emploi est une fonctionnalite PLUS. Referez un technicien pour debloquer!",
    unlockWithReferral: "Debloquer avec une reference",
    referFriend: "Referer un ami",
    plusBenefits: "Avantages PLUS",
    plusBenefitsList: [
      "Parcourir les opportunites d'emploi",
      "Etre visible par les employeurs",
      "Telecharger CV/resume",
      "Exporter l'historique de travail",
      "Alertes d'expiration de licence 30 jours"
    ],
    yourReferralCode: "Votre code de reference",
    shareCode: "Partagez ce code avec d'autres techniciens",
    copyCode: "Copier le code",
    codeCopied: "Code copie!",
    // Location Filters
    filterByLocation: "Filtrer par lieu",
    country: "Pays",
    provinceState: "Province/Etat",
    city: "Ville",
    allCountries: "Tous les pays",
    allProvinces: "Toutes les provinces",
    allCities: "Toutes les villes",
    clearFilters: "Effacer les filtres",
    showingResults: "Affichage de",
    of: "sur",
    jobs: "emplois",
    // Expected Salary
    expectedSalary: "Salaire attendu",
    expectedSalaryDesc: "Definir vos attentes salariales (visible par les employeurs)",
    minimumSalary: "Minimum",
    maximumSalary: "Maximum",
    salaryPeriod: "Periode",
    selectPeriod: "Selectionner la periode",
    saveSalary: "Sauvegarder",
    salaryUpdated: "Attentes salariales mises a jour",
    salaryUpdateFailed: "Echec de la mise a jour des attentes salariales",
    notSet: "Non defini",
    perHour: "Par heure",
    perDay: "Par jour",
    perWeek: "Par semaine",
    perMonth: "Par mois",
    perYear: "Par an",
  }
};

export default function TechnicianJobBoard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>(() => {
    // Use same localStorage key as TechnicianPortal for consistency
    const saved = localStorage.getItem("techPortalLanguage");
    return (saved === "fr" ? "fr" : "en") as Language;
  });
  const t = translations[language];

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showConfirmVisibility, setShowConfirmVisibility] = useState(false);
  
  // Location filters
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [filterProvince, setFilterProvince] = useState<string>("");
  const [filterCity, setFilterCity] = useState<string>("");
  
  // Expected salary state
  const [expectedSalaryMin, setExpectedSalaryMin] = useState<string>("");
  const [expectedSalaryMax, setExpectedSalaryMax] = useState<string>("");
  const [expectedSalaryPeriod, setExpectedSalaryPeriod] = useState<string>("");

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery<{ jobPostings: JobPosting[] }>({
    queryKey: ["/api/job-postings/public"],
  });

  const { data: applicationsData } = useQuery<{ applications: ApplicationWithJob[] }>({
    queryKey: ["/api/job-applications/my"],
  });

  const user = userData?.user;
  const allJobs = jobsData?.jobPostings || [];
  const myApplications = applicationsData?.applications || [];
  
  // Extract unique countries, provinces, and cities from jobs for filter options
  const uniqueCountries = [...new Set(allJobs.map(j => j.jobCountry).filter(Boolean))] as string[];
  const uniqueProvinces = [...new Set(allJobs.filter(j => !filterCountry || j.jobCountry === filterCountry).map(j => j.jobProvinceState).filter(Boolean))] as string[];
  const uniqueCities = [...new Set(allJobs.filter(j => (!filterCountry || j.jobCountry === filterCountry) && (!filterProvince || j.jobProvinceState === filterProvince)).map(j => j.jobCity).filter(Boolean))] as string[];
  
  // Filter jobs based on selected filters
  const jobs = allJobs.filter(job => {
    if (filterCountry && job.jobCountry !== filterCountry) return false;
    if (filterProvince && job.jobProvinceState !== filterProvince) return false;
    if (filterCity && job.jobCity !== filterCity) return false;
    return true;
  });
  
  const hasActiveFilters = filterCountry || filterProvince || filterCity;
  
  const clearFilters = () => {
    setFilterCountry("");
    setFilterProvince("");
    setFilterCity("");
  };

  const hasApplied = (jobId: string) => {
    return myApplications.some(app => app.jobPostingId === jobId);
  };

  const getApplication = (jobId: string) => {
    return myApplications.find(app => app.jobPostingId === jobId);
  };

  const applyMutation = useMutation({
    mutationFn: async (jobPostingId: string) => {
      return apiRequest("POST", "/api/job-applications", { jobPostingId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications/my"] });
      toast({
        title: t.applicationSubmitted,
        description: t.applicationSubmittedDesc,
      });
    },
    onError: () => {
      toast({
        title: t.applyFailed,
        variant: "destructive",
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      return apiRequest("DELETE", `/api/job-applications/${applicationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications/my"] });
      toast({
        title: t.applicationWithdrawn,
        description: t.applicationWithdrawnDesc,
      });
    },
    onError: () => {
      toast({
        title: t.withdrawFailed,
        variant: "destructive",
      });
    },
  });

  const visibilityMutation = useMutation({
    mutationFn: async (isVisible: boolean) => {
      return apiRequest("PATCH", "/api/technician/visibility", { isVisible });
    },
    onSuccess: (_, isVisible) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t.visibilityUpdated,
        description: isVisible ? t.visibilityNowEnabled : t.visibilityNowDisabled,
      });
      setShowConfirmVisibility(false);
    },
    onError: (error: any) => {
      toast({
        title: t.updateFailed,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVisibilityToggle = (checked: boolean) => {
    if (checked) {
      setShowConfirmVisibility(true);
    } else {
      visibilityMutation.mutate(false);
    }
  };

  // Initialize expected salary from user data
  const initializeExpectedSalary = () => {
    if (user) {
      setExpectedSalaryMin((user as any).expectedSalaryMin || "");
      setExpectedSalaryMax((user as any).expectedSalaryMax || "");
      setExpectedSalaryPeriod((user as any).expectedSalaryPeriod || "");
    }
  };
  
  // Initialize on first load
  if (user && !expectedSalaryMin && !expectedSalaryMax && !expectedSalaryPeriod) {
    if ((user as any).expectedSalaryMin || (user as any).expectedSalaryMax || (user as any).expectedSalaryPeriod) {
      initializeExpectedSalary();
    }
  }

  const salaryMutation = useMutation({
    mutationFn: async (data: { minSalary: string; maxSalary: string; salaryPeriod: string }) => {
      return apiRequest("PATCH", "/api/technician/expected-salary", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t.salaryUpdated,
      });
    },
    onError: () => {
      toast({
        title: t.salaryUpdateFailed,
        variant: "destructive",
      });
    },
  });

  const handleSaveSalary = () => {
    salaryMutation.mutate({
      minSalary: expectedSalaryMin,
      maxSalary: expectedSalaryMax,
      salaryPeriod: expectedSalaryPeriod,
    });
  };

  const getJobTypeBadge = (jobType: string) => {
    const labels: Record<string, { en: string; fr: string }> = {
      full_time: { en: "Full-time", fr: "Temps plein" },
      part_time: { en: "Part-time", fr: "Temps partiel" },
      contract: { en: "Contract", fr: "Contrat" },
      temporary: { en: "Temporary", fr: "Temporaire" },
    };
    return labels[jobType]?.[language] || jobType;
  };

  const getWorkDaysLabel = (workDays: string | null) => {
    if (!workDays) return null;
    const labels: Record<string, string> = {
      monday_friday: t.mondayFriday,
      monday_saturday: t.mondaySaturday,
      flexible: t.flexible,
      rotating_shifts: t.rotatingShifts,
      weekends_only: t.weekendsOnly,
      on_call: t.onCall,
    };
    return labels[workDays] || workDays;
  };

  const getExperienceLabel = (exp: string | null) => {
    if (!exp) return null;
    const labels: Record<string, string> = {
      entry_level: t.entryLevel,
      "1_2_years": t.oneToTwo,
      "3_5_years": t.threeToFive,
      "5_plus_years": t.fivePlus,
      "10_plus_years": t.tenPlus,
    };
    return labels[exp] || exp;
  };

  const getSalaryPeriodLabel = (period: string | null) => {
    if (!period) return "";
    const labels: Record<string, string> = {
      hourly: t.hourly,
      daily: t.daily,
      weekly: t.weekly,
      monthly: t.monthly,
      annually: t.annually,
    };
    return labels[period] || period;
  };

  const formatSalary = (min: string | null, max: string | null, period: string | null) => {
    if (!min && !max) return null;
    const periodLabel = getSalaryPeriodLabel(period);
    if (min && max) {
      return `$${min} - $${max} ${periodLabel}`;
    }
    return `$${min || max} ${periodLabel}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={onRopeProLogo} 
              alt="OnRopePro" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-lg font-bold">{t.title}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newLang = language === "en" ? "fr" : "en";
                setLanguage(newLang);
                localStorage.setItem("techPortalLanguage", newLang);
              }}
              data-testid="button-toggle-language"
            >
              {language === "en" ? "FR" : "EN"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/technician-portal")}
              className="gap-1.5"
              data-testid="button-back-to-portal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.backToPortal}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* PLUS Required Gate */}
        {user && !(user as any).hasPlusAccess && (
          <Card className="border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-transparent">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-amber-500/20">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    {t.plusRequired}
                  </h2>
                  <p className="text-muted-foreground mt-1">{t.plusRequiredDesc}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 w-full max-w-md">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-primary" />
                    {t.plusBenefits}
                  </h3>
                  <ul className="text-sm text-left space-y-2">
                    {t.plusBenefitsList.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {user?.referralCode && (
                  <div className="bg-card border rounded-lg p-4 w-full max-w-md">
                    <h4 className="font-medium mb-2">{t.yourReferralCode}</h4>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-muted px-3 py-2 rounded font-mono text-lg tracking-wider">
                        {user.referralCode}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(user.referralCode || "");
                          toast({ title: t.codeCopied });
                        }}
                        data-testid="button-copy-referral-code"
                      >
                        {t.copyCode}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{t.shareCode}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main content - only shown for PLUS users */}
        {(user as any)?.hasPlusAccess && (
          <>
        {/* Visibility Settings Card */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                {user?.isVisibleToEmployers ? (
                  <Eye className="w-5 h-5 text-primary" />
                ) : (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{t.visibilitySettings}</CardTitle>
                <CardDescription>{t.visibilityDesc}</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="visibility-toggle" className="text-sm font-medium">
                  {user?.isVisibleToEmployers ? t.visibleToEmployers : t.hiddenFromEmployers}
                </Label>
                <Switch
                  id="visibility-toggle"
                  checked={user?.isVisibleToEmployers || false}
                  onCheckedChange={handleVisibilityToggle}
                  disabled={visibilityMutation.isPending}
                  data-testid="switch-visibility"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {user?.isVisibleToEmployers ? (
              <div className="space-y-3">
                <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/30">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertTitle className="text-green-700 dark:text-green-400">{t.visibleToEmployers}</AlertTitle>
                  <AlertDescription className="text-green-600 dark:text-green-300">
                    {t.visibilityEnabled}
                    {user.visibilityEnabledAt && (
                      <span className="block mt-1 text-sm">
                        {t.enabledSince}: {format(new Date(user.visibilityEnabledAt), "PPP")}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
                <div className="pt-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">{t.whatEmployersSee}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {t.visibleFields.map((field, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Alert>
                <EyeOff className="w-4 h-4" />
                <AlertTitle>{t.hiddenFromEmployers}</AlertTitle>
                <AlertDescription>{t.visibilityDisabled}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Expected Salary Card - Only show when visibility is enabled */}
        {user?.isVisibleToEmployers && (
          <Card className="border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                {t.expectedSalary}
              </CardTitle>
              <CardDescription>{t.expectedSalaryDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t.minimumSalary}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={expectedSalaryMin}
                    onChange={(e) => setExpectedSalaryMin(e.target.value)}
                    data-testid="input-salary-min"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.maximumSalary}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={expectedSalaryMax}
                    onChange={(e) => setExpectedSalaryMax(e.target.value)}
                    data-testid="input-salary-max"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.salaryPeriod}</Label>
                  <Select value={expectedSalaryPeriod} onValueChange={setExpectedSalaryPeriod}>
                    <SelectTrigger data-testid="select-salary-period">
                      <SelectValue placeholder={t.selectPeriod} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">{t.perHour}</SelectItem>
                      <SelectItem value="daily">{t.perDay}</SelectItem>
                      <SelectItem value="weekly">{t.perWeek}</SelectItem>
                      <SelectItem value="monthly">{t.perMonth}</SelectItem>
                      <SelectItem value="yearly">{t.perYear}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleSaveSalary}
                  disabled={salaryMutation.isPending}
                  data-testid="button-save-salary"
                >
                  {salaryMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t.saveSalary}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* My Applications & Offers Section */}
        {myApplications.length > 0 && (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {t.myApplications}
                <Badge variant="secondary">{myApplications.length}</Badge>
              </h2>

              <div className="grid gap-3">
                {myApplications.map((app) => {
                  const isOffer = app.status === "offered";
                  const statusLabel = {
                    applied: t.statusApplied,
                    reviewing: t.statusReviewing,
                    interviewed: t.statusInterviewed,
                    offered: t.statusOffered,
                    hired: t.statusHired,
                    rejected: t.statusRejected,
                  }[app.status] || app.status;

                  const statusVariant = {
                    applied: "secondary" as const,
                    reviewing: "secondary" as const,
                    interviewed: "secondary" as const,
                    offered: "default" as const,
                    hired: "default" as const,
                    rejected: "destructive" as const,
                  }[app.status] || "secondary" as const;

                  return (
                    <Card 
                      key={app.id}
                      className={`${isOffer ? "border-primary bg-primary/5" : ""} hover-elevate cursor-pointer`}
                      onClick={() => app.jobPosting && setSelectedJob(app.jobPosting)}
                      data-testid={`card-application-${app.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              {isOffer && (
                                <Badge className="bg-primary text-primary-foreground">
                                  {t.jobOfferReceived}
                                </Badge>
                              )}
                              <h3 className="font-semibold">
                                {app.jobPosting?.title || "Unknown Job"}
                              </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant={statusVariant}>{statusLabel}</Badge>
                              {app.jobPosting?.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {app.jobPosting.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {t.receivedOn} {format(new Date(app.appliedAt), "MMM d, yyyy")}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1">
                            {t.viewDetails}
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Location Filters */}
        <Card className="border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t.filterByLocation}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="filter-country" className="text-xs text-muted-foreground">{t.country}</Label>
                <select
                  id="filter-country"
                  value={filterCountry}
                  onChange={(e) => {
                    setFilterCountry(e.target.value);
                    setFilterProvince("");
                    setFilterCity("");
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  data-testid="select-filter-country"
                >
                  <option value="">{t.allCountries}</option>
                  {uniqueCountries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="filter-province" className="text-xs text-muted-foreground">{t.provinceState}</Label>
                <select
                  id="filter-province"
                  value={filterProvince}
                  onChange={(e) => {
                    setFilterProvince(e.target.value);
                    setFilterCity("");
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  data-testid="select-filter-province"
                >
                  <option value="">{t.allProvinces}</option>
                  {uniqueProvinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="filter-city" className="text-xs text-muted-foreground">{t.city}</Label>
                <select
                  id="filter-city"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  data-testid="select-filter-city"
                >
                  <option value="">{t.allCities}</option>
                  {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-sm text-muted-foreground">
                  {t.showingResults} {jobs.length} {t.of} {allJobs.length} {t.jobs}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                >
                  {t.clearFilters}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            {t.activeJobs}
            {jobs.length > 0 && (
              <Badge variant="secondary">{jobs.length}</Badge>
            )}
          </h2>

          {jobsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">{t.loading}</span>
            </div>
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold text-lg">{t.noJobsTitle}</h3>
                <p className="text-muted-foreground mt-1">{t.noJobsDesc}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="hover-elevate cursor-pointer transition-all"
                  onClick={() => setSelectedJob(job)}
                  data-testid={`card-job-${job.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Building className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg" data-testid={`text-job-title-${job.id}`}>
                              {job.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {job.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge variant="secondary">{getJobTypeBadge(job.jobType)}</Badge>
                          {job.isRemote && (
                            <Badge variant="outline" className="border-blue-500 text-blue-600">
                              {t.remote}
                            </Badge>
                          )}
                          {job.location && (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                          )}
                          {(job.salaryMin || job.salaryMax) && (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <DollarSign className="w-3 h-3" />
                              {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}
                            </span>
                          )}
                        </div>

                        {(job.requiredIrataLevel || job.requiredSpratLevel) && (
                          <div className="flex items-center gap-2 mt-2">
                            <Award className="w-4 h-4 text-amber-500" />
                            {job.requiredIrataLevel && (
                              <Badge variant="outline" className="border-amber-500 text-amber-600">
                                IRATA {job.requiredIrataLevel}
                              </Badge>
                            )}
                            {job.requiredSpratLevel && (
                              <Badge variant="outline" className="border-purple-500 text-purple-600">
                                SPRAT {job.requiredSpratLevel}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="shrink-0"
                        data-testid={`button-view-job-${job.id}`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </main>

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Building className="w-6 h-6 text-primary" />
              {selectedJob?.title}
            </DialogTitle>
            <DialogDescription>
              {t.jobDetails}
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{getJobTypeBadge(selectedJob.jobType)}</Badge>
                {selectedJob.employmentType && (
                  <Badge variant="outline">
                    {selectedJob.employmentType === "permanent" ? t.permanent : 
                     selectedJob.employmentType === "seasonal" ? t.seasonal : 
                     selectedJob.employmentType}
                  </Badge>
                )}
                {selectedJob.isRemote ? (
                  <Badge variant="outline" className="border-blue-500 text-blue-600">{t.remote}</Badge>
                ) : (
                  <Badge variant="outline">{t.onSite}</Badge>
                )}
              </div>

              <div className="grid gap-4">
                {selectedJob.description && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {t.description}
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>
                )}

                {selectedJob.requirements && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {t.requirements}
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.requirements}</p>
                  </div>
                )}

                {selectedJob.benefits && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {t.benefits}
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.benefits}</p>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedJob.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedJob.location}</span>
                    </div>
                  )}
                  {(selectedJob.salaryMin || selectedJob.salaryMax) && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryPeriod)}</span>
                    </div>
                  )}
                  {selectedJob.workDays && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <span>{t.schedule}: {getWorkDaysLabel(selectedJob.workDays)}</span>
                    </div>
                  )}
                  {selectedJob.experienceRequired && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{t.experience}: {getExperienceLabel(selectedJob.experienceRequired)}</span>
                    </div>
                  )}
                  {selectedJob.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{t.startsOn}: {format(new Date(selectedJob.startDate), "PPP")}</span>
                    </div>
                  )}
                  {selectedJob.expiresAt && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      <span>{t.expiresOn}: {format(new Date(selectedJob.expiresAt), "PPP")}</span>
                    </div>
                  )}
                </div>

                {(selectedJob.requiredIrataLevel || selectedJob.requiredSpratLevel) && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {t.certifications}
                    </h4>
                    <div className="flex gap-2">
                      {selectedJob.requiredIrataLevel && (
                        <Badge variant="outline" className="border-amber-500 text-amber-600">
                          {t.irataLevel} {selectedJob.requiredIrataLevel}
                        </Badge>
                      )}
                      {selectedJob.requiredSpratLevel && (
                        <Badge variant="outline" className="border-purple-500 text-purple-600">
                          {t.spratLevel} {selectedJob.requiredSpratLevel}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSelectedJob(null)} data-testid="button-close-job-details">
              {t.close}
            </Button>
            {selectedJob && hasApplied(selectedJob.id) ? (
              <Button 
                variant="secondary"
                onClick={() => {
                  const app = getApplication(selectedJob.id);
                  if (app) withdrawMutation.mutate(app.id);
                }}
                disabled={withdrawMutation.isPending}
                data-testid="button-withdraw-application"
              >
                {withdrawMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {t.applied}
              </Button>
            ) : (
              <Button 
                onClick={() => selectedJob && applyMutation.mutate(selectedJob.id)}
                disabled={applyMutation.isPending}
                data-testid="button-apply-job"
              >
                {applyMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t.applyNow}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Visibility Dialog */}
      <Dialog open={showConfirmVisibility} onOpenChange={setShowConfirmVisibility}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              {t.confirmVisibility}
            </DialogTitle>
            <DialogDescription>{t.confirmVisibilityDesc}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">{t.whatEmployersSee}</p>
            <ul className="space-y-1">
              {t.visibleFields.map((field, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmVisibility(false)} data-testid="button-cancel-visibility">
              {t.cancel}
            </Button>
            <Button 
              onClick={() => visibilityMutation.mutate(true)} 
              disabled={visibilityMutation.isPending}
              data-testid="button-confirm-visibility"
            >
              {visibilityMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t.enableVisibility}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
