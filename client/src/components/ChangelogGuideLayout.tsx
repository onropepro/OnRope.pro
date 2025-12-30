import { Link, useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ChangelogLayout from "@/components/ChangelogLayout";
import {
  Shield,
  Package,
  Users,
  FolderOpen,
  Clock,
  FileText,
  Calendar,
  Receipt,
  Building2,
  MessageSquare,
  Palette,
  BarChart3,
  Globe,
  MapPin,
  Home,
  ClipboardCheck,
  HardHat,
  CreditCard,
  ChevronLeft,
  Star,
  Smartphone,
  Briefcase,
  Link2
} from "lucide-react";

interface GuideLink {
  name: string;
  path: string;
  icon: any;
}

const guideLinks: GuideLink[] = [
  { name: "User Access & Authentication", path: "/changelog/user-access", icon: Shield },
  { name: "Project Management", path: "/changelog/projects", icon: FolderOpen },
  { name: "Work Session & Time Tracking", path: "/changelog/time-tracking", icon: Clock },
  { name: "IRATA / SPRAT Task Logging", path: "/changelog/irata-logging", icon: ClipboardCheck },
  { name: "Safety & Compliance", path: "/changelog/safety", icon: Shield },
  { name: "Company Safety Rating (CSR)", path: "/changelog/csr", icon: Star },
  { name: "Personal Safety Rating (PSR)", path: "/changelog/psr", icon: HardHat },
  { name: "Document Management", path: "/changelog/documents", icon: FileText },
  { name: "Employee Management", path: "/changelog/employees", icon: Users },
  { name: "Technician Passport", path: "/changelog/technician-registration", icon: HardHat },
  { name: "Scheduling & Calendar", path: "/changelog/scheduling", icon: Calendar },
  { name: "Gear Inventory", path: "/changelog/inventory", icon: Package },
  { name: "Payroll & Financial", path: "/changelog/payroll", icon: CreditCard },
  { name: "Quoting & Sales Pipeline", path: "/changelog/quoting", icon: Receipt },
  { name: "Client Relationship Management (CRM)", path: "/changelog/crm", icon: Building2 },
  { name: "Resident Portal", path: "/changelog/resident-portal", icon: MessageSquare },
  { name: "Property Manager Interface", path: "/changelog/property-manager", icon: Home },
  { name: "Pricing", path: "/changelog/pricing", icon: CreditCard },
  { name: "White-Label Branding", path: "/changelog/branding", icon: Palette },
  { name: "SuperUser Administration", path: "/changelog/platform-admin", icon: HardHat },
  { name: "Analytics & Reporting", path: "/changelog/analytics", icon: BarChart3 },
  { name: "Language & Localization", path: "/changelog/language", icon: Globe },
  { name: "Mobile-First Design", path: "/changelog/mobile-design", icon: Smartphone },
  { name: "GPS & Location Services", path: "/changelog/gps", icon: MapPin },
  { name: "Job Board Ecosystem", path: "/changelog/job-board", icon: Briefcase },
  { name: "Portable Accounts & Connections", path: "/changelog/connections", icon: Link2 },
];

interface ChangelogGuideLayoutProps {
  children: React.ReactNode;
  title: string;
  version?: string;
  lastUpdated?: string;
}

export default function ChangelogGuideLayout({ 
  children, 
  title,
  version,
  lastUpdated
}: ChangelogGuideLayoutProps) {
  const [location] = useLocation();

  return (
    <ChangelogLayout title={title}>
      <div className="flex min-h-screen bg-background">
        {/* Left Sidebar Navigation */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-card">
          <div className="p-4 border-b">
            <Link href="/changelog" className="flex items-center gap-2 text-sm text-muted-foreground hover-elevate rounded-md p-2 -m-2">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Changelog</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Feature Guides
              </p>
              {guideLinks.map((link) => {
                const isActive = location === link.path;
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                      isActive 
                        ? "bg-action-100 dark:bg-action-900 text-action-700 dark:text-action-300 font-medium" 
                        : "text-muted-foreground hover-elevate"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
            <div className="px-4 md:px-8 py-4">
              <div className="flex items-center gap-3 md:hidden mb-2">
                <Link href="/changelog" className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Changelog</span>
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              {(version || lastUpdated) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {version && `Version ${version}`}
                  {version && lastUpdated && " - "}
                  {lastUpdated && `Updated ${lastUpdated}`}
                </p>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ChangelogLayout>
  );
}
