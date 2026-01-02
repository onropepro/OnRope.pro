import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Building2,
  Users,
  Calendar,
  Clock,
  Shield,
  FileText,
  Briefcase,
  Wallet,
  FileCheck,
  Package,
  LayoutDashboard,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Award,
  Wrench,
  ClipboardCheck,
  Menu,
  X,
  Building,
  Cloud,
  SlidersHorizontal,
  User as UserIcon,
  Mail,
  BarChart3,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { User } from "@/lib/permissions";
import {
  hasFinancialAccess,
  canManageEmployees,
  canAccessQuotes,
  hasPermission,
  canViewPerformance,
} from "@/lib/permissions";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import { SidebarCustomizeDialog } from "./SidebarCustomizeDialog";
import { useTechnicianContext } from "@/hooks/use-technician-context";
import { CarabinerIcon } from "./icons/CarabinerIcon";

interface SidebarPreferencesResponse {
  preferences: Record<string, { itemId: string; position: number }[]>;
  variant: string;
  isDefault: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  badge?: number;
  badgeType?: "alert" | "info";
  useProfilePhoto?: boolean;
  isVisible: (user: User | null | undefined) => boolean;
  requiresPlus?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export type DashboardVariant = "employer" | "technician" | "property-manager" | "resident" | "building-manager" | "ground-crew";

export const STAKEHOLDER_COLORS: Record<DashboardVariant, string> = {
  employer: "#0B64A3",
  technician: "#5C7A84",
  "property-manager": "#6E9075",
  resident: "#86A59C",
  "building-manager": "#B89685",
  "ground-crew": "#5D7B6F",
};

export interface DashboardSidebarProps {
  currentUser: User | null | undefined;
  activeTab: string;
  onTabChange: (tab: string) => void;
  brandingLogoUrl?: string | null;
  whitelabelBrandingActive?: boolean;
  companyName?: string;
  employeeCount?: number;
  alertCounts?: {
    expiringCerts?: number;
    overdueInspections?: number;
    pendingTimesheets?: number;
    unsignedDocs?: number;
    jobApplications?: number;
    quoteNotifications?: number;
  };
  variant?: DashboardVariant;
  customNavigationGroups?: NavGroup[];
  customBrandColor?: string;
  showDashboardLink?: boolean;
  dashboardLinkLabel?: string;
  headerContent?: React.ReactNode;
  /** External control for mobile sidebar open state */
  mobileOpen?: boolean;
  /** Callback when mobile sidebar open state changes */
  onMobileOpenChange?: (open: boolean) => void;
  /** External control for desktop sidebar collapsed state */
  desktopCollapsed?: boolean;
  /** Callback when desktop sidebar collapsed state changes */
  onDesktopCollapsedChange?: (collapsed: boolean) => void;
}

export function DashboardSidebar({
  currentUser,
  activeTab,
  onTabChange,
  brandingLogoUrl,
  whitelabelBrandingActive = false,
  companyName,
  employeeCount = 0,
  alertCounts = {},
  variant = "employer",
  customNavigationGroups,
  customBrandColor,
  showDashboardLink = true,
  dashboardLinkLabel,
  headerContent,
  mobileOpen,
  onMobileOpenChange,
  desktopCollapsed,
  onDesktopCollapsedChange,
}: DashboardSidebarProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [internalOpen, setInternalOpen] = useState(false);
  const [customizeDialogOpen, setCustomizeDialogOpen] = useState(false);
  const [internalDesktopCollapsed, setInternalDesktopCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem('sidebar-desktop-collapsed');
      return stored === 'true';
    } catch {
      return false;
    }
  });
  
  // Use external control if provided, otherwise use internal state for desktop collapsed
  const isDesktopCollapsed = desktopCollapsed !== undefined ? desktopCollapsed : internalDesktopCollapsed;
  const setDesktopCollapsed = (collapsed: boolean) => {
    if (onDesktopCollapsedChange) {
      onDesktopCollapsedChange(collapsed);
    } else {
      setInternalDesktopCollapsed(collapsed);
      try {
        localStorage.setItem('sidebar-desktop-collapsed', String(collapsed));
      } catch {
        // Ignore storage errors
      }
    }
  };
  
  // Technician context for checking active employer connections
  const technicianContext = useTechnicianContext();
  const hasActiveEmployerConnection = variant === "technician" && technicianContext.activeConnectionsCount > 0;
  
  // Collapsible group state - tracks which groups are expanded
  // Initialize with empty Set, will be populated by effect based on variant
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  
  // Track variant to detect changes and reload state
  const [loadedVariant, setLoadedVariant] = useState<string | null>(null);

  // Load collapsed state from localStorage when variant changes
  // Version 2: Reset to new defaults (only OPERATIONS open for employer)
  useEffect(() => {
    if (loadedVariant === variant) return;
    
    try {
      const storageKey = `sidebar-collapsed-v2-${variant}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setCollapsedGroups(new Set(JSON.parse(stored)));
      } else {
        // Default state: For employer variant, collapse all groups except "operations"
        if (variant === 'employer') {
          setCollapsedGroups(new Set(['team', 'equipment', 'safety', 'financial', 'analytics']));
        } else {
          setCollapsedGroups(new Set()); // All groups expanded by default for other variants
        }
      }
    } catch {
      setCollapsedGroups(new Set());
    }
    setLoadedVariant(variant);
  }, [variant, loadedVariant]);

  // Persist collapsed state to localStorage (only after initial load)
  useEffect(() => {
    if (loadedVariant !== variant) return; // Don't persist until we've loaded for this variant
    
    try {
      const storageKey = `sidebar-collapsed-v2-${variant}`;
      localStorage.setItem(storageKey, JSON.stringify(Array.from(collapsedGroups)));
    } catch {
      // Ignore storage errors
    }
  }, [collapsedGroups, variant, loadedVariant]);

  // Toggle group collapse state
  const toggleGroupCollapse = useCallback((groupId: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);
  
  // Use external control if provided, otherwise use internal state
  const isOpen = mobileOpen !== undefined ? mobileOpen : internalOpen;
  const setIsOpen = (open: boolean) => {
    if (onMobileOpenChange) {
      onMobileOpenChange(open);
    } else {
      setInternalOpen(open);
    }
  };

  // Fetch sidebar preferences for ordering
  const { data: sidebarPreferences } = useQuery<SidebarPreferencesResponse>({
    queryKey: ["/api/sidebar/preferences", variant],
    queryFn: async () => {
      const response = await fetch(`/api/sidebar/preferences?variant=${variant}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sidebar preferences");
      }
      return response.json();
    },
    enabled: !!currentUser,
    retry: false,
  });

  // Fetch pending invitations for technicians and ground crew
  const { data: invitationsData } = useQuery<{ invitations: any[] }>({
    queryKey: ["/api/my-invitations"],
    enabled: !!currentUser && (
      currentUser.role === 'rope_access_tech' || 
      currentUser.role === 'ground_crew' || 
      currentUser.role === 'ground_crew_supervisor'
    ),
    refetchInterval: 60000, // Refresh every minute
  });
  
  const pendingInvitationsCount = invitationsData?.invitations?.length || 0;

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location, activeTab]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Get company initials for avatar
  const getInitials = (name: string | undefined): string => {
    if (!name) return "CO";
    const words = name.split(" ").filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navigationGroups: NavGroup[] = [
    {
      id: "operations",
      label: t("dashboard.categories.operations", "OPERATIONS"),
      items: [
        {
          id: "projects",
          label: t("dashboard.cards.projects.label", "Projects"),
          icon: Building2,
          onClick: () => onTabChange("projects"),
          isVisible: () => true,
        },
        {
          id: "schedule",
          label: t("dashboard.cards.schedule.label", "Schedule"),
          icon: Calendar,
          href: "/schedule",
          isVisible: () => true,
        },
        {
          id: "weather",
          label: t("dashboard.sidebar.weather", "Weather"),
          icon: Cloud,
          href: "/weather",
          isVisible: () => true,
        },
        {
          id: "timesheets",
          label: t("dashboard.sidebar.offSite", "Off-Site"),
          icon: Clock,
          href: "/non-billable-hours",
          badge: alertCounts.pendingTimesheets,
          badgeType: alertCounts.pendingTimesheets ? "alert" : undefined,
          isVisible: () => true,
        },
      ],
    },
    {
      id: "team",
      label: t("dashboard.categories.team", "TEAM"),
      items: [
        {
          id: "employees",
          label: t("dashboard.cards.employees.label", "Employees"),
          icon: Users,
          onClick: () => onTabChange("employees"),
          badge: alertCounts.expiringCerts,
          badgeType: alertCounts.expiringCerts ? "alert" : undefined,
          isVisible: (user) => canManageEmployees(user),
        },
        {
          id: "certifications",
          label: t("dashboard.sidebar.certifications", "Certifications"),
          icon: Award,
          href: "/dashboard",
          onClick: () => onTabChange("employees"),
          isVisible: (user) => canManageEmployees(user),
        },
        {
          id: "job-board",
          label: t("dashboard.cards.jobBoard.label", "Job Board"),
          icon: Briefcase,
          href: "/job-board",
          badge: alertCounts.jobApplications,
          badgeType: alertCounts.jobApplications ? "info" : undefined,
          isVisible: (user) => user?.role === "company",
        },
      ],
    },
    {
      id: "equipment",
      label: t("dashboard.sidebar.equipment", "EQUIPMENT"),
      items: [
        {
          id: "inventory",
          label: t("dashboard.cards.inventory.label", "Inventory"),
          icon: Package,
          href: "/inventory",
          isVisible: () => true,
        },
        {
          id: "inspections",
          label: t("dashboard.sidebar.inspections", "Inspections"),
          icon: ClipboardCheck,
          href: "/inventory",
          badge: alertCounts.overdueInspections,
          badgeType: alertCounts.overdueInspections ? "alert" : undefined,
          isVisible: () => true,
        },
        {
          id: "gear-management",
          label: t("dashboard.sidebar.gearManagement", "Gear Management"),
          icon: Wrench,
          href: "/inventory",
          isVisible: () => true,
        },
      ],
    },
    {
      id: "safety",
      label: t("dashboard.categories.safety", "SAFETY"),
      items: [
        {
          id: "safety-forms",
          label: t("dashboard.cards.safetyForms.label", "Safety Forms"),
          icon: Shield,
          href: "/safety-forms",
          badge: alertCounts.unsignedDocs,
          badgeType: alertCounts.unsignedDocs ? "alert" : undefined,
          isVisible: () => true,
        },
        {
          id: "documents",
          label: t("dashboard.cards.documents.label", "Documents"),
          icon: FileText,
          href: "/documents",
          isVisible: () => true,
        },
        {
          id: "training",
          label: t("dashboard.sidebar.training", "Training"),
          icon: Award,
          href: "/help",
          isVisible: () => true,
        },
      ],
    },
    {
      id: "financial",
      label: t("dashboard.categories.financialClients", "FINANCIAL/CLIENTS"),
      items: [
        {
          id: "payroll",
          label: t("dashboard.cards.payroll.label", "Payroll"),
          icon: Wallet,
          href: "/payroll",
          isVisible: (user) => hasFinancialAccess(user),
        },
        {
          id: "quotes",
          label: t("dashboard.cards.quotes.label", "Quotes"),
          icon: FileCheck,
          href: "/quotes",
          badge: alertCounts.quoteNotifications,
          badgeType: alertCounts.quoteNotifications ? "alert" : undefined,
          isVisible: (user) => canAccessQuotes(user) || hasFinancialAccess(user),
        },
        {
          id: "clients",
          label: t("dashboard.cards.clients.label", "Clients"),
          icon: Building,
          href: "/dashboard?tab=clients",
          isVisible: (user) => hasPermission(user, 'view_clients'),
        },
      ],
    },
    {
      id: "analytics",
      label: t("dashboard.categories.analytics", "ANALYTICS"),
      items: [
        {
          id: "performance",
          label: t("dashboard.sidebar.performance", "Performance"),
          icon: BarChart3,
          href: "/performance",
          isVisible: (user) => canViewPerformance(user),
        },
      ],
    },
  ];

  const isActiveItem = (item: NavItem): boolean => {
    if (item.href) {
      return location === item.href;
    }
    if (item.id === "dashboard") {
      return activeTab === "home" || activeTab === "" || !activeTab;
    }
    return activeTab === item.id || 
           (item.id === "feedback" && activeTab === "complaints");
  };

  const handleItemClick = (item: NavItem) => {
    // Call onClick first if provided (e.g., tab changes)
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      // Navigate if href is provided
      setLocation(item.href);
    } else {
      // Default: call onTabChange with item.id for tab-based navigation
      onTabChange(item.id);
    }
    // Close mobile sidebar after navigation
    setIsOpen(false);
  };

  // Use custom navigation groups if provided, otherwise use default employer groups
  const activeNavigationGroups = customNavigationGroups || navigationGroups;
  
  // Apply custom ordering from preferences
  const filteredGroups = useMemo(() => {
    const groups = activeNavigationGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.isVisible(currentUser)),
      }))
      .filter((group) => group.items.length > 0);

    // If we have saved preferences, apply the custom ordering (with defensive guards)
    if (sidebarPreferences && !sidebarPreferences.isDefault && sidebarPreferences.preferences) {
      return groups.map((group) => {
        const savedOrder = sidebarPreferences.preferences[group.id];
        if (!savedOrder || !Array.isArray(savedOrder) || savedOrder.length === 0) return group;

        // Create a map of items for quick lookup
        const itemMap = new Map(group.items.map((item) => [item.id, item]));
        const orderedItems: NavItem[] = [];

        // First add items in saved order
        savedOrder
          .sort((a, b) => a.position - b.position)
          .forEach(({ itemId }) => {
            const item = itemMap.get(itemId);
            if (item) {
              orderedItems.push(item);
              itemMap.delete(itemId);
            }
          });

        // Add any remaining items that weren't in saved preferences
        itemMap.forEach((item) => orderedItems.push(item));

        return { ...group, items: orderedItems };
      });
    }

    return groups;
  }, [activeNavigationGroups, currentUser, sidebarPreferences]);

  const displayCompanyName = companyName || "My Company";
  const isDashboardActive = activeTab === "home" || activeTab === "" || !activeTab;
  // Work dashboard variants that should show "Work Dashboard" instead of "Dashboard"
  const workDashboardVariants: DashboardVariant[] = ["employer", "building-manager", "property-manager"];
  const isWorkDashboard = workDashboardVariants.includes(variant);
  const resolvedDashboardLabel = dashboardLinkLabel || (isWorkDashboard 
    ? t("dashboard.sidebar.workDashboard", "Work Dashboard")
    : t("dashboard.sidebar.dashboard", "Dashboard"));

  const sidebarContent = (
    <>
      {/* Logo Header - h-14 (56px) */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        {!isDesktopCollapsed && (
          <>
            {whitelabelBrandingActive && brandingLogoUrl ? (
              <img
                src={brandingLogoUrl}
                alt="Company Logo"
                className="h-8 w-auto max-w-[140px] object-contain"
                data-testid="img-sidebar-logo"
              />
            ) : (
              <div className="flex items-center justify-center" data-testid="sidebar-default-logo">
                <img
                  src={onRopeProLogo}
                  alt="OnRopePro"
                  className="h-10 w-auto object-contain"
                />
              </div>
            )}
          </>
        )}
        {/* Sidebar toggle button - desktop only */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "hidden lg:flex shrink-0",
            isDesktopCollapsed && "mx-auto"
          )}
          onClick={() => setDesktopCollapsed(!isDesktopCollapsed)}
          title={isDesktopCollapsed ? t("dashboard.sidebar.showSidebar", "Show Sidebar") : t("dashboard.sidebar.hideSidebar", "Hide Sidebar")}
          data-testid="button-sidebar-toggle-desktop"
        >
          {isDesktopCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={() => setIsOpen(false)}
          data-testid="button-sidebar-close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>


      {/* Content hidden when desktop sidebar is collapsed */}
      {!isDesktopCollapsed && (
        <>
          {/* Optional Header Content (e.g., user info card) */}
          {headerContent && (
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
              {headerContent}
            </div>
          )}

          {/* Dashboard Primary Link */}
          {showDashboardLink && (
            <div className="px-3 pb-2">
              <button
                onClick={() => { onTabChange("home"); setIsOpen(false); }}
                data-testid="sidebar-nav-dashboard"
                className={cn(
                  "w-full flex items-center gap-2.5 py-1.5 px-3 rounded-md text-sm font-medium transition-colors",
                  isDashboardActive 
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                )}
              >
                {variant === "technician" && (currentUser as any)?.photoUrl ? (
                  <Avatar className="h-4 w-4 shrink-0">
                    <AvatarImage src={(currentUser as any).photoUrl} alt={(currentUser as any).name || "Profile"} />
                    <AvatarFallback className="text-[8px]">
                      {((currentUser as any).name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <CarabinerIcon className="h-4 w-4 shrink-0" />
                )}
                <span>{resolvedDashboardLabel}</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Navigation Groups and Footer - hidden when desktop collapsed */}
      {!isDesktopCollapsed && (
        <>
          {/* Navigation Groups - Scrollable */}
          <nav className="flex-1 overflow-y-auto px-3 py-1">
            {filteredGroups.map((group) => {
              const isCollapsed = collapsedGroups.has(group.id);
              
              return (
                <Collapsible
                  key={group.id}
                  open={!isCollapsed}
                  onOpenChange={() => toggleGroupCollapse(group.id)}
                  className="mb-3"
                >
                  {/* Group Header with Toggle */}
                  <CollapsibleTrigger
                    className="w-full flex items-center justify-between px-3 py-1.5 group"
                    data-testid={`sidebar-group-toggle-${group.id}`}
                  >
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {group.label}
                    </span>
                    <ChevronDown 
                      className={cn(
                        "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                        isCollapsed && "-rotate-90"
                      )}
                    />
                  </CollapsibleTrigger>
                  
                  {/* Group Items - Collapsible */}
                  <CollapsibleContent>
                    <div className="space-y-0.5 pt-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = isActiveItem(item);

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            data-testid={`sidebar-nav-${item.id}`}
                            className={cn(
                              "w-full flex items-center gap-2.5 py-1.5 px-3 rounded-md text-sm font-medium transition-colors",
                              isActive 
                                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            )}
                          >
                            {item.useProfilePhoto && (currentUser as any)?.photoUrl ? (
                              <Avatar className="h-4 w-4 shrink-0">
                                <AvatarImage src={(currentUser as any).photoUrl} alt={(currentUser as any).name || "Profile"} />
                                <AvatarFallback className="text-[8px]">
                                  {((currentUser as any).name || "U").charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <Icon className="h-4 w-4 shrink-0" />
                            )}
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span
                                className={cn(
                                  "flex items-center justify-center rounded-full text-sm font-medium h-5 min-w-5 px-1.5",
                                  item.badgeType === "alert" 
                                    ? "bg-rose-500 text-white"
                                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                )}
                                data-testid={`badge-${item.id}-count`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {item.requiresPlus && (
                              <span
                                className="flex items-center justify-center rounded-full text-[10px] font-semibold h-4 px-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50"
                                data-testid={`badge-${item.id}-plus-required`}
                              >
                                PLUS
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </nav>

          {/* Footer - Settings and Help */}
          <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-3">
            <div className="space-y-0.5">
              {/* Go to My Passport - shown in Work Dashboard for technicians */}
              {variant !== "technician" && (currentUser?.role === 'rope_access_tech' || currentUser?.role === 'ground_crew') && (
                <button
                  onClick={() => { setLocation("/technician-portal"); setIsOpen(false); }}
                  data-testid="sidebar-nav-my-passport"
                  className="w-full flex items-center gap-2.5 py-1.5 px-3 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <UserIcon className="h-4 w-4 shrink-0" />
                  <span>{t("dashboard.sidebar.myPassport", "Go to My Passport")}</span>
                </button>
              )}
              {/* Settings button - hidden for technician variant (they have Profile in main nav) */}
              {variant !== "technician" && (
                <button
                  onClick={() => { setLocation("/profile"); setIsOpen(false); }}
                  data-testid="sidebar-nav-settings"
                  className="w-full flex items-center gap-2.5 py-1.5 px-3 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>{t("dashboard.sidebar.settings", "Settings")}</span>
                </button>
              )}
              {/* Go to Work Dashboard - shown only for technicians with active company connections */}
              {hasActiveEmployerConnection && (
                <button
                  onClick={() => { setLocation("/dashboard"); setIsOpen(false); }}
                  data-testid="sidebar-nav-work-dashboard"
                  className="w-full flex items-center gap-2.5 py-1.5 px-3 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <CarabinerIcon className="h-4 w-4 shrink-0" />
                  <span>{t("dashboard.sidebar.workDashboard", "Go to Work Dashboard")}</span>
                </button>
              )}
              <button
                onClick={() => { setLocation("/help"); setIsOpen(false); }}
                data-testid="sidebar-nav-help"
                className="w-full flex items-center gap-2.5 py-1.5 px-3 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <HelpCircle className="h-4 w-4 shrink-0" />
                <span>{t("dashboard.sidebar.help", "Help Center")}</span>
              </button>
              {/* Customize Sidebar button */}
              <button
                onClick={() => setCustomizeDialogOpen(true)}
                data-testid="sidebar-nav-customize"
                className="w-full flex items-center gap-2.5 py-1.5 px-3 rounded-md text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4 shrink-0" />
                <span>{t("dashboard.sidebar.customize", "Customize")}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button - visible only on small screens, hidden when external control is used */}
      {!onMobileOpenChange && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-3 left-3 z-30 lg:hidden"
          onClick={() => setIsOpen(true)}
          data-testid="button-sidebar-toggle"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
          onClick={() => setIsOpen(false)}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <aside 
        className={cn(
          "fixed h-full left-0 top-0 z-[95] bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-700/80 flex flex-col transition-all duration-200",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isDesktopCollapsed ? "lg:w-14 w-60" : "w-60"
        )}
        data-testid="dashboard-sidebar"
        data-collapsed={isDesktopCollapsed}
      >
        {sidebarContent}
      </aside>

      {/* Sidebar Customization Dialog */}
      <SidebarCustomizeDialog
        open={customizeDialogOpen}
        onOpenChange={setCustomizeDialogOpen}
        variant={variant}
        navigationGroups={activeNavigationGroups}
        currentUser={currentUser}
      />
    </>
  );
}
