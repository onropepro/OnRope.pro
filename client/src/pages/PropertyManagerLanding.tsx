import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  Globe, 
  Shield,
  Eye,
  Clock, 
  CheckCircle2,
  Users,
  FileUp,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";

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
              Know Your Vendors.<br />
              <span className="text-green-100">Protect Your Buildings.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Free access to vendor safety ratings, response time metrics, and compliance data for every rope access company working on your buildings. No cost. No catch. Just visibility.
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

      {/* Opening Hook Section - Loss Aversion */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            When a rope access technician falls, the first question isn't "Is everyone okay?"
          </p>
          <p className="text-muted-foreground">
            It's "Did you verify this contractor's safety compliance before hiring them?"
          </p>
          <p className="text-muted-foreground">
            If your answer is "I checked their insurance certificate" or worse, "I took their word for it," you're exposed.
          </p>
          <p className="font-medium text-foreground">
            The Property Manager Portal gives you documented evidence of vendor safety due diligence. Before something goes wrong.
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
          Everything You Need to Know About Your Rope Access Vendors
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          In One Place.
        </p>
        
        <div className="space-y-8">
          {/* Feature 1: Vendor Safety Ratings */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <Shield className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Vendor Safety Ratings</h3>
                  <p className="text-base text-muted-foreground">
                    Every rope access company on OnRopePro has a Company Safety Rating (CSR) built from three compliance metrics: documentation completeness, toolbox meeting frequency, and harness inspection rates.
                  </p>
                  <p className="text-base text-muted-foreground">
                    You see exactly where each vendor stands. No guessing. No asking for reports they can fabricate.
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
                  <Clock className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Response Time Metrics</h3>
                  <p className="text-base text-muted-foreground">
                    When you report a complaint, does your vendor actually fix it? Now you know.
                  </p>
                  <p className="text-base text-muted-foreground">
                    See average resolution times and feedback response rates for every contractor. Hold vendors accountable with data, not arguments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: My Vendors Dashboard */}
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
                    The My Vendors Dashboard shows every contracted rope access company, their safety scores, and which of your buildings they service. Thirty seconds instead of twenty minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 4: Feedback History */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <MessageSquare className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">Feedback History</h3>
                  <p className="text-base text-muted-foreground">
                    That resident who complained about streaky windows? Track whether your vendor responded, how long it took, and what they did.
                  </p>
                  <p className="text-base text-muted-foreground">
                    Building-by-building complaint and resolution history gives you documentation when performance conversations get difficult.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature 5: Anchor Inspection Upload */}
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

      {/* How It Works Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto" id="how-it-works">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Three Steps. Five Minutes. Free Forever.
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Getting started takes less time than reading this page.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
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
            <h3 className="text-xl font-semibold">See What You've Been Missing</h3>
            <p className="text-base text-muted-foreground">
              View safety ratings, response metrics, and compliance data for every vendor servicing your buildings. Compare contractors objectively. Make informed decisions.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
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
          The Documentation You'll Wish You Had
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Before You Need It.
        </p>
        
        <Card className="border-2" style={{borderColor: `${PM_COLOR}40`}}>
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

      {/* Vendor Accountability Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          When Vendors Know You're Watching, Standards Rise
        </h2>
        
        <div className="mt-8 space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            An 86% safety rating versus a 23% safety rating tells a story.
          </p>
          <p className="text-muted-foreground">
            When property managers can see these numbers, vendors can't hide behind vague assurances. The companies doing the work right finally have proof. The companies cutting corners get exposed.
          </p>
          <p className="text-muted-foreground">
            Your visibility creates accountability. When vendors know their CSR affects their contracts, safety becomes a competitive advantage, not a cost center.
          </p>
          <p className="font-medium text-foreground">
            Better for technicians. Better for you. Better for everyone who lives and works in your buildings.
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
                  <p className="text-base text-muted-foreground">
                    Ask them about it. Vendors who prioritize safety want property managers to see their ratings. If they resist transparency, that tells you something.
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
                  <p className="text-base text-muted-foreground">
                    Certificates confirm insurance exists. They don't tell you if workers are actually following safety protocols. CSR shows real-time compliance, not paperwork.
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
                    Your vendors pay for the platform. Your access creates the visibility that makes their investment valuable. There's no catch because you're not the customer. You're the accountability mechanism.
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
                  <p className="text-base text-muted-foreground">
                    Show them this page. The ROI argument writes itself: free access to data that protects against liability and improves vendor selection. No budget required.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            See Your Vendors Differently.
          </h2>
          
          <div className="space-y-4 text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            <p>
              You already manage rope access contractors. You just can't see what they're actually doing.
            </p>
            <p>
              The Property Manager Portal makes the invisible visible. Safety ratings. Response metrics. Compliance trends. Documentation for when you need it.
            </p>
            <p className="font-medium text-foreground">
              Free. No credit card. No trial expiration.
            </p>
            <p>
              Just ask your vendor for a Property Manager Code and create your account.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" style={{backgroundColor: PM_COLOR}} className="text-white hover:opacity-90" asChild>
              <Link href="/register" data-testid="button-create-account-final">
                Create Your Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact" data-testid="button-ask-vendor">
                Ask Your Vendor About OnRopePro
                <Users className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>OnRopePro - The platform for professional rope access companies</p>
        </div>
      </footer>
    </div>
  );
}
