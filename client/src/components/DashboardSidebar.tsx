import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
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
  Home,
  Settings,
  HelpCircle,
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
  alertCounts = {},
}: DashboardSidebarProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();

  const navigationGroups: NavGroup[] = [
    {
      id: "operations",
      label: t("dashboard.categories.operations", "Operations"),
      items: [
        {
          id: "home",
          label: t("dashboard.sidebar.overview", "Overview"),
          icon: Home,
          onClick: () => onTabChange("home"),
          isVisible: () => true,
        },
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
          id: "non-billable",
          label: t("dashboard.cards.nonBillableHours.label", "Non-Billable Hours"),
          icon: Clock,
          href: "/non-billable-hours",
          isVisible: () => true,
        },
      ],
    },
    {
      id: "team",
      label: t("dashboard.categories.team", "Team"),
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
          id: "performance",
          label: t("dashboard.cards.performance.label", "Performance"),
          icon: BarChart3,
          onClick: () => onTabChange("performance"),
          isVisible: (user) => canViewPerformance(user),
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
      label: t("dashboard.sidebar.equipment", "Equipment"),
      items: [
        {
          id: "inventory",
          label: t("dashboard.cards.inventory.label", "Inventory"),
          icon: Package,
          href: "/inventory",
          badge: alertCounts.overdueInspections,
          badgeVariant: alertCounts.overdueInspections ? "destructive" : undefined,
          isVisible: () => true,
        },
      ],
    },
    {
      id: "safety",
      label: t("dashboard.categories.safety", "Safety"),
      items: [
        {
          id: "safety-forms",
          label: t("dashboard.cards.safetyForms.label", "Safety Forms"),
          icon: Shield,
          href: "/safety-forms",
          isVisible: () => true,
        },
      ],
    },
    {
      id: "financial",
      label: t("dashboard.categories.financial", "Financial"),
      items: [
        {
          id: "payroll",
          label: t("dashboard.cards.payroll.label", "Payroll"),
          icon: Wallet,
          href: "/payroll",
          badge: alertCounts.pendingTimesheets,
          badgeVariant: alertCounts.pendingTimesheets ? "destructive" : undefined,
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
    {
      id: "communication",
      label: t("dashboard.categories.communication", "Communication"),
      items: [
        {
          id: "clients",
          label: t("dashboard.cards.clients.label", "Clients"),
          icon: ClipboardList,
          onClick: () => onTabChange("clients"),
          isVisible: (user) => hasPermission(user, "view_clients"),
        },
        {
          id: "feedback",
          label: t("dashboard.cards.feedback.label", "Feedback"),
          icon: MessageSquare,
          onClick: () => onTabChange("complaints"),
          isVisible: () => true,
        },
        {
          id: "documents",
          label: t("dashboard.cards.documents.label", "Documents"),
          icon: FileText,
          href: "/documents",
          badge: alertCounts.unsignedDocs,
          badgeVariant: alertCounts.unsignedDocs ? "destructive" : undefined,
          isVisible: () => true,
        },
        {
          id: "residents",
          label: t("dashboard.cards.residents.label", "Residents"),
          icon: Users,
          href: "/residents",
          isVisible: (user) => isManagement(user),
        },
      ],
    },
  ];

  const isActiveItem = (item: NavItem): boolean => {
    if (item.href) {
      return location === item.href;
    }
    if (item.id === "home") {
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

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          {whitelabelBrandingActive && brandingLogoUrl ? (
            <img
              src={brandingLogoUrl}
              alt="Company Logo"
              className="h-8 w-auto max-w-[140px] object-contain"
              data-testid="img-sidebar-logo"
            />
          ) : (
            <div className="flex items-center gap-2" data-testid="sidebar-default-logo">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="font-semibold text-foreground group-data-[collapsible=icon]:hidden">
                OnRope.Pro
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        {filteredGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.id}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
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
                          "w-full justify-start gap-3",
                          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge
                            variant={item.badgeVariant || "secondary"}
                            className="ml-auto text-xs tabular-nums group-data-[collapsible=icon]:hidden"
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

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setLocation("/profile")}
              tooltip={t("dashboard.sidebar.settings", "Settings")}
              data-testid="sidebar-nav-settings"
              className="w-full justify-start gap-3"
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
              className="w-full justify-start gap-3"
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
