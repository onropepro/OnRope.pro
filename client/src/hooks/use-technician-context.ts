import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type TechnicianState = "solo" | "referral_plus" | "linked_company";

export interface TechnicianUser {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string | null;
  companyName: string | null;
  terminatedDate: string | null;
  hasPlusAccess: boolean;
  referralCode: string | null;
  irataLevel: number | null;
  irataExpiryDate: string | null;
  spratLevel: number | null;
  spratExpiryDate: string | null;
  photoUrl: string | null;
  employeePhoneNumber: string | null;
  employeeStreetAddress: string | null;
  employeeCity: string | null;
  employeeProvinceState: string | null;
  employeeCountry: string | null;
  employeePostalCode: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;
  ropeAccessStartDate: string | null;
  ropeAccessSpecialties: string[] | null;
  irataBaselineHours: string | null;
  isVisibleToEmployers: boolean | null;
  [key: string]: unknown;
}

export interface EmployerConnection {
  id: string;
  companyId: string;
  isPrimary: boolean;
  status: string;
  connectedAt: Date | string;
  company: {
    id: string;
    name: string;
    companyName: string | null;
    photoUrl: string | null;
  } | null;
}

export interface TechnicianInvitation {
  id: string;
  message: string | null;
  createdAt: string;
  company: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TechnicianContextValue {
  user: TechnicianUser | null;
  isLoading: boolean;
  isTechnician: boolean;
  state: TechnicianState;
  isLinked: boolean;
  hasPlusAccess: boolean;
  canAccessMultipleEmployers: boolean;
  invitations: TechnicianInvitation[];
  pendingInvitationsCount: number;
  employerConnections: EmployerConnection[];
  activeConnectionsCount: number;
  hasMultipleEmployers: boolean;
  loggedHours: number;
  referralCount: number;
  permissions: TechnicianPermissions;
}

export interface TechnicianPermissions {
  canViewWorkDashboard: boolean;
  canAccessJobBoard: boolean;
  canManageVisibility: boolean;
  canViewInvitations: boolean;
  canUploadDocuments: boolean;
  canViewPSR: boolean;
  canTakeQuizzes: boolean;
  canConnectToMultipleEmployers: boolean;
}

function determineTechnicianState(user: TechnicianUser | null): TechnicianState {
  if (!user) return "solo";
  
  const isLinkedToCompany = !!user.companyId && !user.terminatedDate;
  
  if (isLinkedToCompany) {
    return "linked_company";
  }
  
  if (user.hasPlusAccess) {
    return "referral_plus";
  }
  
  return "solo";
}

function getPermissions(state: TechnicianState, user: TechnicianUser | null): TechnicianPermissions {
  const basePermissions: TechnicianPermissions = {
    canViewWorkDashboard: false,
    canAccessJobBoard: true,
    canManageVisibility: true,
    canViewInvitations: true,
    canUploadDocuments: true,
    canViewPSR: true,
    canTakeQuizzes: true,
    canConnectToMultipleEmployers: false,
  };

  switch (state) {
    case "solo":
      return {
        ...basePermissions,
        canViewWorkDashboard: false,
        canConnectToMultipleEmployers: false,
      };
    
    case "referral_plus":
      return {
        ...basePermissions,
        canViewWorkDashboard: false,
        canConnectToMultipleEmployers: true,
      };
    
    case "linked_company":
      return {
        ...basePermissions,
        canViewWorkDashboard: true,
        canConnectToMultipleEmployers: user?.hasPlusAccess ?? false,
      };
    
    default:
      return basePermissions;
  }
}

export function useTechnicianContext(): TechnicianContextValue {
  const { data: userData, isLoading: userLoading } = useQuery<{ user: TechnicianUser }>({
    queryKey: ["/api/user"],
  });

  const user = userData?.user ?? null;
  const isTechnician = user?.role === "rope_access_tech" || user?.role === "company";

  const state = useMemo(() => determineTechnicianState(user), [user]);
  const isLinked = state === "linked_company";
  const hasPlusAccess = user?.hasPlusAccess ?? false;

  const { data: invitationsData } = useQuery<{
    invitations: TechnicianInvitation[];
  }>({
    queryKey: ["/api/my-invitations"],
    enabled: !!user && user.role === "rope_access_tech" && 
             (!user.companyId || !!user.terminatedDate || !!user.hasPlusAccess),
  });

  const { data: employerConnectionsData } = useQuery<{
    connections: EmployerConnection[];
    hasPlusAccess: boolean;
    canAddMore: boolean;
  }>({
    queryKey: ["/api/my-employer-connections"],
    enabled: !!user && user.role === "rope_access_tech",
  });

  const { data: loggedHoursData } = useQuery<{ logs: Array<{ hoursWorked: string }> }>({
    queryKey: ["/api/my-irata-task-logs"],
    enabled: !!user && (user.role === "rope_access_tech" || user.role === "company"),
  });

  const { data: referralCountData } = useQuery<{ count: number }>({
    queryKey: ["/api/my-referral-count"],
    enabled: !!user && (user.role === "rope_access_tech" || user.role === "company"),
  });

  const invitations = invitationsData?.invitations ?? [];
  const employerConnections = employerConnectionsData?.connections ?? [];
  const activeConnections = employerConnections.filter(
    (c) => c.status === "active" || c.status === "accepted"
  );

  const loggedHours = useMemo(() => {
    if (!loggedHoursData?.logs) return 0;
    return loggedHoursData.logs.reduce(
      (sum, log) => sum + parseFloat(log.hoursWorked || "0"),
      0
    );
  }, [loggedHoursData]);

  const permissions = useMemo(() => getPermissions(state, user), [state, user]);

  return {
    user,
    isLoading: userLoading,
    isTechnician,
    state,
    isLinked,
    hasPlusAccess,
    canAccessMultipleEmployers: hasPlusAccess,
    invitations,
    pendingInvitationsCount: invitations.length,
    employerConnections,
    activeConnectionsCount: activeConnections.length,
    hasMultipleEmployers: activeConnections.length > 1,
    loggedHours,
    referralCount: referralCountData?.count ?? 0,
    permissions,
  };
}

export function getTechnicianStateLabel(state: TechnicianState, language: "en" | "es" | "fr" = "en"): string {
  const labels: Record<TechnicianState, Record<"en" | "es" | "fr", string>> = {
    solo: {
      en: "Basic Account",
      es: "Cuenta Basica",
      fr: "Compte de base",
    },
    referral_plus: {
      en: "PLUS Member",
      es: "Miembro PLUS",
      fr: "Membre PLUS",
    },
    linked_company: {
      en: "Employed",
      es: "Empleado",
      fr: "Employe",
    },
  };

  return labels[state][language];
}

export function getTechnicianStateDescription(state: TechnicianState, language: "en" | "es" | "fr" = "en"): string {
  const descriptions: Record<TechnicianState, Record<"en" | "es" | "fr", string>> = {
    solo: {
      en: "Share with another tech to unlock PLUS features",
      es: "Comparte con otro tecnico para desbloquear funciones PLUS",
      fr: "Partagez avec un autre technicien pour debloquer les fonctionnalites PLUS",
    },
    referral_plus: {
      en: "Connect to multiple employers and access premium features",
      es: "Conectate a multiples empleadores y accede a funciones premium",
      fr: "Connectez-vous a plusieurs employeurs et accedez aux fonctionnalites premium",
    },
    linked_company: {
      en: "Access your employer's work dashboard and projects",
      es: "Accede al panel de trabajo de tu empleador y proyectos",
      fr: "Accedez au tableau de bord de travail de votre employeur et aux projets",
    },
  };

  return descriptions[state][language];
}
