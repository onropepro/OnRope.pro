import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ArrowRight, 
  Home, 
  Camera, 
  Eye, 
  Clock, 
  MapPin,
  CheckCircle2,
  Shield,
  Zap,
  MessageCircle,
  Building2,
  UserPlus,
  BookOpen,
} from "lucide-react";
import { Link } from "wouter";
import { PublicHeader } from "@/components/PublicHeader";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

export default function ResidentLanding() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader />
      
      {/* Hero Section - Following Module Landing Page Hero Template */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-resident-module">
              For Building Residents
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Know Your Feedback Was Received.<br />
              <span className="text-blue-100">Track It Until It's Resolved.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Submit feedback with photos, see exactly when it was viewed, and track progress in real-time.<br />
              <strong>No more phone calls. No more guessing.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#0B64A3] hover:bg-blue-50" asChild>
                <Link href="/register" data-testid="button-create-account-hero">
                  Create Your Account
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

      {/* Stats Panel */}
      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600">24hr</div>
                  <div className="text-sm text-muted-foreground mt-1">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-amber-600">0</div>
                  <div className="text-sm text-muted-foreground mt-1">Lost Complaints</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-rose-600">Real-Time</div>
                  <div className="text-sm text-muted-foreground mt-1">Updates</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Tired of Complaints That Go Nowhere?
        </h2>
        
        <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
          <p>
            You email the property manager about streaks on your window. A week passes. Nothing. You call. They say they forwarded it to the vendor. The vendor says they never got it.
          </p>
          <p>
            Now three people are involved in tracking down one email that may or may not have been sent.
          </p>
          <p>
            Meanwhile, you see crews working on the building but have no idea if they've reached your side yet. You call again. Turns out they finished your floor yesterday.
          </p>
          <p className="font-medium text-foreground">
            The Resident Portal puts you in direct contact with the service company working on your building. Submit once. See when it was viewed. Track it through to resolution.
          </p>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* What You Can Do Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Your Portal. Your Control.
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          The Resident Portal gives you direct access to project updates and a documented communication channel with the service team.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Track Project Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-base text-muted-foreground">
                See exactly where crews are working and when they'll reach your side of the building. Real-time progress bars show which elevations are complete, so you know when to move plants off the balcony or prepare for window access.
              </p>
              <div className="space-y-2">
                <p className="text-base font-medium text-foreground">What you see:</p>
                <ul className="text-base text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Which side of the building is being worked on now
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Completion percentage for each elevation
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Expected completion timeline
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    No more premature "you missed my window" calls
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Submit Feedback with Photos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-base text-muted-foreground">
                Report issues, concerns, or compliments directly through the portal. Attach photos right from your phone. One submission captures your name, unit number, and the visual evidence needed for fast resolution.
              </p>
              <div className="space-y-2">
                <p className="text-base font-medium text-foreground">What you can submit:</p>
                <ul className="text-base text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Streaks, spots, or missed areas
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Damage concerns
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Access issues (plants, furniture in the way)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Compliments for work well done
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-rose-50 dark:bg-rose-950 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-rose-600" />
                </div>
                <CardTitle className="text-lg">Track Your Feedback Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-base text-muted-foreground">
                Every submission is timestamped and tracked. See when the company first viewed your feedback. Watch the status change from New to Viewed to Closed. No more wondering if anyone saw it.
              </p>
              <div className="space-y-2">
                <p className="text-base font-medium text-foreground">What you track:</p>
                <ul className="text-base text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Submission date and time
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    "Viewed" timestamp showing when the company saw it
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Current status (New, Viewed, Closed)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600 mt-1 shrink-0" />
                    Responses from the service team
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Three Steps to Direct Communication
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mx-auto">
              <UserPlus className="w-8 h-8 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-600">Step 1</div>
            <h3 className="text-xl font-semibold">Create Your Account</h3>
            <p className="text-base text-muted-foreground">
              Sign up with your email, strata plan number, and unit number. This links your account to your specific building and unit. Takes about two minutes.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-600">Step 2</div>
            <h3 className="text-xl font-semibold">Enter the Vendor Code</h3>
            <p className="text-base text-muted-foreground">
              Your building manager or property manager provides a vendor code. Enter it once in your profile to connect with the service company working on your building.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-600">Step 3</div>
            <h3 className="text-xl font-semibold">See Projects and Submit Feedback</h3>
            <p className="text-base text-muted-foreground">
              Your dashboard shows active projects on your building. View progress. Submit feedback. Track responses. Everything in one place.
            </p>
          </div>
        </div>

        <Card className="mt-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <p className="text-base text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> Your account stays with you. If you move to a different building, update your strata number and enter the new vendor's code. No need to start over.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Problems Solved Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Real Problems. Real Solutions.
        </h2>
        
        <div className="mt-8">
          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="problem-1" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-problem-1">
                "My complaint disappeared into a black hole."
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-4">
                <p>
                  You submitted feedback via email or phone. Days pass. No response. You follow up. They can't find it. You explain the whole thing again. Still nothing.
                </p>
                <div className="bg-rose-50 dark:bg-rose-950/50 rounded-lg p-4">
                  <p className="text-base font-medium text-rose-900 dark:text-rose-100">
                    With the Resident Portal, every submission is logged with a timestamp. You see the exact date and time the company opened your feedback. "I didn't see it" becomes impossible when you can prove they viewed it on Tuesday at 2:47 PM.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem-2" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-problem-2">
                "I explained this three times already."
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-4">
                <p>
                  Phone to property manager. Property manager to vendor. Vendor to technician. Somewhere along the way, "water stain on bedroom window" became "balcony glass issue." The tech arrives confused.
                </p>
                <div className="bg-rose-50 dark:bg-rose-950/50 rounded-lg p-4">
                  <p className="text-base font-medium text-rose-900 dark:text-rose-100">
                    Submit once through the portal. Your name, unit, phone, and description are captured. Attach photos. Done. The team sees exactly what you see. No telephone game.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem-3" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-problem-3">
                "I have no idea if they've done my window yet."
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-4">
                <p>
                  Crews are on the building. You can see them from the street. But are they on the north side or south? Did they finish your floor yesterday or is it scheduled for next week?
                </p>
                <div className="bg-rose-50 dark:bg-rose-950/50 rounded-lg p-4">
                  <p className="text-base font-medium text-rose-900 dark:text-rose-100">
                    The portal shows real-time progress by elevation. You know your side hasn't been touched yet. You wait. No wasted calls asking "are you done?"
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem-4" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-problem-4">
                "They said they'd fix it but nothing changed."
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-4">
                <p>
                  Feedback submitted. Response received. Issue marked closed. But nothing actually improved. Now what?
                </p>
                <div className="bg-rose-50 dark:bg-rose-950/50 rounded-lg p-4">
                  <p className="text-base font-medium text-rose-900 dark:text-rose-100">
                    You can see the status history and any responses from the team. If the issue persists after closure, contact your building manager with documented proof of what was communicated.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Key Features Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Built for Clarity
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          Every feature exists to eliminate confusion and give you visibility into what's happening on your building.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-rose-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Viewed Timestamp</h4>
                  <p className="text-base text-muted-foreground">See the exact date and time when the company first opened your feedback. Accountability built in.</p>
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
                  <h4 className="text-lg font-semibold text-foreground">Photo Uploads</h4>
                  <p className="text-base text-muted-foreground">Attach photos directly from your phone when submitting feedback. Clear evidence speeds resolution.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-rose-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Progress Tracking</h4>
                  <p className="text-base text-muted-foreground">Real-time progress bars show which side of the building is complete. Know when work is approaching your unit.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-rose-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Status Badges</h4>
                  <p className="text-base text-muted-foreground">New, Viewed, Closed. Always know where your feedback stands at a glance.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5 text-rose-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Portable Account</h4>
                  <p className="text-base text-muted-foreground">Move to a new building? Update your strata number and enter the new vendor code. Your account follows you.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-rose-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">Privacy Protection</h4>
                  <p className="text-base text-muted-foreground">Your feedback is visible only to you and the service company. Other residents cannot see your submissions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Measurable Results Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What Changes With the Portal
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card className="bg-white dark:bg-slate-950">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Faster Response</h4>
                    <p className="text-base text-muted-foreground">Feedback submissions with photos receive initial response within 24 hours on average. No more waiting a week to find out if anyone received your complaint.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-950">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Resolution Time</h4>
                    <p className="text-base text-muted-foreground">Issues that previously took 3-5 days to resolve now close in 24 hours on average. Direct communication eliminates the middleman delay.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-950">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Zero Lost Complaints</h4>
                    <p className="text-base text-muted-foreground">Every submission is logged, timestamped, and tracked. Nothing falls through the cracks.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-950">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">Self-Serve Updates</h4>
                    <p className="text-base text-muted-foreground">Check project progress anytime without calling. Know when work will reach your side before you need to ask.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="faq-1" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-1">
              How do I get the vendor code?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              Contact your building manager or property manager. They receive the vendor code from the service company and share it with residents.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-2">
              Can I access the portal from my phone?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              Yes. The portal works on any device with internet access: phone, tablet, or computer.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-3">
              What if I move to a different unit in the same building?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              Update your unit number in your account settings. Your strata plan number stays the same.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-4">
              What if I move to a different building?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              Update both your strata plan number and unit number. Enter the new vendor's code when you receive it from your new building manager.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-5">
              Can other residents see my feedback?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              No. You can only see feedback you submitted. Building managers and the service company can see all feedback for the building, but other residents cannot.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-6" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-6">
              What happens if my feedback is closed but the issue persists?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              Only the company can reopen closed feedback. If you believe an issue wasn't fully resolved, contact your building manager or property manager with documented proof from the portal.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-7" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-7">
              Can I submit positive feedback?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              Absolutely. The system accepts all types of input: concerns, compliments, questions, and suggestions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-8" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-8">
              How long do I have to submit feedback after work is done?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              Residents have 5 business days after project completion to submit feedback. This window allows time to notice issues while keeping the complaint period reasonable.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-9" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-9">
              Is my data secure?
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              Yes. Your account uses encrypted passwords and secure sessions. Your feedback is private and visible only to you and authorized personnel.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Get Started Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Your Building Is Already Using This System
        </h2>
        
        <div className="space-y-4 text-base text-muted-foreground max-w-2xl mx-auto mb-8">
          <p>
            Your building's service company chose OnRopePro to improve communication with residents like you. They want to hear from you directly, not through three layers of phone calls.
          </p>
          <p>
            Creating an account takes two minutes. Once you enter the vendor code from your building manager, you'll see active projects and have direct access to submit feedback.
          </p>
          <p className="font-medium text-foreground">
            No more wondering. No more waiting. No more repeating yourself.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-[#0B64A3] hover:bg-[#0369A1] text-white" asChild>
            <Link href="/register" data-testid="button-create-account">
              Create Your Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
        
        <p className="text-base text-muted-foreground mt-4">
          Already have an account? <Link href="/login" className="text-[#0B64A3] hover:underline font-medium" data-testid="link-login">Log In</Link>
        </p>
        <p className="text-base text-muted-foreground mt-2">
          Need the vendor code? Contact your building manager or property manager.
        </p>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={onRopeProLogo} alt="OnRopePro" className="h-10 object-contain" />
          <p className="text-sm text-muted-foreground">
            © 2024 OnRopePro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
