import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { PublicHeader } from "@/components/PublicHeader";
import { EmployerRegistration } from "@/components/EmployerRegistration";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { 
  ArrowRight, 
  Users, 
  Building2, 
  Clock, 
  DollarSign, 
  Shield, 
  MessageSquare,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  BarChart3,
  Wrench,
  ClipboardCheck,
  FolderOpen,
  Camera,
  Lock,
  Mail,
  HardHat,
  Briefcase,
  Home,
  TrendingUp,
  Loader2
} from "lucide-react";

const EMPLOYER_COLOR = "#0B64A3";

export default function Employer() {
  const [, setLocation] = useLocation();
  const { openLogin } = useAuthPortal();
  const [roiEmployeeCount, setRoiEmployeeCount] = useState(12);
  const [showRegistration, setShowRegistration] = useState(false);

  const whatWeDoCards = [
    {
      title: "Track Every Project in One Place",
      description: "Manage 10-20 concurrent jobs from a single dashboard. See which elevations are complete. Know if you're on budget before the job ends. Access every past project for repeat quotes.",
      items: [
        "4-elevation progress (North, East, South, West)",
        "Parkade stalls, in-suite units, ground-level work",
        "Hours logged against each project",
        "Photos, complaints, and safety documentation",
        "Budget vs. actual in real-time"
      ],
      icon: Building2
    },
    {
      title: "Eliminate Payroll Chaos",
      description: "Clock in/out from smartphones. Hours flow directly to payroll. Rates stay locked. Disputes disappear. Export to QuickBooks, ADP, or any payroll system.",
      items: [
        "Billable and non-billable hours with one tap",
        "Individual rates per technician (fully customizable)",
        "Overtime calculations (configurable thresholds)",
        "Complete audit trail for every session",
        "Gross pay calculations per pay period"
      ],
      icon: DollarSign
    },
    {
      title: "Prove Your Safety Culture",
      description: "Digital toolbox meetings with signatures. Equipment inspections with photos. IRATA logbook hour tracking. Complete documentation for audits, insurance, and clients who need to see you do things right.",
      items: [
        "Daily equipment inspections with pass/fail",
        "Toolbox meeting attendance and topics",
        "Hazard identification with photos",
        "IRATA/SPRAT logbook hours",
        "Exportable PDF reports for compliance"
      ],
      icon: Shield
    }
  ];

  const connectionExamples = [
    {
      title: "Work Sessions → Projects → Payroll",
      description: "Technician clocks in at Building A. Hours appear on Project A's budget. When you run payroll, those hours are already there. No spreadsheet reconciliation. No disputes."
    },
    {
      title: "Complaints → Projects → Residents",
      description: "Resident submits complaint with photo. Crew lead sees it on their project dashboard. Resolution notes visible to resident. Building manager sees you handled it in 24 hours, not 3 days."
    },
    {
      title: "Employees → Permissions → Everything",
      description: "You set permission levels once. Your supervisor sees project progress but not pay rates. Your technicians log drops but can't edit budgets. Financial data stays with people who need it."
    },
    {
      title: "Equipment → Safety → Audits",
      description: "Harness inspection logged with photo. That record connects to the technician who used it, the project they worked, and the date. IRATA auditor asks for 6 months of inspections? Export a PDF in 10 seconds."
    }
  ];

  const employerBenefits = [
    {
      title: "Stop Losing Money to Payroll Errors",
      description: "A $1,200 payroll mistake happens once and you don't notice. It happens again. By month six, you've lost $7,000+ to spreadsheet errors and hour disputes. OnRopePro captures exact hours, applies exact rates, and gives you audit-ready records that eliminate \"I swear I worked 9 hours\" conversations.",
      result: "87-93% reduction in payroll processing time. Zero hour disputes."
    },
    {
      title: "Know Which Jobs Make Money Before They End",
      description: "Your last job lost money. You found out three weeks after the crew packed up. With OnRopePro, you see labor costs accumulating in real-time. Budget alerts fire when you're trending over. Historical cost-per-drop data makes your next quote accurate, not hopeful.",
      result: "15-20% improvement in quote accuracy. Early warning on over-budget jobs."
    },
    {
      title: "Prove Your Safety Culture to Anyone Who Asks",
      description: "Insurance auditor wants toolbox meeting records. IRATA assessor needs equipment inspections. Client RFP requires safety documentation. You open OnRopePro, export PDFs, and send them. The paper filing cabinet stays closed.",
      result: "10-20% insurance premium savings from documented safety culture."
    },
    {
      title: "Stop Being the Middleman on Every Complaint",
      description: "Resident calls the building manager. Building manager calls you. You call your crew lead. Three days later, someone remembers to close the loop. With OnRopePro's resident portal, complaints go directly to your team. Resolution notes are visible to residents. Building managers see you're responsive without a single phone call.",
      result: "70% reduction in service calls. 24-hour resolution vs. 3-day phone tag."
    },
    {
      title: "Control Who Sees What",
      description: "Your supervisor needs project access but shouldn't see everyone's pay rates. Your Level 3 lead can approve sessions but can't edit budgets. OnRopePro's 44 individual permissions let you grant exactly the access each role requires. Financial privacy stays intact.",
      result: "Complete control without micromanagement."
    }
  ];

  const numbersThatMatter = [
    { metric: "Payroll Time", before: "4-8 hours", after: "30 minutes", note: "per pay period" },
    { metric: "Quote Accuracy", before: "Guesswork", after: "15-20% fewer money-losing bids", note: "" },
    { metric: "Service Calls", before: "Constant phone tag", after: "70% fewer calls", note: "" },
    { metric: "Audit Prep", before: "10+ hours", after: "10 seconds", note: "Export PDF" }
  ];

  const pricingExamples = [
    { size: "Solo Operator", techs: 3, monthly: "$204", annual: "$2,448" },
    { size: "Small", techs: 6, monthly: "$309", annual: "$3,708" },
    { size: "Medium", techs: 15, monthly: "$624", annual: "$7,488" },
    { size: "Large", techs: 30, monthly: "$1,149", annual: "$13,788" },
    { size: "Enterprise", techs: 50, monthly: "$1,849", annual: "$22,188" }
  ];

  const modules = {
    operations: [
      { name: "Project Management", desc: "4-elevation, parkade, in-suite", icon: Building2 },
      { name: "Work Session Tracking", desc: "GPS clock in/out", icon: Clock },
      { name: "Active Workers Dashboard", desc: "Real-time visibility", icon: Users },
      { name: "Scheduling Calendar", desc: "Drag-and-drop assignments", icon: Calendar }
    ],
    payroll: [
      { name: "Payroll Processing", desc: "Export-ready reports", icon: DollarSign },
      { name: "Non-Billable Hours", desc: "Track every hour type", icon: FileText },
      { name: "Performance Analytics", desc: "Productivity insights", icon: BarChart3 },
      { name: "Quoting", desc: "Coming Soon", icon: TrendingUp }
    ],
    safety: [
      { name: "Equipment Inventory", desc: "Inspections with photos", icon: Wrench },
      { name: "Toolbox Meetings", desc: "Digital signatures", icon: ClipboardCheck },
      { name: "IRATA/SPRAT Logging", desc: "Certification tracking", icon: FileText },
      { name: "Document Repository", desc: "Centralized storage", icon: FolderOpen }
    ],
    communication: [
      { name: "Resident Portal", desc: "Two-way feedback", icon: MessageSquare },
      { name: "Complaint Management", desc: "Photo evidence", icon: Camera },
      { name: "Client Management", desc: "Building relationships", icon: Briefcase },
      { name: "Photo Galleries", desc: "Progress documentation", icon: Camera }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader activeNav="employer" />

      {/* Hero Section */}
      <section 
        className="relative text-white pb-[120px]"
        style={{ backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)' }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
              For Rope Access Companies
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Run Your Rope Access Company.<br />
              <span className="text-blue-100">Not Your Spreadsheets.</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              OnRopePro replaces scattered spreadsheets, paper forms, and text chains with one connected system for projects, payroll, safety, and client communication.<br />
              <strong>Simple pricing. Unlimited projects.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-white text-[#0B64A3] hover:bg-blue-50" 
                onClick={() => setLocation('/get-license')}
                data-testid="button-hero-start-trial"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10" 
                onClick={openLogin}
                data-testid="button-hero-sign-in"
              >
                Sign In
              </Button>
            </div>

            <p className="text-sm text-blue-100/80">
              30-day free trial. You won't be charged until the trial ends.
            </p>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute -bottom-[1px] left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      {/* Stats Panel */}
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-700">87-93%</div>
                  <div className="text-sm text-muted-foreground mt-1">Less Payroll Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">15-20%</div>
                  <div className="text-sm text-muted-foreground mt-1">Better Quote Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">70%</div>
                  <div className="text-sm text-muted-foreground mt-1">Fewer Service Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">44</div>
                  <div className="text-sm text-muted-foreground mt-1">Permission Controls</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            You Didn't Start Your Company to Wrestle Spreadsheets.
          </h2>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-center">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              You spent years on the ropes. You saw companies cut corners. You decided to do things the right way.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Now you're running a business. And "the right way" means 8 hours wrestling payroll every two weeks. It means texts from crew at 6 AM asking which building they're working. It means paper safety forms in a filing cabinet you haven't touched since the last audit.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              You track hours in one spreadsheet. Projects in another. Drop counts in a third. Complaints come through email, text, and phone calls from building managers who want updates you don't have time to give.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Your supervisor accidentally sees what your Level 3 lead makes. A technician disputes his hours. You find out your last job lost money three weeks after it finished.
            </p>
            
            <p className="text-xl font-semibold text-foreground mb-6">
              This isn't what you signed up for.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              You started this company to run quality operations, not to become an admin nightmare. To protect your crew, not to spend Sundays fixing payroll. To build something, not to chase paper.
            </p>
            
            <p className="text-xl font-bold text-[#0B64A3] mt-8">
              OnRopePro gives you that back.
            </p>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section - PRESERVED */}
      <section className="py-16 md:py-24 px-6 bg-[#0B64A3]/10 dark:bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Calculate Your Hidden Costs<br />
            In Less Than 60 Seconds
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Most rope access companies waste $15,000-25,000 per year on scattered online SAAS tools, manual processes, hidden admin costs, and wasted time. Find out how much you could save.
          </p>
          
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-3 justify-center">
                <Users className="w-6 h-6 text-[#0B64A3]" />
                <h3 className="text-lg font-semibold">
                  How many employees work in the field or office?
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">5 employees</span>
                  <span className="text-3xl font-bold text-[#0B64A3]">{roiEmployeeCount}</span>
                  <span className="text-sm text-muted-foreground">50 employees</span>
                </div>
                <Slider
                  value={[roiEmployeeCount]}
                  onValueChange={(value) => setRoiEmployeeCount(value[0])}
                  min={5}
                  max={50}
                  step={1}
                  className="w-full"
                  data-testid="slider-landing-employee-count"
                />
                <p className="text-sm text-muted-foreground text-center">
                  Include all field technicians, office staff, and management
                </p>
              </div>
              
              <Button 
                size="lg"
                onClick={() => setLocation(`/roi-calculator?employees=${roiEmployeeCount}&step=2`)}
                className="w-full gap-2 focus:ring-4 focus:ring-action-500/50"
                data-testid="button-roi-calculator-next"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What OnRopePro Does Section */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One Connected System for Everything Your Company Does
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              OnRopePro replaces 5-10 scattered tools with one platform where projects, hours, safety, and communication connect automatically. What you enter once flows everywhere it needs to go.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whatWeDoCards.map((card, i) => (
              <Card key={i} className="bg-card">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-[#0B64A3]/10 flex items-center justify-center mb-4">
                    <card.icon className="w-6 h-6 text-[#0B64A3]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-base text-muted-foreground mb-4">{card.description}</p>
                  <ul className="space-y-2">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-base">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Everything Connects Section */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Every Module Talks to Every Other Module
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              This isn't 16 separate tools. It's one system. Data flows automatically between modules, eliminating double-entry and connecting your operations in ways spreadsheets never could.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {connectionExamples.map((example, i) => (
              <Card key={i} className="bg-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2 text-[#0B64A3]">{example.title}</h3>
                  <p className="text-base text-muted-foreground">{example.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers Benefits Section */}
      <section className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Built for How You Actually Run Your Business
          </h2>

          <div className="space-y-6">
            {employerBenefits.map((benefit, i) => (
              <Card key={i} className="bg-card">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#0B64A3]/10 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="w-5 h-5 text-[#0B64A3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-base text-muted-foreground mb-4">{benefit.description}</p>
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3">
                        <p className="text-base font-medium text-emerald-700 dark:text-emerald-400">
                          Result: {benefit.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Numbers That Matter Section */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            The Numbers That Matter
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {numbersThatMatter.map((item, i) => (
              <Card key={i} className="bg-card text-center">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">{item.metric}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      <span className="text-base text-rose-600 line-through">{item.before}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-base font-semibold text-emerald-600">{item.after}</span>
                    </div>
                    {item.note && (
                      <p className="text-sm text-muted-foreground">{item.note}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing Section */}
      <section className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              One Formula. No Surprises.
            </h2>
            <div className="bg-[#0B64A3]/5 rounded-2xl p-8 max-w-md mx-auto mb-6">
              <div className="text-4xl font-bold text-[#0B64A3] mb-2">
                $99<span className="text-xl font-normal">/month</span> + $34.95<span className="text-xl font-normal">/technician</span>
              </div>
              <p className="text-lg text-muted-foreground">
                Unlimited projects. Unlimited residents. One predictable bill.
              </p>
            </div>
          </div>

          <Card className="bg-card mb-8">
            <CardContent className="p-6 overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold">Company Size</th>
                    <th className="text-center py-3 px-2 font-semibold">Technicians</th>
                    <th className="text-center py-3 px-2 font-semibold">Monthly Cost</th>
                    <th className="text-center py-3 px-2 font-semibold">Annual Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingExamples.map((row, i) => (
                    <tr key={i} className="border-b border-muted/50">
                      <td className="py-3 px-2 font-medium">{row.size}</td>
                      <td className="py-3 px-2 text-center">{row.techs}</td>
                      <td className="py-3 px-2 text-center text-[#0B64A3] font-semibold">{row.monthly}</td>
                      <td className="py-3 px-2 text-center">{row.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="bg-[#0B64A3]/5 border-[#0B64A3]/20">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4 text-center">The Math is Simple</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-lg font-semibold text-emerald-600">$1,200 saved</p>
                  <p className="text-base text-muted-foreground">One avoided payroll error</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-emerald-600">$900 saved</p>
                  <p className="text-base text-muted-foreground">One accurate quote on a job you'd have underpriced</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-emerald-600">$4,550/year saved</p>
                  <p className="text-base text-muted-foreground">7 hours back per pay period at $25/hour admin cost</p>
                </div>
              </div>
              <p className="text-center text-lg font-bold mt-6">
                Most companies recoup their investment in the first quarter.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What's Included - 16 Modules */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">16 Connected Modules</h2>
            <p className="text-lg text-muted-foreground">
              Role-based permissions (44 individual controls). Complete audit trails. Searchable history. PDF exports. Mobile-first design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#0B64A3]">Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.operations.map((mod, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <mod.icon className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <p className="text-base font-medium">{mod.name}</p>
                      <p className="text-sm text-muted-foreground">{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#0B64A3]">Payroll & Finance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.payroll.map((mod, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <mod.icon className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <p className="text-base font-medium">{mod.name}</p>
                      <p className="text-sm text-muted-foreground">{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#0B64A3]">Safety & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.safety.map((mod, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <mod.icon className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <p className="text-base font-medium">{mod.name}</p>
                      <p className="text-sm text-muted-foreground">{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#0B64A3]">Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.communication.map((mod, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <mod.icon className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <p className="text-base font-medium">{mod.name}</p>
                      <p className="text-sm text-muted-foreground">{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Technicians Section */}
      <section className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-[#5C7A84]/10 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#5C7A84]/20 flex items-center justify-center">
                  <HardHat className="w-5 h-5 text-[#5C7A84]" />
                </div>
                <CardTitle className="text-xl">For Your Technicians</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg text-muted-foreground mb-6">
                Your crew doesn't want another app. They want simple. OnRopePro gives them:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">One-Tap Clock In/Out</h4>
                  <p className="text-base text-muted-foreground">Start day. End day. Switch projects. That's it.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Smart Drop Logging</h4>
                  <p className="text-base text-muted-foreground">Select project once. Log drops for the rest of the day. No re-entering building details.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Their Hours, Verified</h4>
                  <p className="text-base text-muted-foreground">They see their logged hours. You see them verified. No "I swear I worked 9 hours" because everything's timestamped.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Portable Career Record</h4>
                  <p className="text-base text-muted-foreground">IRATA logbook hours tracked automatically. Certification reminders before they expire.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* For Building Managers Section */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-[#B89685]/10 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#B89685]/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#B89685]" />
                </div>
                <CardTitle className="text-xl">For Building Managers</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg text-muted-foreground mb-6">
                Building managers need to know work is progressing. They need documentation for their boards. They need to verify your crew is qualified. OnRopePro gives them all of this without a single phone call from you.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Vendor Verification</h4>
                  <p className="text-base text-muted-foreground">Managers can verify your company is on the platform, check certifications, and see safety ratings before work begins.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Progress Visibility</h4>
                  <p className="text-base text-muted-foreground">Real-time project status. Photos. Completion percentages. They see the work happening without asking you for updates.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Complaint Resolution</h4>
                  <p className="text-base text-muted-foreground">When residents submit complaints, managers see they're being handled. Your responsiveness becomes visible evidence.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Documentation on Demand</h4>
                  <p className="text-base text-muted-foreground">COI verification. Safety records. Project history. Available when they need it, exported when they request it.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* For Residents Section */}
      <section className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-[#86A59C]/10 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#86A59C]/20 flex items-center justify-center">
                  <Home className="w-5 h-5 text-[#86A59C]" />
                </div>
                <CardTitle className="text-xl">For Residents</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-lg text-muted-foreground mb-6">
                Happy residents mean quiet phones. When residents can submit issues directly and see them being handled, they stop calling you and your client.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Direct Issue Submission</h4>
                  <p className="text-base text-muted-foreground">Residents submit complaints with photos through a simple portal. No phone calls, no lost emails.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Real-Time Status</h4>
                  <p className="text-base text-muted-foreground">They can see when their issue was viewed and track resolution progress. Transparency builds trust.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Visible Resolution</h4>
                  <p className="text-base text-muted-foreground">When you close an issue, they see it closed. No follow-up calls asking "did anyone look at this?"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        className="relative text-white py-16 md:py-24 px-4"
        style={{ backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop Wrestling Spreadsheets</h2>
          <p className="text-xl text-blue-100 mb-8">
            30-day free trial. Full access to every feature. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#0B64A3] hover:bg-blue-50" 
              onClick={() => setLocation('/get-license')}
              data-testid="button-cta-start-trial"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-cta-view-pricing">
              <Link href="/pricing">
                View Full Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-semibold text-white mb-2">Simple Pricing</h4>
              <p className="text-base">$99/month + $34.95/technician. Everything included.</p>
            </div>
            <div>
              <Lock className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-semibold text-white mb-2">No Lock-In</h4>
              <p className="text-base">Monthly billing. Cancel anytime. Export your data whenever you want.</p>
            </div>
            <div>
              <Mail className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <h4 className="text-lg font-semibold text-white mb-2">Real Support</h4>
              <p className="text-base">Same-day email response. Documentation that actually helps.</p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-slate-700">
            <p className="text-sm text-slate-500">OnRopePro - Built by Rope Access, for Rope Access</p>
          </div>
        </div>
      </section>

      {/* Employer Registration Modal */}
      <EmployerRegistration 
        open={showRegistration} 
        onOpenChange={setShowRegistration} 
      />
    </div>
  );
}
