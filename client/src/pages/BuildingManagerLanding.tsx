import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import {
  ArrowRight,
  Building2,
  Shield,
  Clock,
  Eye,
  Users,
  FileCheck,
  CheckCircle2,
  Bell,
  MessageSquare,
  BarChart3,
  Calendar,
  Lock,
  FileText,
  History,
  ClipboardCheck,
  AlertCircle,
  Star
} from "lucide-react";

const BUILDING_MANAGER_COLOR = "#B89685";
const BUILDING_MANAGER_GRADIENT_END = "#9A7B6C";

export default function BuildingManagerLanding() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { openLogin } = useAuthPortal();
  const [faqOpen, setFaqOpen] = useState<string[]>([]);

  const handleSignIn = () => {
    setLocation("/login?tab=strata");
  };

  const features = [
    {
      icon: Eye,
      title: t('buildingManagerLanding.features.progress.title', 'Real-Time Project Visibility'),
      description: t('buildingManagerLanding.features.progress.description', 'Monitor work progress on your building with live updates. See drop completion, suite progress, and estimated completion times.'),
    },
    {
      icon: Shield,
      title: t('buildingManagerLanding.features.safety.title', 'Vendor Safety Ratings'),
      description: t('buildingManagerLanding.features.safety.description', 'View company safety ratings and compliance history before and during projects. Know your vendors are following best practices.'),
    },
    {
      icon: MessageSquare,
      title: t('buildingManagerLanding.features.communication.title', 'Resident Communication'),
      description: t('buildingManagerLanding.features.communication.description', 'Access resident feedback and complaints in real-time. Stay informed about any issues reported during maintenance work.'),
    },
    {
      icon: FileCheck,
      title: t('buildingManagerLanding.features.docs.title', 'Documentation Access'),
      description: t('buildingManagerLanding.features.docs.description', 'Download anchor logs, inspection reports, and certificates of insurance. All documentation in one secure location.'),
    },
    {
      icon: Bell,
      title: t('buildingManagerLanding.features.notices.title', 'Work Notices'),
      description: t('buildingManagerLanding.features.notices.description', 'Receive automated work notices for scheduled maintenance. Keep residents informed with professional notifications.'),
    },
    {
      icon: History,
      title: t('buildingManagerLanding.features.history.title', 'Complete Project History'),
      description: t('buildingManagerLanding.features.history.description', 'Access full history of all maintenance work performed on your building. Track vendors, dates, and completion status.'),
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: t('buildingManagerLanding.howItWorks.step1.title', 'Automatic Account Creation'),
      description: t('buildingManagerLanding.howItWorks.step1.description', 'When a rope access company creates a project for your building, your account is automatically created using your strata plan number.'),
    },
    {
      step: 2,
      title: t('buildingManagerLanding.howItWorks.step2.title', 'Secure Login'),
      description: t('buildingManagerLanding.howItWorks.step2.description', 'Log in using your strata plan number and the temporary password provided. You will be prompted to change your password for security.'),
    },
    {
      step: 3,
      title: t('buildingManagerLanding.howItWorks.step3.title', 'Monitor & Communicate'),
      description: t('buildingManagerLanding.howItWorks.step3.description', 'View project progress, access documentation, review resident feedback, and stay informed about all maintenance activities.'),
    },
  ];

  const faqs = [
    {
      id: "faq-1",
      question: t('buildingManagerLanding.faqs.q1.question', 'How do I get access to the Building Manager Portal?'),
      answer: t('buildingManagerLanding.faqs.q1.answer', 'Your account is automatically created when a rope access company creates a project for your building. Your login credentials are your strata plan number (e.g., BCS1234) for both username and initial password.'),
    },
    {
      id: "faq-2",
      question: t('buildingManagerLanding.faqs.q2.question', 'What information can I see about my building projects?'),
      answer: t('buildingManagerLanding.faqs.q2.answer', 'You can view real-time project progress including drop completion percentages, suite/stall progress, scheduled dates, vendor information, and resident feedback. You also have access to all project documentation.'),
    },
    {
      id: "faq-3",
      question: t('buildingManagerLanding.faqs.q3.question', 'Can I communicate with the rope access company?'),
      answer: t('buildingManagerLanding.faqs.q3.answer', 'Yes! You can view company contact information, access resident complaints that have been submitted, and review work notices. The vendor company can see your building access instructions and special requirements.'),
    },
    {
      id: "faq-4",
      question: t('buildingManagerLanding.faqs.q4.question', 'How do I update building access instructions?'),
      answer: t('buildingManagerLanding.faqs.q4.answer', 'In the Building Instructions section, you can update access codes, key fob information, roof access details, and any special requests. This information is shared with technicians working on your building.'),
    },
    {
      id: "faq-5",
      question: t('buildingManagerLanding.faqs.q5.question', 'Is my building information secure?'),
      answer: t('buildingManagerLanding.faqs.q5.answer', 'Absolutely. All data is encrypted and only accessible to authorized users. Building managers can only see projects associated with their specific building. We recommend changing your password from the default immediately after first login.'),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <PublicHeader activeNav="building-manager" />
      
      <section className="relative text-white pb-[120px]" style={{backgroundImage: `linear-gradient(135deg, ${BUILDING_MANAGER_COLOR} 0%, ${BUILDING_MANAGER_GRADIENT_END} 100%)`}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNHMxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-building-manager">
              <div className="flex flex-col items-center gap-1">
                <span>{t('buildingManagerLanding.hero.badge', 'For Building Managers')}</span>
                <span className="text-xs opacity-90">{t('buildingManagerLanding.hero.badgeSubtitle', 'Strata & Property Management')}</span>
              </div>
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('buildingManagerLanding.hero.title', 'Your Building.')}<br />
              <span className="text-orange-100">{t('buildingManagerLanding.hero.titleHighlight', 'Your Visibility.')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              {t('buildingManagerLanding.hero.subtitle', 'Monitor rope access maintenance projects in real-time.')}<br />
              <strong>{t('buildingManagerLanding.hero.subtitleStrong', 'Progress tracking, safety compliance, and resident communication.')}</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-white hover:bg-orange-50" 
                style={{color: BUILDING_MANAGER_COLOR}} 
                onClick={handleSignIn}
                data-testid="button-hero-login"
              >
                {t('buildingManagerLanding.hero.signIn', 'Sign In to Portal')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white/10" 
                onClick={() => setLocation("/help/for-building-managers")}
                data-testid="button-hero-learn-more"
              >
                {t('buildingManagerLanding.hero.learnMore', 'Learn More')}
              </Button>
            </div>
            
            <p className="text-sm text-orange-100/80">
              {t('buildingManagerLanding.hero.autoAccount', 'Your account is created automatically when a vendor starts a project')}
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      <section className="py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-200">
                    {t('buildingManagerLanding.notice.title', 'How Do I Get Access?')}
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">
                    {t('buildingManagerLanding.notice.description', 'Building manager accounts are automatically created when a rope access company creates a project for your building. You will receive login credentials from your vendor or can use your strata plan number to sign in.')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
              {t('buildingManagerLanding.features.title', 'Everything You Need to Stay Informed')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('buildingManagerLanding.features.subtitle', 'The Building Manager Portal gives you complete visibility into maintenance work on your property.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover-elevate" data-testid={`card-feature-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor: `${BUILDING_MANAGER_COLOR}20`}}>
                      <Icon className="w-6 h-6" style={{color: BUILDING_MANAGER_COLOR}} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-how-it-works-title">
              {t('buildingManagerLanding.howItWorks.title', 'How It Works')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('buildingManagerLanding.howItWorks.subtitle', 'Getting started with the Building Manager Portal is simple.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center" data-testid={`step-${step.step}`}>
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"
                  style={{backgroundColor: BUILDING_MANAGER_COLOR}}
                >
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-faq-title">
              {t('buildingManagerLanding.faqs.title', 'Frequently Asked Questions')}
            </h2>
          </div>
          
          <Accordion type="multiple" value={faqOpen} onValueChange={setFaqOpen}>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left" data-testid={`accordion-trigger-${faq.id}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4" style={{backgroundColor: BUILDING_MANAGER_COLOR}}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('buildingManagerLanding.cta.title', 'Ready to Monitor Your Building?')}
          </h2>
          <p className="text-xl mb-8 text-white/80">
            {t('buildingManagerLanding.cta.subtitle', 'Sign in to your Building Manager Portal and stay informed about all maintenance work.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white hover:bg-slate-100"
              style={{color: BUILDING_MANAGER_COLOR}}
              onClick={handleSignIn}
              data-testid="button-cta-login"
            >
              {t('buildingManagerLanding.cta.signIn', 'Sign In Now')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/40 text-white hover:bg-white/10"
              onClick={() => setLocation("/help/for-building-managers")}
              data-testid="button-cta-learn-more"
            >
              {t('buildingManagerLanding.cta.learnMore', 'View Help Articles')}
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            {t('buildingManagerLanding.footer.copyright', '© 2024 OnRopePro. All rights reserved.')}
          </p>
        </div>
      </footer>
    </div>
  );
}
