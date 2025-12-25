import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Settings, HeartPulse, Users, Wallet, MessageSquare, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function PublicFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-white/5 py-16 px-4" data-testid="footer-public">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand & Mission */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              OnRope<span className="text-blue-500">Pro</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            {t('footer.description', 'The unified operating system for rope access companies. Streamlining safety, project management, and workforce tracking since 2023.')}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors" data-testid="link-social-facebook"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-social-instagram"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-social-linkedin"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="hover:text-white transition-colors" data-testid="link-social-twitter"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Product Categories */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{t('footer.sections.product', 'Product')}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/modules/project-management" className="hover:text-white transition-colors">{t('navigation.modules.projectManagement.title', 'Project Management')}</Link></li>
            <li><Link href="/modules/safety-compliance" className="hover:text-white transition-colors">{t('navigation.modules.safetyCompliance.title', 'Safety & Compliance')}</Link></li>
            <li><Link href="/modules/scheduling-calendar" className="hover:text-white transition-colors">{t('navigation.modules.scheduling.title', 'Scheduling & Calendar')}</Link></li>
            <li><Link href="/modules/quoting-sales-pipeline" className="hover:text-white transition-colors">{t('navigation.modules.quoting.title', 'Quoting & Sales')}</Link></li>
          </ul>
        </div>

        {/* Stakeholders */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{t('footer.sections.solutions', 'Solutions')}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/employer" className="hover:text-white transition-colors">{t('navigation.employer', 'For Employers')}</Link></li>
            <li><Link href="/technician" className="hover:text-white transition-colors">{t('navigation.technician', 'For Technicians')}</Link></li>
            <li><Link href="/property-manager" className="hover:text-white transition-colors">{t('navigation.propertyManager', 'For Property Managers')}</Link></li>
            <li><Link href="/resident" className="hover:text-white transition-colors">{t('navigation.resident', 'For Residents')}</Link></li>
          </ul>
        </div>

        {/* Company & Legal */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{t('footer.sections.company', 'Company')}</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/safety" className="hover:text-white transition-colors">Safety Manifesto</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition-colors">{t('login.header.pricing', 'Pricing')}</Link></li>
            <li><Link href="/help" className="hover:text-white transition-colors">{t('navigation.help', 'Help Center')}</Link></li>
            <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© {currentYear} OnRopePro. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
