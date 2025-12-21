import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Building2,
  Users,
  BarChart3,
  Calendar,
  Clock,
  Shield,
  FileText,
  MessageSquare,
  Briefcase,
  Wallet,
  FileCheck,
  Package,
  ClipboardList,
  LayoutDashboard,
  Settings,
  HelpCircle,
  ChevronRight,
  Award,
  Wrench,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { User } from "@/lib/permissions";
import {
  isManagement,
  hasFinancialAccess,
  canManageEmployees,
  canViewPerformance,
  hasPermission,
} from "@/lib/permissions";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  badge?: number;
  badgeVariant?: "default" | "destructive" | "outline" | "secondary";
  isVisible: (user: User | null | undefined) => boolean;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
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
  };
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
}: DashboardSidebarProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();

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
          id: "timesheets",
          label: t("dashboard.sidebar.timesheets", "Timesheets"),
          icon: Clock,
          href: "/non-billable-hours",
          badge: alertCounts.pendingTimesheets,
          badgeVariant: alertCounts.pendingTimesheets ? "destructive" : undefined,
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
          badgeVariant: alertCounts.expiringCerts ? "destructive" : undefined,
          isVisible: (user) => canManageEmployees(user),
        },
        {
          id: "certifications",
          label: t("dashboard.sidebar.certifications", "Certifications"),
          icon: Award,
          onClick: () => onTabChange("employees"),
          isVisible: (user) => canManageEmployees(user),
        },
        {
          id: "job-board",
          label: t("dashboard.cards.jobBoard.label", "Job Board"),
          icon: Briefcase,
          href: "/job-board",
          badge: alertCounts.jobApplications,
          badgeVariant: alertCounts.jobApplications ? "secondary" : undefined,
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
          badgeVariant: alertCounts.overdueInspections ? "destructive" : undefined,
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
          badgeVariant: alertCounts.unsignedDocs ? "destructive" : undefined,
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
      label: t("dashboard.categories.financial", "FINANCIAL"),
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
          isVisible: (user) => hasFinancialAccess(user),
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
    if (item.href) {
      setLocation(item.href);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  const filteredGroups = navigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.isVisible(currentUser)),
    }))
    .filter((group) => group.items.length > 0);

  const displayCompanyName = companyName || "My Company";

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r bg-white dark:bg-sidebar"
    >
      {/* Logo Header */}
      <SidebarHeader className="px-5 py-4">
        <div className="flex items-center gap-2.5">
          {whitelabelBrandingActive && brandingLogoUrl ? (
            <img
              src={brandingLogoUrl}
              alt="Company Logo"
              className="h-8 w-auto max-w-[160px] object-contain"
              data-testid="img-sidebar-logo"
            />
          ) : (
            <div className="flex items-center gap-2.5" data-testid="sidebar-default-logo">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--sidebar-primary))] text-white font-semibold text-sm">
                OR
              </div>
              <span className="font-semibold text-base text-foreground group-data-[collapsible=icon]:hidden">
                OnRopePro
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Company Selector Card */}
      <div className="px-4 pb-3 group-data-[collapsible=icon]:hidden">
        <button
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          data-testid="button-company-selector"
        >
          <Avatar className="h-9 w-9 rounded-md">
            <AvatarFallback className="rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium">
              {getInitials(displayCompanyName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left min-w-0">
            <div className="font-medium text-sm text-foreground truncate">
              {displayCompanyName}
            </div>
            <div className="text-xs text-muted-foreground">
              {employeeCount} {employeeCount === 1 ? 'employee' : 'employees'}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      </div>

      {/* Dashboard Item - Always Visible */}
      <div className="px-3 pb-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onTabChange("home")}
              isActive={activeTab === "home" || activeTab === "" || !activeTab}
              tooltip={t("dashboard.sidebar.dashboard", "Dashboard")}
              data-testid="sidebar-nav-dashboard"
              className={cn(
                "w-full justify-start gap-3 py-2.5 px-3.5 rounded-lg font-medium",
                (activeTab === "home" || activeTab === "" || !activeTab) && 
                  "bg-[hsl(var(--sidebar-primary))] text-white hover:bg-[hsl(var(--sidebar-primary))]/90"
              )}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                {t("dashboard.sidebar.dashboard", "Dashboard")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      <SidebarContent className="px-3 pt-2">
        {filteredGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.id} className="py-2">
            <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-[0.15em] px-3.5 pb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveItem(item);

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => handleItemClick(item)}
                        isActive={isActive}
                        tooltip={item.label}
                        data-testid={`sidebar-nav-${item.id}`}
                        className={cn(
                          "w-full justify-start gap-3 py-2.5 px-3.5 rounded-lg font-medium text-[14px]",
                          isActive 
                            ? "bg-[hsl(var(--sidebar-primary))] text-white hover:bg-[hsl(var(--sidebar-primary))]/90"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge
                            variant={item.badgeVariant || "secondary"}
                            className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums group-data-[collapsible=icon]:hidden min-w-[22px] justify-center"
                            data-testid={`badge-${item.id}-count`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-3 py-4">
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setLocation("/profile")}
              tooltip={t("dashboard.sidebar.settings", "Settings")}
              data-testid="sidebar-nav-settings"
              className="w-full justify-start gap-3 py-2.5 px-3.5 rounded-lg font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                {t("dashboard.sidebar.settings", "Settings")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setLocation("/help")}
              tooltip={t("dashboard.sidebar.help", "Help Center")}
              data-testid="sidebar-nav-help"
              className="w-full justify-start gap-3 py-2.5 px-3.5 rounded-lg font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4 shrink-0" />
              <span className="truncate group-data-[collapsible=icon]:hidden">
                {t("dashboard.sidebar.help", "Help Center")}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
