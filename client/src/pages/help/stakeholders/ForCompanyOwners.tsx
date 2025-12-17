import { Link } from 'wouter';
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

interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  stakeholders: string[] | null;
}

export default function ForCompanyOwners() {
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
      title: 'Team Management',
      description: 'Manage your technicians, track certifications, and handle HR tasks',
    },
    {
      icon: DollarSign,
      title: 'Financial Controls',
      description: 'Generate quotes, track payroll, and monitor project costs',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Real-time dashboards showing productivity and profitability',
    },
    {
      icon: Shield,
      title: 'Safety Compliance',
      description: 'Automated safety tracking and documentation',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <Link href="/help">
              <Button variant="ghost" size="sm" className="text-white/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Help Center
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-stakeholder-title">
                For Company Owners
              </h1>
              <p className="text-blue-100">
                Manage your business, team, and grow efficiently
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Key Features for You</h2>
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
          <h2 className="text-2xl font-semibold mb-6">Recommended Modules</h2>
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
          <h2 className="text-xl font-semibold mb-4">Getting Started as an Owner</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0">1</div>
              <p>Set up your company profile with branding and contact information</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0">2</div>
              <p>Add your team members and set their roles and permissions</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0">3</div>
              <p>Create your first project and assign technicians</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0">4</div>
              <p>Configure safety documentation and compliance settings</p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/help/getting-started">
              <Button>View Full Getting Started Guide</Button>
            </Link>
          </div>
        </section>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}
