import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { UnifiedDashboardHeader } from "@/components/UnifiedDashboardHeader";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";

type SubMenuItem = {
  title: string;
  path: string;
};

type MenuItem = {
  title: string;
  icon: string;
  path: string;
  exact?: boolean;
  subItems?: SubMenuItem[];
};

const changelogSubItems: SubMenuItem[] = [
  { title: "Pricing", path: "/changelog/pricing" },
  { title: "Safety Guide", path: "/changelog/safety" },
  { title: "Inventory Guide", path: "/changelog/inventory" },
  { title: "User Access Guide", path: "/changelog/user-access" },
  { title: "Projects Guide", path: "/changelog/projects" },
  { title: "Time Tracking Guide", path: "/changelog/time-tracking" },
  { title: "irata / SPRAT Task Logging Guide", path: "/changelog/irata-logging" },
  { title: "Documents Guide", path: "/changelog/documents" },
  { title: "Employees Guide", path: "/changelog/employees" },
  { title: "Scheduling Guide", path: "/changelog/scheduling" },
  { title: "Quoting Guide", path: "/changelog/quoting" },
  { title: "CRM Guide", path: "/changelog/crm" },
  { title: "Resident Portal Guide", path: "/changelog/resident-portal" },
  { title: "Branding Guide", path: "/changelog/branding" },
  { title: "Platform Admin Guide", path: "/changelog/platform-admin" },
  { title: "Analytics Guide", path: "/changelog/analytics" },
  { title: "Multi-Language Guide", path: "/changelog/language" },
  { title: "GPS & Location Guide", path: "/changelog/gps" },
  { title: "Property Manager Guide", path: "/changelog/property-manager" },
  { title: "CSR Guide", path: "/changelog/csr" },
  { title: "Mobile-First Guide", path: "/changelog/mobile-design" },
  { title: "Technician Registration Guide", path: "/changelog/technician-registration" },
  { title: "Job Board Guide", path: "/changelog/job-board" },
  { title: "Payroll Guide", path: "/changelog/payroll" },
];


interface SuperUserLayoutProps {
  children: React.ReactNode;
  title?: string;
}

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    label: "MAIN",
    items: [
      {
        title: "Dashboard",
        icon: "dashboard",
        path: "/superuser",
        exact: true,
      },
      {
        title: "View All Companies",
        icon: "business",
        path: "/superuser/companies",
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        title: "Staff Accounts",
        icon: "manage_accounts",
        path: "/superuser/staff-accounts",
      },
      {
        title: "Technician Database",
        icon: "engineering",
        path: "/superuser/technicians",
      },
      {
        title: "Global Buildings",
        icon: "apartment",
        path: "/superuser/buildings",
      },
      {
        title: "Job Board",
        icon: "work",
        path: "/superuser/job-board",
      },
      {
        title: "Task List",
        icon: "checklist",
        path: "/superuser/tasks",
      },
      {
        title: "Feature Requests",
        icon: "lightbulb",
        path: "/superuser/feature-requests",
      },
      {
        title: "Future Ideas",
        icon: "auto_awesome",
        path: "/superuser/future-ideas",
      },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      {
        title: "Platform Metrics",
        icon: "analytics",
        path: "/superuser/metrics",
      },
      {
        title: "Goals & KPIs",
        icon: "flag",
        path: "/superuser/goals",
      },
      {
        title: "Network Effects",
        icon: "hub",
        path: "/superuser/network",
      },
      {
        title: "Safety Metrics",
        icon: "shield",
        path: "/superuser/safety",
      },
    ],
  },
  {
    label: "RESOURCES",
    items: [
      {
        title: "Changelog",
        icon: "menu_book",
        path: "/changelog",
        subItems: changelogSubItems,
      },
      {
        title: "Founder Resources",
        icon: "rocket_launch",
        path: "/superuser/founder-resources",
      },
    ],
  },
];

function SidebarContents() {
  const [location, setLocation] = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    MAIN: true,
    MANAGEMENT: true,
    ANALYTICS: true,
    RESOURCES: true,
  });
  
  const isOnChangelogPage = location.startsWith("/changelog");
  
  const [expandedSubMenus, setExpandedSubMenus] = useState<Record<string, boolean>>({
    Changelog: isOnChangelogPage,
  });
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  useEffect(() => {
    if (isOnChangelogPage && !expandedSubMenus.Changelog) {
      setExpandedSubMenus(prev => ({ ...prev, Changelog: true }));
    }
  }, [isOnChangelogPage]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const toggleSubMenu = (title: string) => {
    setExpandedSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location === path;
    }
    return location.startsWith(path);
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    queryClient.clear();
    setLocation("/login");
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <span className="material-icons text-primary-foreground text-xl">
              admin_panel_settings
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base truncate">OnRopePro</span>
              <span className="text-xs text-muted-foreground">Super User</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent className="px-2">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!isCollapsed ? (
              <Collapsible
                open={expandedGroups[group.label]}
                onOpenChange={() => toggleGroup(group.label)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:bg-sidebar-accent/50 rounded-md px-2 py-1.5 transition-colors">
                    <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                      {group.label}
                    </span>
                    {expandedGroups[group.label] ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.path}>
                          {item.subItems ? (
                            <Collapsible
                              open={expandedSubMenus[item.title]}
                              onOpenChange={() => toggleSubMenu(item.title)}
                            >
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                  isActive={isActive(item.path)}
                                  tooltip={item.title}
                                  className="justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="material-icons text-lg text-muted-foreground">
                                      {item.icon}
                                    </span>
                                    <span>{item.title}</span>
                                  </div>
                                  {expandedSubMenus[item.title] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  <SidebarMenuSubItem>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={location === item.path}
                                    >
                                      <Link href={item.path}>
                                        <span className="text-xs">Overview</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                  {item.subItems.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.path}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={location === subItem.path}
                                      >
                                        <Link href={subItem.path}>
                                          <span className="text-xs">{subItem.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </Collapsible>
                          ) : (
                            <SidebarMenuButton
                              asChild
                              isActive={isActive(item.path, item.exact)}
                              tooltip={item.title}
                            >
                              <Link href={item.path}>
                                <span className="material-icons text-lg text-muted-foreground">
                                  {item.icon}
                                </span>
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          )}
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path, item.exact)}
                        tooltip={item.title}
                      >
                        <Link href={item.path}>
                          <span className="material-icons text-lg text-muted-foreground">
                            {item.icon}
                          </span>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-destructive hover:text-destructive"
              data-testid="button-logout"
            >
              <span className="material-icons text-lg text-muted-foreground">logout</span>
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export default function SuperUserLayout({ children, title }: SuperUserLayoutProps) {
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full superuser-root">
        <Sidebar collapsible="icon">
          <SidebarContents />
        </Sidebar>
        <div className="flex flex-col flex-1 min-w-0">
          <UnifiedDashboardHeader
            variant="superuser"
            currentUser={userData?.user}
            customMenuTrigger={<SidebarTrigger data-testid="button-sidebar-toggle" />}
            pageTitle={title}
            showSearch={true}
            showNotifications={true}
            showLanguageDropdown={true}
            showInstallPWA={true}
            showProfile={true}
            showLogout={false}
          />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
