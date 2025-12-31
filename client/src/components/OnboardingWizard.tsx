import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2, Users, Briefcase, Check, ChevronRight, Rocket, Building, UserPlus } from "lucide-react";

const TIMEZONES = [
  { value: "America/Vancouver", label: "Pacific Time (Vancouver)" },
  { value: "America/Edmonton", label: "Mountain Time (Edmonton)" },
  { value: "America/Winnipeg", label: "Central Time (Winnipeg)" },
  { value: "America/Toronto", label: "Eastern Time (Toronto)" },
  { value: "America/Halifax", label: "Atlantic Time (Halifax)" },
  { value: "America/St_Johns", label: "Newfoundland Time (St. John's)" },
  { value: "America/Los_Angeles", label: "Pacific Time (Los Angeles)" },
  { value: "America/Denver", label: "Mountain Time (Denver)" },
  { value: "America/Chicago", label: "Central Time (Chicago)" },
  { value: "America/New_York", label: "Eastern Time (New York)" },
];

const JOB_TYPES = [
  { value: "window_cleaning", label: "Window Cleaning" },
  { value: "building_wash", label: "Building/Facade Wash" },
  { value: "dryer_vent_cleaning", label: "Dryer Vent Cleaning" },
  { value: "in_suite_dryer_vent_cleaning", label: "In-Suite Dryer Vent Cleaning" },
  { value: "parkade_pressure_cleaning", label: "Parkade Pressure Cleaning" },
  { value: "anchor_inspection", label: "Anchor Inspection" },
  { value: "caulking", label: "Caulking/Sealant" },
  { value: "other", label: "Other" },
];

const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  timezone: z.string().min(1, "Please select a timezone"),
});

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["supervisor", "rope_access_tech", "ground_crew"]),
});

const projectSchema = z.object({
  strataPlanNumber: z.string().optional(),
  buildingAddress: z.string().min(1, "Building address is required"),
  jobType: z.string().min(1, "Please select a job type"),
});

interface OnboardingWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  currentUser: any;
}

type Step = "welcome" | "company" | "client" | "employee" | "project" | "complete";

const STEPS: Step[] = ["welcome", "company", "client", "employee", "project", "complete"];

export function OnboardingWizard({ open, onClose, onComplete, currentUser }: OnboardingWizardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: currentUser?.companyName || "",
      timezone: currentUser?.timezone || "America/Vancouver",
    },
  });

  const clientForm = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      phoneNumber: "",
      email: "",
    },
  });

  const employeeForm = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "rope_access_tech" as const,
    },
  });

  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      strataPlanNumber: "",
      buildingAddress: "",
      jobType: "window_cleaning",
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof companySchema>) => {
      return apiRequest("PATCH", "/api/company/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setCurrentStep("client");
    },
    onError: () => {
      toast({
        title: t("onboarding.error", "Error"),
        description: t("onboarding.companyUpdateFailed", "Failed to update company info"),
        variant: "destructive",
      });
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: z.infer<typeof clientSchema>) => {
      const response = await apiRequest("POST", "/api/clients", data);
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setCreatedClientId(data.id);
      setCurrentStep("employee");
    },
    onError: () => {
      toast({
        title: t("onboarding.error", "Error"),
        description: t("onboarding.clientCreateFailed", "Failed to create client"),
        variant: "destructive",
      });
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof employeeSchema>) => {
      return apiRequest("POST", "/api/employees", {
        ...data,
        isTempPassword: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setCurrentStep("project");
    },
    onError: () => {
      toast({
        title: t("onboarding.error", "Error"),
        description: t("onboarding.employeeCreateFailed", "Failed to create employee"),
        variant: "destructive",
      });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof projectSchema>) => {
      return apiRequest("POST", "/api/projects", {
        ...data,
        clientId: createdClientId,
        jobCategory: "building_maintenance",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      completeOnboardingMutation.mutate();
    },
    onError: () => {
      toast({
        title: t("onboarding.error", "Error"),
        description: t("onboarding.projectCreateFailed", "Failed to create project"),
        variant: "destructive",
      });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/onboarding/complete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setCurrentStep("complete");
    },
  });

  const skipOnboardingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/onboarding/skip");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      onClose();
    },
  });

  const handleSkip = () => {
    skipOnboardingMutation.mutate();
  };

  const handleSkipStep = () => {
    // Normal flow - advance to next step
    const nextStepIndex = stepIndex + 1;
    if (nextStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[nextStepIndex]);
    } else {
      completeOnboardingMutation.mutate();
    }
  };
  
  // Check if project creation is available (requires a client)
  const canCreateProject = !!createdClientId;

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Rocket className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">
                {t("onboarding.welcome.title", "Welcome to OnRopePro!")}
              </h3>
              <p className="text-muted-foreground">
                {t("onboarding.welcome.description", "Let's get you set up in just a few minutes. We'll walk you through the essential steps to start managing your rope access projects.")}
              </p>
            </div>
            <div className="grid gap-3">
              <Card className="shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <Building className="w-5 h-5 text-primary" />
                  <span>{t("onboarding.welcome.step1", "Set up your company profile")}</span>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{t("onboarding.welcome.step2", "Add your first client")}</span>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <UserPlus className="w-5 h-5 text-primary" />
                  <span>{t("onboarding.welcome.step3", "Add your first team member")}</span>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>{t("onboarding.welcome.step4", "Create your first project")}</span>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={() => setCurrentStep("company")} className="w-full" data-testid="button-start-onboarding">
                {t("onboarding.welcome.getStarted", "Get Started")}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="ghost" onClick={handleSkip} className="w-full text-muted-foreground" data-testid="button-skip-onboarding">
                {t("onboarding.welcome.skipForNow", "I'll explore on my own")}
              </Button>
            </div>
          </div>
        );

      case "company":
        return (
          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit((data) => updateCompanyMutation.mutate(data))} className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Building className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{t("onboarding.company.title", "Company Setup")}</h3>
                <p className="text-sm text-muted-foreground">{t("onboarding.company.description", "Confirm your company details")}</p>
              </div>
              <FormField
                control={companyForm.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.company.name", "Company Name")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Acme Rope Access Ltd." data-testid="input-company-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.company.timezone", "Timezone")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={updateCompanyMutation.isPending} data-testid="button-save-company">
                  {updateCompanyMutation.isPending ? t("common.saving", "Saving...") : t("common.continue", "Continue")}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        );

      case "client":
        return (
          <Form {...clientForm}>
            <form onSubmit={clientForm.handleSubmit((data) => createClientMutation.mutate(data))} className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{t("onboarding.client.title", "Add Your First Client")}</h3>
                <p className="text-sm text-muted-foreground">{t("onboarding.client.description", "A client is a property manager or building owner you work with")}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={clientForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("onboarding.client.firstName", "First Name")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John" data-testid="input-client-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("onboarding.client.lastName", "Last Name")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Smith" data-testid="input-client-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={clientForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.client.company", "Company (Optional)")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ABC Property Management" data-testid="input-client-company" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={clientForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.client.email", "Email (Optional)")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="john@example.com" data-testid="input-client-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={handleSkipStep} data-testid="button-skip-client">
                  {t("common.skip", "Skip")}
                </Button>
                <Button type="submit" className="flex-1" disabled={createClientMutation.isPending} data-testid="button-save-client">
                  {createClientMutation.isPending ? t("common.saving", "Saving...") : t("common.continue", "Continue")}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        );

      case "employee":
        return (
          <Form {...employeeForm}>
            <form onSubmit={employeeForm.handleSubmit((data) => createEmployeeMutation.mutate(data))} className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{t("onboarding.employee.title", "Add Your First Team Member")}</h3>
                <p className="text-sm text-muted-foreground">{t("onboarding.employee.description", "They'll receive login credentials via email")}</p>
              </div>
              <FormField
                control={employeeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.employee.name", "Full Name")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Alex Johnson" data-testid="input-employee-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.employee.email", "Email")}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="alex@example.com" data-testid="input-employee-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={employeeForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.employee.role", "Role")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-employee-role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rope_access_tech">{t("roles.ropeAccessTech", "Rope Access Technician")}</SelectItem>
                        <SelectItem value="supervisor">{t("roles.supervisor", "Supervisor")}</SelectItem>
                        <SelectItem value="ground_crew">{t("roles.groundCrew", "Ground Crew")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={handleSkipStep} data-testid="button-skip-employee">
                  {t("common.skip", "Skip")}
                </Button>
                <Button type="submit" className="flex-1" disabled={createEmployeeMutation.isPending} data-testid="button-save-employee">
                  {createEmployeeMutation.isPending ? t("common.saving", "Saving...") : t("common.continue", "Continue")}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        );

      case "project":
        if (!canCreateProject) {
          return (
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-muted rounded-full">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{t("onboarding.project.title", "Create Your First Project")}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("onboarding.project.noClient", "Projects require a client. You can create projects later from your dashboard after adding a client.")}
                </p>
              </div>
              <Card className="shadow-sm bg-muted/50">
                <CardContent className="p-4 text-center text-sm text-muted-foreground">
                  {t("onboarding.project.noClientTip", "Tip: Add clients from the Clients section, then create projects to start tracking work.")}
                </CardContent>
              </Card>
              <Button onClick={() => completeOnboardingMutation.mutate()} className="w-full" data-testid="button-finish-without-project">
                {t("common.finish", "Finish Setup")}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            </div>
          );
        }
        return (
          <Form {...projectForm}>
            <form onSubmit={projectForm.handleSubmit((data) => createProjectMutation.mutate(data))} className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{t("onboarding.project.title", "Create Your First Project")}</h3>
                <p className="text-sm text-muted-foreground">{t("onboarding.project.description", "A project represents a job at a specific building")}</p>
              </div>
              <FormField
                control={projectForm.control}
                name="buildingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.project.address", "Building Address")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123 Main Street, Vancouver, BC" data-testid="input-project-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="strataPlanNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.project.strata", "Strata/Building Number (Optional)")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="LMS1234" data-testid="input-project-strata" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.project.jobType", "Job Type")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-job-type">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_TYPES.map((jt) => (
                          <SelectItem key={jt.value} value={jt.value}>
                            {jt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={handleSkipStep} data-testid="button-skip-project">
                  {t("common.skip", "Skip")}
                </Button>
                <Button type="submit" className="flex-1" disabled={createProjectMutation.isPending} data-testid="button-save-project">
                  {createProjectMutation.isPending ? t("common.saving", "Saving...") : t("common.finish", "Finish Setup")}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </Form>
        );

      case "complete":
        return (
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">
                {t("onboarding.complete.title", "You're All Set!")}
              </h3>
              <p className="text-muted-foreground">
                {t("onboarding.complete.description", "Your account is ready. Start exploring your dashboard to manage projects, track time, and keep your team safe.")}
              </p>
            </div>
            <div className="space-y-3">
              <Card className="shadow-sm bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{t("onboarding.complete.nextSteps", "Recommended Next Steps")}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>{t("onboarding.complete.tip1", "Add more team members from the Employees section")}</li>
                    <li>{t("onboarding.complete.tip2", "Set up your equipment inventory")}</li>
                    <li>{t("onboarding.complete.tip3", "Configure safety forms and document templates")}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <Button onClick={onComplete} className="w-full" data-testid="button-go-to-dashboard">
              {t("onboarding.complete.goToDashboard", "Go to Dashboard")}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">{t("onboarding.title", "Account Setup")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("onboarding.description", "Complete these steps to set up your account")}
          </DialogDescription>
        </DialogHeader>
        {currentStep !== "welcome" && currentStep !== "complete" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("onboarding.step", "Step")} {stepIndex} / {STEPS.length - 2}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
