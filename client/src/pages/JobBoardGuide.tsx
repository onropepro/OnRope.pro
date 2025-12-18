import { useState } from "react";
import { useTranslation } from "react-i18next";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Briefcase,
  Building2,
  Wrench,
  Eye,
  FileText,
  Award,
  Search,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  XCircle,
  Star,
  Info,
  Users,
  Bell,
  Link,
  Shield,
  DollarSign,
  ChevronsUpDown,
  TrendingUp,
  Lightbulb,
  HelpCircle,
  Target
} from "lucide-react";

const ALL_ACCORDION_ITEMS = [
  "employer-1", "employer-2", "employer-3",
  "tech-1", "tech-2",
  "bm-1"
];

export default function JobBoardGuide() {
  const [openItems, setOpenItems] = useState<string[]>(["employer-1"]);
  const allExpanded = openItems.length === ALL_ACCORDION_ITEMS.length;

  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...ALL_ACCORDION_ITEMS]);
  };

  return (
    <ChangelogGuideLayout
      title="Job Board Ecosystem Guide"
      version="2.0"
      lastUpdated="December 15, 2025"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            Stop posting on Indeed, Craigslist, and Facebook hoping qualified rope techs see your job. OnRopePro's Job Board is a closed ecosystem exclusively for rope access building maintenance. Every employer is verified. Every technician is relevant. No $22 per-application fees. No filtering through 50 resumes to find 2 actual rope techs. No spam.
          </p>
        </section>

        {/* Golden Rule Section */}
        <section className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Target className="w-5 h-5" />
                The Golden Rule: Closed Garden Ecosystem
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Value = Verified Employers x Qualified Technicians x Industry Specificity
                </p>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>Key Principles:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Verified Employers</strong>: Only rope access building maintenance companies can post jobs. No bakeries, no unrelated industries.</li>
                  <li><strong>Qualified Technicians</strong>: Every applicant is a rope access professional. No pipe fitters, no general laborers.</li>
                  <li><strong>Industry Specificity</strong>: Focused marketplace creates higher match quality for everyone.</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-base">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Why This Matters
                </p>
                <p className="mt-1">Unlike Indeed where rope access jobs are buried among thousands of irrelevant listings and you pay $22 per application, OnRopePro creates a focused marketplace. No filtering through 50 resumes to find 2 actual rope techs. The more companies and techs join, the more valuable it becomes for everyone.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Features Summary */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Key Features Summary</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Building2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Closed Garden Ecosystem</p>
                <p className="text-muted-foreground text-sm">Exclusively for rope access building maintenance. No unrelated industries, no spam, no noise.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Search className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Talent Browser</p>
                <p className="text-muted-foreground text-sm">Employers search technicians by location, name, certifications, experience level, and expected pay rate.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Eye className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Profile Visibility Toggle</p>
                <p className="text-muted-foreground text-sm">Technicians control exactly what employers see. Opt-in only. Full privacy control.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <DollarSign className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Expected Pay Rate Display</p>
                <p className="text-muted-foreground text-sm">Technicians set rate expectations. Employers see before reaching out. No wasted interviews.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Send className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Direct Job Offers</p>
                <p className="text-muted-foreground text-sm">Send offers directly to technicians from Talent Browser. Linked to active job posting.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Shield className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Safety Rating Visible</p>
                <p className="text-muted-foreground text-sm">Individual Safety Rating (ISR) helps employers assess candidate reliability.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <FileText className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">One-Click Application</p>
                <p className="text-muted-foreground text-sm">Profile data, resume, and certifications auto-attach. Apply in 30 seconds.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Bell className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Offer Notifications</p>
                <p className="text-muted-foreground text-sm">Technicians receive in-portal notifications. Accept or decline with one tap.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-3xl md:text-4xl font-bold">Problems Solved</h2>
            <Button 
              onClick={toggleAll} 
              variant="outline"
              data-testid="button-toggle-all-accordions"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          {/* For Employers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Employers</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="employer-1" className={`border rounded-lg px-4 ${openItems.includes("employer-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-employer-1">
                  <span className="text-left font-medium">"I post on Indeed and get 50 applicants, but only 2 are actual rope access techs"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You post on Indeed, LinkedIn, Craigslist, and Facebook. You get flooded with applications from people who have never touched a rope system. Shop laborers, general construction workers, people who "are interested in learning." Hours wasted filtering irrelevant resumes.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Dave at ABC Rope Access posts a Level 2 Technician role on Indeed. He receives 47 applications in one week. Only 3 have any rope access experience. He spends 4 hours reviewing resumes that should have taken 20 minutes.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro's Job Board is a closed ecosystem. Every technician on the platform is in rope access building maintenance. Every employer is verified. When you post a job, 100% of applicants are relevant.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Zero time filtering irrelevant applicants. 100% application relevance rate. Average time-to-hire reduced from 2-3 weeks to 1-3 days.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="employer-2" className={`border rounded-lg px-4 ${openItems.includes("employer-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-employer-2">
                  <span className="text-left font-medium">"Indeed keeps charging me even when I'm not hiring"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> Indeed charges $22 per application if you don't respond within 2 days. A single job posting can cost $300+ in "engagement fees" before you've hired anyone. Someone has to log in daily, open every application, decline or respond. Miss a few days? That's $22 times every unopened application.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Mike goes on vacation for a week. He returns to find 14 unopened applications and a $308 charge from Indeed for "sponsored engagement fees" on applications he never reviewed.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro's Job Board is included in your subscription. Post unlimited jobs. Receive unlimited applications. No per-application fees. No surprise charges.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> $500-2,000+ saved annually in recruitment platform fees. No urgency to respond immediately to avoid charges. Focus on quality hires, not fee avoidance.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="employer-3" className={`border rounded-lg px-4 ${openItems.includes("employer-3") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-employer-3">
                  <span className="text-left font-medium">"I found a good tech but they want way more than I can pay"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You spend an hour interviewing a candidate, checking references, preparing an offer, only to discover their salary expectations are $20/hour above your budget. Complete waste of time for both parties.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Sarah interviews a Level 3 tech for 45 minutes, calls two references, and prepares an offer at $55/hour. The candidate declines because they won't work under $75/hour. 3 hours of effort wasted.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Technicians set their expected pay rate in their profile. When you browse talent, you see what they're looking for before you reach out. If someone won't work under $60/hour and your budget is $45, you know immediately.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Zero wasted interviews on budget mismatches. Pre-qualified salary expectations before first contact. Faster hiring decisions with aligned expectations.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Technicians */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Wrench className="w-5 h-5 text-orange-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Technicians</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="tech-1" className={`border rounded-lg px-4 ${openItems.includes("tech-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-tech-1">
                  <span className="text-left font-medium">"I want to find a rope access job but Indeed shows me pipe fitter and welder jobs"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You search "rope access" on Indeed and get results for offshore oil rigs, industrial access in Alberta, and random construction gigs. You spend 30 minutes scrolling through irrelevant listings to find 2-3 that might be building maintenance.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> James searches "rope access Vancouver" on Indeed. He sees 23 results: 8 are offshore oil platform jobs in Alberta, 6 are industrial tank cleaning, 4 are generic construction, and only 5 are actual building maintenance. He wastes 25 minutes filtering.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro's Job Board is exclusively for rope access building maintenance. Every job posted is relevant. Filter by job type, location, and certifications. No oil rigs. No pipe fitting. Just building maintenance.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> 100% job relevance. 25+ minutes saved per job search. Apply to more relevant positions in less time.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className={`border rounded-lg px-4 ${openItems.includes("tech-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-tech-2">
                  <span className="text-left font-medium">"I don't want every company to see my profile"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You're currently employed but casually looking. You don't want your current employer to know you're browsing jobs. Or you simply value your privacy.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Maria is happy at her current company but wants to see what's available. She's worried her boss will find out she's looking if she posts her resume publicly.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Profile visibility is opt-in. Toggle it on when actively looking. Toggle it off when you're not. Control exactly which fields employers see.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Complete privacy control. Browse and apply without exposure. Switch visibility on/off in seconds.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Building Managers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Building2 className="w-5 h-5 text-violet-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Building Managers</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
              <AccordionItem value="bm-1" className={`border rounded-lg px-4 ${openItems.includes("bm-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-bm-1">
                  <span className="text-left font-medium">"How do I know this contractor hires qualified workers?"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You hire a rope access contractor but have no visibility into who they're actually sending to your building. Are these people certified? Do they have safety records? You're trusting the contractor's word.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Tom manages a 40-story condo. He hires a contractor for window cleaning but has no idea if the technicians arriving tomorrow are IRATA-certified or if they've had safety incidents.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> When contractors use OnRopePro, their technicians have verified IRATA/SPRAT certifications and visible safety ratings. You're not just trusting their word. You're seeing documented credentials.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Verified workforce credentials. Visible safety ratings before work begins. Reduced liability from hiring unqualified workers.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* For Employers Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">For Employers</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Posting Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p className="text-muted-foreground">Companies and SuperUsers can create job postings with comprehensive details.</p>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="bg-muted/30 p-3 rounded">
                    <p className="font-semibold text-base mb-1">Job Details</p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-0.5">
                      <li>Job title and description</li>
                      <li>Location (city/region)</li>
                      <li>Salary range (optional)</li>
                    </ul>
                  </div>
                  <div className="bg-muted/30 p-3 rounded">
                    <p className="font-semibold text-base mb-1">Requirements</p>
                    <ul className="list-disc list-inside text-muted-foreground text-sm space-y-0.5">
                      <li>Required certifications (IRATA/SPRAT)</li>
                      <li>Experience level</li>
                      <li>Special skills</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Job Types & Employment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Full-time</Badge>
                  <Badge variant="secondary">Part-time</Badge>
                  <Badge variant="secondary">Contract</Badge>
                  <Badge variant="secondary">Seasonal</Badge>
                  <Badge variant="secondary">Project-based</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-500" />
                  Candidate Browser
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Browse technicians who have enabled profile visibility.</p>
                <p className="text-muted-foreground">View resume/CV documents, safety rating scores, years of experience, IRATA/SPRAT certification details, profile photo, rope access specialties, expected pay rate, and search by location and name.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-500" />
                  Send Job Offers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Send offers directly to technicians from the Talent Browser. Select a technician from search results, link offer to an active job posting, and the technician receives an in-portal notification.</p>
                <p className="text-muted-foreground">No email chains. No phone tag. Direct connection to qualified candidates.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* For Technicians Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <h2 className="text-3xl md:text-4xl font-bold">For Technicians</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  Browsing Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Search and filter job listings by job type (full-time, contract, etc.), location, and required certifications.</p>
                <p className="text-muted-foreground">View company details, job requirements, and salary ranges when provided.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-500" />
                  Applying to Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">One-click application with profile data, cover letter option, and resume automatically attached.</p>
                <p className="text-muted-foreground">Track application status in real-time.</p>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  Profile Visibility Toggle
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-amber-800 dark:text-amber-200">
                  Opt-in to make your profile visible to employers. When visible, employers can see your resume, safety rating, name, photo, experience, certifications, specialties, and expected pay rate.
                </p>
                <p className="text-amber-800 dark:text-amber-200">
                  Toggle visibility on when actively looking, off when you're not.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  Job Offer Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Receive offers directly from employers. Notification appears in your tech portal with job details and company information.</p>
                <p className="text-muted-foreground">Accept or decline with one tap. Employers find you. You decide.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Application Status Tracking */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Application Status Tracking</h2>
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Pending</p>
                    <p className="text-muted-foreground text-sm">Application submitted, awaiting review</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Reviewed</p>
                    <p className="text-muted-foreground text-sm">Employer has viewed application</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Contacted</p>
                    <p className="text-muted-foreground text-sm">Employer has reached out</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Rejected</p>
                    <p className="text-muted-foreground text-sm">Application not selected</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Measurable Results Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Measurable Results</h2>
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Metric</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Before OnRopePro</TableHead>
                      <TableHead className="font-semibold text-emerald-600 dark:text-emerald-400">With OnRopePro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Time filtering irrelevant applicants</TableCell>
                      <TableCell className="text-muted-foreground">2-4 hours per hire</TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-400">0 hours (100% relevant)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Recruitment platform fees</TableCell>
                      <TableCell className="text-muted-foreground">$500-2,000/year</TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-400">$0 (included in subscription)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Time to find qualified candidates</TableCell>
                      <TableCell className="text-muted-foreground">2-3 weeks</TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-400">1-3 days</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Application time per job (technicians)</TableCell>
                      <TableCell className="text-muted-foreground">15-20 minutes</TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-400">30 seconds</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Visibility into application status</TableCell>
                      <TableCell className="text-muted-foreground">None</TableCell>
                      <TableCell className="text-emerald-600 dark:text-emerald-400">Real-time tracking</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Why It's Different */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Why It's Different</h2>
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">OnRopePro</TableHead>
                      <TableHead className="font-semibold">Indeed/Craigslist</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">Closed ecosystem</TableCell>
                      <TableCell className="text-muted-foreground">Open to everyone</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">Verified employers</TableCell>
                      <TableCell className="text-muted-foreground">Anyone can post</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">100% relevant applicants</TableCell>
                      <TableCell className="text-muted-foreground">2-5% relevant applicants</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">Flat monthly pricing</TableCell>
                      <TableCell className="text-muted-foreground">$22+ per application</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">Safety ratings visible</TableCell>
                      <TableCell className="text-muted-foreground">No verification</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-emerald-600 dark:text-emerald-400 font-medium">Industry-specific filters</TableCell>
                      <TableCell className="text-muted-foreground">Generic filters</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Connected Modules */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Link className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Connected Modules</h2>
          </div>

          <p className="text-muted-foreground mb-4 text-base">The Job Board connects with other OnRopePro modules:</p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Employee Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <p className="text-base text-muted-foreground">
                  Technician profiles, certifications, and work history flow directly into job applications.
                </p>
                <p className="text-base text-muted-foreground">
                  No duplicate data entry when applying to multiple positions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Safety & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <p className="text-base text-muted-foreground">
                  Individual Safety Rating (ISR) displays on talent profiles.
                </p>
                <p className="text-base text-muted-foreground">
                  Helps employers assess candidate reliability before contact.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  Document Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <p className="text-base text-muted-foreground">
                  Resume/CV documents stored once, attached to every application automatically.
                </p>
                <p className="text-base text-muted-foreground">
                  Certifications verified and always current.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Onboarding
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <p className="text-base text-muted-foreground">
                  Hired technicians already on the platform? 10-second setup.
                </p>
                <p className="text-base text-muted-foreground">
                  Enter salary and permissions. Done.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* SuperUser Management */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold">SuperUser Management</h2>
          </div>

          <Card>
            <CardContent className="pt-4 text-base space-y-3">
              <p className="text-muted-foreground">
                SuperUsers have platform-wide oversight of the job board.
              </p>
              <p className="text-muted-foreground">
                Post platform-wide job listings, moderate job postings from companies, view all applications across the platform, access candidate database, and monitor job board activity and metrics.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Best Practices & Tips */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Best Practices & Tips</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  For Employers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-base text-emerald-600 dark:text-emerald-400 mb-2">Do:</p>
                  <ul className="space-y-1 text-muted-foreground text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Include salary range in job postings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Check expected pay rates before sending offers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Respond to applications promptly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Review Individual Safety Rating when evaluating</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-base text-red-600 dark:text-red-400 mb-2">Don't:</p>
                  <ul className="space-y-1 text-muted-foreground text-base">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span>Post vague job descriptions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span>Send offers without linking a job posting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span>Ignore safety ratings in hiring decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span>Wait weeks to respond to applications</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  For Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-base text-emerald-600 dark:text-emerald-400 mb-2">Do:</p>
                  <ul className="space-y-1 text-muted-foreground text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Keep profile updated with current certifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Set a realistic expected pay rate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Use profile visibility toggle strategically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>Upload a professional photo and current resume</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-base text-red-600 dark:text-red-400 mb-2">Don't:</p>
                  <ul className="space-y-1 text-muted-foreground text-base">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span>Leave profile incomplete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span>Set expected pay rate artificially high</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span>Apply to jobs you're not qualified for</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                      <span>Forget to check portal for offer notifications</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FAQ Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Is there a cost per application like Indeed?"</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <p className="text-base text-muted-foreground">
                  No. Unlike Indeed's $22 per-application fee structure, OnRopePro includes unlimited job postings and applications in your subscription.
                </p>
                <p className="text-base text-muted-foreground">
                  Post as many jobs as you want. Receive as many applications as you want. No surprise charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Will you scrape jobs from Indeed or other sites?"</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <p className="text-base text-muted-foreground">
                  No. OnRopePro's Job Board grows organically.
                </p>
                <p className="text-base text-muted-foreground">
                  We don't import jobs from other platforms. This ensures every listing is from a verified rope access building maintenance company within our ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Can I see who applied to my jobs?"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">
                  Yes. Employers see all applications with profile details, resume, certifications, and safety ratings for technicians who have enabled profile visibility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"What if I'm employed but casually looking?"</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <p className="text-base text-muted-foreground">
                  Keep your profile visibility toggled off. You can still browse and apply to jobs.
                </p>
                <p className="text-base text-muted-foreground">
                  Toggle it on only when you want employers to find you proactively.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Can technicians see my company information before applying?"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground">
                  Yes. Technicians can view company details, job requirements, location, and salary range (if provided) before deciding to apply.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"How do I send a job offer to a specific technician?"</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <p className="text-base text-muted-foreground">
                  From the Talent Browser, find the technician you want to hire. Click "Send Job Offer" and select which of your active job postings to link the offer to.
                </p>
                <p className="text-base text-muted-foreground">
                  The technician receives a notification in their portal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"What happens after I accept a job offer?"</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-2">
                <p className="text-base text-muted-foreground">
                  If you're already on the platform, onboarding is nearly instant. The employer enters your salary and permissions.
                </p>
                <p className="text-base text-muted-foreground">
                  You're ready to work on day one with no re-entry of your information.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Access Requirements */}
        <section>
          <Card className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold text-base">Access Requirements</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold text-center">Post Jobs</TableHead>
                      <TableHead className="font-semibold text-center">Browse Talent</TableHead>
                      <TableHead className="font-semibold text-center">Apply to Jobs</TableHead>
                      <TableHead className="font-semibold text-center">Send Offers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Company Owner</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Operations Manager</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Supervisor</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-muted-foreground">View only</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Technician</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">SuperUser</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-emerald-600 dark:text-emerald-400">Yes</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
