import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardSidebar, type NavGroup } from "@/components/DashboardSidebar";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate, parseLocalDate } from "@/lib/dateUtils";
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
  Building,
  Building2,
  Calendar,
  AlertCircle,
  HardHat,
  FileText,
  Shield,
  CheckCircle2,
  Upload,
  Loader2,
  ArrowRight,
  Briefcase,
  Copy,
  Share2,
  Users,
  Gift,
  Home,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  FolderOpen,
  Download,
  FileImage,
  FileArchive,
  File,
} from "lucide-react";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";

type Language = 'en' | 'fr' | 'es';

const translations = {
  en: {
    groundCrewPortal: "Ground Crew Portal",
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
    driversLicense: "Driver License",
    licenseNumber: "License #",
    issuedDate: "Issued Date",
    expiry: "Expiry",
    medicalConditions: "Medical Conditions",
    specialMedicalConditions: "Special Medical Conditions",
    medicalPlaceholder: "Optional - Any conditions your employer should be aware of",
    firstAid: "First Aid",
    firstAidType: "Type",
    expiresOn: "Expires on",
    expired: "Expired",
    expiringSoon: "Expiring Soon",
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
    notProvided: "Not provided",
    loadingProfile: "Loading your profile...",
    pleaseLogin: "Please log in to view your profile.",
    goToLogin: "Go to Login",
    profileUpdated: "Profile Updated",
    changesSaved: "Your changes have been saved successfully.",
    updateFailed: "Update Failed",
    invalidFile: "Invalid file",
    uploadImageFile: "Please upload an image or PDF file.",
    uploading: "Uploading...",
    uploadFailed: "Upload Failed",
    documentUploaded: "Document Uploaded",
    documentUploadedDesc: "Your document has been saved successfully.",
    documentDeleted: "Document Deleted",
    documentDeletedDesc: "Your document has been removed.",
    deleteError: "Delete Error",
    deleteErrorDesc: "Failed to delete the document. Please try again.",
    firstAidCertificate: "First Aid Certificate",
    confirmDelete: "Confirm Delete",
    confirmDeleteDesc: "Are you sure you want to delete this document? This action cannot be undone.",
    deleteDocument: "Delete",
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
    linkedEmployer: "Linked Employer",
    currentlyEmployedBy: "You are currently employed by",
    inactiveContactEmployer: "You are currently inactive at {company}. Contact them to be reactivated.",
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
    accessProjects: "Access projects, clock in/out, safety forms, and work dashboard.",
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
    tabHome: "Home",
    tabProfile: "Profile",
    tabInvitations: "Invites",
    tabMore: "More",
    welcome: "Welcome",
    groundCrewMember: "Ground Crew Member",
    quickActions: "Quick Actions",
    yourStatus: "Your Status",
    employmentStatus: "Employment Status",
    notActive: "Not Active",
    referralProgram: "Referral Program",
    referralDesc: "Share your referral code with other ground crew workers",
    yourReferralCode: "Your Referral Code",
    copyCode: "Copy Code",
    shareCode: "Share Code",
    codeCopied: "Referral code copied!",
    referralBonus: "Earn bonuses when referred workers join",
    helpCenter: "Help Center",
    helpCenterDesc: "Get help with using the platform",
    openHelpCenter: "Open Help Center",
    completeYourProfile: "Complete Your Profile",
    completeProfileDesc: "Complete your profile to connect with employers instantly",
    jobBoard: "Job Board",
    browseJobs: "Browse Jobs",
    profile: "Profile",
    editProfileAction: "Edit Profile",
    feedback: "Feedback",
    sendFeedback: "Send Feedback",
    documents: "Documents",
    manageDocuments: "Manage Documents",
    more: "more",
  },
  fr: {
    groundCrewPortal: "Portail Équipe au Sol",
    signOut: "Déconnexion",
    editProfile: "Modifier le Profil",
    cancel: "Annuler",
    saveChanges: "Enregistrer",
    saving: "Enregistrement...",
    personalInfo: "Informations Personnelles",
    fullName: "Nom Complet",
    email: "Email",
    phoneNumber: "Numéro de Téléphone",
    smsNotifications: "Notifications SMS",
    smsNotificationsDescription: "Recevoir des messages texte pour les invitations d'équipe",
    birthday: "Date de Naissance",
    address: "Adresse",
    streetAddress: "Adresse",
    city: "Ville",
    provinceState: "Province/État",
    country: "Pays",
    postalCode: "Code Postal",
    emergencyContact: "Contact d'Urgence",
    contactName: "Nom du Contact",
    contactPhone: "Téléphone du Contact",
    relationship: "Relation",
    payrollInfo: "Informations de Paie",
    sin: "Numéro d'Assurance Sociale",
    bankAccount: "Compte Bancaire",
    transit: "Transit",
    institution: "Institution",
    account: "Compte",
    driversLicense: "Permis de Conduire",
    licenseNumber: "N° de Permis",
    issuedDate: "Date d'Émission",
    expiry: "Expiration",
    medicalConditions: "Conditions Médicales",
    specialMedicalConditions: "Conditions Médicales Spéciales",
    medicalPlaceholder: "Optionnel - Toute condition dont votre employeur devrait être informé",
    firstAid: "Premiers Soins",
    firstAidType: "Type",
    expiresOn: "Expire le",
    expired: "Expiré",
    expiringSoon: "Expire Bientôt",
    uploadedDocuments: "Documents Téléchargés",
    licensePhoto: "Photo du Permis",
    driverAbstract: "Relevé de Conduite",
    voidCheque: "Chèque Annulé / Info Bancaire",
    uploadDocument: "Télécharger Document",
    uploadVoidCheque: "Télécharger Chèque Annulé",
    replaceVoidCheque: "Remplacer Chèque",
    addVoidCheque: "Ajouter Chèque",
    uploadDriversLicense: "Télécharger Permis",
    replaceDriversLicense: "Remplacer Permis",
    addDriversLicense: "Ajouter Photo du Permis",
    uploadDriversAbstract: "Télécharger Relevé",
    replaceDriversAbstract: "Remplacer Relevé",
    addDriversAbstract: "Ajouter Relevé",
    uploadFirstAidCert: "Télécharger Certificat",
    replaceFirstAidCert: "Remplacer Certificat",
    addFirstAidCert: "Ajouter Certificat",
    notProvided: "Non fourni",
    loadingProfile: "Chargement de votre profil...",
    pleaseLogin: "Veuillez vous connecter pour voir votre profil.",
    goToLogin: "Aller à la Connexion",
    profileUpdated: "Profil Mis à Jour",
    changesSaved: "Vos modifications ont été enregistrées avec succès.",
    updateFailed: "Échec de la Mise à Jour",
    invalidFile: "Fichier invalide",
    uploadImageFile: "Veuillez télécharger un fichier image ou PDF.",
    uploading: "Téléchargement...",
    uploadFailed: "Échec du Téléchargement",
    documentUploaded: "Document Téléchargé",
    documentUploadedDesc: "Votre document a été enregistré avec succès.",
    documentDeleted: "Document Supprimé",
    documentDeletedDesc: "Votre document a été supprimé.",
    deleteError: "Erreur de Suppression",
    deleteErrorDesc: "Échec de la suppression du document. Veuillez réessayer.",
    firstAidCertificate: "Certificat de Premiers Soins",
    confirmDelete: "Confirmer la Suppression",
    confirmDeleteDesc: "Êtes-vous sûr de vouloir supprimer ce document? Cette action est irréversible.",
    deleteDocument: "Supprimer",
    privacyNotice: "Avis de Confidentialité",
    privacyText: "Vos informations personnelles sont stockées de manière sécurisée et utilisées uniquement par votre employeur pour les RH et la paie. Nous ne partageons jamais vos données à l'extérieur.",
    errorNameRequired: "Le nom est requis",
    errorInvalidEmail: "Email invalide",
    errorPhoneRequired: "Le téléphone est requis",
    errorEmergencyNameRequired: "Le nom du contact d'urgence est requis",
    errorEmergencyPhoneRequired: "Le téléphone du contact d'urgence est requis",
    teamInvitations: "Invitations d'Équipe",
    pendingInvitations: "Invitations en Attente",
    noInvitations: "Aucune invitation en attente",
    noInvitationsDesc: "Quand une entreprise vous invite à rejoindre son équipe, cela apparaîtra ici.",
    invitedBy: "Invitation de",
    acceptInvitation: "Accepter",
    declineInvitation: "Refuser",
    acceptingInvitation: "Acceptation...",
    decliningInvitation: "Refus...",
    invitationAccepted: "Invitation Acceptée",
    welcomeToTeam: "Bienvenue dans l'équipe!",
    invitationDeclined: "Invitation Refusée",
    declinedMessage: "Vous avez refusé cette invitation.",
    invitationError: "Erreur",
    invitationMessage: "Message",
    invitedOn: "Invité le",
    linkedEmployer: "Employeur Lié",
    inactiveContactEmployer: "Vous êtes actuellement inactif chez {company}. Contactez-les pour être réactivé.",
    currentlyEmployedBy: "Vous êtes actuellement employé par",
    leaveCompany: "Quitter l'Entreprise",
    leavingCompany: "Départ...",
    leaveCompanyConfirm: "Êtes-vous sûr de vouloir quitter cette entreprise?",
    leaveCompanyWarning: "Cela vous retirera de leur effectif. Vous pourrez toujours être invité par d'autres entreprises.",
    confirmLeave: "Oui, Quitter",
    cancelLeave: "Annuler",
    leftCompany: "Entreprise Quittée",
    leftCompanyDesc: "Vous avez quitté l'entreprise avec succès. Vous pouvez maintenant accepter des invitations d'autres entreprises.",
    leaveError: "Erreur",
    yourCompensation: "Votre Rémunération",
    year: "an",
    hour: "h",
    goToWorkDashboard: "Aller au Tableau de Bord",
    accessProjects: "Accédez aux projets, pointage, formulaires de sécurité et tableau de bord.",
    dashboardDisabledNoCompany: "Vous devez être lié à une entreprise pour accéder au tableau de bord. Une invitation est envoyée par votre employeur et apparaîtra ici.",
    dashboardDisabledTerminated: "Votre emploi a été résilié. Acceptez une nouvelle invitation pour accéder au tableau de bord.",
    dashboardDisabledInactive: "Vous êtes actuellement inactif. Contactez votre employeur pour être réactivé.",
    selectEmployer: "Sélectionner Employeur",
    selectEmployerDesc: "Choisissez le tableau de bord de l'employeur",
    connectedEmployers: "Employeurs Connectés",
    primaryEmployer: "Principal",
    inactive: "Inactif",
    active: "Actif",
    setPrimary: "Définir comme Principal",
    continueToEmployer: "Continuer",
    noEmployersConnected: "Aucun employeur connecté",
    tabHome: "Accueil",
    tabProfile: "Profil",
    tabInvitations: "Invites",
    tabMore: "Plus",
    welcome: "Bienvenue",
    groundCrewMember: "Membre de l'Équipe au Sol",
    quickActions: "Actions Rapides",
    yourStatus: "Votre Statut",
    employmentStatus: "Statut d'Emploi",
    notActive: "Non Actif",
    referralProgram: "Programme de Parrainage",
    referralDesc: "Partagez votre code de parrainage avec d'autres travailleurs",
    yourReferralCode: "Votre Code de Parrainage",
    copyCode: "Copier",
    shareCode: "Partager",
    codeCopied: "Code copié!",
    referralBonus: "Gagnez des bonus quand les parrainés rejoignent",
    helpCenter: "Centre d'Aide",
    helpCenterDesc: "Obtenez de l'aide pour utiliser la plateforme",
    openHelpCenter: "Ouvrir le Centre d'Aide",
    completeYourProfile: "Complétez Votre Profil",
    completeProfileDesc: "Complétez votre profil pour vous connecter instantanément avec les employeurs",
    jobBoard: "Offres d'emploi",
    browseJobs: "Parcourir",
    profile: "Profil",
    editProfileAction: "Modifier le Profil",
    feedback: "Commentaires",
    sendFeedback: "Envoyer",
    documents: "Documents",
    manageDocuments: "Gérer Documents",
    more: "de plus",
  },
  es: {
    groundCrewPortal: "Portal Equipo de Tierra",
    signOut: "Cerrar Sesión",
    editProfile: "Editar Perfil",
    cancel: "Cancelar",
    saveChanges: "Guardar",
    saving: "Guardando...",
    personalInfo: "Información Personal",
    fullName: "Nombre Completo",
    email: "Email",
    phoneNumber: "Número de Teléfono",
    smsNotifications: "Notificaciones SMS",
    smsNotificationsDescription: "Recibir mensajes de texto para invitaciones de equipo",
    birthday: "Fecha de Nacimiento",
    address: "Dirección",
    streetAddress: "Dirección",
    city: "Ciudad",
    provinceState: "Provincia/Estado",
    country: "País",
    postalCode: "Código Postal",
    emergencyContact: "Contacto de Emergencia",
    contactName: "Nombre del Contacto",
    contactPhone: "Teléfono del Contacto",
    relationship: "Relación",
    payrollInfo: "Información de Nómina",
    sin: "Número de Seguro Social",
    bankAccount: "Cuenta Bancaria",
    transit: "Tránsito",
    institution: "Institución",
    account: "Cuenta",
    driversLicense: "Licencia de Conducir",
    licenseNumber: "N° de Licencia",
    issuedDate: "Fecha de Emisión",
    expiry: "Vencimiento",
    medicalConditions: "Condiciones Médicas",
    specialMedicalConditions: "Condiciones Médicas Especiales",
    medicalPlaceholder: "Opcional - Cualquier condición que su empleador deba conocer",
    firstAid: "Primeros Auxilios",
    firstAidType: "Tipo",
    expiresOn: "Expira el",
    expired: "Expirado",
    expiringSoon: "Expira Pronto",
    uploadedDocuments: "Documentos Subidos",
    licensePhoto: "Foto de Licencia",
    driverAbstract: "Historial de Conducción",
    voidCheque: "Cheque Anulado / Info Bancaria",
    uploadDocument: "Subir Documento",
    uploadVoidCheque: "Subir Cheque Anulado",
    replaceVoidCheque: "Reemplazar Cheque",
    addVoidCheque: "Agregar Cheque",
    uploadDriversLicense: "Subir Licencia",
    replaceDriversLicense: "Reemplazar Licencia",
    addDriversLicense: "Agregar Foto de Licencia",
    uploadDriversAbstract: "Subir Historial",
    replaceDriversAbstract: "Reemplazar Historial",
    addDriversAbstract: "Agregar Historial",
    uploadFirstAidCert: "Subir Certificado",
    replaceFirstAidCert: "Reemplazar Certificado",
    addFirstAidCert: "Agregar Certificado",
    notProvided: "No proporcionado",
    loadingProfile: "Cargando su perfil...",
    pleaseLogin: "Por favor inicie sesión para ver su perfil.",
    goToLogin: "Ir a Iniciar Sesión",
    profileUpdated: "Perfil Actualizado",
    changesSaved: "Sus cambios se han guardado correctamente.",
    updateFailed: "Error al Actualizar",
    invalidFile: "Archivo inválido",
    uploadImageFile: "Por favor suba un archivo de imagen o PDF.",
    uploading: "Subiendo...",
    uploadFailed: "Error al Subir",
    documentUploaded: "Documento Subido",
    documentUploadedDesc: "Su documento se ha guardado correctamente.",
    documentDeleted: "Documento Eliminado",
    documentDeletedDesc: "Su documento ha sido eliminado.",
    deleteError: "Error al Eliminar",
    deleteErrorDesc: "No se pudo eliminar el documento. Por favor intente de nuevo.",
    firstAidCertificate: "Certificado de Primeros Auxilios",
    confirmDelete: "Confirmar Eliminación",
    confirmDeleteDesc: "¿Está seguro de que desea eliminar este documento? Esta acción no se puede deshacer.",
    deleteDocument: "Eliminar",
    privacyNotice: "Aviso de Privacidad",
    privacyText: "Su información personal se almacena de forma segura y solo la utiliza su empleador para RH y nómina. Nunca compartimos sus datos externamente.",
    errorNameRequired: "El nombre es requerido",
    errorInvalidEmail: "Email inválido",
    errorPhoneRequired: "El teléfono es requerido",
    errorEmergencyNameRequired: "El nombre del contacto de emergencia es requerido",
    errorEmergencyPhoneRequired: "El teléfono del contacto de emergencia es requerido",
    teamInvitations: "Invitaciones de Equipo",
    pendingInvitations: "Invitaciones Pendientes",
    noInvitations: "Sin invitaciones pendientes",
    noInvitationsDesc: "Cuando una empresa le invite a unirse a su equipo, aparecerá aquí.",
    invitedBy: "Invitación de",
    acceptInvitation: "Aceptar",
    declineInvitation: "Rechazar",
    acceptingInvitation: "Aceptando...",
    decliningInvitation: "Rechazando...",
    invitationAccepted: "Invitación Aceptada",
    welcomeToTeam: "Bienvenido al equipo!",
    invitationDeclined: "Invitación Rechazada",
    declinedMessage: "Ha rechazado esta invitación.",
    invitationError: "Error",
    invitationMessage: "Mensaje",
    invitedOn: "Invitado el",
    linkedEmployer: "Empleador Vinculado",
    inactiveContactEmployer: "Actualmente está inactivo en {company}. Contáctelos para ser reactivado.",
    currentlyEmployedBy: "Actualmente empleado por",
    leaveCompany: "Dejar Empresa",
    leavingCompany: "Saliendo...",
    leaveCompanyConfirm: "¿Está seguro de que desea dejar esta empresa?",
    leaveCompanyWarning: "Esto lo eliminará de su plantilla activa. Aún puede ser invitado por otras empresas.",
    confirmLeave: "Sí, Dejar Empresa",
    cancelLeave: "Cancelar",
    leftCompany: "Empresa Dejada",
    leftCompanyDesc: "Ha dejado la empresa con éxito. Ahora puede aceptar invitaciones de otras empresas.",
    leaveError: "Error",
    yourCompensation: "Su Compensación",
    year: "año",
    hour: "hr",
    goToWorkDashboard: "Ir al Panel de Trabajo",
    accessProjects: "Acceda a proyectos, marcaje, formularios de seguridad y panel de trabajo.",
    dashboardDisabledNoCompany: "Necesita estar vinculado con una empresa para acceder al Panel de Trabajo. Una invitación es enviada por su empleador y aparecerá aquí.",
    dashboardDisabledTerminated: "Su empleo ha sido terminado. Acepte una nueva invitación para acceder al Panel de Trabajo.",
    dashboardDisabledInactive: "Actualmente está inactivo. Contacte a su empleador para ser reactivado.",
    selectEmployer: "Seleccionar Empleador",
    selectEmployerDesc: "Elija el panel de qué empleador acceder",
    connectedEmployers: "Empleadores Conectados",
    primaryEmployer: "Principal",
    inactive: "Inactivo",
    active: "Activo",
    setPrimary: "Establecer como Principal",
    continueToEmployer: "Continuar",
    noEmployersConnected: "Sin empleadores conectados",
    tabHome: "Inicio",
    tabProfile: "Perfil",
    tabInvitations: "Invites",
    tabMore: "Más",
    welcome: "Bienvenido",
    groundCrewMember: "Miembro del Equipo de Tierra",
    quickActions: "Acciones Rápidas",
    yourStatus: "Su Estado",
    employmentStatus: "Estado de Empleo",
    notActive: "No Activo",
    referralProgram: "Programa de Referidos",
    referralDesc: "Comparta su código de referido con otros trabajadores",
    yourReferralCode: "Su Código de Referido",
    copyCode: "Copiar",
    shareCode: "Compartir",
    codeCopied: "Código copiado!",
    referralBonus: "Gane bonos cuando los referidos se unan",
    helpCenter: "Centro de Ayuda",
    helpCenterDesc: "Obtenga ayuda para usar la plataforma",
    openHelpCenter: "Abrir Centro de Ayuda",
    completeYourProfile: "Complete Su Perfil",
    completeProfileDesc: "Complete su perfil para conectarse con empleadores al instante",
    jobBoard: "Bolsa de Trabajo",
    browseJobs: "Buscar Trabajos",
    profile: "Perfil",
    editProfileAction: "Editar Perfil",
    feedback: "Comentarios",
    sendFeedback: "Enviar",
    documents: "Documentos",
    manageDocuments: "Gestionar Documentos",
    more: "más",
  }
};

type TabType = 'home' | 'profile' | 'invitations' | 'more';

const createProfileSchema = (t: typeof translations['en']) => z.object({
  name: z.string().min(1, t.errorNameRequired),
  email: z.string().email(t.errorInvalidEmail),
  employeePhoneNumber: z.string().min(1, t.errorPhoneRequired),
  smsNotificationsEnabled: z.boolean().optional(),
  birthday: z.string().optional(),
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
  driversLicenseIssuedDate: z.string().optional(),
  driversLicenseExpiry: z.string().optional(),
  specialMedicalConditions: z.string().optional(),
  firstAidType: z.string().optional(),
  firstAidExpiry: z.string().optional(),
});

type ProfileFormData = z.infer<ReturnType<typeof createProfileSchema>>;

export default function GroundCrewPortal() {
  const { i18n } = useTranslation();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('i18nextLng');
    if (stored === 'fr' || stored === 'es' || stored === 'en') {
      return stored;
    }
    return 'en';
  });
  
  useEffect(() => {
    const handleLanguageChange = () => {
      const currentLang = i18n.language;
      if (currentLang === 'fr' || currentLang === 'es' || currentLang === 'en') {
        setLanguage(currentLang);
      }
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    handleLanguageChange();
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const t = translations[language];

  const getTabFromUrl = (): TabType => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'home' || tab === 'profile' || tab === 'invitations' || tab === 'more') {
      return tab;
    }
    return 'home';
  };
  
  const [activeTab, setActiveTab] = useState<TabType>(getTabFromUrl);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleUrlChange = () => {
      const tab = getTabFromUrl();
      setActiveTab(tab);
    };
    
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [location]);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<string | null>(null);
  
  // Document upload state
  const documentInputRef = useRef<HTMLInputElement>(null);
  const uploadingDocTypeRef = useRef<string | null>(null);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<{ documentType: string; documentUrl: string } | null>(null);

  const { data: user, isLoading } = useQuery<any>({
    queryKey: ["/api/user"],
    select: (data: any) => data?.user,
  });

  const { data: invitationsData } = useQuery<any>({
    queryKey: ["/api/my-invitations"],
    enabled: !!user && (user.role === 'ground_crew' || user.role === 'ground_crew_supervisor'),
  });

  const pendingInvitations = invitationsData?.invitations || [];

  // Profile completion calculation for Ground Crew
  const profileCompletion = (() => {
    if (!user) return { percentage: 0, isComplete: true, incompleteFields: [] };
    
    const requiredFields = [
      { key: 'employeePhoneNumber', label: t.phoneNumber },
      { key: 'emergencyContactName', label: t.emergencyContact },
      { key: 'emergencyContactPhone', label: t.contactPhone },
      { key: 'employeeStreetAddress', label: t.address },
    ];
    
    const optionalFields = [
      { key: 'birthday', label: t.birthday },
      { key: 'driversLicenseNumber', label: t.driversLicense },
      { key: 'bankAccountNumber', label: t.bankAccount },
    ];
    
    const allFields = [...requiredFields, ...optionalFields];
    const completedFields = allFields.filter(field => !!user[field.key]);
    const percentage = Math.round((completedFields.length / allFields.length) * 100);
    const incompleteFields = allFields.filter(field => !user[field.key]);
    
    return {
      percentage,
      isComplete: percentage === 100,
      incompleteFields,
    };
  })();

  const { data: companyData } = useQuery<any>({
    queryKey: ["/api/companies", user?.companyId],
    enabled: !!user?.companyId,
  });

  const profileSchema = createProfileSchema(t);
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      employeePhoneNumber: "",
      smsNotificationsEnabled: false,
      birthday: "",
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
      specialMedicalConditions: "",
      firstAidType: "",
      firstAidExpiry: "",
    },
  });

  // Populate form with user data when loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        employeePhoneNumber: user.employeePhoneNumber || "",
        smsNotificationsEnabled: user.smsNotificationsEnabled ?? false,
        birthday: user.birthday || "",
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
        specialMedicalConditions: user.specialMedicalConditions || "",
        firstAidType: user.firstAidType || "",
        firstAidExpiry: user.firstAidExpiry || "",
      });
    }
  }, [user, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: t.profileUpdated,
        description: t.changesSaved,
      });
    },
    onError: () => {
      toast({
        title: t.updateFailed,
        variant: "destructive",
      });
    },
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      return apiRequest("POST", `/api/invitations/${invitationId}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: t.invitationAccepted,
        description: t.welcomeToTeam,
      });
    },
    onError: () => {
      toast({
        title: t.invitationError,
        variant: "destructive",
      });
    },
  });

  const declineInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      return apiRequest("POST", `/api/invitations/${invitationId}/decline`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-invitations"] });
      toast({
        title: t.invitationDeclined,
        description: t.declinedMessage,
      });
    },
    onError: () => {
      toast({
        title: t.invitationError,
        variant: "destructive",
      });
    },
  });

  const leaveCompanyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/technician/leave-company");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setShowLeaveConfirm(false);
      toast({
        title: t.leftCompany,
        description: t.leftCompanyDesc,
      });
    },
    onError: () => {
      toast({
        title: t.leaveError,
        variant: "destructive",
      });
    },
  });

  // Document delete mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async ({ documentType, documentUrl }: { documentType: string; documentUrl: string }) => {
      return apiRequest("DELETE", "/api/ground-crew/document", { documentType, documentUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setDeletingDocument(null);
      toast({
        title: t.documentDeleted || "Document Deleted",
        description: t.documentDeletedDesc || "Your document has been removed.",
      });
    },
    onError: () => {
      toast({
        title: t.deleteError || "Delete Error",
        description: t.deleteErrorDesc || "Failed to delete the document. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handler for uploading documents
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const docType = uploadingDocTypeRef.current;
    
    if (!file) return;
    
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
        title: t.invalidFile || "Invalid File",
        description: t.uploadImageFile || "Please upload an image or PDF file.",
        variant: "destructive",
      });
      setUploadingDocType(null);
      uploadingDocTypeRef.current = null;
      return;
    }

    toast({
      title: t.uploading || "Uploading...",
      description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', docType);

      const response = await fetch('/api/ground-crew/upload-document', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t.uploadFailed || "Upload failed");
      }

      // OCR scanning for driver's license
      if (docType === 'driversLicense' && file.type.startsWith('image/')) {
        console.log('[GroundCrewPortal] Attempting OCR scan for driver\'s license...');
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
            console.log('[GroundCrewPortal] OCR result:', ocrResult);
            
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
          console.error('[GroundCrewPortal] OCR scan failed:', ocrError);
        }
      }
      
      // OCR scanning for void cheque
      if (docType === 'voidCheque' && file.type.startsWith('image/')) {
        console.log('[GroundCrewPortal] Attempting OCR scan for void cheque...');
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
            console.log('[GroundCrewPortal] OCR result:', ocrResult);
            
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
          console.error('[GroundCrewPortal] OCR scan failed:', ocrError);
        }
      }

      toast({
        title: t.documentUploaded || "Document Uploaded",
        description: t.documentUploadedDesc || "Your document has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    } catch (error: any) {
      toast({
        title: t.uploadFailed || "Upload Failed",
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
    uploadingDocTypeRef.current = docType;
    setUploadingDocType(docType);
    
    if (!documentInputRef.current) {
      toast({
        title: "Upload Error",
        description: "File input not found. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }
    
    documentInputRef.current.value = '';
    
    const handleDialogClose = () => {
      setTimeout(() => {
        if (documentInputRef.current && !documentInputRef.current.files?.length) {
          setUploadingDocType(null);
        }
      }, 1000);
      window.removeEventListener('focus', handleDialogClose);
    };
    
    window.addEventListener('focus', handleDialogClose);
    documentInputRef.current.click();
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout");
      queryClient.clear();
      setLocation("/ground-crew");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const groundCrewNavGroups: NavGroup[] = [
    {
      id: "main",
      label: "NAVIGATION",
      items: [
        {
          id: "home",
          label: t.tabHome || "Home",
          icon: Home,
          onClick: () => setActiveTab('home'),
          isVisible: () => true,
        },
        {
          id: "profile",
          label: t.tabProfile || "Profile",
          icon: User,
          onClick: () => setActiveTab('profile'),
          isVisible: () => true,
        },
        {
          id: "more",
          label: t.tabMore || "More",
          icon: MoreHorizontal,
          onClick: () => setActiveTab('more'),
          isVisible: () => true,
        },
      ],
    },
    {
      id: "employment",
      label: language === 'en' ? "EMPLOYMENT" : language === 'es' ? "EMPLEO" : "EMPLOI",
      items: [
        {
          id: "job-board",
          label: language === 'en' ? "Job Board" : language === 'es' ? "Bolsa de Trabajo" : "Offres d'emploi",
          icon: Briefcase,
          href: "/ground-crew-job-board",
          isVisible: () => true,
        },
        {
          id: "invitations",
          label: language === 'en' ? "Team Invitations" : language === 'es' ? "Invitaciones" : "Invitations",
          icon: Mail,
          onClick: () => setActiveTab('invitations'),
          badge: pendingInvitations.length > 0 ? pendingInvitations.length : undefined,
          badgeType: "alert",
          isVisible: () => true,
        },
      ],
    },
  ];

  const startEditing = () => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        employeePhoneNumber: user.employeePhoneNumber || "",
        smsNotificationsEnabled: user.smsNotificationsEnabled ?? false,
        birthday: user.birthday || "",
        employeeStreetAddress: user.employeeStreetAddress || "",
        city: user.employeeCity || "",
        provinceState: user.employeeProvinceState || "",
        country: user.employeeCountry || "",
        postalCode: user.employeePostalCode || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
        emergencyContactRelationship: user.emergencyContactRelationship || "",
        sin: user.sin || "",
        bankTransit: user.bankTransit || "",
        bankInstitution: user.bankInstitution || "",
        bankAccount: user.bankAccount || "",
        driversLicenseNumber: user.driversLicenseNumber || "",
        driversLicenseIssuedDate: user.driversLicenseIssuedDate || "",
        driversLicenseExpiry: user.driversLicenseExpiry || "",
        specialMedicalConditions: user.specialMedicalConditions || "",
        firstAidType: user.firstAidType || "",
        firstAidExpiry: user.firstAidExpiry || "",
      });
    }
    setIsEditing(true);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  const copyReferralCode = () => {
    if (user?.technicianReferralCode) {
      navigator.clipboard.writeText(user.technicianReferralCode);
      toast({
        title: t.codeCopied,
      });
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="hidden lg:block">
        <DashboardSidebar
          currentUser={user}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as TabType)}
          variant="ground-crew"
          customNavigationGroups={groundCrewNavGroups}
          showDashboardLink={false}
        />
      </div>
      
      <div className="lg:pl-60">
        <header className="sticky top-0 z-[100] h-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-700/80 px-4 sm:px-6">
          <div className="h-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="hidden md:flex flex-1 max-w-xl">
                <DashboardSearch />
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
              
              <LanguageDropdown />
              
              <button 
                onClick={() => setActiveTab('profile')}
                className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
                data-testid="link-user-profile"
              >
                <Avatar className="w-8 h-8 bg-[#5D7B6F]">
                  <AvatarFallback className="bg-[#5D7B6F] text-white text-xs font-medium">
                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 leading-tight">{t.groundCrewMember}</p>
                </div>
              </button>
              
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

        <main className="px-4 sm:px-6 py-6 pb-24 lg:pb-6">
          {activeTab === 'home' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Go to Work Dashboard Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${user.companyId && !user.terminatedDate && !user.suspendedAt ? "bg-[#5D7B6F]/10 dark:bg-[#5D7B6F]/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <Briefcase className={`w-6 h-6 ${user.companyId && !user.terminatedDate && !user.suspendedAt ? "text-[#5D7B6F]" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${!user.companyId || user.terminatedDate || user.suspendedAt ? "text-slate-400" : "text-slate-900 dark:text-slate-100"}`}>{t.goToWorkDashboard}</p>
                        <p className="text-base text-slate-500 dark:text-slate-400">{t.accessProjects}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setLocation("/dashboard")}
                      className="gap-2 bg-[#0B64A3] hover:bg-[#0B64A3]/90 text-white"
                      disabled={!user.companyId || !!user.terminatedDate || !!user.suspendedAt}
                      data-testid="button-go-to-dashboard"
                    >
                      {t.goToWorkDashboard}
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
                            {pendingInvitations.map((invitation: any) => (
                              <div 
                                key={invitation.id} 
                                className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                                data-testid={`invitation-card-${invitation.id}`}
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate">
                                    {t.invitedBy} {invitation.company?.name}
                                  </p>
                                </div>
                                <div className="flex gap-1.5 flex-shrink-0">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700 text-white h-7 px-2"
                                    onClick={() => acceptInvitationMutation.mutate(invitation.id)}
                                    disabled={acceptInvitationMutation.isPending}
                                    data-testid={`button-accept-invitation-${invitation.id}`}
                                  >
                                    {acceptInvitationMutation.isPending ? (
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
                                    disabled={declineInvitationMutation.isPending}
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

              {/* Profile Completion Card - Show until complete */}
              {!profileCompletion.isComplete && (
                <div 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => setActiveTab('profile')}
                  data-testid="card-profile-completion-home"
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                        <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {t.completeYourProfile}
                          </h3>
                          <span className="text-base font-semibold text-[#5D7B6F]">{profileCompletion.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                          <div 
                            className="bg-[#5D7B6F] h-2 rounded-full transition-all" 
                            style={{ width: `${profileCompletion.percentage}%` }}
                          />
                        </div>
                        <p className="text-base text-slate-500 dark:text-slate-400 mb-3">
                          {t.completeProfileDesc}
                        </p>
                        {profileCompletion.incompleteFields.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {profileCompletion.incompleteFields.slice(0, 3).map((field, i) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                {field.label}
                              </span>
                            ))}
                            {profileCompletion.incompleteFields.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                +{profileCompletion.incompleteFields.length - 3} {t.more}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#5D7B6F] flex-shrink-0" />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions Grid - 4 columns on desktop, 2 on mobile */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Job Board */}
                <button
                  onClick={() => setLocation("/ground-crew-job-board")}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-all"
                  data-testid="quick-action-jobs"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#5D7B6F] transition-colors">{t.jobBoard}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.browseJobs}</p>
                </button>
                
                {/* Profile */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-all"
                  data-testid="quick-action-profile"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <p className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#5D7B6F] transition-colors">{t.profile}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.editProfileAction}</p>
                </button>
                
                {/* Team Invitations */}
                <button
                  onClick={() => setActiveTab('invitations')}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-all relative"
                  data-testid="quick-action-invitations"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#5D7B6F] transition-colors">{t.teamInvitations}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.pendingInvitations}</p>
                  {pendingInvitations.length > 0 && (
                    <span className="absolute top-3 right-3 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {pendingInvitations.length}
                    </span>
                  )}
                </button>
                
                {/* Help Center */}
                <button
                  onClick={() => setLocation("/help")}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 text-left hover:shadow-md transition-all"
                  data-testid="quick-action-help"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <p className="font-semibold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#5D7B6F] transition-colors">{t.helpCenter}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.helpCenterDesc}</p>
                </button>
              </div>

              {/* Current Employment Status Card - Only show when employed and not suspended */}
              {user.companyId && !user.terminatedDate && !user.suspendedAt && companyData?.company && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-900/30">
                          <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{companyData.company.companyName || companyData.company.name}</p>
                            <Badge variant="default" className="bg-green-600 text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {t.active}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{t.linkedEmployer}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => setShowLeaveConfirm(true)}
                        data-testid="button-leave-company-home"
                      >
                        {t.leaveCompany}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Suspended Status Card - Show when suspended */}
              {user.companyId && user.suspendedAt && companyData?.company && (
                <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-700 rounded-lg shadow-sm">
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/30">
                        <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{companyData.company.companyName || companyData.company.name}</p>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs">
                            {t.inactive}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t.inactiveContactEmployer.replace('{company}', companyData.company.companyName || companyData.company.name)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
                <div>
                  <CardTitle>{t.personalInfo}</CardTitle>
                  <CardDescription>{t.privacyText}</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={startEditing} variant="outline" data-testid="button-edit-profile">
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t.editProfile}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)} data-testid="button-cancel-edit">
                      <X className="w-4 h-4 mr-2" />
                      {t.cancel}
                    </Button>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={updateMutation.isPending} data-testid="button-save-profile">
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t.saving}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {t.saveChanges}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.fullName}</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} data-testid="input-name" />
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
                              <Input {...field} type="email" disabled={!isEditing} data-testid="input-email" />
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
                              <Input {...field} disabled={!isEditing} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="smsNotificationsEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-medium">
                                {t.smsNotifications}
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                {t.smsNotificationsDescription}
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value ?? false}
                                onCheckedChange={field.onChange}
                                disabled={!isEditing}
                                data-testid="switch-sms-notifications"
                              />
                            </FormControl>
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
                              <Input {...field} type="date" disabled={!isEditing} data-testid="input-birthday" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">{t.address}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="employeeStreetAddress"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>{t.streetAddress}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} data-testid="input-address" />
                              </FormControl>
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
                                <Input {...field} disabled={!isEditing} data-testid="input-city" />
                              </FormControl>
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
                                <Input {...field} disabled={!isEditing} data-testid="input-province" />
                              </FormControl>
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
                                <Input {...field} disabled={!isEditing} data-testid="input-country" />
                              </FormControl>
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
                                <Input {...field} disabled={!isEditing} data-testid="input-postal" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">{t.emergencyContact}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="emergencyContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.contactName}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} data-testid="input-emergency-name" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emergencyContactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.contactPhone}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} data-testid="input-emergency-phone" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emergencyContactRelationship"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.relationship}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} data-testid="input-emergency-relationship" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">{t.medicalConditions}</h3>
                      <FormField
                        control={form.control}
                        name="specialMedicalConditions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t.specialMedicalConditions}</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                disabled={!isEditing} 
                                placeholder={t.medicalPlaceholder}
                                data-testid="input-medical-conditions" 
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">{t.payrollInfo}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="socialInsuranceNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.sin}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} placeholder="XXX-XXX-XXX" data-testid="input-sin" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="bankTransitNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.transit}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} placeholder="XXXXX" data-testid="input-bank-transit" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bankInstitutionNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.institution}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} placeholder="XXX" data-testid="input-bank-institution" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bankAccountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.account}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} placeholder="XXXXXXX" data-testid="input-bank-account" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => triggerDocumentUpload('voidCheque')}
                          disabled={uploadingDocType === 'voidCheque'}
                          data-testid="button-upload-void-cheque"
                        >
                          {uploadingDocType === 'voidCheque' ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          {t.uploadVoidCheque || "Upload Void Cheque"}
                        </Button>
                        {user?.bankDocuments && user.bankDocuments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {user.bankDocuments.map((url: string, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {t.voidCheque || "Void Cheque"} #{index + 1}
                                </a>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeletingDocument({ documentType: 'bankDocuments', documentUrl: url })}
                                  className="h-6 w-6 p-0"
                                  data-testid={`button-delete-bank-doc-${index}`}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">{t.driversLicense}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="driversLicenseNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.licenseNumber}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} data-testid="input-license-number" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="driversLicenseIssuedDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.issuedDate}</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" disabled={!isEditing} data-testid="input-license-issued" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="driversLicenseExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.expiry}</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" disabled={!isEditing} data-testid="input-license-expiry" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => triggerDocumentUpload('driversLicense')}
                          disabled={uploadingDocType === 'driversLicense'}
                          data-testid="button-upload-drivers-license"
                        >
                          {uploadingDocType === 'driversLicense' ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          {t.uploadDriversLicense || "Upload License"}
                        </Button>
                        {user?.driversLicenseDocuments && user.driversLicenseDocuments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {user.driversLicenseDocuments.map((url: string, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {t.driversLicense || "Driver License"} #{index + 1}
                                </a>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeletingDocument({ documentType: 'driversLicenseDocuments', documentUrl: url })}
                                  className="h-6 w-6 p-0"
                                  data-testid={`button-delete-license-doc-${index}`}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4">{t.firstAid}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstAidType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.firstAidType}</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={!isEditing} placeholder="OFA Level 1, Standard First Aid, etc." data-testid="input-first-aid-type" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="firstAidExpiry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.expiry}</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" disabled={!isEditing} data-testid="input-first-aid-expiry" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => triggerDocumentUpload('firstAidCertificate')}
                          disabled={uploadingDocType === 'firstAidCertificate'}
                          data-testid="button-upload-first-aid"
                        >
                          {uploadingDocType === 'firstAidCertificate' ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          {t.uploadFirstAidCert || "Upload First Aid Certificate"}
                        </Button>
                        {user?.firstAidDocuments && user.firstAidDocuments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {user.firstAidDocuments.map((url: string, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {t.firstAidCertificate || "First Aid Certificate"} #{index + 1}
                                </a>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeletingDocument({ documentType: 'firstAidDocuments', documentUrl: url })}
                                  className="h-6 w-6 p-0"
                                  data-testid={`button-delete-first-aid-doc-${index}`}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'invitations' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    {t.teamInvitations}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingInvitations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">{t.noInvitations}</p>
                      <p className="text-sm">{t.noInvitationsDesc}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingInvitations.map((invitation: any) => (
                        <div key={invitation.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1">
                              <p className="font-medium text-lg">{invitation.company?.name || invitation.companyName || 'Company'}</p>
                              <p className="text-sm text-muted-foreground">
                                {t.invitedOn}: {formatLocalDate(invitation.createdAt)}
                              </p>
                              {invitation.message && (
                                <p className="mt-2 text-sm bg-muted/50 p-2 rounded">{invitation.message}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => declineInvitationMutation.mutate(invitation.id)}
                                disabled={declineInvitationMutation.isPending}
                                data-testid={`button-decline-invitation-${invitation.id}`}
                              >
                                {declineInvitationMutation.isPending ? t.decliningInvitation : t.declineInvitation}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => acceptInvitationMutation.mutate(invitation.id)}
                                disabled={acceptInvitationMutation.isPending}
                                data-testid={`button-accept-invitation-${invitation.id}`}
                              >
                                {acceptInvitationMutation.isPending ? t.acceptingInvitation : t.acceptInvitation}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {user.companyId && !user.terminatedDate && !user.suspendedAt && companyData?.company && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {companyData.company.companyName || companyData.company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <Badge variant="default" className="bg-green-600 text-xs mb-2">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {t.active}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{t.linkedEmployer}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowLeaveConfirm(true)}
                        data-testid="button-leave-company"
                      >
                        {t.leaveCompany}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {user.companyId && user.suspendedAt && companyData?.company && (
                <Card className="border-amber-200 dark:border-amber-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-600" />
                      {companyData.company.companyName || companyData.company.name}
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-xs ml-2">
                        {t.inactive}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-sm text-muted-foreground">{t.inactiveContactEmployer.replace('{company}', companyData.company.companyName || companyData.company.name)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'more' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {user.technicianReferralCode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-600" />
                      {t.referralProgram}
                    </CardTitle>
                    <CardDescription>{t.referralDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">{t.yourReferralCode}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xl font-mono font-bold">{user.technicianReferralCode}</code>
                        <Button variant="outline" size="sm" onClick={copyReferralCode} data-testid="button-copy-referral">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{t.referralBonus}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {t.helpCenter}
                  </CardTitle>
                  <CardDescription>{t.helpCenterDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => setLocation('/help')} data-testid="button-help-center">
                    {t.openHelpCenter}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t z-50 safe-area-inset-bottom lg:hidden">
        <div className="w-full px-4 md:px-6 flex items-center justify-around py-2">
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
            onClick={() => setActiveTab('invitations')}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] rounded-lg transition-colors relative ${
              activeTab === 'invitations' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
            data-testid="tab-invitations"
          >
            <Mail className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.tabInvitations}</span>
            {pendingInvitations.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {pendingInvitations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('more')}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] rounded-lg transition-colors ${
              activeTab === 'more' 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground'
            }`}
            data-testid="tab-more"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">{t.tabMore}</span>
          </button>
        </div>
      </nav>

      <AlertDialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.leaveCompanyConfirm}</AlertDialogTitle>
            <AlertDialogDescription>{t.leaveCompanyWarning}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-leave">{t.cancelLeave}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => leaveCompanyMutation.mutate()}
              className="bg-destructive text-destructive-foreground"
              disabled={leaveCompanyMutation.isPending}
              data-testid="button-confirm-leave"
            >
              {leaveCompanyMutation.isPending ? t.leavingCompany : t.confirmLeave}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingDocument} onOpenChange={(open) => !open && setDeletingDocument(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
            <AlertDialogDescription>{t.confirmDeleteDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingDocument && deleteDocumentMutation.mutate(deletingDocument)}
              className="bg-destructive text-destructive-foreground"
              disabled={deleteDocumentMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteDocumentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t.deleteDocument}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <input
        ref={documentInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleDocumentUpload}
        data-testid="input-document-file"
      />
    </div>
  );
}
