import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Calendar, DollarSign, Upload, Trash2, Shield, BookOpen, ArrowLeft, AlertTriangle, Plus } from "lucide-react";
import { hasFinancialAccess } from "@/lib/permissions";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { jsPDF } from "jspdf";

export default function Documents() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [uploadingHealthSafety, setUploadingHealthSafety] = useState(false);
  const [uploadingPolicy, setUploadingPolicy] = useState(false);

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

  const { data: quotesData } = useQuery<{ quotes: any[] }>({
    queryKey: ["/api/quotes"],
  });

  const { data: companyDocsData } = useQuery<{ documents: any[] }>({
    queryKey: ["/api/company-documents"],
  });

  const currentUser = userData?.user;
  const canViewFinancials = hasFinancialAccess(currentUser);
  const canUploadDocuments = currentUser?.role === 'company' || currentUser?.role === 'operations_manager';
  const projects = projectsData?.projects || [];
  const meetings = meetingsData?.meetings || [];
  const flhaForms = flhaFormsData?.flhaForms || [];
  const inspections = inspectionsData?.inspections || [];
  const incidentReports = incidentReportsData?.reports || [];
  const quotes = quotesData?.quotes || [];
  const companyDocuments = companyDocsData?.documents || [];

  const healthSafetyDocs = companyDocuments.filter((doc: any) => doc.documentType === 'health_safety_manual');
  const policyDocs = companyDocuments.filter((doc: any) => doc.documentType === 'company_policy');

  // Collect all rope access plan PDFs
  const allDocuments = projects.flatMap(project => 
    (project.documentUrls || []).map((url: string) => ({
      type: 'pdf',
      url,
      projectName: project.buildingName,
      date: project.createdAt
    }))
  );

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
    doc.text(`Date: ${new Date(meeting.meetingDate).toLocaleDateString('en-US', { 
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
    doc.save(`Toolbox_Meeting_${new Date(meeting.meetingDate).toISOString().split('T')[0]}.pdf`);
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Documents</h1>
          </div>
          <p className="text-muted-foreground">All company documents and safety records</p>
        </div>

        {/* Health & Safety Manual */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Health & Safety Manual
              <Badge variant="secondary" className="ml-auto">
                {healthSafetyDocs.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {canUploadDocuments && (
              <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                <label htmlFor="health-safety-upload" className="block mb-2 text-sm font-medium">
                  Upload Health & Safety Manual
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
                  <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                )}
              </div>
            )}
            
            {healthSafetyDocs.length > 0 ? (
              <div className="space-y-2">
                {healthSafetyDocs.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.fileName}</div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded by {doc.uploadedByName} on {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
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
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No Health & Safety Manual uploaded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Company Policies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Company Policies
              <Badge variant="secondary" className="ml-auto">
                {policyDocs.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {canUploadDocuments && (
              <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                <label htmlFor="policy-upload" className="block mb-2 text-sm font-medium">
                  Upload Company Policy
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
                  <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                )}
              </div>
            )}
            
            {policyDocs.length > 0 ? (
              <div className="space-y-2">
                {policyDocs.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.fileName}</div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded by {doc.uploadedByName} on {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
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
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No Company Policies uploaded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Rope Access Plans */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Rope Access Plans
              <Badge variant="secondary" className="ml-auto">
                {allDocuments.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allDocuments.length > 0 ? (
              <div className="space-y-2">
                {allDocuments.map((doc, index) => {
                  const filename = doc.url.split('/').pop() || 'Document';
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{doc.projectName}</div>
                        <div className="text-sm text-muted-foreground">{filename}</div>
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
              <p className="text-center py-8 text-muted-foreground">
                No rope access plans uploaded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Toolbox Meetings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Toolbox Meeting Records
              <Badge variant="secondary" className="ml-auto">
                {meetings.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {meetings.length > 0 ? (
              <div className="space-y-2">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        {new Date(meeting.meetingDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Conducted by: {meeting.conductedByName}
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
              <p className="text-center py-8 text-muted-foreground">
                No toolbox meetings recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* FLHA Forms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              FLHA Records
              <Badge variant="secondary" className="ml-auto">
                {flhaForms.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {flhaForms.length > 0 ? (
              <div className="space-y-2">
                {flhaForms.map((flha) => (
                  <div key={flha.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        {new Date(flha.assessmentDate).toLocaleDateString()}
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
              <p className="text-center py-8 text-muted-foreground">
                No FLHA forms recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Incident Reports */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incident Reports
              <Badge variant="secondary" className="ml-auto">
                {incidentReports.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incidentReports.length > 0 ? (
              <div className="space-y-2">
                {incidentReports.map((report) => (
                  <div key={report.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        {new Date(report.incidentDate).toLocaleDateString()}
                        {report.location && ` - ${report.location}`}
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
              <p className="text-center py-8 text-muted-foreground">
                No incident reports recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Harness Inspections */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-xl">verified_user</span>
              Equipment Inspection Records
              <Badge variant="secondary" className="ml-auto">
                {inspections.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inspections.length > 0 ? (
              <div className="space-y-2">
                {inspections.map((inspection) => (
                  <div key={inspection.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                    <span className="material-icons text-primary flex-shrink-0">verified_user</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
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
                      data-testid={`download-inspection-${inspection.id}`}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No equipment inspections recorded yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Service Quotes */}
        {canViewFinancials && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Service Quotes
                <Badge variant="secondary" className="ml-auto">
                  {quotes.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quotes.length > 0 ? (
                <div className="space-y-2">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="flex items-center gap-3 p-3 rounded-md border hover-elevate">
                      <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{quote.buildingName}</div>
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
                <p className="text-center py-8 text-muted-foreground">
                  No quotes created yet
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
