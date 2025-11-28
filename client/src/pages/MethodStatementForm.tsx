import { useState, useRef, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, FileCheck, PenTool, X, Shield, Plus, Trash2 } from "lucide-react";
import type { Project, User } from "@shared/schema";
import SignatureCanvas from "react-signature-canvas";
import { jsPDF } from "jspdf";

// Standard job types for rope access work
const STANDARD_JOB_TYPES = [
  { value: "window_cleaning", label: "Window Cleaning" },
  { value: "dryer_vent_cleaning", label: "Dryer Vent Cleaning" },
  { value: "building_wash", label: "Building Wash" },
  { value: "in_suite_dryer_vent_cleaning", label: "In-Suite Dryer Vent Cleaning" },
  { value: "parkade_pressure_cleaning", label: "Parkade Pressure Cleaning" },
  { value: "ground_window_cleaning", label: "Ground Window Cleaning" },
  { value: "general_pressure_washing", label: "General Pressure Washing" },
  { value: "other", label: "Other" },
];

const methodStatementFormSchema = z.object({
  projectId: z.string().optional(), // Optional - can be job type only without a project
  dateCreated: z.string().min(1, "Date is required"),
  preparedByName: z.string().min(1, "Your name is required"),
  jobType: z.string().min(1, "Job type is required"),
  location: z.string().optional(), // Optional - not needed for job-type-only method statements
  
  workDescription: z.string().min(1, "Work description is required"),
  scopeDetails: z.string().min(1, "Scope details are required"),
  workDuration: z.string().optional(),
  numberOfWorkers: z.coerce.number().int().positive().optional(),
  
  hazardsIdentified: z.union([z.string(), z.array(z.string())]).optional(),
  controlMeasures: z.union([z.string(), z.array(z.string())]).optional(),
  requiredEquipment: z.union([z.string(), z.array(z.string())]).optional(),
  requiredPpe: z.union([z.string(), z.array(z.string())]).optional(),
  
  emergencyProcedures: z.string().min(1, "Emergency procedures are required"),
  rescuePlan: z.string().optional(),
  emergencyContacts: z.string().optional(),
  
  permitsRequired: z.union([z.string(), z.array(z.string())]).optional(),
  weatherRestrictions: z.string().optional(),
  workingHeightRange: z.string().optional(),
  accessMethod: z.string().optional(),
  competencyRequirements: z.union([z.string(), z.array(z.string())]).optional(),
  irataLevelRequired: z.string().optional(),
  communicationMethod: z.string().optional(),
  signalProtocol: z.string().optional(),
  teamMembers: z.union([z.string(), z.array(z.string())]).optional(),
  
  reviewedByName: z.string().optional(),
  reviewDate: z.string().optional(),
  approvedByName: z.string().optional(),
  approvalDate: z.string().optional(),
});

type MethodStatementFormValues = z.infer<typeof methodStatementFormSchema>;

type Signature = {
  employeeId: string;
  employeeName: string;
  signatureDataUrl: string;
  role: string;
  signedAt: string;
};

// Helper function to add company branding to PDF
const addCompanyBranding = (doc: jsPDF, pageWidth: number, currentUser: any): number => {
  if (!currentUser?.whitelabelBrandingActive || !currentUser?.companyName) {
    return 0; // No branding, return 0 additional height
  }

  const companyName = currentUser?.companyName || '';

  // Add company name at top of header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName.toUpperCase(), pageWidth / 2, 8, { align: 'center' });

  return 5; // Return additional height used by branding
};

// Download Method Statement as PDF
export const downloadMethodStatement = (statement: any, currentUser: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add multi-line text with pagination
  const addMultilineText = (lines: string[], currentY: number, lineHeight: number = 6): number => {
    let y = currentY;
    for (const line of lines) {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += lineHeight;
    }
    return y;
  };

  // Header - Green for Method Statement
  doc.setFillColor(34, 197, 94); // Green
  
  // Add company branding if active
  const brandingHeight = addCompanyBranding(doc, pageWidth, currentUser);
  const headerHeight = 35 + brandingHeight;
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('METHOD STATEMENT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Safe Work Procedure & Risk Control Document', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

  yPosition = 45 + brandingHeight;

  // Basic Information Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Document Information', 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Location: ${statement.location || 'N/A'}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Date Created: ${new Date(statement.dateCreated).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Prepared By: ${statement.preparedByName}`, 20, yPosition);
  yPosition += 6;
  // Format job type for display
  const formatJobType = (jobType: string) => {
    if (!jobType) return 'N/A';
    if (jobType.startsWith('custom:')) return jobType.replace('custom:', '');
    const labels: Record<string, string> = {
      'window_cleaning': 'Window Cleaning',
      'dryer_vent_cleaning': 'Dryer Vent Cleaning',
      'building_wash': 'Building Wash',
      'in_suite_dryer_vent_cleaning': 'In-Suite Dryer Vent Cleaning',
      'parkade_pressure_cleaning': 'Parkade Pressure Cleaning',
      'ground_window_cleaning': 'Ground Window Cleaning',
      'general_pressure_washing': 'General Pressure Washing',
      'other': 'Other'
    };
    return labels[jobType] || jobType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };
  doc.text(`Job Type: ${formatJobType(statement.jobType || statement.jobTitle)}`, 20, yPosition);
  yPosition += 10;

  // Work Description Section
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Work Description', 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const workDescriptionLines = doc.splitTextToSize(statement.workDescription || 'N/A', pageWidth - 40);
  yPosition = addMultilineText(workDescriptionLines, yPosition);
  yPosition += 6;

  doc.setFont('helvetica', 'bold');
  doc.text('Scope Details:', 20, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  const scopeLines = doc.splitTextToSize(statement.scopeDetails || 'N/A', pageWidth - 40);
  yPosition = addMultilineText(scopeLines, yPosition);
  yPosition += 6;

  if (statement.workDuration) {
    doc.text(`Duration: ${statement.workDuration}`, 20, yPosition);
    yPosition += 6;
  }
  if (statement.numberOfWorkers) {
    doc.text(`Number of Workers: ${statement.numberOfWorkers}`, 20, yPosition);
    yPosition += 6;
  }
  yPosition += 4;

  // Hazards Section
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Hazards Identified', 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const hazards = Array.isArray(statement.hazardsIdentified) 
    ? statement.hazardsIdentified 
    : (statement.hazardsIdentified ? [statement.hazardsIdentified] : []);
  
  if (hazards.length > 0) {
    hazards.forEach((hazard: string, index: number) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      const hazardLines = doc.splitTextToSize(`${index + 1}. ${hazard}`, pageWidth - 40);
      yPosition = addMultilineText(hazardLines, yPosition);
      yPosition += 2;
    });
  } else {
    doc.text('No hazards specified', 20, yPosition);
    yPosition += 6;
  }
  yPosition += 6;

  // Control Measures Section
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Control Measures', 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const controls = Array.isArray(statement.controlMeasures) 
    ? statement.controlMeasures 
    : (statement.controlMeasures ? [statement.controlMeasures] : []);
  
  if (controls.length > 0) {
    controls.forEach((control: string, index: number) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      const controlLines = doc.splitTextToSize(`${index + 1}. ${control}`, pageWidth - 40);
      yPosition = addMultilineText(controlLines, yPosition);
      yPosition += 2;
    });
  } else {
    doc.text('No control measures specified', 20, yPosition);
    yPosition += 6;
  }
  yPosition += 6;

  // Equipment Section
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Required Equipment', 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const equipment = Array.isArray(statement.requiredEquipment) 
    ? statement.requiredEquipment 
    : (statement.requiredEquipment ? [statement.requiredEquipment] : []);
  
  if (equipment.length > 0) {
    equipment.forEach((item: string, index: number) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${item}`, 20, yPosition);
      yPosition += 6;
    });
  } else {
    doc.text('No equipment specified', 20, yPosition);
    yPosition += 6;
  }
  yPosition += 6;

  // PPE Section
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Required PPE', 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const ppe = Array.isArray(statement.requiredPpe) 
    ? statement.requiredPpe 
    : (statement.requiredPpe ? [statement.requiredPpe] : []);
  
  if (ppe.length > 0) {
    ppe.forEach((item: string, index: number) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${item}`, 20, yPosition);
      yPosition += 6;
    });
  } else {
    doc.text('No PPE specified', 20, yPosition);
    yPosition += 6;
  }
  yPosition += 6;

  // Emergency Procedures Section
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Emergency Procedures', 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const emergencyLines = doc.splitTextToSize(statement.emergencyProcedures || 'N/A', pageWidth - 40);
  yPosition = addMultilineText(emergencyLines, yPosition);
  yPosition += 6;

  if (statement.rescuePlan) {
    doc.setFont('helvetica', 'bold');
    doc.text('Rescue Plan:', 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const rescueLines = doc.splitTextToSize(statement.rescuePlan, pageWidth - 40);
    yPosition = addMultilineText(rescueLines, yPosition);
    yPosition += 6;
  }

  if (statement.emergencyContacts) {
    doc.setFont('helvetica', 'bold');
    doc.text('Emergency Contacts:', 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const contactsLines = doc.splitTextToSize(statement.emergencyContacts, pageWidth - 40);
    yPosition = addMultilineText(contactsLines, yPosition);
    yPosition += 6;
  }
  yPosition += 6;

  // Additional Details Section
  if (statement.competencyRequirements || statement.irataLevelRequired || statement.teamMembers) {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Team & Competency Requirements', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    if (statement.irataLevelRequired) {
      doc.text(`IRATA Level Required: ${statement.irataLevelRequired}`, 20, yPosition);
      yPosition += 6;
    }

    const competencies = Array.isArray(statement.competencyRequirements) 
      ? statement.competencyRequirements 
      : (statement.competencyRequirements ? [statement.competencyRequirements] : []);
    
    if (competencies.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Competencies:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      competencies.forEach((comp: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${comp}`, 20, yPosition);
        yPosition += 6;
      });
    }

    const team = Array.isArray(statement.teamMembers) 
      ? statement.teamMembers 
      : (statement.teamMembers ? [statement.teamMembers] : []);
    
    if (team.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Team Members:', 20, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      team.forEach((member: string) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`• ${member}`, 20, yPosition);
        yPosition += 6;
      });
    }
    yPosition += 6;
  }

  // Signatures Section
  if (statement.signatures && statement.signatures.length > 0) {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Approvals & Signatures', 20, yPosition);
    yPosition += 8;

    statement.signatures.forEach((sig: any) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${sig.role}:`, 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${sig.employeeName}`, 20, yPosition);
      yPosition += 6;

      if (sig.signedAt) {
        doc.text(`Date: ${new Date(sig.signedAt).toLocaleDateString()}`, 20, yPosition);
        yPosition += 6;
      }

      if (sig.signatureDataUrl) {
        try {
          doc.addImage(sig.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
          yPosition += 25;
        } catch (error) {
          console.error('Error adding signature image:', error);
          yPosition += 6;
        }
      }
      yPosition += 6;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Method Statement - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      pageWidth - 20,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // Save PDF
  const fileName = `Method_Statement_${statement.location}_${new Date(statement.dateCreated).toLocaleDateString().replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};

export default function MethodStatementForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Arrays for dynamic fields
  const [hazards, setHazards] = useState<string[]>([""]);
  const [controls, setControls] = useState<string[]>([""]);
  const [equipment, setEquipment] = useState<string[]>([""]);
  const [ppe, setPpe] = useState<string[]>([""]);
  const [permits, setPermits] = useState<string[]>([""]);
  const [competencies, setCompetencies] = useState<string[]>([""]);
  const [teamMembers, setTeamMembers] = useState<string[]>([""]);
  
  // Signatures
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signatureRole, setSignatureRole] = useState<"preparer" | "reviewer" | "approver">("preparer");
  const signatureCanvasRef = useRef<SignatureCanvas>(null);

  const { data: projectsData } = useQuery<{ projects: Project[] }>({
    queryKey: ["/api/projects"],
  });

  const { data: employeesData } = useQuery<{ employees: any[] }>({
    queryKey: ["/api/employees"],
  });

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: customJobTypesData } = useQuery<{ customJobTypes: { id: string; name: string }[] }>({
    queryKey: ["/api/custom-job-types"],
  });

  const employees = (employeesData?.employees || []);
  const customJobTypes = customJobTypesData?.customJobTypes || [];

  // Helper for local date formatting
  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const form = useForm<MethodStatementFormValues>({
    resolver: zodResolver(methodStatementFormSchema),
    defaultValues: {
      projectId: "",
      dateCreated: getLocalDateString(),
      preparedByName: "",
      jobType: "",
      location: "",
      workDescription: "",
      scopeDetails: "",
      workDuration: "",
      emergencyProcedures: "",
      rescuePlan: "",
      emergencyContacts: "",
      weatherRestrictions: "",
      workingHeightRange: "",
      accessMethod: "",
      irataLevelRequired: "",
      communicationMethod: "",
      signalProtocol: "",
      reviewedByName: "",
      reviewDate: "",
      approvedByName: "",
      approvalDate: "",
    },
  });

  // Auto-fill "Prepared By" with current user's name
  useEffect(() => {
    if (currentUser?.fullName && !form.getValues("preparedByName")) {
      form.setValue("preparedByName", currentUser.fullName);
    }
  }, [currentUser, form]);

  const createMeetingMutation = useMutation({
    mutationFn: async (data: MethodStatementFormValues) => {
      // Convert dynamic arrays to proper arrays
      const payload = {
        ...data,
        hazardsIdentified: hazards.filter(h => h.trim()),
        controlMeasures: controls.filter(c => c.trim()),
        requiredEquipment: equipment.filter(e => e.trim()),
        requiredPpe: ppe.filter(p => p.trim()),
        permitsRequired: permits.filter(p => p.trim()),
        competencyRequirements: competencies.filter(c => c.trim()),
        teamMembers: teamMembers.filter(t => t.trim()),
        signatures,
        status: "draft",
      };
      
      return apiRequest("POST", "/api/method-statements", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/method-statements"] });
      toast({
        title: "Success",
        description: "Method statement created successfully",
      });
      navigate("/safety-forms");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create method statement",
      });
    },
  });

  const handleOpenSignatureDialog = (role: "preparer" | "reviewer" | "approver") => {
    setSignatureRole(role);
    setShowSignatureDialog(true);
  };

  const handleSaveSignature = () => {
    if (!signatureCanvasRef.current || signatureCanvasRef.current.isEmpty()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a signature",
      });
      return;
    }

    const signatureDataUrl = signatureCanvasRef.current.toDataURL();
    
    let employeeName = "";
    let employeeId = "";
    
    if (signatureRole === "preparer") {
      employeeName = form.getValues("preparedByName");
      employeeId = "current-user"; // This will be set server-side
    } else if (signatureRole === "reviewer") {
      employeeName = form.getValues("reviewedByName") || "";
    } else if (signatureRole === "approver") {
      employeeName = form.getValues("approvedByName") || "";
    }
    
    if (!employeeName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Please enter the ${signatureRole}'s name first`,
      });
      return;
    }

    const newSignature: Signature = {
      employeeId,
      employeeName,
      signatureDataUrl,
      role: signatureRole,
      signedAt: new Date().toISOString(),
    };

    // Remove existing signature for this role if any
    setSignatures(prev => [...prev.filter(s => s.role !== signatureRole), newSignature]);
    
    setShowSignatureDialog(false);
    signatureCanvasRef.current.clear();
    
    toast({
      title: "Success",
      description: `${signatureRole.charAt(0).toUpperCase() + signatureRole.slice(1)} signature added`,
    });
  };

  const handleClearSignature = (role: string) => {
    setSignatures(prev => prev.filter(s => s.role !== role));
    
    if (role === "reviewer") {
      form.setValue("reviewedByName", "");
      form.setValue("reviewDate", "");
    } else if (role === "approver") {
      form.setValue("approvedByName", "");
      form.setValue("approvalDate", "");
    }
    
    toast({
      title: "Signature Removed",
      description: `${role.charAt(0).toUpperCase() + role.slice(1)} signature cleared`,
    });
  };

  const onSubmit = (data: MethodStatementFormValues) => {
    setIsSubmitting(true);
    // Handle "none" selection - convert to undefined for server
    const submitData = {
      ...data,
      projectId: data.projectId === "none" ? undefined : data.projectId,
    };
    createMeetingMutation.mutate(submitData, {
      onSettled: () => setIsSubmitting(false),
    });
  };

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, ""]);
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const updateArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item));
  };

  const renderArrayField = (
    label: string,
    items: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => updateArrayItem(setter, index, e.target.value)}
            placeholder={placeholder}
            data-testid={`input-${label.toLowerCase().replace(/\s+/g, "-")}-${index}`}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeArrayItem(setter, index)}
            disabled={items.length === 1}
            data-testid={`button-remove-${label.toLowerCase().replace(/\s+/g, "-")}-${index}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addArrayItem(setter)}
        data-testid={`button-add-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label.toLowerCase().includes("hazard") ? "Hazard" : label.toLowerCase().includes("control") ? "Control" : "Item"}
      </Button>
    </div>
  );

  const getSignature = (role: string) => signatures.find(s => s.role === role);

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/safety-forms")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Method Statement / Work Plan</h1>
          <p className="text-muted-foreground">Document safe work procedures and risk controls</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          IRATA Compliant
        </Badge>
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
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-project">
                            <SelectValue placeholder="None - Job Type Only" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None - Job Type Only</SelectItem>
                          {(projectsData?.projects || []).map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.buildingName || `Project ${project.id.substring(0, 8)}`}
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
                  name="dateCreated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Created *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-date-created" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preparedByName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prepared By *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your full name" data-testid="input-prepared-by" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-job-type">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STANDARD_JOB_TYPES.map((jobType) => (
                            <SelectItem key={jobType.value} value={jobType.value}>
                              {jobType.label}
                            </SelectItem>
                          ))}
                          {customJobTypes.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-t mt-1 pt-2">
                                Custom Job Types
                              </div>
                              {customJobTypes.map((customType) => (
                                <SelectItem key={`custom:${customType.name}`} value={`custom:${customType.name}`}>
                                  {customType.name}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Work site address (if applicable)" data-testid="input-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Work Description */}
          <Card>
            <CardHeader>
              <CardTitle>Work Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="workDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Work *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the work to be performed..."
                        rows={4}
                        data-testid="textarea-work-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scopeDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scope and Limitations *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Define the scope of work and any limitations..."
                        rows={3}
                        data-testid="textarea-scope-details"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Duration</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 2 days, 5 hours" data-testid="input-work-duration" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberOfWorkers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Workers</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="0" data-testid="input-number-of-workers" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Hazards and Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Hazards and Control Measures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderArrayField("Hazards Identified", hazards, setHazards, "Describe hazard")}
              {renderArrayField("Control Measures", controls, setControls, "Describe control measure")}
            </CardContent>
          </Card>

          {/* Equipment and PPE */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment and PPE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderArrayField("Required Equipment", equipment, setEquipment, "Equipment item")}
              {renderArrayField("Required PPE", ppe, setPpe, "PPE item")}
            </CardContent>
          </Card>

          {/* Emergency Procedures */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Procedures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="emergencyProcedures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Procedures *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Outline emergency response procedures..."
                        rows={4}
                        data-testid="textarea-emergency-procedures"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rescuePlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rescue Plan</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe rescue procedures and equipment..."
                        rows={3}
                        data-testid="textarea-rescue-plan"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContacts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contacts</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="List emergency contact numbers and personnel..."
                        rows={2}
                        data-testid="textarea-emergency-contacts"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Work Environment */}
          <Card>
            <CardHeader>
              <CardTitle>Work Environment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderArrayField("Permits Required", permits, setPermits, "Permit type")}

              <FormField
                control={form.control}
                name="weatherRestrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Restrictions</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe weather conditions that would stop work..."
                        rows={2}
                        data-testid="textarea-weather-restrictions"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workingHeightRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Height Range</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 10m - 50m" data-testid="input-working-height-range" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accessMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Method</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Rope descent, bosun's chair" data-testid="input-access-method" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Competency and Communication */}
          <Card>
            <CardHeader>
              <CardTitle>Competency and Communication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderArrayField("Competency Requirements", competencies, setCompetencies, "Required competency")}

              <FormField
                control={form.control}
                name="irataLevelRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IRATA Level Required</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-irata-level">
                          <SelectValue placeholder="Select IRATA level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="level-1">Level 1</SelectItem>
                        <SelectItem value="level-2">Level 2</SelectItem>
                        <SelectItem value="level-3">Level 3</SelectItem>
                        <SelectItem value="varies">Varies by task</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="communicationMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Communication Method</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Two-way radio, hand signals" data-testid="input-communication-method" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="signalProtocol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signal Protocol</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Standard IRATA signals" data-testid="input-signal-protocol" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {renderArrayField("Team Members", teamMembers, setTeamMembers, "Team member name")}
            </CardContent>
          </Card>

          {/* Review and Approval */}
          <Card>
            <CardHeader>
              <CardTitle>Review and Approval</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preparer Signature */}
              <div className="space-y-3">
                <Label>Prepared By (Signature) *</Label>
                {getSignature("preparer") ? (
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{getSignature("preparer")!.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          Signed: {new Date(getSignature("preparer")!.signedAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearSignature("preparer")}
                        data-testid="button-clear-preparer-signature"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <img
                      src={getSignature("preparer")!.signatureDataUrl}
                      alt="Signature"
                      className="h-20 border-t"
                    />
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenSignatureDialog("preparer")}
                    className="w-full"
                    data-testid="button-add-preparer-signature"
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Add Signature
                  </Button>
                )}
              </div>

              {/* Reviewer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reviewedByName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reviewed By (Name)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Reviewer name" data-testid="input-reviewed-by" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reviewDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-review-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.getValues("reviewedByName") && (
                <div className="space-y-3">
                  <Label>Reviewer Signature</Label>
                  {getSignature("reviewer") ? (
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{getSignature("reviewer")!.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            Signed: {new Date(getSignature("reviewer")!.signedAt).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClearSignature("reviewer")}
                          data-testid="button-clear-reviewer-signature"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <img
                        src={getSignature("reviewer")!.signatureDataUrl}
                        alt="Signature"
                        className="h-20 border-t"
                      />
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenSignatureDialog("reviewer")}
                      className="w-full"
                      data-testid="button-add-reviewer-signature"
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      Add Reviewer Signature
                    </Button>
                  )}
                </div>
              )}

              {/* Approver */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="approvedByName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approved By (Name)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Approver name" data-testid="input-approved-by" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="approvalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approval Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-approval-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.getValues("approvedByName") && (
                <div className="space-y-3">
                  <Label>Approver Signature</Label>
                  {getSignature("approver") ? (
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{getSignature("approver")!.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            Signed: {new Date(getSignature("approver")!.signedAt).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClearSignature("approver")}
                          data-testid="button-clear-approver-signature"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <img
                        src={getSignature("approver")!.signatureDataUrl}
                        alt="Signature"
                        className="h-20 border-t"
                      />
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenSignatureDialog("approver")}
                      className="w-full"
                      data-testid="button-add-approver-signature"
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      Add Approver Signature
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
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
            >
              <FileCheck className="h-4 w-4 mr-2" />
              {isSubmitting ? "Creating..." : "Create Method Statement"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Signature</DialogTitle>
            <DialogDescription>
              Sign below using your mouse or touchscreen
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md bg-background">
            <SignatureCanvas
              ref={signatureCanvasRef}
              canvasProps={{
                className: "w-full h-48",
              }}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => signatureCanvasRef.current?.clear()}
              data-testid="button-clear-canvas"
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
  );
}
