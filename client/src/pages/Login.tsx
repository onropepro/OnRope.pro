import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Rocket, Play, Building2, Clock, DollarSign, Users, Shield, FileText, Calculator, FileSpreadsheet, Radio, ClipboardCheck, MessageSquare, Home, Award, Calendar, FolderOpen } from "lucide-react";
import ropeAccessProLogo from "@assets/generated_images/Blue_rope_access_worker_logo_ac1aa8fd.png";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const rotatingWords = [
  "project",
  "safety meeting",
  "hour worked",
  "drop",
  "resident complaint",
  "piece of gear",
  "non-billable hour",
  "job quote",
  "safety document",
  "hour scheduled",
  "employee's performance level",
  "job's progress"
];

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Check if user is already logged in and redirect appropriately
  const { data: userData, isLoading: isCheckingAuth, error: authError } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    retry: false,
  });

  useEffect(() => {
    // Don't redirect while loading or if there's an auth error
    if (isCheckingAuth || authError) {
      return;
    }
    
    // Only redirect if we have confirmed user data from a successful API call
    if (userData?.user) {
      console.log("👤 Already logged in, redirecting...", userData.user.role);
      if (userData.user.role === "resident") {
        setLocation("/resident");
      } else if (userData.user.role === "property_manager") {
        setLocation("/property-manager");
      } else if (userData.user.role === "superuser") {
        setLocation("/superuser");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [userData, isCheckingAuth, authError, setLocation]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        form.setError("identifier", { message: result.message || "Login failed" });
        return;
      }

      // Invalidate user cache to ensure fresh data is fetched
      await queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Fetch fresh user data to get the latest subscription status
      const userResponse = await fetch("/api/user", {
        credentials: "include",
      });
      
      if (!userResponse.ok) {
        form.setError("identifier", { 
          message: "Failed to verify account status. Please try again." 
        });
        return;
      }
      
      const userData = await userResponse.json();
      const user = userData.user;
      
      console.log("🔐 Login successful! User data:", {
        id: user.id,
        username: user.username,
        role: user.role,
        companyId: user.companyId
      });
      
      // Use client-side navigation to preserve React state and cache
      if (user.role === "resident") {
        console.log("🏠 Redirecting to resident dashboard...");
        setLocation("/resident");
      } else if (user.role === "property_manager") {
        console.log("🏢 Redirecting to property manager dashboard...");
        setLocation("/property-manager");
      } else {
        console.log("📊 Redirecting to employee dashboard...");
        setLocation("/dashboard");
      }
      
      console.log("✅ Navigation triggered");
    } catch (error) {
      form.setError("identifier", { message: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={ropeAccessProLogo} alt="OnRopePro" className="w-7 h-7 object-contain" />
          <span className="font-bold text-lg">OnRopePro</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            onClick={() => setShowLoginForm(true)}
            data-testid="button-sign-in-header"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => setLocation("/pricing")}
            data-testid="button-get-started-header"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <p className="text-xs md:text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-6">
          Building Maintenance Management Software<br />
          Built by a Level 3 IRATA Tech
        </p>
        
        <h1 className="text-2xl md:text-4xl font-medium text-primary mb-2">
          Your competitors think they're organized.
        </h1>
        
        <div className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
          THEY'RE NOT
        </div>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-8">
          You track every{" "}
          <span 
            className={`inline-block font-semibold text-primary transition-all duration-300 ${
              isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {rotatingWords[currentWordIndex]}
          </span>
          , from a single platform that actually speaks rope access.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button 
            size="lg"
            onClick={() => setLocation("/pricing")}
            className="gap-2 px-6"
            data-testid="button-get-started-free"
          >
            <Rocket className="w-4 h-4" />
            Get Started Free
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="gap-2 px-6"
            data-testid="button-watch-demo"
          >
            <Play className="w-4 h-4" />
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Pain Points Section - Below the Fold */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-12">
            Your competitors think they're organized.<br />
            <span className="font-normal">But in reality:</span>
          </h2>
          
          <div className="space-y-4 md:space-y-5 text-base md:text-lg text-muted-foreground">
            <p>
              They're losing <span className="font-semibold text-destructive">$40K/year</span> to payroll errors they don't see.
            </p>
            <p>
              They're spending <span className="font-semibold text-[#e84a6c]">80 hours monthly</span> on admin that should take 10.
            </p>
            <p>
              They're underbidding <span className="font-semibold text-[#e84a6c]">25% of jobs</span> because they're guessing.
            </p>
            <p>
              They're <span className="font-semibold text-destructive">juggling resident complaints</span> between memory, emails, texts, phone calls, notes in a glovebox.
            </p>
            <p>
              They're <span className="font-semibold text-destructive">one accident away</span> from a lawsuit they can't defend because their safety documentation is (maybe) under the driver's front seat.
            </p>
            <p>
              They're losing contracts because they look like amateurs next to you.
            </p>
          </div>
          
          <p className="text-xl md:text-2xl font-bold mt-12">
            Let them keep thinking they're organized.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to Streamline Your Rope Access Operations?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join rope access companies who've already ditched the spreadsheet chaos
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => setLocation("/register")}
              className="gap-2 px-6"
              data-testid="button-start-free-trial"
            >
              <Rocket className="w-4 h-4" />
              Start Free Trial
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="gap-2 px-6"
              data-testid="button-schedule-demo"
            >
              <span className="material-icons text-lg">calendar_today</span>
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Juggling 10 Different Tools Is Costing You More Than Time
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Replace scattered systems with one platform built specifically for rope access companies managing techs across multiple buildings. Time tracking, safety compliance, project visibility, payroll precision, resident communication - all within one intelligent platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Projects (Active & Past)</p>
              <h3 className="font-bold">4-Elevation Building Visualization</h3>
              <p className="text-sm text-primary font-medium">Stop Guessing. Start Knowing.</p>
              <p className="text-sm text-muted-foreground">
                Track all four sides (N/E/S/W) of every project with visual progress bars. Know instantly: "West elevation 68% done. North finished. East behind schedule." Finally, stop guessing. Your crew knows. Your client knows. You know.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Work Session & Hours Tracker</p>
              <h3 className="font-bold">4 Hours or 30 Minutes?</h3>
              <p className="text-sm text-primary font-medium">That's How Long Payroll Takes. Your Choice.</p>
              <p className="text-sm text-muted-foreground">
                Clock in. Clock out. System calculates hours down to the second. 8h 15m worked on Tower One. 6h 42m on Tower Five. Zero disputes. Zero spreadsheets. Zero "I swear I worked 9 hours." 87-93% time savings. Your competitor? Still using Excel.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Non-Billable Hour Tracker</p>
              <h3 className="font-bold">$12,600 Fell Through The Cracks</h3>
              <p className="text-sm text-primary font-medium">Travel Time. Setup Time. You Paid. Client Didn't.</p>
              <p className="text-sm text-muted-foreground">
                Paid for 45 hours. Billed for 32 hours. That's 13 hours donated. Every. Single. Week. Track travel time, equipment setup, weather delays separately. See your billable ratio: 68%. Target: 75%+. Stop the bleed. Your margins thank you.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Employees</p>
              <h3 className="font-bold">Team Management & Permissions</h3>
              <p className="text-sm text-primary font-medium">Supervisors Log Drops. They Don't See Pay Rates.</p>
              <p className="text-sm text-muted-foreground">
                Financial data stays private. IRATA levels tracked. 100% payroll accuracy. Hourly rates configured. Zero awkward conversations. Give supervisors job tools, not salary spreadsheets.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Inventory & Inspections</p>
              <h3 className="font-bold">Equipment & Safety Compliance</h3>
              <p className="text-sm text-primary font-medium">You Export 6 Months of Harness Inspections in 4 Minutes. Building Manager Swoons.</p>
              <p className="text-sm text-muted-foreground">
                Track personal safety equipment with serial numbers, employee assignments, inspection dates, and automated retirement workflows for failed gear. Daily inspections. Instant exports. Zero panic.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Toolbox Meetings</p>
              <h3 className="font-bold">Safety Briefings & Documentation</h3>
              <p className="text-sm text-primary font-medium">The Lawsuit You'll Win Because You Did the Meeting. And You Can Prove It.</p>
              <p className="text-sm text-muted-foreground">
                Digital safety forms, PDF rope access plans. Comprehensive safety documentation management. Every meeting logged. Every inspection recorded. Every piece of equipment tracked. The lawyer asks "prove it." You hand them 400 pages. Case dismissed.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Payroll</p>
              <h3 className="font-bold">Employee Hours & Compensation</h3>
              <p className="text-sm text-primary font-medium">Dave Worked 87.5 Hours - Including Overtime. Paid $2,887.50. Export. Done.</p>
              <p className="text-sm text-muted-foreground">
                Select pay period. System aggregates all hours across all projects. Regular hours. Overtime hours. Hourly rates applied. Gross pay calculated. Export to QuickBooks. 30 minutes. Your competitor? Still using Excel for 4 hours. Still making $1,200 mistakes.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Multi-Service Quoting</p>
              <h3 className="font-bold">One Quote, Every Service</h3>
              <p className="text-sm text-primary font-medium">Window Cleaning + Dryer Vents + Parkade + In-Suite. One Price.</p>
              <p className="text-sm text-muted-foreground">
                Create comprehensive quotes combining window cleaning, dryer vents, parkade maintenance, and in-suite work with individual service pricing and photo documentation. Cross-sell without looking desperate. Professional. Complete. Done in 30 minutes.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Worker Tracking</p>
              <h3 className="font-bold">Real-Time Field Visibility</h3>
              <p className="text-sm text-primary font-medium">Dave's on Tower One. Has Been Since 7:32am. Working 4h 18m.</p>
              <p className="text-sm text-muted-foreground">
                Monitor active workers, billable/non-billable hours, and performance analytics with live dashboards. Color-coded status. Green = working. Yellow = break. Red = check on them. Answer clients instantly: "Crew's on-site right now."
              </p>
            </div>

            {/* Feature 10 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Safety Compliance</p>
              <h3 className="font-bold">Safety Compliance</h3>
              <p className="text-sm text-muted-foreground">
                Digital safety forms, PDF rope access plans, and comprehensive safety documentation management.
              </p>
            </div>

            {/* Feature 11 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Complaint Management</p>
              <h3 className="font-bold">Centralized. Organized. Done.</h3>
              <p className="text-sm text-primary font-medium">70% Fewer Calls. 24-Hour Resolution</p>
              <p className="text-sm text-muted-foreground">
                Mrs. Henderson adds a photo: "Missed my window." She is replied to in 4 minutes: "On it tomorrow, 9am." She stops calling the building manager. They stop calling you. Everyone stops calling. Residents self-serve. You respond same-day. Your competitor? Still using paper.
              </p>
            </div>

            {/* Feature 12 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Resident Portal</p>
              <h3 className="font-bold">Building Resident Management</h3>
              <p className="text-sm text-primary font-medium">The Contract Renewal Machine. 240 Residents Watch Progress. Submit Complaints. Stop Calling.</p>
              <p className="text-sm text-muted-foreground">
                240 residents watch progress on their phones. Submit complaints that get fixed same-day. Tell their council "these guys are professional." Your competitor? Still using paper. Contract renewal rate: 95%. Theirs: 60%. Math is simple.
              </p>
            </div>

            {/* Feature 13 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">IRATA & Insurance Audit Protection</p>
              <h3 className="font-bold">"Show Me Your Inspection Logs"</h3>
              <p className="text-sm text-muted-foreground">
                Auditor asks for 6 months of harness inspections. You export PDF in 4 minutes. Every tech. Every day. Every piece of equipment. Building manager swoons.
              </p>
            </div>

            {/* Feature 14 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Job Scheduling</p>
              <h3 className="font-bold">Visual Calendar & Resource Planning</h3>
              <p className="text-sm text-primary font-medium">Dave's Assigned to Tower One AND Tower Five Tuesday?</p>
              <p className="text-sm text-muted-foreground">
                Drag-and-drop calendar. See every project, every tech, every day. System catches conflicts: "Dave assigned to Tower One AND Tower Five Tuesday." Fix it before Monday. No confused crews. No angry clients. No 20-minute detective work.
              </p>
            </div>

            {/* Feature 15 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Documents</p>
              <h3 className="font-bold">Centralized Safety & Project Repository</h3>
              <p className="text-sm text-primary font-medium">Find That Certificate. 4 Minutes.</p>
              <p className="text-sm text-muted-foreground">
                Insurance audit. Search "IRATA." Every certificate appears. Click. Download. Email. Done in 4 minutes. While your competitor digs through their truck. 5 categories. Instant search. Mobile upload. Cloud backup. Zero filing cabinets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal - Overlay when shown */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl border-2 relative">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3 md:hidden mb-2">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-icons text-2xl text-primary">apartment</span>
              </div>
              <div>
                <CardTitle className="text-2xl">Rope Access</CardTitle>
                <CardDescription className="text-xs">Management Platform</CardDescription>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your dashboard and manage operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                            email
                          </span>
                          <Input 
                            type="email"
                            placeholder="your@email.com" 
                            {...field} 
                            data-testid="input-identifier" 
                            className="h-12 pl-12 text-base" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                            lock
                          </span>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            {...field} 
                            data-testid="input-password" 
                            className="h-12 pl-12 text-base" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-shadow" 
                  data-testid="button-login"
                >
                  <span className="material-icons mr-2">login</span>
                  Sign In
                </Button>
              </form>
            </Form>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="h-10 text-xs bg-yellow-500 hover:bg-yellow-600 text-black" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "testcom", password: "test123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
                      } else if (user.role === "property_manager") {
                        window.location.href = "/property-manager";
                      } else {
                        window.location.href = "/dashboard";
                      }
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Test account not found in production database",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-testcom"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                OWNER DEVELOPMENT ONLY
              </Button>

              <Button 
                className="h-10 text-xs bg-green-600 hover:bg-green-700 text-white" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "tester@tester.com", password: "tester123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
                      } else if (user.role === "property_manager") {
                        window.location.href = "/property-manager";
                      } else {
                        window.location.href = "/dashboard";
                      }
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Test account not found in production database",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-tester"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                TESTER OWNER
              </Button>

              <Button 
                className="h-10 text-xs bg-primary hover:bg-primary/90 text-white" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "employee@employee.com", password: "employee123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
                      } else if (user.role === "property_manager") {
                        window.location.href = "/property-manager";
                      } else {
                        window.location.href = "/dashboard";
                      }
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Test account not found in production database",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-employee"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                EMPLOYEE TESTER
              </Button>

              <Button 
                variant="secondary" 
                className="h-10 text-xs" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "resident@resident.com", password: "resident123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      const user = result.user;
                      if (user.role === "resident") {
                        window.location.href = "/resident";
                      } else if (user.role === "property_manager") {
                        window.location.href = "/property-manager";
                      } else {
                        window.location.href = "/dashboard";
                      }
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Test account not found in production database",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-resident"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                RESIDENT TESTER
              </Button>

              <Button 
                variant="secondary" 
                className="h-10 text-xs" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "property@property.com", password: "property123" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/property-manager";
                    } else {
                      toast({
                        title: "Quick Login Failed",
                        description: result.message || "Property manager account not found",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-property-manager"
              >
                <span className="material-icons mr-1 text-base">flash_on</span>
                PROPERTY MANAGER
              </Button>

              <Button 
                variant="destructive" 
                className="h-10 text-xs col-span-2" 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ identifier: "SuperUser", password: "Mhlqt419!" }),
                      credentials: "include",
                    });
                    const result = await response.json();
                    if (response.ok) {
                      window.location.href = "/superuser";
                    } else {
                      toast({
                        title: "SuperUser Login Failed",
                        description: result.message || "SuperUser access denied",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Login Error",
                      description: "Network error. Please try manual login.",
                      variant: "destructive",
                    });
                  }
                }}
                data-testid="button-quick-login-superuser"
              >
                <span className="material-icons mr-1 text-base">shield</span>
                SuperUser
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">New to the platform?</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="default" 
                className="w-full h-12 text-base font-medium" 
                onClick={() => window.location.href = "/get-license"}
                data-testid="button-get-license"
              >
                <span className="material-icons mr-2">shopping_cart</span>
                Get License
              </Button>

              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium" 
                onClick={() => window.location.href = "/register"}
                data-testid="link-register"
              >
                <span className="material-icons mr-2">person_add</span>
                Create Resident/Property Manager Account
              </Button>
            </div>

            {/* Mobile-only feature highlights */}
            <div className="md:hidden pt-4 space-y-4 border-t">
              <h3 className="text-sm font-semibold text-center">Built for All Stakeholders</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="space-y-1">
                  <span className="material-icons text-primary text-2xl">business</span>
                  <div className="text-xs font-medium">Companies</div>
                </div>
                <div className="space-y-1">
                  <span className="material-icons text-primary text-2xl">manage_accounts</span>
                  <div className="text-xs font-medium">Managers</div>
                </div>
                <div className="space-y-1">
                  <span className="material-icons text-primary text-2xl">engineering</span>
                  <div className="text-xs font-medium">Technicians</div>
                </div>
                <div className="space-y-1">
                  <span className="material-icons text-primary text-2xl">home</span>
                  <div className="text-xs font-medium">Residents</div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Secure, Professional, Transparent</p>
              <p>Purpose-built for rope access and building maintenance operations</p>
            </div>
          </CardContent>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setShowLoginForm(false)}
            data-testid="button-close-login"
          >
            <span className="material-icons">close</span>
          </Button>
        </Card>
        </div>
      )}
    </div>
  );
}
