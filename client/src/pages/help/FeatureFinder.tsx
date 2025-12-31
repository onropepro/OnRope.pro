import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { 
  Search, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import HelpNav from '@/components/help/HelpNav';
import HelpBreadcrumb from '@/components/help/HelpBreadcrumb';
import { useQuery } from '@tanstack/react-query';
import { PublicHeader } from '@/components/PublicHeader';

interface FoundFeature {
  slug: string;
  title: string;
  description: string;
  category: string;
  relevance: 'high' | 'medium' | 'low';
}

const commonQuestions = [
  { question: 'How do I track my time on job sites?', tags: ['time-tracking', 'gps'] },
  { question: 'How do I create a quote for a client?', tags: ['quoting', 'sales'] },
  { question: 'How do I log harness inspections?', tags: ['safety', 'compliance'] },
  { question: 'How do I schedule employees for projects?', tags: ['scheduling', 'calendar'] },
  { question: 'How do I track IRATA hours?', tags: ['irata', 'certification'] },
  { question: 'How do I manage my gear inventory?', tags: ['gear', 'equipment'] },
];

export default function FeatureFinder() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<FoundFeature[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: modulesData } = useQuery<{ modules: Array<{ slug: string; title: string; category: string; description?: string }> }>({
    queryKey: ['/api/help/modules'],
  });

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setSearchQuery(searchTerm);
    setHasSearched(true);
    
    try {
      const response = await fetch(`/api/help/search?q=${encodeURIComponent(searchTerm)}`, { 
        credentials: 'include' 
      });
      const data = await response.json() as { results: Array<{ slug: string; title: string; description: string; category: string }> };
      
      const features: FoundFeature[] = (data.results || []).map((article: { slug: string; title: string; description: string; category: string }, index: number) => ({
        slug: article.slug,
        title: article.title,
        description: article.description || 'Learn more about this feature',
        category: article.category,
        relevance: index < 2 ? 'high' : index < 4 ? 'medium' : 'low' as const,
      }));
      
      setResults(features);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleQuickQuestion = (question: string) => {
    setQuery(question);
    handleSearch(question);
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <HelpNav currentSection="module" showBackButton backHref="/help" backLabel="Help Center" />
      
      <div className="container mx-auto px-4 py-8">
        <HelpBreadcrumb 
          items={[
            { label: 'Tools' },
            { label: 'Feature Finder' },
          ]} 
        />
        
        <div className="max-w-3xl mx-auto mt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4" data-testid="text-feature-finder-title">
              Feature Finder
            </h1>
            <p className="text-muted-foreground text-lg">
              Describe what you're trying to do, and we'll find the right features for you
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={t('featureFinder.searchPlaceholder', 'e.g., I need to track employee time with GPS...')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                  data-testid="input-feature-search"
                />
                <Button 
                  type="submit" 
                  disabled={isSearching || !query.trim()}
                  data-testid="button-feature-search"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="ml-2">Find Features</span>
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {!hasSearched && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Common Questions</h2>
              <div className="grid gap-3">
                {commonQuestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(item.question)}
                    className="text-left p-4 rounded-lg border hover-elevate transition-colors flex items-center justify-between gap-3"
                    data-testid={`button-quick-question-${index}`}
                  >
                    <span>{item.question}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </section>
          )}
          
          {hasSearched && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold">
                  {results.length > 0 ? 'Recommended Features' : 'Results'}
                </h2>
                {results.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {results.length} found
                  </Badge>
                )}
              </div>
              
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : results.length > 0 ? (
                <div className="grid gap-4">
                  {results.map((feature) => (
                    <Link key={feature.slug} href={`/help/modules/${feature.slug}`}>
                      <Card 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        data-testid={`card-feature-${feature.slug}`}
                      >
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">{feature.title}</CardTitle>
                              {feature.relevance === 'high' && (
                                <Badge className="bg-green-500 text-xs">Best Match</Badge>
                              )}
                            </div>
                            <CardDescription>{feature.description}</CardDescription>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No features found matching "{searchQuery}"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try rephrasing your question or{' '}
                      <Link href="/help" className="text-primary hover:underline">
                        browse all features
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {results.length > 0 && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Still not sure?</p>
                    <p className="text-sm text-muted-foreground">
                      Use our AI chat assistant for personalized guidance. Click the chat button in the corner.
                    </p>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
