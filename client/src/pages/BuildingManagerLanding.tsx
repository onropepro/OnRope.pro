import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicHeader } from "@/components/PublicHeader";
import { useAuthPortal } from "@/hooks/use-auth-portal";
import { SiGoogledocs, SiSlack, SiGmail } from "react-icons/si";
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
  Phone,
  Mail,
  Notebook,
  AlertCircle,
  Star,
  Smartphone,
  Search
} from "lucide-react";

const BUILDING_MANAGER_COLOR = "#3B7A9E";
const BUILDING_MANAGER_GRADIENT_END = "#2C5F7D";

export default function BuildingManagerLanding() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { openLogin } = useAuthPortal();
  const [faqOpen, setFaqOpen] = useState<string[]>([]);

  const handleSignIn = () => {
    openLogin();
  };

  const whatWeDoCards = [
    {
      title: t('buildingManagerLanding.whatWeDo.visibility.title', 'Real-Time Project Visibility'),
      description: t('buildingManagerLanding.whatWeDo.visibility.description', 'See exactly what\'s happening on your building. No more calling the contractor for updates. No more wondering if they\'re on schedule.'),
      items: [
        t('buildingManagerLanding.whatWeDo.visibility.item1', 'Drop completion by elevation (North, East, South, West)'),
        t('buildingManagerLanding.whatWeDo.visibility.item2', 'Suite/stall progress tracking'),
        t('buildingManagerLanding.whatWeDo.visibility.item3', 'Scheduled dates and crew assignments'),
        t('buildingManagerLanding.whatWeDo.visibility.item4', 'Work notice documentation'),
        t('buildingManagerLanding.whatWeDo.visibility.item5', 'Estimated completion updates'),
      ],
      icon: Eye
    },
    {
      title: t('buildingManagerLanding.whatWeDo.safety.title', 'Vendor Safety Verification'),
      description: t('buildingManagerLanding.whatWeDo.safety.description', 'Know your vendors are following safety protocols. View their company safety rating, insurance status, and compliance documentation.'),
      items: [
        t('buildingManagerLanding.whatWeDo.safety.item1', 'Company Safety Rating (CSR) visibility'),
        t('buildingManagerLanding.whatWeDo.safety.item2', 'Certificate of Insurance tracking'),
        t('buildingManagerLanding.whatWeDo.safety.item3', 'Technician certification verification'),
        t('buildingManagerLanding.whatWeDo.safety.item4', 'Historical safety record access'),
        t('buildingManagerLanding.whatWeDo.safety.item5', 'Incident report notifications'),
      ],
      icon: Shield
    },
    {
      title: t('buildingManagerLanding.whatWeDo.communication.title', 'Streamlined Communication'),
      description: t('buildingManagerLanding.whatWeDo.communication.description', 'Residents submit feedback directly. You see it immediately. The vendor responds. Everyone stays informed without phone tag.'),
      items: [
        t('buildingManagerLanding.whatWeDo.communication.item1', 'Resident feedback portal'),
        t('buildingManagerLanding.whatWeDo.communication.item2', 'Photo evidence attachments'),
        t('buildingManagerLanding.whatWeDo.communication.item3', 'Resolution status tracking'),
        t('buildingManagerLanding.whatWeDo.communication.item4', 'Building access instructions'),
        t('buildingManagerLanding.whatWeDo.communication.item5', 'Automated work notices'),
      ],
      icon: MessageSquare
    }
  ];

  const connectionExamples = [
    {
      title: t('buildingManagerLanding.connections.progress.title', 'Progress Updates'),
      description: t('buildingManagerLanding.connections.progress.description', 'Vendor completes a drop. Progress automatically updates. You see it on your dashboard. No phone call needed.')
    },
    {
      title: t('buildingManagerLanding.connections.feedback.title', 'Resident Feedback'),
      description: t('buildingManagerLanding.connections.feedback.description', 'Resident submits a concern. You and the vendor both see it. Resolution is tracked. The resident knows their voice was heard.')
    },
    {
      title: t('buildingManagerLanding.connections.documentation.title', 'Documentation Access'),
      description: t('buildingManagerLanding.connections.documentation.description', 'Anchor logs, inspection reports, certificates of insurance - all in one place. Download what you need. No email requests.')
    },
    {
      title: t('buildingManagerLanding.connections.history.title', 'Complete History'),
      description: t('buildingManagerLanding.connections.history.description', 'Every project on your building. Every vendor. Every completion date. Access your full maintenance history anytime.')
    }
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
    <div className="min-h-screen bg-background">
      <PublicHeader activeNav="building-manager" />

      <section 
        className="relative text-white pb-[120px]"
        style={{ backgroundImage: `linear-gradient(135deg, ${BUILDING_MANAGER_COLOR} 0%, ${BUILDING_MANAGER_GRADIENT_END} 100%)` }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1" data-testid="badge-building-manager">
              {t('buildingManagerLanding.hero.badge', 'For Building Managers & Strata')}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t('buildingManagerLanding.hero.title', 'Your Building. Your Visibility.')}<br />
              <span className="text-blue-100">{t('buildingManagerLanding.hero.titleHighlight', 'No More Chasing Contractors.')}</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('buildingManagerLanding.hero.subtitle', 'See exactly what\'s happening with rope access work on your building - without waiting for callbacks or status emails.')}<br />
              <strong>{t('buildingManagerLanding.hero.subtitleStrong', 'Real-time progress. Resident feedback. Complete documentation.')}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="bg-white hover:bg-blue-50"
                style={{ color: BUILDING_MANAGER_COLOR }}
                onClick={handleSignIn}
                data-testid="button-hero-sign-in"
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

            <div className="bg-white/10 rounded-lg p-4 max-w-2xl mx-auto mt-4">
              <p className="text-base text-white font-medium mb-2">
                {t('buildingManagerLanding.hero.freeAccount', 'Building Manager accounts are always free.')}
              </p>
              <p className="text-sm text-blue-100">
                {t('buildingManagerLanding.hero.autoAccountDetails', 'Your account is created automatically when a rope access company starts a project on your building. Your login is your strata/plan number (e.g., LMS1234). You\'ll receive your password from the vendor or can use your strata number as the initial password.')}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-[1px] left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-white dark:fill-slate-950"/>
          </svg>
        </div>
      </section>

      <section className="relative bg-white dark:bg-slate-950 -mt-px overflow-visible">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-6">
          <Card className="shadow-xl border-0 relative z-20 -mt-20">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-muted-foreground">
                <span className="font-medium text-sm uppercase tracking-wider">{t('buildingManagerLanding.replaces.label', 'Replaces')}</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{t('buildingManagerLanding.replaces.phone', 'Phone Tag')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{t('buildingManagerLanding.replaces.email', 'Email Chains')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{t('buildingManagerLanding.replaces.paper', 'Paper Forms')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Notebook className="w-4 h-4" />
                  <span className="text-sm">{t('buildingManagerLanding.replaces.notes', 'Scattered Notes')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="relative bg-white dark:bg-slate-950 overflow-visible">
        <div className="max-w-3xl mx-auto px-4 pb-12">
          <Card className="shadow-xl border-0 relative z-20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold" style={{ color: BUILDING_MANAGER_COLOR }}>4</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('buildingManagerLanding.stats.elevations', 'Elevations Tracked')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">60-70%</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('buildingManagerLanding.stats.calls', 'Fewer Status Calls')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600">24h</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('buildingManagerLanding.stats.resolution', 'Complaint Resolution')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-violet-600">100%</div>
                  <div className="text-sm text-muted-foreground mt-1">{t('buildingManagerLanding.stats.visibility', 'Project Visibility')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            {t('buildingManagerLanding.problem.title', 'You Shouldn\'t Have to Chase Contractors for Updates.')}
          </h2>
          
          <div className="prose prose-lg dark:prose-invert max-w-none text-center">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t('buildingManagerLanding.problem.p1', 'You\'re responsible for everything that happens in your building. When rope access work is scheduled, you need to know what\'s going on.')}
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t('buildingManagerLanding.problem.p2', 'But the contractor is on the ropes. Your phone calls go to voicemail. Emails pile up. Residents ask you for updates you don\'t have.')}
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t('buildingManagerLanding.problem.p3', 'You walk outside to check progress yourself. You call the office looking for a project manager. You wonder if they\'re on schedule, if residents have complained, if safety protocols are being followed.')}
            </p>
            
            <p className="text-xl font-semibold text-foreground mb-6">
              {t('buildingManagerLanding.problem.statement', 'This isn\'t how it should work.')}
            </p>
            
            <p className="text-xl font-bold mt-8" style={{ color: BUILDING_MANAGER_COLOR }}>
              {t('buildingManagerLanding.problem.solution', 'OnRopePro gives you complete visibility into every project on your building.')}
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('buildingManagerLanding.whatWeDo.title', 'Everything You Need to Stay Informed')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('buildingManagerLanding.whatWeDo.subtitle', 'The Building Manager Portal connects you directly to your vendor\'s project management system. See what they see.')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {whatWeDoCards.map((card, i) => (
              <Card key={i} className="bg-card" data-testid={`card-feature-${i}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${BUILDING_MANAGER_COLOR}20` }}>
                    <card.icon className="w-6 h-6" style={{ color: BUILDING_MANAGER_COLOR }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-base text-muted-foreground mb-4">{card.description}</p>
                  <ul className="space-y-2">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-base">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('buildingManagerLanding.connections.title', 'How Information Flows to You')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('buildingManagerLanding.connections.subtitle', 'When vendors use OnRopePro, you automatically get visibility into their work.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {connectionExamples.map((example, i) => (
              <Card key={i} className="bg-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">{example.title}</h3>
                  <p className="text-muted-foreground">{example.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950">
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

      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: BUILDING_MANAGER_COLOR }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('buildingManagerLanding.cta.title', 'Ready to See Your Building Projects?')}
          </h2>
          <p className="text-xl mb-8 text-white/80">
            {t('buildingManagerLanding.cta.subtitle', 'Sign in to your Building Manager Portal and get real-time visibility into all maintenance work.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white hover:bg-slate-100"
              style={{ color: BUILDING_MANAGER_COLOR }}
              onClick={handleSignIn}
              data-testid="button-cta-sign-in"
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
    </div>
  );
}
