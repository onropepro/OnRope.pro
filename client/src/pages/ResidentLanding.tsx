import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import {
  Home,
  ArrowRight,
  BookOpen,
  Camera,
  Eye,
  Clock,
  MessageCircle,
  Globe,
  CheckCircle2,
  Building2,
  Smartphone,
  Bell,
  FileText,
  Users,
  Shield,
  Zap
} from "lucide-react";

export default function ResidentLanding() {
  const [stat1, setStat1] = useState(0);
  const [stat2, setStat2] = useState(0);
  const [stat3, setStat3] = useState(0);
  const [stat4, setStat4] = useState(0);

  useEffect(() => {
    let current1 = 0, current2 = 0, current3 = 0, current4 = 0;
    
    const interval = setInterval(() => {
      if (current1 < 100) { current1 += 2; setStat1(Math.min(current1, 100)); }
      if (current2 < 100) { current2 += 2; setStat2(Math.min(current2, 100)); }
      if (current3 < 100) { current3 += 2; setStat3(Math.min(current3, 100)); }
      if (current4 < 1) { current4 = 1; setStat4(current4); }
      
      if (current1 >= 100 && current2 >= 100 && current3 >= 100 && current4 >= 1) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="resident" />
      
      {/* Hero Section - Rose gradient for B2C Residents */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-resident-portal">
              For Building Residents
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Know your complaint was heard.<br />
              <span className="text-rose-100">Watch it get resolved.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto leading-relaxed">
              Submit feedback with photos. See exactly when it was viewed. Track your building's service progress in real-time.<br />
              <strong>No more wondering. No more phone calls.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#E11D48] hover:bg-rose-50" asChild data-testid="button-hero-access-portal">
                <Link href="/link">
                  Access Your Building Portal
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild data-testid="button-hero-learn-more">
                <Link href="#how-it-works">
                  Learn How It Works
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
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-rose-600">{stat1}%</div>
                  <div className="text-base text-muted-foreground mt-1">Instant confirmation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{stat2}%</div>
                  <div className="text-base text-muted-foreground mt-1">Real-time visibility</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat3}%</div>
                  <div className="text-base text-muted-foreground mt-1">Photo evidence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">{stat4}</div>
                  <div className="text-base text-muted-foreground mt-1">Submission needed</div>
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
            The Complaint Black Hole
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed font-medium text-foreground">
                You email about streaks on your window. A week passes. Nothing.
              </p>
              <p className="text-base leading-relaxed">
                You call the building manager. They call the vendor. The vendor checks their notes. Maybe the email got lost. Maybe it didn't. Now three people are spending time on something that should have been simple.
              </p>
              <p className="text-base leading-relaxed">
                You describe your issue over the phone. Then repeat it to the property manager. Then again to the vendor. "Can you send a photo?" adds another round of communication. Details get lost along the way.
              </p>
              <p className="text-lg leading-relaxed font-medium text-foreground">
                OnRopePro's Resident Portal changes everything.
              </p>
              <p className="text-base leading-relaxed">
                Submit your feedback once with a photo. See the exact date and time when the company opens it. Track which side of the building crews are working on. Know your issue status without making a single phone call.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Direct communication with your building's service provider. Complete transparency on every issue.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Submit Feedback */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">Submit Feedback</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-base text-muted-foreground">
                  Describe your issue and attach a photo. Your name, unit number, and phone auto-fill from your account. One submission captures everything.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Description with photo evidence</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Auto-filled contact info</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant timestamp</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Track Status */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">Track Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-base text-muted-foreground">
                  See the exact date and time when your feedback was first opened by the service company. Complete transparency at every step.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>"Viewed" timestamp visible</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Status updates (New/Viewed/Closed)</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct replies from staff</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: View Progress */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">View Progress</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-base text-muted-foreground">
                  See real-time project progress showing which elevation is being worked on. Check status before calling to ask "when will you do my window?"
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Current elevation being worked</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Overall completion percentage</span>
                  </div>
                  <div className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Scheduled project dates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Benefits Section - For Residents Only */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What You Get
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Every feature designed to make building maintenance communication simple and transparent.
          </p>
          
          <div className="space-y-8">
            <Card className="overflow-hidden">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Home className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">For Building Residents</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Know It Was Received</h4>
                    <p className="text-base text-muted-foreground">Every submission is logged with a timestamp. You see the exact date and time when the company first opened your feedback. No more uncertainty.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Submit Once, Done</h4>
                    <p className="text-base text-muted-foreground">Describe your issue, attach a photo, submit. Your info auto-fills. No repeating yourself to the property manager, then the vendor, then the technician.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Check Before Calling</h4>
                    <p className="text-base text-muted-foreground">See which side of the building crews are working on. If they haven't reached your side yet, you'll know before calling to complain.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features Section */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Key Features
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Built to give you transparency and control over your building maintenance experience.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Viewed Timestamp Visibility</h4>
                    <p className="text-base text-muted-foreground">See exactly when your feedback was first opened by the company. If someone on their team opened it, there's a timestamp proving it.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Photo Evidence Upload</h4>
                    <p className="text-base text-muted-foreground">Attach photos directly to your feedback. No more email threads asking for documentation. When you report an issue, the photo is right there.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Portable Accounts</h4>
                    <p className="text-base text-muted-foreground">When you move to a different building, you keep your OnRopePro account. Update your unit number and enter the new vendor's code. That simple.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Direct Communication</h4>
                    <p className="text-base text-muted-foreground">Receive replies directly from the service company. The complete conversation history stays attached to your feedback item forever.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Everything you need to know about using the Resident Portal.
          </p>
          
          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="privacy" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-privacy">
                Can other residents see my complaints?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. You can only view and interact with your own feedback submissions. Your privacy is protected by design. Neither other residents nor the property manager can see the details of your specific complaints.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="vendor-code" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-vendor-code">
                How do I get the vendor code to access the portal?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                The vendor code is posted on notices in the elevator during projects, provided by the building manager, or included in project communications. One code per company is used for all buildings that company services.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="moving" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-moving">
                What happens when I move to a different building?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                You update your Strata/LMS number in your profile and enter the new vendor's code. Your account is fully portable. If the new building's vendor uses OnRopePro, you'll see that vendor's projects. If not, you'll notice the gap.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="feedback-window" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-feedback-window">
                How long do I have to submit feedback after a project completes?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                5 business days. This allows time for you to notice issues while limiting the complaint window to a reasonable period after the work is completed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reopen" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-reopen">
                Can I reopen a closed complaint?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. Only company staff can reopen closed feedback. If you believe the issue persists after closure, contact your property manager or building manager directly. This prevents endless back-and-forth on resolved issues.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="strata-lms" className="border rounded-lg px-4">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-strata-lms">
                What's a Strata/LMS number?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                This is your building's official registration number. It differentiates which building's projects you see when combined with the vendor code. Your building manager can provide this number if you don't know it.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-rose-50 dark:bg-rose-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Access your building's portal to submit feedback, track issues, and see project progress in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-rose-600 text-white hover:bg-rose-700" asChild data-testid="button-cta-access-portal">
              <Link href="/link">
                Access Your Building Portal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-cta-help">
              <Link href="/help/for-residents">
                View Resident Help Guide
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-4xl mx-auto text-center text-muted-foreground text-base">
          <p>OnRopePro Resident Portal - Making building maintenance communication simple and transparent.</p>
        </div>
      </footer>
    </div>
  );
}
