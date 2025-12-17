import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  ArrowLeft, 
  Shield, 
  MessageSquare, 
  Eye, 
  FileCheck,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HelpArticleCard from '@/components/help/HelpArticleCard';
import HelpChatWidget from '@/components/help/HelpChatWidget';

interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
}

export default function ForBuildingManagers() {
  const { data, isLoading } = useQuery<{ articles: HelpArticle[] }>({
    queryKey: ['/api/help/articles', { stakeholder: 'building-manager' }],
    queryFn: async () => {
      const res = await fetch('/api/help/articles?stakeholder=building-manager');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const articles = data?.articles || [];

  const keyFeatures = [
    {
      icon: Shield,
      title: 'Company Safety Rating',
      description: 'View vendor safety ratings and compliance history',
    },
    {
      icon: MessageSquare,
      title: 'Resident Communication',
      description: 'Manage resident complaints and work notifications',
    },
    {
      icon: Eye,
      title: 'Work Progress',
      description: 'Monitor project progress and completion status',
    },
    {
      icon: FileCheck,
      title: 'Documentation',
      description: 'Access anchor logs, inspection reports, and COIs',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-violet-600 to-violet-800 text-white">
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
                For Building Managers
              </h1>
              <p className="text-violet-100">
                Monitor work, compliance, and communicate with residents
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
                  <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center text-violet-600 dark:text-violet-400">
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
        
        <section className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Getting Started as a Building Manager</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm shrink-0">1</div>
              <p>Create your free Building Manager account</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm shrink-0">2</div>
              <p>Connect to your building using the unique building code</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm shrink-0">3</div>
              <p>View vendor safety ratings and work history</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm shrink-0">4</div>
              <p>Set up resident communication for upcoming work</p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/help/getting-started">
              <Button className="bg-violet-600">View Full Getting Started Guide</Button>
            </Link>
          </div>
        </section>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}
