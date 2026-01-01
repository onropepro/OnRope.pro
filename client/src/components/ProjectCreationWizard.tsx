import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Check, ChevronsUpDown, HelpCircle, ArrowLeft, ArrowRight, Sparkles, Building2, Calendar, Users, Target, FileText, CheckCircle2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { JOB_CATEGORIES, getJobTypesByCategory, getJobTypeConfig, isDropBasedJobType, getAllJobTypeValues, getProgressType, type JobCategory } from "@shared/jobTypes";
import type { Client, User } from "@shared/schema";

const ALL_JOB_TYPE_VALUES = getAllJobTypeValues() as [string, ...string[]];

const wizardSchema = z.object({
  jobCategory: z.enum(['building_maintenance', 'ndt', 'rock_scaling', 'wind_turbine', 'oil_field']).default('building_maintenance'),
  jobType: z.string().min(1, "Please select a job type"),
  customJobType: z.string().optional(),
  clientId: z.string().optional(),
  strataPlanNumber: z.string().optional(),
  buildingName: z.string().optional(),
  buildingAddress: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalDropsNorth: z.string().optional(),
  totalDropsEast: z.string().optional(),
  totalDropsSouth: z.string().optional(),
  totalDropsWest: z.string().optional(),
  dailyDropTarget: z.string().optional(),
  floorCount: z.string().optional(),
  totalSuites: z.string().optional(),
  totalStalls: z.string().optional(),
  estimatedHours: z.string().optional(),
  assignedEmployees: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

type WizardFormData = z.infer<typeof wizardSchema>;

interface WizardStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  appContext: string;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: "job-category",
    title: "Work Category",
    icon: <Sparkles className="h-5 w-5" />,
    description: "What type of work will you be doing?",
    appContext: "Categories organize your job types. Building maintenance covers window cleaning, pressure washing, etc. Other categories include NDT inspections, rock scaling, and more.",
  },
  {
    id: "job-type",
    title: "Job Type",
    icon: <Target className="h-5 w-5" />,
    description: "Select the specific type of work",
    appContext: "Job type determines how progress is tracked (drops, suites, stalls, or hours). It also sets the icon shown on calendars and how the Building Portal displays your work.",
  },
  {
    id: "client",
    title: "Client",
    icon: <Building2 className="h-5 w-5" />,
    description: "Which client is this project for?",
    appContext: "Linking to a client connects this project to your CRM. The client's buildings become available to select, and any invoices or quotes will be tied to this client.",
  },
  {
    id: "building",
    title: "Building",
    icon: <Building2 className="h-5 w-5" />,
    description: "Select or enter the building details",
    appContext: "The building gets its own portal access where property managers can view progress, submit feedback, and access work notices. Each building has a unique password.",
  },
  {
    id: "dates",
    title: "Project Dates",
    icon: <Calendar className="h-5 w-5" />,
    description: "When does the work start and end?",
    appContext: "These dates appear on your Job Schedule calendar and automatically create scheduled jobs. Weather alerts will be checked for your work days.",
  },
  {
    id: "scope",
    title: "Work Scope",
    icon: <Target className="h-5 w-5" />,
    description: "Define the scope of work",
    appContext: "This powers the progress bars shown everywhere - your dashboard, Building Portal, and resident view. For drops-based work, set the count per building elevation.",
  },
  {
    id: "daily-target",
    title: "Daily Target",
    icon: <Target className="h-5 w-5" />,
    description: "Set productivity goals",
    appContext: "Daily targets help track productivity. Reports will compare actual work completed vs. your target, helping identify efficient crews and optimize scheduling.",
  },
  {
    id: "team",
    title: "Team Assignment",
    icon: <Users className="h-5 w-5" />,
    description: "Assign technicians to this project",
    appContext: "Assigned technicians will see this project in their mobile app. They can clock in/out, log drops completed, and submit safety forms directly from their phones.",
  },
  {
    id: "notes",
    title: "Project Notes",
    icon: <FileText className="h-5 w-5" />,
    description: "Add any special instructions",
    appContext: "Internal notes are visible only to your team - supervisors and technicians. These are NOT shown to building managers or residents.",
  },
  {
    id: "review",
    title: "Review & Create",
    icon: <CheckCircle2 className="h-5 w-5" />,
    description: "Review your project details",
    appContext: "Review all your settings before creating. Don't worry - you can edit everything later from the project details page.",
  },
];

interface ProjectCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProjectCreationWizard({ open, onOpenChange, onSuccess }: ProjectCreationWizardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [clientPopoverOpen, setClientPopoverOpen] = useState(false);

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      jobCategory: "building_maintenance",
      jobType: "window_cleaning",
      customJobType: "",
      clientId: "",
      strataPlanNumber: "",
      buildingName: "",
      buildingAddress: "",
      startDate: "",
      endDate: "",
      totalDropsNorth: "",
      totalDropsEast: "",
      totalDropsSouth: "",
      totalDropsWest: "",
      dailyDropTarget: "",
      floorCount: "",
      totalSuites: "",
      totalStalls: "",
      estimatedHours: "",
      assignedEmployees: [],
      notes: "",
    },
  });

  const watchedCategory = form.watch("jobCategory");
  const watchedJobType = form.watch("jobType");
  const watchedClientId = form.watch("clientId");

  const { data: clientsData } = useQuery<{ clients: Client[] }>({
    queryKey: ["/api/clients"],
  });

  const { data: employeesData } = useQuery<{ employees: User[] }>({
    queryKey: ["/api/employees"],
  });

  const { data: buildingsData } = useQuery<{ buildings: any[] }>({
    queryKey: ["/api/clients", watchedClientId, "buildings"],
    enabled: !!watchedClientId,
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: WizardFormData) => {
      const progressType = getProgressType(data.jobType);
      const totalDrops = (parseInt(data.totalDropsNorth || "0") || 0) +
                        (parseInt(data.totalDropsEast || "0") || 0) +
                        (parseInt(data.totalDropsSouth || "0") || 0) +
                        (parseInt(data.totalDropsWest || "0") || 0);

      return apiRequest("POST", "/api/projects", {
        clientId: data.clientId || undefined,
        jobCategory: data.jobCategory,
        jobType: data.jobType,
        customJobType: data.customJobType || undefined,
        strataPlanNumber: data.strataPlanNumber || undefined,
        buildingName: data.buildingName || undefined,
        buildingAddress: data.buildingAddress || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        totalDropsNorth: parseInt(data.totalDropsNorth || "0") || 0,
        totalDropsEast: parseInt(data.totalDropsEast || "0") || 0,
        totalDropsSouth: parseInt(data.totalDropsSouth || "0") || 0,
        totalDropsWest: parseInt(data.totalDropsWest || "0") || 0,
        totalDrops,
        dailyDropTarget: data.dailyDropTarget ? parseInt(data.dailyDropTarget) : undefined,
        floorCount: data.floorCount ? parseInt(data.floorCount) : undefined,
        totalSuites: data.totalSuites ? parseInt(data.totalSuites) : undefined,
        totalStalls: data.totalStalls ? parseInt(data.totalStalls) : undefined,
        estimatedHours: data.estimatedHours ? parseInt(data.estimatedHours) : undefined,
        assignedEmployees: data.assignedEmployees || [],
        notes: data.notes || undefined,
        requiresElevation: true,
        progressType,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: t("wizard.projectCreated", "Project Created!"),
        description: t("wizard.projectCreatedDesc", "Your project has been set up successfully."),
      });
      onOpenChange(false);
      onSuccess?.();
      form.reset();
      setCurrentStep(0);
    },
    onError: (error: any) => {
      toast({
        title: t("common.error", "Error"),
        description: error.message || t("wizard.createFailed", "Failed to create project"),
        variant: "destructive",
      });
    },
  });

  const currentStepData = WIZARD_STEPS[currentStep];
  const progressPercent = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const canProceed = () => {
    switch (currentStepData.id) {
      case "job-category":
        return !!form.getValues("jobCategory");
      case "job-type":
        return !!form.getValues("jobType");
      case "client":
        return true;
      case "building":
        return true;
      case "dates":
        return true;
      case "scope":
        return true;
      case "daily-target":
        return true;
      case "team":
        return true;
      case "notes":
        return true;
      case "review":
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = () => {
    createProjectMutation.mutate(form.getValues());
  };

  const jobTypes = getJobTypesByCategory(watchedCategory as JobCategory);
  const selectedJobTypeConfig = getJobTypeConfig(watchedJobType);
  const isDropBased = isDropBasedJobType(watchedJobType);
  const progressType = getProgressType(watchedJobType);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      building_maintenance: t("wizard.categoryBuildingMaintenance", "Building Maintenance"),
      ndt: t("wizard.categoryNdt", "NDT Inspections"),
      rock_scaling: t("wizard.categoryRock", "Rock Scaling"),
      wind_turbine: t("wizard.categoryWind", "Wind Turbine"),
      oil_field: t("wizard.categoryOil", "Oil & Gas"),
    };
    return labels[category] || category;
  };

  const getJobTypeLabel = (jobType: string) => {
    const config = getJobTypeConfig(jobType);
    return config?.label || jobType.replace(/_/g, " ");
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case "job-category":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="jobCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("wizard.selectCategory", "Select Work Category")}</FormLabel>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(JOB_CATEGORIES).map(([key, category]) => (
                      <Card
                        key={key}
                        className={cn(
                          "cursor-pointer transition-all hover-elevate",
                          field.value === key && "ring-2 ring-primary"
                        )}
                        onClick={() => {
                          field.onChange(key);
                          const types = getJobTypesByCategory(key as JobCategory);
                          if (types.length > 0) {
                            form.setValue("jobType", types[0].value);
                          }
                        }}
                        data-testid={`card-category-${key}`}
                      >
                        <CardContent className="flex items-center gap-3 p-4">
                          <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-md",
                            field.value === key ? "bg-primary text-primary-foreground" : "bg-muted"
                          )}>
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{getCategoryLabel(key)}</p>
                            <p className="text-sm text-muted-foreground">
                              {getJobTypesByCategory(key as JobCategory).length} job types
                            </p>
                          </div>
                          {field.value === key && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "job-type":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("wizard.selectJobType", "Select Job Type")}</FormLabel>
                  <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                    {jobTypes.map((jobType) => (
                      <Card
                        key={jobType.value}
                        className={cn(
                          "cursor-pointer transition-all hover-elevate",
                          field.value === jobType.value && "ring-2 ring-primary"
                        )}
                        onClick={() => field.onChange(jobType.value)}
                        data-testid={`card-jobtype-${jobType.value}`}
                      >
                        <CardContent className="flex items-center gap-3 p-3">
                          <div className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md text-lg",
                            field.value === jobType.value ? "bg-primary text-primary-foreground" : "bg-muted"
                          )}>
                            {jobType.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{jobType.label}</p>
                            <p className="text-xs text-muted-foreground">
                              Tracks: {jobType.progressType || "drops"}
                            </p>
                          </div>
                          {field.value === jobType.value && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "client":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("wizard.selectClient", "Select Client (Optional)")}</FormLabel>
                  <Popover open={clientPopoverOpen} onOpenChange={setClientPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          data-testid="button-select-client"
                        >
                          {field.value
                            ? clientsData?.clients?.find((c) => c.id === field.value)?.company || clientsData?.clients?.find((c) => c.id === field.value)?.firstName + " " + clientsData?.clients?.find((c) => c.id === field.value)?.lastName
                            : t("wizard.searchClient", "Search for a client...")}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Command>
                        <CommandInput placeholder={t("wizard.searchClientPlaceholder", "Search clients...")} />
                        <CommandList>
                          <CommandEmpty>{t("wizard.noClientsFound", "No clients found.")}</CommandEmpty>
                          <CommandGroup>
                            {clientsData?.clients?.map((client) => (
                              <CommandItem
                                key={client.id}
                                value={client.company || `${client.firstName} ${client.lastName}`}
                                onSelect={() => {
                                  field.onChange(client.id);
                                  setClientPopoverOpen(false);
                                }}
                                data-testid={`item-client-${client.id}`}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === client.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {client.company || `${client.firstName} ${client.lastName}`}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {t("wizard.clientOptional", "You can also create a project without selecting a client")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "building":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="strataPlanNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("wizard.strataPlan", "Strata Plan / LMS Number")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("wizard.strataPlanPlaceholder", "e.g., LMS1234")}
                      {...field}
                      data-testid="input-strata-plan"
                    />
                  </FormControl>
                  <FormDescription>
                    {t("wizard.strataPlanDesc", "This unique ID is used to generate the Building Portal password")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buildingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("wizard.buildingName", "Building Name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("wizard.buildingNamePlaceholder", "e.g., Harbour View Tower")}
                      {...field}
                      data-testid="input-building-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buildingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("wizard.buildingAddress", "Building Address")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("wizard.buildingAddressPlaceholder", "e.g., 123 Main Street, Vancouver")}
                      {...field}
                      data-testid="input-building-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "dates":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("wizard.startDate", "Start Date")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-start-date" />
                  </FormControl>
                  <FormDescription>
                    {t("wizard.startDateDesc", "Work begins on this date")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("wizard.endDate", "End Date")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-end-date" />
                  </FormControl>
                  <FormDescription>
                    {t("wizard.endDateDesc", "Expected completion date")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "scope":
        return (
          <div className="space-y-4">
            {isDropBased ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("wizard.dropsExplanation", "Enter the number of drops (vertical work sections) for each side of the building.")}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalDropsNorth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("wizard.dropsNorth", "North Drops")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="0" {...field} data-testid="input-drops-north" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalDropsEast"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("wizard.dropsEast", "East Drops")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="0" {...field} data-testid="input-drops-east" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalDropsSouth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("wizard.dropsSouth", "South Drops")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="0" {...field} data-testid="input-drops-south" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalDropsWest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("wizard.dropsWest", "West Drops")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="0" {...field} data-testid="input-drops-west" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="floorCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("wizard.floorCount", "Number of Floors")}</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" placeholder="25" {...field} data-testid="input-floor-count" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : progressType === "suites" ? (
              <FormField
                control={form.control}
                name="totalSuites"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("wizard.totalSuites", "Total Suites")}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} data-testid="input-total-suites" />
                    </FormControl>
                    <FormDescription>
                      {t("wizard.suitesDesc", "Number of units/suites to service")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : progressType === "stalls" ? (
              <FormField
                control={form.control}
                name="totalStalls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("wizard.totalStalls", "Total Parking Stalls")}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} data-testid="input-total-stalls" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="estimatedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("wizard.estimatedHours", "Estimated Hours")}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} data-testid="input-estimated-hours" />
                    </FormControl>
                    <FormDescription>
                      {t("wizard.hoursDesc", "Total hours estimated to complete this work")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        );

      case "daily-target":
        return (
          <div className="space-y-4">
            {isDropBased && (
              <FormField
                control={form.control}
                name="dailyDropTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("wizard.dailyTarget", "Daily Drop Target")}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="e.g., 8" {...field} data-testid="input-daily-target" />
                    </FormControl>
                    <FormDescription>
                      {t("wizard.dailyTargetDesc", "How many drops should be completed per day on average?")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!isDropBased && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t("wizard.noTargetNeeded", "Daily targets are configured for drop-based job types.")}</p>
                <p className="text-sm mt-2">{t("wizard.skipStep", "You can skip this step.")}</p>
              </div>
            )}
          </div>
        );

      case "team":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="assignedEmployees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("wizard.assignTeam", "Assign Team Members")}</FormLabel>
                  <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto">
                    {employeesData?.employees?.filter(e => 
                      e.role === "rope_access_technician" || e.role === "ground_crew"
                    ).map((employee) => (
                      <Card
                        key={employee.id}
                        className={cn(
                          "cursor-pointer transition-all hover-elevate",
                          field.value?.includes(employee.id) && "ring-2 ring-primary"
                        )}
                        onClick={() => {
                          const current = field.value || [];
                          if (current.includes(employee.id)) {
                            field.onChange(current.filter(id => id !== employee.id));
                          } else {
                            field.onChange([...current, employee.id]);
                          }
                        }}
                        data-testid={`card-employee-${employee.id}`}
                      >
                        <CardContent className="flex items-center gap-3 p-3">
                          <Checkbox
                            checked={field.value?.includes(employee.id)}
                            className="pointer-events-none"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {employee.role === "rope_access_technician" ? "Rope Access Tech" : "Ground Crew"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(!employeesData?.employees || employeesData.employees.filter(e => 
                      e.role === "rope_access_technician" || e.role === "ground_crew"
                    ).length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>{t("wizard.noTechnicians", "No technicians available")}</p>
                        <p className="text-sm mt-2">{t("wizard.addTechsLater", "You can assign team members later")}</p>
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    {t("wizard.teamDesc", "Selected members will receive this project in their app")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "notes":
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("wizard.projectNotes", "Project Notes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("wizard.notesPlaceholder", "Add any special instructions, access codes, or important details...")}
                      className="min-h-[150px]"
                      {...field}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormDescription>
                    {t("wizard.notesDesc", "These notes are visible only to your team members")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case "review":
        const values = form.getValues();
        const totalDrops = (parseInt(values.totalDropsNorth || "0") || 0) +
                          (parseInt(values.totalDropsEast || "0") || 0) +
                          (parseInt(values.totalDropsSouth || "0") || 0) +
                          (parseInt(values.totalDropsWest || "0") || 0);
        const selectedClient = clientsData?.clients?.find(c => c.id === values.clientId);
        const assignedCount = values.assignedEmployees?.length || 0;

        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("wizard.reviewCategory", "Category")}</p>
                <p className="font-medium">{getCategoryLabel(values.jobCategory)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("wizard.reviewJobType", "Job Type")}</p>
                <p className="font-medium">{getJobTypeLabel(values.jobType)}</p>
              </div>
              {selectedClient && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("wizard.reviewClient", "Client")}</p>
                  <p className="font-medium">{selectedClient.company || `${selectedClient.firstName} ${selectedClient.lastName}`}</p>
                </div>
              )}
              {values.buildingName && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("wizard.reviewBuilding", "Building")}</p>
                  <p className="font-medium">{values.buildingName}</p>
                </div>
              )}
              {values.startDate && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("wizard.reviewDates", "Dates")}</p>
                  <p className="font-medium">{values.startDate} - {values.endDate || "TBD"}</p>
                </div>
              )}
              {isDropBased && totalDrops > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("wizard.reviewDrops", "Total Drops")}</p>
                  <p className="font-medium">{totalDrops} drops</p>
                </div>
              )}
              {assignedCount > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("wizard.reviewTeam", "Team")}</p>
                  <p className="font-medium">{assignedCount} member{assignedCount !== 1 ? "s" : ""}</p>
                </div>
              )}
            </div>
            {values.notes && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("wizard.reviewNotes", "Notes")}</p>
                <p className="text-sm bg-muted p-3 rounded-md">{values.notes}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              {currentStepData.icon}
            </div>
            <div>
              <DialogTitle className="text-lg">{currentStepData.title}</DialogTitle>
              <DialogDescription className="text-sm">
                {t("wizard.stepOf", "Step {{current}} of {{total}}", { current: currentStep + 1, total: WIZARD_STEPS.length })}
              </DialogDescription>
            </div>
          </div>
          <Progress value={progressPercent} className="h-1" />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <p className="text-sm text-muted-foreground mb-4">{currentStepData.description}</p>
          
          <Form {...form}>
            {renderStepContent()}
          </Form>

          <div className="mt-6 p-3 bg-muted/50 rounded-md border">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">{currentStepData.appContext}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            data-testid="button-wizard-back"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("wizard.back", "Back")}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              data-testid="button-wizard-cancel"
            >
              {t("wizard.cancel", "Cancel")}
            </Button>

            {currentStep < WIZARD_STEPS.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                data-testid="button-wizard-next"
              >
                {t("wizard.next", "Next")}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={createProjectMutation.isPending}
                data-testid="button-wizard-create"
              >
                {createProjectMutation.isPending ? t("wizard.creating", "Creating...") : t("wizard.createProject", "Create Project")}
                <CheckCircle2 className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
