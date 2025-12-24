import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar, type NavGroup } from "@/components/DashboardSidebar";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  User as UserIcon, 
  MoreHorizontal, 
  Briefcase, 
  Eye, 
  Mail,
  Shield,
  Award,
  GraduationCap,
  Search,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import type { User } from "@shared/schema";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

export default function TechnicianPSR() {
  const [, setLocation] = useLocation();
  const { i18n } = useTranslation();
  const language = i18n.language?.substring(0, 2) || 'en';

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user;

  const translations = {
    en: {
      pageTitle: "Personal Safety Rating",
      pageDescription: "Track your safety compliance and professional standing",
      searchPlaceholder: "Ask anything...",
      overallRating: "Overall PSR Score",
      components: "Rating Components",
      safetyDocs: "Safety Documents",
      safetyDocsDesc: "Harness inspections, FLHA forms, toolbox talks",
      certifications: "Certifications",
      certificationsDesc: "IRATA/SPRAT levels, training currency",
      quizzes: "Safety Quizzes",
      quizzesDesc: "Practice quiz completion and scores",
      workHistory: "Work History",
      workHistoryDesc: "Project completion and incident record",
      excellent: "Excellent",
      good: "Good",
      needsWork: "Needs Work",
      critical: "Critical",
      upToDate: "Up to date",
      expired: "Expired",
      pending: "Pending",
      completed: "Completed",
      notStarted: "Not started",
      tips: "Tips to Improve",
      tip1: "Complete all required safety documents before each project",
      tip2: "Keep your certifications current and renewed before expiry",
      tip3: "Take practice quizzes to refresh your safety knowledge",
      tip4: "Maintain a clean incident record on all job sites",
    },
    fr: {
      pageTitle: "Cote de Sécurité Personnelle",
      pageDescription: "Suivez votre conformité en matière de sécurité",
      searchPlaceholder: "Demandez n'importe quoi...",
      overallRating: "Score PSR Global",
      components: "Composants de la Cote",
      safetyDocs: "Documents de Sécurité",
      safetyDocsDesc: "Inspections de harnais, formulaires FLHA",
      certifications: "Certifications",
      certificationsDesc: "Niveaux IRATA/SPRAT, validité",
      quizzes: "Quiz de Sécurité",
      quizzesDesc: "Complétion et scores des quiz",
      workHistory: "Historique de Travail",
      workHistoryDesc: "Projets complétés et incidents",
      excellent: "Excellent",
      good: "Bon",
      needsWork: "À améliorer",
      critical: "Critique",
      upToDate: "À jour",
      expired: "Expiré",
      pending: "En attente",
      completed: "Complété",
      notStarted: "Non commencé",
      tips: "Conseils pour Améliorer",
      tip1: "Complétez tous les documents de sécurité requis",
      tip2: "Gardez vos certifications à jour",
      tip3: "Faites des quiz pour rafraîchir vos connaissances",
      tip4: "Maintenez un dossier propre sur tous les chantiers",
    },
    es: {
      pageTitle: "Calificación de Seguridad Personal",
      pageDescription: "Rastree su cumplimiento de seguridad y posición profesional",
      searchPlaceholder: "Pregunta lo que sea...",
      overallRating: "Puntuación PSR General",
      components: "Componentes de Calificación",
      safetyDocs: "Documentos de Seguridad",
      safetyDocsDesc: "Inspecciones de arnés, formularios FLHA",
      certifications: "Certificaciones",
      certificationsDesc: "Niveles IRATA/SPRAT, vigencia",
      quizzes: "Cuestionarios de Seguridad",
      quizzesDesc: "Finalización y puntuaciones de cuestionarios",
      workHistory: "Historial de Trabajo",
      workHistoryDesc: "Proyectos completados e incidentes",
      excellent: "Excelente",
      good: "Bueno",
      needsWork: "Necesita Mejora",
      critical: "Crítico",
      upToDate: "Al día",
      expired: "Vencido",
      pending: "Pendiente",
      completed: "Completado",
      notStarted: "No iniciado",
      tips: "Consejos para Mejorar",
      tip1: "Complete todos los documentos de seguridad requeridos",
      tip2: "Mantenga sus certificaciones actualizadas",
      tip3: "Tome cuestionarios de práctica para refrescar conocimientos",
      tip4: "Mantenga un registro limpio en todos los sitios",
    }
  };

  const trans = translations[language as keyof typeof translations] || translations.en;

  const technicianNavGroups: NavGroup[] = [
    {
      id: "main",
      label: "NAVIGATION",
      items: [
        {
          id: "home",
          label: language === 'en' ? "Home" : language === 'es' ? "Inicio" : "Accueil",
          icon: Home,
          href: "/technician-portal",
          isVisible: () => true,
        },
        {
          id: "profile",
          label: language === 'en' ? "Profile" : language === 'es' ? "Perfil" : "Profil",
          icon: UserIcon,
          href: "/technician-portal?tab=profile",
          isVisible: () => true,
        },
        {
          id: "more",
          label: language === 'en' ? "More" : language === 'es' ? "Mas" : "Plus",
          icon: MoreHorizontal,
          href: "/technician-portal?tab=more",
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
          href: "/technician-job-board",
          isVisible: () => true,
        },
        {
          id: "visibility",
          label: language === 'en' ? "My Visibility" : language === 'es' ? "Mi Visibilidad" : "Ma Visibilité",
          icon: Eye,
          href: "/technician-portal?tab=visibility",
          isVisible: () => true,
        },
        {
          id: "invitations",
          label: language === 'en' ? "Team Invitations" : language === 'es' ? "Invitaciones" : "Invitations",
          icon: Mail,
          href: "/technician-portal?tab=invitations",
          isVisible: () => true,
        },
      ],
    },
    {
      id: "safety",
      label: language === 'en' ? "SAFETY" : language === 'es' ? "SEGURIDAD" : "SÉCURITÉ",
      items: [
        {
          id: "personal-safety-docs",
          label: language === 'en' ? "Personal Safety Docs" : language === 'es' ? "Docs de Seguridad" : "Docs de sécurité",
          icon: Shield,
          href: "/personal-safety-documents",
          isVisible: () => true,
        },
        {
          id: "psr",
          label: language === 'en' ? "Safety Rating (PSR)" : language === 'es' ? "Calificacion (PSR)" : "Cote de sécurité (PSR)",
          icon: Award,
          href: "/technician-psr",
          isVisible: () => true,
        },
        {
          id: "practice-quizzes",
          label: language === 'en' ? "Practice Quizzes" : language === 'es' ? "Cuestionarios" : "Quiz pratiques",
          icon: GraduationCap,
          href: "/technician-practice-quizzes",
          isVisible: () => true,
        },
      ],
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  const overallScore = 78;
  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" };
    if (score >= 70) return { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" };
    if (score >= 50) return { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" };
    return { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" };
  };
  const scoreColors = getScoreColor(overallScore);
  const getScoreLabel = (score: number) => {
    if (score >= 90) return trans.excellent;
    if (score >= 70) return trans.good;
    if (score >= 50) return trans.needsWork;
    return trans.critical;
  };

  const components = [
    { id: "docs", label: trans.safetyDocs, desc: trans.safetyDocsDesc, score: 85, icon: FileCheck },
    { id: "certs", label: trans.certifications, desc: trans.certificationsDesc, score: 100, icon: Award },
    { id: "quizzes", label: trans.quizzes, desc: trans.quizzesDesc, score: 60, icon: GraduationCap },
    { id: "history", label: trans.workHistory, desc: trans.workHistoryDesc, score: 95, icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar
        variant="technician"
        userName={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || "Technician"}
        userAvatar={user?.profileImage || undefined}
        currentPage="psr"
        customNavigationGroups={technicianNavGroups}
        hideSettingsButton={true}
      />

      <div className="lg:pl-60">
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-14 flex items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-3">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 w-auto" />
          </div>
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder={trans.searchPlaceholder}
                className="pl-10 bg-slate-100 dark:bg-slate-800 border-0"
                data-testid="input-psr-search"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageDropdown />
            <Avatar className="h-8 w-8 border-2" style={{ borderColor: "#AB4521" }}>
              <AvatarImage src={user?.profileImage || undefined} />
              <AvatarFallback className="text-white text-sm" style={{ backgroundColor: "#AB4521" }}>
                {user?.firstName?.[0] || user?.username?.[0] || "T"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="p-4 md:p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-psr-title">
              {trans.pageTitle}
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
              {trans.pageDescription}
            </p>
          </div>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#0B64A3]" />
                {trans.overallRating}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`rounded-lg p-6 ${scoreColors.bg}`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl font-bold ${scoreColors.text}`} data-testid="text-psr-score">
                      {overallScore}%
                    </div>
                    <Badge className={scoreColors.badge}>
                      {getScoreLabel(overallScore)}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Progress value={overallScore} className="h-3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                {trans.components}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {components.map((comp) => {
                const compColors = getScoreColor(comp.score);
                return (
                  <div key={comp.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${compColors.bg}`}>
                      <comp.icon className={`w-5 h-5 ${compColors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-medium text-base text-slate-900 dark:text-slate-100">{comp.label}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{comp.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${compColors.text}`}>{comp.score}%</span>
                          {comp.score >= 90 ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : comp.score >= 70 ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                      </div>
                      <Progress value={comp.score} className="h-2 mt-2" />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#0B64A3]" />
                {trans.tips}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[trans.tip1, trans.tip2, trans.tip3, trans.tip4].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0B64A3] mt-0.5 flex-shrink-0" />
                    <span className="text-base text-slate-700 dark:text-slate-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
