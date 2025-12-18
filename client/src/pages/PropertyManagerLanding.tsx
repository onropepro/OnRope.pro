import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  Globe, 
  Shield,
  Clock, 
  CheckCircle2,
  Users,
  FileUp,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  ArrowDown,
  Timer,
  History,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const PM_COLOR = "#6E9075";
const PM_GRADIENT = "linear-gradient(135deg, #6E9075 0%, #5A7A60 100%)";

export default function PropertyManagerLanding() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: PM_GRADIENT}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-pm-module">
              Property Manager Portal
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Stop Being the Complaint Department.<br />
              <span className="text-green-100">Start Being the Property Manager.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              When your vendors use OnRopePro, residents submit complaints directly to them. You stay informed without being the middleman. Free access to vendor safety ratings, response times, and complaint resolution data. No cost. No catch. Just freedom.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#6E9075] hover:bg-green-50" asChild>
                <Link href="/register" data-testid="button-create-account-hero">
                  Create Your Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
                <Link href="#how-it-works" data-testid="button-learn-how">
                  Learn How It Works
                  <BookOpen className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      {/* Opening Hook Section - Complaint Elimination */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="space-y-6 text-lg leading-relaxed">
          <p className="text-xl font-medium text-foreground">
            How many resident complaints did you relay to vendors last month?
          </p>
          <p className="text-muted-foreground">
            Every streaky window, every scheduling question, every "when are they coming to my side of the building?" lands on your desk first. You forward it. You follow up. You relay the response. You're the middleman for every issue on every building you manage.
          </p>
          <p className="font-semibold text-foreground text-xl">
            What if complaints went directly to your vendor instead?
          </p>
          <p className="text-muted-foreground">
            When your vendors use OnRopePro, residents submit feedback straight to them. You see everything: what was reported, when it was viewed, how fast it was resolved. But you're not in the middle of it anymore.
          </p>
          <p className="font-medium text-foreground italic">
            Oversight without involvement. That's the Property Manager Portal.
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Button size="lg" style={{backgroundColor: PM_COLOR}} className="text-white hover:opacity-90" asChild>
            <Link href="/register" data-testid="button-create-account-hook">
              Create Your Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* What You Get Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Out of the Complaint Loop. Into the Know.
        </h2>
        
        <div className="space-y-8 mt-12">
          {/* Feature 1: Direct Complaints - THE BIG ONE */}
          <Card className="overflow-hidden border-2" style={{borderColor: `${PM_COLOR}40`}}>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: PM_COLOR}}>
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-semibold">Residents Complain Directly to Vendors. Not to You.</h3>
                    <Badge variant="secondary" className="text-xs">The Big One</Badge>
                  </div>
                  <p className="text-base text-muted-foreground">
                    When your vendors use OnRopePro, residents get access to a Resident Portal. They submit complaints with photos directly to the maintenance company. The vendor responds. The issue gets resolved.
                  </p>
                  <p className="text-base text-muted-foreground">
                    You're not in the middle of it. You're not the relay. You're not spending your Tuesday forwarding emails and making follow-up calls.
                  </p>
                  <p className="text-base text-muted-foreground">
                    But you see everything. Every complaint. Every response. Every resolution. Complete visibility without being the middleman.
                  </p>
                  <p className="text-base font-medium text-foreground">
                    For a property manager handling 50 buildings, this is the difference between drowning in complaint coordination and actually managing properties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2: Response Time Metrics */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <Timer className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Response Time Metrics: The Accountability You've Been Missing</h3>
                  <p className="text-base text-muted-foreground">
                    When residents complain directly to vendors, vendors can ignore them. Or they can respond in 24 hours. Now you know which.
                  </p>
                  <p className="text-base text-muted-foreground">
                    The Property Manager Portal shows average resolution times and feedback response rates for every contractor. When you see a vendor taking 12 days to respond while another resolves issues in 2 days, you have data for your next contract conversation.
                  </p>
                  <p className="text-base text-muted-foreground italic">
                    This is what Tommy (our co-founder, 15 years in rope access) says property managers care about most: "This will be a bigger factor than safety ratings. Are they actually responding to complaints?"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: Vendor Safety Ratings */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <Shield className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Vendor Safety Ratings: Know Before Something Goes Wrong</h3>
                  <p className="text-base text-muted-foreground">
                    Every rope access company on OnRopePro has a Company Safety Rating (CSR) built from three compliance metrics: documentation completeness, toolbox meeting frequency, and harness inspection rates.
                  </p>
                  <p className="text-base text-muted-foreground">
                    You see exactly where each vendor stands. No guessing. No asking for reports they can fabricate.
                  </p>
                  <p className="text-base font-medium text-foreground">
                    When an insurance adjuster asks "What did you know about this vendor's safety practices?", you have an answer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 4: My Vendors Dashboard */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <Globe className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">All Your Vendors. One Dashboard.</h3>
                  <p className="text-base text-muted-foreground">
                    Managing 20 buildings with different contractors? Finding which company services which building shouldn't require digging through emails and contracts.
                  </p>
                  <p className="text-base text-muted-foreground">
                    The My Vendors Dashboard shows every contracted rope access company, their safety scores, their response times, and which of your buildings they service. Thirty seconds instead of twenty minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 5: Feedback History */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <History className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Feedback History Per Building</h3>
                  <p className="text-base text-muted-foreground">
                    That resident who complained about streaky windows three times? Track the entire conversation. See when the vendor responded, what they said, how long resolution took.
                  </p>
                  <p className="text-base text-muted-foreground">
                    Building-by-building complaint and resolution history gives you documentation when performance conversations get difficult. Or when you're deciding whether to renew a contract.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 6: Anchor Inspection Upload */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <FileUp className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Anchor Inspection Certificate Upload</h3>
                  <p className="text-base text-muted-foreground">
                    Annual anchor inspections are required for rope access work. You receive the certificate from the third-party inspector. Now you have one place to store it.
                  </p>
                  <p className="text-base text-muted-foreground">
                    Upload anchor inspection certificates directly to each building record. Your only write permission. Everything else is read-only for data integrity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Complaint Flow Transformation Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Before vs. After: Where Complaints Go
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Before */}
          <Card className="border-rose-200 dark:border-rose-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-rose-600">Before OnRopePro</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">1</div>
                  <span className="text-sm">Resident notices issue</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">2</div>
                  <span className="text-sm">Resident calls/emails Property Manager</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">3</div>
                  <span className="text-sm">Property Manager forwards to Vendor</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">4</div>
                  <span className="text-sm">(wait...)</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">5</div>
                  <span className="text-sm">Vendor responds to Property Manager</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">6</div>
                  <span className="text-sm">Property Manager relays to Resident</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">7</div>
                  <span className="text-sm">Resident has follow-up question...</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="text-sm text-rose-600 font-medium text-center">(repeat entire cycle)</div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                You're the relay. Every complaint, every update, every follow-up routes through your inbox. Multiply by 50 buildings. That's your week.
              </p>
            </CardContent>
          </Card>

          {/* After */}
          <Card className="border-2" style={{borderColor: PM_COLOR}}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4" style={{color: PM_COLOR}}>With OnRopePro</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{backgroundColor: PM_COLOR}}>1</div>
                  <span className="text-sm">Resident notices issue</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4" style={{color: PM_COLOR}} /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{backgroundColor: PM_COLOR}}>2</div>
                  <span className="text-sm">Resident submits directly to Vendor (with photos)</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4" style={{color: PM_COLOR}} /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{backgroundColor: PM_COLOR}}>3</div>
                  <span className="text-sm">Vendor responds directly to Resident</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4" style={{color: PM_COLOR}} /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{backgroundColor: PM_COLOR}}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Issue resolved</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: `${PM_COLOR}10`}}>
                <p className="text-sm font-semibold mb-2" style={{color: PM_COLOR}}>Where are you in this flow?</p>
                <p className="text-sm text-muted-foreground">
                  Watching from your dashboard. You see every complaint that comes in, when it was viewed, how long resolution took. If a vendor is ignoring complaints, you'll know. If they're responding in 24 hours, you'll see that too.
                </p>
                <p className="text-sm font-medium text-foreground mt-2">
                  But you're not in the middle of it. You're not the relay. You're not spending hours on complaint coordination.
                </p>
                <p className="text-sm font-semibold mt-2" style={{color: PM_COLOR}}>
                  You're the property manager with oversight. Not the complaint department.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto" id="how-it-works">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Three Steps. Five Minutes. Free Forever.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold" style={{backgroundColor: PM_COLOR}}>
              1
            </div>
            <h3 className="text-xl font-semibold">Get Your Property Manager Code</h3>
            <p className="text-base text-muted-foreground">
              Ask your rope access vendor for a Property Manager Code. Any company using OnRopePro can generate one for you. Takes them 30 seconds.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold" style={{backgroundColor: PM_COLOR}}>
              2
            </div>
            <h3 className="text-xl font-semibold">Create Your Free Account</h3>
            <p className="text-base text-muted-foreground">
              Enter the code, create your account, and specify which buildings you manage. No credit card. No trial period. Free access. Period.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold" style={{backgroundColor: PM_COLOR}}>
              3
            </div>
            <h3 className="text-xl font-semibold">Watch Your Workload Shrink</h3>
            <p className="text-base text-muted-foreground">
              View safety ratings, response metrics, and complaint resolution data for every vendor servicing your buildings. See complaints being handled without your involvement. Compare contractors objectively. Make informed decisions.
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground mt-8">
          When residents in your buildings start using the Resident Portal, complaints stop routing through you. You just see the results.
        </p>

        <div className="mt-8 text-center">
          <Button size="lg" style={{backgroundColor: PM_COLOR}} className="text-white hover:opacity-90" asChild>
            <Link href="/register" data-testid="button-create-account-steps">
              Create Your Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Why It's Free Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Yes, It's Actually Free. Here's Why.
        </h2>
        
        <div className="mt-8 space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            Your vendors pay for OnRopePro. You don't.
          </p>
          <p className="text-muted-foreground">
            When property managers can see vendor safety ratings, contractors have powerful motivation to maintain high scores. Companies with strong safety records get more work. Companies with poor records lose contracts.
          </p>
          <p className="text-muted-foreground">
            That transparency benefits everyone: safer work for technicians, better vendor selection for you, documented compliance for insurance purposes.
          </p>
          <p className="font-medium text-foreground">
            Your access isn't the product. Your visibility is what makes the product valuable.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" variant="outline" style={{borderColor: PM_COLOR, color: PM_COLOR}} asChild>
            <Link href="/register" data-testid="button-get-free-access">
              Get Free Access
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Risk Mitigation Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          The Documentation You'll Wish You Had. Before You Need It.
        </h2>
        
        <Card className="border-2 mt-8" style={{borderColor: `${PM_COLOR}40`}}>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 shrink-0" style={{color: PM_COLOR}} />
              <div className="space-y-4">
                <p className="text-base text-muted-foreground">
                  Insurance audits. Liability claims. Board inquiries. Regulatory inspections.
                </p>
                <p className="text-base text-muted-foreground">
                  They all ask the same question: "What did you know about your vendor's safety practices?"
                </p>
                <p className="text-base text-muted-foreground">
                  The Property Manager Portal creates an automatic audit trail. Every time you check a vendor's CSR, view their response metrics, or compare contractors, that visibility is documented.
                </p>
                <p className="text-base font-medium text-foreground">
                  When someone asks what due diligence you performed, you have an answer.
                </p>
                <p className="text-base text-muted-foreground">
                  When a competitor's building has an incident and the news asks "Could this happen here?", you have data showing exactly how your vendors compare.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* The Real Value: Your Time Back Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What Would You Do With 10 Extra Hours a Week?
        </h2>
        
        <div className="mt-8 space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            Property managers managing 30+ buildings spend 8-15 hours weekly on complaint coordination alone. Forwarding emails. Following up with vendors. Relaying responses. Chasing updates.
          </p>
          <p className="text-muted-foreground">
            When complaints go directly to vendors:
          </p>
          <p className="font-semibold text-foreground text-xl">
            Those hours disappear from your workload.
          </p>
          <p className="text-muted-foreground">
            You still have full visibility. You still see response times. You still have documentation for board meetings and contract renewals. You just don't have to be the middleman anymore.
          </p>
          <p className="text-muted-foreground">
            That's time back for lease renewals. For tenant relations. For the strategic work that actually grows your portfolio. For leaving at 5pm instead of 7pm.
          </p>
          <p className="font-medium text-foreground">
            The Property Manager Portal doesn't just give you data. It gives you your time back.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" style={{backgroundColor: PM_COLOR}} className="text-white hover:opacity-90" asChild>
            <Link href="/register" data-testid="button-create-account-time">
              Create Your Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Vendor Accountability Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          When Vendors Know You're Watching, Everything Changes.
        </h2>
        
        <div className="mt-8 space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            Here's what happens when you can see vendor response times:
          </p>
          <p className="text-muted-foreground">
            The vendor who takes 12 days to respond to complaints knows you can see that. The vendor who resolves issues in 48 hours knows you can see that too.
          </p>
          <p className="text-muted-foreground">
            An 86% safety rating versus a 23% safety rating tells a story. A 2-day average resolution time versus a 14-day average tells another.
          </p>
          <p className="text-muted-foreground">
            When property managers can see these numbers, vendors can't hide behind vague assurances. The companies doing the work right finally have proof. The companies cutting corners or ignoring complaints get exposed.
          </p>
          <p className="text-muted-foreground">
            Your visibility creates accountability. When vendors know their response times affect their contracts, responsiveness becomes a competitive advantage.
          </p>
          <p className="font-medium text-foreground">
            Better for residents. Better for you. Better for everyone who lives and works in your buildings.
          </p>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Objection Handling Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Common Questions
        </h2>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 shrink-0" style={{color: PM_COLOR}} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">"What if my vendors don't use OnRopePro?"</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    Ask them about it. Vendors who prioritize safety and responsiveness want property managers to see their ratings and resolution times. If they resist transparency, that tells you something.
                  </p>
                  <p className="text-base text-muted-foreground">
                    You can also tell them: "I'd like to stop being the complaint relay between residents and your company. OnRopePro lets residents submit directly to you, and I get visibility into response times."
                  </p>
                  <p className="text-base text-muted-foreground mt-2">
                    Most vendors will see that as a benefit, not a burden.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 shrink-0" style={{color: PM_COLOR}} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">"What if residents keep complaining to me anyway?"</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    Redirect them. "Submit your feedback through the Resident Portal. The vendor will see it immediately and respond directly. I can see everything you submit, but they'll respond faster if you go directly."
                  </p>
                  <p className="text-base text-muted-foreground">
                    Most residents prefer direct access over waiting for you to relay messages. The system trains the behavior quickly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 shrink-0" style={{color: PM_COLOR}} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">"I don't want to lose visibility into what's happening at my buildings."</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    You won't. That's the point.
                  </p>
                  <p className="text-base text-muted-foreground mb-2">
                    You see every complaint that comes in, when it was viewed, when it was resolved, what the vendor said. You have complete visibility into the entire conversation.
                  </p>
                  <p className="text-base text-muted-foreground">
                    You just don't have to be IN the conversation anymore. Oversight without involvement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 shrink-0" style={{color: PM_COLOR}} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">"I already track vendor certificates in spreadsheets."</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    Certificates confirm insurance exists. They don't tell you if workers are actually following safety protocols. CSR shows real-time compliance, not paperwork.
                  </p>
                  <p className="text-base text-muted-foreground">
                    And spreadsheets don't route complaints directly to vendors. They don't show you response time metrics. They don't give you the data you need for contract decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 shrink-0" style={{color: PM_COLOR}} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">"This seems too good to be free."</h4>
                  <p className="text-base text-muted-foreground">
                    Your vendors pay for the platform. Your access creates the visibility that makes their investment valuable. There's no catch because you're not the customer. You're the accountability mechanism that makes the system work.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 shrink-0" style={{color: PM_COLOR}} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">"I need to check with my portfolio manager first."</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    Show them this page. The ROI argument writes itself:
                  </p>
                  <p className="text-base text-muted-foreground">
                    Free access. Complaint elimination. Vendor accountability data. Liability documentation. No budget required.
                  </p>
                  <p className="text-base text-muted-foreground mt-2">
                    What's the counterargument?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section - Stakeholder Colored */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: `linear-gradient(135deg, ${PM_COLOR} 0%, #5A7A60 100%)`}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Oversight Without Involvement. Visibility Without Burden.
          </h2>
          <p className="text-lg text-white/90">
            Complaints go directly to vendors. You see everything without being in the middle.<br />
            Safety ratings show real compliance. Response times prove accountability.
          </p>
          <p className="font-medium text-white">
            Free. No credit card. No trial expiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white hover:bg-gray-50" style={{color: PM_COLOR}} asChild>
              <Link href="/register" data-testid="button-create-account-final">
                Create Your Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <Link href="/contact" data-testid="button-tell-vendor">
                Tell Your Vendor About OnRopePro
                <Users className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-white/80 pt-2">
            Just ask your vendor for a Property Manager Code and create your account.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 object-contain" />
            <span className="text-sm text-muted-foreground">Management Software for Rope Access</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
