import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { trackToolboxMeeting } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, FileCheck, PenTool, X, Shield } from "lucide-react";
import type { Project } from "@shared/schema";
import SignatureCanvas from "react-signature-canvas";

const toolboxMeetingFormSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  meetingDate: z.string().min(1, "Date is required"),
  conductedByName: z.string().min(1, "Your name is required"),
  attendees: z.array(z.string()).default([]),
  
  topicFallProtection: z.boolean().default(false),
  topicAnchorPoints: z.boolean().default(false),
  topicRopeInspection: z.boolean().default(false),
  topicKnotTying: z.boolean().default(false),
  topicPPECheck: z.boolean().default(false),
  topicWeatherConditions: z.boolean().default(false),
  topicCommunication: z.boolean().default(false),
  topicEmergencyEvacuation: z.boolean().default(false),
  topicHazardAssessment: z.boolean().default(false),
  topicLoadCalculations: z.boolean().default(false),
  topicEquipmentCompatibility: z.boolean().default(false),
  topicDescenderAscender: z.boolean().default(false),
  topicEdgeProtection: z.boolean().default(false),
  topicSwingFall: z.boolean().default(false),
  topicMedicalFitness: z.boolean().default(false),
  topicToolDropPrevention: z.boolean().default(false),
  topicRegulations: z.boolean().default(false),
  topicRescueProcedures: z.boolean().default(false),
  topicSiteHazards: z.boolean().default(false),
  topicBuddySystem: z.boolean().default(false),
  
  customTopic: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type ToolboxMeetingFormValues = z.infer<typeof toolboxMeetingFormSchema>;

type Signature = {
  employeeId: string;
  employeeName: string;
  signatureDataUrl: string;
};

export default function ToolboxMeetingForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [selectedSignatureEmployee, setSelectedSignatureEmployee] = useState<string>("");
  const signatureCanvasRef = useRef<SignatureCanvas>(null);

  // Get projectId from URL query parameter for auto-fill
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedProjectId = urlParams.get('projectId') || "";

  // Navigate back - if opened from project, go back to project; otherwise go to documents
  const handleNavigateBack = () => {
    if (preselectedProjectId) {
      navigate(`/projects/${preselectedProjectId}`);
    } else {
      navigate("/documents");
    }
  };

  const topics = [
    { id: "topicFallProtection", label: t('safetyForms.toolbox.topics.fallProtection', 'Fall Protection and Rescue Procedures') },
    { id: "topicAnchorPoints", label: t('safetyForms.toolbox.topics.anchorPoints', 'Anchor Point Selection and Inspection') },
    { id: "topicRopeInspection", label: t('safetyForms.toolbox.topics.ropeInspection', 'Rope Inspection and Maintenance') },
    { id: "topicKnotTying", label: t('safetyForms.toolbox.topics.knotTying', 'Knot Tying and Verification') },
    { id: "topicPPECheck", label: t('safetyForms.toolbox.topics.ppeCheck', 'Personal Protective Equipment (PPE) Check') },
    { id: "topicWeatherConditions", label: t('safetyForms.toolbox.topics.weatherConditions', 'Weather Conditions and Work Stoppage') },
    { id: "topicCommunication", label: t('safetyForms.toolbox.topics.communication', 'Communication Signals and Procedures') },
    { id: "topicEmergencyEvacuation", label: t('safetyForms.toolbox.topics.emergencyEvacuation', 'Emergency Evacuation Procedures') },
    { id: "topicHazardAssessment", label: t('safetyForms.toolbox.topics.hazardAssessment', 'Work Area Hazard Assessment') },
    { id: "topicLoadCalculations", label: t('safetyForms.toolbox.topics.loadCalculations', 'Load Calculations and Weight Limits') },
    { id: "topicEquipmentCompatibility", label: t('safetyForms.toolbox.topics.equipmentCompatibility', 'Equipment Compatibility Check') },
    { id: "topicDescenderAscender", label: t('safetyForms.toolbox.topics.descenderAscender', 'Descender and Ascender Use') },
    { id: "topicEdgeProtection", label: t('safetyForms.toolbox.topics.edgeProtection', 'Edge Protection Requirements') },
    { id: "topicSwingFall", label: t('safetyForms.toolbox.topics.swingFall', 'Swing Fall Hazards') },
    { id: "topicMedicalFitness", label: t('safetyForms.toolbox.topics.medicalFitness', 'Medical Fitness and Fatigue Management') },
    { id: "topicToolDropPrevention", label: t('safetyForms.toolbox.topics.toolDropPrevention', 'Tool Drop Prevention') },
    { id: "topicRegulations", label: t('safetyForms.toolbox.topics.regulations', 'Working at Heights Regulations') },
    { id: "topicRescueProcedures", label: t('safetyForms.toolbox.topics.rescueProcedures', 'Rescue Procedures and Equipment') },
    { id: "topicSiteHazards", label: t('safetyForms.toolbox.topics.siteHazards', 'Site-Specific Hazards') },
    { id: "topicBuddySystem", label: t('safetyForms.toolbox.topics.buddySystem', 'Buddy System and Supervision') },
  ];

  const { data: projectsData } = useQuery<{ projects: Project[] }>({
    queryKey: ["/api/projects"],
  });

  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
  });

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const currentUser = userData?.user;
  // Filter out suspended and terminated employees - they should not appear in safety forms
  const employees = (employeesData?.employees || []).filter((e: any) => 
    !e.suspendedAt && e.connectionStatus !== 'suspended' && !e.terminatedDate
  );

  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const form = useForm<ToolboxMeetingFormValues>({
    resolver: zodResolver(toolboxMeetingFormSchema),
    defaultValues: {
      projectId: preselectedProjectId,
      meetingDate: getLocalDateString(),
      conductedByName: "",
      attendees: [],
      topicFallProtection: false,
      topicAnchorPoints: false,
      topicRopeInspection: false,
      topicKnotTying: false,
      topicPPECheck: false,
      topicWeatherConditions: false,
      topicCommunication: false,
      topicEmergencyEvacuation: false,
      topicHazardAssessment: false,
      topicLoadCalculations: false,
      topicEquipmentCompatibility: false,
      topicDescenderAscender: false,
      topicEdgeProtection: false,
      topicSwingFall: false,
      topicMedicalFitness: false,
      topicToolDropPrevention: false,
      topicRegulations: false,
      topicRescueProcedures: false,
      topicSiteHazards: false,
      topicBuddySystem: false,
      customTopic: "",
      additionalNotes: "",
    },
  });

  useEffect(() => {
    if (currentUser?.name && !form.getValues("conductedByName")) {
      form.setValue("conductedByName", currentUser.name);
    }
  }, [currentUser, form]);

  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee?.name || t('common.unknown', 'Unknown');
  };

  const selectedEmployeeNames = selectedEmployees.map(id => getEmployeeName(id));

  const handleAddSignature = () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: t('safetyForms.toolbox.toasts.noAttendeesSelected', 'No Attendees Selected'),
        description: t('safetyForms.toolbox.toasts.selectAttendeesFirst', 'Please select attendees first before collecting signatures'),
        variant: "destructive",
      });
      return;
    }
    setShowSignatureDialog(true);
  };

  const handleSaveSignature = () => {
    if (!selectedSignatureEmployee) {
      toast({
        title: t('safetyForms.toolbox.toasts.selectEmployee', 'Select Employee'),
        description: t('safetyForms.toolbox.toasts.selectEmployeeForSignature', 'Please select an employee for this signature'),
        variant: "destructive",
      });
      return;
    }

    if (signatureCanvasRef.current?.isEmpty()) {
      toast({
        title: t('safetyForms.toolbox.toasts.noSignature', 'No Signature'),
        description: t('safetyForms.toolbox.toasts.drawSignatureFirst', 'Please draw a signature before saving'),
        variant: "destructive",
      });
      return;
    }

    const employee = employees.find(e => e.id === selectedSignatureEmployee);
    if (!employee) return;

    const signatureDataUrl = signatureCanvasRef.current?.toDataURL() || "";
    
    if (signatures.some(s => s.employeeId === selectedSignatureEmployee)) {
      toast({
        title: t('safetyForms.toolbox.toasts.alreadySigned', 'Already Signed'),
        description: `${employee.name} ${t('safetyForms.toolbox.toasts.hasAlreadySigned', 'has already signed')}`,
        variant: "destructive",
      });
      return;
    }

    setSignatures(prev => [...prev, {
      employeeId: employee.id,
      employeeName: employee.name,
      signatureDataUrl,
    }]);

    toast({
      title: t('safetyForms.toolbox.toasts.signatureAdded', 'Signature Added'),
      description: `${t('safetyForms.toolbox.toasts.signatureSaved', 'Signature for')} ${employee.name} ${t('common.saved', 'has been saved')}`,
    });

    setShowSignatureDialog(false);
    setSelectedSignatureEmployee("");
    signatureCanvasRef.current?.clear();
  };

  const removeSignature = (employeeId: string) => {
    setSignatures(prev => prev.filter(s => s.employeeId !== employeeId));
    toast({
      description: t('safetyForms.toolbox.toasts.signatureRemoved', 'Signature removed'),
    });
  };

  const createMeetingMutation = useMutation({
    mutationFn: async (data: ToolboxMeetingFormValues) => {
      console.log('[Toolbox Meeting] Submitting:', {
        ...data,
        attendees: selectedEmployeeNames,
        attendeeIds: selectedEmployees,
        signatures,
      });
      
      const response = await apiRequest("POST", "/api/toolbox-meetings", {
        ...data,
        attendees: selectedEmployeeNames,
        attendeeIds: selectedEmployees,
        signatures,
      });
      
      const result = await response.json();
      console.log('[Toolbox Meeting] Success:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('[Toolbox Meeting] Navigating to dashboard');
      
      // Track toolbox meeting creation
      trackToolboxMeeting({
        projectId: data?.meeting?.projectId,
        attendeeCount: selectedEmployees.length,
      });
      
      toast({
        title: t('safetyForms.toolbox.toasts.success', 'Success'),
        description: t('safetyForms.toolbox.toasts.meetingRecorded', 'Toolbox meeting recorded successfully'),
      });
      // Invalidate both global and project-specific toolbox meetings
      queryClient.invalidateQueries({ queryKey: ["/api/toolbox-meetings"] });
      if (data?.meeting?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["/api/projects", data.meeting.projectId, "toolbox-meetings"] });
      }
      // Navigate back to project if opened from project, otherwise to dashboard
      handleNavigateBack();
    },
    onError: (error: Error) => {
      console.error('[Toolbox Meeting] Error:', error);
      toast({
        title: t('safetyForms.toolbox.toasts.error', 'Error'),
        description: error.message || t('safetyForms.toolbox.toasts.failedToRecord', 'Failed to record toolbox meeting'),
        variant: "destructive",
      });
    },
  });

  const getUnsignedAttendeeIds = () => {
    return selectedEmployees.filter(employeeId => {
      return !signatures.some(s => s.employeeId === employeeId);
    });
  };

  const unsignedAttendeeIds = getUnsignedAttendeeIds();
  const unsignedAttendeeNames = unsignedAttendeeIds.map(id => getEmployeeName(id));
  const allAttendeesSigned = selectedEmployees.length > 0 && unsignedAttendeeIds.length === 0;

  const onSubmit = async (data: ToolboxMeetingFormValues) => {
    if (selectedEmployees.length === 0) {
      toast({
        title: t('safetyForms.toolbox.toasts.error', 'Error'),
        description: t('safetyForms.toolbox.toasts.selectAtLeastOne', 'Please select at least one attendee'),
        variant: "destructive",
      });
      return;
    }
    
    if (unsignedAttendeeIds.length > 0) {
      toast({
        title: t('safetyForms.toolbox.toasts.signaturesRequired', 'Signatures Required'),
        description: `${t('safetyForms.toolbox.toasts.missingSignaturesFrom', 'All attendees must sign. Missing signatures from:')} ${unsignedAttendeeNames.join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createMeetingMutation.mutateAsync(data);
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
            <FileCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">{t('safetyForms.toolbox.title', 'Daily Toolbox Meeting')}</h1>
          </div>
        </div>

        <Card className="mb-4 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{t('safetyForms.toolbox.icopTitle', 'IRATA International Code of Practice (ICOP)')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('safetyForms.toolbox.icopDescription', 'All rope access operations must comply with the IRATA International Code of Practice for Industrial Rope Access (TC-102ENG). This document outlines mandatory safety requirements, technical procedures, and best practices for rope access work.')}
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
                  {t('safetyForms.toolbox.downloadICOP', 'Download Official ICOP Document')}
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
                  {t('safetyForms.toolbox.viewICOPInfo', 'View IRATA ICOP Information')}
                </a>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('safetyForms.toolbox.meetingInformation', 'Meeting Information')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.toolbox.project', 'Project')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-project">
                            <SelectValue placeholder={t('safetyForms.toolbox.selectProject', 'Select project')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="other">
                            {t('safetyForms.toolbox.otherOffsite', 'Other / Off-site (Office, Training, etc.)')}
                          </SelectItem>
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
                  name="meetingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.toolbox.meetingDate', 'Meeting Date')} *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="text-base"
                          data-testid="input-meeting-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conductedByName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.toolbox.conductedBy', 'Conducted By (Your Name)')} *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('safetyForms.toolbox.yourFullName', 'Your full name')}
                          data-testid="input-conducted-by"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div>
                    <FormLabel>{t('safetyForms.toolbox.attendees', 'Attendees')} *</FormLabel>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('safetyForms.toolbox.tapToSelect', 'Tap employees to select attendees')}
                    </p>
                  </div>
                  
                  {selectedEmployees.length > 0 && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-sm font-medium mb-2">
                        {t('safetyForms.toolbox.selected', 'Selected')} ({selectedEmployees.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployees.map((employeeId) => (
                          <Badge 
                            key={employeeId} 
                            variant="secondary"
                            className="cursor-pointer hover-elevate"
                            onClick={() => toggleEmployee(employeeId)}
                          >
                            {getEmployeeName(employeeId)} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {employees.map((employee) => (
                      <Card
                        key={employee.id}
                        className={`cursor-pointer hover-elevate transition-colors ${
                          selectedEmployees.includes(employee.id)
                            ? 'bg-primary/10 border-primary'
                            : ''
                        }`}
                        onClick={() => toggleEmployee(employee.id)}
                        data-testid={`employee-card-${employee.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                selectedEmployees.includes(employee.id)
                                  ? 'bg-primary border-primary'
                                  : 'border-muted-foreground'
                              }`}
                            >
                              {selectedEmployees.includes(employee.id) && (
                                <span className="material-icons text-primary-foreground text-sm">
                                  check
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {employee.name}
                              </div>
                              {employee.techLevel && (
                                <div className="text-xs text-muted-foreground">
                                  {employee.techLevel}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {selectedEmployees.length === 0 && (
                    <p className="text-sm text-destructive">
                      {t('safetyForms.toolbox.toasts.selectAtLeastOne', 'Please select at least one attendee')}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <Label>{t('safetyForms.toolbox.digitalSignatures', 'Digital Signatures')} *</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('safetyForms.toolbox.allMustSign', 'All attendees must sign before submitting')}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSignature}
                      disabled={selectedEmployees.length === 0 || allAttendeesSigned}
                      data-testid="button-add-signature"
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      {allAttendeesSigned ? t('safetyForms.toolbox.allSigned', 'All Signed') : t('safetyForms.toolbox.addSignature', 'Add Signature')}
                    </Button>
                  </div>

                  {selectedEmployees.length > 0 && unsignedAttendeeIds.length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <div className="flex items-start gap-2">
                        <span className="material-icons text-destructive text-base mt-0.5">warning</span>
                        <div>
                          <div className="text-sm font-medium text-destructive">
                            {unsignedAttendeeIds.length} {t('safetyForms.toolbox.attendeesNeedToSign', 'attendee(s) still need(s) to sign:')}
                          </div>
                          <div className="text-sm text-destructive/80 mt-1">
                            {unsignedAttendeeNames.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {allAttendeesSigned && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-green-600 dark:text-green-400 text-base">check_circle</span>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                          {t('safetyForms.toolbox.allAttendeesSigned', 'All attendees have signed')} ({selectedEmployees.length})
                        </div>
                      </div>
                    </div>
                  )}

                  {signatures.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {signatures.map((sig) => (
                        <Card key={sig.employeeId} className="border-green-500/30" data-testid={`signature-card-${sig.employeeId}`}>
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="material-icons text-green-500 text-sm">verified</span>
                                  <div className="font-medium text-sm">{sig.employeeName}</div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeSignature(sig.employeeId)}
                                  data-testid={`button-remove-signature-${sig.employeeId}`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="border rounded-md bg-background p-2">
                                <img 
                                  src={sig.signatureDataUrl} 
                                  alt={`${t('safetyForms.toolbox.signature', 'Signature')} - ${sig.employeeName}`}
                                  className="w-full h-16 object-contain"
                                  data-testid={`signature-image-${sig.employeeId}`}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {signatures.length === 0 && selectedEmployees.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {t('safetyForms.toolbox.tapAddSignature', 'Tap "Add Signature" to collect signatures from each attendee')}
                    </p>
                  )}

                  {selectedEmployees.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      {t('safetyForms.toolbox.selectAttendeesFirst', 'Select attendees above first, then collect their signatures')}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('safetyForms.toolbox.topicsDiscussed', 'Topics Discussed')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('safetyForms.toolbox.selectTopics', 'Select all topics that were covered in this meeting')}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {topics.map((topic) => (
                      <FormField
                        key={topic.id}
                        control={form.control}
                        name={topic.id as any}
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid={`checkbox-${topic.id}`}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {topic.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="customTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.toolbox.customTopic', 'Custom Topic (Optional)')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('safetyForms.toolbox.customTopicPlaceholder', 'Enter any additional topic discussed')}
                          data-testid="input-custom-topic"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.toolbox.additionalNotes', 'Additional Notes (Optional)')}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t('safetyForms.toolbox.additionalNotesPlaceholder', 'Any additional information or discussion points...')}
                          className="min-h-24"
                          data-testid="input-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !allAttendeesSigned}
                  data-testid="button-submit"
                >
                  {isSubmitting ? t('safetyForms.toolbox.recording', 'Recording...') : 
                   selectedEmployees.length === 0 ? t('safetyForms.toolbox.selectAttendeesToContinue', 'Select Attendees to Continue') :
                   !allAttendeesSigned ? `${t('safetyForms.toolbox.collectMissingSignatures', 'Collect Missing Signatures')} (${unsignedAttendeeIds.length})` :
                   t('safetyForms.toolbox.recordMeeting', 'Record Toolbox Meeting')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t('safetyForms.toolbox.collectSignature', 'Collect Digital Signature')}</DialogTitle>
              <DialogDescription>
                {t('safetyForms.toolbox.selectEmployeeCapture', 'Select an employee and capture their signature on the device')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>{t('safetyForms.toolbox.selectEmployee', 'Select Employee')} *</Label>
                <Select value={selectedSignatureEmployee} onValueChange={setSelectedSignatureEmployee}>
                  <SelectTrigger data-testid="select-signature-employee">
                    <SelectValue placeholder={t('safetyForms.toolbox.chooseEmployeeToSign', 'Choose employee to sign')} />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEmployees.map((employeeId) => {
                      const employee = employees.find(e => e.id === employeeId);
                      if (!employee) return null;
                      const alreadySigned = signatures.some(s => s.employeeId === employeeId);
                      return (
                        <SelectItem 
                          key={employeeId} 
                          value={employeeId}
                          disabled={alreadySigned}
                        >
                          {employee.name} {alreadySigned ? `(${t('safetyForms.toolbox.alreadySigned', 'Already signed')})` : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('safetyForms.toolbox.signature', 'Signature')} *</Label>
                <div className="border-2 border-dashed rounded-md p-2 bg-background">
                  <SignatureCanvas
                    ref={signatureCanvasRef}
                    canvasProps={{
                      className: 'signature-canvas w-full h-48 bg-white rounded'
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t('safetyForms.toolbox.drawSignature', 'Draw signature with finger or stylus')}
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => signatureCanvasRef.current?.clear()}
                data-testid="button-clear-signature"
              >
                {t('safetyForms.toolbox.clear', 'Clear')}
              </Button>
              <Button
                type="button"
                onClick={handleSaveSignature}
                data-testid="button-save-signature"
              >
                {t('safetyForms.toolbox.saveSignature', 'Save Signature')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
