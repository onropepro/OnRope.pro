import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSetHeaderConfig } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MapPin, 
  Award,
  FileText,
  Calendar,
  Search,
  Filter,
  Shield,
  Download,
  Eye,
  Clock,
  Loader2,
  AlertCircle,
  ChevronRight,
  Building,
  User,
  Briefcase,
  Send,
  HardHat
} from "lucide-react";
import { format, differenceInYears } from "date-fns";
import type { User as UserType } from "@shared/schema";
import { JOB_TYPES } from "@shared/jobTypes";

type Language = 'en' | 'fr';

const translations = {
  en: {
    title: "Talent Browser",
    subtitle: "Browse technicians available for hire",
    backToDashboard: "Back to Dashboard",
    searchPlaceholder: "Search by name or location...",
    certificationPlaceholder: "Certification",
    levelPlaceholder: "Level",
    allCerts: "All Certs",
    irataOnly: "IRATA Only",
    spratOnly: "SPRAT Only",
    bothCerts: "Both",
    allLevels: "All Levels",
    level1: "Level 1",
    level2: "Level 2",
    level3: "Level 3",
    techniciansCount: (count: number) => count === 1 ? "1 technician available" : `${count} technicians available`,
    loading: "Loading available technicians...",
    noTechniciansTitle: "No Technicians Found",
    noTechniciansFilterMsg: "Try adjusting your filters to see more results.",
    noTechniciansEmptyMsg: "No technicians have opted in to be visible to employers yet.",
    experience: "Experience",
    yearsInRopeAccess: "years in rope access",
    since: "Since",
    certifications: "Certifications",
    noCertifications: "No certifications on file",
    uploadedCertifications: "Uploaded Certifications",
    viewDocument: "View Document",
    resumeCV: "Resume / CV",
    visibleSince: "Profile visible since",
    expired: "Expired",
    expiringSoon: "Expiring Soon",
    license: "License",
    expires: "Expires",
    yrsExp: "yrs exp",
    resume: "Resume",
    unknown: "Unknown",
    irataLevelLabel: "IRATA Level",
    spratLevelLabel: "SPRAT Level",
    sendJobOffer: "Send Job Offer",
    selectJob: "Select a job to offer",
    selectJobPlaceholder: "Choose a job posting...",
    message: "Message (optional)",
    messagePlaceholder: "Add a personal message to the technician...",
    sendOffer: "Send Offer",
    offerSent: "Job Offer Sent",
    offerSentDesc: "The technician will be notified of your job offer.",
    offerFailed: "Failed to send offer",
    technicianUnavailable: "This technician is no longer available",
    noActiveJobs: "No Active Jobs",
    noActiveJobsDesc: "You need to create a job posting first.",
    createJob: "Create Job",
    cancel: "Cancel",
  },
  fr: {
    title: "Navigateur de talents",
    subtitle: "Parcourir les techniciens disponibles a l'embauche",
    backToDashboard: "Retour au tableau de bord",
    searchPlaceholder: "Rechercher par nom ou lieu...",
    certificationPlaceholder: "Certification",
    levelPlaceholder: "Niveau",
    allCerts: "Toutes les certifications",
    irataOnly: "IRATA seulement",
    spratOnly: "SPRAT seulement",
    bothCerts: "Les deux",
    allLevels: "Tous les niveaux",
    level1: "Niveau 1",
    level2: "Niveau 2",
    level3: "Niveau 3",
    techniciansCount: (count: number) => count === 1 ? "1 technicien disponible" : `${count} techniciens disponibles`,
    loading: "Chargement des techniciens disponibles...",
    noTechniciansTitle: "Aucun technicien trouve",
    noTechniciansFilterMsg: "Essayez d'ajuster vos filtres pour voir plus de resultats.",
    noTechniciansEmptyMsg: "Aucun technicien n'a encore choisi d'etre visible par les employeurs.",
    experience: "Experience",
    yearsInRopeAccess: "ans en acces par corde",
    since: "Depuis",
    certifications: "Certifications",
    noCertifications: "Aucune certification en dossier",
    uploadedCertifications: "Certifications téléversées",
    viewDocument: "Voir le document",
    resumeCV: "CV / Resume",
    visibleSince: "Profil visible depuis",
    expired: "Expire",
    expiringSoon: "Expire bientot",
    license: "Licence",
    expires: "Expire le",
    yrsExp: "ans exp",
    resume: "CV",
    unknown: "Inconnu",
    irataLevelLabel: "IRATA Niveau",
    spratLevelLabel: "SPRAT Niveau",
    sendJobOffer: "Envoyer une offre d'emploi",
    selectJob: "Selectionnez un emploi a offrir",
    selectJobPlaceholder: "Choisir une offre d'emploi...",
    message: "Message (optionnel)",
    messagePlaceholder: "Ajoutez un message personnel au technicien...",
    sendOffer: "Envoyer l'offre",
    offerSent: "Offre d'emploi envoyee",
    offerSentDesc: "Le technicien sera informe de votre offre d'emploi.",
    offerFailed: "Echec de l'envoi de l'offre",
    technicianUnavailable: "Ce technicien n'est plus disponible",
    noActiveJobs: "Aucun emploi actif",
    noActiveJobsDesc: "Vous devez d'abord creer une offre d'emploi.",
    createJob: "Creer un emploi",
    cancel: "Annuler",
  }
};

type JobPosting = {
  id: string;
  title: string;
  status: string;
  location: string | null;
  jobType: string;
};

interface VisibleTechnician {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  photoUrl: string | null;
  irataLevel: string | null;
  irataLicenseNumber: string | null;
  irataExpirationDate: Date | string | null;
  spratLevel: string | null;
  spratLicenseNumber: string | null;
  spratExpirationDate: Date | string | null;
  ropeAccessStartDate: Date | string | null;
  resumeDocuments: any[] | null;
  employeeCity: string | null;
  employeeProvinceState: string | null;
  employeeCountry: string | null;
  visibilityEnabledAt: Date | string | null;
  safetyRating?: number;
  safetyLabel?: string;
  safetyColor?: string;
  safetyBreakdown?: {
    irataValid: boolean;
    spratValid: boolean;
    hasValidCertification: boolean;
    yearsExperience: number;
    hasResume: boolean;
  certifications?: Array<{
    id: string;
    description: string | null;
    fileUrl: string;
    expiryDate: string | null;
    createdAt: string;
  }>;
  };
}

export default function VisibleTechniciansBrowser() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [certFilter, setCertFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selectedTech, setSelectedTech] = useState<VisibleTechnician | null>(null);
  const [showJobOfferDialog, setShowJobOfferDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [offerMessage, setOfferMessage] = useState("");
  
  // Use global i18n language, not local storage
  const language: Language = i18n.language === 'fr' ? 'fr' : 'en';
  const t = translations[language];

  const { data: userData } = useQuery<{ user: UserType }>({
    queryKey: ["/api/user"],
  });

  const { data: techsData, isLoading } = useQuery<{ technicians: VisibleTechnician[] }>({
    queryKey: ["/api/visible-technicians"],
  });

  const { data: jobsData } = useQuery<{ jobPostings: JobPosting[] }>({
    queryKey: ["/api/job-postings"],
    enabled: userData?.user?.role === 'company',
  });

  const activeJobs = (jobsData?.jobPostings || []).filter(j => j.status === 'active');

  const sendOfferMutation = useMutation({
    mutationFn: async ({ technicianId, jobPostingId, message }: { technicianId: string; jobPostingId: string; message?: string }) => {
      return apiRequest("POST", "/api/job-applications/offer", { technicianId, jobPostingId, message });
    },
    onSuccess: () => {
      toast({
        title: t.offerSent,
        description: t.offerSentDesc,
      });
      setShowJobOfferDialog(false);
      setSelectedJobId("");
      setOfferMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/job-applications"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "";
      const isTechUnavailable = errorMessage.includes("no longer available") || errorMessage.includes("not a technician");
      toast({
        title: isTechUnavailable ? t.technicianUnavailable : t.offerFailed,
        variant: "destructive",
      });
    },
  });

  const user = userData?.user;
  const technicians = techsData?.technicians || [];

  const getDisplayName = (tech: VisibleTechnician) => {
    if (tech.firstName && tech.lastName) {
      return `${tech.firstName} ${tech.lastName}`;
    }
    return tech.name || t.unknown;
  };

  const getInitials = (tech: VisibleTechnician) => {
    if (tech.firstName && tech.lastName) {
      return `${tech.firstName[0]}${tech.lastName[0]}`.toUpperCase();
    }
    if (tech.name) {
      return tech.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return "??";
  };

  const getLocation = (tech: VisibleTechnician) => {
    const parts = [tech.employeeCity, tech.employeeProvinceState, tech.employeeCountry].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const getYearsExperience = (startDate: Date | string | null) => {
    if (!startDate) return null;
    const date = typeof startDate === "string" ? new Date(startDate) : startDate;
    return differenceInYears(new Date(), date);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, "MMM d, yyyy");
  };

  const isExpiringSoon = (date: Date | string | null) => {
    if (!date) return false;
    const d = typeof date === "string" ? new Date(date) : date;
    const daysUntil = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 60 && daysUntil > 0;
  };

  const isExpired = (date: Date | string | null) => {
    if (!date) return false;
    const d = typeof date === "string" ? new Date(date) : date;
    return d < new Date();
  };

  const filteredTechnicians = technicians.filter(tech => {
    const name = getDisplayName(tech).toLowerCase();
    const location = getLocation(tech)?.toLowerCase() || "";
    const irataLicense = (tech.irataLicenseNumber || "").toLowerCase();
    const spratLicense = (tech.spratLicenseNumber || "").toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = name.includes(searchLower) || 
                          location.includes(searchLower) ||
                          irataLicense.includes(searchLower) ||
                          spratLicense.includes(searchLower);

    let matchesCert = true;
    if (certFilter === "irata") {
      matchesCert = !!tech.irataLevel;
    } else if (certFilter === "sprat") {
      matchesCert = !!tech.spratLevel;
    } else if (certFilter === "both") {
      matchesCert = !!tech.irataLevel && !!tech.spratLevel;
    }

    let matchesLevel = true;
    if (levelFilter !== "all") {
      matchesLevel = tech.irataLevel === levelFilter || tech.spratLevel === levelFilter;
    }

    return matchesSearch && matchesCert && matchesLevel;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Configure unified header with back button
  const handleBackClick = useCallback(() => {
    setLocation('/dashboard');
  }, [setLocation]);

  useSetHeaderConfig({
    pageTitle: t.title,
    pageDescription: t.subtitle,
    onBackClick: handleBackClick,
    showSearch: false,
  }, [t.title, t.subtitle, handleBackClick]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-technicians"
                />
              </div>
              <Select value={certFilter} onValueChange={setCertFilter}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-cert-filter">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t.certificationPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allCerts}</SelectItem>
                  <SelectItem value="irata">{t.irataOnly}</SelectItem>
                  <SelectItem value="sprat">{t.spratOnly}</SelectItem>
                  <SelectItem value="both">{t.bothCerts}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-32" data-testid="select-level-filter">
                  <Award className="w-4 h-4 mr-2" />
                  <SelectValue placeholder={t.levelPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allLevels}</SelectItem>
                  <SelectItem value="1">{t.level1}</SelectItem>
                  <SelectItem value="2">{t.level2}</SelectItem>
                  <SelectItem value="3">{t.level3}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t.techniciansCount(filteredTechnicians.length)}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t.loading}</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && filteredTechnicians.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">{t.noTechniciansTitle}</h3>
              <p className="text-muted-foreground">
                {searchQuery || certFilter !== "all" || levelFilter !== "all"
                  ? t.noTechniciansFilterMsg
                  : t.noTechniciansEmptyMsg}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Technicians Grid */}
        {!isLoading && filteredTechnicians.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTechnicians.map((tech) => {
              const yearsExp = getYearsExperience(tech.ropeAccessStartDate);
              const location = getLocation(tech);
              const hasResume = tech.resumeDocuments && tech.resumeDocuments.length > 0;

              return (
                <Card 
                  key={tech.id} 
                  className="hover-elevate cursor-pointer transition-all"
                  onClick={() => setSelectedTech(tech)}
                  data-testid={`card-technician-${tech.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={tech.photoUrl || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(tech)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{getDisplayName(tech)}</h3>
                        {location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {location}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tech.irataLevel && (
                        <Badge variant={isExpired(tech.irataExpirationDate) ? "destructive" : isExpiringSoon(tech.irataExpirationDate) ? "secondary" : "default"} className="text-xs">
                          IRATA L{tech.irataLevel}
                        </Badge>
                      )}
                      {tech.spratLevel && (
                        <Badge variant={isExpired(tech.spratExpirationDate) ? "destructive" : isExpiringSoon(tech.spratExpirationDate) ? "secondary" : "default"} className="text-xs">
                          SPRAT L{tech.spratLevel}
                        </Badge>
                      )}
                      {yearsExp !== null && (
                        <Badge variant="outline" className="text-xs">
                          {yearsExp}+ {t.yrsExp}
                        </Badge>
                      )}
                      {hasResume && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <FileText className="w-3 h-3" />
                          {t.resume}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Technician Detail Dialog */}
      <Dialog open={!!selectedTech} onOpenChange={(open) => !open && setSelectedTech(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedTech && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedTech.photoUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-xl">
                      {getInitials(selectedTech)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{getDisplayName(selectedTech)}</DialogTitle>
                    {getLocation(selectedTech) && (
                      <DialogDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {getLocation(selectedTech)}
                      </DialogDescription>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Safety Rating */}
                {selectedTech.safetyRating !== undefined && (
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    selectedTech.safetyColor === 'green' ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800' :
                    selectedTech.safetyColor === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800' :
                    selectedTech.safetyColor === 'orange' ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800' :
                    'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                  }`}>
                    <Shield className={`w-5 h-5 ${
                      selectedTech.safetyColor === 'green' ? 'text-green-600 dark:text-green-400' :
                      selectedTech.safetyColor === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                      selectedTech.safetyColor === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                      'text-red-600 dark:text-red-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">PSR</p>
                        <p className="text-xs text-muted-foreground">Personal Safety Rating</p>
                        <Badge variant={
                          selectedTech.safetyColor === 'green' ? 'default' :
                          selectedTech.safetyColor === 'yellow' ? 'secondary' :
                          'destructive'
                        } className={`text-xs ${
                          selectedTech.safetyColor === 'green' ? 'bg-green-600 dark:bg-green-500' :
                          selectedTech.safetyColor === 'yellow' ? 'bg-yellow-500 text-black' : ''
                        }`}>
                          {selectedTech.safetyRating}%
                        </Badge>
                      </div>
                      <p className={`font-medium ${
                        selectedTech.safetyColor === 'green' ? 'text-green-700 dark:text-green-300' :
                        selectedTech.safetyColor === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' :
                        selectedTech.safetyColor === 'orange' ? 'text-orange-700 dark:text-orange-300' :
                        'text-red-700 dark:text-red-300'
                      }`}>
                        {selectedTech.safetyLabel}
                      </p>
                      {selectedTech.safetyBreakdown && (
                        <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                          {selectedTech.safetyBreakdown.irataValid && (
                            <p className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-green-500" /> Valid IRATA certification
                            </p>
                          )}
                          {selectedTech.safetyBreakdown.spratValid && (
                            <p className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-green-500" /> Valid SPRAT certification
                            </p>
                          )}
                          {selectedTech.safetyBreakdown.yearsExperience > 0 && (
                            <p className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {selectedTech.safetyBreakdown.yearsExperience}+ years experience
                            </p>
                          )}
                          {selectedTech.safetyBreakdown.hasResume && (
                            <p className="flex items-center gap-1">
                              <FileText className="w-3 h-3" /> Resume on file
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {selectedTech.ropeAccessStartDate && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t.experience}</p>
                      <p className="font-medium">
                        {getYearsExperience(selectedTech.ropeAccessStartDate)}+ {t.yearsInRopeAccess}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.since} {formatDate(selectedTech.ropeAccessStartDate)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Certifications */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {t.certifications}
                  </h4>

                  {selectedTech.irataLevel && (
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge>{t.irataLevelLabel} {selectedTech.irataLevel}</Badge>
                          {isExpired(selectedTech.irataExpirationDate) && (
                            <Badge variant="destructive">{t.expired}</Badge>
                          )}
                          {isExpiringSoon(selectedTech.irataExpirationDate) && !isExpired(selectedTech.irataExpirationDate) && (
                            <Badge variant="secondary">{t.expiringSoon}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        {selectedTech.irataLicenseNumber && (
                          <p>{t.license}: {selectedTech.irataLicenseNumber}</p>
                        )}
                        {selectedTech.irataExpirationDate && (
                          <p>{t.expires}: {formatDate(selectedTech.irataExpirationDate)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedTech.spratLevel && (
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge>{t.spratLevelLabel} {selectedTech.spratLevel}</Badge>
                          {isExpired(selectedTech.spratExpirationDate) && (
                            <Badge variant="destructive">{t.expired}</Badge>
                          )}
                          {isExpiringSoon(selectedTech.spratExpirationDate) && !isExpired(selectedTech.spratExpirationDate) && (
                            <Badge variant="secondary">{t.expiringSoon}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        {selectedTech.spratLicenseNumber && (
                          <p>{t.license}: {selectedTech.spratLicenseNumber}</p>
                        )}
                        {selectedTech.spratExpirationDate && (
                          <p>{t.expires}: {formatDate(selectedTech.spratExpirationDate)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  
                  {/* Uploaded Certifications */}
                  {selectedTech.certifications && selectedTech.certifications.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{t.uploadedCertifications}</p>
                      {selectedTech.certifications.map((cert: any) => (
                        <div key={cert.id} className="p-3 rounded-lg border flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{cert.description || "Certificate"}</p>
                            {cert.expiryDate && (
                              <p className="text-xs text-muted-foreground">
                                {t.expires}: {formatDate(cert.expiryDate)}
                                {isExpired(cert.expiryDate) && <Badge variant="destructive" className="ml-2">{t.expired}</Badge>}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(cert.fileUrl, "_blank")}
                            data-testid={`button-view-cert-${cert.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {t.viewDocument}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {!selectedTech.irataLevel && !selectedTech.spratLevel && (!selectedTech.certifications || selectedTech.certifications.length === 0) && (
                    <p className="text-sm text-muted-foreground italic">{t.noCertifications}</p>
                  )}
                </div>

                {/* Resume/CV */}
                {selectedTech.resumeDocuments && selectedTech.resumeDocuments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {t.resumeCV}
                    </h4>
                    <div className="space-y-2">
                      {selectedTech.resumeDocuments.map((doc: any, index: number) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg border hover-elevate"
                          data-testid={`link-resume-${index}`}
                        >
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="flex-1 truncate text-sm">{doc.name || `${t.resume} ${index + 1}`}</span>
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visibility Info */}
                {selectedTech.visibilityEnabledAt && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {t.visibleSince} {formatDate(selectedTech.visibilityEnabledAt)}
                    </p>
                  </div>
                )}

                {/* Send Job Offer Button - Only for company users */}
                {user?.role === 'company' && (
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => setShowJobOfferDialog(true)}
                      className="w-full gap-2"
                      data-testid="button-send-job-offer"
                    >
                      <Send className="w-4 h-4" />
                      {t.sendJobOffer}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Offer Dialog */}
      <Dialog open={showJobOfferDialog} onOpenChange={setShowJobOfferDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {t.sendJobOffer}
            </DialogTitle>
            {selectedTech && (
              <DialogDescription>
                {getDisplayName(selectedTech)}
              </DialogDescription>
            )}
          </DialogHeader>

          {activeJobs.length === 0 ? (
            <div className="py-6 text-center">
              <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <h4 className="font-semibold mb-1">{t.noActiveJobs}</h4>
              <p className="text-sm text-muted-foreground mb-4">{t.noActiveJobsDesc}</p>
              <Button onClick={() => setLocation("/job-board")} data-testid="button-create-job-from-offer">
                {t.createJob}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>{t.selectJob}</Label>
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                  <SelectTrigger data-testid="select-job-for-offer">
                    <SelectValue placeholder={t.selectJobPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeJobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        <div className="flex items-center gap-2">
                          <span>{job.title}</span>
                          {job.location && (
                            <span className="text-xs text-muted-foreground">- {job.location}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.message}</Label>
                <Textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  rows={3}
                  data-testid="input-offer-message"
                />
              </div>
            </div>
          )}

          {activeJobs.length > 0 && (
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowJobOfferDialog(false)}>
                {t.cancel}
              </Button>
              <Button
                onClick={() => {
                  if (selectedTech && selectedJobId) {
                    sendOfferMutation.mutate({
                      technicianId: selectedTech.id,
                      jobPostingId: selectedJobId,
                      message: offerMessage || undefined,
                    });
                  }
                }}
                disabled={!selectedJobId || sendOfferMutation.isPending}
                data-testid="button-confirm-send-offer"
              >
                {sendOfferMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Send className="w-4 h-4 mr-2" />
                {t.sendOffer}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
