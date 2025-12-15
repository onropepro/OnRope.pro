import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HardHat,
  User,
  Award,
  MapPin,
  CreditCard,
  Gift,
  Star,
  Shield,
  Bell,
  Building2,
  FileText,
  Eye,
  CheckCircle2,
  Info,
  Link2,
  BarChart3,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  AlertTriangle,
  Lock,
  Target,
  ChevronsUpDown,
  Crown,
  Search,
  FileCheck,
  ClipboardCheck,
  Database,
  Workflow,
  BookOpen,
  HelpCircle,
  XCircle,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

export default function TechnicianRegistrationGuide() {
  const [expandedTechProblems, setExpandedTechProblems] = useState<string[]>([]);
  const [expandedOwnerProblems, setExpandedOwnerProblems] = useState<string[]>([]);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);

  const allTechProblemIds = ["tech-1", "tech-2", "tech-3", "tech-4", "tech-5", "tech-6"];
  const allOwnerProblemIds = ["owner-7", "owner-8", "owner-9", "owner-10", "owner-11", "pm-12"];
  const allFaqIds = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6"];

  const toggleAllTechProblems = () => {
    if (expandedTechProblems.length === allTechProblemIds.length) {
      setExpandedTechProblems([]);
    } else {
      setExpandedTechProblems(allTechProblemIds);
    }
  };

  const toggleAllOwnerProblems = () => {
    if (expandedOwnerProblems.length === allOwnerProblemIds.length) {
      setExpandedOwnerProblems([]);
    } else {
      setExpandedOwnerProblems(allOwnerProblemIds);
    }
  };

  const toggleAllFaqs = () => {
    if (expandedFaqs.length === allFaqIds.length) {
      setExpandedFaqs([]);
    } else {
      setExpandedFaqs(allFaqIds);
    }
  };

  return (
    <ChangelogGuideLayout
      title="Technician Passport Guide"
      version="1.0"
      lastUpdated="December 15, 2025"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            This is the definitive source of truth for OnRopePro's Technician Account module. The technician account is designed as a portable professional identity that travels with you across your entire career, gaining value with every logged hour, completed inspection, and employer connection.
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
            <CardContent className="pt-6">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-lg font-medium text-amber-900 dark:text-amber-100 italic">
                  "The technician account is a portable professional identity, not just a login. It's a 'work passport' that travels with the technician across their entire career."
                </p>
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-base text-amber-800 dark:text-amber-200">
                  <span className="font-semibold">Technician Value = Work History + Certifications + Safety Rating + Employer Connections</span>
                </p>
                <p className="text-base text-amber-800 dark:text-amber-200">
                  Unlike traditional employee profiles owned by employers, the technician account belongs to the technician. When they change jobs, their complete professional history moves with them instantly.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Key Features Summary</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Portable Identity</p>
                    <p className="text-sm text-muted-foreground">IRATA/SPRAT license number serves as permanent identifier across all employers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Link2 className="w-5 h-5 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Instant Employer Connection</p>
                    <p className="text-sm text-muted-foreground">10-second onboarding via license number lookup versus 60+ minutes of paperwork</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Automatic Hour Tracking</p>
                    <p className="text-sm text-muted-foreground">Work sessions, drops, heights, tasks, and locations logged automatically when connected to employer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Personal Safety Rating</p>
                    <p className="text-sm text-muted-foreground">Individual compliance score based on inspections and document acknowledgments across all employers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Certification Alerts <Badge variant="secondary" className="ml-1 text-xs">PLUS</Badge></p>
                    <p className="text-sm text-muted-foreground">60-day yellow badge and 30-day red badge warnings prevent certification lapses</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Multi-Employer <Badge variant="secondary" className="ml-1 text-xs">PLUS</Badge></p>
                    <p className="text-sm text-muted-foreground">Connect with multiple companies simultaneously for contracting or part-time work</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Job Board Access <Badge variant="secondary" className="ml-1 text-xs">PLUS</Badge></p>
                    <p className="text-sm text-muted-foreground">View and apply to employment opportunities in your area</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Level Progression Tracking</p>
                    <p className="text-sm text-muted-foreground">Visual display of hours toward next IRATA certification level</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Critical Disclaimers */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <h2 className="text-xl md:text-2xl font-semibold">Critical Disclaimers</h2>
          </div>

          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-destructive">Important: IRATA/SPRAT Logbook Requirements</p>
                  <p className="text-base text-muted-foreground mt-2">
                    OnRopePro's automatic hour tracking assists your record-keeping but <span className="font-semibold">does not replace your official IRATA/SPRAT logbook</span>. You remain responsible for maintaining your physical logbook per certification body requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-action-200 dark:border-action-800 bg-action-50 dark:bg-action-950">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-action-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-action-900 dark:text-action-100">Important: Data Privacy and Security</p>
                  <div className="text-base text-action-800 dark:text-action-200 mt-2 space-y-2">
                    <p>
                      OnRopePro collects sensitive information including banking details and optionally Social Insurance Numbers (SIN). All financial data is encrypted using AES-256-GCM and stored on SOC2 Type II compliant infrastructure.
                    </p>
                    <p>
                      <span className="font-semibold">SIN Collection:</span> Providing your SIN is entirely optional. Refusing will not result in denied service. Your SIN is only shared with employers you explicitly approve.
                    </p>
                    <p>
                      OnRopePro operates in compliance with PIPEDA (Canada) and applicable provincial privacy legislation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved - Technicians */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-action-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Problems Solved</h2>
            </div>
          </div>

          <p className="text-muted-foreground">
            The Technician Account module solves different problems for different stakeholders. This section is organized by user type to help each stakeholder immediately identify the pain points most relevant to them.
          </p>

          {/* For Technicians */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b">
              <div className="flex items-center gap-3">
                <HardHat className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">For Rope Access Technicians</h3>
              </div>
              <button
                onClick={toggleAllTechProblems}
                className="flex items-center gap-1 text-sm text-muted-foreground hover-elevate rounded-md px-2 py-1"
                data-testid="button-toggle-tech-problems"
              >
                <ChevronsUpDown className="w-4 h-4" />
                {expandedTechProblems.length === allTechProblemIds.length ? "Collapse All" : "Expand All"}
              </button>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedTechProblems}
              onValueChange={setExpandedTechProblems}
              className="space-y-3"
            >
              <AccordionItem value="tech-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-tech-problem-1">
                  <span className="font-medium">"I can't remember what I did 3 months ago when filling my logbook"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> IRATA certification requires detailed logbooks with dates, heights, tasks, and locations. Filling these retrospectively means guessing at details, potentially understating hours, and risking certification issues during audits. Most techs carry crumpled notebooks or rely on memory, losing critical data needed for level progression.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Level 2 tech worked 6 buildings over 4 months. At certification renewal, he spent 8 hours reconstructing approximate hours, guessing heights, and hoping his math added up. The assessor flagged inconsistent entries and requested additional documentation.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro automatically logs every work session with exact dates, building addresses, heights, tasks performed (descend, ascend, rope transfer, re-anchor, double re-anchor), and duration. Sessions are grouped by project with total hours calculated automatically.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Zero guesswork. Complete audit trail. One export covers months of detailed activity. Never lose another hour of work history.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-tech-problem-2">
                  <span className="font-medium">"Every new job means re-entering all my information"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Switch employers and you're starting from scratch: new forms, new banking details, new certification copies, new emergency contacts. Every hire means 30-60 minutes of redundant paperwork. The rope access industry averages 2-3 employer changes per year, multiplying this administrative burden.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A tech averaged 3 employers per year (common in seasonal work). Each required the same 15 forms with identical information, plus waiting for each employer to verify certifications manually. That's 45+ forms annually containing the same data entered repeatedly.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Your technician account stores everything once: certifications, banking details, address, emergency contacts, and work history. When you accept an employer invitation, they receive your complete profile instantly. No re-entry required.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> 10-second onboarding versus 60-minute paperwork sessions. Your information stays current in one place. Update your address once and every connected employer sees the change.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-tech-problem-3">
                  <span className="font-medium">"My IRATA certification expired and I didn't notice"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> IRATA certifications expire after 3 years. Miss the renewal window and you can't work legally. Assessment slots fill up fast during busy season. Employers discover expired certs at job sites, sending techs home without pay and scrambling for coverage.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Level 3 tech's certification expired during a 2-month vacation. He returned to discover he needed re-assessment, lost 3 weeks of work waiting for the next available date, and missed peak season income worth $8,000+.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PLUS accounts provide automated alerts at 60 days (yellow badge visible to you and employers) and 30 days (red badge with banner warning) before expiration.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Never miss a renewal deadline. Plan assessments during slow season, not emergencies. Book early when slots are available.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-4" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-tech-problem-4">
                  <span className="font-medium">"I want to work for multiple companies but it's a paperwork nightmare"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Many techs do contract work or supplement their primary job with weekend gigs. Managing separate paperwork, banking info, and certifications for each employer means administrative chaos. Some give up on side work because the hassle isn't worth it.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Level 2 tech wanted to pick up weekend work during peak season. Three companies were interested, but setting up with each meant 3 hours of paperwork. He picked one and left money on the table.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PLUS accounts allow unlimited employer connections. Accept invitations from multiple companies, and each receives your standardized profile. Switch between Work Dashboards instantly. Hours logged separately per employer.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Maximize earning potential without administrative burden. Manage all employers from one login. Track hours by company for tax purposes.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-5" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-tech-problem-5">
                  <span className="font-medium">"I don't know how close I am to my next certification level"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> IRATA level progression requires specific hour thresholds. Techs track this manually (often poorly), not knowing if they're 100 hours or 500 hours away from eligibility. Some discover at assessment they don't qualify because their manual tracking was inaccurate.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Level 1 tech assumed she had enough hours for Level 2 assessment. At the training facility, her logbook showed only 800 of the required 1,000 hours. Assessment postponed, travel costs wasted.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PLUS accounts display real-time level progression tracking: "Your total hours: 847 of 1,000 required for Level 2. 153 hours remaining." Updates automatically as work sessions are logged.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Always know exactly where you stand. Plan assessments with confidence. No surprises at certification.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-6" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-tech-problem-6">
                  <span className="font-medium">"I can't find job opportunities in my area"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Rope access jobs aren't posted on Indeed or LinkedIn. Finding work means knowing people, random phone calls, or word-of-mouth. New technicians and those relocating have no systematic way to discover opportunities.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A Level 2 tech moved from Vancouver to Calgary. He had no industry contacts in Alberta. Three weeks of cold-calling before landing a position, during which he had zero income.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PLUS accounts access the OnRopePro Job Board showing employment opportunities posted by employers in your region. Apply with one click. Your complete profile is sent automatically.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Discover opportunities you'd never find otherwise. Apply instantly with your professional profile. Reduce job search time from weeks to days.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Company Owners */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">For Rope Access Company Owners</h3>
              </div>
              <button
                onClick={toggleAllOwnerProblems}
                className="flex items-center gap-1 text-sm text-muted-foreground hover-elevate rounded-md px-2 py-1"
                data-testid="button-toggle-owner-problems"
              >
                <ChevronsUpDown className="w-4 h-4" />
                {expandedOwnerProblems.length === allOwnerProblemIds.length ? "Collapse All" : "Expand All"}
              </button>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedOwnerProblems}
              onValueChange={setExpandedOwnerProblems}
              className="space-y-3"
            >
              <AccordionItem value="owner-7" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-owner-problem-7">
                  <span className="font-medium">"Onboarding paperwork gets lost in email chaos"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> New hire accepts job. You email safety documentation. They read it (maybe). They sign it (eventually). They email it back (sometimes to the wrong person). You file it (somewhere). Six months later, an insurance auditor asks for proof of acknowledgment.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> An employer hired 12 techs during peak season. 4 months later, an insurance auditor asked for signed safety acknowledgments. 3 were missing entirely, 2 had unsigned pages, and finding the rest took 2 hours of inbox searching. The auditor noted deficiencies in the report.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> When a tech accepts your invitation, they must read and sign all safety documentation before accessing the Work Dashboard. Documents stored permanently with audit timestamps. No dashboard access until compliance is complete.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> 100% compliance rate. Zero chasing. Instant audit response. Documentation always accessible.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-8" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-owner-problem-8">
                  <span className="font-medium">"I can't verify a tech's qualifications quickly"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Applicant claims Level 2 with First Aid. You ask for copies. They send blurry photos. You manually verify with IRATA. Days pass. Meanwhile, you need bodies on site tomorrow.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A tech applied claiming Level 3. Employer hired based on resume. Two weeks in, the client requested certification proof. Tech's actual level was 2 with pending assessment. Contract penalty applied.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Search any IRATA license number and instantly see: name, email, certification level, First Aid status, and location. The tech must approve the connection before you receive full profile access.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Verify qualifications in seconds, not days. No more hiring based on unverified claims. Protect your contracts and reputation.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-9" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-owner-problem-9">
                  <span className="font-medium">"New safety procedures don't reach existing employees"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You update safety documentation mid-season. How do you ensure every current employee reads and acknowledges the changes? Email notifications get ignored. You can't prove they saw it. Liability exposure continues.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> After a near-miss, an employer added new anchor inspection requirements. 6 of 12 techs never opened the email. When audited 3 months later, half the crew had never seen the updated procedure. Auditor documented the gap.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> When you add or update safety documents, existing employees are blocked from the Work Dashboard until they acknowledge the new content. No exceptions. System enforces compliance automatically.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> 100% acknowledgment guaranteed. No tech can claim "I didn't know." Instant compliance with zero administrative effort.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-10" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-owner-problem-10">
                  <span className="font-medium">"I can't see which techs are actually safety-conscious"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Some technicians complete daily harness inspections religiously. Others skip them constantly. You have no visibility into individual compliance patterns until there's an incident. By then it's too late.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> An employer assumed all techs were following safety protocols. After an equipment incident, the investigation revealed the tech had completed harness inspections only 3 times in 6 months. No documentation existed. Liability exposure was severe.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Each technician has an individual safety rating calculated across all employers: document signing frequency plus harness inspection completion rate. This rating is visible when considering new hires.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Hire techs with proven safety track records. Identify compliance gaps before they become incidents. Build a safety-conscious team.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-11" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-owner-problem-11">
                  <span className="font-medium">"My employees' work data is scattered and incomplete"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You need complete records of what each tech did, when, where, and how. For billing, for insurance, for IRATA audits. But data lives in text messages, paper timesheets, and memory. Reconstructing a complete picture is impossible.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A client disputed an invoice, claiming work wasn't completed on certain dates. The employer had paper timesheets but no detail on which building, which elevation, or what tasks. Unable to prove the work, they had to negotiate the invoice down.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> When techs are connected to your company, every work session logs automatically: building address, heights, specific tasks (descend, ascend, rigging, rope transfer, re-anchor), and duration. Sessions grouped by project.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Complete, undisputable work records. Instant invoice backup. Audit-ready documentation.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-12" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left" data-testid="accordion-pm-problem-12">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-violet-500" />
                    <span className="font-medium">"I can't verify contractor technician qualifications" (Building/Property Managers)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You hire a rope access company, but how do you know their technicians are actually certified? You request documentation. It takes days. Certifications might be expired. You're liable if unqualified workers access your building.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A building manager approved work. Mid-project, a resident complained about workers "dangling outside their window." The manager couldn't confirm if the specific technician was certified. Strata council demanded proof. The contractor took 3 days to provide it.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Through the Building Manager Portal, you can view technician profiles for contractors working on your property: certification levels, expiry dates, and safety ratings. Real-time verification without phone calls.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Instant verification protects your liability. Confidence that only qualified workers access your building. Professional documentation for strata councils.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* Account Tiers */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Account Tiers</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Standard</Badge>
                  <CardTitle className="text-lg">Free Forever</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">Sign up at onrope.pro/technician</p>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Included Features:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" /> Portable professional identity</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" /> Certification storage (IRATA/SPRAT)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" /> Work history tracking (with employer)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" /> Personal safety rating</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" /> Resume/CV upload</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" /> Single employer connection</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" /> Unique referral code</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-sm">Limitations:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-muted-foreground shrink-0" /> No certification expiry alerts</li>
                    <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-muted-foreground shrink-0" /> One employer connection at a time</li>
                    <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-muted-foreground shrink-0" /> No Job Board access</li>
                    <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-muted-foreground shrink-0" /> No level progression tracking</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950 dark:to-amber-900/50 border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500 text-white">PLUS</Badge>
                  <CardTitle className="text-lg">Free with 1 Referral</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">Refer one technician who creates an account</p>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="space-y-2">
                  <p className="font-semibold text-sm">All Standard Features PLUS:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Certification expiry alerts (60-day yellow, 30-day red)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Unlimited employer connections</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Job Board access</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Enhanced profile visibility to employers</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Level progression tracking</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" /> Gold "PLUS" badge on profile</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Registration Flow */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Workflow className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Registration Flow</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gift className="w-5 h-5 text-success-500" />
                    Step 1: Referral Code (Optional)
                  </CardTitle>
                  <Badge variant="outline">Optional</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Enter a 12-character referral code from another technician.</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>If valid code entered, the referring technician receives PLUS upgrade</li>
                  <li>One-sided benefit: only the referrer gets PLUS, not the referee</li>
                  <li>You can still register without a referral code</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-action-500" />
                    Step 2: Personal Information
                  </CardTitle>
                  <Badge variant="secondary">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>First Name and Last Name (legal names)</li>
                  <li>Email Address (used as username for login)</li>
                  <li>Phone Number (primary contact)</li>
                  <li>Password (minimum 8 characters)</li>
                  <li>Address: Street, city, province/state, country, postal code (Geoapify autocomplete)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Step 3: Certification Information
                  </CardTitle>
                  <Badge variant="secondary">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="font-semibold text-sm">Required Fields:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>IRATA License Number (your unique identifier)</li>
                  <li>IRATA Certification Level (Level 1, 2, or 3)</li>
                  <li>IRATA Expiration Date (for tracking and alerts)</li>
                </ul>
                <p className="font-semibold text-sm mt-3">Optional Fields:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>SPRAT Certification Level (if dual-certified)</li>
                  <li>SPRAT License Number</li>
                  <li>SPRAT Expiration Date</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-success-500" />
                    Step 4: Financial Information
                  </CardTitle>
                  <Badge variant="secondary">Required</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="font-semibold text-sm">Required Fields:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Banking Details: Transit number, institution number, account number for direct deposit</li>
                </ul>
                <p className="font-semibold text-sm mt-3">Optional Fields:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Social Insurance Number (SIN) for payroll processing</li>
                </ul>
                <div className="bg-muted/50 p-3 rounded mt-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Security:</span> All financial data encrypted with AES-256-GCM. SOC2 Type II compliant infrastructure. SIN is optional with clear consent disclosure. Refusing SIN does not deny service.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Employer Connection Workflow */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Employer Connection Workflow</h2>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">For Technicians Already on Platform</CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-xs font-semibold shrink-0">1</div>
                  <p className="text-muted-foreground">Employer searches your IRATA license number</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-xs font-semibold shrink-0">2</div>
                  <p className="text-muted-foreground">Employer sees limited info: name, email, level, First Aid status, location</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-xs font-semibold shrink-0">3</div>
                  <p className="text-muted-foreground">Employer sends invitation to connect</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-xs font-semibold shrink-0">4</div>
                  <p className="text-muted-foreground">You receive notification in Technician Portal</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-xs font-semibold shrink-0">5</div>
                  <p className="text-muted-foreground">You review and approve (consent gate)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-xs font-semibold shrink-0">6</div>
                  <p className="text-muted-foreground">Full profile data transferred to employer</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-xs font-semibold shrink-0">7</div>
                  <p className="text-muted-foreground">You must sign all company safety documents</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center text-xs font-semibold shrink-0">8</div>
                  <p className="text-muted-foreground">Access Work Dashboard after document signing complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-action-900 dark:text-action-100">For Company Owners (Auto-Generated Tech Account)</p>
                  <div className="text-base text-action-800 dark:text-action-200 mt-2 space-y-2">
                    <p>When you create an employer account, you automatically receive a linked technician account. Most company owners are also working technicians (especially smaller operations).</p>
                    <p><span className="font-semibold">Benefits:</span> Your hours logged alongside employees, your certifications tracked in the system, you can refer your employees to get PLUS, no separate login required.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Work Dashboard Integration */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Work Dashboard Integration</h2>
          </div>

          <p className="text-muted-foreground">
            When connected to an employer, technicians access the Work Dashboard with comprehensive tracking:
          </p>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Automatic Logging Includes</CardTitle>
            </CardHeader>
            <CardContent className="text-base">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Date/Time</p>
                    <p className="text-sm text-muted-foreground">Exact timestamps for each session</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Building Address</p>
                    <p className="text-sm text-muted-foreground">Full address of work location</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Building Height</p>
                    <p className="text-sm text-muted-foreground">Elevation of work performed</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ClipboardCheck className="w-4 h-4 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Tasks Performed</p>
                    <p className="text-sm text-muted-foreground">Descend, ascend, rigging, rope transfer, re-anchor, double re-anchor</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-4 h-4 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Duration</p>
                    <p className="text-sm text-muted-foreground">Hours worked per session</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-action-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Drop Counts</p>
                    <p className="text-sm text-muted-foreground">Per elevation (N/E/S/W) for drop-based jobs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Session Grouping</p>
                  <p className="text-base text-muted-foreground">
                    Sessions are automatically grouped by project and date range. For example, if Monday to Friday you worked at one project, it will group all sessions together and show total hours with each session itemized.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Referral System */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Referral System</h2>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center text-xs font-semibold shrink-0">1</div>
                  <p className="text-muted-foreground"><span className="font-semibold text-foreground">You Register:</span> Receive unique 12-character referral code</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center text-xs font-semibold shrink-0">2</div>
                  <p className="text-muted-foreground"><span className="font-semibold text-foreground">Share Code:</span> Give code to colleagues</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center text-xs font-semibold shrink-0">3</div>
                  <p className="text-muted-foreground"><span className="font-semibold text-foreground">They Register:</span> Enter your code during their registration</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center text-xs font-semibold shrink-0">4</div>
                  <p className="text-muted-foreground"><span className="font-semibold text-foreground">You Upgrade:</span> Automatically receive PLUS account</p>
                </div>
              </div>

              <div className="bg-muted p-3 rounded space-y-2">
                <p className="font-semibold text-sm">Key Details:</p>
                <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                  <div><span className="font-medium text-foreground">Code Format:</span> 12 alphanumeric characters</div>
                  <div><span className="font-medium text-foreground">Benefit Direction:</span> One-sided (only referrer gets PLUS)</div>
                  <div><span className="font-medium text-foreground">Referrals Required:</span> 1 successful referral for PLUS</div>
                  <div><span className="font-medium text-foreground">Tracking:</span> You can see how many people used your code</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Personal Safety Rating */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Personal Safety Rating</h2>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">What It Measures</CardTitle>
            </CardHeader>
            <CardContent className="text-base space-y-4">
              <p className="text-muted-foreground">Your individual safety rating is calculated from:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><span className="font-semibold text-foreground">Document Signing Frequency:</span> How often you acknowledge safety documents</li>
                <li><span className="font-semibold text-foreground">Harness Inspection Completion:</span> Daily inspection compliance rate</li>
              </ul>

              <div className="bg-muted p-3 rounded space-y-2">
                <p className="font-semibold text-sm">Key Characteristics:</p>
                <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                  <div><span className="font-medium text-foreground">Scope:</span> Aggregated across ALL employers</div>
                  <div><span className="font-medium text-foreground">Portability:</span> Follows you between companies</div>
                  <div><span className="font-medium text-foreground">Visibility:</span> Visible to employers during hiring</div>
                  <div><span className="font-medium text-foreground">Updates:</span> Real-time as you complete safety activities</div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 pt-2">
                <div className="bg-action-50 dark:bg-action-950 p-3 rounded">
                  <p className="font-semibold text-sm text-action-900 dark:text-action-100">For Technicians:</p>
                  <p className="text-sm text-action-800 dark:text-action-200">Demonstrates professionalism and safety consciousness to potential employers.</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded">
                  <p className="font-semibold text-sm text-amber-900 dark:text-amber-100">For Employers:</p>
                  <p className="text-sm text-amber-800 dark:text-amber-200">Provides objective data on candidate safety compliance history before hiring.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Workflow className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Module Integration Points</h2>
          </div>

          <p className="text-muted-foreground">
            The Technician Account module connects with multiple OnRopePro modules:
          </p>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-action-500" />
                  Employee Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Employer invitations create employee records. Tech profile data populates employee profiles instantly. IRATA level syncs to employee card. Hourly rates assigned at employer level.</p>
                <p className="text-sm"><span className="font-semibold">Business Value:</span> 10-second onboarding vs 60-minute paperwork. Pre-verified certification data. No duplicate data entry.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-action-500" />
                  Safety & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Mandatory document signing before Work Dashboard access. Harness inspections contribute to personal safety rating. Safety acknowledgments tracked per employer. New documents trigger re-acknowledgment requirement.</p>
                <p className="text-sm"><span className="font-semibold">Business Value:</span> 100% compliance enforcement. Audit-ready documentation. Zero administrative burden on employers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-action-500" />
                  Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Work sessions logged to technician profile. Hours counted toward IRATA level progression. Sessions grouped by project and date range. Task categorization for detailed logging.</p>
                <p className="text-sm"><span className="font-semibold">Business Value:</span> Automatic work history accumulation. Level progression tracking. Complete audit trail.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-action-500" />
                  Job Board Ecosystem
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">PLUS accounts access job listings. One-click applications send profile to employers. Employer search by IRATA number reveals tech profiles. Mutual acceptance required before full data access.</p>
                <p className="text-sm"><span className="font-semibold">Business Value:</span> Streamlined hiring for employers. Discovery for technicians. Secure consent-based data sharing.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-action-500" />
                  IRATA/SPRAT Task Logging
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Automatic logging when connected to employer. Manual entry available for independent work. Photo OCR scan of IRATA book for baseline hours. Complete task categorization.</p>
                <p className="text-sm"><span className="font-semibold">Business Value:</span> Elimination of manual logbook reconstruction. Accurate level progression tracking. One-year retrospective capability.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Terminology & Naming */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Terminology & Naming</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Core Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div>
                  <p className="font-semibold">Technician Account / Tech Account</p>
                  <p className="text-sm text-muted-foreground">A portable professional profile owned by the technician. Distinguishes from employer-created employee records.</p>
                </div>
                <div>
                  <p className="font-semibold">PLUS Account</p>
                  <p className="text-sm text-muted-foreground">Upgraded technician account with enhanced features. Unlocked by referring one other technician. Shows gold "PLUS" badge on profile.</p>
                </div>
                <div>
                  <p className="font-semibold">Work Passport</p>
                  <p className="text-sm text-muted-foreground">Metaphor for the portable technician account. Describes account portability across employers.</p>
                </div>
                <div>
                  <p className="font-semibold">Portable Identity</p>
                  <p className="text-sm text-muted-foreground">The concept that technician professional data travels with them. Core value proposition differentiating from employer-owned profiles.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Industry Terms Explained</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div>
                  <p className="font-semibold">IRATA</p>
                  <p className="text-sm text-muted-foreground">Industrial Rope Access Trade Association. International certification body setting global standards for rope access work at height. Primary certification type tracked.</p>
                </div>
                <div>
                  <p className="font-semibold">SPRAT</p>
                  <p className="text-sm text-muted-foreground">Society of Professional Rope Access Technicians. US-based organization with standards similar to IRATA. Secondary certification type, optional.</p>
                </div>
                <div>
                  <p className="font-semibold">Level 1 / 2 / 3</p>
                  <p className="text-sm text-muted-foreground">Certification tiers indicating skill and experience. Level 1: Entry (requires supervision). Level 2: Intermediate (independent). Level 3: Senior (can supervise).</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quantified Business Impact */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Quantified Business Impact</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-lg">For Technicians</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">New employer paperwork</span>
                    <div className="text-right">
                      <span className="text-sm line-through text-muted-foreground">60 min</span>
                      <ArrowRight className="w-3 h-3 inline mx-1 text-muted-foreground" />
                      <span className="font-semibold text-success-600">10 sec</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Logbook reconstruction</span>
                    <div className="text-right">
                      <span className="text-sm line-through text-muted-foreground">8+ hrs/yr</span>
                      <ArrowRight className="w-3 h-3 inline mx-1 text-muted-foreground" />
                      <span className="font-semibold text-success-600">0 hrs</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Job searching</span>
                    <div className="text-right">
                      <span className="text-sm line-through text-muted-foreground">Weeks</span>
                      <ArrowRight className="w-3 h-3 inline mx-1 text-muted-foreground" />
                      <span className="font-semibold text-success-600">Days</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Certification tracking</span>
                    <div className="text-right">
                      <span className="text-sm line-through text-muted-foreground">Manual</span>
                      <ArrowRight className="w-3 h-3 inline mx-1 text-muted-foreground" />
                      <span className="font-semibold text-success-600">Auto alerts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-lg">For Employers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Onboarding paperwork</span>
                    <div className="text-right">
                      <span className="text-sm line-through text-muted-foreground">60+ min</span>
                      <ArrowRight className="w-3 h-3 inline mx-1 text-muted-foreground" />
                      <span className="font-semibold text-success-600">2 min</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Certification verification</span>
                    <div className="text-right">
                      <span className="text-sm line-through text-muted-foreground">1-3 days</span>
                      <ArrowRight className="w-3 h-3 inline mx-1 text-muted-foreground" />
                      <span className="font-semibold text-success-600">10 sec</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Safety doc distribution</span>
                    <div className="text-right">
                      <span className="text-sm line-through text-muted-foreground">Hours</span>
                      <ArrowRight className="w-3 h-3 inline mx-1 text-muted-foreground" />
                      <span className="font-semibold text-success-600">Automatic</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Finding audit docs</span>
                    <div className="text-right">
                      <span className="text-sm line-through text-muted-foreground">2+ hrs</span>
                      <ArrowRight className="w-3 h-3 inline mx-1 text-muted-foreground" />
                      <span className="font-semibold text-success-600">Instant</span>
                    </div>
                  </div>
                </div>
                <div className="bg-success-50 dark:bg-success-950 p-3 rounded mt-4">
                  <p className="text-sm font-semibold text-success-900 dark:text-success-100">Risk Reduction:</p>
                  <ul className="text-sm text-success-800 dark:text-success-200 mt-1 space-y-1">
                    <li>100% safety document acknowledgment rate</li>
                    <li>Zero "I didn't know" excuses for safety procedures</li>
                    <li>Complete audit trail for insurance and regulatory compliance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FAQs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-action-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>
            <button
              onClick={toggleAllFaqs}
              className="flex items-center gap-1 text-sm text-muted-foreground hover-elevate rounded-md px-2 py-1"
              data-testid="button-toggle-faqs"
            >
              <ChevronsUpDown className="w-4 h-4" />
              {expandedFaqs.length === allFaqIds.length ? "Collapse All" : "Expand All"}
            </button>
          </div>

          <Accordion 
            type="multiple" 
            value={expandedFaqs}
            onValueChange={setExpandedFaqs}
            className="space-y-3"
          >
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-1">
                <span className="font-medium">"Do I need to pay for a technician account?"</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>No. Technician accounts are free forever. PLUS accounts are also free, unlocked by referring one other technician.</p>
                <p className="mt-2 text-sm"><span className="font-medium text-foreground">Why:</span> Technicians are the network that drives employer adoption. Free accounts maximize network growth.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-2">
                <span className="font-medium">"What happens to my data if I leave a company?"</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>Your technician profile (certifications, work history, safety rating) stays with you permanently. Company-specific data (assigned gear, company documents) stays with that employer.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-3">
                <span className="font-medium">"Can I use OnRopePro without connecting to an employer?"</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>Yes. You can create an account, store certifications, upload your resume, and access the Job Board (PLUS). However, automatic hour tracking only works when connected to an employer using OnRopePro.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-4">
                <span className="font-medium">"Is my Social Insurance Number required?"</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>No. SIN is completely optional. Refusing to provide it will not deny you service or limit your account. The SIN field exists to streamline payroll when you connect with employers, but you can provide it directly to your employer instead.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-5">
                <span className="font-medium">"How do employers find me?"</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>Employers search by IRATA license number. They see limited info (name, level, location) until you approve their connection request. Full profile access requires your consent.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-6">
                <span className="font-medium">"What if I'm a company owner who also works as a technician?"</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>When you create an employer account, you automatically receive a linked technician account. No separate registration needed. Your hours log alongside your employees.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Summary */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Why Tech Accounts Are Different</h2>
          </div>

          <Card className="border-2 border-action-200 dark:border-action-800">
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Most HR systems treat employees as company property.</span> Your profile, your work history, your certifications, all locked in an employer's system. Leave the company? Start over.
              </p>
              <p className="text-muted-foreground">
                OnRopePro recognizes that in rope access, <span className="font-semibold text-foreground">technicians ARE the business.</span> Your skills, your certifications, your safety record travel with you. The technician account makes this portable professional identity the foundation of everything:
              </p>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  <span className="text-sm"><span className="font-semibold">Portable Identity</span> - Your profile follows you across every employer</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  <span className="text-sm"><span className="font-semibold">Instant Verification</span> - Employers confirm qualifications in seconds</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  <span className="text-sm"><span className="font-semibold">Automatic Documentation</span> - Every hour, every task, every inspection logged</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  <span className="text-sm"><span className="font-semibold">Safety Rating</span> - Your compliance history demonstrates professionalism</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                  <span className="text-sm"><span className="font-semibold">Network Effects</span> - Your profile drives platform adoption across the industry</span>
                </div>
              </div>
              <div className="bg-action-50 dark:bg-action-950 p-4 rounded-lg mt-4">
                <p className="text-action-900 dark:text-action-100 font-medium text-center">
                  When you create a tech account, you're not just signing up for software. You're building a portable professional identity that gains value with every logged hour.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
