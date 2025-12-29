import {
  Home,
  User,
  MoreHorizontal,
  Briefcase,
  Eye,
  Mail,
  Clock,
  Shield,
  Award,
  GraduationCap,
  FileText,
  ClipboardList,
} from "lucide-react";
import type { NavGroup } from "@/components/DashboardSidebar";

type Language = 'en' | 'fr' | 'es';

export interface TechnicianNavOptions {
  pendingInvitationsCount?: number;
  unreadFeedbackCount?: number;
}

export function getTechnicianNavGroups(
  language: Language,
  options?: TechnicianNavOptions
): NavGroup[] {
  const { pendingInvitationsCount = 0, unreadFeedbackCount = 0 } = options || {};
  
  return [
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
          icon: User,
          href: "/technician-portal?tab=profile",
          isVisible: () => true,
        },
        {
          id: "more",
          label: language === 'en' ? "More" : language === 'es' ? "Más" : "Plus",
          icon: MoreHorizontal,
          href: "/technician-portal?tab=more",
          badge: unreadFeedbackCount > 0 ? unreadFeedbackCount : undefined,
          badgeType: "info" as const,
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
          id: "applications",
          label: language === 'en' ? "Applications & Offers" : language === 'es' ? "Solicitudes y Ofertas" : "Candidatures et Offres",
          icon: ClipboardList,
          href: "/technician-applications",
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
          badge: pendingInvitationsCount > 0 ? pendingInvitationsCount : undefined,
          badgeType: "alert" as const,
          isVisible: () => true,
        },
        {
          id: "resume",
          label: language === 'en' ? "Resume / CV" : language === 'es' ? "Currículum" : "CV",
          icon: FileText,
          href: "/technician-resume",
          isVisible: () => true,
        },
      ],
    },
    {
      id: "logging",
      label: language === 'en' ? "LOGGING" : language === 'es' ? "REGISTRO" : "JOURNALISATION",
      items: [
        {
          id: "logged-hours",
          label: language === 'en' ? "My Logged Hours" : language === 'es' ? "Mis Horas Registradas" : "Mes heures enregistrées",
          icon: Clock,
          href: "/technician-logged-hours",
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
          label: language === 'en' ? "Safety Rating (PSR)" : language === 'es' ? "Calificación (PSR)" : "Cote de sécurité (PSR)",
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
}
