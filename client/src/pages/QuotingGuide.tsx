import { useState } from "react";
import ChangelogGuideLayout from "@/components/ChangelogGuideLayout";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Target,
  Calculator,
  Kanban,
  Camera,
  Zap,
  Building2,
  Crown,
  Briefcase,
  Wrench,
  ChevronsUpDown,
  Star,
  AlertTriangle,
  Info,
  CheckCircle2,
  DollarSign,
  FileText,
  Settings,
  Lock,
  Users,
  BarChart3,
  Link2,
  HelpCircle,
  Layers,
  EyeOff,
  Send
} from "lucide-react";

const ALL_ACCORDION_ITEMS = [
  "owner-1", "owner-2", "owner-3", "owner-4",
  "ops-1", "ops-2",
  "tech-1"
];

export default function QuotingGuide() {
  const [openItems, setOpenItems] = useState<string[]>(["owner-1"]);
  const [faqOpenItems, setFaqOpenItems] = useState<string[]>([]);
  const allExpanded = ALL_ACCORDION_ITEMS.every(item => openItems.includes(item));

  const toggleAll = () => {
    if (allExpanded) {
      setOpenItems([]);
    } else {
      setOpenItems([...ALL_ACCORDION_ITEMS]);
    }
  };

  return (
    <ChangelogGuideLayout
      title="Quoting & Sales Pipeline Guide"
      version="1.0"
      lastUpdated="December 16, 2025"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-muted-foreground leading-relaxed text-base">
            The Quoting & Sales Pipeline module transforms how rope access companies create, track, and convert sales opportunities. Service-specific pricing formulas eliminate calculation errors, a visual Kanban pipeline ensures no opportunity slips through the cracks, and one-click conversion turns won quotes into active projects with all data intact.
          </p>
        </section>

        {/* Golden Rule Section */}
        <section className="space-y-6">
          <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-100">
                <Target className="w-5 h-5" />
                The Golden Rule: Configure Before Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 dark:text-amber-100 space-y-4">
              <div className="bg-white dark:bg-amber-900 rounded-lg p-4 text-center">
                <p className="text-xl md:text-2xl font-mono font-bold">
                  Total Cost = Hours x Rate + Service Fees
                </p>
              </div>
              
              <div className="space-y-2 text-base">
                <p><strong>The Formula Breakdown:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Hours</strong>: Calculated from service-specific inputs (drops, stalls, units)</li>
                  <li><strong>Rate</strong>: Your configured hourly rate for the service type</li>
                  <li><strong>Service Fees</strong>: Optional add-ons (equipment, access, materials)</li>
                </ul>
              </div>

              <div className="bg-amber-100 dark:bg-amber-800 rounded-lg p-3 text-base">
                <p className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Why This Matters
                </p>
                <p className="mt-1">Every service type has its own pricing model. Window cleaning calculates from drops per day. Parkade cleaning calculates from stall count. The system applies the right formula automatically, eliminating the mental math that leads to underquoting or overquoting.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Pricing Models Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Pricing Models by Service Type</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Service Type</TableHead>
                    <TableHead className="font-semibold">Pricing Formula</TableHead>
                    <TableHead className="font-semibold">Key Inputs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Window / Building Wash</TableCell>
                    <TableCell><code className="bg-muted px-2 py-1 rounded text-sm">Hours x Rate</code></TableCell>
                    <TableCell>Drops per elevation, drops/day target</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Parkade Cleaning</TableCell>
                    <TableCell><code className="bg-muted px-2 py-1 rounded text-sm">Stalls x Rate</code></TableCell>
                    <TableCell>Total stalls, price per stall</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dryer Vent</TableCell>
                    <TableCell><code className="bg-muted px-2 py-1 rounded text-sm">Units x Rate OR Hours x Rate</code></TableCell>
                    <TableCell>Unit count or estimated hours</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ground Work</TableCell>
                    <TableCell><code className="bg-muted px-2 py-1 rounded text-sm">Hours x Rate</code></TableCell>
                    <TableCell>Estimated hours</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Painting</TableCell>
                    <TableCell><code className="bg-muted px-2 py-1 rounded text-sm">Drops x Rate</code></TableCell>
                    <TableCell>Drop count (per-drop pricing)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Custom Service</TableCell>
                    <TableCell><code className="bg-muted px-2 py-1 rounded text-sm">Configurable</code></TableCell>
                    <TableCell>User-defined inputs</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Critical Corrections Required */}
        <section>
          <Card className="border-2 border-rose-500 bg-rose-50 dark:bg-rose-950">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-rose-900 dark:text-rose-100">
                <AlertTriangle className="w-5 h-5" />
                Current Limitations (December 2025)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-rose-900 dark:text-rose-100 space-y-3 text-base">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Tax Calculation</p>
                    <p>Currently hardcoded at 13% HST. Location-based automatic tax calculation is planned for a future release. Verify tax rates manually for your jurisdiction.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Send className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Email Integration</p>
                    <p>Direct email sending is not available. Download your quote as a PDF and email it manually to clients.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Quote Permissions</p>
                    <p>Dedicated quote permissions are being added to the system. Currently controlled through general financial access permissions.</p>
                  </div>
                </div>
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

          <div className="grid gap-3 md:grid-cols-2" data-testid="grid-key-features">
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-auto-calculation">
              <Calculator className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Automatic Cost Calculation</p>
                <p className="text-muted-foreground text-base">Service-specific formulas eliminate manual errors. Enter drops, stalls, or hours, and the system calculates the total automatically.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-kanban">
              <Kanban className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Kanban Sales Pipeline</p>
                <p className="text-muted-foreground text-base">Visual board with Draft, Submitted, Review, Negotiation, Won, and Lost stages. Never lose track of a sales opportunity again.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-privacy">
              <EyeOff className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Financial Privacy</p>
                <p className="text-muted-foreground text-base">Technicians can create quotes and capture site details without seeing pricing information. Pricing visibility controlled by permissions.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-photo">
              <Camera className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Photo Capture</p>
                <p className="text-muted-foreground text-base">Technicians photograph building elevations on site. Owners review photos when finalizing pricing, ensuring accurate quotes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-conversion">
              <Zap className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">One-Click Conversion</p>
                <p className="text-muted-foreground text-base">Convert won quotes to active projects instantly. All pricing, building info, and service details transfer automatically.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded" data-testid="feature-multi-building">
              <Building2 className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-base">Multi-Building Support</p>
                <Badge variant="secondary" className="ml-2 text-xs">In Development</Badge>
                <p className="text-muted-foreground text-base mt-1">Quote complexes with Tower A, B, C configurations. Different floor counts and drop totals per building.</p>
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

          {/* For Company Owners */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Company Owners</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3" data-testid="accordion-owners">
              <AccordionItem value="owner-1" className={`border rounded-lg px-4 ${openItems.includes("owner-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-owner-1">
                  <span className="text-left font-medium">"My quotes don't add up, and I keep undercharging"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You create a quote with 30 drops but only charge $1,000. Your partner reviews it and asks how that math works. You realize you forgot to account for the time it takes per drop, and now you've either lost money or have to go back to the client with an awkward price increase.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Tommy's business partner Jeff would regularly catch calculation errors in quotes. "How does that add up? You have 30 drops and you're only charging a thousand dollars." These errors eroded margins and created uncomfortable client conversations.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Service-specific formulas automatically calculate totals. Enter drops per elevation, your drops-per-day target, and hourly rate. The system calculates total hours and applies your rate. No mental math required.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Eliminate pricing errors that cost you money. Every quote is mathematically accurate based on your configured rates and realistic productivity targets.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-2" className={`border rounded-lg px-4 ${openItems.includes("owner-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-owner-2">
                  <span className="text-left font-medium">"I completely forget about sales opportunities"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You send a quote and then get busy with active projects. Weeks later, you remember you never followed up. The client went with someone else. Or worse, they were ready to say yes but never heard from you.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Glenn shared that he's had times where he completely forgot about sales opportunities. No follow-up system meant quotes sat in email threads, invisible and forgotten until it was too late.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> The Kanban pipeline provides visual stage tracking. Every quote lives in a visible stage: Draft, Submitted, Review, Negotiation, Won, or Lost. You see your entire sales pipeline at a glance.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Never lose a sale due to forgotten follow-up. Visual pipeline shows total value at each stage, helping you prioritize your sales efforts.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-3" className={`border rounded-lg px-4 ${openItems.includes("owner-3") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-owner-3">
                  <span className="text-left font-medium">"My techs see pricing and then try to do jobs themselves"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You need technicians to help gather site information for quotes, but when they see how much you charge, they start thinking about going independent. You're essentially training your future competition.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Tommy described exactly this scenario: "When I started seeing the price that it was charging, that's when I started trying to do my own jobs." Pricing transparency with employees can accelerate their departure.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Permission-based pricing visibility. Technicians can create quotes, enter drop counts, take photos, and capture building details, all without seeing any dollar amounts. Only users with Financial Access permission see pricing.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Leverage your team for site assessments without exposing your pricing strategy. Maintain competitive advantage while delegating quote preparation work.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="owner-4" className={`border rounded-lg px-4 ${openItems.includes("owner-4") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-owner-4">
                  <span className="text-left font-medium">"Converting won quotes into projects is tedious"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> A client says yes, and now you have to manually create a project, re-enter all the building information, copy over pricing details, and set up the job. It's double data entry, and details get lost in translation.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Before OnRopePro, winning a quote meant starting from scratch in the project system. Building addresses, floor counts, service types, and pricing all had to be re-entered, creating opportunities for errors and wasting time.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> One-click conversion from quote to project. All building information, service configurations, and pricing data transfer automatically. The project is created with everything pre-populated.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Win a quote and start work immediately. No re-entry, no lost details, no delays. Seamless transition from sales to operations.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* For Operations Managers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl md:text-2xl font-semibold">For Operations Managers</h3>
            </div>

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3" data-testid="accordion-ops">
              <AccordionItem value="ops-1" className={`border rounded-lg px-4 ${openItems.includes("ops-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-ops-1">
                  <span className="text-left font-medium">"I have no visibility into our sales pipeline"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> Quotes live in email threads and spreadsheets. You don't know how many active opportunities exist, what they're worth, or when you might need to staff up for incoming work.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Operations planning without pipeline visibility means you're always reacting. A cluster of wins could arrive simultaneously, leaving you scrambling to find available technicians.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> The Kanban board shows every quote by stage with total value per stage. See at a glance: $50,000 in Submitted quotes, $30,000 in Negotiation, $80,000 Won this month.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Forecast upcoming work based on pipeline value. Coordinate with scheduling to ensure capacity matches expected wins.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ops-2" className={`border rounded-lg px-4 ${openItems.includes("ops-2") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-ops-2">
                  <span className="text-left font-medium">"Quote data is inconsistent and incomplete"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> Everyone creates quotes differently. Some include all building details, some don't. Some estimate hours accurately, some guess. When quotes convert to projects, you're missing critical information.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> A quote says "window cleaning for tower" but doesn't specify which tower, how many floors, or how many drops per elevation. When it's time to schedule, you need to call the client back for basic information.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> Structured forms with required fields ensure consistent data capture. Building name, address, floors, strata/HOA number, and service-specific inputs are all mandatory before saving.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Every quote contains complete information. When projects are created from quotes, all the details are already there, ready for scheduling and execution.
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

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3" data-testid="accordion-techs">
              <AccordionItem value="tech-1" className={`border rounded-lg px-4 ${openItems.includes("tech-1") ? "bg-white dark:bg-white/10" : ""}`}>
                <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-tech-1">
                  <span className="text-left font-medium">"I don't know what happened to quotes I helped create"</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">The Pain:</span> You visit a site, take photos, count drops, and submit the information. Then you never hear about it again. Did the company win the job? Will you be working there? You're left in the dark.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Real Example:</span> Technicians contributing to site assessments had no way to track what happened next. The quote process was a black box once they submitted their input.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Solution:</span> "My Quotes" tab shows all quotes you created or contributed to. See the current stage, whether it was won or lost, and (with permissions) what project it became.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Benefit:</span> Stay informed about the opportunities you helped develop. See the impact of your site assessments on company wins.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <Separator />

        {/* Service Types */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Service Types</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base mb-4">
            Each service type has its own pricing structure optimized for how that work is typically quoted and performed.
          </p>

          <div className="grid gap-3 md:grid-cols-2" data-testid="grid-service-types">
            <Card data-testid="card-service-window-cleaning">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-base">Window Cleaning</h4>
                <p className="text-muted-foreground text-base">Enter drops per elevation (N/E/S/W), your daily target drops, and hourly rate. System calculates total hours as (Total Drops / Drops per Day) x Hours.</p>
              </CardContent>
            </Card>

            <Card data-testid="card-service-building-wash">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-base">Building Wash</h4>
                <p className="text-muted-foreground text-base">Same structure as window cleaning. Configure drops per elevation and productivity rate. Ideal for pressure washing and exterior cleaning.</p>
              </CardContent>
            </Card>

            <Card data-testid="card-service-parkade-cleaning">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-base">Parkade Cleaning</h4>
                <p className="text-muted-foreground text-base">Enter total stalls and price per stall. Simple multiplication pricing. Hourly option in development for time-based parkade work.</p>
              </CardContent>
            </Card>

            <Card data-testid="card-service-dryer-vent">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-base">Dryer Vent</h4>
                <p className="text-muted-foreground text-base">Flexible pricing: per-unit rate for suite counts, or hourly rate for complex configurations. Choose the model that fits the job.</p>
              </CardContent>
            </Card>

            <Card data-testid="card-service-ground-windows">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-base">Ground Windows</h4>
                <p className="text-muted-foreground text-base">Estimated hours multiplied by hourly rate. Simple time-based pricing for ground-level window work not requiring rope access.</p>
              </CardContent>
            </Card>

            <Card data-testid="card-service-painting">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-base">Painting</h4>
                <p className="text-muted-foreground text-base">Per-drop pricing model. Enter drop count and rate per drop. Accounts for prep, paint, and finish work at height.</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2" data-testid="card-service-custom">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-semibold text-base">Custom Service</h4>
                <p className="text-muted-foreground text-base">User-defined pricing structure for work that doesn't fit standard categories. Specify whether it's rope access or ground work, and configure your own calculation method.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Multi-Building Support */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Multi-Building Support</h2>
            <Badge variant="secondary">In Development</Badge>
          </div>

          <Card className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950">
            <CardContent className="p-6 space-y-4 text-violet-900 dark:text-violet-100">
              <p className="text-base">
                Many window washing projects involve multiple buildings within a complex, such as Tower A, Tower B, and Tower C. Each tower may have different floor counts, drop configurations, and access requirements.
              </p>
              <p className="text-base">
                <strong>Planned Features:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-base">
                <li>Toggle to enable multiple buildings per quote</li>
                <li>Different floor/drop counts per building</li>
                <li>Workers select which tower when logging work sessions</li>
                <li>Residents see only their specific tower in the resident portal</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Quote Creation Workflow */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Quote Creation Workflow</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="grid-workflow">
            <Card data-testid="card-workflow-step-1">
              <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <CardTitle className="text-base">Select Services</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                Choose from the service grid: window cleaning, building wash, parkade, dryer vent, painting, or custom.
              </CardContent>
            </Card>

            <Card data-testid="card-workflow-step-2">
              <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <CardTitle className="text-base">Configure Each Service</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                Enter service-specific fields: drops per elevation, stall counts, hourly rates, and productivity targets.
              </CardContent>
            </Card>

            <Card data-testid="card-workflow-step-3">
              <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <CardTitle className="text-base">Enter Building Info</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                Building name, address, floor count, and strata/HOA number. Regional labels adapt (Strata in Canada, HOA in US).
              </CardContent>
            </Card>

            <Card data-testid="card-workflow-step-4">
              <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <span className="font-bold text-blue-600">4</span>
                </div>
                <CardTitle className="text-base">Save & Download</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                Quote saves to Draft stage. Download as PDF to email to client. Move through pipeline as status changes.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Pipeline Stages */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Kanban className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Pipeline Stages</h2>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Stage</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Available Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">Draft</Badge>
                    </TableCell>
                    <TableCell>Quote is being prepared, not yet sent to client</TableCell>
                    <TableCell>Edit, Delete, Submit</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 font-medium">Submitted</Badge>
                    </TableCell>
                    <TableCell>Quote has been sent to the client</TableCell>
                    <TableCell>Move to Review, Won, or Lost</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 font-medium">Review</Badge>
                    </TableCell>
                    <TableCell>Client is reviewing, may have questions</TableCell>
                    <TableCell>Move to Negotiation, Won, or Lost</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100 font-medium">Negotiation</Badge>
                    </TableCell>
                    <TableCell>Active discussions on scope or pricing</TableCell>
                    <TableCell>Move to Won or Lost</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 font-medium">Won</Badge>
                    </TableCell>
                    <TableCell>Client accepted, ready to convert</TableCell>
                    <TableCell>Convert to Project</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100 font-medium">Lost</Badge>
                    </TableCell>
                    <TableCell>Client declined or went elsewhere</TableCell>
                    <TableCell>Archive</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* FAQs */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>

          <Accordion type="multiple" value={faqOpenItems} onValueChange={setFaqOpenItems} className="space-y-3" data-testid="accordion-faqs">
            <AccordionItem value="faq-1" className={`border rounded-lg px-4 ${faqOpenItems.includes("faq-1") ? "bg-white dark:bg-white/10" : ""}`}>
              <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-faq-1">
                <span className="text-left font-medium">Can I email quotes directly from the system?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-muted-foreground text-base">
                  Not currently. Download the quote as a PDF and email it manually to your client. Direct email integration is planned for a future release.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className={`border rounded-lg px-4 ${faqOpenItems.includes("faq-2") ? "bg-white dark:bg-white/10" : ""}`}>
              <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-faq-2">
                <span className="text-left font-medium">How does tax calculation work?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-muted-foreground text-base">
                  Currently, tax is hardcoded at 13% HST. Location-based automatic tax calculation is planned for a future release. For now, verify that the tax rate is appropriate for your jurisdiction before sending quotes to clients.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className={`border rounded-lg px-4 ${faqOpenItems.includes("faq-3") ? "bg-white dark:bg-white/10" : ""}`}>
              <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-faq-3">
                <span className="text-left font-medium">Can technicians see quote prices?</span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-muted-foreground text-base">
                  Only if they have Financial Access permission. By default, technicians can create quotes and enter service details, but pricing information is hidden. This protects your pricing strategy while still allowing field staff to contribute to the quoting process.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <Separator />

        {/* Module Integrations */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Link2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            <h2 className="text-3xl md:text-4xl font-bold">Module Integrations</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base mb-4">
            The Quoting module connects with other OnRopePro modules to create a seamless workflow from sales to execution.
          </p>

          <div className="grid gap-4 md:grid-cols-2" data-testid="grid-integrations">
            <Card data-testid="card-integration-project-management">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Project Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>One-click quote to project conversion</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>All building and pricing data transfers</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-work-sessions">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-600" />
                  Work Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Multi-building tower selection</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Track hours against quoted estimates</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-resident-portal">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-violet-600" />
                  Resident Portal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Tower-specific visibility for residents</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Building info flows to resident access</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-integration-analytics">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Pipeline value metrics</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Win/loss rate tracking</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2" data-testid="card-integration-employee-management">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Employee Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Permission-based pricing visibility control</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>"My Quotes" visibility for quote creators</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Version Footer */}
        <Separator />
        <section className="text-center text-muted-foreground text-sm">
          <p><strong>Version:</strong> 1.0 | <strong>Last Updated:</strong> December 16, 2025</p>
          <p className="mt-1">Maintenance: Glenn (strategic) + Tommy (technical)</p>
        </section>
      </div>
    </ChangelogGuideLayout>
  );
}
