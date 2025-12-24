import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar, type NavGroup } from "@/components/DashboardSidebar";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuizSection } from "@/components/QuizSection";
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
  Search
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import type { User } from "@shared/schema";

export default function TechnicianPracticeQuizzes() {
  const [, setLocation] = useLocation();
  const { i18n } = useTranslation();
  const language = i18n.language?.substring(0, 2) || 'en';

  const { data: userData } = useQuery<{ user: User }>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user;

  const translations = {
    en: {
      pageTitle: "Practice Quizzes",
      pageDescription: "Test your knowledge of safe work procedures, FLHA protocols, and harness inspections",
      searchPlaceholder: "Ask anything...",
    },
    fr: {
      pageTitle: "Quiz de pratique",
      pageDescription: "Testez vos connaissances sur les procédures de travail sécuritaires",
      searchPlaceholder: "Demandez n'importe quoi...",
    },
    es: {
      pageTitle: "Cuestionarios de Practica",
      pageDescription: "Pruebe sus conocimientos sobre procedimientos de trabajo seguro",
      searchPlaceholder: "Pregunta lo que sea...",
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
          label: language === 'en' ? "Practice Quizzes" : language === 'es' ? "Cuestionarios" : "Quiz de pratique",
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar
        currentUser={user as any}
        activeTab="practice-quizzes"
        onTabChange={() => {}}
        variant="technician"
        customNavigationGroups={technicianNavGroups}
        showDashboardLink={false}
      />

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-14 flex items-center justify-between px-4 gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder={trans.searchPlaceholder}
                className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                data-testid="input-header-search"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageDropdown />
            <Avatar 
              className="h-8 w-8 cursor-pointer border-2"
              style={{ borderColor: '#AB4521' }}
              onClick={() => setLocation("/technician-portal?tab=profile")}
              data-testid="avatar-header-profile"
            >
              {user.profilePhotoUrl ? (
                <AvatarImage src={user.profilePhotoUrl} alt={user.name || ""} />
              ) : (
                <AvatarFallback 
                  className="text-white text-xs font-medium"
                  style={{ backgroundColor: '#AB4521' }}
                >
                  {user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
              {trans.pageTitle}
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
              {trans.pageDescription}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <QuizSection />
          </div>
        </main>
      </div>
    </div>
  );
}
