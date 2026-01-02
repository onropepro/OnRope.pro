import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

export function SiteFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: {
      titleKey: "footer.platform.title",
      links: [
        { labelKey: "footer.platform.projectManagement", href: "/modules/project-management" },
        { labelKey: "footer.platform.schedulingCalendar", href: "/modules/scheduling-calendar" },
        { labelKey: "footer.platform.safetyCompliance", href: "/modules/safety-compliance" },
        { labelKey: "footer.platform.employeeManagement", href: "/modules/employee-management" },
        { labelKey: "footer.platform.crmClientPortal", href: "/modules/crm-client-portal" },
        { labelKey: "footer.platform.quotingSales", href: "/modules/quoting-sales" },
      ],
    },
    technicians: {
      titleKey: "footer.technicians.title",
      links: [
        { labelKey: "footer.technicians.passportLogbook", href: "/technician" },
        { labelKey: "footer.technicians.jobBoard", href: "/modules/technician-job-board" },
        { labelKey: "footer.technicians.personalSafetyRating", href: "/safety" },
        { labelKey: "footer.technicians.groundCrew", href: "/ground-crew" },
        { labelKey: "footer.technicians.irataTaskLogging", href: "/modules/irata-task-logging" },
      ],
    },
    stakeholders: {
      titleKey: "footer.stakeholders.title",
      links: [
        { labelKey: "footer.stakeholders.forEmployers", href: "/employer" },
        { labelKey: "footer.stakeholders.forTechnicians", href: "/technician" },
        { labelKey: "footer.stakeholders.forPropertyManagers", href: "/property-manager" },
        { labelKey: "footer.stakeholders.forBuildingManagers", href: "/building-manager" },
        { labelKey: "footer.stakeholders.forResidents", href: "/resident" },
      ],
    },
    resources: {
      titleKey: "footer.resources.title",
      links: [
        { labelKey: "footer.resources.helpCenter", href: "/help" },
        { labelKey: "footer.resources.gettingStarted", href: "/help/getting-started" },
        { labelKey: "footer.resources.featureFinder", href: "/help/feature-finder" },
        { labelKey: "footer.resources.pricing", href: "/pricing" },
        { labelKey: "footer.resources.safetyStandards", href: "/safety" },
      ],
    },
    legal: {
      titleKey: "footer.legal.title",
      links: [
        { labelKey: "footer.legal.privacyPolicy", href: "/privacy" },
        { labelKey: "footer.legal.termsOfService", href: "/terms" },
        { labelKey: "footer.legal.cookiePolicy", href: "/cookies" },
      ],
    },
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {Object.values(footerLinks).map((section) => (
            <div key={section.titleKey}>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-4">
                {t(section.titleKey)}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                      data-testid={`footer-link-${link.labelKey.split('.').pop()}`}
                    >
                      {t(link.labelKey)}
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
              © {currentYear} OnRopePro. {t('footer.allRightsReserved', 'All rights reserved.')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
