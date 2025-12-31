import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  ArrowLeft, 
  Building2, 
  Shield, 
  FileText, 
  BarChart3,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
}

export default function ForPropertyManagers() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery<{ articles: HelpArticle[] }>({
    queryKey: ['/api/help/articles', { stakeholder: 'property-manager' }],
    queryFn: async () => {
      const res = await fetch('/api/help/articles?stakeholder=property-manager');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const articles = data?.articles || [];

  const keyFeatures = [
    {
      icon: Building2,
      title: t('helpCenter.stakeholders.propertyManager.features.portfolio', 'Portfolio Overview'),
      description: t('helpCenter.stakeholders.propertyManager.features.portfolioDesc', 'Manage multiple buildings from a single dashboard'),
    },
    {
      icon: Users,
      title: t('helpCenter.stakeholders.propertyManager.features.vendorMgmt', 'Vendor Management'),
      description: t('helpCenter.stakeholders.propertyManager.features.vendorMgmtDesc', 'View and compare all your rope access vendors'),
    },
    {
      icon: Shield,
      title: t('helpCenter.stakeholders.propertyManager.features.safetyRatings', 'Safety Ratings'),
      description: t('helpCenter.stakeholders.propertyManager.features.safetyRatingsDesc', 'Compare vendor safety compliance across your portfolio'),
    },
    {
      icon: FileText,
      title: t('helpCenter.stakeholders.propertyManager.features.documentation', 'Documentation'),
      description: t('helpCenter.stakeholders.propertyManager.features.documentationDesc', 'Access COIs, service history, and compliance documents'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader activeNav="property-manager" />
      <div className="relative text-white pb-[120px]" style={{backgroundImage: 'linear-gradient(135deg, #6E9075 0%, #5A7A60 100%)'}}>
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
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight" data-testid="text-stakeholder-title">
                {t('helpCenter.stakeholders.propertyManager.title', 'For Property Managers')}
              </h1>
              <p className="text-xl text-white/80">
                {t('helpCenter.stakeholders.propertyManager.description', 'Oversee your portfolio and vendor relationships')}
              </p>
            </div>
          </div>
          
          <div className="max-w-xl mt-6">
            <HelpSearchBar 
              size="large" 
              placeholder={t('helpCenter.stakeholders.propertyManager.searchPlaceholder', 'Ask about vendor management, portfolio oversight...')}
              stakeholderColor="#6E9075"
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
                  <div className="w-10 h-10 bg-[#6E9075]/10 dark:bg-[#6E9075]/20 rounded-lg flex items-center justify-center text-[#6E9075]">
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
              {articles.slice(0, 6).map((article) => (
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
        
        <section className="bg-[#6E9075]/10 dark:bg-[#6E9075]/20 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">{t('helpCenter.stakeholders.propertyManager.gettingStarted.title', 'Getting Started as a Property Manager')}</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#6E9075] text-white flex items-center justify-center text-sm shrink-0">1</div>
              <p>{t('helpCenter.stakeholders.propertyManager.gettingStarted.step1', 'Create your Property Manager account')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#6E9075] text-white flex items-center justify-center text-sm shrink-0">2</div>
              <p>{t('helpCenter.stakeholders.propertyManager.gettingStarted.step2', 'Add buildings to your portfolio')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#6E9075] text-white flex items-center justify-center text-sm shrink-0">3</div>
              <p>{t('helpCenter.stakeholders.propertyManager.gettingStarted.step3', 'Connect with building managers and vendors')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#6E9075] text-white flex items-center justify-center text-sm shrink-0">4</div>
              <p>{t('helpCenter.stakeholders.propertyManager.gettingStarted.step4', 'Monitor compliance across your properties')}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/help/getting-started">
              <Button className="bg-[#6E9075]">{t('helpCenter.stakeholders.propertyManager.gettingStarted.viewGuide', 'View Full Getting Started Guide')}</Button>
            </Link>
          </div>
        </section>
      </div>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}
