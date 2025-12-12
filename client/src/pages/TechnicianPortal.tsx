import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Helper to detect iOS PWA standalone mode
const isIOSPWA = (): boolean => {
  return (
    'standalone' in window.navigator && 
    (window.navigator as any).standalone === true
  );
};

// Helper to open external links reliably on iOS PWA
const openExternalLink = (url: string): void => {
  if (isIOSPWA()) {
    // In iOS PWA mode, use location.href to force Safari to open
    window.location.href = url;
  } else {
    // Normal browser behavior
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate, formatDateTime, parseLocalDate } from "@/lib/dateUtils";
import { JOB_CATEGORIES, JOB_TYPES, getJobTypesByCategory, type JobCategory } from "@shared/jobTypes";
import { 
  User, 
  LogOut, 
  Edit2, 
  Save, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Heart, 
  Building,
  Building2,
  CreditCard,
  Calendar,
  AlertCircle,
  AlertTriangle,
  HardHat,
  Clock,
  FileText,
  Image as ImageIcon,
  Shield,
  ExternalLink,
  CheckCircle2,
  Upload,
  Loader2,
  Languages,
  UserMinus,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Copy,
  Share2,
  Users,
  Pencil,
  Star,
  Gift,
  Lock,
  Crown,
  MessageSquare,
  Home,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

type Language = 'en' | 'fr';

const translations = {
  en: {
    technicianPortal: "Technician Portal",
    signOut: "Sign Out",
    editProfile: "Edit Profile",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    saving: "Saving...",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    email: "Email",
    phoneNumber: "Phone Number",
    birthday: "Birthday",
    address: "Address",
    streetAddress: "Street Address",
    city: "City",
    provinceState: "Province/State",
    country: "Country",
    postalCode: "Postal Code",
    emergencyContact: "Emergency Contact",
    contactName: "Contact Name",
    contactPhone: "Contact Phone",
    relationship: "Relationship",
    payrollInfo: "Payroll Information",
    sin: "Social Insurance Number",
    bankAccount: "Bank Account",
    transit: "Transit",
    institution: "Institution",
    account: "Account",
    driversLicense: "Driver's License",
    licenseNumber: "License #",
    expiry: "Expiry",
    medicalConditions: "Medical Conditions",
    specialMedicalConditions: "Special Medical Conditions",
    medicalPlaceholder: "Optional - Any conditions your employer should be aware of",
    certifications: "Certifications",
    baselineHours: "Baseline Hours",
    hours: "hours",
    certificationCard: "Certification Card",
    tapToViewPdf: "Tap to view PDF",
    tapToViewDocument: "Tap to view document",
    licenseVerified: "License Verified",
    lastVerified: "Last verified",
    reverifyLicense: "Re-verify Your License",
    verifyLicenseValidity: "Verify Your License Validity",
    verificationExplanation: "Employers require verified certification status to ensure compliance with safety regulations and insurance requirements. Verifying your license helps your employer confirm you're qualified for rope access work.",
    howItWorks: "How it works:",
    step1: "Click \"Open irata Portal\" to open the verification page",
    step2: "Enter your last name and license number",
    step3: "Take a screenshot of the verification result",
    step4: "Come back here and click \"Upload Screenshot\"",
    openIrataPortal: "Open irata Portal",
    uploadVerificationScreenshot: "Upload Verification Screenshot",
    analyzingScreenshot: "Analyzing Screenshot...",
    name: "Name",
    license: "License",
    level: "Level",
    validUntil: "Valid Until",
    confidence: "Confidence",
    firstAid: "First Aid",
    firstAidType: "Type",
    expiresOn: "Expires on",
    expired: "Expired",
    expiringSoon: "Expiring Soon",
    expiringIn60Days: "Expiring in 60 days",
    expiringIn30Days: "Urgent: 30 days",
    certificationExpiryBannerTitle: "Certification Expiring Soon!",
    certificationExpiryBannerMessage: "Your {cert} certification expires on {date}. Renew now to avoid work interruption.",
    proBadge: "PLUS",
    proBadgeTooltip: "PLUS Member",
    verified: "Verified",
    firstAidCertificate: "First Aid Certificate",
    uploadedDocuments: "Uploaded Documents",
    licensePhoto: "License Photo",
    driverAbstract: "Driver Abstract",
    voidCheque: "Void Cheque / Bank Info",
    uploadDocument: "Upload Document",
    uploadVoidCheque: "Upload Void Cheque",
    replaceVoidCheque: "Replace Void Cheque",
    addVoidCheque: "Add Another Void Cheque",
    uploadDriversLicense: "Upload Driver's License",
    replaceDriversLicense: "Replace License",
    addDriversLicense: "Add License Photo",
    uploadDriversAbstract: "Upload Driver's Abstract",
    replaceDriversAbstract: "Replace Abstract",
    addDriversAbstract: "Add Abstract",
    uploadFirstAidCert: "Upload First Aid Certificate",
    replaceFirstAidCert: "Replace Certificate",
    addFirstAidCert: "Add Certificate",
    uploadCertificationCard: "Upload Certification Card",
    replaceCertificationCard: "Replace Card",
    addCertificationCard: "Add Card",
    uploadIrataCertificationCard: "Upload irata Card",
    uploadSpratCertificationCard: "Upload SPRAT Card",
    irataCertificationCard: "irata Certification Card",
    spratCertificationCard: "SPRAT Certification Card",
    experience: "Experience",
    ropeAccessExperience: "Rope Access Experience",
    experienceStartDate: "Experience Start Date",
    experienceStartDateHelp: "When did you start your rope access career?",
    yearsMonths: "{years} year(s), {months} month(s)",
    lessThanMonth: "Less than a month",
    startedOn: "Started on",
    notSet: "Not set",
    resume: "Resume / CV",
    uploadResume: "Upload Resume",
    addResume: "Add Another Resume",
    specialties: "Rope Access Specialties",
    specialtiesDesc: "Select the job types you specialize in",
    noSpecialties: "No specialties selected",
    addSpecialty: "Add Specialty",
    removeSpecialty: "Remove",
    selectCategory: "Select Category",
    selectJobType: "Select Job Type",
    resumeUploaded: "Resume Uploaded",
    documentUploaded: "Document Uploaded",
    documentUploadedDesc: "Your document has been uploaded successfully.",
    uploadFailed: "Upload Failed",
    selectFile: "Select a file to upload",
    uploading: "Uploading...",
    notProvided: "Not provided",
    loadingProfile: "Loading your profile...",
    pleaseLogin: "Please log in to view your profile.",
    goToLogin: "Go to Login",
    profileUpdated: "Profile Updated",
    changesSaved: "Your changes have been saved successfully.",
    updateFailed: "Update Failed",
    invalidFile: "Invalid file",
    uploadImageFile: "Please upload an image file (screenshot)",
    verificationSuccessful: "Verification Successful",
    irataVerified: "Your irata license has been verified!",
    spratVerified: "Your SPRAT license has been verified!",
    verificationIssue: "Verification Issue",
    couldNotVerify: "Could not verify license from screenshot",
    verificationFailed: "Verification Failed",
    failedToAnalyze: "Failed to analyze screenshot",
    openSpratPortal: "Open SPRAT Portal",
    spratStep1: "Click \"Open SPRAT Portal\" to open the verification page",
    spratVerificationExplanation: "Employers require verified SPRAT certification status to ensure compliance with safety regulations and insurance requirements.",
    privacyNotice: "Privacy Notice",
    privacyText: "Your personal information is securely stored and used only by your employer for HR and payroll purposes. We never share your data externally.",
    errorNameRequired: "Name is required",
    errorInvalidEmail: "Invalid email",
    errorPhoneRequired: "Phone is required",
    errorEmergencyNameRequired: "Emergency contact name is required",
    errorEmergencyPhoneRequired: "Emergency contact phone is required",
    teamInvitations: "Team Invitations",
    pendingInvitations: "Pending Invitations",
    noInvitations: "No pending invitations",
    noInvitationsDesc: "When a company invites you to join their team, it will appear here.",
    invitedBy: "Invitation from",
    acceptInvitation: "Accept",
    declineInvitation: "Decline",
    acceptingInvitation: "Accepting...",
    decliningInvitation: "Declining...",
    invitationAccepted: "Invitation Accepted",
    welcomeToTeam: "Welcome to the team!",
    invitationDeclined: "Invitation Declined",
    declinedMessage: "You have declined this invitation.",
    invitationError: "Error",
    invitationMessage: "Message",
    invitedOn: "Invited on",
    currentEmployer: "Current Employer",
    currentlyEmployedBy: "You are currently employed by",
    leaveCompany: "Leave Company",
    leavingCompany: "Leaving...",
    leaveCompanyConfirm: "Are you sure you want to leave this company?",
    leaveCompanyWarning: "This will remove you from their active roster. You can still be invited by other companies.",
    confirmLeave: "Yes, Leave Company",
    cancelLeave: "Cancel",
    leftCompany: "Left Company",
    leftCompanyDesc: "You have successfully left the company. You can now accept invitations from other companies.",
    leaveError: "Error",
    yourCompensation: "Your Compensation",
    year: "year",
    hour: "hr",
    goToWorkDashboard: "Go to Work Dashboard",
    accessProjects: "Access projects, clock in/out, and safety forms",
    dashboardDisabledNoCompany: "You need to be linked with a company to access the Work Dashboard. Accept an invitation below to get started.",
    dashboardDisabledTerminated: "Your employment has been terminated. Accept a new invitation to access the Work Dashboard.",
    selectEmployer: "Select Employer",
    selectEmployerDesc: "Choose which employer's dashboard to access",
    connectedEmployers: "Connected Employers",
    primaryEmployer: "Primary",
    suspended: "Suspended",
    active: "Active",
    setPrimary: "Set as Primary",
    continueToEmployer: "Continue",
    noEmployersConnected: "No employers connected",
    myLoggedHours: "My Logged Hours",
    viewLoggedHoursDesc: "Track your rope access career progress",
    viewLoggedHours: "View Logged Hours",
    loggedHoursFeatures: "Scan your logbook pages with AI or manually add previous work experience",
    totalHoursLogged: "Total Hours Logged",
    hoursLogged: "hours logged",
    totalHoursLabel: "total hours",
    baselinePlus: "baseline +",
    fromSessions: "from sessions",
    workSessions: "Work Sessions",
    previousHours: "Previous Hours",
    previousHoursDesc: "Hours from work before joining this platform (not counted in totals)",
    addPreviousHours: "Add Previous Hours",
    noLoggedHours: "No logged hours yet",
    noLoggedHoursDesc: "Your work sessions will appear here after you clock in and out.",
    noPreviousHours: "No previous hours recorded",
    noPreviousHoursDesc: "Add historical work experience that won't count toward your certification totals.",
    dateRange: "Date Range",
    to: "to",
    building: "Building",
    buildingName: "Building Name",
    buildingAddress: "Building Address",
    buildingHeight: "Building Height",
    heightPlaceholder: "e.g., 25 floors, 100m",
    tasksPerformed: "Tasks Performed",
    selectTasks: "Select tasks performed",
    hoursWorked: "Hours Worked",
    previousEmployer: "Previous Employer",
    previousEmployerPlaceholder: "Company name (optional)",
    notes: "Notes",
    notesPlaceholder: "Any additional details (optional)",
    startDate: "Start Date",
    endDate: "End Date",
    savePreviousHours: "Save Previous Hours",
    savingHours: "Saving...",
    previousHoursAdded: "Previous Hours Added",
    previousHoursAddedDesc: "Your previous work experience has been recorded.",
    previousHoursDeleted: "Previous Hours Deleted",
    previousHoursDeletedDesc: "The previous hours entry has been removed.",
    deletePreviousHours: "Delete",
    confirmDeletePreviousHours: "Are you sure you want to delete this previous hours entry?",
    deleteConfirm: "Delete",
    cancelDelete: "Cancel",
    logbookDisclaimer: "This is a personal tracking tool only. You must still record all hours in your official irata/SPRAT logbook - this digital log does not replace it.",
    jobBoard: "Job Board",
    jobBoardDesc: "Browse opportunities and make your profile visible to employers",
    browseJobs: "Browse Jobs",
    yourReferralCode: "Your Referral Code",
    shareReferralCode: "Share this code with fellow technicians to invite them to OnRopePro",
    referralPremiumBenefit: "You'll get PLUS access when your code is used!",
    viewPlusBenefits: "View PLUS Benefits",
    plusBenefitsTitle: "PLUS Benefits",
    plusBenefit1: "Unlimited employer connections",
    plusBenefit2: "Enhanced task detail logging",
    plusBenefit3: "Exportable work history (PDF/CSV)",
    plusBenefit4: "Work history analytics",
    plusBenefit5: "60-day certification expiry alerts",
    plusBenefit6: "Rope access company profile visibility (opt-in)",
    plusUnlockInfo: "Unlock: Refer 1 verified tech who completes account creation",
    plusLockedFeature: "PLUS Feature",
    plusLockedDesc: "Refer a technician to unlock",
    copyCode: "Copy Code",
    codeCopied: "Copied!",
    referredTimes: "Referred {count} technician(s)",
    yourReferrals: "Your Referrals",
    noReferralsYet: "No referrals yet. Share your code to get started!",
    joinedOn: "Joined",
    noReferralCodeYet: "No referral code yet",
    editExpirationDate: "Edit Expiration Date",
    setExpirationDate: "Set Expiration Date",
    expirationDateUpdated: "Expiration date updated",
    expirationDateUpdateFailed: "Failed to update expiration date",
    selectDate: "Select date",
    setExperience: "Set Experience",
    editExperience: "Edit Experience",
    experienceUpdated: "Experience start date updated",
    experienceUpdateFailed: "Failed to update experience start date",
    whenDidYouStart: "When did you start your rope access career?",
    addExperience: "Add your experience start date",
    referralCodeGenerating: "Your referral code will be generated when you complete registration",
    // Safety Rating
    performanceSafetyRating: "Safety Rating",
    overallScore: "Overall Score",
    harnessCompliance: "Harness Inspections",
    documentCompliance: "Documents Signed",
    sessionsAnalyzed: "Sessions Analyzed",
    noPerformanceData: "No performance data yet",
    noPerformanceDataDesc: "Complete work sessions to see your performance rating",
    ratingExcellent: "Excellent",
    ratingGood: "Good",
    ratingNeedsImprovement: "Needs Improvement",
    ratingPoor: "Poor",
    dropsExceeded: "Exceeded Target",
    dropsOnTarget: "On Target",
    dropsBelowTarget: "Below Target",
    dropsNa: "N/A",
    harnessYes: "Inspection Done",
    harnessNo: "No Inspection",
    sessionRating: "Session Rating",
    improvementNeeded: "Areas to improve:",
    improveHarness: "Complete harness inspection before clocking in",
    improveDocs: "Sign all assigned safety documents",
    // Feedback
    feedback: "Feedback",
    feedbackDesc: "Share suggestions or report issues with the OnRopePro team",
    sendFeedback: "Send Feedback",
    feedbackTitle: "Title",
    feedbackTitlePlaceholder: "Brief summary of your feedback",
    feedbackCategory: "Category",
    feedbackCategoryFeature: "New Feature",
    feedbackCategoryImprovement: "Improvement",
    feedbackCategoryBug: "Bug Report",
    feedbackCategoryOther: "Other",
    feedbackDescription: "Description",
    feedbackDescriptionPlaceholder: "Please describe your feedback in detail...",
    feedbackPriority: "Priority",
    feedbackPriorityLow: "Low",
    feedbackPriorityNormal: "Normal",
    feedbackPriorityHigh: "High",
    feedbackPriorityUrgent: "Urgent",
    feedbackScreenshot: "Screenshot (Optional)",
    feedbackScreenshotAdd: "Add Screenshot",
    feedbackSubmit: "Submit Feedback",
    feedbackSubmitting: "Submitting...",
    feedbackSuccess: "Thank You!",
    feedbackSuccessDesc: "Your feedback has been submitted. We appreciate your input and will review it carefully.",
    feedbackError: "Failed to submit feedback",
    viewMyFeedback: "View My Feedback",
    myFeedbackTitle: "My Feedback",
    tabHome: "Home",
    tabProfile: "Profile",
    tabEmployer: "Employer View",
    tabWork: "Work",
    tabMore: "More",
    employerProfileTitle: "What Employers See",
    employerProfileDesc: "This is how your profile appears to potential employers browsing the talent pool.",
    editEmployerProfile: "Edit",
    saveEmployerProfile: "Save",
    cancelEdit: "Cancel",
    visibilityStatus: "Visibility Status",
    visibleToEmployers: "Visible to Employers",
    hiddenFromEmployers: "Hidden from Employers",
    makeVisible: "Make Visible",
    makeHidden: "Hide Profile",
    yourSpecialties: "Your Specialties",
    addYourFirstSpecialty: "Add your first specialty to appear in employer searches",
    backToHome: "Back to Home",
    quickActions: "Quick Actions",
    myFeedbackDesc: "View your submitted feedback and responses from OnRopePro",
    noFeedbackYet: "You haven't submitted any feedback yet",
    feedbackStatus: "Status",
    feedbackResponses: "Responses",
    fromTeam: "OnRopePro Team",
    fromYou: "You",
    replyToFeedback: "Reply",
    sendReply: "Send Reply",
    replyPlaceholder: "Type your reply...",
    newResponse: "New Response",
  },
  fr: {
    technicianPortal: "Portail du technicien",
    signOut: "Déconnexion",
    editProfile: "Modifier le profil",
    cancel: "Annuler",
    saveChanges: "Enregistrer",
    saving: "Enregistrement...",
    personalInfo: "Informations personnelles",
    fullName: "Nom complet",
    email: "Courriel",
    phoneNumber: "Numéro de téléphone",
    birthday: "Date de naissance",
    address: "Adresse",
    streetAddress: "Adresse civique",
    city: "Ville",
    provinceState: "Province/État",
    country: "Pays",
    postalCode: "Code postal",
    emergencyContact: "Contact d'urgence",
    contactName: "Nom du contact",
    contactPhone: "Téléphone du contact",
    relationship: "Relation",
    payrollInfo: "Informations de paie",
    sin: "Numéro d'assurance sociale",
    bankAccount: "Compte bancaire",
    transit: "Transit",
    institution: "Institution",
    account: "Compte",
    driversLicense: "Permis de conduire",
    licenseNumber: "Numéro de permis",
    expiry: "Expiration",
    medicalConditions: "Conditions médicales",
    specialMedicalConditions: "Conditions médicales spéciales",
    medicalPlaceholder: "Facultatif - Toute condition dont votre employeur devrait être informé",
    certifications: "Certifications",
    baselineHours: "Heures de base",
    hours: "heures",
    certificationCard: "Carte de certification",
    tapToViewPdf: "Appuyez pour voir le PDF",
    tapToViewDocument: "Appuyez pour voir le document",
    licenseVerified: "Licence vérifiée",
    lastVerified: "Dernière vérification",
    reverifyLicense: "Re-vérifier votre licence",
    verifyLicenseValidity: "Vérifier la validité de votre licence",
    verificationExplanation: "Les employeurs exigent un statut de certification vérifié pour assurer la conformité aux règlements de sécurité et aux exigences d'assurance. La vérification de votre licence aide votre employeur à confirmer que vous êtes qualifié pour le travail d'accès sur corde.",
    howItWorks: "Comment ça fonctionne:",
    step1: "Cliquez sur « Ouvrir le portail irata » pour ouvrir la page de vérification",
    step2: "Entrez votre nom de famille et votre numéro de licence",
    step3: "Prenez une capture d'écran du résultat de la vérification",
    step4: "Revenez ici et cliquez sur « Téléverser la capture d'écran »",
    openIrataPortal: "Ouvrir le portail irata",
    uploadVerificationScreenshot: "Téléverser la capture d'écran",
    analyzingScreenshot: "Analyse en cours...",
    name: "Nom",
    license: "Licence",
    level: "Niveau",
    validUntil: "Valide jusqu'au",
    confidence: "Confiance",
    firstAid: "Premiers soins",
    firstAidType: "Type",
    expiresOn: "Expire le",
    expired: "Expiré",
    expiringSoon: "Expire bientôt",
    expiringIn60Days: "Expire dans 60 jours",
    expiringIn30Days: "Urgent: 30 jours",
    certificationExpiryBannerTitle: "Certification expire bientôt!",
    certificationExpiryBannerMessage: "Votre certification {cert} expire le {date}. Renouvelez maintenant pour éviter une interruption de travail.",
    proBadge: "PLUS",
    proBadgeTooltip: "Membre PLUS",
    verified: "Vérifié",
    firstAidCertificate: "Certificat de premiers soins",
    uploadedDocuments: "Documents téléversés",
    licensePhoto: "Photo du permis",
    driverAbstract: "Relevé de conduite",
    voidCheque: "Chèque annulé / Info bancaire",
    uploadDocument: "Téléverser un document",
    uploadVoidCheque: "Téléverser un chèque annulé",
    replaceVoidCheque: "Remplacer le chèque annulé",
    addVoidCheque: "Ajouter un autre chèque",
    uploadDriversLicense: "Téléverser le permis de conduire",
    replaceDriversLicense: "Remplacer le permis",
    addDriversLicense: "Ajouter une photo",
    uploadDriversAbstract: "Téléverser le relevé de conduite",
    replaceDriversAbstract: "Remplacer le relevé",
    addDriversAbstract: "Ajouter un relevé",
    uploadFirstAidCert: "Téléverser le certificat de premiers soins",
    replaceFirstAidCert: "Remplacer le certificat",
    addFirstAidCert: "Ajouter un certificat",
    uploadCertificationCard: "Téléverser la carte de certification",
    replaceCertificationCard: "Remplacer la carte",
    addCertificationCard: "Ajouter une carte",
    uploadIrataCertificationCard: "Téléverser la carte irata",
    uploadSpratCertificationCard: "Téléverser la carte SPRAT",
    irataCertificationCard: "Carte de certification irata",
    spratCertificationCard: "Carte de certification SPRAT",
    experience: "Expérience",
    ropeAccessExperience: "Expérience d'accès sur corde",
    experienceStartDate: "Date de début d'expérience",
    experienceStartDateHelp: "Quand avez-vous commencé votre carrière d'accès sur corde?",
    yearsMonths: "{years} an(s), {months} mois",
    lessThanMonth: "Moins d'un mois",
    startedOn: "Début le",
    notSet: "Non défini",
    resume: "Curriculum vitae",
    uploadResume: "Téléverser CV",
    addResume: "Ajouter un autre CV",
    specialties: "Spécialités d'accès sur corde",
    specialtiesDesc: "Sélectionnez les types de travaux dans lesquels vous vous spécialisez",
    noSpecialties: "Aucune spécialité sélectionnée",
    addSpecialty: "Ajouter",
    removeSpecialty: "Retirer",
    selectCategory: "Catégorie",
    selectJobType: "Type de travail",
    resumeUploaded: "CV téléversé",
    documentUploaded: "Document téléversé",
    documentUploadedDesc: "Votre document a été téléversé avec succès.",
    uploadFailed: "Échec du téléversement",
    selectFile: "Sélectionner un fichier à téléverser",
    uploading: "Téléversement...",
    notProvided: "Non fourni",
    loadingProfile: "Chargement de votre profil...",
    pleaseLogin: "Veuillez vous connecter pour voir votre profil.",
    goToLogin: "Aller à la connexion",
    profileUpdated: "Profil mis à jour",
    changesSaved: "Vos modifications ont été enregistrées avec succès.",
    updateFailed: "Échec de la mise à jour",
    invalidFile: "Fichier invalide",
    uploadImageFile: "Veuillez téléverser un fichier image (capture d'écran)",
    verificationSuccessful: "Vérification réussie",
    irataVerified: "Votre licence irata a été vérifiée!",
    spratVerified: "Votre licence SPRAT a été vérifiée!",
    verificationIssue: "Problème de vérification",
    couldNotVerify: "Impossible de vérifier la licence à partir de la capture d'écran",
    verificationFailed: "Échec de la vérification",
    failedToAnalyze: "Échec de l'analyse de la capture d'écran",
    openSpratPortal: "Ouvrir le portail SPRAT",
    spratStep1: "Cliquez sur \"Ouvrir le portail SPRAT\" pour accéder à la page de vérification",
    spratVerificationExplanation: "Les employeurs exigent que le statut de certification SPRAT soit vérifié pour assurer la conformité aux réglementations de sécurité et aux exigences d'assurance.",
    privacyNotice: "Avis de confidentialité",
    privacyText: "Vos informations personnelles sont stockées en toute sécurité et utilisées uniquement par votre employeur à des fins de RH et de paie. Nous ne partageons jamais vos données à l'externe.",
    errorNameRequired: "Le nom est requis",
    errorInvalidEmail: "Courriel invalide",
    errorPhoneRequired: "Le téléphone est requis",
    errorEmergencyNameRequired: "Le nom du contact d'urgence est requis",
    errorEmergencyPhoneRequired: "Le téléphone du contact d'urgence est requis",
    teamInvitations: "Invitations d'équipe",
    pendingInvitations: "Invitations en attente",
    noInvitations: "Aucune invitation en attente",
    noInvitationsDesc: "Lorsqu'une entreprise vous invite à rejoindre son équipe, cela apparaîtra ici.",
    invitedBy: "Invitation de",
    acceptInvitation: "Accepter",
    declineInvitation: "Refuser",
    acceptingInvitation: "Acceptation...",
    decliningInvitation: "Refus...",
    invitationAccepted: "Invitation acceptée",
    welcomeToTeam: "Bienvenue dans l'équipe!",
    invitationDeclined: "Invitation refusée",
    declinedMessage: "Vous avez refusé cette invitation.",
    invitationError: "Erreur",
    invitationMessage: "Message",
    invitedOn: "Invité le",
    currentEmployer: "Employeur actuel",
    currentlyEmployedBy: "Vous êtes actuellement employé par",
    leaveCompany: "Quitter l'entreprise",
    leavingCompany: "Départ en cours...",
    leaveCompanyConfirm: "Êtes-vous sûr de vouloir quitter cette entreprise?",
    leaveCompanyWarning: "Cela vous retirera de leur liste active. Vous pouvez toujours être invité par d'autres entreprises.",
    confirmLeave: "Oui, quitter l'entreprise",
    cancelLeave: "Annuler",
    leftCompany: "Entreprise quittée",
    leftCompanyDesc: "Vous avez quitté l'entreprise avec succès. Vous pouvez maintenant accepter des invitations d'autres entreprises.",
    leaveError: "Erreur",
    yourCompensation: "Votre rémunération",
    year: "an",
    hour: "h",
    goToWorkDashboard: "Accéder au tableau de bord",
    accessProjects: "Accéder aux projets, pointage et formulaires de sécurité",
    dashboardDisabledNoCompany: "Vous devez être lié à une entreprise pour accéder au tableau de bord. Acceptez une invitation ci-dessous pour commencer.",
    dashboardDisabledTerminated: "Votre emploi a été résilié. Acceptez une nouvelle invitation pour accéder au tableau de bord.",
    selectEmployer: "Sélectionner l'employeur",
    selectEmployerDesc: "Choisissez le tableau de bord de l'employeur à accéder",
    connectedEmployers: "Employeurs connectés",
    primaryEmployer: "Principal",
    suspended: "Suspendu",
    active: "Actif",
    setPrimary: "Définir comme principal",
    continueToEmployer: "Continuer",
    noEmployersConnected: "Aucun employeur connecté",
    myLoggedHours: "Mes heures enregistrées",
    viewLoggedHoursDesc: "Suivez votre progression de carrière en accès sur corde",
    viewLoggedHours: "Voir les heures enregistrées",
    loggedHoursFeatures: "Numérisez vos pages de carnet avec l'IA ou ajoutez manuellement vos heures précédentes",
    totalHoursLogged: "Total des heures enregistrées",
    hoursLogged: "heures enregistrées",
    totalHoursLabel: "heures totales",
    baselinePlus: "base +",
    fromSessions: "des sessions",
    workSessions: "Sessions de travail",
    previousHours: "Heures précédentes",
    previousHoursDesc: "Heures de travail avant de rejoindre cette plateforme (non comptabilisées dans les totaux)",
    addPreviousHours: "Ajouter des heures précédentes",
    noLoggedHours: "Aucune heure enregistrée",
    noLoggedHoursDesc: "Vos sessions de travail apparaîtront ici après vos pointages.",
    noPreviousHours: "Aucune heure précédente enregistrée",
    noPreviousHoursDesc: "Ajoutez des expériences de travail historiques qui ne seront pas comptabilisées dans vos totaux de certification.",
    dateRange: "Période",
    to: "au",
    building: "Bâtiment",
    buildingName: "Nom du bâtiment",
    buildingAddress: "Adresse du bâtiment",
    buildingHeight: "Hauteur du bâtiment",
    heightPlaceholder: "ex: 25 étages, 100m",
    tasksPerformed: "Tâches effectuées",
    selectTasks: "Sélectionner les tâches effectuées",
    hoursWorked: "Heures travaillées",
    previousEmployer: "Employeur précédent",
    previousEmployerPlaceholder: "Nom de l'entreprise (facultatif)",
    notes: "Notes",
    notesPlaceholder: "Détails supplémentaires (facultatif)",
    startDate: "Date de début",
    endDate: "Date de fin",
    savePreviousHours: "Enregistrer les heures précédentes",
    savingHours: "Enregistrement...",
    previousHoursAdded: "Heures précédentes ajoutées",
    previousHoursAddedDesc: "Votre expérience de travail précédente a été enregistrée.",
    previousHoursDeleted: "Heures précédentes supprimées",
    previousHoursDeletedDesc: "L'entrée des heures précédentes a été supprimée.",
    deletePreviousHours: "Supprimer",
    confirmDeletePreviousHours: "Êtes-vous sûr de vouloir supprimer cette entrée d'heures précédentes ?",
    deleteConfirm: "Supprimer",
    cancelDelete: "Annuler",
    logbookDisclaimer: "Ceci est un outil de suivi personnel uniquement. Vous devez toujours enregistrer toutes vos heures dans votre carnet irata/SPRAT officiel - ce journal numérique ne le remplace pas.",
    jobBoard: "Offres d'emploi",
    jobBoardDesc: "Parcourir les opportunites et rendre votre profil visible aux employeurs",
    browseJobs: "Parcourir les offres",
    yourReferralCode: "Votre code de parrainage",
    shareReferralCode: "Partagez ce code avec d'autres techniciens pour les inviter sur OnRopePro",
    referralPremiumBenefit: "Vous obtiendrez un accès PLUS lorsque votre code sera utilisé!",
    viewPlusBenefits: "Voir les avantages PLUS",
    plusBenefitsTitle: "Avantages PLUS",
    plusBenefit1: "Connexions employeurs illimitées",
    plusBenefit2: "Journalisation détaillée des tâches améliorée",
    plusBenefit3: "Historique de travail exportable (PDF/CSV)",
    plusBenefit4: "Analytique de l'historique de travail",
    plusBenefit5: "Alertes d'expiration de certification à 60 jours",
    plusBenefit6: "Visibilité du profil d'entreprise de travaux sur cordes (opt-in)",
    plusUnlockInfo: "Débloquer: Parrainez 1 technicien vérifié qui complète la création de son compte",
    plusLockedFeature: "Fonctionnalité PLUS",
    plusLockedDesc: "Parrainez un technicien pour débloquer",
    copyCode: "Copier le code",
    codeCopied: "Copié!",
    referredTimes: "Parrainé {count} technicien(s)",
    yourReferrals: "Vos parrainages",
    noReferralsYet: "Pas encore de parrainages. Partagez votre code pour commencer!",
    joinedOn: "Inscrit le",
    noReferralCodeYet: "Pas encore de code de parrainage",
    editExpirationDate: "Modifier la date d'expiration",
    setExpirationDate: "Définir la date d'expiration",
    expirationDateUpdated: "Date d'expiration mise à jour",
    expirationDateUpdateFailed: "Échec de la mise à jour de la date d'expiration",
    selectDate: "Sélectionner une date",
    setExperience: "Définir l'expérience",
    editExperience: "Modifier l'expérience",
    experienceUpdated: "Date de début d'expérience mise à jour",
    experienceUpdateFailed: "Échec de la mise à jour de la date d'expérience",
    whenDidYouStart: "Quand avez-vous commencé votre carrière d'accès sur corde?",
    addExperience: "Ajouter votre date de début d'expérience",
    referralCodeGenerating: "Votre code de parrainage sera généré lorsque vous terminerez l'inscription",
    // Safety Rating
    performanceSafetyRating: "Évaluation Sécurité",
    overallScore: "Score Global",
    harnessCompliance: "Inspections Harnais",
    documentCompliance: "Documents Signés",
    sessionsAnalyzed: "Sessions Analysées",
    noPerformanceData: "Aucune donnée de performance",
    noPerformanceDataDesc: "Complétez des sessions de travail pour voir votre évaluation",
    ratingExcellent: "Excellent",
    ratingGood: "Bon",
    ratingNeedsImprovement: "À Améliorer",
    ratingPoor: "Faible",
    dropsExceeded: "Objectif Dépassé",
    dropsOnTarget: "Sur Cible",
    dropsBelowTarget: "Sous l'Objectif",
    dropsNa: "N/A",
    harnessYes: "Inspection Faite",
    harnessNo: "Pas d'Inspection",
    sessionRating: "Note de Session",
    improvementNeeded: "Points à améliorer:",
    improveHarness: "Effectuer l'inspection du harnais avant de pointer",
    improveDocs: "Signer tous les documents de sécurité assignés",
    // Feedback
    feedback: "Commentaires",
    feedbackDesc: "Partagez vos suggestions ou signalez des problèmes à l'équipe OnRopePro",
    sendFeedback: "Envoyer des commentaires",
    feedbackTitle: "Titre",
    feedbackTitlePlaceholder: "Résumé bref de vos commentaires",
    feedbackCategory: "Catégorie",
    feedbackCategoryFeature: "Nouvelle fonctionnalité",
    feedbackCategoryImprovement: "Amélioration",
    feedbackCategoryBug: "Rapport de bogue",
    feedbackCategoryOther: "Autre",
    feedbackDescription: "Description",
    feedbackDescriptionPlaceholder: "Veuillez décrire vos commentaires en détail...",
    feedbackPriority: "Priorité",
    feedbackPriorityLow: "Faible",
    feedbackPriorityNormal: "Normale",
    feedbackPriorityHigh: "Haute",
    feedbackPriorityUrgent: "Urgente",
    feedbackScreenshot: "Capture d'écran (Optionnel)",
    feedbackScreenshotAdd: "Ajouter une capture d'écran",
    feedbackSubmit: "Soumettre les commentaires",
    feedbackSubmitting: "Soumission...",
    feedbackSuccess: "Merci!",
    feedbackSuccessDesc: "Vos commentaires ont été soumis. Nous apprécions votre contribution et les examinerons attentivement.",
    feedbackError: "Échec de la soumission des commentaires",
    viewMyFeedback: "Voir mes commentaires",
    myFeedbackTitle: "Mes commentaires",
    tabHome: "Accueil",
    tabProfile: "Profil",
    tabEmployer: "Vue Employeur",
    tabWork: "Travail",
    tabMore: "Plus",
    employerProfileTitle: "Ce que voient les employeurs",
    employerProfileDesc: "Voici comment votre profil apparaît aux employeurs potentiels.",
    editEmployerProfile: "Modifier",
    saveEmployerProfile: "Sauvegarder",
    cancelEdit: "Annuler",
    visibilityStatus: "Statut de visibilité",
    visibleToEmployers: "Visible aux employeurs",
    hiddenFromEmployers: "Caché des employeurs",
    makeVisible: "Rendre visible",
    makeHidden: "Cacher le profil",
    yourSpecialties: "Vos spécialités",
    addYourFirstSpecialty: "Ajoutez votre première spécialité pour apparaître dans les recherches",
    backToHome: "Retour à l'accueil",
    quickActions: "Actions rapides",
    myFeedbackDesc: "Consultez vos commentaires soumis et les réponses de OnRopePro",
    noFeedbackYet: "Vous n'avez pas encore soumis de commentaires",
    feedbackStatus: "Statut",
    feedbackResponses: "Réponses",
    fromTeam: "Équipe OnRopePro",
    fromYou: "Vous",
    replyToFeedback: "Répondre",
    sendReply: "Envoyer la réponse",
    replyPlaceholder: "Tapez votre réponse...",
    newResponse: "Nouvelle réponse",
  }
};

const createProfileSchema = (t: typeof translations['en']) => z.object({
  name: z.string().min(1, t.errorNameRequired),
  email: z.string().email(t.errorInvalidEmail),
  employeePhoneNumber: z.string().min(1, t.errorPhoneRequired),
  employeeStreetAddress: z.string().optional(),
  employeeCity: z.string().optional(),
  employeeProvinceState: z.string().optional(),
  employeeCountry: z.string().optional(),
  employeePostalCode: z.string().optional(),
  emergencyContactName: z.string().min(1, t.errorEmergencyNameRequired),
  emergencyContactPhone: z.string().min(1, t.errorEmergencyPhoneRequired),
  emergencyContactRelationship: z.string().optional(),
  socialInsuranceNumber: z.string().optional(),
  bankTransitNumber: z.string().optional(),
  bankInstitutionNumber: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseExpiry: z.string().optional(),
  birthday: z.string().optional(),
  specialMedicalConditions: z.string().optional(),
  irataBaselineHours: z.string().optional(),
  ropeAccessStartDate: z.string().optional(),
  ropeAccessSpecialties: z.array(z.string()).optional(),
});

type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;

export default function TechnicianPortal() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [specialtyCategory, setSpecialtyCategory] = useState<JobCategory | "">("");
  const [selectedSpecialtyJobType, setSelectedSpecialtyJobType] = useState<string>("");
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('techPortalLanguage');
    return (saved === 'fr' ? 'fr' : 'en') as Language;
  });
  
  const t = translations[language];
  const profileSchema = useMemo(() => createProfileSchema(t), [t]);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    verification?: {
      isValid: boolean;
      technicianName: string | null;
      irataNumber: string | null;
      irataLevel: number | null;
      expiryDate: string | null;
      status: string | null;
      confidence: string;
      error: string | null;
    };
    message: string;
  } | null>(null);
  const [isVerifyingSprat, setIsVerifyingSprat] = useState(false);
  const [spratVerificationResult, setSpratVerificationResult] = useState<{
    success: boolean;
    verification?: {
      isValid: boolean;
      technicianName: string | null;
      spratNumber: string | null;
      spratLevel: number | null;
      expiryDate: string | null;
      status: string | null;
      confidence: string;
      error: string | null;
    };
    message: string;
  } | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const spratScreenshotInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  // Use a ref to store the doc type immediately (refs are synchronous, state is async)
  const uploadingDocTypeRef = useRef<string | null>(null);

  const { data: userData, isLoading } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      employeePhoneNumber: "",
      employeeStreetAddress: "",
      employeeCity: "",
      employeeProvinceState: "",
      employeeCountry: "",
      employeePostalCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      socialInsuranceNumber: "",
      bankTransitNumber: "",
      bankInstitutionNumber: "",
      bankAccountNumber: "",
      driversLicenseNumber: "",
      driversLicenseExpiry: "",
      birthday: "",
      specialMedicalConditions: "",
      irataBaselineHours: "",
      ropeAccessStartDate: "",
      ropeAccessSpecialties: [],
    },
  });

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    localStorage.setItem('techPortalLanguage', newLang);
  };

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("PATCH", "/api/technician/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: t.profileUpdated,
        description: t.changesSaved,
      });
    },
    onError: (error: any) => {
      toast({
        title: t.updateFailed,
        description: error.message || t.updateFailed,
        variant: "destructive",
      });
    },
  });

  const [processingInvitationId, setProcessingInvitationId] = useState<string | null>(null);
  
  // Expiration date editing state
  const [editingExpirationDate, setEditingExpirationDate] = useState<'irata' | 'sprat' | null>(null);
  const [expirationDateValue, setExpirationDateValue] = useState<string>("");
  
  // Experience start date editing state
  const [editingExperience, setEditingExperience] = useState(false);
  const [experienceStartDateValue, setExperienceStartDateValue] = useState<string>("");

  // Mutation for updating expiration date (uses dedicated endpoint)
  const updateExpirationDateMutation = useMutation({
    mutationFn: async ({ type, date }: { type: 'irata' | 'sprat'; date: string }) => {
      return apiRequest("PATCH", "/api/technician/expiration-date", { type, date });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setEditingExpirationDate(null);
      setExpirationDateValue("");
      toast({
        title: t.expirationDateUpdated,
        description: editingExpirationDate?.toUpperCase() + " " + t.expirationDateUpdated.toLowerCase(),
      });
    },
    onError: (error: any) => {
      toast({
        title: t.expirationDateUpdateFailed,
        description: error.message || t.expirationDateUpdateFailed,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating experience start date (uses dedicated endpoint)
  const updateExperienceMutation = useMutation({
    mutationFn: async (date: string) => {
      return apiRequest("PATCH", "/api/technician/experience-date", { date });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setEditingExperience(false);
      setExperienceStartDateValue("");
      toast({
        title: t.experienceUpdated,
      });
    },
    onError: (error: any) => {
      toast({
        title: t.experienceUpdateFailed,
        description: error.message || t.experienceUpdateFailed,
        variant: "destructive",
      });
    },
  });

  const { data: invitationsData } = useQuery<{
    invitations: Array<{
      id: string;
      message: string | null;
      createdAt: string;
      company: {
        id: string;
        name: string;
        email: string;
      };
    }>;
  }>({
    queryKey: ["/api/my-invitations"],
    // Fetch invitations for: unlinked technicians, terminated technicians, or PLUS technicians (can connect to multiple employers)
    enabled: !!user && user.role === 'rope_access_tech' && (!user.companyId || !!user.terminatedDate || !!user.hasPlusAccess),
  });

  const pendingInvitations = invitationsData?.invitations || [];

  // Fetch logged hours for display on portal
  const { data: loggedHoursData } = useQuery<{ logs: Array<{ hoursWorked: string }> }>({
    queryKey: ["/api/my-irata-task-logs"],
    enabled: !!user && (user.role === 'rope_access_tech' || user.role === 'company'),
  });
  
  // Fetch referral count for the technician
  const { data: referralCountData } = useQuery<{ count: number }>({
    queryKey: ["/api/my-referral-count"],
    enabled: !!user && (user.role === 'rope_access_tech' || user.role === 'company'),
  });

  // Fetch list of referred users
  const { data: referralsData } = useQuery<{
    referrals: Array<{
      id: string;
      name: string | null;
      email: string | null;
      createdAt: string | null;
      role: string;
    }>;
  }>({
    queryKey: ["/api/my-referrals"],
    enabled: !!user && (user.role === 'rope_access_tech' || user.role === 'company'),
  });
  
  // Fetch performance metrics for the technician
  const { data: performanceData } = useQuery<{
    metrics: Array<{
      sessionId: string;
      projectId: string;
      workDate: string;
      totalDrops: number;
      dailyDropTarget: number | null;
      dropPerformance: number;
      dropRating: 'exceeded' | 'on_target' | 'below_target' | 'na';
      hoursWorked: number;
      hoursRating: 'excellent' | 'good' | 'short' | 'na';
      harnessInspectionDone: boolean;
      documentCompliance: number;
      overallScore: number;
      overallRating: 'excellent' | 'good' | 'needs_improvement' | 'poor';
    }>;
    summary: {
      totalSessions: number;
      averageScore: number;
      harnessCompliance: number;
      documentCompliance: number;
      overallRating: 'excellent' | 'good' | 'needs_improvement' | 'poor' | 'no_data';
    };
  }>({
    queryKey: ["/api/my-performance-metrics"],
    enabled: !!user && (user.role === 'rope_access_tech' || user.role === 'company'),
  });
  
  // State for copy button
  const [codeCopied, setCodeCopied] = useState(false);
  
  // State for PLUS benefits dialog
  const [showPlusBenefits, setShowPlusBenefits] = useState(false);
  
  // Mobile-friendly tab navigation
  type TabType = 'home' | 'profile' | 'employer' | 'work' | 'more';
  const [activeTab, setActiveTab] = useState<TabType>('home');
  
  // State for editing employer profile specialties
  const [isEditingEmployerProfile, setIsEditingEmployerProfile] = useState(false);
  
  // Feedback state
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("improvement");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [feedbackPriority, setFeedbackPriority] = useState("normal");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [showMyFeedbackDialog, setShowMyFeedbackDialog] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [feedbackReply, setFeedbackReply] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  // Query for user's feedback
  const { data: myFeedbackData, refetch: refetchMyFeedback } = useQuery<{
    requests: Array<{
      id: string;
      title: string;
      description: string;
      category: string;
      priority: string;
      status: string;
      createdAt: string;
      messages: Array<{
        id: string;
        message: string;
        senderRole: string;
        createdAt: string;
        readAt: string | null;
      }>;
      unreadCount: number;
    }>;
  }>({
    queryKey: ["/api/my-feedback"],
    enabled: !!user,
  });
  
  const totalUnreadFeedback = myFeedbackData?.requests?.reduce((sum, r) => sum + r.unreadCount, 0) ?? 0;
  
  // Mark all feedback as read when the dialog opens
  useEffect(() => {
    const markAllAsRead = async () => {
      if (showMyFeedbackDialog && myFeedbackData?.requests) {
        const unreadRequests = myFeedbackData.requests.filter(r => r.unreadCount > 0);
        if (unreadRequests.length > 0) {
          try {
            await Promise.all(unreadRequests.map(feedback => 
              fetch(`/api/my-feedback/${feedback.id}/mark-read`, {
                method: 'POST',
                credentials: 'include',
              })
            ));
            refetchMyFeedback();
          } catch (error) {
            console.error('Failed to mark feedback as read:', error);
          }
        }
      }
    };
    markAllAsRead();
  }, [showMyFeedbackDialog, myFeedbackData?.requests?.length]);
  
  // Employer selection state (for PLUS members with multiple employers)
  const [showEmployerSelectDialog, setShowEmployerSelectDialog] = useState(false);
  const [showReferralInfoDialog, setShowReferralInfoDialog] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(null);
  
  // Query for employer connections (for PLUS members)
  type EmployerConnection = {
    id: string;
    companyId: string;
    isPrimary: boolean;
    status: string;
    connectedAt: Date | string;
    company: {
      id: string;
      name: string;
      companyName: string | null;
      photoUrl: string | null;
    } | null;
  };
  
  const { data: employerConnectionsData } = useQuery<{
    connections: EmployerConnection[];
    hasPlusAccess: boolean;
    canAddMore: boolean;
  }>({
    queryKey: ["/api/my-employer-connections"],
    enabled: !!user && user.role === 'rope_access_tech',
  });
  
  const hasMultipleEmployers = (employerConnectionsData?.connections?.length ?? 0) > 1;
  
  // Handle copy referral code
  const handleCopyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCodeCopied(true);
      toast({
        title: t.codeCopied,
        description: `${user.referralCode} (${user.referralCode.length} characters)`,
      });
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };
  
  // Calculate work session hours from task logs
  const workSessionHours = useMemo(() => {
    if (!loggedHoursData?.logs) return 0;
    return loggedHoursData.logs.reduce((sum, log) => sum + parseFloat(log.hoursWorked || "0"), 0);
  }, [loggedHoursData]);
  
  // Get baseline hours from user profile
  const baselineHours = useMemo(() => {
    if (!user?.irataBaselineHours) return 0;
    return parseFloat(user.irataBaselineHours) || 0;
  }, [user?.irataBaselineHours]);
  
  // Combined total = baseline + work sessions
  const combinedTotalHours = baselineHours + workSessionHours;

  // Calculate profile completion - includes fields already filled during registration
  const profileCompletion = useMemo(() => {
    if (!user) return { percentage: 0, incompleteFields: [], isComplete: false };
    
    const profileFields = [
      // Fields typically filled during registration
      { label: language === 'en' ? 'Full Name' : 'Nom complet', complete: !!user.name },
      { label: language === 'en' ? 'Email' : 'Courriel', complete: !!user.email },
      { label: language === 'en' ? 'Phone Number' : 'Numéro de téléphone', complete: !!user.phone },
      { label: language === 'en' ? 'irata/SPRAT Cert' : 'Certification irata/SPRAT', complete: !!user.irataLicenseNumber || !!user.spratLicenseNumber },
      // Additional profile fields
      { label: language === 'en' ? 'Emergency Contact' : 'Contact d\'urgence', complete: !!user.emergencyContactName && !!user.emergencyContactPhone },
      { label: language === 'en' ? 'Banking Info' : 'Info bancaire', complete: !!user.bankAccountNumber },
      { label: language === 'en' ? 'Birthday' : 'Date de naissance', complete: !!user.birthday },
      { label: language === 'en' ? 'First Aid' : 'Premiers soins', complete: !!user.hasFirstAid },
      { label: language === 'en' ? 'Driver\'s License' : 'Permis de conduire', complete: !!user.driversLicenseNumber },
      { label: language === 'en' ? 'Address' : 'Adresse', complete: !!user.streetAddress },
      // Employer-visible profile fields
      { label: language === 'en' ? 'Specialties' : 'Spécialités', complete: !!(user.ropeAccessSpecialties && user.ropeAccessSpecialties.length > 0) },
    ];
    
    const completedCount = profileFields.filter(f => f.complete).length;
    const totalFields = profileFields.length;
    const percentage = Math.round((completedCount / totalFields) * 100);
    const incompleteFields = profileFields.filter(f => !f.complete);
    
    return {
      percentage,
      incompleteFields,
      isComplete: percentage === 100,
      completedCount,
      totalFields
    };
  }, [user, language]);

  const acceptInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      setProcessingInvitationId(invitationId);
      const response = await fetch(`/api/invitations/${invitationId}/accept`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to accept invitation");
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t.invitationAccepted,
        description: data.message || t.welcomeToTeam,
      });
      setProcessingInvitationId(null);
    },
    onError: (error: any) => {
      toast({
        title: t.invitationError,
        description: error.message,
        variant: "destructive",
      });
      setProcessingInvitationId(null);
    },
  });

  const declineInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      setProcessingInvitationId(invitationId);
      const response = await fetch(`/api/invitations/${invitationId}/decline`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to decline invitation");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-invitations"] });
      toast({
        title: t.invitationDeclined,
        description: t.declinedMessage,
      });
      setProcessingInvitationId(null);
    },
    onError: (error: any) => {
      toast({
        title: t.invitationError,
        description: error.message,
        variant: "destructive",
      });
      setProcessingInvitationId(null);
    },
  });

  const leaveCompanyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/technician/leave-company");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t.leftCompany,
        description: t.leftCompanyDesc,
      });
    },
    onError: (error: any) => {
      toast({
        title: t.leaveError,
        description: error.message || "Failed to leave company",
        variant: "destructive",
      });
    },
  });

  // Mutation to generate referral code for users who don't have one
  const generateReferralCodeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/user/generate-referral-code");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      console.error("Failed to generate referral code:", error);
    },
  });

  // Auto-generate referral code if user doesn't have one
  useEffect(() => {
    if (user && !user.referralCode && !generateReferralCodeMutation.isPending) {
      generateReferralCodeMutation.mutate();
    }
  }, [user?.id, user?.referralCode]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      queryClient.clear();
      setLocation("/technician-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    if (!feedbackTitle.trim() || !feedbackDescription.trim()) {
      toast({
        title: language === 'en' ? "Missing Information" : "Information manquante",
        description: language === 'en' ? "Please fill in all required fields" : "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingFeedback(true);
    try {
      const response = await fetch('/api/feature-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: feedbackTitle,
          category: feedbackCategory,
          description: feedbackDescription,
          priority: feedbackPriority,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      setShowFeedbackDialog(false);
      setFeedbackTitle("");
      setFeedbackCategory("improvement");
      setFeedbackDescription("");
      setFeedbackPriority("normal");
      setShowFeedbackSuccess(true);
    } catch (error) {
      toast({
        title: t.feedbackError,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleScreenshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: t.invalidFile,
        description: t.uploadImageFile,
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const formData = new FormData();
      formData.append('screenshot', file);

      const response = await fetch('/api/verify-irata-screenshot', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t.verificationFailed);
      }

      setVerificationResult(result);
      
      if (result.success) {
        toast({
          title: t.verificationSuccessful,
          description: t.irataVerified,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      } else {
        toast({
          title: t.verificationIssue,
          description: result.message || t.couldNotVerify,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: t.verificationFailed,
        description: error.message || t.failedToAnalyze,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
      if (screenshotInputRef.current) {
        screenshotInputRef.current.value = '';
      }
    }
  };

  const handleSpratScreenshotUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: t.invalidFile,
        description: t.uploadImageFile,
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingSprat(true);
    setSpratVerificationResult(null);

    try {
      const formData = new FormData();
      formData.append('screenshot', file);

      const response = await fetch('/api/verify-sprat-screenshot', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t.verificationFailed);
      }

      setSpratVerificationResult(result);
      
      if (result.success) {
        toast({
          title: t.verificationSuccessful,
          description: t.spratVerified,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      } else {
        toast({
          title: t.verificationIssue,
          description: result.message || t.couldNotVerify,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: t.verificationFailed,
        description: error.message || t.failedToAnalyze,
        variant: "destructive",
      });
    } finally {
      setIsVerifyingSprat(false);
      if (spratScreenshotInputRef.current) {
        spratScreenshotInputRef.current.value = '';
      }
    }
  };

  // Handler for uploading documents (void cheque, driver's license, etc.)
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Use the ref value which is synchronously updated (state may not have updated yet)
    const docType = uploadingDocTypeRef.current;
    console.log('[TechnicianPortal] handleDocumentUpload called:', { file: file?.name, docType, stateValue: uploadingDocType });
    
    if (!file) {
      console.log('[TechnicianPortal] No file selected');
      return;
    }
    
    if (!docType) {
      toast({
        title: "Upload Error",
        description: "Document type not set. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
    if (!isValidType) {
      toast({
        title: t.invalidFile,
        description: t.uploadImageFile,
        variant: "destructive",
      });
      setUploadingDocType(null);
      uploadingDocTypeRef.current = null;
      return;
    }

    // Show that we're starting the upload
    toast({
      title: "Uploading...",
      description: `Uploading ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', docType);

      console.log('[TechnicianPortal] Sending upload request to server for docType:', docType);
      const response = await fetch('/api/technician/upload-document', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();
      console.log('[TechnicianPortal] Server response:', response.ok, result);

      if (!response.ok) {
        throw new Error(result.message || t.uploadFailed);
      }

      toast({
        title: t.documentUploaded,
        description: t.documentUploadedDesc,
      });
      console.log('[TechnicianPortal] Invalidating query cache...');
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    } catch (error: any) {
      toast({
        title: t.uploadFailed,
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploadingDocType(null);
      uploadingDocTypeRef.current = null;
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    }
  };

  // Trigger document upload for a specific type
  const triggerDocumentUpload = (docType: string) => {
    console.log('[TechnicianPortal] triggerDocumentUpload called:', docType);
    
    // Set the ref FIRST (synchronous) before state (async)
    uploadingDocTypeRef.current = docType;
    setUploadingDocType(docType);
    
    // Check if ref exists
    if (!documentInputRef.current) {
      toast({
        title: "Upload Error",
        description: "File input not found. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    // Reset the input value first to ensure onChange fires even if same file is selected
    documentInputRef.current.value = '';
    
    // Handle case where user cancels the file dialog
    // When the file dialog is closed, window regains focus
    // Use a longer timeout to ensure onChange has time to fire first
    const handleDialogClose = () => {
      // Use a longer delay (1 second) to allow the change event to fire first
      // Only reset the STATE (for UI), NOT the ref (which onChange needs)
      setTimeout(() => {
        if (documentInputRef.current && !documentInputRef.current.files?.length) {
          console.log('[TechnicianPortal] No file selected after dialog close, resetting state only');
          setUploadingDocType(null);
          // Don't reset the ref here - let handleDocumentUpload do it after processing
        }
      }, 1000);
      window.removeEventListener('focus', handleDialogClose);
    };
    
    window.addEventListener('focus', handleDialogClose);
    console.log('[TechnicianPortal] About to click file input:', documentInputRef.current);
    documentInputRef.current.click();
    console.log('[TechnicianPortal] File input clicked');
  };

  const startEditing = () => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        employeePhoneNumber: user.employeePhoneNumber || "",
        employeeStreetAddress: user.employeeStreetAddress || "",
        employeeCity: user.employeeCity || "",
        employeeProvinceState: user.employeeProvinceState || "",
        employeeCountry: user.employeeCountry || "",
        employeePostalCode: user.employeePostalCode || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
        emergencyContactRelationship: user.emergencyContactRelationship || "",
        socialInsuranceNumber: user.socialInsuranceNumber || "",
        bankTransitNumber: user.bankTransitNumber || "",
        bankInstitutionNumber: user.bankInstitutionNumber || "",
        bankAccountNumber: user.bankAccountNumber || "",
        driversLicenseNumber: user.driversLicenseNumber || "",
        driversLicenseExpiry: user.driversLicenseExpiry || "",
        birthday: user.birthday || "",
        specialMedicalConditions: user.specialMedicalConditions || "",
        irataBaselineHours: user.irataBaselineHours || "",
        ropeAccessStartDate: user.ropeAccessStartDate || "",
        ropeAccessSpecialties: user.ropeAccessSpecialties || [],
      });
    }
    setIsEditing(true);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">{t.loadingProfile}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">{t.pleaseLogin}</p>
            <Button onClick={() => setLocation("/technician-login")}>
              {t.goToLogin}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={onRopeProLogo} 
              alt="OnRopePro" 
              className="h-8 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm">{t.technicianPortal}</h1>
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-muted-foreground">{user.name}</p>
                {/* PLUS Badge - Only shown for technicians with PLUS access */}
                {user.role === 'rope_access_tech' && user.hasPlusAccess && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="default" 
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-1.5 py-0 h-4 font-bold border-0" 
                        data-testid="badge-pro"
                      >
                        <Crown className="w-2.5 h-2.5 mr-0.5 fill-current" />
                        {t.proBadge}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t.proBadgeTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Referral Code in Top Bar */}
            {user?.referralCode && (
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
                <button
                  onClick={() => setShowReferralInfoDialog(true)}
                  className="text-xs text-muted-foreground cursor-pointer underline decoration-dotted underline-offset-2 hover:text-primary transition-colors"
                  data-testid="button-referral-info"
                >
                  {t.yourReferralCode}:
                </button>
                <span className="font-mono font-bold text-sm text-primary" data-testid="header-referral-code">
                  {user.referralCode}
                </span>
                <Button
                  variant={codeCopied ? "default" : "ghost"}
                  size="icon"
                  onClick={handleCopyReferralCode}
                  className="h-6 w-6"
                  data-testid="button-header-copy-code"
                >
                  {codeCopied ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            )}
            {/* Return to Dashboard button - Only show for company owners */}
            {user.role === 'company' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setLocation('/dashboard')}
                className="gap-1.5"
                data-testid="button-return-dashboard"
              >
                <span className="material-icons text-base">dashboard</span>
                <span className="hidden sm:inline">{language === 'en' ? 'Dashboard' : 'Tableau de bord'}</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-1.5"
              data-testid="button-toggle-language"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'FR' : 'EN'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              {t.signOut}
            </Button>
          </div>
        </div>
      </header>

      {/* Certification Expiry Warning Banner - Shows when cert expires within 30 days (PLUS feature) */}
      {(() => {
        const urgentCerts: { type: string; expiryDate: string }[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        if (user.irataExpirationDate) {
          try {
            const irataExpiry = parseLocalDate(user.irataExpirationDate);
            if (irataExpiry >= today && irataExpiry <= thirtyDaysFromNow) {
              urgentCerts.push({ type: 'irata', expiryDate: user.irataExpirationDate });
            }
          } catch (e) {}
        }
        
        if (user.spratExpirationDate) {
          try {
            const spratExpiry = parseLocalDate(user.spratExpirationDate);
            if (spratExpiry >= today && spratExpiry <= thirtyDaysFromNow) {
              urgentCerts.push({ type: 'SPRAT', expiryDate: user.spratExpirationDate });
            }
          } catch (e) {}
        }
        
        if (urgentCerts.length === 0) return null;
        
        // PLUS users see full warning, non-PLUS users see locked teaser
        if (!user.hasPlusAccess) {
          return (
            <div className="bg-amber-500/20 border-b border-amber-500/30" data-testid="banner-certification-expiry-locked">
              <div className="max-w-4xl mx-auto px-4 py-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      {t.certificationExpiryBannerTitle}
                      <Badge variant="secondary" className="gap-1">
                        <Star className="w-3 h-3" />
                        PLUS
                      </Badge>
                    </p>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">{t.plusLockedDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="bg-red-600 dark:bg-red-700 text-white" data-testid="banner-certification-expiry">
            <div className="max-w-4xl mx-auto px-4 py-3">
              <div className="flex items-center gap-3 flex-wrap">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{t.certificationExpiryBannerTitle}</p>
                  <div className="text-xs mt-0.5 space-y-0.5">
                    {urgentCerts.map((cert) => (
                      <p key={cert.type}>
                        {t.certificationExpiryBannerMessage
                          .replace('{cert}', cert.type)
                          .replace('{date}', formatLocalDate(cert.expiryDate))}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* HOME TAB - Quick actions and overview */}
        {activeTab === 'home' && (
          <>
            {/* Work Dashboard Quick Access */}
            {user && user.role === 'rope_access_tech' && (
              <Card className={user.companyId && !user.terminatedDate ? "border-primary bg-primary/5" : "border-muted bg-muted/30"}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${user.companyId && !user.terminatedDate ? "bg-primary/10" : "bg-muted"}`}>
                        <Briefcase className={`w-6 h-6 ${user.companyId && !user.terminatedDate ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${!user.companyId || user.terminatedDate ? "text-muted-foreground" : ""}`}>{t.goToWorkDashboard}</p>
                        <p className="text-sm text-muted-foreground">{t.accessProjects}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        if (hasMultipleEmployers) {
                          setShowEmployerSelectDialog(true);
                        } else {
                          setLocation("/dashboard");
                        }
                      }}
                      className="gap-2 h-12 text-base"
                      disabled={!user.companyId || !!user.terminatedDate}
                      data-testid="button-go-to-dashboard"
                    >
                      {t.goToWorkDashboard}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                  {(!user.companyId || user.terminatedDate) && (
                    <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                      {user.terminatedDate ? t.dashboardDisabledTerminated : t.dashboardDisabledNoCompany}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Profile Completion Widget on Home Tab - Show until complete */}
            {user && user.role === 'rope_access_tech' && !profileCompletion.isComplete && (
              <Card 
                className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 cursor-pointer hover-elevate" 
                onClick={() => setActiveTab('profile')}
                data-testid="card-profile-completion-home"
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                      <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm">
                          {language === 'en' ? 'Complete Your Profile' : 'Complétez votre profil'}
                        </h3>
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{profileCompletion.percentage}%</span>
                      </div>
                      <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2 mb-3">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all" 
                          style={{ width: `${profileCompletion.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {language === 'en' 
                          ? 'Complete your profile to connect with employers instantly' 
                          : 'Complétez votre profil pour vous connecter instantanément avec les employeurs'}
                      </p>
                      {profileCompletion.incompleteFields.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {profileCompletion.incompleteFields.slice(0, 3).map((field, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-background">
                              {field.label}
                            </Badge>
                          ))}
                          {profileCompletion.incompleteFields.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-background">
                              +{profileCompletion.incompleteFields.length - 3} {language === 'en' ? 'more' : 'de plus'}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLocation("/technician-job-board")}
                className="p-4 rounded-lg border bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover-elevate text-left"
                data-testid="quick-action-jobs"
              >
                <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
                <p className="font-medium text-sm">{t.jobBoard}</p>
                <p className="text-xs text-muted-foreground">{t.browseJobs}</p>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className="p-4 rounded-lg border bg-card hover-elevate text-left"
                data-testid="quick-action-profile"
              >
                <User className="w-8 h-8 text-primary mb-2" />
                <p className="font-medium text-sm">{t.tabProfile}</p>
                <p className="text-xs text-muted-foreground">{t.editProfile}</p>
              </button>
              
              <button
                onClick={() => {
                  if (totalUnreadFeedback > 0) {
                    setShowMyFeedbackDialog(true);
                  } else {
                    setShowFeedbackDialog(true);
                  }
                }}
                className="p-4 rounded-lg border bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover-elevate text-left relative"
                data-testid="quick-action-feedback"
              >
                <MessageSquare className="w-8 h-8 text-purple-500 mb-2" />
                <p className="font-medium text-sm">{t.feedback}</p>
                <p className="text-xs text-muted-foreground">
                  {totalUnreadFeedback > 0 ? t.viewMyFeedback : t.sendFeedback}
                </p>
                {totalUnreadFeedback > 0 && (
                  <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
                    {totalUnreadFeedback}
                  </Badge>
                )}
              </button>
              
              {/* My Logged Hours - Same style as other quick actions */}
              <button
                onClick={() => setLocation("/technician-logged-hours")}
                className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 hover-elevate text-left"
                data-testid="quick-action-logged-hours"
              >
                <Clock className="w-8 h-8 text-primary mb-2" />
                <p className="font-medium text-sm">{t.myLoggedHours}</p>
                <p className="text-xs text-muted-foreground">{t.viewLoggedHoursDesc}</p>
                {(combinedTotalHours > 0 || workSessionHours > 0) && (
                  <p className="text-sm font-bold text-primary mt-1" data-testid="text-home-total-logged-hours">
                    {combinedTotalHours.toFixed(1)} {t.totalHoursLabel}
                  </p>
                )}
              </button>
            </div>
          </>
        )}

        {/* EMPLOYER VIEW TAB - What employers see */}
        {activeTab === 'employer' && user && (
          <>
            {/* Back to Home button */}
            <Button
              variant="ghost"
              onClick={() => setActiveTab('home')}
              className="gap-2 -mt-2 mb-2"
              data-testid="button-back-to-home-employer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </Button>

            {/* Header with edit button - for technicians and company owners (who often work as techs) */}
            {(user.role === 'rope_access_tech' || user.role === 'company') && (
              <>
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/20">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{t.employerProfileTitle}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t.employerProfileDesc}</p>
                      </div>
                    </div>
                    {!isEditingEmployerProfile ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingEmployerProfile(true)}
                        data-testid="button-edit-employer-profile"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        {t.editEmployerProfile}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingEmployerProfile(false)}
                          data-testid="button-cancel-employer-edit"
                        >
                          {t.cancelEdit}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>

            {/* Visibility Status Card */}
            <Card className={user.isVisibleToEmployers ? "border-green-500/50 bg-green-500/5" : "border-amber-500/50 bg-amber-500/5"}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${user.isVisibleToEmployers ? "bg-green-500/20" : "bg-amber-500/20"}`}>
                      {user.isVisibleToEmployers ? (
                        <Eye className="w-5 h-5 text-green-500" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{t.visibilityStatus}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.isVisibleToEmployers ? t.visibleToEmployers : t.hiddenFromEmployers}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={user.isVisibleToEmployers || false}
                    onCheckedChange={async (checked) => {
                      try {
                        const response = await fetch("/api/technician/visibility", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          credentials: "include",
                          body: JSON.stringify({ isVisible: checked }),
                        });
                        if (!response.ok) throw new Error("Failed to update visibility");
                        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                        toast({
                          title: checked ? t.visibleToEmployers : t.hiddenFromEmployers,
                          description: checked 
                            ? (language === 'en' ? "Employers can now find you in the talent pool" : "Les employeurs peuvent maintenant vous trouver")
                            : (language === 'en' ? "Your profile is now hidden from employers" : "Votre profil est maintenant caché"),
                        });
                      } catch (error) {
                        toast({ title: "Error", description: "Failed to update visibility", variant: "destructive" });
                      }
                    }}
                    data-testid="switch-employer-visibility"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Profile Preview Card */}
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Basic Info */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20 border-2 border-primary/20">
                    {user.profilePhotoUrl ? (
                      <AvatarImage src={user.profilePhotoUrl} alt={user.name || ""} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      {user.hasPlusAccess && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-xs">
                          PLUS
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{user.city}{user.province ? `, ${user.province}` : ""}</p>
                    
                    {/* Experience */}
                    {user.ropeAccessStartDate && (
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {(() => {
                            const start = new Date(user.ropeAccessStartDate);
                            const now = new Date();
                            const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
                            const years = Math.floor(months / 12);
                            const remainingMonths = months % 12;
                            if (years > 0) {
                              return `${years} ${language === 'en' ? 'year(s)' : 'an(s)'}, ${remainingMonths} ${language === 'en' ? 'month(s)' : 'mois'}`;
                            }
                            return `${months} ${language === 'en' ? 'month(s)' : 'mois'}`;
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Certifications */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    {t.certifications}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.irataLicenseNumber && (
                      <Badge variant="secondary" className="gap-1">
                        irata Level {user.irataLevel || "?"} - {user.irataLicenseNumber}
                      </Badge>
                    )}
                    {user.spratLicenseNumber && (
                      <Badge variant="secondary" className="gap-1">
                        SPRAT Level {user.spratLevel || "?"} - {user.spratLicenseNumber}
                      </Badge>
                    )}
                    {user.hasFirstAid && (
                      <Badge variant="outline" className="gap-1">
                        <Heart className="w-3 h-3" /> {t.firstAid}
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Specialties Section - Editable */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-primary" />
                    {t.yourSpecialties}
                  </h4>
                  
                  {isEditingEmployerProfile ? (
                    <div className="space-y-4">
                      {/* Current specialties with remove button */}
                      <div className="flex flex-wrap gap-2">
                        {(user.ropeAccessSpecialties || []).map((specialty: string, index: number) => {
                          const jobType = JOB_TYPES.find(jt => jt.value === specialty);
                          return (
                            <Badge 
                              key={specialty} 
                              variant="secondary"
                              className="gap-1 pr-1"
                              data-testid={`badge-specialty-${index}`}
                            >
                              <HardHat className="w-3 h-3" />
                              {jobType?.label || specialty}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 ml-1 no-default-hover-elevate no-default-active-elevate"
                                onClick={async () => {
                                  const updated = (user.ropeAccessSpecialties || []).filter((s: string) => s !== specialty);
                                  try {
                                    const response = await fetch("/api/technician/specialties", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      credentials: "include",
                                      body: JSON.stringify({ specialties: updated }),
                                    });
                                    if (!response.ok) throw new Error("Failed to update");
                                    queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                                  } catch (error) {
                                    toast({ title: "Error", description: "Failed to remove specialty", variant: "destructive" });
                                  }
                                }}
                                data-testid={`button-remove-specialty-${index}`}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          );
                        })}
                        {(user.ropeAccessSpecialties || []).length === 0 && (
                          <p className="text-sm text-muted-foreground italic">{t.addYourFirstSpecialty}</p>
                        )}
                      </div>

                      {/* Add new specialty */}
                      <div className="flex flex-wrap gap-2 items-end">
                        <div className="flex-1 min-w-[120px]">
                          <Label className="text-xs">{t.selectCategory}</Label>
                          <select
                            className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
                            value={specialtyCategory}
                            onChange={(e) => {
                              setSpecialtyCategory(e.target.value as "" | "building_maintenance");
                              setSelectedSpecialtyJobType("");
                            }}
                            data-testid="select-specialty-category"
                          >
                            <option value="">{t.selectCategory}</option>
                            {JOB_CATEGORIES.map(cat => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                          </select>
                        </div>
                        {specialtyCategory && (
                          <div className="flex-1 min-w-[150px]">
                            <Label className="text-xs">{t.selectJobType}</Label>
                            <select
                              className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
                              value={selectedSpecialtyJobType}
                              onChange={(e) => setSelectedSpecialtyJobType(e.target.value)}
                              data-testid="select-specialty-job-type"
                            >
                              <option value="">{t.selectJobType}</option>
                              {getJobTypesByCategory(specialtyCategory)
                                .filter(jt => !jt.value.endsWith('_other') && !(user.ropeAccessSpecialties || []).includes(jt.value))
                                .map(jt => (
                                  <option key={jt.value} value={jt.value}>{jt.label}</option>
                                ))}
                            </select>
                          </div>
                        )}
                        <Button
                          size="sm"
                          disabled={!selectedSpecialtyJobType}
                          onClick={async () => {
                            if (selectedSpecialtyJobType) {
                              const current = user.ropeAccessSpecialties || [];
                              if (!current.includes(selectedSpecialtyJobType)) {
                                try {
                                  const response = await fetch("/api/technician/specialties", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    credentials: "include",
                                    body: JSON.stringify({ specialties: [...current, selectedSpecialtyJobType] }),
                                  });
                                  if (!response.ok) throw new Error("Failed to update");
                                  queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                                } catch (error) {
                                  toast({ title: "Error", description: "Failed to add specialty", variant: "destructive" });
                                }
                              }
                              setSelectedSpecialtyJobType("");
                            }
                          }}
                          data-testid="button-add-specialty"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {t.addSpecialty}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(user.ropeAccessSpecialties || []).length > 0 ? (
                        (user.ropeAccessSpecialties || []).map((specialty: string, index: number) => {
                          const jobType = JOB_TYPES.find(jt => jt.value === specialty);
                          return (
                            <Badge 
                              key={specialty} 
                              variant="secondary"
                              className="gap-1"
                              data-testid={`badge-specialty-view-${index}`}
                            >
                              <HardHat className="w-3 h-3" />
                              {jobType?.label || specialty}
                            </Badge>
                          );
                        })
                      ) : (
                        <div className="text-center w-full py-4">
                          <p className="text-sm text-muted-foreground italic mb-2">{t.addYourFirstSpecialty}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingEmployerProfile(true)}
                            data-testid="button-add-first-specialty"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {t.addSpecialty}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Resumes */}
                {user.resumeDocuments && user.resumeDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        {t.resume}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.resumeDocuments.filter((u: string) => u && u.trim()).map((doc: string, index: number) => (
                          <Badge key={index} variant="outline" className="gap-1">
                            <FileText className="w-3 h-3" />
                            Resume {index + 1}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
              </>
            )}
          </>
        )}
        
        {/* WORK TAB - Job board, invitations, employer */}
        {activeTab === 'work' && (
          <>
            {/* Back to Home button */}
            <Button
              variant="ghost"
              onClick={() => setActiveTab('home')}
              className="gap-2 -mt-2 mb-2"
              data-testid="button-back-to-home-work"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </Button>
            
            {/* Job Board Card */}
            {user && (
              <Card className="border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-blue-500/20">
                        <Briefcase className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">{t.jobBoard}</p>
                        <p className="text-sm text-muted-foreground">{t.jobBoardDesc}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setLocation("/technician-job-board")}
                      className="gap-2 bg-blue-600 hover:bg-blue-700 h-12"
                      data-testid="button-browse-jobs"
                    >
                      {t.browseJobs}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        
        {/* MORE TAB - Feedback, referral, settings */}
        {activeTab === 'more' && (
          <>
            {/* Back to Home button */}
            <Button
              variant="ghost"
              onClick={() => setActiveTab('home')}
              className="gap-2 -mt-2 mb-2"
              data-testid="button-back-to-home-more"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </Button>
            
            {/* Feedback Card */}
            {user && (
              <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-purple-500/20">
                        <MessageSquare className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium">{t.feedback}</p>
                        <p className="text-sm text-muted-foreground">{t.feedbackDesc}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowMyFeedbackDialog(true)}
                        className="gap-2 relative h-11"
                        data-testid="button-view-my-feedback"
                      >
                        <Mail className="w-4 h-4" />
                        {t.viewMyFeedback}
                        {totalUnreadFeedback > 0 && (
                          <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 min-w-5 text-xs">
                            {totalUnreadFeedback}
                          </Badge>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowFeedbackDialog(true)}
                        className="gap-2 h-11"
                        data-testid="button-send-feedback"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {t.sendFeedback}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Team Invitations Section - Show for unlinked technicians, self-resigned technicians, OR PLUS technicians (WORK TAB) */}
        {activeTab === 'work' && user && user.role === 'rope_access_tech' && (!user.companyId || user.terminatedDate || user.hasPlusAccess) && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t.teamInvitations}</CardTitle>
                  <CardDescription>{t.pendingInvitations}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingInvitations.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Building className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">{t.noInvitations}</p>
                  <p className="text-sm mt-1">{t.noInvitationsDesc}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="p-4 rounded-lg border bg-card shadow-sm"
                      data-testid={`invitation-card-${invitation.id}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-medium text-lg flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            {invitation.company.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t.invitedOn} {formatLocalDate(invitation.createdAt)}
                          </p>
                          {invitation.message && (
                            <div className="mt-2 p-3 bg-muted rounded-md">
                              <p className="text-sm">
                                <span className="font-medium">{t.invitationMessage}:</span> {invitation.message}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 sm:flex-shrink-0">
                          <Button
                            variant="outline"
                            size="default"
                            onClick={() => declineInvitationMutation.mutate(invitation.id)}
                            disabled={processingInvitationId === invitation.id}
                            className="flex-1 sm:flex-none gap-2"
                            data-testid={`button-decline-invitation-${invitation.id}`}
                          >
                            {processingInvitationId === invitation.id && declineInvitationMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t.decliningInvitation}
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                {t.declineInvitation}
                              </>
                            )}
                          </Button>
                          <Button
                            size="default"
                            onClick={() => acceptInvitationMutation.mutate(invitation.id)}
                            disabled={processingInvitationId === invitation.id}
                            className="flex-1 sm:flex-none gap-2"
                            data-testid={`button-accept-invitation-${invitation.id}`}
                          >
                            {processingInvitationId === invitation.id && acceptInvitationMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t.acceptingInvitation}
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                {t.acceptInvitation}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Your Referral Code Section - Show for technicians and company owners (MORE TAB) */}
        {activeTab === 'more' && user && (user.role === 'rope_access_tech' || user.role === 'company') && (
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Share2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t.yourReferralCode}</CardTitle>
                    <CardDescription>
                      {t.shareReferralCode}
                    </CardDescription>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        {t.referralPremiumBenefit}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto px-2 py-0.5 text-sm text-primary underline"
                        onClick={() => setShowPlusBenefits(true)}
                        data-testid="button-view-plus-benefits"
                      >
                        {t.viewPlusBenefits}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {user.referralCode ? (
                  <>
                    <div className="flex items-center gap-3 bg-background border-2 border-primary/40 rounded-lg px-4 py-3">
                      <span className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-primary" data-testid="text-referral-code">
                        {user.referralCode}
                      </span>
                      <Button
                        variant={codeCopied ? "default" : "outline"}
                        size="sm"
                        onClick={handleCopyReferralCode}
                        className="gap-2"
                        data-testid="button-copy-referral-code"
                      >
                        {codeCopied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            {t.codeCopied}
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            {t.copyCode}
                          </>
                        )}
                      </Button>
                    </div>
                    {(referralCountData?.count ?? 0) > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        <span data-testid="text-referral-count">
                          {t.referredTimes.replace('{count}', String(referralCountData?.count ?? 0))}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    {t.referralCodeGenerating}
                  </div>
                )}
              </div>

              {/* List of referred users */}
              {user.referralCode && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t.yourReferrals}
                  </h4>
                  {referralsData?.referrals && referralsData.referrals.length > 0 ? (
                    <div className="space-y-2">
                      {referralsData.referrals.map((referral) => (
                        <div
                          key={referral.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          data-testid={`referral-item-${referral.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{referral.name || referral.email || 'User'}</p>
                              <p className="text-xs text-muted-foreground">
                                {t.joinedOn} {referral.createdAt ? formatLocalDate(referral.createdAt) : '-'}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {referral.role === 'rope_access_tech' ? 'Technician' : 
                             referral.role === 'company' ? 'Company' : referral.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t.noReferralsYet}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Performance & Safety Rating Card - Show for technicians and company owners (HOME TAB) */}
        {activeTab === 'home' && user && (user.role === 'rope_access_tech' || user.role === 'company') && (
          <Card className="border-muted overflow-visible">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-400/20">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{t.performanceSafetyRating}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {performanceData?.summary?.totalSessions && performanceData.summary.totalSessions > 0 ? (
                <div className="space-y-4">
                  {/* Main Score Display */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-400/10 border border-amber-200/30 dark:border-amber-800/30">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-amber-600 dark:text-amber-400" data-testid="text-performance-score">
                        {performanceData.summary.averageScore}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.overallScore}</p>
                        <Badge 
                          variant={performanceData.summary.overallRating === 'excellent' ? 'default' : 
                                   performanceData.summary.overallRating === 'good' ? 'secondary' : 'destructive'}
                          className={performanceData.summary.overallRating === 'excellent' ? 
                            'bg-green-500 text-white' : 
                            performanceData.summary.overallRating === 'good' ? 
                            'bg-blue-500 text-white' : ''}
                          data-testid="badge-performance-rating"
                        >
                          {performanceData.summary.overallRating === 'excellent' ? t.ratingExcellent :
                           performanceData.summary.overallRating === 'good' ? t.ratingGood :
                           performanceData.summary.overallRating === 'needs_improvement' ? t.ratingNeedsImprovement :
                           t.ratingPoor}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Improvement hints - show when not excellent */}
                    {(performanceData.summary.overallRating === 'needs_improvement' || 
                      performanceData.summary.overallRating === 'poor') && 
                      (performanceData.summary.harnessCompliance < 80 || performanceData.summary.documentCompliance < 100) && (
                      <div className="mt-3 pt-3 border-t border-amber-200/30 dark:border-amber-800/30">
                        <p className="text-xs font-medium text-muted-foreground mb-1">{t.improvementNeeded}</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {performanceData.summary.harnessCompliance < 80 && (
                            <li className="flex items-center gap-1.5" data-testid="hint-harness">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              {t.improveHarness}
                            </li>
                          )}
                          {performanceData.summary.documentCompliance < 100 && (
                            <li className="flex items-center gap-1.5" data-testid="hint-docs">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              {t.improveDocs}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-xl font-semibold" data-testid="text-harness-compliance">
                        {performanceData.summary.harnessCompliance}%
                      </p>
                      <p className="text-xs text-muted-foreground">{t.harnessCompliance}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-xl font-semibold" data-testid="text-document-compliance">
                        {performanceData.summary.documentCompliance}%
                      </p>
                      <p className="text-xs text-muted-foreground">{t.documentCompliance}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-xl font-semibold" data-testid="text-sessions-count">
                        {performanceData.summary.totalSessions}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.sessionsAnalyzed}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Shield className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-medium text-muted-foreground">{t.noPerformanceData}</p>
                  <p className="text-sm text-muted-foreground">{t.noPerformanceDataDesc}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Current Employer Section - Show for linked technicians (not terminated) (WORK TAB) */}
        {activeTab === 'work' && user && user.role === 'rope_access_tech' && user.companyId && !user.terminatedDate && (
          <Card className="border-muted">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Building className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t.currentEmployer}</CardTitle>
                    <CardDescription>
                      {t.currentlyEmployedBy} <span className="font-medium text-foreground">{user.companyName || "your company"}</span>
                    </CardDescription>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="gap-2 text-destructive border-destructive/30"
                      data-testid="button-leave-company"
                    >
                      <UserMinus className="w-4 h-4" />
                      {t.leaveCompany}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.leaveCompanyConfirm}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.leaveCompanyWarning}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-testid="button-cancel-leave">{t.cancelLeave}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => leaveCompanyMutation.mutate()}
                        disabled={leaveCompanyMutation.isPending}
                        className="bg-destructive text-destructive-foreground gap-2"
                        data-testid="button-confirm-leave"
                      >
                        {leaveCompanyMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t.leavingCompany}
                          </>
                        ) : (
                          t.confirmLeave
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            {/* Compensation Display */}
            {(user.hourlyRate || user.salary) && (
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.yourCompensation}</p>
                    <p className="text-lg font-semibold">
                      {user.isSalary && user.salary ? (
                        <>
                          ${Number(user.salary).toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/{t.year}</span>
                        </>
                      ) : user.hourlyRate ? (
                        <>
                          ${Number(user.hourlyRate).toFixed(2)}<span className="text-sm font-normal text-muted-foreground">/{t.hour}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* PROFILE TAB - Personal information and certifications */}
        {activeTab === 'profile' && (
          <>
            {/* Back to Home button */}
            <Button
              variant="ghost"
              onClick={() => setActiveTab('home')}
              className="gap-2 -mt-2 mb-2"
              data-testid="button-back-to-home"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </Button>
            
            {/* Profile Completion Widget */}
            {!profileCompletion.isComplete && (
              <Card className="mb-4 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20" data-testid="card-profile-completion">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                      <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm">
                          {language === 'en' ? 'Complete Your Profile' : 'Complétez votre profil'}
                        </h3>
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{profileCompletion.percentage}%</span>
                      </div>
                      <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2 mb-3">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all" 
                          style={{ width: `${profileCompletion.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {language === 'en' 
                          ? 'Complete your profile to connect with employers instantly' 
                          : 'Complétez votre profil pour vous connecter instantanément avec les employeurs'}
                      </p>
                      {profileCompletion.incompleteFields.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {profileCompletion.incompleteFields.slice(0, 3).map((field, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-background">
                              {field.label}
                            </Badge>
                          ))}
                          {profileCompletion.incompleteFields.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-background">
                              +{profileCompletion.incompleteFields.length - 3} {language === 'en' ? 'more' : 'de plus'}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                      <HardHat className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl">{user.name}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                    {user.irataLevel && (
                      <Badge variant="secondary" className="gap-1">
                        <Award className="w-3 h-3" />
                        irata {user.irataLevel}
                      </Badge>
                    )}
                    {user.spratLevel && (
                      <Badge variant="secondary" className="gap-1">
                        <Award className="w-3 h-3" />
                        SPRAT {user.spratLevel}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={startEditing}
                className="w-full sm:w-auto gap-2 h-11"
                data-testid="button-edit-profile"
              >
                <Edit2 className="w-4 h-4" />
                {t.editProfile}
              </Button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 sm:flex-none h-11"
                  data-testid="button-cancel-edit"
                >
                  <X className="w-4 h-4 mr-2" />
                  {t.cancel}
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={updateMutation.isPending}
                  className="flex-1 sm:flex-none gap-2 h-11"
                  data-testid="button-save-profile"
                >
                  <Save className="w-4 h-4" />
                  {updateMutation.isPending ? t.saving : t.saveChanges}
                </Button>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t.personalInfo}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fullName}</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.email}</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeePhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.phoneNumber}</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.birthday}</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" data-testid="input-birthday" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {t.address}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="employeeStreetAddress"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>{t.streetAddress}</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-street" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.city}</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeProvinceState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.provinceState}</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-province" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.country}</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-country" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeePostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.postalCode}</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-postal" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      {t.emergencyContact}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="emergencyContactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Name</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-emergency-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" data-testid="input-emergency-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContactRelationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Spouse, Parent" data-testid="input-emergency-relationship" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {t.payrollInfo}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="socialInsuranceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Insurance Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Optional" data-testid="input-sin" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="bankTransitNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Transit #</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="5 digits" data-testid="input-bank-transit" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bankInstitutionNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution #</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="3 digits" data-testid="input-bank-institution" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bankAccountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account #</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="7-12 digits" data-testid="input-bank-account" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {t.driversLicense}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="driversLicenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Optional" data-testid="input-license-number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="driversLicenseExpiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" data-testid="input-license-expiry" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Logbook Hours
                    </h3>
                    <FormField
                      control={form.control}
                      name="irataBaselineHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Baseline Logbook Hours</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.5" placeholder="e.g., 1500" data-testid="input-baseline-hours" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            This is a personal tracking tool only, not an official irata/SPRAT record.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ropeAccessStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.experienceStartDate}</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" data-testid="input-experience-start-date" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            {t.experienceStartDateHelp}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {t.medicalConditions}
                    </h3>
                    <FormField
                      control={form.control}
                      name="specialMedicalConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.specialMedicalConditions}</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder={t.medicalPlaceholder}
                              className="min-h-[80px]"
                              data-testid="input-medical"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    {t.personalInfo}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label={t.email} value={user.email} icon={<Mail className="w-4 h-4" />} />
                    <InfoItem label={t.phoneNumber} value={user.employeePhoneNumber} icon={<Phone className="w-4 h-4" />} />
                    <InfoItem label={t.birthday} value={user.birthday ? formatLocalDate(user.birthday) : null} icon={<Calendar className="w-4 h-4" />} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {t.address}
                  </h3>
                  <p className="text-sm">
                    {user.employeeStreetAddress && (
                      <>
                        {user.employeeStreetAddress}<br />
                        {user.employeeCity}, {user.employeeProvinceState} {user.employeePostalCode}<br />
                        {user.employeeCountry}
                      </>
                    )}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4" />
                    {t.certifications}
                  </h3>
                  <div className="space-y-3">
                    {user.irataLevel && (
                      <div className="p-3 bg-muted/50 rounded-lg border" data-testid="card-irata-certification">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">irata</span>
                            {user.irataVerifiedAt && (
                              <Badge variant="default" className="bg-green-600 text-xs" data-testid="badge-irata-verified">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {t.verified}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <p data-testid="text-irata-level"><span className="text-muted-foreground">{t.level}:</span> {user.irataLevel}</p>
                          <p data-testid="text-irata-license"><span className="text-muted-foreground">{t.licenseNumber}:</span> {user.irataLicenseNumber || 'N/A'}</p>
                          <div data-testid="text-irata-expiry" className="flex items-center gap-2 flex-wrap">
                            <span className="text-muted-foreground">{t.expiresOn}:</span>{' '}
                            {user.irataExpirationDate ? (
                              (() => {
                                try {
                                  const expirationDate = parseLocalDate(user.irataExpirationDate);
                                  const formattedDate = formatLocalDate(user.irataExpirationDate);
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  
                                  let badge = null;
                                  if (expirationDate < today) {
                                    badge = <Badge variant="destructive" className="ml-2 text-xs" data-testid="badge-irata-expired">{t.expired}</Badge>;
                                  } else {
                                    const thirtyDaysFromNow = new Date();
                                    thirtyDaysFromNow.setDate(today.getDate() + 30);
                                    const sixtyDaysFromNow = new Date();
                                    sixtyDaysFromNow.setDate(today.getDate() + 60);
                                    
                                    if (expirationDate <= thirtyDaysFromNow) {
                                      // 30 days or less - RED urgent badge
                                      badge = <Badge variant="destructive" className="ml-2 text-xs" data-testid="badge-irata-expiring-30">{t.expiringIn30Days}</Badge>;
                                    } else if (expirationDate <= sixtyDaysFromNow) {
                                      // 31-60 days - YELLOW warning badge
                                      badge = <Badge variant="outline" className="ml-2 bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400 text-xs" data-testid="badge-irata-expiring-60">{t.expiringIn60Days}</Badge>;
                                    }
                                  }
                                  return <><span>{formattedDate}</span>{badge}</>;
                                } catch (e) {
                                  console.error('Failed to parse irata expiration date:', e);
                                  return <span className="text-muted-foreground italic">{t.notSet}</span>;
                                }
                              })()
                            ) : (
                              <span className="text-muted-foreground italic">{t.notSet}</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => {
                                setEditingExpirationDate('irata');
                                setExpirationDateValue(user.irataExpirationDate || '');
                              }}
                              data-testid="button-edit-irata-expiry"
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              {user.irataExpirationDate ? t.editExpirationDate : t.setExpirationDate}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {user.spratLevel && (
                      <div className="p-3 bg-muted/50 rounded-lg border" data-testid="card-sprat-certification">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">SPRAT</span>
                            {user.spratVerifiedAt && (
                              <Badge variant="default" className="bg-green-600 text-xs" data-testid="badge-sprat-verified">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {t.verified}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <p data-testid="text-sprat-level"><span className="text-muted-foreground">{t.level}:</span> {user.spratLevel}</p>
                          <p data-testid="text-sprat-license"><span className="text-muted-foreground">{t.licenseNumber}:</span> {user.spratLicenseNumber || 'N/A'}</p>
                          <div data-testid="text-sprat-expiry" className="flex items-center gap-2 flex-wrap">
                            <span className="text-muted-foreground">{t.expiresOn}:</span>{' '}
                            {user.spratExpirationDate ? (
                              (() => {
                                try {
                                  const expirationDate = parseLocalDate(user.spratExpirationDate);
                                  const formattedDate = formatLocalDate(user.spratExpirationDate);
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  
                                  let badge = null;
                                  if (expirationDate < today) {
                                    badge = <Badge variant="destructive" className="ml-2 text-xs" data-testid="badge-sprat-expired">{t.expired}</Badge>;
                                  } else {
                                    const thirtyDaysFromNow = new Date();
                                    thirtyDaysFromNow.setDate(today.getDate() + 30);
                                    const sixtyDaysFromNow = new Date();
                                    sixtyDaysFromNow.setDate(today.getDate() + 60);
                                    
                                    if (expirationDate <= thirtyDaysFromNow) {
                                      // 30 days or less - RED urgent badge
                                      badge = <Badge variant="destructive" className="ml-2 text-xs" data-testid="badge-sprat-expiring-30">{t.expiringIn30Days}</Badge>;
                                    } else if (expirationDate <= sixtyDaysFromNow) {
                                      // 31-60 days - YELLOW warning badge
                                      badge = <Badge variant="outline" className="ml-2 bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400 text-xs" data-testid="badge-sprat-expiring-60">{t.expiringIn60Days}</Badge>;
                                    }
                                  }
                                  return <><span>{formattedDate}</span>{badge}</>;
                                } catch (e) {
                                  console.error('Failed to parse SPRAT expiration date:', e);
                                  return <span className="text-muted-foreground italic">{t.notSet}</span>;
                                }
                              })()
                            ) : (
                              <span className="text-muted-foreground italic">{t.notSet}</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => {
                                setEditingExpirationDate('sprat');
                                setExpirationDateValue(user.spratExpirationDate || '');
                              }}
                              data-testid="button-edit-sprat-expiry"
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              {user.spratExpirationDate ? t.editExpirationDate : t.setExpirationDate}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {user.irataBaselineHours && parseFloat(user.irataBaselineHours) > 0 && (
                      <InfoItem label={t.baselineHours} value={`${user.irataBaselineHours} ${t.hours}`} icon={<Clock className="w-4 h-4" />} />
                    )}
                  </div>
                  
                  {/* Experience Display - Always visible */}
                  <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <div>
                          <p className="font-medium text-sm">{t.ropeAccessExperience}</p>
                          {user.ropeAccessStartDate ? (
                            <>
                              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                {(() => {
                                  const startDate = parseLocalDate(user.ropeAccessStartDate);
                                  const now = new Date();
                                  let years = now.getFullYear() - startDate.getFullYear();
                                  let months = now.getMonth() - startDate.getMonth();
                                  if (months < 0 || (months === 0 && now.getDate() < startDate.getDate())) {
                                    years--;
                                    months += 12;
                                  }
                                  if (now.getDate() < startDate.getDate()) {
                                    months--;
                                    if (months < 0) months += 12;
                                  }
                                  
                                  let expString = t.lessThanMonth;
                                  if (years > 0 || months > 0) {
                                    expString = t.yearsMonths
                                      .replace('{years}', years.toString())
                                      .replace('{months}', months.toString());
                                  }
                                  return expString;
                                })()}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t.startedOn}: {formatLocalDate(user.ropeAccessStartDate)}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">{t.addExperience}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingExperience(true);
                          setExperienceStartDateValue(user.ropeAccessStartDate || '');
                        }}
                        data-testid="button-edit-experience"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        {user.ropeAccessStartDate ? t.editExperience : t.setExperience}
                      </Button>
                    </div>
                  </div>
                  
                  {/* irata License Verification Section - Available to all technicians */}
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                      {/* Show verified status if already verified */}
                      {user.irataVerifiedAt && (
                        <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">irata {t.licenseVerified}</p>
                            <p className="text-xs text-muted-foreground">
                              {t.lastVerified}: {formatDateTime(user.irataVerifiedAt)}
                              {user.irataVerificationStatus && ` (${user.irataVerificationStatus})`}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">
                            {user.irataVerifiedAt ? t.reverifyLicense : t.verifyLicenseValidity} (irata)
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {t.verificationExplanation}
                          </p>
                          <div className="text-xs text-muted-foreground space-y-1 pt-1">
                            <p className="font-medium">{t.howItWorks}</p>
                            <ol className="list-decimal list-inside space-y-0.5 pl-1">
                              <li>{t.step1}</li>
                              <li>{t.step2}</li>
                              <li>{t.step3}</li>
                              <li>{t.step4}</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => openExternalLink('https://techconnect.irata.org/verify/tech')}
                          data-testid="button-open-irata-portal"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {t.openIrataPortal}
                        </Button>
                        
                        <input
                          type="file"
                          ref={screenshotInputRef}
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                          data-testid="input-irata-screenshot-upload"
                        />
                        
                        {/* Hidden file input for document uploads */}
                        <input
                          type="file"
                          ref={documentInputRef}
                          accept="image/*,.pdf"
                          onChange={handleDocumentUpload}
                          className="hidden"
                          data-testid="input-document-upload"
                        />
                        
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => screenshotInputRef.current?.click()}
                          disabled={isVerifying}
                          data-testid="button-upload-irata-screenshot"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {t.analyzingScreenshot}
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {t.uploadVerificationScreenshot}
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {/* Verification Result Display */}
                      {verificationResult && (
                        <div className={`p-3 rounded-lg border ${
                          verificationResult.success 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-destructive/10 border-destructive/30'
                        }`}>
                          <div className="flex items-start gap-2">
                            {verificationResult.success ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1 text-sm">
                              <p className={`font-medium ${
                                verificationResult.success ? 'text-green-700 dark:text-green-400' : 'text-destructive'
                              }`}>
                                {verificationResult.message}
                              </p>
                              {verificationResult.verification && verificationResult.success && (
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  {verificationResult.verification.technicianName && (
                                    <p>{t.name}: {verificationResult.verification.technicianName}</p>
                                  )}
                                  {verificationResult.verification.irataNumber && (
                                    <p>{t.license}: {verificationResult.verification.irataNumber}</p>
                                  )}
                                  {verificationResult.verification.irataLevel && (
                                    <p>{t.level}: {verificationResult.verification.irataLevel}</p>
                                  )}
                                  {verificationResult.verification.expiryDate && (
                                    <p>{t.validUntil}: {verificationResult.verification.expiryDate}</p>
                                  )}
                                  <p className="text-xs opacity-70">
                                    {t.confidence}: {verificationResult.verification.confidence}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* irata Certification Card Upload - inside verification section */}
                      <div className="pt-3 border-t border-primary/20 space-y-3">
                        <p className="text-sm font-medium">{t.irataCertificationCard}</p>
                        
                        {/* Display existing irata documents */}
                        {user.irataDocuments && user.irataDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                          <div className="space-y-2">
                            {user.irataDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                              const lowerUrl = url.toLowerCase();
                              const isPdf = lowerUrl.endsWith('.pdf');
                              const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                            lowerUrl.includes('image') || 
                                            (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                              
                              return (
                                <a 
                                  key={index} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-background"
                                >
                                  {isPdf ? (
                                    <div className="flex flex-col items-center justify-center py-6 bg-muted gap-2">
                                      <FileText className="w-10 h-10 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground font-medium">{t.tapToViewPdf}</span>
                                    </div>
                                  ) : isImage ? (
                                    <img 
                                      src={url} 
                                      alt={`irata certification ${index + 1}`}
                                      className="w-full object-contain"
                                      style={{ maxHeight: '200px', minHeight: '80px' }}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-6 bg-muted gap-2">
                                      <FileText className="w-10 h-10 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground font-medium">{t.tapToViewDocument}</span>
                                    </div>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => triggerDocumentUpload('irataCertificationCard')}
                          disabled={uploadingDocType === 'irataCertificationCard'}
                          data-testid="button-upload-irata-certification-card"
                        >
                          {uploadingDocType === 'irataCertificationCard' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {t.uploading}
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {t.uploadIrataCertificationCard}
                            </>
                          )}
                        </Button>
                      </div>
                  </div>

                  {/* SPRAT License Verification Section - Available to all technicians */}
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                      {/* Show verified status if already verified */}
                      {user.spratVerifiedAt && (
                        <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">SPRAT {t.licenseVerified}</p>
                            <p className="text-xs text-muted-foreground">
                              {t.lastVerified}: {formatDateTime(user.spratVerifiedAt)}
                              {user.spratVerificationStatus && ` (${user.spratVerificationStatus})`}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">
                            {user.spratVerifiedAt ? t.reverifyLicense : t.verifyLicenseValidity} (SPRAT)
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {t.spratVerificationExplanation}
                          </p>
                          <div className="text-xs text-muted-foreground space-y-1 pt-1">
                            <p className="font-medium">{t.howItWorks}</p>
                            <ol className="list-decimal list-inside space-y-0.5 pl-1">
                              <li>{t.spratStep1}</li>
                              <li>{t.step2}</li>
                              <li>{t.step3}</li>
                              <li>{t.step4}</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => openExternalLink('https://sprat.org/technician-verification-system/')}
                          data-testid="button-open-sprat-portal"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {t.openSpratPortal}
                        </Button>
                        
                        <input
                          type="file"
                          ref={spratScreenshotInputRef}
                          accept="image/*"
                          onChange={handleSpratScreenshotUpload}
                          className="hidden"
                          data-testid="input-sprat-screenshot-upload"
                        />
                        
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => spratScreenshotInputRef.current?.click()}
                          disabled={isVerifyingSprat}
                          data-testid="button-upload-sprat-screenshot"
                        >
                          {isVerifyingSprat ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {t.analyzingScreenshot}
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {t.uploadVerificationScreenshot}
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {/* SPRAT Verification Result Display */}
                      {spratVerificationResult && (
                        <div className={`p-3 rounded-lg border ${
                          spratVerificationResult.success 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-destructive/10 border-destructive/30'
                        }`}>
                          <div className="flex items-start gap-2">
                            {spratVerificationResult.success ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-1 text-sm">
                              <p className={`font-medium ${
                                spratVerificationResult.success ? 'text-green-700 dark:text-green-400' : 'text-destructive'
                              }`}>
                                {spratVerificationResult.message}
                              </p>
                              {spratVerificationResult.verification && spratVerificationResult.success && (
                                <div className="text-xs text-muted-foreground space-y-0.5">
                                  {spratVerificationResult.verification.technicianName && (
                                    <p>{t.name}: {spratVerificationResult.verification.technicianName}</p>
                                  )}
                                  {spratVerificationResult.verification.spratNumber && (
                                    <p>{t.license}: {spratVerificationResult.verification.spratNumber}</p>
                                  )}
                                  {spratVerificationResult.verification.spratLevel && (
                                    <p>{t.level}: {spratVerificationResult.verification.spratLevel}</p>
                                  )}
                                  {spratVerificationResult.verification.expiryDate && (
                                    <p>{t.validUntil}: {spratVerificationResult.verification.expiryDate}</p>
                                  )}
                                  <p className="text-xs opacity-70">
                                    {t.confidence}: {spratVerificationResult.verification.confidence}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* SPRAT Certification Card Upload - inside verification section */}
                      <div className="pt-3 border-t border-primary/20 space-y-3">
                        <p className="text-sm font-medium">{t.spratCertificationCard}</p>
                        
                        {/* Display existing SPRAT documents */}
                        {user.spratDocuments && user.spratDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                          <div className="space-y-2">
                            {user.spratDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                              const lowerUrl = url.toLowerCase();
                              const isPdf = lowerUrl.endsWith('.pdf');
                              const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                            lowerUrl.includes('image') || 
                                            (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                              
                              return (
                                <a 
                                  key={index} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-background"
                                >
                                  {isPdf ? (
                                    <div className="flex flex-col items-center justify-center py-6 bg-muted gap-2">
                                      <FileText className="w-10 h-10 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground font-medium">{t.tapToViewPdf}</span>
                                    </div>
                                  ) : isImage ? (
                                    <img 
                                      src={url} 
                                      alt={`SPRAT certification ${index + 1}`}
                                      className="w-full object-contain"
                                      style={{ maxHeight: '200px', minHeight: '80px' }}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-6 bg-muted gap-2">
                                      <FileText className="w-10 h-10 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground font-medium">{t.tapToViewDocument}</span>
                                    </div>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => triggerDocumentUpload('spratCertificationCard')}
                          disabled={uploadingDocType === 'spratCertificationCard'}
                          data-testid="button-upload-sprat-certification-card"
                        >
                          {uploadingDocType === 'spratCertificationCard' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {t.uploading}
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {t.uploadSpratCertificationCard}
                            </>
                          )}
                        </Button>
                      </div>
                  </div>
                  
                  {/* My Logged Hours - After all certification verification sections */}
                  <div className="mt-6 p-4 bg-primary/5 border-2 border-primary/30 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-base">{t.myLoggedHours}</p>
                          <p className="text-sm text-muted-foreground">{t.viewLoggedHoursDesc}</p>
                          <p className="text-xs text-primary/80 font-medium">{t.loggedHoursFeatures}</p>
                          {(combinedTotalHours > 0 || workSessionHours > 0) && (
                            <div className="pt-2">
                              <p className="text-lg font-bold text-primary" data-testid="text-total-logged-hours">
                                {combinedTotalHours.toFixed(1)} {t.totalHoursLabel}
                              </p>
                              {workSessionHours > 0 && baselineHours > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  {baselineHours.toFixed(1)} {t.baselinePlus} {workSessionHours.toFixed(1)} {t.fromSessions}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => setLocation("/technician-logged-hours")}
                        className="gap-2 whitespace-nowrap"
                        data-testid="button-view-logged-hours"
                      >
                        {t.viewLoggedHours}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-4 p-3 bg-red-500/15 border border-red-500/40 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700 dark:text-red-300">
                          {t.logbookDisclaimer}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>

                {user.hasFirstAid && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        First Aid Certification
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem label="Type" value={user.firstAidType} />
                        <InfoItem 
                          label="Expiry" 
                          value={user.firstAidExpiry ? formatLocalDate(user.firstAidExpiry) : "No expiry set"} 
                        />
                      </div>
                      {user.firstAidDocuments && user.firstAidDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                        <div className="pt-3">
                          <p className="text-sm text-muted-foreground mb-3">Certificate</p>
                          <div className="space-y-3">
                            {user.firstAidDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                              const lowerUrl = url.toLowerCase();
                              const isPdf = lowerUrl.endsWith('.pdf');
                              const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                            lowerUrl.includes('image') || 
                                            (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                              
                              return (
                                <a 
                                  key={index} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                                >
                                  {isPdf ? (
                                    <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                      <FileText className="w-12 h-12 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground font-medium">Tap to view PDF</span>
                                    </div>
                                  ) : isImage ? (
                                    <img 
                                      src={url} 
                                      alt={`First aid certificate ${index + 1}`}
                                      className="w-full object-contain"
                                      style={{ maxHeight: '300px', minHeight: '100px' }}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const div = document.createElement('div');
                                          div.className = 'flex flex-col items-center justify-center py-8 gap-2';
                                          div.innerHTML = '<span class="text-sm text-muted-foreground">Tap to view document</span>';
                                          parent.appendChild(div);
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                      <FileText className="w-12 h-12 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground font-medium">Tap to view document</span>
                                    </div>
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Upload button for first aid certificate */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerDocumentUpload('firstAidCertificate')}
                        disabled={uploadingDocType === 'firstAidCertificate'}
                        data-testid="button-upload-first-aid"
                      >
                        {uploadingDocType === 'firstAidCertificate' ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t.uploading}
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {user.firstAidDocuments && user.firstAidDocuments.filter((u: string) => u && u.trim()).length > 0 
                              ? t.addFirstAidCert 
                              : t.uploadFirstAidCert}
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoItem label="Name" value={user.emergencyContactName} />
                    <InfoItem label="Phone" value={user.emergencyContactPhone} />
                    <InfoItem label="Relationship" value={user.emergencyContactRelationship} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    Payroll Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem label="SIN" value={user.socialInsuranceNumber || null} />
                    <InfoItem 
                      label="Bank Account" 
                      value={user.bankTransitNumber && user.bankInstitutionNumber && user.bankAccountNumber 
                        ? `${user.bankTransitNumber}-${user.bankInstitutionNumber}-${user.bankAccountNumber}` 
                        : null} 
                    />
                  </div>
                  
                  {/* Upload void cheque button - always visible if no banking documents exist */}
                  {(!user.bankDocuments || user.bankDocuments.filter((u: string) => u && u.trim()).length === 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => triggerDocumentUpload('voidCheque')}
                      disabled={uploadingDocType === 'voidCheque'}
                      data-testid="button-upload-void-cheque-payroll"
                    >
                      {uploadingDocType === 'voidCheque' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t.uploading}
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {t.uploadVoidCheque}
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    {t.driversLicense}
                  </h3>
                  {(user.driversLicenseNumber || user.driversLicenseExpiry) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.driversLicenseNumber && (
                        <InfoItem label={t.licenseNumber} value={user.driversLicenseNumber} />
                      )}
                      {user.driversLicenseExpiry && (
                        <InfoItem 
                          label={t.expiry}
                          value={formatLocalDate(user.driversLicenseExpiry)} 
                        />
                      )}
                    </div>
                  )}
                      {user.driversLicenseDocuments && user.driversLicenseDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                        <div className="pt-3">
                          <p className="text-sm text-muted-foreground mb-3">Uploaded Documents</p>
                          <div className="space-y-3">
                            {user.driversLicenseDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                              const lowerUrl = url.toLowerCase();
                              const isPdf = lowerUrl.endsWith('.pdf');
                              const isAbstract = lowerUrl.includes('abstract');
                              const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                            lowerUrl.includes('image') || 
                                            (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                              
                              const documentLabel = isAbstract 
                                ? "Driver's Abstract" 
                                : (isImage ? "License Photo" : "License Document");
                              
                              return (
                                <div key={index} className="space-y-1">
                                  <p className="text-xs font-medium text-muted-foreground">{documentLabel}</p>
                                  <a 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                                  >
                                    {isPdf ? (
                                      <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                        <FileText className="w-12 h-12 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground font-medium">Tap to view PDF</span>
                                      </div>
                                    ) : isImage ? (
                                      <img 
                                        src={url} 
                                        alt={documentLabel}
                                        className="w-full object-contain"
                                        style={{ maxHeight: '300px', minHeight: '100px' }}
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.onerror = null;
                                          target.style.display = 'none';
                                          const parent = target.parentElement;
                                          if (parent) {
                                            const div = document.createElement('div');
                                            div.className = 'flex flex-col items-center justify-center py-8 gap-2';
                                            div.innerHTML = '<span class="text-sm text-muted-foreground">Tap to view document</span>';
                                            parent.appendChild(div);
                                          }
                                        }}
                                      />
                                    ) : (
                                      <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                        <FileText className="w-12 h-12 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground font-medium">Tap to view document</span>
                                      </div>
                                    )}
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Upload buttons for driver's license section */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => triggerDocumentUpload('driversLicense')}
                          disabled={uploadingDocType === 'driversLicense'}
                          data-testid="button-upload-drivers-license"
                        >
                          {uploadingDocType === 'driversLicense' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {t.uploading}
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {user.driversLicenseDocuments && user.driversLicenseDocuments.filter((u: string) => u && u.trim()).length > 0 
                                ? t.addDriversLicense 
                                : t.uploadDriversLicense}
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => triggerDocumentUpload('driversAbstract')}
                          disabled={uploadingDocType === 'driversAbstract'}
                          data-testid="button-upload-drivers-abstract"
                        >
                          {uploadingDocType === 'driversAbstract' ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {t.uploading}
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {user.driversLicenseDocuments && user.driversLicenseDocuments.some((u: string) => u && u.toLowerCase().includes('abstract'))
                                ? t.replaceDriversAbstract 
                                : t.uploadDriversAbstract}
                            </>
                          )}
                        </Button>
                      </div>
                </div>

                {user.bankDocuments && user.bankDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                        Banking Documents (Void Cheque)
                      </h3>
                      <div className="space-y-3">
                        {user.bankDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                          const lowerUrl = url.toLowerCase();
                          const isPdf = lowerUrl.endsWith('.pdf');
                          const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                        lowerUrl.includes('image') || 
                                        (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                          
                          return (
                            <a 
                              key={index} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                            >
                              {isPdf ? (
                                <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                  <FileText className="w-12 h-12 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground font-medium">Tap to view PDF</span>
                                </div>
                              ) : isImage ? (
                                <img 
                                  src={url} 
                                  alt={`Banking document ${index + 1}`}
                                  className="w-full object-contain"
                                  style={{ maxHeight: '300px', minHeight: '100px' }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const div = document.createElement('div');
                                      div.className = 'flex flex-col items-center justify-center py-8 gap-2';
                                      div.innerHTML = '<span class="text-sm text-muted-foreground">Tap to view document</span>';
                                      parent.appendChild(div);
                                    }
                                  }}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                  <FileText className="w-12 h-12 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground font-medium">Tap to view document</span>
                                </div>
                              )}
                            </a>
                          );
                        })}
                      </div>
                      
                      {/* Upload button for void cheque */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerDocumentUpload('voidCheque')}
                        disabled={uploadingDocType === 'voidCheque'}
                        data-testid="button-upload-void-cheque"
                      >
                        {uploadingDocType === 'voidCheque' ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t.uploading}
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {user.bankDocuments && user.bankDocuments.filter((u: string) => u && u.trim()).length > 0 
                              ? t.addVoidCheque 
                              : t.uploadVoidCheque}
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}

                {user.specialMedicalConditions && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                        <AlertCircle className="w-4 h-4" />
                        {t.medicalConditions}
                      </h3>
                      <p className="text-sm">{user.specialMedicalConditions}</p>
                    </div>
                  </>
                )}

                {/* Rope Access Specialties Section */}
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <HardHat className="w-4 h-4" />
                    {t.specialties}
                  </h3>
                  <p className="text-xs text-muted-foreground">{t.specialtiesDesc}</p>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Current specialties with remove button */}
                      <div className="flex flex-wrap gap-2">
                        {(form.watch("ropeAccessSpecialties") || []).map((specialty: string, index: number) => {
                          const jobType = JOB_TYPES.find(jt => jt.value === specialty);
                          return (
                            <Badge 
                              key={specialty} 
                              variant="secondary"
                              className="gap-1 pr-1"
                              data-testid={`badge-specialty-${index}`}
                            >
                              <HardHat className="w-3 h-3" />
                              {jobType?.label || specialty}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 ml-1 no-default-hover-elevate no-default-active-elevate"
                                onClick={() => {
                                  const current = form.getValues("ropeAccessSpecialties") || [];
                                  form.setValue("ropeAccessSpecialties", current.filter((s: string) => s !== specialty));
                                }}
                                data-testid={`button-remove-specialty-${index}`}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          );
                        })}
                        {(form.watch("ropeAccessSpecialties") || []).length === 0 && (
                          <p className="text-sm text-muted-foreground italic">{t.noSpecialties}</p>
                        )}
                      </div>
                      
                      {/* Add specialty selector */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          id="specialty-category"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          data-testid="select-specialty-category"
                          value={specialtyCategory}
                          onChange={(e) => {
                            setSpecialtyCategory(e.target.value as JobCategory | "");
                            setSelectedSpecialtyJobType("");
                          }}
                        >
                          <option value="">{t.selectCategory}</option>
                          {JOB_CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                        <select
                          id="specialty-job-type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          data-testid="select-specialty-job-type"
                          value={selectedSpecialtyJobType}
                          onChange={(e) => setSelectedSpecialtyJobType(e.target.value)}
                          disabled={!specialtyCategory}
                        >
                          <option value="">{t.selectJobType}</option>
                          {specialtyCategory && getJobTypesByCategory(specialtyCategory)
                            .filter(jt => !jt.value.endsWith('_other') && !(form.watch("ropeAccessSpecialties") || []).includes(jt.value))
                            .map(jt => (
                              <option key={jt.value} value={jt.value}>{jt.label}</option>
                            ))}
                        </select>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 whitespace-nowrap"
                          disabled={!selectedSpecialtyJobType}
                          onClick={() => {
                            if (selectedSpecialtyJobType) {
                              const current = form.getValues("ropeAccessSpecialties") || [];
                              if (!current.includes(selectedSpecialtyJobType)) {
                                form.setValue("ropeAccessSpecialties", [...current, selectedSpecialtyJobType]);
                              }
                              setSelectedSpecialtyJobType("");
                            }
                          }}
                          data-testid="button-add-specialty"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {t.addSpecialty}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(user.ropeAccessSpecialties || []).length > 0 ? (
                        (user.ropeAccessSpecialties || []).map((specialty: string, index: number) => {
                          const jobType = JOB_TYPES.find(jt => jt.value === specialty);
                          return (
                            <Badge 
                              key={specialty} 
                              variant="secondary"
                              className="gap-1"
                              data-testid={`badge-specialty-display-${index}`}
                            >
                              <HardHat className="w-3 h-3" />
                              {jobType?.label || specialty}
                            </Badge>
                          );
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground italic">{t.noSpecialties}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Resume / CV Section */}
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    {t.resume}
                    {!user.hasPlusAccess && (
                      <Badge variant="secondary" className="ml-2 gap-1">
                        <Lock className="w-3 h-3" />
                        PLUS
                      </Badge>
                    )}
                  </h3>
                  
                  {user.hasPlusAccess ? (
                    <>
                      {user.resumeDocuments && user.resumeDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                        <div className="space-y-3">
                          {user.resumeDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                            const lowerUrl = url.toLowerCase();
                            const isPdf = lowerUrl.endsWith('.pdf');
                            const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                          lowerUrl.includes('image') || 
                                          (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                            
                            return (
                              <a 
                                key={index} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                                data-testid={`link-resume-${index}`}
                              >
                                {isPdf ? (
                                  <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                    <FileText className="w-12 h-12 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground font-medium">{t.tapToViewPdf}</span>
                                  </div>
                                ) : isImage ? (
                                  <img 
                                    src={url} 
                                    alt={`Resume ${index + 1}`}
                                    className="w-full h-auto max-h-64 object-contain"
                                    data-testid={`img-resume-${index}`}
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                    <FileText className="w-12 h-12 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground font-medium">{t.tapToViewDocument}</span>
                                  </div>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerDocumentUpload('resume')}
                        disabled={uploadingDocType === 'resume'}
                        data-testid="button-upload-resume"
                      >
                        {uploadingDocType === 'resume' ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t.uploading}
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {user.resumeDocuments && user.resumeDocuments.filter((u: string) => u && u.trim()).length > 0 
                              ? t.addResume 
                              : t.uploadResume}
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 text-center">
                      <Lock className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">{t.plusLockedFeature}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.plusLockedDesc}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t z-50 safe-area-inset-bottom">
        <div className="max-w-4xl mx-auto flex items-center justify-around py-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] rounded-lg transition-colors ${
              activeTab === 'home' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
            data-testid="tab-home"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.tabHome}</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] rounded-lg transition-colors ${
              activeTab === 'profile' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
            data-testid="tab-profile"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.tabProfile}</span>
          </button>
          <button
            onClick={() => setActiveTab('employer')}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] rounded-lg transition-colors relative ${
              activeTab === 'employer' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
            data-testid="tab-employer"
          >
            <Eye className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight text-center">{language === 'en' ? 'Employer' : 'Employeur'}</span>
            {!(user?.ropeAccessSpecialties && user.ropeAccessSpecialties.length > 0) && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                !
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('work')}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] rounded-lg transition-colors relative ${
              activeTab === 'work' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
            data-testid="tab-work"
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.tabWork}</span>
            {pendingInvitations.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {pendingInvitations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('more')}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] rounded-lg transition-colors relative ${
              activeTab === 'more' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
            data-testid="tab-more"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.tabMore}</span>
            {totalUnreadFeedback > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalUnreadFeedback}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Experience Start Date Edit Dialog */}
      <Dialog open={editingExperience} onOpenChange={(open) => {
        if (!open) {
          setEditingExperience(false);
          setExperienceStartDateValue("");
        }
      }}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-edit-experience">
          <DialogHeader>
            <DialogTitle>
              {user?.ropeAccessStartDate ? t.editExperience : t.setExperience}
            </DialogTitle>
            <DialogDescription>
              {t.whenDidYouStart}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="experience-start-date">{t.experienceStartDate}</Label>
              <Input
                id="experience-start-date"
                type="date"
                value={experienceStartDateValue}
                onChange={(e) => setExperienceStartDateValue(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                data-testid="input-experience-start-date-dialog"
              />
              <p className="text-xs text-muted-foreground">{t.experienceStartDateHelp}</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingExperience(false);
                setExperienceStartDateValue("");
              }}
              data-testid="button-cancel-experience"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={() => {
                if (experienceStartDateValue) {
                  updateExperienceMutation.mutate(experienceStartDateValue);
                }
              }}
              disabled={!experienceStartDateValue || updateExperienceMutation.isPending}
              data-testid="button-save-experience"
            >
              {updateExperienceMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.saveChanges
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expiration Date Edit Dialog */}
      <Dialog open={editingExpirationDate !== null} onOpenChange={(open) => {
        if (!open) {
          setEditingExpirationDate(null);
          setExpirationDateValue("");
        }
      }}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-edit-expiration">
          <DialogHeader>
            <DialogTitle>
              {editingExpirationDate?.toUpperCase()} {expirationDateValue ? t.editExpirationDate : t.setExpirationDate}
            </DialogTitle>
            <DialogDescription>
              {t.selectDate}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expiration-date">{t.expiresOn}</Label>
              <Input
                id="expiration-date"
                type="date"
                value={expirationDateValue}
                onChange={(e) => setExpirationDateValue(e.target.value)}
                data-testid="input-expiration-date"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditingExpirationDate(null);
                setExpirationDateValue("");
              }}
              data-testid="button-cancel-expiration"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={() => {
                if (editingExpirationDate && expirationDateValue) {
                  updateExpirationDateMutation.mutate({
                    type: editingExpirationDate,
                    date: expirationDateValue,
                  });
                }
              }}
              disabled={!expirationDateValue || updateExpirationDateMutation.isPending}
              data-testid="button-save-expiration"
            >
              {updateExpirationDateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.saveChanges
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PLUS Benefits Dialog */}
      <Dialog open={showPlusBenefits} onOpenChange={setShowPlusBenefits}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-plus-benefits">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              {t.plusBenefitsTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plusBenefit1}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plusBenefit2}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plusBenefit3}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plusBenefit4}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plusBenefit5}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{t.plusBenefit6}</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-primary flex items-center gap-2">
                <Gift className="w-4 h-4" />
                {t.plusUnlockInfo}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPlusBenefits(false)} data-testid="button-close-plus-benefits">
              {t.cancel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employer Selection Dialog (for PLUS members with multiple employers) */}
      <Dialog open={showEmployerSelectDialog} onOpenChange={setShowEmployerSelectDialog}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-select-employer">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              {t.selectEmployer}
            </DialogTitle>
            <DialogDescription>{t.selectEmployerDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {employerConnectionsData?.connections && employerConnectionsData.connections.length > 0 ? (
              employerConnectionsData.connections.map((conn) => {
                const isSuspended = conn.status === 'suspended';
                return (
                  <div
                    key={conn.id}
                    className={`p-3 rounded-md border ${
                      isSuspended 
                        ? "opacity-60 cursor-not-allowed border-muted" 
                        : "cursor-pointer hover-elevate"
                    } ${
                      selectedEmployerId === conn.companyId && !isSuspended
                        ? "border-primary bg-primary/10" 
                        : "border-muted"
                    }`}
                    onClick={() => !isSuspended && setSelectedEmployerId(conn.companyId)}
                    data-testid={`employer-option-${conn.companyId}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSuspended ? "bg-muted" : "bg-primary/10"
                      }`}>
                        {conn.company?.photoUrl ? (
                          <img 
                            src={conn.company.photoUrl} 
                            alt={conn.company.companyName || conn.company.name} 
                            className={`w-10 h-10 rounded-full object-cover ${isSuspended ? "grayscale" : ""}`}
                          />
                        ) : (
                          <Building2 className={`w-5 h-5 ${isSuspended ? "text-muted-foreground" : "text-primary"}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isSuspended ? "text-muted-foreground" : ""}`}>
                          {conn.company?.companyName || conn.company?.name || "Unknown Company"}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {conn.isPrimary && (
                            <Badge variant="secondary" className="text-xs">
                              {t.primaryEmployer}
                            </Badge>
                          )}
                          {isSuspended && (
                            <Badge variant="destructive" className="text-xs">
                              {t.suspended || "Suspended"}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {selectedEmployerId === conn.companyId && !isSuspended && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                      {isSuspended && (
                        <span className="material-icons text-muted-foreground">block</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t.noEmployersConnected}
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowEmployerSelectDialog(false)}
              data-testid="button-cancel-employer-select"
            >
              {t.cancel}
            </Button>
            <Button 
              onClick={() => {
                setShowEmployerSelectDialog(false);
                // Navigate to dashboard with the selected employer ID
                setLocation(`/dashboard?employerId=${selectedEmployerId}`);
              }}
              disabled={!selectedEmployerId}
              data-testid="button-continue-employer"
            >
              {t.continueToEmployer}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* My Feedback Dialog */}
      <Dialog open={showMyFeedbackDialog} onOpenChange={(open) => {
        setShowMyFeedbackDialog(open);
        if (!open) {
          setSelectedFeedbackId(null);
          setFeedbackReply("");
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-my-feedback">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              {t.myFeedbackTitle}
            </DialogTitle>
            <DialogDescription>{t.myFeedbackDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {myFeedbackData?.requests && myFeedbackData.requests.length > 0 ? (
              myFeedbackData.requests.map((feedback) => (
                <div 
                  key={feedback.id} 
                  className={`border rounded-lg p-4 space-y-3 ${
                    selectedFeedbackId === feedback.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium">{feedback.title}</h4>
                        {feedback.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {feedback.unreadCount} {t.newResponse}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{feedback.description}</p>
                    </div>
                    <Badge variant={
                      feedback.status === 'completed' ? 'default' :
                      feedback.status === 'in_progress' ? 'secondary' :
                      feedback.status === 'reviewing' ? 'secondary' :
                      'outline'
                    }>
                      {feedback.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">{feedback.category}</Badge>
                    <span>{formatDateTime(new Date(feedback.createdAt))}</span>
                  </div>
                  
                  {feedback.messages && feedback.messages.length > 0 && (
                    <div className="pt-3 border-t space-y-2">
                      <p className="text-sm font-medium">{t.feedbackResponses}:</p>
                      {feedback.messages.map((msg) => (
                        <div 
                          key={msg.id}
                          className={`p-3 rounded-md text-sm ${
                            msg.senderRole === 'superuser'
                              ? 'bg-primary/10 border-l-2 border-primary'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-medium text-xs">
                              {msg.senderRole === 'superuser' ? t.fromTeam : t.fromYou}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(new Date(msg.createdAt))}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedFeedbackId === feedback.id ? (
                    <div className="pt-3 border-t space-y-2">
                      <Textarea
                        placeholder={t.replyPlaceholder}
                        value={feedbackReply}
                        onChange={(e) => setFeedbackReply(e.target.value)}
                        className="min-h-[80px]"
                        data-testid="input-feedback-reply"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedFeedbackId(null);
                            setFeedbackReply("");
                          }}
                        >
                          {t.cancel}
                        </Button>
                        <Button 
                          size="sm"
                          disabled={!feedbackReply.trim() || isSubmittingReply}
                          onClick={async () => {
                            if (!feedbackReply.trim()) return;
                            setIsSubmittingReply(true);
                            try {
                              const response = await fetch(`/api/my-feedback/${feedback.id}/reply`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({ message: feedbackReply }),
                              });
                              if (response.ok) {
                                setFeedbackReply("");
                                setSelectedFeedbackId(null);
                                refetchMyFeedback();
                                toast({
                                  title: language === 'en' ? "Reply sent" : "Réponse envoyée",
                                });
                              }
                            } catch (error) {
                              toast({
                                title: language === 'en' ? "Failed to send reply" : "Échec de l'envoi de la réponse",
                                variant: "destructive",
                              });
                            } finally {
                              setIsSubmittingReply(false);
                            }
                          }}
                          data-testid="button-send-reply"
                        >
                          {isSubmittingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : t.sendReply}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        setSelectedFeedbackId(feedback.id);
                        if (feedback.unreadCount > 0) {
                          await fetch(`/api/my-feedback/${feedback.id}/mark-read`, {
                            method: 'POST',
                            credentials: 'include',
                          });
                          refetchMyFeedback();
                        }
                      }}
                      data-testid={`button-reply-feedback-${feedback.id}`}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {t.replyToFeedback}
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">{t.noFeedbackYet}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowMyFeedbackDialog(false)} data-testid="button-close-my-feedback">
              {t.cancel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-lg" data-testid="dialog-feedback">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              {t.feedback}
            </DialogTitle>
            <DialogDescription>
              {t.feedbackDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-title">{t.feedbackTitle}</Label>
              <Input
                id="feedback-title"
                placeholder={t.feedbackTitlePlaceholder}
                value={feedbackTitle}
                onChange={(e) => setFeedbackTitle(e.target.value)}
                data-testid="input-feedback-title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback-category">{t.feedbackCategory}</Label>
              <select
                id="feedback-category"
                value={feedbackCategory}
                onChange={(e) => setFeedbackCategory(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                data-testid="select-feedback-category"
              >
                <option value="feature">{t.feedbackCategoryFeature}</option>
                <option value="improvement">{t.feedbackCategoryImprovement}</option>
                <option value="bug">{t.feedbackCategoryBug}</option>
                <option value="other">{t.feedbackCategoryOther}</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback-priority">{t.feedbackPriority}</Label>
              <select
                id="feedback-priority"
                value={feedbackPriority}
                onChange={(e) => setFeedbackPriority(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                data-testid="select-feedback-priority"
              >
                <option value="low">{t.feedbackPriorityLow}</option>
                <option value="normal">{t.feedbackPriorityNormal}</option>
                <option value="high">{t.feedbackPriorityHigh}</option>
                <option value="urgent">{t.feedbackPriorityUrgent}</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback-description">{t.feedbackDescription}</Label>
              <Textarea
                id="feedback-description"
                placeholder={t.feedbackDescriptionPlaceholder}
                value={feedbackDescription}
                onChange={(e) => setFeedbackDescription(e.target.value)}
                rows={4}
                data-testid="input-feedback-description"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFeedbackDialog(false)}
              data-testid="button-cancel-feedback"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={isSubmittingFeedback || !feedbackTitle.trim() || !feedbackDescription.trim()}
              data-testid="button-submit-feedback"
            >
              {isSubmittingFeedback ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.feedbackSubmitting}
                </>
              ) : (
                t.feedbackSubmit
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Success Dialog */}
      <Dialog open={showFeedbackSuccess} onOpenChange={setShowFeedbackSuccess}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-feedback-success">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              {t.feedbackSuccess}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">{t.feedbackSuccessDesc}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowFeedbackSuccess(false)} data-testid="button-close-feedback-success">
              {t.cancel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Referral Code Info Dialog */}
      <Dialog open={showReferralInfoDialog} onOpenChange={setShowReferralInfoDialog}>
        <DialogContent className="sm:max-w-lg" data-testid="dialog-referral-info">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              {t.yourReferralCode}
            </DialogTitle>
            <DialogDescription>
              {t.shareReferralCode}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">{t.yourReferralCode}</p>
              <p className="text-2xl font-mono font-bold text-primary tracking-wider">{user?.referralCode}</p>
              <Button
                variant={codeCopied ? "default" : "outline"}
                size="sm"
                onClick={handleCopyReferralCode}
                className="mt-3 gap-2"
                data-testid="button-dialog-copy-code"
              >
                {codeCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {codeCopied ? t.codeCopied : t.copyCode}
              </Button>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                {language === 'en' ? 'How to Earn PLUS Access' : 'Comment obtenir PLUS'}
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{language === 'en' 
                  ? 'Refer one technician who signs up using your code and you will unlock PLUS access.'
                  : 'Parrainez un technicien qui s\'inscrit avec votre code et vous debloquerez PLUS.'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                {language === 'en' ? 'PLUS Benefits' : 'Avantages PLUS'}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {language === 'en' ? 'Certification expiry alerts (60 and 30 day warnings)' : 'Alertes d\'expiration de certification'}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {language === 'en' ? 'Unlimited employer connections' : 'Connexions employeurs illimitees'}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {language === 'en' ? 'Enhanced irata task logging' : 'Journalisation irata amelioree'}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {language === 'en' ? 'Exportable work history (PDF)' : 'Historique de travail exportable (PDF)'}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {language === 'en' ? 'Profile visibility to employers' : 'Visibilite du profil aux employeurs'}
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowReferralInfoDialog(false)} data-testid="button-close-referral-info">
              {t.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoItem({ 
  label, 
  value, 
  icon, 
  masked 
}: { 
  label: string; 
  value: string | null | undefined; 
  icon?: React.ReactNode;
  masked?: boolean;
}) {
  if (!value) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-muted-foreground/50 italic">Not provided</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-sm">{value}</p>
    </div>
  );
}
