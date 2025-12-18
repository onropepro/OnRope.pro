<<<<<<< HEAD
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
=======
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
>>>>>>> fad8522ff5f3c85d941ba0a5e375bc7a5c5b7101
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
  Globe,
  Crown,
  Key,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronsUpDown,
  Target,
  Zap,
  HelpCircle,
  Building2,
  Shield,
  Clock,
  MessageSquare,
  TrendingUp,
  Upload,
  Eye,
  Search,
  BarChart3,
  FileText,
  Lock,
  Users,
  Layers,
  ArrowRight
} from "lucide-react";

const ALL_PROBLEM_IDS = [
  "pm-1", "pm-2", "pm-3", "pm-4", "pm-5", "pm-6",
  "owner-1", "owner-2"
];

const ALL_FAQ_IDS = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5"];

export default function PropertyManagerGuide() {
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
      title="Property Manager Interface Guide"
      version="2.0"
      lastUpdated="December 17, 2025"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Property Manager Interface provides a <strong>dedicated "My Vendors" dashboard</strong> where property managers can view their contracted rope access companies, access company information, and monitor safety compliance through the Company Safety Rating (CSR) system. Property managers have read-only access to vendor data, with one exception: uploading annual anchor inspection certificates per building.
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
                  READ(all vendor data) + WRITE(anchor inspection certificates only)
                </p>
              </div>

              <div className="space-y-3 text-amber-800 dark:text-amber-200">
                <p className="text-base">
                  Property managers have <strong>read-only access to vendor data</strong>, with ONE write capability: <strong>uploading annual anchor inspection certificates per building</strong>.
                </p>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-4">
                <p className="font-semibold flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <AlertTriangle className="w-4 h-4" />
                  Why This Matters
                </p>
                <p className="mt-2 text-base text-amber-800 dark:text-amber-200">
                  This balance gives property managers full transparency into vendor safety and performance while maintaining data integrity. They can verify compliance without risk of accidentally modifying operational records. The single write permission for anchor inspections acknowledges that building owners, not vendors, often receive these third-party inspection certificates.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Can View</p>
                  <p className="font-bold text-amber-900 dark:text-amber-100">CSR Scores</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Yes</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Can View</p>
                  <p className="font-bold text-amber-900 dark:text-amber-100">Feedback History</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Yes</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Can Upload</p>
                  <p className="font-bold text-amber-900 dark:text-amber-100">Anchor Certs</p>
                  <p className="text-lg font-mono text-green-700 dark:text-green-300">Yes</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Can Edit</p>
                  <p className="font-bold text-amber-900 dark:text-amber-100">Anything Else</p>
                  <p className="text-lg font-mono text-red-700 dark:text-red-300">No</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Critical Liability Disclaimer */}
        <section className="space-y-4">
          <Card className="border-2 border-rose-400 bg-rose-50 dark:bg-rose-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-rose-900 dark:text-rose-100">
                <AlertTriangle className="w-5 h-5" />
                Important: Liability and Insurance Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-rose-800 dark:text-rose-200">
              <p className="text-base">
                The Property Manager Interface provides transparency into vendor safety compliance, but <strong>OnRopePro does not guarantee vendor safety practices.</strong> Property managers remain responsible for:
              </p>
              
              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex items-start gap-2 bg-white dark:bg-rose-900/50 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-medium text-rose-900 dark:text-rose-100">Independent Verification</p>
                    <p className="text-base">Verify vendors beyond CSR scores through your own due diligence processes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white dark:bg-rose-900/50 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-medium text-rose-900 dark:text-rose-100">Contract Requirements</p>
                    <p className="text-base">Establish contract-level safety requirements with your vendors.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white dark:bg-rose-900/50 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-medium text-rose-900 dark:text-rose-100">Insurance Verification</p>
                    <p className="text-base">Confirm insurance verification and coverage independently.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white dark:bg-rose-900/50 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-medium text-rose-900 dark:text-rose-100">Regulatory Compliance</p>
                    <p className="text-base">Ensure compliance with local building codes and regulations.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-rose-900/50 rounded-lg p-4 text-center">
                <p className="text-base font-semibold text-rose-900 dark:text-rose-100">
                  CSR scores provide visibility, not liability transfer. Consult with qualified insurance and legal professionals regarding vendor management responsibilities.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Key Features Summary</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">My Vendors Dashboard</p>
                  <p className="text-base text-muted-foreground">Central hub displaying all contracted rope access companies with CSR scores, company cards, and quick access to details.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">CSR Visibility</p>
                  <p className="text-base text-muted-foreground">Three compliance percentages: documentation completeness, toolbox meeting frequency, and harness inspection rates.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Upload className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Anchor Inspection Upload</p>
                  <p className="text-base text-muted-foreground">One write permission for annual anchor inspection certificates per building. All other data remains read-only.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Response Time Metrics</p>
                  <p className="text-base text-muted-foreground">Average resolution time and feedback response rates per vendor for performance evaluation.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Key className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Property Manager Code</p>
                  <p className="text-base text-muted-foreground">Secure access system with building-level permissions. One code per company covers all property managers.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">CSR Trend Tracking</p>
                  <p className="text-base text-muted-foreground">Historical improvement or decline visibility to monitor vendor safety trajectory over time.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Feedback History</p>
                  <p className="text-base text-muted-foreground">Per-building complaint and response tracking with complete communication audit trails.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Risk Mitigation</p>
                  <p className="text-base text-muted-foreground">Documented safety due diligence for insurance and liability protection purposes.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Problems Solved</h2>
            </div>
            <Button
              onClick={toggleAllProblems}
              variant="outline"
              size="sm"
              data-testid="button-toggle-all-accordions"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {expandedProblems.length === ALL_PROBLEM_IDS.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            The Property Manager Interface module solves different problems for property managers and rope access company owners. This section is organized by stakeholder type.
          </p>

          {/* For Property Managers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Globe className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold">For Property Managers</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="pm-1" className="border rounded-lg px-4" data-testid="accordion-pm-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I need to know if my vendors are actually following safety protocols"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Property managers contract rope access companies for building maintenance but have zero visibility into whether those companies are following safety procedures. When accidents happen, property managers face liability questions: "Did you verify your contractor's safety compliance?"
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A property manager hires a rope access company based on lowest bid. Six months later, a technician falls. Insurance company asks: "What due diligence did you perform on this vendor's safety record?" The property manager has nothing documented.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Company Safety Rating (CSR) displays three compliance percentages: documentation completeness, toolbox meeting frequency, and harness inspection rates. Property managers see exactly where each vendor stands on safety.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Documented evidence of vendor safety due diligence. Clear comparison between vendors. Protection in liability situations.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-2" className="border rounded-lg px-4" data-testid="accordion-pm-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I manage dozens of buildings with different vendors. I need one place to see everything."</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Property managers often manage 50 to 70+ buildings serviced by multiple rope access companies. Finding which company services which building requires digging through contracts, emails, or calling around.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A strata manager receives a resident complaint about rope access work. Which company is working on that building? They spend 20 minutes searching emails before finding the answer.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> My Vendors Dashboard centralizes all contracted rope access companies. View all vendors, see their buildings, access project details, and check safety ratings from one screen.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Instant visibility into all vendor relationships. Quick access to contact information and project status.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-3" className="border rounded-lg px-4" data-testid="accordion-pm-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I need to compare vendor safety ratings to make informed decisions"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> When selecting between rope access vendors, property managers typically have only price to compare. Safety record comparison requires manually calling references or accepting vendor claims at face value.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> Two vendors submit bids within $200 of each other. Without safety data, the property manager picks the lower bid. That vendor has poor safety practices the property manager could not verify.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR scores visible on vendor cards allow instant safety comparison. An 86% CSR vendor versus a 23% CSR vendor becomes an obvious choice.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Objective vendor comparison beyond price. Risk mitigation through data-driven vendor selection.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-4" className="border rounded-lg px-4" data-testid="accordion-pm-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Vendors do not respond to complaints and I have no way to track it"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> When residents complain about rope access work (streaks, missed windows, equipment noise), property managers relay complaints to vendors. Without tracking, there is no way to know if complaints are addressed or how long resolution takes.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A resident reports streaky windows three times. The property manager forwards each complaint but has no visibility into whether the vendor responded or fixed the issue.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Feedback history per building shows all complaints and responses. Average resolution time metric reveals how responsive each vendor actually is.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Accountability for vendor responsiveness. Data to support vendor performance conversations or contract decisions.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-5" className="border rounded-lg px-4" data-testid="accordion-pm-5">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I need to upload anchor inspection certificates but do not want vendors editing them"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Annual anchor inspections are required for rope access work. The certificate needs to be on file per building, but who uploads it? Giving vendors full edit access creates data integrity risks.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> Property manager receives annual anchor inspection certificate from third-party inspector. Needs to attach it to the building record. Does not want to give the inspection document to the vendor to upload.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Property managers have ONE write permission: uploading anchor inspection certificates per building. All other data remains read-only.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Secure document management. Property managers control inspection documentation. Audit trail maintained.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-6" className="border rounded-lg px-4" data-testid="accordion-pm-6">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I need controlled access, but only to my specific buildings and vendors"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Different property managers handle different portfolios. They should not see each other's vendors or buildings. But setting up individual access for each property manager is administratively complex.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A strata management company has 5 property managers each handling different portfolios. Each needs access only to their specific buildings and the vendors servicing them.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Property Manager Code system allows controlled access. Company provides one code to each property manager. Property manager creates account and specifies which buildings they manage.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Clean access separation. Simple onboarding. Company knows who has access.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Company Owners */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold">For Rope Access Company Owners</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="owner-1" className="border rounded-lg px-4" data-testid="accordion-owner-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I want to show property managers our safety record without giving them system access"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Rope access companies invest heavily in safety compliance but have no way to demonstrate this to property managers without manually creating reports or giving inappropriate system access.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A company owner wants to win a contract based on their excellent safety record. They create a PowerPoint presentation with screenshots of their safety documentation. It looks unprofessional and takes hours.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Property Manager Interface gives clients read-only access to your CSR score and compliance breakdown. They see your professionalism without accessing operational data.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Professional presentation of safety compliance. Competitive differentiation. Time saved on manual reporting.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Property managers keep asking for safety documentation updates"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Property managers periodically request proof of safety compliance. Responding to these requests takes administrative time and creates version control issues.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> Three different property managers ask for current insurance and safety documentation in the same week. Office staff spends hours gathering, formatting, and emailing documents.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR scores update automatically. Property managers can check compliance status anytime without requesting documents. Self-serve transparency eliminates administrative requests.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Eliminated repetitive documentation requests. Property managers have 24/7 access to compliance visibility.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* Permissions Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Permissions Matrix</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            Property managers have carefully scoped permissions to maximize transparency while protecting data integrity.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                  Allowed Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>View vendor list</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>View CSR scores</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>View feedback history</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>View response times</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Upload anchor inspection certificates</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-rose-900 dark:text-rose-100">
                  <XCircle className="w-5 h-5" />
                  Blocked Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Edit company information</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>View employee personal details</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>View financial data</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Modify safety records</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>View individual safety documents</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* System Architecture */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl md:text-2xl font-semibold">System Architecture</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            The Property Manager Interface consists of three primary components:
          </p>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  1. My Vendors Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Central hub displaying all contracted rope access companies.</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-base text-muted-foreground">
                  <li>Company cards with summary information</li>
                  <li>CSR score display on vendor cards</li>
                  <li>Quick access to company details</li>
                  <li>Search and filter vendors</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  2. Company Safety Rating (CSR) Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Rating system showing compliance status through percentage breakdowns.</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-base text-muted-foreground">
                  <li><strong>Documentation Percentage:</strong> Safety forms and certificates completeness</li>
                  <li><strong>Toolbox Meeting Percentage:</strong> Pre-work safety meetings conducted</li>
                  <li><strong>Harness Inspection Percentage:</strong> Equipment inspection compliance</li>
                </ul>
                <p className="text-base text-muted-foreground mt-2">
                  <strong>Important:</strong> Property managers see percentages only, not the underlying calculation formula or individual documents.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  3. Read-Only Company View
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base text-muted-foreground">Detailed company information accessible without edit capabilities (except anchor inspection upload).</p>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="font-medium text-base mb-1">Viewable Information:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-base text-muted-foreground">
                      <li>CSR score and breakdown</li>
                      <li>Average resolution/response time</li>
                      <li>Resident access code</li>
                      <li>Property manager code</li>
                      <li>Buildings for active projects</li>
                      <li>Feedback history per building</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-base mb-1">NOT Viewable:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-base text-muted-foreground">
                      <li>Individual employee details</li>
                      <li>Employee certifications</li>
                      <li>Safety documents (just indicators)</li>
                      <li>Financial data</li>
                      <li>Employee personal information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Step-by-Step Workflows */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <ArrowRight className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Step-by-Step Workflows</h2>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 1</Badge>
                  <CardTitle className="text-lg font-semibold">View Vendor CSR</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Navigate to My Vendors</p>
                      <p className="text-base text-muted-foreground">Access from dashboard or sidebar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Select vendor company</p>
                      <p className="text-base text-muted-foreground">Click on company card to view details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">View CSR breakdown</p>
                      <p className="text-base text-muted-foreground">See overall score</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium">Review compliance categories</p>
                      <p className="text-base text-muted-foreground">View documentation, toolbox meeting, and harness inspection percentages</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 2</Badge>
                  <CardTitle className="text-lg font-semibold">Compare Vendors</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">View all vendors</p>
                      <p className="text-base text-muted-foreground">My Vendors dashboard shows all contracted companies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Compare CSR scores</p>
                      <p className="text-base text-muted-foreground">Scores visible on each vendor card</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Review individual details</p>
                      <p className="text-base text-muted-foreground">Click into companies for detailed breakdown</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 3</Badge>
                  <CardTitle className="text-lg font-semibold">Upload Anchor Inspection Certificate</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Navigate to specific building</p>
                      <p className="text-base text-muted-foreground">Find the building in vendor's project list</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">Access project details</p>
                      <p className="text-base text-muted-foreground">Enter the project view</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Upload certificate</p>
                      <p className="text-base text-muted-foreground">Attach the annual anchor inspection certificate</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium">Confirm upload</p>
                      <p className="text-base text-muted-foreground">Document is now on file for that building</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Workflow 4</Badge>
                  <CardTitle className="text-lg font-semibold">Review Feedback History</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <p className="font-medium">Select vendor company</p>
                      <p className="text-base text-muted-foreground">From My Vendors dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <p className="font-medium">View building list</p>
                      <p className="text-base text-muted-foreground">See all buildings serviced by this vendor</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <p className="font-medium">Select specific building</p>
                      <p className="text-base text-muted-foreground">Access building details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                    <div>
                      <p className="font-medium">Review feedback</p>
                      <p className="text-base text-muted-foreground">See complaint history and responses</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">5</div>
                    <div>
                      <p className="font-medium">Check response time</p>
                      <p className="text-base text-muted-foreground">View average resolution metrics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quantified Business Impact */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Quantified Business Impact</h2>
          </div>

          <div className="space-y-4">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  For Property Managers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-base">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-semibold">Metric</th>
                        <th className="text-left py-2 pr-4 font-semibold">Current State</th>
                        <th className="text-left py-2 pr-4 font-semibold">With OnRopePro</th>
                        <th className="text-left py-2 font-semibold">Improvement</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2 pr-4">Time to find vendor safety info</td>
                        <td className="py-2 pr-4">20-30 min</td>
                        <td className="py-2 pr-4">30 seconds</td>
                        <td className="py-2 text-emerald-600 font-medium">98% reduction</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Vendor comparison data points</td>
                        <td className="py-2 pr-4">Price only</td>
                        <td className="py-2 pr-4">Price + CSR + Response Time</td>
                        <td className="py-2 text-emerald-600 font-medium">3x more data</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Liability documentation</td>
                        <td className="py-2 pr-4">None</td>
                        <td className="py-2 pr-4">Always current</td>
                        <td className="py-2 text-emerald-600 font-medium">Full coverage</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Response time visibility</td>
                        <td className="py-2 pr-4">Unknown</td>
                        <td className="py-2 pr-4">Real-time metrics</td>
                        <td className="py-2 text-emerald-600 font-medium">Full transparency</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  For Rope Access Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-base">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-semibold">Metric</th>
                        <th className="text-left py-2 pr-4 font-semibold">Current State</th>
                        <th className="text-left py-2 pr-4 font-semibold">With OnRopePro</th>
                        <th className="text-left py-2 font-semibold">Improvement</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2 pr-4">Safety report requests/month</td>
                        <td className="py-2 pr-4">5-10</td>
                        <td className="py-2 pr-4">0</td>
                        <td className="py-2 text-amber-600 font-medium">100% elimination</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Time spent on compliance reports</td>
                        <td className="py-2 pr-4">2-4 hours/month</td>
                        <td className="py-2 pr-4">0</td>
                        <td className="py-2 text-amber-600 font-medium">Full automation</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Competitive differentiation</td>
                        <td className="py-2 pr-4">Hard to prove</td>
                        <td className="py-2 pr-4">Visible CSR</td>
                        <td className="py-2 text-amber-600 font-medium">Quantified advantage</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Customer Journey */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Customer Journey</h2>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950 dark:to-cyan-950 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">1</div>
                <div className="text-center">
                  <p className="font-semibold text-base">Login</p>
                  <p className="text-base text-muted-foreground">Property Manager account</p>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 md:mx-2 rotate-90 md:rotate-0" />

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">2</div>
                <div className="text-center">
                  <p className="font-semibold text-base">My Vendors</p>
                  <p className="text-base text-muted-foreground">View all contracted vendors</p>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 md:mx-2 rotate-90 md:rotate-0" />

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">3</div>
                <div className="text-center">
                  <p className="font-semibold text-base">Check CSR</p>
                  <p className="text-base text-muted-foreground">Review safety ratings</p>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 md:mx-2 rotate-90 md:rotate-0" />

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">4</div>
                <div className="text-center">
                  <p className="font-semibold text-base">Compare Vendors</p>
                  <p className="text-base text-muted-foreground">Objective comparison data</p>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 md:mx-2 rotate-90 md:rotate-0" />

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">5</div>
                <div className="text-center">
                  <p className="font-semibold text-base">Make Decision</p>
                  <p className="text-base text-muted-foreground">Informed vendor selection</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* FAQs Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>
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
            <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-faq-1">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"Can property managers see individual safety documents?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p className="text-base">
                  <strong>No.</strong> Property managers see CSR percentages indicating compliance levels, not individual safety documents. This provides transparency without exposing operational details.
                </p>
                <p className="text-base">
                  They do not see harness inspection forms, toolbox meeting records, or safety certificates. They see the aggregate percentage that indicates how compliant the vendor is in each category.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"What is the only thing property managers can edit?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p className="text-base">
                  <strong>Anchor inspection certificates.</strong> Property managers can upload the annual anchor inspection certificate for each building they manage. Everything else is read-only.
                </p>
                <p className="text-base">
                  This single write permission exists because building owners, not vendors, typically receive these third-party inspection certificates.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"How does the Property Manager Code work?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p className="text-base">
                  Companies generate <strong>one code</strong> that can be given to all property managers. Each property manager creates their account using this code, then specifies which buildings they manage.
                </p>
                <p className="text-base">
                  The company knows who has linked because they provided the code. Building-level access is determined by the property manager during setup.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"Can property managers see which technicians work on their buildings?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p className="text-base">
                  <strong>No.</strong> Property managers do not see individual employee information or certifications. They see CSR scores (aggregate safety compliance), project progress, and building-specific information.
                </p>
                <p className="text-base">
                  This protects employee privacy while still providing property managers with the compliance visibility they need for vendor evaluation.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"Is response time really more important than CSR?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p className="text-base">
                  <strong>For many property managers, yes.</strong> Response time to resident complaints often matters more to property managers than safety compliance scores.
                </p>
                <p className="text-base">
                  Both metrics provide valuable vendor evaluation data. CSR shows safety compliance, while response time shows customer service quality. OnRopePro displays both to give property managers complete vendor performance visibility.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Summary */}
        <section className="space-y-4">
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Why Property Manager Interface Is Different</h3>
              <p className="text-base text-muted-foreground mb-4">
                Most vendor management tools treat property managers as afterthoughts. OnRopePro recognizes that property managers are a critical node in the rope access ecosystem, connecting:
              </p>
              <div className="grid md:grid-cols-5 gap-3">
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                  <Building2 className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                  <p className="font-medium text-base">Buildings</p>
                  <p className="text-base text-muted-foreground">Assets requiring maintenance</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
                  <p className="font-medium text-base">Vendors</p>
                  <p className="text-base text-muted-foreground">Companies doing work</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-1 text-cyan-500" />
                  <p className="font-medium text-base">Residents</p>
                  <p className="text-base text-muted-foreground">People affected</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                  <Shield className="w-6 h-6 mx-auto mb-1 text-amber-500" />
                  <p className="font-medium text-base">Insurance</p>
                  <p className="text-base text-muted-foreground">Liability protection</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-violet-500" />
                  <p className="font-medium text-base">Compliance</p>
                  <p className="text-base text-muted-foreground">Safety standards</p>
                </div>
              </div>
              <p className="text-base text-muted-foreground mt-4 text-center font-medium">
                When you give property managers visibility, you are not just providing a dashboard. You are creating transparent accountability that benefits everyone: safer work for technicians, better vendor selection for property managers, and documented compliance for companies.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
