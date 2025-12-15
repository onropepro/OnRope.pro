import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { JOB_TYPES, getJobTypeConfig } from "@shared/jobTypes";
import type { Project, WorkNotice } from "@shared/schema";

interface WorkNoticeFormProps {
  project: Project;
  existingNotice?: WorkNotice;
  onClose: () => void;
  onSuccess?: () => void;
}

const workNoticeFormSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  noticeTitle: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  noticeDetails: z.string().min(1, "Notice details are required"),
  additionalInstructions: z.string().optional(),
  propertyManagerName: z.string().optional(),
});

type WorkNoticeFormData = z.infer<typeof workNoticeFormSchema>;

const NOTICE_TEMPLATES: Record<string, { title: string; details: string }[]> = {
  window_cleaning: [
    {
      title: "Window Cleaning Notice",
      details: "Our professional window cleaning team will be on site to clean the exterior windows of your building. For your privacy, please close your blinds or curtains during work hours. We apologize for any inconvenience and appreciate your cooperation.",
    },
    {
      title: "Scheduled Window Maintenance",
      details: "We will be performing scheduled window cleaning services. Technicians will be working on ropes outside your windows. Please keep blinds closed and avoid opening windows during this time. Thank you for your understanding.",
    },
  ],
  dryer_vent_cleaning: [
    {
      title: "Exterior Dryer Vent Cleaning Notice",
      details: "Our team will be cleaning the exterior dryer vents on your building. This is important maintenance that helps prevent fire hazards and improves dryer efficiency. No action is required from residents, but please be aware of workers on ropes near your unit.",
    },
  ],
  building_wash: [
    {
      title: "Building Wash Notice",
      details: "We will be pressure washing the exterior of your building. Please ensure all windows are closed and any outdoor items on balconies are secured or brought inside. There may be some noise during the work, and we appreciate your patience.",
    },
    {
      title: "Facade Cleaning Notice",
      details: "Professional building washing services are scheduled. Workers will be on ropes cleaning the building exterior. Please close all windows and keep balcony doors shut during work hours. Thank you for your cooperation.",
    },
  ],
  gutter_cleaning: [
    {
      title: "Gutter Cleaning Notice",
      details: "Our team will be on site to clean and inspect the building gutters. This helps prevent water damage and maintains proper drainage. Workers may be visible from upper floor windows. Thank you for your understanding.",
    },
  ],
  in_suite_dryer_vent_cleaning: [
    {
      title: "In-Suite Dryer Vent Cleaning Notice",
      details: "We will be cleaning dryer vents inside individual units. Our technicians will need access to your suite. Please ensure your dryer is accessible and the area around it is clear. You will receive a separate notice with your scheduled time slot.",
    },
  ],
  parkade_pressure_cleaning: [
    {
      title: "Parkade Cleaning Notice",
      details: "The parking garage will be pressure washed. Please move your vehicle from the parkade during the scheduled cleaning time. Failure to move your vehicle may result in it being wet or splashed with cleaning solution.",
    },
  ],
  painting: [
    {
      title: "Exterior Painting Notice",
      details: "Professional painters will be working on the exterior of your building. Please keep windows closed and avoid touching freshly painted surfaces. There may be paint odors during and after work hours. Thank you for your patience.",
    },
  ],
  caulking: [
    {
      title: "Caulking and Sealing Notice",
      details: "Our team will be performing caulking and sealing work on the building exterior. This helps prevent water infiltration and improves energy efficiency. Workers will be on ropes near windows and balconies.",
    },
  ],
  inspection: [
    {
      title: "Building Inspection Notice",
      details: "A scheduled building inspection will take place. Our inspectors will be examining the building exterior and may be visible from your windows. No action is required from residents.",
    },
  ],
  general_pressure_washing: [
    {
      title: "Pressure Washing Notice",
      details: "General pressure washing services are scheduled. Please close all windows and secure any outdoor items. There may be water spray and noise during the work. Thank you for your cooperation.",
    },
  ],
  ground_window_cleaning: [
    {
      title: "Ground Level Window Cleaning",
      details: "Our team will be cleaning ground floor and accessible windows. Please be aware of workers and cleaning equipment near entrances and ground-level units. We appreciate your patience.",
    },
  ],
  anchor_inspection: [
    {
      title: "Rope Access Anchor Inspection",
      details: "A scheduled inspection of the building's rope access anchor points will take place. Inspectors may be visible on the roof and exterior. This is important safety maintenance. No action is required from residents.",
    },
  ],
  other: [
    {
      title: "Scheduled Maintenance Notice",
      details: "Scheduled building maintenance work will be performed. Our professional team will be on site. We appreciate your patience and cooperation during this time.",
    },
  ],
};

const DEFAULT_TEMPLATE = {
  title: "Scheduled Work Notice",
  details: "Professional maintenance work will be performed on your building. Our team will be on site during the scheduled dates. We appreciate your patience and cooperation.",
};

export function WorkNoticeForm({ project, existingNotice, onClose, onSuccess }: WorkNoticeFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const jobTypeConfig = getJobTypeConfig(project.jobType);
  const jobTypeName = project.customJobType || jobTypeConfig?.label || project.jobType;
  const templates = NOTICE_TEMPLATES[project.jobType] || NOTICE_TEMPLATES.other;

  const form = useForm<WorkNoticeFormData>({
    resolver: zodResolver(workNoticeFormSchema),
    defaultValues: {
      startDate: existingNotice?.startDate || project.startDate || "",
      endDate: existingNotice?.endDate || project.endDate || "",
      noticeTitle: existingNotice?.noticeTitle || "",
      noticeDetails: existingNotice?.noticeDetails || "",
      additionalInstructions: existingNotice?.additionalInstructions || "",
      propertyManagerName: existingNotice?.propertyManagerName || "",
    },
  });

  const createNoticeMutation = useMutation({
    mutationFn: async (data: WorkNoticeFormData) => {
      return apiRequest("POST", `/api/projects/${project.id}/work-notices`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id, "work-notices"] });
      toast({ title: "Work notice created", description: "The notice is now visible to residents." });
      onSuccess?.();
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateNoticeMutation = useMutation({
    mutationFn: async (data: WorkNoticeFormData) => {
      return apiRequest("PATCH", `/api/work-notices/${existingNotice!.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", project.id, "work-notices"] });
      toast({ title: "Work notice updated" });
      onSuccess?.();
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleTemplateSelect = (index: number) => {
    const template = templates[index];
    if (template) {
      form.setValue("noticeTitle", template.title);
      form.setValue("noticeDetails", template.details);
      setSelectedTemplate(String(index));
    }
  };

  const onSubmit = (data: WorkNoticeFormData) => {
    if (existingNotice) {
      updateNoticeMutation.mutate(data);
    } else {
      createNoticeMutation.mutate(data);
    }
  };

  const isSubmitting = createNoticeMutation.isPending || updateNoticeMutation.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="material-icons text-muted-foreground">info</span>
            Project Information (Auto-filled)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-muted-foreground">Building:</span>
              <span className="ml-2 font-medium">{project.buildingName || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Strata:</span>
              <span className="ml-2 font-medium">{project.strataPlanNumber || "N/A"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Address:</span>
              <span className="ml-2 font-medium">{project.buildingAddress || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Job Type:</span>
              <span className="ml-2">
                <Badge variant="secondary">{jobTypeName}</Badge>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Label className="text-sm font-medium mb-3 block">Quick Templates</Label>
        <div className="flex flex-wrap gap-2">
          {templates.map((template, index) => (
            <Button
              key={index}
              type="button"
              variant={selectedTemplate === String(index) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTemplateSelect(index)}
              data-testid={`button-template-${index}`}
            >
              {template.title}
            </Button>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="propertyManagerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Manager Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} className="h-12" data-testid="input-property-manager" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-12" data-testid="input-start-date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="h-12" data-testid="input-end-date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="noticeTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Title</FormLabel>
                <FormControl>
                  <Input placeholder="Window Cleaning Notice" {...field} className="h-12" data-testid="input-notice-title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="noticeDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter the notice details that will be shown to residents..."
                    className="min-h-32 resize-y"
                    {...field}
                    data-testid="textarea-notice-details"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Instructions (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional instructions for residents..."
                    className="min-h-20 resize-y"
                    {...field}
                    data-testid="textarea-additional-instructions"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <span className="material-icons text-primary">chat</span>
                <div>
                  <p className="text-sm font-medium">Resident Communication</p>
                  <p className="text-sm text-muted-foreground">
                    Residents can view this notice and submit questions or concerns through the app. 
                    You'll receive notifications when residents respond.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-notice">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} data-testid="button-save-notice">
              {isSubmitting ? (
                <>
                  <span className="material-icons animate-spin mr-2">refresh</span>
                  Saving...
                </>
              ) : existingNotice ? (
                "Update Notice"
              ) : (
                <>
                  <span className="material-icons mr-2">send</span>
                  Create Notice
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface WorkNoticeListProps {
  projectId: string;
  project: Project;
}

export function WorkNoticeList({ projectId, project }: WorkNoticeListProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState<WorkNotice | null>(null);

  const { data: noticesData, isLoading } = useQuery<{ notices: WorkNotice[] }>({
    queryKey: ["/api/projects", projectId, "work-notices"],
    enabled: !!projectId,
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async (noticeId: string) => {
      return apiRequest("DELETE", `/api/work-notices/${noticeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "work-notices"] });
      toast({ title: "Work notice deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const notices = noticesData?.notices || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="material-icons">campaign</span>
          Work Notices
        </h3>
        <Button onClick={() => setShowCreateForm(true)} data-testid="button-create-work-notice">
          <span className="material-icons mr-2">add</span>
          Create Notice
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <span className="material-icons animate-spin text-muted-foreground">refresh</span>
        </div>
      ) : notices.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <span className="material-icons text-4xl text-muted-foreground mb-2">campaign</span>
            <p className="text-muted-foreground">No work notices yet</p>
            <p className="text-sm text-muted-foreground">Create a notice to inform residents about upcoming work</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <Card key={notice.id} className="hover-elevate" data-testid={`work-notice-card-${notice.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{notice.noticeTitle}</h4>
                      <Badge variant={notice.isPublished ? "default" : "secondary"}>
                        {notice.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {notice.noticeDetails}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="material-icons text-sm">event</span>
                        {notice.startDate} - {notice.endDate}
                      </span>
                      {notice.propertyManagerName && (
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-sm">person</span>
                          {notice.propertyManagerName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingNotice(notice)}
                      data-testid={`button-edit-notice-${notice.id}`}
                    >
                      <span className="material-icons">edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNoticeMutation.mutate(notice.id)}
                      data-testid={`button-delete-notice-${notice.id}`}
                    >
                      <span className="material-icons text-destructive">delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">campaign</span>
              Create Work Notice
            </DialogTitle>
            <DialogDescription>
              Create a notice for residents about upcoming work at {project.buildingName || "this building"}.
            </DialogDescription>
          </DialogHeader>
          <WorkNoticeForm
            project={project}
            onClose={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingNotice} onOpenChange={(open) => !open && setEditingNotice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons">edit</span>
              Edit Work Notice
            </DialogTitle>
            <DialogDescription>
              Update the notice for residents at {project.buildingName || "this building"}.
            </DialogDescription>
          </DialogHeader>
          {editingNotice && (
            <WorkNoticeForm
              project={project}
              existingNotice={editingNotice}
              onClose={() => setEditingNotice(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
