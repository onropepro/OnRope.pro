import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  Award,
  Wrench,
  ClipboardCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { User } from "@/lib/permissions";
import {
  hasFinancialAccess,
  canManageEmployees,
} from "@/lib/permissions";
import { useState, useEffect } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
  badge?: number;
  badgeType?: "alert" | "info";
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
  const [isOpen, setIsOpen] = useState(false);

  // Deep Blue brand color - used when white label is not active
  const BRAND_COLOR = "#0B64A3";

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
          id: "timesheets",
          label: t("dashboard.sidebar.timesheets", "Timesheets"),
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
  const isDashboardActive = activeTab === "home" || activeTab === "" || !activeTab;

  // Get brand color - use CSS variable when white label is active, otherwise use Deep Blue
  const getBrandColor = () => {
    if (whitelabelBrandingActive) {
      return "hsl(var(--sidebar-primary))";
    }
    return BRAND_COLOR;
  };

  const sidebarContent = (
    <>
      {/* Logo Header - h-14 (56px) */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        {whitelabelBrandingActive && brandingLogoUrl ? (
          <img
            src={brandingLogoUrl}
            alt="Company Logo"
            className="h-7 w-auto max-w-[160px] object-contain"
            data-testid="img-sidebar-logo"
          />
        ) : (
          <div className="flex items-center gap-2.5" data-testid="sidebar-default-logo">
            <div 
              className="flex h-7 w-7 items-center justify-center rounded-md text-white font-semibold text-sm"
              style={{ backgroundColor: getBrandColor() }}
            >
              OR
            </div>
            <span className="font-medium text-base text-slate-900 dark:text-slate-100">
              OnRopePro
            </span>
          </div>
        )}
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen(false)}
          data-testid="button-sidebar-close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>


      {/* Dashboard Primary Link */}
      <div className="px-3 pb-2">
        <button
          onClick={() => onTabChange("home")}
          data-testid="sidebar-nav-dashboard"
          className={cn(
            "w-full flex items-center gap-2.5 py-2 px-3 rounded-md text-base font-medium transition-colors",
            isDashboardActive 
              ? "text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          )}
          style={isDashboardActive ? { backgroundColor: getBrandColor() } : undefined}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          <span>{t("dashboard.sidebar.dashboard", "Dashboard")}</span>
        </button>
      </div>

      {/* Navigation Groups - Scrollable */}
      <nav className="flex-1 overflow-y-auto px-3 py-1">
        {filteredGroups.map((group) => (
          <div key={group.id} className="mb-4">
            {/* Group Header */}
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
              {group.label}
            </div>
            
            {/* Group Items */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveItem(item);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    data-testid={`sidebar-nav-${item.id}`}
                    className={cn(
                      "w-full flex items-center gap-2.5 py-2 px-3 rounded-md text-base font-medium transition-colors",
                      isActive 
                        ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
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
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer - Settings and Help */}
      <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-3">
        <div className="space-y-0.5">
          <button
            onClick={() => setLocation("/profile")}
            data-testid="sidebar-nav-settings"
            className="w-full flex items-center gap-2.5 py-2 px-3 rounded-md text-base font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>{t("dashboard.sidebar.settings", "Settings")}</span>
          </button>
          <button
            onClick={() => setLocation("/help")}
            data-testid="sidebar-nav-help"
            className="w-full flex items-center gap-2.5 py-2 px-3 rounded-md text-base font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            <span>{t("dashboard.sidebar.help", "Help Center")}</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button - visible only on small screens */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-30 lg:hidden"
        onClick={() => setIsOpen(true)}
        data-testid="button-sidebar-toggle"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <aside 
        className={cn(
          "fixed h-full left-0 top-0 z-40 w-60 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-700/80 flex flex-col transition-transform duration-200",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        data-testid="dashboard-sidebar"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
