import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  ArrowLeft, 
  Users, 
  DollarSign, 
  BarChart3, 
  Shield,
  Calendar,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import HelpBreadcrumb from '@/components/help/HelpBreadcrumb';
import HelpArticleCard from '@/components/help/HelpArticleCard';
import HelpChatWidget from '@/components/help/HelpChatWidget';
import HelpSearchBar from '@/components/help/HelpSearchBar';
import { PublicHeader } from '@/components/PublicHeader';

interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  stakeholders: string[] | null;
}

export default function ForCompanyOwners() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery<{ articles: HelpArticle[] }>({
    queryKey: ['/api/help/articles', { stakeholder: 'owner' }],
    queryFn: async () => {
      const res = await fetch('/api/help/articles?stakeholder=owner');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const articles = data?.articles || [];

  const keyFeatures = [
    {
      icon: Users,
      title: t('helpCenter.stakeholders.owner.features.teamMgmt', 'Team Management'),
      description: t('helpCenter.stakeholders.owner.features.teamMgmtDesc', 'Manage your technicians, track certifications, and handle HR tasks'),
    },
    {
      icon: DollarSign,
      title: t('helpCenter.stakeholders.owner.features.financial', 'Financial Controls'),
      description: t('helpCenter.stakeholders.owner.features.financialDesc', 'Generate quotes, track payroll, and monitor project costs'),
    },
    {
      icon: BarChart3,
      title: t('helpCenter.stakeholders.owner.features.analytics', 'Analytics & Insights'),
      description: t('helpCenter.stakeholders.owner.features.analyticsDesc', 'Real-time dashboards showing productivity and profitability'),
    },
    {
      icon: Shield,
      title: t('helpCenter.stakeholders.owner.features.safety', 'Safety Compliance'),
      description: t('helpCenter.stakeholders.owner.features.safetyDesc', 'Automated safety tracking and documentation'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader activeNav="employer" />
      <div className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #0B64A3 0%, #0369A1 100%)'}}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMThjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTE4IDBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bS0xOCAxOGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptMTggMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHptMC0xOGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-4 md:py-12">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <Link href="/help">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('helpCenter.backToHelpCenter', 'Help Center')}
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight" data-testid="text-stakeholder-title">
                {t('helpCenter.stakeholders.owner.title', 'For Company Owners')}
              </h1>
              <p className="text-xl text-blue-100">
                {t('helpCenter.stakeholders.owner.description', 'Manage your business, team, and grow efficiently')}
              </p>
            </div>
          </div>
          
          <div className="max-w-xl mt-6">
            <HelpSearchBar 
              size="large" 
              placeholder={t('helpCenter.stakeholders.owner.searchPlaceholder', 'Ask about team management, financials, analytics...')}
              stakeholderColor="#0B64A3"
            />
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
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t('helpCenter.keyFeaturesTitle', 'Key Features for You')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-col gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="mt-1">{feature.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t('helpCenter.recommendedModules', 'Recommended Modules')}</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.slice(0, 9).map((article) => (
                <HelpArticleCard
                  key={article.slug}
                  slug={article.slug}
                  title={article.title}
                  description={article.description}
                  category={article.category}
                />
              ))}
            </div>
          )}
        </section>
        
        <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">{t('helpCenter.stakeholders.owner.gettingStarted.title', 'Getting Started as a Company Owner')}</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0">1</div>
              <p>{t('helpCenter.stakeholders.owner.gettingStarted.step1', 'Set up your company profile and branding')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0">2</div>
              <p>{t('helpCenter.stakeholders.owner.gettingStarted.step2', 'Add your team members and assign roles')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0">3</div>
              <p>{t('helpCenter.stakeholders.owner.gettingStarted.step3', 'Configure safety and compliance settings')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0">4</div>
              <p>{t('helpCenter.stakeholders.owner.gettingStarted.step4', 'Create your first project and start tracking')}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/help/getting-started">
              <Button>{t('helpCenter.stakeholders.owner.gettingStarted.viewGuide', 'View Full Getting Started Guide')}</Button>
            </Link>
          </div>
        </section>
      </div>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}
