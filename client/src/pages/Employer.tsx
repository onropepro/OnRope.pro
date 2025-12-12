import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Play, Building2, Clock, DollarSign, Users, Shield, MessageSquare, ArrowRight } from "lucide-react";
import { InstallPWAButton } from "@/components/InstallPWAButton";
import { Slider } from "@/components/ui/slider";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

export default function Employer() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [landingLanguage, setLandingLanguage] = useState<'en' | 'fr'>('en');
  const [roiEmployeeCount, setRoiEmployeeCount] = useState(12);

  const rotatingWords = [
    t('login.rotatingWords.drop', 'drop'),
    t('login.rotatingWords.deviation', 'deviation'),
    t('login.rotatingWords.workSession', 'work session'),
    t('login.rotatingWords.safety', 'safety meeting'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const toggleLandingLanguage = () => {
    const newLang = landingLanguage === 'en' ? 'fr' : 'en';
    setLandingLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        {/* Logo - Left */}
        <div className="flex items-center">
          <img src={onRopeProLogo} alt="OnRopePro" className="h-16 object-contain cursor-pointer" onClick={() => setLocation("/")} />
        </div>
        
        {/* Navigation - Center */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          <Button
            variant="default"
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
        </nav>
        
        {/* Actions - Right */}
        <div className="flex items-center gap-3">
          <InstallPWAButton />
          <Button 
            variant="ghost"
            size="sm"
            onClick={toggleLandingLanguage}
            data-testid="button-language-toggle"
          >
            {landingLanguage === 'en' ? 'FR' : 'EN'}
          </Button>
          <Button 
            variant="ghost"
            onClick={() => setLocation("/login")}
            data-testid="button-sign-in-header"
          >
            {t('login.header.signIn', 'Sign In')}
          </Button>
          <Button 
            onClick={() => setLocation("/pricing")}
            className="bg-action-600 hover:bg-action-500 focus:ring-4 focus:ring-action-500/50"
            data-testid="button-get-started-header"
          >
            {t('login.header.getStarted', 'Get Started')}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 bg-neutral-100 dark:bg-navy-950">
        <h1 className="text-xs md:text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
          {t('login.hero.subtitle', 'Building Maintenance Management Software')}
        </h1>
        <p className="text-xs md:text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-16">
          {t('login.hero.builtBy', 'Built by a Level 3 IRATA Tech & Operations Manager')}
        </p>
        
        <p className="text-2xl md:text-4xl font-medium mb-0 text-foreground">
          {t('login.hero.tagline', "Your competitors think they're organized.")}
        </p>
        
        <div className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 text-foreground">
          {t('login.hero.taglineBold', "THEY'RE NOT")}
        </div>
        
        <p className="text-base md:text-lg max-w-xl mb-8 text-foreground">
          {t('login.hero.description', 'You track every')}{" "}
          <span className="inline-block transition-all duration-300 opacity-100 translate-y-0 font-bold text-foreground">
            {rotatingWords[currentWordIndex]}
          </span>
          {t('login.hero.descriptionEnd', ', from a single platform that actually speaks rope access.')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button 
            size="lg"
            onClick={() => setLocation("/pricing")}
            className="gap-2 px-6 bg-action-600 hover:bg-action-500 focus:ring-4 focus:ring-action-500/50"
            data-testid="button-get-started-free"
          >
            <Rocket className="w-4 h-4" />
            {t('login.hero.getStartedFree', 'Get Started Free')}
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="gap-2 px-6 focus:ring-4 focus:ring-action-500/50"
            data-testid="button-watch-demo"
          >
            <Play className="w-4 h-4" />
            {t('login.hero.watchDemo', 'Watch Demo')}
          </Button>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16 md:py-24 px-6 bg-action-500/10 dark:bg-navy-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Calculate Your Hidden Costs<br />
            In Less Than 60 Seconds
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t('login.roiCalculator.subtitle', 'Most rope access companies waste $15,000-25,000 per year on scattered online SAAS tools, manual processes, hidden admin costs, and wasted time. Find out how much you could save.')}
          </p>
          
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
                className="w-full gap-2 focus:ring-4 focus:ring-action-500/50"
                data-testid="button-roi-calculator-next"
              >
                {t('roi.navigation.next', 'Next')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-12">
            {t('login.painPoints.title', "Your competitors think they're organized.")}<br />
            <span className="font-normal">{t('login.painPoints.subtitle', 'But in reality:')}</span>
          </h2>
          
          <div className="space-y-4 md:space-y-5 text-base md:text-lg text-muted-foreground">
            <p>{t('login.painPoints.payrollErrors', "They're losing $40K/year to payroll errors they don't see.")}</p>
            <p>{t('login.painPoints.adminTime', "They're spending 80 hours monthly on admin that should take 10.")}</p>
            <p>{t('login.painPoints.underbidding', "They're underbidding 25% of jobs because they're guessing.")}</p>
            <p>{t('login.painPoints.feedback', "They're juggling resident feedback between memory, emails, texts, phone calls, notes in a glovebox.")}</p>
            <p>{t('login.painPoints.lawsuit', "They're one accident away from a lawsuit they can't defend because their safety documentation is (maybe) under the driver's front seat.")}</p>
            <p>{t('login.painPoints.losingContracts', "They're losing contracts because they look like amateurs next to you.")}</p>
          </div>
          
          <p className="text-xl md:text-2xl font-bold mt-12">
            {t('login.painPoints.conclusion', "Let them keep thinking they're organized.")}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-muted/30 dark:bg-navy-950">
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
              className="gap-2 px-6 focus:ring-4 focus:ring-action-500/50"
              data-testid="button-start-free-trial"
            >
              <Rocket className="w-4 h-4" />
              {t('login.cta.startFreeTrial', 'Start Free Trial')}
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="gap-2 px-6 focus:ring-4 focus:ring-action-500/50"
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
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.projects.category', 'Projects')}</p>
              <h3 className="font-bold">{t('login.features.cards.projects.title', 'Project Management')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.projects.tagline', 'See everything at a glance')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.projects.description', 'Track progress, assign techs, monitor drop counts, and manage timelines across all your buildings.')}
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.workSessions.category', 'Time Tracking')}</p>
              <h3 className="font-bold">{t('login.features.cards.workSessions.title', 'GPS Work Sessions')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.workSessions.tagline', 'Know where your team is')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.workSessions.description', 'Real-time GPS tracking, automatic clock-in/out, and detailed work session history.')}
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.nonBillable.category', 'Payroll')}</p>
              <h3 className="font-bold">{t('login.features.cards.nonBillable.title', 'Non-Billable Hours')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.nonBillable.tagline', 'Track every hour')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.nonBillable.description', 'Separate billable and non-billable hours for accurate payroll and project costing.')}
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.employees.category', 'Team')}</p>
              <h3 className="font-bold">{t('login.features.cards.employees.title', 'Employee Management')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.employees.tagline', 'All your team info in one place')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.employees.description', 'Certifications, emergency contacts, banking info, and documents - all securely stored.')}
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.safety.category', 'Safety')}</p>
              <h3 className="font-bold">{t('login.features.cards.safety.title', 'Safety Compliance')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.safety.tagline', 'Stay compliant, stay safe')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.safety.description', 'Digital toolbox talks, harness inspections, incident reports, and FLHA forms.')}
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('login.features.cards.residents.category', 'Communication')}</p>
              <h3 className="font-bold">{t('login.features.cards.residents.title', 'Resident Portal')}</h3>
              <p className="text-sm text-primary font-medium">{t('login.features.cards.residents.tagline', 'Keep residents informed')}</p>
              <p className="text-sm text-muted-foreground">
                {t('login.features.cards.residents.description', 'Two-way communication, complaint management, photo galleries, and progress updates.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={onRopeProLogo} alt="OnRopePro" className="h-10 object-contain" />
          <p className="text-sm text-muted-foreground">
            {t('login.footer.copyright', '© 2024 OnRopePro. All rights reserved.')}
          </p>
        </div>
      </footer>
    </div>
  );
}
