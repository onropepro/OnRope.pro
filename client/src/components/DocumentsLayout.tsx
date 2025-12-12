import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";

type MenuItem = {
  title: string;
  icon: string;
  path: string;
  exact?: boolean;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

interface DocumentsLayoutProps {
  children: React.ReactNode;
  title?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

function SidebarContents({ activeTab, onTabChange }: { activeTab?: string; onTabChange?: (tab: string) => void }) {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    DOCUMENTS: true,
    SAFETY: true,
  });

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menuGroups: MenuGroup[] = [
    {
      label: "DOCUMENTS",
      items: [
        {
          title: t('documents.healthSafetyManual', 'Health & Safety Manual'),
          icon: "health_and_safety",
          path: "health-safety",
        },
        {
          title: t('documents.companyPolicies', 'Company Policies'),
          icon: "menu_book",
          path: "company-policy",
        },
        {
          title: t('documents.certificateOfInsurance', 'Certificate of Insurance'),
          icon: "verified_user",
          path: "insurance",
        },
        {
          title: t('documents.safeWorkProcedures', 'Safe Work Procedures'),
          icon: "description",
          path: "swp-templates",
        },
        {
          title: t('documents.safeWorkPractices', 'Safe Work Practices'),
          icon: "shield",
          path: "safe-work-practices",
        },
      ],
    },
    {
      label: "SAFETY",
      items: [
        {
          title: t('documents.equipmentInspections', 'Equipment Inspections'),
          icon: "inventory_2",
          path: "inspections-safety",
        },
        {
          title: t('documents.damageReports', 'Damage Reports'),
          icon: "warning",
          path: "damage-reports",
        },
      ],
    },
  ];

  const handleItemClick = (path: string) => {
    if (onTabChange) {
      onTabChange(path);
    }
  };

  return (
    <>
      <SidebarHeader className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>{t('common.backToDashboard', 'Back to Dashboard')}</span>
        </Link>
        <div className="mt-3">
          <h2 className="text-lg font-semibold">{t('documents.title', 'Documents')}</h2>
          <p className="text-xs text-muted-foreground">{t('documents.subtitle', 'Company documents and safety records')}</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <Collapsible
              open={expandedGroups[group.label]}
              onOpenChange={() => toggleGroup(group.label)}
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <span>{group.label}</span>
                  {expandedGroups[group.label] ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          isActive={activeTab === item.path}
                          tooltip={item.title}
                          onClick={() => handleItemClick(item.path)}
                          data-testid={`nav-${item.path}`}
                        >
                          <span className="material-icons text-lg text-muted-foreground">
                            {item.icon}
                          </span>
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Back to Dashboard"
            >
              <Link href="/dashboard" data-testid="button-back-dashboard">
                <span className="material-icons text-lg text-muted-foreground">arrow_back</span>
                <span>{t('common.backToDashboard', 'Back to Dashboard')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export default function DocumentsLayout({ children, title, activeTab, onTabChange }: DocumentsLayoutProps) {
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarContents activeTab={activeTab} onTabChange={onTabChange} />
        </Sidebar>
        <div className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              {title && (
                <h1 className="text-lg font-semibold truncate">{title}</h1>
              )}
            </div>
            {userData?.user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="material-icons text-base">person</span>
                <span className="hidden sm:inline">{userData.user.name || userData.user.email}</span>
              </div>
            )}
          </header>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
