import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSetHeaderConfig } from "@/components/DashboardLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Briefcase, MapPin, DollarSign, Calendar, Edit, Trash2, Pause, Play, Users, FileText, Eye, Mail, Award, X, Clock, Download, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

type JobPosting = {
  id: string;
  companyId: string | null;
  isPlatformPost: boolean;
  title: string;
  description: string;
  requirements: string | null;
  location: string | null;
  isRemote: boolean | null;
  jobType: string;
  employmentType: string | null;
  salaryMin: string | null;
  salaryMax: string | null;
  salaryPeriod: string | null;
  requiredIrataLevel: string | null;
  requiredSpratLevel: string | null;
  startDate: string | null;
  benefits: string | null;
  workDays: string | null;
  experienceRequired: string | null;
  positionType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
};

type ResumeDocument = { name: string; url: string } | string;

type Technician = {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  irataLevel: string | null;
  spratLevel: string | null;
  irataLicenseNumber: string | null;
  spratLicenseNumber: string | null;
  irataExpirationDate: string | null;
  spratExpirationDate: string | null;
  employeeCity: string | null;
  employeeProvinceState: string | null;
  employeeCountry: string | null;
  ropeAccessStartDate: string | null;
  resumeDocuments: ResumeDocument[] | null;
  isVisibleToEmployers: boolean | null;
  visibilityEnabledAt: string | null;
};

type JobApplication = {
  id: string;
  technicianId: string;
  jobPostingId: string;
  status: string;
  coverMessage: string | null;
  appliedAt: string;
  viewedByEmployerAt: string | null;
  technician: Technician | null;
};

const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "seasonal", label: "Seasonal" },
];

const EMPLOYMENT_TYPES = [
  { value: "permanent", label: "Permanent" },
  { value: "fixed_term", label: "Fixed Term" },
  { value: "casual", label: "Casual" },
];

const SALARY_PERIODS = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "annually", label: "Annually" },
];

const CERT_LEVELS = [
  { value: "", label: "Not Required" },
  { value: "Level 1", label: "Level 1" },
  { value: "Level 2", label: "Level 2" },
  { value: "Level 3", label: "Level 3" },
];

const WORK_DAYS_OPTIONS = [
  { value: "monday_friday", label: "Monday to Friday" },
  { value: "monday_saturday", label: "Monday to Saturday" },
  { value: "flexible", label: "Flexible Schedule" },
  { value: "rotating", label: "Rotating Shifts" },
  { value: "weekends", label: "Weekends Only" },
  { value: "on_call", label: "On Call" },
];

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Not Specified" },
  { value: "entry", label: "Entry Level (0-1 years)" },
  { value: "junior", label: "1-2 years" },
  { value: "mid", label: "3-5 years" },
  { value: "senior", label: "5+ years" },
  { value: "expert", label: "10+ years" },
];

const POSITION_TYPES = [
  { value: "rope_access", label: "Rope Access Technician" },
  { value: "ground_crew", label: "Ground Crew" },
];

export default function CompanyJobBoard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [viewingApplicationsFor, setViewingApplicationsFor] = useState<JobPosting | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showJobOfferDialog, setShowJobOfferDialog] = useState(false);
  const [selectedJobIdForOffer, setSelectedJobIdForOffer] = useState<string>("");
  const [offerMessage, setOfferMessage] = useState("");
  const [deleteApplicationId, setDeleteApplicationId] = useState<string | null>(null);
  const [showSentOffers, setShowSentOffers] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });
  const currentUser = userData?.user;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    isRemote: false,
    jobType: "full_time",
    employmentType: "permanent",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "hourly",
    requiredIrataLevel: "",
    requiredSpratLevel: "",
    startDate: "",
    benefits: "",
    workDays: "",
    experienceRequired: "",
    expiresAt: "",
    positionType: "rope_access",
  });

  const { data, isLoading } = useQuery<{ jobPostings: JobPosting[] }>({
    queryKey: ["/api/job-postings"],
  });

  const { data: applicationsData, refetch: refetchApplications } = useQuery<{ applications: JobApplication[] }>({
    queryKey: ["/api/job-applications/job", viewingApplicationsFor?.id],
    enabled: !!viewingApplicationsFor,
    queryFn: async () => {
      const res = await fetch(`/api/job-applications/job/${viewingApplicationsFor?.id}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  const { data: countsData } = useQuery<{ counts: { jobPostingId: string; count: number }[] }>({
    queryKey: ["/api/job-applications/counts"],
  });

  type SentOffer = {
    id: string;
    technicianId: string;
    jobPostingId: string;
    status: string;
    statusUpdatedAt: string | null;
    technician: { id: string; name: string; firstName: string | null; lastName: string | null; photoUrl: string | null; irataLevel: string | null; spratLevel: string | null } | null;
    jobPosting: { id: string; title: string; location: string | null } | null;
  };

  const { data: sentOffersData } = useQuery<{ offers: SentOffer[] }>({
    queryKey: ["/api/job-applications/sent-offers"],
    enabled: showSentOffers,
  });

  const sentOffers = sentOffersData?.offers || [];
  const pendingOffers = sentOffers.filter(o => o.status === "offered");
  const refusedOffers = sentOffers.filter(o => o.status === "refused");
  const acceptedOffers = sentOffers.filter(o => o.status === "hired");

  const jobPostings = data?.jobPostings || [];
  const currentApplications = applicationsData?.applications || [];
  const applicationCounts = countsData?.counts || [];

  const getApplicationCount = (jobId: string) => {
    const found = applicationCounts.find(a => a.jobPostingId === jobId);
    return found?.count || 0;
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/job-postings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-postings"] });
      setIsCreateOpen(false);
      resetForm();
      toast({ title: t("jobBoard.created", "Job posting created successfully") });
    },
    onError: (error: any) => {
      toast({ title: t("jobBoard.createFailed", "Failed to create job posting"), description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PATCH", `/api/job-postings/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-postings"] });
      setEditingJob(null);
      resetForm();
      toast({ title: t("jobBoard.updated", "Job posting updated successfully") });
    },
    onError: (error: any) => {
      toast({ title: t("jobBoard.updateFailed", "Failed to update job posting"), description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/job-postings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-postings"] });
      setDeleteConfirmId(null);
      toast({ title: t("jobBoard.deleted", "Job posting deleted successfully") });
    },
    onError: (error: any) => {
      toast({ title: t("jobBoard.deleteFailed", "Failed to delete job posting"), description: error.message, variant: "destructive" });
    },
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      return apiRequest("DELETE", `/api/job-applications/${applicationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications/job", viewingApplicationsFor?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications/counts"] });
      setDeleteApplicationId(null);
      toast({ title: t("jobBoard.applicationDeleted", "Application removed") });
    },
    onError: (error: any) => {
      toast({ title: t("jobBoard.deleteApplicationFailed", "Failed to remove application"), description: error.message, variant: "destructive" });
    },
  });

  const sendOfferMutation = useMutation({
    mutationFn: async ({ technicianId, jobPostingId, message }: { technicianId: string; jobPostingId: string; message?: string }) => {
      return apiRequest("POST", "/api/job-applications/offer", { technicianId, jobPostingId, message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications/job", viewingApplicationsFor?.id] });
      setShowJobOfferDialog(false);
      setSelectedJobIdForOffer("");
      setOfferMessage("");
      toast({ title: t("jobBoard.offerSent", "Job offer sent successfully") });
    },
    onError: (error: any) => {
      if (error.message?.includes("unavailable") || error.message?.includes("403")) {
        toast({ title: t("jobBoard.technicianUnavailable", "Technician Unavailable"), description: t("jobBoard.technicianNotVisible", "This technician is no longer accepting job offers"), variant: "destructive" });
      } else {
        toast({ title: t("jobBoard.offerFailed", "Failed to send offer"), description: error.message, variant: "destructive" });
      }
    },
  });

  const newApplications = currentApplications.filter(app => !app.viewedByEmployerAt);
  const viewedApplications = currentApplications.filter(app => !!app.viewedByEmployerAt);
  const activeJobs = jobPostings.filter(j => j.status === "active");

  const getDisplayName = (tech: Technician) => {
    if (tech.firstName && tech.lastName) {
      return `${tech.firstName} ${tech.lastName}`;
    }
    return tech.name || t("common.unknown", "Unknown");
  };

  const getLocation = (tech: Technician) => {
    const parts = [tech.employeeCity, tech.employeeProvinceState, tech.employeeCountry].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const getYearsExperience = (startDate: string | null) => {
    if (!startDate) return null;
    const date = new Date(startDate);
    return Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const formatDate = (date: string | null) => {
    if (!date) return null;
    return format(new Date(date), "MMM d, yyyy");
  };

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const isExpiringSoon = (date: string | null) => {
    if (!date) return false;
    const d = new Date(date);
    const daysUntil = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 60 && daysUntil > 0;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      requirements: "",
      location: "",
      isRemote: false,
      jobType: "full_time",
      employmentType: "permanent",
      salaryMin: "",
      salaryMax: "",
      salaryPeriod: "hourly",
      requiredIrataLevel: "",
      requiredSpratLevel: "",
      startDate: "",
      benefits: "",
      workDays: "",
      experienceRequired: "",
      expiresAt: "",
      positionType: "rope_access",
    });
  };

  const handleCreate = () => {
    if (!formData.title || !formData.description) {
      toast({ title: t("jobBoard.fillRequired", "Please fill in required fields"), variant: "destructive" });
      return;
    }
    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements || null,
      location: formData.location || null,
      isRemote: formData.isRemote,
      jobType: formData.jobType,
      employmentType: formData.employmentType || null,
      salaryMin: formData.salaryMin || null,
      salaryMax: formData.salaryMax || null,
      salaryPeriod: formData.salaryPeriod || null,
      requiredIrataLevel: formData.requiredIrataLevel || null,
      requiredSpratLevel: formData.requiredSpratLevel || null,
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      benefits: formData.benefits || null,
      workDays: formData.workDays || null,
      experienceRequired: formData.experienceRequired || null,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
      positionType: formData.positionType,
    });
  };

  const handleUpdate = () => {
    if (!editingJob || !formData.title || !formData.description) {
      toast({ title: t("jobBoard.fillRequired", "Please fill in required fields"), variant: "destructive" });
      return;
    }
    updateMutation.mutate({
      id: editingJob.id,
      data: {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements || null,
        location: formData.location || null,
        isRemote: formData.isRemote,
        jobType: formData.jobType,
        employmentType: formData.employmentType || null,
        salaryMin: formData.salaryMin || null,
        salaryMax: formData.salaryMax || null,
        salaryPeriod: formData.salaryPeriod || null,
        requiredIrataLevel: formData.requiredIrataLevel || null,
        requiredSpratLevel: formData.requiredSpratLevel || null,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        benefits: formData.benefits || null,
        workDays: formData.workDays || null,
        experienceRequired: formData.experienceRequired || null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
        positionType: formData.positionType,
      },
    });
  };

  const handleToggleStatus = (job: JobPosting) => {
    const newStatus = job.status === "active" ? "paused" : "active";
    updateMutation.mutate({ id: job.id, data: { status: newStatus } });
  };

  const openEditDialog = (job: JobPosting) => {
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements || "",
      location: job.location || "",
      isRemote: job.isRemote || false,
      jobType: job.jobType,
      employmentType: job.employmentType || "permanent",
      salaryMin: job.salaryMin || "",
      salaryMax: job.salaryMax || "",
      salaryPeriod: job.salaryPeriod || "hourly",
      requiredIrataLevel: job.requiredIrataLevel || "",
      requiredSpratLevel: job.requiredSpratLevel || "",
      startDate: job.startDate ? job.startDate.split("T")[0] : "",
      benefits: job.benefits || "",
      workDays: job.workDays || "",
      experienceRequired: job.experienceRequired || "",
      expiresAt: job.expiresAt ? job.expiresAt.split("T")[0] : "",
      positionType: job.positionType || "rope_access",
    });
    setEditingJob(job);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/30">{t("jobBoard.status.active", "Active")}</Badge>;
      case "paused":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">{t("jobBoard.status.paused", "Paused")}</Badge>;
      case "closed":
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/30">{t("jobBoard.status.closed", "Closed")}</Badge>;
      case "expired":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/30">{t("jobBoard.status.expired", "Expired")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatSalary = (job: JobPosting) => {
    if (!job.salaryMin && !job.salaryMax) return null;
    const min = job.salaryMin ? `$${parseFloat(job.salaryMin).toLocaleString()}` : "";
    const max = job.salaryMax ? `$${parseFloat(job.salaryMax).toLocaleString()}` : "";
    const period = job.salaryPeriod ? `/${job.salaryPeriod}` : "";
    if (min && max) return `${min} - ${max}${period}`;
    if (min) return `${t("jobBoard.from", "From")} ${min}${period}`;
    if (max) return `${t("jobBoard.upTo", "Up to")} ${max}${period}`;
    return null;
  };

  useSetHeaderConfig({}, []);
  return (
    <div className="min-h-screen page-gradient">
      <main className="px-4 md:px-6 py-6 space-y-6">
        {/* Page Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <div>
              <h1 className="text-xl font-bold">{t("jobBoard.title", "Job Board")}</h1>
              <p className="text-sm text-muted-foreground">{t("jobBoard.subtitle", "Post and manage job opportunities")}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 mr-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("cards")}
                data-testid="button-jobs-view-cards"
              >
                <span className="material-icons text-sm">grid_view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                data-testid="button-jobs-view-list"
              >
                <span className="material-icons text-sm">view_list</span>
              </Button>
            </div>
            <Button 
              variant={showSentOffers ? "default" : "outline"}
              onClick={() => setShowSentOffers(!showSentOffers)} 
              className="gap-2" 
              data-testid="button-sent-offers"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t("jobBoard.sentOffers", "Sent Offers")}</span>
              {refusedOffers.length > 0 && (
                <Badge variant="destructive" className="ml-1">{refusedOffers.length}</Badge>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/talent-browser")} 
              className="gap-2" 
              data-testid="button-browse-talent"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{t("jobBoard.browseTalent", "Browse Talent")}</span>
              <span className="sm:hidden">{t("jobBoard.talent", "Talent")}</span>
            </Button>
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2" data-testid="button-create-job">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t("jobBoard.createJob", "Create Job Posting")}</span>
              <span className="sm:hidden">{t("jobBoard.create", "Create")}</span>
            </Button>
          </div>
        </div>

        {/* Sent Offers Section */}
        {showSentOffers && (
          <Card className="border-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  <CardTitle>{t("jobBoard.sentOffers", "Sent Offers")}</CardTitle>
                  <Badge variant="secondary">{sentOffers.length}</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSentOffers(false)} data-testid="button-close-sent-offers">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                {t("jobBoard.sentOffersDesc", "Track job offers you've sent to technicians")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sentOffers.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Mail className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>{t("jobBoard.noSentOffers", "No offers sent yet")}</p>
                </div>
              ) : (
                <>
                  {/* Pending Offers */}
                  {pendingOffers.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        {t("jobBoard.pendingOffers", "Pending Offers")}
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">{pendingOffers.length}</Badge>
                      </h4>
                      {pendingOffers.map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20" data-testid={`offer-pending-${offer.id}`}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={offer.technician?.photoUrl || undefined} />
                              <AvatarFallback>{offer.technician?.firstName?.[0] || offer.technician?.name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{offer.technician?.firstName && offer.technician?.lastName ? `${offer.technician.firstName} ${offer.technician.lastName}` : offer.technician?.name}</p>
                              <p className="text-xs text-muted-foreground">{offer.jobPosting?.title}</p>
                            </div>
                          </div>
                          <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">{t("jobBoard.offerPending", "Pending")}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Refused Offers */}
                  {refusedOffers.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <X className="w-4 h-4 text-destructive" />
                        {t("jobBoard.refusedOffers", "Declined Offers")}
                        <Badge variant="destructive">{refusedOffers.length}</Badge>
                      </h4>
                      {refusedOffers.map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20" data-testid={`offer-refused-${offer.id}`}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={offer.technician?.photoUrl || undefined} />
                              <AvatarFallback>{offer.technician?.firstName?.[0] || offer.technician?.name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{offer.technician?.firstName && offer.technician?.lastName ? `${offer.technician.firstName} ${offer.technician.lastName}` : offer.technician?.name}</p>
                              <p className="text-xs text-muted-foreground">{offer.jobPosting?.title}</p>
                            </div>
                          </div>
                          <Badge variant="destructive">{t("jobBoard.offerDeclined", "Declined")}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Accepted/Hired Offers */}
                  {acceptedOffers.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-500" />
                        {t("jobBoard.acceptedOffers", "Accepted Offers")}
                        <Badge className="bg-green-500/20 text-green-600 border-green-500/30">{acceptedOffers.length}</Badge>
                      </h4>
                      {acceptedOffers.map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20" data-testid={`offer-accepted-${offer.id}`}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={offer.technician?.photoUrl || undefined} />
                              <AvatarFallback>{offer.technician?.firstName?.[0] || offer.technician?.name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{offer.technician?.firstName && offer.technician?.lastName ? `${offer.technician.firstName} ${offer.technician.lastName}` : offer.technician?.name}</p>
                              <p className="text-xs text-muted-foreground">{offer.jobPosting?.title}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">{t("jobBoard.offerAccepted", "Hired")}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">{t("common.loading", "Loading...")}</div>
          </div>
        ) : jobPostings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{t("jobBoard.noPostings", "No Job Postings Yet")}</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-md">
                {t("jobBoard.noPostingsDesc", "Create your first job posting to start attracting qualified rope access technicians.")}
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                {t("jobBoard.createFirst", "Create First Job")}
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === "list" ? (
          /* List View - Table format */
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("jobBoard.table.title", "Title")}</TableHead>
                    <TableHead>{t("jobBoard.table.type", "Type")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("jobBoard.table.location", "Location")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("jobBoard.table.salary", "Salary")}</TableHead>
                    <TableHead>{t("jobBoard.table.status", "Status")}</TableHead>
                    <TableHead className="hidden xl:table-cell">{t("jobBoard.table.applications", "Applications")}</TableHead>
                    <TableHead className="text-right">{t("jobBoard.table.actions", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobPostings.map((job) => (
                    <TableRow 
                      key={job.id}
                      className="cursor-pointer"
                      onClick={() => setViewingApplicationsFor(job)}
                      data-testid={`row-job-${job.id}`}
                    >
                      <TableCell>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {POSITION_TYPES.find(pt => pt.value === job.positionType)?.label || job.positionType}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {JOB_TYPES.find(jt => jt.value === job.jobType)?.label || job.jobType}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {job.location || (job.isRemote ? t("jobBoard.remote", "Remote") : "-")}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden lg:table-cell">
                        {formatSalary(job) || "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <Badge variant="secondary">{getApplicationCount(job.id)}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(job); }}
                            title={job.status === "active" ? t("jobBoard.pause", "Pause") : t("jobBoard.resume", "Resume")}
                            data-testid={`button-toggle-status-${job.id}`}
                          >
                            {job.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); openEditDialog(job); }}
                            data-testid={`button-edit-job-${job.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(job.id); }}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-job-${job.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          /* Cards View - Multi-column grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobPostings.map((job) => (
              <Card 
                key={job.id} 
                className="shadow-sm hover:shadow-md hover:bg-muted/50 transition-all duration-200 cursor-pointer flex flex-col"
                onClick={() => setViewingApplicationsFor(job)}
                data-testid={`card-job-${job.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <CardTitle className="text-base truncate">{job.title}</CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(job.status)}
                        <Badge variant={job.positionType === "ground_crew" ? "secondary" : "default"} className="text-xs">
                          {POSITION_TYPES.find(pt => pt.value === job.positionType)?.label || job.positionType}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(job); }}
                        title={job.status === "active" ? t("jobBoard.pause", "Pause") : t("jobBoard.resume", "Resume")}
                        data-testid={`button-toggle-status-${job.id}`}
                      >
                        {job.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); openEditDialog(job); }}
                        data-testid={`button-edit-job-${job.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(job.id); }}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-delete-job-${job.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground mb-2">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                    )}
                    {job.isRemote && (
                      <Badge variant="outline" className="text-xs">{t("jobBoard.remote", "Remote")}</Badge>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {JOB_TYPES.find(jt => jt.value === job.jobType)?.label || job.jobType}
                    </span>
                  </div>
                  {formatSalary(job) && (
                    <div className="flex items-center gap-1 text-sm font-medium text-primary mb-2">
                      <DollarSign className="w-3 h-3" />
                      {formatSalary(job)}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                    {job.requiredIrataLevel && (
                      <span>IRATA: {job.requiredIrataLevel}</span>
                    )}
                    {job.requiredSpratLevel && (
                      <span>SPRAT: {job.requiredSpratLevel}</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t mt-auto">
                  <div className="flex items-center justify-between w-full text-xs text-muted-foreground pt-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(job.createdAt), "MMM d, yyyy")}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <FileText className="w-3 h-3" />
                        {getApplicationCount(job.id)} {t("jobBoard.applicants", "applicants")}
                      </Badge>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={isCreateOpen || !!editingJob} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingJob(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? t("jobBoard.editJob", "Edit Job Posting") : t("jobBoard.createJob", "Create Job Posting")}</DialogTitle>
            <DialogDescription>
              {editingJob ? t("jobBoard.editDesc", "Update the job posting details") : t("jobBoard.createDesc", "Fill in the details for the new job posting")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("jobBoard.form.title", "Job Title")} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t("jobBoard.form.titlePlaceholder", "e.g., Senior Rope Access Technician")}
                data-testid="input-job-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("jobBoard.form.description", "Description")} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t("jobBoard.form.descPlaceholder", "Describe the role and responsibilities...")}
                rows={4}
                data-testid="input-job-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">{t("jobBoard.form.requirements", "Requirements")}</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder={t("jobBoard.form.reqPlaceholder", "List the qualifications and requirements...")}
                rows={3}
                data-testid="input-job-requirements"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">{t("jobBoard.form.location", "Location")}</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t("jobBoard.form.locPlaceholder", "e.g., Vancouver, BC")}
                  data-testid="input-job-location"
                />
              </div>
              <div className="space-y-2 flex items-end pb-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="isRemote"
                    checked={formData.isRemote}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRemote: checked })}
                    data-testid="switch-remote"
                  />
                  <Label htmlFor="isRemote">{t("jobBoard.form.remote", "Remote position")}</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionType">{t("jobBoard.form.positionType", "Position Type")}</Label>
              <Select value={formData.positionType} onValueChange={(v) => setFormData({ ...formData, positionType: v })}>
                <SelectTrigger data-testid="select-position-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSITION_TYPES.map((pt) => (
                    <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t("jobBoard.form.positionTypeHint", "Select whether this position is for rope access technicians or ground crew")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobType">{t("jobBoard.form.jobType", "Job Type")}</Label>
                <Select value={formData.jobType} onValueChange={(v) => setFormData({ ...formData, jobType: v })}>
                  <SelectTrigger data-testid="select-job-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentType">{t("jobBoard.form.employmentType", "Employment Type")}</Label>
                <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v })}>
                  <SelectTrigger data-testid="select-employment-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">{t("jobBoard.form.salaryMin", "Salary Min")}</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  placeholder="25"
                  data-testid="input-salary-min"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">{t("jobBoard.form.salaryMax", "Salary Max")}</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  placeholder="45"
                  data-testid="input-salary-max"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryPeriod">{t("jobBoard.form.period", "Period")}</Label>
                <Select value={formData.salaryPeriod} onValueChange={(v) => setFormData({ ...formData, salaryPeriod: v })}>
                  <SelectTrigger data-testid="select-salary-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_PERIODS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requiredIrataLevel">{t("jobBoard.form.irataLevel", "Required IRATA Level")}</Label>
                <Select value={formData.requiredIrataLevel} onValueChange={(v) => setFormData({ ...formData, requiredIrataLevel: v })}>
                  <SelectTrigger data-testid="select-irata-level">
                    <SelectValue placeholder={t("jobBoard.form.notRequired", "Not Required")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CERT_LEVELS.map((t) => (
                      <SelectItem key={t.value || "none"} value={t.value || "none"}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requiredSpratLevel">{t("jobBoard.form.spratLevel", "Required SPRAT Level")}</Label>
                <Select value={formData.requiredSpratLevel} onValueChange={(v) => setFormData({ ...formData, requiredSpratLevel: v })}>
                  <SelectTrigger data-testid="select-sprat-level">
                    <SelectValue placeholder={t("jobBoard.form.notRequired", "Not Required")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CERT_LEVELS.map((t) => (
                      <SelectItem key={t.value || "none"} value={t.value || "none"}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">{t("jobBoard.form.startDate", "Job Start Date")}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  data-testid="input-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">{t("jobBoard.form.expiresAt", "Posting Expiration Date")}</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  data-testid="input-expires-at"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workDays">{t("jobBoard.form.workDays", "Work Days")}</Label>
                <Select value={formData.workDays} onValueChange={(v) => setFormData({ ...formData, workDays: v })}>
                  <SelectTrigger data-testid="select-work-days">
                    <SelectValue placeholder={t("jobBoard.form.selectSchedule", "Select schedule")} />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_DAYS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceRequired">{t("jobBoard.form.experience", "Experience Required")}</Label>
                <Select value={formData.experienceRequired} onValueChange={(v) => setFormData({ ...formData, experienceRequired: v })}>
                  <SelectTrigger data-testid="select-experience">
                    <SelectValue placeholder={t("jobBoard.form.selectExperience", "Select experience level")} />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value || "none"} value={opt.value || "none"}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">{t("jobBoard.form.benefits", "Benefits Offered")}</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder={t("jobBoard.form.benefitsPlaceholder", "Health insurance, dental, vision, 401k, PTO, etc.")}
                rows={3}
                data-testid="textarea-benefits"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateOpen(false);
              setEditingJob(null);
              resetForm();
            }}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              onClick={editingJob ? handleUpdate : handleCreate}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-submit-job"
            >
              {createMutation.isPending || updateMutation.isPending 
                ? t("common.saving", "Saving...") 
                : editingJob 
                  ? t("common.update", "Update") 
                  : t("common.create", "Create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("jobBoard.deleteConfirm", "Delete Job Posting?")}</DialogTitle>
            <DialogDescription>
              {t("jobBoard.deleteDesc", "This action cannot be undone. The job posting will be permanently removed.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>{t("common.cancel", "Cancel")}</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? t("common.deleting", "Deleting...") : t("common.delete", "Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingApplicationsFor} onOpenChange={(open) => {
        if (!open) {
          setViewingApplicationsFor(null);
          queryClient.invalidateQueries({ queryKey: ["/api/job-applications/counts"] });
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t("jobBoard.applications", "Applications")}
            </DialogTitle>
            <DialogDescription>
              {viewingApplicationsFor?.title} - {currentApplications.length} {currentApplications.length === 1 ? t("jobBoard.applicant", "applicant") : t("jobBoard.applicants", "applicants")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {currentApplications.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">{t("jobBoard.noApplications", "No applications yet")}</p>
              </div>
            ) : (
              <>
                {newApplications.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Badge variant="default">{newApplications.length}</Badge>
                      {t("jobBoard.newApplications", "New Applications")}
                    </h3>
                    {newApplications.filter(app => app.technician).map((app) => (
                      <Card key={app.id} className="border-primary/50" data-testid={`card-new-application-${app.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={app.technician?.photoUrl || undefined} />
                              <AvatarFallback>
                                {app.technician?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold">{app.technician ? getDisplayName(app.technician) : 'Unknown'}</h4>
                                {app.technician?.irataLevel && (
                                  <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                                    IRATA {app.technician.irataLevel}
                                  </Badge>
                                )}
                                {app.technician?.spratLevel && (
                                  <Badge variant="outline" className="text-xs border-purple-500 text-purple-600">
                                    SPRAT {app.technician.spratLevel}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                                {app.technician && getLocation(app.technician) && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {getLocation(app.technician)}
                                  </span>
                                )}
                                {app.technician?.ropeAccessStartDate && (
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    {getYearsExperience(app.technician.ropeAccessStartDate)} {t("jobBoard.yearsExp", "years exp.")}
                                  </span>
                                )}
                              </div>
                              {app.coverMessage && (
                                <p className="text-sm mt-2 bg-muted/50 p-2 rounded-md">{app.coverMessage}</p>
                              )}
                              <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {t("jobBoard.appliedOn", "Applied")} {format(new Date(app.appliedAt), "MMM d, yyyy")}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedApplication(app)}
                                    data-testid={`button-view-profile-${app.id}`}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    {t("jobBoard.viewProfile", "View Profile")}
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedApplication(app);
                                      setShowJobOfferDialog(true);
                                    }}
                                    data-testid={`button-send-offer-${app.id}`}
                                  >
                                    <Send className="w-3 h-3 mr-1" />
                                    {t("jobBoard.sendOffer", "Send Offer")}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setDeleteApplicationId(app.id)}
                                    data-testid={`button-delete-application-${app.id}`}
                                  >
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {viewedApplications.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
                      <Badge variant="secondary">{viewedApplications.length}</Badge>
                      {t("jobBoard.viewedApplications", "Viewed Applications")}
                    </h3>
                    {viewedApplications.filter(app => app.technician).map((app) => (
                      <Card key={app.id} data-testid={`card-viewed-application-${app.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={app.technician?.photoUrl || undefined} />
                              <AvatarFallback>
                                {app.technician?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold">{app.technician ? getDisplayName(app.technician) : 'Unknown'}</h4>
                                {app.technician?.irataLevel && (
                                  <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                                    IRATA {app.technician.irataLevel}
                                  </Badge>
                                )}
                                {app.technician?.spratLevel && (
                                  <Badge variant="outline" className="text-xs border-purple-500 text-purple-600">
                                    SPRAT {app.technician.spratLevel}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                                {app.technician && getLocation(app.technician) && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {getLocation(app.technician)}
                                  </span>
                                )}
                                {app.technician?.ropeAccessStartDate && (
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    {getYearsExperience(app.technician.ropeAccessStartDate)} {t("jobBoard.yearsExp", "years exp.")}
                                  </span>
                                )}
                              </div>
                              {app.coverMessage && (
                                <p className="text-sm mt-2 bg-muted/50 p-2 rounded-md">{app.coverMessage}</p>
                              )}
                              <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {t("jobBoard.appliedOn", "Applied")} {format(new Date(app.appliedAt), "MMM d, yyyy")}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedApplication(app)}
                                    data-testid={`button-view-profile-viewed-${app.id}`}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    {t("jobBoard.viewProfile", "View Profile")}
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedApplication(app);
                                      setShowJobOfferDialog(true);
                                    }}
                                    data-testid={`button-send-offer-viewed-${app.id}`}
                                  >
                                    <Send className="w-3 h-3 mr-1" />
                                    {t("jobBoard.sendOffer", "Send Offer")}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setDeleteApplicationId(app.id)}
                                    data-testid={`button-delete-application-viewed-${app.id}`}
                                  >
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingApplicationsFor(null)}>
              {t("common.close", "Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Technician Profile Dialog */}
      <Dialog open={!!selectedApplication && !showJobOfferDialog} onOpenChange={(open) => !open && setSelectedApplication(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedApplication?.technician && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedApplication.technician.photoUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xl">
                      {selectedApplication.technician.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{getDisplayName(selectedApplication.technician)}</DialogTitle>
                    {getLocation(selectedApplication.technician) && (
                      <DialogDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {getLocation(selectedApplication.technician)}
                      </DialogDescription>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {selectedApplication.technician.ropeAccessStartDate && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("jobBoard.experience", "Experience")}</p>
                      <p className="font-medium">
                        {getYearsExperience(selectedApplication.technician.ropeAccessStartDate)}+ {t("jobBoard.yearsInRopeAccess", "years in rope access")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("jobBoard.since", "Since")} {formatDate(selectedApplication.technician.ropeAccessStartDate)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {t("jobBoard.certifications", "Certifications")}
                  </h4>

                  {selectedApplication.technician.irataLevel && (
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Badge>IRATA {selectedApplication.technician.irataLevel}</Badge>
                        {isExpired(selectedApplication.technician.irataExpirationDate) && (
                          <Badge variant="destructive">{t("jobBoard.expired", "Expired")}</Badge>
                        )}
                        {isExpiringSoon(selectedApplication.technician.irataExpirationDate) && !isExpired(selectedApplication.technician.irataExpirationDate) && (
                          <Badge variant="secondary">{t("jobBoard.expiringSoon", "Expiring Soon")}</Badge>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        {selectedApplication.technician.irataLicenseNumber && (
                          <p>{t("jobBoard.license", "License")}: {selectedApplication.technician.irataLicenseNumber}</p>
                        )}
                        {selectedApplication.technician.irataExpirationDate && (
                          <p>{t("jobBoard.expires", "Expires")}: {formatDate(selectedApplication.technician.irataExpirationDate)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedApplication.technician.spratLevel && (
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Badge>SPRAT {selectedApplication.technician.spratLevel}</Badge>
                        {isExpired(selectedApplication.technician.spratExpirationDate) && (
                          <Badge variant="destructive">{t("jobBoard.expired", "Expired")}</Badge>
                        )}
                        {isExpiringSoon(selectedApplication.technician.spratExpirationDate) && !isExpired(selectedApplication.technician.spratExpirationDate) && (
                          <Badge variant="secondary">{t("jobBoard.expiringSoon", "Expiring Soon")}</Badge>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        {selectedApplication.technician.spratLicenseNumber && (
                          <p>{t("jobBoard.license", "License")}: {selectedApplication.technician.spratLicenseNumber}</p>
                        )}
                        {selectedApplication.technician.spratExpirationDate && (
                          <p>{t("jobBoard.expires", "Expires")}: {formatDate(selectedApplication.technician.spratExpirationDate)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {!selectedApplication.technician.irataLevel && !selectedApplication.technician.spratLevel && (
                    <p className="text-sm text-muted-foreground italic">{t("jobBoard.noCertifications", "No certifications listed")}</p>
                  )}
                </div>

                {selectedApplication.technician.resumeDocuments && selectedApplication.technician.resumeDocuments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {t("jobBoard.resumeCV", "Resume/CV")}
                    </h4>
                    <div className="space-y-2">
                      {selectedApplication.technician.resumeDocuments.map((doc, index) => {
                        const docUrl = typeof doc === 'string' ? doc : doc.url;
                        const docName = typeof doc === 'string' ? `Resume ${index + 1}` : (doc.name || `Resume ${index + 1}`);
                        return (
                          <a
                            key={index}
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg border hover-elevate"
                            data-testid={`link-resume-${index}`}
                          >
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="flex-1 truncate text-sm">{docName}</span>
                            <Download className="w-4 h-4 text-muted-foreground" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedApplication.coverMessage && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">{t("jobBoard.coverMessage", "Cover Message")}</h4>
                    <p className="text-sm p-3 rounded-lg bg-muted/50">{selectedApplication.coverMessage}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => setShowJobOfferDialog(true)}
                    className="w-full gap-2"
                    data-testid="button-send-job-offer-profile"
                  >
                    <Send className="w-4 h-4" />
                    {t("jobBoard.sendJobOffer", "Send Job Offer")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Offer Dialog */}
      <Dialog open={showJobOfferDialog} onOpenChange={(open) => {
        setShowJobOfferDialog(open);
        if (!open) {
          setSelectedJobIdForOffer("");
          setOfferMessage("");
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {t("jobBoard.sendJobOffer", "Send Job Offer")}
            </DialogTitle>
            {selectedApplication?.technician && (
              <DialogDescription>
                {getDisplayName(selectedApplication.technician)}
              </DialogDescription>
            )}
          </DialogHeader>

          {activeJobs.length === 0 ? (
            <div className="py-6 text-center">
              <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <h4 className="font-semibold mb-1">{t("jobBoard.noActiveJobsForOffer", "No Active Jobs")}</h4>
              <p className="text-sm text-muted-foreground mb-4">{t("jobBoard.createJobFirst", "Create a job posting first to send offers")}</p>
              <Button onClick={() => {
                setShowJobOfferDialog(false);
                setIsCreateOpen(true);
              }} data-testid="button-create-job-from-offer">
                {t("jobBoard.createJob", "Create Job")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>{t("jobBoard.selectJob", "Select Job")}</Label>
                <Select value={selectedJobIdForOffer} onValueChange={setSelectedJobIdForOffer}>
                  <SelectTrigger data-testid="select-job-for-offer">
                    <SelectValue placeholder={t("jobBoard.selectJobPlaceholder", "Choose a job posting...")} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeJobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        <div className="flex items-center gap-2">
                          <span>{job.title}</span>
                          {job.location && (
                            <span className="text-xs text-muted-foreground">- {job.location}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("jobBoard.message", "Message")} ({t("common.optional", "optional")})</Label>
                <Textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder={t("jobBoard.offerMessagePlaceholder", "Add a personal message to your offer...")}
                  rows={3}
                  data-testid="input-offer-message"
                />
              </div>
            </div>
          )}

          {activeJobs.length > 0 && (
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowJobOfferDialog(false)}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                onClick={() => {
                  if (selectedApplication && selectedJobIdForOffer) {
                    sendOfferMutation.mutate({
                      technicianId: selectedApplication.technicianId,
                      jobPostingId: selectedJobIdForOffer,
                      message: offerMessage || undefined,
                    });
                  }
                }}
                disabled={!selectedJobIdForOffer || sendOfferMutation.isPending}
                data-testid="button-confirm-send-offer"
              >
                {sendOfferMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Send className="w-4 h-4 mr-2" />
                {t("jobBoard.sendOffer", "Send Offer")}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Application Confirmation */}
      <Dialog open={!!deleteApplicationId} onOpenChange={() => setDeleteApplicationId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("jobBoard.deleteApplicationConfirm", "Remove Application?")}</DialogTitle>
            <DialogDescription>
              {t("jobBoard.deleteApplicationDesc", "This application will be removed. The technician will no longer appear in your applicants list.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteApplicationId(null)}>{t("common.cancel", "Cancel")}</Button>
            <Button
              variant="destructive"
              onClick={() => deleteApplicationId && deleteApplicationMutation.mutate(deleteApplicationId)}
              disabled={deleteApplicationMutation.isPending}
              data-testid="button-confirm-delete-application"
            >
              {deleteApplicationMutation.isPending ? t("common.removing", "Removing...") : t("common.remove", "Remove")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
