import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { trackLogin } from "@/lib/analytics";
import { Rocket, Play, Building2, Clock, DollarSign, Users, Shield, FileText, Calculator, FileSpreadsheet, Radio, ClipboardCheck, MessageSquare, Home, Award, Calendar, FolderOpen, Globe, TrendingUp, ArrowRight, HardHat, Lock } from "lucide-react";
import { TechnicianRegistration } from "@/components/TechnicianRegistration";
import { Slider } from "@/components/ui/slider";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showTechnicianRegistration, setShowTechnicianRegistration] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [landingLanguage, setLandingLanguage] = useState<'en' | 'fr'>('en');
  const [roiEmployeeCount, setRoiEmployeeCount] = useState(12);
  const [showModulesMenu, setShowModulesMenu] = useState(false);
  const modulesMenuRef = useRef<HTMLDivElement>(null);

  // Initialize landing page language from its own storage key (separate from user preference)
  useEffect(() => {
    const savedLandingLang = localStorage.getItem('landingPageLang') as 'en' | 'fr' | null;
    // Default to English for landing page, only use French if explicitly set
    const lang = savedLandingLang || 'en';
    setLandingLanguage(lang);
    i18n.changeLanguage(lang);
  }, [i18n]);

  // Toggle language for landing page only
  const toggleLandingLanguage = () => {
    const newLang = landingLanguage === 'en' ? 'fr' : 'en';
    setLandingLanguage(newLang);
    localStorage.setItem('landingPageLang', newLang);
    i18n.changeLanguage(newLang);
  };

  const rotatingWords = [
    t('login.rotatingWords.safetyMeeting', 'safety meeting'),
    t('login.rotatingWords.project', 'project'),
    t('login.rotatingWords.hourWorked', 'hour worked'),
    t('login.rotatingWords.drop', 'drop'),
    t('login.rotatingWords.residentFeedback', 'resident feedback'),
    t('login.rotatingWords.pieceOfGear', 'piece of gear'),
    t('login.rotatingWords.nonBillableHour', 'non-billable hour'),
    t('login.rotatingWords.jobQuote', 'job quote'),
    t('login.rotatingWords.jobProgress', "job's progress"),
    t('login.rotatingWords.hourScheduled', 'drop'),
    t('login.rotatingWords.employeePerformance', "employee's performance level")
  ];

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

  // Close modules menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modulesMenuRef.current && !modulesMenuRef.current.contains(e.target as Node)) {
        setShowModulesMenu(false);
      }
    };
    
    if (showModulesMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showModulesMenu]);

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
      
      // Track login event
      trackLogin('email');
      
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
        {/* Logo - Left */}
        <div className="flex items-center">
          <img src={onRopeProLogo} alt="OnRopePro" className="h-16 object-contain" />
        </div>
        
        {/* Navigation - Center */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={() => setLocation("/employer")}
            data-testid="nav-employer"
          >
            Employer
          </Button>
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={() => setLocation("/technician-login")}
            data-testid="nav-technician"
          >
            Technician
          </Button>
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={() => setLocation("#")}
            data-testid="nav-property-manager"
          >
            Property Manager
          </Button>
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={() => setLocation("/link")}
            data-testid="nav-resident"
          >
            Resident
          </Button>
          <Button
            variant="ghost"
            className="text-sm font-medium"
            onClick={() => setLocation("/building-portal")}
            data-testid="nav-building-manager"
          >
            Building Manager
          </Button>
          <div 
            className="relative" 
            ref={modulesMenuRef}
            onMouseEnter={() => setShowModulesMenu(true)}
            onMouseLeave={() => setShowModulesMenu(false)}
          >
            <Button
              variant="ghost"
              className="text-sm font-medium"
              data-testid="nav-modules"
            >
              Modules
            </Button>
            {showModulesMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 w-[480px] z-50">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left group"
                    onClick={() => {
                      setLocation("/modules/safety-compliance");
                      setShowModulesMenu(false);
                    }}
                    data-testid="nav-safety-compliance"
                  >
                    <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100">Safety & Compliance</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Inspections, toolbox meetings, incident tracking</div>
                    </div>
                  </button>
                  <button
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left group"
                    onClick={() => {
                      setLocation("/modules/user-access-authentication");
                      setShowModulesMenu(false);
                    }}
                    data-testid="nav-user-access"
                  >
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100">User Access & Authentication</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Role-based permissions, secure login, audit trails</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
        
        {/* Actions - Right */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            size="sm"
            onClick={toggleLandingLanguage}
            className="gap-1.5"
            data-testid="button-language-toggle"
          >
            <Globe className="w-4 h-4" />
            {landingLanguage === 'en' ? 'FR' : 'EN'}
          </Button>
          <Button 
            variant="ghost"
            onClick={() => setShowLoginForm(true)}
            data-testid="button-sign-in-header"
          >
            {t('login.header.signIn', 'Sign In')}
          </Button>
          <Button 
            onClick={() => setLocation("/pricing")}
            className="bg-[#A3320B]"
            data-testid="button-get-started-header"
          >
            {t('login.header.getStarted', 'Get Started')}
          </Button>
        </div>
      </header>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-16 md:py-24" style={{ backgroundColor: '#F3F3F3' }}>
        <h1 className="text-xs md:text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
          {t('login.hero.subtitle', 'Building Maintenance Management Software')}
        </h1>
        <p className="text-xs md:text-sm font-semibold tracking-widest text-muted-foreground uppercase" style={{ marginBottom: '60px' }}>
          {t('login.hero.builtBy', 'Built by a Level 3 IRATA Tech')}
        </p>
        
        <p className="text-2xl md:text-4xl font-medium mb-0 text-[#3B3B3B]" style={{ color: '#3B3B3B' }}>
          {t('login.hero.tagline', "Your competitors think they're organized.")}
        </p>
        
        <div className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4" style={{ color: '#3B3B3B' }}>
          {t('login.hero.taglineBold', "THEY'RE NOT")}
        </div>
        
        <p className="text-base md:text-lg max-w-xl mb-8" style={{ color: '#3B3B3B' }}>
          {t('login.hero.description', 'You track every')}{" "}
          <span 
            className="inline-block transition-all duration-300 opacity-100 translate-y-0 text-[#3B3B3B] font-bold"
          >
            {rotatingWords[currentWordIndex]}
          </span>
          {t('login.hero.descriptionEnd', ', from a single platform that actually speaks rope access.')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button 
            size="lg"
            onClick={() => setLocation("/pricing")}
            className="gap-2 px-6 bg-[#A3320B]"
            data-testid="button-get-started-free"
          >
            <Rocket className="w-4 h-4" />
            {t('login.hero.getStartedFree', 'Get Started Free')}
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="gap-2 px-6"
            data-testid="button-watch-demo"
          >
            <Play className="w-4 h-4" />
            {t('login.hero.watchDemo', 'Watch Demo')}
          </Button>
        </div>
      </section>
      {/* ROI Calculator Section - Embedded Question 1 */}
      <section className="py-16 md:py-24 px-6 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Calculate Your Hidden Costs<br />
            In Less Than 60 Seconds
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t('login.roiCalculator.subtitle', 'Most rope access companies waste $15,000-25,000 per year on scattered online SAAS tools, manual processes, hidden admin costs, and wasted time. Find out how much you could save.')}
          </p>
          
          {/* Embedded Employee Slider - Question 1 */}
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-3 justify-center">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">
                  {t('roi.questions.employees.title', 'How many employees work in the field or office?')}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('roi.questions.employees.min', '5 employees')}</span>
                  <span className="text-3xl font-bold text-primary">{roiEmployeeCount}</span>
                  <span className="text-sm text-muted-foreground">{t('roi.questions.employees.max', '50 employees')}</span>
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
                  {t('roi.questions.employees.description', 'Include all field technicians, office staff, and management')}
                </p>
              </div>
              
              <Button 
                size="lg"
                onClick={() => setLocation(`/roi-calculator?employees=${roiEmployeeCount}&step=2`)}
                className="w-full gap-2"
                data-testid="button-roi-calculator-next"
              >
                {t('roi.navigation.next', 'Next')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Pain Points Section - Below the Fold */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-12">
            {t('login.painPoints.title', "Your competitors think they're organized.")}<br />
            <span className="font-normal">{t('login.painPoints.subtitle', 'But in reality:')}</span>
          </h2>
          
          <div className="space-y-4 md:space-y-5 text-base md:text-lg text-muted-foreground">
            <p>
              {t('login.painPoints.payrollErrors', "They're losing $40K/year to payroll errors they don't see.")}
            </p>
            <p>
              {t('login.painPoints.adminTime', "They're spending 80 hours monthly on admin that should take 10.")}
            </p>
            <p>
              {t('login.painPoints.underbidding', "They're underbidding 25% of jobs because they're guessing.")}
            </p>
            <p>
              {t('login.painPoints.feedback', "They're juggling resident feedback between memory, emails, texts, phone calls, notes in a glovebox.")}
            </p>
            <p>
              {t('login.painPoints.lawsuit', "They're one accident away from a lawsuit they can't defend because their safety documentation is (maybe) under the driver's front seat.")}
            </p>
            <p>
              {t('login.painPoints.losingContracts', "They're losing contracts because they look like amateurs next to you.")}
            </p>
          </div>
          
          <p className="text-xl md:text-2xl font-bold mt-12">
            {t('login.painPoints.conclusion', "Let them keep thinking they're organized.")}
          </p>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            {t('login.cta.title', 'Ready to Streamline Your Rope Access Operations?')}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t('login.cta.subtitle', "Join rope access companies who've already ditched the spreadsheet chaos")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => setLocation("/register")}
              className="gap-2 px-6"
              data-testid="button-start-free-trial"
            >
              <Rocket className="w-4 h-4" />
              {t('login.cta.startFreeTrial', 'Start Free Trial')}
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="gap-2 px-6"
              data-testid="button-schedule-demo"
            >
              <span className="material-icons text-lg">calendar_today</span>
              {t('login.cta.scheduleDemo', 'Schedule Demo')}
            </Button>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              {t('login.features.title', 'Juggling 10 Different Tools Is Costing You More Than Time')}
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {t('login.features.subtitle', 'Replace scattered systems with one platform built specifically for rope access companies managing techs across multiple buildings. Time tracking, safety compliance, project visibility, payroll precision, resident communication - all within one intelligent platform.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.projects.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.projects.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.projects.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.projects.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.workSessions.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.workSessions.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.workSessions.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.workSessions.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.nonBillable.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.nonBillable.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.nonBillable.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.nonBillable.description')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.employees.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.employees.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.employees.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.employees.description')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.inventory.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.inventory.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.inventory.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.inventory.description')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.toolbox.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.toolbox.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.toolbox.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.toolbox.description')}
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.payroll.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.payroll.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.payroll.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.payroll.description')}
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.quoting.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.quoting.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.quoting.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.quoting.description')}
              </p>
            </div>

            {/* Feature 9 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.tracking.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.tracking.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.tracking.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.tracking.description')}
              </p>
            </div>

            {/* Feature 10 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.safety.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.safety.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.safety.description')}
              </p>
            </div>

            {/* Feature 11 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.feedback.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.feedback.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.feedback.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.feedback.description')}
              </p>
            </div>

            {/* Feature 12 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.residents.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.residents.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.residents.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.residents.description')}
              </p>
            </div>

            {/* Feature 13 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.audit.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.audit.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.audit.description')}
              </p>
            </div>

            {/* Feature 14 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.scheduling.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.scheduling.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.scheduling.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.scheduling.description')}
              </p>
            </div>

            {/* Feature 15 */}
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.clientDashboard.category')}</p>
              <h3 className="font-bold">{t('login.features.cards.clientDashboard.title')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.clientDashboard.tagline')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.clientDashboard.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Login Modal - Overlay when shown */}
      {showLoginForm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowLoginForm(false)}
        >
          <Card 
            className="w-full max-w-md shadow-2xl border-2 relative my-4 md:my-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Sticky on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-20 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowLoginForm(false)}
              data-testid="button-close-login"
            >
              <span className="material-icons">close</span>
            </Button>
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
            <CardTitle className="text-3xl font-bold">{t('login.form.title', 'Welcome')}</CardTitle>
            <CardDescription className="text-base">
              {t('login.form.subtitle', 'Sign in to access your dashboard and manage operations')}
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
                      <FormLabel className="text-sm font-medium">{t('login.form.email', 'Email')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                            email
                          </span>
                          <Input 
                            type="email"
                            placeholder={t('login.form.emailPlaceholder', 'your@email.com')} 
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
                      <FormLabel className="text-sm font-medium">{t('login.form.password', 'Password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
                            lock
                          </span>
                          <Input 
                            type="password" 
                            placeholder={t('login.form.passwordPlaceholder', 'Enter your password')} 
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
                  {t('login.form.signInButton', 'Sign In')}
                </Button>
              </form>
            </Form>

            {/* Portal Access Section */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-11 text-sm font-medium border-amber-500/50 text-amber-600 dark:text-amber-400" 
                  onClick={() => setLocation("/technician-login")}
                  data-testid="button-technician-login"
                >
                  <HardHat className="mr-2 h-4 w-4" />
                  Technician Login
                </Button>
                <Button 
                  variant="outline" 
                  className="h-11 text-sm font-medium" 
                  onClick={() => setLocation("/building-portal")}
                  data-testid="button-building-portal"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Building Portal
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">New to the platform?</span>
              </div>
            </div>

            {/* New User Options */}
            <div className="space-y-2">
              <Button 
                variant="default" 
                className="w-full h-11 text-sm font-medium" 
                onClick={() => setLocation("/get-license")}
                data-testid="button-get-license"
              >
                <span className="material-icons mr-2 text-lg">shopping_cart</span>
                Get Company License
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 text-xs font-medium text-muted-foreground" 
                  onClick={() => setLocation("/register")}
                  data-testid="link-register"
                >
                  <span className="material-icons mr-1 text-sm">person_add</span>
                  Resident / Manager
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 text-xs font-medium text-amber-600 dark:text-amber-400" 
                  onClick={() => {
                    setShowLoginForm(false);
                    setShowTechnicianRegistration(true);
                  }}
                  data-testid="button-create-technician-account"
                >
                  <HardHat className="mr-1 h-3 w-3" />
                  Technician
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 text-center text-xs text-muted-foreground">
              <p>Secure, Professional, Transparent</p>
            </div>

            {/* Collapsible Dev Tools Section */}
            <div className="pt-2 border-t border-dashed border-muted-foreground/20">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full h-7 text-[10px] text-muted-foreground/50"
                onClick={() => setShowDevTools(!showDevTools)}
                data-testid="button-toggle-dev-tools"
              >
                <span className="material-icons text-xs mr-1">{showDevTools ? 'expand_less' : 'expand_more'}</span>
                {showDevTools ? 'Hide' : 'Show'} Development Tools
              </Button>
              
              {showDevTools && (
                <div className="grid grid-cols-3 gap-1 pt-2">
                  <Button 
                    size="sm"
                    className="h-7 text-[9px] bg-yellow-500 hover:bg-yellow-600 text-black" 
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
                          window.location.href = "/dashboard";
                        } else {
                          toast({ title: "Failed", description: result.message, variant: "destructive" });
                        }
                      } catch (error) {
                        toast({ title: "Error", description: "Network error", variant: "destructive" });
                      }
                    }}
                    data-testid="button-quick-login-testcom"
                  >
                    Owner
                  </Button>
                  <Button 
                    size="sm"
                    className="h-7 text-[9px] bg-green-600 hover:bg-green-700 text-white" 
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
                          window.location.href = "/dashboard";
                        } else {
                          toast({ title: "Failed", description: result.message, variant: "destructive" });
                        }
                      } catch (error) {
                        toast({ title: "Error", description: "Network error", variant: "destructive" });
                      }
                    }}
                    data-testid="button-quick-login-tester"
                  >
                    Tester
                  </Button>
                  <Button 
                    size="sm"
                    className="h-7 text-[9px] bg-primary hover:bg-primary/90 text-white" 
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
                          window.location.href = "/dashboard";
                        } else {
                          toast({ title: "Failed", description: result.message, variant: "destructive" });
                        }
                      } catch (error) {
                        toast({ title: "Error", description: "Network error", variant: "destructive" });
                      }
                    }}
                    data-testid="button-quick-login-employee"
                  >
                    Employee
                  </Button>
                  <Button 
                    size="sm"
                    className="h-7 text-[9px]" 
                    variant="secondary"
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
                          window.location.href = "/resident";
                        } else {
                          toast({ title: "Failed", description: result.message, variant: "destructive" });
                        }
                      } catch (error) {
                        toast({ title: "Error", description: "Network error", variant: "destructive" });
                      }
                    }}
                    data-testid="button-quick-login-resident"
                  >
                    Resident
                  </Button>
                  <Button 
                    size="sm"
                    className="h-7 text-[9px]" 
                    variant="secondary"
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
                          toast({ title: "Failed", description: result.message, variant: "destructive" });
                        }
                      } catch (error) {
                        toast({ title: "Error", description: "Network error", variant: "destructive" });
                      }
                    }}
                    data-testid="button-quick-login-property-manager"
                  >
                    Prop Mgr
                  </Button>
                  <Button 
                    size="sm"
                    className="h-7 text-[9px] bg-purple-600 hover:bg-purple-700 text-white" 
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/login", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ identifier: "info@onrope.pro", password: "onropepro" }),
                          credentials: "include",
                        });
                        const result = await response.json();
                        if (response.ok) {
                          window.location.href = "/superuser";
                        } else {
                          toast({ title: "Failed", description: result.message, variant: "destructive" });
                        }
                      } catch (error) {
                        toast({ title: "Error", description: "Network error", variant: "destructive" });
                      }
                    }}
                    data-testid="button-quick-login-superuser"
                  >
                    SuperUser
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      <TechnicianRegistration 
        open={showTechnicianRegistration} 
        onOpenChange={setShowTechnicianRegistration} 
      />
    </div>
  );
}
