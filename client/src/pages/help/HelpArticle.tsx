import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft, Calendar, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import HelpBreadcrumb from '@/components/help/HelpBreadcrumb';
import HelpChatWidget from '@/components/help/HelpChatWidget';

interface HelpArticle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  sourceFile: string;
  content: string;
  stakeholders: string[] | null;
  isPublished: boolean;
  indexedAt: string;
  updatedAt: string;
}

const categoryLabels: Record<string, string> = {
  operations: 'Operations',
  safety: 'Safety & Compliance',
  hr: 'HR & Team',
  financial: 'Financial',
  communication: 'Communication',
  customization: 'Customization',
};

const stakeholderLabels: Record<string, string> = {
  owner: 'Company Owners',
  technician: 'Technicians',
  'building-manager': 'Building Managers',
  'property-manager': 'Property Managers',
  operations_manager: 'Operations Managers',
  supervisor: 'Supervisors',
};

export default function HelpArticle() {
  const [, params] = useRoute('/help/modules/:slug');
  const slug = params?.slug || '';

  const { data, isLoading, error } = useQuery<{ article: HelpArticle }>({
    queryKey: ['/api/help/articles', slug],
    queryFn: async () => {
      const res = await fetch(`/api/help/articles/${slug}`);
      if (!res.ok) throw new Error('Article not found');
      return res.json();
    },
    enabled: !!slug,
  });

  const article = data?.article;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or hasn't been indexed yet.
          </p>
          <Link href="/help">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help Center
            </Button>
          </Link>
        </div>
        <HelpChatWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Link href="/help">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Help Center
              </Button>
            </Link>
            <HelpBreadcrumb items={[
              { label: categoryLabels[article.category] || article.category, href: `/help?category=${article.category}` },
              { label: article.title },
            ]} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Badge variant="secondary">
                {categoryLabels[article.category] || article.category}
              </Badge>
              {article.stakeholders?.map(stakeholder => (
                <Badge key={stakeholder} variant="outline">
                  {stakeholderLabels[stakeholder] || stakeholder}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl font-bold mb-4" data-testid="text-article-title">
              {article.title}
            </h1>
            
            {article.description && (
              <p className="text-lg text-muted-foreground mb-4">
                {article.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Updated {new Date(article.updatedAt).toLocaleDateString()}
              </span>
              {article.stakeholders && article.stakeholders.length > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  For {article.stakeholders.length} role{article.stakeholders.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90">
                {article.content.split('\n\n').map((block, index) => {
                  const trimmedBlock = block.trim();
                  
                  // Render h2 headings
                  if (trimmedBlock.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-semibold mt-8 mb-4 first:mt-0 border-b pb-2">
                        {trimmedBlock.slice(3)}
                      </h2>
                    );
                  }
                  
                  // Render h3 headings
                  if (trimmedBlock.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-medium mt-6 mb-3">
                        {trimmedBlock.slice(4)}
                      </h3>
                    );
                  }
                  
                  // Render horizontal rules
                  if (trimmedBlock === '---') {
                    return <hr key={index} className="my-6 border-border" />;
                  }
                  
                  // Render list items
                  if (trimmedBlock.startsWith('- ')) {
                    const items = trimmedBlock.split('\n').filter(line => line.startsWith('- '));
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 my-4">
                        {items.map((item, i) => {
                          const content = item.slice(2);
                          // Handle bold text in list items
                          const parts = content.split(/(\*\*[^*]+\*\*)/g);
                          return (
                            <li key={i} className="text-base">
                              {parts.map((part, j) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={j}>{part.slice(2, -2)}</strong>;
                                }
                                return <span key={j}>{part}</span>;
                              })}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }
                  
                  // Render paragraphs with bold text support
                  const parts = trimmedBlock.split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <p key={index} className="mb-4 text-base leading-relaxed">
                      {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Need more help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have questions about {article.title.toLowerCase()}, our AI assistant can help.
            </p>
            <Button 
              onClick={() => {
                const chatBtn = document.querySelector('[data-testid="button-help-chat-open"]') as HTMLButtonElement;
                chatBtn?.click();
              }}
            >
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </div>
      
      <HelpChatWidget />
    </div>
  );
}
