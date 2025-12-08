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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  Calendar
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
    myApplications: "My Applications",
    noApplications: "You haven't applied to any jobs yet",
    applicationStatus: "Status",
    statusApplied: "Applied",
    statusReviewing: "Under Review",
    statusInterviewed: "Interviewed",
    statusOffered: "Offer Made",
    statusHired: "Hired",
    statusRejected: "Not Selected",
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
    myApplications: "Mes candidatures",
    noApplications: "Vous n'avez postule a aucun emploi",
    applicationStatus: "Statut",
    statusApplied: "Postule",
    statusReviewing: "En cours d'examen",
    statusInterviewed: "Entrevue",
    statusOffered: "Offre faite",
    statusHired: "Embauche",
    statusRejected: "Non selectionne",
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
  const jobs = jobsData?.jobPostings || [];
  const myApplications = applicationsData?.applications || [];

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

        <Separator />

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
