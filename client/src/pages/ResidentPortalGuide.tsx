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
  Home,
  MessageSquare,
  Camera,
  Clock,
  Eye,
  Lock,
  Globe,
  TrendingUp,
  Key,
  Users,
  Building2,
  Crown,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronsUpDown,
  Target,
  Zap,
  DollarSign,
  HelpCircle,
  ArrowRight,
  Briefcase
} from "lucide-react";

const ALL_PROBLEM_IDS = [
  "resident-1", "resident-2", "resident-3",
  "pm-1", "pm-2", "pm-3",
  "owner-1", "owner-2", "owner-3",
  "ops-1", "ops-2",
  "tech-1", "tech-2",
  "bm-1"
];

const ALL_FAQ_IDS = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5"];

export default function ResidentPortalGuide() {
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
      title="Resident Portal Guide"
      version="2.0"
      lastUpdated="December 17, 2025"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Resident Portal is the accountability bridge connecting building residents directly with rope access service providers. Residents submit feedback with photo evidence, track the status of their issues in real-time, and communicate with vendors without involving the property manager as a middleman. The system creates documented communication trails that resolve disputes, prevent costly return visits, and demonstrate professionalism to property managers evaluating vendors.
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
                  Vendor Code + Strata/LMS Number = Resident Access
                </p>
              </div>

              <div className="space-y-3 text-amber-800 dark:text-amber-200">
                <p className="text-base">
                  Residents connect to the system through a <strong>two-part identification system</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-base">
                  <li><strong>Strata Plan/LMS Number</strong> (entered at account creation): Links the resident to their specific building</li>
                  <li><strong>Vendor Code</strong> (entered after account creation): Links the resident to the service provider doing maintenance on their building</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-4">
                <p className="font-semibold flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Clarification
                </p>
                <p className="mt-2 text-base text-amber-800 dark:text-amber-200">
                  There is <strong>ONE vendor code per company</strong>, used for the entire existence of their account. All residents across all buildings serviced by that company use the SAME code. The Strata/LMS number is what differentiates which building's projects they see.
                </p>
              </div>

              <div className="bg-white dark:bg-amber-900 rounded-lg p-4">
                <p className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-2">Why This Matters:</p>
                <p className="text-base text-amber-800 dark:text-amber-200">
                  This architecture creates portable resident accounts. A resident who moves from Toronto to Chicago can keep their same OnRopePro account, simply updating their Strata/LMS number and entering the new vendor's code. This drives viral adoption as residents expect their new buildings to have the same system.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Step 1</p>
                  <p className="font-bold text-amber-900 dark:text-amber-100">Create Account</p>
                  <p className="text-sm text-amber-800 dark:text-amber-200">Enter Strata/LMS #</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Step 2</p>
                  <p className="font-bold text-amber-900 dark:text-amber-100">Link to Vendor</p>
                  <p className="text-sm text-amber-800 dark:text-amber-200">Enter Vendor Code</p>
                </div>
                <div className="bg-white dark:bg-amber-900 rounded p-3 text-center">
                  <p className="text-xs text-muted-foreground">Step 3</p>
                  <p className="font-bold text-amber-900 dark:text-amber-100">Access Granted</p>
                  <p className="text-sm text-green-700 dark:text-green-300">View Projects & Submit Feedback</p>
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

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Key className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Vendor Code Linking</p>
                  <p className="text-base text-muted-foreground">One code per company links all residents to their service provider. Combined with Strata/LMS number, residents see only their building's projects.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Two-Way Feedback System</p>
                  <p className="text-base text-muted-foreground">Residents submit issues with photos. Staff respond with internal notes (private) or visible replies (resident sees). Complete audit trail.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Camera className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Photo Evidence Upload</p>
                  <p className="text-base text-muted-foreground">Residents attach photos directly to feedback submissions, eliminating back-and-forth emails requesting documentation. Supports iPhone photos (HEIC/HEIF), JPEG, PNG, and WebP formats up to 10MB.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Viewed Timestamp Visibility</p>
                  <p className="text-base text-muted-foreground">Residents see exactly when their feedback was first viewed by the company, creating accountability and eliminating "I didn't see it" excuses.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Progress Tracking</p>
                  <p className="text-base text-muted-foreground">Residents view real-time project progress including which elevation/side of the building is being worked on, reducing "are you done yet?" calls.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Lock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Internal Notes System</p>
                  <p className="text-base text-muted-foreground">Staff coordinate privately without exposing sensitive discussions to residents. Clear toggle prevents accidental visibility.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Portable Accounts</p>
                  <p className="text-base text-muted-foreground">Residents keep their account when moving buildings or cities. Update Strata number, enter new vendor code, done.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Resolution Time Metrics</p>
                  <p className="text-base text-muted-foreground">Property managers see vendor performance data including average response and resolution times for vendor evaluation.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Critical Clarifications - What Does NOT Exist */}
        <section className="space-y-4">
          <Card className="border-2 border-rose-400 bg-rose-50 dark:bg-rose-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2 text-rose-900 dark:text-rose-100">
                <AlertTriangle className="w-5 h-5" />
                What This Module Does NOT Do
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-rose-800 dark:text-rose-200">
              <p className="text-base">Based on validation conversations, the following features do NOT exist and should never be assumed:</p>
              
              <div className="grid gap-2 md:grid-cols-2">
                <div className="flex items-start gap-2 bg-white dark:bg-rose-900/50 rounded-lg p-3">
                  <XCircle className="w-4 h-4 mt-0.5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-medium text-rose-900 dark:text-rose-100">Photo Gallery Viewing</p>
                    <p className="text-sm">Residents can only upload photos with their feedback. They cannot view technician photos or before/after galleries.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white dark:bg-rose-900/50 rounded-lg p-3">
                  <XCircle className="w-4 h-4 mt-0.5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-medium text-rose-900 dark:text-rose-100">Resident Reopen Feedback</p>
                    <p className="text-sm">Only company staff can reopen closed feedback. Residents must contact their property manager if an issue persists.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white dark:bg-rose-900/50 rounded-lg p-3">
                  <XCircle className="w-4 h-4 mt-0.5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-medium text-rose-900 dark:text-rose-100">Direct Link Method</p>
                    <p className="text-sm">There is no /link?code= URL. Residents must enter the vendor code in their Profile page after creating an account.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-white dark:bg-rose-900/50 rounded-lg p-3">
                  <XCircle className="w-4 h-4 mt-0.5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-medium text-rose-900 dark:text-rose-100">Building-Specific Codes</p>
                    <p className="text-sm">One vendor code per company, not per building. The Strata/LMS number differentiates buildings.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
            The Resident Portal module solves different problems for different stakeholders. This section is organized by user type to help each stakeholder immediately identify the pain points most relevant to them.
          </p>

          {/* For Building Residents */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Home className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-semibold">For Building Residents</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="resident-1" className="border rounded-lg px-4" data-testid="accordion-resident-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"My complaints go into a black hole"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Residents submit feedback via phone or email and have no idea if anyone received it, read it, or plans to address it. They call repeatedly asking for updates, get frustrated, and eventually give up or escalate to strata councils and social media.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A resident in unit 1247 emails about streaks on her window. A week later, she has no response. She calls the building manager, who calls the vendor, who says they never received the email. Now three people are involved in tracking down one complaint that may or may not have been sent.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Every feedback submission is logged with a timestamp. Residents see a "Viewed" status with the exact date and time when the company first opened their feedback. They can track status changes from New to Viewed to Closed.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Complete transparency into feedback status. Residents know their issue was received and when it was seen, eliminating uncertainty and repeated follow-up calls.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="resident-2" className="border rounded-lg px-4" data-testid="accordion-resident-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I have to explain my issue three times"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Residents describe their problem over the phone, then repeat it to the property manager, then again to the vendor. Details get lost. "Can you send a photo?" adds another round of communication. Simple issues become multi-day email threads.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A resident reports a water stain. The vendor asks for a photo. The resident sends it, but to the wrong email. The vendor never receives it. A week later, a technician arrives and says "nobody told me about a water stain, I'm here for the balcony glass."
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Residents submit feedback once with a description and optional photo attachment. The form auto-fills their name, unit number, and phone from their account. Everything is captured in one submission.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> One submission captures everything. No repeated explanations, no lost photos, no miscommunication about which unit or what problem.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="resident-3" className="border rounded-lg px-4" data-testid="accordion-resident-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I don't know when they'll be on my side of the building"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Residents see crews working on the building but have no idea if their unit has been done, is scheduled for today, or won't be reached for another week. They call to ask "when will you do my window?" only to learn the crew already finished their side.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A resident on the north side calls to complain their window wasn't cleaned. The crew hasn't reached the north side yet, but the resident didn't know that. They've now wasted everyone's time with a premature complaint.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Residents view real-time project progress showing which elevation/side of the building is currently being worked on and overall completion percentage.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Residents self-serve status information. They can see their side hasn't been touched yet, eliminating premature complaints and reducing inbound calls.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

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
                  <span className="font-medium">"I'm the middleman for every complaint"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> When residents have issues with maintenance work, they call the property manager. The property manager must then contact the vendor, relay the complaint, wait for a response, and communicate back to the resident. This back-and-forth consumes hours per building.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> During a 40-story window washing project, a property manager receives 30+ calls about streaks, missed windows, and scheduling questions. Each call requires follow-up with the vendor, then follow-up with the resident. The property manager spends more time managing complaints than managing the property.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Residents communicate directly with the vendor through the portal. Property managers can view all feedback and communications for oversight without being in the middle of every exchange.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Property managers are removed from the communication loop while maintaining complete visibility. They oversee vendor performance without fielding every call.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-2" className="border rounded-lg px-4" data-testid="accordion-pm-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I can't evaluate vendor responsiveness"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Property managers have no objective data on how quickly vendors respond to resident concerns. When contract renewal comes, they rely on gut feel and resident complaints rather than actual performance metrics.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A property manager is deciding between renewing with their current vendor or switching. Both claim great customer service, but the property manager has no data to compare response times, resolution rates, or communication quality.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> The system calculates average response time and resolution time for each vendor. Property managers see this data alongside the Company Safety Rating when evaluating vendors.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Objective performance metrics for vendor evaluation. Property managers make data-driven decisions about vendor relationships.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="pm-3" className="border rounded-lg px-4" data-testid="accordion-pm-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I have no visibility when residents escalate"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> A resident goes back and forth with a vendor about an issue. Eventually they escalate to the property manager, who has no context on what's been discussed, what's been tried, or what the vendor's position is.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A resident insists their window wasn't cleaned. The vendor insists it was. The resident escalates to the property manager, who must piece together the story from both sides. Without documentation, it becomes "he said, she said."
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Property managers can view the complete feedback history including all messages between resident and vendor, timestamps, and status changes. They see the full context without having to reconstruct it.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> When escalations occur, property managers have complete documented history to make informed decisions about resolution.
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
                  <span className="font-medium">"Deficiency visits cost me a half-day for one window"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> A complaint comes in a week after the job is done. Now you need to send someone back. The technician packs up from their current site, the supervisor drives them to the complaint building, they set up ropes for one window, clean it, pack up, and get driven back. A 10-minute fix becomes a half-day labor cost.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A complaint about one dirty window on the 30th floor requires: packing equipment at current job, loading van, driving to complaint building, going up 30 floors, rigging ropes, descending to window, cleaning window, ascending, derigging, packing, driving back. 4-6 hours of labor for one window.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Complaints come in while crews are still on-site. A supervisor sees the feedback, dispatches a technician who's already rigged and working on that building to check the window. If it's outside dirt, they flip their rope and clean it. Problem solved in minutes.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Real-time complaint resolution while crews are on-site eliminates costly return visits. One prevented return visit per month easily pays for the entire system.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I'm drowning in complaint phone calls"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> During busy season, the operations manager's phone rings constantly with resident complaints. Each call interrupts their work, requires documentation, and needs follow-up. The mental load of tracking dozens of open issues across multiple buildings is overwhelming.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> An owner describes using a notebook to manually track complaints, sometimes writing on his hand while driving. A Google Form helped but required manually sorting 30 submissions from 5 different buildings, then calling each resident individually to schedule resolution.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> All feedback is automatically organized by building and project. Notification badges show pending items. No phone calls to receive complaints, no manual sorting, no paper tracking.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Operations managers reclaim hours previously spent managing complaint intake. The mental load of tracking open issues is eliminated by the system.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4" data-testid="accordion-owner-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"We look unprofessional compared to our competitors"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> When a property manager deals with Vendor A (no system) versus Vendor B (OnRopePro), the difference is stark. Vendor A requires the property manager to coordinate complaints. Vendor B handles everything automatically with complete transparency.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A property manager is comparing two bids for next year's contract. Both prices are similar. But Vendor B shows them their CSR rating, average resolution time, and demonstrates the resident portal. The property manager sees a system that removes work from their plate.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> White-labeled resident portal with your company branding demonstrates professionalism. Resolution time metrics prove your responsiveness. The system itself becomes a competitive differentiator.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Win contracts by demonstrating operational excellence. Property managers choose vendors who make their lives easier.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Operations Managers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">For Operations Managers and Supervisors</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="ops-1" className="border rounded-lg px-4" data-testid="accordion-ops-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I can't coordinate deficiency visits efficiently"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Complaints trickle in over days after a job completes. The operations manager must accumulate them, sort by building, schedule return visits, and coordinate technician availability. It's a constant background task that never ends.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> Five complaints come in for Building A on Monday, three more on Wednesday, two on Friday. Do you send someone Monday and again Friday? Wait until Friday to batch them? Each approach has tradeoffs that require mental energy to optimize.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> All complaints for each building are visible in one place. The operations manager sees which buildings have open issues and can make informed decisions about when to schedule return visits.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Batch deficiency visits efficiently by seeing all open issues per building in one view.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ops-2" className="border rounded-lg px-4" data-testid="accordion-ops-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I can't prove we did the work"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> A resident claims their window was never cleaned. The technician says they did it. Without documentation, it's impossible to prove either way. The default is often to just redo the work to keep the customer happy.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A resident complains about a dirty window. You send someone back. They report the dirt is on the inside. The resident disputes this. Without photo evidence or documented communication, you have no proof of your position.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Residents attach photos to their complaints. Staff responses are timestamped. Internal notes document investigation findings. The complete interaction history provides evidence for disputes.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Documented evidence resolves disputes definitively. No more redoing work you've already completed correctly.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Technicians */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Wrench className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold">For Rope Access Technicians</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="tech-1" className="border rounded-lg px-4" data-testid="accordion-tech-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I find out about complaints a week after I've left the building"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Technicians work a building for several days, then move to the next job. A week later, they're told to go back because of complaints. They've mentally moved on and now must context-switch back to a building they thought was complete.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> A technician finishes the west elevation on Tuesday. On Friday, a complaint comes in about the west side. The technician is now at a different building. They must return to the original building, remember the work context, and address the issue.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Technicians see complaints in real-time while still on-site. They can address issues same-day while the work context is fresh and equipment is deployed.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Immediate feedback allows immediate resolution. Technicians maintain their work rhythm without surprise return visits.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4" data-testid="accordion-tech-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I get blamed for things outside my control"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> A resident complains about a dirty window. The technician knows they cleaned it perfectly, but the resident on the floor above watered their plants and dripped onto the window. Without a way to document this, the technician looks incompetent.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> Party on the 35th floor. Someone gets sick off the balcony. It lands on windows below. By the time complaints come in, the technician has no way to explain what happened.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Internal notes allow staff to document investigation findings (e.g., "dirt on inside," "water from balcony above") without exposing sensitive details to residents. The audit trail shows what was investigated.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Technicians can document context that explains issues, protecting their professional reputation.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Building Managers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Building2 className="w-5 h-5 text-violet-500" />
              <h3 className="text-lg font-semibold">For Building Managers</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="bm-1" className="border rounded-lg px-4" data-testid="accordion-bm-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Residents constantly ask me about project status"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> During maintenance projects, residents approach the building manager asking when their side will be done, if they need to close their windows, and why there are streaks on Unit 1503's window. The building manager becomes an information relay point.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> Every time a building manager walks through the lobby during window washing, residents stop them with questions. The building manager doesn't know the crew's schedule and must contact the vendor to get answers.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Direct residents to create an account and enter the vendor code from the notice in the elevator. They can self-serve all project status information.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Building managers redirect questions to the system instead of answering them personally. Reduced interruptions and on-the-ground workload.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* Portable Accounts: Network Effect */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Portable Accounts: The Network Effect</h2>
          </div>

          <Card className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3 text-violet-800 dark:text-violet-200">
                <p className="text-base">
                  <span className="font-semibold text-violet-900 dark:text-violet-100">The Mechanism:</span> When a resident moves to a new building, they keep their OnRopePro account. They simply update their Strata/LMS number and enter the new vendor's code. If the new building's vendor doesn't use OnRopePro, the resident notices the gap.
                </p>
              </div>

              <div className="bg-white dark:bg-violet-900/50 rounded-lg p-4">
                <p className="font-semibold text-violet-900 dark:text-violet-100 mb-3">The Cascade Effect:</p>
                <ol className="list-decimal list-inside space-y-1 text-base text-violet-800 dark:text-violet-200">
                  <li>Resident moves to new building</li>
                  <li>New building doesn't have OnRopePro</li>
                  <li>Resident asks property manager "why don't we have that system?"</li>
                  <li>Resident mentions it to strata council</li>
                  <li>Strata council mentions it during vendor evaluation</li>
                  <li>Vendor adopts OnRopePro to win/retain contract</li>
                </ol>
              </div>

              <div className="bg-violet-100 dark:bg-violet-800 rounded-lg p-4">
                <p className="font-semibold flex items-center gap-2 text-violet-900 dark:text-violet-100">
                  <TrendingUp className="w-4 h-4" />
                  Why This Matters for Market Penetration
                </p>
                <p className="mt-2 text-base text-violet-800 dark:text-violet-200">
                  Residents become unpaid salespeople. Every satisfied user who moves buildings creates demand at their new location. Vendors face adoption pressure from multiple directions.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Access Permissions Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Access Permissions Matrix</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            The feedback system has carefully designed access levels to ensure privacy while maintaining oversight.
          </p>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Action</th>
                    <th className="text-center p-3 font-medium">Resident</th>
                    <th className="text-center p-3 font-medium">Company Staff</th>
                    <th className="text-center p-3 font-medium">Property Manager</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Submit feedback</td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /> Own only</td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">View feedback</td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /> Own only</td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /> All</td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /> All (read-only)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Add internal notes</td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Add visible replies</td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Reply to messages</td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /> Own only</td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Close feedback</td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Reopen feedback</td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">View internal notes</td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">See viewed timestamp</td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                  </tr>
                  <tr>
                    <td className="p-3">See resolution metrics</td>
                    <td className="text-center p-3"><XCircle className="w-4 h-4 text-rose-500 inline" /></td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                    <td className="text-center p-3"><CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /></td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Feedback Lifecycle */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Feedback Lifecycle</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            Every feedback item goes through a defined lifecycle with clear status indicators at each stage.
          </p>

          <div className="space-y-4">
            <Card className="border-l-4 border-l-cyan-500">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      New
                      <Badge variant="secondary" className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">Status</Badge>
                    </h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Feedback just submitted. Timestamp recorded, notification badge appears in company dashboard. Resident can see their submission with "New" status.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      Viewed
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Status</Badge>
                    </h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Company staff has opened the feedback. "Viewed" timestamp is recorded and visible to resident. Staff can now begin responding with internal notes or visible replies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      Closed
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Status</Badge>
                    </h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Issue resolved. Staff marks feedback as Closed, resolution timestamp recorded. Contributes to company's average resolution time metric.
                    </p>
                    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                      <p className="text-sm flex items-start gap-2 text-amber-800 dark:text-amber-200">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span><strong>Important:</strong> Residents cannot reopen closed feedback. If the issue persists, they must contact their property manager or building manager directly. Only company staff can reopen closed feedback.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Two-Track Communication */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Two-Track Communication System</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            Staff can add two types of notes to feedback. This allows internal coordination without exposing sensitive discussions to residents.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-2 border-slate-300 dark:border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  Internal Notes
                  <Badge variant="secondary" className="text-xs">Staff Only</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Private notes visible only to company staff. Use for:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Coordination between team members</li>
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Investigation notes and findings</li>
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Scheduling discussions</li>
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Sensitive information</li>
                </ul>
                <div className="bg-slate-100 dark:bg-slate-800 rounded p-2 mt-3">
                  <p className="text-xs font-medium">Example: "Checked with John, issue is from previous contractor, not our work. Need to document for liability."</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-300 dark:border-emerald-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Visible Replies
                  <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Resident Sees</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Responses the resident can read. Use for:</p>
                <ul className="text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Acknowledging the feedback</li>
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Providing status updates</li>
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Asking follow-up questions</li>
                  <li className="flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Confirming resolution</li>
                </ul>
                <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded p-2 mt-3">
                  <p className="text-xs font-medium">Example: "Thank you for reporting this. Our team will address the water stain during tomorrow's scheduled visit."</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">Toggle Visibility Carefully</p>
                  <p className="text-base text-amber-800 dark:text-amber-200">
                    Staff must explicitly toggle a checkbox (yellow/red indicator) to make a reply visible to residents. This prevents accidental exposure of internal discussions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Quantified Business Impact */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Quantified Business Impact</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                  Eliminated Return Visits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-emerald-800 dark:text-emerald-200">
                <div className="space-y-1">
                  <p className="text-base">Average cost per deficiency return visit: <strong>$200-400</strong></p>
                  <p className="text-base">Return visits prevented per month: <strong>2-5</strong></p>
                </div>
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Monthly Savings</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">$400-2,000</p>
                </div>
                <p className="text-sm">Annual savings: <strong>$4,800-24,000</strong></p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <Clock className="w-5 h-5" />
                  Reduced Phone Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-emerald-800 dark:text-emerald-200">
                <div className="space-y-1">
                  <p className="text-base">Average time per complaint call: <strong>10-15 minutes</strong></p>
                  <p className="text-base">Complaints per busy month: <strong>50-100</strong></p>
                </div>
                <div className="bg-white dark:bg-emerald-900 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Time Saved Monthly</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">8-25 hours</p>
                </div>
                <p className="text-sm">Value at $50/hour: <strong>$400-1,250/month</strong></p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Indirect Business Value</p>
                  <ul className="space-y-1 text-base text-blue-800 dark:text-blue-200">
                    <li><strong>Contract Retention:</strong> Property managers choose vendors who reduce their workload. The Resident Portal demonstrably removes them from the complaint loop.</li>
                    <li><strong>Competitive Differentiation:</strong> Demonstrating the resident portal and resolution time metrics separates you from competitors managing complaints via phone and email.</li>
                    <li><strong>Professional Reputation:</strong> Transparent, documented complaint handling builds trust that travels through industry networks.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* FAQ Section */}
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
                <span className="font-medium">"Can residents see other residents' complaints?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Answer:</span> No. Residents can only view and interact with their own feedback submissions. Staff see all feedback for their company's projects.
                </p>
                <p>
                  <span className="font-medium text-foreground">Why:</span> Privacy protection. Residents shouldn't see their neighbors' issues or personal details.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"What if a resident is never satisfied and keeps complaining?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Answer:</span> Once staff closes feedback, residents cannot reopen it. If the resident believes the issue persists, they must contact their property manager or building manager directly.
                </p>
                <p>
                  <span className="font-medium text-foreground">Why:</span> This prevents endless back-and-forth on resolved issues while ensuring residents have an escalation path through building management.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"Can property managers respond to resident feedback?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Answer:</span> No. Property managers can view all feedback and communication history but cannot respond. Only company staff can communicate with residents through the system.
                </p>
                <p>
                  <span className="font-medium text-foreground">Why:</span> This keeps property managers informed without requiring their involvement. The goal is to remove them from the communication loop, not add them to it.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"What happens when a resident moves to a different building?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Answer:</span> They update their Strata/LMS number in their profile and enter the new vendor's code. Their account is fully portable. If the new building's vendor uses OnRopePro, they'll see that vendor's projects. If not, their dashboard will be empty until they link to a vendor.
                </p>
                <p>
                  <span className="font-medium text-foreground">Why:</span> Portable accounts create network effects and reduce friction for resident adoption.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
              <AccordionTrigger className="text-left">
                <span className="font-medium">"What's the difference between internal notes and visible replies?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Answer:</span> Internal notes are private (staff only) and are used for coordination, investigation findings, and sensitive discussions. Visible replies are seen by the resident and are used for acknowledgment, status updates, and resolution communication. Staff must explicitly toggle a checkbox (yellow/red indicator) to make a reply visible.
                </p>
                <p>
                  <span className="font-medium text-foreground">Why:</span> Staff need space to coordinate and document findings without exposing every detail to residents. The explicit toggle prevents accidental visibility.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Summary */}
        <section className="space-y-4">
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Why Resident Portal Is Different</h3>
                <p className="text-base text-blue-800 dark:text-blue-200">
                  Most complaint management is either non-existent or completely manual. OnRopePro's Resident Portal recognizes that in building maintenance, feedback is the <strong>accountability bridge</strong> connecting:
                </p>
                <ul className="grid gap-2 md:grid-cols-2 text-base text-blue-800 dark:text-blue-200">
                  <li className="flex items-center gap-2"><Home className="w-4 h-4" /> <strong>Residents:</strong> Direct communication channel</li>
                  <li className="flex items-center gap-2"><Crown className="w-4 h-4" /> <strong>Vendors:</strong> Real-time issue awareness</li>
                  <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> <strong>Property Managers:</strong> Oversight without burden</li>
                  <li className="flex items-center gap-2"><Building2 className="w-4 h-4" /> <strong>Building Managers:</strong> Redirect tool for questions</li>
                  <li className="flex items-center gap-2"><Wrench className="w-4 h-4" /> <strong>Technicians:</strong> Immediate feedback loop</li>
                  <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> <strong>Network Growth:</strong> Viral adoption pressure</li>
                </ul>
                <div className="bg-white dark:bg-blue-900 rounded-lg p-4 mt-4">
                  <p className="text-base font-medium text-blue-900 dark:text-blue-100">
                    When you enable the Resident Portal, you're not just collecting complaints. You're creating a documented accountability system that saves money, wins contracts, and builds your professional reputation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
