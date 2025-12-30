import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { getTechnicianNavGroups } from "@/lib/technicianNavigation";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate, formatDateTime, parseLocalDate } from "@/lib/dateUtils";
import { JOB_CATEGORIES, JOB_TYPES, getJobTypesByCategory, type JobCategory } from "@shared/jobTypes";
import type { HistoricalHours } from "@shared/schema";
import { EditableField, EditableDateField, EditableSwitch, EditableSelect, EditableTextarea, ProfilePhotoUploader } from "@/components/profile";
import { 
  User, 
  LogOut, 
  Edit2, 
  Save, 
  X,
  Check, 
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
  EyeOff,
  FolderOpen,
  Download,
  FileImage,
  FileArchive,
  File,
  GraduationCap,
  Menu,
  Info,
  Trash2
} from "lucide-react";
import { TechnicianDocumentRequests } from "@/components/TechnicianDocumentRequests";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { NotificationBell } from "@/components/NotificationBell";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { ActiveSessionBadge } from "@/components/ActiveSessionBadge";

type Language = 'en' | 'fr' | 'es';

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
    smsNotifications: "SMS Notifications",
    smsNotificationsDescription: "Receive text messages for team invitations",
    birthday: "Birth Date",
    address: "Address",
    streetAddress: "Street Address",
    addressPayrollInfo: "This information is required for payroll processing",
    city: "City",
    provinceState: "Province/State",
    country: "Country",
    postalCode: "Postal Code",
    emergencyContact: "Emergency Contact",
    contactName: "Contact Name",
    contactPhone: "Contact Phone",
    relationship: "Relationship",
    relationshipPlaceholder: "Select relationship",
    relationshipOptions: {
      mother: "Mother",
      father: "Father",
      spouse: "Spouse",
      partner: "Partner",
      brother: "Brother",
      sister: "Sister",
      son: "Son",
      daughter: "Daughter",
      grandparent: "Grandparent",
      friend: "Friend",
      roommate: "Roommate",
      other: "Other",
    },
    payrollInfo: "Payroll Information",
    sin: "Social Insurance Number",
    bankAccount: "Bank Account",
    transit: "Transit",
    institution: "Institution",
    account: "Account",
    driversLicense: "Driver License",
    licenseNumber: "License #",
    issuedDate: "Issued Date",
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
    step1: 'Click "Open IRATA Portal" to open the verification page',
    step2: "Enter your last name and license number",
    step3: "Take a screenshot of the verification result",
    step4: 'Come back here and click "Upload Screenshot"',
    openIrataPortal: "Open IRATA Portal",
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
    uploadDriversLicense: "Upload License",
    replaceDriversLicense: "Replace License",
    addDriversLicense: "Add License Photo",
    uploadDriversAbstract: "Upload Abstract",
    replaceDriversAbstract: "Replace Abstract",
    addDriversAbstract: "Add Abstract",
    uploadFirstAidCert: "Upload First Aid Certificate",
    replaceFirstAidCert: "Replace Certificate",
    addFirstAidCert: "Add Certificate",
    // User Certifications
    userCertifications: "My Certifications",
    myCertificationsDesc: "Upload and manage your professional certifications",
    addCertification: "Add Certification",
    certificationDescription: "Description",
    certificationDescriptionPlaceholder: "e.g., IRATA Level 3, Safety Training, etc.",
    certificationExpiry: "Expiry Date (optional)",
    uploadCertification: "Upload Certification",
    descriptionRequired: "Description is required",
    noCertifications: "No certifications uploaded yet",
    deleteCertification: "Delete Certification",
    deleteCertificationConfirm: "Are you sure you want to delete this certification?",
    certificationDeleted: "Certification deleted",
    certificationUploaded: "Certification uploaded successfully",
    uploadCertificationCard: "Upload Certification Card",
    replaceCertificationCard: "Replace Card",
    addCertificationCard: "Add Card",
    uploadIrataCertificationCard: "Upload IRATA Card",
    uploadSpratCertificationCard: "Upload SPRAT Card",
    irataCertificationCard: "IRATA Certification Card",
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
    uploadResume: "Upload Resume / CV",
    addResume: "Add Another Resume",
    resumeUploaded: "Resume Uploaded",
    documentUploaded: "Document Uploaded",
    documentUploadedDesc: "Your document has been uploaded successfully.",
    uploadFailed: "Upload Failed",
    selectFile: "Select a file to upload",
    uploading: "Uploading...",
    loading: "Loading...",
    ocrSuccess: "Document Scanned",
    ocrFieldsAutofilled: "{count} fields auto-filled from document",
    ocrBankFieldsAutofilled: "{count} bank fields auto-filled from document",
    enabled: "Enabled",
    disabled: "Disabled",
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
    irataVerified: "Your IRATA license has been verified!",
    spratVerified: "Your SPRAT license has been verified!",
    verificationIssue: "Verification Issue",
    couldNotVerify: "Could not verify license from screenshot",
    verificationFailed: "Verification Failed",
    failedToAnalyze: "Failed to analyze screenshot",
    openSpratPortal: "Open SPRAT Portal",
    spratStep1: 'Click "Open SPRAT Portal" to open the verification page',
    spratVerificationExplanation: "Employers require verified SPRAT certification status to ensure compliance with safety regulations and insurance requirements.",
    privacyNotice: "Privacy Notice",
    privacyText: "Your personal information is securely stored and used only by your employer for HR and payroll purposes. We never share your data externally.",
    errorNameRequired: "Name is required",
    errorInvalidEmail: "Invalid email",
    errorPhoneRequired: "Phone is required",
    errorInvalidPhone: "Please enter a valid phone number: (xxx) xxx-xxxx",
    errorEmergencyNameRequired: "Emergency contact name is required",
    errorEmergencyPhoneRequired: "Emergency contact phone is required",
    errorInvalidEmergencyPhone: "Please enter a valid phone number: (xxx) xxx-xxxx",
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
    linkedEmployer: "Linked Employer",
    inactiveContactEmployer: "You are currently inactive at {company}. Contact them to be reactivated.",
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
    goToWorkDashboard: "You are in Your Personal Passport View.",
    goToWorkDashboardButton: "Go to Work Dashboard",
    accessProjects: "Go to Work Dashboard to access the company dashboard. View projects, schedule, clock in/out, safety forms, auto-logging, etc.",
    dashboardDisabledNoCompany: "You need to be linked with a company to access the Work Dashboard. An invitation is sent by your employer and will appear here. Accept the invitation to get started.",
    dashboardDisabledTerminated: "Your employment has been terminated. Accept a new invitation to access the Work Dashboard.",
    dashboardDisabledInactive: "You are currently inactive. Contact your employer to be reactivated.",
    selectEmployer: "Select Employer",
    selectEmployerDesc: "Choose which employer's dashboard to access",
    connectedEmployers: "Connected Employers",
    primaryEmployer: "Primary",
    inactive: "Inactive",
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
    enterReferralCode: "Enter a Referral Code",
    enterReferralCodeDesc: "Have a friend's referral code? Enter it here to help them earn PLUS access.",
    referralCodePlaceholder: "Enter code (e.g., ABCD1234EFGH)",
    redeemCode: "Redeem Code",
    redeemingCode: "Redeeming...",
    referralCodeRedeemed: "Referral code redeemed!",
    referralCodeRedeemedDesc: "Thank you! Your referrer will now have PLUS access.",
    alreadyRedeemedCode: "You've already redeemed a referral code",
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
    performanceSafetyRating: "Personal Safety Rating",
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
    personalSafetyDocs: "Personal Safety Docs",
    personalSafetyDocsDesc: "Track your own equipment inspections",
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
    tabMore: "Your Referral Code",
    employerProfileTitle: "Get Discovered by Employers",
    employerProfileDesc: "When visible, employers searching for certified technicians can find and connect with you.",
    editEmployerProfile: "Edit",
    saveEmployerProfile: "Save",
    cancelEdit: "Cancel",
    visibilityStatus: "Talent Pool Visibility",
    visibleToEmployers: "You're Discoverable",
    hiddenFromEmployers: "Profile Hidden",
    visibilityOnDesc: "Employers can find you in talent searches. Turn off anytime.",
    visibilityOffDesc: "Toggle on to appear in employer searches and get job opportunities.",
    makeVisible: "Make Visible",
    makeHidden: "Hide Profile",
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
    close: "Close",
    profileTabPersonalInfo: "Personal Information",
    profileTabCertifications: "Certifications",
    profileTabDriver: "Driver",
    profileTabPayroll: "Payroll Information",
    profileTabResume: "Resume / CV",
    profileTabDocuments: "My Submitted Documents",
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
    smsNotifications: "Notifications SMS",
    smsNotificationsDescription: "Recevoir des messages texte pour les invitations d'équipe",
    birthday: "Date de naissance",
    address: "Adresse",
    streetAddress: "Adresse civique",
    addressPayrollInfo: "Ces informations sont requises pour le traitement de la paie",
    city: "Ville",
    provinceState: "Province/État",
    country: "Pays",
    postalCode: "Code postal",
    emergencyContact: "Contact d'urgence",
    contactName: "Nom du contact",
    contactPhone: "Téléphone du contact",
    relationship: "Relation",
    relationshipPlaceholder: "Sélectionner la relation",
    relationshipOptions: {
      mother: "Mère",
      father: "Père",
      spouse: "Époux/Épouse",
      partner: "Partenaire",
      brother: "Frère",
      sister: "Sœur",
      son: "Fils",
      daughter: "Fille",
      grandparent: "Grand-parent",
      friend: "Ami(e)",
      roommate: "Colocataire",
      other: "Autre",
    },
    payrollInfo: "Informations de paie",
    sin: "Numéro d'assurance sociale",
    bankAccount: "Compte bancaire",
    transit: "Transit",
    institution: "Institution",
    account: "Compte",
    driversLicense: "Permis de Conduire",
    licenseNumber: "Numéro de permis",
    issuedDate: "Date d'émission",
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
    step1: "Cliquez sur « Ouvrir le portail IRATA » pour ouvrir la page de vérification",
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
    uploadDriversLicense: "Téléverser Permis",
    replaceDriversLicense: "Remplacer le permis",
    addDriversLicense: "Ajouter une photo",
    uploadDriversAbstract: "Téléverser Relevé",
    replaceDriversAbstract: "Remplacer le relevé",
    addDriversAbstract: "Ajouter un relevé",
    uploadFirstAidCert: "Téléverser le certificat de premiers soins",
    replaceFirstAidCert: "Remplacer le certificat",
    addFirstAidCert: "Ajouter un certificat",
    // User Certifications
    userCertifications: "Mes Certifications",
    myCertificationsDesc: "Téléversez et gérez vos certifications professionnelles",
    addCertification: "Ajouter une Certification",
    certificationDescription: "Description",
    certificationDescriptionPlaceholder: "ex., IRATA Niveau 3, Formation Sécurité, etc.",
    certificationExpiry: "Date d'expiration (optionnel)",
    uploadCertification: "Téléverser la Certification",
    descriptionRequired: "La description est requise",
    noCertifications: "Aucune certification téléversée",
    deleteCertification: "Supprimer la Certification",
    deleteCertificationConfirm: "Êtes-vous sûr de vouloir supprimer cette certification ?",
    certificationDeleted: "Certification supprimée",
    certificationUploaded: "Certification téléversée avec succès",
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
    uploadResume: "Téléverser CV / Curriculum",
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
    loading: "Chargement...",
    ocrSuccess: "Document numérisé",
    ocrFieldsAutofilled: "{count} champs remplis automatiquement depuis le document",
    ocrBankFieldsAutofilled: "{count} champs bancaires remplis automatiquement depuis le document",
    enabled: "Activé",
    disabled: "Désactivé",
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
    irataVerified: "Votre licence IRATA a été vérifiée!",
    spratVerified: "Votre licence SPRAT a été vérifiée!",
    verificationIssue: "Problème de vérification",
    couldNotVerify: "Impossible de vérifier la licence à partir de la capture d'écran",
    verificationFailed: "Échec de la vérification",
    failedToAnalyze: "Échec de l'analyse de la capture d'écran",
    openSpratPortal: "Ouvrir le portail SPRAT",
    spratStep1: 'Cliquez sur « Ouvrir le portail SPRAT » pour accéder à la page de vérification',
    spratVerificationExplanation: "Les employeurs exigent que le statut de certification SPRAT soit vérifié pour assurer la conformité aux réglementations de sécurité et aux exigences d'assurance.",
    privacyNotice: "Avis de confidentialité",
    privacyText: "Vos informations personnelles sont stockées en toute sécurité et utilisées uniquement par votre employeur à des fins de RH et de paie. Nous ne partageons jamais vos données à l'externe.",
    errorNameRequired: "Le nom est requis",
    errorInvalidEmail: "Courriel invalide",
    errorPhoneRequired: "Le téléphone est requis",
    errorInvalidPhone: "Veuillez entrer un numéro valide: (xxx) xxx-xxxx",
    errorEmergencyNameRequired: "Le nom du contact d'urgence est requis",
    errorEmergencyPhoneRequired: "Le téléphone du contact d'urgence est requis",
    errorInvalidEmergencyPhone: "Veuillez entrer un numéro valide: (xxx) xxx-xxxx",
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
    linkedEmployer: "Employeur Lié",
    inactiveContactEmployer: "Vous êtes actuellement inactif chez {company}. Contactez-les pour être réactivé.",
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
    goToWorkDashboard: "Vous êtes dans votre vue Passeport personnel.",
    goToWorkDashboardButton: "Accéder au Tableau de Bord",
    accessProjects: "Accéder au Tableau de Bord pour accéder au tableau de bord de l'entreprise. Voir les projets, l'horaire, pointage, formulaires de sécurité, journalisation automatique, etc.",
    dashboardDisabledNoCompany: "Vous devez être lié à une entreprise pour accéder au tableau de bord. Acceptez une invitation ci-dessous pour commencer.",
    dashboardDisabledTerminated: "Votre emploi a été résilié. Acceptez une nouvelle invitation pour accéder au tableau de bord.",
    dashboardDisabledInactive: "Vous êtes actuellement inactif. Contactez votre employeur pour être réactivé.",
    selectEmployer: "Sélectionner l'employeur",
    selectEmployerDesc: "Choisissez le tableau de bord de l'employeur à accéder",
    connectedEmployers: "Employeurs connectés",
    primaryEmployer: "Principal",
    inactive: "Inactif",
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
    enterReferralCode: "Entrer un code de parrainage",
    enterReferralCodeDesc: "Vous avez un code de parrainage d'un ami? Entrez-le ici pour l'aider a obtenir l'acces PLUS.",
    referralCodePlaceholder: "Entrer le code (ex: ABCD1234EFGH)",
    redeemCode: "Echanger le code",
    redeemingCode: "Echange en cours...",
    referralCodeRedeemed: "Code de parrainage echange!",
    referralCodeRedeemedDesc: "Merci! Votre parrain aura maintenant l'acces PLUS.",
    alreadyRedeemedCode: "Vous avez deja echange un code de parrainage",
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
    personalSafetyDocs: "Documents de securite",
    personalSafetyDocsDesc: "Suivez vos inspections d'equipement",
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
    tabMore: "Votre code de parrainage",
    employerProfileTitle: "Soyez découvert par les employeurs",
    employerProfileDesc: "Lorsque visible, les employeurs recherchant des techniciens certifiés peuvent vous trouver et vous contacter.",
    editEmployerProfile: "Modifier",
    saveEmployerProfile: "Sauvegarder",
    cancelEdit: "Annuler",
    visibilityStatus: "Visibilité dans le bassin de talents",
    visibleToEmployers: "Vous êtes découvrable",
    hiddenFromEmployers: "Profil caché",
    visibilityOnDesc: "Les employeurs peuvent vous trouver. Désactivez à tout moment.",
    visibilityOffDesc: "Activez pour apparaître dans les recherches et recevoir des opportunités.",
    makeVisible: "Rendre visible",
    makeHidden: "Cacher le profil",
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
    close: "Fermer",
    profileTabPersonalInfo: "Informations personnelles",
    profileTabCertifications: "Certifications",
    profileTabDriver: "Conducteur",
    profileTabPayroll: "Informations de paie",
    profileTabResume: "CV",
    profileTabDocuments: "Mes documents soumis",
  },
  es: {
    technicianPortal: "Portal del Tecnico",
    signOut: "Cerrar Sesion",
    editProfile: "Editar Perfil",
    cancel: "Cancelar",
    saveChanges: "Guardar Cambios",
    saving: "Guardando...",
    personalInfo: "Informacion Personal",
    fullName: "Nombre Completo",
    email: "Correo Electronico",
    phoneNumber: "Numero de Telefono",
    smsNotifications: "Notificaciones SMS",
    smsNotificationsDescription: "Recibir mensajes de texto para invitaciones de equipo",
    birthday: "Fecha de Nacimiento",
    address: "Direccion",
    streetAddress: "Direccion",
    addressPayrollInfo: "Esta información es necesaria para el procesamiento de nómina",
    city: "Ciudad",
    provinceState: "Provincia/Estado",
    country: "Pais",
    postalCode: "Codigo Postal",
    emergencyContact: "Contacto de Emergencia",
    contactName: "Nombre del Contacto",
    contactPhone: "Telefono del Contacto",
    relationship: "Relacion",
    relationshipPlaceholder: "Seleccionar relacion",
    relationshipOptions: {
      mother: "Madre",
      father: "Padre",
      spouse: "Esposo/Esposa",
      partner: "Pareja",
      brother: "Hermano",
      sister: "Hermana",
      son: "Hijo",
      daughter: "Hija",
      grandparent: "Abuelo/Abuela",
      friend: "Amigo/Amiga",
      roommate: "Companero de cuarto",
      other: "Otro",
    },
    payrollInfo: "Informacion de Nomina",
    sin: "Numero de Seguro Social",
    bankAccount: "Cuenta Bancaria",
    transit: "Transito",
    institution: "Institucion",
    account: "Cuenta",
    driversLicense: "Licencia de Conducir",
    licenseNumber: "Numero de Licencia",
    issuedDate: "Fecha de Emision",
    expiry: "Vencimiento",
    medicalConditions: "Condiciones Medicas",
    specialMedicalConditions: "Condiciones Medicas Especiales",
    medicalPlaceholder: "Opcional - Cualquier condicion que su empleador deba conocer",
    certifications: "Certificaciones",
    baselineHours: "Horas Base",
    hours: "horas",
    certificationCard: "Tarjeta de Certificacion",
    tapToViewPdf: "Toque para ver PDF",
    tapToViewDocument: "Toque para ver documento",
    licenseVerified: "Licencia Verificada",
    lastVerified: "Ultima verificacion",
    reverifyLicense: "Re-verificar Su Licencia",
    verifyLicenseValidity: "Verificar la Validez de Su Licencia",
    verificationExplanation: "Los empleadores requieren el estado de certificacion verificado para garantizar el cumplimiento de las regulaciones de seguridad y los requisitos de seguro.",
    howItWorks: "Como funciona:",
    step1: 'Haga clic en "Abrir Portal IRATA" para abrir la pagina de verificacion',
    step2: "Ingrese su apellido y numero de licencia",
    step3: "Tome una captura de pantalla del resultado de verificacion",
    step4: 'Regrese aqui y haga clic en "Subir Captura"',
    openIrataPortal: "Abrir Portal IRATA",
    uploadVerificationScreenshot: "Subir Captura de Verificacion",
    analyzingScreenshot: "Analizando Captura...",
    name: "Nombre",
    license: "Licencia",
    level: "Nivel",
    validUntil: "Valido Hasta",
    confidence: "Confianza",
    firstAid: "Primeros Auxilios",
    firstAidType: "Tipo",
    expiresOn: "Vence el",
    expired: "Vencido",
    expiringSoon: "Vence Pronto",
    daysUntilExpiry: "dias hasta el vencimiento",
    employers: "Empleadores",
    noConnectedEmployers: "Sin empleadores conectados",
    noConnectedEmployersDesc: "Cuando te conectes con empresas, apareceran aqui",
    pendingConnections: "Conexiones Pendientes",
    activeConnections: "Conexiones Activas",
    noPendingConnections: "Sin conexiones pendientes",
    past: "Anteriores",
    present: "Presente",
    connectToCompany: "Conectar con Empresa",
    employerCode: "Codigo del Empleador",
    employerCodePlaceholder: "Ingrese el codigo de 6 digitos de su empleador",
    connect: "Conectar",
    connecting: "Conectando...",
    connectedToEmployer: "Conectado a Empleador",
    connectedToEmployerDesc: "Ahora esta conectado con esta empresa",
    connectionFailed: "Conexion Fallida",
    errorConnecting: "Error al conectar con el empleador",
    accept: "Aceptar",
    decline: "Rechazar",
    accepting: "Aceptando...",
    declining: "Rechazando...",
    connectionAccepted: "Conexion Aceptada",
    connectionDeclined: "Conexion Rechazada",
    documents: "Documentos",
    noDocuments: "Sin documentos",
    noDocumentsDesc: "Suba sus documentos para que los empleadores los vean",
    resume: "Curriculum",
    noResume: "Sin curriculum subido",
    noResumeDesc: "Suba un curriculum para que los empleadores lo vean",
    uploadResume: "Subir CV / Curriculum",
    addResume: "Agregar Curriculum",
    uploadResumeDesc: "Suba su curriculum en formato PDF o documento",
    dragDropResume: "Arrastre y suelte su curriculum aqui",
    orClickToUpload: "o haga clic para subir",
    supportedFormats: "Formatos soportados: PDF, DOC, DOCX (max 5MB)",
    uploading: "Subiendo...",
    loading: "Cargando...",
    ocrSuccess: "Documento Escaneado",
    ocrFieldsAutofilled: "{count} campos completados automáticamente del documento",
    ocrBankFieldsAutofilled: "{count} campos bancarios completados automáticamente del documento",
    enabled: "Habilitado",
    disabled: "Deshabilitado",
    notProvided: "No proporcionado",
    resumeUploaded: "Curriculum Subido",
    resumeUploadedDesc: "Su curriculum ha sido subido exitosamente",
    resumeUploadFailed: "Error al subir el curriculum",
    deleteResume: "Eliminar Curriculum",
    resumeDeleted: "Curriculum Eliminado",
    confirmDeleteResume: "Esta seguro de que desea eliminar su curriculum?",
    delete: "Eliminar",
    workHistory: "Historial de Trabajo",
    noWorkHistory: "Sin historial de trabajo",
    noWorkHistoryDesc: "Su historial de trabajo aparecera aqui despues de fichar.",
    totalHours: "Horas Totales",
    thisWeek: "Esta Semana",
    thisMonth: "Este Mes",
    allTime: "Todo el Tiempo",
    logbook: "Libro de Registro",
    logbookDesc: "Registre y rastree sus horas de trabajo de acceso con cuerdas para la progresion de certificacion",
    viewLogbook: "Ver Libro de Registro",
    previousHours: "Horas Anteriores",
    previousHoursDesc: "Horas de trabajo antes de unirse a esta plataforma (no contadas en los totales)",
    addPreviousHours: "Agregar Horas Anteriores",
    noLoggedHours: "Sin horas registradas",
    noLoggedHoursDesc: "Sus sesiones de trabajo apareceran aqui despues de fichar.",
    noPreviousHours: "Sin horas anteriores registradas",
    noPreviousHoursDesc: "Agregue experiencias de trabajo historicas que no se contaran en sus totales de certificacion.",
    dateRange: "Rango de Fechas",
    to: "a",
    building: "Edificio",
    buildingName: "Nombre del Edificio",
    buildingAddress: "Direccion del Edificio",
    buildingHeight: "Altura del Edificio",
    heightPlaceholder: "ej: 25 pisos, 100m",
    tasksPerformed: "Tareas Realizadas",
    selectTasks: "Seleccionar tareas realizadas",
    hoursWorked: "Horas Trabajadas",
    previousEmployer: "Empleador Anterior",
    previousEmployerPlaceholder: "Nombre de la empresa (opcional)",
    notes: "Notas",
    notesPlaceholder: "Detalles adicionales (opcional)",
    startDate: "Fecha de Inicio",
    endDate: "Fecha de Fin",
    savePreviousHours: "Guardar Horas Anteriores",
    savingHours: "Guardando...",
    previousHoursAdded: "Horas Anteriores Agregadas",
    previousHoursAddedDesc: "Su experiencia de trabajo anterior ha sido guardada.",
    previousHoursDeleted: "Horas Anteriores Eliminadas",
    previousHoursDeletedDesc: "La entrada de horas anteriores ha sido eliminada.",
    deletePreviousHours: "Eliminar",
    confirmDeletePreviousHours: "Esta seguro de que desea eliminar esta entrada de horas anteriores?",
    deleteConfirm: "Eliminar",
    cancelDelete: "Cancelar",
    logbookDisclaimer: "Esta es solo una herramienta de seguimiento personal. Aun debe registrar todas sus horas en su libro de registro oficial irata/SPRAT - este registro digital no lo reemplaza.",
    jobBoard: "Bolsa de Trabajo",
    jobBoardDesc: "Buscar oportunidades y hacer visible su perfil a los empleadores",
    browseJobs: "Ver Ofertas",
    yourReferralCode: "Su Codigo de Referencia",
    shareReferralCode: "Comparta este codigo con otros tecnicos para invitarlos a OnRopePro",
    referralPremiumBenefit: "Obtendra acceso PLUS cuando se use su codigo!",
    viewPlusBenefits: "Ver Beneficios PLUS",
    plusBenefitsTitle: "Beneficios PLUS",
    plusBenefit1: "Conexiones ilimitadas con empleadores",
    plusBenefit2: "Registro detallado de tareas mejorado",
    plusBenefit3: "Historial de trabajo exportable (PDF/CSV)",
    plusBenefit4: "Analiticas de historial de trabajo",
    plusBenefit5: "Alertas de vencimiento de certificacion a 60 dias",
    plusBenefit6: "Visibilidad del perfil de empresa de acceso con cuerdas (opt-in)",
    plusUnlockInfo: "Desbloquear: Refiera 1 tecnico verificado que complete la creacion de su cuenta",
    plusLockedFeature: "Funcion PLUS",
    plusLockedDesc: "Refiera un tecnico para desbloquear",
    copyCode: "Copiar Codigo",
    codeCopied: "Copiado!",
    referredTimes: "Referido {count} tecnico(s)",
    yourReferrals: "Sus Referencias",
    noReferralsYet: "Aun no hay referencias. Comparta su codigo para comenzar!",
    joinedOn: "Unido el",
    noReferralCodeYet: "Aun no hay codigo de referencia",
    enterReferralCode: "Ingresar un codigo de referencia",
    enterReferralCodeDesc: "Tienes el codigo de referencia de un amigo? Ingresalo aqui para ayudarle a obtener acceso PLUS.",
    referralCodePlaceholder: "Ingresar codigo (ej: ABCD1234EFGH)",
    redeemCode: "Canjear codigo",
    redeemingCode: "Canjeando...",
    referralCodeRedeemed: "Codigo de referencia canjeado!",
    referralCodeRedeemedDesc: "Gracias! Tu referidor ahora tendra acceso PLUS.",
    alreadyRedeemedCode: "Ya has canjeado un codigo de referencia",
    editExpirationDate: "Editar fecha de vencimiento",
    setExpirationDate: "Establecer fecha de vencimiento",
    expirationDateUpdated: "Fecha de vencimiento actualizada",
    expirationDateUpdateFailed: "Error al actualizar la fecha de vencimiento",
    selectDate: "Seleccionar fecha",
    setExperience: "Establecer experiencia",
    editExperience: "Editar experiencia",
    experienceUpdated: "Fecha de inicio de experiencia actualizada",
    experienceUpdateFailed: "Error al actualizar la fecha de experiencia",
    whenDidYouStart: "Cuando comenzo su carrera de acceso con cuerdas?",
    addExperience: "Agregar su fecha de inicio de experiencia",
    referralCodeGenerating: "Su codigo de referencia se generara cuando complete el registro",
    expiringIn60Days: "Vence en 60 dias",
    expiringIn30Days: "Urgente: 30 dias",
    certificationExpiryBannerTitle: "Certificacion Vence Pronto!",
    certificationExpiryBannerMessage: "Su certificacion {cert} vence el {date}. Renueve ahora para evitar interrupciones.",
    proBadge: "PLUS",
    proBadgeTooltip: "Miembro PLUS",
    verified: "Verificado",
    firstAidCertificate: "Certificado de Primeros Auxilios",
    uploadedDocuments: "Documentos Subidos",
    licensePhoto: "Foto de Licencia",
    driverAbstract: "Extracto de Conductor",
    voidCheque: "Cheque Anulado / Info Bancaria",
    uploadDocument: "Subir Documento",
    uploadVoidCheque: "Subir Cheque Anulado",
    replaceVoidCheque: "Reemplazar Cheque",
    addVoidCheque: "Agregar Otro Cheque",
    uploadDriversLicense: "Subir Licencia",
    replaceDriversLicense: "Reemplazar Licencia",
    addDriversLicense: "Agregar Foto de Licencia",
    uploadDriversAbstract: "Subir Extracto",
    replaceDriversAbstract: "Reemplazar Extracto",
    addDriversAbstract: "Agregar Extracto",
    uploadFirstAidCert: "Subir Certificado de Primeros Auxilios",
    replaceFirstAidCert: "Reemplazar Certificado",
    addFirstAidCert: "Agregar Certificado",
    // User Certifications
    userCertifications: "Mis Certificaciones",
    myCertificationsDesc: "Sube y gestiona tus certificaciones profesionales",
    addCertification: "Agregar Certificación",
    certificationDescription: "Descripción",
    certificationDescriptionPlaceholder: "ej., IRATA Nivel 3, Capacitación de Seguridad, etc.",
    certificationExpiry: "Fecha de Vencimiento (opcional)",
    uploadCertification: "Subir Certificación",
    descriptionRequired: "La descripción es obligatoria",
    noCertifications: "No hay certificaciones subidas",
    deleteCertification: "Eliminar Certificación",
    deleteCertificationConfirm: "¿Estás seguro de que quieres eliminar esta certificación?",
    certificationDeleted: "Certificación eliminada",
    certificationUploaded: "Certificación subida exitosamente",
    uploadCertificationCard: "Subir Tarjeta de Certificacion",
    replaceCertificationCard: "Reemplazar Tarjeta",
    addCertificationCard: "Agregar Tarjeta",
    uploadIrataCertificationCard: "Subir Tarjeta irata",
    uploadSpratCertificationCard: "Subir Tarjeta SPRAT",
    irataCertificationCard: "Tarjeta de Certificacion irata",
    spratCertificationCard: "Tarjeta de Certificacion SPRAT",
    experience: "Experiencia",
    ropeAccessExperience: "Experiencia en Acceso con Cuerdas",
    experienceStartDate: "Fecha de Inicio de Experiencia",
    experienceStartDateHelp: "Cuando comenzo su carrera de acceso con cuerdas?",
    yearsMonths: "{years} ano(s), {months} mes(es)",
    lessThanMonth: "Menos de un mes",
    startedOn: "Iniciado el",
    notSet: "No establecido",
    specialties: "Especialidades de Acceso con Cuerdas",
    specialtiesDesc: "Seleccione los tipos de trabajo en los que se especializa",
    noSpecialties: "Sin especialidades seleccionadas",
    addSpecialty: "Agregar Especialidad",
    removeSpecialty: "Eliminar",
    selectCategory: "Seleccionar Categoria",
    selectJobType: "Seleccionar Tipo de Trabajo",
    documentUploaded: "Documento Subido",
    documentUploadedDesc: "Su documento ha sido subido exitosamente.",
    uploadFailed: "Error al Subir",
    selectFile: "Seleccione un archivo para subir",
    loadingProfile: "Cargando su perfil...",
    pleaseLogin: "Por favor inicie sesion para ver su perfil.",
    goToLogin: "Ir a Iniciar Sesion",
    changesSaved: "Sus cambios han sido guardados exitosamente.",
    updateFailed: "Error al Actualizar",
    invalidFile: "Archivo invalido",
    uploadImageFile: "Por favor suba un archivo de imagen (captura)",
    verificationSuccessful: "Verificacion Exitosa",
    irataVerified: "Su licencia IRATA ha sido verificada!",
    spratVerified: "Su licencia SPRAT ha sido verificada!",
    verificationIssue: "Problema de Verificacion",
    couldNotVerify: "No se pudo verificar la licencia de la captura",
    verificationFailed: "Verificacion Fallida",
    failedToAnalyze: "Error al analizar la captura",
    openSpratPortal: "Abrir Portal SPRAT",
    spratStep1: 'Haga clic en "Abrir Portal SPRAT" para abrir la pagina de verificacion',
    spratVerificationExplanation: "Los empleadores requieren el estado de certificacion SPRAT verificado para garantizar el cumplimiento.",
    privacyNotice: "Aviso de Privacidad",
    privacyText: "Su informacion personal esta almacenada de forma segura y solo es utilizada por su empleador para propositos de RRHH y nomina.",
    teamInvitations: "Invitaciones de Equipo",
    pendingInvitations: "Invitaciones Pendientes",
    noInvitations: "Sin invitaciones pendientes",
    noInvitationsDesc: "Cuando una empresa lo invite a unirse a su equipo, aparecera aqui.",
    invitedBy: "Invitacion de",
    acceptInvitation: "Aceptar",
    declineInvitation: "Rechazar",
    acceptingInvitation: "Aceptando...",
    decliningInvitation: "Rechazando...",
    invitationAccepted: "Invitacion Aceptada",
    welcomeToTeam: "Bienvenido al equipo!",
    invitationDeclined: "Invitacion Rechazada",
    declinedMessage: "Ha rechazado esta invitacion.",
    invitationError: "Error",
    invitationMessage: "Mensaje",
    invitedOn: "Invitado el",
    linkedEmployer: "Empleador Vinculado",
    inactiveContactEmployer: "Actualmente está inactivo en {company}. Contáctelos para ser reactivado.",
    currentlyEmployedBy: "Actualmente esta empleado por",
    leaveCompany: "Dejar Empresa",
    leavingCompany: "Saliendo...",
    leaveCompanyConfirm: "Esta seguro de que desea dejar esta empresa?",
    leaveCompanyWarning: "Esto lo eliminara de su lista activa. Aun puede ser invitado por otras empresas.",
    confirmLeave: "Si, Dejar Empresa",
    cancelLeave: "Cancelar",
    leftCompany: "Dejo la Empresa",
    leftCompanyDesc: "Ha dejado exitosamente la empresa. Ahora puede aceptar invitaciones de otras empresas.",
    leaveError: "Error",
    yourCompensation: "Su Compensacion",
    year: "ano",
    hour: "hr",
    goToWorkDashboard: "Estás en tu Vista de Pasaporte Personal.",
    goToWorkDashboardButton: "Ir al Panel de Trabajo",
    accessProjects: "Ir al Panel de Trabajo para acceder al panel de la empresa. Ver proyectos, horario, entrada/salida, formularios de seguridad, registro automático, etc.",
    dashboardDisabledNoCompany: "Necesita estar vinculado con una empresa para acceder al Panel de Trabajo.",
    dashboardDisabledTerminated: "Su empleo ha sido terminado. Acepte una nueva invitacion para acceder al Panel.",
    dashboardDisabledInactive: "Actualmente está inactivo. Contacte a su empleador para ser reactivado.",
    selectEmployer: "Seleccionar Empleador",
    selectEmployerDesc: "Elija a que panel de empleador acceder",
    connectedEmployers: "Empleadores Conectados",
    primaryEmployer: "Principal",
    inactive: "Inactivo",
    active: "Activo",
    setPrimary: "Establecer como Principal",
    continueToEmployer: "Continuar",
    noEmployersConnected: "Sin empleadores conectados",
    myLoggedHours: "Mis Horas Registradas",
    viewLoggedHoursDesc: "Rastree el progreso de su carrera de acceso con cuerdas",
    viewLoggedHours: "Ver Horas Registradas",
    loggedHoursFeatures: "Escanee sus paginas de libro de registro con IA o agregue experiencia de trabajo anterior manualmente",
    totalHoursLogged: "Total de Horas Registradas",
    hoursLogged: "horas registradas",
    totalHoursLabel: "horas totales",
    baselinePlus: "base +",
    fromSessions: "de sesiones",
    workSessions: "Sesiones de Trabajo",
    performanceSafetyRating: "Calificacion de Seguridad Personal",
    overallScore: "Puntuacion General",
    harnessCompliance: "Inspecciones de Arnes",
    documentCompliance: "Documentos Firmados",
    sessionsAnalyzed: "Sesiones Analizadas",
    noPerformanceData: "Sin datos de rendimiento",
    noPerformanceDataDesc: "Complete sesiones de trabajo para ver su calificacion",
    ratingExcellent: "Excelente",
    ratingGood: "Bueno",
    ratingNeedsImprovement: "Necesita Mejorar",
    ratingPoor: "Deficiente",
    dropsExceeded: "Objetivo Superado",
    dropsOnTarget: "En Objetivo",
    dropsBelowTarget: "Bajo Objetivo",
    dropsNa: "N/A",
    harnessYes: "Inspeccion Hecha",
    harnessNo: "Sin Inspeccion",
    sessionRating: "Calificacion de Sesion",
    improvementNeeded: "Areas de mejora:",
    improveHarness: "Realizar inspeccion de arnes antes de fichar",
    improveDocs: "Firmar todos los documentos de seguridad asignados",
    personalSafetyDocs: "Documentos de seguridad",
    personalSafetyDocsDesc: "Rastree sus inspecciones de equipo",
    feedback: "Comentarios",
    feedbackDesc: "Comparta sus sugerencias o reporte problemas al equipo de OnRopePro",
    sendFeedback: "Enviar Comentarios",
    feedbackTitle: "Titulo",
    feedbackTitlePlaceholder: "Breve resumen de sus comentarios",
    feedbackCategory: "Categoria",
    feedbackCategoryFeature: "Nueva Funcion",
    feedbackCategoryImprovement: "Mejora",
    feedbackCategoryBug: "Reporte de Error",
    feedbackCategoryOther: "Otro",
    feedbackDescription: "Descripcion",
    feedbackDescriptionPlaceholder: "Por favor describa sus comentarios en detalle...",
    feedbackPriority: "Prioridad",
    feedbackPriorityLow: "Baja",
    feedbackPriorityNormal: "Normal",
    feedbackPriorityHigh: "Alta",
    feedbackPriorityUrgent: "Urgente",
    feedbackScreenshot: "Captura de Pantalla (Opcional)",
    feedbackScreenshotAdd: "Agregar captura de pantalla",
    feedbackSubmit: "Enviar Comentarios",
    feedbackSubmitting: "Enviando...",
    feedbackSuccess: "Gracias!",
    feedbackSuccessDesc: "Sus comentarios han sido enviados. Apreciamos su contribucion y los revisaremos cuidadosamente.",
    feedbackError: "Error al enviar comentarios",
    viewMyFeedback: "Ver mis comentarios",
    myFeedbackTitle: "Mis Comentarios",
    tabHome: "Inicio",
    tabProfile: "Perfil",
    tabEmployer: "Vista Empleador",
    tabWork: "Trabajo",
    tabMore: "Tu código de referencia",
    profileTabPersonalInfo: "Información Personal",
    profileTabCertifications: "Certificaciones",
    profileTabDriver: "Conductor",
    profileTabPayroll: "Información de Nómina",
    profileTabResume: "Currículum",
    profileTabDocuments: "Mis Documentos Enviados",
    employerProfileTitle: "Sea descubierto por empleadores",
    employerProfileDesc: "Cuando es visible, los empleadores que buscan tecnicos certificados pueden encontrarlo y contactarlo.",
    editEmployerProfile: "Editar",
    saveEmployerProfile: "Guardar",
    cancelEdit: "Cancelar",
    visibilityStatus: "Visibilidad en el banco de talentos",
    visibleToEmployers: "Eres descubrible",
    hiddenFromEmployers: "Perfil oculto",
    visibilityOnDesc: "Los empleadores pueden encontrarte. Desactiva en cualquier momento.",
    visibilityOffDesc: "Activa para aparecer en busquedas y recibir oportunidades de trabajo.",
    makeVisible: "Hacer Visible",
    makeHidden: "Ocultar Perfil",
    backToHome: "Volver al Inicio",
    quickActions: "Acciones Rapidas",
    myFeedbackDesc: "Vea sus comentarios enviados y las respuestas de OnRopePro",
    noFeedbackYet: "Aun no ha enviado comentarios",
    feedbackStatus: "Estado",
    feedbackResponses: "Respuestas",
    fromTeam: "Equipo OnRopePro",
    fromYou: "Usted",
    replyToFeedback: "Responder",
    sendReply: "Enviar Respuesta",
    replyPlaceholder: "Escriba su respuesta...",
    newResponse: "Nueva Respuesta",
    close: "Cerrar",
    profileUpdated: "Perfil Actualizado",
    profileUpdatedDesc: "Su perfil ha sido guardado exitosamente",
    profileUpdateFailed: "Error al actualizar el perfil",
    errorNameRequired: "El nombre es requerido",
    errorInvalidEmail: "Direccion de correo invalida",
    errorPhoneRequired: "El telefono es requerido",
    errorInvalidPhone: "Ingrese un numero valido: (xxx) xxx-xxxx",
    errorEmergencyNameRequired: "El nombre del contacto de emergencia es requerido",
    errorEmergencyPhoneRequired: "El telefono del contacto de emergencia es requerido",
    errorInvalidEmergencyPhone: "Ingrese un numero valido: (xxx) xxx-xxxx",
  }
};

// North American phone regex - accepts (xxx) xxx-xxxx, xxx-xxx-xxxx, or 10 digits
const phoneRegex = /^(\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\d{10})$/;

// Format phone number for display as (xxx) xxx-xxxx
const formatPhoneNumber = (phone: string | null | undefined): string | null => {
  if (!phone) return null;
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10) return phone; // Return as-is if not 10 digits
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const createProfileSchema = (t: typeof translations['en']) => z.object({
  name: z.string().min(1, t.errorNameRequired),
  email: z.string().email(t.errorInvalidEmail),
  employeePhoneNumber: z.string()
    .min(1, t.errorPhoneRequired)
    .regex(phoneRegex, t.errorInvalidPhone),
  smsNotificationsEnabled: z.boolean().optional(),
  employeeStreetAddress: z.string().optional(),
  employeeCity: z.string().optional(),
  employeeProvinceState: z.string().optional(),
  employeeCountry: z.string().optional(),
  employeePostalCode: z.string().optional(),
  emergencyContactName: z.string().min(1, t.errorEmergencyNameRequired),
  emergencyContactPhone: z.string()
    .min(1, t.errorEmergencyPhoneRequired)
    .regex(phoneRegex, t.errorInvalidEmergencyPhone),
  emergencyContactRelationship: z.string().optional(),
  socialInsuranceNumber: z.string().optional(),
  bankTransitNumber: z.string().optional(),
  bankInstitutionNumber: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseIssuedDate: z.string().optional(),
  driversLicenseExpiry: z.string().optional(),
  birthday: z.string().optional(),
  specialMedicalConditions: z.string().optional(),
  firstAidType: z.string().optional(),
  firstAidExpiry: z.string().optional(),
  irataBaselineHours: z.string().optional(),
  ropeAccessStartDate: z.string().optional(),
});

type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;

// Helper function to mask sensitive data - shows only last 4 characters
const maskSensitiveData = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const cleanValue = value.replace(/[\s-]/g, ''); // Remove spaces and dashes for counting
  if (cleanValue.length <= 4) return value; // Don't mask if 4 or fewer chars
  const visiblePart = value.slice(-4);
  const maskedLength = value.length - 4;
  return 'x'.repeat(maskedLength) + visiblePart;
};

// Helper function to mask bank account composite (transit-institution-account)
const maskBankAccount = (transit: string | null | undefined, institution: string | null | undefined, account: string | null | undefined): string | null => {
  // Build parts array with masked values - show any parts that exist
  const parts: string[] = [];
  
  if (transit) {
    // Mask transit: show last 2 digits if length > 2, otherwise show all
    const maskedTransit = transit.length > 2
      ? 'x'.repeat(transit.length - 2) + transit.slice(-2)
      : transit;
    parts.push(maskedTransit);
  }
  
  if (institution) {
    // Mask institution: show last 1 digit if length > 1, otherwise show all  
    const maskedInstitution = institution.length > 1
      ? 'x'.repeat(institution.length - 1) + institution.slice(-1)
      : institution;
    parts.push(maskedInstitution);
  }
  
  if (account) {
    // Mask account: show last 4 digits if length > 4, otherwise show all
    const maskedAccount = account.length > 4 
      ? 'x'.repeat(account.length - 4) + account.slice(-4)
      : account;
    parts.push(maskedAccount);
  }
  
  return parts.length > 0 ? parts.join('-') : null;
};

// Helper component to display submitted documents from document requests
function MySubmittedDocuments({ language }: { language: Language }) {
  const { data: requestsData, isLoading } = useQuery<{ 
    requests: Array<{
      id: string;
      title: string;
      status: string;
      requestedAt: string;
      respondedAt: string | null;
      files: Array<{
        id: string;
        fileName: string;
        fileSize: number;
        fileType: string;
        uploadedAt: string;
      }>;
      company?: {
        id: string;
        name?: string | null;
      };
    }>;
  }>({
    queryKey: ["/api/technicians/me/document-requests"],
  });

  const fulfilledRequests = requestsData?.requests?.filter(r => r.status === 'fulfilled' && r.files?.length > 0) || [];
  const allFiles = fulfilledRequests.flatMap(request => 
    request.files.map(file => ({
      ...file,
      requestTitle: request.title,
      companyName: request.company?.name || (language === 'en' ? 'Unknown Employer' : 'Employeur inconnu'),
      respondedAt: request.respondedAt,
    }))
  );

  // Sort files by upload date (newest first)
  const sortedFiles = allFiles.sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType.includes('pdf')) return FileText;
    if (fileType.includes('zip') || fileType.includes('archive')) return FileArchive;
    return File;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sortedFiles.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">
          {language === 'en' 
            ? 'No submitted documents yet'
            : 'Aucun document soumis pour le moment'}
        </p>
        <p className="text-xs mt-1">
          {language === 'en'
            ? 'Documents you upload for employer requests will appear here'
            : 'Les documents que vous téléchargez pour les demandes employeur apparaîtront ici'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedFiles.map((file) => {
        const FileIcon = getFileIcon(file.fileType);
        return (
          <div 
            key={file.id} 
            className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
            data-testid={`my-submitted-doc-${file.id}`}
          >
            <FileIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.fileName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span>{formatFileSize(file.fileSize)}</span>
                <span>•</span>
                <span>{file.companyName}</span>
                <span>•</span>
                <span>{file.requestTitle}</span>
              </div>
            </div>
            <a
              href={`/api/document-request-files/${file.id}/download`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded-md transition-colors flex-shrink-0"
              data-testid={`download-my-doc-${file.id}`}
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        );
      })}
    </div>
  );
}

export default function TechnicianPortal() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileInnerTab, setProfileInnerTab] = useState<string>('personal');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Use central i18n system
  const { t: i18nT, i18n } = useTranslation();
  const language = i18n.language as Language;
  
  // Create adapter that provides same interface as local translations
  // Falls back to local translations for any missing keys
  const t = useMemo(() => {
    const localT = translations[language] || translations.en;
    return new Proxy(localT, {
      get(target, prop: string) {
        const i18nValue = i18nT(`technicianPortal.${prop}`, { defaultValue: '' });
        if (i18nValue && i18nValue !== `technicianPortal.${prop}`) {
          return i18nValue;
        }
        return target[prop as keyof typeof target] || prop;
      }
    });
  }, [language, i18nT]);
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
      smsNotificationsEnabled: false,
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
      driversLicenseIssuedDate: "",
      driversLicenseExpiry: "",
      birthday: "",
      specialMedicalConditions: "",
      firstAidType: "",
      firstAidExpiry: "",
      irataBaselineHours: "",
      ropeAccessStartDate: "",
    },
  });


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
    // Fetch invitations for: unlinked technicians, terminated/suspended technicians, or PLUS technicians (can connect to multiple employers)
    enabled: !!user && user.role === 'rope_access_tech' && (!user.companyId || !!user.terminatedDate || !!user.suspendedAt || !!user.hasPlusAccess),
  });

  const pendingInvitations = invitationsData?.invitations || [];

  // Fetch logged hours for display on portal
  const { data: loggedHoursData } = useQuery<{ logs: Array<{ hoursWorked: string }> }>({
    queryKey: ["/api/my-irata-task-logs"],
    enabled: !!user && (user.role === 'rope_access_tech' || user.role === 'company'),
  });
  
  // Fetch historical hours (manual + previous) for calculating total
  const { data: historicalHoursData } = useQuery<{ historicalHours: HistoricalHours[] }>({
    queryKey: ["/api/my-historical-hours"],
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

  // Fetch company data for employment status display
  const { data: companyData } = useQuery<any>({
    queryKey: ["/api/companies", user?.companyId],
    enabled: !!user?.companyId,
  });
  
  // State for copy button
  const [codeCopied, setCodeCopied] = useState(false);
  
  // State for entering a referral code
  const [referralCodeInput, setReferralCodeInput] = useState("");
  
  // State for PLUS benefits dialog
  const [showPlusBenefits, setShowPlusBenefits] = useState(false);
  
  // Mobile-friendly tab navigation
  type TabType = 'home' | 'profile' | 'employer' | 'work' | 'more' | 'invitations' | 'visibility';
  const getTabFromUrl = (): TabType => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'home' || tab === 'profile' || tab === 'employer' || tab === 'work' || tab === 'more' || tab === 'invitations' || tab === 'visibility') {
      return tab;
    }
    return 'home';
  };
  
  const [activeTab, setActiveTab] = useState<TabType>(getTabFromUrl);
  
  // State for mobile sidebar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Use wouter's useSearch hook to track query string changes
  const searchString = useSearch();

  // Sync activeTab with URL query params whenever search string changes
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const tab = params.get('tab');
    if (tab === 'home' || tab === 'profile' || tab === 'employer' || tab === 'work' || tab === 'more' || tab === 'invitations' || tab === 'visibility') {
      setActiveTab(tab);
    } else if (!tab && location === '/technician-portal') {
      // Default to home when no tab specified
      setActiveTab('home');
    }
  }, [searchString, location]);
  
  // State for editing employer profile specialties
  const [isEditingEmployerProfile, setIsEditingEmployerProfile] = useState(false);
  
  // State for expected salary editing
  const [expectedSalaryMin, setExpectedSalaryMin] = useState<string>("");
  const [expectedSalaryMax, setExpectedSalaryMax] = useState<string>("");
  const [expectedSalaryPeriod, setExpectedSalaryPeriod] = useState<string>("hourly");
  const [isSavingSalary, setIsSavingSalary] = useState(false);
  
  // Initialize salary state from user data
  useEffect(() => {
    if (user) {
      setExpectedSalaryMin(user.expectedSalaryMin?.toString() || "");
      setExpectedSalaryMax(user.expectedSalaryMax?.toString() || "");
      setExpectedSalaryPeriod(user.expectedSalaryPeriod || "hourly");
    }
  }, [user?.expectedSalaryMin, user?.expectedSalaryMax, user?.expectedSalaryPeriod]);
  
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

  // Use shared technician navigation groups
  const technicianNavGroups = getTechnicianNavGroups(language as 'en' | 'fr' | 'es', {
    pendingInvitationsCount: pendingInvitations.length,
    unreadFeedbackCount: totalUnreadFeedback,
  });
  
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
  
  // State for leave company confirmation dialog
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  
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
  
  // Calculate manual hours (countsTowardTotal: true) - for when employer doesn't use OnRopePro
  const manualHours = useMemo(() => {
    if (!historicalHoursData?.historicalHours) return 0;
    return historicalHoursData.historicalHours
      .filter((entry) => entry.countsTowardTotal === true)
      .reduce((sum, entry) => sum + parseFloat(entry.hoursWorked || "0"), 0);
  }, [historicalHoursData]);
  
  // Combined total = baseline + work sessions + manual hours (excludes previous/historical hours)
  const combinedTotalHours = baselineHours + workSessionHours + manualHours;

  // Calculate profile completion - includes fields already filled during registration
  const profileCompletion = useMemo(() => {
    if (!user) return { percentage: 0, incompleteFields: [], isComplete: false };
    
    const getLabel = (en: string, fr: string, es: string) => {
      if (language === 'en') return en;
      if (language === 'es') return es;
      return fr;
    };
    
    const profileFields = [
      // Fields typically filled during registration
      { label: getLabel('Full Name', 'Nom complet', 'Nombre Completo'), complete: !!user.name, sectionId: 'personal' },
      { label: getLabel('Email', 'Courriel', 'Correo'), complete: !!user.email, sectionId: 'personal' },
      { label: getLabel('Phone Number', 'Numéro de téléphone', 'Teléfono'), complete: !!user.phone || !!user.employeePhoneNumber, sectionId: 'personal' },
      { label: getLabel('IRATA/SPRAT Cert', 'Certification IRATA/SPRAT', 'Cert. IRATA/SPRAT'), complete: !!user.irataLicenseNumber || !!user.spratLicenseNumber, sectionId: 'certifications' },
      // Additional profile fields
      { label: getLabel('Emergency Contact', 'Contact d\'urgence', 'Contacto de Emergencia'), complete: !!user.emergencyContactName && !!user.emergencyContactPhone, sectionId: 'personal' },
      { label: getLabel('Banking Info', 'Info bancaire', 'Info Bancaria'), complete: !!user.bankAccountNumber, sectionId: 'payroll' },
      { label: getLabel('Birth Date', 'Date de naissance', 'Fecha de Nacimiento'), complete: !!user.birthday, sectionId: 'personal' },
      { label: getLabel('First Aid', 'Premiers soins', 'Primeros Auxilios'), complete: !!user.hasFirstAid, sectionId: 'certifications' },
      { label: getLabel('Driver\'s License', 'Permis de conduire', 'Licencia de Conducir'), complete: !!user.driversLicenseNumber, sectionId: 'driver' },
      { label: getLabel('Address', 'Adresse', 'Dirección'), complete: !!user.employeeStreetAddress, sectionId: 'personal' },
      // Employer-visible profile fields
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

  // Mutation to redeem a referral code after registration
  const redeemReferralCodeMutation = useMutation({
    mutationFn: async (referralCode: string) => {
      return apiRequest("POST", "/api/user/redeem-referral-code", { referralCode });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setReferralCodeInput("");
      toast({
        title: t.referralCodeRedeemed,
        description: t.referralCodeRedeemedDesc,
      });
    },
    onError: (error: any) => {
      console.error("Failed to redeem referral code:", error);
      toast({
        title: language === 'en' ? 'Error' : language === 'es' ? 'Error' : 'Erreur',
        description: error.message || (language === 'en' ? 'Failed to redeem referral code' : language === 'es' ? 'Error al canjear codigo' : 'Echec de l\'echange du code'),
        variant: "destructive",
      });
    },
  });

  // State for document deletion confirmation
  const [deletingDocument, setDeletingDocument] = useState<{ type: string; url: string } | null>(null);

  // Mutation to delete uploaded documents
  const deleteDocumentMutation = useMutation({
    mutationFn: async ({ documentType, documentUrl }: { documentType: string; documentUrl: string }) => {
      return apiRequest("DELETE", "/api/technician/document", { documentType, documentUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: language === 'en' ? "Document Deleted" : "Document supprimé",
        description: language === 'en' ? "The document has been removed." : "Le document a été supprimé.",
      });
      setDeletingDocument(null);
    },
    onError: (error: any) => {
      toast({
        title: language === 'en' ? "Delete Failed" : "Échec de la suppression",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
      setDeletingDocument(null);
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
      setLocation("/technician");
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

      // OCR scanning for driver's license
      if (docType === 'driversLicense' && file.type.startsWith('image/')) {
        console.log('[TechnicianPortal] Attempting OCR scan for driver\'s license...');
        try {
          const ocrFormData = new FormData();
          ocrFormData.append('image', file);
          
          const ocrResponse = await fetch('/api/ocr/drivers-license', {
            method: 'POST',
            credentials: 'include',
            body: ocrFormData,
          });
          
          if (ocrResponse.ok) {
            const ocrResult = await ocrResponse.json();
            console.log('[TechnicianPortal] OCR result:', ocrResult);
            
            if (ocrResult.success && ocrResult.data) {
              let fieldsUpdated = 0;
              
              if (ocrResult.data.licenseNumber) {
                form.setValue('driversLicenseNumber', ocrResult.data.licenseNumber);
                fieldsUpdated++;
              }
              if (ocrResult.data.expiryDate) {
                form.setValue('driversLicenseExpiry', ocrResult.data.expiryDate);
                fieldsUpdated++;
              }
              if (ocrResult.data.issuedDate) {
                form.setValue('driversLicenseIssuedDate', ocrResult.data.issuedDate);
                fieldsUpdated++;
              }
              
              if (fieldsUpdated > 0) {
                toast({
                  title: t.ocrSuccess || "Document Scanned",
                  description: t.ocrFieldsAutofilled?.replace('{count}', String(fieldsUpdated)) || 
                    `${fieldsUpdated} field(s) auto-filled from your driver's license. Please verify the information.`,
                });
              }
            }
          }
        } catch (ocrError) {
          console.error('[TechnicianPortal] OCR scan failed:', ocrError);
        }
      }
      
      // OCR scanning for void cheque
      if (docType === 'voidCheque' && file.type.startsWith('image/')) {
        console.log('[TechnicianPortal] Attempting OCR scan for void cheque...');
        try {
          const ocrFormData = new FormData();
          ocrFormData.append('image', file);
          
          const ocrResponse = await fetch('/api/ocr/void-cheque', {
            method: 'POST',
            credentials: 'include',
            body: ocrFormData,
          });
          
          if (ocrResponse.ok) {
            const ocrResult = await ocrResponse.json();
            console.log('[TechnicianPortal] OCR result:', ocrResult);
            
            if (ocrResult.success && ocrResult.data) {
              let fieldsUpdated = 0;
              
              if (ocrResult.data.transitNumber) {
                form.setValue('bankTransitNumber', ocrResult.data.transitNumber);
                fieldsUpdated++;
              }
              if (ocrResult.data.institutionNumber) {
                form.setValue('bankInstitutionNumber', ocrResult.data.institutionNumber);
                fieldsUpdated++;
              }
              if (ocrResult.data.accountNumber) {
                form.setValue('bankAccountNumber', ocrResult.data.accountNumber);
                fieldsUpdated++;
              }
              
              if (fieldsUpdated > 0) {
                toast({
                  title: t.ocrSuccess || "Document Scanned",
                  description: t.ocrBankFieldsAutofilled?.replace('{count}', String(fieldsUpdated)) || 
                    `${fieldsUpdated} banking field(s) auto-filled from your void cheque. Please verify the information.`,
                });
              }
            }
          }
        } catch (ocrError) {
          console.error('[TechnicianPortal] OCR scan failed:', ocrError);
        }
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
        smsNotificationsEnabled: user.smsNotificationsEnabled ?? false,
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
        driversLicenseIssuedDate: user.driversLicenseIssuedDate || "",
        driversLicenseExpiry: user.driversLicenseExpiry || "",
        birthday: user.birthday || "",
        specialMedicalConditions: user.specialMedicalConditions || "",
        firstAidType: user.firstAidType || "",
        firstAidExpiry: user.firstAidExpiry || "",
        irataBaselineHours: user.irataBaselineHours || "",
        ropeAccessStartDate: user.ropeAccessStartDate || "",
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
            <Button onClick={() => setLocation("/technician")}>
              {t.goToLogin}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // UNIFIED TAB RENDER HELPERS
  // These helpers create unified tab content that works in both edit and view modes
  // Pattern: isEditing controls EditableField props and conditional view-only content
  // ============================================================================

  const renderDriverTab = () => (
    <TabsContent value="driver" className="mt-0 space-y-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className={`font-medium flex items-center gap-2 ${!isEditing ? 'text-muted-foreground' : ''}`}>
            <CreditCard className="w-4 h-4" />
            {t.driversLicense}
          </h3>
          <div className={`grid grid-cols-1 ${!isEditing ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
            <EditableField
              isEditing={isEditing}
              name="driversLicenseNumber"
              label={t.licenseNumber}
              value={isEditing ? form.watch("driversLicenseNumber") : user.driversLicenseNumber}
              control={isEditing ? form.control : undefined}
              placeholder="Optional"
              icon={<CreditCard className="w-4 h-4" />}
              emptyText={t.notProvided || "Not provided"}
              testId="license-number"
            />
            <EditableDateField
              isEditing={isEditing}
              name="driversLicenseIssuedDate"
              label={t.issuedDate}
              value={isEditing ? form.watch("driversLicenseIssuedDate") : user.driversLicenseIssuedDate}
              control={isEditing ? form.control : undefined}
              emptyText={t.notProvided || "Not set"}
              testId="license-issued-date"
              formatDate={!isEditing ? (d) => {
                if (!d) return "";
                try {
                  if (typeof d === 'string') return formatLocalDate(d);
                  const date = d instanceof Date ? d : new Date(d);
                  return formatLocalDate(date.toISOString().split('T')[0]);
                } catch {
                  return String(d);
                }
              } : undefined}
            />
            <EditableDateField
              isEditing={isEditing}
              name="driversLicenseExpiry"
              label={t.expiry}
              value={isEditing ? form.watch("driversLicenseExpiry") : user.driversLicenseExpiry}
              control={isEditing ? form.control : undefined}
              emptyText={t.notProvided || "Not set"}
              testId="license-expiry"
              formatDate={!isEditing ? (d) => {
                if (!d) return "";
                try {
                  if (typeof d === 'string') return formatLocalDate(d);
                  const date = d instanceof Date ? d : new Date(d);
                  return formatLocalDate(date.toISOString().split('T')[0]);
                } catch {
                  return String(d);
                }
              } : undefined}
            />
          </div>

          {/* Document display and upload buttons - VIEW MODE ONLY */}
          {!isEditing && (
            <>
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
                      
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="flex-shrink-0">
                            {isPdf ? (
                              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                              </div>
                            ) : isImage ? (
                              <img 
                                src={url} 
                                alt={isAbstract ? "Driver's Abstract" : "Driver's License"} 
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {isAbstract ? "Driver's Abstract" : `Driver's License ${index + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isPdf ? 'PDF Document' : isImage ? 'Image' : 'Document'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(url, '_blank')}
                              data-testid={`button-view-license-doc-${index}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeletingDocument({ type: 'driversLicense', url })}
                              data-testid={`button-delete-license-doc-${index}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
            </>
          )}
        </div>
      </div>
    </TabsContent>
  );

  // Helper function to render Certifications tab editable fields (First Aid certification)
  const renderCertificationsEditableFields = () => (
    <div className="space-y-6">
      {/* First Aid Certification Section */}
      <div className="space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {t.firstAid}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            isEditing={isEditing}
            name="firstAidType"
            label={t.firstAidType}
            value={isEditing ? form.watch("firstAidType") : user.firstAidType}
            control={isEditing ? form.control : undefined}
            placeholder="OFA Level 1, Standard First Aid, etc."
            testId="first-aid-type"
          />
          <EditableDateField
            isEditing={isEditing}
            name="firstAidExpiry"
            label={t.expiry}
            value={isEditing ? form.watch("firstAidExpiry") : user.firstAidExpiry}
            control={isEditing ? form.control : undefined}
            emptyText={t.notProvided || "Not set"}
            testId="first-aid-expiry"
          />
        </div>
        
        {/* First Aid Certificate Upload */}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => triggerDocumentUpload('firstAidCertificate')}
            disabled={uploadingDocType === 'firstAidCertificate'}
            data-testid="button-upload-first-aid-edit"
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
                  ? t.addFirstAidCert || "Add Certificate"
                  : t.uploadFirstAidCert || "Upload Certificate"}
              </>
            )}
          </Button>
          
          {/* Show existing First Aid documents */}
          {user.firstAidDocuments && user.firstAidDocuments.filter((u: string) => u && u.trim()).length > 0 && (
            <div className="mt-3 space-y-2">
              {user.firstAidDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {t.firstAidCertificate} #{index + 1}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingDocument({ type: 'firstAidDocuments', url })}
                    className="h-6 w-6 p-0"
                    data-testid={`button-delete-first-aid-doc-edit-${index}`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* IRATA/SPRAT Verification Quick Actions */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium flex items-center gap-2">
          <Award className="w-4 h-4" />
          {language === 'en' ? 'IRATA/SPRAT Verification' : language === 'fr' ? 'Vérification IRATA/SPRAT' : 'Verificación IRATA/SPRAT'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IRATA Section */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-medium text-sm">IRATA</span>
              {user.irataVerifiedAt && (
                <Badge variant="default" className="bg-green-600 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t.verified}
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openExternalLink('https://techconnect.irata.org/verify/tech')}
                data-testid="button-open-irata-portal-edit"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t.openIrataPortal}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => screenshotInputRef.current?.click()}
                disabled={isVerifying}
                data-testid="button-upload-irata-screenshot-edit"
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => triggerDocumentUpload('irataCertificationCard')}
                disabled={uploadingDocType === 'irataCertificationCard'}
                data-testid="button-upload-irata-card-edit"
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
          
          {/* SPRAT Section */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-medium text-sm">SPRAT</span>
              {user.spratVerifiedAt && (
                <Badge variant="default" className="bg-green-600 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t.verified}
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openExternalLink('https://sprat.org/technician-verification-system/')}
                data-testid="button-open-sprat-portal-edit"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t.openSpratPortal}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => spratScreenshotInputRef.current?.click()}
                disabled={isVerifyingSprat}
                data-testid="button-upload-sprat-screenshot-edit"
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => triggerDocumentUpload('spratCertificationCard')}
                disabled={uploadingDocType === 'spratCertificationCard'}
                data-testid="button-upload-sprat-card-edit"
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
        </div>
        
        {/* Verification result displays */}
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
              <p className={`text-sm font-medium ${
                verificationResult.success ? 'text-green-700 dark:text-green-400' : 'text-destructive'
              }`}>
                IRATA: {verificationResult.message}
              </p>
            </div>
          </div>
        )}
        
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
              <p className={`text-sm font-medium ${
                spratVerificationResult.success ? 'text-green-700 dark:text-green-400' : 'text-destructive'
              }`}>
                SPRAT: {spratVerificationResult.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper function to render unified Documents tab
  const renderDocumentsTab = () => (
    <TabsContent value="documents" className="mt-0 space-y-6">
      {isEditing ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>{language === 'en' ? 'Submitted documents are available in view mode. Click Cancel to view.' : language === 'es' ? 'Los documentos enviados están disponibles en el modo de visualización.' : 'Les documents soumis sont disponibles en mode affichage.'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
              <FolderOpen className="w-4 h-4" />
              {language === 'en' ? 'My Submitted Documents' : 'Mes documents soumis'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === 'en' 
                ? 'Documents you have uploaded in response to employer requests'
                : 'Documents que vous avez téléchargés en réponse aux demandes des employeurs'}
            </p>
            <MySubmittedDocuments language={language} />
          </div>
        </div>
      )}
    </TabsContent>
  );

  // Helper function to render unified Personal tab
  const renderPersonalTab = () => (
    <TabsContent value="personal" className="mt-0 space-y-6">
      <div className={isEditing ? "space-y-4" : "space-y-6"}>
        <div className={isEditing ? "space-y-4" : "space-y-3"}>
          <h3 className={`font-medium flex items-center gap-2 ${!isEditing ? 'text-muted-foreground' : ''}`}>
            <User className="w-4 h-4" />
            {t.personalInfo}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isEditing && (
              <EditableField
                isEditing={true}
                name="name"
                label={t.fullName}
                value={form.watch("name")}
                control={form.control}
                testId="name"
              />
            )}
            <EditableField
              isEditing={isEditing}
              name="email"
              label={t.email}
              value={isEditing ? form.watch("email") : user.email}
              control={isEditing ? form.control : undefined}
              type="email"
              icon={!isEditing ? <Mail className="w-4 h-4" /> : undefined}
              emptyText={t.notProvided || "Not provided"}
              testId="email"
            />
            <EditableField
              isEditing={isEditing}
              name="employeePhoneNumber"
              label={t.phoneNumber}
              value={isEditing ? form.watch("employeePhoneNumber") : user.employeePhoneNumber}
              control={isEditing ? form.control : undefined}
              type={isEditing ? "tel" : "text"}
              formatValue={!isEditing ? ((val) => formatPhoneNumber(val)) : undefined}
              icon={!isEditing ? <Phone className="w-4 h-4" /> : undefined}
              emptyText={t.notProvided || "Not provided"}
              testId="phone"
            />
            <EditableDateField
              isEditing={isEditing}
              name="birthday"
              label={<>{t.birthday} <span className="text-muted-foreground font-normal text-sm">(mm/dd/yyyy)</span></>}
              value={isEditing ? form.watch("birthday") : user.birthday}
              control={isEditing ? form.control : undefined}
              emptyText={t.notProvided || "Not set"}
              testId="birthday"
              formatDate={!isEditing ? (d) => {
                if (!d) return "";
                try {
                  if (typeof d === 'string') return formatLocalDate(d);
                  const date = d instanceof Date ? d : new Date(d);
                  return formatLocalDate(date.toISOString().split('T')[0]);
                } catch {
                  return String(d);
                }
              } : undefined}
            />
            <EditableSwitch
              isEditing={isEditing}
              name="smsNotificationsEnabled"
              label={t.smsNotifications}
              value={isEditing ? form.watch("smsNotificationsEnabled") : user.smsNotificationsEnabled}
              control={isEditing ? form.control : undefined}
              helpText={t.smsNotificationsDescription}
              enabledText={t.enabled || "Enabled"}
              disabledText={t.disabled || "Disabled"}
              testId="sms-notifications"
            />
          </div>
        </div>

        <Separator />

        <div className={isEditing ? "space-y-4" : "space-y-3"}>
          <h3 className={`font-medium flex items-center gap-2 ${!isEditing ? 'text-muted-foreground' : ''}`}>
            <MapPin className="w-4 h-4" />
            {t.address}
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t.addressPayrollInfo}</p>
              </TooltipContent>
            </Tooltip>
          </h3>
          
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeStreetAddress"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t.streetAddress}</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        data-testid="input-street"
                        placeholder={t.streetAddress}
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        onSelect={(address) => {
                          field.onChange(address.formatted);
                          form.setValue('employeeCity', address.city || '');
                          form.setValue('employeeProvinceState', address.state || '');
                          form.setValue('employeeCountry', address.country || '');
                          form.setValue('employeePostalCode', address.postcode || '');
                        }}
                      />
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
          ) : (
            <p className="text-base">
              {user.employeeStreetAddress ? (
                <>
                  {user.employeeStreetAddress}<br />
                  {user.employeeCity}, {user.employeeProvinceState} {user.employeePostalCode}<br />
                  {user.employeeCountry}
                </>
              ) : (
                <span className="text-muted-foreground">{t.notProvided || "Not provided"}</span>
              )}
            </p>
          )}
        </div>

        <Separator />

        <div className={isEditing ? "space-y-4" : "space-y-3"}>
          <h3 className={`font-medium flex items-center gap-2 ${!isEditing ? 'text-muted-foreground' : ''}`}>
            <Heart className="w-4 h-4" />
            {t.emergencyContact}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EditableField
              isEditing={isEditing}
              name="emergencyContactName"
              label={isEditing ? "Contact Name" : "Name"}
              value={isEditing ? form.watch("emergencyContactName") : user.emergencyContactName}
              control={isEditing ? form.control : undefined}
              emptyText="Not provided"
              testId="emergency-name"
            />
            <EditableField
              isEditing={isEditing}
              name="emergencyContactPhone"
              label={isEditing ? "Contact Phone" : "Phone"}
              value={isEditing ? form.watch("emergencyContactPhone") : user.emergencyContactPhone}
              control={isEditing ? form.control : undefined}
              type={isEditing ? "tel" : "text"}
              formatValue={!isEditing ? ((val) => formatPhoneNumber(val)) : undefined}
              emptyText="Not provided"
              testId="emergency-phone"
            />
            {isEditing ? (
              <EditableSelect
                isEditing={true}
                name="emergencyContactRelationship"
                label={t.relationship}
                value={form.watch("emergencyContactRelationship")}
                control={form.control}
                placeholder={t.relationshipPlaceholder}
                options={[
                  { value: "mother", label: t.relationshipOptions.mother },
                  { value: "father", label: t.relationshipOptions.father },
                  { value: "spouse", label: t.relationshipOptions.spouse },
                  { value: "partner", label: t.relationshipOptions.partner },
                  { value: "brother", label: t.relationshipOptions.brother },
                  { value: "sister", label: t.relationshipOptions.sister },
                  { value: "son", label: t.relationshipOptions.son },
                  { value: "daughter", label: t.relationshipOptions.daughter },
                  { value: "grandparent", label: t.relationshipOptions.grandparent },
                  { value: "friend", label: t.relationshipOptions.friend },
                  { value: "roommate", label: t.relationshipOptions.roommate },
                  { value: "other", label: t.relationshipOptions.other },
                ]}
                testId="emergency-relationship"
              />
            ) : (
              <EditableField
                isEditing={false}
                name="emergencyContactRelationship"
                label="Relationship"
                value={user.emergencyContactRelationship}
                emptyText="Not selected"
                testId="emergency-relationship"
              />
            )}
          </div>
        </div>

        <Separator />

        <div className={isEditing ? "space-y-4" : "space-y-3"}>
          <h3 className={`font-medium flex items-center gap-2 ${!isEditing ? 'text-muted-foreground' : ''}`}>
            <AlertCircle className="w-4 h-4" />
            {t.medicalConditions}
          </h3>
          {isEditing ? (
            <EditableTextarea
              isEditing={true}
              name="specialMedicalConditions"
              label={t.specialMedicalConditions}
              value={form.watch("specialMedicalConditions")}
              control={form.control}
              placeholder={t.medicalPlaceholder}
              rows={4}
              testId="medical"
            />
          ) : (
            <p className="text-sm">
              {user.specialMedicalConditions || (
                <span className="text-muted-foreground italic">{t.notProvided || "None"}</span>
              )}
            </p>
          )}
        </div>
      </div>
    </TabsContent>
  );

  // Helper function to render unified Payroll tab
  const renderPayrollTab = () => (
    <TabsContent value="payroll" className="mt-0 space-y-6">
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
            <Building className="w-4 h-4" />
            {t.payrollInfo || "Payroll Information"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableField
              isEditing={isEditing}
              name="socialInsuranceNumber"
              label="Social Insurance Number"
              value={isEditing ? form.watch("socialInsuranceNumber") : user.socialInsuranceNumber}
              control={isEditing ? form.control : undefined}
              placeholder="Optional"
              formatValue={(val) => maskSensitiveData(val)}
              emptyText="Not provided"
              testId="sin"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <EditableField
              isEditing={isEditing}
              name="bankTransitNumber"
              label={isEditing ? "Bank Transit #" : "Transit Number"}
              value={isEditing ? form.watch("bankTransitNumber") : user.bankTransitNumber}
              control={isEditing ? form.control : undefined}
              placeholder="5 digits"
              formatValue={(val) => maskSensitiveData(val)}
              emptyText="Not provided"
              testId="bank-transit"
            />
            <EditableField
              isEditing={isEditing}
              name="bankInstitutionNumber"
              label={isEditing ? "Institution #" : "Branch Number"}
              value={isEditing ? form.watch("bankInstitutionNumber") : user.bankInstitutionNumber}
              control={isEditing ? form.control : undefined}
              placeholder="3 digits"
              formatValue={(val) => maskSensitiveData(val)}
              emptyText="Not provided"
              testId="bank-institution"
            />
            <EditableField
              isEditing={isEditing}
              name="bankAccountNumber"
              label={isEditing ? "Account #" : "Account Number"}
              value={isEditing ? form.watch("bankAccountNumber") : user.bankAccountNumber}
              control={isEditing ? form.control : undefined}
              placeholder="7-12 digits"
              formatValue={(val) => maskSensitiveData(val)}
              emptyText="Not provided"
              testId="bank-account"
            />
          </div>
          
          {/* Upload void cheque button - shown in view mode if no banking documents exist */}
          {!isEditing && (!user.bankDocuments || user.bankDocuments.filter((u: string) => u && u.trim()).length === 0) && (
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

        {/* Banking Documents Section - View mode only */}
        {!isEditing && user.bankDocuments && user.bankDocuments.filter((u: string) => u && u.trim()).length > 0 && (
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
                  <div key={index} className="relative">
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
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingDocument({ type: 'bankDocuments', url });
                      }}
                      data-testid={`button-delete-bank-doc-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
            
            {/* Upload additional void cheque button */}
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
        )}
      </div>
    </TabsContent>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Sidebar - Desktop fixed, Mobile hamburger menu */}
      <DashboardSidebar
        currentUser={user}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
        variant="technician"
        customNavigationGroups={technicianNavGroups}
        showDashboardLink={false}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />
      
      {/* Main content wrapper - offset for sidebar on desktop */}
      <div className="lg:pl-60">
        <header className="sticky top-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6">
          <div className="h-full flex items-center justify-between gap-4">
            {/* Left Side: Hamburger menu (mobile) + Search */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Mobile hamburger menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex flex-1 max-w-xl">
                <DashboardSearch />
              </div>
            </div>
            
            {/* Right Side: Actions Group */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
                  <span className="hidden sm:inline">{language === 'en' ? 'Dashboard' : language === 'es' ? 'Panel' : 'Tableau de bord'}</span>
                </Button>
              )}
              
              {/* Notifications */}
              <NotificationBell />
              
              {/* Language Selector */}
              <LanguageDropdown iconOnly />
              
              {/* User Profile - Clickable to go to Profile tab */}
              <button 
                onClick={() => setActiveTab('profile')}
                className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
                data-testid="link-user-profile"
              >
                <Avatar className="w-8 h-8 bg-[#5C7A84]">
                  <AvatarImage src={user?.photoUrl || undefined} alt={user?.name || "Profile"} />
                  <AvatarFallback className="bg-[#5C7A84] text-white text-xs font-medium">
                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{user?.name || 'User'}</p>
                    {user.role === 'rope_access_tech' && user.hasPlusAccess && (
                      <Badge 
                        variant="default" 
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] px-1.5 py-0 font-bold border-0 h-4" 
                        data-testid="badge-pro"
                      >
                        <Crown className="w-2.5 h-2.5 mr-0.5 fill-current" />
                        PLUS
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-tight">{language === 'en' ? 'Technician' : language === 'es' ? 'Tecnico' : 'Technicien'}</p>
                </div>
              </button>
              
              {/* Logout Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                data-testid="button-logout" 
                onClick={handleLogout} 
                className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

      {/* Active Work Session Banner - Shows in darker grey area below header */}
      <ActiveSessionBadge />

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
              <div className="w-full px-4 md:px-6 xl:px-8 py-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base text-amber-700 dark:text-amber-400 flex items-center gap-2">
                      {t.certificationExpiryBannerTitle}
                      <Badge variant="secondary" className="gap-1">
                        <Star className="w-3 h-3" />
                        PLUS
                      </Badge>
                    </p>
                    <p className="text-base text-amber-600/80 dark:text-amber-400/80 mt-0.5">{t.plusLockedDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="bg-red-600 dark:bg-red-700 text-white" data-testid="banner-certification-expiry">
            <div className="w-full px-4 md:px-6 xl:px-8 py-3">
              <div className="flex items-center gap-3 flex-wrap">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base">{t.certificationExpiryBannerTitle}</p>
                  <div className="text-base mt-0.5 space-y-0.5">
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

      <main className="w-full px-4 md:px-6 xl:px-8 py-6 space-y-6 pb-24">
        {/* HOME TAB - Quick actions and overview */}
        {activeTab === 'home' && (
          <>
            {/* Work Dashboard Quick Access */}
            {user && user.role === 'rope_access_tech' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${user.companyId && !user.terminatedDate && !user.suspendedAt ? "bg-sky-50 dark:bg-sky-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <Briefcase className={`w-6 h-6 ${user.companyId && !user.terminatedDate && !user.suspendedAt ? "text-sky-600 dark:text-sky-400" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${!user.companyId || user.terminatedDate || user.suspendedAt ? "text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>{t.goToWorkDashboard}</p>
                        <p className="text-base text-slate-500 dark:text-slate-400">{t.accessProjects}</p>
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
                      className="gap-2 bg-[#0B64A3] hover:bg-[#0B64A3]/90 text-white"
                      disabled={!user.companyId || !!user.terminatedDate || !!user.suspendedAt}
                      data-testid="button-go-to-dashboard"
                    >
                      {t.goToWorkDashboardButton}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  {(!user.companyId || user.terminatedDate || user.suspendedAt) && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <p className="text-base text-slate-500 dark:text-slate-400 flex-1">
                          {user.suspendedAt ? t.dashboardDisabledInactive : user.terminatedDate ? t.dashboardDisabledTerminated : t.dashboardDisabledNoCompany}
                        </p>
                        {pendingInvitations.length > 0 && (
                          <div className="flex flex-col gap-2 sm:items-end" data-testid="pending-invitations-section">
                            {pendingInvitations.map((invitation) => (
                              <div 
                                key={invitation.id} 
                                className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                                data-testid={`invitation-card-${invitation.id}`}
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate">
                                    {t.invitedBy} {invitation.company.name}
                                  </p>
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700 text-white h-7 px-2"
                                    onClick={() => acceptInvitationMutation.mutate(invitation.id)}
                                    disabled={processingInvitationId === invitation.id}
                                    data-testid={`button-accept-invitation-${invitation.id}`}
                                  >
                                    {processingInvitationId === invitation.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                                    onClick={() => declineInvitationMutation.mutate(invitation.id)}
                                    disabled={processingInvitationId === invitation.id}
                                    data-testid={`button-decline-invitation-${invitation.id}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Completion Widget on Home Tab - Show until complete */}
            {user && user.role === 'rope_access_tech' && !profileCompletion.isComplete && (
              <Card 
                className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 cursor-pointer hover:shadow-md transition-shadow" 
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
                        <h3 className="font-semibold text-base">
                          {language === 'en' ? 'Complete Your Passport Profile' : language === 'es' ? 'Completa Tu Perfil de Pasaporte' : 'Complétez votre profil Passeport'}
                        </h3>
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{profileCompletion.percentage}%</span>
                      </div>
                      <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2 mb-3">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all" 
                          style={{ width: `${profileCompletion.percentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === 'en' 
                          ? 'Your profile is shared with employers when you apply for jobs or accept team invitations' 
                          : language === 'es'
                          ? 'Tu perfil se comparte con los empleadores cuando solicitas trabajos o aceptas invitaciones de equipo'
                          : 'Votre profil est partagé avec les employeurs lorsque vous postulez à des emplois ou acceptez des invitations'}
                      </p>
                      {profileCompletion.incompleteFields.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {profileCompletion.incompleteFields.map((field, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="text-xs bg-background cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab('profile');
                                setProfileInnerTab(field.sectionId);
                                setIsEditing(true);
                              }}
                              data-testid={`badge-incomplete-${field.sectionId}-${i}`}
                            >
                              {field.label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions Grid - 4 columns on desktop, 2 on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Linked Employer Card - Show when employed and not suspended */}
              {user && user.companyId && !user.terminatedDate && !user.suspendedAt && companyData?.company && (
                <div 
                  className="group bg-white dark:bg-slate-900 border border-green-200 dark:border-green-700 rounded-lg shadow-sm p-4 text-left flex flex-col h-full"
                  data-testid="quick-action-linked-employer"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {companyData.company.companyLogoUrl ? (
                      <img 
                        src={companyData.company.companyLogoUrl} 
                        alt={companyData.company.companyName || companyData.company.name}
                        className="w-10 h-10 rounded-lg object-contain flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    )}
                    <Badge variant="default" className="bg-green-600 text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {t.active}
                    </Badge>
                  </div>
                  <p className="font-semibold text-base text-slate-900 dark:text-slate-100 truncate mb-2">{companyData.company.companyName || companyData.company.name}</p>
                  <div className="flex-1" />
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 h-6 px-2"
                      onClick={() => setShowLeaveConfirm(true)}
                      data-testid="button-leave-company"
                    >
                      {t.leaveCompany}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Inactive/Suspended Employer Card */}
              {user && user.companyId && user.suspendedAt && companyData?.company && (
                <div 
                  className="group bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-700 rounded-lg shadow-sm p-4 text-left"
                  data-testid="quick-action-inactive-employer"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="font-semibold text-base text-slate-900 dark:text-slate-100 truncate mb-1">{companyData.company.companyName || companyData.company.name}</p>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs">
                    {t.inactive}
                  </Badge>
                </div>
              )}

              {/* Job Board - Purple theme */}
              <button
                onClick={() => setLocation("/technician-job-board")}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-all"
                data-testid="quick-action-jobs"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#0B64A3] transition-colors">{t.jobBoard}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.browseJobs}</p>
              </button>
              
              {/* Profile - Slate theme */}
              <button
                onClick={() => setActiveTab('profile')}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-all"
                data-testid="quick-action-profile"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <p className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#0B64A3] transition-colors">{t.tabProfile}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.editProfile}</p>
              </button>
              
              {/* My Logged Hours - Sky theme */}
              <button
                onClick={() => setLocation("/technician-logged-hours")}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-all"
                data-testid="quick-action-logged-hours"
              >
                <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
                <p className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#0B64A3] transition-colors">{t.myLoggedHours}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.viewLoggedHoursDesc}</p>
                {(combinedTotalHours > 0 || workSessionHours > 0) && (
                  <p className="text-sm font-bold text-[#0B64A3] mt-1" data-testid="text-home-total-logged-hours">
                    {combinedTotalHours.toFixed(1)} {t.totalHoursLabel}
                  </p>
                )}
              </button>
              
              {/* Personal Safety Documents - Emerald theme */}
              <button
                onClick={() => setLocation("/personal-safety-documents")}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-all"
                data-testid="quick-action-personal-safety"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#0B64A3] transition-colors">{t.personalSafetyDocs}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.personalSafetyDocsDesc}</p>
              </button>
              
              {/* PSR - Amber theme */}
              <button
                onClick={() => setLocation("/technician-psr")}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-all"
                data-testid="quick-action-psr"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#0B64A3] transition-colors">PSR</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.performanceSafetyRating}</p>
              </button>
            </div>

            {/* Document Requests from Employers */}
            {user && user.role === 'rope_access_tech' && (
              <TechnicianDocumentRequests language={language} />
            )}
          </>
        )}

        {/* MY VISIBILITY TAB - What employers see and visibility settings */}
        {activeTab === 'visibility' && user && (
          <>
            {/* Employer Profile - Glass-morphism container matching Resident Profile style */}
            {(user.role === 'rope_access_tech' || user.role === 'company') && (
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl p-6">
                {/* Header with title and edit button */}
                <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{t.employerProfileTitle}</h2>
                      <p className="text-base text-muted-foreground">{t.employerProfileDesc}</p>
                    </div>
                  </div>
                  {!isEditingEmployerProfile ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingEmployerProfile(true)}
                      data-testid="button-edit-employer-profile"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      {t.editEmployerProfile}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingEmployerProfile(false)}
                      data-testid="button-cancel-employer-edit"
                    >
                      {t.cancelEdit}
                    </Button>
                  )}
                </div>

                {/* Visibility Status - Compact inline */}
                <div className={`flex items-center justify-between p-4 rounded-lg mb-6 gap-4 ${user.isVisibleToEmployers ? "bg-green-500/10 border border-green-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${user.isVisibleToEmployers ? "bg-green-500/20" : "bg-amber-500/20"}`}>
                      {user.isVisibleToEmployers ? (
                        <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.isVisibleToEmployers ? t.visibleToEmployers : t.hiddenFromEmployers}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.isVisibleToEmployers ? t.visibilityOnDesc : t.visibilityOffDesc}
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

                {/* Expected Salary Section */}
                <div className="rounded-lg border p-4 mb-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{language === 'en' ? 'Expected Salary' : 'Salaire attendu'}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' ? 'Visible to potential employers' : 'Visible pour les employeurs potentiels'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {isEditingEmployerProfile ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>{language === 'en' ? 'Minimum' : 'Minimum'}</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0"
                              value={expectedSalaryMin}
                              onChange={(e) => setExpectedSalaryMin(e.target.value)}
                              className="pl-9"
                              data-testid="input-salary-min"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>{language === 'en' ? 'Maximum' : 'Maximum'}</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0"
                              value={expectedSalaryMax}
                              onChange={(e) => setExpectedSalaryMax(e.target.value)}
                              className="pl-9"
                              data-testid="input-salary-max"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>{language === 'en' ? 'Period' : 'Période'}</Label>
                          <Select value={expectedSalaryPeriod} onValueChange={setExpectedSalaryPeriod}>
                            <SelectTrigger data-testid="select-salary-period">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">{language === 'en' ? 'Per Hour' : 'Par heure'}</SelectItem>
                              <SelectItem value="daily">{language === 'en' ? 'Per Day' : 'Par jour'}</SelectItem>
                              <SelectItem value="weekly">{language === 'en' ? 'Per Week' : 'Par semaine'}</SelectItem>
                              <SelectItem value="monthly">{language === 'en' ? 'Per Month' : 'Par mois'}</SelectItem>
                              <SelectItem value="annually">{language === 'en' ? 'Per Year' : 'Par an'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        onClick={async () => {
                          setIsSavingSalary(true);
                          try {
                            const response = await fetch("/api/technician/expected-salary", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                              body: JSON.stringify({
                                minSalary: expectedSalaryMin ? parseFloat(expectedSalaryMin) : null,
                                maxSalary: expectedSalaryMax ? parseFloat(expectedSalaryMax) : null,
                                salaryPeriod: expectedSalaryPeriod,
                              }),
                            });
                            if (!response.ok) {
                              const errorData = await response.json().catch(() => ({}));
                              throw new Error(errorData.message || "Failed to update salary");
                            }
                            await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
                            toast({
                              title: language === 'en' ? "Salary Updated" : "Salaire mis à jour",
                              description: language === 'en' ? "Your expected salary has been saved" : "Votre salaire attendu a été enregistré",
                            });
                            // Don't close edit mode - let user continue editing if needed
                          } catch (error: any) {
                            toast({ 
                              title: language === 'en' ? "Error" : "Erreur", 
                              description: error.message || (language === 'en' ? "Failed to update salary" : "Échec de la mise à jour du salaire"), 
                              variant: "destructive" 
                            });
                          } finally {
                            setIsSavingSalary(false);
                          }
                        }}
                        disabled={isSavingSalary}
                        data-testid="button-save-salary"
                      >
                        {isSavingSalary ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {language === 'en' ? 'Save Salary' : 'Enregistrer le salaire'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm">
                      {user.expectedSalaryMin || user.expectedSalaryMax ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-lg">
                            {user.expectedSalaryMin && user.expectedSalaryMax ? (
                              `$${Number(user.expectedSalaryMin).toLocaleString()} - $${Number(user.expectedSalaryMax).toLocaleString()}`
                            ) : user.expectedSalaryMin ? (
                              `$${Number(user.expectedSalaryMin).toLocaleString()}+`
                            ) : (
                              `Up to $${Number(user.expectedSalaryMax).toLocaleString()}`
                            )}
                          </span>
                          <Badge variant="secondary">
                            {user.expectedSalaryPeriod === 'hourly' && (language === 'en' ? '/hour' : '/heure')}
                            {user.expectedSalaryPeriod === 'daily' && (language === 'en' ? '/day' : '/jour')}
                            {user.expectedSalaryPeriod === 'weekly' && (language === 'en' ? '/week' : '/semaine')}
                            {user.expectedSalaryPeriod === 'monthly' && (language === 'en' ? '/month' : '/mois')}
                            {user.expectedSalaryPeriod === 'annually' && (language === 'en' ? '/year' : '/an')}
                          </Badge>
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">
                          {language === 'en' ? 'No salary expectation set. Click Edit to add.' : 'Aucun salaire attendu défini. Cliquez sur Modifier pour ajouter.'}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Info Section */}
                <div className="space-y-6">
                  {/* Basic Info with Avatar */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                      {language === 'en' ? 'Profile Preview' : 'Aperçu du profil'}
                    </h3>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-20 h-20 border-2 border-primary/20">
                        <AvatarImage src={user.photoUrl || undefined} alt={user.name || ""} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-semibold" data-testid="text-employer-profile-name">{user.name}</h3>
                          {user.hasPlusAccess && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-xs">
                              PLUS
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground" data-testid="text-employer-profile-location">
                          {user.city}{user.province ? `, ${user.province}` : ""}
                        </p>
                        {user.ropeAccessStartDate && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span data-testid="text-employer-profile-experience">
                              {(() => {
                                const start = new Date(user.ropeAccessStartDate);
                                const now = new Date();
                                const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
                                const years = Math.floor(months / 12);
                                const remainingMonths = months % 12;
                                if (years > 0) {
                                  return `${years} ${language === 'en' ? 'year(s)' : 'an(s)'}, ${remainingMonths} ${language === 'en' ? 'month(s)' : 'mois'} ${language === 'en' ? 'experience' : "d'expérience"}`;
                                }
                                return `${months} ${language === 'en' ? 'month(s) experience' : "mois d'expérience"}`;
                              })()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Certifications Section */}
                  <div className="pt-6 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      {t.certifications}
                    </h3>
                    <div className="space-y-3">
                      {user.irataLicenseNumber && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">IRATA</p>
                            <p className="font-medium" data-testid="text-employer-profile-irata">
                              {user.irataLevel || "?"} - {user.irataLicenseNumber}
                            </p>
                          </div>
                          <Badge variant="secondary">IRATA</Badge>
                        </div>
                      )}
                      {user.spratLicenseNumber && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">SPRAT</p>
                            <p className="font-medium" data-testid="text-employer-profile-sprat">
                              {user.spratLevel || "?"} - {user.spratLicenseNumber}
                            </p>
                          </div>
                          <Badge variant="secondary">SPRAT</Badge>
                        </div>
                      )}
                      {user.hasFirstAid && (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">{language === 'en' ? 'Safety' : 'Sécurité'}</p>
                            <p className="font-medium" data-testid="text-employer-profile-firstaid">{t.firstAid}</p>
                          </div>
                          <Badge variant="outline" className="gap-1">
                            <Heart className="w-3 h-3" />
                            {language === 'en' ? 'Certified' : 'Certifié'}
                          </Badge>
                        </div>
                      )}
                      {!user.irataLicenseNumber && !user.spratLicenseNumber && !user.hasFirstAid && (
                        <p className="text-sm text-muted-foreground italic">
                          {language === 'en' ? 'No certifications added yet' : 'Aucune certification ajoutée'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Resumes Section */}
                  {user.resumeDocuments && user.resumeDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                    <div className="pt-6 border-t">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {t.resume}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.resumeDocuments.filter((u: string) => u && u.trim()).map((doc: string, index: number) => (
                          <Badge key={index} variant="outline" className="gap-1" data-testid={`badge-resume-${index}`}>
                            <FileText className="w-3 h-3" />
                            Resume {index + 1}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* MORE TAB - referral, settings */}
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
            
          </>
        )}

        {/* TEAM INVITATIONS TAB - Employer invitations to link accounts */}
        {activeTab === 'invitations' && user && user.role === 'rope_access_tech' && (
          <>
            {/* Back to Home button */}
            <Button
              variant="ghost"
              onClick={() => setActiveTab('home')}
              className="gap-2 -mt-2 mb-2"
              data-testid="button-back-to-home-invitations"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </Button>
            
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
                    <p className="text-base mt-1">{t.noInvitationsDesc}</p>
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
          </>
        )}

        {/* Enter a Referral Code Section - Only show for technicians who haven't used one (MORE TAB) */}
        {activeTab === 'more' && user && user.role === 'rope_access_tech' && !user.referredByCode && (
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t.enterReferralCode}</CardTitle>
                  <CardDescription>
                    {t.enterReferralCodeDesc}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder={t.referralCodePlaceholder}
                  value={referralCodeInput}
                  onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 font-mono tracking-wider"
                  maxLength={20}
                  data-testid="input-redeem-referral-code"
                />
                <Button
                  onClick={() => redeemReferralCodeMutation.mutate(referralCodeInput)}
                  disabled={!referralCodeInput.trim() || redeemReferralCodeMutation.isPending}
                  className="gap-2"
                  data-testid="button-redeem-referral-code"
                >
                  {redeemReferralCodeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.redeemingCode}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {t.redeemCode}
                    </>
                  )}
                </Button>
              </div>
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
                    <p className="text-base text-muted-foreground">{t.noReferralsYet}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* PROFILE TAB - Personal information and certifications */}
        {activeTab === 'profile' && (
          <>
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
                        <h3 className="font-semibold text-base">
                          {language === 'en' ? 'Complete Your Passport Profile' : language === 'es' ? 'Completa Tu Perfil de Pasaporte' : 'Complétez votre profil Passeport'}
                        </h3>
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">{profileCompletion.percentage}%</span>
                      </div>
                      <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2 mb-3">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all" 
                          style={{ width: `${profileCompletion.percentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {language === 'en' 
                          ? 'Your profile is shared with employers when you apply for jobs or accept team invitations' 
                          : language === 'es'
                          ? 'Tu perfil se comparte con los empleadores cuando solicitas trabajos o aceptas invitaciones de equipo'
                          : 'Votre profil est partagé avec les employeurs lorsque vous postulez à des emplois ou acceptez des invitations'}
                      </p>
                      {profileCompletion.incompleteFields.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {profileCompletion.incompleteFields.map((field, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="text-xs bg-background cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                              onClick={() => {
                                setProfileInnerTab(field.sectionId);
                                setIsEditing(true);
                              }}
                              data-testid={`badge-profile-incomplete-${field.sectionId}-${i}`}
                            >
                              {field.label}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <ProfilePhotoUploader 
                      photoUrl={user.photoUrl} 
                      userName={user.name}
                      onPhotoUploaded={(url) => {
                        queryClient.invalidateQueries({ queryKey: ['/api/user'] });
                      }}
                    />
                    <div>
                      <CardTitle className="text-lg sm:text-xl">{user.name}</CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                        {user.irataLevel && (
                          <Badge variant="secondary" className="gap-1">
                            <Award className="w-3 h-3" />
                            IRATA {user.irataLevel}
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
                  <div className="flex-shrink-0">
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        onClick={startEditing}
                        className="gap-2"
                        data-testid="button-edit-profile"
                      >
                        <Edit2 className="w-4 h-4" />
                        {t.editProfile}
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          data-testid="button-cancel-edit"
                        >
                          <X className="w-4 h-4 mr-2" />
                          {t.cancel}
                        </Button>
                        <Button
                          onClick={form.handleSubmit(onSubmit)}
                          disabled={updateMutation.isPending}
                          className="gap-2"
                          data-testid="button-save-profile"
                        >
                          <Save className="w-4 h-4" />
                          {updateMutation.isPending ? t.saving : t.saveChanges}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
          </CardHeader>

          <CardContent>
            <Tabs value={profileInnerTab} onValueChange={setProfileInnerTab} className="w-full">
              <div className="w-full overflow-x-auto mb-6 border-b border-border">
                <TabsList className="bg-transparent h-auto p-0 gap-0">
                  <TabsTrigger 
                    value="personal" 
                    data-testid="tab-personal"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-primary"
                  >
                    {t.profileTabPersonalInfo}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="certifications" 
                    data-testid="tab-certifications"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-primary"
                  >
                    {t.profileTabCertifications}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="driver" 
                    data-testid="tab-driver"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-primary"
                  >
                    {t.profileTabDriver}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="payroll" 
                    data-testid="tab-payroll"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-primary"
                  >
                    {t.profileTabPayroll}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documents" 
                    data-testid="tab-documents"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-muted-foreground data-[state=active]:text-primary"
                  >
                    {t.profileTabDocuments}
                  </TabsTrigger>
                </TabsList>
              </div>

            {/* Hidden file input for document uploads - always rendered */}
            <input
              type="file"
              ref={documentInputRef}
              accept="image/*,.pdf"
              onChange={handleDocumentUpload}
              className="hidden"
              data-testid="input-document-upload-global"
            />

            {/* UNIFIED profileTabsContent - all tabs rendered once with internal isEditing conditionals */}
            {(() => {
              const profileTabsContent = (
                <>
                  {/* PERSONAL TAB - UNIFIED (uses renderPersonalTab helper) */}
                  {renderPersonalTab()}

                  {/* PAYROLL TAB - UNIFIED (uses renderPayrollTab helper) */}
                  {renderPayrollTab()}

                  {/* DRIVER TAB - UNIFIED (uses renderDriverTab helper) */}
                  {renderDriverTab()}

                  {/* CERTIFICATIONS TAB - UNIFIED with internal isEditing conditionals */}
                  <TabsContent value="certifications" className="mt-0 space-y-6">
                    {/* Editable fields - shown in edit mode */}
                    {isEditing && renderCertificationsEditableFields()}
                    
                    {/* View content - shown in view mode */}
                    {!isEditing && (
                      <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4" />
                    {t.certifications}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  console.error('Failed to parse IRATA expiration date:', e);
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
                  
                  {/* IRATA & SPRAT Verification Grid */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* IRATA License Verification Section - Available to all technicians */}
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                      {/* Show verified status if already verified */}
                      {user.irataVerifiedAt && (
                        <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">IRATA {t.licenseVerified}</p>
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
                            {user.irataVerifiedAt ? t.reverifyLicense : t.verifyLicenseValidity} (IRATA)
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
                      
                      {/* IRATA Certification Card Upload - inside verification section */}
                      <div className="pt-3 border-t border-primary/20 space-y-3">
                        <p className="text-sm font-medium">{t.irataCertificationCard}</p>
                        
                        {/* Display existing IRATA documents */}
                        {user.irataDocuments && user.irataDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                          <div className="space-y-2">
                            {user.irataDocuments.filter((u: string) => u && u.trim()).map((url: string, index: number) => {
                              const lowerUrl = url.toLowerCase();
                              const isPdf = lowerUrl.endsWith('.pdf');
                              const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i) || 
                                            lowerUrl.includes('image') || 
                                            (!isPdf && !lowerUrl.endsWith('.doc') && !lowerUrl.endsWith('.docx'));
                              
                              return (
                                <div key={index} className="relative">
                                  <a 
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
                                        alt={`IRATA certification ${index + 1}`}
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
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDeletingDocument({ type: 'irataDocuments', url });
                                    }}
                                    data-testid={`button-delete-irata-doc-${index}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
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
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
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
                                <div key={index} className="relative">
                                  <a 
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
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDeletingDocument({ type: 'spratDocuments', url });
                                    }}
                                    data-testid={`button-delete-sprat-doc-${index}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
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
                                <div key={index} className="relative">
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
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setDeletingDocument({ type: 'firstAidDocuments', url });
                                    }}
                                    data-testid={`button-delete-firstaid-doc-${index}`}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
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

                {/* User Certifications Section */}
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    {t.userCertifications}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t.myCertificationsDesc}</p>
                  
                  <CertificationsManager t={t} />
                </div>

              </div>
                    )}
                  </TabsContent>

                  {/* DOCUMENTS TAB - UNIFIED (uses renderDocumentsTab helper) */}
                  {renderDocumentsTab()}
                </>
              );
              
              return isEditing ? (
                <Form {...form}>
                  <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    {profileTabsContent}
                  </form>
                </Form>
              ) : profileTabsContent;
            })()}
            </Tabs>
          </CardContent>
            </Card>
          </>
        )}
      </main>
      </div>{/* End of lg:pl-60 wrapper */}

      {/* Document Deletion Confirmation Dialog */}
      <AlertDialog open={!!deletingDocument} onOpenChange={(open) => !open && setDeletingDocument(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'en' ? 'Delete Document?' : 'Supprimer le document?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'en' 
                ? 'This action cannot be undone. The document will be permanently removed.'
                : 'Cette action est irréversible. Le document sera définitivement supprimé.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-document">
              {language === 'en' ? 'Cancel' : 'Annuler'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingDocument) {
                  deleteDocumentMutation.mutate({
                    documentType: deletingDocument.type,
                    documentUrl: deletingDocument.url
                  });
                }
              }}
              className="bg-destructive text-destructive-foreground"
              disabled={deleteDocumentMutation.isPending}
              data-testid="button-confirm-delete-document"
            >
              {deleteDocumentMutation.isPending 
                ? (language === 'en' ? 'Deleting...' : 'Suppression...')
                : (language === 'en' ? 'Delete' : 'Supprimer')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Company Confirmation Dialog */}
      <AlertDialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.leaveCompanyConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.leaveCompanyWarning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-leave-company">
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                leaveCompanyMutation.mutate();
                setShowLeaveConfirm(false);
              }}
              className="bg-destructive text-destructive-foreground"
              disabled={leaveCompanyMutation.isPending}
              data-testid="button-confirm-leave-company"
            >
              {leaveCompanyMutation.isPending ? t.loading : t.confirmLeave}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs">
                              {t.inactive || "Inactive"}
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
                  {language === 'en' ? 'Enhanced IRATA task logging' : 'Journalisation IRATA amelioree'}
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


// CertificationsManager component for managing user certifications
function CertificationsManager({ t }: { t: any }) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Query for fetching certifications
  const { data: certificationsData, isLoading, refetch } = useQuery<{ certifications: any[] }>({
    queryKey: ['/api/user/certifications'],
  });
  
  const certifications = certificationsData?.certifications || [];
  
  // Mutation for uploading certifications
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      if (description) formData.append('description', description);
      if (expiryDate) formData.append('expiryDate', expiryDate);
      
      const response = await fetch('/api/user/certifications', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload certification');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({ title: t.certificationUploaded });
      refetch();
      setShowUploadForm(false);
      setDescription("");
      setExpiryDate("");
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    },
    onSettled: () => {
      setIsUploading(false);
    }
  });
  
  // Mutation for deleting certifications
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/user/certifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete certification');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({ title: t.certificationDeleted });
      refetch();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    },
    onSettled: () => {
      setDeletingId(null);
    }
  });
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!description.trim()) {
      toast({ title: t.descriptionRequired || "Description is required", variant: "destructive" });
      if (e.target) e.target.value = "";
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      uploadMutation.mutate(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };
  
  const isExpired = (dateStr: string | null) => {
    if (!dateStr) return false;
    try {
      return new Date(dateStr) < new Date();
    } catch {
      return false;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading certifications...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Existing certifications */}
      {certifications.length > 0 ? (
        <div className="space-y-3">
          {certifications.map((cert: any) => {
            const lowerUrl = (cert.fileUrl || '').toLowerCase();
            const isPdf = lowerUrl.endsWith('.pdf');
            const isImage = lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i);
            const expired = isExpired(cert.expiryDate);
            
            return (
              <div key={cert.id} className="relative border rounded-lg overflow-hidden bg-muted/30">
                <a 
                  href={cert.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block active:opacity-70 transition-opacity"
                >
                  {isPdf ? (
                    <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">{t.tapToViewPdf}</span>
                    </div>
                  ) : isImage ? (
                    <img 
                      src={cert.fileUrl} 
                      alt={cert.description || "Certification"}
                      className="w-full object-contain"
                      style={{ maxHeight: '200px', minHeight: '80px' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">{t.tapToViewDocument}</span>
                    </div>
                  )}
                </a>
                
                {/* Certification info overlay */}
                <div className="p-3 bg-card/90 backdrop-blur-sm border-t">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {cert.description && (
                        <p className="font-medium text-sm truncate">{cert.description}</p>
                      )}
                      {cert.expiryDate && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className={`text-xs ${expired ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {expired ? `${t.expired}: ` : `${t.expiresOn} `}
                            {formatDate(cert.expiryDate)}
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1 truncate">{cert.fileName}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7 flex-shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingId(cert.id);
                        deleteMutation.mutate(cert.id);
                      }}
                      disabled={deletingId === cert.id}
                      data-testid={`button-delete-certification-${cert.id}`}
                    >
                      {deletingId === cert.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">{t.noCertifications}</p>
      )}
      
      {/* Upload form */}
      {showUploadForm ? (
        <div className="space-y-3 p-3 border rounded-lg bg-muted/20">
          <div className="space-y-2">
            <Label htmlFor="cert-description">{t.certificationDescription}</Label>
            <Input
              id="cert-description"
              placeholder={t.certificationDescriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-certification-description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cert-expiry">{t.certificationExpiry}</Label>
            <Input
              id="cert-expiry"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              data-testid="input-certification-expiry"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              disabled={isUploading}
              data-testid="button-select-certification-file"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.uploading}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {t.uploadCertification}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowUploadForm(false);
                setDescription("");
                setExpiryDate("");
              }}
              disabled={isUploading}
              data-testid="button-cancel-certification-upload"
            >
              {t.cancel}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowUploadForm(true)}
          data-testid="button-add-certification"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.addCertification}
        </Button>
      )}
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
        <p className="text-sm text-muted-foreground flex items-center gap-1">{icon}{label}</p>
        <p className="text-base text-muted-foreground/50 italic">Not provided</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-base">{value}</p>
    </div>
  );
}
