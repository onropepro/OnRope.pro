import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  HardHat,
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
  AlertTriangle,
  Bell,
  Link,
  Shield,
  DollarSign,
  ChevronDown,
  TrendingUp,
  Lightbulb,
  HelpCircle,
  Target
} from "lucide-react";
import { useState } from "react";

function ProblemCard({ 
  title, 
  pain, 
  solution,
  defaultOpen = false 
}: { 
  title: string; 
  pain: string; 
  solution: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-visible">
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="pb-2 cursor-pointer">
            <CardTitle className="text-base flex items-center justify-between gap-2">
              <span className="flex-1">{title}</span>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            <div className="bg-rust-50 dark:bg-rust-950 border border-rust-200 dark:border-rust-800 p-3 rounded">
              <p className="font-semibold text-sm text-rust-700 dark:text-rust-300 mb-1">The Pain</p>
              <p className="text-muted-foreground text-sm">{pain}</p>
            </div>
            <div className="bg-success-50 dark:bg-success-950 border border-success-200 dark:border-success-800 p-3 rounded">
              <p className="font-semibold text-sm text-success-700 dark:text-success-300 mb-1">The Solution</p>
              <p className="text-muted-foreground text-sm">{solution}</p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function JobBoardGuide() {
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

        <Separator />

        {/* Golden Rule Section */}
        <section>
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

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-sm">
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
            <Star className="w-6 h-6 text-warning-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Key Features Summary</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3 p-3 bg-muted rounded">
              <Building2 className="w-5 h-5 text-action-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Closed Garden Ecosystem</p>
                <p className="text-muted-foreground text-xs">Exclusively for rope access building maintenance. No unrelated industries, no spam, no noise.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded">
              <Search className="w-5 h-5 text-action-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Talent Browser</p>
                <p className="text-muted-foreground text-xs">Employers search technicians by location, name, certifications, experience level, and expected pay rate.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded">
              <Eye className="w-5 h-5 text-warning-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Profile Visibility Toggle</p>
                <p className="text-muted-foreground text-xs">Technicians control exactly what employers see. Opt-in only. Full privacy control.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded">
              <DollarSign className="w-5 h-5 text-success-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Expected Pay Rate Display</p>
                <p className="text-muted-foreground text-xs">Technicians set rate expectations. Employers see before reaching out. No wasted interviews.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded">
              <Send className="w-5 h-5 text-action-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Direct Job Offers</p>
                <p className="text-muted-foreground text-xs">Send offers directly to technicians from Talent Browser. Linked to active job posting.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded">
              <Shield className="w-5 h-5 text-success-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Safety Rating Visible</p>
                <p className="text-muted-foreground text-xs">Individual Safety Rating (ISR) helps employers assess candidate reliability.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded">
              <FileText className="w-5 h-5 text-warning-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">One-Click Application</p>
                <p className="text-muted-foreground text-xs">Profile data, resume, and certifications auto-attach. Apply in 30 seconds.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted rounded">
              <Bell className="w-5 h-5 text-warning-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">Offer Notifications</p>
                <p className="text-muted-foreground text-xs">Technicians receive in-portal notifications. Accept or decline with one tap.</p>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-warning-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Problems Solved</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-action-500" />
                For Employers
              </h3>
              <div className="grid gap-3">
                <ProblemCard
                  title="I Post on Indeed and Get 50 Applicants, But Only 2 Are Actual Rope Access Techs"
                  pain="You post on Indeed, LinkedIn, Craigslist, and Facebook. You get flooded with applications from people who have never touched a rope system. Shop laborers, general construction workers, people who 'are interested in learning.' Hours wasted filtering irrelevant resumes."
                  solution="OnRopePro's Job Board is a closed ecosystem. Every technician on the platform is in rope access building maintenance. Every employer is verified. When you post a job, 100% of applicants are relevant."
                  defaultOpen={true}
                />
                <ProblemCard
                  title="Indeed Keeps Charging Me Even When I'm Not Hiring"
                  pain="Indeed charges $22 per application if you don't respond within 2 days. A single job posting can cost $300+ in 'engagement fees' before you've hired anyone. Someone has to log in daily, open every application, decline or respond. Miss a few days? That's $22 times every unopened application."
                  solution="OnRopePro's Job Board is included in your subscription. Post unlimited jobs. Receive unlimited applications. No per-application fees. No surprise charges."
                />
                <ProblemCard
                  title="I Found a Good Tech But They Want Way More Than I Can Pay"
                  pain="You spend an hour interviewing a candidate, checking references, preparing an offer, only to discover their salary expectations are $20/hour above your budget. Complete waste of time for both parties."
                  solution="Technicians set their expected pay rate in their profile. When you browse talent, you see what they're looking for before you reach out. If someone won't work under $60/hour and your budget is $45, you know immediately."
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <HardHat className="w-5 h-5 text-warning-500" />
                For Technicians
              </h3>
              <div className="grid gap-3">
                <ProblemCard
                  title="I Want to Find a Rope Access Job But Indeed Shows Me Pipe Fitter and Welder Jobs"
                  pain="You search 'rope access' on Indeed and get results for offshore oil rigs, industrial access in Alberta, and random construction gigs. You spend 30 minutes scrolling through irrelevant listings to find 2-3 that might be building maintenance."
                  solution="OnRopePro's Job Board is exclusively for rope access building maintenance. Every job posted is relevant. Filter by job type, location, and certifications. No oil rigs. No pipe fitting. Just building maintenance."
                />
                <ProblemCard
                  title="I Don't Want Every Company to See My Profile"
                  pain="You're currently employed but casually looking. You don't want your current employer to know you're browsing jobs. Or you simply value your privacy."
                  solution="Profile visibility is opt-in. Toggle it on when actively looking. Toggle it off when you're not. Control exactly which fields employers see."
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-violet-500" />
                For Building Managers / Property Managers
              </h3>
              <div className="grid gap-3">
                <ProblemCard
                  title="How Do I Know This Contractor Hires Qualified Workers?"
                  pain="You hire a rope access contractor but have no visibility into who they're actually sending to your building. Are these people certified? Do they have safety records? You're trusting the contractor's word."
                  solution="When contractors use OnRopePro, their technicians have verified IRATA/SPRAT certifications and visible safety ratings. You're not just trusting their word. You're seeing documented credentials."
                />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* For Employers Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">For Employers</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-action-500" />
                  Posting Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <p className="text-muted-foreground">Companies and SuperUsers can create job postings with:</p>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="bg-muted p-3 rounded">
                    <p className="font-semibold text-sm mb-1">Job Details</p>
                    <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
                      <li>Job title and description</li>
                      <li>Location (city/region)</li>
                      <li>Salary range (optional)</li>
                    </ul>
                  </div>
                  <div className="bg-muted p-3 rounded">
                    <p className="font-semibold text-sm mb-1">Requirements</p>
                    <ul className="list-disc list-inside text-muted-foreground text-xs space-y-0.5">
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
                  <Award className="w-5 h-5 text-warning-500" />
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
                  <Search className="w-5 h-5 text-success-500" />
                  Candidate Browser
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Browse technicians who have enabled profile visibility:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>View resume/CV documents</li>
                  <li>Safety rating scores</li>
                  <li>Years of experience</li>
                  <li>IRATA/SPRAT certification details</li>
                  <li>Profile photo and contact info</li>
                  <li>Rope access specialties</li>
                  <li className="font-medium text-foreground">Expected pay rate</li>
                  <li className="font-medium text-foreground">Search by location and name</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5 text-action-500" />
                  Send Job Offers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Send offers directly to technicians from the Talent Browser:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Select a technician from search results</li>
                  <li>Link offer to an active job posting</li>
                  <li>Technician receives in-portal notification</li>
                  <li>Accept or decline response returned to you</li>
                </ul>
                <p className="text-sm text-muted-foreground italic pt-2">
                  No email chains. No phone tag. Direct connection to qualified candidates.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* For Technicians Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <HardHat className="w-6 h-6 text-warning-500" />
            <h2 className="text-xl md:text-2xl font-semibold">For Technicians</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-action-500" />
                  Browsing Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Technicians can search and filter job listings:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Filter by job type (full-time, contract, etc.)</li>
                  <li>Filter by location</li>
                  <li>Filter by required certifications</li>
                  <li>View company details and job requirements</li>
                  <li>See salary ranges when provided</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5 text-success-500" />
                  Applying to Jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Direct application submission:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>One-click application with profile data</li>
                  <li>Cover letter option</li>
                  <li>Resume automatically attached</li>
                  <li>Application status tracking</li>
                </ul>
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
                  Technicians can opt-in to make their profile visible to employers:
                </p>
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded">
                  <p className="font-semibold text-sm mb-1">When Visible, Employers See:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Resume/CV documents</li>
                    <li>Safety rating</li>
                    <li>Name and photo</li>
                    <li>Years of experience</li>
                    <li>IRATA/SPRAT certification numbers and levels</li>
                    <li>Rope access specialties</li>
                    <li className="font-medium text-amber-800 dark:text-amber-200">Expected pay rate</li>
                  </ul>
                </div>
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
                <p className="text-muted-foreground">Receive offers directly from employers:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Notification appears in your tech portal</li>
                  <li>View job details and company information</li>
                  <li>Accept or decline with one tap</li>
                  <li>No need to check external email</li>
                </ul>
                <p className="text-sm text-muted-foreground italic pt-2">
                  Employers find you. You decide.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Application Status Tracking */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Application Status Tracking</h2>
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="w-8 h-8 rounded-full bg-action-100 dark:bg-action-900 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-action-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Pending</p>
                    <p className="text-muted-foreground text-xs">Application submitted, awaiting review</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-900 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-warning-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Reviewed</p>
                    <p className="text-muted-foreground text-xs">Employer has viewed application</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-success-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Contacted</p>
                    <p className="text-muted-foreground text-xs">Employer has reached out</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted rounded">
                  <div className="w-8 h-8 rounded-full bg-rust-100 dark:bg-rust-900 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-rust-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rejected</p>
                    <p className="text-muted-foreground text-xs">Application not selected</p>
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
            <TrendingUp className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Measurable Results</h2>
          </div>

          <Card>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Metric</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Before OnRopePro</TableHead>
                      <TableHead className="font-semibold text-success-600 dark:text-success-400">With OnRopePro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Time filtering irrelevant applicants</TableCell>
                      <TableCell className="text-muted-foreground">2-4 hours per hire</TableCell>
                      <TableCell className="text-success-600 dark:text-success-400">0 hours (100% relevant)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Recruitment platform fees</TableCell>
                      <TableCell className="text-muted-foreground">$500-2,000/year</TableCell>
                      <TableCell className="text-success-600 dark:text-success-400">$0 (included in subscription)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Time to find qualified candidates</TableCell>
                      <TableCell className="text-muted-foreground">2-3 weeks</TableCell>
                      <TableCell className="text-success-600 dark:text-success-400">1-3 days</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Application time per job (technicians)</TableCell>
                      <TableCell className="text-muted-foreground">15-20 minutes</TableCell>
                      <TableCell className="text-success-600 dark:text-success-400">30 seconds</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Visibility into application status</TableCell>
                      <TableCell className="text-muted-foreground">None</TableCell>
                      <TableCell className="text-success-600 dark:text-success-400">Real-time tracking</TableCell>
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
            <Shield className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Why It's Different</h2>
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
                      <TableCell className="text-success-600 dark:text-success-400 font-medium">Closed ecosystem</TableCell>
                      <TableCell className="text-muted-foreground">Open to everyone</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-success-600 dark:text-success-400 font-medium">Verified employers</TableCell>
                      <TableCell className="text-muted-foreground">Anyone can post</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-success-600 dark:text-success-400 font-medium">100% relevant applicants</TableCell>
                      <TableCell className="text-muted-foreground">2-5% relevant applicants</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-success-600 dark:text-success-400 font-medium">Flat monthly pricing</TableCell>
                      <TableCell className="text-muted-foreground">$22+ per application</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-success-600 dark:text-success-400 font-medium">Safety ratings visible</TableCell>
                      <TableCell className="text-muted-foreground">No verification</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-success-600 dark:text-success-400 font-medium">Industry-specific filters</TableCell>
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
            <Link className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Connected Modules</h2>
          </div>

          <p className="text-muted-foreground mb-4 text-base">The Job Board connects with other OnRopePro modules:</p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-action-500" />
                  Employee Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Technician profiles, certifications, and work history flow directly into job applications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success-500" />
                  Safety & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Individual Safety Rating (ISR) displays on talent profiles, helping employers assess candidates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-warning-500" />
                  Document Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Resume/CV documents stored once, attached to every application automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success-500" />
                  Onboarding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Hired technicians already on the platform? 10-second setup. Enter salary and permissions. Done.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* SuperUser Management */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">SuperUser Management</h2>
          </div>

          <Card>
            <CardContent className="pt-4 text-base space-y-3">
              <p className="text-muted-foreground">
                SuperUsers have platform-wide oversight of the job board:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Post platform-wide job listings</li>
                <li>Moderate job postings from companies</li>
                <li>View all applications across the platform</li>
                <li>Access candidate database</li>
                <li>Monitor job board activity and metrics</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Best Practices & Tips */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-warning-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Best Practices & Tips</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-action-500" />
                  For Employers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sm text-success-600 dark:text-success-400 mb-2">Do:</p>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      <span>Include salary range in job postings (attracts more qualified applicants)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      <span>Check expected pay rates in Talent Browser before sending offers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      <span>Respond to applications promptly (builds your platform reputation)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      <span>Review Individual Safety Rating when evaluating candidates</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-sm text-rust-600 dark:text-rust-400 mb-2">Don't:</p>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rust-500 mt-0.5 shrink-0" />
                      <span>Post vague job descriptions (reduces quality of applicants)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rust-500 mt-0.5 shrink-0" />
                      <span>Send offers without an active job posting linked</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rust-500 mt-0.5 shrink-0" />
                      <span>Ignore safety ratings when making hiring decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rust-500 mt-0.5 shrink-0" />
                      <span>Wait weeks to respond to applications (top candidates move fast)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-warning-500" />
                  For Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-sm text-success-600 dark:text-success-400 mb-2">Do:</p>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      <span>Keep profile updated with current certifications and experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      <span>Set a realistic expected pay rate based on your level and market</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      <span>Use profile visibility toggle strategically (on when looking, off when not)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                      <span>Upload a professional photo and current resume</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-sm text-rust-600 dark:text-rust-400 mb-2">Don't:</p>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rust-500 mt-0.5 shrink-0" />
                      <span>Leave profile incomplete (reduces chances of being found by employers)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rust-500 mt-0.5 shrink-0" />
                      <span>Set expected pay rate artificially high (filters you out of searches)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rust-500 mt-0.5 shrink-0" />
                      <span>Apply to jobs you're not qualified for (hurts your platform reputation)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-rust-500 mt-0.5 shrink-0" />
                      <span>Forget to check your portal for job offer notifications</span>
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
            <HelpCircle className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Is there a cost per application like Indeed?"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  No. Unlike Indeed's $22 per-application fee structure, OnRopePro includes unlimited job postings and applications in your subscription. Post as many jobs as you want. Receive as many applications as you want. No surprise charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Will you scrape jobs from Indeed or other sites?"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  No. OnRopePro's Job Board grows organically. We don't import jobs from other platforms. This ensures every listing is from a verified rope access building maintenance company within our ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Can I see who applied to my jobs?"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Yes. Employers see all applications with profile details, resume, certifications, and safety ratings for technicians who have enabled profile visibility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"What if I'm employed but casually looking?"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Keep your profile visibility toggled off. You can still browse and apply to jobs. Toggle it on only when you want employers to find you proactively.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"Can technicians see my company information before applying?"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Yes. Technicians can view company details, job requirements, location, and salary range (if provided) before deciding to apply.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"How do I send a job offer to a specific technician?"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  From the Talent Browser, find the technician you want to hire. Click "Send Job Offer" and select which of your active job postings to link the offer to. The technician receives a notification in their portal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">"What happens after I accept a job offer?"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  If you're already on the platform, onboarding is nearly instant. The employer enters your salary and permissions. You're ready to work on day one with no re-entry of your information.
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
                  <p className="font-semibold">Access Requirements</p>
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
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Operations Manager</TableCell>
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
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
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">SuperUser</TableCell>
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
                      <TableCell className="text-center text-muted-foreground">No</TableCell>
                      <TableCell className="text-center text-success-600 dark:text-success-400">Yes</TableCell>
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
