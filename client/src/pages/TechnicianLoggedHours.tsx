import { useState } from "react";
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
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

type Language = 'en' | 'fr';

const translations = {
  en: {
    title: "My Logged Hours",
    backToPortal: "Back to Portal",
    totalHours: "Total Hours",
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
    previousEmployer: "Previous Employer",
    previousEmployerPlaceholder: "Company name (optional)",
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
    logbookDisclaimer: "This is a personal tracking tool to help you monitor your rope access hours. You must still record all hours in your official IRATA/SPRAT logbook - this digital log does not replace it and is not valid for certification purposes.",
  },
  fr: {
    title: "Mes heures enregistrées",
    backToPortal: "Retour au portail",
    totalHours: "Total des heures",
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
    previousEmployer: "Employeur précédent",
    previousEmployerPlaceholder: "Nom de l'entreprise (facultatif)",
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
    logbookDisclaimer: "Ceci est un outil de suivi personnel pour vous aider à surveiller vos heures d'accès sur corde. Vous devez toujours enregistrer toutes vos heures dans votre carnet IRATA/SPRAT officiel - ce journal numérique ne le remplace pas et n'est pas valide pour les fins de certification.",
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

  const { data: logsData, isLoading: logsLoading } = useQuery<{ logs: IrataTaskLog[] }>({
    queryKey: ["/api/my-irata-task-logs"],
  });

  const { data: historicalData, isLoading: historicalLoading } = useQuery<{ historicalHours: HistoricalHours[] }>({
    queryKey: ["/api/my-historical-hours"],
  });

  const logs = logsData?.logs || [];
  const historicalHours = historicalData?.historicalHours || [];

  const totalLoggedHours = logs.reduce((sum: number, log: IrataTaskLog) => {
    return sum + parseFloat(log.hoursWorked || "0");
  }, 0);

  const totalHistoricalHours = historicalHours.reduce((sum: number, entry: HistoricalHours) => {
    return sum + parseFloat(entry.hoursWorked || "0");
  }, 0);

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

  const groupedByProject: Record<string, { 
    buildingName: string; 
    buildingAddress: string; 
    logs: IrataTaskLog[];
    totalHours: number;
  }> = {};
  
  logs.forEach((log: IrataTaskLog) => {
    const projectKey = log.buildingName || t.unknownProject;
    if (!groupedByProject[projectKey]) {
      groupedByProject[projectKey] = {
        buildingName: log.buildingName || t.unknownProject,
        buildingAddress: log.buildingAddress || "",
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
        <div className="px-4 py-3 flex items-center gap-3 max-w-4xl mx-auto">
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
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Important disclaimer notice */}
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {t.logbookDisclaimer}
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalLoggedHours.toFixed(1)} {t.hr}</p>
                  <p className="text-sm text-muted-foreground">{t.totalHours} ({t.fromWorkSessions})</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium">{logs.length}</p>
                <p className="text-sm text-muted-foreground">{logs.length === 1 ? t.session : t.sessions}</p>
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
                              className="p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  {format(parseLocalDate(log.workDate), 'PPP', { locale: dateLocale })}
                                </div>
                                <Badge variant="secondary">
                                  {parseFloat(log.hoursWorked).toFixed(1)} {t.hr}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(log.tasksPerformed || []).map((taskId) => (
                                  <Badge key={taskId} variant="outline" className="text-xs">
                                    <span className="material-icons text-xs mr-1">{getTaskIcon(taskId)}</span>
                                    {getTaskLabel(taskId, language)}
                                  </Badge>
                                ))}
                              </div>
                              {log.notes && (
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                  {log.notes}
                                </p>
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
                  <Button
                    onClick={() => setShowAddDialog(true)}
                    className="gap-2"
                    data-testid="button-add-previous-hours"
                  >
                    <Plus className="w-4 h-4" />
                    {t.addPreviousHours}
                  </Button>
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
                              {t.previousEmployer}: {entry.previousEmployer}
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
              <Label htmlFor="previousEmployer">{t.previousEmployer}</Label>
              <Input
                id="previousEmployer"
                placeholder={t.previousEmployerPlaceholder}
                value={formData.previousEmployer}
                onChange={(e) => setFormData({ ...formData, previousEmployer: e.target.value })}
                data-testid="input-previous-employer"
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
    </div>
  );
}
