import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Plus, Briefcase, MapPin, DollarSign, Calendar, Edit, Trash2, Pause, Play, ArrowLeft, Users, FileText, Eye, Mail, Award, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  status: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
};

type Technician = {
  id: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  photoUrl: string | null;
  irataLevel: string | null;
  spratLevel: string | null;
  employeeCity: string | null;
  employeeProvinceState: string | null;
  ropeAccessStartDate: string | null;
  resumeDocuments: string[] | null;
};

type JobApplication = {
  id: string;
  technicianId: string;
  jobPostingId: string;
  status: string;
  coverMessage: string | null;
  appliedAt: string;
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

export default function CompanyJobBoard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [viewingApplicationsFor, setViewingApplicationsFor] = useState<JobPosting | null>(null);

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

  return (
    <div className="min-h-screen page-gradient">
      <header className="sticky top-0 z-[100] glass backdrop-blur-xl border-b border-border/50 shadow-premium">
        <div className="px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between max-w-7xl mx-auto gap-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/dashboard")}
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold gradient-text">
                {t("jobBoard.title", "Job Board")}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {t("jobBoard.subtitle", "Post and manage job opportunities")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
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
        ) : (
          <div className="grid gap-4">
            {jobPostings.map((job) => (
              <Card key={job.id} data-testid={`card-job-${job.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-base sm:text-lg truncate">{job.title}</CardTitle>
                        {getStatusBadge(job.status)}
                      </div>
                      <CardDescription className="flex items-center gap-3 flex-wrap text-xs sm:text-sm">
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
                          {JOB_TYPES.find(t => t.value === job.jobType)?.label || job.jobType}
                        </span>
                        {formatSalary(job) && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatSalary(job)}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(job)}
                        title={job.status === "active" ? t("jobBoard.pause", "Pause") : t("jobBoard.resume", "Resume")}
                        data-testid={`button-toggle-status-${job.id}`}
                      >
                        {job.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(job)}
                        data-testid={`button-edit-job-${job.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirmId(job.id)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`button-delete-job-${job.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                    {job.requiredIrataLevel && (
                      <span>IRATA: {job.requiredIrataLevel}</span>
                    )}
                    {job.requiredSpratLevel && (
                      <span>SPRAT: {job.requiredSpratLevel}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {t("jobBoard.posted", "Posted")} {format(new Date(job.createdAt), "MMM d, yyyy")}
                    </span>
                    {job.expiresAt && (
                      <span>{t("jobBoard.expires", "Expires")} {format(new Date(job.expiresAt), "MMM d, yyyy")}</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setViewingApplicationsFor(job)}
                    data-testid={`button-view-applications-${job.id}`}
                  >
                    <FileText className="w-4 h-4" />
                    {t("jobBoard.viewApplications", "View Applications")}
                    {getApplicationCount(job.id) > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {getApplicationCount(job.id)}
                      </Badge>
                    )}
                  </Button>
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

          <div className="space-y-4 py-4">
            {currentApplications.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">{t("jobBoard.noApplications", "No applications yet")}</p>
              </div>
            ) : (
              currentApplications.filter(app => app.technician).map((app) => (
                <Card key={app.id} data-testid={`card-application-${app.id}`}>
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
                          <h4 className="font-semibold">{app.technician?.name || 'Unknown'}</h4>
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
                          {app.technician?.employeeCity && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {app.technician.employeeCity}{app.technician.employeeProvinceState ? `, ${app.technician.employeeProvinceState}` : ''}
                            </span>
                          )}
                          {app.technician?.ropeAccessStartDate && (
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {Math.floor((Date.now() - new Date(app.technician.ropeAccessStartDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} {t("jobBoard.yearsExp", "years exp.")}
                            </span>
                          )}
                        </div>
                        {app.coverMessage && (
                          <p className="text-sm mt-2 bg-muted/50 p-2 rounded-md">{app.coverMessage}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">
                            {t("jobBoard.appliedOn", "Applied")} {format(new Date(app.appliedAt), "MMM d, yyyy")}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/talent-browser?applicant=${app.technicianId}`)}
                            data-testid={`button-view-profile-${app.id}`}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            {t("jobBoard.viewProfile", "View Profile")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingApplicationsFor(null)}>
              {t("common.close", "Close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
