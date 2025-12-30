import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
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
import { formatLocalDateLong, formatLocalDate, formatTimestampDate } from "@/lib/dateUtils";

// Standard job types for rope access work - use translation keys
const STANDARD_JOB_TYPES = [
  { value: "window_cleaning", labelKey: "dashboard.jobTypes.window_cleaning" },
  { value: "dryer_vent_cleaning", labelKey: "dashboard.jobTypes.dryer_vent_cleaning" },
  { value: "building_wash", labelKey: "dashboard.jobTypes.building_wash" },
  { value: "in_suite_dryer_vent_cleaning", labelKey: "dashboard.jobTypes.in_suite_dryer_vent_cleaning" },
  { value: "parkade_pressure_cleaning", labelKey: "dashboard.jobTypes.parkade_pressure_cleaning" },
  { value: "ground_window_cleaning", labelKey: "dashboard.jobTypes.ground_window_cleaning" },
  { value: "general_pressure_washing", labelKey: "dashboard.jobTypes.general_pressure_washing" },
  { value: "other", labelKey: "dashboard.jobTypes.other" },
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

// Type for PDF translations
type MethodStatementPDFTranslations = {
  title: string;
  subtitle: string;
  documentInfo: string;
  location: string;
  dateCreated: string;
  preparedBy: string;
  jobType: string;
  workDescription: string;
  scopeDetails: string;
  duration: string;
  numberOfWorkers: string;
  hazardsIdentified: string;
  controlMeasures: string;
  requiredEquipment: string;
  requiredPPE: string;
  emergencyProcedures: string;
  rescuePlan: string;
  emergencyContacts: string;
  additionalInfo: string;
  permitsRequired: string;
  weatherRestrictions: string;
  workingHeights: string;
  accessMethod: string;
  competencyRequirements: string;
  irataLevelRequired: string;
  communicationMethod: string;
  signalProtocol: string;
  teamMembers: string;
  approvals: string;
  reviewedBy: string;
  reviewDate: string;
  approvedBy: string;
  approvalDate: string;
  signatures: string;
  signedBy: string;
  role: string;
  signedAt: string;
  pageOf: (page: number, total: number) => string;
  jobTypes: Record<string, string>;
  na: string;
};

// Default English translations for fallback
const defaultPDFTranslations: MethodStatementPDFTranslations = {
  title: 'METHOD STATEMENT',
  subtitle: 'Safe Work Procedure & Risk Control Document',
  documentInfo: 'Document Information',
  location: 'Location',
  dateCreated: 'Date Created',
  preparedBy: 'Prepared By',
  jobType: 'Job Type',
  workDescription: 'Work Description',
  scopeDetails: 'Scope Details',
  duration: 'Duration',
  numberOfWorkers: 'Number of Workers',
  hazardsIdentified: 'Hazards Identified',
  controlMeasures: 'Control Measures',
  requiredEquipment: 'Required Equipment',
  requiredPPE: 'Required PPE',
  emergencyProcedures: 'Emergency Procedures',
  rescuePlan: 'Rescue Plan',
  emergencyContacts: 'Emergency Contacts',
  additionalInfo: 'Additional Information',
  permitsRequired: 'Permits Required',
  weatherRestrictions: 'Weather Restrictions',
  workingHeights: 'Working Heights',
  accessMethod: 'Access Method',
  competencyRequirements: 'Competency Requirements',
  irataLevelRequired: 'IRATA Level Required',
  communicationMethod: 'Communication Method',
  signalProtocol: 'Signal Protocol',
  teamMembers: 'Team Members',
  approvals: 'Approvals',
  reviewedBy: 'Reviewed By',
  reviewDate: 'Review Date',
  approvedBy: 'Approved By',
  approvalDate: 'Approval Date',
  signatures: 'Signatures',
  signedBy: 'Signed By',
  role: 'Role',
  signedAt: 'Signed At',
  pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
  jobTypes: {
    'window_cleaning': 'Window Cleaning',
    'dryer_vent_cleaning': 'Dryer Vent Cleaning',
    'building_wash': 'Building Wash',
    'in_suite_dryer_vent_cleaning': 'In-Suite Dryer Vent Cleaning',
    'parkade_pressure_cleaning': 'Parkade Pressure Cleaning',
    'ground_window_cleaning': 'Ground Window Cleaning',
    'general_pressure_washing': 'General Pressure Washing',
    'other': 'Other'
  },
  na: 'N/A'
};

// Download Method Statement as PDF
export const downloadMethodStatement = (statement: any, currentUser: any, translations?: MethodStatementPDFTranslations) => {
  const t = translations || defaultPDFTranslations;
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
  doc.text(t.title, pageWidth / 2, 15 + brandingHeight, { align: 'center' });
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(t.subtitle, pageWidth / 2, 25 + brandingHeight, { align: 'center' });

  yPosition = 45 + brandingHeight;

  // Basic Information Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(t.documentInfo, 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${t.location}: ${statement.location || t.na}`, 20, yPosition);
  yPosition += 6;
  doc.text(`${t.dateCreated}: ${formatLocalDateLong(statement.dateCreated)}`, 20, yPosition);
  yPosition += 6;
  doc.text(`${t.preparedBy}: ${statement.preparedByName}`, 20, yPosition);
  yPosition += 6;
  // Format job type for display
  const formatJobType = (jobType: string) => {
    if (!jobType) return t.na;
    if (jobType.startsWith('custom:')) return jobType.replace('custom:', '');
    return t.jobTypes[jobType] || jobType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };
  doc.text(`${t.jobType}: ${formatJobType(statement.jobType || statement.jobTitle)}`, 20, yPosition);
  yPosition += 10;

  // Work Description Section
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(t.workDescription, 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const workDescriptionLines = doc.splitTextToSize(statement.workDescription || t.na, pageWidth - 40);
  yPosition = addMultilineText(workDescriptionLines, yPosition);
  yPosition += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`${t.scopeDetails}:`, 20, yPosition);
  yPosition += 6;
  doc.setFont('helvetica', 'normal');
  const scopeLines = doc.splitTextToSize(statement.scopeDetails || t.na, pageWidth - 40);
  yPosition = addMultilineText(scopeLines, yPosition);
  yPosition += 6;

  if (statement.workDuration) {
    doc.text(`${t.duration}: ${statement.workDuration}`, 20, yPosition);
    yPosition += 6;
  }
  if (statement.numberOfWorkers) {
    doc.text(`${t.numberOfWorkers}: ${statement.numberOfWorkers}`, 20, yPosition);
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
  doc.text(t.hazardsIdentified, 20, yPosition);
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
    doc.text(t.na, 20, yPosition);
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
  doc.text(t.controlMeasures, 20, yPosition);
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
    doc.text(t.na, 20, yPosition);
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
  doc.text(t.requiredEquipment, 20, yPosition);
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
    doc.text(t.na, 20, yPosition);
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
  doc.text(t.requiredPPE, 20, yPosition);
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
    doc.text(t.na, 20, yPosition);
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
  doc.text(t.emergencyProcedures, 20, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const emergencyLines = doc.splitTextToSize(statement.emergencyProcedures || t.na, pageWidth - 40);
  yPosition = addMultilineText(emergencyLines, yPosition);
  yPosition += 6;

  if (statement.rescuePlan) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.rescuePlan}:`, 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    const rescueLines = doc.splitTextToSize(statement.rescuePlan, pageWidth - 40);
    yPosition = addMultilineText(rescueLines, yPosition);
    yPosition += 6;
  }

  if (statement.emergencyContacts) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.emergencyContacts}:`, 20, yPosition);
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
    doc.text(t.competencyRequirements, 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    if (statement.irataLevelRequired) {
      doc.text(`${t.irataLevelRequired}: ${statement.irataLevelRequired}`, 20, yPosition);
      yPosition += 6;
    }

    const competencies = Array.isArray(statement.competencyRequirements) 
      ? statement.competencyRequirements 
      : (statement.competencyRequirements ? [statement.competencyRequirements] : []);
    
    if (competencies.length > 0) {
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
      doc.text(`${t.teamMembers}:`, 20, yPosition);
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
    doc.text(t.signatures, 20, yPosition);
    yPosition += 8;

    statement.signatures.forEach((sig: any) => {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${t.role}: ${sig.role}`, 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.text(`${t.signedBy}: ${sig.employeeName}`, 20, yPosition);
      yPosition += 6;

      if (sig.signedAt) {
        doc.text(`${t.signedAt}: ${formatTimestampDate(sig.signedAt)}`, 20, yPosition);
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
      `${t.title} - ${t.pageOf(i, pageCount)}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `Method_Statement_${statement.location}_${formatLocalDate(statement.dateCreated).replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};

export default function MethodStatementForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
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

  // Filter out suspended and terminated employees - they should not appear in safety forms
  const employees = (employeesData?.employees || []).filter((e: any) => 
    !e.suspendedAt && e.connectionStatus !== 'suspended' && !e.terminatedDate
  );
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
        title: t('safetyForms.methodStatement.form.toasts.success', 'Success'),
        description: t('safetyForms.methodStatement.form.toasts.methodStatementCreated', 'Method Statement created successfully'),
      });
      navigate("/safety-forms");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: t('safetyForms.methodStatement.form.toasts.error', 'Error'),
        description: error.message || t('safetyForms.methodStatement.form.toasts.failedToCreate', 'Failed to create Method Statement'),
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
        title: t('safetyForms.methodStatement.form.toasts.error', 'Error'),
        description: t('safetyForms.flha.pleaseProvideSignature', 'Please provide a signature'),
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
        title: t('safetyForms.methodStatement.form.toasts.error', 'Error'),
        description: t('safetyForms.flha.pleaseEnterName', 'Please enter the name first'),
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
      title: t('safetyForms.methodStatement.form.toasts.success', 'Success'),
      description: `${signatureRole.charAt(0).toUpperCase() + signatureRole.slice(1)} ${t('safetyForms.methodStatement.form.toasts.signatureAdded', 'signature added')}`,
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
      title: t('safetyForms.methodStatement.form.toasts.signatureRemoved', 'Signature Removed'),
      description: `${role.charAt(0).toUpperCase() + role.slice(1)} ${t('safetyForms.methodStatement.form.toasts.signatureCleared', 'signature cleared')}`,
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
        {label.toLowerCase().includes("hazard") 
          ? t('safetyForms.methodStatement.form.hazardsAndControls.addHazard', 'Add Hazard') 
          : label.toLowerCase().includes("control") 
            ? t('safetyForms.methodStatement.form.hazardsAndControls.addControl', 'Add Control') 
            : t('safetyForms.methodStatement.form.hazardsAndControls.addItem', 'Add Item')}
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
          <h1 className="text-3xl font-bold">{t('safetyForms.methodStatement.form.pageTitle', 'Method Statement / Work Plan')}</h1>
          <p className="text-muted-foreground">{t('safetyForms.methodStatement.form.pageSubtitle', 'Document safe work procedures and risk controls')}</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" />
          {t('safetyForms.methodStatement.form.irataCompliant', 'IRATA Compliant')}
        </Badge>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('safetyForms.methodStatement.form.basicInfo.title', 'Basic Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('safetyForms.methodStatement.form.basicInfo.projectOptional', 'Project (Optional)')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger data-testid="select-project">
                            <SelectValue placeholder={t('safetyForms.methodStatement.form.basicInfo.nonePlaceholder', 'None - Job Type Only')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t('safetyForms.methodStatement.form.basicInfo.nonePlaceholder', 'None - Job Type Only')}</SelectItem>
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
                      <FormLabel>{t('safetyForms.methodStatement.form.basicInfo.dateCreated', 'Date Created')} *</FormLabel>
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
                      <FormLabel>{t('safetyForms.methodStatement.form.basicInfo.preparedBy', 'Prepared By')} *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('safetyForms.methodStatement.form.basicInfo.preparedByPlaceholder', 'Your full name')} data-testid="input-prepared-by" />
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
                      <FormLabel>{t('safetyForms.methodStatement.form.basicInfo.jobType', 'Job Type')} *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-job-type">
                            <SelectValue placeholder={t('safetyForms.methodStatement.form.basicInfo.jobTypePlaceholder', 'Select job type')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STANDARD_JOB_TYPES.map((jobType) => (
                            <SelectItem key={jobType.value} value={jobType.value} data-testid={`select-job-type-${jobType.value}`}>
                              {t(jobType.labelKey, jobType.value.replace(/_/g, ' '))}
                            </SelectItem>
                          ))}
                          {customJobTypes.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-t mt-1 pt-2">
                                {t('safetyForms.methodStatement.form.basicInfo.customJobTypes', 'Custom Job Types')}
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
                    <FormLabel>{t('safetyForms.methodStatement.form.basicInfo.locationOptional', 'Location (Optional)')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('safetyForms.methodStatement.form.basicInfo.locationPlaceholder', 'Work site address (if applicable)')} data-testid="input-location" />
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
              <CardTitle>{t('safetyForms.methodStatement.form.workDescription.title', 'Work Description')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="workDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('safetyForms.methodStatement.form.workDescription.description', 'Description of Work')} *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('safetyForms.methodStatement.form.workDescription.descriptionPlaceholder', 'Describe the work to be performed...')}
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
                    <FormLabel>{t('safetyForms.methodStatement.form.workDescription.scopeAndLimitations', 'Scope and Limitations')} *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('safetyForms.methodStatement.form.workDescription.scopePlaceholder', 'Define the scope of work and any limitations...')}
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
                      <FormLabel>{t('safetyForms.methodStatement.form.workDescription.estimatedDuration', 'Estimated Duration')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('safetyForms.methodStatement.form.workDescription.durationPlaceholder', 'e.g. 2 days, 5 hours')} data-testid="input-work-duration" />
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
                      <FormLabel>{t('safetyForms.methodStatement.form.workDescription.numberOfWorkers', 'Number of Workers')}</FormLabel>
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
              <CardTitle>{t('safetyForms.methodStatement.form.hazardsAndControls.title', 'Hazards and Control Measures')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderArrayField(t('safetyForms.methodStatement.form.hazardsAndControls.hazardsIdentified', 'Hazards Identified'), hazards, setHazards, t('safetyForms.methodStatement.form.hazardsAndControls.hazardPlaceholder', 'Describe hazard'))}
              {renderArrayField(t('safetyForms.methodStatement.form.hazardsAndControls.controlMeasures', 'Control Measures'), controls, setControls, t('safetyForms.methodStatement.form.hazardsAndControls.controlPlaceholder', 'Describe control measure'))}
            </CardContent>
          </Card>

          {/* Equipment and PPE */}
          <Card>
            <CardHeader>
              <CardTitle>{t('safetyForms.methodStatement.form.equipmentAndPpe.title', 'Equipment and PPE')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderArrayField(t('safetyForms.methodStatement.form.equipmentAndPpe.requiredEquipment', 'Required Equipment'), equipment, setEquipment, t('safetyForms.methodStatement.form.equipmentAndPpe.equipmentPlaceholder', 'Equipment item'))}
              {renderArrayField(t('safetyForms.methodStatement.form.equipmentAndPpe.requiredPpe', 'Required PPE'), ppe, setPpe, t('safetyForms.methodStatement.form.equipmentAndPpe.ppePlaceholder', 'PPE item'))}
            </CardContent>
          </Card>

          {/* Emergency Procedures */}
          <Card>
            <CardHeader>
              <CardTitle>{t('safetyForms.methodStatement.form.emergency.title', 'Emergency Procedures')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="emergencyProcedures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('safetyForms.methodStatement.form.emergency.procedures', 'Emergency Procedures')} *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('safetyForms.methodStatement.form.emergency.proceduresPlaceholder', 'Outline emergency response procedures...')}
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
                    <FormLabel>{t('safetyForms.methodStatement.form.emergency.rescuePlan', 'Rescue Plan')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('safetyForms.methodStatement.form.emergency.rescuePlanPlaceholder', 'Describe rescue procedures and equipment...')}
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
                    <FormLabel>{t('safetyForms.methodStatement.form.emergency.contacts', 'Emergency Contacts')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('safetyForms.methodStatement.form.emergency.contactsPlaceholder', 'List emergency contact numbers and personnel...')}
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
              <CardTitle>{t('safetyForms.methodStatement.form.workEnvironment.title', 'Work Environment')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderArrayField(t('safetyForms.methodStatement.form.workEnvironment.permitsRequired', 'Permits Required'), permits, setPermits, t('safetyForms.methodStatement.form.workEnvironment.permitPlaceholder', 'Permit type'))}

              <FormField
                control={form.control}
                name="weatherRestrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('safetyForms.methodStatement.form.workEnvironment.weatherRestrictions', 'Weather Restrictions')}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t('safetyForms.methodStatement.form.workEnvironment.weatherPlaceholder', 'Describe weather conditions that would stop work...')}
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
                      <FormLabel>{t('safetyForms.methodStatement.form.workEnvironment.workingHeightRange', 'Working Height Range')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('safetyForms.methodStatement.form.workEnvironment.heightPlaceholder', 'e.g. 10m - 50m')} data-testid="input-working-height-range" />
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
                      <FormLabel>{t('safetyForms.methodStatement.form.workEnvironment.accessMethod', 'Access Method')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('safetyForms.methodStatement.form.workEnvironment.accessPlaceholder', 'e.g. Rope descent, bosun\'s chair')} data-testid="input-access-method" />
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
              <CardTitle>{t('safetyForms.methodStatement.form.competency.title', 'Competency and Communication')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderArrayField(t('safetyForms.methodStatement.form.competency.requirements', 'Competency Requirements'), competencies, setCompetencies, t('safetyForms.methodStatement.form.competency.competencyPlaceholder', 'Required competency'))}

              <FormField
                control={form.control}
                name="irataLevelRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('safetyForms.methodStatement.form.competency.irataLevel', 'IRATA Level Required')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-irata-level">
                          <SelectValue placeholder={t('safetyForms.methodStatement.form.competency.irataPlaceholder', 'Select IRATA level')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="level-1">{t('safetyForms.methodStatement.form.competency.level1', 'Level 1')}</SelectItem>
                        <SelectItem value="level-2">{t('safetyForms.methodStatement.form.competency.level2', 'Level 2')}</SelectItem>
                        <SelectItem value="level-3">{t('safetyForms.methodStatement.form.competency.level3', 'Level 3')}</SelectItem>
                        <SelectItem value="varies">{t('safetyForms.methodStatement.form.competency.variesByTask', 'Varies by task')}</SelectItem>
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
                      <FormLabel>{t('safetyForms.methodStatement.form.competency.communicationMethod', 'Communication Method')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('safetyForms.methodStatement.form.competency.communicationPlaceholder', 'e.g. Two-way radio, hand signals')} data-testid="input-communication-method" />
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
                      <FormLabel>{t('safetyForms.methodStatement.form.competency.signalProtocol', 'Signal Protocol')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('safetyForms.methodStatement.form.competency.signalPlaceholder', 'e.g. Standard IRATA signals')} data-testid="input-signal-protocol" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {renderArrayField(t('safetyForms.methodStatement.form.competency.teamMembers', 'Team Members'), teamMembers, setTeamMembers, t('safetyForms.methodStatement.form.competency.teamMemberPlaceholder', 'Team member name'))}
            </CardContent>
          </Card>

          {/* Review and Approval */}
          <Card>
            <CardHeader>
              <CardTitle>{t('safetyForms.methodStatement.form.reviewAndApproval.title', 'Review and Approval')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preparer Signature */}
              <div className="space-y-3">
                <Label>{t('safetyForms.methodStatement.form.reviewAndApproval.preparedBySignature', 'Prepared By (Signature)')} *</Label>
                {getSignature("preparer") ? (
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{getSignature("preparer")!.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('safetyForms.methodStatement.form.reviewAndApproval.signed', 'Signed')}: {new Date(getSignature("preparer")!.signedAt).toLocaleString()}
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
                    {t('safetyForms.methodStatement.form.signatures.addSignature', 'Add Signature')}
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
                      <FormLabel>{t('safetyForms.methodStatement.form.reviewAndApproval.reviewedByName', 'Reviewed By (Name)')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('safetyForms.methodStatement.form.reviewAndApproval.reviewerPlaceholder', 'Reviewer name')} data-testid="input-reviewed-by" />
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
                      <FormLabel>{t('safetyForms.methodStatement.form.reviewAndApproval.reviewDate', 'Review Date')}</FormLabel>
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
                  <Label>{t('safetyForms.methodStatement.form.reviewAndApproval.reviewerSignature', 'Reviewer Signature')}</Label>
                  {getSignature("reviewer") ? (
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{getSignature("reviewer")!.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('safetyForms.methodStatement.form.reviewAndApproval.signed', 'Signed')}: {new Date(getSignature("reviewer")!.signedAt).toLocaleString()}
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
                      {t('safetyForms.methodStatement.form.signatures.addReviewerSignature', 'Add Reviewer Signature')}
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
                      <FormLabel>{t('safetyForms.methodStatement.form.reviewAndApproval.approvedByName', 'Approved By (Name)')}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('safetyForms.methodStatement.form.reviewAndApproval.approverPlaceholder', 'Approver name')} data-testid="input-approved-by" />
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
                      <FormLabel>{t('safetyForms.methodStatement.form.reviewAndApproval.approvalDate', 'Approval Date')}</FormLabel>
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
                  <Label>{t('safetyForms.methodStatement.form.reviewAndApproval.approverSignature', 'Approver Signature')}</Label>
                  {getSignature("approver") ? (
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{getSignature("approver")!.employeeName}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('safetyForms.methodStatement.form.reviewAndApproval.signed', 'Signed')}: {new Date(getSignature("approver")!.signedAt).toLocaleString()}
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
                      {t('safetyForms.methodStatement.form.signatures.addApproverSignature', 'Add Approver Signature')}
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
              {t('safetyForms.methodStatement.form.buttons.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              data-testid="button-submit"
            >
              <FileCheck className="h-4 w-4 mr-2" />
              {isSubmitting ? t('safetyForms.methodStatement.form.buttons.creating', 'Creating...') : t('safetyForms.methodStatement.form.buttons.createMethodStatement', 'Create Method Statement')}
            </Button>
          </div>
        </form>
      </Form>

      {/* Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('safetyForms.methodStatement.form.signatures.addSignature', 'Add Signature')}</DialogTitle>
            <DialogDescription>
              {t('safetyForms.methodStatement.form.signatures.signBelow', 'Sign below using your mouse or touchscreen')}
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
              {t('safetyForms.methodStatement.form.signatures.clear', 'Clear')}
            </Button>
            <Button
              type="button"
              onClick={handleSaveSignature}
              data-testid="button-save-signature"
            >
              {t('safetyForms.methodStatement.form.signatures.saveSignature', 'Save Signature')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
