import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SuperUserLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const menuGroups = [
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
        title: "Global Buildings",
        icon: "apartment",
        path: "/superuser/buildings",
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
    ],
  },
  {
    label: "RESOURCES",
    items: [
      {
        title: "Changelog",
        icon: "menu_book",
        path: "/changelog",
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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
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
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.path, item.exact)}
                            tooltip={item.title}
                          >
                            <Link href={item.path}>
                              <span className="material-icons text-lg">
                                {item.icon}
                              </span>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
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
                          <span className="material-icons text-lg">
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

      <SidebarFooter className="p-3">
        <Separator className="mb-3" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-destructive hover:text-destructive"
            >
              <span className="material-icons text-lg">logout</span>
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
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarContents />
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
                <span className="hidden sm:inline">{userData.user.email}</span>
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
