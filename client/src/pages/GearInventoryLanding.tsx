import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  HardHat,
  Building2,
  Users,
  Shield,
  Clock,
  Package,
  Database,
  UserCheck,
  Eye,
  DollarSign,
  Timer,
  Calculator,
  Layers,
  CheckCircle2,
  ChevronsUpDown,
  Home,
  Key,
  ClipboardCheck,
  AlertTriangle,
  Zap
} from "lucide-react";

const FAQ_ITEMS = [
  "faq-1", "faq-2", "faq-3", "faq-4", "faq-5", "faq-6", "faq-7", "faq-8", "faq-9", "faq-10"
];

export default function GearInventoryLanding() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const allExpanded = openItems.length === FAQ_ITEMS.length;

  const toggleAll = () => {
    setOpenItems(allExpanded ? [] : [...FAQ_ITEMS]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="modules" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-module-label">
              Gear Inventory Module
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Where's That $400 Harness<br />
              You Bought Last Year?<br />
              <span className="text-blue-100">You Should Know.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Know exactly what equipment your company owns, who has it, and when it needs replacing. Real-time inventory tracking that builds itself as your team works.<br /><br />
              <strong>Equipment management built for rope access professionals<br />who got tired of buying gear they already own.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild data-testid="button-hero-trial">
                <Link href="/register">
                  Start Your Free 60-Day Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-hero-faqs">
                <Link href="#faqs">
                  Find Answers
                  <BookOpen className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
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
                <div className="text-center" data-testid="stat-availability-check">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">4 sec</div>
                  <div className="text-sm text-muted-foreground mt-1">Availability check</div>
                </div>
                <div className="text-center" data-testid="stat-onboard-time">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">10 min</div>
                  <div className="text-sm text-muted-foreground mt-1">Equipment onboarding</div>
                </div>
                <div className="text-center" data-testid="stat-overallocation">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">Zero</div>
                  <div className="text-sm text-muted-foreground mt-1">Overallocation risk</div>
                </div>
                <div className="text-center" data-testid="stat-recovery">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400">$2-4K</div>
                  <div className="text-sm text-muted-foreground mt-1">Annual recovery</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problem Statement Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            The Equipment Black Hole
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                You bought 10 harnesses last year. Today, you can find 6.
              </p>
              <p className="text-base">
                Are they in the shop? In someone's truck? Did that tech who quit last month take them home? You have no idea. So you order more. Another $2,400 gone.
              </p>
              <p className="text-base">
                This happens constantly. Descenders vanish. Ropes disappear. Carabiners multiply and then evaporate. You know you own the equipment. You just can't prove who has it.
              </p>
              <p className="text-base">
                Your spreadsheet was accurate three months ago. Now nobody updates it. When a client calls asking if you can staff a crew tomorrow, you spend 45 minutes calling around, checking the shop, texting employees. By the time you get an answer, you've wasted half your morning and you're still not certain.
              </p>
              <p className="text-base font-medium text-foreground">
                OnRopePro replaces the guesswork with a real-time database. Equipment availability updates automatically when employees assign gear to themselves, when managers distribute equipment, and when items are returned. No manual data entry. No outdated information. One glance tells you what you own, who has it, and what's available.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What This Module Does */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What This Module Does
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Complete equipment tracking from purchase to retirement using a slot-based availability model: Available = Quantity - Assigned.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card data-testid="card-centralized-database">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Centralized Equipment Database</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  Track every piece of equipment your company owns in one place. Add items with pre-loaded rope access brands and models (Petzl, CMC, Kong, ISC). Enter quantities, prices, serial numbers. See real-time availability instantly.
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">What gets tracked:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Equipment type, brand, model, quantity</li>
                    <li>Purchase price (financial permissions only)</li>
                    <li>Serial numbers (optional per item)</li>
                    <li>Date of manufacture and in-service dates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-assignment-management">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">Assignment Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  Know who has what at all times. Assign equipment to employees with complete tracking. Employees can self-assign from available inventory or managers can distribute gear directly.
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">What gets managed:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Equipment assignments by employee</li>
                    <li>Serial number tracking per assignment</li>
                    <li>Assignment history with timestamps</li>
                    <li>Return and retirement workflows</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="card-team-visibility">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-lg">Team Visibility</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-base text-muted-foreground">
                  See your entire company's gear distribution at a glance. The Team Gear view shows every employee and their assigned equipment. Verify crew readiness in seconds, not hours.
                </p>
                <div className="space-y-2 text-base text-muted-foreground">
                  <p className="font-medium text-foreground">What gets visible:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Complete kit status per employee</li>
                    <li>Available inventory for new assignments</li>
                    <li>Equipment gaps before job starts</li>
                    <li>Service life status with color-coded indicators</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Stakeholder Benefits */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Who Benefits From This Module
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Every stakeholder gets the equipment visibility and accountability protection they need.
          </p>
          
          <div className="space-y-8">
            {/* For Rope Access Company Owners */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-owners">
              <CardHeader className="bg-blue-50 dark:bg-blue-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">For Rope Access Company Owners</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Eliminate equipment loss.</h4>
                    <p className="text-base text-muted-foreground">Real-time tracking creates a digital paper trail proving who received what equipment and when. No more "he said/she said" disputes over missing harnesses.</p>
                    <p className="text-base text-muted-foreground">Recover $2,000-4,000 annually in equipment you would have replaced.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Budget accurately for replacements.</h4>
                    <p className="text-base text-muted-foreground">Date of manufacture and in-service dates tracked per item. Color-coded service life indicators show equipment approaching replacement timelines.</p>
                    <p className="text-base text-muted-foreground">Plan purchases months ahead instead of scrambling when gear fails inspections.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Answer "do we have enough gear?" in 4 seconds.</h4>
                    <p className="text-base text-muted-foreground">Accept jobs confidently knowing exactly what equipment is available. Stop losing money on emergency rentals because you couldn't verify inventory in time.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Technicians */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-technicians">
              <CardHeader className="bg-amber-50 dark:bg-amber-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <HardHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">For Technicians</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Build your kit in 10 minutes.</h4>
                    <p className="text-base text-muted-foreground">Browse available inventory, select what you need, assign it to yourself. No waiting for managers. No paperwork.</p>
                    <p className="text-base text-muted-foreground">Your personal kit appears in your profile immediately.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Know your equipment is compliant.</h4>
                    <p className="text-base text-muted-foreground">In-service dates visible for every item in your kit. Complete inspections knowing your gear meets requirements.</p>
                    <p className="text-base text-muted-foreground">No surprises during audits.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Self-service flexibility.</h4>
                    <p className="text-base text-muted-foreground">Need a backup descender for tomorrow's job? Check availability, grab it from inventory, assign it to yourself. Return it when you're done.</p>
                    <p className="text-base text-muted-foreground">No phone calls, no approvals needed.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Building Managers */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-building-mgrs">
              <CardHeader className="bg-violet-50 dark:bg-violet-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <CardTitle className="text-xl">For Building Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Verify contractor equipment compliance.</h4>
                    <p className="text-base text-muted-foreground">Corporate Safety Record visibility through OnRopePro shows contractor equipment tracking and inspection status.</p>
                    <p className="text-base text-muted-foreground">Due diligence documentation before work begins.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Reduce liability exposure.</h4>
                    <p className="text-base text-muted-foreground">If an incident occurs, you can demonstrate you verified contractor equipment protocols.</p>
                    <p className="text-base text-muted-foreground">Professional vendors stand out from competitors through systematic tracking.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Property Managers */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-property-mgrs">
              <CardHeader className="bg-emerald-50 dark:bg-emerald-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">For Property Managers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Contractor qualification at a glance.</h4>
                    <p className="text-base text-muted-foreground">Equipment tracking status indicates which vendors operate professionally.</p>
                    <p className="text-base text-muted-foreground">Make informed decisions about which contractors deserve preferred vendor status.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Residents */}
            <Card className="overflow-hidden" data-testid="card-stakeholder-residents">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Home className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">For Residents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Work performed with tracked, maintained equipment.</h4>
                    <p className="text-base text-muted-foreground">Technicians accessing your building use gear with documented service history and inspection records.</p>
                    <p className="text-base text-muted-foreground">Transparent safety practices.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features Grid */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Key Features
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Six capabilities that transform equipment chaos into organized accountability.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card data-testid="card-feature-slot-based">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                    <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Slot-Based Availability</h4>
                    <p className="text-base text-muted-foreground">
                      Available = Quantity - Assigned. This formula is absolute. Add 10 harnesses, assign 4 to employees, 6 remain available.
                    </p>
                    <p className="text-base text-muted-foreground">
                      Serial numbers are optional metadata, not gatekeepers. Track individual units when needed; skip serials when you don't.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-preloaded">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Pre-Loaded Equipment Database</h4>
                    <p className="text-base text-muted-foreground">
                      Every rope access brand already loaded. Petzl, CMC, Kong, ISC, and more. Select equipment type, pick brand and model, enter quantity.
                    </p>
                    <p className="text-base text-muted-foreground">
                      No manual data entry for specifications. Compare this to typing everything from scratch in a spreadsheet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-dual-assignment">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Dual Assignment Paths</h4>
                    <p className="text-base text-muted-foreground">
                      Managers assign equipment to employees during onboarding or controlled distribution. Employees self-assign from available inventory as needed.
                    </p>
                    <p className="text-base text-muted-foreground">
                      Both methods create complete assignment records automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-financial">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Financial Protection</h4>
                    <p className="text-base text-muted-foreground">
                      Equipment prices visible only to users with financial permissions. Employees see quantities and assignments but not dollar values.
                    </p>
                    <p className="text-base text-muted-foreground">
                      Owners need it for budgeting and insurance. Employees don't need to know what their harness cost.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-service-life">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Timer className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Service Life Tracking</h4>
                    <p className="text-base text-muted-foreground">
                      Date of manufacture and in-service dates per assignment. Color-coded indicators (green, yellow, red) for hard gear (5-year guideline) and soft gear (10-year guideline).
                    </p>
                    <p className="text-base text-muted-foreground">
                      Data for decision-making without automatic retirement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-feature-atomic-serial">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Atomic Serial Registration</h4>
                    <p className="text-base text-muted-foreground">
                      Enter new serial numbers during assignment. System validates, registers, and creates assignment in one operation.
                    </p>
                    <p className="text-base text-muted-foreground">
                      Add serials on the fly as equipment is distributed. Reduce administrative overhead while maintaining complete tracking.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Module Integration Points */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Module Integration Points
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Gear Inventory connects to six other OnRopePro modules, creating the accountability infrastructure for your entire operation.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card data-testid="card-integration-safety">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sky-600" />
                  <CardTitle className="text-base font-medium">Safety & Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Harness inspections require assigned equipment</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Inspection records link to specific serial numbers</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-work-session">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-base font-medium">Work Session Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Validates technicians have required gear assigned</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Accountability built into the workflow</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-employee">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-base font-medium">Employee Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Personal kits become part of technician profiles</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Complete equipment assignment history</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-project">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-base font-medium">Project Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Project requirements can specify equipment needs</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Crew assignment considers available inventory</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-payroll">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-violet-600" />
                  <CardTitle className="text-base font-medium">Payroll & Financials</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Equipment values for insurance documentation</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Replacement budgeting from service life data</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-access">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-base font-medium">User Access & Authentication</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Four permission levels control inventory access</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Granular control over who can see and distribute</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Business Impact Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Stop Counting Harnesses. Start Counting Profits.
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Equipment management becomes something that happens, not something you do.
          </p>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-base">
                Right now, you're spending hours every month on equipment that should manage itself. Hunting for gear. Verifying availability. Documenting assignments. Replacing equipment you probably still own somewhere.
              </p>
              <p className="text-base">
                Your spreadsheet hasn't been updated in three months. Your techs take equipment without telling anyone. New hires get equipped with whatever you can find on short notice. And when gear goes missing, you eat the loss because you can't prove who had it.
              </p>
              <p className="text-base font-medium text-foreground">
                With OnRopePro's Gear Inventory module, your employees build their own kits. They assign equipment to themselves, do their inspections, log their work. Every assignment creates a record. Every return updates availability. The system builds itself because everyone doing their job automatically feeds data into it.
              </p>
              <p className="text-base">
                You get complete visibility without the administrative burden. Know exactly what you own, where it is, and when it needs replacing. Accept jobs confidently. Budget accurately. Protect your investment.
              </p>
            </CardContent>
          </Card>

          {/* Measurable Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <Card className="border-blue-200 dark:border-blue-800" data-testid="card-result-time">
              <CardContent className="pt-6 text-center">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">45 min</div>
                <div className="text-sm text-muted-foreground">Saved per availability check</div>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800" data-testid="card-result-errors">
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Zero</div>
                <div className="text-sm text-muted-foreground">Overallocation errors</div>
              </CardContent>
            </Card>
            <Card className="border-amber-200 dark:border-amber-800" data-testid="card-result-cost">
              <CardContent className="pt-6 text-center">
                <DollarSign className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">$2-4K</div>
                <div className="text-sm text-muted-foreground">Annual cost recovery</div>
              </CardContent>
            </Card>
            <Card className="border-violet-200 dark:border-violet-800" data-testid="card-result-audit">
              <CardContent className="pt-6 text-center">
                <ClipboardCheck className="w-8 h-8 text-violet-600 dark:text-violet-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">100%</div>
                <div className="text-sm text-muted-foreground">Audit-ready records</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQ Section */}
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
            <Button variant="outline" onClick={toggleAll} data-testid="button-toggle-all-accordions">
              <ChevronsUpDown className="w-4 h-4 mr-2" />
              {allExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>
          
          <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
            <AccordionItem value="faq-1" className="border rounded-lg px-4" data-testid="accordion-faq-1">
              <AccordionTrigger className="text-left font-medium">
                What if I have 10 harnesses but only registered 5 serial numbers?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>You still have 10 available slots. Serial numbers are optional metadata, not gatekeepers. The slot-based model counts quantity, not serial registrations.</p>
                <p>Add serials gradually as equipment is distributed.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left font-medium">
                Can two different items have the same serial number?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>Yes. Serial numbers must be unique within each gear item type, but a harness and a rope can both have serial "HR-001." Different manufacturers use similar numbering schemes.</p>
                <p>The system prevents duplicates within an item type, which is what matters for tracking.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4" data-testid="accordion-faq-3">
              <AccordionTrigger className="text-left font-medium">
                What happens when equipment expires?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>The system tracks in-service dates with color-coded indicators for review. Hard gear (5 years) and soft gear (10 years) guidelines are displayed.</p>
                <p>You decide when to retire based on inspections and manufacturer recommendations. OnRopePro provides data for decision-making; actual retirement decisions should involve qualified safety professionals.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4" data-testid="accordion-faq-4">
              <AccordionTrigger className="text-left font-medium">
                Who can see equipment prices?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>Only users with financial permissions. Regular employees see quantities and assignments but not dollar values.</p>
                <p>Financial data is sensitive. Owners need it for budgeting and insurance. Employees don't need to know what their harness cost.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4" data-testid="accordion-faq-5">
              <AccordionTrigger className="text-left font-medium">
                Can I delete a serial number that's assigned to someone?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>No. Return the gear assignment first, then delete or edit the serial. This prevents orphaned assignments pointing to non-existent serials.</p>
                <p>Data integrity is maintained by enforcing proper return workflow.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4" data-testid="accordion-faq-6">
              <AccordionTrigger className="text-left font-medium">
                What if I need to reduce quantity below what's assigned?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>You cannot. If 5 items are assigned, you cannot reduce quantity below 5. Return some assignments first.</p>
                <p>This prevents negative availability and ensures the system always reflects physical reality.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4" data-testid="accordion-faq-7">
              <AccordionTrigger className="text-left font-medium">
                Do employees need permission to assign gear to themselves?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>No. All employees can self-assign from available inventory and remove their own assignments. No special permission required.</p>
                <p>This reduces administrative burden while maintaining complete tracking.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4" data-testid="accordion-faq-8">
              <AccordionTrigger className="text-left font-medium">
                How does equipment get added to inventory?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>Navigate to inventory, add item, select equipment type, pick brand and model from pre-loaded database, enter quantity.</p>
                <p>Optionally add serial numbers and assign to employees during the same workflow. One-time setup, then the system maintains itself.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4" data-testid="accordion-faq-9">
              <AccordionTrigger className="text-left font-medium">
                What's the difference between 'Manage Inventory' and 'Assign Gear' permissions?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>Manage Inventory allows adding new gear items, editing quantities, and registering serial numbers. Assign Gear allows distributing equipment to other employees.</p>
                <p>Owners have both. Supervisors might have Assign Gear without Manage Inventory, depending on your workflow.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-10" className="border rounded-lg px-4" data-testid="accordion-faq-10">
              <AccordionTrigger className="text-left font-medium">
                Can employees see what gear coworkers have?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-3">
                <p>Only with View Team Gear permission. Otherwise, employees see only their own kit.</p>
                <p>Owners and supervisors typically have Team Gear visibility. Regular techs typically don't.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Know Where Your Equipment Is?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Start your free 60-day trial. No credit card required. Full access to all features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#0B64A3] hover:bg-[#0369A1]" asChild data-testid="button-cta-trial">
              <Link href="/register">
                Start Your Free 60-Day Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-cta-pricing">
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-16"></div>
    </div>
  );
}
