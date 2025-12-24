import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Users, Clock, Shield, MapPin, 
  ClipboardCheck, Calendar, CheckCircle, Smartphone,
  Building2, HardHat, Briefcase, FileCheck
} from "lucide-react";
import { GroundCrewRegistration } from "@/components/GroundCrewRegistration";
import { PublicHeader } from "@/components/PublicHeader";

const GROUND_CREW_COLOR = "#5D7B6F";
const GROUND_CREW_GRADIENT = "linear-gradient(135deg, #5D7B6F 0%, #4A6359 100%)";

export default function GroundCrewLanding() {
  const { t } = useTranslation();
  const [showRegistration, setShowRegistration] = useState(false);

  const benefits = [
    {
      icon: Clock,
      title: t('groundCrewLanding.benefits.hours.title', 'Automatic Hour Tracking'),
      description: t('groundCrewLanding.benefits.hours.description', 'Clock in and out with GPS verification. Your hours are logged automatically.')
    },
    {
      icon: ClipboardCheck,
      title: t('groundCrewLanding.benefits.safety.title', 'Digital Safety Forms'),
      description: t('groundCrewLanding.benefits.safety.description', 'Complete toolbox talks and safety forms right from your phone.')
    },
    {
      icon: Calendar,
      title: t('groundCrewLanding.benefits.schedule.title', 'View Your Schedule'),
      description: t('groundCrewLanding.benefits.schedule.description', 'See your upcoming shifts, project assignments, and team members.')
    },
    {
      icon: MapPin,
      title: t('groundCrewLanding.benefits.gps.title', 'GPS-Verified Records'),
      description: t('groundCrewLanding.benefits.gps.description', 'Location-stamped clock in/out protects you and ensures accurate pay.')
    },
    {
      icon: Smartphone,
      title: t('groundCrewLanding.benefits.mobile.title', 'Mobile-First Design'),
      description: t('groundCrewLanding.benefits.mobile.description', 'Built for the jobsite. Everything you need fits in your pocket.')
    },
    {
      icon: FileCheck,
      title: t('groundCrewLanding.benefits.portable.title', 'Portable Work History'),
      description: t('groundCrewLanding.benefits.portable.description', 'Your hours and records follow you. Switch jobs without losing data.')
    }
  ];

  const stats = [
    { value: t('groundCrewLanding.stats.setup.value', '60 sec'), label: t('groundCrewLanding.stats.setup.label', 'Account Setup') },
    { value: t('groundCrewLanding.stats.clockin.value', '1 Tap'), label: t('groundCrewLanding.stats.clockin.label', 'To Clock In') },
    { value: t('groundCrewLanding.stats.forms.value', '100%'), label: t('groundCrewLanding.stats.forms.label', 'Digital Forms') },
    { value: t('groundCrewLanding.stats.portable.value', 'Always'), label: t('groundCrewLanding.stats.portable.label', 'Your Data') },
  ];

  const howItWorks = [
    {
      step: 1,
      title: t('groundCrewLanding.howItWorks.step1.title', 'Create Your Free Account'),
      description: t('groundCrewLanding.howItWorks.step1.description', 'Sign up in 60 seconds with your basic info. No credit card required.')
    },
    {
      step: 2,
      title: t('groundCrewLanding.howItWorks.step2.title', 'Accept Employer Invitation'),
      description: t('groundCrewLanding.howItWorks.step2.description', 'Your employer sends you an invitation. Accept it to connect your account.')
    },
    {
      step: 3,
      title: t('groundCrewLanding.howItWorks.step3.title', 'Start Working'),
      description: t('groundCrewLanding.howItWorks.step3.description', 'Clock in, complete safety forms, and track your hours automatically.')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader activeNav="ground-crew" />
      
      {/* Hero Section */}
      <section className="relative text-white pb-[120px]" style={{ backgroundImage: GROUND_CREW_GRADIENT }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1">
              {t('groundCrewLanding.hero.badge', 'Ground Support Workers')}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('groundCrewLanding.hero.title1', 'Your Hours.')}<br />
              {t('groundCrewLanding.hero.title2', 'Your Records.')}<br />
              <span className="text-green-100">{t('groundCrewLanding.hero.title3', 'Always Tracked.')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              {t('groundCrewLanding.hero.subtitle', 'The free app for ground support workers. Track hours, complete safety forms, and keep your work history portable.')}<br />
              <strong>{t('groundCrewLanding.hero.subtitleStrong', 'No more paper timesheets.')}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-white hover:bg-green-50"
                style={{ color: GROUND_CREW_COLOR }}
                onClick={() => setShowRegistration(true)}
                data-testid="button-hero-register"
              >
                {t('groundCrewLanding.hero.cta', 'Create Free Account')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/login">
                  {t('groundCrewLanding.hero.login', 'Already have an account?')}
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
                  <div className="text-3xl md:text-4xl font-bold text-blue-700">{stats[0].value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stats[0].label}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">{stats[1].value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stats[1].label}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-600">{stats[2].value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stats[2].label}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-violet-600">{stats[3].value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stats[3].label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('groundCrewLanding.benefits.title', 'Everything You Need on the Jobsite')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('groundCrewLanding.benefits.subtitle', 'Built for ground support workers who need reliable hour tracking and easy safety compliance.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <Card key={i} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${GROUND_CREW_COLOR}15` }}>
                    <benefit.icon className="w-6 h-6" style={{ color: GROUND_CREW_COLOR }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('groundCrewLanding.howItWorks.title', 'Get Started in 3 Steps')}
            </h2>
          </div>

          <div className="space-y-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold shrink-0" style={{ backgroundColor: GROUND_CREW_COLOR }}>
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 text-white" style={{ backgroundImage: GROUND_CREW_GRADIENT }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('groundCrewLanding.cta.title', 'Ready to Track Your Hours?')}
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {t('groundCrewLanding.cta.subtitle', 'Create your free account in 60 seconds. No credit card required.')}
          </p>
          <Button 
            size="lg" 
            className="bg-white hover:bg-green-50"
            style={{ color: GROUND_CREW_COLOR }}
            onClick={() => setShowRegistration(true)}
            data-testid="button-cta-register"
          >
            {t('groundCrewLanding.cta.button', 'Create Free Account')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>{t('groundCrewLanding.footer.copyright', '2024 OnRope.Pro. All rights reserved.')}</p>
        </div>
      </footer>

      {/* Registration Modal */}
      <GroundCrewRegistration 
        open={showRegistration} 
        onOpenChange={setShowRegistration} 
      />
    </div>
  );
}
