import { Link } from "wouter";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const footerLinks = {
  platform: {
    title: "PLATFORM",
    links: [
      { label: "Project Management", href: "/modules/project-management" },
      { label: "Scheduling & Calendar", href: "/modules/scheduling-calendar" },
      { label: "Safety & Compliance", href: "/modules/safety-compliance" },
      { label: "Employee Management", href: "/modules/employee-management" },
      { label: "CRM & Client Portal", href: "/modules/crm-client-portal" },
      { label: "Quoting & Sales", href: "/modules/quoting-sales" },
    ],
  },
  technicians: {
    title: "TECHNICIANS",
    links: [
      { label: "Passport & Logbook", href: "/technician" },
      { label: "Job Board", href: "/modules/technician-job-board" },
      { label: "Personal Safety Rating", href: "/safety" },
      { label: "Ground Crew", href: "/ground-crew" },
      { label: "IRATA Task Logging", href: "/modules/irata-task-logging" },
    ],
  },
  stakeholders: {
    title: "STAKEHOLDERS",
    links: [
      { label: "For Employers", href: "/employer" },
      { label: "For Technicians", href: "/technician" },
      { label: "For Property Managers", href: "/property-manager" },
      { label: "For Building Managers", href: "/building-manager" },
      { label: "For Residents", href: "/resident" },
    ],
  },
  resources: {
    title: "RESOURCES",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Getting Started", href: "/help/getting-started" },
      { label: "Feature Finder", href: "/help/feature-finder" },
      { label: "Pricing", href: "/pricing" },
      { label: "Safety Standards", href: "/safety" },
    ],
  },
  legal: {
    title: "LEGAL",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
};

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={onRopeProLogo}
                alt="OnRopePro"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} OnRopePro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
