import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSetHeaderConfig } from "@/components/DashboardLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  JOB_TYPES,
  EMPLOYMENT_TYPES,
  SALARY_PERIODS,
  CERT_LEVELS,
  WORK_DAYS_OPTIONS,
  EXPERIENCE_OPTIONS,
  POSITION_TYPES,
  DEFAULT_JOB_POSTING_FORM,
  type JobPostingFormData,
} from "@/lib/job-board-constants";

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

export default function JobPostingForm() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const params = useParams<{ id?: string }>();
  const { toast } = useToast();
  const isEditMode = !!params.id;

  const [formData, setFormData] = useState<JobPostingFormData>(DEFAULT_JOB_POSTING_FORM);

  const { data: jobData, isLoading: isLoadingJob } = useQuery<{ jobPosting: JobPosting }>({
    queryKey: ["/api/job-postings", params.id],
    enabled: isEditMode,
    queryFn: async () => {
      const res = await fetch(`/api/job-postings/${params.id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch job posting");
      return res.json();
    },
  });

  useEffect(() => {
    if (jobData?.jobPosting) {
      const job = jobData.jobPosting;
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
    }
  }, [jobData]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/job-postings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-postings"] });
      toast({ title: t("jobBoard.created", "Job posting created successfully") });
      setLocation("/job-board");
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
      toast({ title: t("jobBoard.updated", "Job posting updated successfully") });
      setLocation("/job-board");
    },
    onError: (error: any) => {
      toast({ title: t("jobBoard.updateFailed", "Failed to update job posting"), description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast({ title: t("jobBoard.fillRequired", "Please fill in required fields"), variant: "destructive" });
      return;
    }

    const payload = {
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
    };

    if (isEditMode && params.id) {
      updateMutation.mutate({ id: params.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  useSetHeaderConfig({}, []);

  if (isEditMode && isLoadingJob) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient">
      <main className="px-4 md:px-6 py-6 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/job-board")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <div>
              <h1 className="text-xl font-bold">
                {isEditMode ? t("jobBoard.editJob", "Edit Job Posting") : t("jobBoard.createJob", "Create Job Posting")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditMode ? t("jobBoard.editDesc", "Update the job posting details") : t("jobBoard.createDesc", "Fill in the details for the new job posting")}
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("jobBoard.form.basicInfo", "Basic Information")}</CardTitle>
            <CardDescription>{t("jobBoard.form.basicInfoDesc", "Enter the main details of the job posting")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("jobBoard.form.employmentDetails", "Employment Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobType">{t("jobBoard.form.jobType", "Job Type")}</Label>
                <Select value={formData.jobType} onValueChange={(v) => setFormData({ ...formData, jobType: v })}>
                  <SelectTrigger data-testid="select-job-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((jt) => (
                      <SelectItem key={jt.value} value={jt.value}>{jt.label}</SelectItem>
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
                    {EMPLOYMENT_TYPES.map((et) => (
                      <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>
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
                    {SALARY_PERIODS.map((sp) => (
                      <SelectItem key={sp.value} value={sp.value}>{sp.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("jobBoard.form.certifications", "Certifications & Requirements")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requiredIrataLevel">{t("jobBoard.form.irataLevel", "Required IRATA Level")}</Label>
                <Select value={formData.requiredIrataLevel} onValueChange={(v) => setFormData({ ...formData, requiredIrataLevel: v })}>
                  <SelectTrigger data-testid="select-irata-level">
                    <SelectValue placeholder={t("jobBoard.form.notRequired", "Not Required")} />
                  </SelectTrigger>
                  <SelectContent>
                    {CERT_LEVELS.map((cl) => (
                      <SelectItem key={cl.value || "none"} value={cl.value || "none"}>{cl.label}</SelectItem>
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
                    {CERT_LEVELS.map((cl) => (
                      <SelectItem key={cl.value || "none"} value={cl.value || "none"}>{cl.label}</SelectItem>
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
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pb-6">
          <Button variant="outline" onClick={() => setLocation("/job-board")} data-testid="button-cancel">
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} data-testid="button-submit-job">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("common.saving", "Saving...")}
              </>
            ) : isEditMode ? (
              t("common.update", "Update")
            ) : (
              t("common.create", "Create")
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
