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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, AlertTriangle, PenTool, Plus, X, Trash2 } from "lucide-react";
import type { Project } from "@shared/schema";
import SignatureCanvas from "react-signature-canvas";

const personInvolvedSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  injuryType: z.string().optional(),
  bodyPartAffected: z.string().optional(),
  medicalTreatment: z.string().optional(),
});

const correctiveActionSchema = z.object({
  action: z.string().min(1, "Action is required"),
  assignedTo: z.string().min(1, "Assigned to is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.string().min(1, "Status is required"),
});

const incidentReportFormSchema = z.object({
  incidentDate: z.string().min(1, "Incident date is required"),
  incidentTime: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  projectId: z.string().optional(),
  reportedByName: z.string().min(1, "Reporter name is required"),
  reportDate: z.string().min(1, "Report date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  incidentType: z.string().optional(),
  severity: z.string().optional(),
  immediateCause: z.string().optional(),
  rootCause: z.string().optional(),
  contributingFactors: z.string().optional(),
  reportableToRegulator: z.boolean().default(false),
  regulatorNotificationDate: z.string().optional(),
  regulatorReferenceNumber: z.string().optional(),
  supervisorReviewedBy: z.string().optional(),
  supervisorReviewDate: z.string().optional(),
  supervisorComments: z.string().optional(),
  managementReviewedBy: z.string().optional(),
  managementReviewDate: z.string().optional(),
  managementComments: z.string().optional(),
});

type IncidentReportFormValues = z.infer<typeof incidentReportFormSchema>;

type PersonInvolved = z.infer<typeof personInvolvedSchema>;
type CorrectiveAction = z.infer<typeof correctiveActionSchema>;

type Signature = {
  role: string;
  name: string;
  signatureDataUrl: string;
};

export default function IncidentReportForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // People Involved State
  const [peopleInvolved, setPeopleInvolved] = useState<PersonInvolved[]>([]);
  const [showAddPersonDialog, setShowAddPersonDialog] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<PersonInvolved>({
    name: "",
    role: "",
    injuryType: "",
    bodyPartAffected: "",
    medicalTreatment: "",
  });

  // Corrective Actions State
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
  const [showAddActionDialog, setShowAddActionDialog] = useState(false);
  const [currentAction, setCurrentAction] = useState<CorrectiveAction>({
    action: "",
    assignedTo: "",
    dueDate: "",
    status: "pending",
  });

  // Signatures State
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signatureRole, setSignatureRole] = useState("");
  const [signatureName, setSignatureName] = useState("");
  const signatureCanvasRef = useRef<SignatureCanvas>(null);

  const { data: projectsData } = useQuery<{ projects: Project[] }>({
    queryKey: ["/api/projects"],
  });

  const projects = projectsData?.projects || [];

  // Helper for local date formatting
  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const form = useForm<IncidentReportFormValues>({
    resolver: zodResolver(incidentReportFormSchema),
    defaultValues: {
      incidentDate: getLocalDateString(),
      incidentTime: "",
      location: "",
      projectId: "",
      reportedByName: "",
      reportDate: getLocalDateString(),
      description: "",
      incidentType: "",
      severity: "",
      immediateCause: "",
      rootCause: "",
      contributingFactors: "",
      reportableToRegulator: false,
      regulatorNotificationDate: "",
      regulatorReferenceNumber: "",
      supervisorReviewedBy: "",
      supervisorReviewDate: "",
      supervisorComments: "",
      managementReviewedBy: "",
      managementReviewDate: "",
      managementComments: "",
    },
  });

  // Add Person Involved
  const handleAddPerson = () => {
    if (!currentPerson.name || !currentPerson.role) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter name and role",
        variant: "destructive",
      });
      return;
    }

    setPeopleInvolved([...peopleInvolved, currentPerson]);
    setCurrentPerson({
      name: "",
      role: "",
      injuryType: "",
      bodyPartAffected: "",
      medicalTreatment: "",
    });
    setShowAddPersonDialog(false);

    toast({
      title: "Person Added",
      description: "Person has been added to the report",
    });
  };

  const handleRemovePerson = (index: number) => {
    setPeopleInvolved(peopleInvolved.filter((_, i) => i !== index));
  };

  // Add Corrective Action
  const handleAddAction = () => {
    if (!currentAction.action || !currentAction.assignedTo || !currentAction.dueDate) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setCorrectiveActions([...correctiveActions, currentAction]);
    setCurrentAction({
      action: "",
      assignedTo: "",
      dueDate: "",
      status: "pending",
    });
    setShowAddActionDialog(false);

    toast({
      title: "Action Added",
      description: "Corrective action has been added",
    });
  };

  const handleRemoveAction = (index: number) => {
    setCorrectiveActions(correctiveActions.filter((_, i) => i !== index));
  };

  // Signature Management
  const handleAddSignature = () => {
    setShowSignatureDialog(true);
  };

  const handleSaveSignature = () => {
    if (!signatureRole || !signatureName) {
      toast({
        title: "Missing Information",
        description: "Please enter role and name",
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

    const signatureDataUrl = signatureCanvasRef.current?.toDataURL() || "";
    setSignatures([...signatures, { role: signatureRole, name: signatureName, signatureDataUrl }]);
    setSignatureRole("");
    setSignatureName("");
    signatureCanvasRef.current?.clear();
    setShowSignatureDialog(false);

    toast({
      title: "Signature Added",
      description: `Signature for ${signatureRole} saved successfully`,
    });
  };

  const handleRemoveSignature = (index: number) => {
    setSignatures(signatures.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: async (values: IncidentReportFormValues) => {
      const payload = {
        ...values,
        peopleInvolved,
        correctiveActionItems: correctiveActions,
        signatures,
      };

      return await apiRequest("POST", "/api/incident-reports", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incident-reports"] });
      toast({
        title: "Report Saved",
        description: "Incident report has been saved successfully",
      });
      navigate("/documents");
    },
    onError: (error: Error) => {
      toast({
        title: "Error Saving Report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: IncidentReportFormValues) => {
    if (peopleInvolved.length === 0) {
      toast({
        title: "No People Involved",
        description: "Please add at least one person involved in the incident",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    mutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/documents")}
            className="mb-2"
            data-testid="back-to-documents"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div>
              <h1 className="text-3xl font-bold">Incident Report</h1>
              <p className="text-muted-foreground">
                Official incident documentation and investigation
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="incidentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-incident-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="incidentTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} data-testid="input-incident-time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="Specific location of incident" {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Related Project (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-project">
                            <SelectValue placeholder="Select a project (if applicable)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project) => (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reportedByName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reported By *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} data-testid="input-reported-by" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reportDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-report-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of what happened"
                          className="min-h-[120px]"
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* People Involved */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  People Involved
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowAddPersonDialog(true)}
                    data-testid="add-person-button"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Person
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {peopleInvolved.length > 0 ? (
                  <div className="space-y-3">
                    {peopleInvolved.map((person, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-md border">
                        <div className="flex-1">
                          <div className="font-medium">{person.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {person.role}
                            {person.injuryType && person.injuryType !== "none" && (
                              <> • Injury: {person.injuryType}</>
                            )}
                          </div>
                          {person.bodyPartAffected && (
                            <div className="text-sm text-muted-foreground">
                              Body Part: {person.bodyPartAffected}
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemovePerson(index)}
                          data-testid={`remove-person-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    No people added yet. Click "Add Person" to add someone involved.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Incident Classification */}
            <Card>
              <CardHeader>
                <CardTitle>Incident Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="incidentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-incident-type">
                            <SelectValue placeholder="Select incident type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="injury">Injury</SelectItem>
                          <SelectItem value="near_miss">Near Miss</SelectItem>
                          <SelectItem value="property_damage">Property Damage</SelectItem>
                          <SelectItem value="equipment_failure">Equipment Failure</SelectItem>
                          <SelectItem value="environmental">Environmental</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-severity">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="major">Major</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="immediateCause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Immediate Cause</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-immediate-cause">
                            <SelectValue placeholder="Select immediate cause" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="unsafe_act">Unsafe Act</SelectItem>
                          <SelectItem value="unsafe_condition">Unsafe Condition</SelectItem>
                          <SelectItem value="equipment_malfunction">Equipment Malfunction</SelectItem>
                          <SelectItem value="procedural_failure">Procedural Failure</SelectItem>
                          <SelectItem value="environmental_factor">Environmental Factor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Root Cause Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Root Cause Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="rootCause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Root Cause</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed root cause analysis"
                          className="min-h-[100px]"
                          {...field}
                          data-testid="textarea-root-cause"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contributingFactors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contributing Factors</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional contributing factors"
                          className="min-h-[80px]"
                          {...field}
                          data-testid="textarea-contributing-factors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Corrective Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Corrective Actions
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowAddActionDialog(true)}
                    data-testid="add-action-button"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Action
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {correctiveActions.length > 0 ? (
                  <div className="space-y-3">
                    {correctiveActions.map((action, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-md border">
                        <div className="flex-1">
                          <div className="font-medium">{action.action}</div>
                          <div className="text-sm text-muted-foreground">
                            Assigned to: {action.assignedTo} • Due: {new Date(action.dueDate).toLocaleDateString()}
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            {action.status}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveAction(index)}
                          data-testid={`remove-action-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    No corrective actions added yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Regulatory Reporting */}
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Reporting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="reportableToRegulator"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-reportable"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          This incident is reportable to regulatory authorities
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("reportableToRegulator") && (
                  <div className="space-y-4 pl-7">
                    <FormField
                      control={form.control}
                      name="regulatorNotificationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-notification-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="regulatorReferenceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Regulator's reference number" {...field} data-testid="input-reference-number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supervisor Review */}
            <Card>
              <CardHeader>
                <CardTitle>Supervisor Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="supervisorReviewedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reviewed By</FormLabel>
                        <FormControl>
                          <Input placeholder="Supervisor name" {...field} data-testid="input-supervisor-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supervisorReviewDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-supervisor-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="supervisorComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supervisor Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Supervisor's review comments"
                          className="min-h-[80px]"
                          {...field}
                          data-testid="textarea-supervisor-comments"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Management Review */}
            <Card>
              <CardHeader>
                <CardTitle>Management Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="managementReviewedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reviewed By</FormLabel>
                        <FormControl>
                          <Input placeholder="Management representative" {...field} data-testid="input-management-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="managementReviewDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-management-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="managementComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Management Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Management's review comments"
                          className="min-h-[80px]"
                          {...field}
                          data-testid="textarea-management-comments"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Signatures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Signatures
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddSignature}
                    data-testid="add-signature-button"
                  >
                    <PenTool className="h-4 w-4 mr-1" />
                    Add Signature
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {signatures.length > 0 ? (
                  <div className="space-y-4">
                    {signatures.map((sig, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-md border">
                        <div className="flex-1">
                          <div className="font-medium">{sig.role}</div>
                          <div className="text-sm text-muted-foreground">{sig.name}</div>
                          <img
                            src={sig.signatureDataUrl}
                            alt="Signature"
                            className="mt-2 h-16 border rounded"
                          />
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveSignature(index)}
                          data-testid={`remove-signature-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    No signatures added yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/documents")}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="flex-1"
                data-testid="submit-button"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {isSubmitting || mutation.isPending ? "Saving..." : "Save Incident Report"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Add Person Dialog */}
        <Dialog open={showAddPersonDialog} onOpenChange={setShowAddPersonDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Person Involved</DialogTitle>
              <DialogDescription>
                Enter details about the person involved in this incident
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={currentPerson.name}
                  onChange={(e) => setCurrentPerson({ ...currentPerson, name: e.target.value })}
                  placeholder="Full name"
                  data-testid="dialog-input-person-name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role *</label>
                <Select
                  value={currentPerson.role}
                  onValueChange={(value) => setCurrentPerson({ ...currentPerson, role: value })}
                >
                  <SelectTrigger data-testid="dialog-select-person-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="visitor">Visitor</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="witness">Witness</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Injury Type</label>
                <Select
                  value={currentPerson.injuryType}
                  onValueChange={(value) => setCurrentPerson({ ...currentPerson, injuryType: value })}
                >
                  <SelectTrigger data-testid="dialog-select-injury-type">
                    <SelectValue placeholder="Select injury type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Injury</SelectItem>
                    <SelectItem value="minor">Minor Injury</SelectItem>
                    <SelectItem value="first_aid">First Aid Required</SelectItem>
                    <SelectItem value="medical">Medical Treatment Required</SelectItem>
                    <SelectItem value="lost_time">Lost Time Injury</SelectItem>
                    <SelectItem value="serious">Serious Injury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentPerson.injuryType && currentPerson.injuryType !== "none" && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Body Part Affected</label>
                    <Input
                      value={currentPerson.bodyPartAffected}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, bodyPartAffected: e.target.value })}
                      placeholder="e.g., Left hand, right leg"
                      data-testid="dialog-input-body-part"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Medical Treatment</label>
                    <Textarea
                      value={currentPerson.medicalTreatment}
                      onChange={(e) => setCurrentPerson({ ...currentPerson, medicalTreatment: e.target.value })}
                      placeholder="Describe medical treatment received"
                      data-testid="dialog-textarea-medical-treatment"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddPersonDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPerson} data-testid="dialog-save-person">
                Add Person
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Corrective Action Dialog */}
        <Dialog open={showAddActionDialog} onOpenChange={setShowAddActionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Corrective Action</DialogTitle>
              <DialogDescription>
                Define an action to prevent recurrence
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Action *</label>
                <Textarea
                  value={currentAction.action}
                  onChange={(e) => setCurrentAction({ ...currentAction, action: e.target.value })}
                  placeholder="Describe the corrective action"
                  data-testid="dialog-textarea-action"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assigned To *</label>
                <Input
                  value={currentAction.assignedTo}
                  onChange={(e) => setCurrentAction({ ...currentAction, assignedTo: e.target.value })}
                  placeholder="Person responsible"
                  data-testid="dialog-input-assigned-to"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date *</label>
                <Input
                  type="date"
                  value={currentAction.dueDate}
                  onChange={(e) => setCurrentAction({ ...currentAction, dueDate: e.target.value })}
                  data-testid="dialog-input-due-date"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status *</label>
                <Select
                  value={currentAction.status}
                  onValueChange={(value) => setCurrentAction({ ...currentAction, status: value })}
                >
                  <SelectTrigger data-testid="dialog-select-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddActionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAction} data-testid="dialog-save-action">
                Add Action
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Signature Dialog */}
        <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Signature</DialogTitle>
              <DialogDescription>
                Draw your signature below to authenticate this report
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role *</label>
                <Input
                  value={signatureRole}
                  onChange={(e) => setSignatureRole(e.target.value)}
                  placeholder="e.g., Reporter, Supervisor, Manager"
                  data-testid="dialog-input-signature-role"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Full name"
                  data-testid="dialog-input-signature-name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Signature *</label>
                <div className="border rounded-md">
                  <SignatureCanvas
                    ref={signatureCanvasRef}
                    canvasProps={{
                      className: "w-full h-32 rounded-md",
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => signatureCanvasRef.current?.clear()}
                  data-testid="dialog-clear-signature"
                >
                  Clear
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSignatureDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSignature} data-testid="dialog-save-signature">
                Save Signature
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
