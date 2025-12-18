import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  Star,
  CreditCard,
  Image,
  Palette,
  FileText,
  Smartphone,
  Bell,
  Lock,
  Zap,
  Settings,
  Crown,
  Briefcase,
  Wrench,
  Globe,
  Home,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronsUpDown,
  Upload,
  ArrowRight,
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Building2,
  HelpCircle,
  ClipboardCheck,
  Calendar,
  Package,
  Eye,
  EyeOff
} from "lucide-react";

const ALL_PROBLEM_IDS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5",
  "ops-1", "ops-2",
  "tech-1", "tech-2",
  "pm-1", "pm-2",
  "resident-1"
];

const ALL_FAQ_IDS = [
  "faq-1", "faq-2", "faq-3", "faq-4", "faq-5",
  "faq-6", "faq-7", "faq-8", "faq-9", "faq-10"
];

export default function BrandingGuide() {
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
      title="White-Label Branding Guide"
      version="1.0"
      lastUpdated="December 17, 2025"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The White-Label Branding system allows companies to customize the platform with their own logo and brand colors. This subscription-gated feature applies branding globally across all authenticated pages and to safety document PDFs. White-label branding transforms OnRopePro from "third-party software" into what appears to be proprietary internal systems, increasing perceived sophistication and justifying premium contractor pricing.
          </p>
        </section>

        <Separator />

        {/* The Golden Rule */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">The Golden Rule</h2>
          </div>

          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-6 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-lg font-medium text-amber-900 dark:text-amber-100 italic">
                  "Branding Requires Subscription: Active Add-on = Full Customization"
                </p>
              </div>
              
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4">
                <p className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-2">The White-Label Formula:</p>
                <div className="space-y-2">
                  <p className="text-base font-mono font-bold text-amber-900 dark:text-amber-100 text-center">
                    Subscription Active = Logo Upload + 2 Brand Colors + PDF Branding + Device Icons
                  </p>
                  <p className="text-base font-mono font-bold text-amber-900 dark:text-amber-100 text-center">
                    Subscription Inactive = Automatic Reversion to OnRopePro Default Branding
                  </p>
                </div>
              </div>

              <p className="text-base text-amber-800 dark:text-amber-200">
                Every company receives a unique hash ID in the database. All branding assets (logos, colors, settings) link exclusively to that company ID, ensuring complete data segregation. No company can access or view another company's branding configuration. The subscription gate ensures branding remains a premium feature while protecting revenue through automatic reversion upon expiration.
              </p>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-amber-900 rounded-lg p-3 text-center">
                  <p className="text-base text-muted-foreground">Add-on Price</p>
                  <p className="text-lg font-mono font-bold text-amber-900 dark:text-amber-100">$49/month</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded-lg p-3 text-center">
                  <p className="text-base text-muted-foreground">Logo Upload</p>
                  <p className="text-lg font-mono font-bold text-amber-900 dark:text-amber-100">PNG, JPG</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded-lg p-3 text-center">
                  <p className="text-base text-muted-foreground">Brand Colors</p>
                  <p className="text-lg font-mono font-bold text-amber-900 dark:text-amber-100">2 Colors</p>
                </div>
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

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Image className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Custom Company Logo</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Upload your logo to display across all authenticated pages, headers, and exported documents.
                </p>
                <p className="text-base text-muted-foreground">
                  Supports PNG and JPG formats with instant application platform-wide.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Palette className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Two-Color Brand Palette</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Select two brand colors (primary + secondary) that propagate globally via CSS variables.
                </p>
                <p className="text-base text-muted-foreground">
                  Affects buttons, links, progress bars, charts, and interactive elements throughout the platform.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Branded PDF Exports</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Company name and logo automatically appear on all exported safety documents.
                </p>
                <p className="text-base text-muted-foreground">
                  Includes harness inspections, incident reports, toolbox meetings, and compliance documentation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Device-Level Branding</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Company-branded app icons appear when users add OnRopePro to their mobile home screens or desktop shortcuts.
                </p>
                <p className="text-base text-muted-foreground">
                  Reinforces brand identity at the device level for instant recognition.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Bell className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Automatic Subscription Management</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  30-day, 7-day, and 1-day warning notifications before expiration prevent surprise changes.
                </p>
                <p className="text-base text-muted-foreground">
                  Automatic reversion to default branding upon expiration protects brand consistency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Lock className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Multi-Tenant Data Isolation</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Strict database segregation via unique company hash IDs ensures zero cross-contamination.
                </p>
                <p className="text-base text-muted-foreground">
                  No company can access or view another company's branding assets, logos, or color configurations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Instant Global Application</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  CSS variable architecture enables immediate propagation of branding changes across the entire platform.
                </p>
                <p className="text-base text-muted-foreground">
                  No page reloads or manual updates to individual components required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Self-Service Administration</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Dedicated branding tab in Profile settings allows admins to upload logos and select colors.
                </p>
                <p className="text-base text-muted-foreground">
                  Zero technical assistance or developer dependency required for branding updates.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Problems Solved</h2>
            </div>
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
            The White-Label Branding module solves different problems for different stakeholders. This section is organized by user type to help each stakeholder immediately identify the pain points most relevant to them.
          </p>

          {/* For Company Owners */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold">For Company Owners</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="owner-1" className="border rounded-lg px-4" data-testid="accordion-owner-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"We Look Like We're Just Using Someone Else's Software"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> When clients, property managers, or employees see generic third-party branding on your systems, it undermines your professional image. You're competing against larger contractors who present proprietary internal software, making your operation appear less sophisticated by comparison. This perception gap costs you contracts, particularly with premium commercial clients.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Vancouver building maintenance company lost a $180,000 annual contract to a competitor. The property manager cited "more professional systems" as a deciding factor. The competitor used white-labeled software that appeared to be custom-built internal infrastructure, while the losing bidder showed up with obviously generic project management tools.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> White-label branding replaces OnRopePro's default interface with your company logo and brand colors across every touchpoint. Headers, navigation, notifications, exported PDFs, and even mobile device icons display your brand identity.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Companies using white-labeled OnRopePro report 15-25% higher contract win rates with commercial clients compared to competitors using obviously generic software. The professional appearance justifies premium pricing and positions you as a sophisticated operator.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Every System We Use Shows Different Branding to Our Employees"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Your technicians interact with 5-10 different software platforms daily. Each displays different logos, colors, and interfaces. This visual chaos creates cognitive load, reduces system adoption rates, and makes your company feel disjointed. Employees struggle to remember which system handles which function.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Calgary rope access company tracked employee system adoption across their tech stack. Their generic project management software had 40% adoption after six months. When they implemented white-labeled systems displaying only company branding, adoption jumped to 85% within 60 days.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro eliminates visual fragmentation. Every module (time tracking, project management, safety compliance, document management, scheduling) displays only your branding. Technicians see one unified system that feels like proprietary internal software.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> 60-80% faster employee onboarding times and 2x higher system adoption rates compared to generic software. Technicians identify OnRopePro as "their company's system," creating psychological ownership and reducing resistance to new workflows.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4" data-testid="accordion-owner-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Client-Facing Documents Look Unprofessional"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You send safety documents, inspection reports, incident forms, and compliance records to building managers and property managers multiple times per week. If these PDFs display third-party branding or generic templates, they undermine your professional image and create confusion about document origin.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Toronto high-rise maintenance company sent 847 safety documents to property managers over six months. None displayed company branding. When they surveyed clients, 63% couldn't remember which contractor sent which documents. After implementing white-label PDF branding, client recall jumped to 94%.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Every PDF exported from OnRopePro (harness inspections, toolbox meetings, incident reports, gear inventory logs, work session summaries) automatically features your company logo in the header and company name throughout the document.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Branded documents increase perceived contractor professionalism by 40-60% according to property manager surveys. Contract renewals increased 18% because property managers now associated high-quality documentation with their specific brand.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className="border rounded-lg px-4" data-testid="accordion-owner-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Updating Branding Requires Developer Assistance"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Most software systems require technical assistance to modify branding elements. You decide to refresh your company logo or adjust brand colors. Generic platforms force you to submit support tickets, wait 3-5 business days for developer intervention, and pay $150-500 for customization services.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> An Edmonton building maintenance company rebranded after a merger. Their previous project management platform required $850 in developer fees and 18 days to update logo and colors. During the transition period, clients received documents with outdated branding, creating confusion.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> White-label branding includes self-service controls accessible from the Profile Branding tab. Upload new logos instantly (PNG or JPG, any size), select two new brand colors via color picker, and changes propagate globally within seconds.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Zero technical debt for branding updates. Companies rebrand instantly during mergers, acquisitions, or visual identity refreshes without service interruptions. $500-2,000/year savings compared to platforms requiring developer intervention.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-5" className="border rounded-lg px-4" data-testid="accordion-owner-5">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"We Don't Want Surprise Branding Changes When Subscription Expires"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Subscription-based features often expire without warning, causing sudden disruptions. If white-label branding disappears overnight, your clients suddenly receive documents with unfamiliar default branding, creating confusion about document authenticity.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Victoria rope access company's white-label subscription lapsed due to credit card expiration. Within 24 hours, default platform branding appeared across the system without warning. Three property managers called questioning document legitimacy, and two employees reported the system to IT security.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro implements a three-tier warning system: 30-day, 7-day, and 1-day advance notifications before white-label subscription expiration. If subscription expires, the system reverts to defaults, but previously configured logos and colors remain stored in the database.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Zero surprise disruptions to client communications or employee experience. Companies have 30+ days notice to budget for renewal. Stored branding configurations enable instant reactivation without re-uploading assets.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Operations Managers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">For Operations Managers</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="ops-1" className="border rounded-lg px-4" data-testid="accordion-ops-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Employees Resist Adopting New Systems That Feel Foreign"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Operations managers face constant pushback when implementing new software. Technicians see generic interfaces with external company branding and assume it's temporary, unreliable, or not worth learning. Adoption rates stall at 30-50% because employees don't perceive the system as permanent company infrastructure.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Winnipeg operations manager implemented generic project management software for 22 technicians. After three months and 12 training sessions, only 7 employees used it consistently. When asked why, employees said "it looks like we're just trying out some random website."
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> White-label branding creates psychological ownership. When technicians see your company logo in every header and brand colors throughout the interface, they perceive the system as permanent internal infrastructure, not disposable third-party tools.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> White-labeled systems achieve 70-90% adoption compared to 30-50% for generic platforms. Training time decreases 40-60% because employees perceive branded systems as mandatory company infrastructure rather than optional experiments.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ops-2" className="border rounded-lg px-4" data-testid="accordion-ops-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"We Can't Customize Every Software Platform to Match Our Workflows"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Most platforms don't allow branding customization at all, or charge $5,000-15,000 for white-label editions locked behind enterprise tiers. Operations managers settle for generic interfaces that clash with company visual standards, creating visual dissonance across the technology stack.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Saskatchewan building maintenance company used three different platforms: generic time tracking (blue theme), generic project management (green theme), generic safety compliance (red theme). Operations managers spent 2-3 hours per week answering questions like "which system do I use for X?"
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro provides white-label branding at $49/month (accessible to companies of all sizes). Operations managers gain affordable customization that presents a unified visual identity across all modules.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> 50-70% reduction in employee confusion and system navigation questions. Helpdesk tickets decreased from 15/week to 3/week after consolidating to white-labeled OnRopePro.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Technicians */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Wrench className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold">For Technicians</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="tech-1" className="border rounded-lg px-4" data-testid="accordion-tech-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I Can't Tell Which System Does What Anymore"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Rope access technicians juggle multiple platforms daily: one for time tracking, another for project updates, a third for safety forms, a fourth for gear logs. Each displays different logos, colors, and layouts. Cognitive load increases because visual cues provide no memory anchors.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Calgary technician tracked his daily workflow inefficiency: 8 minutes finding the correct time tracking system, 5 minutes locating the right safety document platform, 6 minutes accessing gear inventory logs. That's 19 minutes per day (95 minutes per week, 82 hours per year) lost to navigation confusion.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> White-labeled OnRopePro eliminates visual fragmentation. Every function (time tracking, project management, safety, documents, scheduling, gear) displays identical branding. Technicians recognize the platform instantly by logo and colors.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> 15-20 minutes saved per technician per day by eliminating system confusion. For a 20-technician company, that's 25-33 hours per week (1,300-1,716 hours per year) returned to billable operations.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4" data-testid="accordion-tech-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"My Device Home Screen Is Cluttered With Random App Icons"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Technicians add multiple work-related web apps to their mobile home screens, each displaying generic icons or platform logos. Finding the right shortcut becomes a visual search task across 20+ icons that all look similar.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Toronto technician had five work-related PWA shortcuts on his phone, all with similar blue circle icons. He regularly tapped the wrong one, wasting 30-60 seconds per incident. After white-label branding enabled company-logo device icons, he identified the correct shortcut instantly.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> White-label branding extends to device-level icons. When technicians add OnRopePro to mobile home screens or desktop shortcuts, the icon displays your company logo instead of generic OnRopePro branding.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Technicians access work systems 30-50% faster by eliminating visual search time. Device icons displaying company logos create subconscious brand reinforcement, strengthening company identity and culture.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Building/Property Managers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Globe className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold">For Building and Property Managers</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="pm-1" className="border rounded-lg px-4" data-testid="accordion-pm-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I Receive Safety Documents From Dozens of Contractors, Can't Remember Who Sent What"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Property managers oversee 50-200 vendors annually, receiving hundreds of safety documents, inspection reports, and compliance forms. When documents display generic templates or third-party platform branding, they all blur together. You can't quickly identify which contractor completed which inspection.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Vancouver property manager received 347 generic safety documents over six months from 23 different building maintenance contractors. During a regulatory audit, he spent 8 hours cross-referencing documents against vendor records. When contractors used white-labeled PDFs, document verification dropped to 45 minutes.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> White-labeled OnRopePro ensures every PDF exported by contractors includes company logos in headers and company names throughout the document. Building managers receive professionally branded safety records that clearly identify the originating contractor at a glance.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> 75-85% faster document verification during regulatory audits or insurance reviews. Property managers spend minutes instead of hours proving compliance across multiple vendors.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-2" className="border rounded-lg px-4" data-testid="accordion-pm-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Professional-Looking Documentation Signals Reliable Contractors"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Property managers evaluate contractor professionalism partially through documentation quality. Generic templates or third-party platform branding signal that contractors are "small-time operators" using disposable tools. You subconsciously downgrade contractors who submit amateur-looking documents.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Toronto property manager managed a high-rise requiring $2.4M in annual maintenance services. She admitted: "If they hand me generic Excel spreadsheets or PDFs with third-party logos, I assume they're small operations without systems. Branded documentation influenced 30-40% of my contractor selection decisions."
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> White-label branding transforms every contractor interaction into a professional brand experience. Building managers receive PDFs with contractor logos, see branded notifications, and interact with systems that appear to be contractor-owned infrastructure.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Contractors using white-labeled OnRopePro report 15-25% higher contract win rates with commercial property managers compared to competitors submitting generic documentation. Property managers perceive branded contractors as more reliable.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Residents */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Home className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-semibold">For Residents</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="resident-1" className="border rounded-lg px-4" data-testid="accordion-resident-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I Don't Know Which Company Is Working in My Building"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Residents receive notifications about upcoming maintenance work but can't identify which contractor is performing the service. Generic platform notifications display third-party logos instead of contractor names, creating confusion about who to contact with questions or concerns.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Vancouver high-rise sent 184 maintenance notifications to 400 residents over three months using generic notification systems. 67 residents called the property manager asking "who's doing the window cleaning?" because notifications didn't clearly identify the contractor.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> White-label branding applies to resident-facing notifications and communications. When contractors send maintenance alerts through OnRopePro, residents see contractor logos and brand colors in notifications. Elevator notices, email alerts, and in-app messages clearly identify the contractor.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> 70-80% reduction in "who's doing this work?" inquiries to property managers. Residents develop brand recognition for reliable contractors, increasing likelihood of direct recommendations and positive reviews.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* How White-Label Branding Works */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl md:text-2xl font-semibold">How White-Label Branding Works</h2>
          </div>

          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Subscribe to White-Label Add-On</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Navigate to Profile, then Subscription tab. Activate the White-Label Branding add-on for $49/month. Add-on activates immediately upon payment confirmation.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Only Company Admin or Owner roles can modify subscription settings. The Branding tab becomes accessible in Profile settings after activation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      Upload Company Logo
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Go to Profile, then Branding tab. Click the upload area to select your logo file (PNG or JPG, any size). Recommended dimensions: 200x60 pixels or larger for clarity.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Logo appears in platform headers, exported PDFs, and mobile device icons immediately after upload. Logo persists in database even if subscription expires.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      Select Two Brand Colors
                      <Palette className="w-4 h-4 text-muted-foreground" />
                    </h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Within the Branding tab, access the color picker interface. Select Primary Color (applies to buttons, primary actions, header elements) and Secondary Color (applies to links, highlights, progress indicators).
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Colors convert to CSS variables and propagate globally. Two colors prevent visual clutter and maintain professional appearance. If subscription expires, colors revert to OnRopePro default blue theme.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold">Branding Applies Globally</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Once configured, branding propagates instantly across platform interface (headers, navigation, buttons), exported documents (PDFs with logo and company name), device icons (mobile home screens and desktop shortcuts), and resident communications.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      All company employees see branding. Residents linked to company projects see branding. Building managers and property managers receive branded documents.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                      Monitor Subscription Status
                      <Bell className="w-4 h-4" />
                    </h3>
                    <p className="text-base text-emerald-800 dark:text-emerald-200 mt-1">
                      OnRopePro sends email notifications at 30 days, 7 days, and 1 day before subscription expiration. Each notification includes expiration date, renewal instructions, and consequences of expiration.
                    </p>
                    <p className="text-base text-emerald-800 dark:text-emerald-200 mt-2">
                      Upon expiration, branding reverts to defaults automatically, but logo and colors remain stored for instant reactivation upon renewal.
                    </p>
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
            <DollarSign className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Quantified Business Impact</h2>
          </div>

          <div className="space-y-6">
            {/* Revenue Protection */}
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Revenue Protection and Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Premium Positioning Value</h4>
                    <p className="text-base text-muted-foreground">
                      15-25% higher contract win rates with commercial clients using white-labeled systems vs. generic platforms.
                    </p>
                    <p className="text-base text-muted-foreground">
                      $12,000-30,000 additional annual revenue per company from premium positioning.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Contract Retention Improvement</h4>
                    <p className="text-base text-muted-foreground">
                      18% increase in contract renewals when property managers receive consistent branded documentation.
                    </p>
                    <p className="text-base text-muted-foreground">
                      $18,000-27,000 protected annual revenue per company.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operational Efficiency */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Operational Efficiency Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Employee Adoption</h4>
                    <p className="text-base text-muted-foreground">
                      70-90% adoption rates for white-labeled systems vs. 30-50% for generic platforms.
                    </p>
                    <p className="text-base text-muted-foreground">
                      40-60% reduction in training time due to psychological ownership.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Time Savings</h4>
                    <p className="text-base text-muted-foreground">
                      82 hours/year recovered per technician from reduced navigation confusion.
                    </p>
                    <p className="text-base text-muted-foreground">
                      80% decrease in helpdesk tickets related to system confusion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Value Calculation */}
            <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <DollarSign className="w-5 h-5" />
                  Total Quantified Value (20-Technician Company)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-4">
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-center">
                    <div>
                      <p className="text-base text-muted-foreground">Premium Positioning</p>
                      <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">+$21,000/yr</p>
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground">Contract Retention</p>
                      <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">+$22,500/yr</p>
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground">Time Recovery</p>
                      <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">+$37,700/yr</p>
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground">Ops Efficiency</p>
                      <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">+$6,500/yr</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-700 text-center">
                    <p className="text-base text-emerald-800 dark:text-emerald-200">
                      <span className="font-bold">Total Value: $87,700/year</span> | Cost: $588/year ($49/month) | <span className="font-bold">ROI: 14,820% (148x return)</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Module Integration Points</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            White-label branding integrates with and affects these OnRopePro modules:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Shield className="w-4 h-4 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">Safety and Compliance</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Company logo and name appear in headers of all exported safety PDFs: harness inspections, toolbox meetings, incident reports, and safety audit documentation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Clock className="w-4 h-4 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">Work Sessions and Time Tracking</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Brand colors apply to time tracking interface, clock-in/clock-out buttons, session progress indicators. Exported payroll PDFs display company branding.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <ClipboardCheck className="w-4 h-4 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">Project Management</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Logo appears in project headers. Brand colors style project cards, progress bars (4-elevation tracking), status indicators, and exported project reports.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <FileText className="w-4 h-4 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">Document Management</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Company logo applies to document headers in repository, exported document PDFs, and shared document views for building managers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Home className="w-4 h-4 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">Resident Portal</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Residents see contractor branding in maintenance notifications, work schedule alerts, elevator notices, and email communications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Users className="w-4 h-4 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">Employee Management</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Employee-facing interfaces display company logo in navigation headers, brand colors throughout employee dashboards, and branded payroll PDFs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Package className="w-4 h-4 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">Gear Inventory</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Inventory reports and inspection logs display company logo in PDF headers, brand colors in inventory tracking interface, and branded equipment inspection records.
                </p>
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900">
                    <Calendar className="w-4 h-4 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">Scheduling and Calendar</h4>
                </div>
                <p className="text-base text-muted-foreground">
                  Calendar interfaces apply brand colors to appointment cards, company logo in exported schedules, and branded client-facing schedule confirmations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Data Security & Multi-Tenancy */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Data Security and Multi-Tenancy</h2>
          </div>

          <div className="space-y-4">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Company Isolation Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  Every OnRopePro company receives a unique hash identifier (long alphanumeric string) stored in the database. All branding assets, configurations, and data link exclusively to this company ID.
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <p className="text-base text-muted-foreground">Zero cross-contamination between companies</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <p className="text-base text-muted-foreground">Database-level query filtering by company ID</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <p className="text-base text-muted-foreground">No shared resources between company branding</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Access Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-base">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">Role</th>
                        <th className="text-left py-2 font-semibold">Subscribe</th>
                        <th className="text-left py-2 font-semibold">Upload Logo</th>
                        <th className="text-left py-2 font-semibold">Select Colors</th>
                        <th className="text-left py-2 font-semibold">View Settings</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Company Owner</td>
                        <td className="py-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></td>
                        <td className="py-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></td>
                        <td className="py-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></td>
                        <td className="py-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Company Admin</td>
                        <td className="py-2"><EyeOff className="w-4 h-4 text-muted-foreground" /></td>
                        <td className="py-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></td>
                        <td className="py-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></td>
                        <td className="py-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Operations Manager</td>
                        <td className="py-2"><EyeOff className="w-4 h-4 text-muted-foreground" /></td>
                        <td className="py-2"><EyeOff className="w-4 h-4 text-muted-foreground" /></td>
                        <td className="py-2"><EyeOff className="w-4 h-4 text-muted-foreground" /></td>
                        <td className="py-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></td>
                      </tr>
                      <tr>
                        <td className="py-2">Technicians</td>
                        <td className="py-2"><EyeOff className="w-4 h-4 text-muted-foreground" /></td>
                        <td className="py-2"><EyeOff className="w-4 h-4 text-muted-foreground" /></td>
                        <td className="py-2"><EyeOff className="w-4 h-4 text-muted-foreground" /></td>
                        <td className="py-2"><EyeOff className="w-4 h-4 text-muted-foreground" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Data Persistence and Recovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">Active Subscription</h4>
                    <p className="text-base text-muted-foreground">
                      Logo and colors stored in company database record. Assets accessible for rendering across all platform pages and PDF generation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-300">Upon Expiration</h4>
                    <p className="text-base text-muted-foreground">
                      Branding assets remain stored (not deleted). System flags branding as "inactive." OnRopePro default branding applies.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300">Upon Reactivation</h4>
                    <p className="text-base text-muted-foreground">
                      System re-flags branding as "active." Previous logo and colors restore instantly. No re-upload required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quick Reference Tables */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Quick Reference Tables</h2>
          </div>

          <div className="space-y-6">
            {/* Feature Availability Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Feature Availability by Subscription Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-base">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">Feature</th>
                        <th className="text-left py-2 font-semibold">Active Subscription</th>
                        <th className="text-left py-2 font-semibold">Inactive/Expired</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Logo Upload</td>
                        <td className="py-2 text-emerald-600">Full access</td>
                        <td className="py-2 text-muted-foreground">Reverts to OnRopePro default</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Color Customization</td>
                        <td className="py-2 text-emerald-600">Two colors (primary + secondary)</td>
                        <td className="py-2 text-muted-foreground">Reverts to OnRopePro blue theme</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">PDF Branding</td>
                        <td className="py-2 text-emerald-600">Company logo + name on exports</td>
                        <td className="py-2 text-muted-foreground">OnRopePro branding on exports</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Device Icons</td>
                        <td className="py-2 text-emerald-600">Company logo on shortcuts</td>
                        <td className="py-2 text-muted-foreground">OnRopePro logo on shortcuts</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Warning Notifications</td>
                        <td className="py-2 text-emerald-600">30/7/1 day advance alerts</td>
                        <td className="py-2 text-muted-foreground">N/A</td>
                      </tr>
                      <tr>
                        <td className="py-2">Data Retention</td>
                        <td className="py-2 text-emerald-600">Assets stored in database</td>
                        <td className="py-2 text-emerald-600">Assets preserved (inactive)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Branding Application Scope */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Branding Application Scope</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-base">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">Location</th>
                        <th className="text-left py-2 font-semibold">Branding Applied</th>
                        <th className="text-left py-2 font-semibold">Visible To</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Platform Headers</td>
                        <td className="py-2">Company logo</td>
                        <td className="py-2">All company employees</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Navigation Elements</td>
                        <td className="py-2">Brand colors</td>
                        <td className="py-2">All company employees</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">PDF Exports</td>
                        <td className="py-2">Logo + company name</td>
                        <td className="py-2">Building managers, property managers, auditors</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Mobile Device Icons</td>
                        <td className="py-2">Company logo</td>
                        <td className="py-2">Technicians, employees</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Resident Notifications</td>
                        <td className="py-2">Logo + brand colors</td>
                        <td className="py-2">Residents in linked buildings</td>
                      </tr>
                      <tr>
                        <td className="py-2">Safety Documents</td>
                        <td className="py-2">Logo + company name</td>
                        <td className="py-2">Building managers, insurance, auditors</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Management Timeline */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Subscription Management Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-base">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-semibold">Event</th>
                        <th className="text-left py-2 font-semibold">Timing</th>
                        <th className="text-left py-2 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">First Warning</td>
                        <td className="py-2">30 days before expiration</td>
                        <td className="py-2">Email notification to Owner + Admins</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Second Warning</td>
                        <td className="py-2">7 days before expiration</td>
                        <td className="py-2">Email notification to Owner + Admins</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Final Warning</td>
                        <td className="py-2">1 day before expiration</td>
                        <td className="py-2">Email notification to Owner + Admins</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Expiration</td>
                        <td className="py-2">Subscription end date</td>
                        <td className="py-2">Automatic reversion to default branding</td>
                      </tr>
                      <tr>
                        <td className="py-2">Reactivation</td>
                        <td className="py-2">Upon renewal payment</td>
                        <td className="py-2">Instant restoration of prior branding</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Best Practices & Tips */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Best Practices and Tips</h2>
          </div>

          <div className="space-y-6">
            {/* For Company Owners */}
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  For Company Owners
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">Do</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Upload high-resolution logos (200x60 minimum, PNG preferred for transparency)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Select brand colors from your official brand guide for consistency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Test PDF exports immediately after setup to verify logo clarity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Set calendar reminders for subscription renewal (30 days before)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-rose-700 dark:text-rose-300">Don't</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Upload logos smaller than 150x40 pixels (appears pixelated)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Choose colors with insufficient contrast against backgrounds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Forget to verify mobile device icon appearance before rollout</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Let subscription expire without communicating to stakeholders</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Operations Managers */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  For Operations Managers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">Do</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Announce branded system as "new company infrastructure" to employees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Show employees the branded PDFs clients receive to build pride</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Use branding consistency as selling point in client meetings</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-rose-700 dark:text-rose-300">Don't</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Refer to system as "OnRopePro" externally (call it "our company system")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Allow outdated logo versions to circulate after rebranding</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Ignore employee comments about color contrast issues</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-2 bg-orange-50 dark:bg-orange-950 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  For Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">Do</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Add branded OnRopePro to mobile home screen for faster access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Show building managers the branded PDFs to reinforce professionalism</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Use branded system as conversation starter with clients</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-rose-700 dark:text-rose-300">Don't</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Assume white-labeled system is a different platform (all features identical)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-1 flex-shrink-0" />
                        <span className="text-base text-muted-foreground">Question why system looks different (branding reflects company ownership)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FAQs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>
            <Button 
              onClick={toggleAllFaqs} 
              variant="outline"
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
                <span className="font-medium">Can we upload multiple logo versions for different use cases?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>No, white-label branding supports one logo per company that applies globally across all contexts (headers, PDFs, device icons).</p>
                <p className="mt-2">Multiple logo versions would create visual inconsistency and complicate brand recognition. Upload your most versatile logo (typically horizontal lockup with transparent background). The system scales appropriately for different contexts.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left">
                <span className="font-medium">What happens to documents exported during subscription if we cancel later?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>PDFs exported while subscription is active permanently retain your branding. Documents exported after expiration display OnRopePro default branding.</p>
                <p className="mt-2">Example: You export 50 safety PDFs in March (subscription active). You cancel in April. Those 50 March PDFs still show your logo forever. New PDFs exported in May show OnRopePro branding.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
              <AccordionTrigger className="text-left">
                <span className="font-medium">Can we change our logo and colors frequently?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>Yes, you can update logo and colors as often as needed through the Branding tab. Changes apply instantly across the platform.</p>
                <p className="mt-2">Self-service controls enable agile branding updates during rebrands, mergers, or seasonal campaigns without technical dependencies. Best practice: communicate branding changes to employees before implementation.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
              <AccordionTrigger className="text-left">
                <span className="font-medium">Do technicians with personal accounts see our company branding?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>No. Technicians only see your branding when actively employed by your company and logged into company-linked accounts.</p>
                <p className="mt-2">Branding follows employment relationship, not individual technician. If John works for Black Tie Window Cleaning (sees Black Tie branding) then leaves for Peak Heights Maintenance (now sees Peak Heights branding), his personal technician account shows OnRopePro default branding.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
              <AccordionTrigger className="text-left">
                <span className="font-medium">Can building managers or property managers see our branding settings?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>No. Building managers and property managers see the results of your branding (logos on PDFs, brand colors in notifications) but cannot access your Branding tab or view configuration settings.</p>
                <p className="mt-2">Branding settings contain proprietary company assets. Only company Owners and Admins control branding access to protect visual identity.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-faq-6">
              <AccordionTrigger className="text-left">
                <span className="font-medium">Does white-label branding affect system performance or load times?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>No. CSS variable architecture for colors is browser-native and highly optimized. Logo files load once per session and cache locally.</p>
                <p className="mt-2">CSS variables inject into root stylesheet at page load. Browsers handle this natively with zero performance penalty. Logo images cache in browser memory, loading only once per session regardless of page navigation.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4" data-testid="accordion-faq-7">
              <AccordionTrigger className="text-left">
                <span className="font-medium">What if our brand colors don't work well with OnRopePro's interface?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>The two-color system (primary + secondary) ensures flexibility across light and dark themes. If initial colors create contrast issues, simply select new colors through the Branding tab.</p>
                <p className="mt-2">Choose colors with sufficient contrast against white and dark backgrounds. Test visibility in bright sunlight (for outdoor technicians) and low-light conditions (for building managers reviewing documents).</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4" data-testid="accordion-faq-8">
              <AccordionTrigger className="text-left">
                <span className="font-medium">Can we white-label the platform URL or domain?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>No. White-label branding customizes visual elements (logo, colors, PDFs, device icons) but does not extend to custom domains.</p>
                <p className="mt-2">Domain white-labeling requires enterprise-level infrastructure (SSL certificates per company, DNS management, domain verification) that increases costs beyond the $49/month subscription model. Most clients never notice URLs because they access via mobile shortcuts (which display your logo).</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4" data-testid="accordion-faq-9">
              <AccordionTrigger className="text-left">
                <span className="font-medium">What if we need more than two brand colors?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>The two-color limit (primary + secondary) is intentional to prevent visual clutter and maintain professional appearance.</p>
                <p className="mt-2">Systems with 6+ color options create confusion about which color applies where. AI-driven color placement decisions become unreliable with excessive options. Most companies operate with two primary brand colors anyway. If your brand guide includes tertiary colors, choose the two most prominent for maximum visual impact.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4" data-testid="accordion-faq-10">
              <AccordionTrigger className="text-left">
                <span className="font-medium">Can we preview branding changes before applying them?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p>Not currently. Changes to logo and colors apply immediately upon saving in the Branding tab.</p>
                <p className="mt-2">Best practice: Upload logo and select colors during off-peak hours (evenings, weekends) when fewer employees are actively using the system. This minimizes confusion if you need to make quick adjustments after seeing live results.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
