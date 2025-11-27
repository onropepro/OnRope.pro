import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, Calendar, DollarSign, Upload, Trash2, Shield, BookOpen, ArrowLeft, AlertTriangle, Plus } from "lucide-react";
import { hasFinancialAccess, canViewSafetyDocuments } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { jsPDF } from "jspdf";
import { downloadMethodStatement } from "@/pages/MethodStatementForm";
import { formatLocalDate, formatLocalDateLong, formatLocalDateMedium, parseLocalDate } from "@/lib/dateUtils";

export default function Documents() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [uploadingHealthSafety, setUploadingHealthSafety] = useState(false);
  const [uploadingPolicy, setUploadingPolicy] = useState(false);
  const [uploadingInsurance, setUploadingInsurance] = useState(false);
  const [activeTab, setActiveTab] = useState("health-safety");

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: projectsData } = useQuery<{ projects: any[] }>({
    queryKey: ["/api/projects"],
  });

  const { data: meetingsData } = useQuery<{ meetings: any[] }>({
    queryKey: ["/api/toolbox-meetings"],
  });

  const { data: flhaFormsData } = useQuery<{ flhaForms: any[] }>({
    queryKey: ["/api/flha-forms"],
  });

  const { data: inspectionsData } = useQuery<{ inspections: any[] }>({
    queryKey: ["/api/harness-inspections"],
  });

  const { data: incidentReportsData } = useQuery<{ reports: any[] }>({
    queryKey: ["/api/incident-reports"],
  });

  const { data: methodStatementsData } = useQuery<{ statements: any[] }>({
    queryKey: ["/api/method-statements"],
  });

  const { data: quotesData } = useQuery<{ quotes: any[] }>({
    queryKey: ["/api/quotes"],
  });

  const { data: companyDocsData } = useQuery<{ documents: any[] }>({
    queryKey: ["/api/company-documents"],
  });

  const { data: workSessionsData } = useQuery<{ sessions: any[] }>({
    queryKey: ["/api/all-work-sessions"],
  });

  const currentUser = userData?.user;
  const canViewFinancials = hasFinancialAccess(currentUser);
  const canViewSafety = canViewSafetyDocuments(currentUser);
  const canUploadDocuments = currentUser?.role === 'company' || currentUser?.role === 'operations_manager';
  const projects = projectsData?.projects || [];
  const meetings = meetingsData?.meetings || [];
  const flhaForms = flhaFormsData?.flhaForms || [];
  const inspections = inspectionsData?.inspections || [];
  const incidentReports = incidentReportsData?.reports || [];
  const methodStatements = methodStatementsData?.statements || [];
  const quotes = quotesData?.quotes || [];
  const companyDocuments = companyDocsData?.documents || [];

  const healthSafetyDocs = companyDocuments.filter((doc: any) => doc.documentType === 'health_safety_manual');
  const policyDocs = companyDocuments.filter((doc: any) => doc.documentType === 'company_policy');
  const insuranceDocs = companyDocuments.filter((doc: any) => doc.documentType === 'certificate_of_insurance');
  const workSessions = workSessionsData?.sessions || [];

  // Calculate toolbox meeting compliance rating
  // For each project on each day with work sessions, at least one toolbox meeting should exist
  // "Other" meetings (off-site, office, training) count for ALL work sessions on that date
  const toolboxMeetingCompliance = (() => {
    // Get unique (projectId, date) combinations where work sessions occurred
    const workSessionDays = new Set<string>();
    const workSessionDates = new Set<string>(); // Just dates for "Other" matching
    workSessions.forEach((session: any) => {
      if (session.projectId && session.workDate) {
        workSessionDays.add(`${session.projectId}|${session.workDate}`);
        workSessionDates.add(session.workDate);
      }
    });

    // Create a map of (projectId, date) to check if toolbox meeting exists
    const toolboxMeetingDays = new Set<string>();
    const otherMeetingDates = new Set<string>(); // Dates with "Other" meetings
    meetings.forEach((meeting: any) => {
      if (meeting.meetingDate) {
        if (meeting.projectId === 'other') {
          // "Other" meetings cover all work sessions on that date
          otherMeetingDates.add(meeting.meetingDate);
        } else if (meeting.projectId) {
          toolboxMeetingDays.add(`${meeting.projectId}|${meeting.meetingDate}`);
        }
      }
    });

    // Count how many work session days have a corresponding toolbox meeting
    // A work session day is covered if:
    // 1. There's a project-specific meeting for that (projectId, date) combo, OR
    // 2. There's an "Other" meeting on that date
    let daysWithMeeting = 0;
    let totalDays = 0;
    workSessionDays.forEach((dayKey) => {
      totalDays++;
      const date = dayKey.split('|')[1];
      if (toolboxMeetingDays.has(dayKey) || otherMeetingDates.has(date)) {
        daysWithMeeting++;
      }
    });

    const percentage = totalDays > 0 ? Math.round((daysWithMeeting / totalDays) * 100) : 0;
    return { daysWithMeeting, totalDays, percentage };
  })();

  // Collect all rope access plan PDFs - only if user has permission
  const allDocuments = canViewSafety ? projects.flatMap(project => 
    (project.documentUrls || []).map((url: string) => ({
      type: 'pdf',
      url,
      projectName: project.buildingName,
      date: project.createdAt
    }))
  ) : [];

  // Helper function to add company branding to PDFs when active
  const addCompanyBranding = (doc: jsPDF, pageWidth: number): number => {
    // Check if branding is active
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

  const downloadToolboxMeeting = async (meeting: any) => {
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

    // Header - Title
    doc.setFillColor(14, 165, 233); // Ocean blue
    
    // Add company branding if active
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight; // Dynamic height based on branding
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DAILY TOOLBOX MEETING RECORD', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Safety Meeting Documentation', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Meeting Details Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Meeting Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${formatLocalDate(meeting.meetingDate, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Conducted By: ${meeting.conductedByName}`, 20, yPosition);
    yPosition += 6;

    // Attendees with wrapping
    const attendeesText = Array.isArray(meeting.attendees) ? meeting.attendees.join(', ') : meeting.attendees;
    const attendeesLines = doc.splitTextToSize(`Attendees: ${attendeesText}`, pageWidth - 40);
    yPosition = addMultilineText(attendeesLines, yPosition);
    yPosition += 8;

    // Topics Discussed Section
    const topics = [];
    if (meeting.topicFallProtection) topics.push('Fall Protection and Rescue Procedures');
    if (meeting.topicAnchorPoints) topics.push('Anchor Point Selection and Inspection');
    if (meeting.topicRopeInspection) topics.push('Rope Inspection and Maintenance');
    if (meeting.topicKnotTying) topics.push('Knot Tying and Verification');
    if (meeting.topicPPECheck) topics.push('Personal Protective Equipment (PPE) Check');
    if (meeting.topicWeatherConditions) topics.push('Weather Conditions and Work Stoppage');
    if (meeting.topicCommunication) topics.push('Communication Signals and Procedures');
    if (meeting.topicEmergencyEvacuation) topics.push('Emergency Evacuation Procedures');
    if (meeting.topicHazardAssessment) topics.push('Work Area Hazard Assessment');
    if (meeting.topicLoadCalculations) topics.push('Load Calculations and Weight Limits');
    if (meeting.topicEquipmentCompatibility) topics.push('Equipment Compatibility Check');
    if (meeting.topicDescenderAscender) topics.push('Descender and Ascender Use');
    if (meeting.topicEdgeProtection) topics.push('Edge Protection Requirements');
    if (meeting.topicSwingFall) topics.push('Swing Fall Hazards');
    if (meeting.topicMedicalFitness) topics.push('Medical Fitness and Fatigue Management');
    if (meeting.topicToolDropPrevention) topics.push('Tool Drop Prevention');
    if (meeting.topicRegulations) topics.push('Working at Heights Regulations');
    if (meeting.topicRescueProcedures) topics.push('Rescue Procedures and Equipment');
    if (meeting.topicSiteHazards) topics.push('Site-Specific Hazards');
    if (meeting.topicBuddySystem) topics.push('Buddy System and Supervision');

    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Topics Discussed', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    topics.forEach((topic, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${index + 1}. ${topic}`, 25, yPosition);
      yPosition += 6;
    });

    yPosition += 4;

    // Custom Topic
    if (meeting.customTopic) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text('Custom Topic:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const customTopicLines = doc.splitTextToSize(meeting.customTopic, pageWidth - 40);
      yPosition = addMultilineText(customTopicLines, yPosition);
      yPosition += 8;
    }

    // Additional Notes
    if (meeting.additionalNotes) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Notes:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(meeting.additionalNotes, pageWidth - 40);
      yPosition = addMultilineText(notesLines, yPosition);
      yPosition += 8;
    }

    // Signatures Section
    if (meeting.signatures && meeting.signatures.length > 0) {
      yPosition += 10;
      
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Attendee Signatures', 20, yPosition);
      yPosition += 10;

      for (const sig of meeting.signatures) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        // Employee name
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(sig.employeeName, 20, yPosition);
        yPosition += 5;

        // Add signature image
        try {
          doc.addImage(sig.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
        } catch (error) {
          console.error('Error adding signature image:', error);
        }
        yPosition += 25;

        // Line under signature
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 80, yPosition);
        yPosition += 10;
      }
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an official safety meeting record. Keep for compliance purposes.', pageWidth / 2, footerY, { align: 'center' });

    // Save PDF
    doc.save(`Toolbox_Meeting_${meeting.meetingDate}.pdf`);
  };

  const downloadFlhaForm = async (flha: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

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

    // Header
    doc.setFillColor(251, 146, 60); // Orange
    
    // Add company branding if active
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight; // Dynamic height based on branding
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FIELD LEVEL HAZARD ASSESSMENT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Rope Access Safety Documentation', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Assessment Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(flha.assessmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Assessor: ${flha.assessorName}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Location: ${flha.location}`, 20, yPosition);
    yPosition += 6;

    if (flha.workArea) {
      doc.text(`Work Area: ${flha.workArea}`, 20, yPosition);
      yPosition += 6;
    }

    yPosition += 4;

    // Job Description
    doc.setFont('helvetica', 'bold');
    doc.text('Job Description:', 20, yPosition);
    yPosition += 6;
    
    doc.setFont('helvetica', 'normal');
    const jobDescLines = doc.splitTextToSize(flha.jobDescription, pageWidth - 40);
    yPosition = addMultilineText(jobDescLines, yPosition);
    yPosition += 10;

    // Identified Hazards
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Identified Hazards', 20, yPosition);
    yPosition += 8;

    const hazardsList = [];
    if (flha.hazardFalling) hazardsList.push('Falls from Height');
    if (flha.hazardSwingFall) hazardsList.push('Swing Fall Hazard');
    if (flha.hazardSuspendedRescue) hazardsList.push('Suspension Trauma / Rescue Required');
    if (flha.hazardWeather) hazardsList.push('Adverse Weather Conditions');
    if (flha.hazardElectrical) hazardsList.push('Electrical Hazards');
    if (flha.hazardFallingObjects) hazardsList.push('Falling Tools/Objects');
    if (flha.hazardChemical) hazardsList.push('Chemical Exposure');
    if (flha.hazardConfined) hazardsList.push('Confined Spaces');
    if (flha.hazardSharpEdges) hazardsList.push('Sharp Edges / Rope Damage');
    if (flha.hazardUnstableAnchors) hazardsList.push('Unstable Anchor Points');
    if (flha.hazardPowerTools) hazardsList.push('Power Tool Operation at Height');
    if (flha.hazardPublic) hazardsList.push('Public Interaction / Access');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    hazardsList.forEach((hazard, index) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${hazard}`, 25, yPosition);
      yPosition += 6;
    });

    if (flha.additionalHazards) {
      yPosition += 4;
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Hazards:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const additionalHazardsLines = doc.splitTextToSize(flha.additionalHazards, pageWidth - 40);
      yPosition = addMultilineText(additionalHazardsLines, yPosition);
    }

    yPosition += 10;

    // Controls Implemented
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Controls Implemented', 20, yPosition);
    yPosition += 8;

    const controlsList = [];
    if (flha.controlPPE) controlsList.push('Proper PPE (Harness, Helmet, etc.)');
    if (flha.controlBackupSystem) controlsList.push('Backup Safety Systems');
    if (flha.controlEdgeProtection) controlsList.push('Edge Protection Installed');
    if (flha.controlBarricades) controlsList.push('Barricades / Signage');
    if (flha.controlWeatherMonitoring) controlsList.push('Weather Monitoring');
    if (flha.controlRescuePlan) controlsList.push('Emergency Rescue Plan');
    if (flha.controlCommunication) controlsList.push('Communication System');
    if (flha.controlToolTethering) controlsList.push('Tool Tethering / Drop Prevention');
    if (flha.controlPermits) controlsList.push('Work Permits Obtained');
    if (flha.controlInspections) controlsList.push('Pre-work Equipment Inspections');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    controlsList.forEach((control) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`• ${control}`, 25, yPosition);
      yPosition += 6;
    });

    if (flha.additionalControls) {
      yPosition += 4;
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Controls:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const additionalControlsLines = doc.splitTextToSize(flha.additionalControls, pageWidth - 40);
      yPosition = addMultilineText(additionalControlsLines, yPosition);
    }

    yPosition += 10;

    // Risk Assessment
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Risk Assessment', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (flha.riskLevelBefore) {
      doc.text(`Risk Level (Before Controls): ${flha.riskLevelBefore.toUpperCase()}`, 20, yPosition);
      yPosition += 6;
    }
    if (flha.riskLevelAfter) {
      doc.text(`Risk Level (After Controls): ${flha.riskLevelAfter.toUpperCase()}`, 20, yPosition);
      yPosition += 6;
    }

    yPosition += 4;

    // Emergency Contacts
    if (flha.emergencyContacts) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Emergency Contacts:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const emergencyContactsLines = doc.splitTextToSize(flha.emergencyContacts, pageWidth - 40);
      yPosition = addMultilineText(emergencyContactsLines, yPosition);
      yPosition += 10;
    }

    // Signatures
    if (flha.signatures && flha.signatures.length > 0) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Team Member Signatures', 20, yPosition);
      yPosition += 10;

      for (const sig of flha.signatures) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(sig.employeeName, 20, yPosition);
        yPosition += 5;

        try {
          doc.addImage(sig.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
        } catch (error) {
          console.error('Error adding signature image:', error);
        }
        yPosition += 25;

        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 80, yPosition);
        yPosition += 10;
      }
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an official FLHA record. Keep for compliance purposes.', pageWidth / 2, footerY, { align: 'center' });

    doc.save(`FLHA_${new Date(flha.assessmentDate).toISOString().split('T')[0]}.pdf`);
  };

  const downloadHarnessInspection = async (inspection: any) => {
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

    // Header - Title
    doc.setFillColor(14, 165, 233); // Ocean blue
    
    // Add company branding if active
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight; // Dynamic height based on branding
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ROPE ACCESS EQUIPMENT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.text('INSPECTION RECORD', pageWidth / 2, 23 + brandingHeight, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Safety Equipment Documentation', pageWidth / 2, 30 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Inspection Details Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Inspection Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Inspection Date: ${new Date(inspection.inspectionDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Inspector: ${inspection.inspectorName}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Manufacturer: ${inspection.manufacturer || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Equipment ID: ${inspection.equipmentId || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Date in Service: ${inspection.dateInService || 'N/A'}`, 20, yPosition);
    yPosition += 12;

    // Inspection Result
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const status = inspection.overallStatus?.toUpperCase() || 'N/A';
    if (status === 'PASS') {
      doc.setTextColor(34, 197, 94); // Green
    } else if (status === 'FAIL') {
      doc.setTextColor(239, 68, 68); // Red
    } else {
      doc.setTextColor(234, 179, 8); // Yellow
    }
    doc.text(`INSPECTION RESULT: ${status}`, 20, yPosition);
    yPosition += 12;

    // Comments
    if (inspection.comments) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Comments:', 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const commentsLines = doc.splitTextToSize(inspection.comments, pageWidth - 40);
      yPosition = addMultilineText(commentsLines, yPosition);
      yPosition += 8;
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an official equipment inspection record. Keep for compliance purposes.', pageWidth / 2, footerY, { align: 'center' });

    // Save PDF
    doc.save(`Equipment_Inspection_${new Date(inspection.inspectionDate).toISOString().split('T')[0]}.pdf`);
  };

  const downloadIncidentReport = async (report: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

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

    // Header
    doc.setFillColor(239, 68, 68); // Red for incidents
    
    const brandingHeight = addCompanyBranding(doc, pageWidth);
    const headerHeight = 35 + brandingHeight;
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INCIDENT REPORT', pageWidth / 2, 15 + brandingHeight, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Incident Documentation and Investigation', pageWidth / 2, 25 + brandingHeight, { align: 'center' });

    yPosition = 45 + brandingHeight;

    // Basic Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Incident Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(report.incidentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Time: ${report.incidentTime || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Location: ${report.location || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    if (report.projectName) {
      doc.text(`Project: ${report.projectName}`, 20, yPosition);
      yPosition += 6;
    }

    doc.text(`Reported By: ${report.reportedByName}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Report Date: ${new Date(report.reportDate).toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;

    // Description
    if (report.description) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text('Incident Description:', 20, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(report.description, pageWidth - 40);
      yPosition = addMultilineText(descLines, yPosition);
      yPosition += 10;
    }

    // Incident Classification
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Incident Classification', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.text(`Type: ${report.incidentType || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Severity: ${report.severity || 'N/A'}`, 20, yPosition);
    yPosition += 6;

    doc.text(`Immediate Cause: ${report.immediateCause || 'N/A'}`, 20, yPosition);
    yPosition += 10;

    // People Involved
    if (report.peopleInvolved && report.peopleInvolved.length > 0) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('People Involved', 20, yPosition);
      yPosition += 8;

      report.peopleInvolved.forEach((person: any, index: number) => {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`Person ${index + 1}:`, 25, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${person.name}`, 30, yPosition);
        yPosition += 5;
        doc.text(`Role: ${person.role}`, 30, yPosition);
        yPosition += 5;

        if (person.injuryType && person.injuryType !== 'none') {
          doc.text(`Injury Type: ${person.injuryType}`, 30, yPosition);
          yPosition += 5;
        }

        if (person.bodyPartAffected) {
          doc.text(`Body Part Affected: ${person.bodyPartAffected}`, 30, yPosition);
          yPosition += 5;
        }

        if (person.medicalTreatment) {
          doc.text(`Medical Treatment: ${person.medicalTreatment}`, 30, yPosition);
          yPosition += 5;
        }

        yPosition += 3;
      });

      yPosition += 5;
    }

    // Root Cause Analysis
    if (report.rootCause) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Root Cause Analysis:', 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      const rootCauseLines = doc.splitTextToSize(report.rootCause, pageWidth - 40);
      yPosition = addMultilineText(rootCauseLines, yPosition);
      yPosition += 10;
    }

    // Contributing Factors
    if (report.contributingFactors) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Contributing Factors:', 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      const factorsLines = doc.splitTextToSize(report.contributingFactors, pageWidth - 40);
      yPosition = addMultilineText(factorsLines, yPosition);
      yPosition += 10;
    }

    // Corrective Actions
    if (report.correctiveActionItems && report.correctiveActionItems.length > 0) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Corrective Actions', 20, yPosition);
      yPosition += 8;

      report.correctiveActionItems.forEach((action: any, index: number) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`Action ${index + 1}:`, 25, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const actionLines = doc.splitTextToSize(action.action, pageWidth - 50);
        actionLines.forEach((line: string) => {
          doc.text(line, 30, yPosition);
          yPosition += 5;
        });

        doc.text(`Assigned To: ${action.assignedTo}`, 30, yPosition);
        yPosition += 5;
        doc.text(`Due Date: ${new Date(action.dueDate).toLocaleDateString()}`, 30, yPosition);
        yPosition += 5;
        doc.text(`Status: ${action.status}`, 30, yPosition);
        yPosition += 8;
      });
    }

    // Regulatory Information
    if (report.reportableToRegulator || report.regulatorNotificationDate) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Regulatory Reporting', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.text(`Reportable to Regulator: ${report.reportableToRegulator ? 'Yes' : 'No'}`, 20, yPosition);
      yPosition += 6;

      if (report.regulatorNotificationDate) {
        doc.text(`Notification Date: ${new Date(report.regulatorNotificationDate).toLocaleDateString()}`, 20, yPosition);
        yPosition += 6;
      }

      if (report.regulatorReferenceNumber) {
        doc.text(`Reference Number: ${report.regulatorReferenceNumber}`, 20, yPosition);
        yPosition += 6;
      }

      yPosition += 5;
    }

    // Supervisor Review
    if (report.supervisorReviewDate) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Supervisor Review', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.text(`Reviewed By: ${report.supervisorReviewedBy || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Review Date: ${new Date(report.supervisorReviewDate).toLocaleDateString()}`, 20, yPosition);
      yPosition += 6;

      if (report.supervisorComments) {
        doc.setFont('helvetica', 'bold');
        doc.text('Comments:', 20, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const commentsLines = doc.splitTextToSize(report.supervisorComments, pageWidth - 40);
        yPosition = addMultilineText(commentsLines, yPosition);
        yPosition += 8;
      }
    }

    // Management Review
    if (report.managementReviewDate) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Management Review', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.text(`Reviewed By: ${report.managementReviewedBy || 'N/A'}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Review Date: ${new Date(report.managementReviewDate).toLocaleDateString()}`, 20, yPosition);
      yPosition += 6;

      if (report.managementComments) {
        doc.setFont('helvetica', 'bold');
        doc.text('Comments:', 20, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        const commentsLines = doc.splitTextToSize(report.managementComments, pageWidth - 40);
        yPosition = addMultilineText(commentsLines, yPosition);
        yPosition += 8;
      }
    }

    // Signatures Section
    if (report.signatures && report.signatures.length > 0) {
      yPosition += 10;

      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Signatures', 20, yPosition);
      yPosition += 10;

      for (const sig of report.signatures) {
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`${sig.role}: ${sig.name}`, 20, yPosition);
        yPosition += 5;

        try {
          doc.addImage(sig.signatureDataUrl, 'PNG', 20, yPosition, 60, 20);
        } catch (error) {
          console.error('Error adding signature image:', error);
        }
        yPosition += 25;

        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 80, yPosition);
        yPosition += 10;
      }
    }

    // Footer
    const footerY = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('This is an official incident report. Keep for compliance and regulatory purposes.', pageWidth / 2, footerY, { align: 'center' });

    doc.save(`Incident_Report_${new Date(report.incidentDate).toISOString().split('T')[0]}.pdf`);
  };

  // Same professional HTML download function as Quotes.tsx
  const downloadQuote = (quote: any) => {
    const serviceNames: Record<string, string> = {
      window_cleaning: "Window Cleaning",
      dryer_vent_cleaning: "Exterior Dryer Vent Cleaning",
      building_wash: "Building Wash - Pressure washing",
      general_pressure_washing: "General Pressure Washing",
      gutter_cleaning: "Gutter Cleaning",
      parkade: "Parkade Cleaning",
      ground_windows: "Ground Windows",
      in_suite: "In-Suite Dryer Vent"
    };

    const grandTotal = quote.services?.reduce((sum: number, s: any) => sum + Number(s.totalCost || 0), 0) || 0;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Quote - ${quote.strataPlanNumber}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 60px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 3px solid #3B82F6; padding-bottom: 30px; margin-bottom: 40px; }
        .header h1 { color: #3B82F6; font-size: 32px; margin-bottom: 8px; }
        .header .subtitle { color: #71717A; font-size: 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .info-section h3 { color: #3B82F6; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .info-section p { color: #333; margin-bottom: 5px; }
        .info-section strong { font-weight: 600; }
        .services-section { margin: 40px 0; }
        .services-section h2 { color: #0A0A0A; font-size: 24px; margin-bottom: 25px; border-bottom: 2px solid #E4E4E7; padding-bottom: 10px; }
        .service-item { background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 8px; padding: 25px; margin-bottom: 20px; }
        .service-item h3 { color: #0A0A0A; font-size: 18px; margin-bottom: 15px; }
        .service-details { color: #71717A; font-size: 14px; }
        .service-details p { margin: 8px 0; padding-left: 10px; }
        .pricing-row { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #E4E4E7; }
        .pricing-row strong { color: #0A0A0A; }
        .total-section { background: #3B82F6; color: white; padding: 30px; border-radius: 8px; text-align: right; margin-top: 30px; }
        .total-section h3 { font-size: 16px; margin-bottom: 10px; font-weight: 500; opacity: 0.9; }
        .total-section .amount { font-size: 36px; font-weight: bold; }
        .footer { margin-top: 50px; padding-top: 30px; border-top: 2px solid #E4E4E7; text-align: center; color: #71717A; font-size: 14px; }
        @media print { body { background: white; margin: 0; padding: 0; } .container { box-shadow: none; padding: 40px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>SERVICE QUOTE</h1>
            <p class="subtitle">Rope Access & High-Rise Maintenance Services</p>
        </div>

        <div class="info-grid">
            <div class="info-section">
                <h3>Quote Information</h3>
                <p><strong>Quote Date:</strong> ${quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                <p><strong>Quote Number:</strong> ${quote.strataPlanNumber}</p>
                <p><strong>Status:</strong> ${quote.status.toUpperCase()}</p>
            </div>
            <div class="info-section">
                <h3>Property Information</h3>
                <p><strong>Building:</strong> ${quote.buildingName}</p>
                <p><strong>Address:</strong> ${quote.buildingAddress}</p>
                <p><strong>Floors:</strong> ${quote.floorCount}</p>
            </div>
        </div>

        ${quote.strataManagerName || quote.strataManagerAddress ? `
        <div class="info-grid">
            <div class="info-section">
                <h3>Strata Property Manager</h3>
                ${quote.strataManagerName ? `<p><strong>Name:</strong> ${quote.strataManagerName}</p>` : ''}
                ${quote.strataManagerAddress ? `<p><strong>Address:</strong> ${quote.strataManagerAddress}</p>` : ''}
            </div>
        </div>
        ` : ''}

        <div class="services-section">
            <h2>Services Proposed</h2>
            ${quote.services?.map((service: any, index: number) => {
              const serviceName = serviceNames[service.serviceType] || service.serviceType;
              let details = [];

              if (service.dropsNorth || service.dropsEast || service.dropsSouth || service.dropsWest) {
                details.push(`<p><strong>Elevation Drops:</strong> North: ${service.dropsNorth || 0}, East: ${service.dropsEast || 0}, South: ${service.dropsSouth || 0}, West: ${service.dropsWest || 0}</p>`);
                if (service.dropsPerDay) details.push(`<p><strong>Drops per Day:</strong> ${service.dropsPerDay}</p>`);
              }

              if (service.parkadeStalls) details.push(`<p><strong>Parking Stalls:</strong> ${service.parkadeStalls}</p>`);
              if (service.groundWindowHours) details.push(`<p><strong>Estimated Hours:</strong> ${service.groundWindowHours}</p>`);
              if (service.suitesPerDay) details.push(`<p><strong>Suites per Day:</strong> ${service.suitesPerDay}</p>`);
              if (service.floorsPerDay) details.push(`<p><strong>Floors per Day:</strong> ${service.floorsPerDay}</p>`);

              return `
                <div class="service-item">
                    <h3>${index + 1}. ${serviceName}</h3>
                    <div class="service-details">
                        ${details.join('')}
                        ${canViewFinancials && service.totalHours ? `<p><strong>Total Hours:</strong> ${service.totalHours}</p>` : ''}
                        ${canViewFinancials && service.pricePerHour ? `<p><strong>Hourly Rate:</strong> $${Number(service.pricePerHour).toFixed(2)}/hour</p>` : ''}
                        ${canViewFinancials && service.pricePerStall ? `<p><strong>Price per Stall:</strong> $${Number(service.pricePerStall).toFixed(2)}</p>` : ''}
                    </div>
                    ${canViewFinancials && service.totalCost ? `
                    <div class="pricing-row">
                        <strong>Service Total</strong>
                        <strong>$${Number(service.totalCost).toFixed(2)}</strong>
                    </div>
                    ` : ''}
                </div>
              `;
            }).join('') || ''}
        </div>

        ${canViewFinancials ? `
        <div class="total-section">
            <h3>TOTAL INVESTMENT</h3>
            <div class="amount">$${grandTotal.toFixed(2)}</div>
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>Professional Rope Access Services</strong></p>
            <p>High-Rise Maintenance & Building Services</p>
            <p style="margin-top: 15px; font-size: 12px;">This quote is valid for 30 days from the date of issue. All work will be completed in accordance with IRATA standards and local safety regulations.</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quote_${quote.strataPlanNumber}_${new Date(quote.createdAt || Date.now()).toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDocumentUpload = async (file: File, documentType: 'health_safety_manual' | 'company_policy') => {
    const setUploading = documentType === 'health_safety_manual' ? setUploadingHealthSafety : setUploadingPolicy;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const response = await fetch('/api/company-documents', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      toast({
        title: "Success",
        description: `Document uploaded successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/company-documents"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/company-documents/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/company-documents"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold truncate">Documents & Records</h1>
              <p className="text-sm text-muted-foreground hidden sm:block mt-1">All company documents and safety records</p>
            </div>
          </div>
        </div>

        {/* Documentation Safety Rating */}
        {(() => {
          const hasHealthSafety = healthSafetyDocs.length > 0;
          const hasPolicy = policyDocs.length > 0;
          const docsCount = (hasHealthSafety ? 1 : 0) + (hasPolicy ? 1 : 0);
          const ratingPercent = docsCount === 2 ? 100 : docsCount === 1 ? 50 : 0;
          
          return (
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ring-1 ${
                    ratingPercent === 100 
                      ? 'bg-emerald-500/10 ring-emerald-500/20' 
                      : ratingPercent >= 50 
                        ? 'bg-amber-500/10 ring-amber-500/20'
                        : 'bg-red-500/10 ring-red-500/20'
                  }`}>
                    <Shield className={`h-6 w-6 ${
                      ratingPercent === 100 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : ratingPercent >= 50 
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Documentation Safety Rating</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {ratingPercent === 100 
                        ? 'Excellent! All required documents are uploaded' 
                        : ratingPercent >= 50 
                          ? 'Partial compliance - upload missing documents'
                          : 'No documents uploaded yet'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      ratingPercent === 100 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : ratingPercent >= 50 
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}>
                      {ratingPercent}%
                    </div>
                    <div className="text-sm text-muted-foreground">{docsCount}/2 documents</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex gap-4 mb-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                    hasHealthSafety 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {hasHealthSafety ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Health & Safety Manual
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                    hasPolicy 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {hasPolicy ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    Company Policy
                  </div>
                </div>
                <Progress 
                  value={ratingPercent} 
                  className={`h-2 ${
                    ratingPercent === 100 
                      ? '[&>div]:bg-emerald-500' 
                      : ratingPercent >= 50 
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-red-500'
                  }`} 
                />
              </CardContent>
            </Card>
          );
        })()}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="grid w-full min-w-[380px] md:min-w-0 grid-cols-3 max-w-xl gap-1">
              <TabsTrigger value="health-safety" data-testid="tab-health-safety" className="text-xs md:text-sm px-2 md:px-4">
                <span className="hidden md:inline">Health & Safety Manual</span>
                <span className="md:hidden">Health/Safety</span>
              </TabsTrigger>
              <TabsTrigger value="company-policy" data-testid="tab-company-policy" className="text-xs md:text-sm px-2 md:px-4">
                <span className="hidden md:inline">Company Policy</span>
                <span className="md:hidden">Policy</span>
              </TabsTrigger>
              <TabsTrigger value="inspections-safety" data-testid="tab-inspections-safety" className="text-xs md:text-sm px-2 md:px-4">
                <span className="hidden md:inline">Inspections & Safety</span>
                <span className="md:hidden">Inspections</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Health & Safety Manual Tab */}
          <TabsContent value="health-safety">
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20">
                <Shield className="h-6 w-6 text-primary dark:text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">Health & Safety Manual</CardTitle>
                <p className="text-sm text-muted-foreground">Essential workplace safety documentation</p>
              </div>
              <Badge variant="secondary" className="text-base font-semibold px-3">
                {healthSafetyDocs.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {canUploadDocuments && (
              <div className="mb-6 p-5 border-2 border-dashed rounded-xl bg-muted/30 hover-elevate">
                <label htmlFor="health-safety-upload" className="block mb-3 text-sm font-semibold flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload New Manual
                </label>
                <Input
                  id="health-safety-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  disabled={uploadingHealthSafety}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleDocumentUpload(file, 'health_safety_manual');
                      e.target.value = '';
                    }
                  }}
                  data-testid="input-health-safety-upload"
                />
                {uploadingHealthSafety && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <span className="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    Uploading...
                  </p>
                )}
              </div>
            )}
            
            {healthSafetyDocs.length > 0 ? (
              <div className="space-y-3">
                {healthSafetyDocs.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                    <div className="p-2 bg-primary/50/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary dark:text-primary flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{doc.fileName}</div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded by {doc.uploadedByName} • {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                        data-testid={`download-health-safety-${doc.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {canUploadDocuments && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDocumentMutation.mutate(doc.id)}
                          data-testid={`delete-health-safety-${doc.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-primary/50/5 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-primary/50" />
                </div>
                <p className="text-muted-foreground font-medium">No Health & Safety Manual uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-1">Upload your first document to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* Company Policy Tab */}
          <TabsContent value="company-policy">
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent pb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl ring-1 ring-purple-500/20">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">Company Policies</CardTitle>
                <p className="text-sm text-muted-foreground">Operational guidelines and procedures</p>
              </div>
              <Badge variant="secondary" className="text-base font-semibold px-3">
                {policyDocs.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {canUploadDocuments && (
              <div className="mb-6 p-5 border-2 border-dashed rounded-xl bg-muted/30 hover-elevate">
                <label htmlFor="policy-upload" className="block mb-3 text-sm font-semibold flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload New Policy
                </label>
                <Input
                  id="policy-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  disabled={uploadingPolicy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleDocumentUpload(file, 'company_policy');
                      e.target.value = '';
                    }
                  }}
                  data-testid="input-policy-upload"
                />
                {uploadingPolicy && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <span className="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    Uploading...
                  </p>
                )}
              </div>
            )}
            
            {policyDocs.length > 0 ? (
              <div className="space-y-3">
                {policyDocs.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{doc.fileName}</div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded by {doc.uploadedByName} • {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(doc.fileUrl, '_blank')}
                        data-testid={`download-policy-${doc.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {canUploadDocuments && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDocumentMutation.mutate(doc.id)}
                          data-testid={`delete-policy-${doc.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-purple-500/5 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-purple-500/50" />
                </div>
                <p className="text-muted-foreground font-medium">No Company Policies uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-1">Upload your first policy document</p>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* Inspections & Safety Tab */}
          <TabsContent value="inspections-safety">
            {/* Toolbox Meeting Safety Rating */}
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ring-1 ${
                    toolboxMeetingCompliance.percentage >= 90 
                      ? 'bg-emerald-500/10 ring-emerald-500/20' 
                      : toolboxMeetingCompliance.percentage >= 50 
                        ? 'bg-amber-500/10 ring-amber-500/20'
                        : 'bg-red-500/10 ring-red-500/20'
                  }`}>
                    <Calendar className={`h-6 w-6 ${
                      toolboxMeetingCompliance.percentage >= 90 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : toolboxMeetingCompliance.percentage >= 50 
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Toolbox Meeting Compliance</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {toolboxMeetingCompliance.totalDays === 0 
                        ? 'No work sessions recorded yet'
                        : toolboxMeetingCompliance.percentage >= 90 
                          ? 'Excellent! Daily toolbox meetings are being conducted consistently' 
                          : toolboxMeetingCompliance.percentage >= 50 
                            ? 'Some project days are missing toolbox meetings'
                            : 'Most project work days are missing toolbox meetings'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${
                      toolboxMeetingCompliance.percentage >= 90 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : toolboxMeetingCompliance.percentage >= 50 
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}>
                      {toolboxMeetingCompliance.percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {toolboxMeetingCompliance.daysWithMeeting}/{toolboxMeetingCompliance.totalDays} work days
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-3 text-sm text-muted-foreground">
                  Measures how often a toolbox meeting was conducted on days when work sessions were active.
                  Project-specific meetings cover that project. "Other" meetings (office, training) cover all work sessions on that date.
                </div>
                <Progress 
                  value={toolboxMeetingCompliance.percentage} 
                  className={`h-2 ${
                    toolboxMeetingCompliance.percentage >= 90 
                      ? '[&>div]:bg-emerald-500' 
                      : toolboxMeetingCompliance.percentage >= 50 
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-red-500'
                  }`} 
                />
              </CardContent>
            </Card>

            {/* Harness Inspections */}
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-xl ring-1 ring-indigo-500/20">
                    <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Equipment Inspection Records</CardTitle>
                    <p className="text-sm text-muted-foreground">Rope access gear and safety equipment</p>
                  </div>
                  <Badge variant="secondary" className="text-base font-semibold px-3">
                    {inspections.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {inspections.length > 0 ? (
                  <div className="space-y-3">
                    {inspections.map((inspection) => (
                      <div key={inspection.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                          <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold">
                            {new Date(inspection.inspectionDate).toLocaleDateString()} - {inspection.inspectorName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {inspection.manufacturer || 'Equipment inspection'}
                          </div>
                        </div>
                        <Badge variant={inspection.overallStatus === 'pass' ? 'default' : 'destructive'}>
                          {inspection.overallStatus || 'N/A'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadHarnessInspection(inspection)}
                          data-testid={`download-inspection-tab-${inspection.id}`}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-indigo-500/5 rounded-full mb-4">
                      <Shield className="h-8 w-8 text-indigo-500/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">No equipment inspections recorded yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Inspections will be logged here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Toolbox Meetings List */}
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl ring-1 ring-cyan-500/20">
                    <Calendar className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Toolbox Meeting Records</CardTitle>
                    <p className="text-sm text-muted-foreground">Daily safety meeting documentation</p>
                  </div>
                  <Badge variant="secondary" className="text-base font-semibold px-3">
                    {meetings.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {meetings.length > 0 ? (
                  <div className="space-y-3">
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                          <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold">
                            {formatLocalDate(meeting.meetingDate)} - {meeting.conductedByName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {meeting.projectName || 'Project meeting'}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadToolboxMeeting(meeting)}
                          data-testid={`download-toolbox-meeting-tab-${meeting.id}`}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-cyan-500/5 rounded-full mb-4">
                      <Calendar className="h-8 w-8 text-cyan-500/50" />
                    </div>
                    <p className="text-muted-foreground font-medium">No toolbox meetings recorded yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Safety meetings will be documented here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Rope Access Plans - Only visible if user has safety document permission */}
        {canViewSafety && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent pb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-500/10 rounded-xl ring-1 ring-teal-500/20">
                  <FileText className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">Rope Access Plans</CardTitle>
                  <p className="text-sm text-muted-foreground">Project-specific access plans and documentation</p>
                </div>
                <Badge variant="secondary" className="text-base font-semibold px-3">
                  {allDocuments.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {allDocuments.length > 0 ? (
                <div className="space-y-3">
                  {allDocuments.map((doc, index) => {
                    const filename = doc.url.split('/').pop() || 'Document';
                    return (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                        <div className="p-2 bg-teal-500/10 rounded-lg">
                          <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{doc.projectName}</div>
                          <div className="text-sm text-muted-foreground truncate">{filename}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.url, '_blank')}
                          data-testid={`download-pdf-${index}`}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-teal-500/5 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-teal-500/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No rope access plans uploaded yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Plans will appear here when added to projects</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Toolbox Meetings */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent pb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl ring-1 ring-cyan-500/20">
                <Calendar className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">Toolbox Meeting Records</CardTitle>
                <p className="text-sm text-muted-foreground">Daily safety briefings and discussions</p>
              </div>
              <Badge variant="secondary" className="text-base font-semibold px-3">
                {meetings.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {meetings.length > 0 ? (
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">
                        {formatLocalDate(meeting.meetingDate, { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Conducted by {meeting.conductedByName}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadToolboxMeeting(meeting)}
                      data-testid={`download-meeting-${meeting.id}`}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-cyan-500/5 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-cyan-500/50" />
                </div>
                <p className="text-muted-foreground font-medium">No toolbox meetings recorded yet</p>
                <p className="text-sm text-muted-foreground mt-1">Safety meetings will appear here when conducted</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FLHA Forms - Only visible to users with safety document permission */}
        {canViewSafety && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent pb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/10 rounded-xl ring-1 ring-orange-500/20">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">FLHA Records</CardTitle>
                  <p className="text-sm text-muted-foreground">Field-level hazard assessments</p>
                </div>
                <Badge variant="secondary" className="text-base font-semibold px-3">
                  {flhaForms.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {flhaForms.length > 0 ? (
                <div className="space-y-3">
                  {flhaForms.map((flha) => (
                    <div key={flha.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">
                          {new Date(flha.assessmentDate).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Assessor: {flha.assessorName}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadFlhaForm(flha)}
                        data-testid={`download-flha-${flha.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-orange-500/5 rounded-full mb-4">
                    <Calendar className="h-8 w-8 text-orange-500/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No FLHA forms recorded yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Hazard assessments will appear here when completed</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Incident Reports - Only visible to users with safety document permission */}
        {canViewSafety && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent pb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl ring-1 ring-red-500/20">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">Incident Reports</CardTitle>
                  <p className="text-sm text-muted-foreground">Safety incidents and accident reports</p>
                </div>
                <Badge variant="secondary" className="text-base font-semibold px-3">
                  {incidentReports.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {incidentReports.length > 0 ? (
                <div className="space-y-3">
                  {incidentReports.map((report) => (
                    <div key={report.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">
                          {new Date(report.incidentDate).toLocaleDateString()}
                          {report.location && <span className="text-muted-foreground font-normal"> • {report.location}</span>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {report.incidentType || 'Incident'} • Severity: {report.severity || 'N/A'}
                        </div>
                        {report.description && (
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {report.description}
                          </div>
                        )}
                      </div>
                      {report.severity && (
                        <Badge 
                          variant={
                            report.severity === 'critical' ? 'destructive' :
                            report.severity === 'major' ? 'destructive' :
                            report.severity === 'moderate' ? 'default' :
                            'secondary'
                          }
                        >
                          {report.severity}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadIncidentReport(report)}
                        data-testid={`download-incident-${report.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-red-500/5 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-500/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No incident reports recorded yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Safety incidents will be documented here</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Method Statements */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent pb-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl ring-1 ring-emerald-500/20">
                <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-1">Method Statements</CardTitle>
                <p className="text-sm text-muted-foreground">Work procedures and safety methods</p>
              </div>
              <Badge variant="secondary" className="text-base font-semibold px-3">
                {methodStatements.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {methodStatements.length > 0 ? (
              <div className="space-y-3">
                {methodStatements.map((statement) => (
                  <div key={statement.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">
                        {statement.location || 'Method Statement'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(statement.dateCreated).toLocaleDateString()} • Prepared by {statement.preparedByName}
                      </div>
                      {statement.workDescription && (
                        <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {statement.workDescription}
                        </div>
                      )}
                    </div>
                    <Badge variant={statement.status === 'approved' ? 'default' : 'secondary'}>
                      {statement.status || 'draft'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadMethodStatement(statement, currentUser)}
                      data-testid={`download-method-statement-${statement.id}`}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-emerald-500/5 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-emerald-500/50" />
                </div>
                <p className="text-muted-foreground font-medium">No method statements recorded yet</p>
                <p className="text-sm text-muted-foreground mt-1">Work procedures will be documented here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Quotes */}
        {canViewFinancials && (
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent pb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl ring-1 ring-amber-500/20">
                  <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">Service Quotes</CardTitle>
                  <p className="text-sm text-muted-foreground">Client proposals and estimates</p>
                </div>
                <Badge variant="secondary" className="text-base font-semibold px-3">
                  {quotes.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {quotes.length > 0 ? (
                <div className="space-y-3">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover-elevate active-elevate-2">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">{quote.buildingName}</div>
                        <div className="text-sm text-muted-foreground">
                          {quote.strataPlanNumber} • {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : ''}
                        </div>
                      </div>
                      <Badge variant={quote.status === 'open' ? 'default' : 'secondary'}>
                        {quote.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadQuote(quote)}
                        data-testid={`download-quote-${quote.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-amber-500/5 rounded-full mb-4">
                    <DollarSign className="h-8 w-8 text-amber-500/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">No quotes created yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Service proposals will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
