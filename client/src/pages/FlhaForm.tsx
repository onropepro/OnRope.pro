import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { trackFLHASubmission } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, AlertTriangle, Shield, PenTool, X, CheckCircle2 } from "lucide-react";
import type { Project } from "@shared/schema";
import SignatureCanvas from "react-signature-canvas";

const flhaFormSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  assessmentDate: z.string().min(1, "Date is required"),
  assessorName: z.string().min(1, "Your name is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  location: z.string().min(1, "Location is required"),
  workArea: z.string().optional(),
  
  // Hazards
  hazardFalling: z.boolean().default(false),
  hazardSwingFall: z.boolean().default(false),
  hazardSuspendedRescue: z.boolean().default(false),
  hazardWeather: z.boolean().default(false),
  hazardElectrical: z.boolean().default(false),
  hazardFallingObjects: z.boolean().default(false),
  hazardChemical: z.boolean().default(false),
  hazardConfined: z.boolean().default(false),
  hazardSharpEdges: z.boolean().default(false),
  hazardUnstableAnchors: z.boolean().default(false),
  hazardPowerTools: z.boolean().default(false),
  hazardPublic: z.boolean().default(false),
  
  // Controls
  controlPPE: z.boolean().default(false),
  controlBackupSystem: z.boolean().default(false),
  controlEdgeProtection: z.boolean().default(false),
  controlBarricades: z.boolean().default(false),
  controlWeatherMonitoring: z.boolean().default(false),
  controlRescuePlan: z.boolean().default(false),
  controlCommunication: z.boolean().default(false),
  controlToolTethering: z.boolean().default(false),
  controlPermits: z.boolean().default(false),
  controlInspections: z.boolean().default(false),
  
  riskLevelBefore: z.string().optional(),
  riskLevelAfter: z.string().optional(),
  additionalHazards: z.string().optional(),
  additionalControls: z.string().optional(),
  emergencyContacts: z.string().optional(),
  teamMembers: z.union([z.string(), z.array(z.string())]).optional(),
});

type FlhaFormValues = z.infer<typeof flhaFormSchema>;

const hazardKeys = [
  { id: "hazardFalling", labelKey: "safetyForms.flha.hazards.fallsFromHeight" },
  { id: "hazardSwingFall", labelKey: "safetyForms.flha.hazards.swingFallHazard" },
  { id: "hazardSuspendedRescue", labelKey: "safetyForms.flha.hazards.suspensionTrauma" },
  { id: "hazardWeather", labelKey: "safetyForms.flha.hazards.adverseWeather" },
  { id: "hazardElectrical", labelKey: "safetyForms.flha.hazards.electricalHazards" },
  { id: "hazardFallingObjects", labelKey: "safetyForms.flha.hazards.fallingObjects" },
  { id: "hazardChemical", labelKey: "safetyForms.flha.hazards.chemicalExposure" },
  { id: "hazardConfined", labelKey: "safetyForms.flha.hazards.confinedSpaces" },
  { id: "hazardSharpEdges", labelKey: "safetyForms.flha.hazards.sharpEdges" },
  { id: "hazardUnstableAnchors", labelKey: "safetyForms.flha.hazards.unstableAnchors" },
  { id: "hazardPowerTools", labelKey: "safetyForms.flha.hazards.powerTools" },
  { id: "hazardPublic", labelKey: "safetyForms.flha.hazards.publicInteraction" },
];

const controlKeys = [
  { id: "controlPPE", labelKey: "safetyForms.flha.controls.properPPE" },
  { id: "controlBackupSystem", labelKey: "safetyForms.flha.controls.backupSystems" },
  { id: "controlEdgeProtection", labelKey: "safetyForms.flha.controls.edgeProtection" },
  { id: "controlBarricades", labelKey: "safetyForms.flha.controls.barricades" },
  { id: "controlWeatherMonitoring", labelKey: "safetyForms.flha.controls.weatherMonitoring" },
  { id: "controlRescuePlan", labelKey: "safetyForms.flha.controls.rescuePlan" },
  { id: "controlCommunication", labelKey: "safetyForms.flha.controls.communication" },
  { id: "controlToolTethering", labelKey: "safetyForms.flha.controls.toolTethering" },
  { id: "controlPermits", labelKey: "safetyForms.flha.controls.permits" },
  { id: "controlInspections", labelKey: "safetyForms.flha.controls.inspections" },
];

type Signature = {
  employeeId: string;
  employeeName: string;
  signatureDataUrl: string;
};

export default function FlhaForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [selectedSignatureEmployee, setSelectedSignatureEmployee] = useState<string>("");
  const signatureCanvasRef = useRef<SignatureCanvas>(null);

  // Get projectId from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedProjectId = urlParams.get('projectId') || "";

  // Navigate back - if opened from project, go back to project; otherwise go to safety forms
  const handleNavigateBack = () => {
    if (preselectedProjectId) {
      navigate(`/projects/${preselectedProjectId}`);
    } else {
      navigate("/safety-forms");
    }
  };

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: projectsData } = useQuery<{ projects: Project[] }>({
    queryKey: ["/api/projects"],
  });

  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
  });

  const currentUser = userData?.user;
  // Filter out suspended and terminated employees - they should not appear anywhere in the app
  // Check both primary suspension (suspendedAt) and secondary suspension (connectionStatus)
  const employees = (employeesData?.employees || []).filter((e: any) => 
    !e.suspendedAt && e.connectionStatus !== 'suspended' && !e.terminatedDate
  );

  // Helper for local date formatting
  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const form = useForm<FlhaFormValues>({
    resolver: zodResolver(flhaFormSchema),
    defaultValues: {
      projectId: preselectedProjectId,
      assessmentDate: getLocalDateString(),
      assessorName: "",
      jobDescription: "",
      location: "",
      workArea: "",
      teamMembers: [],
      hazardFalling: false,
      hazardSwingFall: false,
      hazardSuspendedRescue: false,
      hazardWeather: false,
      hazardElectrical: false,
      hazardFallingObjects: false,
      hazardChemical: false,
      hazardConfined: false,
      hazardSharpEdges: false,
      hazardUnstableAnchors: false,
      hazardPowerTools: false,
      hazardPublic: false,
      controlPPE: false,
      controlBackupSystem: false,
      controlEdgeProtection: false,
      controlBarricades: false,
      controlWeatherMonitoring: false,
      controlRescuePlan: false,
      controlCommunication: false,
      controlToolTethering: false,
      controlPermits: false,
      controlInspections: false,
      riskLevelBefore: "",
      riskLevelAfter: "",
      additionalHazards: "",
      additionalControls: "",
      emergencyContacts: "",
    },
  });

  // Auto-fill assessor name from current user and location from project
  useEffect(() => {
    if (currentUser?.name && !form.getValues('assessorName')) {
      form.setValue('assessorName', currentUser.name);
    }
  }, [currentUser, form]);

  useEffect(() => {
    const projects = projectsData?.projects || [];
    const selectedProjectId = form.getValues('projectId');
    if (selectedProjectId && projects.length > 0) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project?.buildingAddress && !form.getValues('location')) {
        form.setValue('location', project.buildingAddress);
      }
    }
  }, [projectsData, preselectedProjectId, form]);

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const openSignatureDialog = (employeeId: string) => {
    setSelectedSignatureEmployee(employeeId);
    setShowSignatureDialog(true);
  };

  const saveSignature = () => {
    if (!signatureCanvasRef.current || signatureCanvasRef.current.isEmpty()) {
      toast({
        title: t('safetyForms.flha.toasts.error', 'Error'),
        description: t('safetyForms.flha.toasts.pleaseProvideSignature', 'Please provide a signature'),
        variant: "destructive",
      });
      return;
    }

    const employee = employees.find(e => e.id === selectedSignatureEmployee);
    if (!employee) return;

    const signatureDataUrl = signatureCanvasRef.current.toDataURL();
    
    setSignatures(prev => [
      ...prev.filter(s => s.employeeId !== selectedSignatureEmployee),
      {
        employeeId: selectedSignatureEmployee,
        employeeName: employee.name,
        signatureDataUrl,
      },
    ]);

    setShowSignatureDialog(false);
    setSelectedSignatureEmployee("");
    signatureCanvasRef.current.clear();

    toast({
      title: t('safetyForms.flha.toasts.success', 'Success'),
      description: `${t('safetyForms.flha.toasts.signatureCaptured', 'Signature captured for')} ${employee.name}`,
    });
  };

  const clearSignature = () => {
    signatureCanvasRef.current?.clear();
  };

  const removeSignature = (employeeId: string) => {
    setSignatures(prev => prev.filter(s => s.employeeId !== employeeId));
  };

  const createFlhaMutation = useMutation({
    mutationFn: async (data: FlhaFormValues) => {
      const response = await apiRequest("POST", "/api/flha-forms", {
        ...data,
        assessorId: currentUser?.id,
        teamMembers: selectedEmployees,
        signatures,
      });
      
      return await response.json();
    },
    onSuccess: () => {
      // Track FLHA submission
      trackFLHASubmission({
        projectId: form.getValues('projectId'),
        hazardCount: hazardKeys.filter(h => form.getValues(h.id as keyof FlhaFormValues)).length,
      });
      
      toast({
        title: t('safetyForms.flha.toasts.success', 'Success'),
        description: t('safetyForms.flha.toasts.flhaSubmitted', 'FLHA form submitted successfully'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/flha-forms"] });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: t('safetyForms.flha.toasts.error', 'Error'),
        description: error.message || t('safetyForms.flha.toasts.failedToSubmit', 'Failed to submit FLHA form'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FlhaFormValues) => {
    if (selectedEmployees.length === 0) {
      toast({
        title: t('safetyForms.flha.toasts.error', 'Error'),
        description: t('safetyForms.flha.toasts.selectTeamMember', 'Please select at least one team member'),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createFlhaMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNavigateBack}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">{t('safetyForms.flha.title', 'Field Level Hazard Assessment')}</h1>
          </div>
        </div>

        <Card className="mb-4 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{t('safetyForms.flha.icopTitle', 'IRATA International Code of Practice (ICOP)')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('safetyForms.flha.icopDescription', 'All rope access operations must comply with the IRATA International Code of Practice for Industrial Rope Access (TC-102ENG). This document outlines mandatory safety requirements, technical procedures, and best practices for rope access work.')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <a 
                  href="https://irata.org/downloads/2055" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary"
                  data-testid="link-irata-icop"
                >
                  {t('safetyForms.flha.downloadICOP', 'Download Official ICOP Document')}
                </a>
              </Badge>
              <Badge variant="outline" className="text-xs">
                <a 
                  href="https://irata.org/page/international-code-of-practice" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary"
                  data-testid="link-irata-icop-info"
                >
                  {t('safetyForms.flha.viewICOPInfo', 'View IRATA ICOP Information')}
                </a>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('safetyForms.flha.formTitle', 'FLHA Form - Rope Access')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.flha.project', 'Project')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-project">
                            <SelectValue placeholder={t('safetyForms.flha.selectProject', 'Select project')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectsData?.projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.buildingName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.flha.assessmentDate', 'Assessment Date')} *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="text-base"
                          data-testid="input-assessment-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assessorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.flha.assessorName', 'Assessor Name')} *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('safetyForms.flha.yourFullName', 'Your full name')}
                          data-testid="input-assessor-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.flha.jobDescription', 'Job Description')} *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t('safetyForms.flha.describeWork', 'Describe the work to be performed...')}
                          data-testid="input-job-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.flha.location', 'Location')} *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('safetyForms.flha.buildingSiteLocation', 'Building/Site location')}
                          data-testid="input-location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.flha.specificWorkArea', 'Specific Work Area')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('safetyForms.flha.workAreaPlaceholder', 'e.g., East elevation, Roof, Parkade Level 2')}
                          data-testid="input-work-area"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hazards Section */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {t('safetyForms.flha.identifiedHazards', 'Identified Hazards')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hazardKeys.map((hazard) => (
                      <FormField
                        key={hazard.id}
                        control={form.control}
                        name={hazard.id as any}
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                                data-testid={`checkbox-${hazard.id}`}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t(hazard.labelKey)}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalHazards"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('safetyForms.flha.additionalHazards', 'Additional Hazards')}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t('safetyForms.flha.additionalHazardsPlaceholder', 'Describe any additional hazards not listed above...')}
                            data-testid="input-additional-hazards"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Controls Section */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    {t('safetyForms.flha.controlsImplemented', 'Controls Implemented')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {controlKeys.map((control) => (
                      <FormField
                        key={control.id}
                        control={form.control}
                        name={control.id as any}
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                                data-testid={`checkbox-${control.id}`}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t(control.labelKey)}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalControls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('safetyForms.flha.additionalControls', 'Additional Controls')}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={t('safetyForms.flha.additionalControlsPlaceholder', 'Describe any additional controls not listed above...')}
                            data-testid="input-additional-controls"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Risk Assessment */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">{t('safetyForms.flha.riskAssessment', 'Risk Assessment')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="riskLevelBefore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('safetyForms.flha.riskLevelBefore', 'Risk Level (Before Controls)')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-risk-before">
                                <SelectValue placeholder={t('safetyForms.flha.selectRiskLevel', 'Select risk level')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">{t('safetyForms.flha.low', 'Low')}</SelectItem>
                              <SelectItem value="medium">{t('safetyForms.flha.medium', 'Medium')}</SelectItem>
                              <SelectItem value="high">{t('safetyForms.flha.high', 'High')}</SelectItem>
                              <SelectItem value="extreme">{t('safetyForms.flha.extreme', 'Extreme')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="riskLevelAfter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('safetyForms.flha.riskLevelAfter', 'Risk Level (After Controls)')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-risk-after">
                                <SelectValue placeholder={t('safetyForms.flha.selectRiskLevel', 'Select risk level')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">{t('safetyForms.flha.low', 'Low')}</SelectItem>
                              <SelectItem value="medium">{t('safetyForms.flha.medium', 'Medium')}</SelectItem>
                              <SelectItem value="high">{t('safetyForms.flha.high', 'High')}</SelectItem>
                              <SelectItem value="extreme">{t('safetyForms.flha.extreme', 'Extreme')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="emergencyContacts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.flha.emergencyContacts', 'Emergency Contacts')}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t('safetyForms.flha.emergencyContactsPlaceholder', 'List emergency contacts and phone numbers...')}
                          data-testid="input-emergency-contacts"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Team Members */}
                <div className="space-y-3">
                  <div>
                    <FormLabel>{t('safetyForms.flha.teamMembers', 'Team Members')} *</FormLabel>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('safetyForms.flha.selectTeamMembers', 'Select all team members involved in this work')}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-md p-3">
                    {employees.map((employee) => (
                      <div
                        key={employee.id}
                        onClick={() => handleEmployeeToggle(employee.id)}
                        className={`p-2 rounded-md border cursor-pointer hover-elevate active-elevate-2 ${
                          selectedEmployees.includes(employee.id)
                            ? "bg-primary/10 border-primary"
                            : "bg-background"
                        }`}
                        data-testid={`employee-${employee.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{employee.name}</span>
                          {selectedEmployees.includes(employee.id) && (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signatures Section */}
                {selectedEmployees.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{t('safetyForms.flha.teamSignatures', 'Team Signatures')}</h3>
                      <Badge variant="secondary">
                        {signatures.length} {t('safetyForms.flha.ofSigned', 'of')} {selectedEmployees.length} {t('safetyForms.flha.signed', 'signed').toLowerCase()}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {selectedEmployees.map((employeeId) => {
                        const employee = employees.find(e => e.id === employeeId);
                        const signature = signatures.find(s => s.employeeId === employeeId);
                        
                        if (!employee) return null;

                        return (
                          <div
                            key={employeeId}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <span className="font-medium">{employee.name}</span>
                            {signature ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="default" className="gap-1">
                                  <PenTool className="h-3 w-3" />
                                  {t('safetyForms.flha.signed', 'Signed')}
                                </Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSignature(employeeId)}
                                  data-testid={`button-remove-signature-${employeeId}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => openSignatureDialog(employeeId)}
                                data-testid={`button-sign-${employeeId}`}
                              >
                                <PenTool className="h-4 w-4 mr-2" />
                                {t('safetyForms.flha.sign', 'Sign')}
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleNavigateBack}
                    data-testid="button-cancel"
                  >
                    {t('safetyForms.flha.cancel', 'Cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="button-submit"
                    className="flex-1"
                  >
                    {isSubmitting ? t('safetyForms.flha.submitting', 'Submitting...') : t('safetyForms.flha.submitFlha', 'Submit FLHA')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('safetyForms.flha.provideSignature', 'Provide Signature')}</DialogTitle>
            <DialogDescription>
              {selectedSignatureEmployee && employees.find(e => e.id === selectedSignatureEmployee)?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-2 bg-white">
              <SignatureCanvas
                ref={signatureCanvasRef}
                canvasProps={{
                  className: "w-full h-48 touch-none",
                  "data-testid": "signature-canvas"
                }}
                backgroundColor="white"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('safetyForms.flha.signAbove', 'Sign above using your mouse or touch screen')}
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearSignature}
              data-testid="button-clear-signature"
            >
              {t('safetyForms.flha.clear', 'Clear')}
            </Button>
            <Button
              type="button"
              onClick={saveSignature}
              data-testid="button-save-signature"
            >
              {t('safetyForms.flha.saveSignature', 'Save Signature')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
