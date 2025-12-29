import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  Save,
  X,
  Trash2,
  Menu,
  LogOut,
  Crown
} from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { getTechnicianNavGroups } from "@/lib/technicianNavigation";
import { format } from "date-fns";
import type { JobPosting, User, JobApplication } from "@shared/schema";

type JobPostingWithCompany = JobPosting & { companyName?: string | null };
type ApplicationWithJob = JobApplication & { jobPosting: JobPostingWithCompany | null };
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import { LanguageDropdown } from "@/components/LanguageDropdown";

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
      "irata/SPRAT certification levels",
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
    statusRefused: "Offer Declined",
    jobOfferReceived: "You received a job offer!",
    receivedOn: "Received",
    fromCompany: "from",
    refuseOffer: "Decline Offer",
    deleteApplication: "Delete",
    offerRefused: "Offer Declined",
    offerRefusedDesc: "The job offer has been declined",
    applicationDeleted: "Application Deleted",
    applicationDeletedDesc: "Your application has been removed",
    refuseFailed: "Failed to decline offer",
    deleteFailed: "Failed to delete application",
    viewedOffers: "Viewed/Past Offers",
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
      "Niveaux de certification irata/SPRAT",
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
    irataLevel: "Niveau irata",
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
    statusRefused: "Offre refusee",
    jobOfferReceived: "Vous avez recu une offre d'emploi!",
    receivedOn: "Recu le",
    fromCompany: "de",
    refuseOffer: "Refuser l'offre",
    deleteApplication: "Supprimer",
    offerRefused: "Offre refusee",
    offerRefusedDesc: "L'offre d'emploi a ete refusee",
    applicationDeleted: "Candidature supprimee",
    applicationDeletedDesc: "Votre candidature a ete supprimee",
    refuseFailed: "Echec du refus de l'offre",
    deleteFailed: "Echec de la suppression",
    viewedOffers: "Offres consultees/passees",
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
  const { i18n } = useTranslation();
  
  // Mobile sidebar state for external control
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Use global i18n language, not local storage
  const language: Language = (i18n.language === 'fr' || i18n.language === 'es') ? 
    (i18n.language === 'fr' ? 'fr' : 'en') : 'en';
  const t = translations[language];
  
  // Header labels
  const proBadge = language === 'en' ? 'PLUS' : 'PLUS';
  const proBadgeTooltip = language === 'en' ? 'You have PLUS access' : 'Vous avez un acces PLUS';
  const roleLabel = language === 'en' ? 'Technician' : 'Technicien';

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showConfirmVisibility, setShowConfirmVisibility] = useState(false);
  
  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      queryClient.clear();
      setLocation("/");
    } catch (error) {
      toast({
        title: language === 'en' ? "Logout failed" : "Echec de la deconnexion",
        variant: "destructive",
      });
    }
  };
  
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
    queryKey: ["/api/job-postings/public", "rope_access"],
    queryFn: async () => {
      const res = await fetch("/api/job-postings/public?positionType=rope_access", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
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

  const refuseMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      return apiRequest("POST", `/api/job-applications/${applicationId}/refuse`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications/my"] });
      toast({
        title: t.offerRefused,
        description: t.offerRefusedDesc,
      });
    },
    onError: () => {
      toast({
        title: t.refuseFailed,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      return apiRequest("DELETE", `/api/job-applications/${applicationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications/my"] });
      toast({
        title: t.applicationDeleted,
        description: t.applicationDeletedDesc,
      });
    },
    onError: () => {
      toast({
        title: t.deleteFailed,
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

  const technicianNavGroups = getTechnicianNavGroups(language as 'en' | 'fr' | 'es');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Sidebar - Desktop fixed, Mobile hamburger menu */}
      <DashboardSidebar
        currentUser={user as any}
        activeTab="job-board"
        onTabChange={() => {}}
        variant="technician"
        customNavigationGroups={technicianNavGroups}
        showDashboardLink={false}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />
      
      {/* Main content wrapper - offset for sidebar on desktop */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6">
          <div className="h-full flex items-center justify-between gap-4">
            {/* Left Side: Hamburger menu (mobile) + Search */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Mobile hamburger menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex flex-1 max-w-xl">
                <DashboardSearch />
              </div>
            </div>
            
            {/* Right Side: Actions Group */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* PLUS Badge - Technicians with PLUS access */}
              {user?.role === 'rope_access_tech' && (user as any).hasPlusAccess && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="default" 
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs px-2 py-0.5 font-bold border-0 cursor-help" 
                      data-testid="badge-pro"
                    >
                      <Crown className="w-3 h-3 mr-1 fill-current" />
                      {proBadge}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{proBadgeTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Language Selector */}
              <LanguageDropdown />
              
              {/* User Profile - Clickable to go to Portal Profile tab */}
              <button 
                onClick={() => setLocation("/technician-portal")}
                className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
                data-testid="link-user-profile"
              >
                <Avatar className="w-8 h-8 bg-[#95ADB6]">
                  <AvatarFallback className="bg-[#95ADB6] text-white text-xs font-medium">
                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 leading-tight">{roleLabel}</p>
                </div>
              </button>
              
              {/* Logout Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                data-testid="button-logout" 
                onClick={handleLogout} 
                className="text-slate-600 dark:text-slate-300"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 py-6 space-y-6">
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
                  const isRefused = app.status === "refused";
                  const statusLabel = {
                    applied: t.statusApplied,
                    reviewing: t.statusReviewing,
                    interviewed: t.statusInterviewed,
                    offered: t.statusOffered,
                    hired: t.statusHired,
                    rejected: t.statusRejected,
                    refused: t.statusRefused,
                  }[app.status] || app.status;

                  const statusVariant = {
                    applied: "secondary" as const,
                    reviewing: "secondary" as const,
                    interviewed: "secondary" as const,
                    offered: "default" as const,
                    hired: "default" as const,
                    rejected: "destructive" as const,
                    refused: "outline" as const,
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
                                {app.jobPosting?.companyName && (
                                  <span className="font-normal text-muted-foreground ml-1">
                                    {t.fromCompany} {app.jobPosting.companyName}
                                  </span>
                                )}
                              </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              {!isOffer && <Badge variant={statusVariant}>{statusLabel}</Badge>}
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
                          <div className="flex items-center gap-2">
                            {isOffer && (
                              <>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    refuseMutation.mutate(app.id);
                                  }}
                                  disabled={refuseMutation.isPending}
                                  data-testid={`button-refuse-offer-${app.id}`}
                                >
                                  {refuseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                                  {t.refuseOffer}
                                </Button>
                              </>
                            )}
                            {(isRefused || app.status === "rejected" || app.status === "withdrawn") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMutation.mutate(app.id);
                                }}
                                disabled={deleteMutation.isPending}
                                className="text-destructive"
                                data-testid={`button-delete-app-${app.id}`}
                              >
                                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
                                {t.deleteApplication}
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="gap-1">
                              {t.viewDetails}
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
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
                <Select
                  value={filterCountry || "all"}
                  onValueChange={(value) => {
                    setFilterCountry(value === "all" ? "" : value);
                    setFilterProvince("");
                    setFilterCity("");
                  }}
                >
                  <SelectTrigger id="filter-country" data-testid="select-filter-country">
                    <SelectValue placeholder={t.allCountries} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allCountries}</SelectItem>
                    {uniqueCountries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="filter-province" className="text-xs text-muted-foreground">{t.provinceState}</Label>
                <Select
                  value={filterProvince || "all"}
                  onValueChange={(value) => {
                    setFilterProvince(value === "all" ? "" : value);
                    setFilterCity("");
                  }}
                >
                  <SelectTrigger id="filter-province" data-testid="select-filter-province">
                    <SelectValue placeholder={t.allProvinces} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allProvinces}</SelectItem>
                    {uniqueProvinces.map(province => (
                      <SelectItem key={province} value={province}>{province}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="filter-city" className="text-xs text-muted-foreground">{t.city}</Label>
                <Select
                  value={filterCity || "all"}
                  onValueChange={(value) => setFilterCity(value === "all" ? "" : value)}
                >
                  <SelectTrigger id="filter-city" data-testid="select-filter-city">
                    <SelectValue placeholder={t.allCities} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allCities}</SelectItem>
                    {uniqueCities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
      </div>

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
