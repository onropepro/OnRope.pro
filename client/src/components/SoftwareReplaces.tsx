import { useTranslation } from "react-i18next";
import deputyLogo from "@assets/deputy-scheduling_1766279422627.png";
import {
  SiAsana,
  SiTrello,
  SiClockify,
  SiQuickbooks,
  SiXero,
  SiHubspot,
  SiZendesk,
  SiIndeed,
  SiLinkedin,
  SiDropbox,
  SiGooglecalendar,
  SiGusto,
  SiFacebook,
} from "react-icons/si";
import { 
  FileSpreadsheet, 
  ClipboardList, 
  Users, 
  Building2, 
  FileText,
  Calendar,
  PenTool,
  Shield,
  Clock,
  Briefcase,
  Smartphone,
  BookOpen,
  Newspaper
} from "lucide-react";

export type SoftwareKey =
  | "docusign"
  | "monday"
  | "asana"
  | "trello"
  | "safetyculture"
  | "deputy"
  | "clockify"
  | "quickbooks"
  | "xero"
  | "hubspot"
  | "pipedrive"
  | "zendesk"
  | "freshdesk"
  | "indeed"
  | "linkedin"
  | "dropbox"
  | "googlecalendar"
  | "sharepoint"
  | "excel"
  | "gusto"
  | "bamboohr"
  | "paper"
  | "spreadsheets"
  | "jobnimbus"
  | "buildium"
  | "appfolio"
  | "whenIWork"
  | "vericlock"
  | "notesApp"
  | "notebook"
  | "jobber"
  | "housecallpro"
  | "facebook"
  | "craigslist"
  | "float";

interface SoftwareInfo {
  name: string;
  icon: React.ReactNode;
}

const softwareData: Record<SoftwareKey, SoftwareInfo> = {
  docusign: { name: "DocuSign", icon: <PenTool className="w-5 h-5" /> },
  monday: { name: "Monday.com", icon: <Calendar className="w-5 h-5" /> },
  asana: { name: "Asana", icon: <SiAsana className="w-5 h-5" /> },
  trello: { name: "Trello", icon: <SiTrello className="w-5 h-5" /> },
  safetyculture: { name: "SafetyCulture", icon: <Shield className="w-5 h-5" /> },
  deputy: { name: "Deputy", icon: <img src={deputyLogo} alt="Deputy" className="w-5 h-5 object-contain" /> },
  clockify: { name: "Clockify", icon: <SiClockify className="w-5 h-5" /> },
  quickbooks: { name: "QuickBooks", icon: <SiQuickbooks className="w-5 h-5" /> },
  xero: { name: "Xero", icon: <SiXero className="w-5 h-5" /> },
  hubspot: { name: "HubSpot", icon: <SiHubspot className="w-5 h-5" /> },
  pipedrive: { name: "Pipedrive", icon: <Briefcase className="w-5 h-5" /> },
  zendesk: { name: "Zendesk", icon: <SiZendesk className="w-5 h-5" /> },
  freshdesk: { name: "Freshdesk", icon: <FileText className="w-5 h-5" /> },
  indeed: { name: "Indeed", icon: <SiIndeed className="w-5 h-5" /> },
  linkedin: { name: "LinkedIn Jobs", icon: <SiLinkedin className="w-5 h-5" /> },
  dropbox: { name: "Dropbox", icon: <SiDropbox className="w-5 h-5" /> },
  googlecalendar: { name: "Google Calendar", icon: <SiGooglecalendar className="w-5 h-5" /> },
  sharepoint: { name: "SharePoint", icon: <FileText className="w-5 h-5" /> },
  excel: { name: "Excel", icon: <FileSpreadsheet className="w-5 h-5" /> },
  gusto: { name: "Gusto", icon: <SiGusto className="w-5 h-5" /> },
  bamboohr: { name: "BambooHR", icon: <Users className="w-5 h-5" /> },
  paper: { name: "Paper Forms", icon: <ClipboardList className="w-5 h-5" /> },
  spreadsheets: { name: "Spreadsheets", icon: <FileSpreadsheet className="w-5 h-5" /> },
  jobnimbus: { name: "JobNimbus", icon: <ClipboardList className="w-5 h-5" /> },
  buildium: { name: "Buildium", icon: <Building2 className="w-5 h-5" /> },
  appfolio: { name: "AppFolio", icon: <Building2 className="w-5 h-5" /> },
  whenIWork: { name: "When I Work", icon: <Clock className="w-5 h-5" /> },
  vericlock: { name: "Vericlock", icon: <Clock className="w-5 h-5" /> },
  notesApp: { name: "Notes App", icon: <Smartphone className="w-5 h-5" /> },
  notebook: { name: "Notebook", icon: <BookOpen className="w-5 h-5" /> },
  jobber: { name: "Jobber", icon: <ClipboardList className="w-5 h-5" /> },
  housecallpro: { name: "Housecall Pro", icon: <Briefcase className="w-5 h-5" /> },
  facebook: { name: "Facebook", icon: <SiFacebook className="w-5 h-5" /> },
  craigslist: { name: "Craigslist", icon: <Newspaper className="w-5 h-5" /> },
  float: { name: "Float", icon: <Calendar className="w-5 h-5" /> },
};

interface SoftwareReplacesProps {
  software: SoftwareKey[];
  className?: string;
}

export function SoftwareReplaces({ software, className = "" }: SoftwareReplacesProps) {
  const { t } = useTranslation();

  if (!software.length) return null;

  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 md:gap-6 py-6 ${className}`} data-testid="software-replaces">
      <span className="text-slate-400 dark:text-slate-500 text-sm font-medium uppercase tracking-wider">
        {t('common.replaces', 'Replaces')}
      </span>
      {software.map((key) => {
        const info = softwareData[key];
        if (!info) return null;
        return (
          <div
            key={key}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400"
            data-testid={`software-${key}`}
          >
            <span className="opacity-70">{info.icon}</span>
            <span className="text-sm font-medium">{info.name}</span>
          </div>
        );
      })}
    </div>
  );
}

export const MODULE_SOFTWARE_MAPPING: Record<string, SoftwareKey[]> = {
  "technician-passport": ["bamboohr", "docusign", "paper"],
  "safety-compliance": ["safetyculture", "paper", "notesApp", "notebook"],
  "project-management": ["monday", "asana", "trello"],
  "work-session-time-tracking": ["deputy", "clockify", "vericlock", "notesApp", "notebook"],
  "company-safety-rating": ["excel", "spreadsheets"],
  "irata-sprat-task-logging": ["excel", "paper", "notesApp"],
  "document-management": ["docusign", "dropbox", "sharepoint"],
  "employee-management": ["bamboohr", "gusto", "paper"],
  "technician-job-board": ["indeed", "linkedin"],
  "employer-job-board": ["indeed", "linkedin", "facebook", "craigslist"],
  "gear-inventory": ["excel", "spreadsheets"],
  "scheduling-calendar": ["deputy", "whenIWork", "googlecalendar", "float"],
  "payroll-financial": ["quickbooks", "xero", "excel"],
  "quoting-sales-pipeline": ["hubspot", "pipedrive", "jobnimbus"],
  "white-label-branding": [],
  "resident-portal": ["zendesk", "freshdesk", "notesApp", "notebook"],
  "property-manager-interface": ["buildium", "appfolio"],
  "user-access-authentication": [],
  "client-relationship-management": ["pipedrive", "hubspot", "jobber", "housecallpro"],
};
