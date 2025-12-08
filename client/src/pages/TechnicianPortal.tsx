import { useState, useRef, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate, formatDateTime } from "@/lib/dateUtils";
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
  CreditCard,
  Calendar,
  AlertCircle,
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
  Briefcase
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
    step1: "Click \"Open IRATA Portal\" to open the verification page",
    step2: "Enter your last name and license number",
    step3: "Take a screenshot of the verification result",
    step4: "Come back here and click \"Upload Screenshot\"",
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
    irataVerified: "Your IRATA license has been verified!",
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
    myLoggedHours: "My Logged Hours",
    viewLoggedHoursDesc: "View your work sessions and add previous work experience",
    viewLoggedHours: "View Logged Hours",
    totalHoursLogged: "Total Hours Logged",
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
    step1: "Cliquez sur « Ouvrir le portail IRATA » pour ouvrir la page de vérification",
    step2: "Entrez votre nom de famille et votre numéro de licence",
    step3: "Prenez une capture d'écran du résultat de la vérification",
    step4: "Revenez ici et cliquez sur « Téléverser la capture d'écran »",
    openIrataPortal: "Ouvrir le portail IRATA",
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
    irataVerified: "Votre licence IRATA a été vérifiée!",
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
    myLoggedHours: "Mes heures enregistrées",
    viewLoggedHoursDesc: "Voir vos sessions de travail et ajouter des expériences antérieures",
    viewLoggedHours: "Voir les heures enregistrées",
    totalHoursLogged: "Total des heures enregistrées",
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
});

type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;

export default function TechnicianPortal() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
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
    enabled: !!user && user.role === 'rope_access_tech' && (!user.companyId || !!user.terminatedDate),
  });

  const pendingInvitations = invitationsData?.invitations || [];

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
    if (!file || !uploadingDocType) return;

    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
    if (!isValidType) {
      toast({
        title: t.invalidFile,
        description: t.uploadImageFile,
        variant: "destructive",
      });
      setUploadingDocType(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', uploadingDocType);

      const response = await fetch('/api/technician/upload-document', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t.uploadFailed);
      }

      toast({
        title: t.documentUploaded,
        description: t.documentUploadedDesc,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    } catch (error: any) {
      toast({
        title: t.uploadFailed,
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploadingDocType(null);
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    }
  };

  // Trigger document upload for a specific type
  const triggerDocumentUpload = (docType: string) => {
    setUploadingDocType(docType);
    
    // Handle case where user cancels the file dialog
    // When the file dialog is closed, window regains focus
    const handleDialogClose = () => {
      // Small delay to allow the change event to fire first if a file was selected
      setTimeout(() => {
        if (documentInputRef.current && !documentInputRef.current.files?.length) {
          setUploadingDocType(null);
        }
      }, 300);
      window.removeEventListener('focus', handleDialogClose);
    };
    
    window.addEventListener('focus', handleDialogClose);
    documentInputRef.current?.click();
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
              <p className="text-xs text-muted-foreground">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Work Dashboard Quick Access - Show for linked technicians */}
        {user && user.role === 'rope_access_tech' && user.companyId && !user.terminatedDate && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t.goToWorkDashboard}</p>
                    <p className="text-sm text-muted-foreground">{t.accessProjects}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setLocation("/dashboard")}
                  className="gap-2"
                  data-testid="button-go-to-dashboard"
                >
                  {t.goToWorkDashboard}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Logged Hours - Show for all technicians */}
        {user && user.role === 'rope_access_tech' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{t.myLoggedHours}</p>
                    <p className="text-sm text-muted-foreground">{t.viewLoggedHoursDesc}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/technician-logged-hours")}
                  className="gap-2"
                  data-testid="button-view-logged-hours"
                >
                  {t.viewLoggedHours}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Invitations Section - Show for unlinked technicians OR self-resigned technicians */}
        {user && user.role === 'rope_access_tech' && (!user.companyId || user.terminatedDate) && (
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

        {/* Current Employer Section - Show for linked technicians (not terminated) */}
        {user && user.role === 'rope_access_tech' && user.companyId && !user.terminatedDate && (
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
                            This is a personal tracking tool only, not an official IRATA/SPRAT record.
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.irataLevel && (
                      <InfoItem label="IRATA" value={`${user.irataLevel} - ${user.irataLicenseNumber || 'N/A'}`} />
                    )}
                    {user.spratLevel && (
                      <InfoItem label="SPRAT" value={`${user.spratLevel} - ${user.spratLicenseNumber || 'N/A'}`} />
                    )}
                    {user.irataBaselineHours && parseFloat(user.irataBaselineHours) > 0 && (
                      <InfoItem label={t.baselineHours} value={`${user.irataBaselineHours} ${t.hours}`} icon={<Clock className="w-4 h-4" />} />
                    )}
                  </div>
                  {user.irataDocuments && user.irataDocuments.filter((u: string) => u && u.trim()).length > 0 && (
                    <div className="pt-3">
                      <p className="text-sm text-muted-foreground mb-3">{t.certificationCard}</p>
                      <div className="space-y-3">
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
                              className="block border-2 rounded-lg overflow-hidden active:opacity-70 transition-opacity bg-muted/30"
                            >
                              {isPdf ? (
                                <div className="flex flex-col items-center justify-center py-8 bg-muted gap-2">
                                  <FileText className="w-12 h-12 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground font-medium">{t.tapToViewPdf}</span>
                                </div>
                              ) : isImage ? (
                                <img 
                                  src={url} 
                                  alt={`IRATA certification ${index + 1}`}
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
                                      div.innerHTML = `<span class="text-sm text-muted-foreground">${t.tapToViewDocument}</span>`;
                                      parent.appendChild(div);
                                    }
                                  }}
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
                    </div>
                  )}
                  
                  {/* IRATA License Verification Section - Available to all technicians */}
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
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
                          onClick={() => window.open('https://techconnect.irata.org/verify/tech', '_blank')}
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
                          onClick={() => window.open('https://sprat.org/technician-verification-system/', '_blank')}
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
                  </div>
                  
                  {/* Upload certification card button */}
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => triggerDocumentUpload('certificationCard')}
                      disabled={uploadingDocType === 'certificationCard'}
                      data-testid="button-upload-certification-card"
                    >
                      {uploadingDocType === 'certificationCard' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t.uploading}
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {t.uploadCertificationCard}
                        </>
                      )}
                    </Button>
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
                    <InfoItem label="SIN" value={user.socialInsuranceNumber ? "••• ••• •••" : null} masked />
                    <InfoItem 
                      label="Bank Account" 
                      value={user.bankTransitNumber ? `Transit: ${user.bankTransitNumber}` : null} 
                      masked
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

                {user.driversLicenseNumber && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        {t.driversLicense}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem label="License #" value="••••••••" masked />
                        <InfoItem 
                          label="Expiry" 
                          value={user.driversLicenseExpiry ? formatLocalDate(user.driversLicenseExpiry) : null} 
                        />
                      </div>
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
                  </>
                )}

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
              </div>
            )}
          </CardContent>
        </Card>
      </main>
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
