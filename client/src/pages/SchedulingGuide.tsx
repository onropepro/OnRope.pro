import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CalendarClock,
  UserCheck,
  Palmtree,
  Stethoscope,
  Heart,
  Info,
  GripVertical,
  Eye,
  Layers,
  RefreshCw,
  XCircle,
  Send,
  ThumbsUp,
  Crown,
  Briefcase,
  Building2,
  HardHat,
  ShieldCheck,
  Link2,
  Palette,
  AlertCircle,
  Ban
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4", "owner-5", "owner-6",
  "ops-1", "ops-2",
  "tech-1", "tech-2",
  "bm-1", "bm-2"
];

function ProblemsSolvedSection() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const expandAll = () => {
    setExpandedSections([...ALL_ACCORDION_ITEMS]);
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
        The Scheduling and Calendar module solves different problems for different stakeholders. Find your role below to see how it helps you specifically.
      </p>

      {/* For Rope Access Company Owners */}
      <Card className="border-2 border-amber-200 dark:border-amber-900">
        <CardHeader className="pb-2 bg-amber-50 dark:bg-amber-950">
          <CardTitle className="text-xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <Crown className="w-5 h-5" />
            For Rope Access Company Owners
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="owner-1">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-1">
                <span className="font-semibold">"Monday Morning Chaos"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Friday afternoon you are rushing to book the rest of your people for Monday. Golf tournament in an hour. You are throwing names right, left and center to fill the spots. Next thing you know, Dave is booked at two places to start two new projects on Monday. Now you have to call your operations manager while he is having a barbecue on Sunday night with his family and tell him to change the whole schedule. Monday morning 6am, you are on the highway and Jack calls with another crisis.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "Next thing you know, you got Dave booked at two places to start two new projects on Monday. Because you booked him on Monday and you forgot about it. So now you have to call your operations manager while he is having barbecue on Sunday night with his family."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Automatic conflict detection prevents the double-booking in the first place. The moment you try to assign Dave to a second project on the same day, the system displays a warning with details about his existing assignment. You can override if necessary, but you cannot accidentally create the conflict.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Monday mornings become stress-free. Zero 6am emergency calls. Zero Sunday barbecue interruptions. The system catches your Friday afternoon mistakes before they become Monday morning disasters.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-2">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-2">
                <span className="font-semibold">"First-Day Contract Killers"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">In rope access and building maintenance, the first day of a job is the most important one. The property manager is waiting. The building manager has keys ready. Residents got notices in the elevator two weeks ago saying you are coming on December 15th. You need to be there. If you do not show up on the first day, especially on a new contract, it is just bad news all around. That ends up with you potentially losing that contract.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "If you come in the first couple days and then you don't have anybody showing up there on Wednesday, it is what it is. But you don't show up on the first day, especially on a new job, like a new contract. You just got the first day where everybody's waiting for you. You don't show up. It's just bad news all around."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Visual calendar shows all project start dates with assigned technicians. Resource Timeline reveals if any critical first days are understaffed. You can see at a glance whether your most important days are properly covered.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Never lose a contract renewal because of a first-day no-show. The $30,000 annual contract you protect by showing up pays for OnRopePro for the entire year, many times over.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-3">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-3">
                <span className="font-semibold">"The Domino Effect"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">One scheduling error creates a cascade of problems. You do not have a guy showing up, so your phone starts ringing at 9am. You call the tech. He is at a different job. Now you need to pull people from other buildings to cover. But now those buildings are behind. Techs end up working alone when they are not supposed to (safety violation). Everyone's mood tanks. Your whole week is ruined.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "Now you need to pull people away from other buildings to go and start that first day. But now you're getting behind everywhere else. You have techs that are going to be working alone on buildings when they're not supposed to because you had to pull one. It's a nightmare."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Dual calendar views show workload distribution BEFORE making assignments. Resource Timeline shows exactly who is working where and when. You can see availability gaps before they become emergencies. You make proactive decisions instead of reactive scrambles.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Balanced crew distribution. No unexpected solo work situations (safety compliance). No cascading schedule changes. Predictable, manageable weeks instead of constant firefighting.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-4">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-4">
                <span className="font-semibold">"Vacation Booking Amnesia"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Someone books two weeks vacation. You approve it. Then you forget. You schedule them for next week at a building. Monday morning: "Where's Dave?" "He's on vacation." Now you are scrambling again.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "A guy would book two weeks vacation and then Jeff would just forget and he would book the guy next week at a building and then, oh, he's on vacation right now. Pull people from other buildings."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Approved time-off automatically blocks scheduling for those dates. When you try to assign someone who is on approved vacation, the system displays a conflict warning. The employee appears as unavailable in the drag-and-drop panel. You literally cannot forget.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Zero "I forgot he was on vacation" situations. Time-off is visible in the calendar and enforced in the system. The vacation you approved two months ago still protects that employee from being scheduled.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-5">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-5">
                <span className="font-semibold">"Scattered Tool Syndrome"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">You create a project in one system. Then you have to go into Float or Google Calendar and recreate it. Name the project. Create a new event. Assign employees. Tag a new color. Project gets pushed by 5 days? Now you have to update both systems. Something always falls out of sync.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "If you're using Float, you will see if people are booked. But the big difference is it links with projects. You create a project and you don't need to create a project and then go inside Float and then name your project, create a new event, assign your employees to it, tag a new color for your calendar."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">One system handles project management AND scheduling. When you create a window washing project, you select the color you want in the calendar, select the employees who are going to be there, and specify the dates. You create a project and fill your calendar at the same time.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Zero duplicate data entry. Project changes automatically flow to the schedule. Schedule changes reflect in project views. Everything stays in sync because it is one system, not two.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="owner-6">
              <AccordionTrigger className="text-left" data-testid="accordion-owner-6">
                <span className="font-semibold">"Culture of Disorganization"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">When your scheduling is chaotic, it affects everything. Management is stressed. Crew morale drops. Your boss is pissed off, putting it on you. You have to figure out his problem. Everyone's mood suffers. It builds a culture of disorganization that permeates the entire company.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "It builds a culture of disorganization. If your scheduling is like, it just screws everything." And then it plays on everybody's mood because that is kind of important at work. Your boss is stressed, putting it on you.
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">A system that makes scheduling bulletproof. Automatic conflict detection. Visual clarity. Dual calendar views. When everyone can see the schedule, when conflicts are prevented automatically, when there is absolute transparency, the chaos disappears.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Professional culture. Calm Monday mornings. Reduced stress throughout the organization. When scheduling works, everything else works better.</p>
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
            <Briefcase className="w-5 h-5" />
            For Operations Managers and Supervisors
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="ops-1">
              <AccordionTrigger className="text-left" data-testid="accordion-ops-1">
                <span className="font-semibold">"Can We Take This Job?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Client calls with an urgent project. Can you start Monday? Without visibility into your current capacity, you need 20 minutes of detective work. Check the spreadsheet. Call a few guys. Text a supervisor. Maybe?</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Resource Timeline shows exactly who is available and when. Open the timeline, see availability at a glance, give the client an answer in 60 seconds.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Win more jobs by responding faster. Never accidentally overcommit. Always know your true capacity.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ops-2">
              <AccordionTrigger className="text-left" data-testid="accordion-ops-2">
                <span className="font-semibold">"Workload Balancing"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Some techs are overworked. Others are idle. You cannot see the imbalance until someone complains or burns out.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "You can see if you have people not booked this week, then you go to timeline and you see. Oh, I see this job is done on the 17th and I don't have Tommy booked anywhere after that. I'm going to put him on another project."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Resource Timeline shows each employee's workload as a horizontal bar. Gaps are visually obvious. You see immediately who is fully booked versus who has availability.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Even work distribution. No burnout from overloading top performers. No idle time from overlooked team members. Fair treatment visible to everyone.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* For Rope Access Technicians */}
      <Card className="border-2 border-orange-200 dark:border-orange-900">
        <CardHeader className="pb-2 bg-orange-50 dark:bg-orange-950">
          <CardTitle className="text-xl flex items-center gap-2 text-orange-900 dark:text-orange-100">
            <HardHat className="w-5 h-5" />
            For Rope Access Technicians
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="tech-1">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-1">
                <span className="font-semibold">"Don't Know Where to Go"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Technicians do not know their schedule until Monday morning when the boss tells them "go to this address." Things change, and no one knows until someone calls them. Hard to plan your week. Hard to plan your life.</p>
                </div>
                <div className="bg-muted p-3 rounded text-base italic">
                  <strong>Real Example:</strong> "The employee did not have access to the schedule. They would be told on Monday, go to this address. You go to this address. You go there, you go there."
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Permission-based schedule visibility. If the employer enables it, technicians can see their own upcoming assignments through the app. They know where they are going before Monday morning.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Plan your week in advance. Know which building, which dates. Fewer Monday morning surprises. Professional experience instead of constant uncertainty.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tech-2">
              <AccordionTrigger className="text-left" data-testid="accordion-tech-2">
                <span className="font-semibold">"Schedule Changes Without Notice"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Schedule changes constantly. You think you are going to Building A, but actually you are needed at Building B. No one told you until you showed up at the wrong place.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Real-time schedule updates visible to technicians (if employer enables permissions). Changes are immediate and visible. Combined with notifications, schedule changes reach you before you drive to the wrong building.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Fewer wasted trips. Less confusion. Feeling respected because someone bothered to inform you of changes.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* For Building Managers & Property Managers */}
      <Card className="border-2 border-violet-200 dark:border-violet-900">
        <CardHeader className="pb-2 bg-violet-50 dark:bg-violet-950">
          <CardTitle className="text-xl flex items-center gap-2 text-violet-900 dark:text-violet-100">
            <Building2 className="w-5 h-5" />
            For Building Managers and Property Managers
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections}>
            <AccordionItem value="bm-1">
              <AccordionTrigger className="text-left" data-testid="accordion-bm-1">
                <span className="font-semibold">"Is Your Crew Coming Today?"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">Building manager asks: "Is your crew on-site today?" Without real-time visibility, you have to call your office, check the schedule, call back. You look disorganized.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">Project Calendar shows exactly which buildings have crews scheduled for any given day. Answer immediately with confidence.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Professional appearance. Instant answers. Building managers trust you because you always know what is happening.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bm-2">
              <AccordionTrigger className="text-left" data-testid="accordion-bm-2">
                <span className="font-semibold">"First Day No-Shows"</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-base">
                <div className="space-y-2">
                  <p className="font-semibold text-red-700 dark:text-red-300">The Pain:</p>
                  <p className="text-muted-foreground">You have prepared for the rope access crew. Notices went out to residents. Keys are ready. Access arranged. And they do not show up. Your phone starts ringing with angry residents. You look incompetent to your board.</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-green-700 dark:text-green-300">The Solution:</p>
                  <p className="text-muted-foreground">OnRopePro's conflict prevention and visual scheduling helps rope access companies ensure first days are properly staffed. Fewer no-shows means fewer embarrassing calls to you.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    The Benefit:
                  </p>
                  <p className="mt-1 text-muted-foreground">Reliable contractors. Fewer surprises. Your reputation protected.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}

export default function SchedulingGuide() {
  return (
    <ChangelogGuideLayout 
      title="Scheduling & Calendar Guide"
      version="1.0"
      lastUpdated="December 15, 2025"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Scheduling and Calendar module provides a dual-calendar view for project assignments and employee availability, with integrated time-off management. This is the authoritative reference for understanding how OnRopePro prevents scheduling conflicts and keeps your crews organized.
          </p>
        </section>

        {/* Golden Rule Card */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <AlertTriangle className="w-5 h-5" />
                The Golden Rule
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  One Employee = One Location at a Time
                </p>
              </div>
              
              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-4">
                <p className="font-semibold mb-2">Conflict Prevention Formula:</p>
                <p className="font-mono text-sm bg-white dark:bg-amber-900 rounded p-2">
                  Assignment Allowed = (No Existing Assignment) AND (No Approved Time-Off) AND (No Date Overlap)
                </p>
              </div>

              <div className="space-y-2 text-base">
                <p><strong>The system automatically checks three conditions before allowing any assignment:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Existing Assignments:</strong> Is the employee already scheduled for another project?</li>
                  <li><strong>Time-Off Requests:</strong> Does the employee have approved vacation or sick leave?</li>
                  <li><strong>Date Overlaps:</strong> Do the requested dates conflict with any existing commitments?</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-base">
                <p className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Why This Matters
                </p>
                <p className="mt-1">In rope access, a scheduling error does not just cause inconvenience. It triggers a domino effect: pulling techs from other buildings, safety violations (working alone), angry property managers, missed first days that kill contract renewals, and Monday mornings that ruin entire weeks.</p>
              </div>

              <div className="bg-white dark:bg-amber-900 rounded-lg p-3 italic text-base border border-amber-300 dark:border-amber-700">
                <p>"It builds a culture of disorganization. If your scheduling is like, it just screws everything."</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Key Features Summary */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Key Features
          </h2>
          <p className="text-muted-foreground text-base">
            Quick overview of what makes this module powerful.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Automatic Conflict Detection</h3>
                </div>
                <p className="text-base text-muted-foreground">
                  Prevents double-booking by checking existing assignments, approved time-off, and date overlaps before any assignment is created.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Dual Calendar Views</h3>
                </div>
                <p className="text-base text-muted-foreground">
                  Project Calendar shows all jobs on a timeline. Resource Timeline shows employee workloads by row. Use both together to plan effectively.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <GripVertical className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Drag-and-Drop Assignment</h3>
                </div>
                <p className="text-base text-muted-foreground">
                  Select an employee, drag to a project, confirm dates. System highlights valid drop zones and warns on conflicts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Palmtree className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Time-Off Management</h3>
                </div>
                <p className="text-base text-muted-foreground">
                  Vacation, sick leave, personal, bereavement, and medical leave types. Approved time-off automatically blocks scheduling.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Project Integration</h3>
                </div>
                <p className="text-base text-muted-foreground">
                  Assign employees during project creation. No duplicate data entry. Changes sync everywhere automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Color-Coded Visualization</h3>
                </div>
                <p className="text-base text-muted-foreground">
                  Projects display in consistent colors across all views. Time-off shown distinctly. Conflicts highlighted with warning indicators.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Permission-Based Visibility</h3>
                </div>
                <p className="text-base text-muted-foreground">
                  Company owners control who sees what. Enable schedule visibility for technicians. Managers can see everyone or just their crews.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Override Capability</h3>
                </div>
                <p className="text-base text-muted-foreground">
                  When conflicts exist, managers receive warnings with full details. Override available for edge cases (not recommended).
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <ProblemsSolvedSection />

        <Separator />

        {/* Dual Calendar Views */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Dual Calendar Views
          </h2>
          <p className="text-muted-foreground text-base">
            The Scheduling module provides two complementary calendar views. Using them together gives you complete visibility.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  Project Calendar (Job Calendar)
                </CardTitle>
                <CardDescription>View assignments by project</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Shows all projects on a timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Color-coded by project type</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Month, week, and day views</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>See projects even if no one is assigned yet</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Click any project to see details and assigned employees</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Resource Timeline (Employee Calendar)
                </CardTitle>
                <CardDescription>View assignments by employee</CardDescription>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Each row represents one employee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Horizontal bars show where they are assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Gaps are visually obvious</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Time-off displayed inline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>See workload at a glance</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="space-y-3 text-base">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    The Workflow: How the Views Work Together
                  </p>
                  <div className="space-y-2 text-blue-800 dark:text-blue-200">
                    <p><strong>1. Review upcoming jobs</strong> in Project Calendar. See what is scheduled for the next week/month. Notice which projects are starting.</p>
                    <p><strong>2. Check capacity</strong> in Resource Timeline. See who is available, who is fully booked, who has gaps after current jobs end.</p>
                    <p><strong>3. Identify availability</strong> using the Available panel. Employees not assigned to anything show in the Available section.</p>
                    <p><strong>4. Make assignments</strong> by dragging from Available to Project Calendar. System validates and warns on conflicts.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted rounded-lg p-4 italic text-base border">
            <p>"The job calendar will show you all of your upcoming jobs, even the ones that are not booked to anybody yet. Because you could have a job in a month from now. I know for sure I have this gutter cleaning job. It's booked with the property manager. I just don't know right now who's going to be at that job."</p>
          </div>
        </section>

        <Separator />

        {/* Drag-and-Drop Assignment */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <GripVertical className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            Drag-and-Drop Assignment
          </h2>

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Select Employee</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Find an available employee in the Available panel. Click and hold their name to start dragging.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Drop on Project/Date</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Drag the employee to the Project Calendar on the desired project/date. The system highlights valid drop zones.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Confirm Date Range</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Release to create the assignment. Confirm the date range in the popup dialog.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Assignment Created</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      If conflicts exist, you will see a warning with options to proceed or cancel. Otherwise, the assignment is created automatically.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-6">
              <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">What Happens Automatically:</p>
              <div className="space-y-2 text-base text-emerald-800 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>System checks for existing assignments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>System checks for approved time-off</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Conflict warning displayed if overlap detected</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Assignment created if no conflicts (or if override selected)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Time-Off Request Types */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Palmtree className="w-6 h-6 text-green-600 dark:text-green-400" />
            Time-Off Request Types
          </h2>
          <p className="text-muted-foreground text-base">
            Employees can request various types of leave through the system.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Palmtree className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Vacation</h3>
                    <p className="text-sm text-muted-foreground">Planned Time Off</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Pre-planned vacation days. Requires advance notice and manager approval. Once approved, automatically blocks scheduling for those dates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Sick Leave</h3>
                    <p className="text-sm text-muted-foreground">Illness or Injury</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Unplanned absence due to illness. Manager can add retroactively on employee's behalf. Blocks scheduling for affected dates.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <CalendarClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Personal</h3>
                    <p className="text-sm text-muted-foreground">Personal Matters</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Personal appointments or obligations requiring time away. Requires manager approval. Used for things like appointments, family obligations, or personal business.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Bereavement</h3>
                    <p className="text-sm text-muted-foreground">Loss of Family Member</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Time off following the death of a family member or close friend. Handled with appropriate sensitivity. Manager approval with flexibility given circumstances.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Medical</h3>
                    <p className="text-sm text-muted-foreground">Medical Appointments</p>
                  </div>
                </div>
                <p className="text-base text-muted-foreground">
                  Scheduled medical appointments, procedures, or treatments. Planned in advance. Requires manager approval.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Time-Off Request Workflow */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Time-Off Request Workflow
          </h2>

          <div className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      Employee Submits Request
                      <Send className="w-4 h-4 text-muted-foreground" />
                    </h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Employee selects leave type, date range, and optionally adds notes explaining the request. Request enters "Pending" status. Appears in manager's time-off queue. Manager receives notification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      Manager Reviews Request
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Manager checks scheduling conflicts, workload impact, and team coverage before making a decision. Are there projects needing this employee during requested dates? Is there adequate team coverage? Does the timing work operationally?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
            </div>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      Decision Made
                      <Clock className="w-4 h-4 text-amber-500" />
                    </h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Manager approves or denies the request based on operational needs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-emerald-500 rotate-[135deg]" />
                <span className="text-sm text-emerald-600 mt-1">Approve</span>
              </div>
              <div className="flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-red-500 rotate-45" />
                <span className="text-sm text-red-600 mt-1">Deny</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <ThumbsUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Approved</h3>
                      <div className="text-base text-emerald-800 dark:text-emerald-200 mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Time-off added to calendar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Employee blocked from scheduling during those dates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Visible in Resource Timeline as time-off</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Conflict warning triggered if someone tries to assign them</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Denied</h3>
                      <div className="text-base text-red-800 dark:text-red-200 mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          <span>Employee notified with reason</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          <span>Employee can submit a modified request if desired</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          <span>Request remains visible in history</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Quick Reference Table */}
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            Quick Reference
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Feature</th>
                      <th className="text-left py-2 font-semibold">Employee Access</th>
                      <th className="text-left py-2 font-semibold">Manager Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-2">View Calendar</td>
                      <td className="py-2">
                        <Badge variant="secondary">If Enabled</Badge>
                      </td>
                      <td className="py-2">
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">Full Access</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">View Own Schedule</td>
                      <td className="py-2">
                        <Badge variant="secondary">If Enabled</Badge>
                      </td>
                      <td className="py-2">
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">Full Access</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Request Time-Off</td>
                      <td className="py-2">
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">Yes</Badge>
                      </td>
                      <td className="py-2">
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">Yes</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Approve Time-Off</td>
                      <td className="py-2">
                        <Badge variant="destructive">No</Badge>
                      </td>
                      <td className="py-2">
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">Yes</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Assign Employees</td>
                      <td className="py-2">
                        <Badge variant="destructive">No</Badge>
                      </td>
                      <td className="py-2">
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">Yes</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Override Conflicts</td>
                      <td className="py-2">
                        <Badge variant="destructive">No</Badge>
                      </td>
                      <td className="py-2">
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">With Warning</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">View Resource Timeline</td>
                      <td className="py-2">
                        <Badge variant="destructive">No</Badge>
                      </td>
                      <td className="py-2">
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">Full Access</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </ChangelogGuideLayout>
  );
}
