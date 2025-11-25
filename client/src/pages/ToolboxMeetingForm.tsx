import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
  attendees: z.union([z.string(), z.array(z.string())]).optional(), // Can be string or array, handled in mutation
  
  // Topics
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

const topics = [
  { id: "topicFallProtection", label: "Fall Protection and Rescue Procedures" },
  { id: "topicAnchorPoints", label: "Anchor Point Selection and Inspection" },
  { id: "topicRopeInspection", label: "Rope Inspection and Maintenance" },
  { id: "topicKnotTying", label: "Knot Tying and Verification" },
  { id: "topicPPECheck", label: "Personal Protective Equipment (PPE) Check" },
  { id: "topicWeatherConditions", label: "Weather Conditions and Work Stoppage" },
  { id: "topicCommunication", label: "Communication Signals and Procedures" },
  { id: "topicEmergencyEvacuation", label: "Emergency Evacuation Procedures" },
  { id: "topicHazardAssessment", label: "Work Area Hazard Assessment" },
  { id: "topicLoadCalculations", label: "Load Calculations and Weight Limits" },
  { id: "topicEquipmentCompatibility", label: "Equipment Compatibility Check" },
  { id: "topicDescenderAscender", label: "Descender and Ascender Use" },
  { id: "topicEdgeProtection", label: "Edge Protection Requirements" },
  { id: "topicSwingFall", label: "Swing Fall Hazards" },
  { id: "topicMedicalFitness", label: "Medical Fitness and Fatigue Management" },
  { id: "topicToolDropPrevention", label: "Tool Drop Prevention" },
  { id: "topicRegulations", label: "Working at Heights Regulations" },
  { id: "topicRescueProcedures", label: "Rescue Procedures and Equipment" },
  { id: "topicSiteHazards", label: "Site-Specific Hazards" },
  { id: "topicBuddySystem", label: "Buddy System and Supervision" },
];

type Signature = {
  employeeId: string;
  employeeName: string;
  signatureDataUrl: string;
};

export default function ToolboxMeetingForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [selectedSignatureEmployee, setSelectedSignatureEmployee] = useState<string>("");
  const signatureCanvasRef = useRef<SignatureCanvas>(null);

  const { data: projectsData } = useQuery<{ projects: Project[] }>({
    queryKey: ["/api/projects"],
  });

  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
  });

  // Filter out terminated employees
  const employees = (employeesData?.employees || []);

  // Helper for local date formatting
  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const form = useForm<ToolboxMeetingFormValues>({
    resolver: zodResolver(toolboxMeetingFormSchema),
    defaultValues: {
      projectId: "",
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

  const toggleEmployee = (employeeName: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeName)
        ? prev.filter(name => name !== employeeName)
        : [...prev, employeeName]
    );
  };

  const handleAddSignature = () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "No Attendees Selected",
        description: "Please select attendees first before collecting signatures",
        variant: "destructive",
      });
      return;
    }
    setShowSignatureDialog(true);
  };

  const handleSaveSignature = () => {
    if (!selectedSignatureEmployee) {
      toast({
        title: "Select Employee",
        description: "Please select an employee for this signature",
        variant: "destructive",
      });
      return;
    }

    if (signatureCanvasRef.current?.isEmpty()) {
      toast({
        title: "No Signature",
        description: "Please draw a signature before saving",
        variant: "destructive",
      });
      return;
    }

    const employee = employees.find(e => e.id === selectedSignatureEmployee);
    if (!employee) return;

    const signatureDataUrl = signatureCanvasRef.current?.toDataURL() || "";
    
    // Check if employee already signed
    if (signatures.some(s => s.employeeId === selectedSignatureEmployee)) {
      toast({
        title: "Already Signed",
        description: `${employee.name} has already signed`,
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
      title: "Signature Added",
      description: `Signature for ${employee.name} has been saved`,
    });

    setShowSignatureDialog(false);
    setSelectedSignatureEmployee("");
    signatureCanvasRef.current?.clear();
  };

  const removeSignature = (employeeId: string) => {
    setSignatures(prev => prev.filter(s => s.employeeId !== employeeId));
    toast({
      description: "Signature removed",
    });
  };

  const createMeetingMutation = useMutation({
    mutationFn: async (data: ToolboxMeetingFormValues) => {
      console.log('[Toolbox Meeting] Submitting:', {
        ...data,
        attendees: selectedEmployees,
        signatures,
      });
      
      // Use selectedEmployees and signatures
      const response = await apiRequest("POST", "/api/toolbox-meetings", {
        ...data,
        attendees: selectedEmployees,
        signatures,
      });
      
      const result = await response.json();
      console.log('[Toolbox Meeting] Success:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('[Toolbox Meeting] Navigating to dashboard');
      toast({
        title: "Success",
        description: "Toolbox meeting recorded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/toolbox-meetings"] });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      console.error('[Toolbox Meeting] Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record toolbox meeting",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ToolboxMeetingFormValues) => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one attendee",
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
            onClick={() => navigate("/dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Daily Toolbox Meeting</h1>
          </div>
        </div>

        <Card className="mb-4 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">IRATA International Code of Practice (ICOP)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              All rope access operations must comply with the IRATA International Code of Practice for Industrial Rope Access (TC-102ENG).
              This document outlines mandatory safety requirements, technical procedures, and best practices for rope access work.
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
                  Download Official ICOP Document
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
                  View IRATA ICOP Information
                </a>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-project">
                            <SelectValue placeholder="Select project" />
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
                  name="meetingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Date *</FormLabel>
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
                      <FormLabel>Conducted By (Your Name) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your full name"
                          data-testid="input-conducted-by"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div>
                    <FormLabel>Attendees *</FormLabel>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tap employees to select attendees
                    </p>
                  </div>
                  
                  {selectedEmployees.length > 0 && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-sm font-medium mb-2">
                        Selected ({selectedEmployees.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployees.map((name, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary"
                            className="cursor-pointer hover-elevate"
                            onClick={() => toggleEmployee(name)}
                          >
                            {name} ×
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
                          selectedEmployees.includes(employee.name)
                            ? 'bg-primary/10 border-primary'
                            : ''
                        }`}
                        onClick={() => toggleEmployee(employee.name)}
                        data-testid={`employee-card-${employee.id}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                selectedEmployees.includes(employee.name)
                                  ? 'bg-primary border-primary'
                                  : 'border-muted-foreground'
                              }`}
                            >
                              {selectedEmployees.includes(employee.name) && (
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
                      Please select at least one attendee
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Digital Signatures</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Collect signatures from attendees
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddSignature}
                      data-testid="button-add-signature"
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      Add Signature
                    </Button>
                  </div>

                  {signatures.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {signatures.map((sig) => (
                        <Card key={sig.employeeId} data-testid={`signature-card-${sig.employeeId}`}>
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-sm">{sig.employeeName}</div>
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
                                  alt={`Signature of ${sig.employeeName}`}
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

                  {signatures.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No signatures collected yet
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Topics Discussed</h3>
                  <p className="text-sm text-muted-foreground">
                    Select all topics that were covered in this meeting
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
                      <FormLabel>Custom Topic (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter any additional topic discussed"
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
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Any additional information or discussion points..."
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
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Recording..." : "Record Toolbox Meeting"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Collect Digital Signature</DialogTitle>
              <DialogDescription>
                Select an employee and capture their signature on the device
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Select Employee *</Label>
                <Select value={selectedSignatureEmployee} onValueChange={setSelectedSignatureEmployee}>
                  <SelectTrigger data-testid="select-signature-employee">
                    <SelectValue placeholder="Choose employee to sign" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEmployees.map((attendeeName) => {
                      const employee = employees.find(e => e.name === attendeeName);
                      if (!employee) return null;
                      const alreadySigned = signatures.some(s => s.employeeId === employee.id);
                      return (
                        <SelectItem 
                          key={employee.id} 
                          value={employee.id}
                          disabled={alreadySigned}
                        >
                          {employee.name} {alreadySigned ? "(Already signed)" : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Signature *</Label>
                <div className="border-2 border-dashed rounded-md p-2 bg-background">
                  <SignatureCanvas
                    ref={signatureCanvasRef}
                    canvasProps={{
                      className: 'signature-canvas w-full h-48 bg-white rounded'
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Draw signature with finger or stylus
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
                Clear
              </Button>
              <Button
                type="button"
                onClick={handleSaveSignature}
                data-testid="button-save-signature"
              >
                Save Signature
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
