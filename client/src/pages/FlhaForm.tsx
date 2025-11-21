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

const hazards = [
  { id: "hazardFalling", label: "Falls from Height" },
  { id: "hazardSwingFall", label: "Swing Fall Hazard" },
  { id: "hazardSuspendedRescue", label: "Suspension Trauma / Rescue Required" },
  { id: "hazardWeather", label: "Adverse Weather Conditions" },
  { id: "hazardElectrical", label: "Electrical Hazards" },
  { id: "hazardFallingObjects", label: "Falling Tools/Objects" },
  { id: "hazardChemical", label: "Chemical Exposure" },
  { id: "hazardConfined", label: "Confined Spaces" },
  { id: "hazardSharpEdges", label: "Sharp Edges / Rope Damage" },
  { id: "hazardUnstableAnchors", label: "Unstable Anchor Points" },
  { id: "hazardPowerTools", label: "Power Tool Operation at Height" },
  { id: "hazardPublic", label: "Public Interaction / Access" },
];

const controls = [
  { id: "controlPPE", label: "Proper PPE (Harness, Helmet, etc.)" },
  { id: "controlBackupSystem", label: "Backup Safety Systems" },
  { id: "controlEdgeProtection", label: "Edge Protection Installed" },
  { id: "controlBarricades", label: "Barricades / Signage" },
  { id: "controlWeatherMonitoring", label: "Weather Monitoring" },
  { id: "controlRescuePlan", label: "Emergency Rescue Plan" },
  { id: "controlCommunication", label: "Communication System" },
  { id: "controlToolTethering", label: "Tool Tethering / Drop Prevention" },
  { id: "controlPermits", label: "Work Permits Obtained" },
  { id: "controlInspections", label: "Pre-work Equipment Inspections" },
];

type Signature = {
  employeeId: string;
  employeeName: string;
  signatureDataUrl: string;
};

export default function FlhaForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [selectedSignatureEmployee, setSelectedSignatureEmployee] = useState<string>("");
  const signatureCanvasRef = useRef<SignatureCanvas>(null);

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
  const employees = (employeesData?.employees || []);

  const form = useForm<FlhaFormValues>({
    resolver: zodResolver(flhaFormSchema),
    defaultValues: {
      projectId: "",
      assessmentDate: new Date().toISOString().split("T")[0],
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
        title: "Error",
        description: "Please provide a signature",
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
      title: "Success",
      description: `Signature captured for ${employee.name}`,
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
      toast({
        title: "Success",
        description: "FLHA form submitted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/flha-forms"] });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit FLHA form",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FlhaFormValues) => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one team member",
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
            onClick={() => navigate("/safety-forms")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Field Level Hazard Assessment</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FLHA Form - Rope Access</CardTitle>
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
                  name="assessmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Date *</FormLabel>
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
                      <FormLabel>Assessor Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your full name"
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
                      <FormLabel>Job Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the work to be performed..."
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
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Building/Site location"
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
                      <FormLabel>Specific Work Area</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., East elevation, Roof, Parkade Level 2"
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
                    Identified Hazards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hazards.map((hazard) => (
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
                              {hazard.label}
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
                        <FormLabel>Additional Hazards</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe any additional hazards not listed above..."
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
                    Controls Implemented
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {controls.map((control) => (
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
                              {control.label}
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
                        <FormLabel>Additional Controls</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Describe any additional controls not listed above..."
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
                  <h3 className="text-lg font-semibold">Risk Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="riskLevelBefore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Level (Before Controls)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-risk-before">
                                <SelectValue placeholder="Select risk level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="extreme">Extreme</SelectItem>
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
                          <FormLabel>Risk Level (After Controls)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-risk-after">
                                <SelectValue placeholder="Select risk level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="extreme">Extreme</SelectItem>
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
                      <FormLabel>Emergency Contacts</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="List emergency contacts and phone numbers..."
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
                    <FormLabel>Team Members *</FormLabel>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select all team members involved in this work
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
                      <h3 className="text-lg font-semibold">Team Signatures</h3>
                      <Badge variant="secondary">
                        {signatures.length} of {selectedEmployees.length} signed
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
                                  Signed
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
                                Sign
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
                    onClick={() => navigate("/safety-forms")}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="button-submit"
                    className="flex-1"
                  >
                    {isSubmitting ? "Submitting..." : "Submit FLHA"}
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
            <DialogTitle>Provide Signature</DialogTitle>
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
              Sign above using your mouse or touch screen
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearSignature}
              data-testid="button-clear-signature"
            >
              Clear
            </Button>
            <Button
              type="button"
              onClick={saveSignature}
              data-testid="button-save-signature"
            >
              Save Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
