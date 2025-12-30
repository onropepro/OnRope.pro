import {
  Home,
  User,
  MoreHorizontal,
  Briefcase,
  Mail,
} from "lucide-react";
import type { NavGroup } from "@/components/DashboardSidebar";

type Language = 'en' | 'fr' | 'es';

export function getGroundCrewNavGroups(
  language: Language,
  pendingInvitationsCount?: number
): NavGroup[] {
  return [
    {
      id: "main",
      label: "NAVIGATION",
      items: [
        {
          id: "home",
          label: language === 'en' ? "Home" : language === 'es' ? "Inicio" : "Accueil",
          icon: Home,
          href: "/ground-crew-portal",
          isVisible: () => true,
        },
        {
          id: "profile",
          label: language === 'en' ? "Profile" : language === 'es' ? "Perfil" : "Profil",
          icon: User,
          href: "/ground-crew-portal?tab=profile",
          isVisible: () => true,
        },
        {
          id: "more",
          label: language === 'en' ? "More" : language === 'es' ? "Más" : "Plus",
          icon: MoreHorizontal,
          href: "/ground-crew-portal?tab=more",
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
          href: "/ground-crew-job-board",
          isVisible: () => true,
        },
        {
          id: "invitations",
          label: language === 'en' ? "Team Invitations" : language === 'es' ? "Invitaciones" : "Invitations",
          icon: Mail,
          href: "/ground-crew-portal?tab=invitations",
          badge: pendingInvitationsCount && pendingInvitationsCount > 0 ? pendingInvitationsCount : undefined,
          badgeType: "alert" as const,
          isVisible: () => true,
        },
      ],
    },
  ];
}
