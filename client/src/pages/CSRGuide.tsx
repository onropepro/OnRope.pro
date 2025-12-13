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
  Star,
  Shield,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingDown,
  Building2,
  Users,
  Eye,
  Crown,
  Wrench,
  Home,
  Target,
  Lightbulb,
  ChevronsUpDown,
  BookOpen,
  GraduationCap,
  EyeOff
} from "lucide-react";
import { useState } from "react";

export default function CSRGuide() {
  const [expandedProblems, setExpandedProblems] = useState<string[]>([]);

  const toggleAllProblems = () => {
    const allIds = ["owner-1", "owner-2", "owner-3", "owner-4", "tech-1", "tech-2", "pm-1"];
    if (expandedProblems.length === allIds.length) {
      setExpandedProblems([]);
    } else {
      setExpandedProblems(allIds);
    }
  };

  return (
    <ChangelogGuideLayout
      title="Company Safety Rating (CSR) Guide"
      version="2.0"
      lastUpdated="December 12, 2025"
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Company Safety Rating (CSR) is a penalty-based compliance scoring system that provides an empirical measurement of your company's safety posture. Property managers can view a company's CSR score to assess vendor reliability, while company owners gain real-time visibility into their actual safety compliance.
          </p>
          
          <Card className="bg-action-50 dark:bg-action-950 border-action-200 dark:border-action-800">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-action-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-action-900 dark:text-action-100">Starting Score: 75%</p>
                  <p className="text-base text-action-800 dark:text-action-200">
                    CSR starts at <span className="font-bold">75%</span> and reaches <span className="font-bold">100%</span> as soon as your company uploads the three core documents: Certificate of Insurance (COI), Health & Safety Manual, and Company Policy.
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
            <CardContent className="pt-6">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-lg font-medium text-amber-900 dark:text-amber-100 italic">
                  "CSR is not just a number for property managers. It is an empirical way to build safety into your company culture."
                </p>
              </div>
              <p className="text-base text-amber-800 dark:text-amber-200 mt-4">
                The CSR transforms safety from "be safe out there" into measurable accountability. It tells property managers you're a safe company, but more importantly, it tells you as a company owner how safe your business actually is.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Problems Solved Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-action-500" />
              <h2 className="text-xl md:text-2xl font-semibold">Problems Solved</h2>
            </div>
            <button
              onClick={toggleAllProblems}
              className="flex items-center gap-1 text-sm text-muted-foreground hover-elevate rounded-md px-2 py-1"
              data-testid="button-toggle-all-problems"
            >
              <ChevronsUpDown className="w-4 h-4" />
              {expandedProblems.length === 7 ? "Collapse All" : "Expand All"}
            </button>
          </div>

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
              <AccordionItem value="owner-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I know I should be safer, but I don't have time to create all the paperwork"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Creating comprehensive safety documentation from scratch takes days of administrative work that most small business owners don't have.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> OnRopePro provides pre-made templates for Safe Work Procedures and Safe Work Practices. Add documents in 2 minutes, send notification to all employees, each tech signs in 1 minute per document.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> What would take days of administrative work becomes a quick task with full documentation trail.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"When WorkSafe shows up, I can't prove my employees know the procedures"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Regulatory inspections require proof that employees have reviewed and understood safety procedures. Paper trails are often incomplete or missing.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Export a PDF report showing all employee signatures with timestamps for every safety document. When WorkSafe asks "How do you know your employee saw it?", you have immediate proof.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Transform a multi-day compliance nightmare into instant verification.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I don't know how safe my company actually is"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Without measurable metrics, safety becomes guesswork. You think you're safe, but you have no objective evidence.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR provides a single number showing your safety posture instantly. Score drops? You know immediately something needs attention.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Move from "I think we're safe" to "I know we're 87% compliant, and here's exactly what needs improvement."
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"Property managers are choosing competitors over me"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> You invest in safety but have no way to demonstrate that to potential clients during vendor selection.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> Your 87% CSR rating versus a competitor's 35% rating becomes a decisive factor in vendor selection.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Convert your actual safety investment into a competitive advantage that wins contracts.
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
              <AccordionItem value="tech-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I don't know if this company is actually safe to work for"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Your life is literally on the line, but you have no objective way to evaluate an employer's safety commitment before accepting a job.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> CSR is visible to technicians evaluating job offers. Before accepting a position, you can see the company's safety rating.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Would you rather work for a company with a 40 CSR or a 95 CSR? Now you can make informed decisions about your safety.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I need access to safety documents on the job site"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Company policies and procedures are locked in an office filing cabinet while you're suspended 40 stories up.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> All signed safety documents are accessible in the app. Need to check company policy on working alone? It's right there, anytime you need it.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Instant access to every safety document you've signed, from any location.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Property Managers */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Home className="w-5 h-5 text-violet-500" />
              <h3 className="text-lg font-semibold">For Property Managers</h3>
            </div>

            <Accordion 
              type="multiple" 
              value={expandedProblems}
              onValueChange={setExpandedProblems}
              className="space-y-3"
            >
              <AccordionItem value="pm-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">
                  <span className="font-medium">"I can't objectively compare vendor safety"</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">The Pain:</span> Every vendor claims to be "safe" but you have no way to verify or compare their actual safety practices.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Solution:</span> View each vendor's CSR through the "My Vendors" dashboard. Color-coded badges (green/yellow/red) provide instant assessment.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Benefit:</span> Make data-driven vendor decisions based on objective safety metrics, not just marketing claims.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* How CSR Works */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">How CSR Works</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Starting Score</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  CSR starts at <span className="font-bold text-foreground">75%</span> for new companies. Upload your three core documents to reach 100%:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Certificate of Insurance (COI)</li>
                  <li>Health & Safety Manual</li>
                  <li>Company Policy</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Safe Work Documents Impact</CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">
                  When you add Safe Work Procedures or Safe Work Practices templates, your score temporarily decreases until all employees review and sign those documents.
                </p>
                <p className="text-muted-foreground">
                  Once signed, your score returns to full compliance. This ensures every team member has actually read and acknowledged your safety policies.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Penalty Categories */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-rust-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Penalty Categories</h2>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-action-500" />
                    Documentation Penalty
                  </CardTitle>
                  <Badge className="bg-rust-100 text-rust-600 dark:bg-rust-600/20">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Deducted for missing essential company documents:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Certificate of Insurance (COI)</li>
                  <li>Health & Safety Manual</li>
                  <li>Company Policy</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-warning-500" />
                    Project Documents Penalty
                  </CardTitle>
                  <Badge className="bg-rust-100 text-rust-600 dark:bg-rust-600/20">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Each project requires four safety documents. Missing documents impact your score proportionally:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Anchor Inspection <span className="text-sm italic">(waived for non-rope jobs like parkade pressure washing)</span></li>
                  <li>Rope Access Plan</li>
                  <li>Toolbox Meeting</li>
                  <li>Field Level Hazard Assessment (FLHA)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-success-500" />
                    Harness Inspection Penalty
                  </CardTitle>
                  <Badge className="bg-rust-100 text-rust-600 dark:bg-rust-600/20">Max 25%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Based on inspection completion rate across all work sessions:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Each work session should have a corresponding harness inspection</li>
                  <li>Inspections completed before starting work each day</li>
                  <li>Penalty calculated as percentage of missing inspections</li>
                </ul>
                <Card className="bg-muted/50 mt-3">
                  <CardContent className="pt-3 pb-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">How it calculates:</span> The penalty is a straight percentage. If 1 of 1 inspections is missing, that's 100% penalty in this category. If 1 of 100 is missing, that's 1%. As your company accumulates more work sessions, each individual miss has proportionally less impact.
                    </p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-action-500" />
                    Document Review Penalty
                  </CardTitle>
                  <Badge className="bg-warning-100 text-warning-600 dark:bg-warning-600/20">Max 5%</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-base space-y-2">
                <p className="text-muted-foreground">Unsigned employee acknowledgments for:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Health & Safety Manual</li>
                  <li>Company Policy</li>
                  <li>Safe Work Procedures</li>
                  <li>Safe Work Practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* CSR Visibility */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-action-500" />
            <h2 className="text-xl md:text-2xl font-semibold">CSR Visibility</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-success-200 dark:border-success-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-success-500" />
                  Who Can See CSR
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Home className="w-4 h-4 text-violet-500 mt-1" />
                    <div>
                      <p className="font-medium">Property Managers</p>
                      <p className="text-sm text-muted-foreground">Overall CSR percentage badge with color indicator, breakdown by category, accessible through "My Vendors" dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Crown className="w-4 h-4 text-amber-500 mt-1" />
                    <div>
                      <p className="font-medium">Company Owners</p>
                      <p className="text-sm text-muted-foreground">Full dashboard showing overall score, category breakdowns with specific metrics, prioritized improvement tips</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Wrench className="w-4 h-4 text-orange-500 mt-1" />
                    <div>
                      <p className="font-medium">Technicians</p>
                      <p className="text-sm text-muted-foreground">Can view company CSR when evaluating job offers or employers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                  Who Cannot See CSR
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Building Managers</p>
                      <p className="text-sm text-muted-foreground">They handle logistics (keys, water access, site coordination), not vendor selection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="font-medium">Residents</p>
                      <p className="text-sm text-muted-foreground">Would create unnecessary concerns and complaints</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4 bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">Color-Coded Badge System</p>
                  <p className="text-base text-muted-foreground mt-1">
                    Your CSR displays as a color-coded badge indicating compliance level:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">90-100% (Excellent)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-muted-foreground">70-89% (Good)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-muted-foreground">50-69% (Warning)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-muted-foreground">Below 50% (Critical)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Improving Your CSR */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-success-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Improving Your CSR</h2>
          </div>

          <Card className="bg-success-50 dark:bg-success-950 border-success-200 dark:border-success-800">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-success-900 dark:text-success-100">Upload Required Documents</p>
                    <p className="text-base text-success-800 dark:text-success-200">
                      Ensure COI, Health & Safety Manual, and Company Policy are uploaded and current. This brings your baseline score to 100%.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-success-900 dark:text-success-100">Complete Project Documentation</p>
                    <p className="text-base text-success-800 dark:text-success-200">
                      For each project, ensure all four required documents are completed: Anchor Inspection (for rope access jobs), Rope Access Plan, Toolbox Meeting, and FLHA.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-success-900 dark:text-success-100">Require Harness Inspections</p>
                    <p className="text-base text-success-800 dark:text-success-200">
                      Ensure technicians complete harness inspections before starting work each day. Consistent daily compliance builds your score over time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-success-900 dark:text-success-100">Employee Document Sign-Off</p>
                    <p className="text-base text-success-800 dark:text-success-200">
                      Have all employees acknowledge required safety documents through the Documents page. When you add new documents, follow up to ensure everyone signs promptly.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Key Insight */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-warning-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Key Insight: Nobody Is 100% Safe</h2>
          </div>

          <Card className="bg-warning-50 dark:bg-warning-950 border-warning-200 dark:border-warning-800">
            <CardContent className="pt-4">
              <p className="text-base text-warning-800 dark:text-warning-200">
                The CSR system is designed so that perfect 100% scores are extremely difficult to maintain long-term. This is intentional. If it were possible to always be at 100%, safety procedures wouldn't be necessary.
              </p>
              <p className="text-base text-warning-800 dark:text-warning-200 mt-3">
                The goal is continuous improvement and accountability, not perfection. A company with a consistent 85-95% demonstrates genuine safety commitment far better than a theoretical "perfect" score.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Future Enhancements */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Future Enhancements</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-violet-500" />
                  CSR Impact Logging
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <p className="text-violet-800 dark:text-violet-200">
                  Track where and when your company gained or lost rating points, with specific actions tied to score changes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-violet-500" />
                  Training Area
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base">
                <p className="text-violet-800 dark:text-violet-200">
                  Watch safety videos, complete quizzes, listen to podcasts to actively improve your CSR through demonstrated learning.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Summary */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl md:text-2xl font-semibold">Summary</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            The CSR is one of OnRopePro's nucleus modules, fundamental to the entire platform's purpose. It transforms rope access safety from an honor system into an accountable, measurable metric that benefits everyone:
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-amber-500 mt-0.5" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Owners</span> know their actual safety posture
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-orange-500 mt-0.5" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Technicians</span> can evaluate employer safety before accepting jobs
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 text-violet-500 mt-0.5" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Property Managers</span> can make data-driven vendor decisions
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-action-500 mt-0.5" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Industry</span> becomes measurably safer
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base mt-4">
            When you use OnRopePro's safety features, you're not just checking boxes. You're building a documented safety culture that protects your workers, your business, and your reputation.
          </p>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
