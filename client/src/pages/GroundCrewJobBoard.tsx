import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  DollarSign,
  Building,
  CalendarDays,
  ChevronRight,
  Loader2,
  Calendar,
  CheckCircle2,
  Menu,
  LogOut
} from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { getGroundCrewNavGroups } from "@/lib/groundCrewNavigation";
import { format } from "date-fns";
import type { JobPosting, User, JobApplication } from "@shared/schema";

type JobPostingWithCompany = JobPosting & { companyName?: string | null; companyCsr?: number | null };
type ApplicationWithJob = JobApplication & { jobPosting: JobPostingWithCompany | null };

type Language = 'en' | 'fr' | 'es';

const translations = {
  en: {
    title: "Ground Crew Job Board",
    subtitle: "Browse ground crew opportunities",
    backToPortal: "Back to Portal",
    activeJobs: "Active Opportunities",
    noJobsTitle: "No Ground Crew Jobs",
    noJobsDesc: "There are no ground crew job postings available at the moment. Check back later!",
    loading: "Loading job postings...",
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
    applyNow: "Apply Now",
    applied: "Applied",
    applicationSubmitted: "Application Submitted",
    applicationSubmittedDesc: "Your application has been submitted successfully.",
    applyToJob: "Apply for this Job",
    coverMessage: "Cover Message (Optional)",
    coverMessagePlaceholder: "Tell the employer why you're interested in this position...",
    submitApplication: "Submit Application",
    submitting: "Submitting...",
    myApplications: "My Applications",
    viewMyApplications: "View My Applications",
    noApplications: "You haven't applied to any jobs yet",
    pending: "Pending",
    reviewing: "Reviewing",
    interviewed: "Interviewed",
    offered: "Offered",
    hired: "Hired",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    refused: "Refused",
  },
  fr: {
    title: "Offres d'emploi Equipe au sol",
    subtitle: "Parcourir les opportunites pour l'equipe au sol",
    backToPortal: "Retour au portail",
    activeJobs: "Opportunites actives",
    noJobsTitle: "Aucune offre pour l'equipe au sol",
    noJobsDesc: "Il n'y a pas d'offres d'emploi pour l'equipe au sol pour le moment. Revenez plus tard!",
    loading: "Chargement des offres...",
    viewDetails: "Voir les details",
    jobDetails: "Details du poste",
    description: "Description",
    requirements: "Exigences",
    benefits: "Avantages",
    salary: "Salaire",
    location: "Lieu",
    remote: "A distance",
    onSite: "Sur place",
    postedBy: "Publie par",
    expiresOn: "Expiration de l'offre",
    startsOn: "Date de debut",
    schedule: "Horaire de travail",
    experience: "Experience requise",
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
    applyNow: "Postuler",
    applied: "Postule",
    applicationSubmitted: "Candidature soumise",
    applicationSubmittedDesc: "Votre candidature a ete soumise avec succes.",
    applyToJob: "Postuler a ce poste",
    coverMessage: "Message de motivation (optionnel)",
    coverMessagePlaceholder: "Dites a l'employeur pourquoi ce poste vous interesse...",
    submitApplication: "Soumettre la candidature",
    submitting: "Envoi...",
    myApplications: "Mes candidatures",
    viewMyApplications: "Voir mes candidatures",
    noApplications: "Vous n'avez pas encore postule",
    pending: "En attente",
    reviewing: "En cours d'examen",
    interviewed: "Entretien",
    offered: "Offre",
    hired: "Embauche",
    rejected: "Rejete",
    withdrawn: "Retire",
    refused: "Refuse",
  },
  es: {
    title: "Bolsa de Trabajo para Equipo de Tierra",
    subtitle: "Explora oportunidades para equipo de tierra",
    backToPortal: "Volver al Portal",
    activeJobs: "Oportunidades Activas",
    noJobsTitle: "Sin Ofertas para Equipo de Tierra",
    noJobsDesc: "No hay ofertas de trabajo para equipo de tierra disponibles. Vuelve mas tarde!",
    loading: "Cargando ofertas...",
    viewDetails: "Ver Detalles",
    jobDetails: "Detalles del Trabajo",
    description: "Descripcion",
    requirements: "Requisitos",
    benefits: "Beneficios",
    salary: "Salario",
    location: "Ubicacion",
    remote: "Remoto",
    onSite: "Presencial",
    postedBy: "Publicado por",
    expiresOn: "Expira",
    startsOn: "Fecha de inicio",
    schedule: "Horario",
    experience: "Experiencia Requerida",
    fullTime: "Tiempo completo",
    partTime: "Medio tiempo",
    contract: "Contrato",
    temporary: "Temporal",
    permanent: "Permanente",
    seasonal: "Estacional",
    hourly: "por hora",
    daily: "por dia",
    weekly: "por semana",
    monthly: "por mes",
    annually: "por ano",
    applyNow: "Postularse",
    applied: "Postulado",
    applicationSubmitted: "Solicitud Enviada",
    applicationSubmittedDesc: "Tu solicitud ha sido enviada exitosamente.",
    applyToJob: "Postularse a este trabajo",
    coverMessage: "Mensaje de presentacion (opcional)",
    coverMessagePlaceholder: "Cuentale al empleador por que te interesa este puesto...",
    submitApplication: "Enviar Solicitud",
    submitting: "Enviando...",
    myApplications: "Mis Solicitudes",
    viewMyApplications: "Ver Mis Solicitudes",
    noApplications: "Aun no has aplicado a ningun trabajo",
    pending: "Pendiente",
    reviewing: "En revision",
    interviewed: "Entrevistado",
    offered: "Oferta",
    hired: "Contratado",
    rejected: "Rechazado",
    withdrawn: "Retirado",
    refused: "Rechazado",
  },
};

export default function GroundCrewJobBoard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  
  // Mobile sidebar state for external control
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const language: Language = (i18n.language === 'fr' ? 'fr' : i18n.language === 'es' ? 'es' : 'en');
  const t = translations[language];
  
  // Header role label
  const roleLabel = language === 'en' ? 'Ground Crew' : language === 'es' ? 'Equipo de Tierra' : 'Equipe au sol';

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [coverMessage, setCoverMessage] = useState("");
  
  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      queryClient.clear();
      setLocation("/");
    } catch (error) {
      toast({
        title: language === 'en' ? "Logout failed" : language === 'es' ? "Error al cerrar sesion" : "Echec de la deconnexion",
        variant: "destructive",
      });
    }
  };
  const [showMyApplications, setShowMyApplications] = useState(false);

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery<{ jobPostings: JobPostingWithCompany[] }>({
    queryKey: ["/api/job-postings/public", "ground_crew"],
    queryFn: async () => {
      const res = await fetch("/api/job-postings/public?positionType=ground_crew", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
  });

  const { data: applicationsData, refetch: refetchApplications } = useQuery<{ applications: ApplicationWithJob[] }>({
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
    mutationFn: async ({ jobPostingId, coverMessage }: { jobPostingId: string; coverMessage?: string }) => {
      return apiRequest("POST", "/api/job-applications", { jobPostingId, coverMessage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications/my"] });
      toast({ title: t.applicationSubmitted, description: t.applicationSubmittedDesc });
      setShowApplyDialog(false);
      setCoverMessage("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit application", variant: "destructive" });
    },
  });

  const formatSalary = (job: JobPosting) => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const periodMap: Record<string, string> = {
      hourly: t.hourly,
      daily: t.daily,
      weekly: t.weekly,
      monthly: t.monthly,
      annually: t.annually,
    };
    const period = job.salaryPeriod ? periodMap[job.salaryPeriod] || "" : "";
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin} - $${job.salaryMax} ${period}`;
    }
    return `$${job.salaryMin || job.salaryMax} ${period}`;
  };

  const getJobTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      full_time: t.fullTime,
      part_time: t.partTime,
      contract: t.contract,
      temporary: t.temporary,
      seasonal: t.seasonal,
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      applied: { label: t.pending, variant: "secondary" },
      reviewing: { label: t.reviewing, variant: "default" },
      interviewed: { label: t.interviewed, variant: "default" },
      offered: { label: t.offered, variant: "default" },
      hired: { label: t.hired, variant: "default" },
      rejected: { label: t.rejected, variant: "destructive" },
      withdrawn: { label: t.withdrawn, variant: "outline" },
      refused: { label: t.refused, variant: "outline" },
    };
    const { label, variant } = statusMap[status] || { label: status, variant: "secondary" as const };
    return <Badge variant={variant}>{label}</Badge>;
  };

  // Navigation groups for sidebar - use shared module for consistency
  const groundCrewNavGroups = getGroundCrewNavGroups(language as 'en' | 'es' | 'fr');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Sidebar - Desktop fixed, Mobile hamburger menu */}
      <DashboardSidebar
        currentUser={user as any}
        activeTab="job-board"
        onTabChange={() => {}}
        variant="ground-crew"
        customNavigationGroups={groundCrewNavGroups}
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
              {/* Toggle button for applications */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMyApplications(!showMyApplications)}
                data-testid="button-toggle-applications"
              >
                {showMyApplications ? t.activeJobs : t.viewMyApplications}
              </Button>
              
              {/* Language Selector */}
              <LanguageDropdown />
              
              {/* User Profile - Clickable to go to Portal */}
              <button 
                onClick={() => setLocation("/ground-crew-portal")}
                className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
                data-testid="link-user-profile"
              >
                <Avatar className="w-8 h-8 bg-[#5D7B6F]">
                  <AvatarFallback className="bg-[#5D7B6F] text-white text-xs font-medium">
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

        <main className="px-4 sm:px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

        {showMyApplications ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t.myApplications}</h2>
            {myApplications.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {t.noApplications}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myApplications.map((app) => (
                  <Card key={app.id} data-testid={`card-application-${app.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-base">{app.jobPosting?.title || "Unknown Job"}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Building className="w-3 h-3" />
                            {app.jobPosting?.companyName || "Unknown Company"}
                          </CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">
                        Applied: {format(new Date(app.appliedAt), "MMM d, yyyy")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t.activeJobs}</h2>
            {jobsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">{t.loading}</span>
              </div>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{t.noJobsTitle}</h3>
                  <p className="text-muted-foreground">{t.noJobsDesc}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover-elevate cursor-pointer" onClick={() => setSelectedJob(job)} data-testid={`card-job-${job.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-base truncate">{job.title}</CardTitle>
                            {hasApplied(job.id) && (
                              <Badge variant="secondary" className="text-xs gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {t.applied}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="flex items-center gap-3 flex-wrap text-xs">
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {job.companyName || "Unknown Company"}
                            </span>
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {getJobTypeLabel(job.jobType)}
                            </span>
                            {formatSalary(job) && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {formatSalary(job)}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
        </main>
      </div>

      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedJob.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 flex-wrap">
                  <Building className="w-4 h-4" />
                  {(selectedJob as JobPostingWithCompany).companyName || "Unknown Company"}
                  {(selectedJob as JobPostingWithCompany).companyCsr != null && (
                    <Badge 
                      variant="outline" 
                      className={`${
                        (selectedJob as JobPostingWithCompany).companyCsr! >= 90 ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700' :
                        (selectedJob as JobPostingWithCompany).companyCsr! >= 70 ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700' :
                        (selectedJob as JobPostingWithCompany).companyCsr! >= 50 ? 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700' :
                        'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700'
                      }`}
                    >
                      CSR: {Math.round((selectedJob as JobPostingWithCompany).companyCsr!)}%
                    </Badge>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{getJobTypeLabel(selectedJob.jobType)}</Badge>
                  {selectedJob.isRemote && <Badge variant="outline">{t.remote}</Badge>}
                  {selectedJob.location && (
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedJob.location}
                    </Badge>
                  )}
                </div>

                {formatSalary(selectedJob) && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{t.salary}</h4>
                    <p className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-4 h-4" />
                      {formatSalary(selectedJob)}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-sm mb-1">{t.description}</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedJob.description}</p>
                </div>

                {selectedJob.requirements && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{t.requirements}</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedJob.requirements}</p>
                  </div>
                )}

                {selectedJob.benefits && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{t.benefits}</h4>
                    <p className="text-sm whitespace-pre-wrap">{selectedJob.benefits}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {selectedJob.startDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {t.startsOn}: {format(new Date(selectedJob.startDate), "MMM d, yyyy")}
                    </span>
                  )}
                  {selectedJob.expiresAt && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {t.expiresOn}: {format(new Date(selectedJob.expiresAt), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </div>

              <DialogFooter>
                {hasApplied(selectedJob.id) ? (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {t.applied}
                  </Badge>
                ) : (
                  <Button onClick={() => setShowApplyDialog(true)} data-testid="button-apply">
                    {t.applyNow}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.applyToJob}</DialogTitle>
            <DialogDescription>{selectedJob?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="coverMessage">{t.coverMessage}</Label>
              <Textarea
                id="coverMessage"
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
                placeholder={t.coverMessagePlaceholder}
                rows={4}
                data-testid="textarea-cover-message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedJob && applyMutation.mutate({ jobPostingId: selectedJob.id, coverMessage: coverMessage || undefined })}
              disabled={applyMutation.isPending}
              data-testid="button-submit-application"
            >
              {applyMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.submitApplication
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
