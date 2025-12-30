import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { TechnicianHeader } from "@/components/TechnicianHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Info,
  Award,
  GraduationCap,
  BookOpen,
  Target,
  Calculator,
  Star
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { User } from "@shared/schema";
import { getTechnicianNavGroups } from "@/lib/technicianNavigation";

interface PSRData {
  overallScore: number;
  isLinkedToEmployer: boolean;
  components: {
    certifications: {
      score: number;
      status: string;
      details: {
        type?: string;
        level?: string;
        expirationDate?: string;
        daysUntilExpiry?: number;
        verified: boolean;
      };
      weight: number;
    };
    safetyDocs: {
      score: number;
      status: string;
      details: {
        totalInspections: number;
        recentInspections: number;
        passedRecent: number;
        last30Days: number;
      };
      weight: number;
    };
    quizzes: {
      score: number;
      status: string;
      details: {
        totalAttempts: number;
        passedQuizTypes: number;
        totalQuizTypes: number;
        quizzesPassed: string[];
      };
      weight: number;
    };
    workHistory: {
      score: number;
      status: string;
      details: {
        isLinked: boolean;
        totalSessions?: number;
        incidentCount?: number;
      };
      weight: number;
    };
  };
}

export default function TechnicianPSR() {
  const { i18n } = useTranslation();
  const language = i18n.language?.substring(0, 2) || 'en';
  
  // Mobile sidebar state for external control
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });

  const { data: psrData, isLoading: psrLoading } = useQuery<PSRData>({
    queryKey: ["/api/technician/psr"],
    enabled: !!userData?.user,
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
      safetyDocsDesc: "Personal harness inspections (last 30 days)",
      certifications: "Certifications",
      certificationsDesc: "IRATA/SPRAT level and verification status",
      quizzes: "Safety Quizzes",
      quizzesDesc: "Practice quiz completion and scores",
      workHistory: "Work History",
      workHistoryDesc: "Project completion and incident record",
      excellent: "Excellent",
      good: "Good",
      needsWork: "Needs Work",
      critical: "Critical",
      notApplicable: "N/A",
      tips: "Tips to Improve",
      tip1: "Complete harness inspections before each work day",
      tip2: "Keep your certifications current and verified",
      tip3: "Take practice quizzes to refresh your safety knowledge",
      tip4: "Maintain a clean incident record on all job sites",
      noData: "No data yet",
      loading: "Loading your safety rating...",
      unlinkedNote: "Work history is only tracked when linked to an employer",
      verified: "Verified",
      unverified: "Not verified",
      expired: "Expired",
      inspections: "inspections",
      quizzesPassed: "quizzes passed",
      sessions: "work sessions",
      incidents: "incidents",
      // Documentation section
      aboutPSR: "Understanding Your PSR",
      whatIsPSR: "What is PSR?",
      whatIsPSRDesc: "Your Personal Safety Rating (PSR) is a comprehensive score that reflects your commitment to safety in rope access work. It combines your certifications, equipment inspections, safety knowledge, and work history into a single, easy-to-understand percentage.",
      whyPSRMatters: "Why Your PSR Matters",
      whyPSRMattersDesc: "A strong PSR demonstrates your professionalism to employers. Companies reviewing technician profiles can see your safety rating, making a high PSR a competitive advantage when seeking work opportunities.",
      howCalculated: "How It's Calculated",
      calcIntro: "Your PSR is calculated from the following components:",
      calcCert: "Certifications: Valid, verified IRATA/SPRAT certification scores highest (100%). Unverified scores 75%, expired scores 25%.",
      calcDocs: "Safety Documents: Based on your personal harness inspections in the last 30 days. More passed inspections = higher score.",
      calcQuiz: "Safety Quizzes: Complete the 6 available safety quizzes to maximize this score.",
      calcWork: "Work History: Only applies when linked to an employer. Clean incident record maintains high score.",
      calcWeights: "When not linked to an employer, each component is weighted equally at 33%. When linked, all four components are weighted at 25% each.",
      scoreRanges: "Score Ranges",
      range90: "90-100%: Excellent - Top-tier safety compliance",
      range70: "70-89%: Good - Solid safety record",
      range50: "50-69%: Needs Work - Room for improvement",
      range0: "0-49%: Critical - Immediate attention required",
    },
    fr: {
      pageTitle: "Cote de Sécurité Personnelle",
      pageDescription: "Suivez votre conformité en matière de sécurité",
      searchPlaceholder: "Demandez n'importe quoi...",
      overallRating: "Score PSR Global",
      components: "Composants de la Cote",
      safetyDocs: "Documents de Sécurité",
      safetyDocsDesc: "Inspections de harnais personnelles (30 derniers jours)",
      certifications: "Certifications",
      certificationsDesc: "Niveau IRATA/SPRAT et statut de vérification",
      quizzes: "Quiz de Sécurité",
      quizzesDesc: "Complétion et scores des quiz",
      workHistory: "Historique de Travail",
      workHistoryDesc: "Projets complétés et incidents",
      excellent: "Excellent",
      good: "Bon",
      needsWork: "À améliorer",
      critical: "Critique",
      notApplicable: "N/A",
      tips: "Conseils pour Améliorer",
      tip1: "Effectuez des inspections de harnais chaque jour de travail",
      tip2: "Gardez vos certifications à jour et vérifiées",
      tip3: "Faites des quiz pour rafraîchir vos connaissances",
      tip4: "Maintenez un dossier propre sur tous les chantiers",
      noData: "Pas encore de données",
      loading: "Chargement de votre cote de sécurité...",
      unlinkedNote: "L'historique de travail n'est suivi que lorsque vous êtes lié à un employeur",
      verified: "Vérifié",
      unverified: "Non vérifié",
      expired: "Expiré",
      inspections: "inspections",
      quizzesPassed: "quiz réussis",
      sessions: "sessions de travail",
      incidents: "incidents",
      // Documentation section
      aboutPSR: "Comprendre votre PSR",
      whatIsPSR: "Qu'est-ce que le PSR?",
      whatIsPSRDesc: "Votre Cote de Sécurité Personnelle (PSR) est un score complet qui reflète votre engagement envers la sécurité dans les travaux sur corde. Il combine vos certifications, inspections d'équipement, connaissances en sécurité et historique de travail en un pourcentage facile à comprendre.",
      whyPSRMatters: "Pourquoi votre PSR est important",
      whyPSRMattersDesc: "Un PSR élevé démontre votre professionnalisme aux employeurs. Les entreprises qui examinent les profils de techniciens peuvent voir votre cote de sécurité, faisant d'un PSR élevé un avantage compétitif lors de la recherche d'opportunités de travail.",
      howCalculated: "Comment c'est calculé",
      calcIntro: "Votre PSR est calculé à partir des composants suivants:",
      calcCert: "Certifications: Une certification IRATA/SPRAT valide et vérifiée obtient le score le plus élevé (100%). Non vérifié = 75%, expiré = 25%.",
      calcDocs: "Documents de sécurité: Basé sur vos inspections de harnais personnelles des 30 derniers jours. Plus d'inspections réussies = score plus élevé.",
      calcQuiz: "Quiz de sécurité: Complétez les 6 quiz de sécurité disponibles pour maximiser ce score.",
      calcWork: "Historique de travail: S'applique uniquement lorsque vous êtes lié à un employeur. Un dossier propre maintient un score élevé.",
      calcWeights: "Lorsque vous n'êtes pas lié à un employeur, chaque composant est pondéré également à 33%. Lorsque lié, les quatre composants sont pondérés à 25% chacun.",
      scoreRanges: "Plages de scores",
      range90: "90-100%: Excellent - Conformité de sécurité de premier ordre",
      range70: "70-89%: Bon - Dossier de sécurité solide",
      range50: "50-69%: À améliorer - Marge d'amélioration",
      range0: "0-49%: Critique - Attention immédiate requise",
    },
    es: {
      pageTitle: "Calificación de Seguridad Personal",
      pageDescription: "Rastree su cumplimiento de seguridad y posición profesional",
      searchPlaceholder: "Pregunta lo que sea...",
      overallRating: "Puntuación PSR General",
      components: "Componentes de Calificación",
      safetyDocs: "Documentos de Seguridad",
      safetyDocsDesc: "Inspecciones de arnés personales (últimos 30 días)",
      certifications: "Certificaciones",
      certificationsDesc: "Nivel IRATA/SPRAT y estado de verificación",
      quizzes: "Cuestionarios de Seguridad",
      quizzesDesc: "Finalización y puntuaciones de cuestionarios",
      workHistory: "Historial de Trabajo",
      workHistoryDesc: "Proyectos completados e incidentes",
      excellent: "Excelente",
      good: "Bueno",
      needsWork: "Necesita Mejora",
      critical: "Crítico",
      notApplicable: "N/A",
      tips: "Consejos para Mejorar",
      tip1: "Complete inspecciones de arnés cada día de trabajo",
      tip2: "Mantenga sus certificaciones actualizadas y verificadas",
      tip3: "Tome cuestionarios de práctica para refrescar conocimientos",
      tip4: "Mantenga un registro limpio en todos los sitios",
      noData: "Sin datos aún",
      loading: "Cargando su calificación de seguridad...",
      unlinkedNote: "El historial de trabajo solo se rastrea cuando está vinculado a un empleador",
      verified: "Verificado",
      unverified: "No verificado",
      expired: "Vencido",
      inspections: "inspecciones",
      quizzesPassed: "cuestionarios aprobados",
      sessions: "sesiones de trabajo",
      incidents: "incidentes",
      // Documentation section
      aboutPSR: "Entendiendo tu PSR",
      whatIsPSR: "Que es el PSR?",
      whatIsPSRDesc: "Tu Calificacion de Seguridad Personal (PSR) es una puntuacion integral que refleja tu compromiso con la seguridad en el trabajo de acceso con cuerdas. Combina tus certificaciones, inspecciones de equipo, conocimientos de seguridad e historial de trabajo en un porcentaje facil de entender.",
      whyPSRMatters: "Por que importa tu PSR",
      whyPSRMattersDesc: "Un PSR alto demuestra tu profesionalismo a los empleadores. Las empresas que revisan perfiles de tecnicos pueden ver tu calificacion de seguridad, haciendo de un PSR alto una ventaja competitiva al buscar oportunidades de trabajo.",
      howCalculated: "Como se calcula",
      calcIntro: "Tu PSR se calcula a partir de los siguientes componentes:",
      calcCert: "Certificaciones: Una certificacion IRATA/SPRAT valida y verificada obtiene la puntuacion mas alta (100%). No verificada = 75%, vencida = 25%.",
      calcDocs: "Documentos de seguridad: Basado en tus inspecciones de arnes personales de los ultimos 30 dias. Mas inspecciones aprobadas = puntuacion mas alta.",
      calcQuiz: "Cuestionarios de seguridad: Completa los 6 cuestionarios de seguridad disponibles para maximizar esta puntuacion.",
      calcWork: "Historial de trabajo: Solo aplica cuando estas vinculado a un empleador. Un registro limpio mantiene una puntuacion alta.",
      calcWeights: "Cuando no estas vinculado a un empleador, cada componente tiene un peso igual del 33%. Cuando estas vinculado, los cuatro componentes tienen un peso del 25% cada uno.",
      scoreRanges: "Rangos de puntuacion",
      range90: "90-100%: Excelente - Cumplimiento de seguridad de primer nivel",
      range70: "70-89%: Bueno - Registro de seguridad solido",
      range50: "50-69%: Necesita mejora - Margen de mejora",
      range0: "0-49%: Critico - Atencion inmediata requerida",
    }
  };

  const trans = translations[language as keyof typeof translations] || translations.en;

  const technicianNavGroups = getTechnicianNavGroups(language as 'en' | 'fr' | 'es');

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" };
    if (score >= 70) return { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" };
    if (score >= 50) return { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" };
    return { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return trans.excellent;
    if (score >= 70) return trans.good;
    if (score >= 50) return trans.needsWork;
    return trans.critical;
  };

  if (!user || psrLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          <div className="w-48 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <p className="text-sm text-slate-500">{trans.loading}</p>
        </div>
      </div>
    );
  }

  const overallScore = psrData?.overallScore ?? 0;
  const scoreColors = getScoreColor(overallScore);
  const isLinked = psrData?.isLinkedToEmployer ?? false;

  const getComponentDetails = (compId: string) => {
    if (!psrData) return "";
    const comp = psrData.components;
    
    switch (compId) {
      case "certs": {
        const c = comp.certifications.details;
        if (!c.level) return trans.noData;
        const status = c.verified ? trans.verified : c.daysUntilExpiry && c.daysUntilExpiry < 0 ? trans.expired : trans.unverified;
        return `${c.type || ''} ${c.level} - ${status}`;
      }
      case "docs": {
        const d = comp.safetyDocs.details;
        return `${d.passedRecent}/${d.last30Days} ${trans.inspections}`;
      }
      case "quizzes": {
        const q = comp.quizzes.details;
        return `${q.passedQuizTypes}/${q.totalQuizTypes} ${trans.quizzesPassed}`;
      }
      case "history": {
        const w = comp.workHistory.details;
        if (!w.isLinked) return trans.notApplicable;
        return `${w.totalSessions || 0} ${trans.sessions}, ${w.incidentCount || 0} ${trans.incidents}`;
      }
      default:
        return "";
    }
  };

  const components = [
    { 
      id: "certs", 
      label: trans.certifications, 
      desc: trans.certificationsDesc, 
      score: psrData?.components.certifications.score ?? 0, 
      icon: Award,
      weight: psrData?.components.certifications.weight ?? 0,
    },
    { 
      id: "docs", 
      label: trans.safetyDocs, 
      desc: trans.safetyDocsDesc, 
      score: psrData?.components.safetyDocs.score ?? 0, 
      icon: FileCheck,
      weight: psrData?.components.safetyDocs.weight ?? 0,
    },
    { 
      id: "quizzes", 
      label: trans.quizzes, 
      desc: trans.quizzesDesc, 
      score: psrData?.components.quizzes.score ?? 0, 
      icon: GraduationCap,
      weight: psrData?.components.quizzes.weight ?? 0,
    },
    ...(isLinked ? [{ 
      id: "history", 
      label: trans.workHistory, 
      desc: trans.workHistoryDesc, 
      score: psrData?.components.workHistory.score ?? 0, 
      icon: Clock,
      weight: psrData?.components.workHistory.weight ?? 0,
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Desktop fixed, Mobile hamburger menu */}
      <DashboardSidebar
        variant="technician"
        currentUser={user}
        activeTab="psr"
        customNavigationGroups={technicianNavGroups}
        showDashboardLink={false}
        hideSettingsButton={true}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      <div className="lg:pl-60">
        <TechnicianHeader 
          language={language as "en" | "es" | "fr"} 
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="p-4 md:p-6 space-y-6">
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

          {!isLinked && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {trans.unlinkedNote}
              </p>
            </div>
          )}

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
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-base text-slate-900 dark:text-slate-100">{comp.label}</p>
                            <Badge variant="outline" className="text-xs">
                              {comp.weight}%
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{getComponentDetails(comp.id)}</p>
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

          {/* Understanding Your PSR Documentation */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#0B64A3]" />
                {trans.aboutPSR}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* What is PSR */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-500" />
                  <h3 className="font-medium text-base text-slate-900 dark:text-slate-100">{trans.whatIsPSR}</h3>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 pl-6">
                  {trans.whatIsPSRDesc}
                </p>
              </div>

              {/* Why PSR Matters */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-500" />
                  <h3 className="font-medium text-base text-slate-900 dark:text-slate-100">{trans.whyPSRMatters}</h3>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 pl-6">
                  {trans.whyPSRMattersDesc}
                </p>
              </div>

              {/* How It's Calculated */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-slate-500" />
                  <h3 className="font-medium text-base text-slate-900 dark:text-slate-100">{trans.howCalculated}</h3>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 pl-6">
                  {trans.calcIntro}
                </p>
                <ul className="space-y-2 pl-6">
                  <li className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                    <span className="text-base text-slate-600 dark:text-slate-400">{trans.calcCert}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span className="text-base text-slate-600 dark:text-slate-400">{trans.calcDocs}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-base text-slate-600 dark:text-slate-400">{trans.calcQuiz}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-base text-slate-600 dark:text-slate-400">{trans.calcWork}</span>
                  </li>
                </ul>
                <p className="text-base text-slate-500 dark:text-slate-500 pl-6 italic">
                  {trans.calcWeights}
                </p>
              </div>

              {/* Score Ranges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-slate-500" />
                  <h3 className="font-medium text-base text-slate-900 dark:text-slate-100">{trans.scoreRanges}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                  <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 dark:bg-green-950/30">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-base text-green-700 dark:text-green-400">{trans.range90}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-base text-emerald-700 dark:text-emerald-400">{trans.range70}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-base text-amber-700 dark:text-amber-400">{trans.range50}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 dark:bg-red-950/30">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-base text-red-700 dark:text-red-400">{trans.range0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
