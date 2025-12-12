import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ArrowLeft, LayoutDashboard, ClipboardList, Shield } from "lucide-react";

interface DocumentsLayoutProps {
  children: React.ReactNode;
  title?: string;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

function SidebarContents({ activeSection, onSectionChange }: { activeSection?: string; onSectionChange?: (section: string) => void }) {
  const { t } = useTranslation();

  const menuItems = [
    {
      id: "overview",
      title: t('documents.overview', 'Overview'),
      icon: LayoutDashboard,
    },
    {
      id: "operations",
      title: t('documents.operations', 'Operations'),
      icon: ClipboardList,
    },
    {
      id: "compliance",
      title: t('documents.compliance', 'Compliance'),
      icon: Shield,
    },
  ];

  const handleItemClick = (id: string) => {
    if (onSectionChange) {
      onSectionChange(id);
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

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeSection === item.id}
                tooltip={item.title}
                onClick={() => handleItemClick(item.id)}
                data-testid={`nav-${item.id}`}
                className="gap-3"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Back to Dashboard"
            >
              <Link href="/dashboard" data-testid="button-back-dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span>{t('common.backToDashboard', 'Back to Dashboard')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export default function DocumentsLayout({ children, title, activeSection, onSectionChange }: DocumentsLayoutProps) {
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
  });

  const sidebarStyle = {
    "--sidebar-width": "14rem",
    "--sidebar-width-icon": "3.5rem",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarContents activeSection={activeSection} onSectionChange={onSectionChange} />
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
