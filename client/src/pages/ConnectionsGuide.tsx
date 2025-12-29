import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Key,
  Users,
  Building2,
  Crown,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ChevronsUpDown,
  Zap,
  HelpCircle,
  ArrowRight,
  Briefcase,
  Home,
  Link2,
  Clock,
  Shield,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Eye,
  Camera,
  TrendingUp,
  Globe,
  Network,
  UserPlus,
  ClipboardCheck,
  Settings,
  Award,
  Target,
  RefreshCw
} from "lucide-react";

const ALL_PROBLEM_IDS = [
  "tech-1", "tech-2", "tech-3",
  "resident-1", "resident-2", "resident-3",
  "pm-1", "pm-2",
  "bm-1", "bm-2",
  "owner-1", "owner-2", "owner-3"
];

const ALL_FAQ_IDS = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5"];

export default function ConnectionsGuide() {
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);

  const toggleAllProblems = () => {
    if (expandedProblems.length === ALL_PROBLEM_IDS.length) {
      setExpandedProblems([]);
    } else {
      setExpandedProblems([...ALL_PROBLEM_IDS]);
    }
  };

  const toggleAllFaqs = () => {
    if (expandedFaqs.length === ALL_FAQ_IDS.length) {
      setExpandedFaqs([]);
    } else {
      setExpandedFaqs([...ALL_FAQ_IDS]);
    }
  };

  return (
    <ChangelogGuideLayout 
      title="Portable Accounts & Connections"
      version="1.0"
      lastUpdated="December 21, 2025"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            OnRopePro uses a portable account system where users create one account and connect it to multiple entities. Technicians connect to employers. Residents connect to buildings and service providers. Property managers connect to vendors. Each connection unlocks specific functionality, creating a network effect where more connections mean more value for everyone in the ecosystem.
          </p>
          <p className="text-muted-foreground leading-relaxed text-base">
            This architecture eliminates the need for separate accounts per employer, building, or vendor. Users keep their work history, certifications, and preferences as they move between jobs, buildings, or service relationships.
          </p>
        </section>

        <Separator />

        {/* The Golden Rule */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">The Golden Rule</h2>
          </div>

          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-6 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold text-amber-900 dark:text-amber-100">
                  One Account + Connection Codes = Universal Access
                </p>
              </div>

              <div className="space-y-3 text-amber-800 dark:text-amber-200">
                <p className="text-base">
                  Every user type connects to the platform through <strong>portable accounts</strong> that persist across their entire career or tenancy:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-base">
                  <li><strong>Technicians</strong> connect to employers via invitation codes or direct adds</li>
                  <li><strong>Residents</strong> connect to vendors via Vendor Code + Strata/LMS number</li>
                  <li><strong>Property Managers</strong> connect to vendors via Vendor Code</li>
                  <li><strong>Building Managers</strong> connect to a single building at account creation</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-4">
                <p className="font-semibold flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <TrendingUp className="w-4 h-4" />
                  The Network Effect
                </p>
                <p className="mt-2 text-base text-amber-800 dark:text-amber-200">
                  As more users adopt the platform, the value of each account grows. A technician's work history follows them to new employers. A resident's account works at their next apartment. A property manager's vendor network expands with each new relationship. This creates viral adoption as users expect the same system everywhere.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <Wrench className="w-6 h-6 mx-auto mb-1 text-[#5C7A84]" />
                  <p className="font-bold text-amber-900 dark:text-amber-100 text-sm">Technician</p>
                  <p className="text-xs text-amber-800 dark:text-amber-200">Connects to Employers</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <Home className="w-6 h-6 mx-auto mb-1 text-[#86A59C]" />
                  <p className="font-bold text-amber-900 dark:text-amber-100 text-sm">Resident</p>
                  <p className="text-xs text-amber-800 dark:text-amber-200">Connects to Vendors</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <Briefcase className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                  <p className="font-bold text-amber-900 dark:text-amber-100 text-sm">Property Manager</p>
                  <p className="text-xs text-amber-800 dark:text-amber-200">Connects to Vendors</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <Building2 className="w-6 h-6 mx-auto mb-1 text-violet-600" />
                  <p className="font-bold text-amber-900 dark:text-amber-100 text-sm">Building Manager</p>
                  <p className="text-xs text-amber-800 dark:text-amber-200">Connects to Building</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Connection Types */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Connection Types</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            Each connection type unlocks specific functionality. The more connections a user has, the more powerful their account becomes.
          </p>

          {/* Technician to Employer */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-[#5C7A84]/10 dark:bg-[#5C7A84]/20 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#5C7A84]/20 dark:bg-[#5C7A84]/30 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-[#5C7A84]" />
                </div>
                <div>
                  <CardTitle className="text-xl">Technician to Employer</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Connection via invitation or direct add by company</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-[#5C7A84]/5 dark:bg-[#5C7A84]/10 rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">How to Connect:</p>
                  <p className="text-base text-muted-foreground">
                    Company admins add technicians directly via email, or technicians accept pending invitations in their portal. PLUS tier technicians can connect to unlimited employers simultaneously.
                  </p>
                </div>

                <p className="font-semibold text-foreground">What You Unlock:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Auto-Logging</p>
                      <p className="text-sm text-muted-foreground">Work sessions automatically log IRATA hours for certification progression</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Project Scheduling</p>
                      <p className="text-sm text-muted-foreground">View assigned projects, upcoming shifts, and team schedules</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Payroll Processing</p>
                      <p className="text-sm text-muted-foreground">Clock in/out tracked with GPS, hours exported to payroll systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Gear Assignments</p>
                      <p className="text-sm text-muted-foreground">View assigned equipment, inspection dates, and compliance status</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Safety Documentation</p>
                      <p className="text-sm text-muted-foreground">Access toolbox meetings, FLHA forms, and harness inspections</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Document Reviews</p>
                      <p className="text-sm text-muted-foreground">Review and digitally sign company policies and procedures</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mt-4">
                  <p className="flex items-center gap-2 font-medium text-orange-900 dark:text-orange-100">
                    <Award className="w-4 h-4" />
                    PLUS Tier Benefit
                  </p>
                  <p className="text-base text-orange-800 dark:text-orange-200 mt-1">
                    Free accounts connect to one employer at a time. PLUS tier technicians connect to unlimited employers, with consolidated work history across all connections.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resident to Vendor */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-[#86A59C]/10 dark:bg-[#86A59C]/20 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#86A59C]/20 dark:bg-[#86A59C]/30 flex items-center justify-center">
                  <Home className="w-5 h-5 text-[#86A59C]" />
                </div>
                <div>
                  <CardTitle className="text-xl">Resident to Vendor</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Connection via Vendor Code + Strata/LMS Number</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-[#86A59C]/5 dark:bg-[#86A59C]/10 rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">How to Connect:</p>
                  <p className="text-base text-muted-foreground">
                    Residents enter their Strata Plan or LMS number at account creation (links to building), then enter the Vendor Code shared by their service provider (links to company projects). One vendor code per company, reused across all buildings.
                  </p>
                </div>

                <p className="font-semibold text-foreground">What You Unlock:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Project Progress</p>
                      <p className="text-sm text-muted-foreground">Real-time updates on maintenance work at your building</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Photo Evidence</p>
                      <p className="text-sm text-muted-foreground">View before/after photos of completed work</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Feedback Submission</p>
                      <p className="text-sm text-muted-foreground">Report issues with photo evidence directly to the vendor</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Status Tracking</p>
                      <p className="text-sm text-muted-foreground">See when feedback is viewed, responded to, and closed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Direct Communication</p>
                      <p className="text-sm text-muted-foreground">Message the service provider without involving property management</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Viewed Timestamps</p>
                      <p className="text-sm text-muted-foreground">Proof that the vendor acknowledged your submission</p>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-lg p-4 mt-4">
                  <p className="flex items-center gap-2 font-medium text-teal-900 dark:text-teal-100">
                    <RefreshCw className="w-4 h-4" />
                    Portable Account Benefit
                  </p>
                  <p className="text-base text-teal-800 dark:text-teal-200 mt-1">
                    When you move to a new building, update your Strata/LMS number and enter the new vendor's code. Your account history and preferences transfer automatically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Manager to Vendor */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Property Manager to Vendor</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Connection via Vendor Code for portfolio oversight</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">How to Connect:</p>
                  <p className="text-base text-muted-foreground">
                    Property managers enter the Vendor Code to add a service provider to their "My Vendors" dashboard. Each connection gives read-only access to that vendor's compliance information and project portfolio.
                  </p>
                </div>

                <p className="font-semibold text-foreground">What You Unlock:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Company Safety Rating</p>
                      <p className="text-sm text-muted-foreground">View CSR scores with penalty breakdowns and compliance history</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">COI Verification</p>
                      <p className="text-sm text-muted-foreground">Access certificates of insurance with expiry tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Project Portfolio</p>
                      <p className="text-sm text-muted-foreground">View active and completed projects across your buildings</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Resident Feedback</p>
                      <p className="text-sm text-muted-foreground">Read-only access to resident submissions for oversight</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Vendor Comparison</p>
                      <p className="text-sm text-muted-foreground">Compare CSR scores across multiple vendors in your network</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Centralized Dashboard</p>
                      <p className="text-sm text-muted-foreground">All vendor relationships managed from one interface</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <p className="flex items-center gap-2 font-medium text-blue-900 dark:text-blue-100">
                    <Globe className="w-4 h-4" />
                    Multi-Vendor Management
                  </p>
                  <p className="text-base text-blue-800 dark:text-blue-200 mt-1">
                    Property managers can connect to unlimited vendors, building a comprehensive oversight dashboard for all service providers across their portfolio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Building Manager to Building */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Building Manager to Building</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Single-building scope defined at account creation</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-violet-50 dark:bg-violet-950 rounded-lg p-4">
                  <p className="font-semibold text-foreground mb-2">How to Connect:</p>
                  <p className="text-base text-muted-foreground">
                    Building managers create a free account linked to a single building address. This is a fixed connection, unlike the multi-connection model used by other account types.
                  </p>
                </div>

                <p className="font-semibold text-foreground">What You Unlock:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Service History</p>
                      <p className="text-sm text-muted-foreground">Complete maintenance records for your building</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Anchor Documentation</p>
                      <p className="text-sm text-muted-foreground">Rope anchor inspection records and certifications</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Vendor COI Access</p>
                      <p className="text-sm text-muted-foreground">Certificates of insurance from service providers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Safety Ratings</p>
                      <p className="text-sm text-muted-foreground">CSR scores for vendors who have serviced your building</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Project Progress</p>
                      <p className="text-sm text-muted-foreground">Current and upcoming maintenance project status</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Free Account</p>
                      <p className="text-sm text-muted-foreground">No cost for single-building management features</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Problems Solved
            </h2>
            <Button 
              onClick={toggleAllProblems} 
              variant="outline"
              data-testid="button-toggle-all-accordions"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {expandedProblems.length === ALL_PROBLEM_IDS.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            The portable account system solves real problems for every stakeholder in the building maintenance ecosystem.
          </p>

          {/* Technicians */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Wrench className="w-5 h-5 text-[#5C7A84]" />
              <h3 className="text-xl md:text-2xl font-semibold">For Technicians</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="tech-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-tech-1">
                  <span className="font-medium">"I lost all my work history when I changed employers"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Technicians switching companies had to start fresh, with no record of their logged hours, completed projects, or safety certifications from previous employers.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> Marcus worked 3 years for ABC Rope Access, logging 2,400 IRATA hours. When he joined XYZ Services, his new employer had no visibility into his experience.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> The technician account is portable. All logged hours, certifications, and work history stay with Marcus's account. When he connects to XYZ Services, his complete history transfers automatically.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Zero data loss between employers. Continuous certification tracking. Employers see verified work history. PLUS tier technicians connect to multiple employers simultaneously.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-tech-2">
                  <span className="font-medium">"I work for three companies but can only track hours for one"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Freelance and multi-employer technicians had no way to consolidate work hours across different companies into their IRATA logbook.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> Sarah works weekdays for one company and weekends for another, plus occasional shifts for a third. She maintained three separate Excel sheets to track hours.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> PLUS tier technicians connect to unlimited employers. Each employer's logged hours flow into one consolidated account with automatic categorization by company and project.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Single source of truth for certification progression. Exportable work history. No manual hour consolidation. Employers each see only their own projects.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-3" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-tech-3">
                  <span className="font-medium">"My employer went out of business and I lost access to everything"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> When a rope access company closes, technicians lose access to their logged hours, safety documentation, and work history stored in company systems.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> When Delta Rope Access closed suddenly, 12 technicians lost access to 8,000+ combined logged hours stored in the company's spreadsheets.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Technician accounts exist independently of employer accounts. Even if an employer's license lapses or company closes, technicians retain full access to their personal work history.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Career data protection. Exportable records for IRATA assessments. Immediate ability to connect with new employers. No dependency on former employer's data access.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Residents */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Home className="w-5 h-5 text-[#86A59C]" />
              <h3 className="text-xl md:text-2xl font-semibold">For Residents</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="resident-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-resident-1">
                  <span className="font-medium">"I moved buildings and had to create a whole new account"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Most building apps require separate accounts per building, losing feedback history and requiring new setup each time a resident moves.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> Jennifer moved from a condo downtown to one in the suburbs. Both buildings used different vendors, so she had to recreate her entire user profile twice.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Resident accounts are portable. Update your Strata/LMS number and enter the new vendor's code. Your account preferences and history stay intact.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> One account for life. No repeated setup. Consistent user experience across buildings. Drives viral adoption as residents expect the same system at their next building.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="resident-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-resident-2">
                  <span className="font-medium">"I submitted a complaint but have no proof they ever saw it"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Phone calls and emails to property managers or vendors leave no audit trail. Residents can't prove their issue was acknowledged.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> Tom called about a missed window three times over two weeks. Each time the PM said they'd pass it on, but nothing happened and there was no record of his calls.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Feedback submissions generate timestamped records. When the vendor views the submission, a "Viewed" timestamp appears. All communication is logged with visible status changes.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Documented accountability. Proof of acknowledgment. Status transparency from New to Viewed to Closed. No more "he said, she said" disputes.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="resident-3" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-resident-3">
                  <span className="font-medium">"The building switched vendors and I lost visibility into the new project"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> When a building changes rope access vendors, residents connected to the old vendor have no automatic connection to the new one.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> The strata council hired a new window cleaning company. Residents who were tracking progress on the previous vendor's platform had to manually find and connect to the new vendor.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Simply enter the new vendor's code. Your building connection via Strata/LMS number stays the same, only the vendor relationship changes.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Seamless vendor transitions. Building history maintained. No account recreation needed. Immediate access to new vendor's project updates.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Property Managers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl md:text-2xl font-semibold">For Property Managers</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="pm-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-pm-1">
                  <span className="font-medium">"I manage 15 buildings with 8 different vendors, each with different systems"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Property managers juggle multiple vendor portals, each requiring separate logins, different interfaces, and manual tracking of compliance across systems.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> Linda manages a portfolio of high-rises across the city. She had bookmarked 8 different vendor portals and spent hours cross-referencing insurance expiry dates.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> One PM account connects to unlimited vendors via their codes. All vendor information, CSR scores, and compliance data appear in a single "My Vendors" dashboard.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Single pane of glass for all vendors. Comparative CSR scores. Centralized insurance expiry tracking. 80% reduction in vendor management time.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-pm-2">
                  <span className="font-medium">"I have no way to compare vendor safety records before awarding contracts"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Vendor selection was based on price and reputation, with no objective safety metrics to compare between competing companies.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> When bidding a major project, the PM had three quotes. All claimed excellent safety records, but there was no way to verify or compare objectively.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Each connected vendor displays their Company Safety Rating (CSR) with full penalty breakdown. Compare scores side-by-side before making contract decisions.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Objective vendor comparison. Due diligence documentation. Lower liability risk. Data-driven contract awards instead of reputation-based guessing.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Building Managers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Building2 className="w-5 h-5 text-violet-600" />
              <h3 className="text-xl md:text-2xl font-semibold">For Building Managers</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="bm-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-bm-1">
                  <span className="font-medium">"I inherited a building with no maintenance records"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> New building managers often start with zero history, inheriting filing cabinets of disorganized paper records or worse, no records at all.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> Alex took over as building manager and found 15 years of rope access work with no centralized records. He didn't know when anchors were last certified or which vendors had worked on the building.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Once a vendor uses OnRopePro for a building, that service history persists in the global building database. New building managers inherit complete, searchable records.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Immediate historical context. Anchor certification tracking. Vendor performance history. No lost institutional knowledge between managers.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bm-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-bm-2">
                  <span className="font-medium">"I need to verify vendor insurance before they can work on site"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Manually requesting, verifying, and tracking certificates of insurance from every vendor before work starts is time-consuming and error-prone.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> The building's insurance required $5M coverage. The previous manager had accepted a COI that actually only showed $2M, discovered during an audit.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> Building managers see verified COI documents for any vendor connected to their building, with AI-powered expiry extraction and automatic warnings for lapsed or insufficient coverage.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Instant COI verification. Automatic expiry alerts. Reduced liability. No more chasing vendors for paperwork before every project.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Company Owners */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Company Owners</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="owner-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-owner-1">
                  <span className="font-medium">"Good technicians leave and take their work history knowledge with them"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> When experienced technicians leave, companies lose the institutional knowledge of which projects they worked on, their productivity patterns, and safety compliance history.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> When the lead technician retired, the company realized they had no central record of his 400+ completed projects or the specialized techniques he used on difficult buildings.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> All project work is logged at the company level, not just the technician level. When a technician disconnects, their work history on company projects remains in the company's records.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Permanent project documentation. Training data for new hires. Productivity benchmarks. No knowledge loss from turnover.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-owner-2">
                  <span className="font-medium">"I can't verify a new hire's claimed experience"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Technicians claim years of experience, but employers have no way to verify logged hours or work quality from previous employers.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> A candidate claimed 5 years of IRATA experience. After hiring, the owner discovered he had exaggerated his experience level and required extensive retraining.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> When technicians opt into profile visibility, employers can view their verified work history, logged hours by task type, and certifications before making hiring decisions.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Verified hire credentials. Reduced training surprises. Better team composition. Access to qualified talent through the job board.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
                <AccordionTrigger className="text-left" data-testid="accordion-owner-3">
                  <span className="font-medium">"Property managers don't know how seriously we take safety"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p><span className="font-medium text-foreground">The Pain:</span> Companies invest heavily in safety compliance, but have no way to communicate this differentiation to property managers evaluating vendors.</p>
                  <p><span className="font-medium text-foreground">Real Example:</span> The company spent $50K on safety training and new equipment. When competing for a contract, they had no way to objectively demonstrate this investment compared to a competitor with minimal safety protocols.</p>
                  <p><span className="font-medium text-foreground">Solution:</span> The Company Safety Rating (CSR) is visible to all connected property managers. High scores demonstrate documented compliance, creating a competitive advantage in contract bids.</p>
                  <p><span className="font-medium text-foreground">Benefit:</span> Quantified safety reputation. Competitive differentiation. Trust building with PMs. Marketing asset for contract proposals.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* Network Effects */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">The Network Effect</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            The portable account system creates exponential value as adoption grows. Each new connection strengthens the entire network.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Wrench className="w-5 h-5 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">For Technicians</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  More employers on the platform means more connection opportunities, more projects to log, and more portable work history value.
                </p>
                <p className="text-base text-muted-foreground">
                  A technician's account becomes more valuable with each employer connection, creating incentive to advocate for platform adoption.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Home className="w-5 h-5 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">For Residents</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Each building using the platform means the same account works in more places. Residents moving between buildings expect the same system.
                </p>
                <p className="text-base text-muted-foreground">
                  This creates demand pressure on vendors to adopt the platform, driving viral growth from the bottom up.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Briefcase className="w-5 h-5 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">For Property Managers</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  More vendors on the platform means more comparative data, better CSR benchmarking, and more comprehensive portfolio oversight.
                </p>
                <p className="text-base text-muted-foreground">
                  PMs become advocates for vendor adoption to complete their dashboard and simplify their management workflow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Crown className="w-5 h-5 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">For Companies</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  More technicians in the talent pool means better hiring options. More PMs using the platform means more RFP opportunities where CSR scores matter.
                </p>
                <p className="text-base text-muted-foreground">
                  Companies gain competitive advantage as early adopters, building CSR history before competitors.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950 dark:to-blue-950 border-violet-200 dark:border-violet-800">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-violet-900 dark:text-violet-100">
                  Every connection makes every account more valuable
                </p>
                <p className="text-base text-violet-800 dark:text-violet-200">
                  This is the flywheel that drives organic platform growth across the entire building maintenance industry.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* FAQ Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              Frequently Asked Questions
            </h2>
            <Button 
              onClick={toggleAllFaqs} 
              variant="outline"
              size="sm"
              data-testid="button-toggle-all-faqs"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {expandedFaqs.length === ALL_FAQ_IDS.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <Accordion 
            type="multiple" 
            value={expandedFaqs}
            onValueChange={setExpandedFaqs}
            className="space-y-3"
          >
            <AccordionItem value="faq-1" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-1">
                <span className="font-medium">Can a technician disconnect from an employer?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="text-base">
                  Yes. Technicians can disconnect from any employer at any time. Their work history from that employer remains in their personal account. The employer retains project-level records but loses access to the technician's profile and future availability.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-2">
                <span className="font-medium">What happens to my data if I delete my account?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="text-base">
                  Personal account data is deleted. However, project-level records created during your connections remain with the companies or buildings involved, as those are shared business records. For example, a technician's logged hours on a specific project remain in the company's project history.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-3">
                <span className="font-medium">How do residents find their vendor's code?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="text-base">
                  Vendors share their code on project notification materials, in elevator notices, or through property management. Each company has one permanent code used across all their buildings. Property managers and building managers can also share the vendor code with residents.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-4">
                <span className="font-medium">Can employers see where else a technician works?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="text-base">
                  No. Each employer only sees the work history from their own projects. The technician's connections to other employers are private. However, if a technician opts into profile visibility on the job board, employers browsing talent can see aggregate experience levels and certifications.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4 data-[state=open]:bg-white dark:data-[state=open]:bg-white/10">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-5">
                <span className="font-medium">Is there a limit to how many connections I can have?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="text-base">
                  Property managers and residents have no connection limits. Building managers connect to one building by design. Free technician accounts connect to one employer at a time. PLUS tier technicians connect to unlimited employers simultaneously, making it ideal for freelance and multi-employer work arrangements.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
