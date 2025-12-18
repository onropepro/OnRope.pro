import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Bell,
  Users,
  Zap
} from "lucide-react";

export default function ResidentLanding() {
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
              Complaints handled while<br />
              <span className="text-rose-100">your crews are still on the ropes.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-rose-100 max-w-3xl mx-auto leading-relaxed">
              Residents submit feedback with photos. Your team sees it in real-time. Issues get resolved before the van leaves the parking lot. No more phone tag. No more return visits. No more notebooks.
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

      <Separator className="my-8" />

      {/* Problem Statement Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            The Complaint Problem Nobody Budgets For
          </h2>
          
          <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 md:p-8 space-y-4 text-muted-foreground">
              <p className="text-base leading-relaxed">
                A resident in unit 1247 emails about streaks on her window. A week later, she calls the building manager. The building manager calls you. You check your notebook. Maybe the email got lost. Maybe it didn't. Now three people are spending time on something that might have been resolved in 10 minutes if anyone had known about it while the crew was still in the building.
              </p>
              <p className="text-base leading-relaxed">
                That 10-minute fix? It becomes a half-day labor cost. Packing equipment, loading the van, driving across town, rigging ropes for one window, cleaning it, derigging, driving back. You've done the math. You know what those return visits cost.
              </p>
              <p className="text-base leading-relaxed">
                And that's just one complaint. During busy season, multiply it by buildings, by units, by the residents who give up entirely and complain on social media instead.
              </p>
              <p className="text-lg leading-relaxed font-medium text-foreground">
                OnRopePro's Resident Portal puts feedback in front of your team while crews are still on-site. Residents submit issues with photos. Your supervisor sees a notification. The technician already rigged on that elevation flips their rope and checks the window. Problem solved in minutes, not days.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      {/* What This Module Does Section */}
      <section id="how-it-works" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What This Module Does
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Direct communication between residents and your company. Complete visibility for property managers. Zero phone tag.
          </p>
          <p className="text-center text-muted-foreground text-base mb-12 max-w-3xl mx-auto">
            The Resident Portal gives building residents a direct line to report issues, track project progress, and communicate with your team, all without involving property managers or building staff as middlemen.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Resident Feedback System */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">Resident Feedback System</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-base text-muted-foreground">
                  Residents submit feedback once with their description and optional photo. Name, unit number, and phone auto-fill from their account. Your team sees it immediately in the project dashboard with a notification badge.
                </p>
                <div className="space-y-2 text-base">
                  <p className="font-medium text-foreground">What gets captured:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Description of issue with optional photo evidence</li>
                    <li>Unit number and resident contact info (auto-filled)</li>
                    <li>Timestamp of submission</li>
                    <li>Timestamp of when your team first viewed it</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Two-Way Communication */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">Two-Way Communication</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-base text-muted-foreground">
                  Your staff respond through internal notes (private) or visible replies (resident sees). Residents can reply to visible messages. The complete conversation history stays attached to that feedback item forever.
                </p>
                <div className="space-y-2 text-base">
                  <p className="font-medium text-foreground">What gets tracked:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>All messages between staff and resident</li>
                    <li>Which messages are internal vs. visible</li>
                    <li>Status changes (New, Viewed, Closed)</li>
                    <li>Resolution timestamps for performance metrics</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Project Progress Visibility */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl">Project Progress Visibility</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-base text-muted-foreground">
                  Residents view real-time project progress showing which elevation or side of the building is being worked on. They check status before calling to ask "when will you do my window?"
                </p>
                <div className="space-y-2 text-base">
                  <p className="font-medium text-foreground">What residents see:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Current elevation being worked (North, South, East, West)</li>
                    <li>Overall completion percentage</li>
                    <li>Scheduled project dates</li>
                    <li>Active status indicators</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Benefits Section - For Building Residents */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            For Building Residents
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Every feature designed to make building maintenance communication simple and transparent.
          </p>
          
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Bell className="w-5 h-5 text-rose-600" />
                    Know your complaint was received and when it was seen.
                  </h4>
                  <p className="text-base text-muted-foreground">
                    Every submission is logged with a timestamp. You see the exact date and time when the company first opened your feedback. No more wondering if your email got lost.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Camera className="w-5 h-5 text-rose-600" />
                    Submit once, with photos, and you're done.
                  </h4>
                  <p className="text-base text-muted-foreground">
                    Describe your issue, attach a photo, submit. Your name, unit number, and phone auto-fill. No repeating yourself to the property manager, then the vendor, then the technician.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Eye className="w-5 h-5 text-rose-600" />
                    Check project progress before asking "are you done yet?"
                  </h4>
                  <p className="text-base text-muted-foreground">
                    See which side of the building crews are working on. If they haven't reached the north side yet, you'll know before calling to complain about your north-facing window.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Problems Solved - For Residents */}
      <section className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Problems Solved
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Real problems, solved by design.
          </p>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="text-lg font-semibold text-foreground">"My complaints go into a black hole."</h4>
                <p className="text-base text-muted-foreground">
                  You email about streaks on your window. A week later, nothing. You call the building manager, who calls the vendor, who says they never received the email. Three people are now involved in tracking down one complaint that may or may not have been sent.
                </p>
                <div className="bg-rose-50 dark:bg-rose-950/50 rounded-lg p-4">
                  <p className="text-base font-medium text-rose-900 dark:text-rose-100">
                    Every feedback submission is logged with a timestamp. You see a "Viewed" status with the exact date and time when the company first opened your feedback. Complete transparency into status. No more uncertainty.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h4 className="text-lg font-semibold text-foreground">"I have to explain my issue three times."</h4>
                <p className="text-base text-muted-foreground">
                  You describe your problem over the phone, then repeat it to the property manager, then again to the vendor. Details get lost. "Can you send a photo?" adds another round of communication.
                </p>
                <div className="bg-rose-50 dark:bg-rose-950/50 rounded-lg p-4">
                  <p className="text-base font-medium text-rose-900 dark:text-rose-100">
                    You submit feedback once with description and optional photo. The form auto-fills your name, unit number, and phone from your account. One submission captures everything. No repeated explanations, no lost photos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Key Features Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Key Features
          </h2>
          <p className="text-center text-muted-foreground text-base mb-12 max-w-2xl mx-auto">
            Every feature exists because Tommy tracked complaints in a notebook, sometimes on his hand while driving.
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
                    <p className="text-base text-muted-foreground">Residents see exactly when their feedback was first opened by your company. No more "I didn't see it" excuses. If someone on your team opened it, there's a timestamp proving it. This creates accountability without requiring any manual logging.</p>
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
                    <p className="text-base text-muted-foreground">Residents attach photos directly to their feedback. No more email threads asking for documentation. When a resident reports a water stain, you have the photo immediately. When you investigate and find the dirt is on the inside, you document that finding.</p>
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
                    <h4 className="text-lg font-semibold text-foreground">Internal Notes System</h4>
                    <p className="text-base text-muted-foreground">Staff coordinate privately without exposing sensitive discussions to residents. Investigation notes, scheduling discussions, liability documentation. The yellow/red checkbox toggle makes it explicit when a reply will be visible to the resident, preventing accidental exposure.</p>
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
                    <h4 className="text-lg font-semibold text-foreground">Portable Resident Accounts</h4>
                    <p className="text-base text-muted-foreground">When a resident moves from Toronto to Chicago, they keep their OnRopePro account. They update their Strata/LMS number and enter the new vendor's code. If their new building's vendor doesn't use OnRopePro, they notice. And they mention it.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Resolution Time Metrics</h4>
                    <p className="text-base text-muted-foreground">The system calculates average response and resolution times automatically. Property managers see this data when evaluating vendors. Your resolution time becomes part of your competitive advantage, displayed alongside your Company Safety Rating.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Real-Time Progress Tracking</h4>
                    <p className="text-base text-muted-foreground">Residents view which elevation is being worked on and overall completion percentage. They self-serve status information instead of calling to ask. You stop answering "when will you do my window?" calls from residents whose side hasn't been reached yet.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Everything you need to know about using the Resident Portal.
          </p>
          
          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="privacy" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-privacy">
                Can residents see other residents' complaints?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. Residents can only view and interact with their own feedback submissions. Privacy is protected by design.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="moving" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-moving">
                What happens when a resident moves to a different building?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                They update their Strata/LMS number in their profile and enter the new vendor's code. Their account is fully portable. If the new building's vendor uses OnRopePro, they see that vendor's projects. If not, they notice the gap.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reopen" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-reopen">
                Can residents reopen closed feedback?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. Only company staff can reopen closed feedback. If a resident believes the issue persists, they contact their property manager or building manager directly. This prevents endless back-and-forth on resolved issues.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pm-respond" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-pm-respond">
                Can property managers respond to resident feedback?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. Property managers can view all feedback and communication history but cannot respond. Only company staff communicate with residents through the system. This keeps property managers informed without requiring their involvement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="internal-notes" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-internal-notes">
                What's the difference between internal notes and visible replies?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Internal notes are private (staff only) for coordination, investigation findings, and sensitive discussions. Visible replies are seen by the resident for acknowledgment, status updates, and resolution communication. Staff must explicitly toggle a yellow/red checkbox to make a reply visible, preventing accidental exposure.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="vendor-code" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-vendor-code">
                How do residents get the vendor code?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                The code is posted on notices in the elevator during projects, provided by the building manager, or included in project communications. One code per company, used for all buildings that company services.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="one-code" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-one-code">
                Is there one code per building or one code per company?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                One code per company. All residents across all buildings serviced by that company use the same vendor code. The Strata/LMS number differentiates which building's projects they see.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="feedback-window" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-feedback-window">
                How long do residents have to submit feedback after a project completes?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                5 business days. This allows time for residents to notice issues while limiting the complaint window to a reasonable period.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="unread" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-unread">
                What happens if feedback sits unread?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                Notification badges show pending items in your dashboard. The "Viewed" timestamp is visible to the resident, so they know if no one has opened their feedback. This creates natural accountability.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="internal-visibility" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-internal-visibility">
                Do residents see when we add internal notes?
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4">
                No. Internal notes are completely invisible to residents. They only see visible replies and status changes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Access Your Building Portal?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get the vendor code from your building manager or look for notices in the elevator during projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white" asChild data-testid="button-cta-access-portal">
              <Link href="/link">
                Access Your Building Portal
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-cta-learn-more">
              <Link href="/changelog/resident-portal">
                View Full Documentation
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900 py-8 px-4 mt-8">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-base">
          <p>OnRopePro Resident Portal</p>
        </div>
      </footer>
    </div>
  );
}
