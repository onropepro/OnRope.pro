import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Users,
  UserPlus,
  UserCheck,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Award,
  Calendar,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Key,
  AlertTriangle,
  Info,
  Car,
  Heart,
  Lock,
  UserX,
  Settings,
  BadgeCheck,
  Briefcase,
  HardHat,
  Zap,
  Link2,
  Calculator,
  HelpCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

function ProblemsSolvedSection() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const expandAll = () => {
    setExpandedSections([
      "owner-1", "owner-2", "owner-3", "owner-4", "owner-5",
      "ops-1", "ops-2",
      "tech-1", "tech-2", "tech-3"
    ]);
  };
  
  const collapseAll = () => {
    setExpandedSections([]);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          Problems Solved
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll} data-testid="button-expand-all-problems">
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll} data-testid="button-collapse-all-problems">
            Collapse All
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-base">
        The Employee Management module solves different problems for different stakeholders. Find your role below.
      </p>

      {/* For Rope Access Company Owners */}
      <Card className="border-2 border-blue-200 dark:border-blue-900">
        <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
          <CardTitle className="text-xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Briefcase className="w-5 h-5" />
            For Rope Access Company Owners
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="owner-1">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-1">
                <span className="font-semibold">"I didn't know his cert was expired until WorkSafeBC showed up"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">You're running a busy season. Jobs are stacked, crews are deployed across multiple sites, and you're juggling a hundred things. Keeping track of when every technician's IRATA certification expires? It falls through the cracks. You assume your guys are handling their own renewals. Then WorkSafeBC arrives for a site inspection.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "We had a guy on rope one day and WorkSafeBC showed up and we called the guy that was on rope and were like, get off your rope and leave...Because the guy did not have his certification renewed." They caught it in time. If they hadn't, the entire job site would have been shut down.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">OnRopePro monitors every certification with automated 30-day warning alerts. The system displays visual indicators (green/amber/red) so expiring certs are impossible to miss. You get notified before it becomes a crisis.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">One certification alert preventing a WorkSafeBC shutdown pays for your entire annual subscription. Beyond the direct cost, you avoid project delays, client relationship damage, and potential legal liability.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-2">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-2">
                <span className="font-semibold">"Onboarding takes hours of back-and-forth emails"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Every new hire means the same dance: email asking for their info, wait for response, chase the missing pieces, manually enter everything into your systems, email the safety documents, wait for signatures, follow up again. It takes hours per employee, and with the industry's high turnover, you're doing this constantly.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> A typical owner's process: "He does the interview and then if he hires a guy, he sends them an email like, oh, welcome to the company...please fill out this and then send me your void check, blah, blah. And then he gets that email and enters it all and whatever."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Two pathways eliminate this chaos: (1) Existing OnRopePro user: Enter their IRATA number, they accept the connection, done. 10 seconds. Their emergency contacts, bank info, certifications, work history, everything is already there. (2) New user: They fill out their profile once on their own time. You just link them to your company.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Reduce onboarding from hours to seconds. Eliminate 100% of email exchanges for employee data collection. Free up administrative time for actual business development.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-3">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-3">
                <span className="font-semibold">"We use 8 different apps and nothing talks to each other"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Your company has grown organically, adopting tools as needs arose. Now you've got Replicon for timesheets, PayWork for pay stubs, GeoTab for vehicle tracking, Bamboo HR for reviews, WorkHub and ISNetworld for certifications, OneDrive for documents, WhatsApp for job communication, and Excel for scheduling. Each system has its own login, its own quirks, and none of them share data.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "When you log in with Replicon, you have to enter the company, your username, then your password. And then they changed it to Ambipar. So now the app doesn't make the change. So every single time you log in, it goes back to Ridgeline..." Multiple systems daily, with everyone hating the complexity.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">OnRopePro consolidates employee management, time tracking, payroll prep, certification monitoring, safety compliance, and document management into one integrated platform. One login, one source of truth, one system that actually works together.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Stop paying for 8 subscriptions that don't integrate. Eliminate the cognitive load of context-switching between systems. Reduce training time for new hires. Actually know where your data lives.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-4">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-4">
                <span className="font-semibold">"My operations manager might be talking to competitors"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">You've given your operations manager broad system access because they need it to do their job. But now you're suspicious they might be sharing information with another company. You need to protect your client lists, pricing, and strategic data, but you can't just fire them without proof, and you can't run operations without someone in that role.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "You're suspecting that your manager is talking with another company. Okay. I need to protect all my information here. There you go. Now all you can do is clock in and clock out."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Granular permissions allow you to modify access in real-time without changing someone's job title. Every role starts with zero permissions (except Owner), and you configure exactly what each person can see and do. Remove financial access, hide client information, restrict to basic functions, all without a formal demotion.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Protect sensitive business information while maintaining operational continuity. Respond to trust concerns immediately without HR complications. Document access changes for potential legal proceedings.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-5">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-5">
                <span className="font-semibold">"One of my guys drove our truck for two months with an expired license"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">You check driver's licenses when you hire someone. But what happens when that license expires six months later? You're not thinking about it. They're probably not either. And then they're driving your company vehicle without valid credentials, and you don't know until something goes wrong.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "One of our guys from Mexico was on a visa here and his Mexico license expired. Nobody knew. And he drove the company vehicle for two months." If there had been an accident, the liability exposure would have been catastrophic.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">OnRopePro tracks driver's license expiration dates alongside certifications. The same 30-day warning system that protects you from IRATA lapses protects you from license lapses. Visual indicators make expiring licenses visible before they become problems.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Prevent one insurance claim denial or liability lawsuit and you've justified years of subscription costs. Protect your vehicles, your drivers, and your company from preventable legal exposure.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* For Operations Managers & Supervisors */}
      <Card className="border-2 border-blue-200 dark:border-blue-900">
        <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
          <CardTitle className="text-xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Users className="w-5 h-5" />
            For Operations Managers & Supervisors
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="ops-1">
              <AccordionTrigger className="text-left" data-testid="accordion-ops-1">
                <span className="font-semibold">"I can't remember who's certified for what"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">You're assigning crews to jobs and you need to know: Does this tech have their IRATA Level 2? Is their first aid current? Can they legally drive the company truck? You're trying to remember, or flipping through files, or texting people to ask.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Every employee's full certification profile is visible at a glance. IRATA level, expiration date, first aid status, driver's license, all in one place with clear visual indicators for current, expiring, or expired status.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Make crew assignments confidently. Stop the mental gymnastics of tracking who can do what. Prevent accidentally sending unqualified techs to jobs.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ops-2">
              <AccordionTrigger className="text-left" data-testid="accordion-ops-2">
                <span className="font-semibold">"I need to know who's available without calling everyone"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">When you're scheduling a job, you're calling or texting each tech individually to check availability. It's time-consuming and frustrating for everyone.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Employee profiles integrate with the scheduling module. See who's already assigned, who's available, and who has the right certifications for the job type.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Schedule in minutes instead of hours. Reduce interruption fatigue for your technicians. Make data-driven crew decisions.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* For Rope Access Technicians */}
      <Card className="border-2 border-amber-200 dark:border-amber-900">
        <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950">
          <CardTitle className="text-xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <HardHat className="w-5 h-5" />
            For Rope Access Technicians
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="tech-1">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-1">
                <span className="font-semibold">"Every new employer makes me fill out the same paperwork"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">You've given your IRATA number, emergency contact, bank details, and SIN to every employer you've ever worked for. Each time you switch companies (which is often in this industry), you're starting from scratch. Same forms, same information, same tedious data entry.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "The turnover of employees in rope access, building maintenance is insane. Like, in one season, you'll have...there's a lot that come, they find better pay somewhere else. Three weeks later, they're gone."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Create your OnRopePro profile once. Your information stays with you. When you join a new company, they enter your IRATA number, you accept the connection, and you're done. Your certifications, emergency contacts, bank info, work history, it all transfers instantly.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Fill out paperwork once in your career instead of once per employer. Start working immediately instead of waiting for admin processing. Maintain a complete professional history that demonstrates your experience.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-2">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-2">
                <span className="font-semibold">"I never know if my certifications are about to expire"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">You're focused on the job, not calendar dates. Your IRATA cert expires, your first aid lapses, and suddenly you can't work until you get recertified. Lost income, scrambling to schedule training, maybe even losing your position to someone else.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">OnRopePro tracks your certification dates and alerts you before expiration. You see your own status, so you can proactively renew instead of reactively scrambling.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Never get caught off-guard by an expired cert. Maintain continuous work eligibility. Plan renewals on your schedule instead of emergency basis.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-3">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-3">
                <span className="font-semibold">"I can log in with my IRATA number OR my email"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Different systems require different login credentials. Remembering which username goes where is frustrating.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">OnRopePro allows login with either your IRATA/SPRAT certification number or your email address. Your certification number becomes your universal identifier.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">One less password to remember. Login method that actually makes sense for rope access professionals.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}

export default function EmployeeManagementGuide() {
  return (
    <ChangelogGuideLayout 
      title="Employee Management Guide"
      version="2.0"
      lastUpdated="December 12, 2025"
    >
      <div className="space-y-8">
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Employee Management module provides complete workforce administration including portable technician identities, certification tracking with automated expiry alerts, granular permission controls, and instant onboarding for existing OnRopePro users. Access it from the Employees section in your dashboard.
          </p>
        </section>

        {/* Golden Rule Card */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Award className="w-5 h-5" />
                The Golden Rule: Portable Identity = Zero Redundant Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">The Formula</p>
                <div className="font-mono text-base md:text-lg space-y-1">
                  <p className="font-bold">Onboarding Time = f(Account Exists?)</p>
                  <p>New account: 5-10 minutes (standard data entry)</p>
                  <p>Existing account: <span className="text-emerald-600 dark:text-emerald-400 font-bold">10 seconds</span> (enter IRATA number, accept, done)</p>
                </div>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>The Core Principle:</strong> Every technician's IRATA or SPRAT certification number becomes their permanent, portable identity across the entire OnRopePro network. When they change employers, their complete professional history follows them instantly.</p>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-base">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Why This Matters
                </p>
                <p className="mt-1">The rope access industry has exceptionally high turnover, with most technicians changing employers multiple times per season. Traditional onboarding means emailing back and forth, chasing paperwork, manually entering the same information that the tech already gave their last three employers. With OnRopePro, a tech's certifications, emergency contacts, bank information, and work history travel with them. One notification about an expiring certification can pay for the entire annual subscription.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-3 text-base">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold text-green-700 dark:text-green-300">Valid</p>
                  <p className="text-lg font-mono">60+ days</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold text-amber-700 dark:text-amber-300">Warning</p>
                  <p className="text-lg font-mono">30-60 days</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-bold text-red-700 dark:text-red-300">Expired</p>
                  <p className="text-lg font-mono">0 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Key Features Summary */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            Key Features Summary
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Portable Technician Identity</h4>
                </div>
                <p className="text-base text-muted-foreground">IRATA/SPRAT number becomes unique identifier that follows techs between employers.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="font-semibold">Certification Expiry Alerts</h4>
                </div>
                <p className="text-base text-muted-foreground">30-day warnings for IRATA, SPRAT, driver's license, and First Aid before expiration.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-violet-600" />
                  </div>
                  <h4 className="font-semibold">Granular Permissions</h4>
                </div>
                <p className="text-base text-muted-foreground">14 roles with fully customizable permissions per individual (all start empty except Owner).</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold">Integrated Onboarding</h4>
                </div>
                <p className="text-base text-muted-foreground">Safety document signing built into employee creation workflow.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Compensation Clarity</h4>
                </div>
                <p className="text-base text-muted-foreground">Hourly vs piecework toggle with clear payroll integration.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Car className="w-5 h-5 text-rose-600" />
                  </div>
                  <h4 className="font-semibold">Driver Eligibility Tracking</h4>
                </div>
                <p className="text-base text-muted-foreground">License expiration monitoring for vehicle assignments.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h4 className="font-semibold">10-Second Employee Import</h4>
                </div>
                <p className="text-base text-muted-foreground">Existing tech accounts plug in instantly with all data.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-slate-600" />
                  </div>
                  <h4 className="font-semibold">Sensitive Data Encryption</h4>
                </div>
                <p className="text-base text-muted-foreground">AES-256-GCM encryption for SIN/SSN and bank details.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Critical Disclaimer */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <AlertTriangle className="w-5 h-5" />
                Important: Employment Law and Privacy Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-3 text-base">
              <p>
                OnRopePro's Employee Management module helps track certifications and manage workforce data, but <strong>OnRopePro is not a substitute for professional legal, HR, or accounting advice.</strong> You are responsible for ensuring compliance with all applicable:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Federal and provincial/state labor laws (minimum wage, overtime, employment standards)</li>
                <li>OSHA/WorkSafeBC safety regulations</li>
                <li>Personal information protection laws (PIPEDA in Canada, state privacy laws in US)</li>
                <li>Tax withholding and reporting requirements</li>
                <li>Workers' compensation insurance requirements</li>
              </ul>
              <p className="font-semibold">
                Requirements vary by jurisdiction. Consult with qualified professionals (attorneys, CPAs, HR consultants) to ensure your specific compliance needs are met.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved */}
        <ProblemsSolvedSection />

        <Separator />

        {/* Two-Pathway Onboarding */}
        <section className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Adding Employees: Two Pathways
          </h2>
          <p className="text-muted-foreground text-base">
            OnRopePro supports two distinct workflows for adding employees, depending on whether the technician already has an OnRopePro account.
          </p>

          {/* Pathway A */}
          <Card className="border-2 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-950">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                <Zap className="w-5 h-5" />
                Pathway A: Existing OnRopePro User (10-Second Onboarding)
              </CardTitle>
              <CardDescription className="text-base text-emerald-800 dark:text-emerald-200">
                For technicians who already have an OnRopePro account from a previous employer.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-sm">1</div>
                  <div>
                    <h4 className="font-semibold">Enter IRATA/SPRAT Number</h4>
                    <p className="text-base text-muted-foreground">Enter the technician's certification number. The system searches for their existing account.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-sm">2</div>
                  <div>
                    <h4 className="font-semibold">Send Connection Request</h4>
                    <p className="text-base text-muted-foreground">Click to send a connection request. The technician receives a notification.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-sm">3</div>
                  <div>
                    <h4 className="font-semibold">Technician Accepts</h4>
                    <p className="text-base text-muted-foreground">The technician reviews and accepts the connection request from their account.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-sm">4</div>
                  <div>
                    <h4 className="font-semibold">Configure Compensation Only</h4>
                    <p className="text-base text-muted-foreground">Enter the hourly rate or piecework terms for this specific employment relationship. All other data transfers automatically.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-sm">5</div>
                  <div>
                    <h4 className="font-semibold">Assign Required Safety Documents</h4>
                    <p className="text-base text-muted-foreground">If your company has required safety documents, these are automatically queued for the new employee to sign.</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">What Happens Automatically:</p>
                <div className="grid sm:grid-cols-2 gap-2 text-base">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>All personal information transfers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Certification data and dates tracked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Emergency contact info complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Bank/payment info on file</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Work history preserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Appears in scheduling lists</span>
                  </div>
                </div>
                <p className="mt-3 text-base font-semibold text-emerald-800 dark:text-emerald-200">Time Required: 10 seconds (excluding technician acceptance)</p>
              </div>
            </CardContent>
          </Card>

          {/* Pathway B */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-blue-50 dark:bg-blue-950">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <UserPlus className="w-5 h-5" />
                Pathway B: New OnRopePro User (Standard Onboarding)
              </CardTitle>
              <CardDescription className="text-base text-blue-800 dark:text-blue-200">
                For technicians who are new to OnRopePro and need to create a profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-sm">1</div>
                  <div>
                    <h4 className="font-semibold">Basic Information</h4>
                    <p className="text-base text-muted-foreground">Enter employee name, email address, and phone number. The email will be used for login credentials.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-sm">2</div>
                  <div>
                    <h4 className="font-semibold">Role Assignment</h4>
                    <p className="text-base text-muted-foreground">Select from 14 available roles across management and field positions. Remember: all roles start with zero permissions except Company Owner.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-sm">3</div>
                  <div>
                    <h4 className="font-semibold">Certification Details</h4>
                    <p className="text-base text-muted-foreground">Enter IRATA certification level (1, 2, or 3) and expiration date. Optionally add SPRAT, driver's license, First Aid, years of experience, and specialties.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-sm">4</div>
                  <div>
                    <h4 className="font-semibold">Compensation Setup</h4>
                    <p className="text-base text-muted-foreground">Configure hourly rate for payroll calculations. Toggle between hourly and piecework compensation types.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0 text-sm">5</div>
                  <div>
                    <h4 className="font-semibold">Safety Documents</h4>
                    <p className="text-base text-muted-foreground">New employees are automatically assigned any required company safety documents for signing as part of onboarding.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0 text-sm">6</div>
                  <div>
                    <h4 className="font-semibold">Employee Created</h4>
                    <p className="text-base text-muted-foreground">The employee receives login credentials via email and can access the system based on their assigned role. They appear in scheduling and assignment lists.</p>
                  </div>
                </div>
              </div>

              <p className="text-base font-semibold text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-950 rounded-lg p-3 border border-blue-200 dark:border-blue-800">Time Required: 5-10 minutes (excluding employee account setup)</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Employee Profile Fields */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <BadgeCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Employee Profile Fields
          </h2>
          <p className="text-muted-foreground text-base">
            Each employee profile contains comprehensive information for workforce management. This section documents all available fields from the employer's perspective.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Full name</span>
                  <Badge variant="default" className="text-xs">Required</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Email address</span>
                  <Badge variant="default" className="text-xs">Required</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Phone number</span>
                  <Badge variant="default" className="text-xs">Required</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Profile photo</span>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Birthday</span>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Start date</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span>Home address</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>IRATA Level (1, 2, or 3)</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>IRATA license number</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>IRATA expiration date</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>SPRAT certification</span>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Driver's license</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>First Aid certification</span>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span>Years of experience</span>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Contact name</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Contact phone number</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span>Relationship</span>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Compensation type (Hourly/Piecework)</span>
                  <Badge variant="default" className="text-xs">Required</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1 border-b">
                  <span>Hourly rate</span>
                  <Badge variant="outline" className="text-xs">Conditional</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 py-1">
                  <span>Annual salary amount</span>
                  <Badge variant="outline" className="text-xs">Conditional</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Sensitive Information
                  <Badge variant="outline" className="ml-2 text-xs">Encrypted at Rest</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <div className="grid sm:grid-cols-2 gap-2">
                  <div className="flex items-center justify-between gap-2 py-1 border-b">
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-amber-500" /> SIN (Canada) / SSN (US)</span>
                    <Badge variant="outline" className="text-xs">For Payroll</Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-1 border-b">
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-amber-500" /> Bank institution number</span>
                    <Badge variant="outline" className="text-xs">For Payroll</Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-1 border-b">
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-amber-500" /> Bank transit number</span>
                    <Badge variant="outline" className="text-xs">For Payroll</Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-1 border-b">
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-amber-500" /> Bank account number</span>
                    <Badge variant="outline" className="text-xs">For Payroll</Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-1 border-b">
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-amber-500" /> Void cheque document</span>
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </div>
                  <div className="flex items-center justify-between gap-2 py-1 border-b">
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-amber-500" /> Special medical conditions</span>
                    <Badge variant="outline" className="text-xs">Optional</Badge>
                  </div>
                </div>
                <p className="text-base text-muted-foreground mt-3">
                  All sensitive data is encrypted at rest using AES-256-GCM encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Role Hierarchy & Permissions */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            Role Hierarchy & Permissions
          </h2>

          <Card className="border-2 border-violet-500 bg-violet-50 dark:bg-violet-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-violet-900 dark:text-violet-100">
                <Key className="w-5 h-5" />
                The Permission Model
              </CardTitle>
            </CardHeader>
            <CardContent className="text-violet-900 dark:text-violet-100 space-y-3 text-base">
              <p>
                <strong>Critical Understanding:</strong> All roles (except Company Owner) start with <strong>zero permissions</strong>. When you create a role assignment, you must explicitly grant each permission the employee needs. This provides maximum flexibility but requires intentional configuration.
              </p>
              <div className="bg-white dark:bg-violet-900 rounded-lg p-4 text-center">
                <p className="text-lg font-bold">
                  Company Owner has all permissions, always. Everyone else has only what you explicitly grant.
                </p>
              </div>
              <div className="bg-violet-100 dark:bg-violet-800 rounded-lg p-3 italic">
                "Are there predefined role permissions for each of those?" ... "No, they're all empty when you open it. They're all empty. And you go through it and decide what you want to give."
              </div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-semibold mt-6">Available Permissions</h3>
          <Card>
            <CardContent className="pt-5">
              <div className="grid sm:grid-cols-2 gap-3 text-base">
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>View Financial Data</strong>: Access pricing, costs, profitability</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>Manage Employees</strong>: Create, edit, deactivate records</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>View Performance</strong>: Access productivity metrics</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>Manage Inventory</strong>: Assign, track equipment</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>View Safety Documents</strong>: Access compliance records</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>Access Payroll</strong>: View, process payroll</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>Create Projects</strong>: Initiate new projects/jobs</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>View All Projects</strong>: See beyond assigned</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>Manage Scheduling</strong>: Create/modify schedules</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span><strong>View Client Information</strong>: Access client details</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Management Roles
                </CardTitle>
                <CardDescription className="text-base">8 roles with elevated system access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 shrink-0">Company</Badge>
                  <p className="text-base text-muted-foreground">Full system access including billing</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 shrink-0">Owner/CEO</Badge>
                  <p className="text-base text-muted-foreground">Executive-level access</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 shrink-0">Operations Manager</Badge>
                  <p className="text-base text-muted-foreground">Day-to-day operations control</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 shrink-0">Human Resources</Badge>
                  <p className="text-base text-muted-foreground">Employee management focus</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 shrink-0">Accounting</Badge>
                  <p className="text-base text-muted-foreground">Financial data access</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shrink-0">General Supervisor</Badge>
                  <p className="text-base text-muted-foreground">Multi-team oversight</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 shrink-0">Rope Access Supervisor</Badge>
                  <p className="text-base text-muted-foreground">Rope team oversight</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 shrink-0">Account Manager</Badge>
                  <p className="text-base text-muted-foreground">Client relationship focus</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  Worker Roles
                </CardTitle>
                <CardDescription className="text-base">6 roles for field operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shrink-0">Rope Access Tech</Badge>
                  <p className="text-base text-muted-foreground">Primary field technician role</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shrink-0">Supervisor</Badge>
                  <p className="text-base text-muted-foreground">Generic supervisor role</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 shrink-0">Manager</Badge>
                  <p className="text-base text-muted-foreground">Site or project manager</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 shrink-0">Support Staff</Badge>
                  <p className="text-base text-muted-foreground">Ground-level support</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 shrink-0">Support Staff Supervisor</Badge>
                  <p className="text-base text-muted-foreground">Ground team lead</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200 shrink-0">Labourer</Badge>
                  <p className="text-base text-muted-foreground">General labor support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Quantified Business Impact */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Quantified Business Impact
          </h2>

          <Card className="border-2 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-950">
              <CardTitle className="text-xl flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                <Clock className="w-5 h-5" />
                Time Savings (Per New Hire)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Activity</th>
                      <th className="text-left py-2 font-semibold">Before</th>
                      <th className="text-left py-2 font-semibold">With OnRopePro</th>
                      <th className="text-left py-2 font-semibold text-emerald-600">Time Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Email exchanges for info</td>
                      <td className="py-2">30-60 min</td>
                      <td className="py-2">0 min</td>
                      <td className="py-2 font-bold text-emerald-600">30-60 min</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Manual data entry</td>
                      <td className="py-2">15-20 min</td>
                      <td className="py-2">10 sec (existing) / 5 min (new)</td>
                      <td className="py-2 font-bold text-emerald-600">10-19 min</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Chasing missing documents</td>
                      <td className="py-2">20-40 min</td>
                      <td className="py-2">0 min</td>
                      <td className="py-2 font-bold text-emerald-600">20-40 min</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Safety document signing</td>
                      <td className="py-2">15-30 min</td>
                      <td className="py-2">Automatic</td>
                      <td className="py-2 font-bold text-emerald-600">15-30 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-4 text-center border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-muted-foreground">Total Per Hire</p>
                  <p className="text-2xl font-bold text-emerald-600">75-150 min saved</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-4 text-center border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-muted-foreground">Annual Value (15 hires/year)</p>
                  <p className="text-2xl font-bold text-emerald-600">$937 - $2,100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-rose-200 dark:border-rose-800">
            <CardHeader className="bg-rose-50 dark:bg-rose-950">
              <CardTitle className="text-xl flex items-center gap-2 text-rose-900 dark:text-rose-100">
                <AlertTriangle className="w-5 h-5" />
                Risk Mitigation Value
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Risk Event</th>
                      <th className="text-left py-2 font-semibold">Potential Cost</th>
                      <th className="text-left py-2 font-semibold">Prevention</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">WorkSafeBC shutdown (expired cert)</td>
                      <td className="py-2 text-rose-600 font-semibold">$5,000-50,000+</td>
                      <td className="py-2">Certification alerts</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">OSHA violation (no valid certification)</td>
                      <td className="py-2 text-rose-600 font-semibold">Up to $156,259/violation</td>
                      <td className="py-2">Certification tracking</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Vehicle accident (expired license)</td>
                      <td className="py-2 text-rose-600 font-semibold">$10,000-100,000+</td>
                      <td className="py-2">License expiry monitoring</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Insurance claim denial</td>
                      <td className="py-2 text-rose-600 font-semibold">Full loss amount</td>
                      <td className="py-2">Compliance documentation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 font-semibold text-base text-rose-800 dark:text-rose-200">One prevented incident pays for years of subscription.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Module Integration Points */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Link2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            Module Integration Points
          </h2>
          <p className="text-muted-foreground text-base">
            Employee Management connects to multiple OnRopePro modules for a seamless workflow.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Scheduling Module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <p className="text-muted-foreground">Employees appear in scheduling assignment lists after creation. Only employees with valid certifications can be assigned to jobs.</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Prevent assigning unqualified techs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>See availability at a glance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reduce scheduling conflicts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Payroll Module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <p className="text-muted-foreground">Compensation settings feed directly into payroll calculations. Time entries link to employee records.</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Accurate payroll with no manual lookup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Clear audit trail for payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Compensation changes tracked</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-600" />
                  Safety & Compliance Module
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <p className="text-muted-foreground">Safety document signing can be part of onboarding workflow. Signed documents linked to employee profile.</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Required docs signed before work begins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Easy audit of who signed what/when</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Compliance status at a glance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="w-5 h-5 text-rose-600" />
                  Vehicle Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-base">
                <p className="text-muted-foreground">Driver's license tracking tied to vehicle assignment eligibility. Expired licenses flag employees as ineligible.</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Prevent unqualified drivers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Reduce liability exposure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Automated eligibility checking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Best Practices */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Best Practices & Tips
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Briefcase className="w-5 h-5" />
                  For Company Owners
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">Do:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Set up certification alerts immediately</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Require safety doc signing in onboarding</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Review permissions quarterly</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Use existing accounts (10-sec onboarding)</span></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">Don't:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" /><span>Assume employees self-report expiring certs</span></li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" /><span>Give blanket permissions by role title</span></li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" /><span>Delete records when employees leave</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Users className="w-5 h-5" />
                  For Operations Managers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">Do:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Check cert status before crew assignment</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Use scheduling integration for availability</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Report suspicious permission needs</span></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">Don't:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" /><span>Assign techs without verifying certs</span></li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" /><span>Ignore amber warning indicators</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <HardHat className="w-5 h-5" />
                  For Technicians
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">Do:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Keep profile updated across all employers</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Respond promptly to connection requests</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /><span>Use your IRATA number as login</span></li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">Don't:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" /><span>Create new account for each employer</span></li>
                    <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" /><span>Ignore expiration warnings</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* FAQs */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            Frequently Asked Questions
          </h2>

          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-1">
                <span className="font-semibold">Can technicians login with their IRATA number instead of email?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes. Technicians can log in using either their IRATA/SPRAT certification number or their email address. The certification number serves as a unique identifier across the platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-2">
                <span className="font-semibold">What happens when I hire a tech who already has an OnRopePro account?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Enter their IRATA/SPRAT number, send a connection request, and once they accept, their full profile transfers to your company. You only need to enter their compensation rate. All other information (emergency contacts, bank details, certifications, work history) is already complete. Time required: 10 seconds (excluding their acceptance).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-3">
                <span className="font-semibold">Are role permissions predefined or do I have to set them up?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                All roles except Company Owner start with zero permissions. You must explicitly grant each permission the employee needs. This provides maximum flexibility but requires intentional configuration. This approach prevents accidental over-permission and allows you to precisely match access to job requirements and trust level.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-4">
                <span className="font-semibold">Does the system alert for driver's license expiration too?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes. Driver's license expiration dates are tracked and included in the same alert system as IRATA/SPRAT certifications. Visual indicators and notifications function identically.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-5">
                <span className="font-semibold">What happens to data when an employee is terminated?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                The employee loses system access immediately, but all their historical data is preserved. Work sessions, safety documents, equipment assignments, and payroll history remain in the system for compliance and audit purposes. This is a soft delete, not a hard delete.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left" data-testid="accordion-faq-6">
                <span className="font-semibold">Can I use this for employees who aren't rope access technicians?</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Yes. While the certification tracking is designed for rope access (IRATA/SPRAT), the module supports roles like Labourer, Support Staff, and general support personnel who may not have rope access certifications. Simply leave certification fields empty for non-certified staff.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Summary */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Summary: Why Employee Management Is Different
          </h2>

          <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
            <CardContent className="pt-6 text-emerald-900 dark:text-emerald-100 space-y-4 text-base">
              <p>
                <strong>Most workforce management software treats employees as employer-owned records.</strong> OnRopePro recognizes that in rope access, technicians are highly mobile professionals whose careers span multiple employers. The platform creates portable professional identities that:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Follow technicians</strong> between employers, across provinces/states, throughout careers</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Eliminate redundancy</strong>: Fill out paperwork once, not once per employer</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Maintain compliance</strong>: Certifications tracked regardless of current employment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Enable instant onboarding</strong>: 10 seconds to add an existing OnRopePro user</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Protect employers</strong>: Granular permissions, certification alerts, compliance documentation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Build industry data</strong>: Professional histories demonstrating qualification and experience</span>
                </div>
              </div>
              <div className="bg-white dark:bg-emerald-900 rounded-lg p-4 text-center mt-4">
                <p className="text-lg font-semibold">
                  When you add an employee in OnRopePro, you're not just creating a personnel record. You're connecting to a professional identity that makes onboarding instant, compliance automatic, and workforce management actually manageable.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
