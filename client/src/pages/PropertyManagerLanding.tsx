import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useTranslation } from 'react-i18next';
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
import { PropertyManagerRegistration } from "@/components/PropertyManagerRegistration";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";

const PM_COLOR = "#6E9075";
const PM_GRADIENT = "linear-gradient(135deg, #6E9075 0%, #5A7A60 100%)";

export default function PropertyManagerLanding() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [showRegistration, setShowRegistration] = useState(false);
  
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    retry: false,
  });

  useEffect(() => {
    if (userData?.user?.role === "property_manager") {
      setLocation("/pm-dashboard");
    }
  }, [userData, setLocation]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader />
      <section className="relative text-white pb-[120px]" style={{backgroundImage: PM_GRADIENT}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-pm-module">{t('propertyManagerLanding.hero.badge')}</Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('propertyManagerLanding.hero.titleLine1')}<br />
              <span className="text-green-100">{t('propertyManagerLanding.hero.titleLine2')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              {t('propertyManagerLanding.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-[#6E9075] hover:bg-green-50" onClick={() => setShowRegistration(true)} data-testid="button-create-account-hero">
                {t('propertyManagerLanding.cta.createFreeAccount')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
                <Link href="#how-it-works" data-testid="button-learn-how">
                  {t('propertyManagerLanding.cta.learnHow')}
                  <BookOpen className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="space-y-6 text-lg leading-relaxed">
          <p className="text-xl font-medium text-foreground">
            {t('propertyManagerLanding.hook.question')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.hook.problem')}
          </p>
          <p className="font-semibold text-foreground text-xl">
            {t('propertyManagerLanding.hook.solution')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.hook.description')}
          </p>
          <p className="font-medium text-foreground italic">
            {t('propertyManagerLanding.hook.tagline')}
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Button size="lg" style={{backgroundColor: PM_COLOR}} className="text-white hover:opacity-90" onClick={() => setShowRegistration(true)} data-testid="button-create-account-hook">
            {t('propertyManagerLanding.cta.createFreeAccount')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
      <Separator className="max-w-4xl mx-auto" />

      <section className="py-12 md:py-20 px-4 md:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('propertyManagerLanding.features.title')}
        </h2>
        
        <div className="space-y-8 mt-12">
          <Card className="overflow-hidden border-2" style={{borderColor: `${PM_COLOR}40`}}>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: PM_COLOR}}>
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-semibold">{t('propertyManagerLanding.features.directComplaints.title')}</h3>
                    <Badge variant="secondary" className="text-xs">{t('propertyManagerLanding.features.directComplaints.badge')}</Badge>
                  </div>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.directComplaints.p1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.directComplaints.p2')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.directComplaints.p3')}
                  </p>
                  <p className="text-base font-medium text-foreground">
                    {t('propertyManagerLanding.features.directComplaints.p4')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <Timer className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">{t('propertyManagerLanding.features.responseTime.title')}</h3>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.responseTime.p1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.responseTime.p2')}
                  </p>
                  <p className="text-base text-muted-foreground italic">
                    {t('propertyManagerLanding.features.responseTime.p3')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <Shield className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{t('propertyManagerLanding.features.safetyRatings.title')}</h3>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.safetyRatings.p1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.safetyRatings.p2')}
                  </p>
                  <p className="text-base font-medium text-foreground">
                    {t('propertyManagerLanding.features.safetyRatings.p3')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <Globe className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{t('propertyManagerLanding.features.vendorDashboard.title')}</h3>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.vendorDashboard.p1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.vendorDashboard.p2')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <History className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{t('propertyManagerLanding.features.feedbackHistory.title')}</h3>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.feedbackHistory.p1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.feedbackHistory.p2')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${PM_COLOR}20`}}>
                  <FileUp className="w-6 h-6" style={{color: PM_COLOR}} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{t('propertyManagerLanding.features.anchorInspection.title')}</h3>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.anchorInspection.p1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.features.anchorInspection.p2')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Separator className="max-w-4xl mx-auto" />

      <section className="py-12 md:py-20 px-4 md:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('propertyManagerLanding.comparison.title')}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card className="border-rose-200 dark:border-rose-800">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-rose-600">{t('propertyManagerLanding.comparison.before.title')}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">1</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.before.step1')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">2</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.before.step2')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">3</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.before.step3')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">4</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.before.step4')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">5</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.before.step5')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">6</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.before.step6')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center text-sm font-medium text-rose-600">7</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.before.step7')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-rose-400" /></div>
                <div className="text-sm text-rose-600 font-medium text-center">{t('propertyManagerLanding.comparison.before.repeat')}</div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {t('propertyManagerLanding.comparison.before.summary')}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2" style={{borderColor: PM_COLOR}}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4" style={{color: PM_COLOR}}>{t('propertyManagerLanding.comparison.after.title')}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{backgroundColor: PM_COLOR}}>1</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.after.step1')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4" style={{color: PM_COLOR}} /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{backgroundColor: PM_COLOR}}>2</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.after.step2')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4" style={{color: PM_COLOR}} /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{backgroundColor: PM_COLOR}}>3</div>
                  <span className="text-sm">{t('propertyManagerLanding.comparison.after.step3')}</span>
                </div>
                <div className="flex justify-center"><ArrowDown className="w-4 h-4" style={{color: PM_COLOR}} /></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{backgroundColor: PM_COLOR}}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{t('propertyManagerLanding.comparison.after.resolved')}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg" style={{backgroundColor: `${PM_COLOR}10`}}>
                <p className="text-sm font-semibold mb-2" style={{color: PM_COLOR}}>{t('propertyManagerLanding.comparison.after.whereAreYou')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('propertyManagerLanding.comparison.after.watching')}
                </p>
                <p className="text-sm font-medium text-foreground mt-2">
                  {t('propertyManagerLanding.comparison.after.notMiddle')}
                </p>
                <p className="text-sm font-semibold mt-2" style={{color: PM_COLOR}}>
                  {t('propertyManagerLanding.comparison.after.oversight')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Separator className="max-w-4xl mx-auto" />

      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto" id="how-it-works">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('propertyManagerLanding.howItWorks.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold" style={{backgroundColor: PM_COLOR}}>
              1
            </div>
            <h3 className="text-xl font-semibold">{t('propertyManagerLanding.howItWorks.step1.title')}</h3>
            <p className="text-base text-muted-foreground">
              {t('propertyManagerLanding.howItWorks.step1.description')}
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold" style={{backgroundColor: PM_COLOR}}>
              2
            </div>
            <h3 className="text-xl font-semibold">{t('propertyManagerLanding.howItWorks.step2.title')}</h3>
            <p className="text-base text-muted-foreground">
              {t('propertyManagerLanding.howItWorks.step2.description')}
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold" style={{backgroundColor: PM_COLOR}}>
              3
            </div>
            <h3 className="text-xl font-semibold">{t('propertyManagerLanding.howItWorks.step3.title')}</h3>
            <p className="text-base text-muted-foreground">
              {t('propertyManagerLanding.howItWorks.step3.description')}
            </p>
          </div>
        </div>

        <p className="text-center text-muted-foreground mt-8">
          {t('propertyManagerLanding.howItWorks.footer')}
        </p>

        <div className="mt-8 text-center">
          <Button size="lg" style={{backgroundColor: PM_COLOR}} className="text-white hover:opacity-90" onClick={() => setShowRegistration(true)} data-testid="button-create-account-steps">
            {t('propertyManagerLanding.cta.createFreeAccount')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
      <Separator className="max-w-4xl mx-auto" />

      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('propertyManagerLanding.whyFree.title')}
        </h2>
        
        <div className="mt-8 space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.whyFree.p1')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.whyFree.p2')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.whyFree.p3')}
          </p>
          <p className="font-medium text-foreground">
            {t('propertyManagerLanding.whyFree.p4')}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" variant="outline" style={{borderColor: PM_COLOR, color: PM_COLOR}} onClick={() => setShowRegistration(true)} data-testid="button-get-free-access">
            {t('propertyManagerLanding.cta.getFreeAccess')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
      <Separator className="max-w-4xl mx-auto" />

      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('propertyManagerLanding.documentation.title')}
        </h2>
        
        <Card className="border-2 mt-8" style={{borderColor: `${PM_COLOR}40`}}>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 shrink-0" style={{color: PM_COLOR}} />
              <div className="space-y-4">
                <p className="text-base text-muted-foreground">
                  {t('propertyManagerLanding.documentation.p1')}
                </p>
                <p className="text-base text-muted-foreground">
                  {t('propertyManagerLanding.documentation.p2')}
                </p>
                <p className="text-base text-muted-foreground">
                  {t('propertyManagerLanding.documentation.p3')}
                </p>
                <p className="text-base font-medium text-foreground">
                  {t('propertyManagerLanding.documentation.p4')}
                </p>
                <p className="text-base text-muted-foreground">
                  {t('propertyManagerLanding.documentation.p5')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <Separator className="max-w-4xl mx-auto" />

      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('propertyManagerLanding.timeBack.title')}
        </h2>
        
        <div className="mt-8 space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.timeBack.p1')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.timeBack.p2')}
          </p>
          <p className="font-semibold text-foreground text-xl">
            {t('propertyManagerLanding.timeBack.p3')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.timeBack.p4')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.timeBack.p5')}
          </p>
          <p className="font-medium text-foreground">
            {t('propertyManagerLanding.timeBack.p6')}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" style={{backgroundColor: PM_COLOR}} className="text-white hover:opacity-90" onClick={() => setShowRegistration(true)} data-testid="button-create-account-time">
            {t('propertyManagerLanding.cta.createFreeAccount')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
      <Separator className="max-w-4xl mx-auto" />

      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('propertyManagerLanding.accountability.title')}
        </h2>
        
        <div className="mt-8 space-y-6 text-lg leading-relaxed">
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.accountability.p1')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.accountability.p2')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.accountability.p3')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.accountability.p4')}
          </p>
          <p className="text-muted-foreground">
            {t('propertyManagerLanding.accountability.p5')}
          </p>
          <p className="font-medium text-foreground">
            {t('propertyManagerLanding.accountability.p6')}
          </p>
        </div>
      </section>
      <Separator className="max-w-4xl mx-auto" />

      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('propertyManagerLanding.faq.title')}
        </h2>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 shrink-0" style={{color: PM_COLOR}} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{t('propertyManagerLanding.faq.q1.question')}</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    {t('propertyManagerLanding.faq.q1.a1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.faq.q1.a2')}
                  </p>
                  <p className="text-base text-muted-foreground mt-2">
                    {t('propertyManagerLanding.faq.q1.a3')}
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
                  <h4 className="font-semibold text-foreground mb-2">{t('propertyManagerLanding.faq.q2.question')}</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    {t('propertyManagerLanding.faq.q2.a1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.faq.q2.a2')}
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
                  <h4 className="font-semibold text-foreground mb-2">{t('propertyManagerLanding.faq.q3.question')}</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    {t('propertyManagerLanding.faq.q3.a1')}
                  </p>
                  <p className="text-base text-muted-foreground mb-2">
                    {t('propertyManagerLanding.faq.q3.a2')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.faq.q3.a3')}
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
                  <h4 className="font-semibold text-foreground mb-2">{t('propertyManagerLanding.faq.q4.question')}</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    {t('propertyManagerLanding.faq.q4.a1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.faq.q4.a2')}
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
                  <h4 className="font-semibold text-foreground mb-2">{t('propertyManagerLanding.faq.q5.question')}</h4>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.faq.q5.a1')}
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
                  <h4 className="font-semibold text-foreground mb-2">{t('propertyManagerLanding.faq.q6.question')}</h4>
                  <p className="text-base text-muted-foreground mb-2">
                    {t('propertyManagerLanding.faq.q6.a1')}
                  </p>
                  <p className="text-base text-muted-foreground">
                    {t('propertyManagerLanding.faq.q6.a2')}
                  </p>
                  <p className="text-base text-muted-foreground mt-2">
                    {t('propertyManagerLanding.faq.q6.a3')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: `linear-gradient(135deg, ${PM_COLOR} 0%, #5A7A60 100%)`}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('propertyManagerLanding.finalCta.title')}
          </h2>
          <p className="text-lg text-white/90">
            {t('propertyManagerLanding.finalCta.subtitle1')}<br />
            {t('propertyManagerLanding.finalCta.subtitle2')}
          </p>
          <p className="font-medium text-white">
            {t('propertyManagerLanding.finalCta.free')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white hover:bg-gray-50" style={{color: PM_COLOR}} onClick={() => setShowRegistration(true)} data-testid="button-create-account-final">
              {t('propertyManagerLanding.cta.createFreeAccount')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
              <Link href="/contact" data-testid="button-tell-vendor">
                {t('propertyManagerLanding.cta.tellVendor')}
                <Users className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-white/80 pt-2">
            {t('propertyManagerLanding.finalCta.askVendor')}
          </p>
        </div>
      </section>

      <footer className="py-8 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 object-contain" />
            <span className="text-sm text-muted-foreground">{t('propertyManagerLanding.footer.tagline')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
              {t('propertyManagerLanding.footer.privacy')}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
              {t('propertyManagerLanding.footer.terms')}
            </Link>
          </div>
        </div>
      </footer>

      {/* Registration Modal */}
      <PropertyManagerRegistration open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
}
