import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
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
  LogIn,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import onRopeProLogo from "@assets/OnRopePro-logo_1764625558626.png";
import projectProgressImg from "@assets/residents-project-progress_1766199096691.png";
import workNoticesImg from "@assets/residents-notices_1766199096691.png";
import submitFeedbackImg from "@assets/residents-submit-feedback_1766199096691.png";
import feedbackHistoryImg from "@assets/residents-feedback-history_1766199096691.png";
import residentProfileImg from "@assets/resident-profile-tab.png";

// Official Resident color from stakeholder palette
const RESIDENT_COLOR = "#86A59C";

export default function ResidentLanding() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { openLogin, openRegister } = useAuthPortal();
  
  const { data: userData } = useQuery<{ user: any }>({
    queryKey: ["/api/user"],
    retry: false,
  });

  useEffect(() => {
    if (userData?.user?.role === "resident") {
      setLocation("/resident-dashboard");
    }
  }, [userData, setLocation]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader />
      
      {/* Hero Section - Following Module Landing Page Hero Template with Resident Mint Green */}
      <section className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #86A59C 0%, #6B8A80 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-resident-module">
              {t('residentLanding.hero.badge')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('residentLanding.hero.title')}<br />
              <span className="text-white/80">{t('residentLanding.hero.subtitle')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {t('residentLanding.hero.description')}<br />
              <strong>{t('residentLanding.hero.tagline')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-white hover:bg-gray-50" 
                style={{color: RESIDENT_COLOR}} 
                onClick={openRegister}
                data-testid="button-create-account-hero"
              >
                {t('residentLanding.buttons.createAccount')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10"
                onClick={openLogin}
                data-testid="button-sign-in-hero"
              >
                {t('residentLanding.buttons.signIn')}
                <LogIn className="ml-2 w-5 h-5" />
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
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-700">{t('residentLanding.stats.oneSubmission')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('residentLanding.stats.notThreeCalls')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">{t('residentLanding.stats.proofTheySawIt')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('residentLanding.stats.viewedTimestamp')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">{t('residentLanding.stats.zeroLost')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('residentLanding.stats.complaints')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">{t('residentLanding.stats.twentyFourHourResolution')}</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('residentLanding.stats.notFiveDays')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
          {t('residentLanding.problemStatement.title')}
        </h2>
        
        <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
          <p>
            {t('residentLanding.problemStatement.paragraph1')}
          </p>
          <p>
            {t('residentLanding.problemStatement.paragraph2')}
          </p>
          <p>
            {t('residentLanding.problemStatement.paragraph3')}
          </p>
          <p className="font-medium text-foreground">
            {t('residentLanding.problemStatement.solution')}
          </p>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* What You Can Do Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('residentLanding.whatYouCanDo.title')}
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          {t('residentLanding.whatYouCanDo.subtitle')}
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader style={{backgroundColor: `${RESIDENT_COLOR}10`}} className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
                  <MapPin className="w-5 h-5" style={{color: RESIDENT_COLOR}} />
                </div>
                <CardTitle className="text-lg">{t('residentLanding.features.trackProgress.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-base text-muted-foreground">
                {t('residentLanding.features.trackProgress.description')}
              </p>
              <div className="space-y-2">
                <p className="text-base font-medium text-foreground">{t('residentLanding.features.trackProgress.whatYouSee')}</p>
                <ul className="text-base text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.trackProgress.item1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.trackProgress.item2')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.trackProgress.item3')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.trackProgress.item4')}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{backgroundColor: `${RESIDENT_COLOR}10`}} className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
                  <Camera className="w-5 h-5" style={{color: RESIDENT_COLOR}} />
                </div>
                <CardTitle className="text-lg">{t('residentLanding.features.submitFeedback.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-base text-muted-foreground">
                {t('residentLanding.features.submitFeedback.description')}
              </p>
              <div className="space-y-2">
                <p className="text-base font-medium text-foreground">{t('residentLanding.features.submitFeedback.whatYouCanSubmit')}</p>
                <ul className="text-base text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.submitFeedback.item1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.submitFeedback.item2')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.submitFeedback.item3')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.submitFeedback.item4')}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader style={{backgroundColor: `${RESIDENT_COLOR}10`}} className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
                  <Eye className="w-5 h-5" style={{color: RESIDENT_COLOR}} />
                </div>
                <CardTitle className="text-lg">{t('residentLanding.features.trackStatus.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-base text-muted-foreground">
                {t('residentLanding.features.trackStatus.description')}
              </p>
              <div className="space-y-2">
                <p className="text-base font-medium text-foreground">{t('residentLanding.features.trackStatus.whatYouTrack')}</p>
                <ul className="text-base text-muted-foreground space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.trackStatus.item1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.trackStatus.item2')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.trackStatus.item3')}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-1 shrink-0" style={{color: RESIDENT_COLOR}} />
                    {t('residentLanding.features.trackStatus.item4')}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Screenshot Gallery Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('residentLanding.screenshots.title')}
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          {t('residentLanding.screenshots.subtitle')}
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <img 
                src={projectProgressImg} 
                alt="Project progress view" 
                className="w-full h-auto"
                data-testid="img-project-progress"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('residentLanding.screenshots.projectProgressCaption')}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <img 
                src={workNoticesImg} 
                alt={t('residentLanding.screenshots.workNoticesAlt')} 
                className="w-full h-auto"
                data-testid="img-work-notices"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('residentLanding.screenshots.workNoticesCaption')}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <img 
                src={submitFeedbackImg} 
                alt={t('residentLanding.screenshots.submitFeedbackAlt')} 
                className="w-full h-auto"
                data-testid="img-submit-feedback"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('residentLanding.screenshots.submitFeedbackCaption')}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <img 
                src={feedbackHistoryImg} 
                alt={t('residentLanding.screenshots.feedbackHistoryAlt')} 
                className="w-full h-auto"
                data-testid="img-feedback-history"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t('residentLanding.screenshots.feedbackHistoryCaption')}
            </p>
            
            <div className="mt-5 space-y-3">
              <div className="rounded-lg overflow-hidden border shadow-sm">
                <img 
                  src={residentProfileImg} 
                  alt={t('residentLanding.screenshots.residentProfileAlt')} 
                  className="w-full h-auto"
                  data-testid="img-resident-profile"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {t('residentLanding.screenshots.residentProfileCaption')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('residentLanding.howItWorks.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
              <UserPlus className="w-8 h-8" style={{color: RESIDENT_COLOR}} />
            </div>
            <div className="text-2xl font-bold" style={{color: RESIDENT_COLOR}}>{t('residentLanding.howItWorks.step1.label')}</div>
            <h3 className="text-xl font-semibold">{t('residentLanding.howItWorks.step1.title')}</h3>
            <p className="text-base text-muted-foreground">
              {t('residentLanding.howItWorks.step1.description')}
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
              <Building2 className="w-8 h-8" style={{color: RESIDENT_COLOR}} />
            </div>
            <div className="text-2xl font-bold" style={{color: RESIDENT_COLOR}}>{t('residentLanding.howItWorks.step2.label')}</div>
            <h3 className="text-xl font-semibold">{t('residentLanding.howItWorks.step2.title')}</h3>
            <p className="text-base text-muted-foreground">
              {t('residentLanding.howItWorks.step2.description')}
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
              <MessageCircle className="w-8 h-8" style={{color: RESIDENT_COLOR}} />
            </div>
            <div className="text-2xl font-bold" style={{color: RESIDENT_COLOR}}>{t('residentLanding.howItWorks.step3.label')}</div>
            <h3 className="text-xl font-semibold">{t('residentLanding.howItWorks.step3.title')}</h3>
            <p className="text-base text-muted-foreground">
              {t('residentLanding.howItWorks.step3.description')}
            </p>
          </div>
        </div>

        <Card className="mt-8 border" style={{backgroundColor: `${RESIDENT_COLOR}10`, borderColor: `${RESIDENT_COLOR}40`}}>
          <CardContent className="p-6">
            <p className="text-base" style={{color: RESIDENT_COLOR}}>
              <strong>{t('residentLanding.howItWorks.note.label')}</strong> {t('residentLanding.howItWorks.note.text')}
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Problems Solved Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('residentLanding.problemsSolved.title')}
        </h2>
        
        <div className="mt-8">
          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="problem-1" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-problem-1">
                {t('residentLanding.problemsSolved.problem1.trigger')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-4">
                <p>
                  {t('residentLanding.problemsSolved.problem1.description')}
                </p>
                <div className="rounded-lg p-4" style={{backgroundColor: `${RESIDENT_COLOR}10`}}>
                  <p className="text-base font-medium" style={{color: RESIDENT_COLOR}}>
                    {t('residentLanding.problemsSolved.problem1.solution')}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem-2" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-problem-2">
                {t('residentLanding.problemsSolved.problem2.trigger')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-4">
                <p>
                  {t('residentLanding.problemsSolved.problem2.description')}
                </p>
                <div className="rounded-lg p-4" style={{backgroundColor: `${RESIDENT_COLOR}10`}}>
                  <p className="text-base font-medium" style={{color: RESIDENT_COLOR}}>
                    {t('residentLanding.problemsSolved.problem2.solution')}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem-3" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-problem-3">
                {t('residentLanding.problemsSolved.problem3.trigger')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-4">
                <p>
                  {t('residentLanding.problemsSolved.problem3.description')}
                </p>
                <div className="rounded-lg p-4" style={{backgroundColor: `${RESIDENT_COLOR}10`}}>
                  <p className="text-base font-medium" style={{color: RESIDENT_COLOR}}>
                    {t('residentLanding.problemsSolved.problem3.solution')}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="problem-4" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
              <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-problem-4">
                {t('residentLanding.problemsSolved.problem4.trigger')}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pb-4 space-y-4">
                <p>
                  {t('residentLanding.problemsSolved.problem4.description')}
                </p>
                <div className="rounded-lg p-4" style={{backgroundColor: `${RESIDENT_COLOR}10`}}>
                  <p className="text-base font-medium" style={{color: RESIDENT_COLOR}}>
                    {t('residentLanding.problemsSolved.problem4.solution')}
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
          {t('residentLanding.keyFeatures.title')}
        </h2>
        <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          {t('residentLanding.keyFeatures.subtitle')}
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
                  <Clock className="w-5 h-5" style={{color: RESIDENT_COLOR}} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.keyFeatures.viewedTimestamp.title')}</h4>
                  <p className="text-base text-muted-foreground">{t('residentLanding.keyFeatures.viewedTimestamp.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
                  <Camera className="w-5 h-5" style={{color: RESIDENT_COLOR}} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.keyFeatures.photoUploads.title')}</h4>
                  <p className="text-base text-muted-foreground">{t('residentLanding.keyFeatures.photoUploads.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
                  <MapPin className="w-5 h-5" style={{color: RESIDENT_COLOR}} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.keyFeatures.progressTracking.title')}</h4>
                  <p className="text-base text-muted-foreground">{t('residentLanding.keyFeatures.progressTracking.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
                  <Eye className="w-5 h-5" style={{color: RESIDENT_COLOR}} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.keyFeatures.statusBadges.title')}</h4>
                  <p className="text-base text-muted-foreground">{t('residentLanding.keyFeatures.statusBadges.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
                  <Home className="w-5 h-5" style={{color: RESIDENT_COLOR}} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.keyFeatures.portableAccount.title')}</h4>
                  <p className="text-base text-muted-foreground">{t('residentLanding.keyFeatures.portableAccount.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{backgroundColor: `${RESIDENT_COLOR}20`}}>
                  <Shield className="w-5 h-5" style={{color: RESIDENT_COLOR}} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.keyFeatures.privacyProtection.title')}</h4>
                  <p className="text-base text-muted-foreground">{t('residentLanding.keyFeatures.privacyProtection.description')}</p>
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
            {t('residentLanding.measurableResults.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card className="bg-white dark:bg-slate-950">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.measurableResults.fasterResponse.title')}</h4>
                    <p className="text-base text-muted-foreground">{t('residentLanding.measurableResults.fasterResponse.description')}</p>
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
                    <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.measurableResults.resolutionTime.title')}</h4>
                    <p className="text-base text-muted-foreground">{t('residentLanding.measurableResults.resolutionTime.description')}</p>
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
                    <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.measurableResults.zeroLostComplaints.title')}</h4>
                    <p className="text-base text-muted-foreground">{t('residentLanding.measurableResults.zeroLostComplaints.description')}</p>
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
                    <h4 className="text-lg font-semibold text-foreground">{t('residentLanding.measurableResults.selfServeUpdates.title')}</h4>
                    <p className="text-base text-muted-foreground">{t('residentLanding.measurableResults.selfServeUpdates.description')}</p>
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
          {t('residentLanding.faqs.title')}
        </h2>
        
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="faq-1" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-1">
              {t('residentLanding.faqs.faq1.question')}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              {t('residentLanding.faqs.faq1.answer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-2">
              {t('residentLanding.faqs.faq2.question')}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              {t('residentLanding.faqs.faq2.answer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-3">
              {t('residentLanding.faqs.faq3.question')}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              {t('residentLanding.faqs.faq3.answer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-4">
              {t('residentLanding.faqs.faq4.question')}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              {t('residentLanding.faqs.faq4.answer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-5">
              {t('residentLanding.faqs.faq5.question')}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              {t('residentLanding.faqs.faq5.answer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-6" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-6">
              {t('residentLanding.faqs.faq6.question')}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              {t('residentLanding.faqs.faq6.answer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-7" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-7">
              {t('residentLanding.faqs.faq7.question')}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              {t('residentLanding.faqs.faq7.answer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-8" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-8">
              {t('residentLanding.faqs.faq8.question')}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              {t('residentLanding.faqs.faq8.answer')}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-9" className="border rounded-lg px-4 bg-white dark:bg-slate-950">
            <AccordionTrigger className="text-left text-base font-medium py-4" data-testid="accordion-faq-9">
              {t('residentLanding.faqs.faq9.question')}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground pb-4">
              {t('residentLanding.faqs.faq9.answer')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Section - Stakeholder Colored */}
      <section className="py-16 md:py-20 px-4 text-white" style={{backgroundImage: `linear-gradient(135deg, ${RESIDENT_COLOR} 0%, #6B8A80 100%)`}}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('residentLanding.cta.title')}
          </h2>
          <p className="text-lg text-white/90">
            {t('residentLanding.cta.description')}
          </p>
          <p className="font-medium text-white">
            {t('residentLanding.cta.tagline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-white hover:bg-gray-50" style={{color: RESIDENT_COLOR}} onClick={openRegister} data-testid="button-create-account">
              {t('residentLanding.buttons.createAccount')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10" onClick={openLogin} data-testid="button-login-cta">
              {t('residentLanding.buttons.logIn')}
            </Button>
          </div>
          <p className="text-sm text-white/80 pt-2">
            {t('residentLanding.cta.vendorCodeHelp')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={onRopeProLogo} alt="OnRopePro" className="h-8 object-contain" />
            <span className="text-sm text-muted-foreground">{t('residentLanding.footer.tagline')}</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">
              {t('residentLanding.footer.privacyPolicy')}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">
              {t('residentLanding.footer.termsOfService')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
