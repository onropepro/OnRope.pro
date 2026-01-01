import { useState, useEffect } from "react";
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
import { Building2, Users, Briefcase, Check, ChevronRight, Building, UserPlus, Search, Mail, Award, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

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
type EmployeeMode = "select" | "search" | "create";
type SearchType = "irata" | "sprat" | "email";

interface FoundTechnician {
  id: string;
  name: string;
  email: string;
  irataLevel?: number;
  irataLicenseNumber?: string;
  spratLevel?: number;
  spratLicenseNumber?: string;
  employeeCity?: string;
  employeeProvinceState?: string;
  hasPlusAccess?: boolean;
  isAlreadyLinked?: boolean;
}

const STEPS: Step[] = ["welcome", "company", "client", "employee", "project", "complete"];

export function OnboardingWizard({ open, onClose, onComplete, currentUser }: OnboardingWizardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);
  
  // Employee step state
  const [employeeMode, setEmployeeMode] = useState<EmployeeMode>("select");
  const [searchType, setSearchType] = useState<SearchType>("email");
  const [searchValue, setSearchValue] = useState("");
  const [foundTechnician, setFoundTechnician] = useState<FoundTechnician | null>(null);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [employeeAdded, setEmployeeAdded] = useState(false);

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
      setEmployeeAdded(true);
      toast({
        title: t("onboarding.success", "Success"),
        description: t("onboarding.employeeCreated", "Team member added successfully"),
      });
      setCurrentStep("project");
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to create employee";
      if (message.includes("email") || message.includes("already")) {
        toast({
          title: t("onboarding.error", "Error"),
          description: t("onboarding.employeeEmailExists", "An account with this email already exists. Try searching for them instead."),
          variant: "destructive",
        });
        setEmployeeMode("select");
      } else {
        toast({
          title: t("onboarding.error", "Error"),
          description: t("onboarding.employeeCreateFailed", "Failed to create employee"),
          variant: "destructive",
        });
      }
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
    const nextStepIndex = stepIndex + 1;
    if (nextStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[nextStepIndex]);
    } else {
      completeOnboardingMutation.mutate();
    }
  };
  
  const canCreateProject = !!createdClientId;

  // Reset form state when entering certain steps
  useEffect(() => {
    if (currentStep === "client") {
      // Reset client form to prevent browser autofill contamination
      clientForm.reset({
        firstName: "",
        lastName: "",
        company: "",
        phoneNumber: "",
        email: "",
      });
    } else if (currentStep === "employee") {
      setEmployeeMode("select");
      setSearchType("email");
      setSearchValue("");
      setFoundTechnician(null);
      setSearchMessage(null);
    }
  }, [currentStep, clientForm]);

  // Search for existing technician
  const searchTechnician = async () => {
    if (!searchValue.trim()) return;
    
    setIsSearching(true);
    setFoundTechnician(null);
    setSearchMessage(null);
    
    try {
      const response = await fetch(`/api/technicians/search?searchType=${searchType}&searchValue=${encodeURIComponent(searchValue.trim())}`);
      const data = await response.json();
      
      if (data.found && data.technician) {
        setFoundTechnician(data.technician);
        if (data.warning) {
          setSearchMessage(data.warning);
        }
      } else {
        setSearchMessage(data.message || "No technician found with that information");
      }
    } catch (error) {
      setSearchMessage("Error searching for technician");
      toast({
        title: t("onboarding.error", "Error"),
        description: t("onboarding.searchFailed", "Failed to search for technician. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Link/invite existing technician
  const linkTechnician = async () => {
    if (!foundTechnician) return;
    
    setIsLinking(true);
    try {
      const response = await apiRequest("POST", `/api/technicians/${foundTechnician.id}/link`, {
        hourlyRate: 0,
        isSalary: false,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setEmployeeAdded(true);
      toast({
        title: t("onboarding.success", "Success"),
        description: t("onboarding.invitationSent", "Team invitation sent successfully"),
      });
      setCurrentStep("project");
    } catch (error: any) {
      const errorMessage = error?.message || t("onboarding.linkFailed", "Failed to send team invitation");
      toast({
        title: t("onboarding.error", "Error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLinking(false);
    }
  };

  // Reset employee step state
  const resetEmployeeState = () => {
    setEmployeeMode("select");
    setSearchType("email");
    setSearchValue("");
    setFoundTechnician(null);
    setSearchMessage(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="space-y-6 py-4">
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
                <h3 className="text-xl font-semibold">{t("onboarding.company.title", "Company Setup")}</h3>
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
                <h3 className="text-xl font-semibold">{t("onboarding.client.title", "Add Your First Client")}</h3>
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
                        <Input {...field} placeholder="John" autoComplete="given-name" data-testid="input-client-first-name" />
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
                        <Input {...field} placeholder="Smith" autoComplete="family-name" data-testid="input-client-last-name" />
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
                      <Input {...field} placeholder="ABC Property Management" autoComplete="off" data-1p-ignore="true" data-lpignore="true" data-testid="input-client-company" />
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
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">{t("onboarding.employee.title", "Add Your First Team Member")}</h3>
              <p className="text-sm text-muted-foreground">{t("onboarding.employee.description", "Search for existing technicians or create a new account")}</p>
            </div>

            {/* Mode Selection */}
            {employeeMode === "select" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <Card 
                    className="shadow-sm cursor-pointer hover:shadow-md transition-shadow border-primary/30 bg-primary/5"
                    onClick={() => setEmployeeMode("search")}
                    data-testid="button-search-existing"
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Search className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{t("onboarding.employee.searchExisting", "Find Existing Technician")}</div>
                        <div className="text-sm text-muted-foreground">{t("onboarding.employee.searchDesc", "Search by email or IRATA/SPRAT license")}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setEmployeeMode("create")}
                    data-testid="button-create-new"
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="p-2 bg-muted rounded-full">
                        <UserPlus className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{t("onboarding.employee.createNew", "Create New Account")}</div>
                        <div className="text-sm text-muted-foreground">{t("onboarding.employee.createDesc", "Enter details for a new team member")}</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="ghost" onClick={handleSkipStep} className="flex-1" data-testid="button-skip-employee">
                    {t("common.skip", "Skip for now")}
                  </Button>
                </div>
              </div>
            )}

            {/* Search Mode */}
            {employeeMode === "search" && (
              <div className="space-y-4">
                {/* Search Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("onboarding.employee.searchBy", "Search by")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'email' as SearchType, label: 'Email', icon: Mail },
                      { value: 'irata' as SearchType, label: 'IRATA', icon: Award },
                      { value: 'sprat' as SearchType, label: 'SPRAT', icon: Award },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={searchType === option.value ? "default" : "outline"}
                        className="flex-col gap-1 h-auto py-3"
                        onClick={() => { setSearchType(option.value); setFoundTechnician(null); setSearchValue(''); setSearchMessage(null); }}
                        data-testid={`button-search-type-${option.value}`}
                      >
                        <option.icon className="w-4 h-4" />
                        <span className="text-xs">{option.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {searchType === 'email' ? t("onboarding.employee.emailAddress", "Email Address") :
                     searchType === 'irata' ? t("onboarding.employee.irataLicense", "IRATA License Number") :
                     t("onboarding.employee.spratLicense", "SPRAT License Number")}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={
                        searchType === 'email' ? 'technician@email.com' :
                        searchType === 'irata' ? 'e.g., 123456' :
                        'e.g., SP-12345'
                      }
                      value={searchValue}
                      onChange={(e) => { setSearchValue(e.target.value); setFoundTechnician(null); setSearchMessage(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); searchTechnician(); }}}
                      data-testid="input-search-value"
                    />
                    <Button 
                      type="button"
                      onClick={searchTechnician}
                      disabled={isSearching || !searchValue.trim()}
                      data-testid="button-search"
                    >
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Search Results */}
                {searchMessage && !foundTechnician && (
                  <Card className="shadow-sm bg-muted/50">
                    <CardContent className="flex items-center gap-3 p-4">
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{searchMessage}</span>
                    </CardContent>
                  </Card>
                )}

                {foundTechnician && (
                  <Card className="shadow-sm border-primary/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-medium">{t("onboarding.employee.technicianFound", "Technician Found")}</span>
                      </div>
                      <div className="pl-8 space-y-1">
                        <div className="font-medium">{foundTechnician.name}</div>
                        <div className="text-sm text-muted-foreground">{foundTechnician.email}</div>
                        {foundTechnician.irataLicenseNumber && (
                          <div className="text-sm text-muted-foreground">IRATA Level {foundTechnician.irataLevel}: {foundTechnician.irataLicenseNumber}</div>
                        )}
                        {foundTechnician.spratLicenseNumber && (
                          <div className="text-sm text-muted-foreground">SPRAT Level {foundTechnician.spratLevel}: {foundTechnician.spratLicenseNumber}</div>
                        )}
                        {foundTechnician.employeeCity && (
                          <div className="text-sm text-muted-foreground">{foundTechnician.employeeCity}, {foundTechnician.employeeProvinceState}</div>
                        )}
                      </div>
                      {searchMessage && (
                        <div className="text-sm text-amber-600 dark:text-amber-400 pl-8">{searchMessage}</div>
                      )}
                      <Button 
                        onClick={linkTechnician} 
                        disabled={isLinking}
                        className="w-full mt-2"
                        data-testid="button-send-invitation"
                      >
                        {isLinking ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t("onboarding.employee.sending", "Sending...")}
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            {t("onboarding.employee.sendInvitation", "Send Team Invitation")}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button type="button" variant="ghost" onClick={resetEmployeeState} data-testid="button-back-to-select">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t("common.back", "Back")}
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleSkipStep} className="flex-1" data-testid="button-skip-employee">
                    {t("common.skip", "Skip")}
                  </Button>
                </div>
              </div>
            )}

            {/* Create Mode */}
            {employeeMode === "create" && (
              <Form {...employeeForm}>
                <form onSubmit={employeeForm.handleSubmit((data) => createEmployeeMutation.mutate(data))} className="space-y-4">
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
                  <p className="text-sm text-muted-foreground">{t("onboarding.employee.credentialsNote", "They'll receive login credentials via email")}</p>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={resetEmployeeState} data-testid="button-back-to-select">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t("common.back", "Back")}
                    </Button>
                    <Button type="submit" className="flex-1" disabled={createEmployeeMutation.isPending} data-testid="button-save-employee">
                      {createEmployeeMutation.isPending ? t("common.saving", "Saving...") : t("common.continue", "Continue")}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
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
                <h3 className="text-xl font-semibold">{t("onboarding.project.title", "Create Your First Project")}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("onboarding.project.noClient", "Projects require a client. You can create projects later from your dashboard after adding a client.")}
                </p>
              </div>
              <Card className="shadow-sm bg-muted/50">
                <CardContent className="p-4 text-center text-sm text-muted-foreground">
                  {t("onboarding.project.noClientTip", "Tip: Add clients from the Clients section, then create projects to start tracking work.")}
                </CardContent>
              </Card>
              <Button onClick={() => completeOnboardingMutation.mutate()} className="w-full" disabled={completeOnboardingMutation.isPending} data-testid="button-finish-without-project">
                {completeOnboardingMutation.isPending ? t("common.saving", "Finishing...") : t("common.finish", "Finish Setup")}
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
                <h3 className="text-xl font-semibold">{t("onboarding.project.title", "Create Your First Project")}</h3>
                <p className="text-sm text-muted-foreground">{t("onboarding.project.description", "A project represents a job at a specific building")}</p>
              </div>
              <FormField
                control={projectForm.control}
                name="buildingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.project.address", "Building Address")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123 Main St, Vancouver, BC" data-testid="input-building-address" />
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
                    <FormLabel>{t("onboarding.project.strata", "Strata Plan Number (Optional)")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="BCS1234" data-testid="input-strata-number" />
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
                        {JOB_TYPES.map((job) => (
                          <SelectItem key={job.value} value={job.value}>
                            {job.label}
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
              <div className="p-4 bg-primary/10 rounded-full">
                <Check className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">
                {t("onboarding.complete.title", "You're All Set!")}
              </h3>
              <p className="text-muted-foreground">
                {t("onboarding.complete.description", "Your account is ready. Start exploring the platform to manage your rope access operations.")}
              </p>
            </div>
            <Card className="shadow-sm bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">{t("onboarding.complete.nextSteps", "Recommended Next Steps")}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>{t("onboarding.complete.tip1", "Add more team members from the Employees section")}</li>
                  <li>{t("onboarding.complete.tip2", "Set up your company branding")}</li>
                  <li>{t("onboarding.complete.tip3", "Explore the scheduling calendar")}</li>
                </ul>
              </CardContent>
            </Card>
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
        className="sm:max-w-md max-h-[90vh] overflow-y-auto [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          {currentStep !== "welcome" && currentStep !== "complete" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Step {stepIndex} / {STEPS.length - 2}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
