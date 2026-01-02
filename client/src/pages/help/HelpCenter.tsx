import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  Users, 
  Shield, 
  Briefcase,
  HardHat,
  DollarSign,
  MessageSquare,
  Palette,
  Calendar,
  FileText,
  ClipboardList,
  BarChart3,
  BookOpen,
  ArrowRight,
  Loader2,
  Home,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HelpSearchBar from '@/components/help/HelpSearchBar';
import HelpChatWidget from '@/components/help/HelpChatWidget';
import { PublicHeader } from '@/components/PublicHeader';
import { useLanguage } from '@/hooks/use-language';

interface Module {
  slug: string;
  title: string;
  category: string;
  stakeholders: string[];
}

const stakeholderCards = [
  {
    id: 'owner',
    title: 'For Company Owners',
    description: 'Manage your business, team, and grow efficiently',
    href: '/help/for-company-owners',
    icon: Building2,
    color: '#0B64A3',
  },
  {
    id: 'technician',
    title: 'For Technicians',
    description: 'Track your time, certifications, and career',
    href: '/help/for-technicians',
    icon: HardHat,
    color: '#5C7A84',
  },
  {
    id: 'building-manager',
    title: 'For Building Managers',
    description: 'Monitor work, compliance, and communicate with residents',
    href: '/help/for-building-managers',
    icon: Building2,
    color: '#B89685',
  },
  {
    id: 'property-manager',
    title: 'For Property Managers',
    description: 'Oversee your portfolio and vendor relationships',
    href: '/help/for-property-managers',
    icon: Users,
    color: '#6E9075',
  },
  {
    id: 'resident',
    title: 'For Residents',
    description: 'Submit feedback and track issues at your building',
    href: '/help/for-residents',
    icon: Home,
    color: '#86A59C',
  },
];

// Category configuration matching mega menu colors - returns translation keys
const getCategoryConfig = (t: (key: string, fallback: string) => string): Record<string, { icon: React.ReactNode; label: string; color: string }> => ({
  operations: { 
    icon: <Briefcase className="h-5 w-5" />, 
    label: t('helpCenter.categories.operations', 'Operations'), 
    color: 'text-blue-600' 
  },
  safety: { 
    icon: <Shield className="h-5 w-5" />, 
    label: t('helpCenter.categories.safety', 'Safety'), 
    color: 'text-red-600' 
  },
  hr: { 
    icon: <Users className="h-5 w-5" />, 
    label: t('helpCenter.categories.team', 'Team'), 
    color: 'text-violet-600' 
  },
  team: { 
    icon: <Users className="h-5 w-5" />, 
    label: t('helpCenter.categories.team', 'Team'), 
    color: 'text-violet-600' 
  },
  financial: { 
    icon: <DollarSign className="h-5 w-5" />, 
    label: t('helpCenter.categories.financial', 'Financial & Sales'), 
    color: 'text-emerald-600' 
  },
  communication: { 
    icon: <MessageSquare className="h-5 w-5" />, 
    label: t('helpCenter.categories.communication', 'Communication'), 
    color: 'text-rose-600' 
  },
  customization: { 
    icon: <Palette className="h-5 w-5" />, 
    label: t('helpCenter.categories.operations', 'Operations'), 
    color: 'text-blue-600' 
  },
});

const moduleIcons: Record<string, React.ReactNode> = {
  'project-management': <ClipboardList className="h-5 w-5" />,
  'time-tracking': <Calendar className="h-5 w-5" />,
  'safety-compliance': <Shield className="h-5 w-5" />,
  'irata-sprat-logging': <FileText className="h-5 w-5" />,
  'employee-management': <Users className="h-5 w-5" />,
  'document-management': <FileText className="h-5 w-5" />,
  'gear-inventory': <Briefcase className="h-5 w-5" />,
  'scheduling': <Calendar className="h-5 w-5" />,
  'payroll': <DollarSign className="h-5 w-5" />,
  'company-safety-rating': <Shield className="h-5 w-5" />,
  'job-board': <Users className="h-5 w-5" />,
  'quoting-sales': <DollarSign className="h-5 w-5" />,
  'resident-portal': <MessageSquare className="h-5 w-5" />,
  'property-manager-interface': <Building2 className="h-5 w-5" />,
  'white-label-branding': <Palette className="h-5 w-5" />,
  'analytics-reporting': <BarChart3 className="h-5 w-5" />,
  'personal-safety-rating': <HardHat className="h-5 w-5" />,
};

export default function HelpCenter() {
  const { t } = useLanguage();
  const { data: modulesData, isLoading } = useQuery<{ modules: Module[] }>({
    queryKey: ['/api/help/modules'],
  });

  const modules = modulesData?.modules || [];
  const categoryConfig = getCategoryConfig(t);
  
  // Translated stakeholder cards
  const translatedStakeholderCards = [
    {
      id: 'owner',
      title: t('helpCenter.stakeholders.owner.title', 'For Company Owners'),
      description: t('helpCenter.stakeholders.owner.description', 'Manage your business, team, and grow efficiently'),
      href: '/help/for-company-owners',
      icon: Building2,
      color: '#0B64A3',
    },
    {
      id: 'technician',
      title: t('helpCenter.stakeholders.technician.title', 'For Technicians'),
      description: t('helpCenter.stakeholders.technician.description', 'Track your time, certifications, and career'),
      href: '/help/for-technicians',
      icon: HardHat,
      color: '#5C7A84',
    },
    {
      id: 'building-manager',
      title: t('helpCenter.stakeholders.buildingManager.title', 'For Building Managers'),
      description: t('helpCenter.stakeholders.buildingManager.description', 'Monitor work, compliance, and communicate with residents'),
      href: '/help/for-building-managers',
      icon: Building2,
      color: '#B89685',
    },
    {
      id: 'property-manager',
      title: t('helpCenter.stakeholders.propertyManager.title', 'For Property Managers'),
      description: t('helpCenter.stakeholders.propertyManager.description', 'Oversee your portfolio and vendor relationships'),
      href: '/help/for-property-managers',
      icon: Users,
      color: '#6E9075',
    },
    {
      id: 'resident',
      title: t('helpCenter.stakeholders.resident.title', 'For Residents'),
      description: t('helpCenter.stakeholders.resident.description', 'Submit feedback and track issues at your building'),
      href: '/help/for-residents',
      icon: Home,
      color: '#86A59C',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTE4IDBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bS0xOCAxOGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptMTggMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptMC0xOGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="text-center space-y-6 pt-16">
            <h1 className="text-4xl font-bold tracking-tight" data-testid="text-help-title">
              {t('helpCenter.title', 'How can we help you?')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {t('helpCenter.subtitle', 'Search our knowledge base or browse by topic')}
            </p>
            <div className="max-w-xl mx-auto pt-4">
              <HelpSearchBar 
                size="large" 
                placeholder={t('helpCenter.searchPlaceholder', 'Ask a question or search for help with projects, safety, scheduling...')}
                autoFocus
                stakeholderColor="#0B64A3"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-[10px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" style={{ fill: 'hsl(var(--background))' }}/>
          </svg>
        </div>
      </div>
      <div className="bg-background relative z-0">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" data-testid="text-section-stakeholders">
            {t('helpCenter.roleSection', 'Find help for your role')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {translatedStakeholderCards.map((card) => (
              <Link key={card.id} href={card.href}>
                <Card 
                  className="h-full cursor-pointer transition-shadow hover:shadow-md"
                  data-testid={`card-stakeholder-${card.id}`}
                >
                  <CardHeader className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: card.color }}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                      <CardDescription className="mt-1">{card.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <h2 className="text-2xl font-semibold" data-testid="text-section-modules">
              {t('helpCenter.modulesSection', 'Browse by module')}
            </h2>
            <Link href="/help/getting-started">
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {t('helpCenter.gettingStarted', 'Getting Started Guide')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {modules.map((module) => (
                <Link key={module.slug} href={`/help/modules/${module.slug}`}>
                  <Card 
                    className="h-full cursor-pointer transition-shadow hover:shadow-md"
                    data-testid={`card-module-${module.slug}`}
                  >
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className={`w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0 ${categoryConfig[module.category]?.color || 'text-muted-foreground'}`}>
                        {moduleIcons[module.slug] || categoryConfig[module.category]?.icon || <FileText className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base truncate">{module.title}</CardTitle>
                        <CardDescription>{categoryConfig[module.category]?.label || module.category}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6" data-testid="text-section-popular">
            {t('helpCenter.popularTopics', 'Popular topics')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TopicCard 
              title={t('helpCenter.topics.createProject.title', 'How to create a project')}
              description={t('helpCenter.topics.createProject.description', 'Learn the basics of setting up your first project')}
              href="/help/modules/project-management"
            />
            <TopicCard 
              title={t('helpCenter.topics.timeTracking.title', 'Time tracking and GPS')}
              description={t('helpCenter.topics.timeTracking.description', 'Track billable hours and technician locations')}
              href="/help/modules/time-tracking"
            />
            <TopicCard 
              title={t('helpCenter.topics.safetyInspections.title', 'Safety inspections')}
              description={t('helpCenter.topics.safetyInspections.description', 'Complete harness inspections and safety documentation')}
              href="/help/modules/safety-compliance"
            />
            <TopicCard 
              title={t('helpCenter.topics.irataCertification.title', 'IRATA certification logging')}
              description={t('helpCenter.topics.irataCertification.description', 'Log work hours for certification progression')}
              href="/help/modules/irata-sprat-logging"
            />
            <TopicCard 
              title={t('helpCenter.topics.scheduling.title', 'Scheduling technicians')}
              description={t('helpCenter.topics.scheduling.description', 'Assign technicians to projects efficiently')}
              href="/help/modules/scheduling"
            />
            <TopicCard 
              title={t('helpCenter.topics.roiCalculator.title', 'ROI Calculator')}
              description={t('helpCenter.topics.roiCalculator.description', 'Calculate your potential savings with OnRopePro')}
              href="/help/tools/roi-calculator"
            />
            <TopicCard 
              title={t('helpCenter.topics.dashboardCustomization.title', 'Dashboard Customization')}
              description={t('helpCenter.topics.dashboardCustomization.description', 'Personalize your dashboard with widgets and layouts')}
              href="/help/modules/dashboard-customization"
            />
            <TopicCard 
              title={t('helpCenter.topics.installApp.title', 'How To Install the App')}
              description={t('helpCenter.topics.installApp.description', 'Add OnRopePro to your home screen for quick access')}
              href="/help/modules/install-app"
            />
          </div>
        </section>
        
        <section className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">{t('helpCenter.stillNeedHelp', 'Still need help?')}</h2>
          <p className="text-muted-foreground mb-4">
            {t('helpCenter.aiAssistantPrompt', 'Our AI assistant can answer your questions instantly')}
          </p>
          <Button 
            onClick={() => {
              const chatBtn = document.querySelector('[data-testid="button-help-chat-open"]') as HTMLButtonElement;
              chatBtn?.click();
            }}
            data-testid="button-open-chat-cta"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {t('helpCenter.chatWithAI', 'Chat with AI Assistant')}
          </Button>
        </section>
      </div>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}

function TopicCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href}>
      <Card 
        className="h-full cursor-pointer transition-shadow hover:shadow-md"
        data-testid={`card-topic-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
