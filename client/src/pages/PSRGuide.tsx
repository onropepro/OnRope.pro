import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Star,
  Shield,
  Award,
  ClipboardCheck,
  AlertTriangle,
  Info,
  Users,
  Crown,
  Wrench,
  Target,
  ChevronsUpDown,
  GraduationCap,
  Briefcase,
  TrendingUp,
  HelpCircle,
  Link2,
  RefreshCw,
  Eye,
  FileCheck,
  Clock,
  Zap,
  CircleDot,
  UserCheck
} from "lucide-react";
import { useState } from "react";

const ALL_PROBLEM_IDS = [
  "owner-1", "owner-2", "owner-3", "owner-4",
  "supervisor-1", "supervisor-2",
  "tech-1", "tech-2", "tech-3", "tech-4",
  "pm-1"
];

const ALL_FAQ_IDS = ["faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6"];

export default function PSRGuide() {
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
      title="Personal Safety Rating (PSR) Guide"
      version="1.0"
      lastUpdated="December 24, 2025"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Personal Safety Rating (PSR) is your portable professional safety identity. Unlike company metrics that stay with employers, your PSR follows you throughout your career, proving your commitment to safety with data, not words. Every harness inspection, every quiz passed, every document signed builds your permanent professional safety record.
          </p>
          
          <Card className="bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20 border-[#95ADB6]/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#95ADB6] mt-0.5" />
                <div>
                  <p className="font-semibold text-[#95ADB6] dark:text-[#DE7954]">Your Score Belongs to You</p>
                  <p className="text-base text-[#95ADB6]/90 dark:text-[#DE7954]/90">
                    PSR is tied to YOUR technician account, not your employer. When you change companies, your entire safety history comes with you. The new employer sees your PSR on day one.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  "Your PSR is your portable professional safety identity. It belongs to you, follows you everywhere, and proves your commitment to safety with data, not words."
                </p>
              </div>
              
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4">
                <p className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-3">The PSR Formula:</p>
                <div className="space-y-3 text-base font-mono text-amber-900 dark:text-amber-100">
                  <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded">
                    <p className="font-bold mb-1">Solo Technician (Not Linked):</p>
                    <p>PSR = (Certifications x 33%) + (Safety Docs x 33%) + (Quizzes x 34%)</p>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded">
                    <p className="font-bold mb-1">Employer-Linked Technician:</p>
                    <p>PSR = (Certifications x 25%) + (Safety Docs x 25%) + (Quizzes x 25%) + (Work History x 25%)</p>
                  </div>
                </div>
              </div>

              <p className="text-base text-amber-800 dark:text-amber-200">
                PSR creates quantified accountability. Unlike paper resumes or verbal references, PSR proves safety consciousness through verifiable behavior tracked across your entire career. Employers can see your safety track record before hiring. Technicians build career capital through daily diligence.
              </p>
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
            <Card className="border-[#95ADB6]/30 dark:border-[#95ADB6]/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20">
                  <Shield className="w-4 h-4 text-[#95ADB6]" />
                </div>
                <div>
                  <p className="font-medium">Portable Safety Identity</p>
                  <p className="text-base text-muted-foreground">Your PSR follows you when you change employers. Inspections completed at Company A count toward your score even after you leave.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#95ADB6]/30 dark:border-[#95ADB6]/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20">
                  <CircleDot className="w-4 h-4 text-[#95ADB6]" />
                </div>
                <div>
                  <p className="font-medium">Four-Component Scoring</p>
                  <p className="text-base text-muted-foreground">Certifications, safety documents, quizzes, and work history combine into one comprehensive percentage score.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#95ADB6]/30 dark:border-[#95ADB6]/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20">
                  <TrendingUp className="w-4 h-4 text-[#95ADB6]" />
                </div>
                <div>
                  <p className="font-medium">Career Capital Builder</p>
                  <p className="text-base text-muted-foreground">Every harness inspection, every quiz passed, every document signed builds your professional reputation over time.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#95ADB6]/30 dark:border-[#95ADB6]/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20">
                  <Eye className="w-4 h-4 text-[#95ADB6]" />
                </div>
                <div>
                  <p className="font-medium">Employer Visibility</p>
                  <p className="text-base text-muted-foreground">Companies reviewing technician profiles see your PSR, making high scores a competitive advantage when seeking work.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#95ADB6]/30 dark:border-[#95ADB6]/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20">
                  <GraduationCap className="w-4 h-4 text-[#95ADB6]" />
                </div>
                <div>
                  <p className="font-medium">Dynamic Quiz System</p>
                  <p className="text-base text-muted-foreground">Quiz availability adapts to your certification level and employer connection. Level 2 techs see more quizzes than Level 1.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#95ADB6]/30 dark:border-[#95ADB6]/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20">
                  <RefreshCw className="w-4 h-4 text-[#95ADB6]" />
                </div>
                <div>
                  <p className="font-medium">Real-Time Updates</p>
                  <p className="text-base text-muted-foreground">Your PSR updates automatically as you complete safety activities. No manual calculation or reporting required.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#95ADB6]/30 dark:border-[#95ADB6]/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20">
                  <Clock className="w-4 h-4 text-[#95ADB6]" />
                </div>
                <div>
                  <p className="font-medium">Lifetime Aggregation</p>
                  <p className="text-base text-muted-foreground">Safety document score tracks inspections over time across all employers, not just recent activity.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#95ADB6]/30 dark:border-[#95ADB6]/50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#95ADB6]/10 dark:bg-[#95ADB6]/20">
                  <Users className="w-4 h-4 text-[#95ADB6]" />
                </div>
                <div>
                  <p className="font-medium">Workforce Safety Score (WSS)</p>
                  <p className="text-base text-muted-foreground">Company owners see average PSR of all employees for hiring decisions (displayed only, does not impact CSR).</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* PSR Rating Tiers Visual */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <CircleDot className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Rating Tiers</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base mb-4">
            Your PSR score determines your rating tier. Higher scores demonstrate stronger safety consciousness and make you more attractive to employers.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Green - Excellent */}
            <div className="rounded-xl p-6 text-center bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4 ring-4 ring-green-200 dark:ring-green-800">
                <span className="text-white font-bold text-lg">90+</span>
              </div>
              <p className="font-semibold text-green-700 dark:text-green-300">Excellent</p>
              <p className="text-sm text-green-600 dark:text-green-400">Top Safety</p>
              <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-2">Highly sought after by employers</p>
            </div>

            {/* Yellow - Good */}
            <div className="rounded-xl p-6 text-center bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-4 ring-4 ring-emerald-200 dark:ring-emerald-800">
                <span className="text-white font-bold text-lg">70+</span>
              </div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-300">Good</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Solid Record</p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-2">Strong safety foundation</p>
            </div>

            {/* Orange - Needs Work */}
            <div className="rounded-xl p-6 text-center bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mb-4 ring-4 ring-amber-200 dark:ring-amber-800">
                <span className="text-white font-bold text-lg">50+</span>
              </div>
              <p className="font-semibold text-amber-700 dark:text-amber-300">Developing</p>
              <p className="text-sm text-amber-600 dark:text-amber-400">Needs Improvement</p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-2">Complete more quizzes and inspections</p>
            </div>

            {/* Red - Poor */}
            <div className="rounded-xl p-6 text-center bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 ring-4 ring-red-200 dark:ring-red-800">
                <span className="text-white font-bold text-lg">&lt;50</span>
              </div>
              <p className="font-semibold text-red-700 dark:text-red-300">Low</p>
              <p className="text-sm text-red-600 dark:text-red-400">Action Needed</p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-2">Urgent improvement required</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* PSR Component Breakdown */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardCheck className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Component Breakdown</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base mb-4">
            Your PSR is calculated from up to four components, with weights depending on whether you are linked to an employer.
          </p>

          <div className="space-y-4">
            {/* Certifications */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Certifications</h3>
                      <Badge variant="outline" className="text-xs">33% solo / 25% linked</Badge>
                    </div>
                    <p className="text-base text-muted-foreground mb-3">Your IRATA/SPRAT certification status and verification level.</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      <div className="p-2 rounded bg-green-50 dark:bg-green-950 text-center">
                        <p className="font-bold text-green-600">100%</p>
                        <p className="text-xs text-muted-foreground">Valid & Verified</p>
                      </div>
                      <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950 text-center">
                        <p className="font-bold text-emerald-600">75%</p>
                        <p className="text-xs text-muted-foreground">Unverified</p>
                      </div>
                      <div className="p-2 rounded bg-amber-50 dark:bg-amber-950 text-center">
                        <p className="font-bold text-amber-600">50%</p>
                        <p className="text-xs text-muted-foreground">No Expiry Set</p>
                      </div>
                      <div className="p-2 rounded bg-orange-50 dark:bg-orange-950 text-center">
                        <p className="font-bold text-orange-600">25%</p>
                        <p className="text-xs text-muted-foreground">Expired</p>
                      </div>
                      <div className="p-2 rounded bg-red-50 dark:bg-red-950 text-center">
                        <p className="font-bold text-red-600">0%</p>
                        <p className="text-xs text-muted-foreground">None</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Documents */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Safety Documents</h3>
                      <Badge variant="outline" className="text-xs">33% solo / 25% linked</Badge>
                    </div>
                    <p className="text-base text-muted-foreground mb-2">Your harness inspection completion rate over time.</p>
                    <div className="p-3 rounded bg-muted text-base">
                      <p className="font-mono">Score = (Passed Inspections / Total Inspections) x 100</p>
                    </div>
                    <p className="text-base text-muted-foreground mt-2">
                      <span className="font-medium">Key:</span> Calculated OVER TIME across ALL employers, not just the past 30 days. Your inspection history is portable.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Quizzes */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Safety Quizzes</h3>
                      <Badge variant="outline" className="text-xs">34% solo / 25% linked</Badge>
                    </div>
                    <p className="text-base text-muted-foreground mb-2">Your completion of available safety knowledge quizzes.</p>
                    <div className="p-3 rounded bg-muted text-base mb-3">
                      <p className="font-mono">Score = (Quizzes Passed / Available Quizzes) x 100</p>
                    </div>
                    <p className="text-base text-muted-foreground">
                      Quiz availability is dynamic: Level 1 techs have 2 quizzes, Level 2 has 4 quizzes, Level 3 has 6 quizzes. When employer-linked, you also get company document quizzes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work History */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Work History</h3>
                      <Badge variant="outline" className="text-xs">25% (linked only)</Badge>
                    </div>
                    <p className="text-base text-muted-foreground mb-2">Your incident record while linked to an employer.</p>
                    <div className="p-3 rounded bg-muted text-base mb-3">
                      <p className="font-mono">Score = 100% - (10% x Number of Incidents)</p>
                      <p className="font-mono text-sm mt-1">Minimum Score: 50%</p>
                    </div>
                    <p className="text-base text-muted-foreground">
                      Starts at 100%, minus 10% per recorded incident. New workers with no sessions start at 50%. Only applies when linked to an employer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* PSR vs CSR */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl md:text-2xl font-semibold">PSR vs CSR Relationship</h2>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Independence Principle</p>
                  <p className="text-base text-blue-800 dark:text-blue-200">
                    PSR and CSR are calculated separately. They do not directly impact each other. Your personal safety rating does not affect your employer's company safety rating.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#95ADB6]" />
                  PSR (Personal Safety Rating)
                </h3>
                <ul className="space-y-2 text-base text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-[#95ADB6]">-</span>
                    <span>Belongs to individual technician</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#95ADB6]">-</span>
                    <span>Follows you between employers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#95ADB6]">-</span>
                    <span>Employers see during hiring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#95ADB6]">-</span>
                    <span>Personal inspections, quizzes, incidents</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-600" />
                  CSR (Company Safety Rating)
                </h3>
                <ul className="space-y-2 text-base text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">-</span>
                    <span>Belongs to company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">-</span>
                    <span>Stays with company</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">-</span>
                    <span>Property managers see during vendor selection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">-</span>
                    <span>Company docs, toolbox meetings, team compliance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="text-base text-muted-foreground mt-4">
            <span className="font-medium">Indirect Relationship:</span> While PSR does not directly feed into CSR, completing personal safety tasks improves both metrics. Your daily harness inspections improve your PSR AND contribute to your employer's inspection compliance.
          </p>
        </section>

        <Separator />

        {/* Critical Disclaimer */}
        <section className="space-y-4">
          <Card className="border-2 border-amber-400 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">Important: Safety Compliance</p>
                  <p className="text-base text-amber-800 dark:text-amber-200">
                    The Personal Safety Rating helps track and demonstrate safety compliance, but OnRopePro is not a substitute for professional safety training or certification body requirements. You remain responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200 ml-2">
                    <li>Maintaining your official IRATA/SPRAT logbook per certification body requirements</li>
                    <li>Completing all required safety training and assessments</li>
                    <li>Following all applicable OSHA/WorkSafeBC regulations</li>
                    <li>Performing proper equipment inspections regardless of app tracking</li>
                  </ul>
                  <p className="text-base text-amber-800 dark:text-amber-200">
                    PSR is a professional development tool, not a replacement for certified safety programs.
                  </p>
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
              data-testid="button-toggle-all-problems"
            >
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {expandedProblems.length === ALL_PROBLEM_IDS.length ? "Collapse All" : "Expand All"}
            </Button>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            The PSR module solves different problems for different stakeholders. This section is organized by user type to help each stakeholder immediately identify the pain points most relevant to them.
          </p>

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
                  <span className="font-medium">"I can't tell if a candidate is actually safety-conscious before hiring"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You review resumes and conduct interviews, but there's no objective way to verify a technician's actual safety track record. References are subjective. Certifications prove training, not behavior. You've hired techs who looked great on paper but skipped inspections and cut corners once on the job.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> Owner hires Level 2 technician with great references. Within the first month, discovers the tech has been skipping harness inspections "because I've done this for years." Now the owner faces liability exposure and must retrain or terminate.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PSR provides objective, quantified safety data based on actual behavior. View a candidate's inspection completion rate, quiz scores, and document acknowledgment history before making hiring decisions. Data spans their entire career across all employers.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Make data-driven hiring decisions. Identify safety-conscious technicians before they join your team. Reduce liability exposure from careless hires.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4" data-testid="accordion-owner-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I want to incentivize safety without micromanaging"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You know safety matters, but constantly reminding techs to do inspections feels like nagging. You can't be on every site watching everyone. Some techs are diligent; others need constant oversight. You want a system where safety becomes self-motivated.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Real Example:</span> Owner implements bonus structure: "Everyone gets $50 if we have zero incidents this quarter." Result: Techs hide minor incidents to protect the bonus. No behavior change, just hidden problems.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PSR creates individual accountability with visible scores. Techs compete naturally. High PSR becomes a point of professional pride. You can tie compensation to PSR thresholds without monitoring every inspection.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Automated accountability. Tie raises to PSR milestones. "Bring your PSR above 75, you get a dollar more per hour." No micromanagement required.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4" data-testid="accordion-owner-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"New hires might drag down our safety metrics"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You've built a company with excellent safety culture. Your CSR is 97%. You hire three experienced techs with 85% PSRs. If their scores average into your CSR, your rating drops through no fault of your own.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PSR and CSR are calculated separately. The Workforce Safety Score (WSS) shows average employee PSR for your reference, but it does not directly impact your CSR. Your CSR reflects YOUR company's documentation, training, and enforcement systems.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Hire confidently without penalizing your company rating. Use WSS to identify which employees need coaching. CSR stays under your control.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className="border rounded-lg px-4" data-testid="accordion-owner-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I don't know which employees need safety coaching"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You have 15 technicians across multiple job sites. Some are diligent about safety; others cut corners when unsupervised. Without individual tracking, you treat everyone the same, missing opportunities to coach specific people or recognize top performers.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Workforce Safety Score (WSS) displays average PSR of all linked employees. Drill down to see individual PSR scores. Identify low performers early. Recognize and reward high performers.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Targeted coaching instead of blanket policies. Early intervention before incidents occur. Data for performance reviews and compensation decisions.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Operations Managers & Supervisors */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <UserCheck className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">For Operations Managers & Supervisors</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="supervisor-1" className="border rounded-lg px-4" data-testid="accordion-supervisor-1">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I can't verify my crew completed safety requirements before I arrive on site"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You're responsible for crew safety but can't be everywhere at once. You assign a crew to a site, expecting them to complete harness inspections before starting work. But did they? You won't know until you physically check, and by then work may have already started.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PSR component for safety documents tracks harness inspection completion in real-time. System enforces inspection before work sessions can begin. You can verify crew compliance remotely through the dashboard.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Remote compliance verification. Hard enforcement prevents workarounds. Audit trail proves due diligence.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="supervisor-2" className="border rounded-lg px-4" data-testid="accordion-supervisor-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Performance reviews are subjective without safety data"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You're asked to evaluate technicians for raises or promotions. You know who's a "good worker" based on gut feeling, but you can't quantify safety performance. Two techs both have zero incidents, but one consistently completes all safety protocols while the other cuts corners.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PSR provides objective safety data for each technician. Compare scores across your crew. Use historical trends to identify improvement or decline. Support performance decisions with data.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Objective performance data. Fair evaluations based on behavior. Documentation for HR decisions.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Technicians */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Wrench className="w-5 h-5 text-[#95ADB6]" />
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
                  <span className="font-medium">"I've been safe for years but have nothing to prove it"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You've completed thousands of inspections, never had an incident, always sign documents promptly. But when you apply for a new job, you're starting from zero. Your reputation doesn't transfer. You have to prove yourself again at every company.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PSR aggregates your safety activities across ALL employers over your entire career. Every inspection, quiz, and document acknowledgment builds your permanent professional safety record. It follows you when you change jobs.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Quantified proof of your professionalism. Competitive advantage when seeking work. Your reputation is portable.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4" data-testid="accordion-tech-2">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Safety is just paperwork nobody cares about"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You do your inspections because you're supposed to. But it feels like checking boxes. Nobody reviews them. Your diligence isn't recognized or rewarded. Meanwhile, techs who cut corners get the same treatment.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PSR makes your safety behavior visible and valuable. Employers can see your score before hiring. High PSR techs command respect and potentially higher pay. Your daily diligence accumulates into career capital.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Your safety consciousness becomes a measurable asset. "What's your PSR?" becomes a professional benchmark. Pride in your score motivates continued excellence.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-3" className="border rounded-lg px-4" data-testid="accordion-tech-3">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I don't know what I need to do to maximize my score"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You see your PSR percentage but don't understand what factors into it or how to improve. Documentation says "complete quizzes" but you don't know how many or which ones matter for your level.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PSR breaks down into clear components: certifications, safety documents, quizzes, and work history (when employer-linked). Each component shows your current score. Quiz availability is dynamic based on your certification level and employer connection.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Clear path to improvement. Know exactly what counts toward your score. No guessing about requirements.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-4" className="border rounded-lg px-4" data-testid="accordion-tech-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"My hard work doesn't transfer when I change jobs"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You spent two years building a perfect safety record at Company A. You change jobs for better pay. At Company B, you start with no track record. All that diligence, all those inspections, all those quizzes, gone.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> PSR is tied to YOUR technician account, not your employer. When you link to a new company, your entire safety history comes with you. The new employer sees your 95% PSR on day one.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Career continuity. Your professional reputation travels with you. Switching jobs doesn't reset your standing.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Property Managers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-[#6E9075]" />
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
                  <span className="font-medium">"I can't verify if vendors actually enforce safety standards with their teams"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You require vendors to have safety programs. They send you manuals and certificates. But you have no visibility into whether their techs actually follow procedures daily. You're trusting paperwork, not behavior.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR shows company-level compliance. Additionally, you can ask about Workforce Safety Score (WSS), the average PSR of their team. A company with 95% CSR but 65% average PSR has documentation but not culture.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Deeper due diligence capability. Distinguish between "has safety manual" and "practices safety daily."
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
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
                <span className="font-medium">Does PSR affect my employer's CSR?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>No. PSR and CSR are calculated separately and do not directly impact each other. Your employer can see your PSR, but your personal safety rating does not affect their Company Safety Rating. They are independent metrics for different purposes.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left">
                <span className="font-medium">What happens to my PSR when I change companies?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>Your PSR stays with you. It is tied to your technician account, not your employer. All harness inspections, quizzes completed, and safety documents signed remain part of your permanent record. When you join a new company, they see your complete safety history on day one.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
              <AccordionTrigger className="text-left">
                <span className="font-medium">Why is my PSR calculated differently when I'm linked vs solo?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>When you are not linked to an employer, we only have three data sources (certifications, safety documents, quizzes) so each is weighted at 33%. When employer-linked, we can also track your work history and incident record, so all four components are weighted at 25% each for a more complete picture.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
              <AccordionTrigger className="text-left">
                <span className="font-medium">How many quizzes do I need to complete?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>Quiz availability depends on your certification level. Level 1 techs have 2 quizzes available, Level 2 has 4 quizzes, and Level 3 has 6 quizzes. When linked to an employer, you also get access to company document quizzes (Health & Safety Manual, Company Policy, Safe Work Procedures, Safe Work Practices).</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
              <AccordionTrigger className="text-left">
                <span className="font-medium">What is the Workforce Safety Score (WSS)?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>WSS is the average PSR of all employees linked to a company. It is visible only to company owners and operations managers. WSS is an informational metric to help with hiring decisions and identify employees who need coaching. It does NOT impact the company's CSR.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-faq-6">
              <AccordionTrigger className="text-left">
                <span className="font-medium">How do I improve my PSR?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">Focus on these actions to maximize your PSR:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><span className="font-medium">Verify your certification</span> - Verified certs score 100%, unverified score 75%</li>
                  <li><span className="font-medium">Complete all available quizzes</span> - Each quiz improves your Safety Quizzes component</li>
                  <li><span className="font-medium">Do daily harness inspections</span> - Every passed inspection builds your Safety Documents score</li>
                  <li><span className="font-medium">Sign documents promptly</span> - When your employer uploads safety docs, review and sign quickly</li>
                  <li><span className="font-medium">Maintain clean work history</span> - Each incident reduces your Work History score by 10%</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
