import { useState, useRef } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatLocalDate, parseLocalDate } from "@/lib/dateUtils";
import { IRATA_TASK_TYPES, type IrataTaskLog, type HistoricalHours } from "@shared/schema";
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
  Star
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
    combinedTotal: "Combined Total (Baseline + Sessions)",
    baselineHours: "Baseline Hours",
    fromWorkSessions: "From Work Sessions",
    workSessions: "Work Sessions",
    previousHours: "Previous Hours",
    previousHoursNote: "Hours from previous work (not counted in total)",
    addPreviousHours: "Add Previous Hours",
    noWorkSessions: "No work sessions yet",
    noWorkSessionsDesc: "Your work sessions will appear here after you clock in and complete work.",
    noPreviousHours: "No previous hours recorded",
    noPreviousHoursDesc: "Add historical work experience that won't count toward your certification totals.",
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
    tasksRequired: "Please select at least one task",
    hoursRequired: "Please enter hours worked",
    dateRequired: "Please enter start and end dates",
    unknownProject: "Unknown Project",
    importantNotice: "Important Notice",
    logbookDisclaimer: "This is a personal tracking tool to help you monitor your rope access hours. You must still record all hours in your official IRATA/SPRAT logbook - this digital log does not replace it and is not valid for certification purposes.",
    scanLogbook: "Scan Logbook Page",
    scanning: "Analyzing...",
    scanLogbookDesc: "Take a photo of your logbook page to automatically extract entries",
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
    sessionDetails: "Session Details",
    viewDetails: "Tap to view details",
    projectInfo: "Project Information",
    workInfo: "Work Information",
    close: "Close",
  },
  fr: {
    title: "Mes heures enregistrées",
    backToPortal: "Retour au portail",
    totalHours: "Total des heures",
    combinedTotal: "Total combiné (Base + Sessions)",
    baselineHours: "Heures de base",
    fromWorkSessions: "Des sessions de travail",
    workSessions: "Sessions de travail",
    previousHours: "Heures précédentes",
    previousHoursNote: "Heures de travail précédent (non comptabilisées dans le total)",
    addPreviousHours: "Ajouter des heures précédentes",
    noWorkSessions: "Aucune session de travail",
    noWorkSessionsDesc: "Vos sessions de travail apparaîtront ici après vos pointages.",
    noPreviousHours: "Aucune heure précédente enregistrée",
    noPreviousHoursDesc: "Ajoutez des expériences de travail historiques qui ne seront pas comptabilisées dans vos totaux.",
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
    tasksRequired: "Veuillez sélectionner au moins une tâche",
    hoursRequired: "Veuillez entrer les heures travaillées",
    dateRequired: "Veuillez entrer les dates de début et de fin",
    unknownProject: "Projet inconnu",
    importantNotice: "Avis important",
    logbookDisclaimer: "Ceci est un outil de suivi personnel pour vous aider à surveiller vos heures d'accès sur corde. Vous devez toujours enregistrer toutes vos heures dans votre carnet IRATA/SPRAT officiel - ce journal numérique ne le remplace pas et n'est pas valide pour les fins de certification.",
    scanLogbook: "Scanner une page",
    scanning: "Analyse...",
    scanLogbookDesc: "Prenez une photo de votre page de carnet pour extraire automatiquement les entrées",
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
    sessionDetails: "Détails de la session",
    viewDetails: "Appuyez pour voir les détails",
    projectInfo: "Informations du projet",
    workInfo: "Informations de travail",
    close: "Fermer",
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
  const [language] = useState<Language>(() => {
    const stored = localStorage.getItem('technicianLanguage');
    return (stored === 'fr' ? 'fr' : 'en') as Language;
  });
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

  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const { data: logsData, isLoading: logsLoading } = useQuery<{ logs: IrataTaskLog[] }>({
    queryKey: ["/api/my-irata-task-logs"],
  });

  const { data: historicalData, isLoading: historicalLoading } = useQuery<{ historicalHours: HistoricalHours[] }>({
    queryKey: ["/api/my-historical-hours"],
  });

  const user = userData?.user;
  const logs = logsData?.logs || [];
  const historicalHours = historicalData?.historicalHours || [];

  // Baseline hours from user profile
  const baselineHours = user?.irataBaselineHours ? parseFloat(user.irataBaselineHours) || 0 : 0;
  
  // Hours from work sessions
  const totalLoggedHours = logs.reduce((sum: number, log: IrataTaskLog) => {
    return sum + parseFloat(log.hoursWorked || "0");
  }, 0);

  // Previous/historical hours (not counted in certification totals)
  const totalHistoricalHours = historicalHours.reduce((sum: number, entry: HistoricalHours) => {
    return sum + parseFloat(entry.hoursWorked || "0");
  }, 0);
  
  // Combined total = baseline + work sessions (excludes historical)
  const combinedTotalHours = baselineHours + totalLoggedHours;

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
    }) => {
      return apiRequest("POST", "/api/my-historical-hours", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-historical-hours"] });
      setShowAddDialog(false);
      resetForm();
      toast({
        title: t.previousHoursAdded,
        description: t.previousHoursAddedDesc,
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

  const handleSubmit = () => {
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
      const filteredLogs = logs.filter(log => {
        const logDate = parseLocalDate(log.workDate);
        return logDate >= startDate && logDate <= endDate;
      });

      // Filter historical hours by date range (include if date ranges overlap)
      const filteredHistorical = historicalHours.filter(entry => {
        const entryStartDate = parseLocalDate(entry.startDate);
        const entryEndDate = parseLocalDate(entry.endDate);
        // Include entry if its date range overlaps with the selected range
        return entryEndDate >= startDate && entryStartDate <= endDate;
      });

      if (filteredLogs.length === 0 && filteredHistorical.length === 0) {
        toast({
          title: t.noDataInRange,
          description: t.noDataInRangeDesc,
          variant: "destructive",
        });
        setIsExporting(false);
        return;
      }

      // Calculate totals for filtered data
      const filteredWorkHours = filteredLogs.reduce((sum, log) => sum + parseFloat(log.hoursWorked || "0"), 0);
      const filteredHistoricalTotal = filteredHistorical.reduce((sum, entry) => sum + parseFloat(entry.hoursWorked || "0"), 0);

      // Create PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;

      // Header with PLUS badge
      doc.setFillColor(245, 158, 11); // Amber-500
      doc.roundedRect(margin, yPos, 35, 8, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(t.plusFeature, margin + 17.5, yPos + 5.5, { align: 'center' });

      // Title
      yPos += 15;
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text(t.workHistoryReport, margin, yPos);

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
        [t.workSessionsCount, `${filteredLogs.length}`],
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
      if (filteredLogs.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(t.workSessions, margin, yPos);
        yPos += 8;

        filteredLogs.forEach((log) => {
          // Check if we need a new page
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          const logDate = format(parseLocalDate(log.workDate), 'PP', { locale: dateLocale });
          doc.text(`${logDate} - ${parseFloat(log.hoursWorked).toFixed(1)} ${t.hr}`, margin + 5, yPos);
          yPos += 5;

          if (log.buildingName) {
            doc.setTextColor(100, 100, 100);
            doc.text(`${log.buildingName}${log.buildingHeight ? ` (${log.buildingHeight})` : ''}`, margin + 5, yPos);
            yPos += 5;
          }

          if (log.tasksPerformed && log.tasksPerformed.length > 0) {
            doc.setTextColor(120, 120, 120);
            const tasks = log.tasksPerformed.map(taskId => getTaskLabel(taskId, language)).join(', ');
            const taskLines = doc.splitTextToSize(tasks, pageWidth - margin * 2 - 10);
            doc.text(taskLines, margin + 5, yPos);
            yPos += taskLines.length * 4;
          }

          if (log.notes) {
            doc.setTextColor(140, 140, 140);
            doc.setFontStyle('italic');
            const noteLines = doc.splitTextToSize(log.notes, pageWidth - margin * 2 - 10);
            doc.text(noteLines, margin + 5, yPos);
            doc.setFontStyle('normal');
            yPos += noteLines.length * 4;
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
    logs: IrataTaskLog[];
    totalHours: number;
  }> = {};
  
  logs.forEach((log: IrataTaskLog) => {
    const projectKey = log.buildingName || t.unknownProject;
    if (!groupedByProject[projectKey]) {
      groupedByProject[projectKey] = {
        buildingName: log.buildingName || t.unknownProject,
        buildingAddress: log.buildingAddress || "",
        buildingHeight: log.buildingHeight || "",
        logs: [],
        totalHours: 0,
      };
    }
    groupedByProject[projectKey].logs.push(log);
    groupedByProject[projectKey].totalHours += parseFloat(log.hoursWorked || "0");
  });

  Object.values(groupedByProject).forEach((project) => {
    project.logs.sort((a, b) => {
      const dateA = parseLocalDate(a.workDate);
      const dateB = parseLocalDate(b.workDate);
      return dateB.getTime() - dateA.getTime();
    });
  });

  const sortedProjects = Object.entries(groupedByProject)
    .sort(([, a], [, b]) => b.totalHours - a.totalHours);

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
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-[100] bg-card border-b shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/technician-portal")}
              data-testid="button-back-to-portal"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-lg">{t.title}</h1>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            className="gap-2"
            data-testid="button-export-pdf"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">{t.exportPdf}</span>
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0 text-[10px] px-1.5 py-0 hidden sm:flex"
            >
              <Star className="w-2.5 h-2.5 mr-0.5" />
              PRO
            </Badge>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
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
                <div className="text-right">
                  <p className="text-lg font-medium">{logs.length}</p>
                  <p className="text-sm text-muted-foreground">{logs.length === 1 ? t.session : t.sessions}</p>
                </div>
              </div>
              
              {/* Hours Breakdown */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-semibold" data-testid="text-baseline-hours">{baselineHours.toFixed(1)} {t.hr}</p>
                  <p className="text-xs text-muted-foreground">{t.baselineHours}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-semibold" data-testid="text-session-hours">{totalLoggedHours.toFixed(1)} {t.hr}</p>
                  <p className="text-xs text-muted-foreground">{t.fromWorkSessions}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="work-sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="work-sessions" data-testid="tab-work-sessions">
              {t.workSessions} ({logs.length})
            </TabsTrigger>
            <TabsTrigger value="previous-hours" data-testid="tab-previous-hours">
              {t.previousHours} ({historicalHours.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="work-sessions" className="mt-4">
            {logs.length === 0 ? (
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
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-muted-foreground" />
                          <div className="text-left">
                            <p className="font-medium">{project.buildingName}</p>
                            {project.buildingAddress && (
                              <p className="text-sm text-muted-foreground">{project.buildingAddress}</p>
                            )}
                            {project.buildingHeight && (
                              <p className="text-sm text-muted-foreground">{t.buildingHeight}: {project.buildingHeight}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{project.totalHours.toFixed(1)} {t.hr}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.logs.length} {project.logs.length === 1 ? t.session : t.sessions}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea className="max-h-[400px]">
                        <div className="space-y-3 pb-4">
                          {project.logs.map((log) => (
                            <div 
                              key={log.id}
                              className="p-3 bg-muted/50 rounded-lg cursor-pointer hover-elevate active-elevate-2"
                              onClick={() => {
                                setSelectedLog(log);
                                setShowLogDetailsDialog(true);
                              }}
                              data-testid={`log-entry-${log.id}`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  {format(parseLocalDate(log.workDate), 'PPP', { locale: dateLocale })}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    {parseFloat(log.hoursWorked).toFixed(1)} {t.hr}
                                  </Badge>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(log.tasksPerformed || []).map((taskId) => (
                                  <Badge key={taskId} variant="outline" className="text-xs">
                                    <span className="material-icons text-xs mr-1">{getTaskIcon(taskId)}</span>
                                    {getTaskLabel(taskId, language)}
                                  </Badge>
                                ))}
                              </div>
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

          <TabsContent value="previous-hours" className="mt-4 space-y-4">
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{t.previousHours}</p>
                    <p className="text-sm text-muted-foreground">{t.previousHoursNote}</p>
                    {historicalHours.length > 0 && (
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
                      onClick={() => logbookInputRef.current?.click()}
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

            {historicalHours.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="font-medium text-muted-foreground">{t.noPreviousHours}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.noPreviousHoursDesc}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {historicalHours.map((entry) => (
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
              onClick={handleSubmit}
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

          <ScrollArea className="flex-1 max-h-[50vh]">
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

          <DialogFooter className="border-t pt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowReviewDialog(false);
                setScannedEntries([]);
                logbookInputRef.current?.click();
              }}
              className="gap-2"
              data-testid="button-retry-scan"
            >
              <Camera className="w-4 h-4" />
              {t.retryPhoto}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowReviewDialog(false);
                setScannedEntries([]);
              }}
              data-testid="button-cancel-scan"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleCommitScannedEntries}
              disabled={isCommitting || !scannedEntries.some(e => e.selected && e.date && e.hours)}
              className="gap-2"
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>{t.exportWorkHistory}</DialogTitle>
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0 text-[10px] px-1.5 py-0"
              >
                <Star className="w-2.5 h-2.5 mr-0.5" />
                PRO
              </Badge>
            </div>
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
    </div>
  );
}
