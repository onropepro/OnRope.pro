import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, ArrowRight, ArrowLeft, Award, MapPin, Loader2, Phone, Mail, Lock, Heart, Building, CreditCard, Car, Calendar, Upload, Shield, Info, CheckCircle, Check, X, FileText, Languages, Search } from "lucide-react";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { apiRequest } from "@/lib/queryClient";

type Language = 'en' | 'fr';

const translations = {
  en: {
    welcomeTitle: "Welcome to Technician Registration",
    welcomeSubtitle: "Before we begin, here's what you may want to have ready",
    welcomeDocumentsTitle: "Documents You May Need",
    welcomeDocumentsSubtitle: "All documents are optional but recommended",
    welcomeGetStarted: "Get Started",
    welcomeCertCard: "Certification Card",
    welcomeCertCardDesc: "Your IRATA or SPRAT certification card to verify your credentials",
    welcomeFirstAid: "First Aid Certificate",
    welcomeFirstAidDesc: "Proof of valid first aid training for job site requirements",
    welcomeVoidCheque: "Void Cheque",
    welcomeVoidChequeDesc: "For setting up direct deposit payroll payments",
    welcomeDriversLicense: "Driver's License",
    welcomeDriversLicenseDesc: "License photo and driver abstract if you may drive company vehicles",
    welcomeOptionalNote: "Don't worry if you don't have these documents right now. You can complete registration and add them later.",
    continue: "Continue",
    back: "Back",
    cancel: "Cancel",
    submit: "Submit Registration",
    submitting: "Submitting...",
    firstName: "What's your first name?",
    firstNameSubtitle: "Let's start with your first name",
    enterFirstName: "Enter your first name",
    lastName: "What's your last name?",
    lastNameGreeting: "Hi {name}! What's your last name?",
    lastNameSubtitle: "Now let's get your last name",
    enterLastName: "Enter your last name",
    areCertified: "Are you certified?",
    selectCertification: "Select your rope access certification(s)",
    irataCertified: "IRATA Certified",
    spratCertified: "SPRAT Certified",
    bothCertified: "Both IRATA & SPRAT",
    noCertification: "No Certification (Trainee)",
    licenseNumbers: "License Numbers",
    enterLicenseDetails: "Enter your certification details",
    irataLevel: "IRATA Level",
    irataLicenseNumber: "IRATA License Number",
    spratLevel: "SPRAT Level",
    spratLicenseNumber: "SPRAT License Number",
    selectLevel: "Select level",
    level1: "Level 1",
    level2: "Level 2",
    level3: "Level 3",
    enterLicenseNumber: "Enter license number",
    uploadCertCard: "Upload Certification Card (optional)",
    logbookHours: "Logbook Hours",
    totalHoursQuestion: "How many total rope access hours are in your logbook?",
    totalHoursSubtitle: "This helps employers understand your experience level",
    enterHours: "Enter total hours",
    optional: "(optional)",
    experienceStart: "Experience Start",
    experienceStartQuestion: "When did you start your rope access career?",
    experienceStartSubtitle: "Select the date you first started working in rope access",
    experienceStartLabel: "Career Start Date",
    firstAid: "First Aid Certification",
    haveFirstAid: "Do you have a valid First Aid certification?",
    firstAidSubtitle: "Many job sites require valid First Aid training",
    yesFirstAid: "Yes, I have First Aid",
    noFirstAid: "No First Aid certification",
    firstAidType: "First Aid Type",
    selectFirstAidType: "Select type",
    standardFirstAid: "Standard First Aid",
    emergencyFirstAid: "Emergency First Aid",
    advancedFirstAid: "Advanced First Aid",
    wildernesFirstAid: "Wilderness First Aid",
    marineFirstAid: "Marine First Aid",
    otherFirstAid: "Other",
    firstAidExpiry: "Expiry Date",
    uploadFirstAidCert: "Upload First Aid Certificate (optional)",
    address: "Home Address",
    whereDoYouLive: "Where do you live?",
    addressSubtitle: "Enter your current address",
    searchAddress: "Start typing your address...",
    orEnterManually: "Or enter manually:",
    streetAddress: "Street Address",
    city: "City",
    provinceState: "Province/State",
    country: "Country",
    postalCode: "Postal Code",
    email: "Email Address",
    enterEmail: "What's your email address?",
    emailSubtitle: "We'll use this for login and important updates",
    enterEmailPlaceholder: "Enter your email",
    phone: "Phone Number",
    enterPhone: "What's your phone number?",
    phoneSubtitle: "For work-related communication",
    enterPhonePlaceholder: "Enter your phone number",
    password: "Create Password",
    createPassword: "Create a secure password",
    passwordSubtitle: "At least 8 characters",
    enterPassword: "Enter password",
    confirmPassword: "Confirm password",
    passwordsNoMatch: "Passwords do not match",
    emergencyContact: "Emergency Contact",
    emergencyContactQuestion: "Who should we contact in an emergency?",
    emergencyContactSubtitle: "This person will be contacted in case of a workplace emergency",
    contactName: "Contact Name",
    contactPhone: "Contact Phone",
    relationship: "Relationship",
    socialInsurance: "Social Insurance Number",
    enterSIN: "What's your SIN?",
    sinSubtitle: "Required for payroll processing",
    sinPlaceholder: "123-456-789",
    sinSkip: "Skip for now",
    bankInfo: "Bank Information",
    enterBankInfo: "Enter your banking details for payroll",
    bankSubtitle: "Direct deposit information",
    transitNumber: "Transit Number",
    institutionNumber: "Institution Number",
    accountNumber: "Account Number",
    uploadVoidCheque: "Upload Void Cheque (optional)",
    driversLicense: "Driver's License",
    enterDriversLicense: "Do you have a driver's license?",
    driversLicenseSubtitle: "Some jobs require driving company vehicles",
    licenseNumber: "License Number",
    expiryDate: "Expiry Date",
    uploadLicensePhoto: "Upload License Photo (optional)",
    uploadDriverAbstract: "Upload Driver Abstract (optional)",
    skipDriversLicense: "Skip - No driver's license",
    birthday: "Date of Birth",
    enterBirthday: "When were you born?",
    birthdaySubtitle: "Required for HR records",
    medicalConditions: "Medical Conditions",
    anyMedicalConditions: "Any medical conditions we should know about?",
    medicalSubtitle: "This information helps us ensure your safety on job sites",
    medicalPlaceholder: "Any allergies, conditions, or medications...",
    skipMedical: "Skip - No conditions to report",
    registrationComplete: "Registration Complete!",
    thankYou: "Thank you for registering, {name}!",
    completeSubtitle: "Your account has been created successfully",
    goToLogin: "Go to Login",
    infoSecure: "Your Information is Secure",
    infoSecureDesc: "We store your information securely, limit access to authorized employer staff only, and never sell or share it outside your company without your consent or legal requirement.",
    infoUsage: "Information collected may be used by your employer for HR purposes including payroll processing, certification compliance, driving eligibility verification, and emergency contact procedures.",
    registrationSubmitted: "Registration Submitted",
    registrationSubmittedDesc: "Your registration has been submitted successfully.",
    registrationFailed: "Registration Failed",
    employerReview: "Your employer will review your registration and grant you access to the system.",
    emailNotification: "You'll receive an email at",
    accountActivated: "once your account is activated.",
    close: "Close",
    errorFirstName: "Please enter your first name",
    errorLastName: "Please enter your last name",
    errorCertification: "Please select a certification type",
    errorIrataLevel: "Please select your IRATA level",
    errorIrataLicense: "Please enter your IRATA license number",
    errorSpratLevel: "Please select your SPRAT level",
    errorSpratLicense: "Please enter your SPRAT license number",
    errorStreetAddress: "Please enter your street address",
    errorCity: "Please enter your city",
    errorProvinceState: "Please enter your province/state",
    errorCountry: "Please enter your country",
    errorPostalCode: "Please enter your postal code",
    errorEmail: "Please enter a valid email address",
    errorPhone: "Please enter your phone number",
    errorPassword: "Please enter a password",
    errorPasswordLength: "Password must be at least 8 characters",
    errorConfirmPassword: "Please confirm your password",
    errorEmergencyName: "Please enter emergency contact name",
    errorEmergencyPhone: "Please enter emergency contact phone",
    errorEmergencyRelationship: "Please enter your relationship to the contact",
    errorBirthday: "Please enter your birthday",
    referralCodeTitle: "Have a Referral Code?",
    referralCodeSubtitle: "If someone referred you to OnRopePro, enter their code below",
    referralCodePlaceholder: "Enter referral code",
    referralCodeOptional: "This is optional - skip if you don't have one",
    referralCodeSkip: "Skip - No referral code",
    referralCodeInvalid: "Invalid referral code. Please check and try again.",
  },
  fr: {
    welcomeTitle: "Bienvenue à l'inscription des techniciens",
    welcomeSubtitle: "Avant de commencer, voici ce que vous pourriez vouloir préparer",
    welcomeDocumentsTitle: "Documents dont vous pourriez avoir besoin",
    welcomeDocumentsSubtitle: "Tous les documents sont facultatifs mais recommandés",
    welcomeGetStarted: "Commencer",
    welcomeCertCard: "Carte de certification",
    welcomeCertCardDesc: "Votre carte de certification IRATA ou SPRAT pour vérifier vos qualifications",
    welcomeFirstAid: "Certificat de premiers soins",
    welcomeFirstAidDesc: "Preuve de formation valide en premiers soins pour les exigences du chantier",
    welcomeVoidCheque: "Chèque annulé",
    welcomeVoidChequeDesc: "Pour configurer les paiements de paie par dépôt direct",
    welcomeDriversLicense: "Permis de conduire",
    welcomeDriversLicenseDesc: "Photo du permis et relevé de conduite si vous devez conduire des véhicules de l'entreprise",
    welcomeOptionalNote: "Ne vous inquiétez pas si vous n'avez pas ces documents maintenant. Vous pouvez terminer l'inscription et les ajouter plus tard.",
    continue: "Continuer",
    back: "Retour",
    cancel: "Annuler",
    submit: "Soumettre l'inscription",
    submitting: "Envoi en cours...",
    firstName: "Quel est votre prénom?",
    firstNameSubtitle: "Commençons par votre prénom",
    enterFirstName: "Entrez votre prénom",
    lastName: "Quel est votre nom de famille?",
    lastNameGreeting: "Bonjour {name}! Quel est votre nom de famille?",
    lastNameSubtitle: "Maintenant, entrons votre nom de famille",
    enterLastName: "Entrez votre nom de famille",
    areCertified: "Êtes-vous certifié?",
    selectCertification: "Sélectionnez vos certifications d'accès sur corde",
    irataCertified: "Certifié IRATA",
    spratCertified: "Certifié SPRAT",
    bothCertified: "IRATA et SPRAT",
    noCertification: "Aucune certification (Stagiaire)",
    licenseNumbers: "Numéros de licence",
    enterLicenseDetails: "Entrez les détails de votre certification",
    irataLevel: "Niveau IRATA",
    irataLicenseNumber: "Numéro de licence IRATA",
    spratLevel: "Niveau SPRAT",
    spratLicenseNumber: "Numéro de licence SPRAT",
    selectLevel: "Sélectionner le niveau",
    level1: "Niveau 1",
    level2: "Niveau 2",
    level3: "Niveau 3",
    enterLicenseNumber: "Entrez le numéro de licence",
    uploadCertCard: "Téléverser la carte de certification (facultatif)",
    logbookHours: "Heures du carnet",
    totalHoursQuestion: "Combien d'heures totales avez-vous dans votre carnet?",
    totalHoursSubtitle: "Cela aide les employeurs à comprendre votre niveau d'expérience",
    enterHours: "Entrez le total des heures",
    optional: "(facultatif)",
    experienceStart: "Début de carrière",
    experienceStartQuestion: "Quand avez-vous commencé votre carrière d'accès sur corde?",
    experienceStartSubtitle: "Sélectionnez la date à laquelle vous avez commencé à travailler en accès sur corde",
    experienceStartLabel: "Date de début de carrière",
    firstAid: "Certification de premiers soins",
    haveFirstAid: "Avez-vous une certification de premiers soins valide?",
    firstAidSubtitle: "De nombreux chantiers exigent une formation en premiers soins",
    yesFirstAid: "Oui, j'ai les premiers soins",
    noFirstAid: "Pas de certification premiers soins",
    firstAidType: "Type de premiers soins",
    selectFirstAidType: "Sélectionner le type",
    standardFirstAid: "Premiers soins généraux",
    emergencyFirstAid: "Premiers soins d'urgence",
    advancedFirstAid: "Premiers soins avancés",
    wildernesFirstAid: "Premiers soins en milieu sauvage",
    marineFirstAid: "Premiers soins maritimes",
    otherFirstAid: "Autre",
    firstAidExpiry: "Date d'expiration",
    uploadFirstAidCert: "Téléverser le certificat (facultatif)",
    address: "Adresse domicile",
    whereDoYouLive: "Où habitez-vous?",
    addressSubtitle: "Entrez votre adresse actuelle",
    searchAddress: "Commencez à taper votre adresse...",
    orEnterManually: "Ou entrez manuellement:",
    streetAddress: "Adresse civique",
    city: "Ville",
    provinceState: "Province/État",
    country: "Pays",
    postalCode: "Code postal",
    email: "Adresse courriel",
    enterEmail: "Quelle est votre adresse courriel?",
    emailSubtitle: "Nous l'utiliserons pour la connexion et les mises à jour importantes",
    enterEmailPlaceholder: "Entrez votre courriel",
    phone: "Numéro de téléphone",
    enterPhone: "Quel est votre numéro de téléphone?",
    phoneSubtitle: "Pour les communications liées au travail",
    enterPhonePlaceholder: "Entrez votre numéro de téléphone",
    password: "Créer un mot de passe",
    createPassword: "Créez un mot de passe sécurisé",
    passwordSubtitle: "Au moins 8 caractères",
    enterPassword: "Entrez le mot de passe",
    confirmPassword: "Confirmez le mot de passe",
    passwordsNoMatch: "Les mots de passe ne correspondent pas",
    emergencyContact: "Contact d'urgence",
    emergencyContactQuestion: "Qui devons-nous contacter en cas d'urgence?",
    emergencyContactSubtitle: "Cette personne sera contactée en cas d'urgence sur le lieu de travail",
    contactName: "Nom du contact",
    contactPhone: "Téléphone du contact",
    relationship: "Relation",
    socialInsurance: "Numéro d'assurance sociale",
    enterSIN: "Quel est votre NAS?",
    sinSubtitle: "Requis pour le traitement de la paie",
    sinPlaceholder: "123-456-789",
    sinSkip: "Passer pour l'instant",
    bankInfo: "Informations bancaires",
    enterBankInfo: "Entrez vos informations bancaires pour la paie",
    bankSubtitle: "Informations de dépôt direct",
    transitNumber: "Numéro de transit",
    institutionNumber: "Numéro d'institution",
    accountNumber: "Numéro de compte",
    uploadVoidCheque: "Téléverser un chèque annulé (facultatif)",
    driversLicense: "Permis de conduire",
    enterDriversLicense: "Avez-vous un permis de conduire?",
    driversLicenseSubtitle: "Certains emplois nécessitent la conduite de véhicules de l'entreprise",
    licenseNumber: "Numéro de permis",
    expiryDate: "Date d'expiration",
    uploadLicensePhoto: "Téléverser la photo du permis (facultatif)",
    uploadDriverAbstract: "Téléverser le relevé de conduite (facultatif)",
    skipDriversLicense: "Passer - Pas de permis de conduire",
    birthday: "Date de naissance",
    enterBirthday: "Quelle est votre date de naissance?",
    birthdaySubtitle: "Requis pour les dossiers RH",
    medicalConditions: "Conditions médicales",
    anyMedicalConditions: "Y a-t-il des conditions médicales que nous devrions connaître?",
    medicalSubtitle: "Ces informations nous aident à assurer votre sécurité sur les chantiers",
    medicalPlaceholder: "Allergies, conditions ou médicaments...",
    skipMedical: "Passer - Aucune condition à signaler",
    registrationComplete: "Inscription terminée!",
    thankYou: "Merci de vous être inscrit, {name}!",
    completeSubtitle: "Votre compte a été créé avec succès",
    goToLogin: "Aller à la connexion",
    infoSecure: "Vos informations sont sécurisées",
    infoSecureDesc: "Nous stockons vos informations de manière sécurisée, limitons l'accès au personnel autorisé de l'employeur uniquement, et ne vendons ni partageons jamais vos données à l'externe sans votre consentement ou obligation légale.",
    infoUsage: "Les informations collectées peuvent être utilisées par votre employeur à des fins RH, notamment le traitement de la paie, la conformité des certifications, la vérification de l'admissibilité à la conduite et les procédures de contact d'urgence.",
    registrationSubmitted: "Inscription soumise",
    registrationSubmittedDesc: "Votre inscription a été soumise avec succès.",
    registrationFailed: "Échec de l'inscription",
    employerReview: "Votre employeur examinera votre inscription et vous donnera accès au système.",
    emailNotification: "Vous recevrez un courriel à",
    accountActivated: "une fois votre compte activé.",
    close: "Fermer",
    errorFirstName: "Veuillez entrer votre prénom",
    errorLastName: "Veuillez entrer votre nom de famille",
    errorCertification: "Veuillez sélectionner un type de certification",
    errorIrataLevel: "Veuillez sélectionner votre niveau IRATA",
    errorIrataLicense: "Veuillez entrer votre numéro de licence IRATA",
    errorSpratLevel: "Veuillez sélectionner votre niveau SPRAT",
    errorSpratLicense: "Veuillez entrer votre numéro de licence SPRAT",
    errorStreetAddress: "Veuillez entrer votre adresse civique",
    errorCity: "Veuillez entrer votre ville",
    errorProvinceState: "Veuillez entrer votre province/état",
    errorCountry: "Veuillez entrer votre pays",
    errorPostalCode: "Veuillez entrer votre code postal",
    errorEmail: "Veuillez entrer une adresse courriel valide",
    errorPhone: "Veuillez entrer votre numéro de téléphone",
    errorPassword: "Veuillez entrer un mot de passe",
    errorPasswordLength: "Le mot de passe doit comporter au moins 8 caractères",
    errorConfirmPassword: "Veuillez confirmer votre mot de passe",
    errorEmergencyName: "Veuillez entrer le nom du contact d'urgence",
    errorEmergencyPhone: "Veuillez entrer le téléphone du contact d'urgence",
    errorEmergencyRelationship: "Veuillez entrer votre relation avec le contact",
    errorBirthday: "Veuillez entrer votre date de naissance",
    referralCodeTitle: "Avez-vous un code de parrainage?",
    referralCodeSubtitle: "Si quelqu'un vous a recommandé OnRopePro, entrez son code ci-dessous",
    referralCodePlaceholder: "Entrez le code de parrainage",
    referralCodeOptional: "C'est facultatif - passez si vous n'en avez pas",
    referralCodeSkip: "Passer - Pas de code de parrainage",
    referralCodeInvalid: "Code de parrainage invalide. Veuillez vérifier et réessayer.",
  }
};

function FileUploadButton({ 
  label, 
  file, 
  onFileChange,
  accept = "image/*,.pdf",
  testId
}: { 
  label: string; 
  file: File | null; 
  onFileChange: (file: File | null) => void;
  accept?: string;
  testId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const isImage = useMemo(() => {
    return file?.type.startsWith('image/') ?? false;
  }, [file]);
  
  const isPdf = useMemo(() => {
    return file?.type === 'application/pdf';
  }, [file]);
  
  useEffect(() => {
    if (file && isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file, isImage]);
  
  const handleClick = () => {
    inputRef.current?.click();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileChange(selectedFile);
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        onChange={handleChange}
        data-testid={testId}
      />
      <Button
        type="button"
        variant={file ? "default" : "outline"}
        className={`w-full justify-start gap-2 ${file ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
        onClick={handleClick}
      >
        {file ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
        <span className="truncate flex-1 text-left">
          {file ? file.name : label}
        </span>
        {file && (
          <X 
            className="w-4 h-4 ml-auto hover:text-red-200" 
            onClick={handleRemove}
          />
        )}
      </Button>
      {file && (
        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </p>
      )}
      {previewUrl && isImage && (
        <div className="relative mt-2 rounded-md overflow-hidden border border-border">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-auto max-h-48 object-contain bg-muted"
            data-testid={`${testId}-preview`}
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      {file && isPdf && (
        <div className="relative mt-2 rounded-md overflow-hidden border border-border bg-muted p-4 flex items-center gap-3">
          <FileText className="w-8 h-8 text-red-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">PDF Document</p>
          </div>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="h-6 w-6 flex-shrink-0"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

type CertificationType = "irata" | "sprat" | "both" | "none" | null;

type RegistrationStep = 
  | "welcome"
  | "referralCode"
  | "firstName"
  | "lastName"
  | "certification"
  | "licenseNumbers"
  | "logbookHours"
  | "experienceStart"
  | "firstAid"
  | "address"
  | "email"
  | "phone"
  | "password"
  | "emergencyContact"
  | "socialInsurance"
  | "bankInfo"
  | "driversLicense"
  | "birthday"
  | "medicalConditions"
  | "complete";

interface TechnicianData {
  referralCodeInput: string;
  firstName: string;
  lastName: string;
  certification: CertificationType;
  irataLevel: string;
  irataLicenseNumber: string;
  spratLevel: string;
  spratLicenseNumber: string;
  certificationCardFile: File | null;
  logbookTotalHours: string;
  ropeAccessStartDate: string;
  hasFirstAid: boolean;
  firstAidType: string;
  firstAidExpiry: string;
  firstAidFile: File | null;
  streetAddress: string;
  city: string;
  provinceState: string;
  country: string;
  postalCode: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  socialInsuranceNumber: string;
  bankTransitNumber: string;
  bankInstitutionNumber: string;
  bankAccountNumber: string;
  voidChequeFile: File | null;
  driversLicenseNumber: string;
  driversLicenseExpiry: string;
  driversLicenseFile: File | null;
  driversAbstractFile: File | null;
  birthday: string;
  specialMedicalConditions: string;
}

interface TechnicianRegistrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechnicianRegistration({ open, onOpenChange }: TechnicianRegistrationProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<RegistrationStep>("welcome");
  const [data, setData] = useState<TechnicianData>({
    referralCodeInput: "",
    firstName: "",
    lastName: "",
    certification: null,
    irataLevel: "",
    irataLicenseNumber: "",
    spratLevel: "",
    spratLicenseNumber: "",
    certificationCardFile: null,
    logbookTotalHours: "",
    ropeAccessStartDate: "",
    hasFirstAid: false,
    firstAidType: "",
    firstAidExpiry: "",
    firstAidFile: null,
    streetAddress: "",
    city: "",
    provinceState: "",
    country: "",
    postalCode: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    socialInsuranceNumber: "",
    bankTransitNumber: "",
    bankInstitutionNumber: "",
    bankAccountNumber: "",
    voidChequeFile: null,
    driversLicenseNumber: "",
    driversLicenseExpiry: "",
    driversLicenseFile: null,
    driversAbstractFile: null,
    birthday: "",
    specialMedicalConditions: "",
  });
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('technicianLanguage') as Language) || 'en';
    }
    return 'en';
  });
  
  const t = translations[language];
  
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    localStorage.setItem('technicianLanguage', newLang);
  };

  const resetForm = () => {
    setStep("welcome");
    setData({
      referralCodeInput: "",
      firstName: "",
      lastName: "",
      certification: null,
      irataLevel: "",
      irataLicenseNumber: "",
      spratLevel: "",
      spratLicenseNumber: "",
      certificationCardFile: null,
      logbookTotalHours: "",
      ropeAccessStartDate: "",
      hasFirstAid: false,
      firstAidType: "",
      firstAidExpiry: "",
      firstAidFile: null,
      streetAddress: "",
      city: "",
      provinceState: "",
      country: "",
      postalCode: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
      socialInsuranceNumber: "",
      bankTransitNumber: "",
      bankInstitutionNumber: "",
      bankAccountNumber: "",
      voidChequeFile: null,
      driversLicenseNumber: "",
      driversLicenseExpiry: "",
      driversLicenseFile: null,
      driversAbstractFile: null,
      birthday: "",
      specialMedicalConditions: "",
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const stepOrder: RegistrationStep[] = [
    "welcome",
    "referralCode",
    "firstName",
    "lastName", 
    "certification",
    "licenseNumbers",
    "logbookHours",
    "experienceStart",
    "firstAid",
    "address",
    "email",
    "phone",
    "password",
    "emergencyContact",
    "socialInsurance",
    "bankInfo",
    "driversLicense",
    "birthday",
    "medicalConditions",
    "complete"
  ];

  const getNextStep = (currentStep: RegistrationStep): RegistrationStep => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentStep === "certification" && data.certification === "none") {
      return "address";
    }
    return stepOrder[currentIndex + 1] || "complete";
  };

  const getPrevStep = (currentStep: RegistrationStep): RegistrationStep => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentStep === "address" && data.certification === "none") {
      return "certification";
    }
    return stepOrder[currentIndex - 1] || "welcome";
  };

  const handleContinue = () => {
    setError("");
    
    switch (step) {
      case "firstName":
        if (!data.firstName.trim()) {
          setError(t.errorFirstName);
          return;
        }
        break;
      case "lastName":
        if (!data.lastName.trim()) {
          setError(t.errorLastName);
          return;
        }
        break;
      case "certification":
        if (!data.certification) {
          setError(t.errorCertification);
          return;
        }
        break;
      case "licenseNumbers":
        if (data.certification === "irata" || data.certification === "both") {
          if (!data.irataLevel) {
            setError(t.errorIrataLevel);
            return;
          }
          if (!data.irataLicenseNumber.trim()) {
            setError(t.errorIrataLicense);
            return;
          }
        }
        if (data.certification === "sprat" || data.certification === "both") {
          if (!data.spratLevel) {
            setError(t.errorSpratLevel);
            return;
          }
          if (!data.spratLicenseNumber.trim()) {
            setError(t.errorSpratLicense);
            return;
          }
        }
        break;
      case "address":
        if (!data.streetAddress.trim()) {
          setError(t.errorStreetAddress);
          return;
        }
        if (!data.city.trim()) {
          setError(t.errorCity);
          return;
        }
        if (!data.provinceState.trim()) {
          setError(t.errorProvinceState);
          return;
        }
        if (!data.country.trim()) {
          setError(t.errorCountry);
          return;
        }
        if (!data.postalCode.trim()) {
          setError(t.errorPostalCode);
          return;
        }
        break;
      case "email":
        if (!data.email.trim()) {
          setError(t.errorEmail);
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          setError(t.errorEmail);
          return;
        }
        break;
      case "phone":
        if (!data.phone.trim()) {
          setError(t.errorPhone);
          return;
        }
        break;
      case "password":
        if (!data.password) {
          setError(t.errorPassword);
          return;
        }
        if (data.password.length < 8) {
          setError(t.errorPasswordLength);
          return;
        }
        if (!/[A-Z]/.test(data.password)) {
          setError(t.errorPasswordLength);
          return;
        }
        if (!/[a-z]/.test(data.password)) {
          setError(t.errorPasswordLength);
          return;
        }
        if (!/[0-9]/.test(data.password)) {
          setError(t.errorPasswordLength);
          return;
        }
        if (data.password !== data.confirmPassword) {
          setError(t.passwordsNoMatch);
          return;
        }
        break;
      case "emergencyContact":
        if (!data.emergencyContactName.trim()) {
          setError(t.errorEmergencyName);
          return;
        }
        if (!data.emergencyContactPhone.trim()) {
          setError(t.errorEmergencyPhone);
          return;
        }
        break;
      case "firstAid":
        if (data.hasFirstAid && !data.firstAidType.trim()) {
          setError(t.selectFirstAidType);
          return;
        }
        break;
      case "socialInsurance":
        break;
      case "bankInfo":
        break;
      case "driversLicense":
        break;
      case "birthday":
        break;
      case "medicalConditions":
        break;
    }
    
    setStep(getNextStep(step));
  };

  const handleBack = () => {
    setError("");
    setStep(getPrevStep(step));
  };

  const handleCertificationSelect = (cert: CertificationType) => {
    setData({ ...data, certification: cert });
    setError("");
  };

  const handleFileChange = (field: keyof TechnicianData, file: File | null) => {
    setData({ ...data, [field]: file });
  };

  const registrationMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      
      // Include referral code if provided
      if (data.referralCodeInput) {
        formData.append('referralCodeInput', data.referralCodeInput);
      }
      
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('certification', data.certification || 'none');
      formData.append('irataLevel', data.irataLevel);
      formData.append('irataLicenseNumber', data.irataLicenseNumber);
      formData.append('spratLevel', data.spratLevel);
      formData.append('spratLicenseNumber', data.spratLicenseNumber);
      formData.append('logbookTotalHours', data.logbookTotalHours);
      formData.append('ropeAccessStartDate', data.ropeAccessStartDate);
      formData.append('streetAddress', data.streetAddress);
      formData.append('city', data.city);
      formData.append('provinceState', data.provinceState);
      formData.append('country', data.country);
      formData.append('postalCode', data.postalCode);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('emergencyContactName', data.emergencyContactName);
      formData.append('emergencyContactPhone', data.emergencyContactPhone);
      formData.append('emergencyContactRelationship', data.emergencyContactRelationship);
      formData.append('socialInsuranceNumber', data.socialInsuranceNumber);
      formData.append('bankTransitNumber', data.bankTransitNumber);
      formData.append('bankInstitutionNumber', data.bankInstitutionNumber);
      formData.append('bankAccountNumber', data.bankAccountNumber);
      formData.append('driversLicenseNumber', data.driversLicenseNumber);
      formData.append('driversLicenseExpiry', data.driversLicenseExpiry);
      formData.append('birthday', data.birthday);
      formData.append('specialMedicalConditions', data.specialMedicalConditions);
      formData.append('hasFirstAid', data.hasFirstAid.toString());
      formData.append('firstAidType', data.firstAidType);
      formData.append('firstAidExpiry', data.firstAidExpiry);
      
      if (data.certificationCardFile) {
        formData.append('certificationCard', data.certificationCardFile);
      }
      if (data.firstAidFile) {
        formData.append('firstAidCertificate', data.firstAidFile);
      }
      if (data.voidChequeFile) {
        formData.append('voidCheque', data.voidChequeFile);
      }
      if (data.driversLicenseFile) {
        formData.append('driversLicense', data.driversLicenseFile);
      }
      if (data.driversAbstractFile) {
        formData.append('driversAbstract', data.driversAbstractFile);
      }

      const response = await fetch('/api/technician-register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t.registrationSubmitted,
        description: t.registrationSubmittedDesc,
      });
      setStep("complete");
    },
    onError: (error: Error) => {
      setError(error.message);
      toast({
        title: t.registrationFailed,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    registrationMutation.mutate();
  };

  const PrivacyNotice = () => (
    <div className="p-3 rounded-lg bg-muted/50 border text-sm space-y-2">
      <div className="flex items-start gap-2">
        <Shield className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
        <div>
          <p className="font-medium">{t.infoSecure}</p>
          <p className="text-muted-foreground text-xs mt-1">
            {t.infoSecureDesc}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
        <p className="text-muted-foreground text-xs">
          {t.infoUsage}
        </p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case "welcome":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9" />
                <div className="p-3 rounded-full bg-primary/10">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLanguage}
                  data-testid="button-toggle-language-welcome"
                  title={language === 'en' ? 'Passer au français' : 'Switch to English'}
                >
                  <Languages className="w-5 h-5" />
                </Button>
              </div>
              <DialogTitle className="text-center text-xl">{t.welcomeTitle}</DialogTitle>
              <DialogDescription className="text-center">
                {t.welcomeSubtitle}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 border">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  {t.welcomeDocumentsTitle}
                </h4>
                <p className="text-xs text-muted-foreground mb-3">{t.welcomeDocumentsSubtitle}</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 flex-shrink-0">
                      <Award className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.welcomeCertCard}</p>
                      <p className="text-xs text-muted-foreground">{t.welcomeCertCardDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 flex-shrink-0">
                      <Heart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.welcomeFirstAid}</p>
                      <p className="text-xs text-muted-foreground">{t.welcomeFirstAidDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.welcomeVoidCheque}</p>
                      <p className="text-xs text-muted-foreground">{t.welcomeVoidChequeDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 flex-shrink-0">
                      <Car className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.welcomeDriversLicense}</p>
                      <p className="text-xs text-muted-foreground">{t.welcomeDriversLicenseDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {t.welcomeOptionalNote}
                </p>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-get-started"
              >
                {t.welcomeGetStarted}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="w-full"
                data-testid="button-cancel-registration"
              >
                {t.cancel}
              </Button>
            </DialogFooter>
          </>
        );

      case "referralCode":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9" />
                <div className="p-3 rounded-full bg-primary/10">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLanguage}
                  data-testid="button-toggle-language-registration"
                  title={language === 'en' ? 'Passer au français' : 'Switch to English'}
                >
                  <Languages className="w-5 h-5" />
                </Button>
              </div>
              <DialogTitle className="text-center text-xl">{t.referralCodeTitle}</DialogTitle>
              <DialogDescription className="text-center">
                {t.referralCodeSubtitle}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div>
                <Label htmlFor="referralCode" className="sr-only">{t.referralCodeTitle}</Label>
                <Input
                  id="referralCode"
                  data-testid="input-technician-referral-code"
                  placeholder={t.referralCodePlaceholder}
                  value={data.referralCodeInput}
                  onChange={(e) => setData({ ...data, referralCodeInput: e.target.value.toUpperCase() })}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  autoFocus
                  className="text-center text-lg h-12 uppercase tracking-widest font-mono"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">{t.referralCodeOptional}</p>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-referral-code"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setData({ ...data, referralCodeInput: "" });
                  setStep(getNextStep("referralCode"));
                }}
                className="w-full"
                data-testid="button-skip-referral-code"
              >
                {t.referralCodeSkip}
              </Button>
            </DialogFooter>
          </>
        );

      case "firstName":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9" />
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLanguage}
                  data-testid="button-toggle-language-registration"
                  title={language === 'en' ? 'Passer au français' : 'Switch to English'}
                >
                  <Languages className="w-5 h-5" />
                </Button>
              </div>
              <DialogTitle className="text-center text-xl">{t.firstName}</DialogTitle>
              <DialogDescription className="text-center">
                {t.firstNameSubtitle}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <PrivacyNotice />
              <div>
                <Label htmlFor="firstName" className="sr-only">{t.firstName}</Label>
                <Input
                  id="firstName"
                  data-testid="input-technician-first-name"
                  placeholder={t.enterFirstName}
                  value={data.firstName}
                  onChange={(e) => setData({ ...data, firstName: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  autoFocus
                  className="text-center text-lg h-12"
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-first-name"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="w-full"
                data-testid="button-cancel-registration"
              >
                {t.cancel}
              </Button>
            </DialogFooter>
          </>
        );

      case "lastName":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="w-8 h-8 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                {t.lastNameGreeting.replace('{name}', data.firstName)}
              </DialogTitle>
              <DialogDescription className="text-center">
                {t.lastNameSubtitle}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="lastName" className="sr-only">{t.lastName}</Label>
              <Input
                id="lastName"
                data-testid="input-technician-last-name"
                placeholder={t.enterLastName}
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                autoFocus
                className="text-center text-lg h-12"
              />
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-last-name"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
                data-testid="button-back-to-first-name"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "certification":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <Award className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                {t.areCertified}
              </DialogTitle>
              <DialogDescription className="text-center">
                {t.selectCertification}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-3">
              <Button
                variant={data.certification === "irata" ? "default" : "outline"}
                className="w-full h-14 text-base justify-start px-4"
                onClick={() => handleCertificationSelect("irata")}
                data-testid="button-cert-irata"
              >
                <Award className="w-5 h-5 mr-3" />
                {t.irataCertified}
              </Button>
              <Button
                variant={data.certification === "sprat" ? "default" : "outline"}
                className="w-full h-14 text-base justify-start px-4"
                onClick={() => handleCertificationSelect("sprat")}
                data-testid="button-cert-sprat"
              >
                <Award className="w-5 h-5 mr-3" />
                {t.spratCertified}
              </Button>
              <Button
                variant={data.certification === "both" ? "default" : "outline"}
                className="w-full h-14 text-base justify-start px-4"
                onClick={() => handleCertificationSelect("both")}
                data-testid="button-cert-both"
              >
                <Award className="w-5 h-5 mr-3" />
                {t.bothCertified}
              </Button>
              <Button
                variant={data.certification === "none" ? "default" : "outline"}
                className="w-full h-14 text-base justify-start px-4"
                onClick={() => handleCertificationSelect("none")}
                data-testid="button-cert-none"
              >
                <User className="w-5 h-5 mr-3" />
                {t.noCertification}
              </Button>
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                disabled={!data.certification}
                data-testid="button-continue-certification"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
                data-testid="button-back-to-last-name"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "licenseNumbers":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-amber-500/10">
                  <Award className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                {t.enterLicenseDetails}
              </DialogTitle>
              <DialogDescription className="text-center">
                {data.certification === "both" 
                  ? "Please enter both your IRATA and SPRAT license details"
                  : `Please enter your ${data.certification?.toUpperCase()} license details`
                }
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {(data.certification === "irata" || data.certification === "both") && (
                <div className="space-y-4 p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold">IRATA License</h3>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <p className="text-muted-foreground">
                      Your IRATA license number format is: <strong>1/123456</strong> where the first digit 
                      indicates your level (1, 2, or 3) followed by your unique license number.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>IRATA Level & License Number</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={data.irataLevel}
                        onValueChange={(value) => setData({ ...data, irataLevel: value })}
                      >
                        <SelectTrigger className="w-24" data-testid="select-irata-level">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1/</SelectItem>
                          <SelectItem value="2">2/</SelectItem>
                          <SelectItem value="3">3/</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        data-testid="input-irata-license-number"
                        placeholder="123456"
                        value={data.irataLicenseNumber}
                        onChange={(e) => setData({ ...data, irataLicenseNumber: e.target.value.replace(/\D/g, '') })}
                        className="flex-1"
                        maxLength={10}
                      />
                    </div>
                    {data.irataLevel && data.irataLicenseNumber && (
                      <p className="text-sm text-muted-foreground">
                        Full license number: <Badge variant="secondary">{data.irataLevel}/{data.irataLicenseNumber}</Badge>
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Certification Card (Optional)</Label>
                    <FileUploadButton
                      label="Upload IRATA certification card photo"
                      file={data.certificationCardFile}
                      onFileChange={(file) => handleFileChange('certificationCardFile', file)}
                      testId="input-cert-card-upload"
                    />
                  </div>
                </div>
              )}

              {(data.certification === "sprat" || data.certification === "both") && (
                <div className="space-y-4 p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">SPRAT License</h3>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <p className="text-muted-foreground">
                      Your SPRAT certification level (1, 2, or 3) and license number.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>SPRAT Level & License Number</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={data.spratLevel}
                        onValueChange={(value) => setData({ ...data, spratLevel: value })}
                      >
                        <SelectTrigger className="w-24" data-testid="select-sprat-level">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Level 1</SelectItem>
                          <SelectItem value="2">Level 2</SelectItem>
                          <SelectItem value="3">Level 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        data-testid="input-sprat-license-number"
                        placeholder="License number"
                        value={data.spratLicenseNumber}
                        onChange={(e) => setData({ ...data, spratLicenseNumber: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-license"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "logbookHours":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <Calendar className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Current Logbook Hours
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional: Enter your current total hours
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Why we ask for this (optional):</strong>
                    </p>
                    <p>
                      Your current logbook total hours help us provide accurate hour tracking going forward. 
                      When you log future work hours, we can show you your cumulative total based on this starting point.
                    </p>
                    <p className="text-xs border-t pt-2 mt-2">
                      <strong>Important:</strong> This is a personal tracking tool only. It is NOT an official 
                      IRATA or SPRAT approved method for logging hours. Your official logbook remains the 
                      authoritative record for certification purposes.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logbookHours">Total Logbook Hours (Optional)</Label>
                <Input
                  id="logbookHours"
                  data-testid="input-logbook-hours"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 1500"
                  value={data.logbookTotalHours}
                  onChange={(e) => setData({ ...data, logbookTotalHours: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your approximate total hours for personal tracking. This does not replace your official logbook.
                </p>
              </div>

              {data.logbookTotalHours && (
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-sm text-center">
                    Starting logbook hours: <Badge variant="secondary">{parseFloat(data.logbookTotalHours).toLocaleString()} hours</Badge>
                  </p>
                </div>
              )}

              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-logbook"
              >
                {data.logbookTotalHours ? "Continue" : "Skip for now"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "experienceStart":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-indigo-500/10">
                  <Calendar className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                {t.experienceStartQuestion}
              </DialogTitle>
              <DialogDescription className="text-center">
                {t.experienceStartSubtitle}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>{language === 'en' ? "Why we ask (optional):" : "Pourquoi nous demandons (facultatif):"}</strong>
                    </p>
                    <p>
                      {language === 'en' 
                        ? "Knowing when you started helps employers understand your overall experience level. We'll automatically calculate your years and months of experience."
                        : "Savoir quand vous avez commencé aide les employeurs à comprendre votre niveau d'expérience global. Nous calculerons automatiquement vos années et mois d'expérience."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ropeAccessStartDate">{t.experienceStartLabel} {t.optional}</Label>
                <Input
                  id="ropeAccessStartDate"
                  data-testid="input-rope-access-start-date"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={data.ropeAccessStartDate}
                  onChange={(e) => setData({ ...data, ropeAccessStartDate: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  {language === 'en'
                    ? "Select the approximate date you first started working in rope access."
                    : "Sélectionnez la date approximative à laquelle vous avez commencé à travailler en accès sur corde."}
                </p>
              </div>

              {data.ropeAccessStartDate && (
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-sm text-center">
                    {(() => {
                      const startDate = new Date(data.ropeAccessStartDate + 'T00:00:00');
                      const now = new Date();
                      const diffMs = now.getTime() - startDate.getTime();
                      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                      const years = Math.floor(diffDays / 365);
                      const months = Math.floor((diffDays % 365) / 30);
                      
                      if (language === 'en') {
                        if (years === 0 && months === 0) return `Experience: Less than a month`;
                        if (years === 0) return `Experience: ${months} month${months !== 1 ? 's' : ''}`;
                        if (months === 0) return `Experience: ${years} year${years !== 1 ? 's' : ''}`;
                        return `Experience: ${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
                      } else {
                        if (years === 0 && months === 0) return `Expérience: Moins d'un mois`;
                        if (years === 0) return `Expérience: ${months} mois`;
                        if (months === 0) return `Expérience: ${years} an${years !== 1 ? 's' : ''}`;
                        return `Expérience: ${years} an${years !== 1 ? 's' : ''}, ${months} mois`;
                      }
                    })()}
                  </p>
                </div>
              )}

              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-experience"
              >
                {data.ropeAccessStartDate ? t.continue : (language === 'en' ? "Skip for now" : "Passer pour l'instant")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "firstAid":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                First Aid Certification
              </DialogTitle>
              <DialogDescription className="text-center">
                Do you have any first aid certification?
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={data.hasFirstAid ? "default" : "outline"}
                  className="h-16 flex flex-col items-center justify-center gap-1"
                  onClick={() => setData({ ...data, hasFirstAid: true })}
                  data-testid="button-has-first-aid-yes"
                >
                  <Check className="w-5 h-5" />
                  <span>Yes</span>
                </Button>
                <Button
                  type="button"
                  variant={!data.hasFirstAid && data.hasFirstAid !== undefined ? "default" : "outline"}
                  className="h-16 flex flex-col items-center justify-center gap-1"
                  onClick={() => setData({ ...data, hasFirstAid: false, firstAidType: "", firstAidExpiry: "", firstAidFile: null })}
                  data-testid="button-has-first-aid-no"
                >
                  <X className="w-5 h-5" />
                  <span>No</span>
                </Button>
              </div>

              {data.hasFirstAid && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="firstAidType">Type of First Aid Certification</Label>
                    <Input
                      id="firstAidType"
                      data-testid="input-first-aid-type"
                      placeholder="e.g., Standard First Aid, CPR/AED, OFA Level 1"
                      value={data.firstAidType}
                      onChange={(e) => setData({ ...data, firstAidType: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the name/type of your first aid certification
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firstAidExpiry">Expiry Date (Optional)</Label>
                    <Input
                      id="firstAidExpiry"
                      data-testid="input-first-aid-expiry"
                      type="date"
                      value={data.firstAidExpiry}
                      onChange={(e) => setData({ ...data, firstAidExpiry: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Certificate (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {data.firstAidFile ? (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{data.firstAidFile.name}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setData({ ...data, firstAidFile: null })}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id="firstAidFile"
                            data-testid="input-first-aid-file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setData({ ...data, firstAidFile: file });
                              }
                            }}
                          />
                          <label
                            htmlFor="firstAidFile"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Upload className="w-8 h-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Tap to upload certificate photo or PDF
                            </span>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-first-aid"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "address":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <MapPin className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                {t.whereDoYouLive}
              </DialogTitle>
              <DialogDescription className="text-center">
                {t.addressSubtitle}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  {t.searchAddress.replace("...", "")}
                </Label>
                <AddressAutocomplete
                  data-testid="input-address-autocomplete"
                  placeholder={t.searchAddress}
                  onSelect={(address) => {
                    const streetAddress = address.houseNumber 
                      ? `${address.houseNumber} ${address.street}`.trim()
                      : address.street;
                    setData({
                      ...data,
                      streetAddress: streetAddress || data.streetAddress,
                      city: address.city || data.city,
                      provinceState: address.state || data.provinceState,
                      country: address.country || data.country,
                      postalCode: address.postcode || data.postalCode,
                    });
                  }}
                />
              </div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t.orEnterManually}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress">{t.streetAddress}</Label>
                <Input
                  id="streetAddress"
                  data-testid="input-street-address"
                  placeholder="123 Main Street, Apt 4B"
                  value={data.streetAddress}
                  onChange={(e) => setData({ ...data, streetAddress: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t.city}</Label>
                  <Input
                    id="city"
                    data-testid="input-city"
                    placeholder="Vancouver"
                    value={data.city}
                    onChange={(e) => setData({ ...data, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provinceState">{t.provinceState}</Label>
                  <Input
                    id="provinceState"
                    data-testid="input-province-state"
                    placeholder="BC"
                    value={data.provinceState}
                    onChange={(e) => setData({ ...data, provinceState: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">{t.country}</Label>
                  <Input
                    id="country"
                    data-testid="input-country"
                    placeholder="Canada"
                    value={data.country}
                    onChange={(e) => setData({ ...data, country: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">{t.postalCode}</Label>
                  <Input
                    id="postalCode"
                    data-testid="input-postal-code"
                    placeholder="V6B 1A1"
                    value={data.postalCode}
                    onChange={(e) => setData({ ...data, postalCode: e.target.value })}
                  />
                </div>
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-address"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "email":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Mail className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                What's your email?
              </DialogTitle>
              <DialogDescription className="text-center">
                We'll use this to send you important updates
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                type="email"
                data-testid="input-email"
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                autoFocus
                className="text-center text-lg h-12"
              />
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-email"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "phone":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <Phone className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                What's your phone number?
              </DialogTitle>
              <DialogDescription className="text-center">
                For work-related communication
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="phone" className="sr-only">Phone</Label>
              <Input
                id="phone"
                type="tel"
                data-testid="input-phone"
                placeholder="(604) 555-0123"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                autoFocus
                className="text-center text-lg h-12"
              />
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-phone"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "password":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-purple-500/10">
                  <Lock className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Create a password
              </DialogTitle>
              <DialogDescription className="text-center">
                Choose a secure password
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Password requirements:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter (A-Z)</li>
                  <li>At least one lowercase letter (a-z)</li>
                  <li>At least one number (0-9)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  data-testid="input-password"
                  placeholder="Enter password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  data-testid="input-confirm-password"
                  placeholder="Re-enter password"
                  value={data.confirmPassword}
                  onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  className="h-12"
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-password"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "emergencyContact":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Emergency Contact
              </DialogTitle>
              <DialogDescription className="text-center">
                Who should we contact in case of emergency?
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  data-testid="input-emergency-name"
                  placeholder="John Doe"
                  value={data.emergencyContactName}
                  onChange={(e) => setData({ ...data, emergencyContactName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  data-testid="input-emergency-phone"
                  placeholder="(604) 555-0123"
                  value={data.emergencyContactPhone}
                  onChange={(e) => setData({ ...data, emergencyContactPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Input
                  id="emergencyRelationship"
                  data-testid="input-emergency-relationship"
                  placeholder="e.g., Spouse, Parent, Sibling, Friend"
                  value={data.emergencyContactRelationship}
                  onChange={(e) => setData({ ...data, emergencyContactRelationship: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-emergency"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "socialInsurance":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-slate-500/10">
                  <Building className="w-8 h-8 text-slate-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Social Insurance Number
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - for Human Resources and payroll purposes
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">
                  Your SIN is used for tax reporting and payroll processing. 
                  This field is optional and can be provided later.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sin">Social Insurance Number (Optional)</Label>
                <Input
                  id="sin"
                  data-testid="input-sin"
                  placeholder="XXX-XXX-XXX"
                  value={data.socialInsuranceNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                    const formatted = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3').replace(/-$/, '').replace(/-$/, '');
                    setData({ ...data, socialInsuranceNumber: formatted });
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  className="text-center text-lg h-12"
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-sin"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "bankInfo":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <CreditCard className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Bank Information
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - for direct deposit payroll
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">
                  Bank details are used for direct deposit of your pay. 
                  You can skip this and provide it later, or upload a void cheque instead.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transit">Transit Number</Label>
                  <Input
                    id="transit"
                    data-testid="input-bank-transit"
                    placeholder="12345"
                    value={data.bankTransitNumber}
                    onChange={(e) => setData({ ...data, bankTransitNumber: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution Number</Label>
                  <Input
                    id="institution"
                    data-testid="input-bank-institution"
                    placeholder="123"
                    value={data.bankInstitutionNumber}
                    onChange={(e) => setData({ ...data, bankInstitutionNumber: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    maxLength={3}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account">Account Number</Label>
                <Input
                  id="account"
                  data-testid="input-bank-account"
                  placeholder="1234567"
                  value={data.bankAccountNumber}
                  onChange={(e) => setData({ ...data, bankAccountNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                  maxLength={12}
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Void Cheque (Optional)</Label>
                <FileUploadButton
                  label="Upload void cheque photo"
                  file={data.voidChequeFile}
                  onFileChange={(file) => handleFileChange('voidChequeFile', file)}
                  testId="input-void-cheque-upload"
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-bank"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "driversLicense":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Car className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Driver's License
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - for driving eligibility verification
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">
                  Driver's license information may be required for positions that involve operating company vehicles.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dlNumber">License Number</Label>
                  <Input
                    id="dlNumber"
                    data-testid="input-dl-number"
                    placeholder="1234567"
                    value={data.driversLicenseNumber}
                    onChange={(e) => setData({ ...data, driversLicenseNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dlExpiry">Expiry Date</Label>
                  <Input
                    id="dlExpiry"
                    type="date"
                    data-testid="input-dl-expiry"
                    value={data.driversLicenseExpiry}
                    onChange={(e) => setData({ ...data, driversLicenseExpiry: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Upload Driver's License Photo (Optional)</Label>
                <FileUploadButton
                  label="Upload driver's license photo"
                  file={data.driversLicenseFile}
                  onFileChange={(file) => handleFileChange('driversLicenseFile', file)}
                  testId="input-dl-photo-upload"
                />
              </div>
              <div className="space-y-2">
                <Label>Upload Driver's Abstract (Optional)</Label>
                <FileUploadButton
                  label="Upload driver's abstract"
                  file={data.driversAbstractFile}
                  onFileChange={(file) => handleFileChange('driversAbstractFile', file)}
                  testId="input-dl-abstract-upload"
                />
                <p className="text-xs text-muted-foreground">
                  A driver's abstract is an official driving record from your province/state.
                </p>
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-dl"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "birthday":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-pink-500/10">
                  <Calendar className="w-8 h-8 text-pink-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                When's your birthday?
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - for HR records
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="birthday" className="sr-only">Birthday</Label>
              <Input
                id="birthday"
                type="date"
                data-testid="input-birthday"
                value={data.birthday}
                onChange={(e) => setData({ ...data, birthday: e.target.value })}
                className="text-center text-lg h-12"
              />
              {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                data-testid="button-continue-birthday"
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "medicalConditions":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-red-500/10">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                Special Medical Conditions
              </DialogTitle>
              <DialogDescription className="text-center">
                Optional - any conditions we should be aware of
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">
                  This information helps us ensure your safety on the job. 
                  Include any allergies, conditions, or medications that first responders should know about.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medical">Medical Conditions (Optional)</Label>
                <Textarea
                  id="medical"
                  data-testid="input-medical-conditions"
                  placeholder="e.g., Allergies, diabetes, epilepsy, medications..."
                  value={data.specialMedicalConditions}
                  onChange={(e) => setData({ ...data, specialMedicalConditions: e.target.value })}
                  rows={4}
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={registrationMutation.isPending}
                data-testid="button-save-registration"
              >
                {registrationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Save Registration
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="w-full"
                disabled={registrationMutation.isPending}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.back}
              </Button>
            </DialogFooter>
          </>
        );

      case "complete":
        return (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <Award className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl">
                {t.registrationComplete}
              </DialogTitle>
              <DialogDescription className="text-center">
                {t.thankYou.replace('{name}', data.firstName)}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 space-y-2">
                <p className="text-sm text-center">
                  {t.employerReview}
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  {t.emailNotification} <strong>{data.email}</strong> {t.accountActivated}
                </p>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button 
                onClick={handleClose} 
                className="w-full"
                data-testid="button-close-registration"
              >
                Close
              </Button>
            </DialogFooter>
          </>
        );

      default:
        return null;
    }
  };

  const currentStepIndex = stepOrder.indexOf(step);
  const totalSteps = stepOrder.length - 1;
  const progress = Math.round((currentStepIndex / totalSteps) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {step !== "complete" && step !== "firstName" && (
          <div className="w-full bg-muted rounded-full h-1.5 mb-2">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
