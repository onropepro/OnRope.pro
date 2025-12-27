import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { TechnicianHeader } from "@/components/TechnicianHeader";
import { QuizSection } from "@/components/QuizSection";
import { useTranslation } from "react-i18next";
import type { User } from "@shared/schema";
import { getTechnicianNavGroups } from "@/lib/technicianNavigation";

export default function TechnicianPracticeQuizzes() {
  const { i18n } = useTranslation();
  const language = i18n.language?.substring(0, 2) || 'en';
  
  // Mobile sidebar state for external control
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const technicianNavGroups = getTechnicianNavGroups(language as 'en' | 'fr' | 'es');

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
      {/* Sidebar - Desktop fixed, Mobile hamburger menu */}
      <DashboardSidebar
        currentUser={user as any}
        activeTab="practice-quizzes"
        onTabChange={() => {}}
        variant="technician"
        customNavigationGroups={technicianNavGroups}
        showDashboardLink={false}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />

      <div className="lg:pl-60">
        <TechnicianHeader 
          language={language as "en" | "es" | "fr"} 
          onMobileMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="p-4 md:p-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <QuizSection />
          </div>
        </main>
      </div>
    </div>
  );
}
