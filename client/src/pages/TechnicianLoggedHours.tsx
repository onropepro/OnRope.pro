import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate, parseLocalDate } from "@/lib/dateUtils";
import { IRATA_TASK_TYPES, type IrataTaskLog, type HistoricalHours } from "@shared/schema";
import { DashboardSidebar, type NavGroup } from "@/components/DashboardSidebar";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { 
  ArrowLeft, 
  Clock, 
  Plus, 
  Building, 
  Calendar,
  Trash2,
  Loader2,
  CheckCircle2,
  MapPin,
  ChevronRight,
  AlertTriangle,
  Camera,
  Scan,
  Check,
  FileDown,
  Lock,
  Edit2,
  Crown,
  LogOut,
  Award,
  Briefcase,
  FileText,
  HelpCircle,
  User as UserIcon,
  Menu
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

type Language = 'en' | 'fr';

const translations = {
  en: {
    title: "My Logged Hours",
    backToPortal: "Back to Portal",
    totalHours: "Total Hours",
    combinedTotal: "Combined Total (Baseline + Sessions + Manual)",
    baselineHours: "Baseline Hours",
    fromWorkSessions: "From Work Sessions",
    workSessions: "Work Sessions",
    manualHours: "Manual Hours",
    manualHoursNote: "Hours added when employer doesn't use OnRopePro (counted in total)",
    addManualHours: "Add Manual Hours",
    noManualHours: "No manual hours recorded",
    noManualHoursDesc: "Add hours here when your employer doesn't use OnRopePro. These hours count toward your total.",
    manualHoursAdded: "Manual Hours Added",
    manualHoursAddedDesc: "Your hours have been added to your total.",
    previousHours: "Previous Hours",
    previousHoursNote: "Hours from previous work (not counted in total)",
    addPreviousHours: "Add Previous Hours",
    noWorkSessions: "No work sessions yet",
    noWorkSessionsDesc: "Your work sessions will appear here after you clock in and complete work.",
    noPreviousHours: "No previous hours recorded",
    noPreviousHoursDesc: "Add historical work experience that won't count toward your certification totals. Use 'Scan Logbook Page' to let AI automatically extract entries from your logbook photos.",
    loading: "Loading...",
    hours: "hours",
    hr: "hr",
    session: "session",
    sessions: "sessions",
    building: "Building",
    tasksPerformed: "Tasks Performed",
    date: "Date",
    dateRange: "Date Range",
    startDate: "Start Date",
    endDate: "End Date",
    hoursWorked: "Hours Worked",
    buildingName: "Building Name",
    buildingAddress: "Building Address",
    buildingHeight: "Building Height",
    heightPlaceholder: "e.g., 25 floors, 100m",
    employer: "Employer",
    employerPlaceholder: "Company name (optional)",
    notes: "Notes",
    notesPlaceholder: "Any additional details (optional)",
    selectTasks: "Select Tasks Performed",
    save: "Save Previous Hours",
    saving: "Saving...",
    cancel: "Cancel",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this entry?",
    deleteConfirm: "Yes, Delete",
    cancelDelete: "Cancel",
    previousHoursAdded: "Previous Hours Added",
    previousHoursAddedDesc: "Your previous work experience has been recorded.",
    previousHoursDeleted: "Previous Hours Deleted",
    previousHoursDeletedDesc: "The entry has been removed.",
    error: "Error",
    to: "to",
    enterHours: "Enter hours worked",
    enterBuildingName: "Enter building name",
    enterBuildingAddress: "Enter building address",
    buildingNamePlaceholder: "Enter building name",
    buildingAddressPlaceholder: "Enter building address",
    previousEmployer: "Employer",
    tasksRequired: "Please select at least one task",
    hoursRequired: "Please enter hours worked",
    dateRequired: "Please enter start and end dates",
    unknownProject: "Unknown Project",
    importantNotice: "Important Notice",
    logbookDisclaimer: "This is a personal tracking tool to help you monitor your rope access hours. You must still record all hours in your official irata/SPRAT logbook - this digital log does not replace it and is not valid for certification purposes.",
    certificationProgress: "Next Level Progress",
    certificationProgressDesc: "Track your hours and time toward certification upgrade",
    hoursAtLastUpgrade: "Hours at Last Certification",
    dateOfLastUpgrade: "Date of Last Certification",
    hoursTowardUpgrade: "Hours Toward Upgrade",
    timeTowardUpgrade: "Time Toward Upgrade",
    hoursRemaining: "hours remaining",
    monthsRemaining: "months remaining",
    daysRemaining: "days remaining",
    eligibleForUpgrade: "Eligible for upgrade!",
    setBaseline: "Set Baseline",
    updateBaseline: "Update Baseline",
    irataRequirements: "IRATA requires 1,000 hours and 1 year between levels",
    spratRequirements: "SPRAT requires 500 hours and 6 months between levels",
    currentLevel: "Current Level",
    nextLevel: "Next Level",
    notSet: "Not set",
    level1: "Level 1",
    level2: "Level 2",
    level3: "Level 3",
    maxLevel: "Already at highest level",
    baselineSaved: "Baseline Saved",
    baselineSavedDesc: "Your certification baseline has been updated.",
    scanLogbook: "Scan Logbook Page",
    scanning: "Analyzing...",
    scanLogbookDesc: "Take a photo of your logbook page to automatically extract entries",
    scanExplanationTitle: "How Logbook Scanning Works",
    scanExplanationStep1: "Take a clear photo of your irata/SPRAT logbook page",
    scanExplanationStep2: "Our AI will analyze the image and extract the entries",
    scanExplanationStep3: "Review and edit the extracted data before saving",
    scanExplanationTip: "For best results, ensure good lighting and that the entire page is visible in the photo.",
    continueToScan: "Continue to Scan",
    reviewScannedEntries: "Review Scanned Entries",
    reviewScannedDesc: "Review and confirm the entries extracted from your logbook",
    foundEntries: "Found {count} entries",
    noEntriesFound: "No entries found",
    noEntriesFoundDesc: "Could not extract any entries from this image. Make sure the logbook page is clearly visible.",
    addSelectedEntries: "Add Selected Entries",
    addingEntries: "Adding...",
    entriesAdded: "Entries Added",
    entriesAddedDesc: "{count} entries have been added to your previous hours.",
    scanFailed: "Scan Failed",
    lowConfidence: "Low confidence",
    mediumConfidence: "Medium confidence",
    highConfidence: "High confidence",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    missingRequired: "Missing required fields",
    enterHoursToSelect: "Enter hours to select this entry",
    retryPhoto: "Try Another Photo",
    exportPdf: "Export PDF",
    exportWorkHistory: "Export Work History",
    exportWorkHistoryDesc: "Generate a PDF report of your work history for a selected date range",
    selectDateRange: "Select Date Range",
    from: "From",
    exportingPdf: "Generating PDF...",
    totalDrops: "Total Drops",
    drops: "drops",
    dropsCompleted: "Drops Completed",
    north: "North",
    east: "East",
    south: "South",
    west: "West",
    allTimeTasks: "All-Time Tasks",
    times: "times",
    pdfExported: "PDF Exported",
    pdfExportedDesc: "Your work history has been downloaded",
    noDataInRange: "No Data Found",
    noDataInRangeDesc: "No work history found for the selected date range",
    workHistoryReport: "Work History Report",
    generatedOn: "Generated on",
    period: "Period",
    summarySection: "Summary",
    totalWorkHours: "Total Work Hours",
    workSessionsCount: "Work Sessions",
    previousHoursCount: "Previous Hours Entries",
    detailedLog: "Detailed Log",
    plusFeature: "PLUS Feature",
    plusLockedDesc: "Refer a technician to unlock",
    sessionDetails: "Session Details",
    viewDetails: "Tap to view details",
    projectInfo: "Project Information",
    workInfo: "Work Information",
    close: "Close",
    editBaselineHours: "Edit Baseline Hours",
    editBaselineHoursDesc: "Enter the total rope access hours you had in your logbook when you created your account. This becomes your starting point.",
    baselineHoursUpdated: "Baseline Hours Updated",
    baselineHoursUpdatedDesc: "Your baseline hours have been saved.",
    currentBaseline: "Current Baseline",
    newBaseline: "New Baseline Hours",
    saveBaseline: "Save Baseline",
  },
  fr: {
    title: "Mes heures enregistrées",
    backToPortal: "Retour au portail",
    totalHours: "Total des heures",
    combinedTotal: "Total combine (Base + Sessions + Manuelles)",
    baselineHours: "Heures de base",
    fromWorkSessions: "Des sessions de travail",
    workSessions: "Sessions de travail",
    manualHours: "Heures manuelles",
    manualHoursNote: "Heures ajoutees quand l'employeur n'utilise pas OnRopePro (comptees dans le total)",
    addManualHours: "Ajouter des heures manuelles",
    noManualHours: "Aucune heure manuelle enregistree",
    noManualHoursDesc: "Ajoutez des heures ici quand votre employeur n'utilise pas OnRopePro. Ces heures comptent dans votre total.",
    manualHoursAdded: "Heures manuelles ajoutees",
    manualHoursAddedDesc: "Vos heures ont ete ajoutees a votre total.",
    previousHours: "Heures precedentes",
    previousHoursNote: "Heures de travail precedent (non comptabilisees dans le total)",
    addPreviousHours: "Ajouter des heures precedentes",
    noWorkSessions: "Aucune session de travail",
    noWorkSessionsDesc: "Vos sessions de travail apparaitront ici apres vos pointages.",
    noPreviousHours: "Aucune heure precedente enregistree",
    noPreviousHoursDesc: "Ajoutez des experiences de travail historiques qui ne seront pas comptabilisees dans vos totaux. Utilisez 'Scanner une page' pour laisser l'IA extraire automatiquement les entrees de vos photos de carnet.",
    loading: "Chargement...",
    hours: "heures",
    hr: "h",
    session: "session",
    sessions: "sessions",
    building: "Bâtiment",
    tasksPerformed: "Tâches effectuées",
    date: "Date",
    dateRange: "Période",
    startDate: "Date de début",
    endDate: "Date de fin",
    hoursWorked: "Heures travaillées",
    buildingName: "Nom du bâtiment",
    buildingAddress: "Adresse du bâtiment",
    buildingHeight: "Hauteur du bâtiment",
    heightPlaceholder: "ex: 25 étages, 100m",
    employer: "Employeur",
    employerPlaceholder: "Nom de l'entreprise (facultatif)",
    notes: "Notes",
    notesPlaceholder: "Détails supplémentaires (facultatif)",
    selectTasks: "Sélectionner les tâches effectuées",
    save: "Enregistrer les heures précédentes",
    saving: "Enregistrement...",
    cancel: "Annuler",
    delete: "Supprimer",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer cette entrée ?",
    deleteConfirm: "Oui, Supprimer",
    cancelDelete: "Annuler",
    previousHoursAdded: "Heures précédentes ajoutées",
    previousHoursAddedDesc: "Votre expérience de travail précédente a été enregistrée.",
    previousHoursDeleted: "Heures précédentes supprimées",
    previousHoursDeletedDesc: "L'entrée a été supprimée.",
    error: "Erreur",
    to: "au",
    enterHours: "Entrez les heures travaillées",
    enterBuildingName: "Entrez le nom du bâtiment",
    enterBuildingAddress: "Entrez l'adresse du bâtiment",
    buildingNamePlaceholder: "Entrez le nom du bâtiment",
    buildingAddressPlaceholder: "Entrez l'adresse du bâtiment",
    previousEmployer: "Employeur",
    tasksRequired: "Veuillez sélectionner au moins une tâche",
    hoursRequired: "Veuillez entrer les heures travaillées",
    dateRequired: "Veuillez entrer les dates de début et de fin",
    unknownProject: "Projet inconnu",
    importantNotice: "Avis important",
    logbookDisclaimer: "Ceci est un outil de suivi personnel pour vous aider à surveiller vos heures d'accès sur corde. Vous devez toujours enregistrer toutes vos heures dans votre carnet irata/SPRAT officiel - ce journal numérique ne le remplace pas et n'est pas valide pour les fins de certification.",
    certificationProgress: "Progression vers le niveau suivant",
    certificationProgressDesc: "Suivez vos heures et votre temps pour la mise à niveau",
    hoursAtLastUpgrade: "Heures à la dernière certification",
    dateOfLastUpgrade: "Date de la dernière certification",
    hoursTowardUpgrade: "Heures vers la mise à niveau",
    timeTowardUpgrade: "Temps vers la mise à niveau",
    hoursRemaining: "heures restantes",
    monthsRemaining: "mois restants",
    daysRemaining: "jours restants",
    eligibleForUpgrade: "Éligible pour la mise à niveau!",
    setBaseline: "Définir la base",
    updateBaseline: "Mettre à jour la base",
    irataRequirements: "IRATA exige 1 000 heures et 1 an entre les niveaux",
    spratRequirements: "SPRAT exige 500 heures et 6 mois entre les niveaux",
    currentLevel: "Niveau actuel",
    nextLevel: "Niveau suivant",
    notSet: "Non défini",
    level1: "Niveau 1",
    level2: "Niveau 2",
    level3: "Niveau 3",
    maxLevel: "Déjà au niveau le plus élevé",
    baselineSaved: "Base enregistrée",
    baselineSavedDesc: "Votre base de certification a été mise à jour.",
    scanLogbook: "Scanner une page",
    scanning: "Analyse...",
    scanLogbookDesc: "Prenez une photo de votre page de carnet pour extraire automatiquement les entrees",
    scanExplanationTitle: "Comment fonctionne la numerisation",
    scanExplanationStep1: "Prenez une photo claire de votre page de carnet irata/SPRAT",
    scanExplanationStep2: "Notre IA analysera l'image et extraira les entrees",
    scanExplanationStep3: "Verifiez et modifiez les donnees extraites avant de sauvegarder",
    scanExplanationTip: "Pour de meilleurs resultats, assurez-vous d'un bon eclairage et que la page entiere est visible.",
    continueToScan: "Continuer vers le scan",
    reviewScannedEntries: "Vérifier les entrées scannées",
    reviewScannedDesc: "Vérifiez et confirmez les entrées extraites de votre carnet",
    foundEntries: "{count} entrées trouvées",
    noEntriesFound: "Aucune entrée trouvée",
    noEntriesFoundDesc: "Impossible d'extraire des entrées de cette image. Assurez-vous que la page du carnet est clairement visible.",
    addSelectedEntries: "Ajouter les entrées sélectionnées",
    addingEntries: "Ajout en cours...",
    entriesAdded: "Entrées ajoutées",
    entriesAddedDesc: "{count} entrées ont été ajoutées à vos heures précédentes.",
    scanFailed: "Échec du scan",
    lowConfidence: "Faible confiance",
    mediumConfidence: "Confiance moyenne",
    highConfidence: "Haute confiance",
    selectAll: "Tout sélectionner",
    deselectAll: "Tout désélectionner",
    missingRequired: "Champs requis manquants",
    enterHoursToSelect: "Entrez les heures pour sélectionner cette entrée",
    retryPhoto: "Essayer une autre photo",
    exportPdf: "Exporter PDF",
    exportWorkHistory: "Exporter l'historique de travail",
    exportWorkHistoryDesc: "Générez un rapport PDF de votre historique de travail pour une période sélectionnée",
    selectDateRange: "Sélectionner la période",
    from: "Du",
    exportingPdf: "Génération du PDF...",
    totalDrops: "Descentes totales",
    drops: "descentes",
    dropsCompleted: "Descentes effectuées",
    north: "Nord",
    east: "Est",
    south: "Sud",
    west: "Ouest",
    allTimeTasks: "Tâches totales",
    times: "fois",
    pdfExported: "PDF exporté",
    pdfExportedDesc: "Votre historique de travail a été téléchargé",
    noDataInRange: "Aucune donnée trouvée",
    noDataInRangeDesc: "Aucun historique de travail trouvé pour la période sélectionnée",
    workHistoryReport: "Rapport d'historique de travail",
    generatedOn: "Généré le",
    period: "Période",
    summarySection: "Résumé",
    totalWorkHours: "Total des heures de travail",
    workSessionsCount: "Sessions de travail",
    previousHoursCount: "Entrées d'heures précédentes",
    detailedLog: "Journal détaillé",
    plusFeature: "Fonctionnalité PLUS",
    plusLockedDesc: "Parrainez un technicien pour débloquer",
    sessionDetails: "Détails de la session",
    viewDetails: "Appuyez pour voir les détails",
    projectInfo: "Informations du projet",
    workInfo: "Informations de travail",
    close: "Fermer",
    editBaselineHours: "Modifier les heures de base",
    editBaselineHoursDesc: "Entrez le total des heures d'acces sur corde que vous aviez dans votre carnet lors de la creation de votre compte.",
    baselineHoursUpdated: "Heures de base mises a jour",
    baselineHoursUpdatedDesc: "Vos heures de base ont ete enregistrees.",
    currentBaseline: "Base actuelle",
    newBaseline: "Nouvelles heures de base",
    saveBaseline: "Enregistrer",
  }
};

const getTaskLabel = (taskId: string, language: Language): string => {
  const task = IRATA_TASK_TYPES.find(t => t.id === taskId);
  return task?.label || taskId;
};

const getTaskIcon = (taskId: string): string => {
  const icons: Record<string, string> = {
    rope_transfer: "swap_horiz",
    re_anchor: "anchor",
    ascending: "arrow_upward",
    descending: "arrow_downward",
    rigging: "settings",
    deviation: "turn_slight_right",
    aid_climbing: "terrain",
    edge_transition: "open_in_new",
    knot_passing: "link",
    rope_to_rope_transfer: "compare_arrows",
    mid_rope_changeover: "sync_alt",
    rescue_technique: "health_and_safety",
    hauling: "publish",
    lowering: "download",
    tensioned_rope: "linear_scale",
    horizontal_traverse: "swap_horiz",
    window_cleaning: "cleaning_services",
    building_inspection: "search",
    maintenance_work: "build",
    other: "more_horiz",
  };
  return icons[taskId] || "assignment";
};

export default function TechnicianLoggedHours() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  
  // Mobile sidebar state for external control
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Use global i18n language, not local storage
  const language: Language = i18n.language === 'fr' ? 'fr' : 'en';
  const t = translations[language];
  const dateLocale = language === 'fr' ? fr : enUS;
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    hoursWorked: "",
    buildingName: "",
    buildingAddress: "",
    buildingHeight: "",
    previousEmployer: "",
    notes: "",
  });

  // Logbook scanning state
  const logbookInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [scannedEntries, setScannedEntries] = useState<Array<{
    id: string;
    selected: boolean;
    date: string | null;
    building: string | null;
    address: string | null;
    employer: string | null;
    tasks: string[];
    hours: number | null;
    notes: string | null;
    confidence: 'low' | 'medium' | 'high';
  }>>([]);
  const [isCommitting, setIsCommitting] = useState(false);

  // PDF Export state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  
  // Session details dialog state
  const [selectedLog, setSelectedLog] = useState<IrataTaskLog | null>(null);
  const [showLogDetailsDialog, setShowLogDetailsDialog] = useState(false);
  
  // Baseline hours edit state
  const [showBaselineDialog, setShowBaselineDialog] = useState(false);
  const [newBaselineHours, setNewBaselineHours] = useState("");
  
  // Certification upgrade baseline dialog state
  const [showCertBaselineDialog, setShowCertBaselineDialog] = useState(false);
  const [certBaselineHours, setCertBaselineHours] = useState("");
  const [certBaselineDate, setCertBaselineDate] = useState("");
  const [certType, setCertType] = useState<'irata' | 'sprat'>('irata');
  const [isSavingCertBaseline, setIsSavingCertBaseline] = useState(false);
  
  // Manual hours dialog state (for when employer doesn't use OnRopePro)
  const [showManualHoursDialog, setShowManualHoursDialog] = useState(false);
  
  // Scan explanation dialog state
  const [showScanExplanationDialog, setShowScanExplanationDialog] = useState(false);

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: logsData, isLoading: logsLoading } = useQuery<{ sessions: Array<{
    id: string;
    workDate: string;
    hoursWorked: string;
    buildingName: string | null;
    buildingAddress: string | null;
    buildingHeight: string | null;
    companyName: string | null;
    totalDrops: number;
    dropsNorth: number;
    dropsEast: number;
    dropsSouth: number;
    dropsWest: number;
    startTime: string;
    endTime: string;
  }> }>({
    queryKey: ["/api/my-work-sessions"],
  });

  const { data: historicalData, isLoading: historicalLoading } = useQuery<{ historicalHours: HistoricalHours[] }>({
    queryKey: ["/api/my-historical-hours"],
  });

  const user = userData?.user;
  const sessions = logsData?.sessions || [];
  const historicalHours = historicalData?.historicalHours || [];

  // Separate manual hours (countsTowardTotal: true) from previous hours (countsTowardTotal: false)
  const manualHoursEntries = historicalHours.filter((entry: HistoricalHours) => entry.countsTowardTotal === true);
  const previousHoursEntries = historicalHours.filter((entry: HistoricalHours) => entry.countsTowardTotal !== true);

  // Baseline hours from user profile
  const baselineHours = user?.irataBaselineHours ? parseFloat(user.irataBaselineHours) || 0 : 0;
  
  // Hours from work sessions
  const totalLoggedHours = sessions.reduce((sum: number, session: any) => {
    return sum + parseFloat(session.hoursWorked || "0");
  }, 0);

  // Manual hours (counted in total - for when employer doesn't use OnRopePro)
  const totalManualHours = manualHoursEntries.reduce((sum: number, entry: HistoricalHours) => {
    return sum + parseFloat(entry.hoursWorked || "0");
  }, 0);

  // Previous/historical hours (not counted in certification totals)
  const totalHistoricalHours = previousHoursEntries.reduce((sum: number, entry: HistoricalHours) => {
    return sum + parseFloat(entry.hoursWorked || "0");
  }, 0);
  
  // Combined total = baseline + work sessions + manual hours (excludes previous/historical)
  const combinedTotalHours = baselineHours + totalLoggedHours + totalManualHours;

  // Certification upgrade progress calculations
  const irataLevel = user?.irataLevel || null;
  const spratLevel = user?.spratLevel || null;
  const irataHoursAtLastUpgrade = user?.irataHoursAtLastUpgrade ? parseFloat(user.irataHoursAtLastUpgrade) : null;
  const irataLastUpgradeDate = user?.irataLastUpgradeDate || null;
  const spratHoursAtLastUpgrade = user?.spratHoursAtLastUpgrade ? parseFloat(user.spratHoursAtLastUpgrade) : null;
  const spratLastUpgradeDate = user?.spratLastUpgradeDate || null;

  // Calculate progress toward next level
  const calculateUpgradeProgress = (
    certType: 'irata' | 'sprat',
    currentLevel: string | null,
    hoursAtLastUpgrade: number | null,
    lastUpgradeDate: string | null,
    totalHours: number
  ) => {
    const requiredHours = certType === 'irata' ? 1000 : 500;
    const requiredMonths = certType === 'irata' ? 12 : 6;
    
    // Parse current level (e.g., "Level 1" -> 1)
    const levelMatch = currentLevel?.match(/(\d)/);
    const levelNum = levelMatch ? parseInt(levelMatch[1]) : 0;
    
    // If already Level 3 or no level set, no upgrade available
    if (levelNum >= 3 || levelNum === 0) {
      return { isMaxLevel: levelNum >= 3, noLevel: levelNum === 0, hoursProgress: 0, timeProgress: 0, hoursRemaining: 0, monthsRemaining: 0, eligible: false };
    }
    
    // Calculate hours since last upgrade
    const hoursSinceUpgrade = hoursAtLastUpgrade !== null 
      ? Math.max(0, totalHours - hoursAtLastUpgrade)
      : totalHours; // If not set, use total hours
    
    // Calculate months since last upgrade
    let monthsSinceUpgrade = 0;
    if (lastUpgradeDate) {
      const upgradeDate = new Date(lastUpgradeDate);
      const now = new Date();
      monthsSinceUpgrade = (now.getFullYear() - upgradeDate.getFullYear()) * 12 + (now.getMonth() - upgradeDate.getMonth());
    }
    
    const hoursProgress = Math.min(100, (hoursSinceUpgrade / requiredHours) * 100);
    const timeProgress = Math.min(100, (monthsSinceUpgrade / requiredMonths) * 100);
    const hoursRemaining = Math.max(0, requiredHours - hoursSinceUpgrade);
    const monthsRemaining = Math.max(0, requiredMonths - monthsSinceUpgrade);
    const eligible = hoursSinceUpgrade >= requiredHours && monthsSinceUpgrade >= requiredMonths;
    
    return {
      isMaxLevel: false,
      noLevel: false,
      hoursProgress,
      timeProgress,
      hoursRemaining,
      monthsRemaining,
      hoursSinceUpgrade,
      monthsSinceUpgrade,
      requiredHours,
      requiredMonths,
      eligible,
      nextLevel: levelNum + 1,
      currentLevelNum: levelNum,
      baselineSet: hoursAtLastUpgrade !== null && lastUpgradeDate !== null
    };
  };

  const irataProgress = calculateUpgradeProgress('irata', irataLevel, irataHoursAtLastUpgrade, irataLastUpgradeDate, combinedTotalHours);
  const spratProgress = calculateUpgradeProgress('sprat', spratLevel, spratHoursAtLastUpgrade, spratLastUpgradeDate, combinedTotalHours);

  // Mutation to save certification baseline
  const saveCertBaselineMutation = useMutation({
    mutationFn: async (data: { 
      irataHoursAtLastUpgrade?: string | null;
      irataLastUpgradeDate?: string | null;
      spratHoursAtLastUpgrade?: string | null;
      spratLastUpgradeDate?: string | null;
    }) => {
      return await apiRequest('PATCH', '/api/technician/profile', {
        name: user?.name,
        email: user?.email,
        employeePhoneNumber: user?.employeePhoneNumber,
        emergencyContactName: user?.emergencyContactName,
        emergencyContactPhone: user?.emergencyContactPhone,
        ...data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: t.baselineSaved,
        description: t.baselineSavedDesc,
      });
      setShowCertBaselineDialog(false);
      setIsSavingCertBaseline(false);
    },
    onError: (error: any) => {
      toast({
        title: t.error,
        description: error.message || "Failed to save baseline",
        variant: "destructive",
      });
      setIsSavingCertBaseline(false);
    },
  });

  const addHistoricalMutation = useMutation({
    mutationFn: async (data: {
      startDate: string;
      endDate: string;
      hoursWorked: string;
      buildingName: string | null;
      buildingAddress: string | null;
      buildingHeight: string | null;
      previousEmployer: string | null;
      notes: string | null;
      tasksPerformed: string[];
      countsTowardTotal?: boolean;
    }) => {
      return apiRequest("POST", "/api/my-historical-hours", data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-historical-hours"] });
      setShowAddDialog(false);
      setShowManualHoursDialog(false);
      resetForm();
      const isManual = variables.countsTowardTotal;
      toast({
        title: isManual ? t.manualHoursAdded : t.previousHoursAdded,
        description: isManual ? t.manualHoursAddedDesc : t.previousHoursAddedDesc,
      });
    },
    onError: (error: Error) => {
      toast({
        title: t.error,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteHistoricalMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/my-historical-hours/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-historical-hours"] });
      toast({
        title: t.previousHoursDeleted,
        description: t.previousHoursDeletedDesc,
      });
    },
    onError: (error: Error) => {
      toast({
        title: t.error,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateBaselineMutation = useMutation({
    mutationFn: async (hours: number) => {
      return apiRequest("PATCH", "/api/my-irata-baseline-hours", { baselineHours: hours });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setShowBaselineDialog(false);
      setNewBaselineHours("");
      toast({
        title: t.baselineHoursUpdated,
        description: t.baselineHoursUpdatedDesc,
      });
    },
    onError: (error: Error) => {
      toast({
        title: t.error,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      startDate: "",
      endDate: "",
      hoursWorked: "",
      buildingName: "",
      buildingAddress: "",
      buildingHeight: "",
      previousEmployer: "",
      notes: "",
    });
    setSelectedTasks([]);
  };

  const handleSubmit = (countsTowardTotal: boolean = false) => {
    if (!formData.startDate || !formData.endDate) {
      toast({ title: t.error, description: t.dateRequired, variant: "destructive" });
      return;
    }
    if (!formData.hoursWorked || parseFloat(formData.hoursWorked) <= 0) {
      toast({ title: t.error, description: t.hoursRequired, variant: "destructive" });
      return;
    }
    if (selectedTasks.length === 0) {
      toast({ title: t.error, description: t.tasksRequired, variant: "destructive" });
      return;
    }

    addHistoricalMutation.mutate({
      startDate: formData.startDate,
      endDate: formData.endDate,
      hoursWorked: formData.hoursWorked,
      buildingName: formData.buildingName || null,
      buildingAddress: formData.buildingAddress || null,
      buildingHeight: formData.buildingHeight || null,
      previousEmployer: formData.previousEmployer || null,
      notes: formData.notes || null,
      tasksPerformed: selectedTasks,
      countsTowardTotal,
    });
  };

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(t => t !== taskId)
        : [...prev, taskId]
    );
  };

  // PDF Export function
  const handleExportPdf = async () => {
    if (!exportStartDate || !exportEndDate) {
      toast({ title: t.error, description: t.dateRequired, variant: "destructive" });
      return;
    }

    setIsExporting(true);

    try {
      const startDate = parseLocalDate(exportStartDate);
      const endDate = parseLocalDate(exportEndDate);

      // Filter work sessions by date range
      const filteredSessions = sessions.filter(session => {
        const sessionDate = parseLocalDate(session.workDate);
        return sessionDate >= startDate && sessionDate <= endDate;
      });

      // Filter historical hours by date range (include if date ranges overlap)
      const filteredHistorical = historicalHours.filter(entry => {
        const entryStartDate = parseLocalDate(entry.startDate);
        const entryEndDate = parseLocalDate(entry.endDate);
        // Include entry if its date range overlaps with the selected range
        return entryEndDate >= startDate && entryStartDate <= endDate;
      });

      if (filteredSessions.length === 0 && filteredHistorical.length === 0) {
        toast({
          title: t.noDataInRange,
          description: t.noDataInRangeDesc,
          variant: "destructive",
        });
        setIsExporting(false);
        return;
      }

      // Calculate totals for filtered data
      const filteredWorkHours = filteredSessions.reduce((sum, session) => sum + parseFloat(session.hoursWorked || "0"), 0);
      const filteredHistoricalTotal = filteredHistorical.reduce((sum, entry) => sum + parseFloat(entry.hoursWorked || "0"), 0);

      // Create PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;

      // Calculate branding height for white label support
      const showBranding = user?.whitelabelBrandingActive && user?.companyName;
      const brandingHeight = showBranding ? 5 : 0;

      // Header with branding background
      doc.setFillColor(245, 158, 11); // Amber-500
      doc.rect(0, 0, pageWidth, 35 + brandingHeight, 'F');

      // Company name if white label branding is active
      if (showBranding) {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(user.companyName.toUpperCase(), pageWidth / 2, 8, { align: 'center' });
      }

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(t.workHistoryReport, pageWidth / 2, 15 + brandingHeight, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(t.plusFeature, pageWidth / 2, 25 + brandingHeight, { align: 'center' });

      yPos = 45 + brandingHeight;

      // Generated date and period
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${t.generatedOn}: ${format(new Date(), 'PPP', { locale: dateLocale })}`, margin, yPos);
      yPos += 6;
      doc.text(`${t.period}: ${format(startDate, 'PPP', { locale: dateLocale })} - ${format(endDate, 'PPP', { locale: dateLocale })}`, margin, yPos);

      // Technician name
      if (user?.firstName && user?.lastName) {
        yPos += 6;
        doc.text(`${user.firstName} ${user.lastName}`, margin, yPos);
      }

      // Summary section
      yPos += 15;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(t.summarySection, margin, yPos);

      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      // Summary table
      const summaryData = [
        [t.totalWorkHours, `${(filteredWorkHours + filteredHistoricalTotal).toFixed(1)} ${t.hr}`],
        [t.workSessionsCount, `${filteredSessions.length}`],
        [t.previousHoursCount, `${filteredHistorical.length}`],
      ];

      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 30, 3, 3, 'F');
      yPos += 8;

      summaryData.forEach((row, index) => {
        doc.setTextColor(100, 100, 100);
        doc.text(row[0], margin + 5, yPos);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined as any, 'bold');
        doc.text(row[1], pageWidth - margin - 5, yPos, { align: 'right' });
        doc.setFont(undefined as any, 'normal');
        yPos += 8;
      });

      yPos += 10;

      // Detailed Log section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(t.detailedLog, margin, yPos);
      yPos += 10;

      // Work Sessions
      if (filteredSessions.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(t.workSessions, margin, yPos);
        yPos += 8;

        filteredSessions.forEach((session) => {
          // Check if we need a new page
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          const sessionDate = format(parseLocalDate(session.workDate), 'PP', { locale: dateLocale });
          doc.text(`${sessionDate} - ${parseFloat(session.hoursWorked).toFixed(1)} ${t.hr}`, margin + 5, yPos);
          yPos += 5;

          if (session.buildingName) {
            doc.setTextColor(100, 100, 100);
            doc.text(`${session.buildingName}${session.buildingHeight ? ` (${session.buildingHeight})` : ''}`, margin + 5, yPos);
            yPos += 5;
          }

          yPos += 5;
        });
      }

      // Previous Hours
      if (filteredHistorical.length > 0) {
        yPos += 5;
        
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(t.previousHours, margin, yPos);
        yPos += 8;

        filteredHistorical.forEach((entry) => {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          const entryStartDate = format(parseLocalDate(entry.startDate), 'PP', { locale: dateLocale });
          const entryEndDate = format(parseLocalDate(entry.endDate), 'PP', { locale: dateLocale });
          doc.text(`${entryStartDate} - ${entryEndDate}: ${parseFloat(entry.hoursWorked).toFixed(1)} ${t.hr}`, margin + 5, yPos);
          yPos += 5;

          if (entry.buildingName) {
            doc.setTextColor(100, 100, 100);
            doc.text(`${entry.buildingName}${entry.buildingHeight ? ` (${entry.buildingHeight})` : ''}`, margin + 5, yPos);
            yPos += 5;
          }

          if (entry.previousEmployer) {
            doc.setTextColor(100, 100, 100);
            doc.text(`${t.employer}: ${entry.previousEmployer}`, margin + 5, yPos);
            yPos += 5;
          }

          if (entry.tasksPerformed && entry.tasksPerformed.length > 0) {
            doc.setTextColor(120, 120, 120);
            const tasks = entry.tasksPerformed.map(taskId => getTaskLabel(taskId, language)).join(', ');
            const taskLines = doc.splitTextToSize(tasks, pageWidth - margin * 2 - 10);
            doc.text(taskLines, margin + 5, yPos);
            yPos += taskLines.length * 4;
          }

          yPos += 5;
        });
      }

      // Save the PDF
      const fileName = `work-history-${format(startDate, 'yyyy-MM-dd')}-${format(endDate, 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);

      toast({
        title: t.pdfExported,
        description: t.pdfExportedDesc,
      });

      setShowExportDialog(false);
      setExportStartDate("");
      setExportEndDate("");
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Failed to export PDF',
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle logbook scan
  const handleLogbookScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('image', file);

      const response = await fetch('/api/my-historical-hours/scan-logbook', {
        method: 'POST',
        body: formDataPayload,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Scan failed');
      }

      const result = await response.json();
      
      if (result.entries && result.entries.length > 0) {
        // Transform entries and add IDs for selection tracking
        // Map backend LogbookEntry fields to frontend format
        const entriesWithIds = result.entries.map((entry: any, index: number) => {
          // Safely extract date - prefer startDate, fall back to endDate
          const extractedDate = (entry.startDate && typeof entry.startDate === 'string' && entry.startDate.trim()) 
            ? entry.startDate.trim()
            : (entry.endDate && typeof entry.endDate === 'string' && entry.endDate.trim())
              ? entry.endDate.trim()
              : null;
          
          // Safely extract hours - ensure it's a valid number
          const extractedHours = (entry.hoursWorked !== null && entry.hoursWorked !== undefined && !isNaN(Number(entry.hoursWorked)))
            ? Number(entry.hoursWorked)
            : null;
          
          // Safely extract tasks array
          const extractedTasks = Array.isArray(entry.tasksPerformed) 
            ? entry.tasksPerformed.filter((t: any) => typeof t === 'string' && t.trim())
            : [];
          
          return {
            id: `scan-${Date.now()}-${index}`,
            selected: Boolean(extractedDate && extractedHours && extractedHours > 0), // Auto-select if has required fields
            date: extractedDate,
            building: entry.buildingName || null,
            address: entry.buildingAddress || null,
            employer: entry.previousEmployer || null,
            tasks: extractedTasks,
            hours: extractedHours,
            notes: entry.notes || null,
            confidence: entry.confidence || 'medium',
          };
        });
        
        setScannedEntries(entriesWithIds);
        setShowReviewDialog(true);
      } else {
        toast({
          title: t.noEntriesFound,
          description: t.noEntriesFoundDesc,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t.scanFailed,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      // Reset file input
      if (logbookInputRef.current) {
        logbookInputRef.current.value = '';
      }
    }
  };

  // Toggle entry selection (only allow if entry is valid)
  const toggleEntrySelection = (entryId: string) => {
    setScannedEntries(prev => 
      prev.map(entry => {
        if (entry.id !== entryId) return entry;
        // Only allow selection if entry has date and valid hours
        const isValid = entry.date && entry.hours && entry.hours > 0;
        if (!isValid) return entry; // Don't toggle invalid entries
        return { ...entry, selected: !entry.selected };
      })
    );
  };

  // Update entry hours (for inline editing) - auto-clear selection if hours become invalid
  const updateEntryHours = (entryId: string, hours: number | null) => {
    setScannedEntries(prev => 
      prev.map(entry => {
        if (entry.id !== entryId) return entry;
        // If hours become null or invalid, also clear selection
        const isValid = hours !== null && hours > 0;
        return { 
          ...entry, 
          hours,
          selected: isValid ? entry.selected : false 
        };
      })
    );
  };

  // Select/deselect all valid entries (those with date AND hours)
  const toggleSelectAll = () => {
    const validEntries = scannedEntries.filter(e => e.date && e.hours && e.hours > 0);
    const allSelected = validEntries.length > 0 && validEntries.every(e => e.selected);
    setScannedEntries(prev => 
      prev.map(entry => (entry.date && entry.hours && entry.hours > 0) 
        ? { ...entry, selected: !allSelected } 
        : entry
      )
    );
  };

  // Commit selected scanned entries
  const handleCommitScannedEntries = async () => {
    // Filter to only valid entries with all required fields
    const validEntries = scannedEntries.filter(e => {
      // Must be selected
      if (!e.selected) return false;
      // Must have a valid date string
      if (!e.date || typeof e.date !== 'string' || e.date.trim() === '') return false;
      // Must have valid hours (number and positive)
      if (e.hours === null || e.hours === undefined || isNaN(Number(e.hours)) || Number(e.hours) <= 0) return false;
      return true;
    });
    
    if (validEntries.length === 0) {
      toast({
        title: t.error,
        description: t.missingRequired,
        variant: "destructive",
      });
      return;
    }

    setIsCommitting(true);
    let successCount = 0;
    
    try {
      // Commit each entry individually using the existing endpoint
      for (const entry of validEntries) {
        // Ensure tasks is a valid array with at least one entry
        const tasks: string[] = Array.isArray(entry.tasks) && entry.tasks.length > 0 
          ? entry.tasks.filter(t => typeof t === 'string' && t.trim() !== '')
          : [];
        
        // If no valid tasks after filtering, default to 'other'
        const finalTasks = tasks.length > 0 ? tasks : ['other'];
        
        // Parse and validate hours
        const hoursNum = Number(entry.hours);
        if (isNaN(hoursNum) || hoursNum <= 0) {
          continue; // Skip invalid entries
        }
        
        // Build the payload matching historicalHoursSchema
        const payload = {
          startDate: entry.date as string,
          endDate: entry.date as string, // Same day for single entries from logbook
          hoursWorked: hoursNum.toFixed(2),
          buildingName: entry.building || null,
          buildingAddress: entry.address || null,
          buildingHeight: null,
          previousEmployer: entry.employer || null,
          notes: entry.notes || null,
          tasksPerformed: finalTasks,
        };
        
        await apiRequest("POST", "/api/my-historical-hours", payload);
        successCount++;
      }
      
      if (successCount === 0) {
        toast({
          title: t.error,
          description: t.missingRequired,
          variant: "destructive",
        });
        return;
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/my-historical-hours"] });
      setShowReviewDialog(false);
      setScannedEntries([]);
      
      toast({
        title: t.entriesAdded,
        description: t.entriesAddedDesc.replace('{count}', String(successCount)),
      });
    } catch (error) {
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsCommitting(false);
    }
  };

  // Get confidence badge color
  const getConfidenceBadgeVariant = (confidence: 'low' | 'medium' | 'high') => {
    switch (confidence) {
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'destructive';
      default: return 'secondary';
    }
  };

  const groupedByProject: Record<string, { 
    buildingName: string; 
    buildingAddress: string; 
    buildingHeight: string;
    companyName: string;
    sessions: any[];
    totalHours: number;
    totalDrops: number;
  }> = {};
  
  sessions.forEach((session: any) => {
    const projectKey = session.projectId || session.buildingName || t.unknownProject;
    if (!groupedByProject[projectKey]) {
      groupedByProject[projectKey] = {
        buildingName: session.buildingName || t.unknownProject,
        buildingAddress: session.buildingAddress || "",
        buildingHeight: session.buildingHeight || "",
        companyName: session.companyName || "",
        sessions: [],
        totalHours: 0,
        totalDrops: 0,
      };
    }
    groupedByProject[projectKey].sessions.push(session);
    groupedByProject[projectKey].totalHours += parseFloat(session.hoursWorked || "0");
    groupedByProject[projectKey].totalDrops += (session.totalDrops || 0);
  });
  
  // Calculate grand total drops across all sessions
  const grandTotalDrops = sessions.reduce((sum: number, session: any) => sum + (session.totalDrops || 0), 0);
  
  // Sort tasks by count (highest first) - not applicable for work sessions without task logging
  const sortedTaskCounts: [string, number][] = [];

  Object.values(groupedByProject).forEach((project) => {
    project.sessions.sort((a, b) => {
      const dateA = parseLocalDate(a.workDate);
      const dateB = parseLocalDate(b.workDate);
      return dateB.getTime() - dateA.getTime();
    });
  });

  const sortedProjects = Object.entries(groupedByProject)
    .sort(([, a], [, b]) => b.totalHours - a.totalHours);

  // Logout handler
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout");
      queryClient.clear();
      setLocation("/technician");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Technician navigation groups for sidebar
  const technicianNavGroups: NavGroup[] = [
    {
      id: "main",
      label: language === 'fr' ? "Principal" : "Main",
      items: [
        {
          id: "portal",
          label: language === 'fr' ? "Mon Portail" : "My Portal",
          icon: UserIcon,
          href: "/technician-portal",
          isVisible: () => true,
        },
        {
          id: "logged-hours",
          label: language === 'fr' ? "Mes Heures" : "My Logged Hours",
          icon: Clock,
          href: "/technician-logged-hours",
          isVisible: () => true,
        },
      ],
    },
    {
      id: "resources",
      label: language === 'fr' ? "Ressources" : "Resources",
      items: [
        {
          id: "job-board",
          label: language === 'fr' ? "Offres d'emploi" : "Job Board",
          icon: Briefcase,
          href: "/technician-jobs",
          isVisible: () => true,
        },
        {
          id: "help",
          label: language === 'fr' ? "Aide" : "Help",
          icon: HelpCircle,
          href: "/help",
          isVisible: () => true,
        },
      ],
    },
  ];

  if (logsLoading || historicalLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Sidebar - Desktop fixed, Mobile hamburger menu */}
      <DashboardSidebar
        currentUser={user}
        activeTab="logged-hours"
        onTabChange={() => {}}
        variant="technician"
        customNavigationGroups={technicianNavGroups}
        showDashboardLink={false}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />
      
      {/* Main content wrapper - offset for sidebar on desktop */}
      <div className="lg:pl-60">
        {/* Persistent Top Header Bar */}
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
              {/* PLUS Badge - Technicians with PLUS access */}
              {user?.role === 'rope_access_tech' && user?.hasPlusAccess && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="default" 
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs px-2 py-0.5 font-bold border-0 cursor-help" 
                      data-testid="badge-pro"
                    >
                      <Crown className="w-3 h-3 mr-1 fill-current" />
                      PLUS
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{language === 'fr' ? "Vous avez un accès PLUS" : "You have PLUS access"}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Language Selector */}
              <LanguageDropdown />
              
              {/* User Profile - Clickable to go to Portal */}
              <button 
                onClick={() => setLocation("/technician-portal")}
                className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover-elevate rounded-md py-1 pr-2"
                data-testid="link-user-profile"
              >
                <Avatar className="w-8 h-8 bg-[#2874A6]">
                  <AvatarFallback className="bg-[#2874A6] text-white text-xs font-medium">
                    {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-tight">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 leading-tight">{language === 'fr' ? 'Technicien' : 'Technician'}</p>
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

        {/* Page Title Bar */}
        <div className="sticky top-14 z-[90] bg-card border-b shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between gap-3 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/technician-portal")}
                data-testid="button-back-to-portal-mobile"
                className="lg:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-semibold text-lg">{t.title}</h1>
            </div>
            {user?.hasPlusAccess ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportDialog(true)}
                className="gap-2"
                data-testid="button-export-pdf"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">{t.exportPdf}</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 opacity-70"
                disabled
                data-testid="button-export-pdf-locked"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden sm:inline">{t.plusFeature}</span>
              </Button>
            )}
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20">
        {/* Important disclaimer notice - MUST BE HIGHLY VISIBLE */}
        <div className="p-4 bg-red-500/15 border-2 border-red-500/50 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500/20 rounded-full flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-base font-bold text-red-700 dark:text-red-300 uppercase tracking-wide mb-1">
                {t.importantNotice}
              </p>
              <p className="text-base font-semibold text-red-700 dark:text-red-300">
                {t.logbookDisclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* Certification Upgrade Progress Card */}
        {(irataLevel || spratLevel) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="material-icons text-primary">trending_up</span>
                {t.certificationProgress}
              </CardTitle>
              <CardDescription>{t.certificationProgressDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* IRATA Progress */}
              {irataLevel && !irataProgress.isMaxLevel && !irataProgress.noLevel && (
                <div className="space-y-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-semibold">irata</Badge>
                      <span className="text-sm text-muted-foreground">
                        {t.currentLevel}: {irataLevel} → {t.level1.replace('1', String(irataProgress.nextLevel || 2))}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setCertType('irata');
                        setCertBaselineHours(irataHoursAtLastUpgrade?.toString() || '');
                        setCertBaselineDate(irataLastUpgradeDate || '');
                        setShowCertBaselineDialog(true);
                      }}
                      data-testid="button-set-irata-baseline"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      {irataProgress.baselineSet ? t.updateBaseline : t.setBaseline}
                    </Button>
                  </div>
                  
                  {irataProgress.baselineSet ? (
                    <>
                      {irataProgress.eligible ? (
                        <div className="flex items-center gap-2 p-2 rounded-md bg-green-500/10 border border-green-500/30">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700 dark:text-green-400">{t.eligibleForUpgrade}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{t.hoursTowardUpgrade}: {Math.round(irataProgress.hoursSinceUpgrade || 0)} / {irataProgress.requiredHours}</span>
                              <span className="text-muted-foreground">{Math.round(irataProgress.hoursRemaining)} {t.hoursRemaining}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${irataProgress.hoursProgress}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{t.timeTowardUpgrade}: {irataProgress.monthsSinceUpgrade || 0} / {irataProgress.requiredMonths} {t.monthsRemaining.split(' ')[1]}</span>
                              <span className="text-muted-foreground">{irataProgress.monthsRemaining} {t.monthsRemaining}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${irataProgress.timeProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{t.irataRequirements}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      {t.setBaseline} to track your progress toward Level {irataProgress.nextLevel}
                    </p>
                  )}
                </div>
              )}
              
              {/* SPRAT Progress */}
              {spratLevel && !spratProgress.isMaxLevel && !spratProgress.noLevel && (
                <div className="space-y-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-semibold">SPRAT</Badge>
                      <span className="text-sm text-muted-foreground">
                        {t.currentLevel}: {spratLevel} → {t.level1.replace('1', String(spratProgress.nextLevel || 2))}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setCertType('sprat');
                        setCertBaselineHours(spratHoursAtLastUpgrade?.toString() || '');
                        setCertBaselineDate(spratLastUpgradeDate || '');
                        setShowCertBaselineDialog(true);
                      }}
                      data-testid="button-set-sprat-baseline"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      {spratProgress.baselineSet ? t.updateBaseline : t.setBaseline}
                    </Button>
                  </div>
                  
                  {spratProgress.baselineSet ? (
                    <>
                      {spratProgress.eligible ? (
                        <div className="flex items-center gap-2 p-2 rounded-md bg-green-500/10 border border-green-500/30">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700 dark:text-green-400">{t.eligibleForUpgrade}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{t.hoursTowardUpgrade}: {Math.round(spratProgress.hoursSinceUpgrade || 0)} / {spratProgress.requiredHours}</span>
                              <span className="text-muted-foreground">{Math.round(spratProgress.hoursRemaining)} {t.hoursRemaining}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${spratProgress.hoursProgress}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{t.timeTowardUpgrade}: {spratProgress.monthsSinceUpgrade || 0} / {spratProgress.requiredMonths} {t.monthsRemaining.split(' ')[1]}</span>
                              <span className="text-muted-foreground">{spratProgress.monthsRemaining} {t.monthsRemaining}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${spratProgress.timeProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">{t.spratRequirements}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      {t.setBaseline} to track your progress toward Level {spratProgress.nextLevel}
                    </p>
                  )}
                </div>
              )}
              
              {/* Show max level message */}
              {irataLevel && irataProgress.isMaxLevel && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <Badge variant="outline" className="font-semibold">irata</Badge>
                  <span className="text-sm text-muted-foreground">{t.maxLevel}</span>
                </div>
              )}
              {spratLevel && spratProgress.isMaxLevel && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
                  <Badge variant="outline" className="font-semibold">SPRAT</Badge>
                  <span className="text-sm text-muted-foreground">{t.maxLevel}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Combined Total Hours */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-combined-total-hours">{combinedTotalHours.toFixed(1)} {t.hr}</p>
                    <p className="text-sm text-muted-foreground">{t.combinedTotal}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <p className="text-lg font-medium" data-testid="text-total-drops">{grandTotalDrops}</p>
                    <p className="text-sm text-muted-foreground">{t.totalDrops}</p>
                  </div>
                  <div>
                    <p className="text-lg font-medium">{sessions.length}</p>
                    <p className="text-sm text-muted-foreground">{sessions.length === 1 ? t.session : t.sessions}</p>
                  </div>
                </div>
              </div>
              
              {/* Hours Breakdown */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <button
                  onClick={() => {
                    setNewBaselineHours(baselineHours.toString());
                    setShowBaselineDialog(true);
                  }}
                  className="text-center p-2 rounded-lg bg-muted/50 hover-elevate cursor-pointer group relative"
                  data-testid="button-edit-baseline"
                >
                  <Edit2 className="w-3 h-3 absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-lg font-semibold" data-testid="text-baseline-hours">{baselineHours.toFixed(1)} {t.hr}</p>
                  <p className="text-xs text-muted-foreground">{t.baselineHours}</p>
                </button>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-semibold" data-testid="text-session-hours">{totalLoggedHours.toFixed(1)} {t.hr}</p>
                  <p className="text-xs text-muted-foreground">{t.fromWorkSessions}</p>
                </div>
              </div>
              
              {/* All-Time Stats */}
              {(sortedTaskCounts.length > 0 || grandTotalDrops > 0) && (
                <div className="pt-3 border-t space-y-3">
                  {/* Total Drops - Prominent Display */}
                  {grandTotalDrops > 0 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="p-2 rounded-full bg-primary/10">
                        <span className="material-icons text-primary text-lg">trending_down</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary" data-testid="text-alltime-drops">{grandTotalDrops}</p>
                        <p className="text-sm text-muted-foreground">{t.totalDrops}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* All-Time Tasks */}
                  {sortedTaskCounts.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">{t.allTimeTasks}</p>
                      <div className="flex flex-wrap gap-2">
                        {sortedTaskCounts.map(([taskId, count]) => (
                          <Badge 
                            key={taskId} 
                            variant="outline" 
                            className="text-xs py-1"
                            data-testid={`badge-task-count-${taskId}`}
                          >
                            <span className="material-icons text-xs mr-1">{getTaskIcon(taskId)}</span>
                            {getTaskLabel(taskId, language)}
                            <span className="ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                              {count}
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="work-sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="work-sessions" data-testid="tab-work-sessions">
              {t.workSessions} ({sessions.length})
            </TabsTrigger>
            <TabsTrigger value="manual-hours" data-testid="tab-manual-hours">
              {t.manualHours} ({manualHoursEntries.length})
            </TabsTrigger>
            <TabsTrigger value="previous-hours" data-testid="tab-previous-hours">
              {t.previousHours} ({previousHoursEntries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="work-sessions" className="mt-4">
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="font-medium text-muted-foreground">{t.noWorkSessions}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.noWorkSessionsDesc}</p>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {sortedProjects.map(([projectKey, project]) => (
                  <AccordionItem 
                    key={projectKey} 
                    value={projectKey}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="py-4">
                      <div className="flex flex-col w-full pr-4 gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Building className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="text-left">
                              <p className="font-medium">{project.buildingName}</p>
                              {project.buildingAddress && (
                                <p className="text-sm text-muted-foreground">{project.buildingAddress}</p>
                              )}
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                                {project.buildingHeight && (
                                  <span>{project.buildingHeight}</span>
                                )}
                                {project.companyName && (
                                  <span>{t.employer}: {project.companyName}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold">{project.totalHours.toFixed(1)} {t.hr}</p>
                            <p className="text-sm text-muted-foreground">
                              {project.sessions.length} {project.sessions.length === 1 ? t.session : t.sessions}
                            </p>
                          </div>
                        </div>
                        {project.totalDrops > 0 && (
                          <div className="flex flex-wrap gap-1 ml-8">
                            <Badge variant="secondary" className="text-xs">
                              {project.totalDrops} {t.drops}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea className="max-h-[400px]">
                        <div className="space-y-3 pb-4">
                          {project.sessions.map((session) => (
                            <div 
                              key={session.id}
                              className="p-3 bg-muted/50 rounded-lg cursor-pointer hover-elevate active-elevate-2"
                              onClick={() => {
                                setSelectedLog(session);
                                setShowLogDetailsDialog(true);
                              }}
                              data-testid={`session-entry-${session.id}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  {format(parseLocalDate(session.workDate), 'PPP', { locale: dateLocale })}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    {parseFloat(session.hoursWorked).toFixed(1)} {t.hr}
                                  </Badge>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </div>
                              {session.totalDrops > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {session.totalDrops} {t.drops}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>

          {/* Manual Hours Tab - for when employer doesn't use OnRopePro */}
          <TabsContent value="manual-hours" className="mt-4 space-y-4">
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{t.manualHours}</p>
                    <p className="text-sm text-muted-foreground">{t.manualHoursNote}</p>
                    {manualHoursEntries.length > 0 && (
                      <p className="text-sm font-medium mt-1">
                        {t.totalHours}: {totalManualHours.toFixed(1)} {t.hr}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => setShowManualHoursDialog(true)}
                    className="gap-2"
                    data-testid="button-add-manual-hours"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addManualHours}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {manualHoursEntries.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="font-medium text-muted-foreground">{t.noManualHours}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.noManualHoursDesc}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {manualHoursEntries.map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(parseLocalDate(entry.startDate), 'PP', { locale: dateLocale })} {t.to} {format(parseLocalDate(entry.endDate), 'PP', { locale: dateLocale })}
                            </span>
                            <Badge variant="secondary">
                              {parseFloat(entry.hoursWorked).toFixed(1)} {t.hr}
                            </Badge>
                          </div>
                          
                          {(entry.buildingName || entry.buildingAddress) && (
                            <div className="flex items-start gap-2 mb-2">
                              <Building className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div>
                                {entry.buildingName && <p className="font-medium">{entry.buildingName}</p>}
                                {entry.buildingAddress && (
                                  <p className="text-sm text-muted-foreground">{entry.buildingAddress}</p>
                                )}
                                {entry.buildingHeight && (
                                  <p className="text-sm text-muted-foreground">{t.buildingHeight}: {entry.buildingHeight}</p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {entry.previousEmployer && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {t.employer}: {entry.previousEmployer}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {(entry.tasksPerformed || []).map((taskId) => (
                              <Badge key={taskId} variant="outline" className="text-xs">
                                <span className="material-icons text-xs mr-1">{getTaskIcon(taskId)}</span>
                                {getTaskLabel(taskId, language)}
                              </Badge>
                            ))}
                          </div>
                          
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">{entry.notes}</p>
                          )}
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              data-testid={`button-delete-manual-${entry.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t.delete}</AlertDialogTitle>
                              <AlertDialogDescription>{t.confirmDelete}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t.cancelDelete}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteHistoricalMutation.mutate(entry.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                {t.deleteConfirm}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="previous-hours" className="mt-4 space-y-4">
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{t.previousHours}</p>
                    <p className="text-sm text-muted-foreground">{t.previousHoursNote}</p>
                    {previousHoursEntries.length > 0 && (
                      <p className="text-sm font-medium mt-1">
                        {t.totalHours}: {totalHistoricalHours.toFixed(1)} {t.hr}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Hidden file input for logbook scan */}
                    <input
                      type="file"
                      ref={logbookInputRef}
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleLogbookScan}
                      data-testid="input-logbook-scan"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowScanExplanationDialog(true)}
                      disabled={isScanning}
                      className="gap-2"
                      data-testid="button-scan-logbook"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t.scanning}
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4" />
                          {t.scanLogbook}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowAddDialog(true)}
                      className="gap-2"
                      data-testid="button-add-previous-hours"
                    >
                      <Plus className="w-4 h-4" />
                      {t.addPreviousHours}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {previousHoursEntries.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="font-medium text-muted-foreground">{t.noPreviousHours}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.noPreviousHoursDesc}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {previousHoursEntries.map((entry) => (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(parseLocalDate(entry.startDate), 'PP', { locale: dateLocale })} {t.to} {format(parseLocalDate(entry.endDate), 'PP', { locale: dateLocale })}
                            </span>
                            <Badge variant="secondary">
                              {parseFloat(entry.hoursWorked).toFixed(1)} {t.hr}
                            </Badge>
                          </div>
                          
                          {(entry.buildingName || entry.buildingAddress) && (
                            <div className="flex items-start gap-2 mb-2">
                              <Building className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div>
                                {entry.buildingName && <p className="font-medium">{entry.buildingName}</p>}
                                {entry.buildingAddress && (
                                  <p className="text-sm text-muted-foreground">{entry.buildingAddress}</p>
                                )}
                                {entry.buildingHeight && (
                                  <p className="text-sm text-muted-foreground">{t.buildingHeight}: {entry.buildingHeight}</p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {entry.previousEmployer && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {t.employer}: {entry.previousEmployer}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {(entry.tasksPerformed || []).map((taskId) => (
                              <Badge key={taskId} variant="outline" className="text-xs">
                                <span className="material-icons text-xs mr-1">{getTaskIcon(taskId)}</span>
                                {getTaskLabel(taskId, language)}
                              </Badge>
                            ))}
                          </div>
                          
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">{entry.notes}</p>
                          )}
                        </div>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              data-testid={`button-delete-historical-${entry.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t.delete}</AlertDialogTitle>
                              <AlertDialogDescription>{t.confirmDelete}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t.cancelDelete}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteHistoricalMutation.mutate(entry.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                {t.deleteConfirm}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.addPreviousHours}</DialogTitle>
            <DialogDescription>{t.previousHoursNote}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">{t.startDate} *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  data-testid="input-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">{t.endDate} *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  data-testid="input-end-date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoursWorked">{t.hoursWorked} *</Label>
              <Input
                id="hoursWorked"
                type="number"
                step="0.5"
                min="0"
                placeholder={t.enterHours}
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                data-testid="input-hours-worked"
              />
            </div>

            <div className="space-y-2">
              <Label>{t.selectTasks} *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 border rounded-lg max-h-[200px] overflow-y-auto">
                {IRATA_TASK_TYPES.map((task) => (
                  <Button
                    key={task.id}
                    type="button"
                    variant={selectedTasks.includes(task.id) ? "default" : "outline"}
                    size="sm"
                    className="justify-start gap-2 h-auto py-2 px-3"
                    onClick={() => toggleTask(task.id)}
                    data-testid={`button-task-${task.id}`}
                  >
                    {selectedTasks.includes(task.id) && <CheckCircle2 className="w-4 h-4" />}
                    <span className="text-xs text-left">{task.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buildingName">{t.buildingName}</Label>
                <Input
                  id="buildingName"
                  placeholder={t.enterBuildingName}
                  value={formData.buildingName}
                  onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                  data-testid="input-building-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buildingHeight">{t.buildingHeight}</Label>
                <Input
                  id="buildingHeight"
                  placeholder={t.heightPlaceholder}
                  value={formData.buildingHeight}
                  onChange={(e) => setFormData({ ...formData, buildingHeight: e.target.value })}
                  data-testid="input-building-height"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buildingAddress">{t.buildingAddress}</Label>
              <Input
                id="buildingAddress"
                placeholder={t.enterBuildingAddress}
                value={formData.buildingAddress}
                onChange={(e) => setFormData({ ...formData, buildingAddress: e.target.value })}
                data-testid="input-building-address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousEmployer">{t.employer}</Label>
              <Input
                id="previousEmployer"
                placeholder={t.employerPlaceholder}
                value={formData.previousEmployer}
                onChange={(e) => setFormData({ ...formData, previousEmployer: e.target.value })}
                data-testid="input-employer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t.notes}</Label>
              <Textarea
                id="notes"
                placeholder={t.notesPlaceholder}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                data-testid="input-notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
              data-testid="button-cancel-add"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={addHistoricalMutation.isPending}
              data-testid="button-save-previous-hours"
            >
              {addHistoricalMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.save
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Hours Dialog - for hours when employer doesn't use OnRopePro */}
      <Dialog open={showManualHoursDialog} onOpenChange={setShowManualHoursDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.addManualHours}</DialogTitle>
            <DialogDescription>{t.manualHoursNote}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manualStartDate">{t.startDate} *</Label>
                <Input
                  id="manualStartDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  data-testid="input-manual-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manualEndDate">{t.endDate} *</Label>
                <Input
                  id="manualEndDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  data-testid="input-manual-end-date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualHoursWorked">{t.hoursWorked} *</Label>
              <Input
                id="manualHoursWorked"
                type="number"
                step="0.25"
                min="0.25"
                placeholder="8"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                data-testid="input-manual-hours"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualBuildingName">{t.buildingName}</Label>
              <Input
                id="manualBuildingName"
                placeholder={t.buildingNamePlaceholder}
                value={formData.buildingName}
                onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                data-testid="input-manual-building"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualBuildingAddress">{t.buildingAddress}</Label>
              <Input
                id="manualBuildingAddress"
                placeholder={t.buildingAddressPlaceholder}
                value={formData.buildingAddress}
                onChange={(e) => setFormData({ ...formData, buildingAddress: e.target.value })}
                data-testid="input-manual-address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualBuildingHeight">{t.buildingHeight}</Label>
              <Input
                id="manualBuildingHeight"
                placeholder="20 floors / 65m"
                value={formData.buildingHeight}
                onChange={(e) => setFormData({ ...formData, buildingHeight: e.target.value })}
                data-testid="input-manual-height"
              />
            </div>

            <div className="space-y-2">
              <Label>{t.tasksPerformed} *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                {IRATA_TASK_TYPES.map(task => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border transition-colors ${
                      selectedTasks.includes(task.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-transparent hover:bg-muted'
                    }`}
                    data-testid={`task-manual-${task.id}`}
                  >
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <span className="text-sm">{getTaskLabel(task.id, language)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualEmployer">{t.previousEmployer}</Label>
              <Input
                id="manualEmployer"
                placeholder={t.employerPlaceholder}
                value={formData.previousEmployer}
                onChange={(e) => setFormData({ ...formData, previousEmployer: e.target.value })}
                data-testid="input-manual-employer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualNotes">{t.notes}</Label>
              <Textarea
                id="manualNotes"
                placeholder={t.notesPlaceholder}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                data-testid="input-manual-notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowManualHoursDialog(false);
                resetForm();
              }}
              data-testid="button-cancel-manual"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={addHistoricalMutation.isPending}
              data-testid="button-save-manual-hours"
            >
              {addHistoricalMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.save
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scan Explanation Dialog */}
      <Dialog open={showScanExplanationDialog} onOpenChange={setShowScanExplanationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {t.scanExplanationTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">1</span>
                </div>
                <p className="text-sm">{t.scanExplanationStep1}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">2</span>
                </div>
                <p className="text-sm">{t.scanExplanationStep2}</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">3</span>
                </div>
                <p className="text-sm">{t.scanExplanationStep3}</p>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> {t.scanExplanationTip}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScanExplanationDialog(false)}
              data-testid="button-cancel-scan"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={() => {
                setShowScanExplanationDialog(false);
                logbookInputRef.current?.click();
              }}
              className="gap-2"
              data-testid="button-continue-scan"
            >
              <Camera className="w-4 h-4" />
              {t.continueToScan}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logbook Scan Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              {t.reviewScannedEntries}
            </DialogTitle>
            <DialogDescription>
              {t.reviewScannedDesc}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">
              {t.foundEntries.replace('{count}', String(scannedEntries.length))}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSelectAll}
              className="gap-2"
              data-testid="button-toggle-select-all"
            >
              {scannedEntries.every(e => e.selected) ? t.deselectAll : t.selectAll}
            </Button>
          </div>

          <ScrollArea className="flex-1 min-h-0 max-h-[60vh] sm:max-h-[50vh]">
            <div className="space-y-3 py-2 pr-4">
              {scannedEntries.map((entry) => {
                const hasDate = !!entry.date;
                const hasHours = entry.hours !== null && entry.hours > 0;
                const isValid = hasDate && hasHours;
                const canSelect = isValid; // Can only select if both date AND hours exist
                return (
                  <div
                    key={entry.id}
                    className={`p-4 border rounded-lg ${
                      !isValid ? 'border-muted bg-muted/20' : 
                      entry.selected ? 'border-primary/50 bg-primary/5' : ''
                    }`}
                    data-testid={`scanned-entry-${entry.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={entry.id}
                        checked={entry.selected}
                        onCheckedChange={() => toggleEntrySelection(entry.id)}
                        disabled={!canSelect}
                        data-testid={`checkbox-entry-${entry.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {entry.date ? (
                            <Badge variant="outline" className="gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatLocalDate(entry.date)}
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              {t.date}: -
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <Input
                              type="number"
                              step="0.5"
                              min="0.5"
                              max="24"
                              value={entry.hours !== null && entry.hours > 0 ? entry.hours : ''}
                              placeholder="8"
                              className="w-16 h-7 text-xs text-center"
                              onChange={(e) => {
                                const rawValue = e.target.value.trim();
                                if (rawValue === '') {
                                  updateEntryHours(entry.id, null);
                                } else {
                                  const val = parseFloat(rawValue);
                                  updateEntryHours(entry.id, isNaN(val) || val <= 0 ? null : val);
                                }
                              }}
                              data-testid={`input-hours-${entry.id}`}
                            />
                            <span className="text-xs text-muted-foreground">{t.hr}</span>
                          </div>
                          <Badge variant={getConfidenceBadgeVariant(entry.confidence) as any}>
                            {entry.confidence === 'high' ? t.highConfidence :
                             entry.confidence === 'medium' ? t.mediumConfidence :
                             t.lowConfidence}
                          </Badge>
                        </div>
                        
                        {(entry.building || entry.address) && (
                          <div className="text-sm text-muted-foreground">
                            {entry.building && (
                              <p className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {entry.building}
                              </p>
                            )}
                            {entry.address && (
                              <p className="flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {entry.address}
                              </p>
                            )}
                          </div>
                        )}
                        {entry.employer && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {t.employer}: {entry.employer}
                          </p>
                        )}
                        {entry.tasks.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {entry.tasks.slice(0, 3).map((task, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {getTaskLabel(task, language)}
                              </Badge>
                            ))}
                            {entry.tasks.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{entry.tasks.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {entry.notes}
                          </p>
                        )}
                        
                        {!isValid && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {!hasDate ? t.missingRequired : t.enterHoursToSelect}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <DialogFooter className="border-t pt-4 flex-col-reverse sm:flex-row gap-2 flex-shrink-0">
            <Button
              onClick={handleCommitScannedEntries}
              disabled={isCommitting || !scannedEntries.some(e => e.selected && e.date && e.hours)}
              className="gap-2 w-full sm:w-auto"
              data-testid="button-commit-scanned"
            >
              {isCommitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.addingEntries}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {t.addSelectedEntries} ({scannedEntries.filter(e => e.selected && e.date && e.hours).length})
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowReviewDialog(false);
                setScannedEntries([]);
              }}
              className="w-full sm:w-auto"
              data-testid="button-cancel-scan"
            >
              {t.cancel}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowReviewDialog(false);
                setScannedEntries([]);
                logbookInputRef.current?.click();
              }}
              className="gap-2 w-full sm:w-auto"
              data-testid="button-retry-scan"
            >
              <Camera className="w-4 h-4" />
              {t.retryPhoto}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.exportWorkHistory}</DialogTitle>
            <DialogDescription>
              {t.exportWorkHistoryDesc}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="export-start-date">{t.from}</Label>
              <Input
                id="export-start-date"
                type="date"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
                data-testid="input-export-start-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="export-end-date">{t.to}</Label>
              <Input
                id="export-end-date"
                type="date"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
                data-testid="input-export-end-date"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowExportDialog(false);
                setExportStartDate("");
                setExportEndDate("");
              }}
              data-testid="button-cancel-export"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleExportPdf}
              disabled={isExporting || !exportStartDate || !exportEndDate}
              className="gap-2"
              data-testid="button-confirm-export"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.exportingPdf}
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  {t.exportPdf}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Details Dialog */}
      <Dialog open={showLogDetailsDialog} onOpenChange={setShowLogDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t.sessionDetails}
            </DialogTitle>
            <DialogDescription>
              {selectedLog && format(parseLocalDate(selectedLog.workDate), 'PPP', { locale: dateLocale })}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4">
              {/* Project Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {t.projectInfo}
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{t.buildingName}</p>
                    <p className="font-medium">{selectedLog.buildingName || '-'}</p>
                  </div>
                  {selectedLog.buildingAddress && (
                    <div>
                      <p className="text-xs text-muted-foreground">{t.buildingAddress}</p>
                      <p className="text-sm">{selectedLog.buildingAddress}</p>
                    </div>
                  )}
                  {selectedLog.buildingHeight && (
                    <div>
                      <p className="text-xs text-muted-foreground">{t.buildingHeight}</p>
                      <p className="text-sm font-medium text-primary">{selectedLog.buildingHeight}</p>
                    </div>
                  )}
                  {(selectedLog as any).companyName && (
                    <div>
                      <p className="text-xs text-muted-foreground">{t.employer}</p>
                      <p className="text-sm font-medium">{(selectedLog as any).companyName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t.workInfo}
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{t.hoursWorked}</p>
                      <p className="text-xl font-bold text-primary">{parseFloat(selectedLog.hoursWorked).toFixed(1)} {t.hr}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t.date}</p>
                      <p className="font-medium">{format(parseLocalDate(selectedLog.workDate), 'PPP', { locale: dateLocale })}</p>
                    </div>
                  </div>
                  
                  {/* Drops Completed */}
                  {((selectedLog as any).totalDrops > 0) && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">{t.dropsCompleted}</p>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center p-2 rounded bg-background">
                          <p className="text-lg font-bold">{(selectedLog as any).dropsNorth || 0}</p>
                          <p className="text-xs text-muted-foreground">{t.north}</p>
                        </div>
                        <div className="text-center p-2 rounded bg-background">
                          <p className="text-lg font-bold">{(selectedLog as any).dropsEast || 0}</p>
                          <p className="text-xs text-muted-foreground">{t.east}</p>
                        </div>
                        <div className="text-center p-2 rounded bg-background">
                          <p className="text-lg font-bold">{(selectedLog as any).dropsSouth || 0}</p>
                          <p className="text-xs text-muted-foreground">{t.south}</p>
                        </div>
                        <div className="text-center p-2 rounded bg-background">
                          <p className="text-lg font-bold">{(selectedLog as any).dropsWest || 0}</p>
                          <p className="text-xs text-muted-foreground">{t.west}</p>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm font-medium">{t.totalDrops}: {(selectedLog as any).totalDrops}</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">{t.tasksPerformed}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedLog.tasksPerformed || []).map((taskId) => (
                        <Badge key={taskId} variant="outline" className="text-xs">
                          <span className="material-icons text-xs mr-1">{getTaskIcon(taskId)}</span>
                          {getTaskLabel(taskId, language)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedLog.notes && (
                    <div>
                      <p className="text-xs text-muted-foreground">{t.notes}</p>
                      <p className="text-sm italic mt-1">{selectedLog.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              onClick={() => setShowLogDetailsDialog(false)}
              data-testid="button-close-log-details"
            >
              {t.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Baseline Hours Dialog */}
      <Dialog open={showBaselineDialog} onOpenChange={setShowBaselineDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t.editBaselineHours}
            </DialogTitle>
            <DialogDescription>
              {t.editBaselineHoursDesc}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">{t.currentBaseline}</p>
              <p className="text-2xl font-bold">{baselineHours.toFixed(1)} {t.hr}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseline-hours">{t.newBaseline}</Label>
              <Input
                id="baseline-hours"
                type="number"
                min="0"
                step="0.25"
                value={newBaselineHours}
                onChange={(e) => setNewBaselineHours(e.target.value)}
                placeholder="0"
                className="text-lg"
                data-testid="input-baseline-hours"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBaselineDialog(false);
                setNewBaselineHours("");
              }}
              data-testid="button-cancel-baseline"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={() => {
                const hours = parseFloat(newBaselineHours);
                if (isNaN(hours) || hours < 0) {
                  toast({
                    title: t.error,
                    description: t.hoursRequired,
                    variant: "destructive",
                  });
                  return;
                }
                updateBaselineMutation.mutate(hours);
              }}
              disabled={updateBaselineMutation.isPending}
              data-testid="button-save-baseline"
            >
              {updateBaselineMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.saveBaseline
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certification Upgrade Baseline Dialog */}
      <Dialog open={showCertBaselineDialog} onOpenChange={setShowCertBaselineDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-icons text-primary">trending_up</span>
              {certType === 'irata' ? 'irata' : 'SPRAT'} {t.certificationProgress}
            </DialogTitle>
            <DialogDescription>
              {certType === 'irata' ? t.irataRequirements : t.spratRequirements}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cert-baseline-hours">{t.hoursAtLastUpgrade}</Label>
              <Input
                id="cert-baseline-hours"
                type="number"
                min="0"
                step="0.5"
                value={certBaselineHours}
                onChange={(e) => setCertBaselineHours(e.target.value)}
                placeholder="0"
                className="text-lg"
                data-testid="input-cert-baseline-hours"
              />
              <p className="text-xs text-muted-foreground">
                {language === 'en' 
                  ? "Enter the total hours you had logged when you achieved your current level"
                  : "Entrez le total des heures que vous aviez enregistrées lorsque vous avez obtenu votre niveau actuel"
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cert-baseline-date">{t.dateOfLastUpgrade}</Label>
              <Input
                id="cert-baseline-date"
                type="date"
                value={certBaselineDate}
                onChange={(e) => setCertBaselineDate(e.target.value)}
                data-testid="input-cert-baseline-date"
              />
              <p className="text-xs text-muted-foreground">
                {language === 'en'
                  ? "The date you passed your certification or upgrade assessment"
                  : "La date à laquelle vous avez passé votre certification ou votre évaluation de mise à niveau"
                }
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCertBaselineDialog(false);
                setCertBaselineHours("");
                setCertBaselineDate("");
              }}
              data-testid="button-cancel-cert-baseline"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={() => {
                const hours = parseFloat(certBaselineHours);
                if (isNaN(hours) || hours < 0) {
                  toast({
                    title: t.error,
                    description: t.hoursRequired,
                    variant: "destructive",
                  });
                  return;
                }
                if (!certBaselineDate) {
                  toast({
                    title: t.error,
                    description: t.dateRequired,
                    variant: "destructive",
                  });
                  return;
                }
                setIsSavingCertBaseline(true);
                if (certType === 'irata') {
                  saveCertBaselineMutation.mutate({
                    irataHoursAtLastUpgrade: hours.toString(),
                    irataLastUpgradeDate: certBaselineDate,
                  });
                } else {
                  saveCertBaselineMutation.mutate({
                    spratHoursAtLastUpgrade: hours.toString(),
                    spratLastUpgradeDate: certBaselineDate,
                  });
                }
              }}
              disabled={isSavingCertBaseline}
              data-testid="button-save-cert-baseline"
            >
              {isSavingCertBaseline ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.saving}
                </>
              ) : (
                t.save
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
