import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  MapPin, 
  Clock,
  DollarSign,
  Building,
  CalendarDays,
  Award,
  ChevronRight,
  Loader2,
  Calendar,
  FileText,
  Lock,
  Crown,
  X,
  Trash2,
  Menu,
  Briefcase
} from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { format } from "date-fns";
import type { JobPosting, JobApplication } from "@shared/schema";

type JobPostingWithCompany = JobPosting & { companyName?: string | null; companyCsr?: number | null };
type ApplicationWithJob = JobApplication & { jobPosting: JobPostingWithCompany | null };
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import { LanguageDropdown } from "@/components/LanguageDropdown";

type Language = 'en' | 'fr';

const translations = {
  en: {
    title: "My Applications & Offers",
    subtitle: "Track your job applications and respond to offers",
    backToPortal: "Back to Portal",
    noApplicationsTitle: "No Applications Yet",
    noApplicationsDesc: "You haven't applied to any jobs yet. Browse the Job Board to find opportunities!",
    browseJobs: "Browse Job Board",
    loading: "Loading applications...",
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
    viewDetails: "View Details",
    offerRefused: "Offer Declined",
    offerRefusedDesc: "The job offer has been declined",
    applicationDeleted: "Application Deleted",
    applicationDeletedDesc: "Your application has been removed",
    refuseFailed: "Failed to decline offer",
    deleteFailed: "Failed to delete application",
    plusRequired: "PLUS Required",
    plusRequiredDesc: "Job applications are a PLUS feature. Refer a technician to unlock!",
    unlockWithReferral: "Unlock with Referral",
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
    activeOffers: "Active Offers",
    pendingApplications: "Pending Applications",
    pastApplications: "Past Applications",
  },
  fr: {
    title: "Mes Candidatures et Offres",
    subtitle: "Suivez vos candidatures et repondez aux offres",
    backToPortal: "Retour au Portail",
    noApplicationsTitle: "Aucune Candidature",
    noApplicationsDesc: "Vous n'avez pas encore postule a des emplois. Parcourez le tableau d'emploi pour trouver des opportunites!",
    browseJobs: "Parcourir les Emplois",
    loading: "Chargement des candidatures...",
    statusApplied: "Postule",
    statusReviewing: "En Revue",
    statusInterviewed: "Interviewe",
    statusOffered: "Offre Recue",
    statusHired: "Embauche",
    statusRejected: "Non Selectionne",
    statusRefused: "Offre Refusee",
    jobOfferReceived: "Vous avez recu une offre d'emploi!",
    receivedOn: "Recu",
    fromCompany: "de",
    refuseOffer: "Refuser l'Offre",
    deleteApplication: "Supprimer",
    viewDetails: "Voir les Details",
    offerRefused: "Offre Refusee",
    offerRefusedDesc: "L'offre d'emploi a ete refusee",
    applicationDeleted: "Candidature Supprimee",
    applicationDeletedDesc: "Votre candidature a ete supprimee",
    refuseFailed: "Echec du refus de l'offre",
    deleteFailed: "Echec de la suppression de la candidature",
    plusRequired: "PLUS Requis",
    plusRequiredDesc: "Les candidatures sont une fonctionnalite PLUS. Referez un technicien pour debloquer!",
    unlockWithReferral: "Debloquer avec Parrainage",
    jobDetails: "Details du Poste",
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
    mondayFriday: "Lundi a Vendredi",
    mondaySaturday: "Lundi a Samedi",
    flexible: "Horaire Flexible",
    rotatingShifts: "Quarts Rotatifs",
    weekendsOnly: "Fins de Semaine",
    onCall: "Sur Appel",
    entryLevel: "Debutant",
    oneToTwo: "1-2 ans",
    threeToFive: "3-5 ans",
    fivePlus: "5+ ans",
    tenPlus: "10+ ans",
    activeOffers: "Offres Actives",
    pendingApplications: "Candidatures en Cours",
    pastApplications: "Candidatures Passees",
  }
};

export default function TechnicianApplications() {
  const { i18n } = useTranslation();
  const language = (i18n.language?.startsWith('fr') ? 'fr' : 'en') as Language;
  const t = translations[language];
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedJob, setSelectedJob] = useState<JobPostingWithCompany | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: applicationsData, isLoading } = useQuery<{ applications: ApplicationWithJob[] }>({
    queryKey: ["/api/job-applications/my"],
  });

  const user = userData?.user;
  const myApplications = applicationsData?.applications || [];

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

  const getScheduleLabel = (schedule: string | null | undefined) => {
    const scheduleMap: Record<string, string> = {
      monday_friday: t.mondayFriday,
      monday_saturday: t.mondaySaturday,
      flexible: t.flexible,
      rotating_shifts: t.rotatingShifts,
      weekends_only: t.weekendsOnly,
      on_call: t.onCall,
    };
    return schedule ? scheduleMap[schedule] || schedule : null;
  };

  const getExperienceLabel = (exp: string | null | undefined) => {
    const expMap: Record<string, string> = {
      entry_level: t.entryLevel,
      "1-2_years": t.oneToTwo,
      "3-5_years": t.threeToFive,
      "5+_years": t.fivePlus,
      "10+_years": t.tenPlus,
    };
    return exp ? expMap[exp] || exp : null;
  };

  const getEmploymentTypeLabel = (type: string | null | undefined) => {
    const typeMap: Record<string, string> = {
      full_time: t.fullTime,
      part_time: t.partTime,
      contract: t.contract,
      temporary: t.temporary,
      permanent: t.permanent,
      seasonal: t.seasonal,
    };
    return type ? typeMap[type] || type : null;
  };

  const getSalaryPeriodLabel = (period: string | null | undefined) => {
    const periodMap: Record<string, string> = {
      hourly: t.hourly,
      daily: t.daily,
      weekly: t.weekly,
      monthly: t.monthly,
      annually: t.annually,
    };
    return period ? periodMap[period] || period : "";
  };

  const getJobTypeBadge = (jobType: string) => {
    const typeMap: Record<string, string> = {
      window_cleaning: language === 'en' ? "Window Cleaning" : "Nettoyage de Vitres",
      exterior_vent: language === 'en' ? "Exterior Vent" : "Ventilation Exterieure",
      building_wash: language === 'en' ? "Building Wash" : "Lavage de Batiment",
      general_pressure: language === 'en' ? "Pressure Washing" : "Lavage a Pression",
      gutter_cleaning: language === 'en' ? "Gutter Cleaning" : "Nettoyage de Gouttieres",
      in_suite_vent: language === 'en' ? "In-Suite Vent" : "Ventilation d'Unite",
      parkade: language === 'en' ? "Parkade" : "Stationnement",
      ground_window: language === 'en' ? "Ground Window" : "Vitres au Sol",
      painting: language === 'en' ? "Painting" : "Peinture",
      inspection: language === 'en' ? "Inspection" : "Inspection",
    };
    return typeMap[jobType] || jobType;
  };

  const activeOffers = myApplications.filter(app => app.status === "offered");
  const pendingApplications = myApplications.filter(app => 
    app.status === "applied" || app.status === "reviewing" || app.status === "interviewed"
  );
  const pastApplications = myApplications.filter(app => 
    app.status === "hired" || app.status === "rejected" || app.status === "refused" || app.status === "withdrawn"
  );

  const statusStyles: Record<string, string> = {
    applied: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    reviewing: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    interviewed: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    offered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    hired: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800",
    rejected: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
    refused: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  };

  const renderApplicationCard = (app: ApplicationWithJob) => {
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
              <div className="flex items-center gap-2 flex-wrap">
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
                {!isOffer && <Badge variant="outline" className={statusStyles[app.status] || statusStyles.applied}>{statusLabel}</Badge>}
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
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar
        variant="technician"
        companyName={user?.name || "Technician"}
        currentUser={user}
        onTabChange={() => {}}
        activeTab=""
        mobileOpen={isMobileMenuOpen}
        onMobileOpenChange={setIsMobileMenuOpen}
      />

      <div className="lg:pl-60">
        <header className="sticky top-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6">
          <div className="h-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-slate-600 dark:text-slate-300"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex flex-1 max-w-xl">
                <DashboardSearch />
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {user?.role === 'rope_access_tech' && user?.hasPlusAccess && (
                <Badge 
                  variant="default" 
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs px-2 py-0.5 font-bold border-0"
                  data-testid="badge-plus"
                >
                  <Crown className="w-3 h-3 mr-1 fill-current" />
                  PLUS
                </Badge>
              )}
              <LanguageDropdown />
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 max-w-5xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/technician-portal")}
              className="gap-1 text-muted-foreground mb-4"
              data-testid="button-back-portal"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToPortal}
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <FileText className="w-7 h-7 text-primary" />
              {t.title}
            </h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </div>

          {!user?.hasPlusAccess ? (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
              <CardContent className="p-6 text-center">
                <Lock className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.plusRequired}</h3>
                <p className="text-muted-foreground mb-4">{t.plusRequiredDesc}</p>
                <Button onClick={() => setLocation("/technician-portal?tab=referrals")} data-testid="button-unlock-plus">
                  {t.unlockWithReferral}
                </Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">{t.loading}</span>
            </div>
          ) : myApplications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Briefcase className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t.noApplicationsTitle}</h3>
                <p className="text-muted-foreground mb-4">{t.noApplicationsDesc}</p>
                <Button onClick={() => setLocation("/technician-job-board")} data-testid="button-browse-jobs">
                  {t.browseJobs}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {activeOffers.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Badge className="bg-primary text-primary-foreground">{activeOffers.length}</Badge>
                    {t.activeOffers}
                  </h2>
                  <div className="grid gap-3">
                    {activeOffers.map(renderApplicationCard)}
                  </div>
                </div>
              )}

              {pendingApplications.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Badge variant="secondary">{pendingApplications.length}</Badge>
                    {t.pendingApplications}
                  </h2>
                  <div className="grid gap-3">
                    {pendingApplications.map(renderApplicationCard)}
                  </div>
                </div>
              )}

              {pastApplications.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
                    <Badge variant="outline">{pastApplications.length}</Badge>
                    {t.pastApplications}
                  </h2>
                  <div className="grid gap-3">
                    {pastApplications.map(renderApplicationCard)}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedJob?.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              {selectedJob?.companyName || "Company"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{getJobTypeBadge(selectedJob.jobType)}</Badge>
                {selectedJob.isRemote && (
                  <Badge variant="outline" className="border-blue-500 text-blue-600">{t.remote}</Badge>
                )}
                {selectedJob.employmentType && (
                  <Badge variant="outline">{getEmploymentTypeLabel(selectedJob.employmentType)}</Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {selectedJob.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedJob.location}</span>
                  </div>
                )}
                {selectedJob.salaryMin && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>
                      ${selectedJob.salaryMin}
                      {selectedJob.salaryMax && ` - $${selectedJob.salaryMax}`}
                      {selectedJob.salaryPeriod && ` ${getSalaryPeriodLabel(selectedJob.salaryPeriod)}`}
                    </span>
                  </div>
                )}
                {(selectedJob as any).workSchedule && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{getScheduleLabel((selectedJob as any).workSchedule)}</span>
                  </div>
                )}
                {selectedJob.experienceRequired && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>{getExperienceLabel(selectedJob.experienceRequired)}</span>
                  </div>
                )}
                {selectedJob.startDate && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>{t.startsOn}: {format(new Date(selectedJob.startDate), "MMM d, yyyy")}</span>
                  </div>
                )}
              </div>

              {selectedJob.description && (
                <div>
                  <h4 className="font-semibold mb-2">{t.description}</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.description}</p>
                </div>
              )}

              {selectedJob.requirements && (
                <div>
                  <h4 className="font-semibold mb-2">{t.requirements}</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.requirements}</p>
                </div>
              )}

              {selectedJob.benefits && (
                <div>
                  <h4 className="font-semibold mb-2">{t.benefits}</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedJob.benefits}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {(selectedJob as any).irataLevelRequired && (
                  <Badge variant="outline" className="border-amber-500 text-amber-600">
                    {t.irataLevel} {(selectedJob as any).irataLevelRequired}+
                  </Badge>
                )}
                {(selectedJob as any).spratLevelRequired && (
                  <Badge variant="outline" className="border-purple-500 text-purple-600">
                    {t.spratLevel} {(selectedJob as any).spratLevelRequired}+
                  </Badge>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedJob(null)}>
              {t.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
